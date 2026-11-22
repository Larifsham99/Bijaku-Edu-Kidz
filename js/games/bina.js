// =====================================================================
//  BINA DUNIA — bina binaan blok 3D ikut pelan (kemahiran ruang & visual)
//  Pilih warna, pilih tingkat, tekan petak untuk letak blok. Putar paparan.
//  Peraturan sokongan: blok di atas perlu blok di bawah atau di sebelahnya.
//  Bab 1: Ikut Pelan (pelan setiap tingkat) · Bab 2: Lihat 3D · Bab 3: Arkitek Cilik
// =====================================================================
import { h, clear } from '../ui.js';
import { icon } from '../icons.js';
import { speak } from '../audio.js';
import { bsfx } from './blocksfx.js';

export const COLORS = {
  merah: ['#ff5d5d', 'merah'], biru: ['#3d8bff', 'biru'], kuning: ['#ffd43b', 'kuning'], hijau: ['#2fbf71', 'hijau'], putih: ['#f1f3f5', 'putih'],
  kayu: ['#c68a4c', 'kayu'], batu: ['#9aa0a6', 'batu'], oren: ['#ff922b', 'oren'], ungu: ['#9b5cff', 'ungu'], kaca: ['#a5d8ff', 'kaca'], daun: ['#37a84a', 'daun'], hitam: ['#3b3f45', 'hitam'],
};
const TINGKAT = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam'];

