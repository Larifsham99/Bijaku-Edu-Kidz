// =====================================================================
//  LOMPAT BLOK — laluan rintangan di pulau blok terapung (2.5D)
//  Watak blok melompat petak demi petak ke trofi. Rintangan:
//  jurang, tangga, blok runtuh, platform bergerak, duri berkala, spring, checkpoint.
//  Bab 1: Pulau Rumput · Bab 2: Pulau Lava · Bab 3: Pulau Awan
//  Setiap laluan disahkan boleh diselesaikan oleh pencari laluan (BFS masa).
// =====================================================================
import { h } from '../ui.js';
import { icon } from '../icons.js';
import { profile } from '../store.js';
import { bsfx } from './blocksfx.js';

const W = 5;
const K = (x, y) => `${x},${y}`;
const DIRS = { atas: [0, 1], bawah: [0, -1], kiri: [-1, 0], kanan: [1, 0] };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);

// ---------------- dinamik dunia (dikongsi oleh permainan & pencari laluan) ----------------
export const platX = (p, t) => { const span = p.b - p.a; if (!span) return p.a; const P = 2 * span; const m = (((p.s + t) % P) + P) % P; return m <= span ? p.a + m : p.b - (m - span); };
export const spikeUp = (tile, t) => ((t + tile.ph) % 4) < 2;
function groundAt(c, x, y, t) {
  const tile = c.tiles.get(K(x, y));
  if (tile) return { tile, h: tile.h };
  const p = c.platRow.get(y);
  if (p && platX(p, t) === x) return { plat: p, h: 0 };
  return null;
}
// pencari laluan: keadaan (x, y, t mod P). Satu tindakan setiap detik (konservatif).
export function solveCourse(c, from = c.start, t0 = 0) {
  const P = c.period;
  const key = (x, y, t) => `${x},${y},${t % P}`;
  const start = [from[0], from[1], t0];
  const prev = new Map([[key(...start), null]]);
  const q = [start];
  while (q.length) {
    const [x, y, t] = q.shift();
    const here = groundAt(c, x, y, t);
    const acts = [['tunggu', 0, 0], ...Object.entries(DIRS).map(([d, v]) => [d, ...v])];
    for (const [a, dx, dy] of acts) {
      let nx = x + dx, ny = y + dy;
      if (a !== 'tunggu') {
        if (nx < 0 || nx >= W || ny < 0 || ny > c.len) continue;
        const g = groundAt(c, nx, ny, t);
        if (!g) continue;
        if (g.h - (here?.h ?? 0) >= 2) continue;
        if (g.tile?.kind === 'crumble' && dy < 0) continue;
        if (g.tile?.kind === 'spike' && spikeUp(g.tile, t)) continue;
        if (g.tile?.kind === 'goal') { prev.set('WIN', [x, y, t, a]); return trace(prev, key); }
        if (g.tile?.kind === 'spring') { ny += 2; const g2 = groundAt(c, nx, ny, t); if (!g2 || g2.tile?.kind === 'spike') continue; if (g2.tile?.kind === 'goal') { prev.set('WIN', [x, y, t, a]); return trace(prev, key); } }
      } else if (here?.tile?.kind === 'crumble') continue;
      // detik seterusnya
      const t1 = t + 1;
      const g1 = groundAt(c, nx, ny, t);
      if (g1?.plat) nx = platX(g1.plat, t1);
      const after = groundAt(c, nx, ny, t1);
      if (!after) continue;
      if (after.tile?.kind === 'spike' && spikeUp(after.tile, t1)) continue;
      const k = key(nx, ny, t1);
      if (prev.has(k)) continue;
      prev.set(k, [x, y, t, a]);
      q.push([nx, ny, t1]);
    }
    if (prev.size > 60000) break;
  }
  return null;
}
function trace(prev, key) {
  const acts = [];
  let cur = prev.get('WIN');
  acts.unshift(cur[3]);
  while (true) {
    const k = key(cur[0], cur[1], cur[2]);
    const p = prev.get(k);
    if (!p) break;
    acts.unshift(p[3]); cur = p;
  }
  return acts;
}

