// Ujian permainan SENGET: Bola Guling & Titian Imbang
// node tests/tilt.test.mjs [--data]
//  --data : simulasi fizik semua 60 level dengan autopilot (tanpa pelayar)
globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
const { makeRng } = await import('../js/rng.js');
const L = await import('../js/games/tiltlevels.js');
const W = await import('../js/games/tiltworld.js');
let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };

for (const [name, mk, cfg, label] of [['guling', L.makeGuling, W.BALL, 'Bola Guling'], ['imbang', L.makeImbang, W.WALKER, 'Titian Imbang']]) {
  const bad = []; const times = []; let pieces = 0;
  for (let n = 1; n <= 30; n++) {
    const lv = mk(n, makeRng(`${name}:${n}`));
    pieces += lv.pieces.length;
    if (lv.stars?.length !== 3) bad.push(`L${n}: ${lv.stars?.length} bintang`);
    if (n >= 5 && !lv.checks?.length) bad.push(`L${n}: tiada checkpoint`);
    const r = W.simulate(lv, cfg);
    if (!r.ok) bad.push(`L${n}: ${r.reason} ${JSON.stringify(r)}`);
    else times.push(r.t);
  }
  ok(bad.length === 0, `${label}: 30 level boleh ditamatkan (fizik + autopilot)${bad.length ? ': ' + bad.slice(0, 4).join('; ') : ''}`);
  if (times.length > 20) ok(times.slice(20).reduce((a, b) => a + b, 0) / 10 > times.slice(0, 10).reduce((a, b) => a + b, 0) / 10, `${label}: level makin panjang/sukar (purata L1–10 ${(times.slice(0, 10).reduce((a, b) => a + b, 0) / 10).toFixed(0)} s → L21–30 ${(times.slice(20).reduce((a, b) => a + b, 0) / 10).toFixed(0)} s)`);
}
// fizik asas: bola menggolek ikut senget, berhenti dengan geseran, jatuh di tepi
{
  const w = new W.World([{ cx: 0, cy: 0, z: 0, hw: 2, hl: 2, ang: 0, th: 0.6 }]);
  const b = W.makeBody(W.BALL, 0, 0, 0);
  for (let i = 0; i < 60; i++) W.step(b, w, { x: 1, y: 0 }, 1 / 120);
  const v1 = Math.hypot(b.vx, b.vy);
  ok(b.vx > 0.5 && b.x > 0, `bola memecut ikut arah senget (vx ${b.vx.toFixed(2)})`);
  for (let i = 0; i < 240; i++) W.step(b, w, { x: 0, y: 0 }, 1 / 120);
  ok(Math.hypot(b.vx, b.vy) < v1, 'bola perlahan apabila telefon rata (geseran/inersia)');
  let dead = false;
  for (let i = 0; i < 1200 && !dead; i++) { W.step(b, w, { x: 1, y: 0 }, 1 / 120); if (b.events.some(([k]) => k === 'dead')) dead = true; }
  ok(dead, 'bola jatuh apabila keluar dari platform');
}
if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data permainan senget lulus'); process.exit(failures ? 1 : 0); }

