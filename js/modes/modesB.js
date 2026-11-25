// Mod 9–15: Maze Pengembaraan, Kehidupan Harian, Bijak Mengelaskan, Si Cilik Soleh, Dunia Haiwan, Asah Minda, Misi Pengembaraan
import * as C from '../data/content.js';
import { tier, nOpts, lerp, F, T, options, choiceRound, multiRound, slotsRound, matchRound, sortRound, memoryRound, uniqBy, groupHtml, pencilHtml, ribbonHtml } from './helpers.js';
import { genMaze, bfs } from '../engines/maze.js';
import { scatter } from './modesA.js';

// ============================ MOD 9: MAZE PENGEMBARAAN ============================
const MAZE_THEMES = [
  { hero: '🐰', goal: '🥕', say: 'Jom tolong arnab cari lobak!', item: '🍓', itemN: 'strawberi', rock: '🪨', rockN: 'batu', bg: '#f1ffe9' },
  { hero: '🐱', goal: '🏠', say: 'Jom tolong kucing balik ke rumah!', item: '🐟', itemN: 'ikan', rock: '🌵', rockN: 'kaktus', bg: '#fff7e6' },
  { hero: '🐝', goal: '🌸', say: 'Jom tolong lebah terbang ke bunga!', item: '🍯', itemN: 'madu', rock: '🕸️', rockN: 'sarang labah-labah', bg: '#fffbe0' },
  { hero: '🐶', goal: '🦴', say: 'Jom tolong anjing cari tulang!', item: '⚽', itemN: 'bola', rock: '🪨', rockN: 'batu', bg: '#f3f8ff' },
  { hero: '🐒', goal: '🍌', say: 'Jom tolong monyet ambil pisang!', item: '🥥', itemN: 'kelapa', rock: '🪵', rockN: 'kayu', bg: '#eefcef' },
  { hero: '🐭', goal: '🧀', say: 'Jom tolong tikus cari keju!', item: '🌰', itemN: 'kacang', rock: '🪤', rockN: 'perangkap', bg: '#fff3f3' },
  { hero: '🐧', goal: '🐟', say: 'Jom tolong penguin ambil ikan!', item: '❄️', itemN: 'kepingan salji', rock: '🧊', rockN: 'ketulan ais', bg: '#eef9ff' },
  { hero: '🐸', goal: '🪷', say: 'Jom tolong katak lompat ke daun teratai!', item: '🦟', itemN: 'nyamuk', rock: '🪨', rockN: 'batu', bg: '#eafff6' },
  { hero: '🚗', goal: '🏁', say: 'Jom pandu kereta sampai ke garisan penamat!', item: '⛽', itemN: 'minyak', rock: '🚧', rockN: 'penghadang jalan', bg: '#f4f4f8' },
  { hero: '🐢', goal: '🌊', say: 'Jom tolong kura-kura balik ke laut!', item: '🐚', itemN: 'kulit kerang', rock: '🦀', rockN: 'ketam', bg: '#fdf6e3' },
  { hero: '🐻', goal: '🍯', say: 'Jom tolong beruang cari madu!', item: '🍓', itemN: 'strawberi', rock: '🌲', rockN: 'pokok', bg: '#fff8ec' },
  { hero: '🐼', goal: '🎋', say: 'Jom tolong panda ambil buluh!', item: '🍃', itemN: 'daun', rock: '🪨', rockN: 'batu', bg: '#f2fff2' },
];
export const maze = {
  id: 'maze', n: 'Maze Pengembaraan', e: '🧭', c: '#ff9f43', char: 'coco',
  rounds: (L) => (L <= 10 ? 3 : 2),
  skills: { 'maze.laluan': 'Menyelesaikan laluan', 'maze.halangan': 'Mengelakkan halangan', 'maze.kutip': 'Mengumpul objek dalam laluan' },
  gens: {
    laluan(r, L) {
      const th = r.pick(MAZE_THEMES);
      const walls = L > 10;
      const size = L <= 3 ? 3 : L <= 10 ? 4 + Math.floor((L - 4) / 4) : L <= 20 ? 4 + Math.floor((L - 11) / 5) : L <= 30 ? 5 + Math.floor((L - 21) / 5) : L <= 40 ? 6 + Math.floor((L - 31) / 5) : 7 + Math.floor((L - 41) / 5);
      const w = size, hh = size;
      const seed = r.int(1, 1e9);
      const nItems = L <= 20 ? 0 : L <= 30 ? 1 : L <= 40 ? 2 : 3;
      const nRocks = walls ? 0 : L <= 3 ? 1 : Math.min(Math.floor(w * hh * 0.18), 2 + Math.floor(L / 3));
      const start = [0, 0], goal = [w - 1, hh - 1];
      const wallGrid = walls ? genMaze(w, hh, seed) : null;
      // pilih halangan supaya laluan masih wujud
      let rocks = [], tries = 0;
      const rd = { w, h: hh };
      while (tries++ < 60) {
        const cand = r.sample([...Array(w * hh).keys()].map((i) => [i % w, Math.floor(i / w)]).filter(([x, y]) => !(x === 0 && y === 0) && !(x === w - 1 && y === hh - 1)), nRocks);
        const set = new Set(cand.map(([x, y]) => `${x},${y}`));
        const p = bfs(rd, wallGrid, set, start, goal);
        if (p && (nRocks === 0 || p.length > w)) { rocks = cand; break; }
      }
      const rockSet = new Set(rocks.map(([x, y]) => `${x},${y}`));
      const free = [...Array(w * hh).keys()].map((i) => [i % w, Math.floor(i / w)]).filter(([x, y]) => !rockSet.has(`${x},${y}`) && !(x === 0 && y === 0) && !(x === w - 1 && y === hh - 1));
      const items = r.sample(free, nItems).filter((p) => bfs(rd, wallGrid, rockSet, start, p));
      const skill = nItems ? 'maze.kutip' : walls ? 'maze.laluan' : 'maze.halangan';
      const say = nItems ? `${th.say} Kutip semua ${th.itemN} dulu, ya.` : walls ? th.say : `${th.say} Jangan langgar ${th.rockN}, ya.`;
      return { type: 'maze', skill, say, w, h: hh, walls, seed, rocks, items, start, goal, hero: th.hero, goalE: th.goal, itemE: th.item, itemN: th.itemN, rockE: th.rock, bg: th.bg };
    },
  },
  tiers: [['laluan'], ['laluan'], ['laluan'], ['laluan'], ['laluan']],
};

