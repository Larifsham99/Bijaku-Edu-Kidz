// =====================================================================
//  TEKA SILANG CILIK — 15 chapter × 30 level = 450 level (berbiji, tetap)
//  Mod: A gambar→perkataan, B huruf hilang, C huruf terapung, D silang mini,
//       E silang bergambar, F padan perkataan, G bayang, H campuran,
//       I cari huruf, J lengkapkan papan
// =====================================================================
import { makeRng } from '../rng.js';
import { CHAPTERS, LEVELS_PER_CHAPTER } from './data.js';

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#b197fc', '#ff922b'];
export const MODE_NAMES = { A: 'Gambar ke perkataan', B: 'Huruf hilang', C: 'Huruf terapung', D: 'Silang mini', E: 'Silang bergambar', F: 'Padan perkataan', G: 'Bayang perkataan', H: 'Campuran', I: 'Cari huruf', J: 'Lengkapkan papan' };
export const isPlate = (w) => w.art === 'plat' || w.art === 'nabi';

// ---------- teka silang kata ----------
export function makeCross(words, rng, max = 9) {
  const cells = new Map(); // "r,c" -> { ch, dirs:Set }
  const entries = [];
  const key = (r, c) => `${r},${c}`;
  const place = (w, r, c, dir) => {
    for (let i = 0; i < w.length; i++) {
      const rr = r + (dir === 'v' ? i : 0), cc = c + (dir === 'h' ? i : 0);
      const k = key(rr, cc);
      if (!cells.has(k)) cells.set(k, { ch: w[i], dirs: new Set() });
      cells.get(k).dirs.add(dir);
    }
  };
  const bounds = (extra = []) => {
    let r0 = 1e9, r1 = -1e9, c0 = 1e9, c1 = -1e9;
    for (const k of [...cells.keys(), ...extra]) { const [r, c] = k.split(',').map(Number); r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c); }
    return { r0, r1, c0, c1 };
  };
  const ok = (w, r, c, dir) => {
    const dr = dir === 'v' ? 1 : 0, dc = dir === 'h' ? 1 : 0;
    if (cells.has(key(r - dr, c - dc)) || cells.has(key(r + dr * w.length, c + dc * w.length))) return false;
    let cross = 0; const newK = [];
    for (let i = 0; i < w.length; i++) {
      const rr = r + dr * i, cc = c + dc * i, k = key(rr, cc);
      const cell = cells.get(k);
      if (cell) { if (cell.ch !== w[i] || cell.dirs.has(dir)) return false; cross++; }
      else {
        // jiran sisi mesti kosong (tiada perkataan selari bersentuhan)
        if (cells.has(key(rr + dc, cc + dr)) || cells.has(key(rr - dc, cc - dr))) return false;
        newK.push(k);
      }
    }
    if (!cross) return false;
    const b = bounds(newK);
    if (b.r1 - b.r0 + 1 > max || b.c1 - b.c0 + 1 > max) return false;
    return cross;
  };
  const [first, ...rest] = words;
  place(first.w, 0, 0, 'h'); entries.push({ ...first, r: 0, c: 0, dir: 'h' });
  for (const wd of rest) {
    const w = wd.w; const cands = [];
    for (const [k, cell] of cells) {
      const [r, c] = k.split(',').map(Number);
      for (let i = 0; i < w.length; i++) {
        if (w[i] !== cell.ch) continue;
        for (const dir of ['h', 'v']) {
          if (cell.dirs.has(dir)) continue;
          const sr = dir === 'v' ? r - i : r, sc = dir === 'h' ? c - i : c;
          const x = ok(w, sr, sc, dir);
          if (x) cands.push({ sr, sc, dir, x });
        }
      }
    }
    if (!cands.length) return null;
    const best = Math.max(...cands.map((q) => q.x));
    const pick = rng.pick(cands.filter((q) => q.x === best));
    place(w, pick.sr, pick.sc, pick.dir);
    entries.push({ ...wd, r: pick.sr, c: pick.sc, dir: pick.dir });
  }
  const b = bounds();
  entries.forEach((en) => { en.r -= b.r0; en.c -= b.c0; });
  return { w: b.c1 - b.c0 + 1, h: b.r1 - b.r0 + 1, entries };
}

