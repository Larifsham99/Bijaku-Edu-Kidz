// =====================================================================
//  LEVEL PERMAINAN SENGET (tanpa DOM): Bola Guling & Titian Imbang
//  Dijana secara berbiji ikut level; setiap level disahkan dengan simulasi
//  fizik + autopilot dalam ujian (tests/tilt.test.mjs).
// =====================================================================
import { Track } from './tiltworld.js';

// ---------------- BOLA GULING ----------------
export function makeGuling(n, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  const T = new Track(['taman', 'pulau', 'kota'][ch]);
  const W = ch === 0 ? 2 : 1.8;
  T.x = 0; T.y = -1.5;
  T.seg(3, 3.2, { rails: true, v: 2.5, wp: false });
  const feats = ['lurus', 'belok', 'cerun'];
  if (ch === 0 && k >= 4) feats.push('sempit', 'zigzag');
  if (ch >= 1) feats.push('lompat', 'lompat', 'pulau', 'gerak');
  if (ch === 2) feats.push('spiral', 'terowong', 'bumper', 'lompat');
  const count = 5 + Math.floor(k / 2) + ch * 2;
  let since = 0, last = '';
  const starAt = new Set([Math.floor(count * 0.3), Math.floor(count * 0.6), count - 1]);
  for (let i = 0; i < count; i++) {
    let f = rng.pick(feats);
    if (f === last) f = rng.pick(feats);
    if (i === 0 && ch === 1) f = 'lompat';
    if (i === 0 && ch === 2) f = 'spiral';
    if (T.h !== 0 && (f === 'spiral' || f === 'lompat' || f === 'gerak' || f === 'bumper')) f = 'belok';
    last = f;
    const star = starAt.has(i);
    if (f === 'lurus') { T.seg(rng.int(4, 6), W, { rails: ch < 2 || rng.chance(0.5), coins: true, v: 4 }); if (star) starOn(T, 2.5); }
    else if (f === 'sempit') T.seg(3, 1.15, { coins: true, v: 2.2 });
    else if (f === 'belok') { const dir = T.h === 0 ? (T.x > 4 ? -1 : T.x < -4 ? 1 : rng.pick([-1, 1])) : 1; T.turn(dir, W, { rails: true, v: 2.2 }); T.seg(rng.int(3, 4), W, { rails: true, coins: true, v: 3 }); if (T.h !== 0 && rng.chance(0.6)) { T.turn(1, W, { rails: true, v: 2.2 }); T.seg(2, W, { rails: true, v: 3 }); } }
    else if (f === 'zigzag') { T.turn(T.x > 0 ? -1 : 1, W, { rails: true, v: 2 }); T.seg(3, W, { rails: true, coins: true, v: 3 }); T.turn(1, W, { rails: true, v: 2 }); T.seg(2, W, { rails: true, v: 3 }); }
    else if (f === 'cerun') { const up = T.z < 0.5 || rng.chance(0.5); T.seg(3, W, { rails: true, dz: up ? 0.9 : -0.9, coins: true, v: 3.2 }); T.seg(2, W, { rails: true, v: 3 }); }
    else if (f === 'lompat') {
      T.seg(5, W, { rails: true, v: 7, coins: true, launch: true });
      T.seg(2.2, W, { dz: 0.9, rails: true, v: 7.2, r: 0.6, launch: true });
      const gap = 1.3 + Math.min(0.7, (k + (ch - 1) * 10) * 0.04);
      T.gap(gap, -0.7);
      T.seg(3.2, 3, { rails: false, v: 2.4, r: 0.6 });
      if (star) starOn(T, 1.5, 0.9);
    } else if (f === 'pulau') {
      T.seg(2.4, 2.4, { v: 2.2 });
      T.seg(rng.int(2, 3), ch === 2 ? 0.85 : 1, { coins: true, v: 1.8 });
      T.seg(2.4, 2.4, { v: 2.2 });
      if (star) starOn(T, 1.2, 0.8);
    } else if (f === 'gerak') {
      T.seg(2.4, 2.4, { v: 2 });
      T.shuttle(3.2, 1.5, 1.6, 5.5 - Math.min(1.5, k * 0.15), { ph: rng.next() * 6 });
      T.seg(2.4, 2.4, { v: 2 });
    } else if (f === 'spiral') {
      T.seg(2, W, { rails: true, v: 2.6 });
      T.spiral(2.6, 360, 1.7, 1.6, { coins: true, v: 2.5 });
      T.seg(3, W, { rails: true, v: 3 });
      if (star) starOn(T, 1.5);
    } else if (f === 'terowong') {
      const p = T.seg(5, W, { rails: true, coins: true, v: 3.6 });
      T.add({ kind: 'roof', cx: p.cx, cy: p.cy, hw: W / 2 + 0.2, hl: 2.5, ang: p.ang, z: T.z + 1.3, th: 0.25, col: 'roof' });
    } else if (f === 'bumper') {
      const p = T.seg(6, 4, { rails: true, v: 2.4, wp: false });
      const ys = [1.5, 3, 4.5];
      ys.forEach((ay, j) => {
        const side = j % 2 ? 0.9 : -0.9;
        const [bx, by] = [p.cx + side, p.cy - 3 + ay];
        T.add({ kind: 'bumper', cx: bx, cy: by, hw: 0.42, hl: 0.42, ang: 0, z: T.z + 0.6, th: 0.6, col: 'bumper' });
        T.wp({ x: p.cx - side * 1.1, y: by, v: 2.2, r: 0.55 });
      });
      T.wp({ x: p.cx, y: p.cy + 2.8, v: 2.4, r: 0.6 });
      if (star) T.stars.push({ x: p.cx + 1.4, y: p.cy + 2, z: T.z + 0.5 });
    }
    since++;
    if (since >= 2 && i < count - 1 && T.h === 0) { T.seg(2.4, 2.6, { v: 2.4 }); T.check(); since = 0; }
  }
  if (T.h !== 0) T.turn(1, W, { rails: true, v: 2 });
  T.seg(2, W, { rails: true, v: 3 });
  const fin = T.seg(3, 3.2, { v: 2, wp: false });
  const goal = { x: fin.cx, y: fin.cy, z: T.z };
  T.wp({ x: goal.x, y: goal.y, v: 2, r: 0.5 });
  while (T.stars.length < 3) { const c = T.coins[Math.floor((T.coins.length * (T.stars.length + 1)) / 4)] || { x: goal.x, y: goal.y - 1, z: T.z + 0.5 }; T.stars.push({ x: c.x, y: c.y, z: c.z + 0.1 }); T.coins = T.coins.filter((q) => q !== c); }
  return T.finish({ start: [0, 0, 0], goal });
}
function starOn(T, back, side = 0) { const [x, y] = T.at(-back, side); T.stars.push({ x, y, z: T.z + 0.5 }); }

