// =====================================================================
//  KATALOG SUARA: senarai semua ayat yang disebut oleh aplikasi
//  (selepas penormalan & pemecahan ayat), berserta ekspresi (mood).
//
//    node tools/voice-catalog.mjs                 # katalog statik
//    node tools/voice-catalog.mjs --capture       # + tangkap ayat sebenar dengan memainkan 750 level dalam pelayar
//
//  Hasil: audio/ms-MY/catalog.json  ->  digunakan oleh tools/gen-voice.mjs
// =====================================================================
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { MODE_LIST, generateLevel } from '../js/modes/index.js';
import * as C from '../js/data/content.js';
import { COLORING, DOT_SHAPES } from '../js/data/art.js';
import { normalizeMalay, splitSentences, clipKey } from '../js/malay-text.js';
import { TALK } from '../js/talk.js';

const OUT = 'audio/ms-MY';
const cat = new Map(); // kunci -> { text, mood, freq, minL, core }
const baseOf = new Map(); // kunci tanpa tanda baca akhir -> kunci
const PRIORITY = { pujian: 3, galakan: 2, tenang: 1, arahan: 0 };
// L = level tempat ayat muncul (untuk keutamaan); core = ayat teras yang didengar di mana-mana
function add(text, mood = 'arahan', { L = 99, core = false } = {}) {
  if (!text) return;
  for (const s of splitSentences(normalizeMalay(text))) {
    let k = clipKey(s);
    if (!k || !/[a-z]/i.test(k)) continue;
    // ayat yang hanya berbeza tanda baca akhir berkongsi satu rakaman (aplikasi mencari kedua-duanya)
    const base = k.replace(/[.!?,]+$/, '');
    if (!cat.has(k) && baseOf.has(base)) k = baseOf.get(base);
    else if (!baseOf.has(base)) baseOf.set(base, k);
    const prev = cat.get(k) || { text: s, mood, freq: 0, minL: 99, core: false };
    // satu klip bagi setiap ayat; jika ayat sama muncul dalam beberapa konteks, ekspresi paling "berperasaan" dipilih
    if (PRIORITY[mood] > PRIORITY[prev.mood]) prev.mood = mood;
    prev.freq++; prev.minL = Math.min(prev.minL, L); prev.core = prev.core || core;
    cat.set(k, prev);
  }
}
const CORE = { core: true };
const lower = (t) => t.toLowerCase();

// ---------- 1. kandungan 750 level ----------
for (const m of MODE_LIST) {
  for (let L = 1; L <= 50; L++) {
    for (const r of generateLevel(m.id, L).rounds) {
      const mood = String(r.skill).startsWith('soleh.') ? 'tenang' : 'arahan';
      add(r.say, mood, { L });
      add('Bismillah.', 'tenang', { L, core: true });
      if (r.show?.say) add(r.show.say, mood, { L });
      const faces = [...(r.options || []), ...(r.pairs || []).flatMap((p) => [p.src, p.dst]), ...(r.items || []), ...(r.tiles || []).map((t) => t.face), ...(r.grid || []).filter(Boolean)];
      faces.forEach((f) => f && f.say && add(f.say, mood, { L }));
      if (r.type === 'recall' && r.variant === 'where') r.grid.filter(Boolean).forEach((f) => add(`Di mana ${f.say || f.lbl || 'gambar ini'}?`, 'arahan', { L }));
      if (r.type === 'color') r.guided.forEach((g) => add(`Warnakan ${COLORING.find((a) => a.id === r.art).regions.find((x) => x.id === g.region).n} dengan warna ${lower(C.colorById(g.color).n)}.`, 'arahan', { L }));
    }
  }
}

// ---------- 2. pujian, galakan, ucapan ----------
[...C.PRAISE, ...C.ISLAMIC_PRAISE].forEach((t) => add(t, 'pujian', CORE));
[...C.ENCOURAGE, ...C.ISLAMIC_ENCOURAGE].forEach((t) => add(t, 'galakan', CORE));
['Hebat!', 'Cantiknya!', 'Alhamdulillah!', 'Tahniah!', 'Hebat! Kamu berjaya tanpa sebarang kesilapan!', 'Bagus! Kamu berjaya! Kamu semakin bijak!',
  'Semua cabaran hari ini selesai! Ini hadiah khas untuk kamu!', 'Terbaik! Kamu semakin bijak.', 'Satu lagi level selesai.'].forEach((t) => add(t, 'pujian', CORE));
for (const t of ['Selamat pagi', 'Selamat tengah hari', 'Selamat petang', 'Selamat malam']) {
  add(`Assalamualaikum! ${t}. Jom belajar sambil bermain!`, 'arahan', CORE);
  add(`${t}! Jom belajar sambil bermain!`, 'arahan', CORE);
}

// percakapan semula jadi (penyambung, pujukan, petunjuk, penutup)
[...TALK.next, ...TALK.last].forEach((t) => add(t, 'arahan', CORE));
[...TALK.notThis, ...TALK.retry, ...TALK.hint, ...TALK.idle].forEach((t) => add(t, 'galakan', CORE));
[...TALK.doneAll, ...TALK.done].forEach((t) => add(t, 'pujian', CORE));