// ============================ MOD 10: KEHIDUPAN HARIAN ============================
export const harian = {
  id: 'harian', n: 'Kehidupan Harian', e: '🏡', c: '#10ac84', char: 'bobo',
  skills: { 'harian.badan': 'Anggota badan', 'harian.pakaian': 'Pakaian', 'harian.makanan': 'Makanan berkhasiat', 'harian.rutin': 'Menyusun aktiviti harian', 'harian.kebersihan': 'Kebersihan diri', 'harian.masa': 'Rutin & masa' },
  gens: {
    badan(r, L) {
      const b = r.pick(C.BODY);
      return choiceRound({ skill: 'harian.badan', say: `Mana ${b.n.toLowerCase()}? Tunjukkan.`, options: options(r, C.BODY.map((x) => F(x.e, x.n, x.en)), F(b.e, b.n, b.en), nOpts(L) + 1), answer: F(b.e, b.n, b.en) });
    },
    fungsi(r, L) {
      const b = r.pick(C.BODY);
      return choiceRound({ skill: 'harian.badan', say: `Kita ${b.fn} dengan apa?`, options: options(r, C.BODY.map((x) => F(x.e, x.n, x.en)), F(b.e, b.n, b.en), nOpts(L) + 1), answer: F(b.e, b.n, b.en), sayOnTap: true });
    },
    pakaian(r, L) {
      const c = r.pick(C.CLOTHES);
      return choiceRound({ skill: 'harian.pakaian', say: `Mana ${c.n.toLowerCase()}?`, options: options(r, C.CLOTHES.map((x) => F(x.e, x.n, x.en)), F(c.e, c.n, c.en), nOpts(L) + 1), answer: F(c.e, c.n, c.en) });
    },
    cuaca(r, L) {
      const q = r.pick(C.CLOTHES_FOR);
      const yes = r.sample(q.a, L <= 20 ? 1 : 2);
      const no = r.sample(q.no, L <= 20 ? 2 : 3);
      const opts = r.shuffle([...yes, ...no]).map((e) => ({ e, lbl: C.CLOTHES.find((c) => c.e === e)?.n || (e === '☂️' ? 'Payung' : '') }));
      if (yes.length === 1) return choiceRound({ skill: 'harian.pakaian', say: q.q, show: { k: 'big', e: q.e }, options: opts, answer: opts.find((o) => o.e === yes[0]), sayOnTap: true });
      return multiRound({ skill: 'harian.pakaian', say: q.q + ' Pilih semua yang sesuai.', show: { k: 'big', e: q.e }, options: opts, answers: opts.filter((o) => yes.includes(o.e)) });
    },
    pakaianBadan(r, L) {
      const parts = [{ id: 'kepala', e: '🙂', n: 'Kepala' }, { id: 'badan', e: '🧍', n: 'Badan' }, { id: 'tapak', e: '🦶', n: 'Kaki' }, { id: 'tangan', e: '✋', n: 'Tangan' }];
      const use = r.sample(parts, L <= 30 ? 2 : 3);
      const items = use.flatMap((p) => r.sample(C.CLOTHES.filter((c) => c.part === p.id), Math.min(2, C.CLOTHES.filter((c) => c.part === p.id).length)).map((c) => ({ e: c.e, lbl: c.n, bin: p.id })));
      return sortRound({ skill: 'harian.pakaian', say: 'Benda ini dipakai di mana? Tarik ke tempat yang betul.', bins: use.map((p) => ({ id: p.id, e: p.e, n: p.n })), items, rng: r });
    },
    khasiat(r, L) {
      const yes = r.pick(C.HEALTHY);
      const no = r.sample(C.UNHEALTHY, Math.min(nOpts(L), 4) - 1);
      const opts = r.shuffle([yes, ...no]).map((x) => F(x.e, x.n));
      return choiceRound({ skill: 'harian.makanan', say: 'Makanan mana yang elok untuk badan kita?', options: opts, answer: F(yes.e, yes.n), sayOnTap: true });
    },
    kelasMakanan(r, L) {
      const k = L <= 30 ? 3 : 4;
      const items = [...r.sample(C.HEALTHY, k).map((x) => ({ e: x.e, lbl: x.n, bin: 'ya' })), ...r.sample(C.UNHEALTHY, k - 1).map((x) => ({ e: x.e, lbl: x.n, bin: 'tidak' }))];
      return sortRound({ skill: 'harian.makanan', say: 'Asingkan makanan. Yang berkhasiat, dan yang kurang berkhasiat.', bins: [{ id: 'ya', e: '💪', n: 'Berkhasiat' }, { id: 'tidak', e: '🍬', n: 'Kurang berkhasiat' }], items, rng: r });
    },
    rutin(r, L) {
      const rt = r.pick(C.ROUTINES);
      const n = Math.min(rt.steps.length, L <= 10 ? 3 : L <= 25 ? 4 : 5);
      const steps = rt.steps.slice(0, n).map((s, i) => ({ e: s.e, lbl: s.n, say: s.n, v: 's' + i }));
      return slotsRound({ skill: 'harian.rutin', say: `${rt.n}. Jom susun gambar ikut urutan.`, items: steps, numbered: true, rng: r, given: L <= 15 ? [0] : [] });
    },
    kebersihan(r, L) {
      const q = r.pick(C.HYGIENE);
      const opts = r.shuffle([q.a, ...q.no.slice(0, L <= 10 ? 1 : 2)]).map((x) => F(x.e, x.n));
      return choiceRound({ skill: 'harian.kebersihan', say: q.q, options: opts, answer: F(q.a.e, q.a.n), sayOnTap: true });
    },
    masa(r, L) {
      const q = r.pick(C.TIME_OF_DAY);
      const opts = L <= 20 ? options(r, C.TIME_OPTS, q.a, 3, (x) => x.n) : C.TIME_OPTS;
      return choiceRound({ skill: 'harian.masa', say: q.q, options: opts.map((x) => F(x.e, x.n)), answer: F(q.a.e, q.a.n), sayOnTap: true });
    },
  },
  tiers: [
    ['badan', 'pakaian', 'khasiat', 'kebersihan', 'rutin'],
    ['fungsi', 'cuaca', 'rutin', 'kebersihan', 'masa', 'badan'],
    ['rutin', 'kelasMakanan', 'pakaianBadan', 'fungsi', 'cuaca', 'kebersihan'],
    ['rutin', 'kelasMakanan', 'pakaianBadan', 'masa', 'cuaca', 'fungsi'],
    ['rutin', 'pakaianBadan', 'kelasMakanan', 'cuaca', 'kebersihan', 'masa'],
  ],
};

