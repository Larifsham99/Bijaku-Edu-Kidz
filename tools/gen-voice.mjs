// =====================================================================
//  PENJANA PAKEJ SUARA BAHASA MELAYU (ms-MY)
//
//  A) Suara neural Google Cloud Text-to-Speech
//     node tools/gen-voice.mjs --list                    # senarai suara ms-MY
//     node tools/gen-voice.mjs --sample                  # sampel setiap suara wanita -> audio/samples/
//     node tools/gen-voice.mjs --voice=ms-MY-Wavenet-A   # jana semua ayat dalam katalog
//     Pilihan: --limit=20  --prune (buang klip lama)  --force (jana semula semua)
//     Kunci API: pembolehubah GOOGLE_TTS_API_KEY, ATAU rahsia rangkaian untuk
//     texttospeech.googleapis.com (disuntik oleh proksi persekitaran).
//
//  B) Rakaman suara manusia
//     node tools/gen-voice.mjs --export-script           # audio/ms-MY/skrip-rakaman.csv
//     node tools/gen-voice.mjs --from-recordings=DIR     # tukar DIR/<id>.(wav|m4a|mp3) -> klip aplikasi (perlu ffmpeg)
//
//  Sebelum menjana: node tools/voice-catalog.mjs --capture
// =====================================================================
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIR = 'audio/ms-MY';
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const has = (k) => process.argv.includes(`--${k}`);
const idOf = (key) => createHash('sha1').update(key).digest('hex').slice(0, 10);
const catalog = () => {
  if (!existsSync(`${DIR}/catalog.json`)) { console.error('Tiada katalog. Jalankan: node tools/voice-catalog.mjs --capture'); process.exit(1); }
  return JSON.parse(readFileSync(`${DIR}/catalog.json`, 'utf8')).items;
};
// Ekspresi mengikut konteks (kelajuan & nada dalam semiton)
const MOOD = {
  arahan: { rate: 0.92, pitch: 0 },
  pujian: { rate: 0.98, pitch: 1.5 },
  galakan: { rate: 0.9, pitch: 0.5 },
  tenang: { rate: 0.85, pitch: -1 },
};

// ---------- HTTP melalui curl (mengikut proksi & sijil persekitaran) ----------
const API = 'https://texttospeech.googleapis.com/v1';
function call(method, path, body) {
  const args = ['-sS', '-X', method, `${API}${path}`, '-H', 'Content-Type: application/json; charset=utf-8', '-w', '\n%{http_code}'];
  if (process.env.GOOGLE_TTS_API_KEY) args.push('-H', `X-Goog-Api-Key: ${process.env.GOOGLE_TTS_API_KEY}`);
  if (body) args.push('--data-binary', '@-');
  const r = spawnSync('curl', args, { input: body ? JSON.stringify(body) : undefined, maxBuffer: 64 * 1024 * 1024 });
  const out = r.stdout.toString();
  const i = out.lastIndexOf('\n');
  const code = +out.slice(i + 1);
  let json = null; try { json = JSON.parse(out.slice(0, i)); } catch { /* bukan JSON */ }
  return { code, json, raw: out.slice(0, i) };
}
function voices() {
  const r = call('GET', '/voices?languageCode=ms-MY');
  if (r.code !== 200) { console.error(`Gagal mendapatkan senarai suara (HTTP ${r.code}). Pastikan kunci API Text-to-Speech tersedia.\n${r.raw.slice(0, 300)}`); process.exit(1); }
  return (r.json.voices || []).filter((v) => v.languageCodes.includes('ms-MY'));
}
const TIER = (n) => (/Chirp3-HD/.test(n) ? 5 : /Chirp-HD/.test(n) ? 4 : /Neural2/.test(n) ? 3 : /Wavenet/.test(n) ? 2 : 1);
const bestFemale = (vs) => vs.filter((v) => v.ssmlGender === 'FEMALE').sort((a, b) => TIER(b.name) - TIER(a.name))[0];

function synth(text, voiceName, mood) {
  const m = MOOD[mood] || MOOD.arahan;
  const base = { voice: { languageCode: 'ms-MY', name: voiceName }, audioConfig: { audioEncoding: 'MP3', speakingRate: m.rate, pitch: m.pitch, sampleRateHertz: 24000, effectsProfileId: ['handset-class-device'] } };
  for (let attempt = 0; attempt < 4; attempt++) {
    let r = call('POST', '/text:synthesize', { ...base, input: { text } });
    // sesetengah suara generasi baharu tidak menyokong pic -> cuba semula tanpanya
    if (r.code === 400) r = call('POST', '/text:synthesize', { ...base, input: { text }, audioConfig: { audioEncoding: 'MP3', speakingRate: m.rate, sampleRateHertz: 24000 } });
    if (r.code === 200 && r.json?.audioContent) return Buffer.from(r.json.audioContent, 'base64');
    if (r.code === 401 || r.code === 403) { console.error(`Akses ditolak (HTTP ${r.code}). Semak kunci API dan pastikan Cloud Text-to-Speech API diaktifkan.`); process.exit(1); }
    execFileSync('sleep', [String(1 + attempt * 2)]);
  }
  throw new Error('Gagal menjana: ' + text);
}

