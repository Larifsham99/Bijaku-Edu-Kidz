// Enjin seni: mewarna, sambung titik, surih jari, lukis bebas
import { h, sleep } from '../ui.js';
import { COLORS, colorById } from '../data/content.js';
import { COLORING, DOT_SHAPES, TRACE } from '../data/art.js';
import { hintEl, shakeEl } from './common.js';

const PALETTE = ['merah', 'oren', 'kuning', 'hijau', 'biru', 'ungu', 'merahjambu', 'coklat', 'hitam', 'putih'];

export function paletteEl(onPick, ids = PALETTE, init) {
  let cur = init || ids[0];
  const wrap = h('div', { class: 'palette' });
  const sws = ids.map((id) => {
    const c = colorById(id);
    const b = h('button', { class: `swatch ${id === cur ? 'on' : ''}`, type: 'button', 'aria-label': c.n, style: { background: c.hex } });
    b.addEventListener('click', () => { cur = id; sws.forEach((s) => s.classList.remove('on')); b.classList.add('on'); onPick(id, c); });
    wrap.appendChild(b);
    return b;
  });
  return { el: wrap, get: () => cur, set: (id) => { const i = ids.indexOf(id); if (i >= 0) sws[i].click(); }, sws, ids };
}

export function artSvg(art) {
  const body = art.regions.map((rg) => rg.svg.replace(/^<(\w+)/, `<$1 data-r="${rg.id}" fill="#ffffff"`)).join('') + (art.deco || '');
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

// r = { art: id, guided: [{ region, color }], free: bool, palette }
export function color(stage, r, api) {
  const art = COLORING.find((a) => a.id === r.art);
  const box = h('div', { class: 'color-art', html: artSvg(art) });
  const svg = box.querySelector('svg');
  const regionEls = new Map([...svg.querySelectorAll('[data-r]')].map((el) => [el.dataset.r, el]));
  const fillReg = (el, hex) => { el.setAttribute('fill', hex); el.querySelectorAll?.('*').forEach((c) => c.setAttribute('fill', hex)); };
  regionEls.forEach((el) => fillReg(el, '#ffffff'));
  const pal = paletteEl((id, c) => { api.sfx.tap(); api.speak(c.n); }, r.palette || PALETTE);
  const status = h('div', { class: 'prompt-text', style: { fontSize: '22px' } });
  stage.appendChild(status);
  stage.appendChild(h('div', { class: 'color-wrap' }, box, pal.el));
  const colored = new Set();
  let gi = 0, done = false, wrong = 0;
  const guided = r.guided || [];
  const doneBtn = h('button', { class: 'btn green', type: 'button', disabled: true }, h('span', { class: 'emo' }, '✅'), 'Siap!');
  if (!guided.length) stage.appendChild(h('div', { class: 'row-wrap' }, doneBtn));
  doneBtn.addEventListener('click', () => { if (!done) { done = true; api.finish(); } });

  const ask = () => {
    if (done || gi >= guided.length) return;
    const g = guided[gi];
    const rg = art.regions.find((x) => x.id === g.region);
    const c = colorById(g.color);
    status.replaceChildren(`Warnakan ${rg.n} dengan warna `, h('b', { style: { color: c.id === 'putih' ? '#999' : c.hex } }, c.n.toLowerCase()), '.');
    api.say(`Warnakan ${rg.n} dengan warna ${c.n.toLowerCase()}.`);
    const el = regionEls.get(g.region);
    el.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: 900, iterations: 2 });
  };
  if (guided.length) ask(); else status.textContent = r.prompt || `Warnakan ${art.n.toLowerCase()} ikut suka hati kamu!`;

  svg.addEventListener('click', (e) => {
    const el = e.target.closest('[data-r]');
    if (!el || done) return;
    const id = el.dataset.r;
    const cid = pal.get();
    const hex = colorById(cid).hex;
    if (guided.length) {
      const g = guided[gi];
      if (id !== g.region) { api.say(`Cuba warnakan ${art.regions.find((x) => x.id === g.region).n} dahulu.`); hintEl(null); regionEls.get(g.region).animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 700 }); return; }
      if (cid !== g.color) {
        wrong++;
        fillReg(el, hex);
        api.bad(el);
        api.say(`Ini warna ${colorById(cid).n.toLowerCase()}. Cari warna ${colorById(g.color).n.toLowerCase()}!`);
        if (wrong >= 2) hintEl(pal.sws[pal.ids.indexOf(g.color)]);
        return;
      }
      fillReg(el, hex); api.sfx.pop();
      gi++; wrong = 0;
      if (gi >= guided.length) {
        // warnakan baki kawasan dengan warna cadangan
        art.regions.forEach((rg) => { if (!guided.find((g2) => g2.region === rg.id)) fillReg(regionEls.get(rg.id), colorById(rg.want).hex); });
        done = true; api.finish();
      } else { api.good(el, { quiet: true }); sleep(600).then(ask); }
      return;
    }
    fillReg(el, hex); api.sfx.pop();
    colored.add(id);
    if (colored.size >= art.regions.length) { doneBtn.disabled = false; status.textContent = 'Cantiknya! Tekan "Siap!" apabila selesai.'; }
  });
  return {
    async solve() {
      if (guided.length) {
        for (const g of guided) { pal.set(g.color); await sleep(20); regionEls.get(g.region).dispatchEvent(new MouseEvent('click', { bubbles: true })); await sleep(650); }
      } else {
        for (const [, el] of regionEls) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        doneBtn.click();
      }
    },
  };
}

