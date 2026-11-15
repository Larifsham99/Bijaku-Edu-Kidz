// Mod 1–8: ABC Ceria, Dunia Nombor, Warna & Bentuk, Teka Bunyi, Puzzle Pintar, Ingatan Hebat, Seni & Mewarna, Cari Bayang
import * as C from '../data/content.js';
import { COLORING, DOT_SHAPES, TRACE } from '../data/art.js';
import { tier, nOpts, lerp, F, T, options, choiceRound, multiRound, slotsRound, matchRound, sortRound, memoryRound, uniqBy, groupHtml } from './helpers.js';

const UP = (l) => T(l, `Huruf ${l}`);
const LO = (l) => T(l.toLowerCase(), `Huruf ${l} kecil`);
const letterPool = (L) => C.LETTERS.slice(0, Math.min(26, 6 + L));
const wordFace = (w) => F(w.e, w.n, w.en, w.n);

// ============================ MOD 1: ABC CERIA ============================
export const abc = {
  id: 'abc', n: 'ABC Ceria', e: '🔤', c: '#ff6b6b', char: 'mimi',
  skills: { 'abc.kenal': 'Mengenal huruf A–Z', 'abc.besarkecil': 'Huruf besar & kecil', 'abc.cari': 'Mencari huruf yang disebut', 'abc.susun': 'Menyusun huruf', 'abc.awal': 'Huruf pertama gambar', 'abc.hilang': 'Melengkapkan huruf hilang', 'abc.tulis': 'Menyurih huruf' },
  gens: {
    sama(r, L) {
      const pool = letterPool(L); const a = r.pick(pool);
      return choiceRound({ skill: 'abc.kenal', say: `Ini huruf ${a}. Cari huruf ${a} yang sama!`, show: { k: 'big', t: a, say: `Huruf ${a}` }, options: options(r, pool.map(UP), UP(a), nOpts(L) + 1), answer: UP(a) });
    },
    cari(r, L) {
      const pool = letterPool(L); const a = r.pick(pool);
      return choiceRound({ skill: 'abc.cari', say: `Mari kita cari huruf ${a}!`, show: { k: 'big', e: '🔊', say: `Huruf ${a}` }, options: options(r, pool.map(UP), UP(a), nOpts(L) + 1), answer: UP(a) });
    },
    besarKecil(r, L) {
      const pool = letterPool(L); const a = r.pick(pool);
      return choiceRound({ skill: 'abc.besarkecil', say: `Ini huruf besar ${a}. Cari huruf kecilnya!`, show: { k: 'big', t: a, say: `Huruf ${a}` }, options: options(r, pool.map(LO), LO(a), nOpts(L) + 1), answer: LO(a) });
    },
    padanBesarKecil(r, L) {
      const n = L < 15 ? 2 : L < 30 ? 3 : 4;
      const ls = r.sample(letterPool(L), n);
      return matchRound({ skill: 'abc.besarkecil', say: 'Seret huruf kecil kepada huruf besar yang sama.', pairs: ls.map((l) => [LO(l), UP(l)]), rng: r });
    },
    awal(r, L) {
      const pool = letterPool(L).filter((l) => C.wordsByLetter(l).length);
      const a = r.pick(pool); const w = r.pick(C.wordsByLetter(a));
      const others = C.WORDS.filter((x) => x.l !== a);
      return choiceRound({ skill: 'abc.awal', say: `Huruf ${a}. Gambar mana bermula dengan huruf ${a}?`, show: { k: 'big', t: a, say: `Huruf ${a}` }, options: options(r, others.map(wordFace), wordFace(w), Math.min(4, nOpts(L) + 1)), answer: wordFace(w), sayOnTap: true });
    },
    awalTerbalik(r, L) {
      const pool = letterPool(L).filter((l) => C.wordsByLetter(l).length);
      const a = r.pick(pool); const w = r.pick(C.wordsByLetter(a));
      return choiceRound({ skill: 'abc.awal', say: `Ini ${w.n}. ${w.n} bermula dengan huruf apa?`, show: { k: 'big', e: w.e, say: w.n }, options: options(r, C.LETTERS.map(UP), UP(a), nOpts(L) + 1), answer: UP(a) });
    },
    susun(r, L) {
      const n = L < 25 ? 3 : L < 40 ? 4 : 5;
      const start = r.int(0, 26 - n);
      const seq = C.LETTERS.slice(start, start + n);
      return slotsRound({ skill: 'abc.susun', say: `Susun huruf mengikut urutan, bermula dengan ${seq[0]}.`, items: seq.map(UP), text: true, rng: r, given: L < 35 ? [0] : [] });
    },
    hilang(r, L) {
      const n = L < 30 ? 4 : 5;
      const start = r.int(0, 26 - n);
      const seq = C.LETTERS.slice(start, start + n);
      const miss = L < 40 ? [r.int(1, n - 1)] : r.sample([...Array(n).keys()].slice(1), 2);
      const distract = r.sample(C.LETTERS.filter((x) => !seq.includes(x)), L < 30 ? 1 : 2).map(UP);
      return slotsRound({ skill: 'abc.hilang', say: 'Huruf apa yang hilang? Seret ke tempat kosong.', items: seq.map(UP), given: [...Array(n).keys()].filter((i) => !miss.includes(i)), distract, text: true, rng: r });
    },
    eja(r, L) {
      const ws = C.SPELL_WORDS.filter((w) => w.n.length <= (L < 35 ? 4 : L < 45 ? 5 : 6));
      const w = r.pick(ws);
      const letters = w.n.toUpperCase().split('');
      const blanks = L < 35 ? [r.int(0, letters.length - 1)] : L < 45 ? r.sample([...letters.keys()], 2) : [...letters.keys()];
      const distract = r.sample(C.LETTERS.filter((x) => !letters.includes(x)), L < 40 ? 1 : 2).map(UP);
      const items = letters.map((l, i) => ({ ...UP(l), v: l }));
      const rd = slotsRound({ skill: 'abc.hilang', say: `Ini ${w.n}. Lengkapkan perkataan ${w.n}.`, items, given: [...letters.keys()].filter((i) => !blanks.includes(i)), distract: distract.map((d) => ({ ...d, v: '__' + d.t })), text: true, rng: r, show: { k: 'big', e: w.e, say: w.n, lbl: w.n } });
      return rd;
    },
    memoriHuruf(r, L) {
      const n = L < 30 ? 3 : L < 42 ? 4 : 5;
      return memoryRound({ skill: 'abc.besarkecil', say: 'Cari pasangan huruf besar dan huruf kecil.', pairs: r.sample(letterPool(L), n).map((l) => [UP(l), LO(l)]), rng: r, peek: L < 30 ? 1500 : 0 });
    },
    vokal(r, L) {
      const vs = r.sample(C.VOWELS, r.int(2, 3));
      const cons = r.sample(C.LETTERS.filter((x) => !C.VOWELS.includes(x)), 6 - vs.length);
      return multiRound({ skill: 'abc.kenal', say: 'Tekan SEMUA huruf vokal: A, E, I, O, U.', options: r.shuffle([...vs, ...cons]).map(UP), answers: vs.map(UP) });
    },
    cariSemua(r, L) {
      const a = r.pick(letterPool(L));
      const k = L < 35 ? 3 : 4;
      const others = r.sample(C.LETTERS.filter((x) => x !== a), 6 - k + 2);
      const opts = r.shuffle([...Array.from({ length: k }, (_, i) => ({ ...UP(a), id: a + i })), ...others.map(UP)]).slice(0, 8);
      return { type: 'choice', multi: true, skill: 'abc.cari', say: `Tekan semua huruf ${a}!`, show: { k: 'big', e: '🔊', say: `Huruf ${a}` }, options: opts.map((o) => ({ ...o, id: o.id || o.t })), answers: opts.filter((o) => o.t === a).map((o) => o.id) };
    },
    surih(r, L) {
      const list = TRACE.filter((t) => /^[A-Z]$/.test(t.id));
      const t = r.pick(list);
      return { type: 'trace', skill: 'abc.tulis', say: `Mari surih huruf ${t.id}!`, trace: t.id };
    },
  },
  tiers: [
    ['sama', 'cari', 'awal', 'sama', 'cari', 'surih'],
    ['cari', 'besarKecil', 'awal', 'awalTerbalik', 'padanBesarKecil', 'hilang'],
    ['susun', 'hilang', 'memoriHuruf', 'eja', 'awalTerbalik', 'besarKecil', 'cariSemua'],
    ['eja', 'susun', 'memoriHuruf', 'vokal', 'padanBesarKecil', 'hilang', 'cariSemua'],
    ['eja', 'susun', 'hilang', 'memoriHuruf', 'vokal', 'awalTerbalik', 'padanBesarKecil'],
  ],
};

