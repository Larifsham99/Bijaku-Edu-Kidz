// Koleksi: trofi, pelekat, lencana, sijil
import { h, emo } from '../ui.js';
import { modeArt } from '../data/modeart.js';
import { go } from '../nav.js';
import { profile } from '../store.js';
import { MODE_LIST, MODES } from '../modes/index.js';
import { STICKERS } from '../data/content.js';
import { BADGES, TROPHY_E, TROPHY_NAMES } from '../rewards.js';
import { topbar, avatarEl } from './shared.js';
import { speak, sfx } from '../audio.js';
import { todayKey } from '../ui.js';

export function trophyScreen(tab = 'trofi') {
  const p = profile();
  const scr = h('div', { class: 'screen' });
  scr.appendChild(topbar('🏆 Koleksi Saya', '/'));
  const tabs = [['trofi', '🏆 Trofi'], ['pelekat', '🌈 Pelekat'], ['lencana', '🎖️ Lencana'], ['sijil', '📜 Sijil'], ['bintang', '⭐ Bintang']];
  scr.appendChild(h('div', { class: 'tabs' }, tabs.map(([id, n]) => h('button', { class: tab === id ? 'on' : '', type: 'button', onclick: () => { sfx.tap(); go('/trofi/' + id); } }, n))));
  const body = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } });
  if (tab === 'trofi') {
    body.appendChild(h('div', { class: 'center muted' }, `${p.trophies.length} / 75 trofi · dapatkan trofi setiap 10 level`));
    MODE_LIST.forEach((m) => {
      body.appendChild(h('div', { class: 'panel', style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
        modeArt(m, 'md'), h('b', { style: { flex: 1, minWidth: '140px' } }, m.n),
        h('div', { class: 'row-wrap' }, TROPHY_E.map((e, i) => {
          const got = p.trophies.includes(`${m.id}-${(i + 1) * 10}`);
          return h('button', { class: `coll-item ${got ? '' : 'off'}`, type: 'button', style: { padding: '6px', minWidth: '58px' }, onclick: () => speak(got ? `${TROPHY_NAMES[i]} ${m.n}` : `Selesaikan level ${(i + 1) * 10} untuk trofi ini.`) }, emo(e), h('span', { class: 'lbl' }, `Lv ${(i + 1) * 10}`));
        }))));
    });
  } else if (tab === 'pelekat') {
    body.appendChild(h('div', { class: 'center muted' }, `${p.stickers.length} pelekat · dapat pelekat setiap 5 level & cabaran harian`));
    const all = [...new Set([...STICKERS, ...p.stickers])];
    body.appendChild(h('div', { class: 'grid-coll' }, all.map((s) => {
      const got = p.stickers.includes(s);
      return h('button', { class: `coll-item ${got ? '' : 'off'}`, type: 'button', onclick: () => { if (got) { sfx.pop(); } } }, h('span', { class: 'emo', style: { fontSize: '50px' } }, got ? s : '❔'));
    })));
  } else if (tab === 'lencana') {
    body.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' } }, BADGES.map((b) => {
      const got = p.badges.includes(b.id);
      return h('button', { class: `coll-item ${got ? '' : 'off'}`, type: 'button', onclick: () => speak(`${b.n}. ${b.d}.`) }, emo(b.e), h('span', { class: 'lbl', style: { fontSize: '15px' } }, b.n), h('span', { class: 'lbl muted' }, b.d));
    })));
  } else if (tab === 'sijil') {
    body.appendChild(h('div', { class: 'center muted' }, 'Tamatkan 50 level dalam satu mod untuk mendapat sijil pencapaian.'));
    body.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' } }, MODE_LIST.map((m) => {
      const got = p.certs.includes(m.id);
      return h('button', { class: `coll-item ${got ? '' : 'off'}`, type: 'button', onclick: () => { if (got) go('/sijil/' + m.id); else speak(`Tamatkan semua level ${m.n} untuk mendapat sijil.`); } }, emo('📜'), h('span', { class: 'lbl' }, m.n), h('span', { class: 'lbl muted' }, `${Object.keys(p.modes[m.id]?.done || {}).length}/50`));
    })));
  } else {
    body.appendChild(h('div', { class: 'panel center' },
      h('div', { class: 'emo', style: { fontSize: '80px' } }, '⭐'),
      h('div', { style: { fontSize: '40px', fontWeight: 900 } }, p.stars),
      h('div', { class: 'muted' }, 'bintang dikumpul. Setiap jawapan betul memberi 1 bintang!'),
      h('div', { class: 'muted', style: { marginTop: '8px' } }, `🪙 ${p.coins} syiling — boleh ditukar dengan kostum dan avatar baharu.`),
      h('button', { class: 'btn pink', type: 'button', style: { marginTop: '12px' }, onclick: () => go('/kedai') }, emo('👒'), 'Ke Kedai Kostum')));
  }
  scr.appendChild(body);
  return scr;
}

export function certScreen(modeId) {
  const p = profile();
  const m = MODES[modeId];
  const scr = h('div', { class: 'screen' });
  scr.appendChild(topbar('📜 Sijil Pencapaian', '/trofi/sijil'));
  if (!m || !p.certs.includes(modeId)) {
    scr.appendChild(h('div', { class: 'panel center' }, 'Sijil ini belum dibuka. Tamatkan 50 level dahulu!', h('div', {}, h('button', { class: 'btn', type: 'button', onclick: () => go(m ? '/mod/' + m.id : '/') }, 'Main sekarang'))));
    return scr;
  }
  speak(`Sijil pencapaian ${m.n} untuk ${p.name}. Tahniah!`);
  scr.appendChild(h('div', { class: 'cert', id: 'cert' },
    h('div', { class: 'emo', style: { fontSize: '60px' } }, '🏅'),
    h('h2', {}, 'SIJIL PENCAPAIAN'),
    h('div', { class: 'muted' }, 'Dengan bangganya diberikan kepada'),
    h('div', { style: { display: 'flex', justifyContent: 'center' } }, avatarEl(p, 'lg')),
    h('div', { class: 'who' }, p.name),
    h('div', { style: { fontSize: '20px', fontWeight: 800 } }, `kerana berjaya menamatkan kesemua 50 level`),
    h('div', { style: { fontSize: '28px', fontWeight: 900, color: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' } }, modeArt(m, 'md'), m.n),
    h('div', { class: 'muted' }, `BIJAKU oleh Mawar Ikhlas · ${todayKey()}`),
    h('div', { class: 'muted', style: { fontStyle: 'italic' } }, 'Belajar Sambil Bermain, Bijak Sambil Meneroka.')));
  scr.appendChild(h('div', { class: 'row-wrap' }, h('button', { class: 'btn blue', type: 'button', onclick: () => window.print() }, emo('🖨️'), 'Cetak sijil')));
  return scr;
}
