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
import { COLORING, DOT_SHAPES, TRACE } from '../js/data/art.js';
import { normalizeMalay, splitSentences, clipKey } from '../js/malay-text.js';

const OUT = 'audio/ms-MY';
const cat = new Map(); // kunci -> { text, mood }
const PRIORITY = { pujian: 3, galakan: 2, tenang: 1, arahan: 0 };
function add(text, mood = 'arahan') {
  if (!text) return;
  for (const s of splitSentences(normalizeMalay(text))) {
    const k = clipKey(s);
    if (!k || !/[a-z]/i.test(k)) continue;
    const prev = cat.get(k);
    // satu klip bagi setiap ayat; jika ayat sama muncul dalam beberapa konteks, ekspresi paling "berperasaan" dipilih
    if (!prev || PRIORITY[mood] > PRIORITY[prev.mood]) cat.set(k, { text: s, mood });
  }
}
const lower = (t) => t.toLowerCase();

// ---------- 1. kandungan 750 level ----------
for (const m of MODE_LIST) {
  for (let L = 1; L <= 50; L++) {
    for (const r of generateLevel(m.id, L).rounds) {
      const mood = String(r.skill).startsWith('soleh.') ? 'tenang' : 'arahan';
      add(r.say, mood);
      add('Bismillah.', 'tenang');
      if (r.show?.say) add(r.show.say, mood);
      const faces = [...(r.options || []), ...(r.pairs || []).flatMap((p) => [p.src, p.dst]), ...(r.items || []), ...(r.tiles || []).map((t) => t.face), ...(r.grid || []).filter(Boolean)];
      faces.forEach((f) => f && f.say && add(f.say, mood));
      if (r.type === 'recall' && r.variant === 'where') r.grid.filter(Boolean).forEach((f) => add(`Di mana ${f.say || f.lbl || 'gambar ini'}?`));
    }
  }
}

// ---------- 2. pujian, galakan, ucapan ----------
[...C.PRAISE, ...C.ISLAMIC_PRAISE].forEach((t) => add(t, 'pujian'));
[...C.ENCOURAGE, ...C.ISLAMIC_ENCOURAGE].forEach((t) => add(t, 'galakan'));
['Hebat!', 'Cantiknya!', 'Alhamdulillah!', 'Tahniah!', 'Hebat! Kamu berjaya tanpa sebarang kesilapan!', 'Bagus! Kamu berjaya! Kamu semakin bijak!',
  'Semua cabaran hari ini selesai! Ini hadiah khas untuk kamu!', 'Terbaik! Kamu semakin bijak.'].forEach((t) => add(t, 'pujian'));
for (let L = 1; L <= 50; L++) add(`Level ${L} selesai.`, 'pujian');
for (const t of ['Selamat pagi', 'Selamat tengah hari', 'Selamat petang', 'Selamat malam']) {
  add(`Assalamualaikum! ${t}. Jom belajar sambil bermain!`);
  add(`${t}! Jom belajar sambil bermain!`);
}

// ---------- 3. nombor, warna, bunyi, nama ----------
for (let n = 0; n <= 20; n++) add(String(n));
C.COLORS.forEach((c) => add(c.n));
C.SOUNDS.forEach((s) => { add(s.n); add(s.ono); });
C.THEMES.forEach((t) => add(`Tema ${t.n}!`, 'pujian'));
C.DOA.forEach((d) => add(`Doa ${lower(d.sit)}. Maksudnya, ${d.makna}.`, 'tenang'));
const groups = [C.ANIMALS, C.FRUITS, C.VEGETABLES, C.VEHICLES, C.CLOTHES, C.BODY, C.HIJAIYAH];
groups.flat().forEach((x) => add(x.n));
C.LETTERS.forEach((l) => { const w = C.wordsByLetter(l)[0]; add(w ? `${l} untuk ${w.n}` : `Huruf ${l}`); add(`Huruf ${l}`); });
C.NUM_WORDS.forEach((w) => add(w));
C.SHAPES.forEach((s) => add(s.n));

// ---------- 4. aktiviti seni ----------
for (const a of COLORING) for (const rg of a.regions) for (const c of C.COLORS) add(`Warnakan ${rg.n} dengan warna ${lower(c.n)}.`);
for (const a of COLORING) for (const rg of a.regions) add(`Warnakan ${rg.n} dulu, ya.`);
for (const c1 of C.COLORS) for (const c2 of C.COLORS) if (c1 !== c2) add(`Ini warna ${lower(c1.n)}. Cuba cari warna ${lower(c2.n)}.`, 'galakan');
DOT_SHAPES.forEach((s) => add(`Wah, ${lower(s.n)}!`, 'pujian'));
TRACE.forEach((t) => add(`Surih ${t.n} dengan jari kamu.`));

// ---------- 5. skrin aplikasi ----------
for (const m of MODE_LIST) {
  add(m.n);
  add(`Jom main ${m.n}!`);
  add(`Tahniah! Kamu sudah tamatkan semua level ${m.n}!`, 'pujian');
  add(`Tamatkan semua level ${m.n} untuk mendapat sijil.`);
}
for (let L = 1; L <= 50; L++) { add(`Level ${L} sedang menunggu kamu.`); add(`Selesaikan level ${L} dahulu untuk membuka level ini.`); }
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
  cap.forEach((c) => add(c.text, c.mood));
  console.log(`+ ${cap.length} ayat daripada tangkapan pelayar`);
}

mkdirSync(OUT, { recursive: true });
const items = [...cat.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, v]) => ({ key, ...v }));
writeFileSync(`${OUT}/catalog.json`, JSON.stringify({ lang: 'ms-MY', count: items.length, items }, null, 1));
const chars = items.reduce((s, i) => s + i.text.length, 0);
console.log(`Katalog: ${items.length} ayat, ${chars} aksara -> ${OUT}/catalog.json`);
