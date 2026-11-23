// Enjin puzzle jigsaw (2–12 keping) dan "lengkapkan gambar yang hilang"
import { h, draggable, sleep } from '../ui.js';
import { hintEl, bounce, shakeEl } from './common.js';

const cache = new Map();
export function picture(pic, w = 480, hgt = 480) {
  const key = `${pic.n}|${w}|${hgt}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = w; c.height = hgt;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, hgt);
  grd.addColorStop(0, pic.bg[0]); grd.addColorStop(1, pic.bg[1]);
  g.fillStyle = grd; g.fillRect(0, 0, w, hgt);
  // bulatan hiasan
  g.globalAlpha = 0.18; g.fillStyle = '#fff';
  [[0.15, 0.2, 0.12], [0.85, 0.8, 0.16], [0.8, 0.15, 0.08], [0.2, 0.85, 0.1]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x * w, y * hgt, r * w, 0, 7); g.fill(); });
  g.globalAlpha = 1;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const font = (s) => `${s}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  const spots = [[0.16, 0.16], [0.84, 0.16], [0.16, 0.84], [0.84, 0.84]];
  pic.deco.forEach((d, i) => { g.font = font(Math.round(w * 0.16)); g.fillText(d, spots[i % 4][0] * w, spots[i % 4][1] * hgt); });
  g.font = font(Math.round(Math.min(w, hgt) * 0.52));
  g.fillText(pic.main, w / 2, hgt / 2 + hgt * 0.03);
  // bingkai
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, hgt - 8);
  const url = c.toDataURL('image/png');
  cache.set(key, url);
  return url;
}

function pieceStyle(url, W, H, rows, cols, idx) {
  const r = Math.floor(idx / cols), c = idx % cols;
  const pw = W / cols, ph = H / rows;
  return { '--img': `url(${url})`, '--bs': `${W}px ${H}px`, '--bp': `${-c * pw}px ${-r * ph}px`, width: `${pw}px`, height: `${ph}px` };
}
const setVars = (el, st) => Object.entries(st).forEach(([k, v]) => el.style.setProperty(k, v));

export function puzzle(stage, r, api) {
  if (r.variant === 'missing') return missing(stage, r, api);
  const avail = Math.min((stage.clientWidth || 360) - 24, 380);
  const n0 = r.rows * r.cols;
  // ambil kira ketinggian skrin juga (telefon landskap)
  // papan + dulang kepingan mesti muat dalam papan permainan (tanpa tatal)
  const maxH = Math.max(150, Math.min((innerHeight || 700) - 230, (stage.clientHeight || 600) * 0.46));
  const W = Math.max(170, Math.min(avail, maxH, n0 <= 4 ? 260 : n0 <= 6 ? 300 : 340));
  const H = W;
  const url = picture(r.pic);
  const board = h('div', { class: 'puzzle-board', style: { gridTemplateColumns: `repeat(${r.cols}, ${W / r.cols}px)`, gridTemplateRows: `repeat(${r.rows}, ${H / r.rows}px)` } });
  const n = r.rows * r.cols;
  const slotEls = [];
  for (let i = 0; i < n; i++) {
    const s = h('div', { class: `pslot drop-zone ${r.ghost ? 'ghost' : ''}` });
    s.style.border = 'none';
    setVars(s, pieceStyle(url, W, H, r.rows, r.cols, i));
    s._i = i;
    slotEls.push(s);
    board.appendChild(s);
  }
  const preview = h('div', { style: { textAlign: 'center' } },
    h('img', { src: url, alt: r.pic.n, style: { width: '90px', height: '90px', borderRadius: '14px', boxShadow: '0 3px 0 rgba(0,0,0,.12)' } }),
    h('div', { class: 'muted', style: { fontSize: '14px' } }, r.pic.n));
  const tray = h('div', { class: 'ptray' });
  let selected = null;
  const order = r.order || Array.from({ length: n }, (_, i) => i);
  const pieces = order.map((i) => {
    const p = h('button', { class: 'piece', type: 'button', 'aria-label': `kepingan ${i + 1}` });
    setVars(p, pieceStyle(url, W, H, r.rows, r.cols, i));
    p.style.width = `${W / r.cols}px`; p.style.height = `${H / r.rows}px`;
    p._i = i;
    draggable(p, {
      getZones: () => slotEls.filter((s) => !s.dataset.done),
      onStart: () => api.sfx.pick(),
      onDrop: (z) => attempt(p, z),
      onTap: () => { api.sfx.tap(); if (selected) selected.style.outline = ''; selected = p; p.style.outline = '4px solid #ff9f43'; },
    });
    tray.appendChild(p);
    return p;
  });
  slotEls.forEach((s) => s.addEventListener('click', () => { if (selected) { const p = selected; selected.style.outline = ''; selected = null; attempt(p, s); } }));
  stage.appendChild(h('div', { class: 'puzzle-wrap' }, h('div', {}, board), h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' } }, preview, tray)));

  let left = n, wrong = 0;
  function attempt(p, s) {
    if (s.dataset.done || p.classList.contains('placed')) return;
    if (p._i === s._i) {
      s.dataset.done = '1';
      s.classList.remove('ghost');
      s.style.background = `url(${url}) no-repeat`;
      s.style.backgroundSize = `${W}px ${H}px`;
      s.style.backgroundPosition = s.style.getPropertyValue('--bp');
      p.classList.add('placed'); p.style.display = 'none';
      left--;
      api.sfx.drop();
      if (left === 0) { board.style.gap = '0'; board.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], { duration: 500 }); api.finish(); }
      else api.good(s, { quiet: true, silent: true });
    } else {
      bounce(p); wrong++;
      api.bad(p, { soft: wrong % 2 === 1 });
      if (wrong >= 2) hintEl(slotEls[p._i]);
    }
  }
  return { async solve() { for (const p of pieces) { await sleep(30); attempt(p, slotEls[p._i]); } } };
}

