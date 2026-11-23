// =====================================================================
//  PUJIAN BERSAMA BIJAKU — suara pujian/galakan + reben "Hebat!" bersayap.
//  Digunakan oleh semua permainan (asal & modul berasingan) supaya
//  ucapan dan rupa sambutan sama di seluruh aplikasi.
//  Ayat diambil daripada senarai yang sudah dirakam (PRAISE / ENCOURAGE / TALK).
// =====================================================================
import { h } from './ui.js';
import { speak } from './audio.js';
import { settings } from './store.js';
import { PRAISE, ENCOURAGE, ISLAMIC_PRAISE, ISLAMIC_ENCOURAGE } from './data/content.js';
import { TALK } from './talk.js';
import { cameraAllowed, cameraSupported } from './camera.js';
import { sfx } from './audio.js';

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const islamic = () => settings().islamic !== false;

// Perkataan ringkas untuk reben (paparan)
export const RIBBON_WORDS = ['Hebat!', 'Tahniah!', 'Syabas!', 'Terbaik!', 'Bijak!', 'Cemerlang!', 'Mantap!', 'Pandai!'];

export const praiseText = () => (islamic() && Math.random() < 0.2 ? pick(ISLAMIC_PRAISE) : pick(PRAISE));
export const encourageText = () => (islamic() && Math.random() < 0.25 ? pick(ISLAMIC_ENCOURAGE) : pick(ENCOURAGE));

// kind: 'good' (jawapan betul) | 'try' (cuba lagi) | 'done' (level selesai)
export function cheer(kind = 'good', { perfect = false } = {}) {
  (globalThis.__cheers ||= []).push(kind); // untuk ujian
  if (kind === 'try') return speak(encourageText(), { mood: 'galakan' });
  if (kind === 'done') {
    const msg = perfect ? pick(TALK.doneAll) : pick(TALK.done);
    return speak(`${islamic() ? 'Alhamdulillah! ' : ''}${msg}`, { mood: 'pujian' });
  }
  return speak(praiseText(), { mood: 'pujian' });
}

// Reben bersayap dengan bintang besar (gaya sambutan BIJAKU)
export function ribbon(word = pick(RIBBON_WORDS), { sub = '', stars = 0, max = 3 } = {}) {
  return h('div', { class: 'bj-ribbon', role: 'status', 'aria-label': `${word} ${sub}`.trim() },
    h('div', { class: 'bj-rb-burst', 'aria-hidden': 'true' }),
    h('div', { class: 'bj-rb-top', 'aria-hidden': 'true', html: WINGS }),
    h('div', { class: 'bj-rb-band' }, h('span', { class: 'bj-rb-tail l' }), h('b', {}, word), h('span', { class: 'bj-rb-tail r' })),
    sub ? h('div', { class: 'bj-rb-sub' }, sub) : null,
    stars ? h('div', { class: 'bj-rb-stars', 'aria-hidden': 'true' }, Array.from({ length: max }, (_, i) => h('i', { class: i < stars ? 'on' : '', style: `animation-delay:${0.35 + i * 0.2}s`, html: STAR }))) : null);
}

// Reben sementara di tengah skrin (contoh: setiap perkataan betul)
export function flashRibbon(word, { sub = '', ms = 1300, parent = document.body } = {}) {
  const wrap = h('div', { class: 'bj-flash' }, ribbon(word, { sub }));
  parent.appendChild(wrap);
  setTimeout(() => wrap.classList.add('out'), ms);
  setTimeout(() => wrap.remove(), ms + 400);
  return wrap;
}

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" fill="#ffd23f" stroke="#e08a00" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 9.5l1.5-.3" stroke="#fff6c9" stroke-width="1.6" stroke-linecap="round"/></svg>';
const WINGS = `<svg viewBox="0 0 220 90">
  <g fill="#fff" stroke="#f3c64b" stroke-width="2.5" stroke-linejoin="round">
    <path d="M100 58 C70 50 40 52 8 36 C24 34 30 30 34 24 C24 22 18 18 14 10 C40 18 60 16 82 30 C88 22 94 20 100 24 Z"/>
    <path d="M120 58 C150 50 180 52 212 36 C196 34 190 30 186 24 C196 22 202 18 206 10 C180 18 160 16 138 30 C132 22 126 20 120 24 Z"/>
  </g>
  <path d="M110 4l11 22 24 3.5-17.5 17 4 24L110 59l-21.5 11.5 4-24L75 29.5 99 26z" fill="#ffd23f" stroke="#e08a00" stroke-width="3" stroke-linejoin="round"/>
  <path d="M100 30l6-1" stroke="#fff6c9" stroke-width="4" stroke-linecap="round"/>
</svg>`;

// Butang "Selfie Juara" pada skrin kejayaan. Modul kamera dimuat hanya apabila ditekan.
export function selfieButton(label = 'Juara hari ini!') {
  if (!cameraAllowed() || !cameraSupported()) return null;
  return h('button', { class: 'bj-selfie-btn', type: 'button', onclick: (e) => { e.stopPropagation(); sfx.tap(); import('./selfie.js').then((m) => m.openSelfie(label)); } }, h('span', { class: 'emo' }, '📸'), 'Selfie Juara');
}
