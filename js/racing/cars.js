// =====================================================================
//  CILIK RACING — lukisan kereta mainan die-cast (Canvas 2D, tanpa emoji)
//  drawCarRear: pandangan belakang (semasa berlumba)
//  drawCarSide: pandangan sisi (garaj, keputusan, laman racing)
// =====================================================================
import { PAINTS, RIMS } from './data.js';

export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  if (f >= 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; } else { r *= 1 + f; g *= 1 + f; b *= 1 + f; }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}
export function rr(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
const RAINBOW = ['#ff5f5f', '#ff9f43', '#ffd23a', '#3bd16f', '#3a9bff', '#9d6bff'];
export function bodyColor(car, custom = {}) {
  const p = PAINTS.find((x) => x.id === custom.paint);
  return p && p.hex ? p.hex : car.body;
}
function rimColors(custom = {}) { return (RIMS.find((x) => x.id === custom.rim) || RIMS[0]).c; }

// pelekat kecil
export function drawSticker(g, id, x, y, s) {
  if (!id || id === 'tiada') return;
  g.save(); g.translate(x, y); g.scale(s / 20, s / 20);
  g.lineWidth = 2.5; g.strokeStyle = '#fff';
  if (id === 'bintang' || id === 'satu') {
    g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? 4.5 : 10; g.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } g.closePath();
    g.fillStyle = '#ffd23a'; g.fill(); g.stroke();
    if (id === 'satu') { g.fillStyle = '#e2553f'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1', 0, 1); }
  } else if (id === 'petir') {
    g.beginPath(); g.moveTo(3, -11); g.lineTo(-7, 2); g.lineTo(0, 2); g.lineTo(-3, 11); g.lineTo(8, -3); g.lineTo(1, -3); g.closePath(); g.fillStyle = '#ffd23a'; g.fill(); g.stroke();
  } else if (id === 'bunga') {
    for (let i = 0; i < 5; i++) { g.save(); g.rotate(i * Math.PI * 0.4); g.beginPath(); g.ellipse(0, -6, 4.5, 7, 0, 0, Math.PI * 2); g.fillStyle = '#e8412c'; g.fill(); g.restore(); }
    g.beginPath(); g.arc(0, 0, 2.6, 0, 7); g.fillStyle = '#ffd23a'; g.fill();
  } else if (id === 'hati') {
    g.beginPath(); g.moveTo(0, 9); g.bezierCurveTo(-12, 0, -9, -11, 0, -4); g.bezierCurveTo(9, -11, 12, 0, 0, 9); g.fillStyle = '#ff5f8f'; g.fill(); g.stroke();
  } else if (id === 'wau') {
    g.beginPath(); g.moveTo(0, -11); g.lineTo(9, -2); g.lineTo(0, 11); g.lineTo(-9, -2); g.closePath(); g.fillStyle = '#2e5aac'; g.fill(); g.stroke();
    g.beginPath(); g.arc(0, -2, 3, 0, 7); g.fillStyle = '#ffd23a'; g.fill();
  } else if (id === 'bulan') {
    g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fillStyle = '#ffe066'; g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(4, -3, 7.5, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over';
  }
  g.restore();
}

function tire(g, x, y, w, h, phase, rimC) {
  const grd = g.createLinearGradient(x, 0, x + w, 0);
  grd.addColorStop(0, '#1d1d24'); grd.addColorStop(0.5, '#3a3a46'); grd.addColorStop(1, '#16161c');
  rr(g, x, y, w, h, w * 0.42); g.fillStyle = grd; g.fill();
  g.save(); rr(g, x, y, w, h, w * 0.42); g.clip();
  g.strokeStyle = 'rgba(255,255,255,.13)'; g.lineWidth = 3;
  const step = h / 5;
  for (let i = -1; i < 7; i++) { const yy = y + ((i * step + phase * step * 3) % (h + step)); g.beginPath(); g.moveTo(x + 3, yy); g.lineTo(x + w - 3, yy + 3); g.stroke(); }
  g.restore();
  // hab rim dilihat dari belakang
  g.fillStyle = rimC[0] === 'rainbow' ? '#ffd23a' : rimC[0];
  rr(g, x + w * 0.3, y + h * 0.36, w * 0.4, h * 0.28, 4); g.fill();
}

// ---------------- PANDANGAN BELAKANG ----------------
// kotak lukisan 200 x 160, titik tanah = (100, 150)
export function drawCarRear(g, car, { custom = {}, phase = 0, driver = null, brake = 0, glowT = 0 } = {}) {
  const body = bodyColor(car, custom), acc = car.acc, rim = rimColors(custom);
  const shp = car.shape;
  const tall = shp === 'jeep' || shp === 'robo' ? 6 : 0;
  const bw = shp === 'buggy' ? 128 : 160, bx = 100 - bw / 2;
  // bayang
  const sh = g.createRadialGradient(100, 150, 10, 100, 150, 100);
  sh.addColorStop(0, 'rgba(0,0,0,.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = sh; g.beginPath(); g.ellipse(100, 150, 100, 15, 0, 0, Math.PI * 2); g.fill();
  if (car.glow) { const gg = g.createRadialGradient(100, 90, 20, 100, 90, 120); gg.addColorStop(0, `rgba(255,240,120,${0.35 + 0.15 * Math.sin(glowT * 6)})`); gg.addColorStop(1, 'rgba(255,240,120,0)'); g.fillStyle = gg; g.fillRect(-20, -20, 240, 200); }
  // tayar
  const tw = shp === 'buggy' ? 40 : 34, th = shp === 'buggy' ? 64 : 54;
  tire(g, bx - tw * 0.55, 150 - th, tw, th, phase, rim);
  tire(g, bx + bw - tw * 0.45, 150 - th, tw, th, phase, rim);
  // badan bawah
  const by = 66 - tall, bh = 64 + tall;
  const bg = g.createLinearGradient(0, by, 0, by + bh);
  bg.addColorStop(0, shade(body, 0.28)); bg.addColorStop(0.5, body); bg.addColorStop(1, shade(body, -0.32));
  rr(g, bx, by, bw, bh, shp === 'jeep' || shp === 'robo' ? 14 : 28); g.fillStyle = bg; g.fill();
  g.lineWidth = 3; g.strokeStyle = shade(body, -0.45); g.stroke();
  // corak badan
  g.save(); rr(g, bx, by, bw, bh, 26); g.clip();
  decoRear(g, car, body, acc, bx, by, bw, bh);
  g.restore();
  // kabin & cermin belakang
  const cw = shp === 'sport' ? 112 : shp === 'buggy' ? 96 : 104, cx = 100 - cw / 2, cy = shp === 'sport' ? 26 : 16 - tall;
  const ch = by - cy + 14;
  const cg = g.createLinearGradient(0, cy, 0, cy + ch);
  cg.addColorStop(0, shade(body, 0.35)); cg.addColorStop(1, shade(body, -0.1));
  if (!car.dome) { rr(g, cx, cy, cw, ch, shp === 'jeep' || shp === 'robo' ? 12 : 34); g.fillStyle = cg; g.fill(); g.strokeStyle = shade(body, -0.45); g.stroke(); }
  // tingkap
  const wx = cx + 10, wy = cy + 9, ww = cw - 20, wh = ch - 22;
  g.save(); rr(g, wx, wy, ww, wh, shp === 'jeep' || shp === 'robo' ? 8 : 26); g.clip();
  const wg = g.createLinearGradient(0, wy, 0, wy + wh); wg.addColorStop(0, '#bfe6ff'); wg.addColorStop(1, '#5aa1d6');
  g.fillStyle = wg; g.fillRect(wx, wy, ww, wh);
  if (driver && driver.complete && driver.naturalWidth) g.drawImage(driver, wx + ww / 2 - 34, wy + 2, 68, 68);
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(wx, wy + wh * 0.7); g.lineTo(wx + ww * 0.35, wy); g.lineTo(wx + ww * 0.55, wy); g.lineTo(wx, wy + wh); g.fill();
  g.restore();
  if (car.dome) { g.beginPath(); g.ellipse(100, by + 2, 58, 52, 0, Math.PI, 0); g.fillStyle = 'rgba(200,235,255,.45)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; g.stroke(); if (driver && driver.complete && driver.naturalWidth) g.drawImage(driver, 66, by - 52, 68, 68); }
  // aksesori bumbung
  roofRear(g, car, body, acc, cx, cy, cw);
  // lampu belakang
  const lc = brake > 0 ? '#ff2a2a' : '#ff5f4a';
  for (const lx of [bx + 10, bx + bw - 36]) {
    rr(g, lx, by + 14, 26, 14, 7); g.fillStyle = lc; g.fill();
    g.fillStyle = 'rgba(255,255,255,.6)'; rr(g, lx + 4, by + 16, 9, 4, 2); g.fill();
    if (brake > 0) { g.fillStyle = 'rgba(255,60,60,.35)'; g.beginPath(); g.arc(lx + 13, by + 21, 18, 0, 7); g.fill(); }
  }
  // bampar
  rr(g, bx + 8, by + bh - 18, bw - 16, 12, 6); g.fillStyle = shp === 'retro' ? '#e9eef5' : shade(body, -0.5); g.fill();
  // plat nombor comel
  rr(g, 78, by + bh - 34, 44, 15, 4); g.fillStyle = '#fff6e6'; g.fill(); g.strokeStyle = shade(acc, -0.2); g.lineWidth = 2; g.stroke();
  g.fillStyle = '#3d3256'; g.font = 'bold 10px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CILIK', 100, by + bh - 26);
  // kilauan
  g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.ellipse(100, by + 8, bw * 0.38, 5, 0, 0, Math.PI * 2); g.fill();
  drawSticker(g, custom.sticker, bx + bw - 26, by + 44, 15);
  // ekzos
  rr(g, bx + 22, by + bh - 8, 14, 8, 3); g.fillStyle = '#9aa3ad'; g.fill();
}

function decoRear(g, car, body, acc, x, y, w, h) {
  const d = car.deco;
  if (d === 'tiger') { g.fillStyle = acc; for (let i = 0; i < 5; i++) { const xx = x + 18 + i * (w - 36) / 4; g.beginPath(); g.moveTo(xx - 6, y); g.quadraticCurveTo(xx + 6, y + 18, xx - 2, y + 34); g.lineTo(xx + 4, y + 34); g.quadraticCurveTo(xx + 12, y + 16, xx + 2, y); g.fill(); } }
  if (d === 'panda') { g.fillStyle = acc; g.beginPath(); g.ellipse(x + 20, y + 40, 26, 30, 0.3, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + w - 20, y + 40, 26, 30, -0.3, 0, 7); g.fill(); }
  if (d === 'rainbow') RAINBOW.forEach((c, i) => { g.fillStyle = c; g.fillRect(x, y + 30 + i * 5, w, 5); });
  if (d === 'stars' || d === 'craters') { g.fillStyle = d === 'stars' ? acc : shade(body, -0.18); for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x + 16 + ((i * 53) % (w - 30)), y + 16 + ((i * 29) % (h - 30)), d === 'stars' ? 3.5 : 7, 0, 7); g.fill(); } }
  if (d === 'bolt') { g.fillStyle = acc; g.beginPath(); g.moveTo(x + w / 2 + 8, y + 4); g.lineTo(x + w / 2 - 10, y + 30); g.lineTo(x + w / 2, y + 30); g.lineTo(x + w / 2 - 8, y + 56); g.lineTo(x + w / 2 + 14, y + 24); g.lineTo(x + w / 2 + 4, y + 24); g.fill(); }
  if (d === 'waves') { g.strokeStyle = acc; g.lineWidth = 4; for (const yy of [y + 34, y + 46]) { g.beginPath(); for (let xx = x; xx <= x + w; xx += 4) g.lineTo(xx, yy + Math.sin(xx / 8) * 3); g.stroke(); } }
  if (d === 'songket') { g.fillStyle = acc; g.fillRect(x, y + 34, w, 12); g.fillStyle = '#f2a922'; for (let xx = x + 6; xx < x + w; xx += 14) { g.beginPath(); g.moveTo(xx, y + 40); g.lineTo(xx + 5, y + 35); g.lineTo(xx + 10, y + 40); g.lineTo(xx + 5, y + 45); g.fill(); } }
  if (d === 'spots') { g.fillStyle = shade(body, -0.25); [[24, 18, 10], [w - 30, 24, 12], [w / 2, 44, 9]].forEach(([a, b, r]) => { g.beginPath(); g.ellipse(x + a, y + b, r * 1.3, r, 0.4, 0, 7); g.fill(); }); }
  if (d === 'cloud') { g.fillStyle = acc; [[30, 40, 12], [44, 36, 15], [58, 42, 11], [w - 50, 30, 11], [w - 36, 26, 14]].forEach(([a, b, r]) => { g.beginPath(); g.arc(x + a, y + b, r, 0, 7); g.fill(); }); }
  if (d === 'robo') { g.strokeStyle = shade(body, -0.35); g.lineWidth = 2; g.strokeRect(x + 14, y + 10, w - 28, h - 30); g.fillStyle = acc; g.fillRect(x + 50, y + 12, w - 100, 6); }
  if (d === 'gold' || car.gold) { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(x + 20, y); g.lineTo(x + 50, y); g.lineTo(x + 20, y + h); g.lineTo(x - 10, y + h); g.fill(); }
}
function roofRear(g, car, body, acc, cx, cy, cw) {
  if (car.spoiler) { g.fillStyle = shade(body, -0.4); g.fillRect(40, 60, 8, 10); g.fillRect(152, 60, 8, 10); g.fillStyle = car.gold ? '#fff4c4' : shade(acc, -0.1); rr(g, 14, 54, 172, 10, 5); g.fill(); }
  if (car.deco === 'leaf') { g.fillStyle = acc; g.beginPath(); g.ellipse(88, cy - 2, 14, 7, -0.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(112, cy - 2, 14, 7, 0.5, 0, 7); g.fill(); g.fillStyle = shade(acc, -0.3); g.fillRect(97, cy - 12, 6, 12); }
  if (car.deco === 'spikes') { g.fillStyle = acc; for (let i = 0; i < 4; i++) { const x = cx + 16 + i * (cw - 32) / 3; g.beginPath(); g.moveTo(x - 9, cy + 6); g.lineTo(x, cy - 12); g.lineTo(x + 9, cy + 6); g.fill(); } }
  if (car.ears) { const ec = car.deco === 'panda' ? car.acc : shade(body, -0.1); for (const s of [-1, 1]) { g.beginPath(); g.arc(100 + s * (cw / 2 - 14), cy + 4, 13, 0, 7); g.fillStyle = ec; g.fill(); g.beginPath(); g.arc(100 + s * (cw / 2 - 14), cy + 4, 6, 0, 7); g.fillStyle = '#ffb3c6'; g.fill(); } }
  if (car.antenna) { g.strokeStyle = '#5b5b6b'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + cw - 22, cy + 4); g.lineTo(cx + cw - 12, cy - 22); g.stroke(); g.beginPath(); g.arc(cx + cw - 12, cy - 24, 6, 0, 7); g.fillStyle = car.acc; g.fill(); }
  if (car.rack) { g.fillStyle = '#5b3d22'; g.fillRect(cx + 4, cy - 8, cw - 8, 6); for (let i = 0; i < 4; i++) g.fillRect(cx + 10 + i * (cw - 26) / 3, cy - 14, 5, 10); g.fillStyle = '#c47a3a'; rr(g, cx + 20, cy - 22, 30, 14, 4); g.fill(); }
  if (car.fins) { g.fillStyle = car.acc === '#ffffff' ? shade(car.body, -0.25) : car.acc; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(100 + s * 70, 70); g.lineTo(100 + s * 92, 34); g.lineTo(100 + s * 82, 72); g.fill(); } }
  if (car.deco === 'crown') { g.fillStyle = '#ffd23a'; g.strokeStyle = '#c99512'; g.lineWidth = 2; g.beginPath(); g.moveTo(80, cy + 2); g.lineTo(80, cy - 18); g.lineTo(90, cy - 8); g.lineTo(100, cy - 22); g.lineTo(110, cy - 8); g.lineTo(120, cy - 18); g.lineTo(120, cy + 2); g.closePath(); g.fill(); g.stroke(); }
}

