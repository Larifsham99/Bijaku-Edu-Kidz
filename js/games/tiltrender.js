// =====================================================================
//  PELUKIS PSEUDO-3D untuk permainan senget
//  Kamera perspektif condong (ikut sasaran dengan interpolasi licin),
//  kotak 3D bercahaya + kabus, bayang, zarah 3D, bola berputar, watak.
// =====================================================================
import { pose, toWorld, topAt } from './tiltworld.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hex = (c) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => `rgb(${(a[0] + (b[0] - a[0]) * t) | 0},${(a[1] + (b[1] - a[1]) * t) | 0},${(a[2] + (b[2] - a[2]) * t) | 0})`;
const shadeRGB = (c, k) => [clamp(c[0] * k, 0, 255), clamp(c[1] * k, 0, 255), clamp(c[2] * k, 0, 255)];

export const THEMES = {
  taman: { sky: ['#8fd8ff', '#e9fbff'], void: '#b9ecff', fog: '#d8f4ff', star: false },
  pulau: { sky: ['#ffb38a', '#ffe8c9'], void: '#ffd9b8', fog: '#ffe6cf', star: false },
  kota: { sky: ['#2b1d6b', '#6a4bd8'], void: '#4a35a8', fog: '#5b45b8', star: true },
  kayu: { sky: ['#9be3c4', '#f1fff6'], void: '#c7f2dd', fog: '#e0fbef', star: false },
  goyang: { sky: ['#7ac8ff', '#fdf3c4'], void: '#cfe7ff', fog: '#e6f2ff', star: false },
  ribut: { sky: ['#4b4f8f', '#a49ad8'], void: '#6e6aae', fog: '#8a84c4', star: true },
};
const MAT = {
  taman: ['#7ed957', '#b9824f'], pulau: ['#ffd166', '#c98a4b'], kota: ['#8ec5ff', '#5a4fcf'],
  kayu: ['#d9a066', '#8a5d36'], goyang: ['#9ad1ff', '#4a7fc0'], ribut: ['#c6c3ff', '#6a5fb8'],
  pad: ['#ffd8a8', '#b7774a'], beam: ['#e0a96d', '#8a5d36'], seesaw: ['#ffb4d0', '#c2487d'], bridge: ['#a5d8ff', '#3d7bd1'], board: ['#ffe066', '#c48a00'],
  rail: ['#ffffff', '#c9cfe0'], pusher: ['#ff6b6b', '#b52d36'], bumper: ['#ff5fa2', '#b8306f'], roof: ['#9775fa', '#5f3dc4'], pillar: ['#e6e0ff', '#a99be8'],
};

