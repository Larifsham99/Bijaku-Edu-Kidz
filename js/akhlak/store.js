// =====================================================================
//  TAMAN AKHLAK — kemajuan dalam kunci sendiri ('dc-akhlak-v1')
// =====================================================================
import { STORIES, CATS, MILESTONES } from './data.js';

const KEY = 'dc-akhlak-v1';
let all = null;
function load() { try { all = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { all = {}; } if (typeof all !== 'object' || Array.isArray(all)) all = {}; }
function idb(mode, fn) {
  try {
    if (typeof indexedDB === 'undefined') return;
    const rq = indexedDB.open('dc-akhlak', 1);
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
export function aprof(pid) {
  if (!all) load();
  const k = String(pid || 'tetamu');
  all[k] ||= { v: 1, stories: {}, plants: [], deeds: {}, deedsTotal: 0 };
  const a = all[k]; a.stories ||= {}; a.plants ||= []; a.deeds ||= {}; a.deedsTotal ||= 0;
  return a;
}
export function asave() {
  if (!all) return;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* */ }
  const snap = JSON.parse(JSON.stringify(all));
  idb('readwrite', (st) => st.put(snap, KEY));
}
export function resetAkhlak(pid) { if (!all) load(); delete all[String(pid)]; asave(); }

export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const storyDone = (a, id) => !!a.stories[id];
export const storiesDone = (a) => Object.keys(a.stories).length;
// sentiasa 3 kisah baharu terbuka di hadapan (tiada tekanan)
export const storyOpen = (a, i) => i < storiesDone(a) + 3 || storyDone(a, STORIES[i].id);

// tanam bunga apabila kisah selesai buat kali pertama
export function completeStory(a, story) {
  const first = !a.stories[story.id];
  const before = a.plants.length;
  if (first) { a.stories[story.id] = todayKey(); a.plants.push({ type: CATS[story.cat].plant, from: story.id }); }
  asave();
  return { first, milestone: MILESTONES.find((m) => before < m.at && a.plants.length >= m.at) || null, index: a.plants.length - 1 };
}
export const deedsToday = (a) => a.deeds[todayKey()] || [];
export function addDeed(a, deed) {
  const k = todayKey();
  a.deeds[k] ||= [];
  if (a.deeds[k].includes(deed.id)) return false;
  a.deeds[k].push(deed.id);
  a.deedsTotal += 1;
  asave();
  return true;
}
