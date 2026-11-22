// Ujian CILIK RACING: 500 level (data + simulasi) dan permainan sebenar dalam pelayar
// node tests/racing.test.mjs          -> data + simulasi + pelayar
// node tests/racing.test.mjs --data   -> data + simulasi sahaja (tanpa pelayar)
import { RC_WORLDS, CARS } from '../js/racing/data.js';
import { buildLevel, TOTAL_LEVELS, LEVELS_PER_WORLD } from '../js/racing/levels.js';
import { createRace, randomDriver } from '../js/racing/engine.js';

let failures = 0;
const ok = (c, m) => { if (c) console.log('✓ ' + m); else { failures++; console.log('✗ ' + m); } };
const EMOJI = /\p{Extended_Pictographic}/u;
const key = (o) => JSON.stringify(o);

// ---------------- DATA ----------------
const ids = new Set(), sigs = new Map();
const problems = [];
let pits = 0, orders = 0, gates = 0, collects = 0, dodges = 0;
for (let wi = 0; wi < RC_WORLDS.length; wi++) for (let n = 1; n <= LEVELS_PER_WORLD; n++) {
  const L = buildLevel(wi, n);
  const bad = (m) => problems.push(`${L.id}: ${m}`);
  if (ids.has(L.id)) bad('id berulang'); ids.add(L.id);
  if (!L.tasks.length) bad('tiada cabaran');
  if (!L.objective) bad('tiada objektif');
  if (!L.complete) bad('tiada syarat tamat');
  if (!(L.lanes >= 2 && L.lanes <= 4)) bad('bilangan lorong');
  if (!L.track.pieces.length) bad('tiada trek');
  for (const t of L.tasks) {
    if (!t.say) bad('tiada arahan suara');
    if (EMOJI.test(t.say)) bad(`emoji dalam suara: ${t.say}`);
    if (/\b[A-Z]{2,}\b/.test(t.say)) bad(`HURUF BESAR dalam suara: ${t.say}`);
    if (t.kind === 'gate') {
      gates++;
      if (t.opts.length !== L.lanes) bad(`pintu ${t.topic}: ${t.opts.length} pilihan untuk ${L.lanes} lorong`);
      if (!(t.ans >= 0 && t.ans < t.opts.length)) bad(`pintu ${t.topic}: jawapan tiada`);
      const ks = t.opts.map((o) => key(o.t === 'shp' ? o.id : o.t === 'col' ? o.hex : o.v));
      if (new Set(ks).size !== ks.length) bad(`pintu ${t.topic}: pilihan berulang ${ks}`);
    }
    if (t.kind === 'collect') {
      collects++;
      const good = t.rows.flat().filter((x) => x.good).length;
      if (good < t.need) bad(`kutip ${t.topic}: hanya ${good}/${t.need}`);
      if (t.rows.some((r) => r.filter((x) => x.good).length !== 1)) bad('baris kutip tanpa item sasaran');
      if (t.rows.some((r) => new Set(r.map((x) => x.lane)).size !== r.length)) bad('item bertindih dalam lorong');
    }
    if (t.kind === 'order') {
      orders++;
      if (t.rows.length !== t.seq.length) bad('memori: baris tidak sepadan');
      if (t.rows.some((r) => r.filter((x) => x.good).length !== 1 || r.length !== L.lanes)) bad('memori: baris tidak sah');
    }
    if (t.kind === 'dodge') {
      dodges++;
      if (t.rows.some((r) => r.length >= L.lanes || r.length === 0)) bad('halangan menutup semua lorong');
    }
    if (t.kind === 'pit') { pits++; if (t.sub === 'eja' && !t.word) bad('pit eja tanpa perkataan'); if (t.sub === 'corak' && !(t.ans >= 0)) bad('pit corak tanpa jawapan'); }
  }
  if (n === 50) {
    if (!L.special || !L.reward.trophy) bad('level 50 bukan level juara');
    if (L.tasks.length < 5) bad(`level 50 hanya ${L.tasks.length} cabaran`);
  }
  const sig = key(L.tasks.map(({ id, gap, ...t }) => t));
  if (sigs.has(sig)) bad(`sama dengan ${sigs.get(sig)}`); sigs.set(sig, L.id);
}
ok(ids.size === TOTAL_LEVELS && TOTAL_LEVELS >= 500, `${ids.size} level tersedia (${RC_WORLDS.length} dunia × ${LEVELS_PER_WORLD})`);
ok(problems.length === 0, `semua level sah: objektif, jawapan betul wujud, lorong bebas, tiada pendua${problems.length ? '\n   ' + problems.slice(0, 12).join('\n   ') : ''}`);
ok(gates && collects && dodges && orders && pits, `mekanik pelbagai: pintu ${gates}, kutip ${collects}, elak ${dodges}, memori ${orders}, pit ${pits}`);
// level yang sama sentiasa sama (berbiji)
const again = await import('../js/racing/levels.js?ulang');
ok(key(again.buildLevel(3, 27)) === key(buildLevel(3, 27)) && key(again.buildLevel(9, 50)) === key(buildLevel(9, 50)), 'level dijana semula dengan susunan yang sama (replay stabil)');