// ============================ MOD 2: DUNIA NOMBOR ============================
const N = (n) => T(n, C.NUM_WORDS[n] ?? String(n));
const maxNum = (L) => (L <= 5 ? 5 : L <= 10 ? 10 : L <= 25 ? 10 : L <= 35 ? 15 : 20);
const numOpts = (r, ans, L, lo = 0) => {
  const max = Math.max(maxNum(L), ans + 2);
  const pool = []; for (let i = lo; i <= max; i++) pool.push(N(i));
  // pengganggu berhampiran jawapan
  const near = pool.filter((p) => Math.abs(+p.t - ans) <= 3);
  return options(r, near.length >= nOpts(L) ? near : pool, N(ans), Math.min(nOpts(L) + 1, 4));
};
export const nombor = {
  id: 'nombor', n: 'Dunia Nombor', e: '🔢', c: '#54a0ff', char: 'bobo',
  skills: { 'nombor.kenal': 'Mengenal nombor 1–20', 'nombor.kira': 'Mengira objek', 'nombor.padan': 'Padan nombor & kuantiti', 'nombor.banding': 'Banyak & sedikit', 'nombor.tambah': 'Tambah asas', 'nombor.tolak': 'Tolak asas', 'nombor.susun': 'Susunan nombor' },
  gens: {
    kira(r, L) {
      const n = r.int(1, Math.min(maxNum(L), L <= 10 ? 5 + Math.floor(L / 3) : 12));
      const it = r.pick(C.COUNTABLES);
      return choiceRound({ skill: 'nombor.kira', say: `Cuba kira berapa ${it.pj} ${it.n}. Tekan setiap satu untuk mengira!`, show: { k: 'objects', items: Array(n).fill(it.e), tap: true }, options: numOpts(r, n, L, 1), answer: N(n) });
    },
    kenal(r, L) {
      const n = r.int(1, maxNum(L));
      const pool = Array.from({ length: maxNum(L) }, (_, i) => N(i + 1));
      return choiceRound({ skill: 'nombor.kenal', say: `Cari nombor ${C.NUM_WORDS[n]}!`, show: { k: 'big', e: '🔊', say: `Nombor ${C.NUM_WORDS[n]}` }, options: options(r, pool, N(n), nOpts(L) + 1), answer: N(n) });
    },
    pilihKuantiti(r, L) {
      const max = Math.min(maxNum(L), 10);
      const n = r.int(1, max);
      const it = r.pick(C.COUNTABLES);
      const pool = Array.from({ length: max }, (_, i) => ({ id: 'g' + (i + 1), html: groupHtml(it.e, i + 1, 22) }));
      return choiceRound({ skill: 'nombor.padan', say: `Pilih kumpulan yang ada ${C.NUM_WORDS[n]} ${it.n}.`, show: { k: 'big', t: n, say: C.NUM_WORDS[n] }, options: options(r, pool, pool[n - 1], Math.min(nOpts(L), 4)), answer: pool[n - 1], cols: 2 });
    },
    padan(r, L) {
      const k = L < 20 ? 3 : 4;
      const ns = r.sample(Array.from({ length: Math.min(maxNum(L), 10) }, (_, i) => i + 1), k);
      const it = r.pick(C.COUNTABLES);
      return matchRound({ skill: 'nombor.padan', say: 'Seret nombor kepada kumpulan yang betul.', pairs: ns.map((n) => [N(n), { html: groupHtml(it.e, n, 18) }]), rng: r });
    },
    banding(r, L) {
      const more = L < 15 || r.chance(0.5);
      const k = L < 25 ? 2 : 3;
      const it = r.pick(C.COUNTABLES);
      const ns = r.sample(Array.from({ length: L < 20 ? 6 : 10 }, (_, i) => i + 1), k);
      const target = more ? Math.max(...ns) : Math.min(...ns);
      const opts = ns.map((n) => ({ id: 'g' + n, html: groupHtml(it.e, n, 24) }));
      return choiceRound({ skill: 'nombor.banding', say: more ? `Kumpulan mana yang lebih banyak ${it.n}?` : `Kumpulan mana yang lebih sedikit ${it.n}?`, options: opts, answer: opts.find((o) => o.id === 'g' + target), cols: k });
    },
    tambah(r, L) {
      const max = L < 30 ? 5 : 10;
      const a = r.int(1, max - 1), b = r.int(1, max - a);
      const it = r.pick(C.COUNTABLES);
      return choiceRound({ skill: 'nombor.tambah', say: `${C.NUM_WORDS[a]} ${it.n} tambah ${C.NUM_WORDS[b]} ${it.n}. Semuanya berapa?`, show: { k: 'eq', a, b, op: '+', e: it.e }, options: numOpts(r, a + b, L, 1), answer: N(a + b) });
    },
    tolak(r, L) {
      const max = L < 35 ? 6 : 10;
      const a = r.int(2, max), b = r.int(1, a - 1);
      const it = r.pick(C.COUNTABLES);
      return choiceRound({ skill: 'nombor.tolak', say: `Ada ${C.NUM_WORDS[a]} ${it.n}. ${C.NUM_WORDS[b]} sudah diambil. Tinggal berapa?`, show: { k: 'eq', a, b, op: '-', e: it.e }, options: numOpts(r, a - b, L, 0), answer: N(a - b) });
    },
    susun(r, L) {
      const k = L < 25 ? 3 : L < 40 ? 4 : 5;
      const start = r.int(1, maxNum(L) - k + 1);
      const seq = Array.from({ length: k }, (_, i) => start + i);
      return slotsRound({ skill: 'nombor.susun', say: 'Susun nombor dari kecil ke besar.', items: seq.map(N), text: true, rng: r });
    },
    hilang(r, L) {
      const k = 5;
      const start = r.int(1, maxNum(L) - k + 1);
      const seq = Array.from({ length: k }, (_, i) => start + i);
      const miss = r.int(1, k - 2);
      const distract = [N(seq[miss] + (r.chance(0.5) ? 5 : -5 > 0 ? -5 : 6))].filter((x) => !seq.includes(+x.t));
      return slotsRound({ skill: 'nombor.susun', say: 'Nombor apa yang hilang?', items: seq.map(N), given: seq.map((_, i) => i).filter((i) => i !== miss), distract, text: true, rng: r });
    },
    selepas(r, L) {
      const after = r.chance(0.6);
      const n = r.int(2, maxNum(L) - 1);
      const ans = after ? n + 1 : n - 1;
      return choiceRound({ skill: 'nombor.susun', say: after ? `Nombor apa selepas ${C.NUM_WORDS[n]}?` : `Nombor apa sebelum ${C.NUM_WORDS[n]}?`, show: { k: 'strip', items: after ? [N(n), '?'] : ['?', N(n)] }, options: numOpts(r, ans, L, 1), answer: N(ans) });
    },
    cariObjek(r, L) {
      const it = r.pick(C.COUNTABLES);
      const k = r.int(2, L < 20 ? 4 : 6);
      const decoPool = C.COUNTABLES.filter((x) => x.e !== it.e).map((x) => x.e);
      const items = scatter(r, k, it.e, decoPool, L < 20 ? 6 : 10, 9, 13);
      return { type: 'find', skill: 'nombor.kira', say: `Cari dan tekan ${C.NUM_WORDS[k]} ${it.n}!`, bg: ['#fef9e7', '#e8f6ff'], items, targetE: it.e };
    },
    memoriNombor(r, L) {
      const k = L < 35 ? 3 : 4;
      const ns = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], k);
      const it = r.pick(C.COUNTABLES);
      return memoryRound({ skill: 'nombor.padan', say: 'Cari pasangan nombor dan bilangan gambar.', pairs: ns.map((n) => [N(n), { html: groupHtml(it.e, n, 14) }]), rng: r, peek: 1500 });
    },
  },
  tiers: [
    ['kira', 'kenal', 'pilihKuantiti', 'banding', 'kira'],
    ['kira', 'kenal', 'padan', 'banding', 'cariObjek', 'pilihKuantiti'],
    ['tambah', 'susun', 'hilang', 'padan', 'kira', 'memoriNombor', 'banding'],
    ['tambah', 'tolak', 'selepas', 'hilang', 'cariObjek', 'kira', 'memoriNombor'],
    ['tambah', 'tolak', 'selepas', 'susun', 'banding', 'kira', 'padan'],
  ],
};