// Sampel semula titik di sepanjang poligon supaya bilangan titik = n
export function resample(poly, n) {
  if (n <= poly.length) return poly.slice(0, Math.max(3, n));
  const pts = [...poly, poly[0]];
  const seg = []; let total = 0;
  for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); total += d; }
  const out = []; const step = total / n;
  // sentiasa simpan bucu asal, kemudian isi titik tambahan di segmen terpanjang
  const counts = seg.map((d) => Math.max(1, Math.round(d / step)));
  let sum = counts.reduce((a, b) => a + b, 0);
  while (sum > n) { const i = counts.indexOf(Math.max(...counts)); counts[i]--; sum--; }
  while (sum < n) { let bi = 0, best = -1; seg.forEach((d, i) => { const v = d / counts[i]; if (v > best) { best = v; bi = i; } }); counts[bi]++; sum++; }
  for (let i = 0; i < seg.length; i++) {
    for (let k = 0; k < counts[i]; k++) {
      const t = k / counts[i];
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]);
    }
  }
  return out;
}

// r = { shape, n, start }
export function dots(stage, r, api) {
  const shp = DOT_SHAPES.find((s) => s.id === r.shape);
  const pts = resample(shp.poly, r.n).map(([x, y]) => [x * 2, y * 2]);
  const pad = h('div', { class: 'dots-pad' });
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '-10 -10 220 220');
  const lines = document.createElementNS(ns, 'polyline');
  lines.setAttribute('fill', 'none'); lines.setAttribute('stroke', '#a77bff'); lines.setAttribute('stroke-width', '5'); lines.setAttribute('stroke-linecap', 'round'); lines.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(lines);
  const dotEls = pts.map(([x, y], i) => {
    const g = document.createElementNS(ns, 'g');
    g.style.cursor = 'pointer';
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 9); c.setAttribute('fill', i === 0 ? '#ff9f43' : '#ffffff'); c.setAttribute('stroke', '#3d3256'); c.setAttribute('stroke-width', 3);
    const hit = document.createElementNS(ns, 'circle');
    hit.setAttribute('cx', x); hit.setAttribute('cy', y); hit.setAttribute('r', 16); hit.setAttribute('fill', 'transparent');
    const t = document.createElementNS(ns, 'text');
    // letak nombor di luar bentuk
    const dx = x - 100, dy = y - 100, L = Math.hypot(dx, dy) || 1;
    t.setAttribute('x', x + (dx / L) * 18); t.setAttribute('y', y + (dy / L) * 18 + 5);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '14'); t.setAttribute('font-weight', '900'); t.setAttribute('fill', '#3d3256');
    t.textContent = i + 1;
    g.append(c, hit, t);
    g.addEventListener('pointerdown', (e) => { e.preventDefault(); tap(i); });
    g.addEventListener('pointerenter', (e) => { if (e.buttons) tap(i); });
    g._c = c;
    svg.appendChild(g);
    return g;
  });
  pad.appendChild(svg);
  pad.appendChild(h('div', { class: 'reveal' }, shp.reveal));
  stage.appendChild(h('div', { class: 'prompt-text', style: { fontSize: '22px' } }, 'Sambung titik ikut nombor: 1, 2, 3...'));
  stage.appendChild(h('div', { class: 'row-wrap' }, pad));
  let next = 0, done = false, wrong = 0;
  const path = [];
  function tap(i) {
    if (done) return;
    if (i === next) {
      path.push(pts[i]);
      lines.setAttribute('points', path.map((p) => p.join(',')).join(' '));
      dotEls[i]._c.setAttribute('fill', '#4cd18a');
      if (dotEls[i + 1]) dotEls[i + 1]._c.setAttribute('fill', '#ff9f43');
      api.sfx.note(i);
      if (r.n <= 12) api.speak(String(i + 1));
      next++;
      wrong = 0;
      if (next >= pts.length) {
        path.push(pts[0]);
        lines.setAttribute('points', path.map((p) => p.join(',')).join(' '));
        done = true; pad.classList.add('done');
        api.say(`Wah! Ia ${shp.n.toLowerCase()}!`);
        setTimeout(() => api.finish(), 900);
      }
    } else if (i > next) {
      wrong++;
      if (wrong >= 2) dotEls[next]._c.animate([{ r: 9 }, { r: 15 }, { r: 9 }], { duration: 600, iterations: 2 });
      api.bad(null, { soft: true });
    }
  }
  return { async solve() { for (let i = 0; i < pts.length; i++) { tap(i); await sleep(5); } await sleep(950); } };
}

