// Pembantu DOM kecil
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'style') el.setAttribute('style', v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  appendKids(el, children);
  return el;
}
function appendKids(el, kids) {
  for (const c of kids.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
export const emo = (e, cls = '') => h('span', { class: `emo ${cls}` }, e);

export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

// __dcTimeScale membolehkan ujian automatik berjalan lebih pantas
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms * (globalThis.__dcTimeScale || 1)));

let toastTimer;
export function toast(text, kind = 'good', emoji = '') {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = h('div', { class: `toast ${kind}` }, emoji ? emo(emoji) : null, h('span', {}, text));
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 1500);
}

export function confetti(n = 28, set = ['⭐', '🎉', '✨', '🌟', '🎈', '💖']) {
  for (let i = 0; i < n; i++) {
    const c = h('div', { class: 'confetti' }, set[i % set.length]);
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDuration = 1.6 + Math.random() * 1.8 + 's';
    c.style.animationDelay = Math.random() * 0.4 + 's';
    c.style.fontSize = 20 + Math.random() * 22 + 'px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

export function modal(content, { onClose, dismissable = true } = {}) {
  const back = h('div', { class: 'modal-back' });
  const box = h('div', { class: 'modal', role: 'dialog' });
  appendKids(box, [content]);
  back.appendChild(box);
  const close = () => { back.remove(); onClose && onClose(); };
  if (dismissable) back.addEventListener('click', (e) => { if (e.target === back) close(); });
  document.body.appendChild(back);
  return { close, box };
}

// Seret & lepas berasaskan Pointer Events (sentuhan + tetikus)
// opts: { getZones: () => Element[], onDrop(zone, el) => boolean (true = terima), onStart, ghostFrom }
export function draggable(el, opts) {
  let ghost = null, start = null, hover = null, moved = false;
  const zoneAt = (x, y) => {
    const zones = opts.getZones();
    if (ghost) ghost.style.display = 'none';
    const under = document.elementFromPoint(x, y);
    if (ghost) ghost.style.display = '';
    if (!under) return null;
    return zones.find((z) => z === under || z.contains(under)) || null;
  };
  el.addEventListener('pointerdown', (e) => {
    if (el.classList.contains('placed') || el.dataset.lock === '1') return;
    e.preventDefault();
    start = { x: e.clientX, y: e.clientY };
    moved = false;
    const r = el.getBoundingClientRect();
    ghost = el.cloneNode(true);
    ghost.classList.add('drag-ghost');
    ghost.style.width = r.width + 'px';
    ghost.style.height = r.height + 'px';
    ghost.style.left = e.clientX + 'px';
    ghost.style.top = e.clientY + 'px';
    ghost.style.margin = '0';
    document.body.appendChild(ghost);
    el.style.opacity = '0.35';
    el.setPointerCapture?.(e.pointerId);
    opts.onStart && opts.onStart(el);
  });
  el.addEventListener('pointermove', (e) => {
    if (!ghost) return;
    if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 6) moved = true;
    ghost.style.left = e.clientX + 'px';
    ghost.style.top = e.clientY + 'px';
    const z = zoneAt(e.clientX, e.clientY);
    if (z !== hover) { hover && hover.classList.remove('hover'); hover = z; hover && hover.classList.add('hover'); }
  });
  const end = (e) => {
    if (!ghost) return;
    const z = e.type === 'pointercancel' ? null : zoneAt(e.clientX, e.clientY);
    hover && hover.classList.remove('hover');
    hover = null;
    ghost.remove(); ghost = null;
    el.style.opacity = '';
    if (z) opts.onDrop(z, el);
    else if (!moved && opts.onTap) opts.onTap(el);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

export function fmtTime(sec) {
  sec = Math.round(sec);
  const h2 = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  if (h2) return `${h2} jam ${m} min`;
  if (m) return `${m} min`;
  return `${sec} saat`;
}

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Jalankan fn selepas ms, hanya jika pengguna masih di skrin (hash) yang sama
export function later(fn, ms) {
  const here = location.hash;
  return setTimeout(() => { if (location.hash === here) fn(); }, ms);
}
