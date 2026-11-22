// Ujian PERMAINAN BAHARU (Fasa 2): Kedai Runcit Cilik, Makmal Cilik, Jom Berwuduk, Robot Kod Cilik
// node tests/games.test.mjs [--data]
globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
const { makeRng } = await import('../js/rng.js');
const { GAMES, GAME_IDS, GAME_LEVELS } = await import('../js/games/registry.js');
const robot = await import('../js/games/robot.js');
const kedai = await import('../js/games/kedai.js');
const makmal = await import('../js/games/makmal.js');
const wuduk = await import('../js/games/wuduk.js');
const { ART } = await import('../js/tekasilang/art.js');
const fs = await import('node:fs');

let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };

ok(GAME_IDS.length === 6 && GAME_IDS.every((id) => GAMES[id].chapters.length === 3 && fs.existsSync(GAMES[id].img)), '6 permainan baharu berdaftar, 3 bab setiap satu, ilustrasi kad wujud');

// ---------- Robot: setiap teka-teki boleh diselesaikan & penyelesaian disahkan dengan simulasi ----------
const DIRS = { atas: [0, -1], bawah: [0, 1], kiri: [-1, 0], kanan: [1, 0] };
let rbBad = [], rbLens = [];
for (let n = 1; n <= GAME_LEVELS; n++) {
  const rng = makeRng(`robot:${n}`);
  for (let r = 0; r < (n <= 20 ? 2 : 1); r++) {
    const pz = robot.makePuzzle(n, r, rng);
    let [x, y] = pz.start; const got = new Set(); let crash = false;
    for (const d of pz.solution) {
      x += DIRS[d][0]; y += DIRS[d][1];
      if (x < 0 || y < 0 || x >= pz.size || y >= pz.size || pz.blocked.has(`${x},${y}`)) { crash = true; break; }
      if (pz.bats.includes(`${x},${y}`)) got.add(`${x},${y}`);
    }
    if (crash || x !== pz.goal[0] || y !== pz.goal[1] || got.size !== pz.bats.length || pz.solution.length > pz.maxSlots) rbBad.push(`L${n}r${r}`);
    if (n > 20 && !pz.bats.length) rbBad.push(`L${n}: tiada bateri`);
    if (n > 10 && n <= 20 && !pz.blocked.size) rbBad.push(`L${n}: tiada halangan`);
    rbLens.push(pz.solution.length);
  }
}
ok(rbBad.length === 0, `Robot: 50 teka-teki dijana & penyelesaian disahkan (panjang ${Math.min(...rbLens)}–${Math.max(...rbLens)} langkah)${rbBad.length ? ': ' + rbBad.slice(0, 6).join(', ') : ''}`);

// ---------- Kedai: harga munasabah, duit sesuai bab, bayaran tepat boleh dibuat ----------
let kdBad = [];
for (let n = 1; n <= GAME_LEVELS; n++) {
  const rng = makeRng(`kedai:${n}`);
  for (let r = 0; r < 3; r++) {
    const rd = kedai.makeRound(n, r, rng);
    const total = rd.items.reduce((a, b) => a + b.p, 0);
    const pay = kedai.bestPay(total, rd.notes);
    if (pay.reduce((a, b) => a + b, 0) !== total) kdBad.push(`L${n}: tidak boleh bayar tepat`);
    if (n <= 10 && (rd.notes.join() !== '1' || total > 9)) kdBad.push(`L${n}: bab 1 mesti RM1 & ≤ RM9`);
    if (n > 20 && rd.items.length !== 2) kdBad.push(`L${n}: bab 3 mesti dua barang`);
    if (total > 20 || total < 1) kdBad.push(`L${n}: jumlah ${total}`);
    rd.items.forEach((x) => { if (!(x.it[0] in ART)) kdBad.push(`tiada ilustrasi ${x.it[0]}`); });
  }
}
ok(kdBad.length === 0, `Kedai: 90 pelanggan, harga RM1–RM20 & boleh dibayar tepat${kdBad.length ? ': ' + kdBad.slice(0, 6).join(', ') : ''}`);