// Surih huruf / bentuk dengan jari. r = { trace: id }
export function trace(stage, r, api) {
  const tr = TRACE.find((t) => t.id === r.trace);
  const S = Math.min((stage.clientWidth || 360) - 30, 380);
  const pad = h('div', { class: 'dots-pad', style: { width: S + 'px' } });
  const cv = h('canvas', { width: S * 2, height: S * 2, style: { width: '100%', height: '100%', borderRadius: '26px', touchAction: 'none' } });
  pad.appendChild(cv);
  const g = cv.getContext('2d');
  const k = (S * 2) / 100;
  // titik semak
  const checks = [];
  tr.strokes.forEach((st) => {
    for (let i = 0; i < st.length - 1; i++) {
      const [x1, y1] = st[i], [x2, y2] = st[i + 1];
      const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.ceil(L / 6));
      for (let j = 0; j <= n; j++) checks.push({ x: x1 + (x2 - x1) * (j / n), y: y1 + (y2 - y1) * (j / n), hit: false });
    }
  });
  function drawGuide() {
    g.clearRect(0, 0, cv.width, cv.height);
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = '#efe7fb'; g.lineWidth = 15 * k;
    tr.strokes.forEach((st) => { g.beginPath(); st.forEach(([x, y], i) => (i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k))); g.stroke(); });
    g.setLineDash([3 * k, 4 * k]); g.strokeStyle = '#a77bff'; g.lineWidth = 1.6 * k;
    tr.strokes.forEach((st) => { g.beginPath(); st.forEach(([x, y], i) => (i ? g.lineTo(x * k, y * k) : g.moveTo(x * k, y * k))); g.stroke(); });
    g.setLineDash([]);
    // titik mula setiap garisan
    tr.strokes.forEach((st, i) => { g.fillStyle = '#4cd18a'; g.beginPath(); g.arc(st[0][0] * k, st[0][1] * k, 4 * k, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `900 ${4.5 * k}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i + 1), st[0][0] * k, st[0][1] * k); });
  }
  drawGuide();
  let drawing = false, last = null, done = false;
  const pt = (e) => { const b = cv.getBoundingClientRect(); return [((e.clientX - b.left) / b.width) * 100, ((e.clientY - b.top) / b.height) * 100]; };
  function mark([x, y]) {
    checks.forEach((c) => { if (!c.hit && Math.hypot(c.x - x, c.y - y) < 8) c.hit = true; });
    const ratio = checks.filter((c) => c.hit).length / checks.length;
    if (!done && ratio >= 0.9) {
      done = true;
      g.strokeStyle = '#4cd18a'; g.lineWidth = 6 * k; g.lineCap = 'round';
      tr.strokes.forEach((st) => { g.beginPath(); st.forEach(([x2, y2], i) => (i ? g.lineTo(x2 * k, y2 * k) : g.moveTo(x2 * k, y2 * k))); g.stroke(); });
      setTimeout(() => api.finish(), 400);
    }
  }
  function ink(a, b2) {
    g.strokeStyle = '#ff6b6b'; g.lineWidth = 5 * k; g.lineCap = 'round';
    g.beginPath(); g.moveTo(a[0] * k, a[1] * k); g.lineTo(b2[0] * k, b2[1] * k); g.stroke();
  }
  cv.addEventListener('pointerdown', (e) => { e.preventDefault(); drawing = true; cv.setPointerCapture?.(e.pointerId); last = pt(e); mark(last); });
  cv.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pt(e); ink(last, p); last = p; mark(p); });
  const up = () => { drawing = false; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  const reset = h('button', { class: 'btn small ghost', type: 'button' }, h('span', { class: 'emo' }, '🔄'), 'Padam');
  reset.addEventListener('click', () => { checks.forEach((c) => { c.hit = false; }); drawGuide(); });
  stage.appendChild(h('div', { class: 'prompt-text', style: { fontSize: '22px' } }, `Surih ${tr.n} dengan jari kamu.`));
  stage.appendChild(h('div', { class: 'row-wrap' }, pad));
  stage.appendChild(h('div', { class: 'row-wrap' }, reset));
  return { async solve() { checks.forEach((c) => mark([c.x, c.y])); await sleep(450); } };
}

// Lukis bebas (jari). r = { prompt, minInk }
export function draw(stage, r, api, { free = false } = {}) {
  const pad = h('div', { class: 'draw-pad' });
  const cv = h('canvas');
  pad.appendChild(cv);
  let g, scale = 2;
  const fit = () => {
    const b = pad.getBoundingClientRect();
    const old = cv.width ? cv.toDataURL() : null;
    cv.width = Math.max(10, b.width * scale); cv.height = Math.max(10, b.height * scale);
    g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    if (old) { const im = new Image(); im.onload = () => g.drawImage(im, 0, 0, cv.width, cv.height); im.src = old; }
  };
  let size = 10, eraser = false, ink = 0;
  const pal = paletteEl(() => { eraser = false; api.sfx.tap(); }, ['merah', 'oren', 'kuning', 'hijau', 'biru', 'ungu', 'merahjambu', 'coklat', 'hitam']);
  const sizes = h('div', { class: 'tools' }, [6, 12, 22].map((s) => {
    const b = h('button', { class: 'btn-round', type: 'button', 'aria-label': `berus ${s}` }, h('span', { style: { display: 'block', width: s + 'px', height: s + 'px', borderRadius: '50%', background: '#3d3256' } }));
    b.addEventListener('click', () => { size = s; eraser = false; api.sfx.tap(); });
    return b;
  }));
  const er = h('button', { class: 'btn-round', type: 'button', 'aria-label': 'pemadam' }, '🧽');
  er.addEventListener('click', () => { eraser = true; api.sfx.tap(); });
  const clr = h('button', { class: 'btn-round', type: 'button', 'aria-label': 'padam semua' }, '🗑️');
  clr.addEventListener('click', () => { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); ink = 0; });
  sizes.append(er, clr);
  let drawing = false, last = null;
  const pt = (e) => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) * scale, (e.clientY - b.top) * scale]; };
  const line = (a, b2) => {
    g.strokeStyle = eraser ? '#fff' : colorById(pal.get()).hex; g.lineWidth = (eraser ? 30 : size) * scale; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(...a); g.lineTo(...b2); g.stroke();
    ink += Math.hypot(b2[0] - a[0], b2[1] - a[1]);
    if (!free && ink > (r.minInk || 600) && doneBtn.disabled) doneBtn.disabled = false;
  };
  cv.addEventListener('pointerdown', (e) => { e.preventDefault(); drawing = true; cv.setPointerCapture?.(e.pointerId); last = pt(e); line(last, [last[0] + 0.1, last[1]]); });
  cv.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pt(e); line(last, p); last = p; });
  const up = () => { drawing = false; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  const doneBtn = h('button', { class: 'btn green', type: 'button', disabled: true }, h('span', { class: 'emo' }, '✅'), 'Siap!');
  doneBtn.addEventListener('click', () => api.finish());
  if (r.prompt) stage.appendChild(h('div', { class: 'prompt-row' }, r.ref ? h('span', { class: 'prompt-big', style: { fontSize: '64px' } }, h('span', { class: 'emo' }, r.ref)) : null, h('div', { class: 'prompt-text' }, r.prompt)));
  stage.appendChild(h('div', { class: 'row-wrap' }, pad));
  stage.appendChild(pal.el); pal.el.style.maxWidth = '560px'; pal.el.style.margin = '0 auto';
  stage.appendChild(sizes);
  if (!free) stage.appendChild(h('div', { class: 'row-wrap' }, doneBtn));
  requestAnimationFrame(fit);
  const ro = new ResizeObserver(() => fit());
  ro.observe(pad);
  return {
    cleanup() { ro.disconnect(); },
    canvas: cv,
    async solve() { await sleep(50); line([10, 10], [900, 900]); doneBtn.disabled = false; doneBtn.click(); },
  };
}

export { PALETTE, COLORS, shakeEl };
