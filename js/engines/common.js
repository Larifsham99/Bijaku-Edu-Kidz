import { h } from '../ui.js';
import { shapeSvg, colorById } from '../data/content.js';

// "Muka" item: { e } emoji, { t } teks, { shape, color } bentuk SVG, { swatch } warna, { html },
// pilihan tambahan: sil (siluet), scale, lbl (label), en (label English), rot (putaran)
export function face(item, { dual = false, label = true, big = false } = {}) {
  const frag = [];
  let main;
  if (item.shape) {
    main = h('span', { class: 'fshape', html: shapeSvg(item.shape, item.color ? (colorById(item.color)?.hex || item.color) : '#a77bff', item.size || '1em') });
  } else if (item.swatch) {
    const hex = colorById(item.swatch)?.hex || item.swatch;
    main = h('span', { class: 'fswatch', style: { display: 'inline-block', width: '1em', height: '1em', borderRadius: '50%', background: hex, border: '4px solid rgba(0,0,0,.08)', boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.08)' } });
  } else if (item.html) {
    main = h('span', { class: 'fhtml', html: item.html });
  } else if (item.t !== undefined) {
    main = h('span', { class: 'ftxt', style: item.font ? { fontFamily: item.font } : null }, item.t);
  } else {
    main = h('span', { class: 'emo' }, item.e);
  }
  const tf = [];
  if (item.sil) main.classList.add('silhouette');
  if (item.scale) tf.push(`scale(${item.scale})`);
  if (item.rot) tf.push(`rotate(${item.rot}deg)`);
  if (item.flip) tf.push('scaleX(-1)');
  if (tf.length) { main.style.display = 'inline-block'; main.style.transform = tf.join(' '); }
  if (item.blur) main.classList.add('blurred');
  frag.push(main);
  if (label && item.lbl) frag.push(h('span', { class: 'lbl' }, item.lbl));
  if (label && dual && item.en) frag.push(h('span', { class: 'en' }, item.en));
  return frag;
}

export const isTextual = (item) => item.t !== undefined && !item.e;

export function colsFor(n, max = 4) {
  if (n <= 3) return n;
  if (n === 4) return Math.min(4, max);
  if (n <= 6) return 3;
  return max;
}

// Tandakan elemen yang betul sebagai petunjuk selepas beberapa kesilapan
export function hintEl(el) {
  if (!el) return;
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 700, iterations: 3 });
  el.style.boxShadow = '0 0 0 6px #feca57, 0 6px 0 rgba(61,50,86,.14)';
}

export function shakeEl(el) {
  if (!el) return;
  el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong');
  setTimeout(() => el.classList.remove('wrong'), 500);
}

// Gerakkan elemen kembali (animasi "lantun")
export function bounce(el) {
  el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 350 });
}
