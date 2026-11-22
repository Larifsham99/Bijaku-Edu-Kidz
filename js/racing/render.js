// =====================================================================
//  CILIK RACING — pemapar pseudo-3D / 2.5D (Canvas 2D)
//  Jalan diunjurkan segmen demi segmen (perspektif), dilukis dari jauh
//  ke dekat supaya bukit, terowong & objek bertindih dengan betul.
// =====================================================================
import { SEGL, ROAD_W, laneX } from './engine.js';
import { SPR, VARIANTS, spriteCanvas, itemCanvas, gateCanvas, archCanvas, hostCanvas, ball } from './sprites.js';
import { drawCarRear, shade, rr } from './cars.js';
import { hashStr } from '../rng.js';

const DEPTH = 0.84; // 1 / tan(fov/2)
const DRAW = 170; // bilangan segmen dilukis
const TAU = Math.PI * 2;

// ---------------- TREK ----------------
export function makeTrack(level) {
  const pieces = level.track.pieces;
  const flat = [];
  for (const p of pieces) for (let i = 0; i < p.n; i++) {
    const t = i / p.n;
    const ease = Math.min(1, Math.min(t, 1 - t) * 5); // lengkung masuk & keluar dengan lembut
    flat.push({ curve: p.k === 'c' ? p.c * ease : 0, y: p.k === 'h' ? p.h * (1 - Math.cos(TAU * t)) / 2 : 0, f: p.f || '' });
  }
  const P = flat.length;
  const seg = (i) => flat[((i % P) + P) % P];
  const yAt = (z) => { const i = Math.floor(z / SEGL), t = (z % SEGL) / SEGL; return seg(i).y + (seg(i + 1).y - seg(i).y) * t; };
  return { seg, yAt, P };
}

