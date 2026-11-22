// =====================================================================
//  CILIK RACING — sprite dunia dilukis secara prosedur (Canvas 2D)
//  Setiap sprite dilukis SEKALI ke kanvas luar skrin, kemudian diskala.
//  { w, h: saiz kanvas, wh: tinggi dunia (unit), draw(g, w, h, v) }
// =====================================================================
import { shade, rr } from './cars.js';
import { SHAPES } from '../data/content.js';

const TAU = Math.PI * 2;
export function ball(g, x, y, r, c, hi = 0.45) {
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  gr.addColorStop(0, shade(c, hi)); gr.addColorStop(0.6, c); gr.addColorStop(1, shade(c, -0.3));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
}
function shadowE(g, cx, cy, rx, ry, a = 0.32) {
  const gr = g.createRadialGradient(cx, cy, 1, cx, cy, rx);
  gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy);
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rx, 0, TAU); g.fill(); g.restore();
}
function vgrad(g, y0, y1, a, b) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; }
function hgrad(g, x0, x1, a, b) { const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; }
function trunk(g, x0, y0, x1, y1, w, c) {
  g.strokeStyle = c; g.lineCap = 'round'; g.lineWidth = w;
  g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + 12, (y0 + y1) / 2, x1, y1); g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2;
  for (let t = 0.1; t < 0.95; t += 0.12) { const x = x0 + (x1 - x0) * t + Math.sin(t * 3) * 6, y = y0 + (y1 - y0) * t; g.beginPath(); g.moveTo(x - w * 0.4, y); g.lineTo(x + w * 0.4, y + 2); g.stroke(); }
}
function frond(g, x, y, ang, len, c) {
  g.save(); g.translate(x, y); g.rotate(ang);
  g.fillStyle = c; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -len * 0.28, len, len * 0.1); g.quadraticCurveTo(len * 0.5, -len * 0.02, 0, 0); g.fill();
  g.strokeStyle = shade(c, -0.25); g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -len * 0.16, len, len * 0.1); g.stroke();
  g.restore();
}
function starPath(g, cx, cy, r1, r2, n = 5) { g.beginPath(); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); }
function blobTree(g, cx, cy, r, c) { [[-0.55, 0.15, 0.62], [0.55, 0.15, 0.62], [0, -0.35, 0.72], [0, 0.2, 0.8]].forEach(([dx, dy, s]) => ball(g, cx + dx * r, cy + dy * r, r * s, c, 0.3)); }

