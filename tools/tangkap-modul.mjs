// =====================================================================
//  TANGKAP AYAT MODUL BAHARU — mainkan semua level permainan baharu (js/games),
//  Teka Silang & Taman Akhlak dalam pelayar dan rekod setiap ayat yang disebut.
//    node tools/tangkap-modul.mjs
//  Hasil: audio/ms-MY/modul-capture.json  ->  dibaca oleh tools/skrip-elevenlabs.mjs
// =====================================================================
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { GAMES, GAME_LEVELS } from '../js/games/registry.js';
import { CHAPTERS, LEVELS_PER_CHAPTER } from '../js/tekasilang/data.js';
import { STORIES } from '../js/akhlak/data.js';

const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8811;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
const got = new Map();
await ctx.exposeFunction('__capSend', (x) => { const k = x.text; const prev = got.get(k); if (!prev || (prev.mood === 'arahan' && x.mood !== 'arahan')) got.set(k, x); });
await ctx.addInitScript(() => { globalThis.__dcTimeScale = 0.05; globalThis.__gmFast = true; globalThis.__dcCapture = { push: (x) => window.__capSend(x) }; });
const page = await ctx.newPage();
const log = (s) => process.stdout.write(s);
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Uji');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  // buka semua level / bab / kisah
  await page.evaluate(({ gids, chs, sts, GL, LC }) => {
    const pid = window.__dc.getState().currentId;
    const g = JSON.parse(localStorage.getItem('dc-games-v1') || '{}'); g[pid] ||= {};
    for (const id of gids) { g[pid][id] ||= { stars: {} }; for (let i = 1; i < GL; i++) g[pid][id].stars[i] ||= 1; }
    localStorage.setItem('dc-games-v1', JSON.stringify(g));
    const s = JSON.parse(localStorage.getItem('dc-silang-v1') || '{}'); s[pid] ||= { v: 1, done: {}, seen: [] };
    for (const c of chs) { s[pid].done[c] ||= {}; for (let i = 1; i < LC; i++) s[pid].done[c][i] ||= 1; }
    localStorage.setItem('dc-silang-v1', JSON.stringify(s));
    const a = JSON.parse(localStorage.getItem('dc-akhlak-v1') || '{}'); a[pid] ||= { v: 1, stories: {}, plants: [], deeds: {}, deedsTotal: 0 };
    for (const id of sts) a[pid].stories[id] ||= '2026-01-01';
    localStorage.setItem('dc-akhlak-v1', JSON.stringify(a));
    indexedDB.deleteDatabase?.('dunia-cilik');
  }, { gids: Object.keys(GAMES), chs: CHAPTERS.map((c) => c.id), sts: STORIES.map((s) => s.id), GL: GAME_LEVELS, LC: LEVELS_PER_CHAPTER });
  await page.reload(); await page.waitForSelector('.mode-card');
  // skrin umum
  for (const r of ['/', '/laluan', '/dunia', '/trofi', '/harian']) { await page.evaluate((x) => window.__dc.go(x), r); await page.waitForTimeout(500); }
  // 1) permainan baharu
  for (const id of Object.keys(GAMES)) {
    log(`\n${id}: `);
    for (let n = 1; n <= GAME_LEVELS; n++) {
      await page.evaluate(([gid, k]) => window.__dc.go(`/g/${gid}/${k}`), [id, n]);
      try {
        await page.waitForFunction(([gid, k]) => window.__gmPlay?.id === gid && window.__gmPlay?.n === k && document.querySelector('.gm-stage')?.children.length, [id, n], { timeout: 8000 });
        for (let i = 0; i < 18 && !(await page.locator('.gm-win').count()); i++) {
          await page.evaluate(() => window.__gmPlay?.solve?.());
          await page.waitForTimeout(id === 'guling' || id === 'imbang' ? 3000 : id === 'lompat' ? 2500 : 700);
        }
        await page.waitForTimeout(900);
        log(n % 10 ? '.' : String(n));
      } catch { log('x'); }
    }
  }
  // 2) Teka Silang
  for (let ci = 0; ci < CHAPTERS.length; ci++) {
    log(`\nsilang ${CHAPTERS[ci].id}: `);
    for (let n = 1; n <= LEVELS_PER_CHAPTER; n++) {
      await page.evaluate(([c, k]) => window.__dc.go(`/silang/main/${c}/${k}`), [ci, n]);
      try {
        await page.waitForFunction(() => window.__tsPlay?.level, null, { timeout: 8000 });
        for (let i = 0; i < 10 && !(await page.locator('.ts-win').count()); i++) { await page.evaluate(() => window.__tsPlay?.solve()); await page.waitForTimeout(350); }
        await page.waitForTimeout(500);
        log(n % 10 ? '.' : String(n));
      } catch { log('x'); }
    }
  }
  // 3) Taman Akhlak
  log('\nakhlak: ');
  for (const st of STORIES) {
    await page.evaluate((id) => window.__dc.go(`/akhlak/kisah/${id}`), st.id);
    try {
      await page.waitForFunction(() => window.__akPlay?.ready(), null, { timeout: 20000 });
      await page.evaluate(() => window.__akPlay.choose(false)); await page.waitForTimeout(1200);
      await page.waitForFunction(() => window.__akPlay?.ready(), null, { timeout: 20000 });
      await page.evaluate(() => window.__akPlay.choose(true)); await page.waitForTimeout(2500);
      log('.');
    } catch { log('x'); }
  }
  for (const r of ['/akhlak', '/akhlak/kebun', '/silang', '/silang/pelekat']) { await page.evaluate((x) => window.__dc.go(x), r); await page.waitForTimeout(600); }
} finally {
  const out = [...got.values()];
  writeFileSync('audio/ms-MY/modul-capture.json', JSON.stringify(out, null, 0));
  console.log(`\n${out.length} ayat unik -> audio/ms-MY/modul-capture.json`);
  await browser.close(); server.kill();
}