// ---------- Makmal: fakta sains ----------
const DRAWN = ['bola', 'itik', 'span', 'kayu', 'botol', 'bulu', 'kunci', 'paku', 'guli', 'gunting', 'klip', 'peniti', 'skru', 'sepana', 'pemadam', 'kertas', 'gelas'];
let mkBad = [];
const SINK = new Set(['batu', 'syiling', 'kunci', 'paku', 'guli', 'gunting', 'telur', 'sepana']);
const MAGNETIC = new Set(['paku', 'klip', 'peniti', 'skru', 'gunting', 'sepana']);
for (let n = 1; n <= GAME_LEVELS; n++) {
  const rds = makmal.makeRounds(n, makeRng(`makmal:${n}`));
  for (const rd of rds) {
    if (rd.kind === 'buat') { if (!rd.beakers.includes(rd.target[1]) || !rd.target[2] || !rd.beakers.includes(rd.target[2])) mkBad.push(`L${n}: bikar tidak cukup untuk ${rd.target[0]}`); }
    const objs = rd.obj ? [rd.obj] : rd.objs || [];
    for (const o of objs) {
      if (!(DRAWN.includes(o[0]) || o[0] in ART)) mkBad.push(`tiada lukisan ${o[0]}`);
      if (rd.test === 'air' && SINK.has(o[0]) === o[2]) mkBad.push(`${o[1]}: timbul/tenggelam salah`);
      if (rd.test === 'magnet' && MAGNETIC.has(o[0]) !== o[2]) mkBad.push(`${o[1]}: magnet salah`);
    }
    if (rd.kind === 'pilih' && !rd.objs.some((o) => o[2])) mkBad.push(`L${n}: tiada jawapan betul`);
  }
}
ok(mkBad.length === 0, `Makmal: campuran warna, timbul/tenggelam & magnet tepat dari segi sains${mkBad.length ? ': ' + [...new Set(mkBad)].slice(0, 6).join(', ') : ''}`);

// ---------- Wuduk: tertib & rukun ----------
const ids = wuduk.STEPS.map((s) => s.id);
const order = ['bismillah', 'tapak', 'kumur', 'hidung', 'muka', 'tangankanan', 'tangankiri', 'kepala', 'telinga', 'kakikanan', 'kakikiri', 'doa'];
ok(ids.join() === order.join(), 'Wuduk: 12 langkah ikut tertib (kanan didahulukan, doa di akhir)');
ok(wuduk.STEPS.filter((s) => s.wajib).map((s) => s.id).join() === 'muka,tangankanan,tangankiri,kepala,kakikanan,kakikiri', 'Wuduk: rukun ditanda wajib (muka & niat, tangan hingga siku, sapu kepala, kaki hingga buku lali)');
let wdBad = [];
for (let n = 1; n <= GAME_LEVELS; n++) {
  const lv = wuduk.makeLevel(n, makeRng(`wuduk:${n}`));
  if (lv.kind === 'susun') lv.rounds.forEach((seq) => { if (seq.some((s, i) => i && order.indexOf(s.id) !== order.indexOf(seq[i - 1].id) + 1)) wdBad.push(`L${n}: susunan tidak berturutan`); });
  if (lv.kind === 'seterusnya') lv.rounds.forEach((r) => { if (order.indexOf(r.ans.id) !== order.indexOf(r.cur.id) + 1 || !r.opts.includes(r.ans) || new Set(r.opts).size !== 3) wdBad.push(`L${n}: soalan seterusnya salah`); });
  if (lv.kind === 'wajib') lv.rounds.forEach((r) => { if (!r.ans.wajib || r.opts.filter((s) => s.wajib).length !== 1) wdBad.push(`L${n}: soalan wajib salah`); });
  if (lv.kind === 'ikut') lv.steps.forEach((s) => { if (s.part && !['tapak', 'mulut', 'hidung', 'muka', 'tanganKanan', 'tanganKiri', 'kepala', 'telinga', 'kakiKanan', 'kakiKiri'].includes(s.part)) wdBad.push(`bahagian ${s.part}`); });
}
ok(wdBad.length === 0, `Wuduk: 30 level (ikut langkah, susun tertib, apa seterusnya, yang mana wajib) sah${wdBad.length ? ': ' + wdBad.slice(0, 5).join(', ') : ''}`);

