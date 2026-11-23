// =====================================================================
//  DUNIA SENGET — model dunia pseudo-3D + fizik + pembina trek + autopilot
//  Tanpa DOM: boleh disimulasi dalam Node untuk mengesahkan setiap level.
//  Koordinat: x kanan, y ke hadapan, z ke atas. 1 unit = 1 petak.
// =====================================================================
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ---------------- kepingan (kotak berputar / OBB) ----------------
// p = { kind, cx, cy, hw, hl, ang, z, dz, th, move:{ax,ay,az,per,ph}, tilt:{amp,per,ph,axis,react}, col, round }
export function pose(p, t) {
  let ox = 0, oy = 0, oz = 0, vx = 0, vy = 0, vz = 0;
  if (p.move) {
    const w = TAU / p.move.per, s = Math.sin(w * t + (p.move.ph || 0)), c = Math.cos(w * t + (p.move.ph || 0));
    ox = (p.move.ax || 0) * s; oy = (p.move.ay || 0) * s; oz = (p.move.az || 0) * s;
    vx = (p.move.ax || 0) * w * c; vy = (p.move.ay || 0) * w * c; vz = (p.move.az || 0) * w * c;
  }
  return { x: p.cx + ox, y: p.cy + oy, z: p.z + oz, vx, vy, vz };
}
export function toLocal(p, x, y, ps) { const dx = x - ps.x, dy = y - ps.y, c = Math.cos(-p.ang), s = Math.sin(-p.ang); return [dx * c - dy * s, dx * s + dy * c]; }
export function toWorld(p, lx, ly, ps) { const c = Math.cos(p.ang), s = Math.sin(p.ang); return [ps.x + lx * c - ly * s, ps.y + lx * s + ly * c]; }
// cerun setempat (dz per unit) termasuk jongkang-jongket
function slopes(p) { return [(p.tilt?.axis === 'x' ? p.s || 0 : 0), (p.dz ? p.dz / (2 * p.hl) : 0) + (p.tilt?.axis === 'y' ? p.s || 0 : 0)]; }
export function topAt(p, lx, ly, ps) { const [sx, sy] = slopes(p); return ps.z + sx * lx + sy * ly; }

// ---------------- dunia ----------------
export class World {
  constructor(pieces, opt = {}) {
    this.pieces = pieces;
    this.solid = pieces.filter((p) => p.kind !== 'roof' && p.kind !== 'deco');
    this.t = 0;
    this.minZ = opt.minZ ?? -9;
    pieces.forEach((p) => { p.s = 0; });
  }
  // permukaan tertinggi di bawah (x,y) yang tidak melebihi zMax
  ground(x, y, zMax, rad = 0) {
    let best = null;
    for (const p of this.solid) {
      if (p.kind === 'bumper' || p.kind === 'wall' || p.kind === 'pusher') continue;
      const ps = pose(p, this.t);
      const [lx, ly] = toLocal(p, x, y, ps);
      if (Math.abs(lx) > p.hw + rad || Math.abs(ly) > p.hl + rad) continue;
      const top = topAt(p, clamp(lx, -p.hw, p.hw), clamp(ly, -p.hl, p.hl), ps);
      if (top > zMax || top < zMax - 3.5) continue;
      if (!best || top > best.top) {
        const [sx, sy] = slopes(p), c = Math.cos(p.ang), s = Math.sin(p.ang);
        best = { p, top, gx: sx * c - sy * s, gy: sx * s + sy * c, vx: ps.vx, vy: ps.vy, vz: ps.vz, lx, ly };
      }
    }
    return best;
  }
  // kemas kini jongkang-jongket (bertindak balas kepada berat badan)
  update(dt, body) {
    this.t += dt;
    for (const p of this.pieces) {
      if (!p.tilt) continue;
      let target = p.tilt.amp * Math.sin((TAU * this.t) / p.tilt.per + (p.tilt.ph || 0));
      if (body && body.ground?.p === p) target += p.tilt.react * (p.tilt.axis === 'x' ? body.ground.lx : body.ground.ly);
      target = clamp(target, -0.55, 0.55);
      p.s += (target - p.s) * Math.min(1, dt * 2.5);
    }
  }
}

