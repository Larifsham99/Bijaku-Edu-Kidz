// Ujian LALUAN BIJAK: kurikulum berstruktur, kembali ke laluan selepas langkah, matlamat harian & peti harta
// node tests/path.test.mjs [--data]
globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
globalThis.sessionStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); }, removeItem(k) { delete this.d[k]; } };
const P = await import('../js/screens/path.js');
const { MODES } = await import('../js/modes/index.js');
const { GAMES } = await import('../js/games/registry.js');
const { RC_WORLDS } = await import('../js/racing/data.js');
const { CHAPTERS } = await import('../js/tekasilang/data.js');
const { STORIES } = await import('../js/akhlak/data.js');
let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };

ok(P.RC_WORLD_IDS.join() === RC_WORLDS.map((w) => w.id).join() && P.TS_CHAPTER_IDS.join() === CHAPTERS.map((c) => c.id).join() && P.AK_STORY_IDS.join() === STORIES.map((s) => s.id).join(), 'id dunia racing, bab Teka Silang & kisah akhlak sepadan dengan data asal');
for (const age of [4, 5]) {
  const nodes = P.pathNodes(age);
  const per = {}; let seqOk = true;
  nodes.forEach((nd) => { per[nd.g] = (per[nd.g] || 0) + 1; if (nd.k !== per[nd.g]) seqOk = false; });
  ok(nodes.length === P.UNITS * 10 && seqOk, `umur ${age}: ${nodes.length} langkah; level setiap permainan berturutan (1, 2, 3, …)`);
  const all = [...Object.keys(MODES), 'lumba', 'silang', 'akhlak', ...Object.keys(GAMES)];
  const missing = all.filter((g) => !per[g]);
  ok(missing.length === 0, `umur ${age}: semua ${all.length} permainan muncul dalam laluan${missing.length ? ' (tiada: ' + missing.join(', ') + ')' : ''}`);
  const u1 = nodes.filter((nd) => nd.unit === 1);
  ok(new Set(u1.map((nd) => nd.dom)).size >= 6 && u1.every((nd) => nd.k === 1), `umur ${age}: unit 1 menggilirkan 6+ bidang, semua level 1`);
  ok(nodes.every((nd) => nd.k <= (nd.g === 'lumba' ? 500 : nd.g === 'silang' ? 450 : MODES[nd.g] ? 50 : 30)), `umur ${age}: tiada langkah melebihi bilangan level permainan`);
  const firstSilang = nodes.find((nd) => nd.g === 'silang');
  if (age === 4) ok(firstSilang.unit >= 9, `umur 4: Teka Silang (perlu membaca) bermula lewat (unit ${firstSilang.unit})`);
  else ok(firstSilang.unit <= 5, `umur 5: Teka Silang diperkenalkan awal (unit ${firstSilang.unit})`);
}
const n5 = P.pathNodes(5);
ok(P.nodeRoute(n5[0]) === '/main/abc/1' && P.nodeRoute({ g: 'lumba', k: 51 }) === '/lumba/main/1/1' && P.nodeRoute({ g: 'silang', k: 31 }) === '/silang/main/1/1' && P.nodeRoute({ g: 'akhlak', k: 2 }) === '/akhlak/kisah/tangankanan' && P.nodeRoute({ g: 'robot', k: 4 }) === '/g/robot/4', 'laluan setiap jenis langkah betul');

if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data Laluan Bijak lulus'); process.exit(failures ? 1 : 0); }

