// =====================================================================
//  CILIK RACING — kemajuan disimpan dalam kunci storan SENDIRI
//  ('dc-racing-v1'), berasingan daripada data 15 permainan asal.
//  Disimpan dalam localStorage dan disalin ke IndexedDB sebagai sandaran.
// =====================================================================
import { RC_WORLDS, CARS, PAINTS, STICKERS_RC, RIMS, MEDALS } from './data.js';
import { LEVELS_PER_WORLD } from './levels.js';

const KEY = 'dc-racing-v1';
let all = null;

function load() {
  try { all = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { all = {}; }
  if (typeof all !== 'object' || Array.isArray(all)) all = {};
}
// sandaran IndexedDB (jika localStorage dibersihkan)
function idb(mode, fn) {
  try {
    if (typeof indexedDB === 'undefined') return;
    const rq = indexedDB.open('dc-racing', 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore('kv');
    rq.onsuccess = () => { try { const tx = rq.result.transaction('kv', mode); fn(tx.objectStore('kv')); tx.oncomplete = () => rq.result.close(); } catch { /* */ } };
  } catch { /* tiada IndexedDB */ }
}
export function restoreBackup() {
  return new Promise((res) => {
    if (!all) load();
    if (Object.keys(all).length) return res(false);
    let done = false;
    const fin = (v) => { if (!done) { done = true; res(v); } };
    idb('readonly', (st) => { const g = st.get(KEY); g.onsuccess = () => { if (g.result && typeof g.result === 'object') { all = g.result; try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* */ } fin(true); } else fin(false); }; g.onerror = () => fin(false); });
    setTimeout(() => fin(false), 600);
  });
}

export function rprof(pid) {
  if (!all) load();
  const k = String(pid || 'tetamu');
  if (!all[k]) all[k] = { v: 1, done: {}, car: 'tomato', custom: {}, seenCars: ['tomato'], assist: false, music: true };
  const r = all[k];
  r.done ||= {}; r.custom ||= {}; r.seenCars ||= ['tomato'];
  return r;
}
export function rsave() {
  if (!all) return;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storan penuh */ }
  const snap = JSON.parse(JSON.stringify(all));
  idb('readwrite', (st) => st.put(snap, KEY));
}

export const levelStars = (rp, wid, n) => rp.done[wid]?.[n] || 0;
export const worldDone = (rp, wid) => Object.keys(rp.done[wid] || {}).length;
export const totalStars = (rp) => Object.values(rp.done).reduce((s, w) => s + Object.values(w).reduce((a, b) => a + b, 0), 0);
export const championCount = (rp) => RC_WORLDS.filter((w) => levelStars(rp, w.id, 50) > 0).length;
export function medalList(rp) {
  const out = [];
  RC_WORLDS.forEach((w) => { const d = worldDone(rp, w.id); MEDALS.forEach((m) => { if (d >= m.at) out.push({ world: w, medal: m }); }); });
  return out;
}
export const medalCount = (rp) => medalList(rp).length;
export function worldUnlocked(rp, wi) { return wi === 0 || worldDone(rp, RC_WORLDS[wi - 1].id) >= 10; }
export const worldsOpen = (rp) => RC_WORLDS.filter((_, i) => worldUnlocked(rp, i)).length;
export function levelUnlocked(rp, wi, n) {
  if (!worldUnlocked(rp, wi)) return false;
  return n === 1 || levelStars(rp, RC_WORLDS[wi].id, n - 1) > 0;
}
export function carUnlocked(rp, car) {
  if (car.need.champion) return championCount(rp) >= car.need.champion;
  return totalStars(rp) >= (car.need.stars || 0);
}
export const paintUnlocked = (rp, p) => totalStars(rp) >= p.need;
export const stickerUnlocked = (rp, s) => medalCount(rp) >= s.need;
export const rimUnlocked = (rp, r) => worldsOpen(rp) >= r.need;
export function customOf(rp, carId) { return rp.custom[carId] || {}; }

// level seterusnya untuk butang "Teruskan"
export function nextLevel(rp) {
  for (let wi = RC_WORLDS.length - 1; wi >= 0; wi--) {
    if (!worldUnlocked(rp, wi)) continue;
    const w = RC_WORLDS[wi];
    for (let n = 1; n <= LEVELS_PER_WORLD; n++) if (!levelStars(rp, w.id, n)) return { wi, n };
  }
  return { wi: 0, n: 1 };
}

// rekod keputusan & kira ganjaran baharu
export function recordRace(rp, level, stars) {
  const wid = level.world;
  const beforeStars = totalStars(rp), beforeMedals = medalCount(rp), beforeWorlds = worldsOpen(rp);
  const beforeCars = CARS.filter((c) => carUnlocked(rp, c)).map((c) => c.id);
  const prev = levelStars(rp, wid, level.n);
  (rp.done[wid] ||= {})[level.n] = Math.max(prev, stars);
  const newCars = CARS.filter((c) => carUnlocked(rp, c) && !beforeCars.includes(c.id));
  const res = {
    first: !prev, best: stars > prev, total: totalStars(rp), gained: totalStars(rp) - beforeStars,
    newCars,
    newPaints: PAINTS.filter((p) => p.need > beforeStars && p.need <= totalStars(rp)),
    newMedals: medalList(rp).slice(beforeMedals),
    newStickers: STICKERS_RC.filter((s) => s.need > beforeMedals && s.need <= medalCount(rp)),
    newRims: RIMS.filter((r) => r.need > beforeWorlds && r.need <= worldsOpen(rp)),
    newWorld: worldsOpen(rp) > beforeWorlds ? RC_WORLDS[worldsOpen(rp) - 1] : null,
    champion: level.n === 50 && !prev,
  };
  rsave();
  return res;
}