// ---------------- badan (bola / watak) ----------------
export const BALL = { r: 0.3, A: 12, fr: 0.75, S: 11, G: 15, vmax: 10, rest: 0.38, air: 0.25 };
export const WALKER = { r: 0.22, A: 7.5, fr: 3.6, S: 16, G: 15, vmax: 3.4, rest: 0.25, air: 0.15 };
export function makeBody(cfg, x, y, z) { return { cfg, x, y, z, vx: 0, vy: 0, vz: 0, onGround: true, ground: null, climb: 0, events: [], dist: 0 }; }

// satu langkah fizik (dt kecil). input {x,y} dalam [-1,1]
export function step(b, w, inp, dt) {
  const C = b.cfg;
  const ix = clamp(inp.x, -1, 1), iy = clamp(inp.y, -1, 1);
  const px = b.x, py = b.y;
  if (b.onGround) {
    const g = w.ground(b.x, b.y, b.z + 0.4);
    if (!g || g.top < b.z - 0.65) { b.onGround = false; b.vz = Math.max(b.climb, 0); }
    else {
      b.ground = g;
      b.vx += (ix * C.A - g.gx * C.S) * dt;
      b.vy += (iy * C.A - g.gy * C.S) * dt;
      const k = Math.exp(-C.fr * dt); b.vx *= k; b.vy *= k;
      const sp = Math.hypot(b.vx, b.vy); if (sp > C.vmax) { b.vx *= C.vmax / sp; b.vy *= C.vmax / sp; }
      b.x += (b.vx + g.vx) * dt; b.y += (b.vy + g.vy) * dt;
      collide(b, w);
      const g2 = w.ground(b.x, b.y, b.z + 0.4);
      if (g2 && g2.top >= b.z - 0.65) {
        b.climb = clamp((g2.top - b.z) / dt - g2.vz, -9, 9);
        b.z = g2.top; b.vz = 0; b.ground = g2;
      } else { b.onGround = false; b.vz = Math.max(b.climb, 0) + (g?.vz || 0); b.ground = null; }
    }
  }
  if (!b.onGround) {
    b.vz -= C.G * dt;
    b.vx += ix * C.A * C.air * dt; b.vy += iy * C.A * C.air * dt;
    const zPrev = b.z;
    b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
    collide(b, w);
    const g = w.ground(b.x, b.y, zPrev + 0.05);
    if (g && b.z <= g.top && b.vz <= 0) {
      const impact = -b.vz;
      b.z = g.top;
      if (impact > 4.5 && C === BALL) { b.vz = impact * C.rest; b.events.push(['bounce', impact]); }
      else { b.vz = 0; b.onGround = true; b.ground = g; b.climb = 0; b.events.push(['land', impact]); }
    }
  }
  b.dist += Math.hypot(b.x - px, b.y - py);
  if (b.z < w.minZ) b.events.push(['dead']);
}
// dinding, pagar, penolak & bumper
function collide(b, w) {
  const C = b.cfg;
  for (const p of w.solid) {
    const ps = pose(p, w.t);
    if (p.kind === 'bumper') {
      const dx = b.x - ps.x, dy = b.y - ps.y, d = Math.hypot(dx, dy), R = p.hw + C.r;
      if (d < R && b.z < ps.z + 0.4 && b.z > ps.z - 1.5) {
        const nx = dx / (d || 1), ny = dy / (d || 1);
        b.x = ps.x + nx * R; b.y = ps.y + ny * R;
        const vn = b.vx * nx + b.vy * ny;
        if (vn < 0) { const boost = Math.max(4.5, -vn * 1.25); b.vx += (boost - vn) * nx; b.vy += (boost - vn) * ny; b.events.push(['bump', boost]); }
      }
      continue;
    }
    const [lx, ly] = toLocal(p, b.x, b.y, ps);
    const ex = p.hw + C.r, ey = p.hl + C.r;
    if (Math.abs(lx) >= ex || Math.abs(ly) >= ey) continue;
    const top = topAt(p, clamp(lx, -p.hw, p.hw), clamp(ly, -p.hl, p.hl), ps); // tinggi di titik sentuhan
    if (top <= b.z + 0.32) continue;            // boleh dinaiki (anak tangga / cerun)
    if (top - (p.th || 0.5) >= b.z + C.r * 2) continue; // di atas kepala
    const pxp = ex - Math.abs(lx), pyp = ey - Math.abs(ly);
    let nlx = 0, nly = 0;
    if (pxp < pyp) nlx = Math.sign(lx) || 1; else nly = Math.sign(ly) || 1;
    const c = Math.cos(p.ang), s = Math.sin(p.ang);
    const nx = nlx * c - nly * s, ny = nlx * s + nly * c;
    const pen = Math.min(pxp, pyp);
    b.x += nx * pen; b.y += ny * pen;
    const rvx = b.vx - ps.vx, rvy = b.vy - ps.vy, vn = rvx * nx + rvy * ny;
    if (vn < 0) { b.vx -= (1 + C.rest) * vn * nx; b.vy -= (1 + C.rest) * vn * ny; if (-vn > 1.5) b.events.push(['wall', -vn]); }
    if (p.kind === 'pusher') { b.vx += ps.vx * 0.9; b.vy += ps.vy * 0.9; }
  }
}

