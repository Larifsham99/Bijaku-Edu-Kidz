// Enjin maze: grid terbuka dengan halangan ATAU labirin berdinding; boleh kumpul objek
import { h, sleep } from '../ui.js';
import { makeRng } from '../rng.js';

// Jana labirin sempurna (recursive backtracker). walls[y][x] = {n,e,s,w}
export function genMaze(w, hgt, seed) {
  const rng = makeRng(seed);
  const cells = Array.from({ length: hgt }, () => Array.from({ length: w }, () => ({ n: true, e: true, s: true, w: true, v: false })));
  const stack = [[0, 0]];
  cells[0][0].v = true;
  const dirs = [[0, -1, 'n', 's'], [1, 0, 'e', 'w'], [0, 1, 's', 'n'], [-1, 0, 'w', 'e']];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const nb = rng.shuffle(dirs).filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < w && ny < hgt && !cells[ny][nx].v; });
    if (!nb.length) { stack.pop(); continue; }
    const [dx, dy, a, b] = nb[0];
    cells[y][x][a] = false; cells[y + dy][x + dx][b] = false; cells[y + dy][x + dx].v = true;
    stack.push([x + dx, y + dy]);
  }
  // buka beberapa dinding tambahan supaya tidak terlalu sukar
  const extra = Math.floor(w * hgt * 0.06);
  for (let i = 0; i < extra; i++) {
    const x = rng.int(0, w - 2), y = rng.int(0, hgt - 1);
    cells[y][x].e = false; cells[y][x + 1].w = false;
  }
  return cells;
}

export function canMove(r, walls, rocks, x, y, dx, dy) {
  const nx = x + dx, ny = y + dy;
  if (nx < 0 || ny < 0 || nx >= r.w || ny >= r.h) return false;
  if (rocks.has(`${nx},${ny}`)) return false;
  if (walls) {
    const c = walls[y][x];
    if (dx === 1 && c.e) return false; if (dx === -1 && c.w) return false;
    if (dy === 1 && c.s) return false; if (dy === -1 && c.n) return false;
  }
  return true;
}

// BFS — laluan terpendek
export function bfs(r, walls, rocks, from, to) {
  const key = (p) => `${p[0]},${p[1]}`;
  const prev = new Map([[key(from), null]]);
  const q = [from];
  while (q.length) {
    const p = q.shift();
    if (p[0] === to[0] && p[1] === to[1]) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (!canMove(r, walls, rocks, p[0], p[1], dx, dy)) continue;
      const n = [p[0] + dx, p[1] + dy];
      if (prev.has(key(n))) continue;
      prev.set(key(n), p); q.push(n);
    }
  }
  if (!prev.has(key(to))) return null;
  const path = []; let c = to;
  while (c) { path.unshift(c); c = prev.get(key(c)); }
  return path;
}

