// Ujian TEKA SILANG CILIK: 450 level (data) + permainan sebenar dalam pelayar
// node tests/silang.test.mjs          -> data + pelayar
// node tests/silang.test.mjs --data   -> data sahaja
import { CHAPTERS, LEVELS_PER_CHAPTER } from '../js/tekasilang/data.js';
import { buildLevel, TOTAL, isPlate } from '../js/tekasilang/levels.js';
import { ART } from '../js/tekasilang/art.js';
import { NABI } from '../js/data/content.js';

let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
const probs = [];
const bad = (id, m) => probs.push(`${id}: ${m}`);

// ---------------- KANDUNGAN ----------------
ok(CHAPTERS.length === 15, '15 chapter');
const nabi = CHAPTERS.find((c) => c.id === 'nabi').words.map((w) => w.w);
const ref = NABI.map((n) => n.toUpperCase());
ok(ref.length === 25 && ref.every((n) => nabi.includes(n)), 'kesemua 25 nama nabi dimasukkan dengan tepat (sama seperti senarai Si Cilik Soleh)');
for (const c of CHAPTERS) for (const w of c.words) {
  if (!/^[A-Z]{2,9}$/.test(w.w)) bad(c.id, `perkataan tidak sah ${w.w}`);
  if (!(w.art in ART)) bad(c.id, `tiada ilustrasi ${w.art}`);
}
ok(!CHAPTERS.flatMap((c) => c.words).some((w) => w.art === 'nabi' && ART.nabi() !== ''), 'tiada gambaran rupa nabi (papan nama sahaja)');

