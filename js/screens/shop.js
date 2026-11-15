// Kedai kostum & avatar (menggunakan syiling dalam permainan sahaja — tiada wang sebenar)
import { h, emo, toast, confetti } from '../ui.js';
import { go } from '../nav.js';
import { profile, save, settings } from '../store.js';
import { AVATARS, COSTUMES, THEMES } from '../data/content.js';
import { applyTheme } from '../theme.js';
import { topbar, avatarEl, parentGate, confirmBox } from './shared.js';
import { speak, sfx } from '../audio.js';
import { checkBadges } from '../rewards.js';

export function shopScreen(tab = 'avatar') {
  const p = profile();
  const scr = h('div', { class: 'screen' });
  scr.appendChild(topbar('👒 Kostum & Tema', '/', h('span', { class: 'pill' }, emo('🪙'), p.coins)));
  scr.appendChild(h('div', { class: 'row-wrap' }, avatarEl(p, 'lg')));
  scr.appendChild(h('div', { class: 'center muted' }, 'Tukar syiling dengan avatar, kostum dan tema comel. Tiada wang sebenar digunakan.'));
  const tabs = [['avatar', '🐾 Avatar'], ['topi', '🎩 Topi'], ['aksesori', '🕶️ Aksesori'], ['tema', '🎨 Tema']];
  scr.appendChild(h('div', { class: 'tabs' }, tabs.map(([id, n]) => h('button', { class: tab === id ? 'on' : '', type: 'button', onclick: () => { sfx.tap(); go('/kedai/' + id); } }, n))));
  if (tab === 'tema') {
    scr.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' } }, THEMES.map((t) => {
      const owned = p.owned.themes.includes(t.id);
      const it = { ...t, kind: 'theme' };
      return h('button', { class: `coll-item ${p.theme === t.id ? 'on' : ''}`, type: 'button', onclick: () => act(it, owned) },
        h('div', { class: `theme-prev ${t.id}` }, t.e), h('span', { class: 'lbl', style: { fontSize: '16px' } }, t.n), h('span', { class: 'lbl muted' }, t.d),
        h('span', { class: 'lbl', style: { color: owned ? '#189a5a' : '#d35400' } }, p.theme === t.id ? 'Sedang digunakan' : owned ? 'Milik saya' : `🪙 ${t.cost}`));
    })));
    return scr;
  }
  const list = tab === 'avatar' ? AVATARS.map((a) => ({ ...a, kind: 'avatar' })) : COSTUMES.filter((c) => c.slot === (tab === 'topi' ? 'hat' : 'acc')).map((c) => ({ ...c, kind: 'costume' }));
  const grid = h('div', { class: 'grid-coll' });
  list.forEach((it) => {
    const owned = it.kind === 'avatar' ? p.owned.avatars.includes(it.id) : p.owned.costumes.includes(it.id);
    const wearing = it.kind === 'avatar' ? p.avatar === it.id : p.wear[it.slot] === it.id;
    grid.appendChild(h('button', { class: `coll-item ${wearing ? 'on' : ''}`, type: 'button', onclick: () => act(it, owned) },
      h('span', { class: 'emo' }, it.e || '🚫'), h('span', { class: 'lbl' }, it.n),
      h('span', { class: 'lbl', style: { color: owned ? '#189a5a' : '#d35400' } }, wearing ? 'Dipakai' : owned ? 'Milik saya' : `🪙 ${it.cost}`)));
  });
  scr.appendChild(grid);
  function wear(it) {
    if (it.kind === 'avatar') p.avatar = it.id;
    else if (it.kind === 'theme') { p.theme = it.id; applyTheme(it.id); }
    else p.wear[it.slot] = it.id;
    save(); sfx.pop(); speak(it.kind === 'theme' ? `Tema ${it.n}!` : 'Cantiknya!'); go('/kedai/' + tab);
  }
  function buy(it) {
    p.coins -= it.cost;
    if (it.kind === 'avatar') p.owned.avatars.push(it.id);
    else if (it.kind === 'theme') p.owned.themes.push(it.id);
    else p.owned.costumes.push(it.id);
    checkBadges(p);
    sfx.reward(); confetti(24);
    toast('Hore! Barang baharu!', 'good', it.e);
    wear(it);
  }
  function act(it, owned) {
    if (owned) return wear(it);
    if (p.coins < it.cost) { sfx.bump(); speak(`Kamu perlukan ${it.cost - p.coins} syiling lagi. Teruskan bermain untuk kumpul syiling!`); toast(`Perlu ${it.cost - p.coins} syiling lagi`, 'try', '🪙'); return; }
    const doBuy = () => confirmBox(`Tukar ${it.cost} syiling untuk ${it.n}?`, () => buy(it), { yes: 'Ya!', no: 'Tidak', emoji: it.e });
    if (settings().lockShop) parentGate(doBuy, { reason: 'Ibu bapa telah menetapkan pembelian kostum perlu kebenaran.' });
    else doBuy();
  }
  return scr;
}