// ============================ MOD 11: BIJAK MENGELASKAN ============================
export const kelas = {
  id: 'kelas', n: 'Bijak Mengelaskan', e: '🗂️', c: '#5f27cd', char: 'dino',
  skills: { 'kelas.buahsayur': 'Buah & sayur', 'kelas.haiwan': 'Haiwan darat & air', 'kelas.kenderaan': 'Kenderaan darat, udara & air', 'kelas.saiz': 'Besar & kecil', 'kelas.panjang': 'Panjang & pendek', 'kelas.kategori': 'Objek mengikut kategori' },
  gens: {
    buahSayur(r, L) {
      const k = L <= 10 ? 2 : L <= 30 ? 3 : 4;
      const items = [...r.sample(C.FRUITS, k).map((x) => ({ e: x.e, lbl: x.n, bin: 'buah' })), ...r.sample(C.VEGETABLES.filter((v) => v.e !== '🍄'), k).map((x) => ({ e: x.e, lbl: x.n, bin: 'sayur' }))];
      return sortRound({ skill: 'kelas.buahsayur', say: 'Jom asingkan buah dengan sayur.', bins: [{ id: 'buah', e: '🧺', n: 'Buah' }, { id: 'sayur', e: '🥬', n: 'Sayur' }], items, rng: r });
    },
    haiwan(r, L) {
      const three = L > 25;
      const k = L <= 10 ? 2 : 3;
      const bins = [{ id: 'darat', e: '🌳', n: 'Darat' }, { id: 'air', e: '🌊', n: 'Air' }, ...(three ? [{ id: 'udara', e: '☁️', n: 'Udara' }] : [])];
      const items = bins.flatMap((b) => r.sample(C.ANIMALS.filter((a) => a.hab === b.id && !['penguin', 'kurakura', 'katak', 'itik'].includes(a.id)), k).map((a) => ({ e: a.e, lbl: a.n, bin: b.id })));
      return sortRound({ skill: 'kelas.haiwan', say: three ? 'Haiwan ini tinggal di darat, dalam air, atau terbang di udara?' : 'Asingkan haiwan darat dengan haiwan air.', bins, items, rng: r });
    },
    kenderaan(r, L) {
      const three = L > 20;
      const k = L <= 10 ? 2 : 3;
      const bins = [{ id: 'darat', e: '🛣️', n: 'Darat' }, { id: 'udara', e: '☁️', n: 'Udara' }, ...(three ? [{ id: 'air', e: '🌊', n: 'Air' }] : [])];
      const items = bins.flatMap((b) => r.sample(C.VEHICLES.filter((v) => v.way === b.id), k).map((v) => ({ e: v.e, lbl: v.n, bin: b.id })));
      return sortRound({ skill: 'kelas.kenderaan', say: three ? 'Kenderaan ini bergerak di darat, di udara, atau di air?' : 'Asingkan kenderaan darat dengan kenderaan udara.', bins, items, rng: r });
    },
    besarKecil(r, L) {
      const big = r.chance(0.5);
      const k = L <= 15 ? 2 : 3;
      let items;
      for (let i = 0; i < 30; i++) {
        items = r.sample(C.SIZED, k);
        const ss = items.map((x) => x.s).sort((a, b) => a - b);
        if (ss.every((v, j) => j === 0 || v - ss[j - 1] >= 3)) break;
      }
      const target = items.reduce((a, b) => (big ? (b.s > a.s ? b : a) : (b.s < a.s ? b : a)));
      return choiceRound({ skill: 'kelas.saiz', say: big ? (k === 2 ? 'Mana yang lebih besar?' : 'Mana yang paling besar?') : (k === 2 ? 'Mana yang lebih kecil?' : 'Mana yang paling kecil?'), options: items.map((x) => F(x.e, x.n)), answer: F(target.e, target.n), sayOnTap: true });
    },
    saizVisual(r, L) {
      const e = r.pick(['🍎', '🐶', '⚽', '🎈', '🐟', '⭐', '🧸', '🌻']);
      const big = r.chance(0.5);
      const k = L <= 20 ? 3 : 4;
      const scales = r.shuffle([0.45, 0.7, 1, 1.25].slice(0, k));
      const tgt = big ? Math.max(...scales) : Math.min(...scales);
      const opts = scales.map((s, i) => ({ e, scale: s, id: 's' + s }));
      return { type: 'choice', skill: 'kelas.saiz', say: big ? 'Tekan yang paling besar.' : 'Tekan yang paling kecil.', options: opts, answer: 's' + tgt };
    },
    susunSaiz(r, L) {
      const k = L <= 35 ? 3 : 4;
      let items;
      for (let i = 0; i < 40; i++) { items = r.sample(C.SIZED, k); const ss = items.map((x) => x.s).sort((a, b) => a - b); if (ss.every((v, j) => j === 0 || v - ss[j - 1] >= 2)) break; }
      items.sort((a, b) => a.s - b.s);
      return slotsRound({ skill: 'kelas.saiz', say: 'Susun dari yang paling kecil, sampai yang paling besar.', items: items.map((x, i) => ({ e: x.e, say: x.n, v: 'z' + i })), numbered: true, rng: r });
    },
    panjang(r, L) {
      const long = r.chance(0.5);
      const k = L <= 15 ? 2 : 3;
      const lens = r.sample([30, 55, 80, 100], k);
      const tgt = long ? Math.max(...lens) : Math.min(...lens);
      const color = r.pick(['#ffd60a', '#54a0ff', '#4cd18a', '#ff8fab']);
      const asRibbon = r.chance(0.4);
      const opts = lens.map((len) => ({ id: 'l' + len, html: asRibbon ? ribbonHtml(len, color) : pencilHtml(len, color), wide: true }));
      return { type: 'choice', skill: 'kelas.panjang', say: long ? `Mana ${asRibbon ? 'reben' : 'pensel'} yang paling panjang?` : `Mana ${asRibbon ? 'reben' : 'pensel'} yang paling pendek?`, options: opts, answer: 'l' + tgt, wide: true, cols: 1 };
    },
    susunPanjang(r, L) {
      const lens = r.sample([24, 46, 68, 90, 110], L <= 35 ? 3 : 4).sort((a, b) => a - b);
      const color = r.pick(['#ffd60a', '#54a0ff', '#4cd18a']);
      return slotsRound({ skill: 'kelas.panjang', say: 'Susun dari yang paling pendek, sampai yang paling panjang.', items: lens.map((len, i) => ({ html: `<div style="transform:scale(.62);transform-origin:center">${pencilHtml(len, color)}</div>`, v: 'p' + i })), numbered: true, rng: r });
    },
    kategori(r, L) {
      const k = L <= 20 ? 2 : 3;
      const cats = r.sample(Object.entries(C.CATEGORIES), k);
      const per = L <= 30 ? 2 : 3;
      const items = cats.flatMap(([id, c]) => r.sample(c.items, per).map((e) => ({ e, bin: id })));
      return sortRound({ skill: 'kelas.kategori', say: 'Masukkan setiap benda ke dalam kumpulan yang betul.', bins: cats.map(([id, c]) => ({ id, e: c.e, n: c.n })), items, rng: r });
    },
    bukan(r, L) {
      const [[id, c], [, o]] = r.sample(Object.entries(C.CATEGORIES), 2);
      const same = r.sample(c.items, L <= 15 ? 2 : 3);
      const odd = r.pick(o.items);
      return choiceRound({ skill: 'kelas.kategori', say: `Yang mana satu bukan ${c.n.toLowerCase()}?`, options: r.shuffle([...same, odd]).map((e) => ({ e })), answer: { e: odd } });
    },
  },
  tiers: [
    ['buahSayur', 'besarKecil', 'saizVisual', 'panjang', 'haiwan'],
    ['buahSayur', 'haiwan', 'kenderaan', 'besarKecil', 'panjang', 'bukan'],
    ['kategori', 'haiwan', 'kenderaan', 'susunSaiz', 'saizVisual', 'bukan'],
    ['kategori', 'susunSaiz', 'susunPanjang', 'haiwan', 'kenderaan', 'bukan'],
    ['kategori', 'susunPanjang', 'susunSaiz', 'buahSayur', 'kenderaan', 'haiwan'],
  ],
};

