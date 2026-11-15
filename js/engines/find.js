// Enjin cari objek tersembunyi dalam pemandangan & cari perbezaan
import { h, sleep } from '../ui.js';
import { hintEl, shakeEl } from './common.js';

// r = { bg: [c1,c2], items: [{ e, x, y, s, target, rot, op }], targets: n, targetE }
export function find(stage, r, api) {
  const scene = h('div', { class: 'scene', style: { background: `linear-gradient(180deg, ${r.bg[0]}, ${r.bg[1]})` } });
  const left = r.items.filter((it) => it.target).length;
  const tracker = h('div', { class: 'targets' }, Array.from({ length: left }, () => h('span', {}, r.targetE)));
  let found = 0, wrong = 0, done = false;
  const tEls = [];
  r.items.forEach((it) => {
    const b = h('button', { class: 'it', type: 'button', 'aria-label': it.target ? 'sasaran' : 'hiasan', style: { left: it.x + '%', top: it.y + '%', fontSize: `calc(${it.s} * min(94vw, 640px) / 100)`, transform: `translate(-50%,-50%) rotate(${it.rot || 0}deg)`, opacity: it.op ?? 1, zIndex: it.z || 1 } }, it.e);
    b.addEventListener('click', (e) => { e.stopPropagation(); tap(b, it); });
    if (it.target) tEls.push(b);
    scene.appendChild(b);
  });
  stage.appendChild(tracker);
  stage.appendChild(scene);
  function tap(b, it) {
    if (done || b.dataset.got) return;
    if (it.target) {
      b.dataset.got = '1'; b.classList.add('found'); b.style.opacity = 1;
      tracker.children[found].classList.add('got');
      found++;
      api.sfx.coin();
      if (found >= left) { done = true; api.finish(); } else api.good(b, { quiet: true, silent: true });
    } else {
      wrong++;
      b.animate([{ transform: b.style.transform }, { transform: b.style.transform + ' scale(1.2)' }, { transform: b.style.transform }], { duration: 250 });
      if (wrong % 2 === 0) api.bad(b, { soft: true });
      if (wrong >= 4) { const nxt = tEls.find((x) => !x.dataset.got); if (nxt) { nxt.style.opacity = 1; nxt.animate([{ filter: 'drop-shadow(0 0 0 #fff)' }, { filter: 'drop-shadow(0 0 12px #ff9f43)' }], { duration: 600, iterations: 4, direction: 'alternate' }); } }
    }
  }
  return { async solve() { for (const b of tEls) { b.click(); await sleep(10); } } };
}

// r = { cols, left: [e...], right: [e...], diffs: [indeks...] }
export function diff(stage, r, api) {
  const mk = (arr) => {
    const p = h('div', { class: 'diff-pane', style: `--cols:${r.cols}` });
    const els = arr.map((e, i) => { const b = h('button', { type: 'button', 'aria-label': 'petak' }, e); b._i = i; p.appendChild(b); return b; });
    return { p, els };
  };
  const A = mk(r.left), B = mk(r.right);
  const tracker = h('div', { class: 'targets' }, r.diffs.map(() => h('span', {}, '🔍')));
  stage.appendChild(tracker);
  stage.appendChild(h('div', { class: 'diff-wrap' }, A.p, B.p));
  const got = new Set();
  let wrong = 0;
  const tap = (i) => {
    if (got.has(i)) return;
    if (r.diffs.includes(i)) {
      got.add(i);
      A.els[i].classList.add('hit'); B.els[i].classList.add('hit');
      tracker.children[got.size - 1].textContent = '✅';
      api.sfx.coin();
      if (got.size >= r.diffs.length) api.finish(); else api.good(B.els[i], { quiet: true, silent: true });
    } else {
      wrong++;
      shakeEl(A.els[i]); shakeEl(B.els[i]);
      api.bad(B.els[i], { soft: wrong % 2 === 1 });
      if (wrong >= 3) { const d = r.diffs.find((x) => !got.has(x)); hintEl(B.els[d]); }
    }
  };
  [A, B].forEach((P) => P.els.forEach((b) => b.addEventListener('click', () => tap(b._i))));
  return { async solve() { for (const d of r.diffs) { tap(d); await sleep(10); } } };
}