// ---------------- pembina trek ----------------
const HEAD = { 0: [0, 1], 1: [1, 0], '-1': [-1, 0] };
const ANG = { 0: 0, 1: -Math.PI / 2, '-1': Math.PI / 2 };
export class Track {
  constructor(theme) { this.pieces = []; this.wps = []; this.coins = []; this.stars = []; this.checks = []; this.x = 0; this.y = 0; this.z = 0; this.h = 0; this.theme = theme; }
  get d() { return HEAD[this.h]; }
  get perp() { const [dx, dy] = this.d; return [dy, -dx]; } // kanan relatif arah
  add(p) { p.col ||= this.theme; p.th ??= 0.6; this.pieces.push(p); return p; }
  wp(o) { this.wps.push({ r: 0.45, v: 3, ...o }); }
  at(along, side = 0) { const [dx, dy] = this.d, [rx, ry] = this.perp; return [this.x + dx * along + rx * side, this.y + dy * along + ry * side]; }
  // kepingan lurus / cerun sepanjang arah semasa
  seg(len, wid, o = {}) {
    const [cx, cy] = this.at(len / 2);
    const dz = o.dz || 0;
    const p = this.add({ kind: o.kind || 'box', cx, cy, hw: wid / 2, hl: len / 2, ang: ANG[this.h], z: this.z + dz / 2, dz, th: o.th, move: o.move, tilt: o.tilt, col: o.col });
    if (o.rails) this.rails(len, wid, o.rails, dz);
    const v = o.v ?? 3;
    if (o.wp !== false) { const n = Math.max(1, Math.round(len / 2)); for (let i = 1; i <= n; i++) { const [x, y] = this.at((len * i) / n, o.side || 0); this.wp({ x, y, v, piece: o.move || o.tilt ? p : null, r: o.r ?? 0.45, launch: o.launch }); } }
    if (o.coins) for (let i = 0.5; i < len; i += 1) { const [x, y] = this.at(i); this.coins.push({ x, y, z: this.z + (dz * i) / len + 0.45 }); }
    this.x += this.d[0] * len; this.y += this.d[1] * len; this.z += dz;
    return p;
  }
  rails(len, wid, sides, dz) {
    const [rx, ry] = this.perp;
    for (const sd of sides === true ? [-1, 1] : sides) {
      const [cx, cy] = this.at(len / 2, sd * (wid / 2 + 0.08));
      this.add({ kind: 'wall', cx, cy, hw: 0.08, hl: len / 2, ang: ANG[this.h], z: this.z + dz / 2 + 0.38, dz, th: 0.9, col: 'rail' });
    }
    void rx; void ry;
  }
  pad(size, o = {}) { return this.seg(size, o.wid || size, { ...o }); }
  // belok 90°: pad segi empat kemudian tukar arah
  turn(dir, wid, o = {}) {
    const [cx, cy] = this.at(wid / 2);
    this.add({ kind: 'box', cx, cy, hw: wid / 2, hl: wid / 2, ang: 0, z: this.z, th: o.th, col: o.col });
    if (o.rails) {
      // pagar pada dua sisi luar selekoh
      const [fx, fy] = this.at(wid + 0.08), back = this.h;
      this.add({ kind: 'wall', cx: fx, cy: fy, hw: this.h === 0 ? wid / 2 + 0.16 : 0.08, hl: this.h === 0 ? 0.08 : wid / 2 + 0.16, ang: 0, z: this.z + 0.38, th: 0.9, col: 'rail' });
      const nh = this.h === 0 ? dir : 0; void nh; void back;
    }
    this.wp({ x: cx, y: cy, v: o.v ?? 2.4, r: 0.5 });
    const newH = this.h === 0 ? dir : 0;
    if (this.h === 0) { this.x = cx + HEAD[newH][0] * wid / 2; this.y = cy; }
    else { this.x = cx; this.y = cy + wid / 2; }
    if (o.rails && this.h !== 0) { /* */ }
    this.h = newH;
  }
  gap(len, dz = 0) { this.x += this.d[0] * len; this.y += this.d[1] * len; this.z += dz; }
  // papan bergerak merentasi jurang (ulang-alik sepanjang arah)
  shuttle(gapLen, board, wid, per, o = {}) {
    const [sx, sy] = this.at(-0.45);
    const [cx, cy] = this.at(gapLen / 2);
    const amp = (gapLen - board) / 2 + 0.05;
    const [dx, dy] = this.d;
    const p = this.add({ kind: 'box', cx, cy, hw: wid / 2, hl: board / 2, ang: ANG[this.h], z: this.z, th: 0.35, move: { ax: dx * amp, ay: dy * amp, per, ph: o.ph || 0 }, col: o.col || 'board' });
    this.x += dx * gapLen; this.y += dy * gapLen;
    const [ex, ey] = this.at(0.6);
    this.wps.push({ kind: 'ride', piece: p, from: [sx, sy], to: [ex, ey], dir: [dx, dy], amp, v: o.v ?? 2.2, r: 0.4 });
    return p;
  }
  // lengkok berpilin menurun (spiral), ikut arah jam
  spiral(R, deg, wid, drop, o = {}) {
    const n = Math.max(6, Math.round(deg / 22));
    const [rx, ry] = this.perp;
    const ccx = this.x + rx * R, ccy = this.y + ry * R;
    const a0 = Math.atan2(this.y - ccy, this.x - ccx);
    const step = ((deg * Math.PI) / 180) / n;
    const segLen = 2 * R * Math.sin(step / 2) + 0.12;
    for (let i = 0; i < n; i++) {
      const am = a0 - step * (i + 0.5);
      const cx = ccx + R * Math.cos(am), cy = ccy + R * Math.sin(am);
      const tang = am - Math.PI / 2; // arah gerakan (ikut jam)
      const ang = tang - Math.PI / 2;
      const z0 = this.z - (drop * i) / n, dzs = -drop / n;
      this.add({ kind: 'box', cx, cy, hw: wid / 2, hl: segLen / 2, ang, z: z0 + dzs / 2, dz: dzs, th: 0.5, col: o.col });
      const ox = ccx + (R + wid / 2 + 0.1) * Math.cos(am), oy = ccy + (R + wid / 2 + 0.1) * Math.sin(am);
      this.add({ kind: 'wall', cx: ox, cy: oy, hw: 0.08, hl: segLen / 2, ang, z: z0 + dzs / 2 + 0.38, dz: dzs, th: 0.9, col: 'rail' });
      const ae = a0 - step * (i + 1);
      this.wp({ x: ccx + R * Math.cos(ae), y: ccy + R * Math.sin(ae), v: o.v ?? 2.6, r: 0.55 });
      if (o.coins && i % 2) this.coins.push({ x: cx, y: cy, z: z0 + 0.45 });
    }
    this.add({ kind: 'deco', cx: ccx, cy: ccy, hw: 0.5, hl: 0.5, ang: 0, z: this.z + 1.2, th: drop + 4, col: 'pillar' });
    const af = a0 - step * n;
    this.x = ccx + R * Math.cos(af); this.y = ccy + R * Math.sin(af); this.z -= drop;
    // arah keluar: tangen pada sudut akhir (pilih paksi terdekat yang dibenarkan)
    const tx = Math.sin(af), ty = -Math.cos(af);
    this.h = Math.abs(tx) > Math.abs(ty) ? (tx > 0 ? 1 : -1) : 0;
  }
  // checkpoint di atas pad semasa (dipanggil selepas pad)
  check() {
    const [x, y] = this.at(-0.9);
    this.checks.push({ x, y, z: this.z });
    this.wps.push({ x, y, v: 2.5, r: 0.6, ck: this.checks.length - 1 });
  }
  finish(level) {
    return { pieces: this.pieces, wps: this.wps, coins: this.coins, stars: this.stars, checks: this.checks, start: level.start, goal: level.goal, theme: this.theme };
  }
}

