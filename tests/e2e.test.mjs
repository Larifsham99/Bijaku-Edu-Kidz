// Ujian hujung-ke-hujung: memainkan level sebenar dalam pelayar untuk setiap mod
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');

const PORT = 8765;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const BASE = `http://localhost:${PORT}/index.html`;
const errors = [];
const browser = await chromium.launch();
const all = process.argv.includes('--all');
// --capture=fail.json : rekod setiap ayat yang disebut (untuk katalog suara)
const captureFile = process.argv.find((a) => a.startsWith('--capture='))?.slice(10);
const captured = [];

async function newPage(width = 412, height = 900, ctx = null) {
  ctx = ctx || await browser.newContext({ viewport: { width, height }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.stack + ' @ ' + page.url()));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.addInitScript(() => { globalThis.__dcTimeScale = 0.03; });
  if (captureFile) {
    await page.exposeFunction('__dcCapSend', (x) => { captured.push(x); });
    await page.addInitScript(() => { globalThis.__dcCapture = { push: (x) => window.__dcCapSend(x) }; });
  }
  return page;
}

let failures = 0;
const ok = (c, msg) => { if (!c) { failures++; console.error('✗', msg); } };

try {
  // ---------- pendaftaran ----------
  const page = await newPage();
  await page.goto(BASE);
  await page.fill('input[aria-label="Nama pemain"]', 'Aisyah');
  await page.click('text=Seterusnya');
  await page.click('text=5 tahun');
  await page.click('text=Seterusnya');
  await page.click('text=Coco si Arnab');
  await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.mode-card').count() === 15, '15 kad mod di halaman utama');
  ok(await page.locator('text=Aisyah').count() > 0, 'nama pemain dipaparkan');
  await page.screenshot({ path: 'tests/out-home.png', fullPage: true });

  // fungsi bantu: main satu level hingga selesai
  async function playLevel(pg, mode, L) {
    await pg.evaluate(([m, l]) => { location.hash = `/main/${m}/${l}`; }, [mode, L]);
    await pg.waitForSelector('.stage');
    for (let guard = 0; guard < 20; guard++) {
      const done = await pg.locator('text=Selesai!').count();
      if (done) break;
      await pg.waitForTimeout(80);
      const res = await pg.evaluate(async () => {
        const s = window.__dc.session();
        if (!s) return 'tiada sesi';
        try { await s.solveRound(); return 'ok'; } catch (e) { return 'ralat: ' + e.message; }
      });
      if (res !== 'ok') { ok(false, `${mode} L${L}: ${res}`); break; }
      await pg.waitForTimeout(150);
    }
    const fin = await pg.locator('text=Selesai!').count();
    if (!fin) { const info = await pg.evaluate(() => { const s = window.__dc.session(); return s ? `pusingan ${s.index + 1}/${s.rounds.length} ${s.rounds[s.index]?.type}/${s.rounds[s.index]?.gen}` : 'tiada sesi'; }); ok(false, `${mode} L${L} tidak selesai — ${info}`); }
    return fin > 0;
  }

  const modes = await page.evaluate(() => Object.keys(window.__dc.MODES));
  // buka semua level untuk ujian
  await page.evaluate(() => {
    const st = window.__dc.getState();
    const p = st.profiles[0];
    for (const m of Object.keys(window.__dc.MODES)) { p.modes[m] = { done: {}, plays: 0, time: 0 }; for (let i = 1; i <= 49; i++) p.modes[m].done[i] = 3; }
  });
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
  const levels = all ? Array.from({ length: 50 }, (_, i) => i + 1) : [1, 6, 15, 21, 24, 33, 42, 50];
  // jalankan beberapa halaman selari
  await page.waitForTimeout(600);
  const pages = [page, ...(await Promise.all([1, 2, 3].map(() => newPage(412, 900, page.context()))))];
  for (const pg of pages.slice(1)) {
    await pg.goto(BASE);
    await pg.waitForSelector('.mode-card');
    await pg.evaluate(() => { const p = window.__dc.getState().profiles[0]; for (const m of Object.keys(window.__dc.MODES)) { p.modes[m] = { done: {}, plays: 0, time: 0 }; for (let i = 1; i <= 49; i++) p.modes[m].done[i] = 3; } });
  }
  const jobs = (only ? modes.filter((m) => m === only) : modes).flatMap((m) => levels.map((L) => [m, L]));
  let n = 0;
  await Promise.all(pages.map(async (pg) => {
    while (jobs.length) {
      const [m, L] = jobs.shift();
      await playLevel(pg, m, L);
      n++;
      if (n % 25 === 0) console.log(`  ... ${n} level dimainkan`);
    }
  }));
  console.log(`Level dimainkan: ${n}`);
  for (const pg of pages.slice(1)) await pg.close();

  // ---------- skrin lain ----------
  for (const path of ['/', '/harian', '/bebas', '/bebas/warna', '/bebas/warna/epal', '/bebas/lukis', '/bebas/bunyi', '/bebas/susun', '/bebas/puzzle', '/bebas/puzzle/2/6', '/bebas/teroka', '/bebas/teroka/haiwan', '/trofi', '/trofi/pelekat', '/trofi/lencana', '/trofi/sijil', '/trofi/bintang', '/kedai', '/kedai/topi', '/kedai/aksesori', '/mod/abc', '/profil']) {
    await page.evaluate((p) => { location.hash = p; }, path);
    await page.waitForTimeout(250);
    const txt = await page.evaluate(() => document.querySelector('#app').innerText.trim().length);
    ok(txt > 20, `skrin kosong: ${path}`);
  }
  // cabaran harian: main kelima-lima
  for (let i = 0; i < 5; i++) {
    await page.evaluate((k) => { location.hash = '/harian/' + k; }, i);
    await page.waitForSelector('.stage');
    await page.waitForTimeout(100);
    await page.evaluate(async () => { await window.__dc.session().solveRound(); });
    await page.waitForTimeout(700);
  }
  ok(await page.locator('text=Cabaran Harian Selesai!').count() > 0, 'hadiah cabaran harian');
  await page.click('text=Yeay!');

  // ---------- ruang ibu bapa (pintu soalan) ----------
  await page.evaluate(() => { location.hash = '/'; });
  await page.waitForSelector('text=Ruang Ibu Bapa');
  await page.click('.tile-btn:has-text("Ruang Ibu Bapa")');
  const q = await page.locator('text=Taip jawapan bagi').innerText();
  const W = { tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11, 'dua belas': 12 };
  const mm = q.match(/bagi: (.+) darab (.+)$/);
  await page.fill('input[aria-label="jawapan"]', '1');
  await page.click('text=Sahkan');
  ok(await page.locator('text=Jawapan tidak tepat').count() > 0, 'pintu menolak jawapan salah');
  await page.fill('input[aria-label="jawapan"]', String(W[mm[1].trim()] * W[mm[2].trim()]));
  await page.click('text=Sahkan');
  await page.waitForSelector('text=Pencapaian setiap kategori');
  await page.screenshot({ path: 'tests/out-parent.png', fullPage: true });
  for (const t of ['kemahiran', 'aktiviti', 'tetapan', 'profil']) {
    await page.evaluate((x) => { location.hash = '/ibubapa/' + x; }, t);
    await page.waitForTimeout(250);
    ok(await page.locator('.panel').count() > 0, `tab ibu bapa ${t}`);
  }
  const mastered = await page.evaluate(() => Object.keys(window.__dc.getState().profiles[0].skills).length);
  ok(mastered > 30, 'kemahiran direkodkan: ' + mastered);

  // ---------- kegigihan data selepas muat semula ----------
  const before = await page.evaluate(() => window.__dc.getState().profiles[0].stars);
  await page.waitForTimeout(600);
  await page.evaluate(() => { location.hash = '/'; });
  await page.reload();
  await page.waitForSelector('.mode-card');
  const after = await page.evaluate(() => window.__dc.getState().profiles[0].stars);
  ok(before > 0 && after === before, `bintang kekal selepas muat semula (${before} → ${after})`);

  // ---------- had masa ----------
  await page.evaluate(() => { const st = window.__dc.getState(); st.settings.timeLimit = 10; const p = st.profiles[0]; const d = new Date(); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; p.activity[k].time = 9999; location.hash = '/mod/abc'; });
  await page.waitForTimeout(300);
  ok(await page.locator('text=Masa Rehat!').count() > 0, 'skrin had masa');

  // ---------- tablet ----------
  const tab = await newPage(1024, 768);
  await tab.goto(BASE);
  await tab.waitForTimeout(400);
  await tab.screenshot({ path: 'tests/out-tablet.png' });
} catch (e) {
  failures++;
  console.error('✗ Ralat ujian:', e);
} finally {
  await browser.close();
  server.kill();
}
if (captureFile) {
  const { writeFileSync } = await import('node:fs');
  const uniq = [...new Map(captured.map((c) => [c.text + '|' + c.mood, c])).values()];
  writeFileSync(captureFile, JSON.stringify(uniq));
  console.log(`Tangkapan suara: ${uniq.length} ayat unik -> ${captureFile}`);
}
const real = errors.filter((e) => !/favicon|speech|AudioContext/i.test(e));
real.slice(0, 20).forEach((e) => console.error('  ', e));
if (real.length) failures++;
console.log(failures ? `\n✗ ${failures} kegagalan` : '\n✓ Ujian pelayar lulus');
process.exit(failures ? 1 : 0);
