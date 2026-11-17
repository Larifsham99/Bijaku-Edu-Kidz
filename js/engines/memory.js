// Enjin ingatan: kad memori, ingat kedudukan, objek hilang, susunan, Simon (warna/bentuk)
import { h, sleep } from '../ui.js';
import { icon } from '../icons.js';
import { face, hintEl, shakeEl } from './common.js';
import { slots } from './dnd.js';
import { choice } from './choice.js';
import { colorById, shapeSvg } from '../data/content.js';

// r.cards = [{ pair, face }] (sudah dikocok), r.cols, r.peek (ms)
export function memory(stage, r, api) {
  const grid = h('div', { class: 'mem-grid', style: `--cols:${r.cols}` });
  const els = r.cards.map((c, i) => {
    const isTxt = c.face.t !== undefined && !c.face.e;
    const b = h('button', { class: 'mcard', type: 'button', 'aria-label': 'kad' },
      h('div', { class: 'in' }, h('div', { class: 'f' }, '❓'), h('div', { class: `b ${isTxt ? 'txt' : ''}` }, face(c.face, { label: false }))));
    b._c = c; b._i = i;
    b.addEventListener('click', () => flip(b));
    grid.appendChild(b);
    return b;
  });
  stage.appendChild(grid);
  let open = [], busy = true, pairsLeft = r.cards.length / 2, misses = 0;
  (async () => {
    if (r.peek) { els.forEach((e) => e.classList.add('open')); await sleep(r.peek); els.forEach((e) => e.classList.remove('open')); await sleep(400); }
    busy = false;
  })();
  async function flip(b) {
    if (busy || b.classList.contains('open') || b.classList.contains('done')) return;
    api.sfx.flip();
    b.classList.add('open');
    if (b._c.face.say) api.speak(b._c.face.say);
    open.push(b);
    if (open.length < 2) return;
    busy = true;
    const [a, c] = open; open = [];
    if (a._c.pair === c._c.pair) {
      await sleep(350);
      a.classList.add('done'); c.classList.add('done');
      pairsLeft--;
      busy = false;
      if (pairsLeft === 0) api.finish(); else api.good(c, { quiet: true });
    } else {
      misses++;
      // salah padan dalam permainan memori adalah sebahagian daripada permainan — galakan lembut sahaja
      api.bad(c, { soft: misses % 3 !== 0 });
      await sleep(900);
      a.classList.remove('open'); c.classList.remove('open');
      busy = false;
    }
  }
  return {
    async solve() {
      while (busy) await sleep(50);
      const groups = {};
      els.forEach((e) => (groups[e._c.pair] ||= []).push(e));
      for (const g of Object.values(groups)) { await flip(g[0]); await flip(g[1]); await sleep(10); while (busy) await sleep(20); }
    },
  };
}

function countdownBar(ms) {
  const bar = h('div', { class: 'lvl-bar', style: { width: 'min(400px, 80%)', margin: '0 auto' } }, h('i', { style: { width: '100%', transition: `width ${ms}ms linear` } }));
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.firstChild.style.width = '0%'; }));
  return bar;
}

// ---------------- RECALL ----------------
// r.variant: 'where' | 'missing' | 'order'
export function recall(stage, r, api) {
  if (r.variant === 'where') return recallWhere(stage, r, api);
  if (r.variant === 'missing') return recallMissing(stage, r, api);
  return recallOrder(stage, r, api);
}

function recallWhere(stage, r, api) {
  // r.grid = [face|null ...], r.cols, r.ask = [index...], r.showMs
  const bar = countdownBar(r.showMs);
  const grid = h('div', { class: 'cell-grid', style: `--cols:${r.cols}` });
  const cells = r.grid.map((f, i) => {
    const b = h('button', { class: 'cell', type: 'button', 'aria-label': 'petak' }, f ? face(f, { label: false }) : '');
    b._i = i; b._f = f;
    b.addEventListener('click', () => tap(b));
    grid.appendChild(b);
    return b;
  });
  const askBox = h('div', { class: 'prompt-row' });
  stage.appendChild(bar);
  stage.appendChild(askBox);
  stage.appendChild(grid);
  let phase = 'show', qi = 0, wrong = 0;
  const ask = () => {
    if (phase !== 'ask' || qi >= r.ask.length) return;
    const tgt = r.grid[r.ask[qi]];
    askBox.replaceChildren(h('span', { class: 'prompt-text' }, 'Di mana'), h('span', { class: 'prompt-big', style: { fontSize: '64px' } }, face(tgt, { label: false })), h('span', { class: 'prompt-text' }, '?'));
    api.say(`Di mana ${tgt.say || tgt.lbl || 'gambar ini'}?`);
  };
  (async () => {
    askBox.replaceChildren(h('span', { class: 'prompt-text' }, 'Ingat kedudukan gambar!'));
    await sleep(r.showMs);
    bar.remove();
    cells.forEach((c) => { c.classList.add('cover'); c.replaceChildren(''); });
    phase = 'ask';
    ask();
  })();
  function tap(b) {
    if (phase !== 'ask' || b.dataset.done) return;
    const want = r.ask[qi];
    if (b._i === want) {
      b.classList.remove('cover'); b.replaceChildren(...face(b._f, { label: false })); b.dataset.done = '1';
      qi++; wrong = 0;
      if (qi >= r.ask.length) { phase = 'end'; api.finish(); } else { api.good(b, { quiet: true }); sleep(700).then(ask); }
    } else {
      shakeEl(b); wrong++;
      // tunjuk sekejap apa di sebalik petak itu
      if (b._f) { b.classList.remove('cover'); b.replaceChildren(...face(b._f, { label: false })); setTimeout(() => { if (!b.dataset.done) { b.classList.add('cover'); b.replaceChildren(''); } }, 800); }
      api.bad(b);
      if (wrong >= 2) hintEl(cells[want]);
    }
  }
  return { async solve() { while (phase === 'show') await sleep(50); for (const i of r.ask) { tap(cells[i]); await sleep(750); } } };
}