// ---------------- TITIAN IMBANG ----------------
export function makeImbang(n, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  const T = new Track(['kayu', 'goyang', 'ribut'][ch]);
  const beam = Math.max(0.55, (ch === 0 ? 1.1 : ch === 1 ? 0.95 : 0.8) - k * 0.03);
  T.x = 0; T.y = -1.2;
  T.seg(2.4, 2.4, { wp: false, col: 'pad' });
  const feats = ['titi', 'belok', 'titi'];
  if (ch > 0 || k >= 3) feats.push('tangga');
  if (ch >= 1) feats.push('jongkang', 'goyang', 'papan');
  if (ch === 2) feats.push('penolak', 'jongkang', 'sempit');
  const count = 4 + Math.floor(k / 2) + ch;
  let since = 0, last = '';
  for (let i = 0; i < count; i++) {
    let f = rng.pick(feats);
    if (f === last) f = rng.pick(feats);
    if (i === 0 && ch === 1) f = 'jongkang';
    if (i === 0 && ch === 2) f = 'penolak';
    if (T.h !== 0 && f !== 'titi' && f !== 'belok') f = 'belok';
    last = f;
    if (f === 'titi') T.seg(rng.int(3, 5), beam, { v: 1.8, col: 'beam', coins: true });
    else if (f === 'sempit') T.seg(3, Math.max(0.5, beam - 0.15), { v: 1.4, col: 'beam', coins: true });
    else if (f === 'belok') {
      if (T.h === 0) { const dir = T.x > 3 ? -1 : T.x < -3 ? 1 : rng.pick([-1, 1]); T.turn(dir, 1.6, { v: 1.4, col: 'pad' }); T.seg(rng.int(2, 3), beam, { v: 1.6, col: 'beam' }); T.turn(1, 1.6, { v: 1.4, col: 'pad' }); }
      else T.turn(1, 1.6, { v: 1.4, col: 'pad' });
    } else if (f === 'tangga') { const up = T.z < 0.4 || rng.chance(0.5); T.seg(3, beam + 0.1, { dz: up ? 0.7 : -0.7, v: 1.5, col: 'beam', coins: true }); T.seg(1.4, 1.6, { v: 1.5, col: 'pad' }); }
    else if (f === 'jongkang') {
      T.seg(1.4, 1.6, { v: 1.4, col: 'pad' });
      T.seg(4, 1.2, { tilt: { axis: 'x', amp: 0.14 + ch * 0.04 + k * 0.006, per: 3.6, ph: rng.next() * 6, react: 0.22 }, v: 1.3, col: 'seesaw', coins: true });
      T.seg(1.4, 1.6, { v: 1.4, col: 'pad' });
    } else if (f === 'goyang') {
      T.seg(1.4, 1.6, { v: 1.4, col: 'pad' });
      const amp = 0.3 + ch * 0.08;
      T.seg(4, Math.max(beam + 0.2, 2 * amp + 0.55), { move: { ax: T.h === 0 ? amp : 0, ay: T.h === 0 ? 0 : amp, per: 4.2, ph: rng.next() * 6 }, v: 1.4, col: 'bridge' });
      T.seg(1.4, 1.6, { v: 1.4, col: 'pad' });
    } else if (f === 'papan') {
      T.seg(1.6, 1.8, { v: 1.4, col: 'pad', coins: true });
      T.shuttle(2.6, 1.2, 1.2, 5.2, { ph: rng.next() * 6, col: 'board', v: 1.5 });
      T.seg(1.6, 1.8, { v: 1.4, col: 'pad' });
    } else if (f === 'penolak') {
      T.seg(1, 1.6, { v: 1.4, col: 'pad' });
      const [fx, fy] = T.at(-0.3);
      const p = T.seg(3, 3, { v: 2, col: 'pad', wp: false });
      const pu = T.add({ kind: 'pusher', cx: p.cx, cy: p.cy, hw: 0.35, hl: 0.35, ang: 0, z: T.z + 1.0, th: 1.2, move: { ax: 1.15, ay: 0, per: 3.4, ph: rng.next() * 6 }, col: 'pusher' });
      const [tx, ty] = T.at(-0.25);
      T.wps.push({ kind: 'dodge', piece: pu, from: [fx, fy], to: [tx, ty], v: 2.6, r: 0.4 });
    }
    since++;
    if (since >= 2 && i < count - 1 && T.h === 0) { T.seg(1.8, 1.8, { v: 1.5, col: 'pad' }); T.check(); since = 0; }
  }
  if (T.h !== 0) T.turn(1, 1.6, { v: 1.4, col: 'pad' });
  T.seg(2, beam, { v: 1.6, col: 'beam' });
  const fin = T.seg(2.6, 2.6, { v: 1.5, wp: false, col: 'pad' });
  const goal = { x: fin.cx, y: fin.cy, z: T.z };
  T.wp({ x: goal.x, y: goal.y, v: 1.5, r: 0.45 });
  // 3 bintang di atas laluan (sepanjang titian)
  for (let s = 1; s <= 3; s++) { const c = T.coins[Math.floor((T.coins.length * s) / 4)]; if (c) { T.stars.push({ x: c.x, y: c.y, z: c.z + 0.1 }); T.coins = T.coins.filter((q) => q !== c); } }
  return T.finish({ start: [0, -0.4, 0], goal });
}