// ============================ MOD 12: SI CILIK SOLEH ============================
const AR_FONT = '"Amiri","Scheherazade New","Noto Naskh Arabic","Traditional Arabic",serif';
const HJ = (x) => ({ t: x.a, id: x.n, say: x.n, font: AR_FONT });
const hjPool = (L) => C.HIJAIYAH.slice(0, Math.min(C.HIJAIYAH.length, 6 + L));
const WIDE = (x, i) => ({ e: x.e, lbl: x.n, say: x.n, wide: true, id: x.id ?? x.n });
const DOA_Q = C.DOA.filter((d) => !d.dupOf);
export const soleh = {
  id: 'soleh', n: 'Si Cilik Soleh', e: '🕌', c: '#00b894', char: 'lala',
  skills: { 'soleh.hijaiyah': 'Huruf hijaiyah', 'soleh.nabi': 'Nama nabi', 'soleh.rukunislam': 'Rukun Islam', 'soleh.rukuniman': 'Rukun Iman', 'soleh.wuduk': 'Anggota & langkah wuduk', 'soleh.adab': 'Adab harian', 'soleh.doa': 'Doa harian' },
  gens: {
    hijaiyahSama(r, L) {
      const pool = hjPool(L); const x = r.pick(pool);
      return choiceRound({ skill: 'soleh.hijaiyah', say: `Ini huruf ${x.n}. Cari huruf yang sama!`, show: { k: 'arabic', t: x.a }, options: options(r, pool.map(HJ), HJ(x), nOpts(L) + 1), answer: HJ(x) });
    },
    hijaiyahCari(r, L) {
      const pool = hjPool(L); const x = r.pick(pool);
      return choiceRound({ skill: 'soleh.hijaiyah', say: `Cari huruf ${x.n}!`, show: { k: 'big', e: '🔊', say: `Huruf ${x.n}` }, options: options(r, pool.map(HJ), HJ(x), nOpts(L) + 1), answer: HJ(x) });
    },
    hijaiyahSusun(r, L) {
      const k = L <= 35 ? 3 : 4;
      const pool = hjPool(L);
      const st = r.int(0, pool.length - k);
      const seq = pool.slice(st, st + k);
      return slotsRound({ skill: 'soleh.hijaiyah', say: `Susun huruf hijaiyah mengikut urutan, bermula dengan ${seq[0].n}. Mula dari kanan.`, items: seq.map((x) => ({ ...HJ(x), v: x.n })), text: true, rng: r, given: [0], sep: '10px' });
    },
    hijaiyahMemori(r, L) {
      const k = L <= 35 ? 3 : 4;
      return memoryRound({ skill: 'soleh.hijaiyah', say: 'Cari pasangan huruf hijaiyah yang sama.', pairs: r.sample(hjPool(L), k).map((x) => [HJ(x)]), rng: r, peek: 1500 });
    },
    nabiPertamaAkhir(r, L) {
      const first = r.chance(0.5);
      const ans = first ? 'Adam' : 'Muhammad';
      const pool = C.NABI.map((n) => ({ t: `Nabi ${n}`, say: `Nabi ${n}`, id: n, wide: true }));
      return choiceRound({ skill: 'soleh.nabi', say: first ? 'Siapakah nabi yang pertama?' : 'Siapakah nabi yang terakhir?', options: options(r, pool, pool.find((p) => p.id === ans), 3), answer: pool.find((p) => p.id === ans), sayOnTap: true });
    },
    nabiDengar(r, L) {
      const pool = C.NABI.slice(0, Math.min(25, 8 + L)).map((n) => ({ t: `Nabi ${n}`, say: `Nabi ${n}`, id: n, wide: true }));
      const a = r.pick(pool);
      return choiceRound({ skill: 'soleh.nabi', say: `Cari: ${a.say}.`, show: { k: 'big', e: '🔊', say: a.say }, options: options(r, pool, a, L <= 20 ? 2 : 3), answer: a, sayOnTap: true });
    },
    nabiBilangan(r, L) {
      return choiceRound({ skill: 'soleh.nabi', say: 'Berapakah bilangan nabi dan rasul yang wajib kita ketahui?', show: { k: 'big', e: '📿' }, options: options(r, [5, 6, 10, 25, 30].map((n) => T(n)), T(25), 3), answer: T(25) });
    },
    nabiSusun(r, L) {
      const k = L <= 40 ? 3 : 4;
      const st = r.int(0, Math.min(10, 25 - k));
      const seq = C.NABI.slice(st, st + k);
      return slotsRound({ skill: 'soleh.nabi', say: `Susun nama nabi mengikut urutan, bermula dengan Nabi ${seq[0]}.`, items: seq.map((n) => ({ t: n, say: `Nabi ${n}`, v: n })), numbered: true, rng: r, given: [0] });
    },
    rukunIslamBil(r, L) {
      return choiceRound({ skill: 'soleh.rukunislam', say: 'Rukun Islam ada berapa perkara?', show: { k: 'big', e: '🕌' }, options: options(r, [3, 4, 5, 6].map((n) => T(n)), T(5), 3), answer: T(5) });
    },
    rukunIslamKe(r, L) {
      const i = L <= 20 ? 0 : r.int(0, 4);
      const ans = C.RUKUN_ISLAM[i];
      const pool = [...C.RUKUN_ISLAM, ...C.RUKUN_IMAN.slice(1)].map(WIDE);
      return choiceRound({ skill: 'soleh.rukunislam', say: `Apakah rukun Islam yang ${['pertama', 'kedua', 'ketiga', 'keempat', 'kelima'][i]}?`, options: options(r, i === 0 ? pool : C.RUKUN_ISLAM.map(WIDE), WIDE(ans), 3), answer: WIDE(ans), sayOnTap: true });
    },
    rukunIslamSusun(r, L) {
      const k = L <= 35 ? 3 : 5;
      const seq = C.RUKUN_ISLAM.slice(0, k);
      return slotsRound({ skill: 'soleh.rukunislam', say: 'Susun rukun Islam mengikut urutan. Tekan gambar untuk dengar.', items: seq.map((x, i) => ({ e: x.e, lbl: x.n, say: x.n, v: 'ri' + i })), numbered: true, rng: r });
    },
    rukunImanBil(r, L) {
      return choiceRound({ skill: 'soleh.rukuniman', say: 'Rukun Iman ada berapa perkara?', show: { k: 'big', e: '💚' }, options: options(r, [4, 5, 6, 7].map((n) => T(n)), T(6), 3), answer: T(6) });
    },
    rukunImanKe(r, L) {
      const i = L <= 25 ? 0 : r.int(0, 5);
      const ans = C.RUKUN_IMAN[i];
      return choiceRound({ skill: 'soleh.rukuniman', say: `Apakah rukun Iman yang ${['pertama', 'kedua', 'ketiga', 'keempat', 'kelima', 'keenam'][i]}?`, options: options(r, C.RUKUN_IMAN.map(WIDE), WIDE(ans), 3), answer: WIDE(ans), sayOnTap: true });
    },
    rukunImanSusun(r, L) {
      const k = L <= 40 ? 4 : 6;
      const seq = C.RUKUN_IMAN.slice(0, k);
      return slotsRound({ skill: 'soleh.rukuniman', say: 'Susun rukun Iman mengikut urutan. Tekan gambar untuk dengar.', items: seq.map((x, i) => ({ e: x.e, lbl: x.n, say: x.n, v: 'rm' + i })), numbered: true, rng: r });
    },
    wudukAnggota(r, L) {
      const yes = r.sample(C.WUDUK_PARTS.filter((x) => x.yes), L <= 20 ? 2 : 3);
      const no = r.sample(C.WUDUK_PARTS.filter((x) => !x.yes), L <= 20 ? 2 : 3);
      const opts = r.shuffle([...yes, ...no]).map((x) => F(x.e, x.n));
      return multiRound({ skill: 'soleh.wuduk', say: 'Pilih semua anggota yang kita basuh atau sapu semasa berwuduk.', options: opts, answers: yes.map((x) => F(x.e, x.n)), sayOnTap: true });
    },
    wudukSusun(r, L) {
      const k = L <= 20 ? 3 : 4;
      return slotsRound({ skill: 'soleh.wuduk', say: 'Susun langkah berwuduk mengikut tertib. Tekan gambar untuk dengar.', items: C.WUDUK.slice(0, k).map((x, i) => ({ e: x.e, lbl: x.n, say: x.n, v: 'w' + i })), numbered: true, rng: r, given: L <= 15 ? [0] : [] });
    },
    adab(r, L) {
      const q = r.pick(C.ADAB);
      const opts = [q.a, ...q.no].map((x, i) => ({ ...F(x.e, x.n), id: (q.keyed ? (x === q.a ? 'a' : 'n') : '') + x.n }));
      const ans = opts[0];
      return { type: 'choice', skill: 'soleh.adab', say: q.q, options: r.shuffle(opts), answer: ans.id, sayOnTap: true };
    },
    doaBila(r, L) {
      const d = r.pick(DOA_Q.filter((x) => (L <= 20 ? ['bismillah', 'lepasmakan', 'tidur', 'ilmu', 'keluartandas'].includes(x.id) : true)));
      const pool = DOA_Q.map((x) => ({ e: x.e, lbl: x.sit, say: x.sit, id: x.id, wide: true }));
      return choiceRound({ skill: 'soleh.doa', say: `Bila kita baca doa ini? Maksudnya: ${d.makna}.`, show: { k: 'doa', ar: d.ar, rumi: d.rumi, makna: d.makna, src: d.src }, options: options(r, pool, pool.find((p) => p.id === d.id), L <= 25 ? 2 : 3), answer: pool.find((p) => p.id === d.id), sayOnTap: true });
    },
    doaPilih(r, L) {
      const d = r.pick(DOA_Q);
      const pool = DOA_Q.map((x) => ({ t: x.rumi, id: x.id, wide: true, say: x.makna }));
      return choiceRound({ skill: 'soleh.doa', say: `Pilih doa ${d.sit.toLowerCase()}.`, show: { k: 'big', e: d.e }, options: options(r, pool, pool.find((p) => p.id === d.id), 3), answer: pool.find((p) => p.id === d.id) });
    },
  },
  tiers: [
    ['hijaiyahSama', 'adab', 'rukunIslamBil', 'nabiPertamaAkhir', 'doaBila', 'hijaiyahSama', 'wudukAnggota'],
    ['hijaiyahCari', 'adab', 'rukunIslamKe', 'rukunImanBil', 'wudukSusun', 'doaBila', 'nabiDengar', 'nabiBilangan'],
    ['hijaiyahMemori', 'rukunIslamSusun', 'rukunImanKe', 'wudukAnggota', 'adab', 'doaBila', 'nabiDengar', 'hijaiyahCari'],
    ['hijaiyahSusun', 'rukunImanSusun', 'rukunIslamKe', 'wudukSusun', 'nabiSusun', 'doaPilih', 'adab'],
    ['hijaiyahSusun', 'rukunIslamSusun', 'rukunImanSusun', 'nabiSusun', 'doaPilih', 'doaBila', 'wudukSusun', 'hijaiyahMemori'],
  ],
};