// warna dengan kabus (cache)
const fogCache = new Map();
function mix(a, b, t) {
  const k = a + b + ((t * 20) | 0);
  let v = fogCache.get(k);
  if (v) return v;
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  v = `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  if (fogCache.size > 4000) fogCache.clear();
  fogCache.set(k, v);
  return v;
}
function rgbHex(c) { const m = c.match(/\d+/g); return '#' + m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, '0')).join(''); }
const toHex = (c) => (typeof c === 'string' && c.startsWith('#') && c.length === 7 ? c : '#ffffff');

// ---------------- LATAR (langit, jauh, bukit) ----------------
function rand(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function buildSky(world, W, H, horizon) {
  const c = document.createElement('canvas'); c.width = W; c.height = world.float ? H : horizon + 4;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, horizon);
  gr.addColorStop(0, world.sky[0]); gr.addColorStop(1, world.sky[1]);
  g.fillStyle = gr; g.fillRect(0, 0, W, horizon + 4);
  if (world.float) {
    const g2 = g.createLinearGradient(0, horizon, 0, H); g2.addColorStop(0, world.sky[1]); g2.addColorStop(1, world.night ? '#0a0626' : shade(world.sky[0], 0.25));
    g.fillStyle = g2; g.fillRect(0, horizon, W, H - horizon);
  }
  const r = rand(hashStr(world.id));
  if (world.night) {
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`; g.beginPath(); g.arc(r() * W, r() * c.height, r() * 1.6 + 0.3, 0, TAU); g.fill(); }
  } else {
    const sx = W * 0.78, sy = horizon * 0.3;
    const sg = g.createRadialGradient(sx, sy, 4, sx, sy, horizon * 0.5);
    sg.addColorStop(0, 'rgba(255,255,230,.95)'); sg.addColorStop(0.15, 'rgba(255,250,200,.75)'); sg.addColorStop(1, 'rgba(255,250,200,0)');
    g.fillStyle = sg; g.fillRect(0, 0, W, horizon);
    g.fillStyle = world.sun; g.beginPath(); g.arc(sx, sy, Math.max(14, horizon * 0.07), 0, TAU); g.fill();
  }
  return c;
}
function cloudLayer(world, W, horizon) {
  const c = document.createElement('canvas'); c.width = W * 2; c.height = horizon;
  const g = c.getContext('2d');
  const r = rand(hashStr(world.id + 'awan'));
  if (world.night) return c;
  for (let i = 0; i < 7; i++) {
    const x = r() * W * 2, y = horizon * (0.12 + r() * 0.4), s = 16 + r() * 22;
    g.fillStyle = world.id === 'gula' ? 'rgba(255,214,236,.95)' : 'rgba(255,255,255,.92)';
    for (const [dx, dy, k] of [[0, 0, 1], [s * 1.1, -s * 0.4, 1.2], [s * 2.2, 0, 1], [s * 1.1, s * 0.2, 1.1]]) for (const off of [0, -W * 2, W * 2]) { g.beginPath(); g.arc(x + dx + off, y + dy, s * k, 0, TAU); g.fill(); }
  }
  return c;
}
function farLayer(world, W, h) {
  const LW = Math.max(900, W * 2);
  const c = document.createElement('canvas'); c.width = LW; c.height = h;
  const g = c.getContext('2d');
  const r = rand(hashStr(world.id + 'jauh'));
  const wrap = (fn) => { for (const off of [0, -LW, LW]) { g.save(); g.translate(off, 0); fn(); g.restore(); } };
  const mountains = (col, peaks, hmin, hmax, snow) => wrap(() => {
    g.fillStyle = col; g.beginPath(); g.moveTo(0, h);
    for (let i = 0; i <= peaks; i++) { const x = (i / peaks) * LW, y = h - (hmin + ((i * 7919) % 97) / 97 * (hmax - hmin)); g.lineTo(x - LW / peaks / 2, h - hmin * 0.6); g.lineTo(x, y); }
    g.lineTo(LW, h); g.fill();
    if (snow) { g.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i <= peaks; i++) { const x = (i / peaks) * LW, y = h - (hmin + ((i * 7919) % 97) / 97 * (hmax - hmin)); g.beginPath(); g.moveTo(x - 12, y + 14); g.lineTo(x, y); g.lineTo(x + 12, y + 14); g.fill(); } }
  });
  const hills = (col, n, amp, base) => wrap(() => { g.fillStyle = col; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= LW; x += 8) g.lineTo(x, h - base - Math.sin((x / LW) * TAU * n) * amp - Math.sin((x / LW) * TAU * n * 2.3 + 1) * amp * 0.4); g.lineTo(LW, h); g.fill(); });
  const f = world.far;
  try { drawFar(); } catch (e) { console.warn('latar', e); }
  return c;
  function drawFar() {
  if (f === 'sawah') { mountains('#a99ad6', 7, h * 0.45, h * 0.85, true); hills(world.hill[0], 5, h * 0.06, h * 0.18); }
  else if (f === 'buahan') { hills('#b4e39a', 4, h * 0.12, h * 0.4); wrap(() => { for (let i = 0; i < 18; i++) { const x = (i / 18) * LW + 20, y = h * 0.55 + Math.sin(i) * 10; g.fillStyle = '#8a5d36'; g.fillRect(x - 2, y, 4, 16); ball(g, x, y, 12, '#5fbf6a', 0.3); g.fillStyle = ['#e8412c', '#ffd23a', '#ff8c1a'][i % 3]; g.beginPath(); g.arc(x - 4, y - 2, 2.5, 0, TAU); g.arc(x + 4, y + 2, 2.5, 0, TAU); g.fill(); } }); }
  else if (f === 'hutan') {
    mountains('#5fae8a', 5, h * 0.5, h * 0.95, false);
    wrap(() => { g.fillStyle = '#e9fbff'; g.fillRect(LW * 0.3, h * 0.12, 16, h * 0.6); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(LW * 0.3 + 8, h * 0.72, 30, 8, 0, 0, TAU); g.fill(); });
    wrap(() => { for (let i = 0; i < 40; i++) ball(g, (i / 40) * LW, h * 0.72 + (i % 3) * 6, 22 + (i * 13) % 14, i % 2 ? '#2f8f55' : '#38a062', 0.2); });
  } else if (f === 'bandar') {
    wrap(() => { for (let i = 0; i < 22; i++) { const bw = 30 + r() * 34, bh = h * (0.3 + r() * 0.6), x = (i / 22) * LW; g.fillStyle = ['#c8b6ff', '#a5d8ff', '#ffc9de', '#b2f2bb', '#ffe8a3'][i % 5]; rr(g, x, h - bh, bw, bh, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; for (let y = h - bh + 8; y < h - 8; y += 14) for (let xx = x + 6; xx < x + bw - 6; xx += 10) g.fillRect(xx, y, 5, 6); } });
  } else if (f === 'gunungapi') {
    mountains('#c98a5b', 4, h * 0.4, h * 0.8, false);
    wrap(() => { for (const x of [LW * 0.25, LW * 0.7]) { g.fillStyle = '#9b5e3a'; g.beginPath(); g.moveTo(x - 90, h); g.lineTo(x - 18, h * 0.25); g.lineTo(x + 18, h * 0.25); g.lineTo(x + 90, h); g.fill(); g.fillStyle = '#ff7a3c'; g.beginPath(); g.moveTo(x - 18, h * 0.25); g.lineTo(x - 8, h * 0.45); g.lineTo(x, h * 0.3); g.lineTo(x + 8, h * 0.42); g.lineTo(x + 18, h * 0.25); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + k * 8, h * 0.2 - k * 14, 10 + k * 3, 0, TAU); g.fill(); } } });
    hills(world.hill[0], 6, h * 0.05, h * 0.12);
  } else if (f === 'lautan') {
    wrap(() => { const sg = g.createLinearGradient(0, h * 0.55, 0, h); sg.addColorStop(0, '#5fd0f0'); sg.addColorStop(1, '#1fa2d0'); g.fillStyle = sg; g.fillRect(0, h * 0.6, LW, h * 0.4); g.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 30; i++) g.fillRect((i / 30) * LW, h * 0.7 + (i % 4) * 8, 18, 2); });
    wrap(() => { for (const x of [LW * 0.2, LW * 0.62]) { g.fillStyle = '#f6e0a4'; g.beginPath(); g.ellipse(x, h * 0.62, 70, 14, 0, Math.PI, 0); g.fill(); g.fillStyle = '#3cb878'; g.beginPath(); g.ellipse(x, h * 0.58, 46, 16, 0, Math.PI, 0); g.fill(); g.strokeStyle = '#8a5d36'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 10, h * 0.6); g.quadraticCurveTo(x + 18, h * 0.4, x + 12, h * 0.3); g.stroke(); g.fillStyle = '#2f9e6a'; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + 12 + Math.cos(k * 1.3) * 14, h * 0.3 + Math.sin(k * 1.3) * 5, 16, 4, k * 1.3, 0, TAU); g.fill(); } } });
  } else if (f === 'angkasa') {
    wrap(() => { ball(g, LW * 0.3, h * 0.4, h * 0.3, '#ff9f43', 0.4); g.strokeStyle = 'rgba(255,230,140,.8)'; g.lineWidth = 6; g.beginPath(); g.ellipse(LW * 0.3, h * 0.4, h * 0.5, h * 0.1, -0.3, 0, TAU); g.stroke(); ball(g, LW * 0.75, h * 0.3, h * 0.13, '#d0d4e8', 0.5); g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.arc(LW * 0.75 - 6, h * 0.28, 5, 0, TAU); g.arc(LW * 0.75 + 8, h * 0.34, 4, 0, TAU); g.fill(); });
  } else if (f === 'coklat') {
    hills('#8a5a44', 3, h * 0.18, h * 0.42);
    wrap(() => { g.fillStyle = '#fff4e0'; for (let i = 0; i < 26; i++) { const x = (i / 26) * LW; g.beginPath(); g.ellipse(x, h * 0.42 + Math.sin((x / LW) * TAU * 3) * h * 0.18 * -1 + h * 0.06, 14, 8, 0, 0, TAU); g.fill(); } });
    hills('#a8714f', 5, h * 0.06, h * 0.16);
  } else if (f === 'binaan') {
    wrap(() => { for (let i = 0; i < 10; i++) { const x = (i / 10) * LW, bh = h * (0.35 + r() * 0.45); g.strokeStyle = '#b8a07a'; g.lineWidth = 3; g.strokeRect(x, h - bh, 50, bh); for (let y = h - bh; y < h; y += 14) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 50, y); g.stroke(); } } g.strokeStyle = '#f2a922'; g.lineWidth = 5; for (const x of [LW * 0.2, LW * 0.65]) { g.beginPath(); g.moveTo(x, h); g.lineTo(x, h * 0.08); g.lineTo(x + 110, h * 0.08); g.moveTo(x - 30, h * 0.08); g.lineTo(x, h * 0.08); g.stroke(); } });
    hills(world.hill[0], 4, h * 0.04, h * 0.1);
  } else if (f === 'pulau') {
    wrap(() => { const cx = LW * 0.5, cy = h * 1.05; ['#ff5f5f', '#ff9f43', '#ffd23a', '#3bd16f', '#3a9bff', '#9d6bff'].forEach((col, i) => { g.strokeStyle = col; g.globalAlpha = 0.55; g.lineWidth = 9; g.beginPath(); g.arc(cx, cy, Math.max(2, h * 0.9 * (1 - i * 0.08)), Math.PI, 0); g.stroke(); }); g.globalAlpha = 1; });
    wrap(() => { for (const [x, y, s] of [[LW * 0.15, h * 0.4, 1], [LW * 0.42, h * 0.25, 0.7], [LW * 0.8, h * 0.45, 1.1]]) { g.fillStyle = '#c99a6b'; g.beginPath(); g.moveTo(x - 60 * s, y); g.lineTo(x + 60 * s, y); g.lineTo(x, y + 50 * s); g.fill(); g.fillStyle = '#7ad497'; g.beginPath(); g.ellipse(x, y, 62 * s, 12 * s, 0, 0, TAU); g.fill(); ball(g, x - 20 * s, y - 14 * s, 14 * s, '#45c47f'); g.fillStyle = '#e9fbff'; g.fillRect(x + 20 * s, y, 5 * s, 40 * s); } });
  }
  }
}