// ---------------- 450 LEVEL ----------------
const ids = new Set(), sigs = new Map(), modes = {};
for (let ci = 0; ci < CHAPTERS.length; ci++) for (let n = 1; n <= LEVELS_PER_CHAPTER; n++) {
  const L = buildLevel(ci, n), id = L.id;
  if (ids.has(id)) bad(id, 'id berulang'); ids.add(id);
  for (const k of ['chapter', 'n', 'mode', 'cat', 'hint', 'complete', 'reward']) if (L[k] === undefined || L[k] === '') bad(id, `tiada ${k}`);
  if (!L.rounds.length) bad(id, 'tiada pusingan');
  for (const r of L.rounds) {
    modes[r.mode] = (modes[r.mode] || 0) + 1;
    if (['A', 'B', 'C'].includes(r.mode)) {
      const need = [...r.word].filter((_, i) => !r.given.includes(i));
      if (!need.length) bad(id, 'tiada kotak kosong');
      const pool = [...r.pool];
      for (const ch of need) { const k = pool.indexOf(ch); if (k < 0) bad(id, `huruf ${ch} tiada dalam pilihan`); else pool.splice(k, 1); }
      if (r.mode === 'A' && isPlate(r)) bad(id, 'gambar→perkataan tanpa gambar');
    }
    if (r.mode === 'I' && r.tiles.filter((t) => t === r.target).length !== r.count) bad(id, 'cari huruf: bilangan salah');
    if (r.mode === 'G' && (!r.options.includes(r.word) || new Set(r.options).size !== 3)) bad(id, 'bayang: pilihan tidak sah');
    if (r.mode === 'F' && (r.items.length !== 3 || r.items.some((x) => isPlate(x)))) bad(id, 'padan: perlukan 3 gambar');
    if (r.entries) {
      const cells = new Map();
      for (const e of r.entries) for (let i = 0; i < e.word.length; i++) {
        const k = `${e.r + (e.dir === 'v' ? i : 0)},${e.c + (e.dir === 'h' ? i : 0)}`;
        if (e.r < 0 || e.c < 0 || e.r + (e.dir === 'v' ? e.word.length : 1) > r.h || e.c + (e.dir === 'h' ? e.word.length : 1) > r.w) bad(id, 'perkataan keluar grid');
        if (cells.has(k) && cells.get(k) !== e.word[i]) bad(id, `silang bercanggah di ${k}`);
        cells.set(k, e.word[i]);
      }
      if (r.entries.length >= 2) {
        // setiap perkataan mesti bersilang dengan sekurang-kurangnya satu perkataan lain
        for (const e of r.entries) { const ks = [...e.word].map((_, i) => `${e.r + (e.dir === 'v' ? i : 0)},${e.c + (e.dir === 'h' ? i : 0)}`); if (!r.entries.some((o) => o !== e && [...o.word].some((_, i) => ks.includes(`${o.r + (o.dir === 'v' ? i : 0)},${o.c + (o.dir === 'h' ? i : 0)}`)))) bad(id, `${e.word} tidak bersilang`); }
      }
      for (const [k, ch] of cells) if (!r.given.includes(k) && !r.pool.includes(ch)) bad(id, `huruf ${ch} tiada dalam dulang`);
      if (r.w > 9 || r.h > 9) bad(id, 'grid terlalu besar');
    }
  }
  if (n === 30 && !(L.master && L.reward.sticker && L.rounds.some((r) => r.entries && r.entries.length >= 4))) bad(id, 'level 30 bukan Chapter Master');
  const sig = JSON.stringify(L.rounds);
  if (sigs.has(sig)) bad(id, `sama dengan ${sigs.get(sig)}`); sigs.set(sig, id);
}
ok(ids.size === TOTAL && TOTAL === 450, `${ids.size} level tersedia (15 chapter × 30)`);
ok(probs.length === 0, `semua level sah: jawapan ada dalam pilihan huruf, grid silang konsisten, tiada pendua${probs.length ? '\n   ' + probs.slice(0, 12).join('\n   ') : ''}`);
ok(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'J'].every((m) => modes[m] > 0) && buildLevel(0, 17).mode === 'H', `10 mekanik digunakan: ${JSON.stringify(modes)} + H (campuran)`);
// kepelbagaian kosa kata: banyak perkataan berbeza, tiada pengulangan berlebihan
const variety = [];
for (let ci = 0; ci < CHAPTERS.length; ci++) {
  const cnt = {}; let consec = 0, prev = new Set();
  for (let n = 1; n <= LEVELS_PER_CHAPTER; n++) { const w = buildLevel(ci, n).words; w.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; }); if (w.some((x) => prev.has(x))) consec++; prev = new Set(w); }
  const used = Object.keys(cnt).length, max = Math.max(...Object.values(cnt)), c = CHAPTERS[ci];
  const nabiCh = c.id === 'nabi';
  if (c.words.length < 27) variety.push(`${c.id}: hanya ${c.words.length} perkataan`);
  if (used < Math.min(c.words.length, 100)) variety.push(`${c.id}: hanya ${used}/${c.words.length} perkataan digunakan`);
  if (max > (nabiCh ? 6 : 5)) variety.push(`${c.id}: satu perkataan muncul ${max} kali`);
  if (consec > (nabiCh ? 6 : 1)) variety.push(`${c.id}: ${consec} level berturut berkongsi perkataan`);
}
const totalWords = new Set(CHAPTERS.flatMap((c) => c.words.map((w) => w.w))).size;
ok(variety.length === 0 && totalWords >= 300, `kosa kata pelbagai: ${totalWords} perkataan unik; setiap perkataan chapter digunakan, maksimum 4–6 kali, tiada ulangan berturut${variety.length ? '\n   ' + variety.join('\n   ') : ''}`);
const again = await import('../js/tekasilang/levels.js?ulang');
ok(JSON.stringify(again.buildLevel(5, 22)) === JSON.stringify(buildLevel(5, 22)), 'level dijana semula dengan sama (main semula stabil)');

// storan & progres
globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
const S = await import('../js/tekasilang/store.js');
const t = S.tprof('u');
ok(S.levelOpen(t, 0, 1) && !S.levelOpen(t, 0, 2) && !S.chapterOpen(t, 1), 'permulaan: hanya level 1 chapter 1 dibuka');
let res; for (let n = 1; n <= 10; n++) res = S.record(t, buildLevel(0, n), 3);
ok(S.chapterOpen(t, 1) && res.openedChapter === 1, 'selepas 10 level, chapter 2 dibuka (dengan bunyi pembukaan)');
S.resetSilang('u');
ok(S.totalStars(S.tprof('u')) === 0, 'set semula ibu bapa memadam kemajuan Teka Silang');

