// =====================================================================
//  CADANGAN BERCAHAYA — memilih 3 permainan berdasarkan rekod anak:
//   1. "Teruskan!"      permainan terakhir dimainkan (masih ada level)
//   2. "Jom latih!"     kemahiran paling lemah (ketepatan cubaan pertama rendah)
//   3. "Baru untuk kamu" permainan belum pernah dicuba, ikut kesesuaian umur
//  Diisi dengan permainan yang paling jarang dimainkan supaya pembelajaran seimbang.
// =====================================================================
import { levelsDone, mastery } from './store.js';
import { MODES } from './modes/index.js';

// skill -> permainan
const SKILL_MODE = { abc: 'abc', bayang: 'bayang', bentuk: 'warna', bunyi: 'bunyi', corak: 'minda', haiwan: 'haiwan', harian: 'harian', ingat: 'ingatan', kelas: 'kelas', minda: 'minda', misi: 'misi', nombor: 'nombor', puzzle: 'puzzle', seni: 'seni', soleh: 'soleh', warna: 'warna' };
// susunan kesesuaian umur (mudah -> mencabar)
const ORDER_KECIL = ['warna', 'bunyi', 'haiwan', 'abc', 'nombor', 'ingatan', 'bayang', 'puzzle', 'seni', 'soleh', 'wuduk', 'akhlak', 'kedai', 'harian', 'makmal', 'maze', 'misi', 'pemburu', 'minda', 'kelas', 'lumba', 'lompat', 'silang', 'robot', 'bina', 'guling', 'imbang'];
const ORDER_BESAR = ['abc', 'nombor', 'kelas', 'kedai', 'makmal', 'robot', 'silang', 'minda', 'misi', 'soleh', 'wuduk', 'akhlak', 'maze', 'pemburu', 'harian', 'puzzle', 'ingatan', 'bayang', 'haiwan', 'warna', 'bunyi', 'seni', 'lumba', 'lompat', 'bina', 'guling', 'imbang'];

export const REASONS = {
  teruskan: { t: 'Teruskan!', e: '▶️' },
  latih: { t: 'Jom latih!', e: '💪' },
  baru: { t: 'Baru untuk kamu', e: '✨' },
  seimbang: { t: 'Cuba ini!', e: '🌟' },
};

export function markPlayed(p, id) {
  if (!p || !id) return;
  const pl = p.played || (p.played = {});
  const r = pl[id] || (pl[id] = { n: 0, last: 0 });
  r.n++; r.last = Date.now();
}

// ids: senarai permainan yang dibenarkan (tidak dikunci)
export function recommend(p, ids, k = 3) {
  if (!p) return [];
  const ok = new Set(ids);
  const played = p.played || {};
  const plays = (id) => (played[id]?.n || 0) + (MODES[id] ? levelsDone(p, id) : 0);
  const out = [];
  const add = (id, why) => { if (id && ok.has(id) && !out.some((x) => x.id === id) && out.length < k) out.push({ id, why }); };
  // 1. teruskan: terakhir dimainkan dalam 14 hari, belum tamat semua level
  const recent = Object.entries(played).filter(([id, r]) => ok.has(id) && Date.now() - r.last < 14 * 864e5 && !(MODES[id] && levelsDone(p, id) >= 50)).sort((a, b) => b[1].last - a[1].last)[0];
  if (recent) add(recent[0], 'teruskan');
  // 2. latih: kemahiran dengan penguasaan terendah (sekurang-kurangnya 3 pusingan)
  const weak = Object.entries(p.skills || {}).filter(([, s]) => s.rounds >= 3 && mastery(s) <= 1).map(([sk, s]) => ({ sk, acc: s.firstTry / s.rounds })).sort((a, b) => a.acc - b.acc);
  for (const w of weak) { const id = SKILL_MODE[w.sk.split('.')[0]]; if (id && !out.some((x) => x.id === id)) { add(id, 'latih'); break; } }
  // 3. baru: belum pernah dimainkan, ikut umur
  const order = (p.age || 4) <= 4 ? ORDER_KECIL : ORDER_BESAR;
  const fresh = order.find((id) => ok.has(id) && !plays(id) && !out.some((x) => x.id === id));
  add(fresh, 'baru');
  // isi: paling jarang dimainkan (ikut susunan umur)
  [...order].filter((id) => ok.has(id)).sort((a, b) => plays(a) - plays(b) || order.indexOf(a) - order.indexOf(b)).forEach((id) => add(id, plays(id) ? 'seimbang' : 'baru'));
  return out;
}