// Taburkan objek dalam pemandangan tanpa bertindih
export function scatter(r, k, targetE, decoPool, decoN, sizeMin = 8, sizeMax = 12, { targetSize, opTarget } = {}) {
  const cols = 6, rows = 4;
  const cells = r.shuffle([...Array(cols * rows).keys()]);
  const items = [];
  const total = Math.min(cells.length, k + decoN);
  for (let i = 0; i < total; i++) {
    const c = cells[i];
    const x = ((c % cols) + 0.5) / cols * 100 + r.int(-4, 4);
    const y = (Math.floor(c / cols) + 0.5) / rows * 100 + r.int(-5, 5);
    if (i < k) items.push({ e: targetE, x, y, s: targetSize || r.int(sizeMin, sizeMax), target: true, rot: r.int(-20, 20), op: opTarget ?? 1 });
    else items.push({ e: r.pick(decoPool), x, y, s: r.int(sizeMin, sizeMax), rot: r.int(-15, 15) });
  }
  return items;
}

// ============================ MOD 3: WARNA DAN BENTUK ============================
const SW = (c) => ({ id: c.id, swatch: c.id, lbl: c.n, en: c.en, say: c.n });
const SH = (s, color = 'ungu') => ({ id: s.id, shape: s.id, color, lbl: s.n, en: s.en, say: s.n });
const basicColors = (L) => C.COLORS.filter((c) => (L < 15 ? ['merah', 'biru', 'kuning', 'hijau', 'oren', 'ungu'] : Object.keys(C.COLOR_OBJECTS)).includes(c.id));
const basicShapes = (L) => C.SHAPES.filter((s) => (L < 12 ? ['bulatan', 'segitiga', 'segiempat', 'bintang', 'hati'] : L < 30 ? C.SHAPES.map((x) => x.id).filter((x) => x !== 'bulansabit') : C.SHAPES.map((x) => x.id)).includes(s.id));
export const warna = {
  id: 'warna', n: 'Warna & Bentuk', e: '🎨', c: '#feca57', char: 'lala',
  skills: { 'warna.kenal': 'Mengenal warna', 'bentuk.kenal': 'Mengenal bentuk', 'warna.cari': 'Objek mengikut warna', 'bentuk.padan': 'Memadankan bentuk', 'warna.kelas': 'Mengelaskan objek', 'corak.warna': 'Melengkapkan corak' },
  gens: {
    warnaKenal(r, L) {
      const pool = basicColors(L); const c = r.pick(pool);
      return choiceRound({ skill: 'warna.kenal', say: `Cari warna ${c.n.toLowerCase()}!`, options: options(r, pool.map(SW), SW(c), nOpts(L) + 1), answer: SW(c) });
    },
    bentukKenal(r, L) {
      const pool = basicShapes(L); const s = r.pick(pool);
      const col = r.pick(['merah', 'biru', 'hijau', 'ungu', 'oren']);
      return choiceRound({ skill: 'bentuk.kenal', say: `Cari bentuk ${s.n.toLowerCase()}!`, options: options(r, pool.map((x) => SH(x, col)), SH(s, col), nOpts(L) + 1), answer: SH(s, col) });
    },
    warnaCari(r, L) {
      const pool = basicColors(L); const c = r.pick(pool);
      const ans = r.pick(C.COLOR_OBJECTS[c.id]);
      const others = Object.entries(C.COLOR_OBJECTS).filter(([k]) => k !== c.id).flatMap(([, v]) => v);
      return choiceRound({ skill: 'warna.cari', say: `Objek mana yang berwarna ${c.n.toLowerCase()}?`, show: { k: 'big', swatch: c.id, say: c.n }, options: options(r, others.map((e) => ({ e })), { e: ans }, nOpts(L) + 1), answer: { e: ans } });
    },
    warnaSemua(r, L) {
      const c = r.pick(basicColors(L));
      const yes = r.sample(C.COLOR_OBJECTS[c.id], r.int(2, 3));
      const others = Object.entries(C.COLOR_OBJECTS).filter(([k]) => k !== c.id).flatMap(([, v]) => v);
      const no = r.sample(others, 6 - yes.length);
      return multiRound({ skill: 'warna.cari', say: `Tekan SEMUA objek berwarna ${c.n.toLowerCase()}.`, show: { k: 'big', swatch: c.id, say: c.n }, options: r.shuffle([...yes, ...no]).map((e) => ({ e })), answers: yes.map((e) => ({ e })) });
    },
    bentukPadan(r, L) {
      const k = L < 20 ? 3 : 4;
      const ss = r.sample(basicShapes(L), k);
      const cols = r.sample(['merah', 'biru', 'hijau', 'kuning', 'oren', 'ungu', 'merahjambu'], k * 2);
      return matchRound({ skill: 'bentuk.padan', say: 'Seret bentuk kepada bentuk yang sama.', pairs: ss.map((s, i) => [{ shape: s.id, color: cols[i], say: s.n }, { shape: s.id, color: cols[i + k], lbl: s.n, say: s.n }]), rng: r });
    },
    bentukObjek(r, L) {
      const keys = Object.keys(C.SHAPE_OBJECTS).filter((k) => basicShapes(Math.max(L, 30)).find((s) => s.id === k));
      const sid = r.pick(keys);
      const obj = r.pick(C.SHAPE_OBJECTS[sid]);
      const pool = C.SHAPES.filter((s) => keys.includes(s.id));
      const s = C.SHAPES.find((x) => x.id === sid);
      return choiceRound({ skill: 'bentuk.padan', say: 'Objek ini berbentuk apa?', show: { k: 'big', e: obj }, options: options(r, pool.map((x) => SH(x, 'biru')), SH(s, 'biru'), Math.min(4, nOpts(L) + 1)), answer: SH(s, 'biru') });
    },
    kelasWarna(r, L) {
      const k = L < 30 ? 2 : 3;
      const cs = r.sample(basicColors(L), k);
      const per = L < 20 ? 2 : 3;
      const items = cs.flatMap((c) => r.sample(C.COLOR_OBJECTS[c.id], per).map((e) => ({ e, bin: c.id })));
      return sortRound({ skill: 'warna.kelas', say: 'Masukkan setiap objek ke dalam bakul warna yang sama.', bins: cs.map((c) => ({ id: c.id, n: c.n, html: `<span style="display:inline-block;width:34px;height:34px;border-radius:50%;background:${c.hex}"></span>` })), items, rng: r });
    },
    kelasBentuk(r, L) {
      const ss = r.sample(basicShapes(L), L < 35 ? 2 : 3);
      const cols = ['merah', 'biru', 'hijau', 'kuning', 'oren', 'ungu'];
      const items = ss.flatMap((s) => r.sample(cols, 3).map((col) => ({ shape: s.id, color: col, bin: s.id, say: s.n })));
      return sortRound({ skill: 'warna.kelas', say: 'Kelaskan mengikut bentuk.', bins: ss.map((s) => ({ id: s.id, n: s.n, html: C.shapeSvg(s.id, '#cfc4e3', '34px') })), items, rng: r });
    },
    corak(r, L) {
      const kind = L < 20 ? 'AB' : L < 35 ? r.pick(['AB', 'AAB', 'ABB']) : r.pick(['ABC', 'AAB', 'ABB', 'ABC']);
      const useShape = L >= 15 && r.chance(0.5);
      const cs = r.sample(basicColors(30), 3);
      const mk = (c) => (useShape ? { shape: r2shape, color: c.id } : { swatch: c.id });
      const r2shape = r.pick(['bulatan', 'bintang', 'hati', 'segitiga']);
      const unit = kind.split('').map((ch) => cs['ABC'.indexOf(ch)]);
      const seqLen = unit.length * 2 + (L > 30 ? 1 : 0);
      const seq = Array.from({ length: seqLen }, (_, i) => unit[i % unit.length]);
      const next = unit[seqLen % unit.length];
      const opts = r.shuffle(cs.slice(0, Math.max(2, new Set(unit).size + (L > 20 ? 1 : 0))).map((c) => ({ ...mk(c), id: c.id })));
      if (!opts.find((o) => o.id === next.id)) opts[0] = { ...mk(next), id: next.id };
      return choiceRound({ skill: 'corak.warna', say: 'Apakah yang seterusnya dalam corak ini?', show: { k: 'strip', items: [...seq.map(mk), '?'] }, options: opts, answer: opts.find((o) => o.id === next.id) });
    },
  },
  tiers: [
    ['warnaKenal', 'bentukKenal', 'warnaCari', 'warnaKenal', 'bentukKenal', 'corak'],
    ['warnaCari', 'bentukPadan', 'kelasWarna', 'corak', 'bentukKenal'],
    ['kelasWarna', 'bentukObjek', 'corak', 'bentukPadan', 'warnaSemua', 'kelasBentuk'],
    ['warnaSemua', 'kelasBentuk', 'corak', 'bentukObjek', 'kelasWarna', 'bentukPadan'],
    ['corak', 'kelasWarna', 'kelasBentuk', 'warnaSemua', 'bentukObjek', 'bentukPadan'],
  ],
};