// ============================ MOD 13: DUNIA HAIWAN ============================
const AN = (a) => F(a.e, a.n, a.en, a.n);
export const haiwan = {
  id: 'haiwan', n: 'Dunia Haiwan', e: '🦁', c: '#e17055', char: 'dino',
  skills: { 'haiwan.nama': 'Nama haiwan', 'haiwan.habitat': 'Habitat haiwan', 'haiwan.makanan': 'Makanan haiwan', 'haiwan.anak': 'Anak haiwan', 'haiwan.kelas': 'Mengelaskan haiwan' },
  gens: {
    nama(r, L) {
      const a = r.pick(C.ANIMALS);
      return choiceRound({ skill: 'haiwan.nama', say: `Mana ${a.n.toLowerCase()}?`, show: { k: 'big', e: '🔊', say: a.n }, options: options(r, C.ANIMALS.map(AN), AN(a), nOpts(L) + 1), answer: AN(a) });
    },
    habitat(r, L) {
      const a = r.pick(C.ANIMALS.filter((x) => !['kucing', 'anjing', 'tikus'].includes(x.id) || L > 20));
      const hb = Object.entries(C.HABITATS).map(([id, x]) => ({ id, e: x.e, lbl: x.n, say: x.n }));
      const ans = hb.find((x) => x.id === a.home);
      return choiceRound({ skill: 'haiwan.habitat', say: `${a.n} tinggal di mana, ya?`, show: { k: 'big', e: a.e, say: a.n }, options: options(r, hb, ans, Math.min(4, nOpts(L) + 1)), answer: ans, sayOnTap: true });
    },
    padanHabitat(r, L) {
      const k = L <= 30 ? 3 : 4;
      const as = uniqBy(r, C.ANIMALS, k, (x) => x.home);
      return matchRound({ skill: 'haiwan.habitat', say: 'Jom bawa haiwan balik ke tempat tinggalnya.', pairs: as.map((a) => [{ e: a.e, say: a.n }, { e: C.HABITATS[a.home].e, lbl: C.HABITATS[a.home].n }]), rng: r });
    },
    makanan(r, L) {
      const a = r.pick(C.ANIMALS.filter((x) => ['arnab', 'monyet', 'panda', 'beruang', 'kucing', 'anjing', 'tikus', 'lembu', 'ayam', 'lebah', 'ramarama', 'singa', 'zirafah'].includes(x.id)));
      const fs = Object.entries(C.FOODS).map(([id, x]) => ({ id, e: x.e, lbl: x.n, say: x.n }));
      const ans = fs.find((x) => x.id === a.food);
      return choiceRound({ skill: 'haiwan.makanan', say: `${a.n} suka makan apa, ya?`, show: { k: 'big', e: a.e, say: a.n }, options: options(r, fs, ans, Math.min(4, nOpts(L) + 1)), answer: ans, sayOnTap: true });
    },
    padanMakanan(r, L) {
      const k = L <= 35 ? 3 : 4;
      const as = uniqBy(r, C.ANIMALS.filter((x) => ['arnab', 'monyet', 'panda', 'beruang', 'kucing', 'anjing', 'tikus', 'lembu', 'lebah', 'singa'].includes(x.id)), k, (x) => x.food);
      return matchRound({ skill: 'haiwan.makanan', say: 'Bagi makanan kepada haiwan yang betul.', pairs: as.map((a) => [{ e: C.FOODS[a.food].e, say: C.FOODS[a.food].n }, { e: a.e, lbl: a.n }]), rng: r });
    },
    anak(r, L) {
      const b = r.pick(C.BABIES);
      const opts = options(r, C.BABIES, b, Math.min(4, nOpts(L) + 1), (x) => x.mom).map((x) => F(x.mom, x.n));
      return choiceRound({ skill: 'haiwan.anak', say: `Ini ${b.bn.toLowerCase()}. Mana ibunya?`, show: { k: 'big', e: b.baby, scale: b.small ? 0.6 : 1 }, options: opts, answer: F(b.mom, b.n), sayOnTap: true });
    },
    padanAnak(r, L) {
      const k = L <= 30 ? 3 : 4;
      const bs = r.sample(C.BABIES, k);
      return matchRound({ skill: 'haiwan.anak', say: 'Padankan anak dengan ibunya.', pairs: bs.map((b) => [{ e: b.baby, scale: b.small ? 0.65 : 1, say: b.bn }, { e: b.mom, lbl: b.n }]), rng: r });
    },
    kelasHabitat(r, L) {
      const bins = [{ id: 'darat', e: '🌳', n: 'Darat' }, { id: 'air', e: '🌊', n: 'Air' }, { id: 'udara', e: '☁️', n: 'Udara' }].slice(0, L <= 25 ? 2 : 3);
      const k = L <= 30 ? 2 : 3;
      const items = bins.flatMap((b) => r.sample(C.ANIMALS.filter((a) => a.hab === b.id && !['penguin', 'kurakura', 'katak', 'itik'].includes(a.id)), k).map((a) => ({ e: a.e, lbl: a.n, bin: b.id })));
      return sortRound({ skill: 'haiwan.kelas', say: 'Kelaskan haiwan mengikut tempat tinggal.', bins, items, rng: r });
    },
    terbang(r, L) {
      const yes = r.sample(C.ANIMALS.filter((a) => a.hab === 'udara'), 2);
      const no = r.sample(C.ANIMALS.filter((a) => a.hab !== 'udara' && a.kind !== 'burung'), 4);
      return multiRound({ skill: 'haiwan.kelas', say: 'Pilih semua haiwan yang boleh terbang.', options: r.shuffle([...yes, ...no]).map(AN), answers: yes.map(AN), sayOnTap: true });
    },
    kaki(r, L) {
      const k = r.pick([0, 2, 4]);
      const pool = C.ANIMALS.filter((a) => [0, 2, 4].includes(a.legs) && a.id !== 'kelawar' && a.id !== 'monyet' && a.id !== 'penguin');
      const ans = r.pick(pool.filter((a) => a.legs === k));
      const others = pool.filter((a) => a.legs !== k);
      return choiceRound({ skill: 'haiwan.kelas', say: k === 0 ? 'Haiwan mana yang tiada kaki?' : `Haiwan mana yang ada ${C.NUM_WORDS[k]} kaki?`, options: options(r, others.map(AN), AN(ans), Math.min(4, nOpts(L))), answer: AN(ans), sayOnTap: true });
    },
    memori(r, L) {
      const k = L <= 30 ? 4 : 6;
      return memoryRound({ skill: 'haiwan.nama', say: 'Buka kad, cari haiwan yang sama.', pairs: uniqBy(r, C.ANIMALS, k, (x) => x.e).map((a) => [{ e: a.e, say: a.n }]), rng: r, peek: L <= 25 ? 1500 : 0 });
    },
  },
  tiers: [
    ['nama', 'habitat', 'makanan', 'anak', 'nama'],
    ['nama', 'habitat', 'makanan', 'anak', 'padanAnak', 'kelasHabitat'],
    ['padanHabitat', 'padanMakanan', 'kelasHabitat', 'anak', 'memori', 'terbang'],
    ['padanHabitat', 'padanMakanan', 'padanAnak', 'kelasHabitat', 'kaki', 'terbang', 'memori'],
    ['padanHabitat', 'padanMakanan', 'kelasHabitat', 'kaki', 'terbang', 'padanAnak', 'memori'],
  ],
};