// ---------------- SIMULASI ----------------
let stuck = [], notThree = [], maxT = 0;
for (let wi = 0; wi < RC_WORLDS.length; wi++) for (let n = 1; n <= LEVELS_PER_WORLD; n++) {
  const lv = buildLevel(wi, n);
  for (const mode of ['betul', 'rawak']) {
    const r = createRace(lv, mode === 'betul' ? { autopilot: true } : { driver: randomDriver(wi * 97 + n) });
    r.go();
    let steps = 0;
    while (r.state !== 'done' && steps < 60000) { if (r.state === 'pit' && mode === 'betul') r.pitDone(0); r.step(1 / 30); r.events.length = 0; steps++; }
    if (r.state !== 'done' || r.t >= 1200) stuck.push(`${lv.id}/${mode}`);
    if (mode === 'betul' && r.stars !== 3) notThree.push(lv.id);
    maxT = Math.max(maxT, r.t);
  }
}
ok(stuck.length === 0, `semua 500 level boleh ditamatkan — walaupun dipandu secara rawak (tiada softlock)${stuck.length ? ': ' + stuck.slice(0, 8) : ''}`);
ok(notThree.length === 0, 'pemandu sempurna mendapat 3 bintang di setiap level');
ok(maxT < 600, `perlumbaan paling lama ${maxT.toFixed(0)} saat (dengan banyak kesilapan)`);

// ---------------- STORAN & PROGRESI ----------------
globalThis.localStorage = { d: {}, getItem(k) { return this.d[k] ?? null; }, setItem(k, v) { this.d[k] = String(v); } };
const S = await import('../js/racing/store.js');
const rp = S.rprof('ujian');
ok(S.levelUnlocked(rp, 0, 1) && !S.levelUnlocked(rp, 0, 2) && !S.worldUnlocked(rp, 1), 'permulaan: hanya level 1 Litar Kampung dibuka');
let res;
for (let n = 1; n <= 10; n++) res = S.recordRace(rp, buildLevel(0, n), 3);
ok(S.worldUnlocked(rp, 1) && S.levelUnlocked(rp, 0, 11), 'selepas 10 level: dunia 2 dan level 11 dibuka');
ok(S.carUnlocked(rp, CARS[1]) && S.carUnlocked(rp, CARS[3]) && !S.carUnlocked(rp, CARS.at(-1)), 'kereta dibuka mengikut bintang; Juara Emas memerlukan trofi');
ok(res.newMedals.length === 1 && S.medalCount(rp) === 1, 'pingat gangsa diberi pada level 10');
S.recordRace(rp, buildLevel(0, 1), 1);
ok(S.levelStars(rp, 'kampung', 1) === 3, 'ulang main tidak mengurangkan bintang terbaik');
const saved = JSON.parse(localStorage.getItem('dc-racing-v1'));
ok(saved.ujian && saved.ujian.done.kampung[10] === 3, 'kemajuan disimpan dalam kunci storan sendiri (dc-racing-v1)');

if (process.argv.includes('--data')) { console.log(failures ? `\n✗ ${failures} ujian gagal` : '\n✓ Ujian data racing lulus'); process.exit(failures ? 1 : 0); }