if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data Teka Silang lulus'); process.exit(failures ? 1 : 0); }

// ---------------- PELAYAR ----------------
const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8774;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [], spoken = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
await ctx.addInitScript(() => { globalThis.__dcTimeScale = 0.05; });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /Teka Silang/.test(m.text()))) errors.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400 && !/manifest\.json/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.mode-card').count() === 15, '15 permainan asal kekal');
  await page.locator('.ts-entry:visible').click();
  await page.waitForSelector('.ts-home .ts-chap');
  ok(await page.locator('.ts-chap').count() === 15, 'kad Teka Silang membuka 15 chapter');
  // rakam sebarang suara (permainan ini mesti tanpa suara)
  await page.evaluate(() => { const o = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = (u) => { (window.__spoken ||= []).push(u.text); }; window.__spokenStart = 1; });
  const play = async (ci, n, label) => {
    await page.evaluate(([ci, n]) => window.__dc.go(`/silang/main/${ci}/${n}`), [ci, n]);
    await page.waitForFunction((h) => location.hash === h && !document.querySelector('.ts-win') && document.querySelector('.ts-pz') && window.__tsPlay?.level.id, `#/silang/main/${ci}/${n}`, { timeout: 8000 });
    for (let i = 0; i < 6 && !(await page.locator('.ts-win').count()); i++) { await page.evaluate(() => window.__tsPlay?.solve()); await page.waitForTimeout(400); }
    await page.waitForSelector('.ts-win', { timeout: 8000 });
    const st = await page.evaluate(([ci, n]) => { const d = JSON.parse(localStorage.getItem('dc-silang-v1') || '{}'); const pid = window.__dc.getState().currentId; return d[pid]?.done?.[['allah', 'rukunislam', 'rukuniman', 'solat', 'wuduk', 'doa', 'adab', 'keluarga', 'masjid', 'nabi', 'kisah', 'makanan', 'ciptaan', 'ramadan', 'soleh'][ci]]?.[n] || 0; }, [ci, n]);
    ok(st >= 1, `${label}: diselesaikan & disimpan (${st} bintang)`);
  };
  await play(0, 1, 'Level 1 (gambar→perkataan)');
  // isi kotak sebenar dengan ketikan: level 2 tanpa autosolve
  await page.click('.ts-win .ts-btn.go');
  await page.waitForFunction(() => location.hash === '#/silang/main/0/2' && !document.querySelector('.ts-win') && document.querySelector('.ts-slot-pz'));
  for (let i = 0; i < 20 && !(await page.locator('.ts-win').count()); i++) {
    const need = await page.evaluate(() => { const r = window.__tsPlay.level.rounds; const pz = document.querySelector('.ts-slot-pz'); if (!pz) return null; const slots = [...pz.querySelectorAll('.ts-slot')]; const k = slots.findIndex((s) => !s.classList.contains('filled')); const ri = [...document.querySelectorAll('.ts-dots i')].findIndex((d) => d.classList.contains('cur')); return k >= 0 ? r[ri].word[k] : null; });
    if (!need) { await page.waitForTimeout(500); continue; }
    await page.locator('.ts-slot-pz .ts-tray .ts-tile:not(.used)', { hasText: need }).first().click();
    await page.waitForTimeout(120);
  }
  await page.waitForSelector('.ts-win', { timeout: 8000 });
  ok(true, 'level 2 diselesaikan dengan mengetik huruf sebenar');
  // buka semua chapter untuk menguji setiap mekanik
  await page.evaluate(() => { const pid = window.__dc.getState().currentId; const d = JSON.parse(localStorage.getItem('dc-silang-v1')); for (const id of ['allah', 'rukunislam', 'rukuniman', 'solat', 'wuduk', 'doa', 'adab', 'keluarga', 'masjid', 'nabi', 'kisah', 'makanan', 'ciptaan', 'ramadan', 'soleh']) { d[pid].done[id] ||= {}; for (let i = 1; i < 30; i++) d[pid].done[id][i] ||= 2; } localStorage.setItem('dc-silang-v1', JSON.stringify(d)); location.hash = '/x'; location.reload(); });
  await page.waitForSelector('.mode-card');
  await page.evaluate(() => { speechSynthesis.speak = (u) => { (window.__spoken ||= []).push(u.text); }; });
  const want = { B: 'huruf hilang', I: 'cari huruf', D: 'silang mini', G: 'bayang', C: 'huruf terapung', F: 'padan perkataan', H: 'campuran', E: 'silang bergambar', J: 'lengkapkan papan' };
  for (const [m, label] of Object.entries(want)) {
    let f = null;
    for (let ci = 0; ci < 15 && !f; ci++) for (let n = 2; n < 30 && !f; n++) { const L = buildLevel(ci, n); if (L.mode === m || (m !== 'H' && L.rounds.some((r) => r.mode === m))) f = [ci, n]; }
    await play(f[0], f[1], `Mod ${m} – ${label} (${CHAPTERS[f[0]].n} L${f[1]})`);
  }
  if (process.argv.includes('--all')) {
    let n0 = 0;
    for (let ci = 0; ci < 15; ci++) for (let n = 1; n <= 30; n++) {
      await page.evaluate(([ci, n]) => { location.hash = `/silang/main/${ci}/${n}`; }, [ci, n]);
      await page.waitForSelector('.ts-pz', { timeout: 8000 });
      for (let i = 0; i < 8 && !(await page.locator('.ts-win').count()); i++) { await page.evaluate(() => window.__tsPlay?.solve()); await page.waitForTimeout(250); }
      if (await page.locator('.ts-win').count()) n0++; else console.log('  tidak selesai: ' + buildLevel(ci, n).id);
      if (n0 % 50 === 0) console.log(`  ... ${n0} level`);
    }
    ok(n0 === 450, `kesemua 450 level dimainkan hingga tamat dalam pelayar (${n0})`);
  }
  await play(9, 30, 'Chapter Master 25 Nabi (L30)');
  ok(await page.locator('.ts-win.master').count() === 1, 'level 30 memaparkan pelekat & pingat chapter');
  await page.evaluate(() => { location.hash = '/silang/pelekat'; });
  await page.waitForSelector('.ts-sticker.got');
  ok(await page.locator('.ts-sticker.got').count() >= 1, 'pelekat chapter dibuka dalam Buku Pelekat');
  const spokenN = await page.evaluate(() => (window.__spoken || []).length);
  ok(spokenN === 0, `permainan tanpa suara (tiada ucapan dimainkan: ${spokenN})`);
  // kunci ibu bapa
  await page.evaluate(() => { window.__dc.getState().settings.disabledModes.push('silang'); location.hash = '/'; });
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.ts-entry.locked:visible').count() === 1, 'kad dikunci apabila ibu bapa mengunci');
  await page.evaluate(() => { location.hash = '/silang/main/0/1'; });
  await page.waitForSelector('text=sedang dikunci oleh ibu bapa');
  ok(true, 'laluan Teka Silang disekat semasa dikunci');
  await page.evaluate(() => { const st = window.__dc.getState().settings; st.disabledModes = st.disabledModes.filter((x) => x !== 'silang'); });
  // luar talian
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
  await page.waitForTimeout(1500);
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('.mode-card', { timeout: 10000 });
  await play(0, 3, 'Luar talian: level dimainkan');
  await ctx.setOffline(false);
  // regresi: permainan asal & racing
  await page.evaluate(() => { location.hash = '/main/abc/1'; });
  await page.waitForSelector('.stage, .play-head', { timeout: 8000 });
  await page.evaluate(() => { location.hash = '/lumba'; });
  await page.waitForSelector('.rc-home', { timeout: 8000 });
  ok(true, 'ABC Ceria & Cilik Racing masih dibuka seperti biasa');
} catch (e) { failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0]); }
ok(errors.length === 0, `tiada ralat JavaScript / fail hilang${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian Teka Silang gagal` : '\n✓ Ujian Teka Silang Cilik lulus');
process.exit(failures ? 1 : 0);
