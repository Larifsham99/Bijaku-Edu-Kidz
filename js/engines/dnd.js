// Enjin seret & lepas: padanan (match), mengelaskan (sort), slot (susun / eja / lengkapkan)
import { h, draggable, sleep } from '../ui.js';
import { face, hintEl, bounce } from './common.js';

function tile(item, api, cls = '') {
  const isTxt = item.t !== undefined && !item.e && !item.shape;
  return h('button', { class: `drag-src ${isTxt ? 'txt' : ''} ${cls}`, type: 'button' }, face(item, { dual: api.dual }));
}

// Pemilihan dengan ketik (alternatif kepada seret): ketik item, kemudian ketik sasaran
function tapSelect() {
  let sel = null;
  return {
    get: () => sel,
    set(el) { if (sel) sel.classList.remove('sel'); sel = el; if (el) { el.classList.add('sel'); el.style.boxShadow = '0 0 0 5px #ff9f43'; } },
    clear() { if (sel) { sel.classList.remove('sel'); sel.style.boxShadow = ''; } sel = null; },
  };
}

// ---------------- MATCH ----------------
// r.pairs = [{ id, src: face, dst: face }]
export function match(stage, r, api) {
  const board = h('div', { class: 'match-board' });
  const rows = new Map();
  const order = r.dstOrder || r.pairs.map((p) => p.id);
  order.forEach((id) => {
    const p = r.pairs.find((x) => x.id === id);
    const slot = h('div', { class: 'slot drop-zone' });
    const row = h('div', { class: 'match-target drop-zone', dataset: { id } }, h('div', { class: 'tgt' }, face(p.dst, { dual: api.dual })), h('span', { style: { fontSize: '28px' } }, '➜'), slot);
    row.style.border = 'none'; row.style.background = 'transparent';
    row._slot = slot;
    if (p.dst.sound) {
      const tgt = row.querySelector('.tgt');
      tgt.style.cursor = 'pointer';
      tgt.style.background = '#48dbfb'; tgt.style.borderRadius = '20px'; tgt.style.padding = '6px 12px';
      tgt.addEventListener('click', (e) => { e.stopPropagation(); api.playSound(p.dst.sound); });
    }
    rows.set(id, row);
    board.appendChild(row);
  });
  const tray = h('div', { class: 'tray' });
  const tiles = new Map();
  const sel = tapSelect();
  const srcOrder = r.srcOrder || r.pairs.map((p) => p.id);
  srcOrder.forEach((id) => {
    const p = r.pairs.find((x) => x.id === id);
    const t = tile(p.src, api);
    t.dataset.id = id;
    tiles.set(id, t);
    draggable(t, {
      getZones: () => [...rows.values()].filter((z) => !z.dataset.done),
      onStart: () => api.sfx.pick(),
      onDrop: (zone) => attempt(t, zone),
      onTap: () => { api.sfx.tap(); sel.set(t); if (p.src.say) api.speak(p.src.say); },
    });
    tray.appendChild(t);
  });
  rows.forEach((row) => row.addEventListener('click', () => { const s = sel.get(); if (s) { sel.clear(); attempt(s, row); } }));
  stage.appendChild(board);
  stage.appendChild(tray);

  let left = r.pairs.length, wrong = 0;
  function attempt(t, row) {
    if (row.dataset.done || t.classList.contains('placed')) return;
    if (row.dataset.id === t.dataset.id) {
      row.dataset.done = '1';
      row._slot.classList.add('filled');
      row._slot.appendChild(h('span', {}, face(r.pairs.find((p) => p.id === t.dataset.id).src, { label: false })));
      t.classList.add('placed');
      left--;
      const say = r.pairs.find((p) => p.id === t.dataset.id).src.say;
      if (left === 0) api.finish({ echo: say }); else api.good(row._slot, { quiet: true });
    } else {
      bounce(t); wrong++;
      api.bad(t, { echo: r.pairs.find((p) => p.id === t.dataset.id).src.say });
      if (wrong >= 2) hintEl(rows.get(t.dataset.id)?._slot);
    }
  }
  return { async solve() { for (const [id, t] of tiles) { await sleep(40); attempt(t, rows.get(id)); } } };
}

