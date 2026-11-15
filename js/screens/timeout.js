// Had masa bermain yang ditetapkan oleh ibu bapa
import { h, emo, todayKey } from '../ui.js';
import { go } from '../nav.js';
import { settings, todayPlaySeconds, profile, save } from '../store.js';
import { parentGate } from './shared.js';
import { speak } from '../audio.js';

export function limitSeconds(p) {
  const lim = settings().timeLimit;
  if (!lim) return Infinity;
  return (lim + (p.extraTime?.[todayKey()] || 0)) * 60;
}
export function overLimit(p) { return todayPlaySeconds(p) >= limitSeconds(p); }

export function timeoutScreen() {
  const p = profile();
  setTimeout(() => speak(`Masa bermain hari ini sudah tamat. Jom rehatkan mata, ${p.name}! Kita main lagi esok.`), 300);
  return h('div', { class: 'screen' }, h('div', { class: 'timeout' },
    h('div', { class: 'emo float' }, '😴'),
    h('h1', { style: { margin: 0, fontSize: '40px' } }, 'Masa Rehat!'),
    h('p', { class: 'muted', style: { fontSize: '22px', margin: 0 } }, 'Masa bermain hari ini sudah tamat. Jom rehatkan mata, minum air dan bermain di luar!'),
    h('div', { style: { fontSize: '60px' } }, emo('🌳🚲💧')),
    h('button', { class: 'btn ghost', type: 'button', onclick: () => parentGate(() => {
      (p.extraTime ||= {})[todayKey()] = (p.extraTime[todayKey()] || 0) + 15; save(); go('/');
    }, { reason: 'Ibu bapa boleh menambah 15 minit masa bermain.' }) }, emo('🔒'), 'Ibu bapa: tambah 15 minit'),
    h('button', { class: 'btn ghost small', type: 'button', onclick: () => go('/ibubapa') }, 'Ruang Ibu Bapa')));
}