// ---------------- autopilot (untuk ujian & demo) ----------------
// mengemudi badan melalui titik laluan; menunggu papan bergerak bila perlu
export function autopilot(b, w, wps, st) {
  const wp = wps[st.i];
  if (!wp) return { x: 0, y: 0 };
  let tx, ty, v = wp.v;
  if (wp.kind === 'ride') {
    const ps = pose(wp.piece, w.t);
    const startNear = Math.hypot(ps.x - wp.dir[0] * wp.amp - wp.from[0] - wp.dir[0] * 0.45, ps.y - wp.dir[1] * wp.amp - wp.from[1] - wp.dir[1] * 0.45) < 0.01;
    void startNear;
    // kedudukan papan di sepanjang paksi (-amp … +amp)
    const along = ((ps.x - wp.piece.cx) * wp.dir[0] + (ps.y - wp.piece.cy) * wp.dir[1]);
    const vel = ps.vx * wp.dir[0] + ps.vy * wp.dir[1];
    const onIt = b.ground?.p === wp.piece;
    if (!st.phase) st.phase = 'tunggu';
    if (st.phase === 'tunggu') {
      [tx, ty] = wp.from; v = 1.2;
      if (along < -wp.amp + 0.3 && vel < 0 && Math.hypot(b.x - wp.from[0], b.y - wp.from[1]) < 0.35) st.phase = 'naik';
    }
    if (st.phase === 'naik') { tx = ps.x; ty = ps.y; v = 2; if (onIt && Math.hypot(b.x - ps.x, b.y - ps.y) < 0.3) st.phase = 'tumpang'; if (!onIt && along > -wp.amp + 0.5) st.phase = 'tunggu'; }
    if (st.phase === 'tumpang') { tx = ps.x; ty = ps.y; v = 1; if (along > wp.amp - 0.12) st.phase = 'turun'; }
    if (st.phase === 'turun') { [tx, ty] = wp.to; v = 1.8; if (Math.hypot(b.x - tx, b.y - ty) < wp.r) { st.prev = [tx, ty]; st.i++; st.phase = null; } }
  } else if (wp.kind === 'dodge') {
    const ps = pose(wp.piece, w.t), off = ps.x - wp.piece.cx;
    if (!st.phase) st.phase = 'tunggu';
    if (st.phase === 'tunggu') { [tx, ty] = wp.from; v = 1.2; if (Math.abs(off) < 0.3 && off * ps.vx > 0 && Math.hypot(b.x - wp.from[0], b.y - wp.from[1]) < 0.35) st.phase = 'lari'; }
    if (st.phase === 'lari') { [tx, ty] = wp.to; v = wp.v; if (Math.hypot(b.x - tx, b.y - ty) < wp.r) { st.prev = [tx, ty]; st.i++; st.phase = null; } }
  } else {
    if (wp.piece) {
      const ps = pose(wp.piece, w.t), base = pose({ ...wp.piece, move: null }, 0);
      tx = wp.x + (ps.x - base.x); ty = wp.y + (ps.y - base.y);
    } else { tx = wp.x; ty = wp.y; }
    if (Math.hypot(b.x - tx, b.y - ty) < wp.r) { st.prev = [tx, ty]; st.i++; return autopilot(b, w, wps, st); }
    // ikut garis laluan (titik "lobak" di hadapan unjuran badan) supaya tidak memotong selekoh
    if (st.prev) {
      const [ax, ay] = st.prev, sx = tx - ax, sy = ty - ay, L2 = sx * sx + sy * sy;
      if (L2 > 0.04) {
        const u = clamp(((b.x - ax) * sx + (b.y - ay) * sy) / L2, 0, 1), L = Math.sqrt(L2);
        const cu = Math.min(1, u + 0.45 / L);
        tx = ax + sx * cu; ty = ay + sy * cu;
      }
    }
  }
  if (!b.onGround) return { x: 0, y: 0 }; // tiada brek di udara
  let dx = tx - b.x, dy = ty - b.y; const d = Math.hypot(dx, dy) || 1;
  const nxt = wps[st.i + 1];
  const want = wp.launch ? v : Math.min(v, Math.max(nxt?.v ?? 0.6, d * 2.5));
  const gvx = b.ground?.vx || 0, gvy = b.ground?.vy || 0;
  const ex = (dx / d) * want - b.vx, ey = (dy / d) * want - b.vy;
  const k = 0.9 / Math.max(1, b.cfg.A / 8);
  void gvx; void gvy;
  // kompensasi cerun
  const sx = (b.ground?.gx || 0) * b.cfg.S / b.cfg.A, sy = (b.ground?.gy || 0) * b.cfg.S / b.cfg.A;
  return { x: clamp(ex * k * 2 + sx, -1, 1), y: clamp(ey * k * 2 + sy, -1, 1) };
}