// ---------------- SORT ----------------
// r.bins = [{ id, n, e }], r.items = [{ ...face, bin }]
export function sort(stage, r, api) {
  const bins = h('div', { class: 'bins', style: `--bins:${r.bins.length}` });
  const zones = new Map();
  r.bins.forEach((b) => {
    const items = h('div', { class: 'bin-items' });
    const head = h('div', { class: 'bin-head' }, b.e ? h('span', { class: 'emo' }, b.e) : null, b.html ? h('span', { html: b.html }) : null, h('span', {}, b.n));
    const z = h('div', { class: 'bin drop-zone', dataset: { id: b.id } }, head, items);
    if (b.bg) z.style.background = b.bg;
    z._items = items;
    zones.set(b.id, z);
    bins.appendChild(z);
  });
  const tray = h('div', { class: 'tray' });
  const sel = tapSelect();
  const tiles = [];
  r.items.forEach((it) => {
    const t = tile(it, api);
    t.dataset.bin = it.bin;
    tiles.push(t);
    draggable(t, {
      getZones: () => [...zones.values()],
      onStart: () => api.sfx.pick(),
      onDrop: (z) => attempt(t, z, it),
      onTap: () => { api.sfx.tap(); sel.set(t); if (it.say) api.speak(it.say); },
    });
    t._it = it;
    tray.appendChild(t);
  });
  zones.forEach((z) => z.addEventListener('click', (e) => { const s = sel.get(); if (s && e.target.closest('.bin') === z) { sel.clear(); attempt(s, z, s._it); } }));
  stage.appendChild(bins);
  stage.appendChild(tray);

  let left = r.items.length;
  const misses = new Map();
  function attempt(t, z, it) {
    if (t.classList.contains('placed')) return;
    if (z.dataset.id === it.bin) {
      t.classList.add('placed');
      t.style.display = 'none';
      z._items.appendChild(h('span', {}, face(it, { label: false })));
      z.classList.add('filled'); setTimeout(() => z.classList.remove('filled'), 300);
      left--;
      if (left === 0) api.finish({ echo: it.say || it.lbl }); else api.good(z, { quiet: true });
    } else {
      bounce(t);
      const m = (misses.get(t) || 0) + 1; misses.set(t, m);
      api.bad(t, { echo: it.say || it.lbl });
      if (m >= 2) hintEl(zones.get(it.bin));
    }
  }
  return { async solve() { for (const t of tiles) { await sleep(30); attempt(t, zones.get(t._it.bin), t._it); } } };
}

// ---------------- SLOTS ----------------
// r.slots = [{ v, face, given }]; r.tiles = [{ v, face }]; r.numbered (tunjuk nombor urutan)
export function slots(stage, r, api) {
  const row = h('div', { class: 'slots' });
  const sl = r.slots.map((s, i) => {
    const isTxt = r.text;
    const el = h('div', { class: `slot drop-zone ${isTxt ? 'txt' : ''} ${s.given ? 'given' : ''}` });
    if (r.numbered) el.appendChild(h('span', { class: 'num' }, i + 1));
    if (s.given) { el.appendChild(h('span', {}, face(s.face, { label: false }))); el.dataset.done = '1'; }
    el._s = s;
    row.appendChild(el);
    return el;
  });
  if (r.sep) row.style.gap = r.sep;
  const tray = h('div', { class: 'tray' });
  const sel = tapSelect();
  const tiles = r.tiles.map((tv) => {
    const t = tile(tv.face, api, 'seq-card');
    t._v = tv.v;
    t._say = tv.face.say;
    draggable(t, {
      getZones: () => sl.filter((z) => !z.dataset.done),
      onStart: () => api.sfx.pick(),
      onDrop: (z) => attempt(t, z),
      onTap: () => {
        api.sfx.tap();
        if (tv.face.say) api.speak(tv.face.say);
        // ketik = cuba masukkan ke slot kosong yang pertama
        const first = sl.find((z) => !z.dataset.done);
        if (first) attempt(t, first);
      },
    });
    tray.appendChild(t);
    return t;
  });
  stage.appendChild(row);
  stage.appendChild(tray);

  let wrong = 0;
  function attempt(t, z) {
    if (z.dataset.done || t.classList.contains('placed')) return;
    if (t._v === z._s.v) {
      z.dataset.done = '1';
      z.classList.add('filled');
      z.appendChild(h('span', {}, face(z._s.face, { label: false })));
      t.classList.add('placed');
      t.style.display = 'none';
      if (sl.every((x) => x.dataset.done)) api.finish(); else api.good(z, { quiet: true });
    } else {
      bounce(t); wrong++;
      api.bad(t, { echo: t._say });
      if (wrong >= 2) {
        const first = sl.find((x) => !x.dataset.done);
        const right = tiles.find((x) => !x.classList.contains('placed') && x._v === first?._s.v);
        hintEl(right);
      }
    }
  }
  return {
    async solve() {
      for (const z of sl) {
        if (z.dataset.done) continue;
        const t = tiles.find((x) => !x.classList.contains('placed') && x._v === z._s.v);
        await sleep(40);
        if (t) attempt(t, z);
      }
    },
  };
}
