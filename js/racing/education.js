// =====================================================================
//  CILIK RACING — penjana cabaran pembelajaran (data tulen, tiada DOM)
//  Setiap penjana menerima rng berbiji supaya level sentiasa sama.
//  Spesifikasi label: {t:'txt'|'emo'|'col'|'shp'|'star', v, c, hex, id, n}
// =====================================================================
import {
  LETTERS_WITH_WORDS, WORDS, SPELL_WORDS, COUNTABLES, COLORS, COLOR_OBJECTS, SHAPES, ANIMALS, FOODS, FRUITS,
  VEGETABLES, VEHICLES, HEALTHY, UNHEALTHY, SIZED, GO_TOGETHER, SEQUENCES, ADAB, NUM_WORDS, BABIES,
} from '../data/content.js';

const INK = ['#e2553f', '#2e5aac', '#2f9e6a', '#7a4eb0', '#e07b00', '#d6336c'];
const FILLS = ['#ff5f5f', '#3a86ff', '#ffc531', '#38b000', '#ff8c1a', '#9d4edd', '#ff70a6'];
const BASIC_COLORS = COLORS.filter((c) => ['merah', 'biru', 'kuning', 'hijau', 'oren', 'ungu', 'merahjambu', 'coklat'].includes(c.id));
const EASY_SHAPES = SHAPES.filter((s) => ['bulatan', 'segitiga', 'segiempat', 'bintang', 'hati'].includes(s.id));
const MORE_SHAPES = SHAPES.filter((s) => s.id !== 'segiempattepat');
const EASY_LETTERS = ['A', 'B', 'C', 'D', 'E', 'I', 'K', 'M', 'O', 'S', 'U'];
const HAB_OK = ANIMALS.filter((a) => !['itik', 'katak', 'penguin', 'kurakura', 'kelawar'].includes(a.id));
const SOUND_ANIMALS = ANIMALS.filter((a) => a.snd && ['kucing', 'anjing', 'lembu', 'kambing', 'ayam', 'itik', 'kuda', 'singa', 'katak', 'burung', 'lebah', 'gajah', 'monyet', 'burunghantu'].includes(a.snd));
const FOOD_ANIMALS = ANIMALS.filter((a) => a.food && FOODS[a.food]);
const BABY_PAIRS = BABIES.filter((b) => !b.small && b.baby !== b.mom);
const SPACE = [
  { e: '☀️', n: 'Matahari' }, { e: '🌙', n: 'Bulan' }, { e: '⭐', n: 'Bintang' }, { e: '🪐', n: 'Planet' },
  { e: '🚀', n: 'Roket' }, { e: '🌍', n: 'Bumi' }, { e: '☄️', n: 'Komet' }, { e: '🛸', n: 'Piring terbang' },
];
const SPACE_Q = [
  { q: 'Apa yang bersinar terang pada waktu siang?', a: 'Matahari' },
  { q: 'Apa yang kita nampak di langit pada waktu malam?', a: 'Bulan' },
  { q: 'Kita tinggal di planet apa?', a: 'Bumi' },
  { q: 'Angkasawan naik apa ke angkasa?', a: 'Roket' },
  { q: 'Apa yang berkelip-kelip di langit malam?', a: 'Bintang' },
];
const CATS = {
  buah: { n: 'buah', say: 'buah-buahan', items: FRUITS },
  sayur: { n: 'sayur', say: 'sayur-sayuran', items: VEGETABLES },
  haiwan: { n: 'haiwan', say: 'haiwan', items: ANIMALS },
  kenderaan: { n: 'kenderaan', say: 'kenderaan', items: VEHICLES.filter((v) => v.way === 'darat') },
};
const WAYS = {
  air: { q: 'Kenderaan mana yang bergerak di air?' },
  udara: { q: 'Kenderaan mana yang terbang di udara?' },
  darat: { q: 'Kenderaan mana yang bergerak di jalan raya?' },
};

const emo = (x) => ({ t: 'emo', v: x.e, n: x.n });
const num = (v, rng) => ({ t: 'txt', v: String(v), c: rng.pick(INK), n: NUM_WORDS[v] || String(v) });
const numMax = (tier) => [0, 5, 7, 10, 10, 10, 10][tier];
const lc = (s) => s.toLowerCase();