// ---------------- PEMAPAR ----------------
export function createRenderer(canvas, { world, level, car, custom, driverImg }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const track = makeTrack(level);
  const L = level.lanes;
  const laneW = (2 * ROAD_W) / L;
  const CAR_W = Math.min(1150, laneW * 0.95);
  let W = 0, H = 0, dpr = 1, horizon = 0, u = 0, camH = 1000, playerZ = 840;
  let sky = null, clouds = null, far = null, near = null;
  let skyX = 0, t = 0;
  const parts = [];
  const proj = new Array(DRAW + 2).fill(0).map(() => ({ x1: 0, y1: 0, w1: 0, s1: 0, x2: 0, y2: 0, w2: 0, s2: 0, vis: false, i: 0, z: 0 }));
  const decor = new Map();
  const sideList = world.side.flatMap(([n, w]) => Array(Math.max(1, Math.round(w * 2))).fill(n));
  const seed = hashStr(level.id);
  const slabC = rgbHex(shade(world.road[0], -0.4));
  const faceC = rgbHex(shade(world.hill[1], -0.1));

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(200, r.width); H = Math.max(200, r.height);
    const px = W * H;
    dpr = Math.min(self.devicePixelRatio || 1, 2, Math.sqrt(2400000 / px));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const portrait = H > W;
    horizon = Math.round(H * (portrait ? 0.34 : 0.36));
    const bottom = H - (portrait ? Math.max(120, H * 0.17) : Math.max(70, H * 0.17));
    u = bottom - horizon;
    const RW = Math.min(W * 0.98, portrait ? W * 0.98 : H * 1.45);
    camH = (2 * ROAD_W * u) / RW;
    playerZ = camH * DEPTH;
    sky = buildSky(world, W, H, horizon);
    clouds = cloudLayer(world, W, horizon);
    far = farLayer(world, W, Math.round(H * (portrait ? 0.16 : 0.22)));
    near = null;
  }

  function decorAt(i) {
    let d = decor.get(i);
    if (d) return d;
    d = [];
    const s = track.seg(i);
    const h = hashStr(seed + ':' + i);
    if (s.f === 'br') { if (i % 2 === 0) d.push({ rail: true }); }
    else if (s.f !== 'tn' && i > 4) {
      if (h % 100 < 34) {
        const name = sideList[(h >>> 8) % sideList.length];
        const side = (h >>> 3) & 1 ? 1 : -1;
        const vn = VARIANTS[name] ? ((h >>> 12) % (VARIANTS[name] + 1)) : 0;
        d.push({ name, v: vn, x: side * ROAD_W * (1.4 + ((h >>> 16) % 100) / 100 * 1.6) });
        if (h % 100 < 10) { const n2 = sideList[(h >>> 20) % sideList.length]; d.push({ name: n2, v: 0, x: -side * ROAD_W * (1.5 + ((h >>> 24) % 100) / 100 * 2.2) }); }
      }
    }
    if (decor.size > 3000) decor.clear();
    decor.set(i, d);
    return d;
  }

  function spark(x, y, n, colors, kind = 'spark', spd = 220) {
    for (let k = 0; k < n && parts.length < 160; k++) {
      const a = Math.random() * TAU, v = spd * (0.4 + Math.random());
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (kind === 'conf' ? 260 : 80), life: 0, max: kind === 'conf' ? 1.6 : 0.7 + Math.random() * 0.4, c: colors[k % colors.length], r: kind === 'conf' ? 4 + Math.random() * 4 : 3 + Math.random() * 4, kind, rot: Math.random() * 6 });
    }
  }

  // titik kereta pada skrin (untuk kesan zarah)
  const carScreen = { x: 0, y: 0, w: 0 };

  function draw(race, dt) {
    t += dt;
    const g = ctx;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const camZ = race.pos - playerZ;
    const baseI = Math.floor(camZ / SEGL);
    const basePct = (camZ - baseI * SEGL) / SEGL;
    const carX = laneX(race.laneF, L);
    const camX = carX * 0.8;
    const camY = track.yAt(race.pos) + camH;
    const baseSeg = track.seg(baseI);
    const speedPct = race.speed / (race.base * 1.6);
    skyX += baseSeg.curve * speedPct * dt * 60;

    // langit & latar
    g.drawImage(sky, 0, 0, W, sky.height);
    const cOff = (((skyX * 0.6 + t * 6) % (W * 2)) + W * 2) % (W * 2);
    g.drawImage(clouds, -cOff, 0); g.drawImage(clouds, -cOff + W * 2, 0);
    const fOff = (((skyX * 2.2) % far.width) + far.width) % far.width;
    const fy = horizon - far.height + 2 + Math.min(18, Math.max(-18, (track.yAt(race.pos)) * -0.004));
    g.drawImage(far, -fOff, fy); g.drawImage(far, -fOff + far.width, fy);
    if (!world.float) { g.fillStyle = mix(toHex(world.grass[0]), toHex(world.fog), 0.55); g.fillRect(0, horizon, W, H - horizon); }

    // ---- unjuran segmen (dekat ke jauh) ----
    let x = 0, dx = -(baseSeg.curve * basePct);
    let maxy = H;
    const n0 = DRAW;
    for (let n = 0; n < n0; n++) {
      const i = baseI + n;
      const s = track.seg(i), sNext = track.seg(i + 1);
      const z1 = i * SEGL - camZ, z2 = (i + 1) * SEGL - camZ;
      const p = proj[n];
      p.i = i; p.vis = false;
      if (z1 <= 1) { x += dx; dx += s.curve; continue; }
      const sc1 = DEPTH / z1, sc2 = DEPTH / z2;
      p.s1 = sc1; p.s2 = sc2;
      p.x1 = W / 2 + sc1 * (-camX - x) * u; p.y1 = horizon + sc1 * (camY - s.y) * u; p.w1 = sc1 * ROAD_W * u;
      p.x2 = W / 2 + sc2 * (-camX - x - dx) * u; p.y2 = horizon + sc2 * (camY - sNext.y) * u; p.w2 = sc2 * ROAD_W * u;
      p.cx = x; p.cdx = dx;
      x += dx; dx += s.curve;
      p.fog = Math.min(1, Math.pow(n / n0, 1.6));
      p.vis = !(p.y2 >= maxy && p.y1 >= maxy) || true;
      if (p.y2 < maxy) maxy = Math.max(p.y2, 0);
    }

    // objek perlumbaan dikumpul mengikut segmen
    const bySeg = new Map();
    for (const o of race.objs) {
      if (o.gone && !(o.taken || o.burst)) continue;
      if (o.type === 'paint') continue;
      const i = Math.floor(o.z / SEGL);
      if (i < baseI || i >= baseI + n0) continue;
      let a = bySeg.get(i); if (!a) bySeg.set(i, a = []); a.push(o);
    }
    const paints = race.objs.filter((o) => o.type === 'paint' && !o.done);
    const carSegN = Math.floor(race.pos / SEGL) - baseI;

    // ---- lukis dari jauh ke dekat ----
    for (let n = n0 - 1; n >= 0; n--) {
      const p = proj[n];
      if (!p.s1) continue;
      const i = p.i;
      if (i * SEGL - camZ <= 1) continue;
      const s = track.seg(i);
      drawSegment(g, p, s, i, paints);
      // hiasan tepi jalan
      for (const d of decorAt(i)) {
        if (d.rail) { for (const side of [-1, 1]) drawRail(g, p, side); continue; }
        const sp = spriteCanvas(d.name, d.v);
        drawWorldSprite(g, sp, p, d.x, 0, p.fog);
      }
      if (s.f === 'tn' && i % 8 === 0) drawTunnelLamp(g, p);
      // objek perlumbaan
      const objs = bySeg.get(i);
      if (objs) { objs.sort((a, b) => b.z - a.z); for (const o of objs) drawObj(g, o, p, race); }
      if (n === carSegN) drawCar(g, race, dt);
    }
    if (carSegN < 0 || carSegN >= n0) drawCar(g, race, dt);

    // garis laju ketika turbo
    if (race.boostT > 0) {
      g.save(); g.globalAlpha = Math.min(1, race.boostT) * 0.6; g.strokeStyle = '#fff'; g.lineCap = 'round';
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * TAU + (t * 3 % 1) * 0.2, r0 = Math.max(W, H) * (0.3 + ((k * 37 + Math.floor(t * 20)) % 10) / 30), len = 40 + ((k * 13) % 5) * 20;
        g.lineWidth = 2 + (k % 3);
        g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * r0, horizon + Math.sin(a) * r0 * 0.6); g.lineTo(W / 2 + Math.cos(a) * (r0 + len), horizon + Math.sin(a) * (r0 + len) * 0.6); g.stroke();
      }
      g.restore();
    }
    // zarah
    for (let k = parts.length - 1; k >= 0; k--) {
      const q = parts[k];
      q.life += dt; if (q.life >= q.max) { parts.splice(k, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += (q.kind === 'puff' ? -30 : 520) * dt; q.vx *= 0.98;
      const a = 1 - q.life / q.max;
      g.globalAlpha = a;
      if (q.kind === 'puff') { g.fillStyle = q.c; g.beginPath(); g.arc(q.x, q.y, q.r * (1 + q.life * 3), 0, TAU); g.fill(); }
      else if (q.kind === 'conf') { g.save(); g.translate(q.x, q.y); g.rotate(q.rot + q.life * 8); g.fillStyle = q.c; g.fillRect(-q.r, -q.r * 0.5, q.r * 2, q.r); g.restore(); }
      else { g.fillStyle = q.c; star(g, q.x, q.y, q.r * 1.6, q.r * 0.7); g.fill(); }
      g.globalAlpha = 1;
    }
  }

  function star(g, x, y, r1, r2) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? r2 : r1; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); }

  function quad(g, x1, y1, w1, x2, y2, w2, c) {
    g.fillStyle = c; g.beginPath(); g.moveTo(x1 - w1, y1 + 0.5); g.lineTo(x2 - w2, y2 - 0.5); g.lineTo(x2 + w2, y2 - 0.5); g.lineTo(x1 + w1, y1 + 0.5); g.closePath(); g.fill();
  }

  function drawSegment(g, p, s, i, paints) {
    const fog = p.fog, fc = toHex(world.fog);
    const alt = Math.floor(i / 3) % 2;
    const tunnel = s.f === 'tn', bridge = s.f === 'br';
    if (p.y2 > p.y1 + 0.5 && !tunnel) return; // segmen di belakang puncak bukit
    // tanah / air / terapung
    if (!world.float) {
      let gc = alt ? world.grass[0] : world.grass[1];
      if (bridge || (world.water && i % 40 > 30)) gc = alt ? '#4cc3e6' : '#3fb6dc';
      if (tunnel) gc = alt ? '#4a3f63' : '#433859';
      g.fillStyle = mix(toHex(gc), fc, fog); g.fillRect(0, p.y2 - 0.5, W, p.y1 - p.y2 + 1);
    } else {
      // papak jalan terapung (ketebalan 3D)
      const th = 520;
      g.fillStyle = mix(slabC, fc, fog);
      g.beginPath(); g.moveTo(p.x1 - p.w1 * 1.12, p.y1); g.lineTo(p.x1 - p.w1 * 1.08, p.y1 + p.s1 * th * u); g.lineTo(p.x1 + p.w1 * 1.08, p.y1 + p.s1 * th * u); g.lineTo(p.x1 + p.w1 * 1.12, p.y1); g.lineTo(p.x2 + p.w2 * 1.12, p.y2); g.lineTo(p.x2 - p.w2 * 1.12, p.y2); g.fill();
    }
    // bahu jalan & bebenang
    const edge = world.edge ? toHex(world.edge) : '#ffffff';
    if (!world.float) quad(g, p.x1, p.y1, p.w1 * 1.32, p.x2, p.y2, p.w2 * 1.32, mix(edge, fc, fog));
    let rc = alt ? world.rumble[0] : world.rumble[1];
    if (world.rainbow) rc = ['#ff5f5f', '#ff9f43', '#ffd23a', '#3bd16f', '#3a9bff', '#9d6bff'][((Math.floor(i / 2) % 6) + 6) % 6];
    quad(g, p.x1, p.y1, p.w1 * 1.12, p.x2, p.y2, p.w2 * 1.12, mix(toHex(rc), fc, fog));
    // jalan
    quad(g, p.x1, p.y1, p.w1, p.x2, p.y2, p.w2, mix(toHex(alt ? world.road[0] : world.road[1]), fc, fog));
    // lorong berwarna (cabaran warna)
    for (const pt of paints) {
      const z = i * SEGL;
      if (z >= pt.z0 && z <= pt.z) {
        g.globalAlpha = 0.6;
        for (let ln = 0; ln < L; ln++) {
          const a = -1 + (ln / L) * 2, b = -1 + ((ln + 1) / L) * 2;
          const col = pt.task.opts[ln].hex;
          g.fillStyle = col; g.beginPath();
          g.moveTo(p.x1 + a * p.w1 + p.w1 * 0.04, p.y1); g.lineTo(p.x2 + a * p.w2 + p.w2 * 0.04, p.y2); g.lineTo(p.x2 + b * p.w2 - p.w2 * 0.04, p.y2); g.lineTo(p.x1 + b * p.w1 - p.w1 * 0.04, p.y1); g.fill();
        }
        g.globalAlpha = 1;
      }
    }
    // garis lorong
    if (alt) {
      const lc = mix(toHex(world.lane), fc, fog);
      for (let ln = 1; ln < L; ln++) { const k = -1 + (ln / L) * 2; quad(g, p.x1 + k * p.w1, p.y1, p.w1 * 0.025, p.x2 + k * p.w2, p.y2, p.w2 * 0.025, lc); }
    }
    // garisan mula
    if (i === 3 || i === 4) { const sq = 8; for (let k = 0; k < sq; k++) { const a = -1 + (k / sq) * 2, b = -1 + ((k + 1) / sq) * 2; g.fillStyle = (k + i) % 2 ? '#26262b' : '#ffffff'; g.beginPath(); g.moveTo(p.x1 + a * p.w1, p.y1); g.lineTo(p.x2 + a * p.w2, p.y2); g.lineTo(p.x2 + b * p.w2, p.y2); g.lineTo(p.x1 + b * p.w1, p.y1); g.fill(); } }
    // dinding & bumbung terowong
    if (tunnel) {
      const wh = 2600;
      const wc = mix(alt ? '#6a5a8e' : '#5e4f80', fc, fog), cc = mix('#3a2f55', fc, fog);
      for (const sd of [-1, 1]) {
        g.fillStyle = wc; g.beginPath();
        g.moveTo(p.x1 + sd * p.w1 * 1.32, p.y1); g.lineTo(p.x1 + sd * p.w1 * 1.32, p.y1 - p.s1 * wh * u);
        g.lineTo(p.x2 + sd * p.w2 * 1.32, p.y2 - p.s2 * wh * u); g.lineTo(p.x2 + sd * p.w2 * 1.32, p.y2); g.fill();
      }
      g.fillStyle = cc; g.beginPath();
      g.moveTo(p.x1 - p.w1 * 1.32, p.y1 - p.s1 * wh * u); g.lineTo(p.x1 + p.w1 * 1.32, p.y1 - p.s1 * wh * u);
      g.lineTo(p.x2 + p.w2 * 1.32, p.y2 - p.s2 * wh * u); g.lineTo(p.x2 - p.w2 * 1.32, p.y2 - p.s2 * wh * u); g.fill();
      // muka gunung di pintu masuk terowong
      if (track.seg(i - 1).f !== 'tn') {
        const top = p.y1 - p.s1 * wh * u, hgt = p.s1 * wh * u * 2.6, wd = p.w1 * 7;
        g.fillStyle = mix(faceC, fc, fog);
        g.beginPath();
        g.moveTo(p.x1 - wd, p.y1); g.quadraticCurveTo(p.x1 - wd * 0.7, p.y1 - hgt * 1.1, p.x1, p.y1 - hgt); g.quadraticCurveTo(p.x1 + wd * 0.7, p.y1 - hgt * 1.1, p.x1 + wd, p.y1);
        g.lineTo(p.x1 + p.w1 * 1.32, p.y1); g.lineTo(p.x1 + p.w1 * 1.32, top + p.w1 * 0.4); g.quadraticCurveTo(p.x1, top - p.w1 * 0.5, p.x1 - p.w1 * 1.32, top + p.w1 * 0.4); g.lineTo(p.x1 - p.w1 * 1.32, p.y1);
        g.closePath(); g.fill();
        g.fillStyle = mix(toHex(world.grass[0]), fc, fog);
        g.beginPath(); g.moveTo(p.x1 - wd * 0.62, p.y1 - hgt * 0.72); g.quadraticCurveTo(p.x1, p.y1 - hgt * 1.22, p.x1 + wd * 0.62, p.y1 - hgt * 0.72); g.quadraticCurveTo(p.x1, p.y1 - hgt * 0.98, p.x1 - wd * 0.62, p.y1 - hgt * 0.72); g.fill();
        g.strokeStyle = mix('#ffd23a', fc, fog); g.lineWidth = Math.max(1, p.s1 * 120 * u);
        g.beginPath(); g.moveTo(p.x1 - p.w1 * 1.32, p.y1); g.lineTo(p.x1 - p.w1 * 1.32, top + p.w1 * 0.4); g.quadraticCurveTo(p.x1, top - p.w1 * 0.5, p.x1 + p.w1 * 1.32, top + p.w1 * 0.4); g.lineTo(p.x1 + p.w1 * 1.32, p.y1); g.stroke();
      }
    }
  }
  function drawTunnelLamp(g, p) {
    const wh = 2400;
    g.fillStyle = 'rgba(255,230,140,.95)';
    for (const sd of [-1, 1]) { const x = p.x1 + sd * p.w1 * 1.28, y = p.y1 - p.s1 * wh * u; g.beginPath(); g.ellipse(x, y, Math.max(2, p.s1 * 160 * u), Math.max(1, p.s1 * 60 * u), 0, 0, TAU); g.fill(); }
  }
  function drawRail(g, p, side) {
    const x = p.x1 + side * p.w1 * 1.16, hgt = p.s1 * 420 * u, wd = Math.max(1, p.s1 * 90 * u);
    g.fillStyle = mix('#8a5d36', toHex(world.fog), p.fog); g.fillRect(x - wd / 2, p.y1 - hgt, wd, hgt);
    g.fillStyle = mix('#c98a4b', toHex(world.fog), p.fog); g.fillRect(x - wd * 2, p.y1 - hgt, wd * 4, Math.max(1, wd * 0.6));
  }
  // lukis sprite dunia (berdiri di tanah, pada kedudukan x dunia)
  function drawWorldSprite(g, sp, p, wx, lift = 0, fog = 0, wOverride = 0) {
    const sc = p.s1;
    const hh = sp.wh * sc * u;
    const ww = wOverride ? wOverride * sc * u : hh * sp.aspect;
    if (hh < 2) return;
    const sx = p.x1 + wx * sc * u;
    const sy = p.y1 - lift * sc * u;
    if (sx + ww / 2 < 0 || sx - ww / 2 > W) return;
    if (fog > 0.5) g.globalAlpha = Math.max(0, 1 - (fog - 0.5) * 1.6);
    g.drawImage(sp.img, sx - ww / 2, sy - hh, ww, hh);
    g.globalAlpha = 1;
  }

  function objScreen(o, p) {
    // interpolasi dalam segmen
    const f = (o.z % SEGL) / SEGL;
    const sc = p.s1 + (p.s2 - p.s1) * f;
    const xc = p.x1 + (p.x2 - p.x1) * f, yc = p.y1 + (p.y2 - p.y1) * f;
    return { sc, xc, yc };
  }

  function drawObj(g, o, p, race) {
    const { sc, xc, yc } = objScreen(o, p);
    if (sc <= 0) return;
    const accent = world.accent;
    if (o.type === 'gate') {
      const sp = gateCanvas(o.opt, accent);
      const ww = laneW * 0.94 * sc * u, hh = ww / sp.aspect * 1.05;
      const cx = xc + laneX(o.lane, L) * sc * u;
      let k = 1, a = 1, dxs = 0;
      if (o.burst) { const e = race.t - o.burst; k = 1 + e * 2.2; a = Math.max(0, 1 - e * 2.4); if (a <= 0) return; }
      if (o.wrong) { const e = race.t - o.wrong; if (e < 0.6) dxs = Math.sin(e * 40) * 6 * (1 - e / 0.6); }
      if (o.hint && !o.done && o.good) {
        const pulse = 0.5 + 0.5 * Math.sin(race.t * 8);
        const gr = g.createRadialGradient(cx, yc - hh * 0.75, 1, cx, yc - hh * 0.75, ww * 0.8);
        gr.addColorStop(0, `rgba(255,236,120,${0.55 + pulse * 0.35})`); gr.addColorStop(1, 'rgba(255,236,120,0)');
        g.fillStyle = gr; g.fillRect(cx - ww, yc - hh * 1.6, ww * 2, hh * 1.6);
        // anak panah melantun
        const ay = yc - hh * 1.12 - Math.abs(Math.sin(race.t * 6)) * hh * 0.12, as = ww * 0.22;
        g.fillStyle = '#ffd23a'; g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, as * 0.12);
        g.beginPath(); g.moveTo(cx - as, ay - as); g.lineTo(cx + as, ay - as); g.lineTo(cx, ay + as * 0.4); g.closePath(); g.fill(); g.stroke();
      }
      g.globalAlpha = a * (p.fog > 0.5 ? Math.max(0, 1 - (p.fog - 0.5) * 1.6) : 1);
      g.drawImage(sp.img, cx - (ww * k) / 2 + dxs, yc - hh * k, ww * k, hh * k);
      g.globalAlpha = 1;
      o.sx = cx; o.sy = yc - hh * 0.75; o.sw = ww;
    } else if (o.type === 'item') {
      const sp = itemCanvas(o.spec);
      const size = 900 * sc * u;
      const cx = xc + laneX(o.lane, L) * sc * u;
      let cy = yc - (380 + Math.sin(race.t * 4 + o.id) * 90) * sc * u;
      let a = 1, k = 1;
      if (o.taken) { const e = race.t - o.taken; cy -= e * 600; a = Math.max(0, 1 - e * 3); k = 1 + e; if (a <= 0) return; }
      else if (o.done) return;
      // bayang
      g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(cx, yc, size * 0.35, size * 0.09, 0, 0, TAU); g.fill();
      if (o.hint && o.good && !o.done) { g.fillStyle = `rgba(255,236,120,${0.45 + 0.3 * Math.sin(race.t * 8)})`; g.beginPath(); g.arc(cx, cy - size / 2, size * 0.7, 0, TAU); g.fill(); }
      g.globalAlpha = a;
      g.drawImage(sp.img, cx - (size * k) / 2, cy - size * k, size * k, size * k);
      g.globalAlpha = 1;
      o.sx = cx; o.sy = cy - size / 2; o.sw = size;
    } else if (o.type === 'obs') {
      const sp = spriteCanvas(world.obs, 0);
      let hh = sp.wh * sc * u, ww = hh * sp.aspect;
      const maxW = laneW * 0.8 * sc * u;
      if (ww > maxW) { hh *= maxW / ww; ww = maxW; }
      const cx = xc + laneX(o.lane, L) * sc * u;
      if (o.hitAt) {
        const e = race.t - o.hitAt;
        const a = Math.max(0, 1 - e * 1.5); if (a <= 0) return;
        g.save(); g.globalAlpha = a; g.translate(cx + e * 300 * (o.lane < L / 2 ? -1 : 1), yc - e * 200); g.rotate(e * 6); g.drawImage(sp.img, -ww / 2, -hh, ww, hh); g.restore();
        return;
      }
      g.drawImage(sp.img, cx - ww / 2, yc - hh, ww, hh);
    } else if (o.type === 'finish' || o.type === 'pit') {
      const sp = archCanvas(o.type, world.accent);
      const ww = ROAD_W * 2.5 * sc * u, hh = ww / sp.aspect;
      g.drawImage(sp.img, xc - ww / 2, yc - hh, ww, hh);
    } else if (o.type === 'host') {
      const sp = hostCanvas(o.task.opts ? world.host : world.host);
      drawWorldSprite(g, sp, { s1: sc, x1: xc, y1: yc }, o.side * ROAD_W * 1.45, 0, 0);
    }
  }

  function drawCar(g, race, dt) {
    const sp = 1 / camH;
    const cw = CAR_W * sp * u;
    const carX = laneX(race.laneF, L), camX = carX * 0.8;
    const cx = W / 2 + (carX - camX) * sp * u;
    const groundY = horizon + u;
    const bounce = race.state === 'run' ? Math.sin(t * 22) * 1.2 * Math.min(1, race.speed / race.base) : 0;
    const hop = race.bumpT > 0 ? -Math.abs(Math.sin(race.bumpT * 9)) * cw * 0.08 : 0;
    const tilt = (race.lane - race.laneF) * 0.09 + (race.bumpT > 0 ? Math.sin(race.bumpT * 20) * 0.05 : 0);
    const k = cw / 200;
    g.save();
    g.translate(cx, groundY + bounce + hop);
    g.rotate(tilt);
    g.scale(k, k);
    g.translate(-100, -150);
    drawCarRear(g, car, { custom, phase: (race.pos / 260) % 1, driver: driverImg, brake: race.bumpT > 0 || race.state === 'pit' ? 1 : 0, glowT: t });
    g.restore();
    carScreen.x = cx; carScreen.y = groundY - cw * 0.35; carScreen.w = cw;
    // debu roda & api ekzos ketika turbo
    if (race.state === 'run' && race.speed > race.base * 0.4 && Math.random() < 0.5) {
      const dc = world.float ? 'rgba(255,255,255,.5)' : 'rgba(255,245,225,.55)';
      parts.length < 160 && parts.push({ x: cx + (Math.random() < 0.5 ? -1 : 1) * cw * 0.42, y: groundY - 4, vx: (Math.random() - 0.5) * 40, vy: 20 + Math.random() * 30, life: 0, max: 0.5, c: dc, r: cw * 0.03, kind: 'puff' });
    }
    if (race.boostT > 0) {
      const fl = (0.6 + Math.random() * 0.4) * cw * 0.12;
      g.fillStyle = '#ffb02e'; g.beginPath(); g.ellipse(cx - cw * 0.31, groundY - cw * 0.06 + bounce, fl * 0.5, fl, 0, 0, TAU); g.fill();
      g.fillStyle = '#fff3a0'; g.beginPath(); g.ellipse(cx - cw * 0.31, groundY - cw * 0.06 + bounce, fl * 0.25, fl * 0.55, 0, 0, TAU); g.fill();
    }
  }

  // kesan peristiwa
  function fx(e) {
    if (e.t === 'collect' && e.obj) spark(e.obj.sx ?? carScreen.x, e.obj.sy ?? carScreen.y, e.good ? 14 : 6, e.good ? ['#ffd23a', '#fff', '#ff5f7a'] : ['#c9c3d9']);
    if (e.t === 'correct') spark(e.obj?.sx ?? carScreen.x, e.obj?.sy ?? carScreen.y - 40, 26, ['#ffd23a', '#fff2a8', '#3bd16f', '#4dabf7', '#ff5f7a']);
    if (e.t === 'bump') { spark(carScreen.x, carScreen.y - carScreen.w * 0.3, 10, ['#ffd23a', '#fff'], 'spark', 160); }
    if (e.t === 'finish') { for (let k = 0; k < 4; k++) spark(W * (0.2 + k * 0.2), H * 0.35, 30, ['#ff5f5f', '#ffd23a', '#3bd16f', '#4dabf7', '#9d6bff', '#ff8fc8'], 'conf', 380); }
    if (e.t === 'boost') spark(carScreen.x, carScreen.y + carScreen.w * 0.2, 8, ['#ffb02e', '#fff3a0'], 'spark', 120);
  }
  function celebrate() { for (let k = 0; k < 3; k++) spark(W * (0.25 + k * 0.25), H * 0.3, 26, ['#ff5f5f', '#ffd23a', '#3bd16f', '#4dabf7', '#9d6bff'], 'conf', 360); }

  resize();
  return { draw, resize, fx, celebrate, get size() { return { W, H }; } };
}