export class Renderer {
  constructor(canvas, theme) {
    this.cv = canvas; this.g = canvas.getContext('2d');
    this.th = THEMES[theme] || THEMES.taman;
    this.fogRGB = hex(this.th.fog);
    this.cam = { x: 0, y: 0, z: 0, init: false };
    this.B = 5.4; this.H = 6.4;
    this.trail = [];
    this.clouds = Array.from({ length: 9 }, (_, i) => ({ x: (i * 137) % 100, y: (i * 61) % 100, s: 0.6 + (i % 3) * 0.35 }));
    this.resize();
  }
  resize() {
    const r = this.cv.getBoundingClientRect();
    this.dpr = Math.min(1.75, window.devicePixelRatio || 1);
    this.W = r.width; this.Hc = r.height;
    this.cv.width = Math.round(this.W * this.dpr); this.cv.height = Math.round(this.Hc * this.dpr);
    this.F = Math.min(this.W, this.Hc) * 1.18;
  }
  follow(t, dt, falling) {
    const k = 1 - Math.exp(-dt * (falling ? 2.2 : 4.2));
    const c = this.cam;
    const tz = falling ? Math.max(t.z, c.z - 4) : t.z;
    if (!c.init) { Object.assign(c, { x: t.x, y: t.y, z: t.z, init: true }); return; }
    c.x += (t.x - c.x) * k; c.y += (t.y - c.y) * k; c.z += (tz - c.z) * k * 0.8;
    const f = Math.hypot(0, this.B, this.H);
    this.fv = [0, this.B / f, -this.H / f]; this.uv = [0, this.H / f, this.B / f];
  }
  proj(x, y, z) {
    const c = this.cam;
    const rx = x - c.x, ry = y - (c.y - this.B), rz = z - (c.z + this.H);
    const f = this.fv || [0, 0.64, -0.77], u = this.uv || [0, 0.77, 0.64];
    const d = ry * f[1] + rz * f[2];
    const yc = ry * u[1] + rz * u[2];
    return [this.W / 2 + (this.F * rx) / d, this.Hc * 0.56 - (this.F * yc) / d, d];
  }
  // ---------- latar ----------
  background(now) {
    const g = this.g, W = this.W, H = this.Hc, th = this.th;
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, th.sky[0]); gr.addColorStop(0.55, th.sky[1]); gr.addColorStop(1, th.void);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (th.star) { g.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 40; i++) { const x = ((i * 97.3 - this.cam.x * 4) % W + W) % W, y = ((i * 53.1 + this.cam.y * 3) % (H * 0.7) + H * 0.7) % (H * 0.7); g.globalAlpha = 0.4 + 0.4 * Math.sin(now / 600 + i); g.fillRect(x, y, 2, 2); } g.globalAlpha = 1; }
    // awan parallax
    g.fillStyle = th.star ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.75)';
    for (const c of this.clouds) {
      const x = ((c.x / 100) * (W + 260) - this.cam.x * 9 * c.s + now / (90 / c.s)) % (W + 260), y = ((c.y / 100) * H * 1.2 + this.cam.y * 6 * c.s) % (H * 1.2) - H * 0.1;
      const xx = ((x % (W + 260)) + W + 260) % (W + 260) - 130, s = 26 * c.s;
      g.beginPath(); g.arc(xx, y, s, 0, 7); g.arc(xx + s, y - s * 0.4, s * 1.2, 0, 7); g.arc(xx + s * 2.1, y, s * 0.9, 0, 7); g.fill();
    }
  }
  // ---------- dunia ----------
  frame(world, items, now) {
    const g = this.g;
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.background(now);
    const list = [];
    const c = this.cam;
    for (const p of world.pieces) {
      if (p.kind === 'roof') continue;
      const ps = pose(p, world.t);
      if (Math.abs(ps.x - c.x) > 16 || ps.y - c.y > 26 || ps.y - c.y < -9) continue;
      for (const ch of p._chunks || (p._chunks = chunks(p))) {
        const [wx, wy] = toWorld(p, ch.cx, ch.cy, ps);
        const d = this.proj(wx, wy, topAt(p, ch.cx, ch.cy, ps))[2];
        if (d < 0.6) continue;
        list.push({ d: d - (p.kind === 'wall' ? 0.02 : 0), draw: () => this.box(p, ps, ch, d) });
      }
    }
    for (const it of items) { const d = this.proj(it.x, it.y, it.z)[2]; if (d > 0.6) list.push({ d: d - (it.bias || 0), draw: () => it.draw(this, d) }); }
    list.sort((a, b) => b.d - a.d);
    for (const it of list) it.draw();
    // bumbung terowong (lutsinar) di atas segalanya
    for (const p of world.pieces) if (p.kind === 'roof') { const ps = pose(p, world.t); for (const ch of p._chunks || (p._chunks = chunks(p))) this.box(p, ps, ch, 10, 0.55); }
  }
  box(p, ps, ch, d, alpha = 1) {
    const g = this.g;
    const mat = MAT[p.col] || MAT.taman;
    const top = hex(mat[0]), side = hex(mat[1]);
    const fog = clamp((d - 11) / 16, 0, 0.85);
    const x0 = ch.cx - ch.hw, x1 = ch.cx + ch.hw, y0 = ch.cy - ch.hl, y1 = ch.cy + ch.hl;
    const th = p.th ?? 0.6;
    const C = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([lx, ly]) => { const [wx, wy] = toWorld(p, lx, ly, ps); const z = topAt(p, lx, ly, ps); return { t: this.proj(wx, wy, z), b: this.proj(wx, wy, z - th), wx, wy }; });
    g.globalAlpha = alpha;
    // sisi (hanya yang di sempadan kepingan & menghadap kamera)
    const edges = [[0, 1, ch.y0e, 0.72], [1, 2, ch.x1e, 0.85], [2, 3, ch.y1e, 0.6], [3, 0, ch.x0e, 0.85]];
    for (const [a, b, isEdge, k] of edges) {
      if (!isEdge) continue;
      const A = C[a], Bq = C[b];
      // arah normal keluar dalam skrin: gunakan tertib bucu (sisi menghadap jika bawah lebih rendah di skrin)
      const cross = (Bq.t[0] - A.t[0]) * (A.b[1] - A.t[1]) - (Bq.t[1] - A.t[1]) * (A.b[0] - A.t[0]);
      if (cross <= 0) continue;
      g.fillStyle = mix(shadeRGB(side, k), this.fogRGB, fog);
      g.beginPath(); g.moveTo(A.t[0], A.t[1]); g.lineTo(Bq.t[0], Bq.t[1]); g.lineTo(Bq.b[0], Bq.b[1]); g.lineTo(A.b[0], A.b[1]); g.closePath(); g.fill();
    }
    // permukaan atas (corak petak lembut)
    const alt = ((Math.round(ch.cx * 2) + Math.round(ch.cy * 2)) & 1) ? 1.0 : 0.94;
    g.fillStyle = mix(shadeRGB(top, alt), this.fogRGB, fog);
    g.beginPath(); C.forEach((q, i) => (i ? g.lineTo(q.t[0], q.t[1]) : g.moveTo(q.t[0], q.t[1]))); g.closePath(); g.fill();
    if (p.kind === 'bumper') { const [sx, sy] = this.proj(ps.x, ps.y, ps.z + 0.02); const r = (this.F * p.hw) / d; g.fillStyle = '#fff'; g.globalAlpha = 0.6 * alpha; g.beginPath(); g.ellipse(sx, sy, r * 0.5, r * 0.3, 0, 0, 7); g.fill(); }
    if (!ch.inner) { g.strokeStyle = `rgba(255,255,255,${0.35 * (1 - fog)})`; g.lineWidth = 1.2; g.stroke(); }
    g.globalAlpha = 1;
  }
  // ---------- objek ----------
  shadow(x, y, gz, z, r) {
    const [sx, sy, d] = this.proj(x, y, gz + 0.01);
    if (d < 0.6) return;
    const h = clamp((z - gz) / 3, 0, 1), rr = (this.F * r) / d * (1.1 - h * 0.5);
    this.g.fillStyle = `rgba(20,10,60,${0.28 * (1 - h)})`;
    this.g.beginPath(); this.g.ellipse(sx, sy, rr, rr * 0.55, 0, 0, 7); this.g.fill();
  }
  ball(b, ori, squash, color = '#ff5d8f') {
    const g = this.g;
    const [sx, sy, d] = this.proj(b.x, b.y, b.z + b.cfg.r);
    const r = (this.F * b.cfg.r) / d;
    // jejak gerakan (motion blur sederhana)
    const sp = Math.hypot(b.vx, b.vy);
    this.trail.push([sx, sy]); if (this.trail.length > 6) this.trail.shift();
    if (sp > 4) this.trail.forEach(([x, y], i) => { g.globalAlpha = (i / this.trail.length) * 0.18 * Math.min(1, (sp - 4) / 4); g.fillStyle = color; g.beginPath(); g.arc(x, y, r * 0.95, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    g.save(); g.translate(sx, sy); g.scale(1 + squash * 0.35, 1 - squash * 0.35);
    const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, color); gr.addColorStop(1, shadeCss(color, 0.55));
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
    // titik corak berputar (orientasi 3D sebenar)
    for (const [px, py, pz, c] of DOTS) {
      const vx = ori[0] * px + ori[1] * py + ori[2] * pz, vy = ori[3] * px + ori[4] * py + ori[5] * pz, vz = ori[6] * px + ori[7] * py + ori[8] * pz;
      // paksi skrin: x→kanan, z→atas, y→ke dalam (condong ikut kamera)
      const depth = -vy * 0.77 + vz * 0.64; if (depth < 0) continue;
      const ux = vx, uy = -(vz * 0.77 + vy * 0.64);
      g.globalAlpha = 0.25 + depth * 0.75; g.fillStyle = c;
      g.beginPath(); g.ellipse(ux * r * 0.78, uy * r * 0.78, r * 0.2 * (0.4 + depth * 0.6), r * 0.2, Math.atan2(uy, ux), 0, 7); g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(-r * 0.38, -r * 0.42, r * 0.22, r * 0.14, -0.6, 0, 7); g.fill();
    g.restore();
  }
  coin(x, y, z, now, d) {
    const [sx, sy] = this.proj(x, y, z + Math.sin(now / 300 + x) * 0.05);
    const r = (this.F * 0.17) / d, w = Math.abs(Math.cos(now / 260 + x + y)) * r;
    const g = this.g;
    g.fillStyle = '#e8a10b'; g.beginPath(); g.ellipse(sx, sy, Math.max(1.5, w), r, 0, 0, 7); g.fill();
    g.fillStyle = '#ffd43b'; g.beginPath(); g.ellipse(sx, sy, Math.max(1, w * 0.75), r * 0.78, 0, 0, 7); g.fill();
  }
  star(x, y, z, now, d) {
    const [sx, sy] = this.proj(x, y, z + 0.15 + Math.sin(now / 350 + x) * 0.08);
    const r = (this.F * 0.3) / d, g = this.g;
    const gl = g.createRadialGradient(sx, sy, 0, sx, sy, r * 2); gl.addColorStop(0, 'rgba(255,236,120,.7)'); gl.addColorStop(1, 'rgba(255,236,120,0)');
    g.fillStyle = gl; g.beginPath(); g.arc(sx, sy, r * 2, 0, 7); g.fill();
    g.save(); g.translate(sx, sy); g.rotate(Math.sin(now / 500) * 0.3);
    g.fillStyle = '#ffd23f'; g.strokeStyle = '#e08a00'; g.lineWidth = 2;
    g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke();
    g.restore();
  }
  flag(x, y, z, on, now, d) {
    const [bx, by] = this.proj(x, y, z), [tx, ty] = this.proj(x, y, z + 1.3);
    const g = this.g, w = (this.F * 0.5) / d;
    g.strokeStyle = '#6b4a2f'; g.lineWidth = Math.max(2, (this.F * 0.05) / d); g.beginPath(); g.moveTo(bx, by); g.lineTo(tx, ty); g.stroke();
    const wave = Math.sin(now / 180) * w * 0.12;
    g.fillStyle = on ? '#2fbf71' : '#adb5bd';
    g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + w * 0.5, ty + w * 0.1 + wave, tx + w, ty + w * 0.15); g.lineTo(tx, ty + w * 0.45); g.closePath(); g.fill();
  }
  gate(x, y, z, now, d) {
    const g = this.g, s = this.F / d;
    const [lx, ly] = this.proj(x - 1.1, y, z), [rx, ry] = this.proj(x + 1.1, y, z);
    const [, ty] = this.proj(x, y, z + 2);
    g.fillStyle = '#ffd43b';
    g.fillRect(lx - s * 0.12, ty, s * 0.24, ly - ty); g.fillRect(rx - s * 0.12, ty, s * 0.24, ry - ty);
    const bw = rx - lx, bh = s * 0.4;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#2b2350' : '#fff'; g.fillRect(lx + (bw / 8) * i, ty + (bh / 2) * j, bw / 8 + 0.5, bh / 2 + 0.5); }
    for (let i = 0; i < 5; i++) { const a = now / 400 + i * 1.3; g.fillStyle = ['#ff5d8f', '#ffd43b', '#5ff0ff', '#9b5cff', '#7dff9c'][i]; g.fillRect(lx + bw / 2 + Math.cos(a) * bw * 0.4, ty - s * 0.3 + Math.sin(a * 1.3) * s * 0.2, 4, 4); }
  }
  particles(list, dt) {
    const g = this.g;
    for (let i = list.length - 1; i >= 0; i--) {
      const q = list[i]; q.life -= dt;
      if (q.life <= 0) { list.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; q.vz -= (q.g ?? 6) * dt;
      const [sx, sy, d] = this.proj(q.x, q.y, q.z); if (d < 0.6) continue;
      const r = Math.max(1.2, (this.F * q.s) / d);
      g.globalAlpha = Math.min(1, q.life * 2); g.fillStyle = q.c;
      if (q.star) { g.save(); g.translate(sx, sy); g.rotate(q.life * 6); g.fillRect(-r, -r / 3, r * 2, r / 1.5); g.fillRect(-r / 3, -r, r / 1.5, r * 2); g.restore(); }
      else { g.beginPath(); g.arc(sx, sy, r, 0, 7); g.fill(); }
    }
    g.globalAlpha = 1;
  }
}
const DOTS = [[1, 0, 0, '#fff'], [-1, 0, 0, '#fff'], [0, 1, 0, '#ffd43b'], [0, -1, 0, '#ffd43b'], [0, 0, 1, '#5ff0ff'], [0, 0, -1, '#5ff0ff']];
function shadeCss(c, k) { const [r, g, b] = hex(c); return `rgb(${(r * k) | 0},${(g * k) | 0},${(b * k) | 0})`; }
// pecahkan kepingan kepada cebisan kecil untuk susunan kedalaman yang betul
function chunks(p) {
  const nx = Math.max(1, Math.ceil((p.hw * 2) / 1.3)), ny = Math.max(1, Math.ceil((p.hl * 2) / 1.3));
  const out = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const hw = p.hw / nx, hl = p.hl / ny;
    out.push({ cx: -p.hw + hw * (2 * i + 1), cy: -p.hl + hl * (2 * j + 1), hw, hl, x0e: i === 0, x1e: i === nx - 1, y0e: j === 0, y1e: j === ny - 1, inner: nx * ny > 1 });
  }
  return out;
}
// orientasi bola: putar matriks 3x3 mengikut gelekan (Rodrigues)
export function rollOri(m, vx, vy, dist, r) {
  if (dist < 1e-5) return m;
  const ang = dist / r, L = Math.hypot(vx, vy) || 1;
  const ax = -vy / L, ay = vx / L, az = 0; // paksi putaran mendatar, serenjang dengan gerakan
  const c = Math.cos(ang), s = Math.sin(ang), t = 1 - c;
  const R = [t * ax * ax + c, t * ax * ay - s * az, t * ax * az + s * ay, t * ax * ay + s * az, t * ay * ay + c, t * ay * az - s * ax, t * ax * az - s * ay, t * ay * az + s * ax, t * az * az + c];
  const o = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) o[i * 3 + j] = R[i * 3] * m[j] + R[i * 3 + 1] * m[3 + j] + R[i * 3 + 2] * m[6 + j];
  return o;
}