// ---------------- penjana laluan ----------------
export function makeCourse(n, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  for (let attempt = 0; attempt < 40; attempt++) {
    const c = build(ch, k, rng);
    const sol = solveCourse(c);
    if (sol) { c.solution = sol; return c; }
  }
  throw new Error('laluan tidak dapat dijana');
}
function build(ch, k, rng) {
  const tiles = new Map(), platRow = new Map(), gems = new Set();
  const put = (x, y, hh = 0, kind = 'solid', extra = {}) => tiles.set(K(x, y), { kind, h: hh, ...extra });
  let y = 0, c = 2, hc = 0, sinceCheck = 0;
  for (let x = 0; x < W; x++) { put(x, 0); put(x, 1); }
  y = 2;
  const len = ch === 0 ? 16 + k * 2 : ch === 1 ? 24 + k : 30 + k;
  const feats = ['lurus', 'belok', 'jambatan', 'permata'];
  if (ch > 0 || k >= 2) feats.push('tangga');
  if (ch > 0 || k >= 5) feats.push('runtuh');
  if (ch >= 1) feats.push('gerak', 'gerak', 'duri');
  if (ch === 2) feats.push('spring', 'spring', 'gerak');
  if (ch === 0 && k >= 7) feats.push('runtuh');
  const extras = (row, hh, p = 0.45) => { for (const d of [-1, 1]) { const x = c + d; if (x >= 0 && x < W && rng.chance(p)) { put(x, row, hh); if (rng.chance(0.25)) gems.add(K(x, row)); } } };
  let last = '';
  // ciri utama bab sentiasa muncul sekurang-kurangnya sekali
  let forced = ch === 1 ? (k % 2 ? 'duri' : 'gerak') : ch === 2 ? 'spring' : k >= 5 ? 'runtuh' : null;
  while (y < len) {
    let f = forced || rng.pick(feats);
    if (forced && y > 4) forced = null; else if (forced) f = 'lurus';
    if (f === last && rng.chance(0.6)) f = rng.pick(feats);
    if ((f === 'gerak' || f === 'spring') && hc !== 0) f = 'tangga';
    last = f;
    if (sinceCheck >= 8 && f !== 'gerak' && f !== 'spring') { put(c, y, hc, 'check'); extras(y, hc, 0.6); y++; sinceCheck = 0; continue; }
    const y0 = y;
    if (f === 'lurus') { const L = rng.int(2, 3); for (let i = 0; i < L; i++) { put(c, y, hc); extras(y, hc); y++; } }
    else if (f === 'belok') { const c2 = rng.pick([0, 1, 2, 3, 4].filter((x) => Math.abs(x - c) >= 2)); for (let x = Math.min(c, c2); x <= Math.max(c, c2); x++) put(x, y, hc); c = c2; y++; put(c, y, hc); y++; }
    else if (f === 'jambatan') { put(c, y, hc); y++; const d = c === 0 ? 1 : c === W - 1 ? -1 : rng.pick([-1, 1]); put(c, y, hc); put(c + d, y, hc); c += d; y++; put(c, y, hc); y++; }
    else if (f === 'permata') { put(c, y, hc); const d = c === 0 ? 1 : c === W - 1 ? -1 : rng.pick([-1, 1]); put(c + d, y, hc); put(c + d, y + 1, hc); gems.add(K(c + d, y + 1)); put(c, y + 1, hc); y += 2; }
    else if (f === 'tangga') {
      const up = hc === 0 ? true : hc === 2 ? false : rng.chance(0.5);
      const steps = rng.int(1, up ? 2 - hc : hc);
      for (let i = 0; i < steps; i++) { hc += up ? 1 : -1; put(c, y, hc); extras(y, hc, 0.3); y++; }
      put(c, y, hc); y++;
    } else if (f === 'runtuh') { const L = rng.int(2, ch === 0 ? 2 : 3); for (let i = 0; i < L; i++) { put(c, y, hc, 'crumble'); y++; } put(c, y, hc); extras(y, hc, 0.5); y++; }
    else if (f === 'gerak') {
      const rows = ch === 2 && rng.chance(0.4) ? 2 : 1;
      for (let r = 0; r < rows; r++) {
        let a = Math.max(0, c - rng.int(0, 2)); let b = Math.min(W - 1, a + rng.int(2, 3)); if (b - a < 2) a = Math.max(0, b - 2);
        if (c < a || c > b) { a = Math.max(0, Math.min(c, W - 3)); b = Math.min(W - 1, a + 2); }
        platRow.set(y, { y, a, b, s: rng.int(0, 2 * (b - a) - 1) });
        y++;
        const opts = []; for (let x = a; x <= b; x++) if (x !== c) opts.push(x);
        c = rng.pick(opts);
      }
      put(c, y, hc); extras(y, hc, 0.4); y++;
    } else if (f === 'duri') {
      const L = rng.int(1, ch === 2 ? 3 : 2);
      for (let i = 0; i < L; i++) { put(c, y, hc, 'spike', { ph: rng.int(0, 3) }); y++; }
      put(c, y, hc); extras(y, hc, 0.4); y++;
    } else if (f === 'spring') { put(c, y, 0, 'spring'); y += 2; put(c, y, 0); extras(y, 0, 0.5); y++; }
    sinceCheck += y - y0;
  }
  // garisan penamat
  for (let x = 0; x < W; x++) put(x, y, hc);
  put(c, y + 1, hc); for (let x = 0; x < W; x++) if (x !== c && rng.chance(0.5)) put(x, y + 1, hc);
  put(c, y + 2, hc, 'goal');
  gems.forEach((g) => { const t = tiles.get(g); if (!t || t.kind !== 'solid') gems.delete(g); });
  let period = 4;
  platRow.forEach((p) => { period = lcm(period, Math.max(1, 2 * (p.b - p.a))); });
  return { ch, tiles, platRow, gems, start: [2, 0], len: y + 2, period, tick: [650, 600, 560][ch] };
}

