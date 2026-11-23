// Ujian SENTUHAN JARI KECIL: Wuduk (mulut/hidung tersasar) & Bina Dunia (padam dengan tekan blok)
// node tests/sentuh.test.mjs
import { createRequire } from 'node:module';
let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
import { spawn } from 'node:child_process';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const srv = spawn('python3', ['-m', 'http.server', '8784'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await ctx.addInitScript(() => { globalThis.__gmFast = true; });
await p.goto('http://localhost:8784/index.html');
await p.fill('input[aria-label="Nama pemain"]', 'Uji');
await p.click('text=Seterusnya'); await p.click('text=Seterusnya'); await p.click('text=Jom Mula!');
await p.waitForSelector('.mode-card');
// WUDUK: level 2 = langkah 4-6 (kumur, hidung, muka) -> sentuh 10px di sebelah hidung/mulut
await p.evaluate(() => { const id = window.__dc.getState().currentId; const d = JSON.parse(localStorage.getItem('dc-games-v1') || '{}'); d[id] ||= {}; d[id].wuduk = { stars: { 1: 3 } }; d[id].bina = { stars: {} }; localStorage.setItem('dc-games-v1', JSON.stringify(d)); });
await p.reload(); await p.waitForSelector('.mode-card');
await p.evaluate(() => window.__dc.go('/g/wuduk/1')); await p.waitForTimeout(1500);
await p.click('.wd-say'); await p.waitForTimeout(1800);
for (let i = 0; i < 3; i++) { const r = await p.evaluate(() => { const q = document.querySelector('.wd-part[data-part="tapak"] circle').getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }); await p.mouse.click(r[0], r[1]); await p.waitForTimeout(300); }
await p.waitForTimeout(900);
const info = async () => p.evaluate(() => (document.querySelector('.wd-card')?.textContent || '').slice(0, 60) + ' | ' + (document.querySelector('.gm-bubble')?.textContent || ''));
for (const part of ['mulut', 'hidung']) {
  for (let i = 0; i < 3; i++) {
    const r = await p.evaluate((pt) => { const e = document.querySelector(`.wd-part[data-part="${pt}"] :not(.wd-hit)`); const q = e.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2, q.width, q.height]; }, part);
    // jari tersasar 9px ke kanan-bawah
    await p.mouse.click(r[0] + 9, r[1] + 7); await p.waitForTimeout(300);
  }
  const after = await info();
  ok(/3\/3|Alhamdulillah/.test(after), `Wuduk: 3 ketikan tersasar 9px dari ${part} tetap dikira`);
  await p.waitForTimeout(800);
}
// BINA: letak blok, kemudian padam dengan tekan pada muka atas blok
await p.evaluate(() => window.__dc.go('/g/bina/1')); await p.waitForTimeout(1500);
const cv = await p.locator('.bd-build').boundingBox();
await p.mouse.click(cv.x + cv.width * 0.45, cv.y + cv.height * 0.55); await p.waitForTimeout(400);
const c1 = await p.evaluate(() => document.querySelector('.bd-count').textContent);
await p.click('.bd-tools button:has-text("Padam")').catch(async () => { await p.click('text=Padam'); });
await p.waitForTimeout(200);
// tekan sedikit di atas (muka atas blok yang lebih tinggi)
await p.mouse.click(cv.x + cv.width * 0.45, cv.y + cv.height * 0.55 - 14); await p.waitForTimeout(400);
const c2 = await p.evaluate(() => document.querySelector('.bd-count').textContent);
ok(c1.startsWith('1/') && c2.startsWith('0/'), `Bina Dunia: tekan muka atas blok memadamkannya (${c1} -> ${c2})`);
ok(errs.length === 0, 'tiada ralat JavaScript');
await b.close(); srv.kill();
console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian sentuhan lulus');
process.exit(failures ? 1 : 0);