// ============================ MOD 4: TEKA BUNYI ============================
const sndFace = (s) => F(s.e, s.n, null, s.n);
const sndPool = (L) => C.SOUNDS.filter((s) => (L <= 10 ? s.cat === 'haiwan' : L <= 20 ? ['haiwan', 'kenderaan'].includes(s.cat) : true));
export const bunyi = {
  id: 'bunyi', n: 'Teka Bunyi', e: '🎵', c: '#48dbfb', char: 'coco',
  skills: { 'bunyi.haiwan': 'Bunyi haiwan', 'bunyi.kenderaan': 'Bunyi kenderaan', 'bunyi.alam': 'Bunyi alam & sekeliling', 'bunyi.padan': 'Padan audio dengan gambar' },
  gens: {
    teka(r, L, opt = {}) {
      const pool = opt.cat ? C.SOUNDS.filter((s) => s.cat === opt.cat) : sndPool(L);
      const s = r.pick(pool);
      const skill = s.cat === 'haiwan' ? 'bunyi.haiwan' : s.cat === 'kenderaan' ? 'bunyi.kenderaan' : 'bunyi.alam';
      const same = L < 25 ? pool.filter((x) => x.cat === s.cat) : C.SOUNDS;
      return choiceRound({ skill, say: 'Dengar baik-baik. Bunyi apakah ini?', show: { k: 'sound', id: s.id, ono: s.ono, withOno: L <= 15 }, options: options(r, same.map(sndFace), sndFace(s), Math.min(nOpts(L) + (L <= 4 ? 0 : 1), 6)), answer: sndFace(s), sayOnTap: true });
    },
    haiwan(r, L) { return bunyi.gens.teka(r, L, { cat: 'haiwan' }); },
    kenderaan(r, L) { return bunyi.gens.teka(r, L, { cat: 'kenderaan' }); },
    alam(r, L) { const rd = bunyi.gens.teka(r, L, { cat: r.pick(['alam', 'rumah']) }); return rd; },
    sebutan(r, L) {
      const pool = sndPool(L).filter((s) => s.cat === 'haiwan');
      const s = r.pick(pool);
      return choiceRound({ skill: 'bunyi.haiwan', say: `Siapa yang berbunyi "${s.ono}"`, show: { k: 'big', e: '🗣️', say: s.ono }, options: options(r, pool.map(sndFace), sndFace(s), nOpts(L) + 1), answer: sndFace(s) });
    },
    jenis(r, L) {
      const s = r.pick(C.SOUNDS);
      const cats = [{ id: 'haiwan', e: '🐾', lbl: 'Haiwan' }, { id: 'kenderaan', e: '🚗', lbl: 'Kenderaan' }, { id: 'alam', e: '🌦️', lbl: 'Alam' }, { id: 'rumah', e: '🏠', lbl: 'Sekeliling' }];
      const use = L < 35 ? cats.filter((c) => ['haiwan', 'kenderaan'].includes(c.id) || c.id === s.cat) : cats;
      return choiceRound({ skill: 'bunyi.padan', say: 'Ini bunyi haiwan, kenderaan, alam atau benda di sekeliling?', show: { k: 'sound', id: s.id, ono: s.ono, withOno: false }, options: use, answer: use.find((c) => c.id === s.cat), sayOnTap: true });
    },
    padan(r, L) {
      const k = L < 35 ? 2 : 3;
      const ss = uniqBy(r, sndPool(L), k, (x) => x.id);
      return matchRound({ skill: 'bunyi.padan', say: 'Tekan 🔊 untuk dengar, kemudian seret gambar kepada bunyi yang betul.', pairs: ss.map((s, i) => [sndFace(s), { e: '🔊', lbl: `Bunyi ${i + 1}`, sound: s.id }]), rng: r });
    },
  },
  tiers: [
    ['haiwan', 'haiwan', 'haiwan', 'sebutan'],
    ['teka', 'haiwan', 'kenderaan', 'sebutan', 'teka'],
    ['teka', 'kenderaan', 'alam', 'jenis', 'padan'],
    ['teka', 'alam', 'jenis', 'padan', 'kenderaan'],
    ['teka', 'padan', 'jenis', 'alam', 'teka'],
  ],
};