// ---------- Lompat Blok: setiap laluan boleh diselesaikan (pencari laluan dengan masa) ----------
const lompat = await import('../js/games/lompat.js');
let lbBad = [], lbLen = [];
for (let n = 1; n <= GAME_LEVELS; n++) {
  const c = lompat.makeCourse(n, makeRng(`lompat:${n}`));
  if (!c.solution?.length) lbBad.push(`L${n}: tiada penyelesaian`);
  const kinds = new Set([...c.tiles.values()].map((x) => x.kind));
  if (n > 10 && n <= 20 && !c.platRow.size && !kinds.has('spike')) lbBad.push(`L${n}: bab lava tanpa rintangan bergerak`);
  if (n > 20 && !kinds.has('spring')) lbBad.push(`L${n}: bab awan tanpa spring`);
  if (!kinds.has('goal') || !kinds.has('check')) lbBad.push(`L${n}: tiada trofi/checkpoint`);
  lbLen.push(c.solution.length);
}
ok(lbBad.length === 0, `Lompat Blok: 30 laluan disahkan boleh diselesaikan (${Math.min(...lbLen)}–${Math.max(...lbLen)} langkah)${lbBad.length ? ': ' + lbBad.slice(0, 5).join(', ') : ''}`);

// ---------- Bina Dunia: model boleh dibina ikut peraturan sokongan ----------
const bina = await import('../js/games/bina.js');
const bdBad = bina.MODELS.filter((m) => !bina.buildable(m.blocks) || new Set(m.blocks.map((b) => b.slice(0, 3).join())).size !== m.blocks.length || m.blocks.some(([x, y, z, c]) => x < 0 || y < 0 || x >= m.N || y >= m.N || z < 0 || !bina.COLORS[c])).map((m) => m.n);
const sizes = bina.MODELS.map((m) => m.blocks.length);
ok(bina.MODELS.length === 30 && bdBad.length === 0, `Bina Dunia: 30 model sah & boleh dibina (${Math.min(...sizes)}–${Math.max(...sizes)} blok)${bdBad.length ? ': ' + bdBad.join(', ') : ''}`);

// ---------- storan ----------
const S = await import('../js/games/store.js');
const g = S.gprof('u', 'robot');
ok(S.levelOpen(g, 1) && !S.levelOpen(g, 2), 'permulaan: hanya level 1 terbuka');
S.record(g, 1, 2); S.record(g, 1, 1);
ok(g.stars[1] === 2 && S.levelOpen(g, 2) && S.totalStars(g) === 2, 'bintang terbaik disimpan & level seterusnya dibuka');
S.resetGames('u');
ok(S.levelsDone(S.gprof('u', 'robot')) === 0, 'set semula ibu bapa memadam kemajuan');