// ---------- 3. nombor, warna, bunyi, nama ----------
for (let n = 0; n <= 20; n++) add(String(n), 'arahan', CORE);
C.COLORS.forEach((c) => add(c.n, 'arahan', CORE));
C.SOUNDS.forEach((s) => { add(s.n); add(s.ono); });
C.THEMES.forEach((t) => add(`Tema ${t.n}!`, 'pujian'));
C.DOA.forEach((d) => add(`Doa ${lower(d.sit)}. Maksudnya, ${d.makna}.`, 'tenang'));
const groups = [C.ANIMALS, C.FRUITS, C.VEGETABLES, C.VEHICLES, C.CLOTHES, C.BODY, C.HIJAIYAH];
groups.flat().forEach((x) => add(x.n));
C.LETTERS.forEach((l) => { const w = C.wordsByLetter(l)[0]; add(w ? `${l} untuk ${w.n}` : `Huruf ${l}`); add(`Huruf ${l}`); });
C.NUM_WORDS.forEach((w) => add(w));
C.SHAPES.forEach((s) => add(s.n));

// ---------- 4. aktiviti seni ----------
for (const a of COLORING) for (const rg of a.regions) add(`Warnakan ${rg.n} dulu, ya.`);
for (const c1 of C.COLORS) for (const c2 of C.COLORS) if (c1 !== c2) add(`Ini warna ${lower(c1.n)}. Cuba cari warna ${lower(c2.n)}.`, 'galakan');
DOT_SHAPES.forEach((s) => add(`Wah, ${lower(s.n)}!`, 'pujian'));

// ---------- 5. skrin aplikasi ----------
for (const m of MODE_LIST) {
  add(m.n, 'arahan', CORE);
  add(`Jom main ${m.n}!`, 'arahan', CORE);
  add(`Tahniah! Kamu sudah tamatkan semua level ${m.n}!`, 'pujian');
  add(`Tamatkan semua level ${m.n} untuk mendapat sijil.`);
}
add('Ada level baharu sedang menunggu kamu.', 'arahan', CORE);
add('Selesaikan level sebelumnya dahulu, ya.', 'arahan', CORE);
['Kutip semua barang dulu, ya.', 'Pandainya! Sekarang jalan ke tempat yang dituju.', 'Sekarang, susun semula ikut urutan tadi, ya.', 'Apa yang hilang?',
  'Permainan ini sedang dikunci oleh ibu bapa.', 'Jom dapatkan versi penuh Dunia Cilik!', 'Pilih gambar untuk diwarnakan.', 'Pilih warna, kemudian tekan bahagian gambar.',
  'Lukis apa sahaja dengan jari kamu!', 'Tekan gambar untuk mendengar bunyinya.', 'Susun objek ke dalam kumpulannya. Tiada markah, main sahaja!',
  'Pilih gambar dan bilangan kepingan.', 'Pilih kategori untuk diteroka.', 'Tekan gambar untuk dengar namanya.', 'Hai! Siapa nama kamu?', 'Pilih kawan bermain kamu!',
  'Main apa sahaja yang kamu suka. Tiada markah, tiada had!', 'Assalamualaikum. Jom cari huruf A! Bagus, kamu semakin bijak.'].forEach((t) => add(t));
C.WORLDS.forEach((w) => w.itemsN.forEach((n) => add(`Kutip semua ${n} dulu, ya.`)));

// ---------- 6. tangkapan sebenar (pilihan) ----------
const capFile = 'tests/out-capture.json';
if (process.argv.includes('--capture')) {
  console.log('Memainkan 750 level untuk menangkap ayat sebenar...');
  execSync(`node tests/e2e.test.mjs --all --capture=${capFile}`, { stdio: 'inherit' });
}
if (existsSync(capFile)) {
  const cap = JSON.parse(readFileSync(capFile, 'utf8'));
  cap.forEach((c) => add(c.text, c.mood, { L: 99 }));
  console.log(`+ ${cap.length} ayat daripada tangkapan pelayar`);
}

mkdirSync(OUT, { recursive: true });
// Kumpulan keutamaan rakaman: teras (didengar di mana-mana) -> awal (level 1–15) -> lengkap
const groupOf = (v) => (v.core || v.freq >= 25 ? 'teras' : v.minL <= 15 ? 'awal' : 'lengkap');
const G = { teras: 0, awal: 1, lengkap: 2 };
const items = [...cat.entries()].map(([key, v]) => ({ key, text: v.text, mood: v.mood, group: groupOf(v), freq: v.freq }))
  .sort((a, b) => G[a.group] - G[b.group] || b.freq - a.freq || a.key.localeCompare(b.key));
writeFileSync(`${OUT}/catalog.json`, JSON.stringify({ lang: 'ms-MY', count: items.length, items }, null, 1));
const chars = items.reduce((s, i) => s + i.text.length, 0);
const by = (g) => items.filter((i) => i.group === g).length;
console.log(`Katalog: ${items.length} ayat, ${chars} aksara -> ${OUT}/catalog.json`);
console.log(`  teras: ${by('teras')} · awal: ${by('awal')} · lengkap: ${by('lengkap')}`);