// ---------- pembina pusingan ----------
function slotRound(mode, wd, rng, { blanks, extra }) {
  const n = wd.w.length;
  let missing = Math.max(1, Math.min(n, blanks));
  if (isPlate(wd)) missing = Math.min(missing, Math.max(1, Math.floor(n / 2))); // papan nama: sebahagian huruf sentiasa kelihatan
  const idx = rng.shuffle([...Array(n).keys()]).slice(0, missing).sort((a, b) => a - b);
  const given = [...Array(n).keys()].filter((i) => !idx.includes(i));
  const need = idx.map((i) => wd.w[i]);
  const dis = rng.shuffle(ABC.filter((ch) => !wd.w.includes(ch))).slice(0, extra);
  return { mode, word: wd.w, art: wd.art, cat: wd.cat, given, pool: rng.shuffle([...need, ...dis]) };
}
function findRound(wd, rng, tier) {
  const i = rng.int(0, wd.w.length - 1), ch = wd.w[i];
  const count = tier <= 2 ? 2 : 3;
  const others = rng.shuffle(ABC.filter((x) => x !== ch && !wd.w.includes(x))).slice(0, (tier <= 2 ? 6 : 9) - count);
  return { mode: 'I', word: wd.w, art: wd.art, cat: wd.cat, idx: i, target: ch, tiles: rng.shuffle([...Array(count).fill(ch), ...others]), count };
}
function shadowRound(wd, pool, rng) {
  const opts = rng.shuffle([wd.w, ...rng.shuffle(pool.filter((x) => x.w !== wd.w && x.w[0] !== wd.w[0])).slice(0, 2).map((x) => x.w)]);
  return { mode: 'G', word: wd.w, art: wd.art, cat: wd.cat, options: opts };
}
function matchRound(list, rng) {
  return { mode: 'F', items: list.map((x) => ({ word: x.w, art: x.art, cat: x.cat })), words: rng.shuffle(list.map((x) => x.w)), cat: list[0].cat };
}
function crossRound(mode, list, rng, { giveFirst, giveCross }) {
  const g = makeCross(list, rng, mode === 'J' ? 9 : 8);
  if (!g) return null;
  const given = new Set();
  const map = new Map();
  g.entries.forEach((en, ei) => {
    en.color = COLORS[ei % COLORS.length];
    for (let i = 0; i < en.w.length; i++) {
      const k = `${en.r + (en.dir === 'v' ? i : 0)},${en.c + (en.dir === 'h' ? i : 0)}`;
      map.set(k, (map.get(k) || 0) + 1);
      if (i === 0 && (giveFirst || isPlate(en))) given.add(k);
    }
  });
  if (giveCross) for (const [k, n] of map) if (n > 1) given.add(k);
  const letters = new Set();
  g.entries.forEach((en) => { for (let i = 0; i < en.w.length; i++) { const k = `${en.r + (en.dir === 'v' ? i : 0)},${en.c + (en.dir === 'h' ? i : 0)}`; if (!given.has(k)) letters.add(en.w[i]); } });
  const dis = rng.shuffle(ABC.filter((ch) => !letters.has(ch))).slice(0, 2);
  return { mode, w: g.w, h: g.h, entries: g.entries.map(({ w, art, cat, r, c, dir, color }) => ({ word: w, art, cat, r, c, dir, color })), given: [...given], pool: rng.shuffle([...letters, ...dis]), cat: g.entries[0].cat };
}