// r = { w, h, walls: bool, seed, rocks: [[x,y]], items: [[x,y]], start, goal, hero, goalE, itemE, rockE, bg }
export function maze(stage, r, api) {
  const walls = r.walls ? genMaze(r.w, r.h, r.seed) : null;
  const rocks = new Set((r.rocks || []).map(([x, y]) => `${x},${y}`));
  const items = new Map((r.items || []).map(([x, y]) => [`${x},${y}`, true]));
  const maxW = Math.min((stage.clientWidth || 360) - 24, 520);
  const maxH = Math.max(260, (innerHeight || 700) - 360);
  const cs = Math.floor(Math.min(maxW / r.w, maxH / r.h, 80));
  const W = cs * r.w, H = cs * r.h;
  const wrap = h('div', { class: 'maze', style: { width: W + 'px', height: H + 'px', background: r.bg || '#fffdf5' } });
  const cv = h('canvas', { width: W * 2, height: H * 2, style: { width: W + 'px', height: H + 'px' } });
  wrap.appendChild(cv);
  const g = cv.getContext('2d'); g.scale(2, 2);
  function draw(hintPath) {
    g.clearRect(0, 0, W, H);
    // petak berselang
    for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) { if ((x + y) % 2 === 0) { g.fillStyle = 'rgba(0,0,0,.035)'; g.fillRect(x * cs, y * cs, cs, cs); } }
    if (hintPath) {
      g.fillStyle = 'rgba(255,159,67,.55)';
      hintPath.forEach(([x, y]) => { g.beginPath(); g.arc(x * cs + cs / 2, y * cs + cs / 2, cs * 0.12, 0, 7); g.fill(); });
    }
    if (walls) {
      g.strokeStyle = r.wallColor || '#7b5cc4'; g.lineWidth = Math.max(4, cs * 0.12); g.lineCap = 'round';
      g.beginPath();
      for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) {
        const c = walls[y][x], X = x * cs, Y = y * cs;
        if (c.n) { g.moveTo(X, Y); g.lineTo(X + cs, Y); }
        if (c.w) { g.moveTo(X, Y); g.lineTo(X, Y + cs); }
        if (y === r.h - 1 && c.s) { g.moveTo(X, Y + cs); g.lineTo(X + cs, Y + cs); }
        if (x === r.w - 1 && c.e) { g.moveTo(X + cs, Y); g.lineTo(X + cs, Y + cs); }
      }
      g.stroke();
    }
  }
  draw();
  const tok = (e, x, y, scale = 0.78) => {
    const t = h('div', { class: 'tok', style: { width: cs + 'px', height: cs + 'px', left: x * cs + 'px', top: y * cs + 'px', fontSize: Math.floor(cs * scale) + 'px' } }, e);
    wrap.appendChild(t);
    return t;
  };
  rocks.forEach((k) => { const [x, y] = k.split(',').map(Number); tok(r.rockE || '🪨', x, y, 0.7); });
  const itemEls = new Map();
  items.forEach((_, k) => { const [x, y] = k.split(',').map(Number); itemEls.set(k, tok(r.itemE || '⭐', x, y, 0.6)); });
  const goalEl = tok(r.goalE, r.goal[0], r.goal[1]);
  const hero = tok(r.hero, r.start[0], r.start[1], 0.82);
  hero.style.zIndex = 2;
  let pos = [...r.start], done = false, bumps = 0;
  const info = h('div', { class: 'targets' });
  const updateInfo = () => {
    if (!items.size && !(r.items || []).length) { info.replaceChildren(); return; }
    info.replaceChildren(...(r.items || []).map(([x, y]) => h('span', { class: items.has(`${x},${y}`) ? '' : 'got' }, r.itemE)));
  };
  updateInfo();
  if (items.size) goalEl.style.opacity = '0.4';

  function move(dx, dy) {
    if (done) return;
    if (!canMove(r, walls, rocks, pos[0], pos[1], dx, dy)) {
      bumps++;
      api.sfx.bump();
      hero.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${dx * 6}px, ${dy * 6}px)` }, { transform: 'translate(0,0)' }], { duration: 200 });
      if (bumps % 6 === 0) api.bad(hero, { soft: true });
      return;
    }
    pos = [pos[0] + dx, pos[1] + dy];
    if (dx) hero.style.transform = dx < 0 ? 'scaleX(-1)' : '';
    hero.style.left = pos[0] * cs + 'px'; hero.style.top = pos[1] * cs + 'px';
    api.sfx.step();
    const k = `${pos[0]},${pos[1]}`;
    if (items.has(k)) {
      items.delete(k);
      const el = itemEls.get(k); el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 400, fill: 'forwards' });
      api.sfx.coin(); updateInfo();
      if (!items.size) { goalEl.style.opacity = '1'; api.say(r.goalSay || 'Hebat! Sekarang pergi ke destinasi!'); }
    }
    if (pos[0] === r.goal[0] && pos[1] === r.goal[1]) {
      if (items.size) { api.say(`Kutip semua ${r.itemE} dahulu!`); return; }
      done = true;
      goalEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 600 });
      api.finish();
    }
  }
  // kawalan: papan kekunci
  const onKey = (e) => {
    const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (m) { e.preventDefault(); move(...m); }
  };
  addEventListener('keydown', onKey);
  // kawalan: seret watak / leret / ketik petak bersebelahan
  let dragging = false;
  const cellAt = (e) => { const b = wrap.getBoundingClientRect(); return [Math.floor((e.clientX - b.left) / cs), Math.floor((e.clientY - b.top) / cs)]; };
  wrap.addEventListener('pointerdown', (e) => { e.preventDefault(); dragging = true; wrap.setPointerCapture?.(e.pointerId); stepToward(cellAt(e)); });
  wrap.addEventListener('pointermove', (e) => { if (dragging) stepToward(cellAt(e)); });
  const stop = () => { dragging = false; };
  wrap.addEventListener('pointerup', stop); wrap.addEventListener('pointercancel', stop);
  function stepToward([cx, cy]) {
    const dx = cx - pos[0], dy = cy - pos[1];
    if (Math.abs(dx) + Math.abs(dy) !== 1) return;
    move(dx, dy);
  }
  const dpad = h('div', { class: 'dpad' },
    h('button', { class: 'u', type: 'button', 'aria-label': 'atas', onclick: () => move(0, -1) }, '⬆'),
    h('button', { class: 'l', type: 'button', 'aria-label': 'kiri', onclick: () => move(-1, 0) }, '⬅'),
    h('button', { class: 'd', type: 'button', 'aria-label': 'bawah', onclick: () => move(0, 1) }, '⬇'),
    h('button', { class: 'r', type: 'button', 'aria-label': 'kanan', onclick: () => move(1, 0) }, '➡'));
  const hintBtn = h('button', { class: 'btn small ghost', type: 'button' }, h('span', { class: 'emo' }, '💡'), 'Bantuan');
  hintBtn.addEventListener('click', () => {
    const tgt = items.size ? [...items.keys()][0].split(',').map(Number) : r.goal;
    const p = bfs(r, walls, rocks, pos, tgt);
    if (p) { draw(p); setTimeout(() => draw(), 2500); }
  });
  stage.appendChild(h('div', { class: 'maze-wrap' }, info, wrap, h('div', { class: 'row-wrap' }, dpad, hintBtn)));
  return {
    cleanup() { removeEventListener('keydown', onKey); },
    async solve() {
      const targets = [...(r.items || []).map(([x, y]) => [x, y]), r.goal];
      for (const t of targets) {
        const p = bfs(r, walls, rocks, pos, t);
        if (!p) throw new Error('maze tiada laluan');
        for (let i = 1; i < p.length; i++) { move(p[i][0] - pos[0], p[i][1] - pos[1]); await sleep(5); }
      }
    },
  };
}
