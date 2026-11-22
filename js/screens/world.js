// DUNIA BIJAKU: peta pulau isometrik 2.5D — setiap pulau ialah satu permainan
import { h } from '../ui.js';
import { go } from '../nav.js';
import { profile } from '../store.js';
import { sfx, speak } from '../audio.js';
import { icon } from '../icons.js';
import { brandLogo, shade } from '../brand.js';
import { SHELVES, ALL_IDS, gameInfo, openGame, gameArt, isOff, lockIc } from './catalog.js';
import { tabBar } from './home.js';

const STEP = 168;     // jarak menegak antara pulau (px)
const TOP = 70;

// Blok isometrik: permukaan atas + dua sisi
function isle(c) {
  const t = shade(c, 0.35), l = shade(c, -0.05), r = shade(c, -0.3);
  return `<svg viewBox="0 0 160 112" aria-hidden="true">
    <ellipse cx="80" cy="100" rx="70" ry="12" fill="#000" opacity=".12"/>
    <path d="M10 40 L80 75 V97 L10 62 Z" fill="${l}"/>
    <path d="M150 40 L80 75 V97 L150 62 Z" fill="${r}"/>
    <path d="M80 5 L150 40 L80 75 L10 40 Z" fill="${t}"/>
    <path d="M80 5 L150 40 L80 75 L10 40 Z" fill="url(#bjShine)"/>
    <path d="M24 44 l6 3M132 44 l-6 3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <ellipse cx="80" cy="40" rx="34" ry="13" fill="#000" opacity=".08"/>
  </svg>`;
}

export function worldScreen() {
  const p = profile();
  if (!p) { setTimeout(() => go('/'), 0); return h('div'); }
  const scr = h('div', { class: 'screen bj-world' }, h('div', { class: 'bj-sky', 'aria-hidden': 'true' }));
  scr.appendChild(h('header', { class: 'bj-wtop' },
    h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { sfx.tap(); go('/'); } }, icon('back')),
    h('div', { class: 'bj-wtitle' }, h('b', {}, 'Dunia'), brandLogo({ size: 'sm', by: false })),
    h('span', { class: 'bj-pill' }, icon('star'), h('b', {}, p.stars))));
  speak('Jom teroka Dunia Bijaku! Pilih satu pulau.');

  const ids = ALL_IDS;
  const H = TOP + ids.length * STEP + 40;
  const pos = ids.map((_, i) => ({ x: [26, 74, 50, 74, 26, 50][i % 6], y: TOP + i * STEP }));
  const d = pos.map((q, i) => (i ? `S ${(pos[i - 1].x + q.x) / 2} ${q.y - STEP / 2} ${q.x} ${q.y + 40}` : `M ${q.x} ${q.y + 40}`)).join(' ');
  const map = h('div', { class: 'bj-map', style: { height: `${H}px` } });
  map.insertAdjacentHTML('beforeend', `<svg class="bj-path" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="bjShine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 17" vector-effect="non-scaling-stroke" opacity=".95"/></svg>`);
  // awan hiasan
  for (let y = 120; y < H; y += 420) {
    map.appendChild(h('span', { class: 'bj-cloud', style: { top: `${y}px`, left: `${(y / 7) % 70}%`, animationDelay: `${-(y % 9)}s` } }));
  }
  // label kategori
  let k = 0;
  SHELVES.forEach((s) => {
    map.appendChild(h('div', { class: 'bj-zone', style: { top: `${TOP + k * STEP - 46}px` } }, s.t));
    k += s.ids.length;
  });
  ids.forEach((id, i) => {
    const g = gameInfo(id, p);
    const off = isOff(id);
    const done = g.done;
    const stars = done === null ? null : Math.min(3, Math.floor(done / 17) + (done > 0 ? 1 : 0));
    map.appendChild(h('button', { class: `bj-isle ${off ? 'locked' : ''}`, type: 'button', 'aria-label': g.n, style: { left: `${pos[i].x}%`, top: `${pos[i].y}px`, animationDelay: `${i * 0.04}s` }, onclick: () => openGame(g) },
      h('span', { class: 'bj-isle-base', html: isle(g.c) }),
      h('span', { class: 'bj-isle-art' }, gameArt(g)),
      h('span', { class: 'bj-isle-lbl' }, g.n,
        stars === null ? h('small', { class: 'bj-new' }, 'BAHARU') : h('small', {}, '★'.repeat(stars) + '☆'.repeat(3 - stars), ` ${done}/50`)),
      off ? lockIc() : null));
  });
  scr.appendChild(map);
  scr.appendChild(tabBar('dunia'));
  return scr;
}
