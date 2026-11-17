// Jana gambar skrin aplikasi untuk halaman jualan: node tools/sales-shots.mjs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8771;
const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch();

async function setup(viewport) {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: 2, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${PORT}/index.html`);
  await pg.fill('input[aria-label="Nama pemain"]', 'Aisyah');
  await pg.click('text=Seterusnya'); await pg.click('text=5 tahun'); await pg.click('text=Seterusnya');
  await pg.click('text=Coco si Arnab'); await pg.click('text=Jom Mula!');
  await pg.waitForSelector('.mode-card');
  // keadaan kemajuan contoh supaya paparan kelihatan seperti sedang digunakan
  await pg.evaluate(() => {
    const p = window.__dc.getState().profiles[0];
    const prog = { abc: 14, nombor: 11, warna: 9, bunyi: 6, puzzle: 8, ingatan: 10, seni: 5, bayang: 4, maze: 7, harian: 6, kelas: 3, soleh: 5, haiwan: 9, minda: 4, misi: 2 };
    for (const [m, n] of Object.entries(prog)) { p.modes[m] = { done: {}, plays: n, time: n * 70 }; for (let i = 1; i <= n; i++) p.modes[m].done[i] = 4; }
    p.stars = 412; p.totalStarsEarned = 412; p.coins = 286;
    p.trophies = ['abc-10', 'nombor-10', 'ingatan-10']; p.stickers = ['🦄', '🌈', '🍭', '🚀', '🦕', '🐳', '🌻', '🍩', '🎠', '🦜', '🍉', '🧸', '🐞', '🌟', '🎨', '🦩', '🐬', '🍀', '🪁'];
    p.wear = { hat: 'crown', acc: 'anone' }; p.owned.costumes.push('crown');
    p.badges = ['first', 'lv10', 'lv50', 'star100', 'streak3', 'daily1', 'free'];
    p.streak = { last: '', count: 4 };
    const skills = { 'abc.kenal': [14, 13], 'abc.cari': [12, 11], 'abc.awal': [9, 7], 'abc.besarkecil': [8, 5], 'nombor.kira': [15, 14], 'nombor.kenal': [9, 8], 'nombor.tambah': [5, 3], 'warna.kenal': [10, 10], 'bentuk.kenal': [9, 8], 'ingat.pasangan': [10, 8], 'haiwan.nama': [8, 8], 'haiwan.habitat': [6, 4], 'soleh.adab': [6, 6], 'soleh.hijaiyah': [5, 3], 'bunyi.haiwan': [7, 6], 'harian.rutin': [5, 4], 'maze.laluan': [7, 7], 'puzzle.susun': [8, 8], 'kelas.buahsayur': [3, 2], 'minda.corak': [4, 2] };
    for (const [id, [r, f]] of Object.entries(skills)) p.skills[id] = { rounds: r, firstTry: f, attempts: r + (r - f) * 2, time: r * 9, last: Date.now(), recent: Array.from({ length: Math.min(r, 10) }, (_, i) => (i < Math.round(f / r * Math.min(r, 10)) ? 1 : 0)) };
    const d = new Date();
    for (let i = 0; i < 7; i++) { const x = new Date(d); x.setDate(d.getDate() - i); const k = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; p.activity[k] = { time: [1260, 900, 1500, 600, 1080, 1320, 840][i], levels: [5, 3, 6, 2, 4, 5, 3][i], rounds: [22, 14, 27, 9, 18, 23, 13][i] }; }
    window.__dc.go('/');
  });
  return pg;
}
async function shot(pg, hash, name, { wait = 1000, scroll = 0, theme } = {}) {
  await pg.evaluate(([h, t]) => { if (t) window.__dc.getState().profiles[0].theme = t; location.hash = h + (h.includes('?') ? '' : ''); }, [hash, theme]);
  await pg.evaluate((h) => { if (location.hash !== '#' + h) location.hash = h; else window.dispatchEvent(new HashChangeEvent('hashchange')); }, hash);
  await pg.waitForTimeout(wait);
  await pg.evaluate(() => document.querySelectorAll('.toast, .confetti').forEach((e) => e.remove()));
  if (scroll) { await pg.evaluate((y) => window.scrollTo(0, y), scroll); await pg.waitForTimeout(200); }
  await pg.screenshot({ path: `jualan/img/${name}.jpg`, type: 'jpeg', quality: 78 });
  console.log('✓', name);
}

const phone = await setup({ width: 390, height: 844 });
await shot(phone, '/', 'home');
await shot(phone, '/', 'home-modes', { scroll: 640 });
await shot(phone, '/main/abc/2', 'abc');
await shot(phone, '/main/nombor/1', 'nombor');
await shot(phone, '/main/puzzle/7', 'puzzle');
await shot(phone, '/main/maze/8', 'maze');
await shot(phone, '/main/seni/1', 'seni');
await shot(phone, '/main/soleh/5', 'soleh');
await shot(phone, '/main/ingatan/1', 'ingatan', { wait: 2600 });
await shot(phone, '/mod/abc', 'levels');
await shot(phone, '/kedai/tema', 'tema');
await shot(phone, '/trofi', 'trofi');
await shot(phone, '/', 'home-batik', { theme: 'batik' });
await shot(phone, '/', 'home-malam', { theme: 'malam' });
await shot(phone, '/', 'home-songket', { theme: 'songket' });
await shot(phone, '/', 'home-kuih', { theme: 'kuih' });
await shot(phone, '/', 'home-masjid', { theme: 'masjid' });
await shot(phone, '/', 'home', { theme: 'kampung' });
const tab = await setup({ width: 1180, height: 820 });
await shot(tab, '/', 'tablet-home');
await tab.evaluate(() => { window.__dcParent = true; });
// Ruang ibu bapa (lalu pintu pengesahan)
await tab.click('.tile-btn:has-text("Ruang Ibu Bapa")');
const q = await tab.locator('text=Taip jawapan bagi').innerText();
const W = { tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11, 'dua belas': 12 };
const mm = q.match(/bagi: (.+) darab (.+)$/);
await tab.fill('input[aria-label="jawapan"]', String(W[mm[1].trim()] * W[mm[2].trim()]));
await tab.click('text=Sahkan');
await tab.waitForTimeout(900);
await tab.screenshot({ path: 'jualan/img/tablet-parent.jpg', type: 'jpeg', quality: 78 });
await tab.evaluate(() => { location.hash = '/ibubapa/kemahiran'; });
await tab.waitForTimeout(900);
await tab.screenshot({ path: 'jualan/img/tablet-skills.jpg', type: 'jpeg', quality: 78 });
console.log('✓ tablet');
await b.close(); srv.kill();