// ---------- level ----------
// Setiap chapter dibina berurutan: perkataan yang paling jarang digunakan
// diutamakan, dan perkataan level sebelumnya tidak diulang terus.
const cache = new Map();
const built = new Set();
export function buildLevel(ci, n) {
  const k = `${ci}-${n}`;
  if (!built.has(ci)) {
    built.add(ci);
    const state = { use: new Map(), prev: new Set() };
    for (let m = 1; m <= LEVELS_PER_CHAPTER; m++) {
      const L = makeLevel(ci, m, state);
      L.words.forEach((w) => state.use.set(w, (state.use.get(w) || 0) + 1));
      state.prev = new Set(L.words);
      cache.set(`${ci}-${m}`, L);
    }
  }
  return cache.get(k);
}
function makeLevel(ci, n, state) {
  const ch = CHAPTERS[ci];
  const rng = makeRng(`teka-silang-${ch.id}-${n}`);
  const words = ch.words;
  const pic = words.filter((x) => !isPlate(x));
  const tier = n === 30 ? 7 : Math.ceil(n / 5); // 1..6, 7 = master
  const taken = new Set(); // perkataan sudah digunakan dalam level ini
  // susun calon: paling jarang digunakan dahulu; elak perkataan level lalu & dalam level ini
  const rank = (list, spread = 0) => {
    const tagged = rng.shuffle(list).map((x) => ({ x, u: (state.use.get(x.w) || 0) + (state.prev.has(x.w) ? 50 : 0) + (taken.has(x.w) ? 100 : 0) }));
    tagged.sort((a, b) => a.u - b.u);
    let out = tagged.map((t) => t.x);
    if (spread) out = rng.shuffle(out.slice(0, spread)).concat(out.slice(spread));
    return out;
  };
  const pickW = (filter, count, must = null, spread = 0) => {
    const out = must && filter(must) && !taken.has(must.w) ? [must] : [];
    for (const x of rank(words.filter(filter), spread)) {
      if (out.length >= count) break;
      if (!out.some((y) => y.w === x.w || (y.art === x.art && !isPlate(x)))) out.push(x);
    }
    out.forEach((x) => taken.add(x.w));
    return out;
  };
  const short = (x) => x.w.length <= (tier <= 1 ? 4 : tier === 2 ? 5 : 8);
  const primary = rank(words.filter((x) => (tier <= 2 ? short(x) : true)))[0] || rank(words)[0];
  const rounds = [];
  const cross = (mode, count, opts) => {
    const snap = new Set(taken);
    for (let tries = 0; tries < 60; tries++) {
      taken.clear(); snap.forEach((w) => taken.add(w));
      const list = pickW((x) => x.w.length >= 3 && x.w.length <= (mode === 'D' ? 7 : 8), count, tries ? null : primary, tries ? count + 2 + Math.floor(tries / 4) : 0).sort((a, b) => b.w.length - a.w.length);
      const r = crossRound(mode, list, rng, opts);
      if (r && r.entries.length === count) return r;
    }
    taken.clear(); snap.forEach((w) => taken.add(w));
    return null;
  };
  if (tier === 1) {
    // gambar besar, perkataan pendek, bantuan penuh
    for (const wd of pickW((x) => short(x), 2, short(primary) ? primary : null)) rounds.push(isPlate(wd) ? slotRound('B', wd, rng, { blanks: 2, extra: 1 }) : slotRound('A', wd, rng, { blanks: 3, extra: 1 }));
  } else if (tier === 2) {
    const two = pickW((x) => short(x), 2, short(primary) ? primary : null);
    rounds.push(slotRound('B', two[0], rng, { blanks: n % 2 ? 1 : 2, extra: 2 }));
    rounds.push(n % 2 ? findRound(two[1], rng, tier) : slotRound('B', two[1], rng, { blanks: 2, extra: 2 }));
  } else if (tier === 3) {
    const r = cross('D', 2, { giveCross: true });
    if (r) rounds.push(r);
    const w1 = pickW((x) => !isPlate(x), 1)[0] || primary;
    rounds.push(n % 2 && pic.length >= 3 ? shadowRound(w1, pic, rng) : slotRound('C', w1, rng, { blanks: 3, extra: 2 }));
  } else if (tier === 4) {
    if (n % 3 === 1 && pic.length >= 3) rounds.push(matchRound(pickW((x) => !isPlate(x), 3), rng));
    else if (n % 3 === 2) { // campuran: gambar + huruf hilang + silang mini
      taken.add(primary.w);
      rounds.push(slotRound(isPlate(primary) ? 'B' : 'A', primary, rng, { blanks: 3, extra: 2 }));
      rounds.push(slotRound('B', pickW((x) => x.w !== primary.w, 1)[0], rng, { blanks: 2, extra: 2 }));
      const r = cross('D', 2, { giveCross: false }); if (r) rounds.push(r);
      rounds.forEach((q) => { q.mixed = true; });
    } else rounds.push(slotRound('C', pickW((x) => !isPlate(x) || true, 1, primary)[0], rng, { blanks: 4, extra: 3 }));
    if (rounds.length === 1) rounds.push(findRound(pickW((x) => x.w !== rounds[0].word, 1)[0], rng, tier));
  } else if (tier === 5) {
    const r = cross('E', 3, { giveFirst: true }); if (r) rounds.push(r);
    if (n % 2 && pic.length >= 3) rounds.push(matchRound(pickW((x) => !isPlate(x), 3), rng));
  } else if (tier === 6) {
    const r = cross('J', n % 2 ? 4 : 5, { giveFirst: false, giveCross: false }) || cross('J', 4, {}); if (r) rounds.push(r);
  } else {
    // CHAPTER MASTER: papan besar menggabungkan perkataan chapter
    const r = cross('J', 6, {}) || cross('J', 5, {}) || cross('J', 4, {}); if (r) { r.master = true; rounds.push(r); }
    if (pic.length >= 3) rounds.push(matchRound(pickW((x) => !isPlate(x), 3), rng));
  }
  if (!rounds.length) rounds.push(slotRound('B', primary, rng, { blanks: 2, extra: 2 }));
  const mode = rounds.length > 1 && rounds.every((q) => q.mixed) ? 'H' : rounds[0].mode;
  const level = {
    id: `${ch.id}-${n}`, chapter: ch.id, ci, n, tier, mode, modes: [...new Set(rounds.map((q) => q.mode))],
    cat: rounds[0].cat || primary.cat,
    words: [...new Set(rounds.flatMap((q) => q.word ? [q.word] : q.entries ? q.entries.map((e) => e.word) : q.items.map((i) => i.word)))],
    rounds,
    hint: 'Sorotan lembut → kurangkan pilihan → tunjuk jawapan',
    complete: 'Isi semua kotak dengan huruf yang betul',
    reward: { stars: 3, sticker: n === 30, medal: n === 30 },
    master: n === 30,
  };

  return level;
}
export const TOTAL = CHAPTERS.length * LEVELS_PER_CHAPTER;