// ---------------- tema ----------------
const THEMES = [
  { sky: ['#8fd8ff', '#d9f4ff'], sea: ['#45b3f0', '#1f7fd0'], wave: 'rgba(255,255,255,.45)', top: '#7bd860', top2: '#9ae878', front: '#b9824f', front2: '#94643a', grass: '#5cbf4a', name: 'Pulau Rumput', fall: 'splash' },
  { sky: ['#3a1d3e', '#7a2c2c'], sea: ['#ff8a1f', '#d9480f'], wave: 'rgba(255,230,120,.55)', top: '#8d8f99', top2: '#a4a6b0', front: '#5f6170', front2: '#46485a', grass: '#6c6e7c', name: 'Pulau Lava', fall: 'sizzle' },
  { sky: ['#b7a6ff', '#fbe3ff'], sea: ['#d7cbff', '#a996f5'], wave: 'rgba(255,255,255,.75)', top: '#ff9ad5', top2: '#ffc1e6', front: '#b38bfa', front2: '#8f66e8', grass: '#ff7cc5', name: 'Pulau Awan', fall: 'splash' },
];

export default {
  celebrate() { bsfx.celebrate(); },
  play(ctx) {
    const { n, rng, stage, later } = ctx;
    const course = makeCourse(n, rng);
    const th = THEMES[course.ch];
    const TICK = course.tick * (globalThis.__gmFast ? 0.25 : 1);
    ctx.rounds(1); ctx.round(0);
    const pname = (profile()?.name || 'Pemain').slice(0, 12);

    // ---------- DOM ----------
    const cv = h('canvas', { class: 'lb-canvas', 'aria-label': 'Papan Lompat Blok' });
    const gemTxt = h('b', {}, '0');
    const prog = h('i');
    const hud = h('div', { class: 'lb-hud' }, h('span', { class: 'lb-gem' }, h('span', { class: 'lb-gem-ic' }), gemTxt, h('small', {}, `/${course.gems.size}`)), h('span', { class: 'lb-prog' }, prog), h('span', { class: 'lb-pl' }, th.name));
    const pad = h('div', { class: 'lb-pad' }, ...['atas', 'kiri', 'kanan', 'bawah'].map((d) => h('button', { class: `lb-btn ${d}`, type: 'button', 'aria-label': d, onpointerdown: (e) => { e.preventDefault(); input(d); } }, icon('back'))));
    stage.append(h('div', { class: 'lb-wrap' }, h('div', { class: 'lb-view' }, cv, hud), pad));
    const g = cv.getContext('2d');
    let cw = 0, chh = 0, S = 60, D = 37, HH = 25, dpr = 1;
    function resize() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = r.width; chh = r.height;
      cv.width = Math.round(cw * dpr); cv.height = Math.round(chh * dpr);
      S = cw / 6.4; D = S * 0.62; HH = S * 0.42;
    }
    const ro = new ResizeObserver(resize); ro.observe(cv);

    // ---------- keadaan ----------
    let t = 0, tickAt = performance.now();
    let px = course.start[0], py = course.start[1];
    let check = [...course.start];
    let hop = null; // {fx,fy,fz,tx,ty,tz,t0,dur,spring}
    let dead = null, won = false, queued = null, auto = null;
    let landedTick = -1;
    const collapsed = new Set(), got = new Set(), flagsOn = new Set();
    const parts = [];
    let camY = 0;
    const standH = () => groundAt(course, px, py, t)?.h ?? 0;
    const groundFn = (x, y, tt) => { const gg = groundAt(course, x, y, tt); if (gg?.tile && collapsed.has(K(x, y))) return null; return gg; };

    function input(d) {
      if (won || dead || auto) return;
      if (hop) { queued = d; return; }
      move(d);
    }
    function move(d) {
      const [dx, dy] = DIRS[d];
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || nx >= W || ny < 0) { bump(); return; }
      const dest = groundFn(nx, ny, t);
      const hs = standH();
      if (dest && dest.h - hs >= 2) { bump(); ctx.say('Terlalu tinggi! Cari tangga yang lebih rendah.', 'galakan'); return; }
      bsfx.jump();
      const fz = hs, tz = dest ? dest.h : -0.2;
      hop = { fx: px, fy: py, fz, tx: nx, ty: ny, tz, t0: performance.now(), dur: Math.min(190, TICK * 0.7) };
      px = nx; py = ny;
    }
    function bump() { bsfx.bump(); shake = 6; }
    let shake = 0;
    function land() {
      if (auto) auto.plan = null;
      const gg = groundFn(px, py, t);
      if (!gg) { fall(); return; }
      const tile = gg.tile;
      if (tile?.kind === 'spike' && spikeUp(tile, t)) { hurt(); return; }
      bsfx.land(); dust(px, py, gg.h);
      const k = K(px, py);
      if (course.gems.has(k) && !got.has(k)) { got.add(k); bsfx.gem(); gemTxt.textContent = got.size; sparkle(px, py, gg.h, '#5ff0ff'); }
      if (tile?.kind === 'crumble') { landedTick = t; bsfx.crack(); } else landedTick = -1;
      if (tile?.kind === 'check' && !flagsOn.has(k)) { flagsOn.add(k); check = [px, py]; bsfx.checkpoint(); sparkle(px, py, gg.h, '#7dff9c', 18); ctx.say('Checkpoint! Kalau jatuh, kamu mula semula di sini.', 'pujian'); }
      if (tile?.kind === 'spring') {
        bsfx.spring(); springAnim = { k, t0: performance.now() };
        const ny = py + 2, dest = groundFn(px, ny, t);
        hop = { fx: px, fy: py, fz: gg.h, tx: px, ty: ny, tz: dest ? dest.h : -0.2, t0: performance.now(), dur: Math.min(520, TICK * 0.9), spring: true };
        py = ny; return;
      }
      if (tile?.kind === 'goal') { win(); return; }
      prog.style.width = `${Math.min(100, Math.round((py / course.len) * 100))}%`;
      if (queued) { const d = queued; queued = null; move(d); }
    }
    let springAnim = null;
    function fall() {
      dead = { t0: performance.now(), x: px, y: py, kind: 'fall' };
      bsfx.fall(); later(() => { bsfx[th.fall](); splash(px, py); }, 320);
      ctx.miss({ quiet: true });
      ctx.say(['Alamak, jatuh! Jom cuba lagi.', 'Oops! Hati-hati ya, cuba sekali lagi.', 'Tak apa, kita mula semula di bendera.'][Math.floor(Math.random() * 3)], 'galakan');
      later(respawn, 1100);
    }
    function hurt() {
      dead = { t0: performance.now(), x: px, y: py, kind: 'hurt' };
      bsfx.ouch(); ctx.miss({ quiet: true });
      ctx.say('Aduh, duri! Tunggu duri turun dahulu, baru lompat.', 'galakan');
      later(respawn, 1000);
    }
    function respawn() {
      [px, py] = check; hop = null; queued = null; dead = null; landedTick = -1; collapsed.clear(); auto && (auto.plan = null);
      spawnAt = performance.now(); bsfx.ready();
    }
    let spawnAt = performance.now();
    function win() {
      won = true; landedTick = -1;
      for (let i = 0; i < 4; i++) later(() => firework(), i * 260);
      ctx.good({ speakIt: false, flash: false });
      ctx.say(got.size === course.gems.size && course.gems.size ? 'Hebat! Sampai ke trofi, dan semua permata dikutip!' : 'Hebat! Kamu sampai ke trofi!', 'pujian');
      later(() => ctx.done(), 1400);
    }

    // ---------- detik dunia ----------
    function worldTick() {
      const prevT = t; t++;
      if (dead || won) return;
      // platform membawa pemain
      if (!hop) {
        const gPrev = groundAt(course, px, py, prevT);
        if (gPrev?.plat) px = platX(gPrev.plat, t);
      }
      if (!hop) {
        const gg = groundFn(px, py, t);
        if (landedTick >= 0 && t - landedTick >= 2) { collapsed.add(K(px, py)); bsfx.crumble(); landedTick = -1; fall(); return; }
        if (!gg) { fall(); return; }
        if (gg.tile?.kind === 'spike' && spikeUp(gg.tile, t)) { hurt(); return; }
      }
      // autopilot (ujian)
      if (auto && !hop) {
        if (!auto.plan || !auto.plan.length) auto.plan = solveCourse({ ...course, tiles: liveTiles() }, [px, py], t) || [];
        const a = auto.plan.shift();
        if (a && a !== 'tunggu') move(a);
      }
    }
    const liveTiles = () => { const m = new Map(course.tiles); collapsed.forEach((k) => m.delete(k)); return m; };

    // ---------- kesan zarah ----------
    const proj = (x, y, z) => [cw / 2 + (x - 2) * S, chh * 0.72 - (y - camY) * D - z * HH];
    function dust(x, y, z) { const [sx, sy] = proj(x, y, z); for (let i = 0; i < 8; i++) parts.push({ x: sx + (Math.random() - 0.5) * S * 0.6, y: sy - D * 0.3, vx: (Math.random() - 0.5) * 1.6, vy: -Math.random() * 1.2, life: 26, c: 'rgba(255,255,255,.8)', r: 3 + Math.random() * 3 }); }
    function sparkle(x, y, z, c, nn = 12) { const [sx, sy] = proj(x, y, z); for (let i = 0; i < nn; i++) { const a = (i / nn) * Math.PI * 2; parts.push({ x: sx, y: sy - D * 0.6 - HH, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3 - 1, life: 34, c, r: 3, star: true }); } }
    function splash(x, y) { const [sx, sy] = proj(x, y, -1); const c = course.ch === 1 ? '#ffd43b' : '#ffffff'; for (let i = 0; i < 18; i++) parts.push({ x: sx + (Math.random() - 0.5) * S * 0.5, y: sy, vx: (Math.random() - 0.5) * 4, vy: -2 - Math.random() * 4, g: 0.25, life: 40, c, r: 3 + Math.random() * 3 }); }
    function firework() { const sx = cw * (0.2 + Math.random() * 0.6), sy = chh * (0.15 + Math.random() * 0.3); const cols = ['#ffd43b', '#ff6b6b', '#5ff0ff', '#9b5cff', '#7dff9c']; const c = cols[Math.floor(Math.random() * cols.length)]; for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; parts.push({ x: sx, y: sy, vx: Math.cos(a) * (3 + Math.random() * 2), vy: Math.sin(a) * (3 + Math.random() * 2), g: 0.05, life: 50, c, r: 3, star: true }); } }

    // ---------- lukisan ----------
    const texture = new Map();
    const tex = (key, nn) => { if (!texture.has(key)) { const r = []; let s = [...key].reduce((a, ch2) => a * 31 + ch2.charCodeAt(0), 7) >>> 0; for (let i = 0; i < nn; i++) { s = (s * 1103515245 + 12345) >>> 0; const u = (s >>> 8) / 16777216; s = (s * 1103515245 + 12345) >>> 0; const v = (s >>> 8) / 16777216; r.push([u, v]); } texture.set(key, r); } return texture.get(key); };
    function blockAt(sx, topY, depth, x, y, kind, wob = 0, alpha = 1) {
      const L = sx - S / 2 + wob, R = S;
      g.globalAlpha = alpha;
      // muka depan
      const fh = depth;
      const fg = g.createLinearGradient(0, topY, 0, topY + fh);
      fg.addColorStop(0, kind === 'crumble' ? '#c79a6a' : th.front); fg.addColorStop(1, th.front2);
      g.fillStyle = fg; g.fillRect(L, topY, R, fh);
      g.fillStyle = 'rgba(0,0,0,.12)'; tex(`f${x},${y}`, 7).forEach(([u, v]) => g.fillRect(L + u * (R - 8), topY + 8 + v * (fh - 14), 7, 7));
      g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(L + R - 6, topY, 6, fh);
      // jalur rumput menitis
      if (kind !== 'spike' && kind !== 'spring') { g.fillStyle = kind === 'crumble' ? '#d8b98f' : th.grass; g.fillRect(L, topY, R, 7); for (let i = 0; i < 5; i++) g.fillRect(L + i * (R / 5) + 3, topY + 6, R / 10, 5 + ((x * 3 + y + i) % 3) * 3); }
      // muka atas
      const top = kind === 'spike' ? '#c3c7d1' : kind === 'spring' ? '#ff6b6b' : kind === 'crumble' ? '#e9c79b' : kind === 'check' || kind === 'goal' ? '#ffe28a' : th.top;
      g.fillStyle = top; g.fillRect(L, topY - D, R, D);
      g.fillStyle = kind === 'crumble' ? '#f3dab8' : th.top2; tex(`t${x},${y}`, 5).forEach(([u, v]) => g.fillRect(L + 4 + u * (R - 14), topY - D + 4 + v * (D - 12), 8, 6));
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(L + 1, topY - 1); g.lineTo(L + 1, topY - D + 1); g.lineTo(L + R - 1, topY - D + 1); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; g.strokeRect(L + 0.5, topY - D + 0.5, R - 1, D + fh - 1);
      if (kind === 'crumble') { g.strokeStyle = '#8a5d36'; g.lineWidth = 2; g.beginPath(); g.moveTo(L + R * 0.2, topY - D * 0.8); g.lineTo(L + R * 0.45, topY - D * 0.45); g.lineTo(L + R * 0.35, topY - D * 0.15); g.moveTo(L + R * 0.45, topY - D * 0.45); g.lineTo(L + R * 0.8, topY - D * 0.3); g.stroke(); }
      g.globalAlpha = 1;
    }
    function drawSpikes(sx, topY, up) {
      const L = sx - S / 2;
      const hgt = up * S * 0.42;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
        const cx = L + S * (0.22 + i * 0.28), cy = topY - D * (0.3 + j * 0.42);
        g.fillStyle = '#8d95a3'; g.beginPath(); g.ellipse(cx, cy, S * 0.08, D * 0.07, 0, 0, Math.PI * 2); g.fill();
        if (hgt > 1) { g.fillStyle = '#e9ecef'; g.beginPath(); g.moveTo(cx - S * 0.08, cy); g.lineTo(cx, cy - hgt); g.lineTo(cx + S * 0.08, cy); g.fill(); g.fillStyle = '#adb5bd'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - hgt); g.lineTo(cx + S * 0.08, cy); g.fill(); }
      }
    }
    function drawGem(sx, sy, now) {
      const b = Math.sin(now / 300 + sx) * 4;
      const y0 = sy - D * 0.55 - S * 0.35 + b, r = S * 0.17;
      g.fillStyle = 'rgba(0,0,0,.15)'; g.beginPath(); g.ellipse(sx, sy - D * 0.45, r * 0.8, r * 0.3, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#22d3ee'; g.beginPath(); g.moveTo(sx, y0 - r); g.lineTo(sx + r, y0 - r * 0.2); g.lineTo(sx, y0 + r * 1.1); g.lineTo(sx - r, y0 - r * 0.2); g.closePath(); g.fill();
      g.fillStyle = '#a5f3fc'; g.beginPath(); g.moveTo(sx, y0 - r); g.lineTo(sx + r, y0 - r * 0.2); g.lineTo(sx, y0 - r * 0.05); g.closePath(); g.fill();
      g.strokeStyle = '#0e7490'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sx, y0 - r); g.lineTo(sx + r, y0 - r * 0.2); g.lineTo(sx, y0 + r * 1.1); g.lineTo(sx - r, y0 - r * 0.2); g.closePath(); g.stroke();
    }
    function drawFlag(sx, sy, on, now) {
      const x0 = sx + S * 0.15, base = sy - D * 0.5;
      g.strokeStyle = '#6b4a2f'; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, base); g.lineTo(x0, base - S * 0.95); g.stroke();
      const w = Math.sin(now / 200) * 4;
      g.fillStyle = on ? '#2fbf71' : '#adb5bd';
      g.beginPath(); g.moveTo(x0, base - S * 0.95); g.quadraticCurveTo(x0 - S * 0.25, base - S * 0.85 + w, x0 - S * 0.48, base - S * 0.8); g.lineTo(x0, base - S * 0.62); g.closePath(); g.fill();
    }
    function drawGoal(sx, sy, now) {
      const base = sy - D * 0.5;
      const rays = g.createRadialGradient(sx, base - S * 0.7, 2, sx, base - S * 0.7, S * 1.2);
      rays.addColorStop(0, 'rgba(255,236,150,.9)'); rays.addColorStop(1, 'rgba(255,236,150,0)');
      g.fillStyle = rays; g.beginPath(); g.arc(sx, base - S * 0.7, S * 1.2, 0, Math.PI * 2); g.fill();
      const b = Math.sin(now / 350) * 5;
      g.fillStyle = '#f2b705'; g.fillRect(sx - S * 0.18, base - S * 0.28 + b, S * 0.36, S * 0.12);
      g.fillStyle = '#ffd43b'; g.beginPath(); g.moveTo(sx - S * 0.3, base - S * 1.0 + b); g.lineTo(sx + S * 0.3, base - S * 1.0 + b); g.quadraticCurveTo(sx + S * 0.28, base - S * 0.45 + b, sx, base - S * 0.4 + b); g.quadraticCurveTo(sx - S * 0.28, base - S * 0.45 + b, sx - S * 0.3, base - S * 1.0 + b); g.fill();
      g.fillStyle = '#fff3bf'; g.fillRect(sx - S * 0.18, base - S * 0.95 + b, S * 0.08, S * 0.3);
      g.strokeStyle = '#f2b705'; g.lineWidth = 5; g.beginPath(); g.arc(sx - S * 0.32, base - S * 0.8 + b, S * 0.12, Math.PI * 0.5, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(sx + S * 0.32, base - S * 0.8 + b, S * 0.12, -Math.PI * 0.5, Math.PI * 0.5); g.stroke();
      g.fillStyle = '#c28a00'; g.fillRect(sx - S * 0.06, base - S * 0.42 + b, S * 0.12, S * 0.16);
    }
    function drawPlatform(sx, topY) {
      const L = sx - S * 0.48, R = S * 0.96;
      g.fillStyle = '#7a4a2a'; g.fillRect(L, topY, R, HH * 0.7);
      g.fillStyle = '#c48a5e'; g.fillRect(L, topY - D, R, D);
      g.fillStyle = '#a86b3c'; for (let i = 1; i < 4; i++) g.fillRect(L + (R / 4) * i - 1, topY - D, 2, D);
      g.strokeStyle = 'rgba(0,0,0,.25)'; g.strokeRect(L + 0.5, topY - D + 0.5, R - 1, D + HH * 0.7 - 1);
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(L, topY - D, R, 3);
    }
    function drawPlayer(sx, sy, now, squash) {
      const s = S * 0.5;
      const bob = hop ? 0 : Math.sin(now / 260) * 1.5;
      const sq = 1 + squash;
      // bayang
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(sx, shadowY, s * 0.55, s * 0.18, 0, 0, Math.PI * 2); g.fill();
      g.save(); g.translate(sx, sy - D * 0.45 + bob); g.scale(1 / sq, sq);
      // kaki
      g.fillStyle = '#2b3a67'; g.fillRect(-s * 0.32, -s * 0.5, s * 0.28, s * 0.5); g.fillRect(s * 0.04, -s * 0.5, s * 0.28, s * 0.5);
      g.fillStyle = '#1b2440'; g.fillRect(-s * 0.32, -s * 0.12, s * 0.28, s * 0.12); g.fillRect(s * 0.04, -s * 0.12, s * 0.28, s * 0.12);
      // badan
      g.fillStyle = '#ff6b3d'; g.fillRect(-s * 0.42, -s * 1.15, s * 0.84, s * 0.68);
      g.fillStyle = '#ffd43b'; g.fillRect(-s * 0.12, -s * 1.0, s * 0.24, s * 0.24);
      // lengan
      g.fillStyle = '#ff6b3d'; g.fillRect(-s * 0.62, -s * 1.12, s * 0.2, s * 0.5); g.fillRect(s * 0.42, -s * 1.12, s * 0.2, s * 0.5);
      g.fillStyle = '#f8c9a0'; g.fillRect(-s * 0.62, -s * 0.66, s * 0.2, s * 0.16); g.fillRect(s * 0.42, -s * 0.66, s * 0.2, s * 0.16);
      // kepala
      g.fillStyle = '#f8c9a0'; g.fillRect(-s * 0.42, -s * 1.85, s * 0.84, s * 0.72);
      g.fillStyle = '#2b2350'; g.fillRect(-s * 0.24, -s * 1.55, s * 0.12, s * 0.16); g.fillRect(s * 0.12, -s * 1.55, s * 0.12, s * 0.16);
      g.fillStyle = '#e8596e'; g.fillRect(-s * 0.12, -s * 1.32, s * 0.24, s * 0.06);
      // topi
      g.fillStyle = '#3d8bff'; g.fillRect(-s * 0.46, -s * 1.98, s * 0.92, s * 0.26); g.fillRect(s * 0.1, -s * 1.8, s * 0.5, s * 0.1);
      g.restore();
      // tag nama
      g.font = `800 ${Math.round(S * 0.2)}px "Baloo 2", sans-serif`;
      const tw = g.measureText(pname).width + 14, ty = sy - D * 0.45 - s * 2.35 + bob;
      g.fillStyle = 'rgba(28,23,71,.72)'; roundRect(sx - tw / 2, ty - S * 0.2, tw, S * 0.28, 8); g.fill();
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(pname, sx, ty - S * 0.06);
    }
    let shadowY = 0;
    function roundRect(x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

    function frame(now) {
      if (!ctx.alive()) return;
      raf = requestAnimationFrame(frame);
      while (now - tickAt >= TICK) { tickAt += TICK; worldTick(); }
      const phase = Math.min(1, (now - tickAt) / Math.min(TICK, 260));
      // pemain (kedudukan visual)
      let vx = px, vy = py, vz = groundAt(course, px, py, t)?.h ?? 0, squash = 0;
      if (hop) {
        const k = Math.min(1, (now - hop.t0) / hop.dur);
        vx = hop.fx + (hop.tx - hop.fx) * k; vy = hop.fy + (hop.ty - hop.fy) * k;
        vz = hop.fz + (hop.tz - hop.fz) * k + Math.sin(k * Math.PI) * (hop.spring ? 2.6 : 0.7);
        squash = k < 0.2 ? -0.12 : 0.08;
        if (k >= 1) { hop = null; land(); }
      } else {
        const gPrev = groundAt(course, px, py, t - 1), gNow = groundAt(course, px, py, t);
        if (gNow?.plat && gPrev === null) { /* */ }
        if (gNow?.plat) { const p0 = platX(gNow.plat, t - 1); vx = p0 + (px - p0) * Math.min(1, (now - tickAt) / Math.min(TICK, 300)); }
      }
      if (dead) { const k = (now - dead.t0) / 900; vz = (groundAt(course, dead.x, dead.y, t)?.h ?? 0) - (dead.kind === 'fall' ? k * k * 6 : 0); }
      camY += ((vy - 1.4) - camY) * 0.12;
      const sh = shake > 0 ? (Math.random() - 0.5) * shake : 0; shake *= 0.85;
      g.setTransform(dpr, 0, 0, dpr, sh * dpr, 0);
      // langit & laut
      const sky = g.createLinearGradient(0, 0, 0, chh);
      sky.addColorStop(0, th.sky[0]); sky.addColorStop(0.25, th.sky[1]); sky.addColorStop(0.32, th.sea[0]); sky.addColorStop(1, th.sea[1]);
      g.fillStyle = sky; g.fillRect(-10, 0, cw + 20, chh);
      g.strokeStyle = th.wave; g.lineWidth = 2.5;
      for (let i = 0; i < 14; i++) {
        const wy = chh * 0.3 + ((i * 47 + camY * D * 0.6) % (chh * 0.75));
        g.beginPath(); for (let x = -20; x <= cw + 20; x += 20) { const yy = wy + Math.sin(x / 26 + now / 520 + i) * 3; x === -20 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke();
      }
      if (course.ch === 2) { g.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 6; i++) { const cx = ((i * 97 + now / 60) % (cw + 120)) - 60, cy = chh * 0.4 + ((i * 131 + camY * D * 0.5) % (chh * 0.6)); g.beginPath(); g.arc(cx, cy, 18, 0, 7); g.arc(cx + 18, cy - 8, 22, 0, 7); g.arc(cx + 40, cy, 16, 0, 7); g.fill(); } }
      if (course.ch === 1) { g.fillStyle = 'rgba(255,230,120,.6)'; for (let i = 0; i < 8; i++) { const bx = (i * 83) % cw, by = chh - ((now / 8 + i * 70) % (chh * 0.7)); g.beginPath(); g.arc(bx, by, 3 + (i % 3), 0, 7); g.fill(); } }
      // dunia: baris jauh → dekat
      const yMin = Math.floor(camY - 3), yMax = Math.ceil(camY + chh / D + 2);
      const depthPx = (hh) => (hh + 1) * HH + HH * 0.8;
      for (let y = Math.min(course.len + 1, yMax); y >= Math.max(0, yMin); y--) {
        for (let x = 0; x < W; x++) {
          const k = K(x, y), tile = course.tiles.get(k);
          if (tile && !collapsed.has(k)) {
            const [sx, sy] = proj(x, y, tile.h);
            let wob = 0;
            if (tile.kind === 'crumble' && landedTick >= 0 && px === x && py === y) wob = Math.sin(now / 25) * 3;
            blockAt(sx, sy, depthPx(tile.h), x, y, tile.kind, wob);
            if (tile.kind === 'spike') { const up = spikeUp(tile, t) ? 1 : 0, was = spikeUp(tile, t - 1) ? 1 : 0; drawSpikes(sx, sy, was + (up - was) * Math.min(1, (now - tickAt) / 160)); }
            if (tile.kind === 'spring') { const sa = springAnim && springAnim.k === k ? Math.max(0, 1 - (now - springAnim.t0) / 400) : 0; g.fillStyle = '#ffffff'; g.fillRect(sx - S * 0.3, sy - D * 0.75 - S * 0.12 * (1 - sa), S * 0.6, D * 0.25); g.strokeStyle = '#495057'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 4; i++) { g.moveTo(sx - S * 0.2, sy - D * 0.5 - i * 4 * (1 - sa)); g.lineTo(sx + S * 0.2, sy - D * 0.5 - i * 4 * (1 - sa) - 2); } g.stroke(); }
            if (tile.kind === 'check') drawFlag(sx, sy, flagsOn.has(k), now);
            if (tile.kind === 'goal') drawGoal(sx, sy, now);
            if (course.gems.has(k) && !got.has(k)) drawGem(sx, sy, now);
          }
          const p = course.platRow.get(y);
          if (p && x === 0) {
            const x0 = platX(p, t - 1), x1 = platX(p, t);
            const vxp = x0 + (x1 - x0) * Math.min(1, (now - tickAt) / Math.min(TICK, 300));
            const [sx, sy] = proj(vxp, y, 0);
            drawPlatform(sx, sy);
          }
        }
        // pemain dilukis selepas barisnya
        if (Math.round(vy) === y || (hop && y === Math.min(hop.fy, hop.ty))) {
          if (!drawnPlayer) {
            drawnPlayer = true;
            const [sx, sy] = proj(vx, vy, vz);
            const gz = dead ? (groundAt(course, dead.x, dead.y, t)?.h ?? -1) : Math.max(groundAt(course, Math.round(vx), Math.round(vy), t)?.h ?? -0.4, -0.4);
            shadowY = proj(vx, vy, gz)[1] - D * 0.45;
            const sp = Math.max(0, 1 - (now - spawnAt) / 300);
            g.save();
            if (dead) g.globalAlpha = Math.max(0, 1 - (now - dead.t0) / 900);
            if (sp) { g.translate(sx, sy); g.scale(1 - sp, 1 - sp); g.translate(-sx, -sy); }
            if (dead?.kind === 'hurt') { g.translate(sx, sy); g.rotate(Math.sin(now / 40) * 0.2); g.translate(-sx, -sy); }
            drawPlayer(sx, sy, now, squash);
            g.restore();
          }
        }
      }
      drawnPlayer = false;
      // zarah
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i]; q.x += q.vx; q.y += q.vy; q.vy += q.g || 0; q.life--;
        if (q.life <= 0) { parts.splice(i, 1); continue; }
        g.globalAlpha = Math.min(1, q.life / 20); g.fillStyle = q.c;
        if (q.star) { g.save(); g.translate(q.x, q.y); g.rotate(q.life / 6); g.fillRect(-q.r, -q.r / 3, q.r * 2, q.r / 1.5); g.fillRect(-q.r / 3, -q.r, q.r / 1.5, q.r * 2); g.restore(); }
        else { g.beginPath(); g.arc(q.x, q.y, q.r, 0, 7); g.fill(); }
      }
      g.globalAlpha = 1;
    }
    let drawnPlayer = false;
    let raf = requestAnimationFrame(frame);

    // papan kekunci & leret
    const onKey = (e) => { const m = { ArrowUp: 'atas', ArrowDown: 'bawah', ArrowLeft: 'kiri', ArrowRight: 'kanan', w: 'atas', s: 'bawah', a: 'kiri', d: 'kanan' }[e.key]; if (m) { e.preventDefault(); input(m); } };
    addEventListener('keydown', onKey);
    let sw = null;
    cv.addEventListener('pointerdown', (e) => { sw = [e.clientX, e.clientY]; });
    cv.addEventListener('pointerup', (e) => { if (!sw) return; const dx = e.clientX - sw[0], dy = e.clientY - sw[1]; sw = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { input('atas'); return; } input(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'kanan' : 'kiri') : (dy < 0 ? 'atas' : 'bawah')); });

    globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { auto = { plan: null }; });
    const intro = course.ch === 0
      ? (n === 1 ? 'Tekan anak panah untuk melompat! Bawa watak kamu ke trofi. Jangan jatuh ke dalam air!' : course.tiles.size && [...course.tiles.values()].some((x) => x.kind === 'crumble') ? 'Blok retak akan runtuh. Jangan berhenti di atasnya, terus lompat!' : 'Lompat ke trofi! Kutip permata biru kalau boleh.')
      : course.ch === 1 ? (n === 11 ? 'Pulau Lava! Tunggu platform kayu datang dekat, lompat naik, kemudian lompat turun di blok seterusnya.' : 'Hati-hati dengan duri dan lava! Tunggu masa yang sesuai, baru lompat.')
        : (n === 21 ? 'Pulau Awan! Pijak spring merah untuk melompat jauh ke hadapan.' : 'Cabaran terakhir! Platform, duri, spring dan blok retak. Kamu boleh!');
    ctx.say(intro);
    bsfx.ready();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('keydown', onKey); };
  },
};
