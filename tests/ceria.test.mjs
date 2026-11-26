// Ujian pek bunyi ceria: butang tanpa bunyi mendapat "bloop", bunyi tidak berganda,
// maskot bersuara, ruang kosong berkilau, dan suis ibu bapa menyenyapkan semuanya.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');

const srv = spawn('python3', ['-m', 'http.server', '8813'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 412, height: 860 }, hasTouch: true })).newPage();
let fails = 0; const ok = (c, m) => { console.log(c ? '✓' : '✗', m); if (!c) fails++; };
const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
await pg.addInitScript(() => {
  window.__osc = 0;
  const s = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function (...a) { window.__osc++; return s.apply(this, a); };
});
const reset = () => pg.evaluate(() => { globalThis.__ceria = []; window.__osc = 0; });
const got = () => pg.evaluate(() => ({ names: globalThis.__ceria || [], osc: window.__osc }));
const settle = () => pg.waitForTimeout(250);

await pg.goto('http://localhost:8813/index.html');
// maskot di halaman pendaftaran
await reset();
await pg.locator('.emo.float[data-avatar="dino"]').click();
await settle();
let g = await got();
ok(g.names.includes('mascot:dino') && g.osc > 0, 'maskot Dino bersuara apabila disentuh');
ok(await pg.locator('.ceria-spark').count() > 0, 'kilauan muncul di tempat jari');

await pg.fill('input[aria-label="Nama pemain"]', 'Ali');
await pg.click('text=Seterusnya'); await pg.click('text=Seterusnya'); await pg.click('text=Jom Mula!');
await pg.waitForSelector('.mode-card');
await pg.waitForTimeout(1500);

// ruang kosong di menu
await reset();
const box = await pg.locator('body').boundingBox();
await pg.mouse.click(6, 400); // tepi skrin utama (bukan butang)
await settle();
g = await got();
ok(g.names.includes('bubble'), 'sentuh ruang kosong: gelembung');

// butang yang sudah ada bunyi sendiri tidak mendapat bloop tambahan
await reset();
await pg.evaluate(() => { const b = document.createElement('button'); b.id = 'ada'; b.textContent = 'ada'; b.style.cssText = 'position:fixed;top:4px;left:4px;z-index:9999'; b.onclick = () => window.__dc.go('/'); document.body.append(b); });
await pg.evaluate(async () => { const { sfx } = await import('/js/audio.js'); document.getElementById('ada').onclick = () => sfx.tap(); });
await pg.click('#ada'); await settle();
ok(!(await got()).names.includes('bloop'), 'butang berbunyi sendiri: tiada bloop berganda');

// butang senyap mendapat bloop, dan ketukan berturut-turut mendaki nada
await reset();
await pg.evaluate(() => { const b = document.createElement('button'); b.id = 'senyap'; b.textContent = 'senyap'; b.style.cssText = 'position:fixed;top:4px;left:80px;z-index:9999'; document.body.append(b); });
for (let i = 0; i < 3; i++) await pg.click('#senyap');
await settle();
ok((await got()).names.filter((n) => n === 'bloop').length === 3, 'butang tanpa bunyi: bloop setiap ketukan');

// konfeti & bintang
await reset();
await pg.evaluate(async () => { const { confetti } = await import('/js/ui.js'); confetti(20); dispatchEvent(new Event('bj-star')); });
await pg.waitForTimeout(500);
g = await got();
ok(g.names.includes('popcorn') && g.names.includes('star'), 'konfeti berderai & bintang berbunyi');

// semasa bermain: ruang kosong tidak berbunyi (tidak mengelirukan jawapan)
await pg.evaluate(() => { location.hash = '/main/abc/1'; });
await pg.waitForSelector('.stage');
await pg.waitForTimeout(800);
await reset();
await pg.mouse.click(4, 400);
await settle();
ok(!(await got()).names.includes('bubble'), 'semasa bermain: tiada gelembung latar');
await reset();
await pg.locator('.prompt-row > *').first().click();
await settle();
ok((await got()).names.includes('chime'), 'sentuh soalan: loceng kecil (ganti dengar semula)');

// suis "Sentuhan ceria" mati: latar senyap, butang masih berbunyi
await pg.evaluate(() => { window.__dc.getState().settings.cuteTaps = false; location.hash = '/'; });
await pg.waitForSelector('.mode-card'); await pg.waitForTimeout(800);
await reset();
await pg.mouse.click(6, 400); // tepi skrin utama (bukan butang)
await settle();
ok(!(await got()).names.includes('bubble'), 'Sentuhan ceria dimatikan: latar senyap');

// suis "Kesan bunyi" mati: tiada bunyi langsung
await pg.evaluate(() => { const s = window.__dc.getState().settings; s.sound = false; s.cuteTaps = true; });
await reset();
await pg.mouse.click(6, 400); // tepi skrin utama (bukan butang)
await pg.click('#senyap').catch(() => {});
await pg.evaluate(async () => { const { confetti } = await import('/js/ui.js'); confetti(20); });
await pg.waitForTimeout(600);
g = await got();
ok(g.osc === 0, `Kesan bunyi dimatikan: tiada bunyi langsung (${g.osc})`);

ok(errs.length === 0, 'tiada ralat JavaScript ' + errs.join(' | '));
await b.close(); srv.kill();
console.log(fails ? `\n✗ ${fails} kegagalan` : '\n✓ Ujian pek bunyi ceria lulus');
process.exit(fails ? 1 : 0);