// pemandangan kecil sesebuah dunia (kad peta & latar)
export function worldScene(world, W, H, { dpr = Math.min(2, self.devicePixelRatio || 1) } = {}) {
  const c = document.createElement('canvas');
  c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
  const g = c.getContext('2d'); g.scale(dpr, dpr);
  const hz = Math.round(H * 0.5);
  g.drawImage(buildSky(world, W, H, hz), 0, 0, W, world.float ? H : hz + 4);
  g.drawImage(cloudLayer(world, W, hz), 0, 0);
  const far = farLayer(world, W, Math.round(H * 0.3));
  g.drawImage(far, 0, hz - far.height + 2);
  if (!world.float) { g.fillStyle = world.grass[0]; g.fillRect(0, hz, W, H - hz); }
  // jalan berperspektif
  const cx = W * 0.5;
  const road = (w0, w1, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(cx - w0, hz); g.lineTo(cx + w0, hz); g.lineTo(cx + w1, H); g.lineTo(cx - w1, H); g.fill(); };
  if (world.float) road(W * 0.035, W * 0.3, rgbHex(shade(world.road[0], -0.4)));
  else road(W * 0.04, W * 0.42, world.edge);
  road(W * 0.03, W * 0.34, world.rumble[1]);
  road(W * 0.026, W * 0.3, world.road[0]);
  g.strokeStyle = world.lane; g.lineWidth = 2; g.setLineDash([8, 8]); g.beginPath(); g.moveTo(cx, hz); g.lineTo(cx, H); g.stroke(); g.setLineDash([]);
  const names = world.side.map(([n]) => n);
  const place = [[0.14, 0.95, 0.5], [0.86, 0.9, 0.42], [0.3, 0.68, 0.2], [0.72, 0.66, 0.18]];
  place.forEach(([px, py, sh], i) => { const sp = spriteCanvas(names[i % names.length], 0); const hh = H * sh * 1.1, ww = hh * sp.aspect; g.drawImage(sp.img, W * px - ww / 2, H * py - hh, ww, hh); });
  return c;
}