// ---------------- model ----------------
function M(n, N, build) { const b = []; const add = (x, y, z, c) => b.push([x, y, z, c]); const box = (x0, y0, z0, w, d, hh, c) => { for (let z = z0; z < z0 + hh; z++) for (let y = y0; y < y0 + d; y++) for (let x = x0; x < x0 + w; x++) add(x, y, z, c); }; const ring = (x0, y0, z0, w, d, c) => { for (let y = y0; y < y0 + d; y++) for (let x = x0; x < x0 + w; x++) if (x === x0 || y === y0 || x === x0 + w - 1 || y === y0 + d - 1) add(x, y, z0, c); }; build(add, box, ring); return { n, N, blocks: b }; }
export const MODELS = [
  // Bab 1 — Ikut Pelan (4×4)
  M('Jalan Batu', 4, (a, box) => box(0, 1, 0, 3, 1, 1, 'batu')),
  M('Huruf L', 4, (a, box) => { box(0, 0, 0, 1, 2, 1, 'biru'); a(0, 2, 0, 'kuning'); a(1, 2, 0, 'biru'); }),
  M('Pagar Kayu', 4, (a, box) => { box(0, 1, 0, 4, 1, 1, 'kayu'); a(0, 1, 1, 'kayu'); a(3, 1, 1, 'kayu'); }),
  M('Bunga Merah', 4, (a) => { a(1, 1, 0, 'hijau'); a(0, 1, 0, 'daun'); a(2, 1, 0, 'daun'); a(1, 1, 1, 'hijau'); a(1, 1, 2, 'merah'); }),
  M('Menara Batu', 4, (a, box) => { box(1, 1, 0, 1, 1, 3, 'batu'); a(1, 1, 3, 'merah'); }),
  M('Meja', 4, (a, box) => { a(0, 1, 0, 'kayu'); a(2, 1, 0, 'kayu'); box(0, 1, 1, 3, 1, 1, 'kayu'); }),
  M('Kerusi', 4, (a) => { a(1, 1, 0, 'kayu'); a(1, 2, 0, 'kayu'); a(1, 1, 1, 'merah'); a(1, 2, 1, 'merah'); a(1, 2, 2, 'merah'); a(1, 2, 3, 'merah'); }),
  M('Pokok', 4, (a, box) => { box(1, 1, 0, 1, 1, 2, 'kayu'); [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]].forEach(([x, y]) => a(x, y, 2, 'daun')); a(1, 1, 3, 'daun'); }),
  M('Kereta', 4, (a, box) => { a(0, 1, 0, 'hitam'); a(2, 1, 0, 'hitam'); box(0, 1, 1, 3, 1, 1, 'merah'); a(1, 1, 2, 'kaca'); }),
  M('Roket', 4, (a, box) => { box(1, 1, 0, 1, 1, 3, 'putih'); a(1, 1, 3, 'merah'); a(0, 1, 0, 'oren'); a(2, 1, 0, 'oren'); }),
  // Bab 2 — Lihat 3D (5×5)
  M('Rumah Kecil', 5, (a, box) => { box(1, 1, 0, 2, 2, 1, 'putih'); box(1, 1, 1, 2, 2, 1, 'merah'); }),
  M('Piramid', 5, (a, box) => { box(1, 1, 0, 3, 3, 1, 'kuning'); a(2, 2, 1, 'oren'); }),
  M('Lampu Isyarat', 5, (a, box) => { box(2, 2, 0, 1, 1, 2, 'hitam'); a(2, 2, 2, 'hijau'); a(2, 2, 3, 'kuning'); a(2, 2, 4, 'merah'); }),
  M('Jambatan', 5, (a, box) => { box(0, 2, 0, 1, 1, 2, 'batu'); box(4, 2, 0, 1, 1, 2, 'batu'); box(0, 2, 2, 5, 1, 1, 'kayu'); }),
  M('Kek Hari Jadi', 5, (a, box) => { box(1, 1, 0, 3, 3, 1, 'kuning'); a(2, 2, 1, 'merah'); a(2, 2, 2, 'putih'); }),
  M('Robot', 5, (a, box) => { a(1, 2, 0, 'batu'); a(3, 2, 0, 'batu'); box(1, 2, 1, 3, 1, 2, 'biru'); a(2, 2, 3, 'putih'); }),
  M('Surau Kecil', 5, (a, box) => { box(1, 1, 0, 2, 2, 1, 'putih'); box(1, 1, 1, 2, 2, 1, 'hijau'); box(3, 1, 0, 1, 1, 3, 'putih'); a(3, 1, 3, 'kuning'); }),
  M('Kapal', 5, (a, box) => { box(0, 2, 0, 5, 1, 1, 'kayu'); box(2, 2, 1, 1, 1, 3, 'kayu'); a(2, 1, 2, 'putih'); a(2, 1, 3, 'putih'); }),
  M('Menara Jam', 5, (a, box) => { box(1, 1, 0, 3, 3, 1, 'batu'); box(2, 2, 1, 1, 1, 3, 'batu'); a(2, 2, 4, 'merah'); }),
  M('Rumah Dua Tingkat', 5, (a, box) => { box(1, 1, 0, 3, 2, 1, 'putih'); box(1, 1, 1, 3, 2, 1, 'kuning'); box(1, 1, 2, 3, 2, 1, 'merah'); }),
  // Bab 3 — Arkitek Cilik (6×6)
  M('Rumah Kampung', 6, (a, box) => { [[1, 1], [3, 1], [1, 2], [3, 2]].forEach(([x, y]) => a(x, y, 0, 'kayu')); box(1, 1, 1, 3, 2, 1, 'kayu'); box(1, 1, 2, 3, 2, 1, 'putih'); box(1, 1, 3, 3, 2, 1, 'merah'); }),
  M('Istana Kecil', 6, (a, box) => { [[1, 1], [4, 1], [1, 4], [4, 4]].forEach(([x, y]) => { box(x, y, 0, 1, 1, 2, 'batu'); a(x, y, 2, 'merah'); }); a(2, 1, 0, 'kayu'); a(3, 1, 0, 'kayu'); }),
  M('Kereta Api', 6, (a, box) => { box(0, 2, 0, 6, 1, 1, 'hitam'); box(0, 2, 1, 2, 1, 1, 'merah'); box(2, 2, 1, 2, 1, 1, 'biru'); box(4, 2, 1, 2, 1, 1, 'kuning'); a(4, 2, 2, 'kuning'); a(5, 2, 2, 'hitam'); }),
  M('Pokok Besar', 6, (a, box) => { box(2, 2, 0, 1, 1, 3, 'kayu'); box(1, 1, 3, 3, 3, 1, 'daun'); a(2, 2, 4, 'daun'); a(1, 1, 4, 'merah'); a(3, 3, 4, 'merah'); }),
  M('Roket Besar', 6, (a, box) => { box(2, 2, 0, 1, 1, 3, 'putih'); a(2, 2, 3, 'kaca'); a(2, 2, 4, 'putih'); a(2, 2, 5, 'merah'); [[1, 2], [3, 2], [2, 1], [2, 3]].forEach(([x, y]) => a(x, y, 0, 'merah')); }),
  M('Piramid Tangga', 6, (a, box) => { box(1, 1, 0, 4, 4, 1, 'kuning'); box(2, 2, 1, 2, 2, 1, 'oren'); }),
  M('Robot Besar', 6, (a, box) => { box(1, 2, 0, 1, 1, 2, 'batu'); box(3, 2, 0, 1, 1, 2, 'batu'); box(1, 2, 2, 3, 1, 2, 'biru'); a(0, 2, 3, 'batu'); a(4, 2, 3, 'batu'); a(2, 2, 4, 'putih'); }),
  M('Taman Bunga', 6, (a, box) => { [[1, 1, 'merah'], [3, 2, 'kuning'], [4, 4, 'ungu']].forEach(([x, y, c]) => { a(x, y, 0, 'hijau'); a(x, y, 1, c); }); a(0, 4, 0, 'kayu'); a(1, 4, 0, 'kayu'); box(4, 1, 0, 1, 1, 2, 'kayu'); [[4, 1], [3, 1], [5, 1], [4, 0], [4, 2]].forEach(([x, y]) => a(x, y, 2, 'daun')); }),
  M('Kapal Layar Besar', 6, (a, box) => { box(0, 2, 0, 6, 2, 1, 'kayu'); box(2, 2, 1, 1, 1, 3, 'kayu'); a(2, 1, 2, 'putih'); a(2, 1, 3, 'putih'); a(3, 2, 2, 'putih'); a(3, 2, 3, 'putih'); a(2, 2, 4, 'merah'); }),
  M('Istana Mawar', 6, (a, box, ring) => { ring(1, 1, 0, 4, 4, 'putih'); [[1, 1], [4, 1], [1, 4], [4, 4]].forEach(([x, y]) => { a(x, y, 1, 'ungu'); a(x, y, 2, 'kuning'); }); }),
];