// ---------------- SPRITE ----------------
export const SPR = {
  kelapa: { w: 170, h: 280, wh: 3600, draw(g, w, h) {
    shadowE(g, 85, 272, 50, 8);
    trunk(g, 80, 272, 104, 62, 16, '#9a6b3f');
    ['#2f9e6a', '#3cb878', '#269058', '#3cb878', '#2f9e6a', '#45c47f'].forEach((c, i) => frond(g, 104, 62, -2.9 + i * 0.95 + (i > 2 ? 0.4 : 0), 78, c));
    ball(g, 98, 70, 9, '#7a5230'); ball(g, 112, 72, 9, '#8a5d36'); ball(g, 105, 80, 8, '#6f4a2a');
  } },
  rumah: { w: 280, h: 240, wh: 2900, draw(g, w, h, v) {
    shadowE(g, 140, 232, 120, 10);
    g.fillStyle = '#6b4a2b'; for (const x of [50, 100, 180, 230]) g.fillRect(x, 160, 10, 72);
    g.strokeStyle = '#8a5d36'; g.lineWidth = 5; g.beginPath(); for (let i = 0; i < 5; i++) { g.moveTo(208 + i * 6, 232 - i * 15); g.lineTo(238 + i * 6, 232 - i * 15); } g.stroke();
    g.fillStyle = vgrad(g, 96, 168, '#c98a4b', '#a86a33'); g.fillRect(36, 96, 208, 70);
    g.strokeStyle = 'rgba(0,0,0,.15)'; g.lineWidth = 2; for (let x = 44; x < 244; x += 12) { g.beginPath(); g.moveTo(x, 96); g.lineTo(x, 166); g.stroke(); }
    g.fillStyle = '#7a4a24'; g.fillRect(30, 160, 220, 10);
    g.fillStyle = '#4a2e18'; rr(g, 70, 112, 34, 40, 4); g.fill(); rr(g, 176, 112, 34, 40, 4); g.fill();
    g.fillStyle = '#ffe9b0'; rr(g, 74, 116, 26, 32, 3); g.fill(); rr(g, 180, 116, 26, 32, 3); g.fill();
    g.fillStyle = '#8c3b26'; rr(g, 126, 110, 30, 50, 4); g.fill();
    const roof = v % 2 ? ['#c84b2f', '#9e3520'] : ['#8a5d36', '#6b4a2b'];
    g.fillStyle = vgrad(g, 20, 100, roof[0], roof[1]); g.beginPath(); g.moveTo(14, 104); g.lineTo(140, 18); g.lineTo(266, 104); g.closePath(); g.fill();
    g.fillStyle = '#fff1d0'; g.beginPath(); g.moveTo(104, 100); g.lineTo(140, 52); g.lineTo(176, 100); g.closePath(); g.fill();
    g.strokeStyle = '#c99512'; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(116 + i * 8, 96); g.lineTo(140, 62 + i * 4); g.lineTo(164 - i * 8, 96); g.stroke(); }
    g.fillStyle = '#5a3a20'; g.beginPath(); g.moveTo(134, 22); g.lineTo(126, 6); g.lineTo(140, 16); g.lineTo(154, 6); g.lineTo(146, 22); g.fill();
  } },
  padi: { w: 140, h: 90, wh: 700, draw(g) {
    shadowE(g, 70, 84, 60, 6, 0.2);
    for (let i = 0; i < 22; i++) { const x = 12 + i * 5.4, hh = 50 + (i * 37 % 26); g.strokeStyle = i % 3 ? '#9ccf4e' : '#c9d94a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 86); g.quadraticCurveTo(x + 6, 86 - hh * 0.6, x + (i % 2 ? 10 : -6), 86 - hh); g.stroke(); }
    g.fillStyle = '#e8c54a'; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(20 + i * 14, 34 + (i % 3) * 6, 3, 7, 0.4, 0, TAU); g.fill(); }
  } },
  ayam: { w: 100, h: 100, wh: 700, draw(g) {
    shadowE(g, 50, 94, 34, 5);
    g.strokeStyle = '#f2a922'; g.lineWidth = 3; g.beginPath(); g.moveTo(44, 78); g.lineTo(42, 94); g.moveTo(56, 78); g.lineTo(58, 94); g.stroke();
    g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(14, 46); g.quadraticCurveTo(4, 24, 22, 28); g.quadraticCurveTo(14, 40, 26, 50); g.fill();
    ball(g, 46, 60, 26, '#fff7ea', 0.2);
    ball(g, 66, 36, 15, '#fff7ea', 0.2);
    g.fillStyle = '#e2553f'; g.beginPath(); g.arc(62, 22, 5, 0, TAU); g.arc(69, 20, 5, 0, TAU); g.arc(75, 24, 4, 0, TAU); g.fill();
    g.fillStyle = '#f2a922'; g.beginPath(); g.moveTo(79, 36); g.lineTo(90, 39); g.lineTo(79, 42); g.fill();
    g.fillStyle = '#e2553f'; g.beginPath(); g.ellipse(78, 47, 3, 5, 0, 0, TAU); g.fill();
    g.fillStyle = '#26262b'; g.beginPath(); g.arc(70, 33, 2.6, 0, TAU); g.fill();
    g.fillStyle = '#efe0c8'; g.beginPath(); g.ellipse(40, 58, 14, 9, -0.3, 0, TAU); g.fill();
  } },
  gerai: { w: 220, h: 190, wh: 1900, draw(g) {
    shadowE(g, 110, 182, 100, 9);
    g.fillStyle = '#7a4a24'; g.fillRect(30, 60, 8, 120); g.fillRect(182, 60, 8, 120);
    g.fillStyle = vgrad(g, 110, 180, '#c98a4b', '#9b6534'); rr(g, 20, 112, 180, 64, 8); g.fill();
    const fr = ['#e8412c', '#ffd23a', '#3bb36b', '#ff8c1a', '#9d4edd'];
    for (let i = 0; i < 10; i++) ball(g, 36 + i * 16, 108 - (i % 2) * 6, 10, fr[i % 5]);
    for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? '#fff' : '#e2553f'; g.beginPath(); g.moveTo(14 + i * 28, 66); g.lineTo(42 + i * 28, 66); g.lineTo(42 + i * 28, 40); g.lineTo(14 + i * 28, 40); g.fill(); g.beginPath(); g.arc(28 + i * 28, 66, 14, 0, Math.PI); g.fill(); }
    g.fillStyle = '#fff6e6'; rr(g, 70, 132, 80, 26, 6); g.fill(); g.fillStyle = '#2f9e6a'; g.font = 'bold 18px sans-serif'; g.textAlign = 'center'; g.fillText('BUAH', 110, 152);
  } },
  masjid: { w: 250, h: 260, wh: 3300, draw(g) {
    shadowE(g, 125, 252, 112, 9);
    g.fillStyle = vgrad(g, 120, 250, '#fffaf0', '#e6dccb'); rr(g, 40, 130, 170, 120, 6); g.fill();
    g.fillStyle = '#2f9e6a'; for (let i = 0; i < 4; i++) { rr(g, 58 + i * 38, 162, 22, 50, 11); g.fill(); }
    g.fillStyle = vgrad(g, 60, 140, '#45c47f', '#24875a'); g.beginPath(); g.arc(125, 134, 56, Math.PI, 0); g.fill();
    g.fillStyle = '#f2a922'; g.fillRect(122, 62, 6, 18); g.beginPath(); g.arc(125, 58, 7, 0, TAU); g.fill();
    for (const x of [24, 210]) { g.fillStyle = vgrad(g, 40, 250, '#fffaf0', '#e1d6c2'); g.fillRect(x - 9, 60, 18, 190); g.fillStyle = '#2f9e6a'; g.beginPath(); g.moveTo(x - 12, 62); g.lineTo(x, 26); g.lineTo(x + 12, 62); g.fill(); }
  } },
  bungaraya: { w: 130, h: 110, wh: 950, draw(g) {
    shadowE(g, 65, 104, 55, 6, 0.22);
    blobTree(g, 65, 66, 40, '#3cb878');
    for (const [x, y] of [[40, 50], [82, 44], [64, 74], [96, 72], [30, 80]]) {
      for (let i = 0; i < 5; i++) { g.save(); g.translate(x, y); g.rotate(i * TAU / 5); g.fillStyle = '#e8412c'; g.beginPath(); g.ellipse(0, -7, 5, 8, 0, 0, TAU); g.fill(); g.restore(); }
      g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(x, y, 2.5, 0, TAU); g.fill();
    }
  } },
  tembikai: { w: 190, h: 150, wh: 1700, draw(g) {
    shadowE(g, 95, 144, 86, 8);
    g.save(); g.translate(95, 140);
    g.fillStyle = '#2f9e6a'; g.beginPath(); g.arc(0, 0, 88, Math.PI, 0); g.fill();
    g.fillStyle = '#c9f29b'; g.beginPath(); g.arc(0, 0, 78, Math.PI, 0); g.fill();
    g.fillStyle = vgrad(g, -70, 0, '#ff6b6b', '#e8412c'); g.beginPath(); g.arc(0, 0, 70, Math.PI, 0); g.fill();
    g.fillStyle = '#2b1a10'; for (let i = 0; i < 9; i++) { const a = Math.PI + 0.35 + i * 0.3, r = 34 + (i % 3) * 10; g.beginPath(); g.ellipse(Math.cos(a) * r, Math.sin(a) * r, 3, 6, a, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-30, -46, 18, 6, -0.6, 0, TAU); g.fill();
    g.restore();
  } },
  pokokpisang: { w: 170, h: 250, wh: 3000, draw(g) {
    shadowE(g, 85, 244, 50, 7);
    g.fillStyle = hgrad(g, 74, 98, '#8fbf4a', '#5f8f2a'); rr(g, 74, 110, 22, 134, 10); g.fill();
    ['#45c47f', '#3cb878', '#2f9e6a', '#4fd08a', '#38ad6c'].forEach((c, i) => { g.save(); g.translate(86, 112); g.rotate(-2.6 + i * 0.75); g.fillStyle = c; g.beginPath(); g.ellipse(46, 0, 50, 18, 0, 0, TAU); g.fill(); g.strokeStyle = shade(c, -0.25); g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(94, 0); g.stroke(); g.restore(); });
    for (let i = 0; i < 6; i++) { g.save(); g.translate(98 + (i % 3) * 7, 126 + Math.floor(i / 3) * 12); g.rotate(0.5); g.fillStyle = '#ffd23a'; g.beginPath(); g.ellipse(0, 0, 4, 11, 0, 0, TAU); g.fill(); g.restore(); }
  } },
  strawberi: { w: 130, h: 150, wh: 1400, draw(g) {
    shadowE(g, 65, 144, 48, 7);
    g.fillStyle = vgrad(g, 40, 140, '#ff6b6b', '#d62f2f'); g.beginPath(); g.moveTo(65, 140); g.bezierCurveTo(10, 100, 10, 44, 65, 44); g.bezierCurveTo(120, 44, 120, 100, 65, 140); g.fill();
    g.fillStyle = '#ffe9a8'; for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(32 + (i * 23) % 66, 62 + Math.floor(i / 4) * 18 + (i % 2) * 6, 2, 3.5, 0, 0, TAU); g.fill(); }
    ['#2f9e6a', '#3cb878'].forEach((c, k) => { for (let i = 0; i < 5; i++) { g.save(); g.translate(65, 46); g.rotate(-1.4 + i * 0.7); g.fillStyle = c; g.beginPath(); g.ellipse(0, -14 + k * 4, 6, 16, 0, 0, TAU); g.fill(); g.restore(); } });
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(46, 70, 7, 14, 0.4, 0, TAU); g.fill();
  } },
  pokokepal: { w: 190, h: 230, wh: 2800, draw(g) {
    shadowE(g, 95, 224, 70, 8);
    trunk(g, 95, 224, 92, 120, 20, '#8a5d36');
    blobTree(g, 95, 94, 74, '#3cb878');
    for (const [x, y] of [[60, 80], [120, 70], [96, 120], [140, 112], [52, 120], [88, 52]]) ball(g, x, y, 10, '#e8412c');
  } },
  anggur: { w: 120, h: 160, wh: 1400, draw(g) {
    shadowE(g, 60, 154, 40, 6);
    g.strokeStyle = '#7a4a24'; g.lineWidth = 6; g.beginPath(); g.moveTo(60, 154); g.lineTo(60, 120); g.stroke();
    for (let r = 0; r < 5; r++) for (let i = 0; i <= 4 - r; i++) ball(g, 60 - (4 - r) * 9 + i * 18, 34 + r * 18, 11, '#8e44ad');
    g.fillStyle = '#3cb878'; g.beginPath(); g.ellipse(46, 20, 20, 10, -0.4, 0, TAU); g.fill();
  } },
  pokokhutan: { w: 230, h: 320, wh: 4600, draw(g) {
    shadowE(g, 115, 312, 80, 9);
    g.fillStyle = hgrad(g, 98, 132, '#8a5d36', '#5b3d22'); g.beginPath(); g.moveTo(96, 312); g.quadraticCurveTo(108, 200, 104, 120); g.lineTo(128, 120); g.quadraticCurveTo(124, 200, 136, 312); g.fill();
    g.strokeStyle = '#3e8e41'; g.lineWidth = 4; g.beginPath(); g.moveTo(108, 160); g.bezierCurveTo(80, 200, 140, 240, 110, 300); g.stroke();
    blobTree(g, 115, 104, 96, '#2f8f55'); blobTree(g, 115, 92, 70, '#3cad66');
    g.fillStyle = '#e8412c'; for (const [x, y] of [[70, 90], [160, 110], [120, 60]]) { g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill(); }
  } },
  paku: { w: 150, h: 120, wh: 1150, draw(g, w, h, v) {
    shadowE(g, 75, 114, 60, 6, 0.2);
    const c = v === 1 ? ['#6aa84f', '#557f3a'] : ['#3cb878', '#2f9e6a'];
    for (let i = 0; i < 9; i++) { g.save(); g.translate(75, 114); g.rotate(-1.35 + i * 0.34); g.fillStyle = c[i % 2]; g.beginPath(); g.ellipse(0, -48, 9, 50, 0, 0, TAU); g.fill(); g.strokeStyle = shade(c[0], -0.3); g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -96); g.stroke(); g.restore(); }
  } },
  gajah: { w: 220, h: 180, wh: 2300, draw(g) {
    shadowE(g, 110, 172, 90, 9);
    g.fillStyle = '#8f9bb3'; for (const x of [62, 92, 136, 162]) { rr(g, x, 120, 24, 52, 10); g.fill(); }
    ball(g, 110, 100, 64, '#a5b1c8', 0.25);
    ball(g, 176, 78, 38, '#a5b1c8', 0.25);
    g.fillStyle = '#93a0b8'; g.beginPath(); g.ellipse(150, 78, 24, 34, -0.2, 0, TAU); g.fill();
    g.strokeStyle = '#a5b1c8'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(204, 92); g.quadraticCurveTo(214, 130, 196, 150); g.stroke();
    g.fillStyle = '#26262b'; g.beginPath(); g.arc(186, 68, 4, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(187.5, 66.5, 1.5, 0, TAU); g.fill();
    g.fillStyle = '#ffb3c6'; g.beginPath(); g.arc(194, 82, 5, 0, TAU); g.fill();
  } },
  monyet: { w: 120, h: 140, wh: 1100, draw(g) {
    shadowE(g, 60, 134, 40, 6);
    g.strokeStyle = '#8a5d36'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(84, 120); g.bezierCurveTo(116, 116, 112, 70, 98, 76); g.stroke();
    ball(g, 60, 100, 32, '#a66b3e', 0.25);
    ball(g, 60, 52, 28, '#a66b3e', 0.25);
    for (const x of [30, 90]) { ball(g, x, 50, 11, '#a66b3e'); g.fillStyle = '#f2c79b'; g.beginPath(); g.arc(x, 50, 6, 0, TAU); g.fill(); }
    g.fillStyle = '#f2c79b'; g.beginPath(); g.ellipse(60, 60, 18, 15, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(60, 104, 18, 20, 0, 0, TAU); g.fill();
    g.fillStyle = '#26262b'; g.beginPath(); g.arc(52, 48, 3.4, 0, TAU); g.arc(68, 48, 3.4, 0, TAU); g.fill();
    g.strokeStyle = '#26262b'; g.lineWidth = 2; g.beginPath(); g.arc(60, 62, 7, 0.3, 2.8); g.stroke();
    ball(g, 92, 92, 9, '#ffd23a');
  } },
  bangunan: { w: 170, h: 280, wh: 4400, draw(g, w, h, v) {
    const cols = [['#ff6f91', '#d94a6e'], ['#4dabf7', '#2e7fd1'], ['#ffd23a', '#e0a800'], ['#69db7c', '#37b24d'], ['#b197fc', '#845ef7']][v % 5];
    const ht = 180 + (v * 37) % 90;
    shadowE(g, 85, 274, 80, 8);
    g.fillStyle = hgrad(g, 20, 150, cols[0], cols[1]); rr(g, 20, 276 - ht, 130, ht, 12); g.fill();
    g.fillStyle = shade(cols[0], 0.3); rr(g, 20, 276 - ht, 130, 14, 7); g.fill();
    for (let y = 276 - ht + 26; y < 240; y += 32) for (let x = 34; x < 140; x += 36) { g.fillStyle = '#e6f6ff'; rr(g, x, y, 22, 20, 5); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x + 3, y + 3, 7, 5); }
    g.fillStyle = shade(cols[1], -0.2); rr(g, 66, 238, 38, 38, 8); g.fill();
    if (v % 2) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(85, 276 - ht - 40); g.lineTo(130, 276 - ht + 2); g.lineTo(40, 276 - ht + 2); g.fill(); g.fillStyle = cols[1]; g.beginPath(); g.moveTo(85, 276 - ht - 36); g.lineTo(124, 276 - ht); g.lineTo(46, 276 - ht); g.fill(); }
  } },
  lampuisyarat: { w: 80, h: 240, wh: 2600, draw(g) {
    shadowE(g, 40, 234, 20, 4);
    g.fillStyle = hgrad(g, 34, 46, '#7d8597', '#4a5160'); g.fillRect(35, 90, 10, 146);
    g.fillStyle = '#2b2f3a'; rr(g, 16, 8, 48, 104, 14); g.fill();
    [['#ff4d4d', 30], ['#ffd23a', 60], ['#3bd16f', 90]].forEach(([c, y]) => { ball(g, 40, y, 12, c, 0.5); });
  } },
  pokokbulat: { w: 150, h: 210, wh: 2400, draw(g, w, h, v) {
    shadowE(g, 75, 204, 50, 6);
    g.fillStyle = '#8a5d36'; rr(g, 68, 120, 14, 86, 6); g.fill();
    ball(g, 75, 86, 62, ['#45c47f', '#69db7c', '#ffa94d', '#ff8fab'][v % 4], 0.35);
  } },
  belon: { w: 130, h: 240, wh: 2700, draw(g) {
    g.strokeStyle = 'rgba(80,80,80,.6)'; g.lineWidth = 1.5;
    const bs = [[40, 60, '#ff5f7a'], [86, 50, '#ffd23a'], [62, 90, '#4dabf7'], [30, 104, '#69db7c'], [96, 98, '#b197fc']];
    bs.forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y + 26); g.quadraticCurveTo(x + 6, 170, 65, 236); g.stroke(); });
    bs.forEach(([x, y, c]) => { g.save(); g.translate(x, y); g.scale(1, 1.18); ball(g, 0, 0, 24, c, 0.55); g.restore(); g.fillStyle = shade(c, -0.2); g.beginPath(); g.moveTo(x - 4, y + 30); g.lineTo(x + 4, y + 30); g.lineTo(x, y + 25); g.fill(); });
  } },
  dino: { w: 220, h: 200, wh: 2400, draw(g, w, h, v) {
    const c = ['#69db7c', '#ffa94d', '#b197fc'][v % 3];
    shadowE(g, 110, 192, 90, 8);
    g.fillStyle = shade(c, -0.15); for (const x of [70, 96, 130, 152]) { rr(g, x, 140, 20, 52, 8); g.fill(); }
    g.fillStyle = c; g.beginPath(); g.moveTo(40, 130); g.quadraticCurveTo(0, 150, 12, 168); g.quadraticCurveTo(40, 150, 70, 150); g.fill();
    ball(g, 110, 128, 54, c, 0.3);
    g.strokeStyle = c; g.lineWidth = 30; g.lineCap = 'round'; g.beginPath(); g.moveTo(140, 100); g.quadraticCurveTo(170, 60, 170, 40); g.stroke();
    ball(g, 178, 36, 26, c, 0.3);
    g.fillStyle = '#fff1d0'; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(68 + i * 18, 82 - (i === 2 ? 6 : 0)); g.lineTo(76 + i * 18, 64 - (i === 2 ? 8 : 0)); g.lineTo(84 + i * 18, 82 - (i === 2 ? 6 : 0)); g.fill(); }
    g.fillStyle = '#26262b'; g.beginPath(); g.arc(186, 30, 4.5, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(188, 28, 1.8, 0, TAU); g.fill();
    g.strokeStyle = '#26262b'; g.lineWidth = 2.5; g.beginPath(); g.arc(190, 40, 8, 0.2, 1.6); g.stroke();
    g.fillStyle = 'rgba(255,120,150,.5)'; g.beginPath(); g.arc(196, 42, 5, 0, TAU); g.fill();
  } },
  pakis: { w: 150, h: 130, wh: 1500, draw(g, w, h) { SPR.paku.draw(g, w, h, 1); } },
  telur: { w: 100, h: 120, wh: 900, draw(g) {
    shadowE(g, 50, 114, 34, 5);
    g.save(); g.translate(50, 66); g.scale(1, 1.28); ball(g, 0, 0, 38, '#fff1d0', 0.4); g.restore();
    g.fillStyle = '#7dd3a8'; for (const [x, y, r] of [[36, 50, 7], [62, 70, 9], [44, 88, 6], [64, 42, 5]]) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
    g.strokeStyle = '#c9a76b'; g.lineWidth = 2; g.beginPath(); g.moveTo(22, 68); g.lineTo(34, 60); g.lineTo(42, 70); g.lineTo(52, 60); g.stroke();
  } },
  batu: { w: 150, h: 110, wh: 1000, draw(g, w, h, v) {
    shadowE(g, 75, 104, 68, 8);
    const c = v === 2 ? '#7d6b9e' : '#9a8f86';
    g.fillStyle = vgrad(g, 20, 104, shade(c, 0.3), shade(c, -0.25)); g.beginPath(); g.moveTo(10, 102); g.quadraticCurveTo(14, 40, 60, 26); g.quadraticCurveTo(110, 14, 138, 70); g.quadraticCurveTo(146, 96, 140, 102); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(58, 42, 22, 9, -0.3, 0, TAU); g.fill();
    g.fillStyle = '#6aa84f'; g.beginPath(); g.ellipse(100, 30, 18, 8, 0.2, 0, TAU); g.fill();
  } },
  payung: { w: 170, h: 190, wh: 2200, draw(g) {
    shadowE(g, 85, 182, 66, 8);
    g.fillStyle = '#fff6e6'; g.fillRect(82, 50, 6, 134);
    const cs = ['#ff5f7a', '#fff', '#00a7c7', '#fff', '#ffd23a', '#fff'];
    for (let i = 0; i < 6; i++) { g.fillStyle = cs[i]; g.beginPath(); g.moveTo(85, 30); g.arc(85, 74, 78, Math.PI + i * Math.PI / 6, Math.PI + (i + 1) * Math.PI / 6); g.closePath(); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, 70, 170, 6);
    g.fillStyle = '#ffd9a0'; rr(g, 36, 160, 98, 20, 8); g.fill();
  } },
  rumahapi: { w: 130, h: 320, wh: 4800, draw(g) {
    shadowE(g, 65, 314, 50, 6);
    g.fillStyle = '#c9a76b'; g.beginPath(); g.ellipse(65, 304, 52, 14, 0, 0, TAU); g.fill();
    for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#fff' : '#e8412c'; const y0 = 300 - i * 36, y1 = y0 - 36, w0 = 36 - i * 2.6, w1 = 36 - (i + 1) * 2.6; g.beginPath(); g.moveTo(65 - w0, y0); g.lineTo(65 - w1, y1); g.lineTo(65 + w1, y1); g.lineTo(65 + w0, y0); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.moveTo(80, 300); g.lineTo(76, 84); g.lineTo(84, 84); g.lineTo(101, 300); g.fill();
    g.fillStyle = '#3d3256'; g.fillRect(40, 70, 50, 14);
    g.fillStyle = '#fff3a0'; rr(g, 46, 36, 38, 34, 6); g.fill();
    g.fillStyle = 'rgba(255,240,150,.5)'; g.beginPath(); g.moveTo(84, 52); g.lineTo(130, 30); g.lineTo(130, 76); g.fill();
    g.fillStyle = '#e8412c'; g.beginPath(); g.moveTo(38, 38); g.lineTo(65, 10); g.lineTo(92, 38); g.fill();
  } },
  penyu: { w: 150, h: 100, wh: 750, draw(g) {
    shadowE(g, 75, 94, 60, 6);
    g.fillStyle = '#7dd3a8'; for (const [x, y] of [[36, 80], [114, 80], [40, 52], [110, 52]]) { g.beginPath(); g.ellipse(x, y, 16, 9, x < 75 ? -0.5 : 0.5, 0, TAU); g.fill(); }
    ball(g, 132, 62, 16, '#7dd3a8');
    g.fillStyle = '#26262b'; g.beginPath(); g.arc(138, 58, 3, 0, TAU); g.fill();
    g.fillStyle = vgrad(g, 30, 92, '#3cb878', '#24875a'); g.beginPath(); g.ellipse(75, 66, 50, 34, 0, Math.PI, 0); g.lineTo(125, 70); g.lineTo(25, 70); g.fill();
    g.strokeStyle = '#9be3b8'; g.lineWidth = 3; g.beginPath(); g.moveTo(75, 34); g.lineTo(75, 68); g.moveTo(45, 44); g.lineTo(60, 66); g.moveTo(105, 44); g.lineTo(90, 66); g.stroke();
  } },
  karang: { w: 150, h: 130, wh: 1200, draw(g, w, h, v) {
    shadowE(g, 75, 124, 60, 6, 0.2);
    const c = ['#ff7aa8', '#ffa94d', '#b197fc'][v % 3];
    g.strokeStyle = c; g.lineCap = 'round';
    const br = (x, y, a, len, wd) => { if (len < 10) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; g.lineWidth = wd; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); br(x2, y2, a - 0.45, len * 0.7, wd * 0.75); br(x2, y2, a + 0.45, len * 0.7, wd * 0.75); };
    br(75, 124, -Math.PI / 2, 40, 14);
    g.fillStyle = '#fff'; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(40 + i * 12, 30 + (i % 3) * 14, 3, 0, TAU); g.fill(); }
  } },
  planet: { w: 180, h: 180, wh: 2400, draw(g, w, h, v) {
    const c = ['#ff9f43', '#4dabf7', '#f783ac'][v % 3];
    ball(g, 90, 92, 54, c, 0.4);
    g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(36, 80, 108, 8); g.fillRect(40, 104, 100, 6);
    g.strokeStyle = '#ffe066'; g.lineWidth = 7; g.beginPath(); g.ellipse(90, 92, 86, 20, -0.35, 0.15 * Math.PI, 0.95 * Math.PI, true); g.stroke();
  } },
  roket: { w: 110, h: 240, wh: 2900, draw(g) {
    shadowE(g, 55, 234, 40, 5);
    g.fillStyle = '#e8412c'; g.beginPath(); g.moveTo(20, 220); g.lineTo(36, 160); g.lineTo(36, 220); g.fill(); g.beginPath(); g.moveTo(90, 220); g.lineTo(74, 160); g.lineTo(74, 220); g.fill();
    g.fillStyle = hgrad(g, 30, 80, '#ffffff', '#c9d3e0'); g.beginPath(); g.moveTo(30, 224); g.lineTo(30, 80); g.quadraticCurveTo(55, 0, 80, 80); g.lineTo(80, 224); g.fill();
    g.fillStyle = '#e8412c'; g.beginPath(); g.moveTo(34, 66); g.quadraticCurveTo(55, 4, 76, 66); g.fill();
    ball(g, 55, 120, 14, '#4dabf7', 0.6); g.strokeStyle = '#9aa7b8'; g.lineWidth = 4; g.beginPath(); g.arc(55, 120, 15, 0, TAU); g.stroke();
    g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(40, 226); g.quadraticCurveTo(55, 250, 70, 226); g.fill();
  } },
  ufo: { w: 180, h: 130, wh: 1700, draw(g) {
    g.fillStyle = 'rgba(160,255,200,.28)'; g.beginPath(); g.moveTo(70, 70); g.lineTo(110, 70); g.lineTo(150, 128); g.lineTo(30, 128); g.fill();
    g.save(); g.translate(90, 46); g.scale(1, 0.8); ball(g, 0, 0, 30, '#a5f3fc', 0.6); g.restore();
    g.fillStyle = '#69db7c'; g.beginPath(); g.arc(90, 46, 13, 0, TAU); g.fill(); g.fillStyle = '#26262b'; g.beginPath(); g.arc(85, 44, 3, 0, TAU); g.arc(95, 44, 3, 0, TAU); g.fill();
    g.save(); g.translate(90, 62); g.scale(1, 0.3); ball(g, 0, 0, 80, '#b0b8c8', 0.5); g.restore();
    ['#ffd23a', '#ff5f7a', '#3bd16f', '#4dabf7', '#ffd23a'].forEach((c, i) => ball(g, 34 + i * 28, 66, 6, c, 0.7));
  } },
  kristal: { w: 130, h: 160, wh: 1500, draw(g) {
    shadowE(g, 65, 154, 50, 6, 0.3);
    [[40, 150, 26, 90, '#b197fc'], [88, 150, 22, 70, '#7ff3ff'], [64, 152, 30, 128, '#f783ac']].forEach(([x, y, wd, ht, c]) => {
      g.fillStyle = hgrad(g, x - wd / 2, x + wd / 2, shade(c, 0.4), shade(c, -0.2)); g.beginPath(); g.moveTo(x - wd / 2, y); g.lineTo(x - wd / 2, y - ht * 0.75); g.lineTo(x, y - ht); g.lineTo(x + wd / 2, y - ht * 0.75); g.lineTo(x + wd / 2, y); g.fill();
      g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x - wd / 2 + 3, y - ht * 0.7, 4, ht * 0.6);
    });
  } },
  lolipop: { w: 120, h: 250, wh: 3000, draw(g, w, h, v) {
    shadowE(g, 60, 244, 30, 5);
    g.fillStyle = hgrad(g, 54, 66, '#fff', '#d9d9e6'); g.fillRect(55, 100, 10, 146);
    const cs = [['#ff5fa2', '#fff'], ['#4dabf7', '#fff'], ['#ffd23a', '#ff8c1a']][v % 3];
    ball(g, 60, 62, 52, cs[0], 0.3);
    g.strokeStyle = cs[1]; g.lineWidth = 8; g.beginPath(); for (let a = 0; a < 14; a += 0.12) { const r = a * 3.4; g.lineTo(60 + Math.cos(a) * r, 62 + Math.sin(a) * r); } g.stroke();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(40, 40, 14, 8, -0.6, 0, TAU); g.fill();
  } },
  tongkat: { w: 100, h: 240, wh: 2800, draw(g) {
    shadowE(g, 50, 234, 26, 5);
    g.save(); g.lineCap = 'round';
    const path = () => { g.beginPath(); g.moveTo(40, 232); g.lineTo(40, 60); g.arc(60, 60, 20, Math.PI, 0); g.lineTo(80, 80); };
    g.lineWidth = 20; g.strokeStyle = '#fff'; path(); g.stroke();
    g.setLineDash([14, 14]); g.strokeStyle = '#e8412c'; path(); g.stroke();
    g.restore();
  } },
  donat: { w: 160, h: 160, wh: 1700, draw(g) {
    shadowE(g, 80, 154, 62, 6);
    g.save(); g.translate(80, 86);
    g.fillStyle = vgrad(g, -60, 60, '#e0a86b', '#b97a3c'); g.beginPath(); g.arc(0, 0, 64, 0, TAU); g.fill();
    g.fillStyle = '#ff8fc8'; g.beginPath(); for (let a = 0; a <= TAU + 0.01; a += 0.2) g.lineTo(Math.cos(a) * (54 + Math.sin(a * 5) * 4), Math.sin(a) * (54 + Math.sin(a * 5) * 4)); g.fill();
    g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, 0, 20, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over';
    ['#fff', '#ffd23a', '#4dabf7', '#69db7c'].forEach((c, k) => { g.fillStyle = c; for (let i = 0; i < 5; i++) { const a = k * 1.3 + i * 1.25, r = 36 + (i % 2) * 8; g.save(); g.translate(Math.cos(a) * r, Math.sin(a) * r); g.rotate(a * 3); g.fillRect(-5, -2, 10, 4); g.restore(); } });
    g.restore();
  } },
  kekcawan: { w: 150, h: 160, wh: 1700, draw(g) {
    shadowE(g, 75, 154, 56, 6);
    g.fillStyle = hgrad(g, 30, 120, '#ff9fc8', '#e0679e'); g.beginPath(); g.moveTo(28, 90); g.lineTo(122, 90); g.lineTo(108, 152); g.lineTo(42, 152); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 3; for (let x = 42; x < 112; x += 14) { g.beginPath(); g.moveTo(x, 92); g.lineTo(x + 4, 150); g.stroke(); }
    ball(g, 52, 80, 26, '#fff4e0', 0.2); ball(g, 98, 80, 26, '#fff4e0', 0.2); ball(g, 75, 60, 30, '#fff4e0', 0.2);
    ball(g, 75, 30, 11, '#e8412c', 0.5);
    ['#ffd23a', '#4dabf7', '#69db7c', '#ff5fa2'].forEach((c, i) => { g.fillStyle = c; g.fillRect(48 + i * 16, 56 + (i % 2) * 14, 8, 3); });
  } },
  kren: { w: 230, h: 330, wh: 5200, draw(g) {
    shadowE(g, 90, 324, 60, 6);
    g.strokeStyle = '#f2a922'; g.lineWidth = 4;
    for (let y = 320; y > 70; y -= 24) { g.beginPath(); g.moveTo(74, y); g.lineTo(104, y - 24); g.moveTo(104, y); g.lineTo(74, y - 24); g.stroke(); }
    g.fillStyle = '#f2a922'; g.fillRect(70, 60, 6, 264); g.fillRect(102, 60, 6, 264);
    g.fillRect(20, 56, 206, 10);
    g.strokeStyle = '#f2a922'; for (let x = 30; x < 220; x += 18) { g.beginPath(); g.moveTo(x, 56); g.lineTo(x + 9, 66); g.lineTo(x + 18, 56); g.stroke(); }
    g.fillStyle = '#3d3256'; rr(g, 64, 66, 50, 30, 4); g.fill(); g.fillStyle = '#a5d8ff'; rr(g, 70, 70, 20, 16, 3); g.fill();
    g.strokeStyle = '#3d3256'; g.lineWidth = 2; g.beginPath(); g.moveTo(196, 66); g.lineTo(196, 170); g.stroke();
    g.fillStyle = '#e8412c'; rr(g, 182, 170, 28, 22, 4); g.fill();
  } },
  jengkaut: { w: 230, h: 170, wh: 2100, draw(g) {
    shadowE(g, 110, 162, 100, 8);
    g.fillStyle = '#3d3d48'; rr(g, 30, 120, 150, 40, 20); g.fill();
    g.fillStyle = '#5b5b6b'; for (let x = 44; x < 176; x += 22) { g.beginPath(); g.arc(x, 140, 9, 0, TAU); g.fill(); }
    g.fillStyle = vgrad(g, 60, 124, '#ffd23a', '#e0a800'); rr(g, 40, 68, 120, 56, 10); g.fill();
    g.fillStyle = '#a5d8ff'; rr(g, 52, 76, 40, 34, 6); g.fill();
    g.strokeStyle = '#e0a800'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(150, 84); g.lineTo(196, 40); g.lineTo(214, 110); g.stroke();
    g.fillStyle = '#5b5b6b'; g.beginPath(); g.moveTo(200, 106); g.lineTo(228, 104); g.lineTo(222, 140); g.lineTo(196, 132); g.fill();
  } },
  bata: { w: 160, h: 110, wh: 950, draw(g) {
    shadowE(g, 80, 104, 72, 7);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) { const x = 20 + r * 15 + i * 30, y = 82 - r * 20; g.fillStyle = vgrad(g, y, y + 18, '#e2734f', '#b9502f'); rr(g, x, y, 28, 18, 3); g.fill(); }
  } },
  papantanda: { w: 120, h: 160, wh: 1700, draw(g, w, h, v) {
    shadowE(g, 60, 154, 30, 5);
    g.fillStyle = '#9aa3ad'; g.fillRect(56, 70, 8, 86);
    g.save(); g.translate(60, 52); g.rotate(Math.PI / 4); g.fillStyle = '#ffd23a'; rr(g, -36, -36, 72, 72, 10); g.fill(); g.strokeStyle = '#2b2b2b'; g.lineWidth = 5; rr(g, -30, -30, 60, 60, 8); g.stroke(); g.restore();
    g.fillStyle = '#2b2b2b'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(v % 2 ? '!' : '⛏', 60, 54);
  } },
  bendera: { w: 100, h: 240, wh: 2800, draw(g, w, h, v) {
    shadowE(g, 30, 234, 20, 4);
    g.fillStyle = '#d9d9e6'; g.fillRect(26, 20, 7, 216); ball(g, 29, 18, 7, '#ffd23a');
    const c = ['#ff5f7a', '#4dabf7', '#ffd23a', '#69db7c'][v % 4];
    g.fillStyle = c; g.beginPath(); g.moveTo(33, 26); g.quadraticCurveTo(66, 16, 96, 34); g.quadraticCurveTo(66, 52, 33, 72); g.fill();
    starPath(g, 58, 44, 10, 4.5); g.fillStyle = '#fff'; g.fill();
  } },
  trofi: { w: 170, h: 230, wh: 3200, draw(g) {
    shadowE(g, 85, 224, 60, 7);
    g.fillStyle = vgrad(g, 180, 224, '#8a5d36', '#5b3d22'); rr(g, 40, 186, 90, 38, 6); g.fill();
    g.fillStyle = hgrad(g, 70, 100, '#ffe58a', '#c99512'); g.fillRect(74, 140, 22, 48);
    g.strokeStyle = '#e0a800'; g.lineWidth = 12; g.beginPath(); g.arc(36, 72, 22, 1.3, 4.8); g.stroke(); g.beginPath(); g.arc(134, 72, 22, -1.6, 1.8); g.stroke();
    g.fillStyle = hgrad(g, 34, 136, '#fff2a8', '#d4a017'); g.beginPath(); g.moveTo(34, 40); g.lineTo(136, 40); g.quadraticCurveTo(132, 140, 85, 146); g.quadraticCurveTo(38, 140, 34, 40); g.fill();
    starPath(g, 85, 84, 22, 9); g.fillStyle = '#fff'; g.fill();
    g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(56, 70, 8, 26, 0.1, 0, TAU); g.fill();
  } },
  bintangbesar: { w: 150, h: 220, wh: 2500, draw(g) {
    shadowE(g, 75, 214, 30, 5);
    g.fillStyle = '#d9d9e6'; g.fillRect(71, 110, 8, 106);
    starPath(g, 75, 70, 66, 28); g.fillStyle = vgrad(g, 4, 140, '#fff2a8', '#f2a922'); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 5; g.stroke();
    g.fillStyle = '#3d3256'; g.beginPath(); g.arc(62, 70, 4.5, 0, TAU); g.arc(88, 70, 4.5, 0, TAU); g.fill();
    g.strokeStyle = '#3d3256'; g.lineWidth = 3; g.beginPath(); g.arc(75, 78, 9, 0.3, 2.8); g.stroke();
  } },
  // ------------ HALANGAN ------------
  jerami: { w: 150, h: 120, wh: 900, draw(g) {
    shadowE(g, 75, 114, 70, 8);
    g.fillStyle = vgrad(g, 20, 112, '#f7d774', '#d9a93a'); rr(g, 10, 22, 130, 90, 26); g.fill();
    g.strokeStyle = 'rgba(160,110,20,.5)'; g.lineWidth = 2; for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(18 + i * 9, 30); g.quadraticCurveTo(14 + i * 9, 66, 20 + i * 9, 104); g.stroke(); }
    g.fillStyle = '#c0392b'; g.fillRect(10, 52, 130, 7); g.fillRect(10, 80, 130, 7);
  } },
  peti: { w: 150, h: 130, wh: 950, draw(g) {
    shadowE(g, 75, 124, 70, 8);
    for (let i = 0; i < 7; i++) ball(g, 26 + i * 16, 40 - (i % 2) * 6, 13, ['#e8412c', '#ff8c1a', '#ffd23a', '#3bb36b'][i % 4]);
    g.fillStyle = vgrad(g, 40, 124, '#c98a4b', '#93582a'); rr(g, 12, 40, 126, 82, 8); g.fill();
    g.fillStyle = 'rgba(0,0,0,.2)'; for (const y of [62, 88]) g.fillRect(12, y, 126, 5);
  } },
  balak: { w: 170, h: 100, wh: 750, draw(g) {
    shadowE(g, 85, 94, 80, 7);
    g.fillStyle = vgrad(g, 20, 92, '#b07a46', '#7a4e28'); rr(g, 24, 26, 132, 64, 30); g.fill();
    g.fillStyle = '#e4bf8a'; g.beginPath(); g.ellipse(30, 58, 18, 32, 0, 0, TAU); g.fill();
    g.strokeStyle = '#b58a52'; g.lineWidth = 2; for (const r of [6, 12, 18]) { g.beginPath(); g.ellipse(30, 58, r * 0.55, r, 0, 0, TAU); g.stroke(); }
    g.fillStyle = '#3cb878'; g.beginPath(); g.ellipse(110, 28, 16, 6, 0.3, 0, TAU); g.fill();
  } },
  kon: { w: 110, h: 140, wh: 1000, draw(g) {
    shadowE(g, 55, 132, 48, 6);
    g.fillStyle = '#e8412c'; rr(g, 12, 116, 86, 16, 4); g.fill();
    g.fillStyle = hgrad(g, 24, 86, '#ff8a3c', '#d4561a'); g.beginPath(); g.moveTo(24, 118); g.lineTo(48, 10); g.lineTo(62, 10); g.lineTo(86, 118); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.moveTo(38, 60); g.lineTo(72, 60); g.lineTo(76, 78); g.lineTo(34, 78); g.fill(); g.beginPath(); g.moveTo(45, 28); g.lineTo(65, 28); g.lineTo(68, 42); g.lineTo(42, 42); g.fill();
  } },
  pelampung: { w: 120, h: 140, wh: 1000, draw(g) {
    shadowE(g, 60, 132, 50, 6);
    g.fillStyle = '#9aa3ad'; g.fillRect(57, 10, 6, 50); ball(g, 60, 10, 8, '#ffd23a', 0.6);
    g.fillStyle = hgrad(g, 14, 106, '#ff5f4a', '#c22d1c'); g.beginPath(); g.moveTo(26, 120); g.lineTo(40, 50); g.lineTo(80, 50); g.lineTo(94, 120); g.fill();
    g.fillStyle = '#fff'; g.fillRect(34, 76, 52, 14);
    g.fillStyle = 'rgba(0,150,200,.5)'; g.beginPath(); g.ellipse(60, 122, 52, 10, 0, 0, TAU); g.fill();
  } },
  asteroid: { w: 140, h: 130, wh: 1050, draw(g) {
    shadowE(g, 70, 124, 56, 6, 0.4);
    ball(g, 70, 66, 52, '#8d7f9e', 0.3);
    g.fillStyle = 'rgba(0,0,0,.18)'; for (const [x, y, r] of [[50, 50, 12], [88, 74, 14], [62, 92, 8], [92, 40, 7]]) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(255,170,60,.6)'; g.beginPath(); g.moveTo(112, 40); g.quadraticCurveTo(140, 20, 138, 6); g.quadraticCurveTo(128, 30, 106, 34); g.fill();
  } },
  jeli: { w: 130, h: 130, wh: 1000, draw(g) {
    shadowE(g, 65, 124, 56, 6);
    g.fillStyle = 'rgba(120,220,140,.9)'; rr(g, 18, 30, 94, 94, 22); g.fill();
    g.fillStyle = 'rgba(255,255,255,.45)'; rr(g, 28, 40, 26, 50, 12); g.fill();
    g.fillStyle = '#26262b'; g.beginPath(); g.arc(52, 70, 5, 0, TAU); g.arc(78, 70, 5, 0, TAU); g.fill();
    g.strokeStyle = '#26262b'; g.lineWidth = 3; g.beginPath(); g.arc(65, 82, 9, 0.3, 2.8); g.stroke();
  } },
  penghadang: { w: 170, h: 110, wh: 950, draw(g) {
    shadowE(g, 85, 104, 80, 7);
    g.fillStyle = '#5b5b6b'; g.fillRect(24, 50, 10, 54); g.fillRect(136, 50, 10, 54);
    g.save(); rr(g, 8, 30, 154, 34, 10); g.clip();
    for (let x = -40; x < 180; x += 28) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x, 64); g.lineTo(x + 14, 30); g.lineTo(x + 28, 30); g.lineTo(x + 14, 64); g.fill(); g.fillStyle = '#e8412c'; g.beginPath(); g.moveTo(x + 14, 64); g.lineTo(x + 28, 30); g.lineTo(x + 42, 30); g.lineTo(x + 28, 64); g.fill(); }
    g.restore();
    ball(g, 28, 24, 8, '#ffd23a', 0.7); ball(g, 142, 24, 8, '#ffd23a', 0.7);
  } },
};