function recallMissing(stage, r, api) {
  // r.items = [face...], r.missing = index, r.options = [face (with id)], r.showMs
  const bar = countdownBar(r.showMs);
  const row = h('div', { class: 'strip' }, r.items.map((f) => h('div', { class: 's' }, face(f, { label: false }))));
  const info = h('div', { class: 'prompt-text' }, 'Ingat semua gambar ini!');
  stage.appendChild(bar); stage.appendChild(info); stage.appendChild(row);
  let ready = false, inner = null;
  (async () => {
    await sleep(r.showMs);
    bar.remove();
    row.style.transition = 'opacity .3s'; row.style.opacity = '0';
    await sleep(500);
    stage.replaceChildren();
    const remaining = r.items.map((f, i) => (i === r.missing ? '?' : f));
    api.say('Apa yang hilang?');
    inner = choice(stage, {
      show: { k: 'strip', items: r.shuffleAfter ? r.shuffleAfter.map((i) => remaining[i]) : remaining },
      options: r.options, answer: r.answer,
    }, api);
    ready = true;
  })();
  return { async solve() { while (!ready) await sleep(50); await inner.solve(); } };
}

function recallOrder(stage, r, api) {
  // r.items = [face...] mengikut urutan; r.tiles (dikocok)
  const bar = countdownBar(r.showMs);
  const row = h('div', { class: 'slots' }, r.items.map((f, i) => h('div', { class: 'slot drop-zone given' }, h('span', { class: 'num' }, i + 1), h('span', {}, face(f, { label: false })))));
  stage.appendChild(bar);
  stage.appendChild(h('div', { class: 'prompt-text' }, 'Ingat susunan ini!'));
  stage.appendChild(row);
  let ready = false, inner = null;
  (async () => {
    await sleep(r.showMs);
    stage.replaceChildren();
    api.say('Sekarang, susun semula ikut urutan tadi, ya.');
    inner = slots(stage, { numbered: true, slots: r.items.map((f, i) => ({ v: f.v ?? i, face: f })), tiles: r.tiles }, api);
    ready = true;
  })();
  return { async solve() { while (!ready) await sleep(50); await inner.solve(); } };
}

// ---------------- SIMON (ingat susunan warna / bentuk) ----------------
// r.pads = [{ color, shape? }], r.seq = [indeks...]
export function simon(stage, r, api) {
  const pads = h('div', { class: 'simon', style: `--cols:${r.pads.length > 4 ? 3 : 2}` });
  const els = r.pads.map((p, i) => {
    const hex = colorById(p.color)?.hex || p.color;
    const b = h('button', { type: 'button', 'aria-label': p.say || 'pad', style: { background: p.shape ? '#fff' : hex } });
    if (p.shape) b.innerHTML = shapeSvg(p.shape, hex, '70%');
    b.addEventListener('click', () => press(i));
    pads.appendChild(b);
    return b;
  });
  const info = h('div', { class: 'prompt-text' }, 'Perhatikan...');
  const again = h('button', { class: 'btn small ghost', type: 'button' }, icon('replay'), 'Tunjuk lagi');
  stage.appendChild(info); stage.appendChild(pads); stage.appendChild(h('div', { class: 'row-wrap' }, again));
  let phase = 'show', pos = 0, wrong = 0;
  const lit = async (i, ms = 520) => { els[i].classList.add('lit'); api.sfx.note(i); await sleep(ms); els[i].classList.remove('lit'); await sleep(180); };
  async function demo() {
    phase = 'show'; info.textContent = 'Perhatikan...'; pos = 0;
    await sleep(600);
    for (const i of r.seq) await lit(i);
    phase = 'input'; info.textContent = 'Sekarang giliran kamu. Tekan ikut urutan, ya.';
  }
  again.addEventListener('click', () => { if (phase === 'input') demo(); });
  demo();
  async function press(i) {
    if (phase !== 'input') return;
    lit(i, 260);
    if (r.seq[pos] === i) {
      pos++;
      if (pos >= r.seq.length) { phase = 'end'; api.finish(); }
    } else {
      wrong++;
      api.bad(els[i]);
      phase = 'wait';
      await sleep(700);
      if (wrong >= 2) info.textContent = 'Tak apa. Jom tengok sekali lagi.';
      demo();
    }
  }
  return { async solve() { while (phase !== 'input') await sleep(50); for (const i of r.seq) { press(i); await sleep(30); } } };
}