// ---------------- PANDANGAN SISI ----------------
// kotak lukisan 260 x 160, menghadap ke kanan, tanah pada y = 146
export function drawCarSide(g, car, { custom = {}, spin = 0, driver = null, glowT = 0 } = {}) {
  const body = bodyColor(car, custom), acc = car.acc, rim = rimColors(custom), shp = car.shape;
  const wr = shp === 'buggy' ? 32 : shp === 'jeep' ? 28 : 25;
  const wy = 146 - wr, w1 = 64, w2 = 196;
  const sh = g.createRadialGradient(130, 148, 10, 130, 148, 130);
  sh.addColorStop(0, 'rgba(0,0,0,.35)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = sh; g.beginPath(); g.ellipse(130, 148, 125, 12, 0, 0, Math.PI * 2); g.fill();
  if (car.glow) { const gg = g.createRadialGradient(130, 90, 20, 130, 90, 140); gg.addColorStop(0, `rgba(255,240,120,${0.35 + 0.15 * Math.sin(glowT * 6)})`); gg.addColorStop(1, 'rgba(255,240,120,0)'); g.fillStyle = gg; g.fillRect(-10, -10, 280, 180); }
  // badan
  const top = shp === 'sport' ? 70 : shp === 'buggy' ? 62 : 58;
  const bot = wy + (shp === 'buggy' ? -2 : 10);
  g.beginPath();
  if (shp === 'sport') { g.moveTo(22, bot); g.lineTo(18, 92); g.quadraticCurveTo(22, top, 60, top - 2); g.lineTo(190, top + 4); g.quadraticCurveTo(240, 82, 244, 104); g.lineTo(242, bot); }
  else if (shp === 'jeep' || shp === 'robo') { g.moveTo(20, bot); g.lineTo(20, top + 6); g.quadraticCurveTo(20, top, 30, top); g.lineTo(226, top + 4); g.quadraticCurveTo(240, top + 6, 240, top + 20); g.lineTo(240, bot); }
  else if (shp === 'buggy') { g.moveTo(40, bot); g.quadraticCurveTo(36, top, 70, top); g.lineTo(196, top); g.quadraticCurveTo(226, top, 222, bot); }
  else { g.moveTo(24, bot); g.quadraticCurveTo(14, top + 4, 54, top); g.lineTo(200, top); g.quadraticCurveTo(246, top + 6, 240, bot); }
  g.closePath();
  const bgr = g.createLinearGradient(0, top - 10, 0, bot);
  bgr.addColorStop(0, shade(body, 0.3)); bgr.addColorStop(0.55, body); bgr.addColorStop(1, shade(body, -0.3));
  g.fillStyle = bgr; g.fill(); g.lineWidth = 3; g.strokeStyle = shade(body, -0.45); g.stroke();
  g.save(); g.clip(); decoSide(g, car, body, acc, top, bot); g.restore();
  // kabin
  const cx0 = shp === 'sport' ? 82 : 70, cx1 = shp === 'sport' ? 178 : 184, cTop = shp === 'sport' ? 30 : shp === 'buggy' ? 22 : 18;
  if (!car.dome) {
    g.beginPath(); g.moveTo(cx0 - 10, top + 2);
    if (shp === 'jeep' || shp === 'robo') { g.lineTo(cx0, cTop); g.lineTo(cx1 - 8, cTop); g.lineTo(cx1 + 8, top + 2); }
    else { g.quadraticCurveTo(cx0 + 6, cTop, (cx0 + cx1) / 2, cTop); g.quadraticCurveTo(cx1 - 2, cTop, cx1 + 14, top + 2); }
    g.closePath();
    const cg = g.createLinearGradient(0, cTop, 0, top); cg.addColorStop(0, shade(body, 0.35)); cg.addColorStop(1, shade(body, 0.05));
    g.fillStyle = cg; g.fill(); g.strokeStyle = shade(body, -0.45); g.stroke();
    // tingkap
    g.save();
    g.beginPath(); g.moveTo(cx0 + 2, top - 2);
    if (shp === 'jeep' || shp === 'robo') { g.lineTo(cx0 + 8, cTop + 8); g.lineTo(cx1 - 12, cTop + 8); g.lineTo(cx1 + 2, top - 2); }
    else { g.quadraticCurveTo(cx0 + 12, cTop + 8, (cx0 + cx1) / 2, cTop + 8); g.quadraticCurveTo(cx1 - 8, cTop + 8, cx1 + 2, top - 2); }
    g.closePath(); g.clip();
    const wg = g.createLinearGradient(0, cTop, 0, top); wg.addColorStop(0, '#c9ecff'); wg.addColorStop(1, '#6db0e0');
    g.fillStyle = wg; g.fillRect(cx0, cTop, cx1 - cx0 + 20, top - cTop);
    if (driver && driver.complete && driver.naturalWidth) g.drawImage(driver, (cx0 + cx1) / 2 - 30, cTop + 2, 64, 64);
    g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.moveTo(cx1 - 30, cTop + 8); g.lineTo(cx1 - 14, cTop + 8); g.lineTo(cx1 - 40, top); g.lineTo(cx1 - 56, top); g.fill();
    g.restore();
  } else {
    if (driver && driver.complete && driver.naturalWidth) g.drawImage(driver, 98, top - 58, 64, 64);
    g.beginPath(); g.ellipse(130, top + 2, 62, 50, 0, Math.PI, 0); g.fillStyle = 'rgba(200,235,255,.45)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 3; g.stroke();
  }
  roofSide(g, car, body, acc, cx0, cx1, cTop);
  // wajah / lampu depan
  g.fillStyle = '#fffbe6'; g.beginPath(); g.ellipse(232, top + 18, 8, 10, 0, 0, 7); g.fill(); g.strokeStyle = shade(body, -0.4); g.lineWidth = 2; g.stroke();
  if (car.face) { g.fillStyle = '#26262b'; g.beginPath(); g.arc(233, top + 19, 4, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(234.5, top + 17, 1.6, 0, 7); g.fill(); g.strokeStyle = '#26262b'; g.lineWidth = 2.5; g.beginPath(); g.arc(226, top + 36, 9, 0.2, 1.3); g.stroke(); }
  // lampu belakang
  rr(g, 18, top + 12, 9, 16, 4); g.fillStyle = '#ff5f4a'; g.fill();
  // bampar
  rr(g, 228, bot - 12, 18, 10, 5); g.fillStyle = shp === 'retro' ? '#e9eef5' : shade(body, -0.5); g.fill();
  rr(g, 14, bot - 12, 18, 10, 5); g.fill();
  // kilauan
  g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(120, top + 8, 70, 4, -0.02, 0, 7); g.fill();
  drawSticker(g, custom.sticker, 150, (top + bot) / 2 + 4, 17);
  // roda
  for (const wx of [w1, w2]) wheelSide(g, wx, wy, wr, spin, rim, shp === 'retro');
}
function wheelSide(g, x, y, r, spin, rim, whitewall) {
  g.beginPath(); g.arc(x, y, r + 4, Math.PI, 0); g.fillStyle = 'rgba(0,0,0,.25)'; g.fill();
  const tg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
  tg.addColorStop(0, '#4a4a58'); tg.addColorStop(1, '#16161c');
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = tg; g.fill();
  if (whitewall) { g.beginPath(); g.arc(x, y, r * 0.78, 0, 7); g.strokeStyle = '#f4f4f4'; g.lineWidth = 4; g.stroke(); }
  const rc = rim[0] === 'rainbow' ? null : rim;
  g.beginPath(); g.arc(x, y, r * 0.58, 0, Math.PI * 2);
  if (rc) { const rg = g.createRadialGradient(x - 4, y - 4, 1, x, y, r * 0.58); rg.addColorStop(0, rc[0]); rg.addColorStop(1, rc[1]); g.fillStyle = rg; } else g.fillStyle = '#fff';
  g.fill();
  g.save(); g.translate(x, y); g.rotate(spin);
  for (let i = 0; i < 5; i++) {
    g.rotate(Math.PI * 2 / 5);
    g.fillStyle = rc ? shade(rc[1], -0.25) : RAINBOW[i];
    g.beginPath(); g.ellipse(0, -r * 0.32, r * 0.1, r * 0.22, 0, 0, 7); g.fill();
  }
  g.beginPath(); g.arc(0, 0, r * 0.14, 0, 7); g.fillStyle = '#fff'; g.fill();
  g.restore();
}
function decoSide(g, car, body, acc, top, bot) {
  const d = car.deco;
  if (d === 'tiger') { g.fillStyle = acc; for (let i = 0; i < 6; i++) { const x = 40 + i * 32; g.beginPath(); g.moveTo(x, top - 4); g.quadraticCurveTo(x + 14, top + 20, x + 4, bot); g.lineTo(x + 10, bot); g.quadraticCurveTo(x + 22, top + 18, x + 8, top - 4); g.fill(); } }
  if (d === 'panda') { g.fillStyle = acc; g.beginPath(); g.ellipse(60, top + 30, 30, 22, 0.2, 0, 7); g.fill(); g.beginPath(); g.ellipse(200, top + 28, 26, 20, -0.2, 0, 7); g.fill(); }
  if (d === 'rainbow') RAINBOW.forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.moveTo(10, top + 16 + i * 6); g.lineTo(250, top + 6 + i * 6); g.lineTo(250, top + 12 + i * 6); g.lineTo(10, top + 22 + i * 6); g.fill(); });
  if (d === 'bolt') { g.fillStyle = acc; g.beginPath(); g.moveTo(30, top + 24); g.lineTo(120, top + 14); g.lineTo(110, top + 26); g.lineTo(210, top + 16); g.lineTo(120, top + 40); g.lineTo(130, top + 28); g.closePath(); g.fill(); }
  if (d === 'stars' || d === 'craters') { g.fillStyle = d === 'stars' ? acc : shade(body, -0.18); for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(40 + i * 25, top + 14 + ((i * 17) % 30), d === 'stars' ? 3.5 : 7, 0, 7); g.fill(); } }
  if (d === 'waves') { g.strokeStyle = acc; g.lineWidth = 4; for (const yy of [top + 24, top + 36]) { g.beginPath(); for (let x = 10; x <= 250; x += 4) g.lineTo(x, yy + Math.sin(x / 9) * 4); g.stroke(); } }
  if (d === 'songket') { g.fillStyle = acc; g.fillRect(0, top + 24, 260, 13); g.fillStyle = '#f2a922'; for (let x = 6; x < 260; x += 14) { g.beginPath(); g.moveTo(x, top + 30); g.lineTo(x + 5, top + 25); g.lineTo(x + 10, top + 30); g.lineTo(x + 5, top + 35); g.fill(); } }
  if (d === 'spots') { g.fillStyle = shade(body, -0.25); [[60, top + 18, 12], [130, top + 30, 10], [200, top + 16, 13]].forEach(([a, b, r]) => { g.beginPath(); g.ellipse(a, b, r * 1.4, r, 0.4, 0, 7); g.fill(); }); }
  if (d === 'cloud') { g.fillStyle = acc; [[50, top + 30, 12], [66, top + 24, 15], [84, top + 30, 12], [180, top + 26, 12], [196, top + 20, 14]].forEach(([a, b, r]) => { g.beginPath(); g.arc(a, b, r, 0, 7); g.fill(); }); }
  if (d === 'robo') { g.strokeStyle = shade(body, -0.35); g.lineWidth = 2; for (const x of [80, 130, 180]) { g.beginPath(); g.moveTo(x, top); g.lineTo(x, bot); g.stroke(); } g.fillStyle = acc; g.fillRect(30, top + 26, 200, 5); }
  if (car.gold) { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(60, top - 10); g.lineTo(90, top - 10); g.lineTo(60, bot); g.lineTo(30, bot); g.fill(); }
}
function roofSide(g, car, body, acc, cx0, cx1, cTop) {
  if (car.spoiler) { g.fillStyle = shade(body, -0.4); g.fillRect(26, 50, 6, 20); g.fillStyle = car.gold ? '#fff4c4' : acc; rr(g, 12, 44, 40, 9, 4); g.fill(); }
  if (car.deco === 'leaf') { g.fillStyle = acc; g.beginPath(); g.ellipse((cx0 + cx1) / 2 - 12, cTop - 4, 15, 7, -0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse((cx0 + cx1) / 2 + 12, cTop - 4, 15, 7, 0.4, 0, 7); g.fill(); g.fillStyle = shade(acc, -0.3); g.fillRect((cx0 + cx1) / 2 - 3, cTop - 14, 6, 14); }
  if (car.deco === 'spikes') { g.fillStyle = acc; for (let i = 0; i < 5; i++) { const x = cx0 + 6 + i * (cx1 - cx0) / 4.4; g.beginPath(); g.moveTo(x - 9, cTop + 8); g.lineTo(x, cTop - 12); g.lineTo(x + 9, cTop + 8); g.fill(); } }
  if (car.ears) { const ec = car.deco === 'panda' ? car.acc : shade(body, -0.1); for (const x of [cx0 + 26, cx1 - 26]) { g.beginPath(); g.arc(x, cTop + 4, 12, 0, 7); g.fillStyle = ec; g.fill(); g.beginPath(); g.arc(x, cTop + 4, 5.5, 0, 7); g.fillStyle = '#ffb3c6'; g.fill(); } }
  if (car.antenna) { g.strokeStyle = '#5b5b6b'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx0 + 16, cTop + 6); g.lineTo(cx0 + 4, cTop - 22); g.stroke(); g.beginPath(); g.arc(cx0 + 4, cTop - 24, 6, 0, 7); g.fillStyle = car.acc; g.fill(); }
  if (car.rack) { g.fillStyle = '#5b3d22'; g.fillRect(cx0, cTop - 6, cx1 - cx0, 6); g.fillStyle = '#c47a3a'; rr(g, cx0 + 10, cTop - 20, 34, 14, 4); g.fill(); g.fillStyle = '#3a3a46'; g.beginPath(); g.arc(14, 96, 20, 0, 7); g.fill(); g.fillStyle = '#9aa7b8'; g.beginPath(); g.arc(14, 96, 9, 0, 7); g.fill(); }
  if (car.fins) { g.fillStyle = car.acc === '#ffffff' ? shade(car.body, -0.25) : car.acc; g.beginPath(); g.moveTo(30, 72); g.lineTo(14, 30); g.lineTo(64, 70); g.fill(); }
  if (car.deco === 'crown') { const x = (cx0 + cx1) / 2; g.fillStyle = '#ffd23a'; g.strokeStyle = '#c99512'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 20, cTop + 2); g.lineTo(x - 20, cTop - 18); g.lineTo(x - 10, cTop - 8); g.lineTo(x, cTop - 22); g.lineTo(x + 10, cTop - 8); g.lineTo(x + 20, cTop - 18); g.lineTo(x + 20, cTop + 2); g.closePath(); g.fill(); g.stroke(); }
}

// lukis kereta ke kanvas baharu (untuk kad & pratonton)
export function carCanvas(car, { custom = {}, view = 'side', driver = null, scale = 1, locked = false } = {}) {
  const c = document.createElement('canvas');
  const w = view === 'side' ? 260 : 200, h = 160;
  const dpr = Math.min(2, self.devicePixelRatio || 1);
  c.width = w * scale * dpr; c.height = h * scale * dpr;
  c.style.width = w * scale + 'px'; c.style.height = h * scale + 'px';
  const g = c.getContext('2d'); g.scale(scale * dpr, scale * dpr);
  if (view === 'side') drawCarSide(g, car, { custom, driver }); else drawCarRear(g, car, { custom, driver });
  if (locked) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(60,50,90,.82)'; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'source-over'; }
  return c;
}