// varian untuk sprite yang mempunyai beberapa warna
export const VARIANTS = { rumah: 2, bangunan: 5, pokokbulat: 4, dino: 3, karang: 3, planet: 3, lolipop: 3, papantanda: 2, bendera: 4, batu: 1, paku: 1 };

const cache = new Map();
export function spriteCanvas(name, v = 0) {
  const key = name + ':' + v;
  if (cache.has(key)) return cache.get(key);
  const s = SPR[name];
  const c = document.createElement('canvas');
  const k = 1.5; // resolusi lebih tinggi untuk skrin tajam
  c.width = Math.ceil(s.w * k); c.height = Math.ceil(s.h * k);
  const g = c.getContext('2d'); g.scale(k, k);
  s.draw(g, s.w, s.h, v);
  const out = { img: c, wh: s.wh, aspect: s.w / s.h };
  cache.set(key, out);
  return out;
}

// ---------------- LABEL (huruf, nombor, warna, bentuk, emoji) ----------------
const SHAPE_PATH = {
  bulatan: 'M50 8 A42 42 0 1 1 49.9 8 Z', segitiga: 'M50 8 L94 90 L6 90 Z', segiempat: 'M10 10 H90 V90 H10 Z', segiempattepat: 'M4 26 H96 V74 H4 Z',
  bintang: 'M50 5 L61 38 L96 38 L68 59 L79 93 L50 72 L21 93 L32 59 L4 38 L39 38 Z', hati: SHAPES.find((s) => s.id === 'hati').svg.match(/d="([^"]+)"/)[1],
  bujur: 'M6 50 A44 30 0 1 1 94 50 A44 30 0 1 1 6 50 Z', berlian: 'M50 4 L94 50 L50 96 L6 50 Z', bulansabit: SHAPES.find((s) => s.id === 'bulansabit').svg.match(/d="([^"]+)"/)[1],
};
const paths = {};
export const FONT = '"Baloo 2", "Nunito", system-ui, sans-serif';
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
export function drawLabel(g, spec, cx, cy, size) {
  if (!spec) return;
  if (spec.t === 'txt') {
    g.font = `800 ${size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = size * 0.12; g.strokeStyle = '#fff'; g.strokeText(spec.v, cx, cy + size * 0.06);
    g.fillStyle = spec.c || '#3d3256'; g.fillText(spec.v, cx, cy + size * 0.06);
  } else if (spec.t === 'emo') {
    g.font = `${size * 0.82}px ${EMOJI_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#000'; g.fillText(spec.v, cx, cy + size * 0.04);
  } else if (spec.t === 'col') {
    ball(g, cx, cy, size * 0.46, spec.hex, 0.45);
    g.strokeStyle = '#fff'; g.lineWidth = size * 0.07; g.beginPath(); g.arc(cx, cy, size * 0.46, 0, TAU); g.stroke();
  } else if (spec.t === 'shp') {
    const p = paths[spec.id] || (paths[spec.id] = new Path2D(SHAPE_PATH[spec.id]));
    g.save(); g.translate(cx - size * 0.45, cy - size * 0.45); g.scale(size * 0.009, size * 0.009);
    const gr = g.createLinearGradient(0, 0, 0, 100); gr.addColorStop(0, shade(spec.hex, 0.35)); gr.addColorStop(1, shade(spec.hex, -0.2));
    g.fillStyle = gr; g.fill(p); g.lineWidth = 7; g.strokeStyle = '#fff'; g.stroke(p);
    g.restore();
  } else if (spec.t === 'star') {
    starPath(g, cx, cy, size * 0.48, size * 0.21);
    const gr = g.createLinearGradient(0, cy - size / 2, 0, cy + size / 2); gr.addColorStop(0, '#fff2a8'); gr.addColorStop(1, '#f2a922');
    g.fillStyle = gr; g.fill(); g.lineWidth = size * 0.06; g.strokeStyle = '#fff'; g.stroke();
  }
}

// gelembung item terapung (kutip)
export function itemCanvas(spec) {
  const key = 'item:' + JSON.stringify(spec);
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = 180; c.height = 180;
  const g = c.getContext('2d');
  if (spec.t === 'star') drawLabel(g, spec, 90, 92, 150);
  else {
    const gr = g.createRadialGradient(70, 60, 10, 90, 90, 84); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#e3ecff');
    g.fillStyle = gr; g.beginPath(); g.arc(90, 90, 80, 0, TAU); g.fill();
    g.lineWidth = 8; g.strokeStyle = '#ffd23a'; g.stroke();
    drawLabel(g, spec, 90, 92, 104);
    g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.ellipse(60, 46, 22, 10, -0.6, 0, TAU); g.fill();
  }
  const out = { img: c, wh: 950, aspect: 1 };
  cache.set(key, out);
  return out;
}

// pintu gerbang pilihan jawapan
export function gateCanvas(spec, accent) {
  const key = 'gate:' + accent + JSON.stringify(spec);
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = 240; c.height = 300;
  const g = c.getContext('2d');
  const col = spec.t === 'col' ? spec.hex : accent;
  // tiang
  for (const x of [16, 204]) {
    g.fillStyle = hgrad(g, x, x + 20, shade(col, 0.25), shade(col, -0.3)); rr(g, x, 120, 20, 180, 8); g.fill();
    g.fillStyle = 'rgba(255,255,255,.7)'; for (let y = 140; y < 290; y += 34) g.fillRect(x, y, 20, 10);
  }
  // papan
  g.fillStyle = 'rgba(0,0,0,.2)'; rr(g, 6, 16, 228, 132, 30); g.fill();
  g.fillStyle = spec.t === 'col' ? vgrad(g, 6, 140, shade(col, 0.3), shade(col, -0.15)) : vgrad(g, 6, 140, '#ffffff', '#f1ecff');
  rr(g, 6, 6, 228, 132, 30); g.fill();
  g.lineWidth = 9; g.strokeStyle = spec.t === 'col' ? '#ffffff' : col; rr(g, 10, 10, 220, 124, 26); g.stroke();
  if (spec.t !== 'col') drawLabel(g, spec, 120, spec.cap ? 62 : 74, spec.cap ? 74 : 104);
  else { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(70, 40, 40, 14, -0.2, 0, TAU); g.fill(); }
  if (spec.cap) { g.font = `800 ${spec.cap.length > 12 ? 17 : 22}px ${FONT}`; g.fillStyle = '#3d3256'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(spec.cap.length > 22 ? spec.cap.slice(0, 21) + '…' : spec.cap, 120, 116); }
  // lampu
  ['#ffd23a', '#ff5f7a', '#3bd16f'].forEach((cc, i) => ball(g, 80 + i * 40, 6, 9, cc, 0.7));
  const out = { img: c, aspect: 240 / 300 };
  cache.set(key, out);
  return out;
}

// gerbang penuh lebar jalan: MULA / TAMAT / PIT
export function archCanvas(kind, accent) {
  const key = 'arch:' + kind + accent;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = 520; c.height = 300;
  const g = c.getContext('2d');
  for (const x of [10, 486]) { g.fillStyle = hgrad(g, x, x + 24, '#ffffff', '#c9d3e0'); rr(g, x, 40, 24, 260, 10); g.fill(); g.fillStyle = accent; for (let y = 60; y < 300; y += 40) g.fillRect(x, y, 24, 14); }
  if (kind === 'pit') {
    g.fillStyle = vgrad(g, 0, 80, '#3d3256', '#2a2240'); g.beginPath(); g.moveTo(0, 90); g.lineTo(260, 6); g.lineTo(520, 90); g.closePath(); g.fill();
    g.fillStyle = accent; rr(g, 150, 34, 220, 56, 18); g.fill();
    g.font = `800 40px ${FONT}`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PIT STOP', 260, 64);
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#fff' : accent; g.fillRect(34 + i * 56.5, 90, 56.5, 22); }
  } else {
    g.fillStyle = 'rgba(0,0,0,.2)'; rr(g, 14, 30, 496, 86, 24); g.fill();
    g.save(); rr(g, 10, 20, 500, 86, 24); g.clip();
    for (let y = 0; y < 3; y++) for (let x = 0; x < 20; x++) { g.fillStyle = (x + y) % 2 ? '#26262b' : '#ffffff'; g.fillRect(10 + x * 25, 20 + y * 28.7, 25, 28.7); }
    g.restore();
    g.fillStyle = kind === 'start' ? '#2f9e6a' : '#e2553f'; rr(g, 150, 30, 220, 66, 20); g.fill();
    g.lineWidth = 5; g.strokeStyle = '#fff'; g.stroke();
    g.font = `800 46px ${FONT}`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(kind === 'start' ? 'MULA' : 'TAMAT', 260, 66);
    ['#ffd23a', '#ff5f7a', '#4dabf7', '#3bd16f'].forEach((cc, i) => { ball(g, 40 + i * 30, 14, 10, cc, 0.6); ball(g, 390 + i * 30, 14, 10, cc, 0.6); });
  }
  const out = { img: c, aspect: 520 / 300 };
  cache.set(key, out);
  return out;
}

// papan tuan rumah haiwan di tepi jalan (checkpoint haiwan)
export function hostCanvas(e) {
  const key = 'host:' + e;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = 170; c.height = 260;
  const g = c.getContext('2d');
  shadowE(g, 85, 252, 40, 6);
  g.fillStyle = hgrad(g, 78, 92, '#c98a4b', '#8a5d36'); g.fillRect(78, 120, 14, 136);
  g.fillStyle = '#fff'; g.beginPath(); g.arc(85, 80, 72, 0, TAU); g.fill();
  g.lineWidth = 8; g.strokeStyle = '#ffd23a'; g.stroke();
  g.font = `92px ${EMOJI_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 85, 84);
  g.fillStyle = '#7a4eb0'; g.beginPath(); g.arc(140, 26, 22, 0, TAU); g.fill();
  g.font = `800 32px ${FONT}`; g.fillStyle = '#fff'; g.fillText('?', 140, 28);
  const out = { img: c, wh: 2600, aspect: 170 / 260 };
  cache.set(key, out);
  return out;
}