// boleh dibina ikut peraturan sokongan?
export const supported = (set, x, y, z) => z === 0 || set.has(`${x},${y},${z - 1}`) || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has(`${x + dx},${y + dy},${z}`));
export function buildable(blocks) {
  const left = blocks.map((b) => b.slice()), set = new Set();
  let progress = true;
  while (left.length && progress) {
    progress = false;
    for (let i = left.length - 1; i >= 0; i--) { const [x, y, z] = left[i]; if (supported(set, x, y, z)) { set.add(`${x},${y},${z}`); left.splice(i, 1); progress = true; } }
  }
  return !left.length;
}

// ---------------- pelukis isometrik (boleh putar sudut bebas) ----------------
function shadeHex(hex, k) { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
function makeIso(canvas) {
  const g = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const api = {
    g, size() { const r = canvas.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); },
    // unit: lebar petak; cx, cy: pusat; ang: sudut putaran (radian)
    view(N, ang, Hmax) { const unit = Math.min(W / (N * 1.75), H / (N * 1.05 + Hmax * 0.95 + 0.8)); return { N, ang, u: unit, a: unit * 0.866, b: unit * 0.5, hz: unit * 0.95, cx: W * (W > 300 ? 0.45 : 0.5), cy: H * 0.5 + Hmax * unit * 0.36 - N * unit * 0.12 }; },
    proj(v, x, y, z) { const c = v.N / 2; const dx = x - c, dy = y - c; const cs = Math.cos(v.ang), sn = Math.sin(v.ang); const rx = cs * dx - sn * dy, ry = sn * dx + cs * dy; return [v.cx + (rx - ry) * v.a, v.cy + (rx + ry) * v.b - z * v.hz, rx + ry]; },
    unproj(v, sx, sy, z) { const u = (sx - v.cx) / v.a, w = (sy - v.cy + z * v.hz) / v.b; const rx = (u + w) / 2, ry = (w - u) / 2; const cs = Math.cos(-v.ang), sn = Math.sin(-v.ang); return [cs * rx - sn * ry + v.N / 2, sn * rx + cs * ry + v.N / 2]; },
    clear(bg) { g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); if (bg) { g.fillStyle = bg; g.fillRect(0, 0, W, H); } },
    poly(pts, fill, stroke, lw = 1) { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } },
    island(v) {
      const N = v.N, P = (x, y, z) => api.proj(v, x, y, z);
      const top = [P(0, 0, 0), P(N, 0, 0), P(N, N, 0), P(0, N, 0)];
      const depth = v.u * 0.55;
      // sisi pulau (dua sisi yang menghadap)
      const corners = [[0, 0], [N, 0], [N, N], [0, N]];
      for (let i = 0; i < 4; i++) {
        const [x1, y1] = corners[i], [x2, y2] = corners[(i + 1) % 4];
        const nx = (y2 - y1), ny = -(x2 - x1);
        const cs = Math.cos(v.ang), sn = Math.sin(v.ang); const rnx = cs * nx - sn * ny, rny = sn * nx + cs * ny;
        if (rnx + rny <= 0) continue;
        const a1 = P(x1, y1, 0), a2 = P(x2, y2, 0);
        api.poly([a1, a2, [a2[0], a2[1] + depth], [a1[0], a1[1] + depth]], i % 2 ? '#8a5d36' : '#a66f3f', 'rgba(0,0,0,.2)');
        api.poly([a1, a2, [a2[0], a2[1] + depth * 0.25], [a1[0], a1[1] + depth * 0.25]], '#4fb34a');
      }
      api.poly(top, '#7bd860', 'rgba(0,0,0,.15)', 1.5);
    },
    grid(v, z, color = 'rgba(255,255,255,.55)', fill = null) {
      const N = v.N;
      if (fill) api.poly([api.proj(v, 0, 0, z), api.proj(v, N, 0, z), api.proj(v, N, N, z), api.proj(v, 0, N, z)], fill);
      g.strokeStyle = color; g.lineWidth = 1.2; g.beginPath();
      for (let i = 0; i <= N; i++) { const a1 = api.proj(v, i, 0, z), a2 = api.proj(v, i, N, z), b1 = api.proj(v, 0, i, z), b2 = api.proj(v, N, i, z); g.moveTo(a1[0], a1[1]); g.lineTo(a2[0], a2[1]); g.moveTo(b1[0], b1[1]); g.lineTo(b2[0], b2[1]); }
      g.stroke();
    },
    cell(v, x, y, z, fill, stroke) { api.poly([api.proj(v, x, y, z), api.proj(v, x + 1, y, z), api.proj(v, x + 1, y + 1, z), api.proj(v, x, y + 1, z)], fill, stroke, 2); },
    cube(v, x, y, z, col, { alpha = 1, lift = 0, outline = null, ghost = false } = {}) {
      const hex = COLORS[col]?.[0] || col;
      const P = (xx, yy, zz) => api.proj(v, xx, yy, zz + lift);
      g.globalAlpha = alpha * (col === 'kaca' ? 0.72 : 1);
      const faces = [[[x, y], [x + 1, y]], [[x + 1, y], [x + 1, y + 1]], [[x + 1, y + 1], [x, y + 1]], [[x, y + 1], [x, y]]];
      const cs = Math.cos(v.ang), sn = Math.sin(v.ang);
      faces.forEach(([[x1, y1], [x2, y2]]) => {
        const nx = (y2 - y1), ny = -(x2 - x1); const rnx = cs * nx - sn * ny, rny = sn * nx + cs * ny;
        if (rnx + rny <= 0.001) return;
        const light = rnx > rny ? 0.78 : 0.62;
        api.poly([P(x1, y1, z), P(x2, y2, z), P(x2, y2, z + 1), P(x1, y1, z + 1)], ghost ? null : shadeHex(hex, light), ghost ? hex : 'rgba(0,0,0,.28)', ghost ? 2 : 1);
      });
      const top = [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)];
      api.poly(top, ghost ? null : shadeHex(hex, 1.06), ghost ? hex : 'rgba(0,0,0,.25)', ghost ? 2 : 1);
      if (!ghost) {
        // tekstur ringkas
        const c0 = P(x + 0.5, y + 0.5, z + 1);
        if (col === 'kayu') { g.strokeStyle = 'rgba(120,70,30,.45)'; g.lineWidth = 1.5; const p1 = P(x + 0.2, y + 0.35, z + 1), p2 = P(x + 0.8, y + 0.35, z + 1), p3 = P(x + 0.2, y + 0.7, z + 1), p4 = P(x + 0.8, y + 0.7, z + 1); g.beginPath(); g.moveTo(...p1.slice(0, 2)); g.lineTo(...p2.slice(0, 2)); g.moveTo(...p3.slice(0, 2)); g.lineTo(...p4.slice(0, 2)); g.stroke(); }
        if (col === 'daun' || col === 'batu') { g.fillStyle = col === 'daun' ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.14)'; [[0.3, 0.3], [0.7, 0.45], [0.45, 0.72]].forEach(([a, b]) => { const q = P(x + a, y + b, z + 1); g.beginPath(); g.arc(q[0], q[1], v.u * 0.06, 0, 7); g.fill(); }); }
        if (col === 'kaca') { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2; const p1 = P(x + 0.25, y + 0.2, z + 1), p2 = P(x + 0.2, y + 0.55, z + 1); g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke(); }
        g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); const e1 = top[0], e2 = top[1]; g.moveTo(e1[0], e1[1]); g.lineTo(e2[0], e2[1]); g.lineTo(c0[0], c0[1]); g.closePath(); g.fill();
      }
      if (outline) api.poly(top, null, outline, 3);
      g.globalAlpha = 1;
    },
    // lukis senarai blok dengan susunan kedalaman yang betul
    scene(v, blocks, opt = () => ({})) {
      const list = blocks.map((b) => { const d = api.proj(v, b[0] + 0.5, b[1] + 0.5, 0)[2]; return { b, d }; }).sort((p, q) => p.d - q.d || p.b[2] - q.b[2]);
      list.forEach(({ b }) => api.cube(v, b[0], b[1], b[2], b[3], opt(b)));
    },
  };
  return api;
}