const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8779;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
// tanda langkah i selesai terus dalam storan yang betul (seolah-olah anak menamatkan level)
const markDone = (i) => page.evaluate(async (idx) => {
  const m = await import('/js/screens/path.js');
  const p = window.__dc.getState().profiles[0];
  const nd = m.pathNodes(p.age)[idx];
  if (window.__dc.MODES[nd.g]) { p.modes[nd.g] ||= { done: {}, plays: 0, time: 0 }; p.modes[nd.g].done[nd.k] = 3; return nd.g; }
  const pid = String(p.id); const J = (k) => JSON.parse(localStorage.getItem(k) || '{}'); const S = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  if (nd.g === 'lumba') { const d = J('dc-racing-v1'); d[pid] ||= { done: {} }; const w = m.RC_WORLD_IDS[Math.floor((nd.k - 1) / 50)]; (d[pid].done[w] ||= {})[((nd.k - 1) % 50) + 1] = 3; S('dc-racing-v1', d); }
  else if (nd.g === 'silang') { const d = J('dc-silang-v1'); d[pid] ||= { done: {} }; const c = m.TS_CHAPTER_IDS[Math.floor((nd.k - 1) / 30)]; (d[pid].done[c] ||= {})[((nd.k - 1) % 30) + 1] = 3; S('dc-silang-v1', d); }
  else if (nd.g === 'akhlak') { const d = J('dc-akhlak-v1'); d[pid] ||= { stories: {}, plants: [], deeds: {} }; d[pid].stories[m.AK_STORY_IDS[nd.k - 1]] = 1; S('dc-akhlak-v1', d); }
  else { const d = J('dc-games-v1'); d[pid] ||= {}; (d[pid][nd.g] ||= { stars: {} }).stars[nd.k] = 3; S('dc-games-v1', d); }
  return nd.g;
}, i);
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=5 tahun'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.bj-lpslide', { hasText: 'LANGKAH 1' }).count() === 1, 'skrin utama: banner pertama "Laluan Bijak · Langkah 1" dengan butang Mula');
  ok(await page.locator('.bj-goal', { hasText: '0/3' }).count() === 1, 'skrin utama: matlamat hari ini 0/3 langkah');
  await page.click('.bj-lpslide');
  await page.waitForFunction(() => location.hash === '#/main/abc/1');
  ok(true, 'Mula → terus ke langkah 1 (ABC Ceria level 1) tanpa perlu memilih');
  // selesai level, kemudian anak tekan apa-apa butang (cth. ke peta level)
  await markDone(0);
  await page.evaluate(() => window.__dc.go('/mod/abc'));
  await page.waitForFunction(() => location.hash === '#/laluan');
  await page.waitForSelector('.lp-node.done');
  ok(await page.locator('.lp-node.done').count() === 1 && await page.locator('.lp-node.cur[data-i="1"]').count() === 1, 'selepas level tamat, anak dibawa kembali ke laluan; langkah 2 kini bersinar');
  ok(await page.locator('.lp-goal', { hasText: '1 daripada 3' }).count() === 1, 'matlamat harian dikira (1/3)');
  // langkah tidak selesai: keluar → tiada lompatan paksa
  await page.click('.lp-node.cur');
  await page.waitForFunction(() => /#\/main\/nombor\/1/.test(location.hash));
  await page.evaluate(() => window.__dc.go('/'));
  await page.waitForSelector('.mode-card');
  ok(await page.evaluate(() => location.hash) === '#/', 'keluar sebelum selesai: anak bebas ke skrin utama');
  // langkah terkunci
  for (let i = 1; i < 5; i++) await markDone(i);
  await page.evaluate(() => window.__dc.go('/laluan'));
  await page.waitForSelector('.lp-chest.ready');
  const coins0 = await page.evaluate(() => window.__dc.getState().profiles[0].coins);
  await page.locator('.lp-chest.ready').first().click({ force: true });
  await page.waitForSelector('.lp-pop');
  const coins1 = await page.evaluate(() => window.__dc.getState().profiles[0].coins);
  ok(coins1 === coins0 + 15, 'peti harta selepas 5 langkah: +15 syiling & pelekat');
  await page.click('.lp-pop button');
  await page.waitForSelector('.lp-chest.open');
  ok(await page.locator('.lp-goal.done').count() === 1, 'matlamat harian tercapai dipaparkan');
  // semua jenis langkah (modul berasingan) dikesan selesai
  for (let i = 5; i < 30; i++) await markDone(i);
  await page.evaluate(() => window.__dc.go('/laluan'));
  await page.waitForSelector('.lp-node.cur');
  ok(await page.locator('.lp-node.done').count() === 30, '30 langkah merentas semua jenis permainan dikesan selesai');
  // tab panduan ibu bapa
  await page.evaluate(() => window.__dc.go('/ibubapa/panduan'));
  const qtext = await page.locator('.modal p', { hasText: 'darab' }).textContent();
  const W = { tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11, 'dua belas': 12 };
  const mm = qtext.match(/bagi: (.+) darab (.+)$/);
  await page.fill('.modal input[aria-label="jawapan"]', String(W[mm[1].trim()] * W[mm[2].trim()]));
  await page.click('.modal button:has-text("Sahkan")');
  await page.waitForSelector('.dom-bar');
  ok(await page.locator('.dom-bar').count() === 6 && await page.locator('text=Cara terbaik guna BIJAKU').count() === 1, 'Ruang Ibu Bapa: Panduan, matlamat harian & kemajuan 6 bidang');
  await page.click('button:has-text("5 langkah")');
  await page.waitForSelector('button.green:has-text("5 langkah")');
  ok(await page.evaluate(() => window.__dc.getState().settings.pathGoal) === 5, 'ibu bapa boleh menukar matlamat harian');
} catch (e) { failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0]); }
ok(errors.length === 0, `tiada ralat JavaScript${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian Laluan Bijak gagal` : '\n✓ Ujian Laluan Bijak lulus');
process.exit(failures ? 1 : 0);