// ============================ MOD 14: ASAH MINDA ============================
const PAT_POOL = ['🍎', '🍌', '⭐', '🌸', '🐟', '🎈', '🚗', '🐱', '⚽', '🍓', '🌙', '❤️', '🐸', '🍩'];
export const minda = {
  id: 'minda', n: 'Asah Minda', e: '💡', c: '#fd9644', char: 'mimi',
  skills: { 'minda.beza': 'Mencari objek berbeza', 'minda.corak': 'Melengkapkan corak', 'minda.teka': 'Meneka objek', 'minda.masalah': 'Menyelesaikan masalah', 'minda.sesuai': 'Memilih gambar sesuai', 'minda.urutan': 'Menyusun mengikut urutan' },
  gens: {
    beza(r, L) {
      const [[, c], [, o]] = r.sample(Object.entries(C.CATEGORIES), 2);
      const n = L <= 10 ? 3 : L <= 30 ? 4 : 5;
      const same = r.sample(c.items, n - 1);
      const odd = r.pick(o.items);
      return choiceRound({ skill: 'minda.beza', say: 'Yang mana satu tak sama kumpulan?', options: r.shuffle([...same, odd]).map((e) => ({ e })), answer: { e: odd } });
    },
    corak(r, L) {
      const kinds = L <= 10 ? ['AB'] : L <= 25 ? ['AB', 'AAB', 'ABB'] : ['ABC', 'AAB', 'ABB', 'AABB', 'ABC'];
      const kind = r.pick(kinds);
      const els = r.sample(PAT_POOL, 3);
      const unit = kind.split('').map((ch) => els['ABC'.indexOf(ch)]);
      const len = unit.length * 2 + (L > 20 ? r.int(0, unit.length - 1) : 0);
      const seq = Array.from({ length: len }, (_, i) => unit[i % unit.length]);
      const middle = L > 35 && r.chance(0.5);
      let shown, ans;
      if (middle) { const q = r.int(1, len - 2); ans = seq[q]; shown = seq.map((e, i) => (i === q ? '?' : { e })); }
      else { ans = unit[len % unit.length]; shown = [...seq.map((e) => ({ e })), '?']; }
      const optsE = [...new Set([...unit, ...r.sample(PAT_POOL.filter((e) => !unit.includes(e)), L <= 15 ? 1 : 2)])];
      return choiceRound({ skill: 'minda.corak', say: middle ? 'Ada satu yang hilang dalam corak ini. Apa dia?' : 'Lepas ini, gambar apa pula?', show: { k: 'strip', items: shown }, options: r.shuffle(optsE).map((e) => ({ e })), answer: { e: ans } });
    },
    teka(r, L) {
      const q = r.pick(C.RIDDLES);
      const opts = r.shuffle([q.a, ...q.no.slice(0, L <= 15 ? 2 : 3)]).map((e) => ({ e }));
      return choiceRound({ skill: 'minda.teka', say: q.q, show: { k: 'text', t: q.q }, options: opts, answer: { e: q.a } });
    },
    masalah(r, L) {
      const q = r.pick(C.PROBLEMS);
      const opts = r.shuffle([q.a, ...q.no.slice(0, L <= 15 ? 2 : 3)]).map((e) => ({ e }));
      return choiceRound({ skill: 'minda.masalah', say: q.q, show: { k: 'text', t: q.q }, options: opts, answer: { e: q.a } });
    },
    sesuai(r, L) {
      const pr = r.pick(C.GO_TOGETHER);
      const others = C.GO_TOGETHER.filter((p) => p !== pr).map((p) => p[1]);
      return choiceRound({ skill: 'minda.sesuai', say: 'Gambar ini sesuai dengan yang mana satu?', show: { k: 'big', e: pr[0] }, options: options(r, others.map((e) => ({ e })), { e: pr[1] }, Math.min(4, nOpts(L) + 1)), answer: { e: pr[1] } });
    },
    padanSesuai(r, L) {
      const k = L <= 30 ? 3 : 4;
      const prs = uniqBy(r, C.GO_TOGETHER, k, (p) => p[1]);
      return matchRound({ skill: 'minda.sesuai', say: 'Padankan benda yang selalu dipakai sama-sama.', pairs: prs.map((p) => [{ e: p[1] }, { e: p[0] }]), rng: r });
    },
    urutan(r, L) {
      const s = r.pick(C.SEQUENCES.filter((x) => (L <= 20 ? x.steps.length <= 3 || L > 10 : true)));
      return slotsRound({ skill: 'minda.urutan', say: `${s.n}. Jom susun ikut urutan.`, items: s.steps.map((st, i) => ({ e: st.e, lbl: st.n, say: st.n, v: 'q' + i })), numbered: true, rng: r, given: L <= 20 ? [0] : [] });
    },
    kiraBeza(r, L) {
      const e = r.pick(PAT_POOL);
      const k = L <= 30 ? 4 : 6;
      const odd = r.pick(PAT_POOL.filter((x) => x !== e));
      const pos = r.int(0, k - 1);
      const opts = Array.from({ length: k }, (_, i) => ({ id: 'o' + i, html: groupHtml(i === pos ? odd : e, 3, 22) }));
      return { type: 'choice', skill: 'minda.beza', say: 'Kumpulan mana yang lain sendiri?', options: opts, answer: 'o' + pos, cols: k === 4 ? 2 : 3 };
    },
  },
  tiers: [
    ['beza', 'corak', 'sesuai', 'teka', 'masalah'],
    ['beza', 'corak', 'teka', 'masalah', 'sesuai', 'urutan'],
    ['corak', 'urutan', 'padanSesuai', 'teka', 'masalah', 'kiraBeza'],
    ['corak', 'urutan', 'padanSesuai', 'beza', 'kiraBeza', 'teka', 'masalah'],
    ['corak', 'urutan', 'padanSesuai', 'kiraBeza', 'teka', 'masalah', 'beza'],
  ],
};

