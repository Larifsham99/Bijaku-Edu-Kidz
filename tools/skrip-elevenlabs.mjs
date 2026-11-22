// =====================================================================
//  JANA SKRIP ELEVENLABS BAGI SEMUA AYAT YANG BELUM ADA SUARA
//  node tools/skrip-elevenlabs.mjs
//
//  Hasil: rakaman/baki/NN.txt (untuk di-paste ke ElevenLabs v3)
//         rakaman/baki/NN.kunci.txt (ayat sebenar bagi setiap baris)
//         studio/skrip.html (halaman dengan butang "Salin" bagi setiap bahagian)
//  Huruf tunggal ditulis ikut sebutan gaya lagu ABC (E -> "i") supaya
//  ElevenLabs menyebutnya dengan betul; fail .kunci.txt menyimpan ayat asal.
// =====================================================================
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { normalizeMalay, splitSentences, clipKey } from '../js/malay-text.js';
import { RC_WORLDS, CARS, PAINTS, STICKERS_RC, RIMS, MEDALS } from '../js/racing/data.js';
import { buildLevel } from '../js/racing/levels.js';
import { NUM_WORDS } from '../js/data/content.js';

const MAX = 2400; // aksara setiap bahagian (selamat untuk satu janaan v3)
const LETTER = { A: 'ei', B: 'bi', C: 'si', D: 'di', E: 'i', F: 'ef', G: 'ji', H: 'eic', I: 'ai', J: 'jei', K: 'kei', L: 'el', M: 'em', N: 'en', O: 'o', P: 'pi', Q: 'kiu', R: 'ar', S: 'es', T: 'ti', U: 'yu', V: 'vi', W: 'dabel yu', X: 'eks', Y: 'wai', Z: 'zed' };
const TAG = { arahan: '[warmly]', pujian: '[cheerfully]', galakan: '[gently]', tenang: '[softly]' };
const base = (s) => clipKey(s).replace(/[.!?,]+$/, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- ayat yang sudah ada suara ----------
const man = JSON.parse(readFileSync('audio/ms-MY/manifest.json', 'utf8')).clips;
const have = new Set(Object.keys(man).map(base));

// ---------- kumpul ayat ----------
const items = new Map(); // base -> { text, mood, order }
let order = 0;
const add = (text, mood = 'arahan', pri = 5) => {
  for (const s of splitSentences(normalizeMalay(String(text)))) {
    const t = s.trim();
    if (!t || /Aisyah/.test(t)) continue;
    const k = base(t);
    if (!k || have.has(k) || items.has(k)) continue;
    items.set(k, { text: t, mood, pri, order: order++ });
  }
};
// 1) katalog permainan asal (ikut kekerapan)
const cat = JSON.parse(readFileSync('audio/ms-MY/catalog.json', 'utf8')).items;
for (const it of cat.slice().sort((a, b) => b.freq - a.freq)) add(it.text, it.mood, it.group === 'teras' ? 1 : it.group === 'awal' ? 2 : 3);

// 2) Cilik Racing
const R = (t, m = 'arahan') => add(t, m, 2);
for (let wi = 0; wi < RC_WORLDS.length; wi++) {
  const w = RC_WORLDS[wi];
  R(`${w.n}. ${w.tag}.`); R(`Kamu juara ${w.n}!`, 'pujian'); R(`Level juara! ${w.n}. Sedia?`);
  if (wi > 0) R(`Selesaikan sepuluh level di ${RC_WORLDS[wi - 1].n} dahulu, ya.`);
  for (let n = 1; n <= 50; n++) {
    R(`${w.n}, level ${n}. Sedia?`);
    for (const t of buildLevel(wi, n).tasks) {
      R(t.say);
      if (t.kind === 'pit' && t.sub === 'eja') { R(`${t.say} Tekan huruf mengikut urutan.`); R(`${cap(t.word.toLowerCase())}! Hebat!`, 'pujian'); for (const ch of t.word) { R(ch, 'pujian'); R(`Cari huruf ${ch}.`, 'galakan'); } }
      if (t.opts) for (const o of t.opts) if (o.n) R(`Itu ${o.n}.`, 'galakan');
      if (t.kind === 'collect' && t.target?.n) R(`Itu bukan ${t.target.n}.`, 'galakan');
      if (t.kind === 'order') for (const s of t.seq) R(`${s.n}! Seterusnya?`, 'pujian');
    }
  }
}
[
  'Tekan anak panah, atau leret ke kiri dan ke kanan untuk menukar laluan.', 'Selesaikan level sebelum ini dahulu, ya.', 'Peta Dunia', 'Garaj', 'Koleksi', 'Cilik Racing!',
  'Menangi satu trofi juara dunia untuk membuka kereta ini.', 'Permainan ini sedang dikunci oleh ibu bapa.', 'Pandu sekarang',
].forEach((t) => R(t));
for (const c of CARS) { R(c.say, 'pujian'); R(`Tahniah! Kereta baharu, ${c.say}!`, 'pujian'); R(`Kamu dapat kereta baharu, ${c.say}!`, 'pujian'); if (c.need.stars) R(`Kumpul ${c.need.stars} bintang untuk membuka kereta ini.`); }
for (const p of PAINTS) { R(`Cat ${p.n.toLowerCase()}`, 'pujian'); if (p.need) R(`Kumpul ${p.need} bintang untuk cat ini.`); }
for (const s of STICKERS_RC) { R(`Pelekat ${s.n.toLowerCase()}`, 'pujian'); if (s.need) R(`Kumpul ${NUM_WORDS[s.need] || s.need} pingat untuk pelekat ini.`); }
for (const r of RIMS) { R(`Rim ${r.n.toLowerCase()}`, 'pujian'); R(`Buka ${NUM_WORDS[r.need] || r.need} dunia untuk rim ini.`); }
for (const m of MEDALS) R(`Kamu dapat ${m.n.toLowerCase()}!`, 'pujian');

// ---------- tukar ke ejaan sebutan ----------
const speakable = (t) => {
  let s = t.replace(/\s*\/\s*/g, ', atau ');
  s = s.replace(/(^|[^A-Za-z'’-])([A-Za-z])(?=$|[^A-Za-z'’-])/g, (m, pre, ch) => pre + (LETTER[ch.toUpperCase()] || ch));
  s = cap(s);
  if (!/[.!?]$/.test(s)) s += '.';
  return s;
};

// ---------- susun & bahagikan ----------
const list = [...items.values()].sort((a, b) => a.pri - b.pri || a.mood.localeCompare(b.mood) || a.order - b.order);
const parts = [];
let cur = [], len = 0;
for (const it of list) {
  const line = speakable(it.text);
  const cost = line.length + 3 + (cur.length && cur[cur.length - 1].mood === it.mood ? 0 : TAG[it.mood].length + 1);
  if (len + cost > MAX && cur.length) { parts.push(cur); cur = []; len = 0; }
  cur.push({ ...it, line }); len += cost;
}
if (cur.length) parts.push(cur);

const outDir = 'rakaman/baki';
if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });
let total = 0;
const pages = parts.map((p, i) => {
  const id = String(i + 1).padStart(2, '0');
  let prev = null;
  const txt = p.map((it) => { const t = (it.mood !== prev ? TAG[it.mood] + ' ' : '') + it.line; prev = it.mood; return t; }).join('\n\n\n') + '\n';
  writeFileSync(`${outDir}/${id}.txt`, txt);
  writeFileSync(`${outDir}/${id}.kunci.txt`, p.map((it) => it.text).join('\n') + '\n');
  total += txt.length;
  return { id, n: p.length, chars: txt.length, txt };
});