function writeManifest(voice, provider) {
  const items = catalog();
  const clips = {};
  for (const it of items) { const f = `${idOf(it.key)}.mp3`; if (existsSync(join(DIR, f))) clips[it.key] = f; }
  writeFileSync(`${DIR}/manifest.json`, JSON.stringify({ voice, provider, generatedAt: new Date().toISOString(), count: Object.keys(clips).length, clips }));
  const size = Object.values(clips).reduce((s, f) => s + statSync(join(DIR, f)).size, 0);
  console.log(`Manifest: ${Object.keys(clips).length}/${items.length} ayat ada klip (${(size / 1048576).toFixed(1)} MB)`);
  if (has('prune')) {
    const keep = new Set(Object.values(clips));
    readdirSync(DIR).filter((f) => f.endsWith('.mp3') && !keep.has(f)).forEach((f) => unlinkSync(join(DIR, f)));
  }
}

// ---------- arahan ----------
if (has('list')) {
  for (const v of voices()) console.log(`${v.name.padEnd(28)} ${v.ssmlGender.padEnd(7)} ${['', 'Standard', 'WaveNet', 'Neural2', 'Chirp HD', 'Chirp 3 HD'][TIER(v.name)]}`);
} else if (has('sample')) {
  mkdirSync('audio/samples', { recursive: true });
  const SAMPLE = 'Assalamualaikum. Jom cari huruf A! Bagus, kamu semakin bijak. Ada tiga biji epal dan dua biji oren. Semua sekali ada berapa, ya?';
  const want = arg('voices')?.split(',');
  const list = voices().filter((v) => (want ? want.includes(v.name) : v.ssmlGender === 'FEMALE'));
  for (const v of list) { writeFileSync(`audio/samples/${v.name}.mp3`, synth(SAMPLE, v.name, 'arahan')); console.log('✓ audio/samples/' + v.name + '.mp3'); }
} else if (has('export-script')) {
  const order = { arahan: 0, galakan: 1, pujian: 2, tenang: 3 };
  const rows = catalog().slice().sort((a, b) => order[a.mood] - order[b.mood] || a.key.localeCompare(b.key));
  const csv = ['id,ekspresi,teks', ...rows.map((r) => `${idOf(r.key)},${r.mood},"${r.text.replace(/"/g, '""')}"`)].join('\n');
  writeFileSync(`${DIR}/skrip-rakaman.csv`, '﻿' + csv);
  console.log(`Skrip rakaman: ${rows.length} ayat -> ${DIR}/skrip-rakaman.csv (simpan setiap rakaman sebagai <id>.wav / .m4a / .mp3)`);
} else if (arg('from-recordings')) {
  const src = arg('from-recordings');
  let n = 0;
  for (const it of catalog()) {
    const id = idOf(it.key);
    const inp = ['wav', 'm4a', 'mp3', 'ogg', 'aac'].map((e) => join(src, `${id}.${e}`)).find(existsSync);
    if (!inp) continue;
    // mono, potong senyap di awal/akhir, seimbangkan kekuatan bunyi
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', inp, '-ac', '1', '-ar', '24000', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5', '-b:a', '48k', join(DIR, `${id}.mp3`)]);
    n++;
  }
  console.log(`${n} rakaman ditukar.`);
  writeManifest(arg('voice') || 'Rakaman suara', 'rakaman');
} else {
  const vs = voices();
  const voice = arg('voice') || bestFemale(vs)?.name;
  if (!voice) { console.error('Tiada suara wanita ms-MY ditemui.'); process.exit(1); }
  const items = catalog();
  const limit = +arg('limit') || Infinity;
  console.log(`Suara: ${voice} · ${items.length} ayat`);
  let made = 0, skipped = 0;
  for (const it of items) {
    if (made >= limit) break;
    const f = join(DIR, `${idOf(it.key)}.mp3`);
    if (existsSync(f) && !has('force')) { skipped++; continue; }
    writeFileSync(f, synth(it.text, voice, it.mood));
    made++;
    if (made % 50 === 0) console.log(`  ... ${made} klip dijana`);
  }
  console.log(`Dijana: ${made}, sedia ada: ${skipped}`);
  writeManifest(voice, 'google-tts');
}