// pilih k pilihan berbeza termasuk jawapan; pulangkan { opts, ans }
function choose(rng, answer, pool, k, key = (x) => x.v + '|' + (x.hex || '') + (x.id || '')) {
  const seen = new Set([key(answer)]);
  const others = [];
  for (const x of rng.shuffle(pool)) { const kk = key(x); if (!seen.has(kk)) { seen.add(kk); others.push(x); } if (others.length >= k - 1) break; }
  const opts = rng.shuffle([answer, ...others]);
  return { opts, ans: opts.indexOf(answer) };
}
const gate = (o) => ({ kind: 'gate', ...o });

// ------------------------------------------------------------------
export const GEN = {
  huruf(rng, { k, tier }) {
    const pool = tier <= 1 ? EASY_LETTERS : LETTERS_WITH_WORDS;
    const L = rng.pick(pool);
    const spec = (l) => ({ t: 'txt', v: l, c: rng.pick(INK), n: l });
    if (tier >= 2 && rng.chance(0.35)) {
      const need = rng.int(2, 3);
      return { kind: 'collect', topic: 'huruf', skill: 'huruf', say: `Kutip ${NUM_WORDS[need]} huruf ${L}!`, target: spec(L), need, distract: rng.sample(pool.filter((x) => x !== L), 3).map(spec), card: [spec(L)] };
    }
    const { opts, ans } = choose(rng, spec(L), pool.filter((x) => x !== L).map(spec), k);
    return gate({ topic: 'huruf', skill: 'huruf', say: `Cari huruf ${L}!`, card: [opts[ans]], opts, ans });
  },
  awal(rng, { k }) {
    const L = rng.pick(LETTERS_WITH_WORDS);
    const w = rng.pick(WORDS.filter((x) => x.l === L));
    if (rng.chance(0.5)) {
      const spec = (l) => ({ t: 'txt', v: l, c: rng.pick(INK), n: l });
      const { opts, ans } = choose(rng, spec(L), LETTERS_WITH_WORDS.filter((x) => x !== L).map(spec), k);
      return gate({ topic: 'awal', skill: 'bunyi-awal', say: `${w.n}. ${w.n} bermula dengan huruf apa?`, card: [emo(w), { t: 'q' }], opts, ans });
    }
    const pool = WORDS.filter((x) => x.l !== L).map(emo);
    const { opts, ans } = choose(rng, emo(w), pool, k);
    return gate({ topic: 'awal', skill: 'bunyi-awal', say: `Cari gambar yang bermula dengan huruf ${L}!`, card: [{ t: 'txt', v: L, c: '#e2553f', n: L }], opts, ans });
  },
  nombor(rng, { k, tier }) {
    const max = numMax(tier);
    const n = rng.int(1, max);
    const pool = Array.from({ length: max }, (_, i) => i + 1).filter((x) => x !== n).map((x) => num(x, rng));
    if (tier >= 2 && rng.chance(0.45)) {
      const c = rng.pick(COUNTABLES);
      const { opts, ans } = choose(rng, num(n, rng), pool, k);
      return gate({ topic: 'nombor', skill: 'kira', say: `Berapa ${c.n}? Kira dan pilih nombornya.`, card: [{ t: 'grp', v: c.e, k: n }], opts, ans });
    }
    const { opts, ans } = choose(rng, num(n, rng), pool, k);
    return gate({ topic: 'nombor', skill: 'nombor', say: `Cari nombor ${NUM_WORDS[n]}!`, card: [opts[ans]], opts, ans });
  },
  kira(rng, { k, tier }) {
    const c = rng.pick(COUNTABLES);
    if (tier >= 2 && rng.chance(0.4)) return GEN.nombor(rng, { k, tier: Math.max(2, tier) });
    const need = rng.int(tier <= 1 ? 1 : 2, Math.min(5, tier + 2));
    const distract = tier >= 2 ? rng.sample(COUNTABLES.filter((x) => x.e !== c.e), 3).map(emo) : [];
    return { kind: 'collect', topic: 'kira', skill: 'kira', say: `Kutip ${NUM_WORDS[need]} ${c.n}!`, target: emo(c), need, distract, card: [emo(c)] };
  },
  tambah(rng, { k, tier }) {
    const max = Math.min(10, numMax(tier) + 1);
    const a = rng.int(1, Math.max(1, Math.floor(max / 2))), b = rng.int(1, Math.min(4, max - a));
    const s = a + b, c = rng.pick(COUNTABLES.slice(0, 8));
    const pool = Array.from({ length: 10 }, (_, i) => i + 1).filter((x) => x !== s && Math.abs(x - s) <= 3).map((x) => num(x, rng));
    const { opts, ans } = choose(rng, num(s, rng), pool, k);
    return gate({ topic: 'tambah', skill: 'tambah', say: `${NUM_WORDS[a]} tambah ${NUM_WORDS[b]}, jadi berapa?`, card: [{ t: 'grp', v: c.e, k: a }, { t: 'op', v: '+' }, { t: 'grp', v: c.e, k: b }], opts, ans });
  },
  tolak(rng, { k, tier }) {
    const a = rng.int(3, Math.min(9, numMax(tier) + 1)), b = rng.int(1, Math.min(3, a - 1));
    const d = a - b, c = rng.pick(COUNTABLES.slice(0, 8));
    const pool = Array.from({ length: 10 }, (_, i) => i).filter((x) => x !== d && Math.abs(x - d) <= 3).map((x) => num(x, rng));
    const { opts, ans } = choose(rng, num(d, rng), pool, k);
    return gate({ topic: 'tolak', skill: 'tolak', say: `Ada ${NUM_WORDS[a]} ${c.n}. Ambil ${NUM_WORDS[b]}. Tinggal berapa?`, card: [{ t: 'grp', v: c.e, k: a }, { t: 'op', v: '−' }, { t: 'grp', v: c.e, k: b }], opts, ans });
  },
  warna(rng, { k }) {
    const spec = (c) => ({ t: 'col', hex: c.hex, n: c.n, v: c.id });
    const ansC = rng.pick(BASIC_COLORS);
    const { opts, ans } = choose(rng, spec(ansC), BASIC_COLORS.filter((c) => c !== ansC).map(spec), k);
    return gate({ topic: 'warna', skill: 'warna', say: `Pilih laluan warna ${lc(ansC.n)}!`, card: [opts[ans]], opts, ans, paint: true });
  },
  padan(rng, { k }) {
    const ids = rng.shuffle(Object.keys(COLOR_OBJECTS)).slice(0, k);
    const opts = ids.map((id) => ({ t: 'emo', v: rng.pick(COLOR_OBJECTS[id]), n: COLORS.find((c) => c.id === id).n, col: id }));
    const ans = rng.int(0, k - 1);
    const c = COLORS.find((x) => x.id === opts[ans].col);
    return gate({ topic: 'padan', skill: 'warna', say: `Cari benda berwarna ${lc(c.n)}!`, card: [{ t: 'col', hex: c.hex, n: c.n, v: c.id }], opts: opts.map((o) => ({ ...o, n: `warna ${lc(o.n)}` })), ans });
  },
  bentuk(rng, { k, tier }) {
    const pool = tier <= 2 ? EASY_SHAPES : MORE_SHAPES;
    const spec = (s) => ({ t: 'shp', id: s.id, hex: rng.pick(FILLS), n: s.n });
    const s = rng.pick(pool);
    if (rng.chance(0.4)) {
      const need = rng.int(2, Math.min(4, tier + 1));
      return { kind: 'collect', topic: 'bentuk', skill: 'bentuk', say: `Kutip ${NUM_WORDS[need]} ${lc(s.n)}!`, target: spec(s), need, distract: rng.sample(pool.filter((x) => x !== s), 3).map(spec), card: [spec(s)] };
    }
    const { opts, ans } = choose(rng, spec(s), pool.filter((x) => x !== s).map(spec), k, (x) => x.id);
    return gate({ topic: 'bentuk', skill: 'bentuk', say: `Cari bentuk ${lc(s.n)}!`, card: [opts[ans]], opts, ans });
  },
  buah(rng, { k }) {
    const f = rng.pick(FRUITS);
    const { opts, ans } = choose(rng, emo(f), FRUITS.filter((x) => x !== f).map(emo), k);
    return gate({ topic: 'buah', skill: 'buah', say: `Cari ${lc(f.n)}!`, card: [{ t: 'q' }], opts, ans });
  },
  besar(rng, { k }) {
    const big = rng.chance(0.5);
    const items = rng.shuffle(SIZED);
    const pick = [];
    for (const x of items) if (pick.every((p) => Math.abs(p.s - x.s) >= 3)) { pick.push(x); if (pick.length === k) break; }
    while (pick.length < k) pick.push(items.find((x) => !pick.includes(x)));
    const target = pick.reduce((a, b) => (big ? (b.s > a.s ? b : a) : (b.s < a.s ? b : a)));
    const opts = rng.shuffle(pick).map(emo);
    return gate({ topic: 'besar', skill: 'saiz', say: big ? 'Pilih yang paling besar!' : 'Pilih yang paling kecil!', card: [{ t: 'txt', v: big ? '⬆' : '⬇', c: '#7a4eb0', n: '' }], opts, ans: opts.findIndex((o) => o.v === target.e) });
  },
  kategori(rng, { k }) {
    const keys = Object.keys(CATS);
    const ck = rng.pick(keys);
    const a = rng.pick(CATS[ck].items);
    const others = rng.shuffle(keys.filter((x) => x !== ck)).flatMap((x) => rng.sample(CATS[x].items, 2));
    const { opts, ans } = choose(rng, emo(a), others.map(emo), k);
    return gate({ topic: 'kategori', skill: 'kategori', say: `Cari ${CATS[ck].n}!`, card: [{ t: 'q' }], opts, ans });
  },
  ganjil(rng, { k }) {
    const keys = Object.keys(CATS);
    const [ck, ok] = rng.shuffle(keys);
    const same = rng.sample(CATS[ck].items, k - 1).map(emo);
    const odd = emo(rng.pick(CATS[ok].items));
    const opts = rng.shuffle([...same, odd]);
    return gate({ topic: 'ganjil', skill: 'logik', say: `Semua ini ${CATS[ck].say}, kecuali satu. Cari yang lain!`, card: [{ t: 'q' }], opts, ans: opts.indexOf(odd) });
  },
  haiwan(rng, { k }) {
    const a = rng.pick(ANIMALS);
    const { opts, ans } = choose(rng, emo(a), ANIMALS.filter((x) => x !== a).map(emo), k);
    return gate({ topic: 'haiwan', skill: 'haiwan', say: `Cari ${lc(a.n)}!`, card: [{ t: 'q' }], opts, ans, host: true });
  },
  habitat(rng, { k }) {
    const hab = rng.pick(['air', 'udara', 'darat', 'air']);
    const q = { air: 'Siapa yang tinggal di dalam air?', udara: 'Siapa yang boleh terbang?', darat: 'Siapa yang tinggal di darat dan tidak boleh terbang?' }[hab];
    const a = rng.pick(HAB_OK.filter((x) => x.hab === hab));
    const { opts, ans } = choose(rng, emo(a), HAB_OK.filter((x) => x.hab !== hab).map(emo), k);
    return gate({ topic: 'habitat', skill: 'habitat', say: q, card: [{ t: 'emo', v: { air: '🌊', udara: '☁️', darat: '🌳' }[hab], n: '' }], opts, ans, host: true });
  },
  bunyi(rng, { k }) {
    const a = rng.pick(SOUND_ANIMALS);
    const { opts, ans } = choose(rng, emo(a), SOUND_ANIMALS.filter((x) => x !== a).map(emo), k);
    return gate({ topic: 'bunyi', skill: 'bunyi', say: 'Dengar bunyi ini. Siapa yang berbunyi begini?', sound: a.snd, card: [{ t: 'snd' }], opts, ans, host: true });
  },
  makanan(rng, { k }) {
    const a = rng.pick(FOOD_ANIMALS);
    const f = FOODS[a.food];
    const pool = Object.entries(FOODS).filter(([id]) => id !== a.food).map(([, x]) => emo(x));
    const { opts, ans } = choose(rng, emo(f), pool, k);
    return gate({ topic: 'makanan', skill: 'makanan-haiwan', say: `${a.n} suka makan apa?`, card: [emo(a), { t: 'q' }], opts, ans, host: true });
  },
  anak(rng, { k }) {
    const b = rng.pick(BABY_PAIRS);
    const moms = ANIMALS.filter((x) => x.e !== b.mom).map(emo);
    const { opts, ans } = choose(rng, { t: 'emo', v: b.mom, n: b.n }, moms, k);
    return gate({ topic: 'anak', skill: 'anak-haiwan', say: `Ini ${lc(b.bn)}. Siapa ibunya?`, card: [{ t: 'emo', v: b.baby, n: b.bn }, { t: 'q' }], opts, ans, host: true });
  },
  corak(rng, { k, tier }, asPit = false) {
    const kind = rng.pick(['col', 'shp', 'emo']);
    const units = kind === 'col' ? rng.sample(BASIC_COLORS, 3).map((c) => ({ t: 'col', hex: c.hex, n: c.n, v: c.id }))
      : kind === 'shp' ? rng.sample(EASY_SHAPES, 3).map((s, i) => ({ t: 'shp', id: s.id, hex: FILLS[i * 2 % FILLS.length], n: s.n }))
        : rng.sample(COUNTABLES.slice(0, 12), 3).map(emo);
    const pat = tier <= 2 ? [0, 1] : rng.pick([[0, 1], [0, 0, 1], [0, 1, 2], [0, 1, 1]]);
    const shown = Array.from({ length: pat.length * 2 }, (_, i) => units[pat[i % pat.length]]);
    const answer = units[pat[shown.length % pat.length]];
    const extra = kind === 'col' ? BASIC_COLORS.map((c) => ({ t: 'col', hex: c.hex, n: c.n, v: c.id }))
      : kind === 'shp' ? EASY_SHAPES.map((s) => ({ t: 'shp', id: s.id, hex: FILLS[5], n: s.n }))
        : COUNTABLES.slice(0, 12).map(emo);
    const key = (x) => (x.t === 'shp' ? x.id : x.v + (x.hex || ''));
    const pool = units.filter((u) => u !== answer).concat(rng.shuffle(extra));
    const { opts, ans } = choose(rng, answer, pool, k, key);
    const o = { topic: 'corak', skill: 'corak', say: 'Lihat coraknya. Apa yang datang seterusnya?', card: [...shown.slice(-4), { t: 'q' }], seq: shown, opts, ans };
    if (asPit) return { kind: 'pit', sub: 'corak', ...o };
    return gate(o);
  },
  urutan(rng, { k }) {
    const s = rng.pick(SEQUENCES);
    const i = rng.int(0, s.steps.length - 2);
    const a = s.steps[i], b = s.steps[i + 1];
    const pool = SEQUENCES.flatMap((x) => x.steps).filter((x) => x.e !== b.e && x.e !== a.e).map(emo);
    const { opts, ans } = choose(rng, emo(b), pool, k);
    return gate({ topic: 'urutan', skill: 'urutan', say: `${a.n}. Selepas itu, apa pula?`, card: [emo(a), { t: 'op', v: '→' }, { t: 'q' }], opts, ans });
  },
  memori(rng, { k, tier }) {
    const len = tier >= 5 ? 4 : 3;
    const pool = rng.sample(COUNTABLES.filter((c) => c.e !== '🌳'), 8).map(emo);
    const seq = pool.slice(0, len);
    return { kind: 'order', topic: 'memori', skill: 'memori', say: `Ingat urutan ini: ${seq.map((x) => x.n).join(', ')}.`, seq, pool, card: seq };
  },
  eja(rng, { tier }) {
    const [lo, hi] = tier <= 2 ? [3, 3] : tier === 3 ? [3, 4] : tier === 4 ? [4, 4] : [4, 5];
    const words = SPELL_WORDS.filter((w) => w.n.length >= lo && w.n.length <= hi && new Set(w.n.toUpperCase()).size === w.n.length);
    const w = rng.pick(words);
    return { kind: 'pit', sub: 'eja', topic: 'eja', skill: 'ejaan', word: w.n.toUpperCase(), pic: w.e, say: `Jom eja ${lc(w.n)}.`, card: [emo(w)] };
  },
  angkasa(rng, { k }) {
    if (rng.chance(0.5)) {
      const q = rng.pick(SPACE_Q);
      const a = SPACE.find((x) => x.n === q.a);
      const { opts, ans } = choose(rng, emo(a), SPACE.filter((x) => x !== a).map(emo), k);
      return gate({ topic: 'angkasa', skill: 'sains', say: q.q, card: [{ t: 'q' }], opts, ans });
    }
    const a = rng.pick(SPACE);
    const { opts, ans } = choose(rng, emo(a), SPACE.filter((x) => x !== a).map(emo), k);
    return gate({ topic: 'angkasa', skill: 'sains', say: `Cari ${lc(a.n)}!`, card: [{ t: 'q' }], opts, ans });
  },
  kenderaan(rng, { k }) {
    const way = rng.pick(['air', 'udara', 'darat']);
    const a = rng.pick(VEHICLES.filter((v) => v.way === way));
    const { opts, ans } = choose(rng, emo(a), VEHICLES.filter((v) => v.way !== way).map(emo), k);
    return gate({ topic: 'kenderaan', skill: 'kenderaan', say: WAYS[way].q, card: [{ t: 'emo', v: { air: '🌊', udara: '☁️', darat: '🛣️' }[way], n: '' }], opts, ans });
  },
  fungsi(rng, { k }) {
    const [a, b] = rng.pick(GO_TOGETHER);
    const pool = GO_TOGETHER.filter(([x, y]) => y !== b && x !== a).map(([, y]) => ({ t: 'emo', v: y, n: '' }));
    const { opts, ans } = choose(rng, { t: 'emo', v: b, n: '' }, pool, k);
    return gate({ topic: 'fungsi', skill: 'logik', say: 'Apa pasangan yang sesuai untuk benda ini?', card: [{ t: 'emo', v: a, n: '' }, { t: 'op', v: '+' }, { t: 'q' }], opts, ans });
  },
  sihat(rng, { k }) {
    const a = rng.pick(HEALTHY);
    const { opts, ans } = choose(rng, emo(a), UNHEALTHY.map(emo), k);
    return gate({ topic: 'sihat', skill: 'kesihatan', say: 'Pilih makanan yang sihat!', card: [{ t: 'q' }], opts, ans });
  },
  adab(rng, { k }) {
    const items = ADAB.filter((x) => !x.keyed);
    const q = rng.pick(items);
    const lab = (x) => ({ t: 'emo', v: x.e, n: x.n, cap: x.n });
    const answer = lab(q.a);
    const fill = items.filter((x) => x !== q).flatMap((x) => x.no).filter((x) => x.e !== q.a.e);
    const base = q.no.filter((x) => x.e !== q.a.e).map(lab);
    const others = [...base, ...rng.shuffle(fill).map(lab)].filter((x, i, arr) => arr.findIndex((y) => y.v === x.v) === i).slice(0, k - 1);
    const opts = rng.shuffle([answer, ...others]);
    return gate({ topic: 'adab', skill: 'adab', say: q.q.replace('...', ''), card: [{ t: 'q' }], opts, ans: opts.indexOf(answer) });
  },
};
export const TOPICS = Object.keys(GEN);
export const TOPIC_NAMES = {
  huruf: 'Kenal huruf', awal: 'Bunyi awal', nombor: 'Nombor', kira: 'Mengira', tambah: 'Tambah', tolak: 'Tolak', warna: 'Warna',
  padan: 'Padan warna', bentuk: 'Bentuk', buah: 'Buah-buahan', besar: 'Besar & kecil', kategori: 'Kategori', ganjil: 'Cari yang lain',
  haiwan: 'Haiwan', habitat: 'Habitat', bunyi: 'Bunyi haiwan', makanan: 'Makanan haiwan', anak: 'Anak haiwan', corak: 'Corak',
  urutan: 'Urutan', memori: 'Memori', eja: 'Ejaan', angkasa: 'Angkasa', kenderaan: 'Kenderaan', fungsi: 'Pasangan', sihat: 'Makanan sihat', adab: 'Adab',
};