// ===================== PELAYAR =====================
const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8782;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400 && !/manifest\.json/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.bj-xtile', { hasText: 'Bola Guling' }).count() === 1 && await page.locator('.bj-xtile', { hasText: 'Titian Imbang' }).count() === 1, 'kad Bola Guling & Titian Imbang dalam rak Aksi 3D');
  for (const id of ['guling', 'imbang']) {
    await page.evaluate((g) => window.__dc.go(`/g/${g}/1`), id);
    await page.waitForSelector('.tt-box', { timeout: 8000 });
    ok(true, `${id}: tutorial interaktif dipaparkan pada kali pertama`);
    // tiada sensor dalam pelayar desktop → joystick sentuh disediakan
    await page.waitForSelector('.tj-joy', { state: 'attached', timeout: 5000 });
    ok(await page.locator('.tj-bar').count() === 1 && await page.locator('.tj-sens').count() === 1, `${id}: bar kawalan (kalibrasi, kepekaan, joystick) ada`);
    await page.click('.tt-skip');
    await page.waitForSelector('.tt-box', { state: 'detached' });
    await page.waitForSelector('.tg-canvas');
    const hud = await page.locator('.tg-hud').count();
    ok(hud === 1, `${id}: HUD masa, syiling & bintang dipaparkan`);
    // gerak dengan papan kekunci (kawalan sandaran)
    await page.keyboard.down('ArrowUp'); await page.waitForTimeout(900); await page.keyboard.up('ArrowUp');
    ok(true, `${id}: kawalan papan kekunci/joystick berfungsi tanpa ralat`);
    await page.evaluate(() => { globalThis.__gmFast = true; window.__gmPlay.solve(); });
    await page.waitForSelector('.gm-win .bj-ribbon', { timeout: 90000 });
    ok(true, `${id}: level 1 dimainkan hingga penamat (reben Hebat!)`);
    const best = await page.evaluate(() => localStorage.getItem('bj-tilt-best'));
    ok(best && JSON.parse(best) && Object.keys(JSON.parse(best)).some((k) => k.startsWith(id)), `${id}: rekod masa terbaik disimpan`);
  }
  // kali kedua: tiada tutorial, terus skrin "Mula"
  await page.evaluate(() => window.__dc.go('/g/guling/1'));
  await page.waitForSelector('.tg-ready', { timeout: 8000 });
  ok(await page.locator('.tt-box').count() === 0, 'tutorial tidak diulang; skrin Mula + kalibrasi');
  // sensor wujud walaupun requestPermission() tidak memberi 'granted' (Chrome baharu) → kekal mod senget
  await page.evaluate(() => {
    globalThis.DeviceOrientationEvent.requestPermission = async () => 'denied';
    window.__fakeOri = setInterval(() => { const e = new Event('deviceorientation'); e.beta = 25; e.gamma = 0; dispatchEvent(e); }, 16);
  });
  await page.click('.tg-start', { force: true });
  await page.waitForTimeout(1600);
  ok(await page.locator('.tg-ready').count() === 0, 'lapisan "Level N / tekan Mula" hilang selepas Mula ditekan');
  await page.waitForTimeout(2600); // kiraan 3-2-1-Jom!
  ok(await page.locator('.tg-count').count() === 0, 'kiraan 3-2-1-Jom! dipaparkan lalu hilang');
  ok(await page.evaluate(() => document.scrollingElement.scrollHeight <= innerHeight + 1), 'permainan muat dalam satu skrin (tiada tatal)');
  await page.click('.tg-pause');
  await page.waitForSelector('.tg-pausebox');
  const t1 = await page.evaluate(() => document.querySelector('.tg-hud b').textContent);
  await page.waitForTimeout(800);
  ok(await page.evaluate(() => document.querySelector('.tg-hud b').textContent) === t1, 'butang jeda menghentikan masa');
  await page.click('.tg-pb.go');
  await page.waitForSelector('.tg-pausebox', { state: 'detached' });
  ok(true, 'sambung selepas jeda');
  ok(await page.locator('.tj-joy').evaluate((e) => e.hidden), 'sensor senget dikesan & digunakan walaupun kebenaran tidak "granted"');
  await page.evaluate(() => { const e = new Event('deviceorientation'); clearInterval(window.__fakeOri); window.__fakeOri = setInterval(() => { const ev = new Event('deviceorientation'); ev.beta = 15; ev.gamma = 0; dispatchEvent(ev); }, 16); void e; });
  await page.waitForTimeout(1500);
  ok(parseInt(await page.evaluate(() => document.querySelector('.tg-fill').style.width), 10) > 0, 'senget telefon ke depan menggolek bola ke hadapan');
  await page.evaluate(() => clearInterval(window.__fakeOri));
  // tetapan kepekaan disimpan
  const s0 = await page.evaluate(() => localStorage.getItem('bj-tilt-v1'));
  await page.locator('.tj-sens button, .tj-sens .tj-btn').last().click({ force: true });
  const s1 = await page.evaluate(() => localStorage.getItem('bj-tilt-v1'));
  ok(s1 && s1 !== s0, 'kepekaan senget boleh dilaras & disimpan');
} catch (e) { failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0]); }
ok(errors.length === 0, `tiada ralat JavaScript / fail hilang${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian permainan senget lulus');
process.exit(failures ? 1 : 0);
