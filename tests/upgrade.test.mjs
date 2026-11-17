// Ujian kemas kini: pengguna versi lama menerima versi baharu pada pautan yang sama
// tanpa kehilangan kemajuan. Pelayan meniru GitHub Pages (Cache-Control: max-age=600).
//   node tests/upgrade.test.mjs [ref-versi-lama]   (lalai: commit pertama)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const oldRef = process.argv[2] || execSync('git rev-list --max-parents=0 HEAD').toString().trim();
const oldDir = await mkdtemp(join(tmpdir(), 'dc-lama-'));
execSync(`git archive ${oldRef} | tar -x -C ${oldDir}`);
const newDir = process.cwd();
let root = oldDir, swOverride = null;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try {
    let body = await readFile(join(root, p));
    if (p === '/sw.js' && swOverride) body = swOverride(body.toString());
    res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(8790);
const URL0 = 'http://localhost:8790/index.html';

let fails = 0;
const ok = (c, m) => { console.log(c ? '✓' : '✗', m); if (!c) fails++; };
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 412, height: 860 } })).newPage();
const errs = [];
pg.on('pageerror', (e) => errs.push(e.message));
await pg.addInitScript(() => { globalThis.__dcTimeScale = 0.03; });

async function playLevel(mode, L) {
  await pg.evaluate(([m, l]) => { location.hash = `/main/${m}/${l}`; }, [mode, L]);
  await pg.waitForSelector('.stage');
  for (let i = 0; i < 20 && !(await pg.locator('text=Selesai!').count()); i++) {
    await pg.waitForTimeout(100);
    await pg.evaluate(async () => { const s = window.__dc.session(); if (s) await s.solveRound(); });
    await pg.waitForTimeout(150);
  }
  return (await pg.locator('text=Selesai!').count()) > 0;
}
const snap = () => pg.evaluate(() => { const p = window.__dc.getState().profiles[0]; return { name: p?.name, stars: p?.stars, coins: p?.coins, done: Object.keys(p?.modes?.abc?.done || {}).length }; });

try {
  // 1. Pembeli memasang versi lama dan bermain
  await pg.goto(URL0);
  await pg.fill('input[aria-label="Nama pemain"]', 'Aisyah');
  await pg.click('text=Seterusnya'); await pg.click('text=Seterusnya'); await pg.click('text=Jom Mula!');
  await pg.waitForSelector('.mode-card');
  ok(await playLevel('abc', 1), 'versi lama: level 1 dimainkan');
  ok(await playLevel('abc', 2), 'versi lama: level 2 dimainkan');
  await pg.evaluate(() => { location.hash = '/'; });
  await pg.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 15000 });
  await pg.waitForTimeout(700);
  const before = await snap();
  console.log('  sebelum kemas kini:', JSON.stringify(before));

  // 2. Versi baharu diterbitkan pada alamat yang sama; pembeli membuka aplikasi semula
  root = newDir;
  await pg.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
  await pg.waitForTimeout(2500);
  await pg.goto(URL0);
  await pg.waitForSelector('.mode-card', { timeout: 15000 });
  await pg.waitForTimeout(500);
  const isNew = await pg.evaluate(() => document.documentElement.dataset.theme === 'kampung' && !!document.getElementById('scene'));
  if (!isNew) { await pg.reload(); await pg.waitForSelector('.mode-card'); await pg.waitForTimeout(500); }
  ok(await pg.evaluate(() => document.documentElement.dataset.theme === 'kampung'), `versi baharu dimuatkan${isNew ? ' pada pembukaan pertama' : ' pada pembukaan kedua (SW lama tiada muat semula automatik)'}`);
  const after = await snap();
  console.log('  selepas kemas kini:', JSON.stringify(after));
  ok(after.name === before.name && after.stars === before.stars && after.coins === before.coins && after.done === before.done, 'kemajuan anak kekal (nama, bintang, syiling, level)');
  ok(await playLevel('abc', 3), 'versi baharu: level seterusnya boleh dimainkan');
  ok(await pg.evaluate(() => window.__dc.getState().profiles[0].theme === 'kampung'), 'profil lama menerima medan baharu (tema)');

  // 3. Kemas kini seterusnya: dikesan & dimuat semula secara automatik
  await pg.evaluate(() => { location.hash = '/'; window.__marker = 1; });
  await pg.waitForTimeout(800);
  swOverride = (s) => s.replace(/const VERSION = '[^']*'/, "const VERSION = 'versi-ujian-berikutnya'");
  await pg.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
  await pg.waitForTimeout(4000);
  ok(await pg.evaluate(() => window.__marker === undefined), 'kemas kini berikutnya dimuat semula secara automatik');
  const last = await snap();
  ok(last.stars === (await snap()).stars && last.done >= 3, 'kemajuan kekal selepas kemas kini automatik');

  // 4. Luar talian selepas kemas kini
  await pg.context().setOffline(true);
  await pg.reload();
  await pg.waitForSelector('.mode-card', { timeout: 10000 });
  ok(true, 'aplikasi dibuka tanpa internet selepas kemas kini');
  ok(await playLevel('nombor', 1), 'level boleh dimainkan tanpa internet');
  await pg.context().setOffline(false);
} catch (e) { ok(false, 'ralat ujian: ' + e.message); }
ok(errs.length === 0, 'tiada ralat JavaScript' + (errs.length ? ': ' + errs.join(' | ') : ''));
await b.close(); server.close();
console.log(fails ? `\n✗ ${fails} kegagalan` : '\n✓ Ujian kemas kini lulus');
process.exit(fails ? 1 : 0);
