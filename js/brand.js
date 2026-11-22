// Identiti jenama: BIJAKU oleh Mawar Ikhlas
import { h } from './ui.js';

export const BRAND = {
  name: 'BIJAKU',
  say: 'Bijaku',
  company: 'Mawar Ikhlas',
  tagline: 'Belajar Sambil Bermain, Bijak Sambil Meneroka.',
};

const LETTERS = [['B', '#ff5d5d', -6], ['I', '#ffb020', 4], ['J', '#2ec27e', -3], ['A', '#3d8bff', 5], ['K', '#9b5cff', -4], ['U', '#ff5fa2', 6]];

export const ROSE_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13.5v5.5" stroke="#2f9e6a" stroke-width="2" stroke-linecap="round"/><ellipse cx="13.4" cy="16.6" rx="3" ry="1.4" fill="#2f9e6a" transform="rotate(-25 13.4 16.6)"/><circle cx="10" cy="8.5" r="6" fill="#e64980"/><path d="M10 3.6q4.4 1.8 2.6 5.8q-4 1.4-5.4-2.6" fill="#f783ac"/><path d="M7 9.6q3 2.6 6 0" stroke="#c2255c" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>';

// Logo huruf timbul + "oleh Mawar Ikhlas"
export function brandLogo({ size = 'md', by = true, tag = 'div' } = {}) {
  return h(tag, { class: `bj-logo bj-logo-${size}`, 'aria-label': `${BRAND.name} oleh ${BRAND.company}` },
    h('span', { class: 'bj-word', 'aria-hidden': 'true' }, LETTERS.map(([ch, c, r], i) => h('i', { style: `--c:${c};--r:${r}deg;--d:${i * 0.07}s` }, ch))),
    by ? h('span', { class: 'bj-by', 'aria-hidden': 'true', html: `${ROSE_SVG}<span>oleh ${BRAND.company}</span>` }) : null);
}

// Warna: gelapkan / cerahkan heks
export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
}