export default {
  celebrate() { bsfx.celebrate(); },
  play(ctx) {
    const { n, stage, later } = ctx;
    const model = MODELS[n - 1];
    const ch = ctx.ch;
    const N = model.N;
    const Hmax = Math.max(...model.blocks.map((b) => b[2])) + 1;
    const target = new Map(model.blocks.map(([x, y, z, c]) => [`${x},${y},${z}`, c]));
    const used = [...new Set(model.blocks.map((b) => b[3]))];
    const decoys = Object.keys(COLORS).filter((c) => !used.includes(c));
    const palette = [...used, ...decoys.slice(0, ch === 0 ? 1 : 2).sort(() => 0.5 - ((n * 7) % 10) / 10)].slice(0, 7);
    ctx.rounds(1); ctx.round(0);

    const built = new Map();
    const history = [];
    let layer = 0, color = used[0], tool = 'letak', ang = Math.PI * 0.0, angTarget = 0, checks = 0, showGhost = false, won = false, celebrateT0 = 0;
    const flash = new Map();

    // ---------- DOM ----------
    const tCv = h('canvas', { class: 'bd-target' });
    const plans = h('div', { class: 'bd-plans' });
    const bCv = h('canvas', { class: 'bd-build', 'aria-label': 'Kawasan binaan' });
    const countEl = h('b', {}, `0/${model.blocks.length}`);
    const layerEl = h('b', {}, '1');
    const palEl = h('div', { class: 'bd-pal' });
    const toolEl = h('div', { class: 'bd-tools' });
    stage.append(h('div', { class: 'bd-wrap' },
      h('div', { class: 'bd-card' }, h('div', { class: 'bd-card-h' }, h('small', {}, ch === 0 ? 'Pelan' : ch === 1 ? 'Lihat 3D' : 'Cabaran Arkitek'), h('b', {}, model.n), h('span', { class: 'bd-count' }, countEl, ' blok')), h('div', { class: 'bd-card-b' }, tCv, ch === 0 ? plans : null)),
      h('div', { class: 'bd-main' }, bCv,
        h('div', { class: 'bd-layer' },
          h('button', { class: 'bd-lbtn', type: 'button', 'aria-label': 'Tingkat naik', onclick: () => setLayer(layer + 1) }, icon('back')),
          h('span', {}, h('small', {}, 'Tingkat'), layerEl),
          h('button', { class: 'bd-lbtn down', type: 'button', 'aria-label': 'Tingkat turun', onclick: () => setLayer(layer - 1) }, icon('back'))),
        h('button', { class: 'bd-rot', type: 'button', 'aria-label': 'Putar paparan', onclick: () => { angTarget += Math.PI / 2; bsfx.rotate(); } }, icon('replay'))),
      palEl, toolEl));
    const tIso = makeIso(tCv), bIso = makeIso(bCv);
    const ro = new ResizeObserver(() => { tIso.size(); bIso.size(); }); ro.observe(tCv); ro.observe(bCv);

    // pelan setiap tingkat (Bab 1)
    if (ch === 0) {
      for (let z = 0; z < Hmax; z++) {
        const grid = h('div', { class: 'bd-plan-g', style: `--n:${N}` });
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = target.get(`${x},${y},${z}`); grid.appendChild(h('i', { style: c ? `background:${COLORS[c][0]}` : '' })); }
        plans.appendChild(h('div', { class: 'bd-plan', 'data-z': z, onclick: () => setLayer(z) }, h('small', {}, `Tingkat ${z + 1}`), grid));
      }
    }
    function renderPal() {
      clear(palEl);
      palette.forEach((c) => palEl.appendChild(h('button', { class: `bd-sw ${c === color && tool === 'letak' ? 'on' : ''}`, type: 'button', style: `--c:${COLORS[c][0]}`, 'aria-label': `Blok ${COLORS[c][1]}`, onclick: () => { color = c; tool = 'letak'; bsfx.place(1); speak(COLORS[c][1]); renderPal(); renderTools(); } }, h('span', { class: 'bd-cube' }), h('small', {}, COLORS[c][1]))));
    }
    function renderTools() {
      clear(toolEl);
      toolEl.append(
        h('button', { class: `bd-tool ${tool === 'padam' ? 'on' : ''}`, type: 'button', onclick: () => { tool = tool === 'padam' ? 'letak' : 'padam'; bsfx.remove(); renderPal(); renderTools(); } }, icon('eraser'), 'Padam'),
        h('button', { class: 'bd-tool', type: 'button', onclick: undo }, icon('replay'), 'Undur'),
        h('button', { class: 'bd-tool done', type: 'button', onclick: check }, icon('check'), 'Siap!'));
    }
    renderPal(); renderTools();

    function setLayer(z) {
      const nz = Math.max(0, Math.min(Hmax - 1 + (ch === 2 ? 1 : 0), z));
      if (nz === layer) { bsfx.bump(); return; }
      bsfx.layer(nz > layer); layer = nz; layerEl.textContent = layer + 1;
      plans.querySelectorAll('.bd-plan').forEach((p) => p.classList.toggle('on', +p.dataset.z === layer));
      speak(`Tingkat ${TINGKAT[layer]}`);
    }
    plans.querySelector('.bd-plan')?.classList.add('on');
    const keyOf = (x, y, z) => `${x},${y},${z}`;
    const setOf = () => new Set(built.keys());
    function updateCount() { countEl.textContent = `${built.size}/${model.blocks.length}`; }
    function tapCell(x, y) {
      if (won) return;
      const k = keyOf(x, y, layer);
      if (tool === 'padam') {
        if (!built.has(k)) { bsfx.bump(); return; }
        if (built.has(keyOf(x, y, layer + 1))) { bsfx.bump(); ctx.say('Buang blok di atas dahulu, ya.', 'galakan'); return; }
        history.push(['del', k, built.get(k)]); built.delete(k); bsfx.remove(); pops.push({ k, t0: performance.now(), out: true });
      } else {
        if (built.get(k) === color) { bsfx.bump(); return; }
        if (!built.has(k) && !supported(setOf(), x, y, layer)) { bsfx.wrongBlock(); ctx.say('Blok perlu ada sokongan, di bawah atau di sebelahnya.', 'galakan'); flash.set(k, performance.now()); return; }
        history.push(built.has(k) ? ['set', k, built.get(k)] : ['add', k]);
        built.set(k, color); bsfx.place(layer); pops.push({ k, t0: performance.now() });
      }
      updateCount();
    }
    function undo() {
      const hh = history.pop(); if (!hh) { bsfx.bump(); return; }
      if (hh[0] === 'add') built.delete(hh[1]); else built.set(hh[1], hh[2]);
      bsfx.remove(); updateCount();
    }
    function check() {
      if (won) return;
      const wrong = [], missing = [];
      built.forEach((c, k) => { if (target.get(k) !== c) wrong.push(k); });
      target.forEach((c, k) => { if (built.get(k) !== c) missing.push(k); });
      if (!wrong.length && !missing.length) { win(); return; }
      checks++; ctx.miss();
      const now = performance.now();
      wrong.forEach((k) => flash.set(k, now));
      showGhost = checks >= 2 || ch === 0;
      ctx.say(wrong.length && missing.length ? `Hampir! Ada ${wrong.length} blok yang salah, dan ${missing.length} blok belum diletak.` : wrong.length ? `Hampir! Ada ${wrong.length} blok di tempat atau warna yang salah. Lihat blok yang berkelip.` : `Hampir siap! Tinggal ${missing.length} blok lagi.${showGhost ? ' Lihat bayang biru.' : ''}`, 'galakan');
    }
    function win() {
      won = true; celebrateT0 = performance.now(); angTarget = ang + Math.PI * 2;
      ctx.good({ speakIt: false, flash: false });
      ctx.say(`Wah! ${model.n} kamu sama seperti pelan. Arkitek hebat!`, 'pujian');
      for (let i = 0; i < 5; i++) later(() => burst(), 200 + i * 300);
      later(() => ctx.done(), 2600);
    }
    // ---------- input ketik ----------
    bCv.addEventListener('pointerup', (e) => {
      const r = bCv.getBoundingClientRect();
      const v = bIso.view(N, ang, Hmax + 1);
      const [fx, fy] = bIso.unproj(v, e.clientX - r.left, e.clientY - r.top, layer);
      const x = Math.floor(fx), y = Math.floor(fy);
      if (x < 0 || y < 0 || x >= N || y >= N) return;
      tapCell(x, y);
    });
    // ---------- zarah ----------
    const pops = [], parts = [];
    function burst() { const r = bCv.getBoundingClientRect(); const cx = r.width * (0.2 + Math.random() * 0.6), cy = r.height * (0.15 + Math.random() * 0.4); const cols = ['#ffd43b', '#ff6b6b', '#5ff0ff', '#9b5cff', '#7dff9c', '#ff9cc6']; const c = cols[Math.floor(Math.random() * cols.length)]; for (let i = 0; i < 28; i++) { const a2 = (i / 28) * Math.PI * 2; parts.push({ x: cx, y: cy, vx: Math.cos(a2) * (2 + Math.random() * 3), vy: Math.sin(a2) * (2 + Math.random() * 3), life: 55, c }); } }

    // ---------- gelung lukisan ----------
    let raf = 0;
    const tStart = performance.now();
    function frame(now) {
      if (!ctx.alive()) return;
      raf = requestAnimationFrame(frame);
      ang += (angTarget - ang) * (won ? 0.04 : 0.18);
      // sasaran
      const tAng = ch === 0 ? Math.PI * 0.0 : (now - tStart) / 2600;
      const tv = tIso.view(N, tAng, Hmax);
      tIso.clear();
      tIso.island(tv);
      tIso.scene(tv, model.blocks);
      // binaan
      const v = bIso.view(N, ang, Hmax + 1);
      bIso.clear();
      bIso.island(v);
      const list = [...built.entries()].map(([k, c]) => { const [x, y, z] = k.split(',').map(Number); return [x, y, z, c]; });
      const blocks = list.filter((b) => b[2] <= layer || won);
      bIso.scene(v, blocks, (b) => {
        const k = keyOf(b[0], b[1], b[2]);
        const f = flash.get(k); const blink = f && now - f < 1600 ? (Math.floor((now - f) / 160) % 2 ? '#ff2b2b' : '#ffffff') : null;
        const p = pops.find((q) => q.k === k && !q.out);
        const lift = p ? Math.max(0, 1 - (now - p.t0) / 180) * 0.6 : won ? Math.max(0, Math.sin((now - celebrateT0) / 160 - (b[0] + b[1] + b[2]) * 0.5)) * 0.35 * Math.max(0, 1 - (now - celebrateT0) / 2600) : 0;
        return { outline: blink, lift };
      });
      if (!won) {
        bIso.grid(v, layer, 'rgba(255,255,255,.8)', 'rgba(91,61,255,.10)');
        if (showGhost) model.blocks.forEach(([x, y, z, c]) => { if (z === layer && built.get(keyOf(x, y, z)) !== c) bIso.cube(v, x, y, z, '#4dabf7', { ghost: true, alpha: 0.6 + Math.sin(now / 200) * 0.3 }); });
        // blok di atas tingkat semasa: lutsinar
        bIso.scene(v, list.filter((b) => b[2] > layer), () => ({ alpha: 0.25 }));
        flash.forEach((t0, k) => { const [x, y, z] = k.split(',').map(Number); if (now - t0 < 1600 && !built.has(k) && z === layer) bIso.cell(v, x, y, z, 'rgba(255,60,60,.35)', '#ff2b2b'); });
      }
      // zarah
      const g = bIso.g;
      for (let i = parts.length - 1; i >= 0; i--) { const q = parts[i]; q.x += q.vx; q.y += q.vy; q.vy += 0.06; q.life--; if (q.life <= 0) { parts.splice(i, 1); continue; } g.globalAlpha = Math.min(1, q.life / 25); g.fillStyle = q.c; g.save(); g.translate(q.x, q.y); g.rotate(q.life / 5); g.fillRect(-4, -1.5, 8, 3); g.fillRect(-1.5, -4, 3, 8); g.restore(); }
      g.globalAlpha = 1;
      for (let i = pops.length - 1; i >= 0; i--) if (now - pops[i].t0 > 400) pops.splice(i, 1);
    }
    raf = requestAnimationFrame(frame);

    globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { built.clear(); model.blocks.forEach(([x, y, z, c]) => built.set(keyOf(x, y, z), c)); updateCount(); check(); });
    const intro = ch === 0
      ? (n === 1 ? 'Jom jadi arkitek! Bina sama seperti pelan. Pilih warna blok, kemudian tekan petak pada pulau untuk meletak blok.' : Hmax > 1 ? `Bina ${model.n}! Ada ${TINGKAT[Hmax - 1]} tingkat. Tekan anak panah untuk naik tingkat.` : `Bina ${model.n} seperti pelan!`)
      : ch === 1 ? (n === 11 ? 'Sekarang tiada pelan tingkat. Lihat model 3D yang berputar, kemudian bina sama sepertinya!' : `Lihat model 3D, kemudian bina ${model.n}!`)
        : (n === 21 ? 'Cabaran Arkitek! Binaan lebih besar. Putar paparan dan teliti setiap tingkat.' : `Cabaran Arkitek: bina ${model.n}!`);
    ctx.say(intro);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  },
};
