// =====================================================================
//  PERMAINAN BAHARU BIJAKU (Fasa 2+) — kemajuan dalam kunci sendiri ('dc-games-v1')
//  { [profilId]: { [gameId]: { stars: { [level]: 1..3 } } } } + sandaran IndexedDB
// =====================================================================
const KEY = 'dc-games-v1';
let all = null;
function load() { try { all = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { all = {}; } if (typeof all !== 'object' || Array.isArray(all)) all = {}; }
function idb(mode, fn) {
  try {
    if (typeof indexedDB === 'undefined') return;
    const rq = indexedDB.open('dc-games', 1);
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
export function gprof(pid, gid) {
  if (!all) load();
  const k = String(pid || 'tetamu');
  all[k] ||= {};
  all[k][gid] ||= { stars: {} };
  all[k][gid].stars ||= {};
  return all[k][gid];
}
export function gsave() {
  if (!all) return;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* */ }
  const snap = JSON.parse(JSON.stringify(all));
  idb('readwrite', (st) => st.put(snap, KEY));
}
// set semula semua permainan baharu bagi satu profil (Ruang Ibu Bapa)
export function resetGames(pid) { if (!all) load(); delete all[String(pid)]; gsave(); }
export const levelsDone = (g) => Object.keys(g.stars).length;
export const totalStars = (g) => Object.values(g.stars).reduce((a, b) => a + b, 0);
export const levelOpen = (g, n) => n === 1 || !!g.stars[n] || !!g.stars[n - 1];
export function record(g, n, st) {
  const prev = g.stars[n] || 0;
  g.stars[n] = Math.max(prev, st);
  gsave();
  return { first: !prev, better: st > prev };
}
