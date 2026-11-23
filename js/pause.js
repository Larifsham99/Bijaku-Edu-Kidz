// =====================================================================
//  MENU JEDA & KELUAR (dikongsi semua permainan)
// =====================================================================
import { h } from './ui.js';
import { icon } from './icons.js';
import { sfx, stopSpeak, synth } from './audio.js';
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
