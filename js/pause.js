// =====================================================================
//  MENU JEDA & KELUAR (dikongsi semua permainan)
// =====================================================================
import { h } from './ui.js';
import { icon } from './icons.js';
import { sfx, stopSpeak, speak, synth } from './audio.js';
import { go } from './nav.js';

let openBox = null;
export const pauseOpen = () => !!openBox?.isConnected;

// { onResume, restart: path, map: path, mapLabel }
export function pauseMenu({ onResume, restart, map, mapLabel = 'Peta' } = {}) {
  if (pauseOpen()) { closePause(true); return; }
  stopSpeak();
  synth.tone({ type: 'sine', f: 660, f2: 440, dur: 0.12, vol: 0.09 });
  dispatchEvent(new CustomEvent('bj-pause'));
  const close = (resume) => {
    openBox?.remove(); openBox = null;
    if (resume) { synth.tone({ type: 'sine', f: 440, f2: 760, dur: 0.12, vol: 0.09 }); dispatchEvent(new CustomEvent('bj-resume')); onResume?.(); }
  };
  const b = (cls, ic, label, fn) => h('button', { class: `bj-pb ${cls}`, type: 'button', onclick: (e) => { e.stopPropagation(); sfx.tap(); fn(); } }, icon(ic), h('span', {}, label));
  openBox = h('div', { class: 'bj-pause-back', role: 'dialog', 'aria-label': 'Rehat', onclick: (e) => { if (e.target === openBox) close(true); } },
    h('div', { class: 'bj-pause' },
      h('div', { class: 'bj-pz' }, h('span', { class: 'bj-pz-ic' }, icon('pause')), h('b', {}, 'Rehat sekejap')),
      b('go', 'play', 'Sambung', () => close(true)),
      h('div', { class: 'bj-pgrid' },
        b('home', 'home', 'Rumah', () => { close(false); go('/'); }),
        map ? b('', 'map', mapLabel, () => { close(false); go(map); }) : null,
        restart ? b('', 'replay', 'Mula semula', () => { close(false); go(restart); }) : null)));
  document.body.appendChild(openBox);
  closePause = close;
}
export let closePause = () => {};

// Keluar dari aplikasi (butang kembali di skrin utama)
export function exitDialog() {
  if (document.querySelector('.bj-exit-back')) { document.querySelector('.bj-exit-back').remove(); return; }
  synth.tone({ type: 'triangle', f: 520, f2: 390, dur: 0.18, vol: 0.1 });
  const back = h('div', { class: 'bj-pause-back bj-exit-back', role: 'dialog' },
    h('div', { class: 'bj-pause' },
      h('div', { class: 'bj-wave', 'aria-hidden': 'true' }, '👋'),
      h('b', { class: 'bj-exit-t' }, 'Mahu keluar dari BIJAKU?'),
      h('button', { class: 'bj-pb go', type: 'button', onclick: () => { sfx.tap(); back.remove(); } }, icon('play'), h('span', {}, 'Tidak, main lagi')),
      h('button', { class: 'bj-pb', type: 'button', onclick: () => leave(back) }, icon('close'), h('span', {}, 'Ya, keluar'))));
  document.body.appendChild(back);
  speak('Mahu keluar?');
}
function leave(back) {
  [523, 440, 349].forEach((f, i) => synth.tone({ type: 'triangle', f, t: i * 0.12, dur: 0.2, vol: 0.1 }));
  speak('Jumpa lagi!', { mood: 'pujian' });
  back.querySelector('.bj-pause').replaceChildren(h('div', { class: 'bj-wave' }, '👋'), h('b', { class: 'bj-exit-t' }, 'Jumpa lagi!'), h('small', {}, 'Kamu boleh tutup aplikasi sekarang.'),
    h('button', { class: 'bj-pb go', type: 'button', onclick: () => { sfx.tap(); back.remove(); } }, icon('play'), h('span', {}, 'Kembali bermain')));
  // aplikasi yang dipasang (PWA): keluar ke skrin utama telefon
  setTimeout(() => { try { window.__bjLeaving = true; history.back(); } catch { /* */ } try { window.close(); } catch { /* */ } }, 900);
}