// ============================ MOD 5: PUZZLE PINTAR ============================
const PIECES = [[1, 2], [2, 2], [2, 3], [3, 3], [3, 4]];
export const puzzle = {
  id: 'puzzle', n: 'Puzzle Pintar', e: '🧩', c: '#1dd1a1', char: 'dino',
  rounds: (L) => (L <= 10 ? 2 : L <= 30 ? 2 : 3),
  skills: { 'puzzle.susun': 'Menyusun puzzle', 'puzzle.lengkap': 'Melengkapkan gambar hilang' },
  gens: {
    jigsaw(r, L) {
      const lvl = L <= 5 ? 0 : L <= 14 ? 1 : L <= 26 ? 2 : L <= 40 ? 3 : 4;
      const [rows, cols] = PIECES[lvl];
      const pic = r.pick(C.PUZZLE_PICS);
      const n = rows * cols;
      const n2 = n === 2 ? '2' : n;
      return { type: 'puzzle', skill: 'puzzle.susun', say: `Susun ${n2} keping puzzle "${pic.n}".`, pic, rows, cols, ghost: L <= 20, order: r.shuffle([...Array(n).keys()]) };
    },
    hilang(r, L) {
      const [rows, cols] = L <= 20 ? [2, 2] : L <= 40 ? [3, 3] : [3, 4];
      const pic = r.pick(C.PUZZLE_PICS);
      const n = rows * cols;
      const hole = r.int(0, n - 1);
      const k = L <= 20 ? 3 : 4;
      const others = r.shuffle([...Array(n).keys()].filter((i) => i !== hole)).slice(0, Math.ceil((k - 1) / 2)).map((idx) => ({ pic, idx }));
      const otherPics = r.sample(C.PUZZLE_PICS.filter((p) => p !== pic), k - 1 - others.length).map((p) => ({ pic: p, idx: hole }));
      const opts = r.shuffle([{ pic, idx: hole, correct: true }, ...others, ...otherPics]);
      return { type: 'puzzle', variant: 'missing', skill: 'puzzle.lengkap', say: 'Satu bahagian gambar hilang. Pilih kepingan yang betul!', pic, rows, cols, hole, options: opts };
    },
  },
  tiers: [['jigsaw', 'jigsaw', 'hilang'], ['jigsaw', 'hilang', 'jigsaw'], ['jigsaw', 'hilang'], ['jigsaw', 'hilang', 'jigsaw'], ['jigsaw', 'hilang', 'jigsaw']],
};