// Gambar dengan satu bahagian hilang: pilih kepingan yang betul
function missing(stage, r, api) {
  const W = Math.max(150, Math.min((stage.clientWidth || 360) - 24, 300, (stage.clientHeight || 600) * 0.5)), H = W;
  const url = picture(r.pic);
  const board = h('div', { class: 'puzzle-board', style: { gridTemplateColumns: `repeat(${r.cols}, ${W / r.cols}px)`, gridTemplateRows: `repeat(${r.rows}, ${H / r.rows}px)`, gap: '0' } });
  const n = r.rows * r.cols;
  let hole;
  for (let i = 0; i < n; i++) {
    const s = h('div', { class: 'pslot' });
    if (i === r.hole) { s.style.background = '#fff'; s.style.outline = '4px dashed #ff9f43'; s.style.outlineOffset = '-4px'; s.appendChild(h('div', { style: { display: 'grid', placeItems: 'center', height: '100%', fontSize: '40px', fontWeight: 900, color: '#ff9f43' } }, '?')); hole = s; }
    else { s.style.background = `url(${url}) no-repeat`; s.style.backgroundSize = `${W}px ${H}px`; const st = pieceStyle(url, W, H, r.rows, r.cols, i); s.style.backgroundPosition = st['--bp']; }
    board.appendChild(s);
  }
  const opts = h('div', { class: 'row-wrap' });
  const btns = r.options.map((o) => {
    const ourl = picture(o.pic);
    const b = h('button', { class: 'choice', type: 'button', style: { aspectRatio: 'auto', padding: '10px' } });
    const p = h('div', { class: 'piece', style: { cursor: 'pointer', boxShadow: 'none' } });
    setVars(p, pieceStyle(ourl, W, H, r.rows, r.cols, o.idx));
    p.style.width = `${W / r.cols}px`; p.style.height = `${H / r.rows}px`;
    b.appendChild(p);
    b._o = o;
    b.addEventListener('click', () => pick(b));
    opts.appendChild(b);
    return b;
  });
  stage.appendChild(h('div', { class: 'row-wrap' }, board));
  stage.appendChild(opts);
  let done = false, wrong = 0;
  function pick(b) {
    if (done) return;
    if (b._o.correct) {
      done = true;
      hole.replaceChildren(); hole.style.outline = '';
      hole.style.background = `url(${url}) no-repeat`; hole.style.backgroundSize = `${W}px ${H}px`;
      hole.style.backgroundPosition = pieceStyle(url, W, H, r.rows, r.cols, r.hole)['--bp'];
      b.classList.add('right');
      api.finish();
    } else {
      shakeEl(b); wrong++; api.bad(b);
      if (wrong >= 2) hintEl(btns.find((x) => x._o.correct));
    }
  }
  return { async solve() { pick(btns.find((x) => x._o.correct)); } };
}
