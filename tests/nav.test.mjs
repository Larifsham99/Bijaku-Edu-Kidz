// Ujian NAVIGASI: butang kembali telefon (bukan "undo" berantai), menu jeda, Rumah & dialog keluar
// node tests/nav.test.mjs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
const { parentOf } = await import('../js/nav.js');
ok(parentOf('/main/abc/3') === '/mod/abc' && parentOf('/mod/abc') === '/' && parentOf('/g/kedai/2') === '/g/kedai' && parentOf('/g/kedai') === '/' && parentOf('/') === null && parentOf('/silang/main/1/4') === '/silang/bab/1', 'skrin induk logik (bukan sejarah)');
const PORT = 8783;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 839 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
try {
  await p.goto(`http://localhost:${PORT}/index.html`);
  await p.fill('input[aria-label="Nama pemain"]', 'Uji');
  await p.click('text=Seterusnya'); await p.click('text=Seterusnya'); await p.click('text=Jom Mula!');
  await p.waitForSelector('.mode-card');
  const hash = () => p.evaluate(() => location.hash);
  const back = async () => { await p.evaluate(() => history.back()); await p.waitForTimeout(500); };
  for (const r of ['/mod/abc', '/main/abc/1']) { await p.evaluate((x) => window.__dc.go(x), r); await p.waitForTimeout(400); }
  await p.waitForSelector('.stage');
  ok(await p.evaluate(() => history.length) <= 3, 'navigasi dalam aplikasi tidak memanjangkan sejarah pelayar');
  await back();
  ok(await p.locator('.bj-pause-back').count() === 1 && await hash() === '#/main/abc/1', 'kembali semasa bermain: menu jeda (permainan tidak hilang)');
  await back();
  ok(await p.locator('.bj-pause-back').count() === 0 && await p.locator('.stage').count() === 1, 'kembali sekali lagi: sambung bermain');
  await p.click('.rb-pause'); await p.waitForSelector('.bj-pause-back');
  ok(await p.locator('.bj-pause .bj-pb').count() >= 4, 'butang ⏸: Sambung, Rumah, Peta, Mula semula');
  await p.click('.bj-pb.home'); await p.waitForTimeout(600);
  ok(await hash() === '#/' && await p.locator('.mode-card').count() > 0, 'Rumah: terus ke skrin utama');
  await p.evaluate(() => window.__dc.go('/g/kedai')); await p.waitForTimeout(500);
  await back();
  ok(await hash() === '#/', 'kembali dari peta permainan: ke skrin utama (bukan skrin sebelumnya)');
  await back();
  ok(await p.locator('.bj-exit-back').count() === 1, 'kembali di skrin utama: "Mahu keluar dari BIJAKU?"');
  await back();
  ok(await p.locator('.bj-exit-back').count() === 0 && await hash() === '#/', 'kembali sekali lagi: dialog ditutup, kekal dalam aplikasi');
  await p.evaluate(() => window.__dc.go('/g/kedai/1')); await p.waitForSelector('.gm-pausebtn');
  await p.click('.gm-pausebtn'); await p.waitForSelector('.bj-pause-back');
  ok(true, 'permainan baharu: butang ⏸ membuka menu jeda');
  await p.click('.bj-pb.go'); await p.waitForTimeout(300);
  ok(await p.locator('.bj-pause-back').count() === 0, 'Sambung menutup menu jeda');
} catch (e) { failures++; console.log('✗ ralat: ' + e.message.split('\n')[0]); }
ok(errs.length === 0, `tiada ralat JavaScript${errs.length ? ': ' + errs.join(' | ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian navigasi lulus');
process.exit(failures ? 1 : 0);