// ============================ MOD 6: INGATAN HEBAT ============================
const MEM_POOL = [...C.ANIMALS.map((a) => F(a.e, a.n, a.en, a.n)), ...C.FRUITS.map((f) => F(f.e, f.n, f.en, f.n))];
export const ingatan = {
  id: 'ingatan', n: 'Ingatan Hebat', e: '🧠', c: '#a77bff', char: 'lala',
  skills: { 'ingat.pasangan': 'Mencari pasangan gambar', 'ingat.kedudukan': 'Mengingat kedudukan', 'ingat.hilang': 'Mengenal gambar hilang', 'ingat.susunan': 'Mengingat susunan warna & bentuk' },
  gens: {
    kad(r, L) {
      const pairs = L <= 5 ? 2 : L <= 12 ? 3 : L <= 22 ? 4 : L <= 32 ? 5 : L <= 42 ? 6 : 8;
      const items = uniqBy(r, MEM_POOL, pairs, (x) => x.e).map((f) => ({ ...f, lbl: undefined }));
      return memoryRound({ skill: 'ingat.pasangan', say: 'Buka kad dan cari pasangan gambar yang sama.', pairs: items.map((f) => [f]), rng: r, peek: L <= 10 ? 2000 : L <= 25 ? 1200 : 0 });
    },
    kedudukan(r, L) {
      const [cols, rowsN] = L <= 10 ? [2, 2] : L <= 25 ? [3, 2] : L <= 40 ? [3, 3] : [4, 3];
      const cells = cols * rowsN;
      const k = Math.min(cells, L <= 10 ? 2 : L <= 25 ? 3 : L <= 40 ? 4 : 5);
      const items = uniqBy(r, MEM_POOL, k, (x) => x.e);
      const pos = r.sample([...Array(cells).keys()], k);
      const grid = Array(cells).fill(null);
      pos.forEach((p, i) => { grid[p] = items[i]; });
      const ask = r.sample(pos, Math.min(k, L <= 15 ? 1 : L <= 35 ? 2 : 3));
      return { type: 'recall', variant: 'where', skill: 'ingat.kedudukan', say: 'Ingat di mana setiap gambar berada!', grid, cols, ask, showMs: L <= 10 ? 4000 : L <= 30 ? 3500 : 3000 };
    },
    hilang(r, L) {
      const k = L <= 10 ? 3 : L <= 25 ? 4 : L <= 40 ? 5 : 6;
      const items = uniqBy(r, MEM_POOL, k, (x) => x.e).map((f) => ({ ...f, lbl: undefined }));
      const missing = r.int(0, k - 1);
      const extra = uniqBy(r, MEM_POOL.filter((x) => !items.find((y) => y.e === x.e)), Math.min(nOpts(L), 4) - 1, (x) => x.e);
      const opts = r.shuffle([items[missing], ...extra]).map((f) => ({ ...f, id: f.e }));
      return { type: 'recall', variant: 'missing', skill: 'ingat.hilang', say: 'Ingat semua gambar. Nanti satu akan hilang!', items, missing, options: opts, answer: items[missing].e, showMs: L <= 15 ? 4000 : 3500 };
    },
    simon(r, L) {
      const useShape = L >= 25 && r.chance(0.5);
      const nP = L <= 20 ? 3 : 4;
      const cols = r.sample(['merah', 'biru', 'kuning', 'hijau', 'ungu', 'oren'], nP);
      const shapes = r.sample(['bulatan', 'segitiga', 'bintang', 'hati', 'segiempat'], nP);
      const pads = cols.map((c, i) => ({ color: c, shape: useShape ? shapes[i] : null }));
      const len = L <= 10 ? 2 : L <= 25 ? 3 : L <= 40 ? 4 : 5;
      const seq = Array.from({ length: len }, () => r.int(0, nP - 1));
      return { type: 'simon', skill: 'ingat.susunan', say: useShape ? 'Perhatikan susunan bentuk yang menyala, kemudian ulang.' : 'Perhatikan susunan warna yang menyala, kemudian ulang.', pads, seq };
    },
    susunan(r, L) {
      const k = L <= 20 ? 3 : L <= 40 ? 4 : 5;
      const items = uniqBy(r, MEM_POOL, k, (x) => x.e).map((f, i) => ({ ...f, lbl: undefined, v: 'm' + i }));
      return { type: 'recall', variant: 'order', skill: 'ingat.susunan', say: 'Ingat susunan gambar ini!', items, tiles: r.shuffle(items.map((f) => ({ v: f.v, face: f }))), showMs: L <= 20 ? 4500 : 4000 };
    },
  },
  tiers: [
    ['kad', 'kedudukan', 'hilang', 'simon'],
    ['kad', 'kedudukan', 'hilang', 'simon', 'susunan'],
    ['kad', 'simon', 'susunan', 'kedudukan', 'hilang'],
    ['kad', 'simon', 'susunan', 'kedudukan', 'hilang'],
    ['kad', 'simon', 'susunan', 'kedudukan', 'hilang'],
  ],
};

