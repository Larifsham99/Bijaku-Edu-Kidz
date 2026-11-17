// Peta level untuk setiap mod (50 level, 5 peringkat)
import { h, emo, later } from '../ui.js';
import { modeArt } from '../data/modeart.js';
import { go } from '../nav.js';
import { profile, isUnlocked, levelsDone, highestUnlocked, mastery, MASTERY_LABEL } from '../store.js';
import { MODES, TIERS } from '../modes/index.js';
import { topbar, guide } from './shared.js';
import { speak, sfx } from '../audio.js';
import { TROPHY_E } from '../rewards.js';
import { demoLocked } from '../demo.js';
import { demoUpgrade, avatarEl } from './shared.js';
import { icon } from '../icons.js';
import { AVATARS } from '../data/content.js';

export function modeScreen(modeId) {
  const p = profile();
  const m = MODES[modeId];
  const prog = p.modes[modeId]?.done || {};
  const cur = highestUnlocked(p, modeId);
  const done = levelsDone(p, modeId);
  const scr = h('div', { class: 'screen' });
  scr.appendChild(topbar([modeArt(m, 'sm'), m.n], '/'));
  const g = guide(m.char, done >= 50 ? `Tahniah! Kamu sudah tamatkan semua level ${m.n}!` : `Jom main ${m.n}! Ada level baharu sedang menunggu kamu.`);
  scr.appendChild(g.el);
  later(() => g.repeat(), 300);
  scr.appendChild(h('div', { class: 'row-wrap' },
    h('button', { class: 'btn big green', type: 'button', onclick: () => { sfx.tap(); if (demoLocked(cur)) { demoUpgrade(); return; } go(`/main/${modeId}/${Math.min(cur, 50)}`); } }, icon('play'), `Main Level ${Math.min(cur, 50)}`),
    done >= 50 ? h('button', { class: 'btn purple', type: 'button', onclick: () => go('/sijil/' + modeId) }, emo('📜'), 'Sijil') : null));
  // kemahiran mod ini
  scr.appendChild(h('div', { class: 'panel' },
    h('div', { style: { fontWeight: 900, marginBottom: '6px' } }, '🎯 Kemahiran dalam permainan ini'),
    h('div', { class: 'row-wrap', style: { justifyContent: 'flex-start' } }, Object.entries(m.skills).map(([id, n]) => {
      const lv = mastery(p.skills[id]);
      return h('span', { class: `mbadge mb${lv}`, title: MASTERY_LABEL[lv] }, `${['○', '◔', '◑', '●'][lv]} ${n}`);
    }))));
  const me = AVATARS.find((a) => a.id === p.avatar)?.e || '🐰';
  let currentNode = null;
  TIERS.forEach((t, ti) => {
    const trophyOk = p.trophies.includes(`${modeId}-${(ti + 1) * 10}`);
    const card = h('div', { class: 'tier-card' });
    card.appendChild(h('div', { class: 'tier-head' }, h('span', { class: 'tag', style: { background: t.c } }, `${t.e} ${t.n}`), h('span', { class: 'muted', style: { fontSize: '15px' } }, `Level ${ti * 10 + 1}–${ti * 10 + 10}`), h('span', { class: 'emo tier-trophy', style: { opacity: trophyOk ? 1 : 0.3, filter: trophyOk ? '' : 'grayscale(1)' }, title: 'Trofi peringkat' }, TROPHY_E[ti])));
    const path = h('div', { class: 'lv-path' });
    for (let row = 0; row < 2; row++) {
      const r = h('div', { class: `lv-row ${row % 2 ? 'rev' : ''}` });
      for (let k = 0; k < 5; k++) {
        const L = ti * 10 + row * 5 + k + 1;
        const un = isUnlocked(p, modeId, L) && !demoLocked(L);
        const demoLock = demoLocked(L);
        const st = prog[L];
        const isCur = un && st === undefined;
        const cls = ['lvl'];
        if (st !== undefined) cls.push('done'); else if (un) cls.push('current'); else cls.push('locked');
        if (L % 5 === 0) cls.push('special');
        const node = h('div', { class: 'lv-node' },
          isCur ? h('span', { class: 'me emo' }, me) : null,
          L % 5 === 0 ? h('span', { class: 'gift emo' }, '🎁') : null,
          h('button', { class: cls.join(' '), type: 'button', style: `--c:${m.c}`, 'aria-label': `Level ${L}${un ? '' : ' berkunci'}`, onclick: () => {
            if (demoLock) { sfx.tap(); demoUpgrade(); return; }
            if (!un) { sfx.bump(); speak('Selesaikan level sebelumnya dahulu, ya.'); return; }
            sfx.tap(); go(`/main/${modeId}/${L}`);
          } }, un ? L : icon('lock')),
          h('span', { class: 'lv-stars' }, st !== undefined ? [icon('star'), icon('star'), icon('star')] : null));
        if (isCur) currentNode = node;
        r.appendChild(node);
      }
      path.appendChild(r);
    }
    card.appendChild(path);
    scr.appendChild(card);
  });
  // tatal terus ke level semasa
  if (currentNode && cur > 5) setTimeout(() => currentNode.scrollIntoView({ block: 'center', behavior: 'smooth' }), 350);
  return scr;
}