if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} gagal` : '\n✓ Ujian data permainan baharu lulus'); process.exit(failures ? 1 : 0); }

// ===================== PELAYAR =====================
const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8778;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
await ctx.addInitScript(() => { globalThis.__gmFast = true; });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /Permainan baharu/.test(m.text()))) errors.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400 && !/manifest\.json/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
const stars = (id) => page.evaluate((gid) => { const d = JSON.parse(localStorage.getItem('dc-games-v1') || '{}'); return d[window.__dc.getState().currentId]?.[gid]?.stars || {}; }, id);
async function playLevel(id, n) {
  await page.evaluate(([gid, k]) => window.__dc.go(`/g/${gid}/${k}`), [id, n]);
  await page.waitForTimeout(50);
  await page.waitForFunction(([gid, k]) => window.__gmPlay?.id === gid && window.__gmPlay?.n === k && !document.querySelector('.gm-win') && document.querySelector('.gm-stage')?.children.length, [id, n], { timeout: 10000 });
  for (let i = 0; i < 16 && !(await page.locator('.gm-win').count()); i++) {
    await page.evaluate(() => window.__gmPlay?.solve?.());
    await page.waitForTimeout(id === 'robot' ? 900 : id === 'lompat' ? 6000 : 500);
    await page.waitForFunction(() => document.querySelector('.gm-win') || !document.querySelector('.rb-board.running'), null, { timeout: 15000 });
    await page.waitForTimeout(id === 'wuduk' ? 400 : 1900);
  }
  await page.waitForSelector('.gm-win .bj-ribbon', { timeout: 8000 });
  return (await stars(id))[n];
}
try {
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.mode-card').count() === 15, '15 permainan asal kekal');
  ok(await page.locator('.bj-xtile', { hasText: 'Robot Kod Cilik' }).count() === 1 && await page.locator('.bj-xtile', { hasText: 'Jom Berwuduk' }).count() === 1, 'kad permainan baharu dalam rak kategori');
  await page.locator('.bj-xtile', { hasText: 'Kedai Runcit Cilik' }).click();
  await page.waitForSelector('.gm-map .gm-lv');
  ok(await page.locator('.gm-lv').count() === 30 && await page.locator('.gm-lv.locked').count() === 29, 'peta level: 30 level, hanya level 1 terbuka');
  for (const id of GAME_IDS) {
    const st = await playLevel(id, 1);
    ok(st >= 1, `${GAMES[id].n}: level 1 dimainkan hingga tamat & disimpan (${st} bintang)`);
  }
  // bab lain: buka semua level dan main satu level setiap bab
  await page.evaluate(() => { const id = window.__dc.getState().currentId; const d = JSON.parse(localStorage.getItem('dc-games-v1') || '{}'); for (const g of ['robot', 'kedai', 'makmal', 'wuduk', 'lompat', 'bina']) { d[id][g] ||= { stars: {} }; for (let i = 1; i <= 29; i++) d[id][g].stars[i] ||= 1; } localStorage.setItem('dc-games-v1', JSON.stringify(d)); });
  await page.goto(`http://localhost:${PORT}/index.html#/`);
  await page.reload();
  await page.waitForSelector('.mode-card');
  for (const [id, n] of [['lompat', 9], ['lompat', 14], ['lompat', 27], ['bina', 12], ['bina', 22], ['robot', 15], ['robot', 28], ['kedai', 14], ['kedai', 26], ['makmal', 4], ['makmal', 16], ['makmal', 27], ['wuduk', 7], ['wuduk', 13], ['wuduk', 22], ['wuduk', 30]]) {
    const st = await playLevel(id, n);
    ok(st >= 1, `${GAMES[id].n} L${n} (${GAMES[id].chapters[Math.min(2, Math.floor((n - 1) / 10))]}) dimainkan hingga tamat`);
  }
  // salah jawab: tiada hukuman, galakan sahaja
  await page.evaluate(() => window.__dc.go('/g/kedai/1'));
  await page.waitForSelector('.kd-pay');
  for (let i = 0; i < 10; i++) await page.click('.kd-notes .kd-note');
  await page.click('.kd-pay');
  await page.waitForFunction(() => /Terlebih/.test(document.querySelector('.gm-bubble')?.textContent || ''));
  ok(true, 'Kedai: bayaran terlebih diterangkan dengan lembut (boleh ambil balik)');
  // Dunia: pulau baharu
  await page.evaluate(() => window.__dc.go('/dunia'));
  await page.waitForSelector('.bj-isle');
  ok(await page.locator('.bj-isle').count() === 24, 'Dunia BIJAKU: 24 pulau');
  // kunci ibu bapa
  await page.evaluate(() => { window.__dc.getState().settings.disabledModes.push('robot'); window.__dc.go('/'); });
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.bj-xtile.locked', { hasText: 'Robot Kod Cilik' }).count() === 1, 'kad dikunci apabila ibu bapa mengunci');
  await page.evaluate(() => window.__dc.go('/g/robot'));
  await page.waitForSelector('text=sedang dikunci oleh ibu bapa');
  ok(true, 'laluan permainan disekat semasa dikunci');
  await page.evaluate(() => { const st = window.__dc.getState().settings; st.disabledModes = st.disabledModes.filter((x) => x !== 'robot'); });
  // luar talian
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
  await page.waitForTimeout(1500);
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('.mode-card', { timeout: 10000 });
  for (const id of GAME_IDS) {
    const st = await playLevel(id, 2);
    ok(st >= 1, `luar talian: ${GAMES[id].n} boleh dimainkan`);
  }
  await ctx.setOffline(false);
  await page.evaluate(() => window.__dc.go('/main/abc/1'));
  await page.waitForSelector('.stage, .play-head', { timeout: 8000 });
  ok(true, 'permainan asal masih dibuka seperti biasa');
} catch (e) { failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0] + ' @ ' + await page.evaluate(() => location.hash + ' ' + JSON.stringify(window.__gmPlay ? { id: window.__gmPlay.id, n: window.__gmPlay.n } : null) + ' ' + (document.querySelector('.gm-bubble')?.textContent || ''))); }
ok(errors.length === 0, `tiada ralat JavaScript / fail hilang${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian permainan baharu gagal` : '\n✓ Ujian permainan baharu lulus');
process.exit(failures ? 1 : 0);