// ============================ MOD 7: SENI DAN MEWARNA ============================
export const seni = {
  id: 'seni', n: 'Seni & Mewarna', e: '🖍️', c: '#ff8fab', char: 'mimi',
  rounds: (L) => (L <= 20 ? 2 : 3),
  skills: { 'seni.warna': 'Mewarna mengikut arahan', 'seni.titik': 'Sambung titik', 'seni.lukis': 'Melukis dengan jari', 'seni.campur': 'Kombinasi warna', 'seni.surih': 'Menyurih garisan' },
  gens: {
    warnakan(r, L) {
      const group = ['buah', 'haiwan', 'kenderaan', 'lain'][(L - 1) % 4];
      const art = r.pick(COLORING.filter((a) => a.group === group));
      const k = Math.min(art.regions.length, L <= 10 ? 1 : L <= 20 ? 2 : L <= 35 ? 3 : art.regions.length);
      const regs = r.sample(art.regions, k);
      return { type: 'color', skill: 'seni.warna', say: `Mari mewarna ${art.n.toLowerCase()}!`, art: art.id, guided: regs.map((g) => ({ region: g.id, color: g.want })) };
    },
    bebas(r, L) {
      const art = r.pick(COLORING);
      return { type: 'color', skill: 'seni.warna', say: `Warnakan ${art.n.toLowerCase()} ikut warna kegemaran kamu!`, art: art.id, guided: [] };
    },
    titik(r, L) {
      const pool = L <= 10 ? DOT_SHAPES.slice(0, 4) : L <= 25 ? DOT_SHAPES.slice(0, 8) : DOT_SHAPES;
      const s = r.pick(pool);
      const n = Math.max(s.poly.length, L <= 10 ? s.poly.length : lerp(L, 6, 20));
      return { type: 'dots', skill: 'seni.titik', say: 'Sambung titik mengikut nombor. Apa gambarnya?', shape: s.id, n: Math.min(n, 20) };
    },
    surih(r, L) {
      const pool = L <= 10 ? TRACE.filter((t) => ['bulatan', 'segitiga', 'segiempat', 'gelombang', 'zigzag', 'I', 'L', 'O'].includes(t.id)) : TRACE;
      const t = r.pick(pool);
      return { type: 'trace', skill: 'seni.surih', say: `Surih ${t.n} dengan jari kamu.`, trace: t.id };
    },
    lukis(r, L) {
      const ideas = [['☀️', 'Lukis matahari yang ceria!'], ['🌈', 'Lukis pelangi yang berwarna-warni!'], ['🏠', 'Lukis rumah kamu!'], ['🌸', 'Lukis sekuntum bunga!'], ['🐟', 'Lukis seekor ikan!'], ['🎈', 'Lukis belon!'], ['🌳', 'Lukis sebatang pokok!'], ['🍎', 'Lukis sebiji epal!'], ['😊', 'Lukis muka yang tersenyum!'], ['⭐', 'Lukis bintang di langit!']];
      const [ref, prompt] = r.pick(ideas);
      return { type: 'draw', skill: 'seni.lukis', say: prompt, prompt, ref, minInk: 900 };
    },
    campur(r, L) {
      const m = r.pick(C.COLOR_MIX);
      const pool = C.COLORS.filter((c) => ['oren', 'hijau', 'ungu', 'merahjambu', 'coklat', 'biru', 'merah'].includes(c.id));
      const ans = C.colorById(m.r);
      const a = C.colorById(m.a).n.toLowerCase(), b = C.colorById(m.b).n.toLowerCase();
      return choiceRound({ skill: 'seni.campur', say: `Jika warna ${a} dicampur dengan ${b}, kita dapat warna apa?`, show: { k: 'mix', a: m.a, b: m.b }, options: options(r, pool.map(SW), SW(ans), L < 35 ? 3 : 4), answer: SW(ans) });
    },
  },
  tiers: [
    ['warnakan', 'titik', 'surih', 'warnakan'],
    ['warnakan', 'titik', 'bebas', 'surih', 'lukis'],
    ['warnakan', 'campur', 'titik', 'surih', 'lukis'],
    ['warnakan', 'campur', 'titik', 'bebas', 'surih'],
    ['warnakan', 'titik', 'campur', 'surih', 'lukis', 'bebas'],
  ],
};

