// Ujian TAMAN AKHLAK: data kisah + permainan sebenar dalam pelayar
// node tests/akhlak.test.mjs [--data]
import { STORIES, DEEDS, CATS, PLANTS, MILESTONES } from '../js/akhlak/data.js';
import { ART } from '../js/tekasilang/art.js';

let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
const probs = [];
const EMOJI = /\p{Extended_Pictographic}/u;
for (const s of STORIES) {
  if (s.choices.filter((c) => c.good).length !== 1) probs.push(`${s.id}: mesti tepat satu pilihan baik`);
  if (s.choices.length < 2) probs.push(`${s.id}: kurang pilihan`);
  for (const c of s.choices) { if (!(c.art in ART)) probs.push(`${s.id}: tiada ilustrasi ${c.art}`); if (!c.r || !c.t) probs.push(`${s.id}: pilihan tanpa teks/respons`); }
  if (!CATS[s.cat] || !PLANTS[CATS[s.cat].plant]) probs.push(`${s.id}: kategori/tanaman tidak sah`);
  if (!s.lesson || !s.q || !s.lines.length) probs.push(`${s.id}: tiada pengajaran/soalan/cerita`);
  for (const t of [...s.lines, s.q, s.lesson, ...s.choices.map((c) => c.r)]) if (EMOJI.test(t)) probs.push(`${s.id}: emoji dalam teks suara`);
}
ok(STORIES.length === 30 && new Set(STORIES.map((s) => s.id)).size === 30, '30 kisah akhlak dengan id unik');
ok(probs.length === 0, `setiap kisah sah: satu pilihan baik, ilustrasi wujud, ada pengajaran${probs.length ? '\n   ' + probs.join('\n   ') : ''}`);
ok(Object.keys(CATS).every((k) => STORIES.some((s) => s.cat === k)), `semua 6 kategori akhlak diliputi`);
ok(DEEDS.length >= 8 && DEEDS.every((d) => d.art in ART), `${DEEDS.length} Amal Hari Ini dengan ilustrasi`);

globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
const S = await import('../js/akhlak/store.js');
const a = S.aprof('u');
ok(S.storyOpen(a, 0) && S.storyOpen(a, 2) && !S.storyOpen(a, 3), 'permulaan: 3 kisah pertama terbuka');
let r1 = S.completeStory(a, STORIES[0]); const r2 = S.completeStory(a, STORIES[0]);
ok(r1.first && !r2.first && a.plants.length === 1, 'kisah selesai menanam satu bunga (main semula tidak menggandakan)');
for (let i = 1; i < 3; i++) r1 = S.completeStory(a, STORIES[i]);
ok(r1.milestone?.id === 'ramarama' && S.storyOpen(a, 5), 'pencapaian kebun (rama-rama pada 3 bunga) & kisah seterusnya dibuka');
ok(S.addDeed(a, DEEDS[0]) && !S.addDeed(a, DEEDS[0]) && a.deedsTotal === 1, 'amal hari ini dikira sekali sehari');
S.resetAkhlak('u');
ok(S.aprof('u').plants.length === 0, 'set semula ibu bapa memadam kebun');

if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data Taman Akhlak lulus'); process.exit(failures ? 1 : 0); }

