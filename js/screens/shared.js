// Komponen UI bersama
import { h, emo, modal } from '../ui.js';
import { go } from '../nav.js';
import { AVATARS, COSTUMES, CHARACTERS } from '../data/content.js';
import { speak, sfx } from '../audio.js';
import { playerLevel } from '../store.js';

export function avatarEl(p, cls = '') {
  const av = AVATARS.find((a) => a.id === p.avatar) || AVATARS[0];
  const hat = COSTUMES.find((c) => c.id === p.wear?.hat);
  const acc = COSTUMES.find((c) => c.id === p.wear?.acc);
  return h('div', { class: `avatar ${cls}` }, av.e,
    hat && hat.e ? h('span', { class: 'hat emo' }, hat.show || hat.e) : null,
    acc && acc.e ? h('span', { class: 'acc emo' }, acc.e) : null);
}

export function topbar(title, backTo = '/', right = null) {
  return h('div', { class: 'topbar' },
    backTo !== null ? h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { sfx.tap(); go(backTo); } }, '⬅️') : h('div', { class: 'spacer' }),
    h('div', { class: 'title' }, title),
    right || h('div', { class: 'spacer' }));
}

export function charOf(id) { return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0]; }

// Karakter dengan gelembung kata. Mengembalikan { el, say(text, sub) }
export function guide(charId, text = '', { speakNow = false } = {}) {
  const ch = charOf(charId);
  const bubbleText = h('span', {}, text);
  const sub = h('small', {});
  const charBtn = h('button', { class: 'char', type: 'button', 'aria-label': ch.n }, ch.e);
  const el = h('div', { class: 'guide' }, charBtn, h('div', { class: 'bubble' }, bubbleText, sub));
  let last = text;
  charBtn.addEventListener('click', () => { if (last) speak(last); });
  const say = (t, s = '', { voice = true } = {}) => {
    last = t;
    bubbleText.textContent = t;
    sub.textContent = s;
    el.querySelector('.bubble').animate([{ transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 200 });
    if (voice) speak(t);
  };
  if (speakNow && text) speak(text);
  return { el, say, repeat: () => last && speak(last) };
}

export function statPills(p) {
  const lv = playerLevel(p);
  return h('div', { class: 'stats' },
    h('span', { class: 'pill', title: 'Bintang' }, emo('⭐'), p.stars),
    h('span', { class: 'pill', title: 'Syiling' }, emo('🪙'), p.coins),
    h('span', { class: 'pill', title: 'Trofi' }, emo('🏆'), p.trophies.length),
    h('span', { class: 'pill', title: 'Level pemain' }, emo('🎖️'), `Lv ${lv.lvl}`));
}

let parentOkAt = 0;
export const parentOkRecently = () => Date.now() - parentOkAt < 15 * 60 * 1000;
export const lockParent = () => { parentOkAt = 0; };

// Pintu ibu bapa: soalan darab dua digit yang sukar dijawab kanak-kanak 4–5 tahun
export function parentGate(onPass, { reason = 'Ruang ini untuk ibu bapa sahaja.' } = {}) {
  const a = 6 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
  const words = ['', '', '', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas'];
  const input = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'jawapan', style: { fontSize: '28px', textAlign: 'center', width: '160px', padding: '10px', borderRadius: '16px', border: '3px solid #e1d8ef' } });
  const msg = h('p', { style: { color: '#d35400', minHeight: '24px' } }, '');
  const content = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' } },
    h('div', { class: 'emo', style: { fontSize: '54px' } }, '🔒'),
    h('h2', {}, 'Pengesahan Ibu Bapa'),
    h('p', {}, reason),
    h('p', { style: { color: '#3d3256', fontSize: '22px' } }, `Taip jawapan bagi: ${words[a]} darab ${words[b]}`),
    input, msg,
    h('div', { class: 'row' },
      h('button', { class: 'btn ghost', type: 'button', onclick: () => m.close() }, 'Batal'),
      h('button', { class: 'btn green', type: 'button', onclick: check }, 'Sahkan')));
  const m = modal(content);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  setTimeout(() => input.focus(), 50);
  function check() {
    if (parseInt(input.value, 10) === a * b) { parentOkAt = Date.now(); m.close(); onPass(); }
    else { msg.textContent = 'Jawapan tidak tepat. Sila cuba lagi.'; input.value = ''; }
  }
  return m;
}

export function confirmBox(text, onYes, { yes = 'Ya', no = 'Tidak', emoji = '🤔' } = {}) {
  const m = modal(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' } },
    h('div', { class: 'emo', style: { fontSize: '60px' } }, emoji),
    h('h2', { style: { fontSize: '26px' } }, text),
    h('div', { class: 'row' },
      h('button', { class: 'btn ghost', type: 'button', onclick: () => m.close() }, no),
      h('button', { class: 'btn green', type: 'button', onclick: () => { m.close(); onYes(); } }, yes))));
  return m;
}
