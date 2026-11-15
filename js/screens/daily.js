// Cabaran Harian: 5 permainan rawak setiap hari
import { h, emo, todayKey } from '../ui.js';
import { go } from '../nav.js';
import { profile, highestUnlocked } from '../store.js';
import { MODES } from '../modes/index.js';
import { STICKERS } from '../data/content.js';
import { hashStr } from '../rng.js';
import { topbar, guide } from './shared.js';
import { sfx } from '../audio.js';

export const DAILY_REWARD = { coins: 30, sticker: (k) => STICKERS[hashStr('pelekat' + k) % STICKERS.length] };

export function dailySet(p, key = todayKey()) {
  const day = hashStr(key);
  const base = [
    { mode: 'abc', label: 'Permainan ABC', e: '🔤' },
    { mode: 'nombor', label: 'Permainan Nombor', e: '🔢' },
    { mode: 'ingatan', label: 'Permainan Memori', e: '🧠', gens: ['kad', 'kedudukan', 'hilang', 'simon'] },
    { mode: 'minda', label: 'Permainan Logik', e: '💡' },
    day % 3 === 0 ? { mode: 'haiwan', label: 'Pengetahuan Am: Haiwan', e: '🦁' } : day % 3 === 1 ? { mode: 'harian', label: 'Pengetahuan Am: Harian', e: '🏡' } : { mode: 'kelas', label: 'Pengetahuan Am: Mengelaskan', e: '🗂️' },
  ];
  const items = base.map((b, i) => ({ ...b, level: Math.max(1, Math.min(50, highestUnlocked(p, b.mode))), seed: `${key}-${p.id}-${i}` }));
  const d = p.daily[key] || { done: [], rewarded: false };
  return { key, items, done: d.done, rewarded: d.rewarded };
}

export function dailyScreen() {
  const p = profile();
  const set = dailySet(p);
  const left = 5 - set.done.length;
  const scr = h('div', { class: 'screen' });
  scr.appendChild(topbar('📅 Cabaran Harian', '/'));
  scr.appendChild(guide('coco', left ? `Ada ${left} cabaran menunggu kamu hari ini!` : 'Syabas! Semua cabaran hari ini sudah selesai. Datang lagi esok ya!', { speakNow: true }).el);
  scr.appendChild(h('div', { class: 'daily-list' }, set.items.map((it, i) => {
    const done = set.done.includes(i);
    return h('button', { class: `daily-item ${done ? 'done' : ''}`, type: 'button', onclick: () => { sfx.tap(); go('/harian/' + i); } },
      emo(it.e), h('div', {}, h('div', {}, it.label), h('div', { class: 'muted', style: { fontSize: '15px' } }, `${MODES[it.mode].n} · tahap level ${it.level}`)), h('span', { class: 'chk' }, done ? '✅' : '▶️'));
  })));
  scr.appendChild(h('div', { class: 'panel center' },
    h('div', { style: { fontSize: '20px', fontWeight: 900 } }, 'Hadiah khas apabila kelima-lima cabaran selesai:'),
    h('div', { class: 'reward-list', style: { marginTop: '8px' } }, h('span', { class: 'pill' }, emo('🪙'), `+${DAILY_REWARD.coins} syiling`), h('span', { class: 'pill' }, emo(DAILY_REWARD.sticker(set.key)), 'Pelekat hari ini')),
    set.rewarded ? h('div', { style: { marginTop: '8px', fontWeight: 900, color: '#189a5a' } }, '✅ Hadiah telah diterima!') : null));
  return scr;
}