// simulasi tanpa paparan: mainkan level dengan autopilot
export function simulate(level, cfg, { maxT = 240, dt = 1 / 120 } = {}) {
  const w = new World(level.pieces);
  const b = makeBody(cfg, ...level.start);
  const st = { i: 0 };
  let falls = 0, ck = level.start.slice();
  let ckIdx = -1;
  for (let t = 0; t < maxT; t += dt) {
    w.update(dt, b);
    step(b, w, autopilot(b, w, level.wps, st), dt);
    for (const [k] of b.events.splice(0)) if (k === 'dead') {
      falls++; Object.assign(b, makeBody(cfg, ...ck)); b.events = [];
      st.i = Math.max(0, level.wps.findIndex((p) => p.ck === ckIdx) + 1); st.phase = null; st.prev = [ck[0], ck[1]];
      if (falls > 25) return { ok: false, falls, t, reason: 'jatuh' };
    }
    level.checks.forEach((c, i) => { if (i > ckIdx && Math.hypot(b.x - c.x, b.y - c.y) < 0.8 && Math.abs(b.z - c.z) < 1) { ckIdx = i; ck = [c.x, c.y, c.z]; } });
    if (Math.hypot(b.x - level.goal.x, b.y - level.goal.y) < 0.9 && Math.abs(b.z - level.goal.z) < 1) return { ok: true, falls, t };
  }
  return { ok: false, falls, t: maxT, reason: 'masa', wp: st.i, of: level.wps.length, pos: [b.x.toFixed(1), b.y.toFixed(1), b.z.toFixed(1)] };
}
