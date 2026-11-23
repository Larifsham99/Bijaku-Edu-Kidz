// Ujian KAMERA: Selfie Juara (filter, simpan album, kamera ditutup) & Pemburu Warna
// node tests/camera.test.mjs [--data]   (menggunakan kamera palsu Chromium)
globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
const PW = await import('../js/games/pemburu.js');
const { makeRng } = await import('../js/rng.js');
const { COLORS } = await import('../js/data/content.js');
let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
const cases = [[[230, 30, 40], 'merah'], [[250, 215, 30], 'kuning'], [[30, 90, 230], 'biru'], [[40, 170, 70], 'hijau'], [[250, 140, 30], 'oren'], [[140, 60, 200], 'ungu'], [[250, 140, 190], 'merahjambu'], [[120, 72, 35], 'coklat'], [[25, 25, 30], 'hitam'], [[240, 240, 238], 'putih'], [[128, 128, 128], 'kelabu']];
const bad = cases.filter(([rgb, want]) => PW.classify(...rgb) !== want).map(([rgb, want]) => `${rgb}→${PW.classify(...rgb)} (mahu ${want})`);
ok(bad.length === 0, `pengelas warna kamera tepat untuk 11 warna${bad.length ? ': ' + bad.join('; ') : ''}`);
let tBad = [];
for (let n = 1; n <= 30; n++) {
  const t = PW.makeTargets(n, makeRng(`pemburu:${n}`));
  const k = n > 20 ? 4 : 3;
  if (t.length !== k || new Set(t).size !== k || t.some((c) => !COLORS.find((x) => x.id === c))) tBad.push(`L${n}: ${t}`);
  if (n <= 10 && t.some((c) => !['merah', 'kuning', 'biru', 'hijau'].includes(c))) tBad.push(`L${n}: bab 1 warna asas sahaja`);
  if (n > 20 && !t.some((c) => c === 'hitam' || c === 'putih')) tBad.push(`L${n}: bab 3 tiada hitam/putih`);
}
ok(tBad.length === 0, `Pemburu Warna: 30 level, sasaran unik & ikut bab${tBad.length ? ': ' + tBad.slice(0, 4).join(', ') : ''}`);
if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data kamera lulus'); process.exit(failures ? 1 : 0); }

const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8780;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [];
const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, permissions: ['camera'] });
await ctx.addInitScript(() => {
  window.__cam = { opened: 0, stopped: 0 };
  const gum = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async (c) => { const s = await gum(c); window.__cam.opened++; return s; };
  const st = MediaStreamTrack.prototype.stop;
  MediaStreamTrack.prototype.stop = function () { window.__cam.stopped++; return st.call(this); };
});
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  // tamatkan satu level (Kedai) → skrin menang ada butang selfie
  await page.evaluate(() => window.__dc.go('/g/kedai/1'));
  await page.waitForFunction(() => window.__gmPlay?.id === 'kedai');
  for (let i = 0; i < 6 && !(await page.locator('.gm-win').count()); i++) { await page.evaluate(() => window.__gmPlay?.solve?.()); await page.waitForTimeout(2100); }
  await page.waitForSelector('.gm-win .bj-selfie-btn');
  ok(await page.evaluate(() => window.__cam.opened) === 0, 'kamera TIDAK dibuka secara automatik (hanya bila butang ditekan)');
  await page.click('.gm-win .bj-selfie-btn');
  await page.waitForSelector('.sf-root');
  await page.waitForFunction(() => document.querySelector('.sf-video')?.readyState >= 2, null, { timeout: 10000 });
  ok(true, 'Selfie Juara: kamera depan dibuka & video dipaparkan');
  ok(await page.locator('.sf-f').count() === 5, '5 filter comel tersedia');
  await page.click('.sf-f:nth-child(2)');
  await page.click('.sf-shot');
  await page.waitForSelector('.sf-photo', { timeout: 8000 });
  const cam = await page.evaluate(() => window.__cam);
  ok(cam.stopped >= 1, `kamera ditutup serta-merta selepas gambar diambil (jimat bateri)`);
  await page.click('.sf-btn.go');
  await page.waitForSelector('.sf-root', { state: 'detached' });
  await page.evaluate(() => window.__dc.go('/trofi'));
  await page.click('.bj-album-link');
  await page.waitForSelector('.sf-thumb');
  ok(await page.locator('.sf-thumb').count() === 1, 'foto disimpan dalam Album Selfie (peranti sahaja)');
  const size = await page.evaluate(async () => { const m = await import('/js/selfie.js'); const l = await m.listPhotos(); return l[0].blob.size; });
  ok(size > 5000 && size < 250000, `saiz foto kecil (${Math.round(size / 1024)} KB)`);
  // selfie dari tetingkap modal permainan asal (lapisan mesti di atas modal)
  await page.evaluate(() => { const m = document.createElement('div'); m.className = 'modal-back'; m.id = 'ujimodal'; m.innerHTML = '<div class="modal"><button id="ujisf">x</button></div>'; document.body.appendChild(m); import('/js/selfie.js').then((s) => s.openSelfie('Ujian modal')); });
  await page.waitForFunction(() => document.querySelector('.sf-video')?.readyState >= 2, null, { timeout: 10000 });
  const topEl = await page.evaluate(() => { const r = document.querySelector('.sf-shot').getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return e?.className || ''; });
  ok(/sf-shot/.test(topEl), `butang kamera boleh ditekan walaupun dibuka dari tetingkap modal (atas: ${topEl})`);
  await page.click('.sf-x'); await page.evaluate(() => document.getElementById('ujimodal')?.remove());
  // Pemburu Warna: mod kamera
  await page.evaluate(() => window.__dc.go('/g/pemburu/1'));
  await page.waitForSelector('.pw-intro');
  await page.click('.pw-intro .gm-btn.go');
  await page.waitForFunction(() => document.querySelector('.pw-video')?.readyState >= 2, null, { timeout: 10000 });
  await page.waitForTimeout(600);
  const seen = await page.locator('.pw-seen').textContent();
  ok(/Kamera nampak:/.test(seen), `Pemburu Warna: kamera belakang membaca warna secara langsung ("${seen}")`);
  for (let i = 0; i < 6 && !(await page.locator('.gm-win').count()); i++) { await page.evaluate(() => window.__gmPlay?.solve?.()); await page.waitForTimeout(2100); }
  await page.waitForSelector('.gm-win', { timeout: 10000 });
  ok(await page.locator('.pw-got').count() === 3, 'Pemburu Warna: 3 warna ditangkap ke koleksi & level tamat');
  const c2 = await page.evaluate(() => window.__cam);
  ok(c2.stopped >= 2, 'kamera Pemburu Warna ditutup apabila level tamat');
  // ibu bapa tutup kamera
  await page.evaluate(() => { window.__dc.getState().settings.camera = false; window.__dc.go('/g/pemburu/2'); });
  await page.waitForSelector('.pw-pics');
  ok(await page.locator('.pw-intro').count() === 0, 'kamera ditutup ibu bapa → Pemburu Warna terus ke mod gambar');
  for (let i = 0; i < 6 && !(await page.locator('.gm-win').count()); i++) { await page.evaluate(() => window.__gmPlay?.solve?.()); await page.waitForTimeout(2100); }
  await page.waitForSelector('.gm-win');
  ok(await page.locator('.bj-selfie-btn').count() === 0, 'butang selfie disembunyikan apabila kamera ditutup ibu bapa');
} catch (e) { failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0]); }
ok(errors.length === 0, `tiada ralat JavaScript${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian kamera gagal` : '\n✓ Ujian kamera lulus');
process.exit(failures ? 1 : 0);
