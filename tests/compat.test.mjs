// Ujian KESERASIAN: pelayar lama (tiada aspect-ratio / color-mix), notis level berkunci,
// sandaran lengkap untuk pindah peranti.   node tests/compat.test.mjs [--data]
import fs from 'node:fs';
const { AR_RULES } = await import('../js/compat-rules.js');
let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
// senarai aspect-ratio dalam CSS mesti sepadan dengan polyfill (elak tertinggal bila CSS berubah)
const found = [];
for (const f of fs.readdirSync('css').filter((x) => x.endsWith('.css') && x !== 'compat.css')) {
  const t = fs.readFileSync(`css/${f}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of t.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim().split('\n').pop().trim(); const a = m[2].match(/aspect-ratio\s*:\s*([0-9.]+)\s*(?:\/\s*([0-9.]+))?/);
    if (a && !sel.includes('::') && !sel.startsWith('@')) found.push(sel);
  }
}
const known = AR_RULES.map((r) => r[0]);
const missing = found.filter((s) => !known.includes(s));
ok(missing.length === 0, `semua ${found.length} pemilih aspect-ratio ada polyfill untuk pelayar lama${missing.length ? ' (tiada: ' + missing.join(', ') + ')' : ''}`);
if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data keserasian lulus'); process.exit(failures ? 1 : 0); }

const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8781;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [];
const browser = await chromium.launch();
// ---------- simulasi pelayar lama ----------
const old = await browser.newContext({ viewport: { width: 390, height: 760 }, serviceWorkers: 'block' });
await old.addInitScript(() => {
  const st = document.createElement('style'); st.textContent = '*,*::before,*::after{aspect-ratio:auto!important}';
  document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st));
  const orig = CSS.supports.bind(CSS); CSS.supports = (a, b) => (/aspect-ratio|color-mix/.test(a + (b || '')) ? false : orig(a, b));
});
await old.route('**/*.css', async (route) => { const r = await route.fetch(); const body = (await r.text()).replaceAll('color-mix(', 'colour-mixx('); route.fulfill({ response: r, body, headers: { ...r.headers(), 'content-type': 'text/css' } }); });
const pg = await old.newPage();
pg.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
try {
  await pg.goto(`http://localhost:${PORT}/index.html?demo#/g/robot/1`);
  await pg.waitForSelector('.rb-board'); await pg.waitForTimeout(600);
  const bh = await pg.evaluate(() => document.querySelector('.rb-board').getBoundingClientRect().height);
  ok(bh > 200, `pelayar lama: papan Robot Kod Cilik kelihatan (tinggi ${Math.round(bh)}px, sebelum ini 0)`);
  for (let i = 0; i < 4 && !(await pg.locator('.gm-win').count()); i++) { await pg.evaluate(() => window.__gmPlay?.solve?.()); await pg.waitForTimeout(3200); }
  ok(await pg.locator('.gm-win').count() === 1, 'pelayar lama: Robot Kod Cilik level 1 boleh dimainkan hingga tamat');
  await pg.goto(`http://localhost:${PORT}/index.html?demo#/silang/main/0/1`);
  await pg.waitForSelector('.ts-tile'); await pg.waitForTimeout(500);
  const tbg = await pg.evaluate(() => getComputedStyle(document.querySelector('.ts-tile')).backgroundColor);
  ok(tbg !== 'rgba(0, 0, 0, 0)', `pelayar lama: kepingan huruf Teka Silang berwarna (${tbg})`);
  await pg.goto(`http://localhost:${PORT}/index.html?demo#/g/bina/1`);
  await pg.waitForSelector('.bd-cube');
  ok(await pg.evaluate(() => getComputedStyle(document.querySelector('.bd-cube')).backgroundColor) !== 'rgba(0, 0, 0, 0)', 'pelayar lama: warna blok Bina Dunia kelihatan');
  await pg.goto(`http://localhost:${PORT}/index.html?demo#/`); await pg.waitForSelector('.bj-word i');
  ok(await pg.evaluate(() => getComputedStyle(document.querySelector('.bj-word i')).backgroundColor) !== 'rgba(0, 0, 0, 0)', 'pelayar lama: logo BIJAKU berwarna');
} catch (e) { failures++; console.log('✗ ralat (pelayar lama): ' + e.message.split('\n')[0]); }
// ---------- notis berkunci & sandaran ----------
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, acceptDownloads: true });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  await page.evaluate(() => window.__dc.go('/g/robot'));
  await page.waitForSelector('.gm-lv.locked');
  ok(await page.locator('.gm-note').count() === 1, 'peta level menerangkan: level dibuka satu demi satu, kemajuan per peranti');
  await page.locator('.gm-lv.locked').nth(3).click();
  await page.waitForSelector('.bj-lock-card');
  ok(/masih berkunci/.test(await page.locator('.bj-lock-card b').textContent()), 'tekan level berkunci → notis bertulis (bukan suara sahaja)');
  await page.click('.bj-lock-card button.green');
  await page.waitForFunction(() => location.hash === '#/g/robot/1');
  ok(true, 'butang "Main level 1" pada notis membawa ke level yang betul');
  await page.evaluate(() => window.__dc.go('/g/robot/7'));
  await page.waitForSelector('.bj-lock-card');
  ok(await page.evaluate(() => location.hash) === '#/g/robot' && /Level 7 belum dibuka/.test(await page.locator('.bj-lock-card b').textContent()), 'pautan terus ke level berkunci → kembali ke peta + notis');
  await page.click('.bj-lock-card button.ghost');
  await page.evaluate(() => window.__dc.go('/main/abc/1')); await page.waitForTimeout(300);
  await page.evaluate(() => window.__dc.go('/mod/abc'));
  await page.waitForSelector('.lvl.locked, .lvl');
  const lockedBtn = page.locator('button[aria-label$="berkunci"]').first();
  if (await lockedBtn.count()) { await lockedBtn.click(); await page.waitForSelector('.bj-lock-card'); ok(true, 'permainan asal: notis level berkunci dipaparkan'); await page.click('.bj-lock-card button.ghost'); }
  // sandaran lengkap
  await page.evaluate(() => { const id = window.__dc.getState().currentId; localStorage.setItem('dc-games-v1', JSON.stringify({ [id]: { robot: { stars: { 1: 3, 2: 2 } } } })); });
  await page.evaluate(() => window.__dc.go('/ibubapa/tetapan'));
  const qtext = await page.locator('.modal p', { hasText: 'darab' }).textContent();
  const W = { tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11, 'dua belas': 12 };
  const mm = qtext.match(/bagi: (.+) darab (.+)$/);
  await page.fill('.modal input[aria-label="jawapan"]', String(W[mm[1].trim()] * W[mm[2].trim()]));
  await page.click('.modal button:has-text("Sahkan")');
  await page.waitForSelector('.dev-list li');
  ok(await page.locator('.dev-list li').count() >= 8, 'Tetapan: panel Semak Peranti menyenaraikan ciri pelayar');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Simpan sandaran")')]);
  const data = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  ok(!!data._modules?.['dc-games-v1'] && JSON.parse(data._modules['dc-games-v1'])[data.currentId].robot.stars[2] === 2, 'sandaran merangkumi kemajuan Robot & permainan lain (boleh pindah peranti)');
  // pulihkan di "peranti baharu"
  const ctx2 = await browser.newContext({ viewport: { width: 412, height: 860 } });
  const p2 = await ctx2.newPage();
  await p2.goto(`http://localhost:${PORT}/index.html`);
  await p2.click('text=Pindah dari peranti lain');
  const q2 = await p2.locator('.modal p', { hasText: 'darab' }).textContent(); const m2 = q2.match(/bagi: (.+) darab (.+)$/);
  await p2.fill('.modal input[aria-label="jawapan"]', String(W[m2[1].trim()] * W[m2[2].trim()]));
  await p2.click('.modal button:has-text("Sahkan")');
  await p2.waitForSelector('text=Pulihkan sandaran');
  const fp = `${process.env.TMPDIR || '/tmp'}/bijaku-sandaran-ujian.json`; fs.writeFileSync(fp, JSON.stringify(data));
  await p2.setInputFiles('input[type=file]', fp);
  await p2.click('.modal button:has-text("Ya"), .modal button.green');
  await p2.waitForTimeout(1500);
  const got = await p2.evaluate(() => JSON.parse(localStorage.getItem('dc-games-v1') || '{}'));
  ok(Object.values(got)[0]?.robot?.stars?.[2] === 2, 'peranti baharu: pulihkan sandaran → kemajuan Robot dipindahkan');
  await ctx2.close();
} catch (e) { failures++; console.log('✗ ralat ujian: ' + e.message.split('\n')[0]); }
ok(errors.length === 0, `tiada ralat JavaScript${errors.length ? ':\n   ' + errors.slice(0, 6).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian keserasian gagal` : '\n✓ Ujian keserasian lulus');
process.exit(failures ? 1 : 0);