// ---------- halaman salin ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
writeFileSync('studio/skrip.html', `<!doctype html>
<html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skrip ElevenLabs · Dunia Cilik</title>
<style>
:root{--ink:#2b2350;--bg:#fff6e6}*{box-sizing:border-box}body{margin:0;font-family:"Baloo 2","Nunito",system-ui,sans-serif;background:var(--bg);color:var(--ink)}
header{padding:14px 16px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.08);position:sticky;top:0;z-index:2}h1{margin:0;font-size:22px}p{margin:4px 0 0;color:#6b628c;font-size:14px}
main{max-width:900px;margin:0 auto;padding:12px 16px 60px;display:grid;gap:10px}
.part{background:#fff;border-radius:18px;padding:12px 14px;box-shadow:0 2px 0 rgba(43,35,80,.08);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.part.done{opacity:.55}.part b{font-size:20px;min-width:110px}.part span{flex:1;color:#6b628c;font-size:14px}
button{font:inherit;font-weight:700;border:0;border-radius:14px;padding:9px 14px;cursor:pointer}.copy{background:#2f9e6a;color:#fff}.see{background:#ece6fa;color:var(--ink)}.tick{background:#fff;border:2px solid #d9d3ea}
pre{width:100%;white-space:pre-wrap;background:#f8f6ff;border-radius:12px;padding:10px;max-height:260px;overflow:auto;display:none;margin:6px 0 0;font-size:13px}.part.open pre{display:block}
</style></head><body>
<header><h1>Skrip ElevenLabs: baki ${list.length} ayat</h1><p>${parts.length} bahagian · ${total.toLocaleString('ms')} aksara (± kredit). Tekan "Salin", paste ke ElevenLabs v3, jana, muat turun MP3. Penting: namakan setiap fail MP3 ikut nombor bahagian (cth. 07.mp3) supaya klip dipadankan dengan betul. Tanda ✓ selepas siap.</p></header>
<main>${pages.map((p) => `<div class="part" data-id="${p.id}"><b>Bahagian ${p.id}</b><span>${p.n} ayat · ${p.chars} aksara</span><button class="copy" type="button">Salin</button><button class="see" type="button">Lihat</button><button class="tick" type="button">✓</button><pre>${esc(p.txt)}</pre></div>`).join('\n')}</main>
<script>
const done=new Set(JSON.parse(localStorage.getItem('dc-skrip-siap')||'[]'));
document.querySelectorAll('.part').forEach((el)=>{const id=el.dataset.id;const txt=el.querySelector('pre').textContent;el.classList.toggle('done',done.has(id));
el.querySelector('.copy').onclick=async(e)=>{try{await navigator.clipboard.writeText(txt);e.target.textContent='Disalin ✓';}catch{el.classList.add('open');const r=document.createRange();r.selectNodeContents(el.querySelector('pre'));getSelection().removeAllRanges();getSelection().addRange(r);e.target.textContent='Pilih & salin';}setTimeout(()=>{e.target.textContent='Salin'},1600)};
el.querySelector('.see').onclick=()=>el.classList.toggle('open');
el.querySelector('.tick').onclick=()=>{done.has(id)?done.delete(id):done.add(id);el.classList.toggle('done',done.has(id));try{localStorage.setItem('dc-skrip-siap',JSON.stringify([...done]))}catch{}};});
</script></body></html>
`);
console.log(`${list.length} ayat baki -> ${parts.length} bahagian, ${total} aksara (rakaman/baki/, studio/skrip.html)`);