// ============================ MOD 8: CARI BAYANG ============================
const SIL_POOL = [...C.ANIMALS.map((a) => F(a.e, a.n, a.en)), ...C.VEHICLES.map((v) => F(v.e, v.n, v.en)), ...C.FRUITS.map((f) => F(f.e, f.n, f.en))]
  .filter((f) => !['🐟', '🦐', '🍇', '🫐', '🍒', '🦑', '🚕', '🎈'].includes(f.e));
export const bayang = {
  id: 'bayang', n: 'Cari Bayang', e: '👤', c: '#576574', char: 'bobo',
  skills: { 'bayang.padan': 'Padan gambar & bayang', 'bayang.siluet': 'Mengenal siluet', 'bayang.sembunyi': 'Mencari objek tersembunyi', 'bayang.beza': 'Mencari perbezaan' },
  gens: {
    siluet(r, L) {
      const a = r.pick(SIL_POOL);
      return choiceRound({ skill: 'bayang.siluet', say: 'Bayang siapakah ini?', show: { k: 'big', e: a.e, sil: true }, options: options(r, SIL_POOL, a, nOpts(L) + 1), answer: a, sayOnTap: true });
    },
    pilihBayang(r, L) {
      const a = r.pick(SIL_POOL);
      const opts = options(r, SIL_POOL, a, nOpts(L) + 1).map((x) => ({ e: x.e, sil: true }));
      return choiceRound({ skill: 'bayang.padan', say: `Cari bayang ${a.lbl.toLowerCase()}!`, show: { k: 'big', e: a.e, say: a.lbl }, options: opts, answer: { e: a.e } });
    },
    padan(r, L) {
      const k = L <= 15 ? 2 : L <= 30 ? 3 : 4;
      const items = uniqBy(r, SIL_POOL, k, (x) => x.e);
      return matchRound({ skill: 'bayang.padan', say: 'Seret gambar kepada bayangnya.', pairs: items.map((a) => [{ e: a.e, say: a.lbl }, { e: a.e, sil: true }]), rng: r });
    },
    sembunyi(r, L) {
      const k = L <= 10 ? 1 : L <= 25 ? 2 : L <= 40 ? 3 : 4;
      const t = r.pick(SIL_POOL);
      const deco = SIL_POOL.filter((x) => x.e !== t.e).map((x) => x.e);
      const items = scatter(r, k, t.e, deco, L <= 10 ? 6 : L <= 30 ? 12 : 18, L <= 20 ? 9 : 7, L <= 20 ? 12 : 10, { opTarget: L > 35 ? 0.75 : 1 });
      const bg = r.pick([['#e0f7fa', '#c8e6c9'], ['#fff3e0', '#ffe0b2'], ['#ede7f6', '#d1c4e9'], ['#e3f2fd', '#bbdefb']]);
      return { type: 'find', skill: 'bayang.sembunyi', say: k === 1 ? `Cari ${t.lbl.toLowerCase()} yang tersembunyi!` : `Cari ${k} ${t.lbl.toLowerCase()} yang tersembunyi!`, bg, items, targetE: t.e };
    },
    beza(r, L) {
      const [cols, cells] = L <= 15 ? [2, 4] : L <= 30 ? [3, 9] : [4, 12];
      const nd = L <= 25 ? 1 : L <= 40 ? 2 : 3;
      const base = uniqBy(r, SIL_POOL, cells, (x) => x.e).map((x) => x.e);
      const right = base.slice();
      const diffs = r.sample([...Array(cells).keys()], nd);
      const spare = SIL_POOL.map((x) => x.e).filter((e) => !base.includes(e));
      diffs.forEach((d, i) => { right[d] = spare[(i + r.int(0, 5)) % spare.length]; });
      return { type: 'diff', skill: 'bayang.beza', say: nd === 1 ? 'Cari satu perbezaan antara dua gambar.' : `Cari ${nd} perbezaan antara dua gambar.`, cols, left: base, right, diffs };
    },
    lainSendiri(r, L) {
      const a = r.pick(SIL_POOL);
      const n = Math.min(6, nOpts(L) + 1);
      const variant = L <= 20 ? 'other' : r.pick(['flip', 'other', 'rot']);
      const odd = variant === 'other' ? { e: r.pick(SIL_POOL.filter((x) => x.e !== a.e)).e, id: 'odd' } : variant === 'flip' ? { e: a.e, flip: true, id: 'odd' } : { e: a.e, rot: 90, id: 'odd' };
      const opts = r.shuffle([odd, ...Array.from({ length: n - 1 }, (_, i) => ({ e: a.e, id: 's' + i }))]);
      return { type: 'choice', skill: 'bayang.beza', say: variant === 'other' ? 'Mana satu yang berbeza?' : 'Perhatikan betul-betul. Mana satu yang berbeza?', options: opts.map((o) => ({ ...o, sil: L > 30 })), answer: 'odd' };
    },
  },
  tiers: [
    ['siluet', 'pilihBayang', 'sembunyi', 'lainSendiri'],
    ['siluet', 'padan', 'sembunyi', 'beza', 'pilihBayang'],
    ['padan', 'sembunyi', 'beza', 'siluet', 'lainSendiri'],
    ['padan', 'sembunyi', 'beza', 'lainSendiri', 'pilihBayang'],
    ['padan', 'beza', 'sembunyi', 'siluet', 'lainSendiri'],
  ],
};
