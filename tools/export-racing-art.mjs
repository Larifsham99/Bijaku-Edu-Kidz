// Jana gambar kad "Cilik Racing" untuk laman utama: node tools/export-racing-art.mjs
// (dilukis dengan pelukis kereta yang sama seperti dalam permainan)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const srv = spawn('python3', ['-m', 'http.server', '8841'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const b = await chromium.launch();
const pg = await b.newPage();
await pg.goto('http://localhost:8841/index.html#/x');
const data = await pg.evaluate(async () => {
  const { CARS } = await import('/js/racing/data.js');
  const { drawCarSide } = await import('/js/racing/cars.js');
  const img = new Image(); img.src = '/visual-assets/mascots/coco.svg'; await img.decode();
  const c = document.createElement('canvas'); c.width = 720; c.height = 360;
  const g = c.getContext('2d');
  // garis laju
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineCap = 'round';
  [[40, 150, 120], [20, 200, 170], [60, 250, 110]].forEach(([x, y, l]) => { g.lineWidth = 10; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke(); });
  g.save(); g.translate(330, 40); g.scale(1.05, 1.05); drawCarSide(g, CARS[2], { spin: 0.6 }); g.restore();
  g.save(); g.translate(150, 120); g.scale(1.65, 1.65); drawCarSide(g, CARS[0], { driver: img, spin: 0.2 }); g.restore();
  return c.toDataURL('image/png');
});
writeFileSync('visual-assets/racing/kereta.png', Buffer.from(data.split(',')[1], 'base64'));
console.log('visual-assets/racing/kereta.png');
await b.close(); srv.kill();