const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8776;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
await ctx.addInitScript(() => { globalThis.__dcTimeScale = 0.05; });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /Taman Akhlak/.test(m.text()))) errors.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400 && !/manifest\.json/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
const store = () => page.evaluate(() => { const d = JSON.parse(localStorage.getItem('dc-akhlak-v1') || '{}'); return d[window.__dc.getState().currentId] || {}; });
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.mode-card').count() === 15, '15 permainan asal kekal');
  await page.locator('.ak-entry:visible').click();
  await page.waitForSelector('.ak-hub .ak-garden-card');
  ok(true, 'kad Taman Akhlak membuka hab dengan Kebun Amal');
  await page.click('.ak-card.c-kisah');
  await page.waitForSelector('.ak-story');
  ok(await page.locator('.ak-story').count() === 30, 'senarai 30 kisah');
  await page.locator('.ak-story').first().click();
  await page.waitForFunction(() => window.__akPlay?.ready(), null, { timeout: 15000 });
  await page.evaluate(() => window.__akPlay.choose(false));
  await page.waitForSelector('.ak-choice.no');
  ok((await store()).plants?.length ? false : true, 'pilihan kurang baik: tiada hukuman, tiada bunga, boleh cuba lagi');
  await page.evaluate(() => window.__akPlay.choose(true));
  await page.waitForSelector('.ak-lesson.show', { timeout: 15000 });
  ok((await store()).plants?.length === 1, 'pilihan baik: pengajaran dipaparkan & bunga ditanam');
  await page.click('text=Kisah seterusnya');
  await page.waitForFunction(() => location.hash === '#/akhlak/kisah/tangankanan' && document.querySelector('.ak-title')?.textContent === 'Masa Makan' && window.__akPlay?.ready(), null, { timeout: 15000 });
  await page.evaluate(() => window.__akPlay.choose(true));
  await page.waitForSelector('.ak-lesson.show', { timeout: 15000 });
  ok((await store()).plants?.length === 2, 'kisah kedua menambah bunga kedua');
  await page.click('text=Lihat kebun');
  await page.waitForSelector('.ak-garden-big .ak-plant');
  ok(await page.locator('.ak-garden-big .ak-plant').count() === 2, 'Kebun Amal memaparkan bunga yang ditanam');
  // amal hari ini + pengesahan ibu bapa
  await page.evaluate(() => window.__dc.go('/akhlak/amal'));
  await page.waitForSelector('.ak-deed');
  await page.locator('.ak-deed').first().click();
  await page.waitForSelector('.modal input[aria-label="jawapan"]');
  const qtext = await page.locator('.modal p', { hasText: 'darab' }).textContent();
  const W = { tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11, 'dua belas': 12 };
  const m = qtext.match(/bagi: (.+) darab (.+)$/);
  await page.fill('.modal input[aria-label="jawapan"]', String(W[m[1].trim()] * W[m[2].trim()]));
  await page.click('.modal button:has-text("Sahkan")');
  await page.waitForSelector('.ak-deed.done');
  ok((await store()).deedsTotal === 1, 'amal hari ini disahkan ibu bapa → buah di pokok kebun');
  // kunci ibu bapa
  await page.evaluate(() => { window.__dc.getState().settings.disabledModes.push('akhlak'); window.__dc.go('/'); });
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.ak-entry.locked:visible').count() === 1, 'kad dikunci apabila ibu bapa mengunci');
  await page.evaluate(() => window.__dc.go('/akhlak'));
  await page.waitForSelector('text=sedang dikunci oleh ibu bapa');
  ok(true, 'laluan Taman Akhlak disekat semasa dikunci');
  await page.evaluate(() => { const st = window.__dc.getState().settings; st.disabledModes = st.disabledModes.filter((x) => x !== 'akhlak'); });
  // luar talian
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
  await page.waitForTimeout(1500);
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('.mode-card', { timeout: 10000 });
  await page.evaluate(() => window.__dc.go('/akhlak/kisah/kongsi'));
  await page.waitForFunction(() => document.querySelector('.ak-title')?.textContent === 'Biskut Coco' && window.__akPlay?.ready(), null, { timeout: 15000 });
  await page.evaluate(() => window.__akPlay.choose(true));
  await page.waitForSelector('.ak-lesson.show', { timeout: 15000 });
  ok(true, 'luar talian: kisah boleh dimainkan');
  await ctx.setOffline(false);
  await page.evaluate(() => window.__dc.go('/main/abc/1'));
  await page.waitForSelector('.stage, .play-head', { timeout: 8000 });
  ok(true, 'permainan asal masih dibuka seperti biasa');
} catch (e) { failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0]); }
ok(errors.length === 0, `tiada ralat JavaScript / fail hilang${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian Taman Akhlak gagal` : '\n✓ Ujian Taman Akhlak lulus');
process.exit(failures ? 1 : 0);
