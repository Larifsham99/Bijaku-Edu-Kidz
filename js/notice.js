// =====================================================================
//  NOTIS LEVEL BERKUNCI — dipaparkan (bukan suara sahaja), supaya anak/ibu
//  bapa tahu sebab level tidak boleh dimainkan & apa yang perlu dibuat.
// =====================================================================
import { h } from './ui.js';
import { speak, sfx } from './audio.js';
import { icon } from './icons.js';

let timer = 0;
export function lockNotice(text, { action = null, actionLabel = 'Main level ini', sub = 'Level dibuka satu demi satu. Kemajuan disimpan dalam peranti ini sahaja.' } = {}) {
  document.querySelectorAll('.bj-lock-note').forEach((e) => e.remove());
  sfx.bump?.();
  const close = () => { clearTimeout(timer); box.remove(); };
  const box = h('div', { class: 'bj-lock-note', role: 'alert', onclick: (e) => { if (e.target === box) close(); } },
    h('div', { class: 'bj-lock-card' },
      h('span', { class: 'bj-lock-ic' }, icon('lock')),
      h('b', {}, text),
      sub ? h('small', {}, sub) : null,
      h('div', { class: 'bj-lock-btns' },
        action ? h('button', { class: 'btn small green', type: 'button', onclick: () => { close(); action(); } }, icon('play'), actionLabel) : null,
        h('button', { class: 'btn small ghost', type: 'button', onclick: close }, 'OK'))));
  document.body.appendChild(box);
  speak(text);
  clearTimeout(timer);
  timer = setTimeout(close, action ? 9000 : 6000);
  return close;
}
