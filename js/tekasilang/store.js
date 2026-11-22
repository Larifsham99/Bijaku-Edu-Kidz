// =====================================================================
//  TEKA SILANG CILIK — kemajuan dalam kunci storan SENDIRI ('dc-silang-v1')
//  berasingan daripada data permainan lain; sandaran IndexedDB.
// =====================================================================
import { CHAPTERS, LEVELS_PER_CHAPTER } from './data.js';

const KEY = 'dc-silang-v1';
let all = null;
function load() {
  try { all = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { all = {}; }
  if (typeof all !== 'object' || Array.isArray(all)) all = {};
}
function idb(mode, fn) {
  try {
    if (typeof indexedDB === 'undefined') return;
    const rq = indexedDB.open('dc-silang', 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore('kv');
    rq.onsuccess = () => { try { const tx = rq.result.transaction('kv', mode); fn(tx.objectStore('kv')); tx.oncomplete = () => rq.result.close(); } catch { /* */ } };
  } catch { /* */ }
}
export function restoreBackup() {
  return new Promise((res) => {
    if (!all) load();
    if (Object.keys(all).length) return res(false);
    let done = false; const fin = (v) => { if (!done) { done = true; res(v); } };
    idb('readonly', (st) => { const g = st.get(KEY); g.onsuccess = () => { if (g.result && typeof g.result === 'object') { all = g.result; try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* */ } fin(true); } else fin(false); }; g.onerror = () => fin(false); });
    setTimeout(() => fin(false), 600);
  });
}
export function tprof(pid) {
  if (!all) load();
  const k = String(pid || 'tetamu');
  all[k] ||= { v: 1, done: {}, seen: [] };
  all[k].done ||= {}; all[k].seen ||= [];
  return all[k];
}
export function tsave() {
  if (!all) return;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* */ }
  const snap = JSON.parse(JSON.stringify(all));
  idb('readwrite', (st) => st.put(snap, KEY));
}
export function resetSilang(pid) { if (!all) load(); delete all[String(pid)]; tsave(); }

export const stars = (tp, cid, n) => tp.done[cid]?.[n] || 0;
export const chapterDone = (tp, cid) => Object.keys(tp.done[cid] || {}).length;
export const totalStars = (tp) => Object.values(tp.done).reduce((s, c) => s + Object.values(c).reduce((a, b) => a + b, 0), 0);
export const medalOf = (tp, cid) => stars(tp, cid, LEVELS_PER_CHAPTER) > 0;
export const medals = (tp) => CHAPTERS.filter((c) => medalOf(tp, c.id)).length;
// chapter seterusnya dibuka selepas 10 level chapter sebelumnya
export const chapterOpen = (tp, ci) => ci === 0 || chapterDone(tp, CHAPTERS[ci - 1].id) >= 10;
export const levelOpen = (tp, ci, n) => chapterOpen(tp, ci) && (n === 1 || stars(tp, CHAPTERS[ci].id, n - 1) > 0);
export function nextLevel(tp) {
  for (let ci = CHAPTERS.length - 1; ci >= 0; ci--) {
    if (!chapterOpen(tp, ci)) continue;
    for (let n = 1; n <= LEVELS_PER_CHAPTER; n++) if (!stars(tp, CHAPTERS[ci].id, n)) return { ci, n };
  }
  return { ci: 0, n: 1 };
}
export function record(tp, level, st) {
  const before = CHAPTERS.map((_, i) => chapterOpen(tp, i));
  const prev = stars(tp, level.chapter, level.n);
  (tp.done[level.chapter] ||= {})[level.n] = Math.max(prev, st);
  const opened = CHAPTERS.findIndex((_, i) => !before[i] && chapterOpen(tp, i));
  tsave();
  return { first: !prev, medal: level.n === LEVELS_PER_CHAPTER && !prev, openedChapter: opened >= 0 ? opened : null };
}