// ============================ MOD 15: MISI PENGEMBARAAN ============================
export const misi = {
  id: 'misi', n: 'Misi Pengembaraan', e: '🚀', c: '#6c5ce7', char: 'dino',
  rounds: (L) => (L <= 10 ? 3 : L <= 30 ? 4 : 5),
  world: (L) => C.WORLDS[(L - 1) % 4],
  skills: { 'misi.kumpul': 'Mengumpul objek', 'misi.jalan': 'Mencari jalan', 'misi.kira': 'Mengira hasil misi', 'misi.tempat': 'Mengenal tempat', 'misi.bantu': 'Membantu rakan' },
  gens: {
    kumpul(r, L, ctx) {
      const w = ctx.world;
      const ii = r.int(0, w.items.length - 1);
      const it = w.items[ii], itN = w.itemsN[ii];
      const k = L <= 10 ? 3 : L <= 30 ? 4 : 5;
      const items = scatter(r, k, it, w.deco, L <= 10 ? 8 : L <= 30 ? 12 : 16, 8, 12);
      ctx.collected = { e: it, n: k, name: itN };
      return { type: 'find', skill: 'misi.kumpul', say: `Jom ke ${w.n.toLowerCase()}! Tolong kumpul ${C.NUM_WORDS[k]} ${itN} untuk ${w.heroN}.`, bg: w.bg, items, targetE: it };
    },
    kira(r, L, ctx) {
      const c = ctx.collected || { e: ctx.world.items[0], n: r.int(3, 6), name: ctx.world.itemsN[0] };
      const n = c.n + (L > 30 ? r.int(0, 3) : 0);
      const pool = Array.from({ length: Math.max(n + 3, 6) }, (_, i) => T(i + 1, C.NUM_WORDS[i + 1]));
      return choiceRound({ skill: 'misi.kira', say: `Ada berapa ${c.name} dalam bakul? Kira sama-sama, ya.`, show: { k: 'objects', items: Array(n).fill(c.e), tap: true }, options: options(r, pool.filter((p) => Math.abs(+p.t - n) <= 3 && +p.t > 0), T(n, C.NUM_WORDS[n]), Math.min(4, nOpts(L) + 1)), answer: T(n, C.NUM_WORDS[n]) });
    },
    jalan(r, L, ctx) {
      const w = ctx.world;
      const base = maze.gens.laluan(r, Math.max(1, L - 4));
      return { ...base, skill: 'misi.jalan', say: `Jom tolong ${w.heroN} sampai ke ${w.goalN}!${base.items?.length ? ` Kutip ${w.itemsN[1]} sepanjang jalan, ya.` : ''}`, hero: w.hero, goalE: w.goal, itemE: w.items[1], itemN: w.itemsN[1], rockE: w.obstacle, bg: w.bg[0] };
    },
    tempat(r, L, ctx) {
      const w = ctx.world;
      const ans = r.pick(w.deco);
      const others = C.WORLDS.filter((x) => x !== w).flatMap((x) => x.deco).filter((e) => !w.deco.includes(e) && !w.items.includes(e));
      return choiceRound({ skill: 'misi.tempat', say: `Yang mana satu boleh kita jumpa di ${w.n.toLowerCase()}?`, show: { k: 'big', e: w.e }, options: options(r, others.map((e) => ({ e })), { e: ans }, Math.min(4, nOpts(L) + 1)), answer: { e: ans } });
    },
    susun(r, L, ctx) {
      const w = ctx.world;
      const o = r.pick(C.WORLDS.filter((x) => x !== w));
      const k = L <= 25 ? 2 : 3;
      const items = [...r.sample(w.deco.filter((e) => !o.deco.includes(e)), k).map((e) => ({ e, bin: w.id })), ...r.sample(o.deco.filter((e) => !w.deco.includes(e)), k).map((e) => ({ e, bin: o.id }))];
      return sortRound({ skill: 'misi.tempat', say: `Jom tolong ${w.heroN} berkemas! Hantar setiap benda ke tempat asalnya.`, bins: [{ id: w.id, e: w.e, n: w.n }, { id: o.id, e: o.e, n: o.n }], items, rng: r });
    },
    bantu(r, L, ctx) {
      const w = ctx.world;
      const fi = r.int(0, w.friends.length - 1), ni = r.int(0, w.items.length - 1);
      const f = w.friends[fi], fN = w.friendsN[fi];
      const need = w.items[ni], needN = w.itemsN[ni];
      const k = L <= 20 ? 3 : 4;
      const others = C.WORLDS.flatMap((x) => x.items).filter((e) => e !== need);
      const n = L <= 20 ? 1 : 2;
      const opts = options(r, others.map((e) => ({ e })), { e: need }, k);
      if (n === 1) return choiceRound({ skill: 'misi.bantu', say: `Kawan kita, ${fN}, perlukan ${needN}. Jom tolong bagi!`, show: { k: 'big', e: f }, options: opts, answer: { e: need } });
      const items = [{ e: need, id: 'n1' }, { e: need, id: 'n2' }, ...r.sample(others, k - 1).map((e, i) => ({ e, id: 'x' + i }))];
      return { type: 'choice', multi: true, skill: 'misi.bantu', say: `Kawan kita, ${fN}, perlukan dua ${needN}. Pilih dua-dua, ya!`, show: { k: 'big', e: f }, options: r.shuffle(items), answers: ['n1', 'n2'] };
    },
    gambar(r, L, ctx) {
      const w = ctx.world;
      const pic = { n: `Pengembaraan di ${w.n}`, bg: w.bg, main: w.hero, deco: w.deco.slice(0, 4) };
      const [rows, cols] = L <= 25 ? [2, 2] : L <= 40 ? [2, 3] : [3, 3];
      return { type: 'puzzle', skill: 'misi.kumpul', say: 'Alamak, peta misi dah koyak! Jom susun semula.', pic, rows, cols, ghost: L <= 30, order: r.shuffle([...Array(rows * cols).keys()]) };
    },
  },
  // misi mempunyai susunan langkah tetap (cerita) dan bukannya rawak
  plan(L, r) {
    const steps = ['kumpul', 'kira'];
    const extra = L <= 10 ? ['tempat'] : L <= 20 ? ['jalan', 'bantu'] : L <= 30 ? ['jalan', r.pick(['susun', 'bantu'])] : L <= 40 ? ['jalan', 'susun', 'bantu'] : ['jalan', 'gambar', r.pick(['susun', 'bantu'])];
    return [...steps, ...extra].slice(0, misi.rounds(L));
  },
  tiers: [['kumpul', 'kira', 'tempat'], ['kumpul', 'kira', 'jalan', 'bantu'], ['kumpul', 'jalan', 'susun', 'bantu'], ['kumpul', 'jalan', 'susun', 'bantu'], ['kumpul', 'jalan', 'gambar', 'susun', 'bantu']],
};