// ---------------- PELAYAR ----------------
const { createRequire } = await import('node:module');
const { spawn } = await import('node:child_process');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 8772;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const BASE = `http://localhost:${PORT}/index.html`;
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true });
await ctx.addInitScript(() => { globalThis.__rcAutopilot = true; globalThis.__rcSpeed = 6; globalThis.__dcTimeScale = 0.05; });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /Cilik Racing/.test(m.text()))) errors.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400 && !/manifest\.json/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
try {
  await page.goto(BASE);
  await page.fill('input[aria-label="Nama pemain"]', 'Ujian');
  await page.click('text=Seterusnya'); await page.click('text=Seterusnya'); await page.click('text=Jom Mula!');
  await page.waitForSelector('.mode-card');
  ok(await page.locator('.mode-card').count() === 15, '15 permainan asal kekal di laman utama');
  await page.click('.rc-entry');
  await page.waitForSelector('.rc-home', { timeout: 8000 });
  ok(true, 'kad Cilik Racing membuka laman racing');
  const race = async (wi, n, label) => {
    await page.evaluate(([wi, n]) => { location.hash = `/lumba/main/${wi}/${n}`; }, [wi, n]);
    await page.waitForSelector('.rc-result', { timeout: 60000 });
    const st = await page.evaluate(([wi, n]) => { const d = JSON.parse(localStorage.getItem('dc-racing-v1') || '{}'); const pid = window.__dc.getState().currentId; return d[pid]?.done?.[['kampung', 'buah', 'hutan', 'bandar', 'dino', 'laut', 'angkasa', 'gula', 'bina', 'juara'][wi]]?.[n] || 0; }, [wi, n]);
    ok(st >= 1, `${label}: dimainkan hingga garisan penamat dan disimpan (${st} bintang)`);
  };
  await race(0, 1, 'Litar Kampung L1');
  await page.click('.rc-result button:has-text("Seterusnya")');
  await page.waitForSelector('.rc-result', { timeout: 60000 });
  ok(true, 'butang Seterusnya membuka level 2 dan boleh ditamatkan');
  await page.click('.rc-result button:has-text("Ulang")');
  await page.waitForSelector('.rc-result', { timeout: 60000 });
  ok(true, 'butang Ulang memainkan semula level yang sama');
  // buka beberapa level dengan pit, memori & level juara
  await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('dc-racing-v1') || '{}'); const pid = window.__dc.getState().currentId;
    const ws = ['kampung', 'buah', 'hutan', 'bandar', 'dino', 'laut', 'angkasa', 'gula', 'bina', 'juara'];
    for (const w of ws) { d[pid].done[w] ||= {}; for (let i = 1; i < 50; i++) d[pid].done[w][i] ||= 2; }
    localStorage.setItem('dc-racing-v1', JSON.stringify(d));
    location.hash = '/x'; location.reload();
  });
  await page.waitForSelector('.mode-card');
  const find = (kind) => { for (let wi = 0; wi < 10; wi++) for (let n = 2; n <= 49; n++) if (buildLevel(wi, n).tasks.some((t) => t.kind === kind || t.sub === kind)) return [wi, n]; return null; };
  for (const [kind, label] of [['eja', 'pit stop ejaan'], ['corak', 'puzzle corak'], ['order', 'isyarat memori']]) { const f = find(kind); if (f) await race(f[0], f[1], `${label} (${RC_WORLDS[f[0]].n} L${f[1]})`); }
  await race(9, 50, 'Level Juara Pulau Juara');
  ok(await page.locator('.rc-result.champion').count() === 1, 'level 50 memaparkan sambutan juara');
  for (const [hash, sel, label] of [['/lumba/peta', '.rc-wcard', 'peta 10 dunia'], ['/lumba/dunia/3', '.rc-node', 'laluan 50 level'], ['/lumba/garaj', '.rc-g-item', 'garaj kereta'], ['/lumba/koleksi', '.rc-mrow', 'koleksi pingat']]) {
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.waitForSelector(sel, { timeout: 8000 });
    const c = await page.locator(sel).count();
    ok(c >= (sel === '.rc-node' ? 50 : sel === '.rc-g-item' ? 15 : 10), `${label} dipaparkan (${c})`);
  }
  // pilih kereta yang telah dibuka
  await page.evaluate(() => { location.hash = '/lumba/garaj'; });
  await page.waitForSelector('.rc-g-item.car');
  await page.locator('.rc-unlock .rc-btn.ghost').click({ timeout: 2000 }).catch(() => {});
  await page.locator('.rc-g-item.car:not(.locked)').nth(2).click();
  const car = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('dc-racing-v1')); return d[window.__dc.getState().currentId].car; });
  ok(car && car !== 'tomato', `kereta baharu boleh dipilih di garaj (${car})`);
  // luar talian
  await page.goto(BASE);
  await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
  await page.waitForTimeout(1500);
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('.mode-card', { timeout: 10000 });
  await race(0, 3, 'Luar talian: perlumbaan');
  await ctx.setOffline(false);
  // kembali ke permainan asal
  await page.evaluate(() => { location.hash = '/main/abc/1'; });
  await page.waitForSelector('.stage, .play-head', { timeout: 8000 });
  ok(true, 'permainan asal (ABC Ceria) masih dibuka seperti biasa selepas racing');
} catch (e) {
  failures++; console.log('✗ ralat ujian pelayar: ' + e.message.split('\n')[0]);
}
ok(errors.length === 0, `tiada ralat JavaScript / fail hilang${errors.length ? ':\n   ' + errors.slice(0, 8).join('\n   ') : ''}`);
await browser.close(); server.kill();
console.log(failures ? `\n✗ ${failures} ujian racing gagal` : '\n✓ Ujian Cilik Racing lulus');
process.exit(failures ? 1 : 0);
