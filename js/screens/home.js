// Halaman utama, pendaftaran profil pertama & pemilihan profil
import { h, emo } from '../ui.js';
import { go } from '../nav.js';
import { profile, getState, settings, addProfile, switchProfile, levelsDone, highestUnlocked, playerLevel, todayPlaySeconds } from '../store.js';
import { MODE_LIST, MODES } from '../modes/index.js';
import { AVATARS, CHARACTERS } from '../data/content.js';
import { avatarEl, statPills, guide, parentGate } from './shared.js';
import { dailySet } from './daily.js';
import { speak, sfx } from '../audio.js';
import { limitSeconds } from './timeout.js';

const greet = (name) => {
  const hr = new Date().getHours();
  const t = hr < 12 ? 'Selamat pagi' : hr < 15 ? 'Selamat tengah hari' : hr < 19 ? 'Selamat petang' : 'Selamat malam';
  return `${t}, ${name}! Jom belajar sambil bermain!`;
};

// Cadangan permainan seterusnya: mod terakhir dimainkan atau mod pertama yang belum selesai
export function nextPlay(p) {
  const enabled = MODE_LIST.filter((m) => !settings().disabledModes.includes(m.id));
  const recent = Object.entries(p.modes).filter(([id]) => enabled.find((m) => m.id === id)).sort((a, b) => (b[1].plays || 0) - (a[1].plays || 0));
  const m = recent.length ? MODES[recent[0][0]] : enabled[0];
  if (!m) return null;
  let L = highestUnlocked(p, m.id);
  if (levelsDone(p, m.id) >= 50) {
    const other = enabled.find((x) => levelsDone(p, x.id) < 50);
    if (other) return { m: other, L: highestUnlocked(p, other.id) };
    L = 50;
  }
  return { m, L };
}

export function homeScreen() {
  const p = profile();
  if (!p) { setTimeout(() => go('/profil'), 0); return h('div'); }
  const lv = playerLevel(p);
  const d = dailySet(p);
  const scr = h('div', { class: 'screen' });
  scr.appendChild(h('div', { class: 'home-head' },
    h('button', { class: 'player-card', type: 'button', 'aria-label': 'Tukar profil', onclick: () => { sfx.tap(); go('/profil'); } },
      avatarEl(p),
      h('div', { style: { flex: 1 } },
        h('div', { class: 'player-name' }, p.name),
        h('div', { class: 'player-sub' }, `Level ${lv.lvl} · ${p.age} tahun`),
        h('div', { class: 'lvl-bar' }, h('i', { style: { width: `${Math.round((lv.into / lv.need) * 100)}%` } })))),
    statPills(p)));
  scr.appendChild(h('div', { class: 'logo' }, h('h1', {}, 'Dunia Cilik'), h('p', {}, 'Belajar Sambil Bermain, Bijak Sambil Meneroka.')));
  const ch = CHARACTERS[new Date().getDay() % CHARACTERS.length];
  const g = guide(ch.id, greet(p.name));
  scr.appendChild(g.el);
  setTimeout(() => speak(greet(p.name)), 400);

  const np = nextPlay(p);
  const dailyLeft = 5 - d.done.length;
  const lim = limitSeconds(p);
  scr.appendChild(h('div', { class: 'home-actions' },
    np ? h('button', { class: 'tile-btn', style: { background: 'linear-gradient(160deg,#4cd18a,#1dd1a1)', gridColumn: 'span 2' }, type: 'button', onclick: () => { sfx.tap(); go(`/main/${np.m.id}/${np.L}`); } },
      emo('▶️'), h('span', { style: { fontSize: '26px' } }, 'Mula Bermain'), h('span', { style: { fontSize: '15px', opacity: 0.9 } }, `${np.m.n} · Level ${np.L}`)) : null,
    h('button', { class: 'tile-btn', style: { background: 'linear-gradient(160deg,#ff9f43,#ff6b6b)' }, type: 'button', onclick: () => { sfx.tap(); go('/harian'); } }, emo('📅'), 'Cabaran Harian', dailyLeft ? h('span', { class: 'badge' }, dailyLeft) : h('span', { class: 'badge', style: { color: '#189a5a' } }, '✓')),
    h('button', { class: 'tile-btn', style: { background: 'linear-gradient(160deg,#feca57,#ff9f43)' }, type: 'button', onclick: () => { sfx.tap(); go('/trofi'); } }, emo('🏆'), 'Koleksi Trofi'),
    h('button', { class: 'tile-btn', style: { background: 'linear-gradient(160deg,#ff8fab,#a77bff)' }, type: 'button', onclick: () => { sfx.tap(); go('/kedai'); } }, emo('👒'), 'Kostum & Tema'),
    h('button', { class: 'tile-btn', style: { background: 'linear-gradient(160deg,#48dbfb,#54a0ff)' }, type: 'button', onclick: () => { sfx.tap(); go('/bebas'); } }, emo('🎈'), 'Main Bebas'),
    h('button', { class: 'tile-btn', style: { background: 'linear-gradient(160deg,#8395a7,#576574)' }, type: 'button', onclick: () => { sfx.tap(); parentGate(() => go('/ibubapa/ringkasan')); } }, emo('👨‍👩‍👧'), 'Ruang Ibu Bapa')));

  if (lim !== Infinity) {
    const left = Math.max(0, Math.round((lim - todayPlaySeconds(p)) / 60));
    scr.appendChild(h('div', { class: 'center muted' }, `⏰ Baki masa bermain hari ini: ${left} minit`));
  }

  scr.appendChild(h('div', { class: 'section-title' }, emo('🎮'), 'Pilih Permainan'));
  const grid = h('div', { class: 'mode-grid' });
  MODE_LIST.forEach((m) => {
    const done = levelsDone(p, m.id);
    const off = settings().disabledModes.includes(m.id);
    grid.appendChild(h('button', { class: `mode-card ${off ? 'locked' : ''}`, type: 'button', style: `--c:${m.c}`, 'aria-label': m.n, onclick: () => {
      sfx.tap();
      if (off) { speak('Permainan ini sedang dikunci oleh ibu bapa.'); return; }
      speak(m.n); go('/mod/' + m.id);
    } },
      h('span', { class: 'emo' }, off ? '🔒' : m.e),
      h('span', { class: 'name' }, m.n),
      h('div', { class: 'prog' }, h('i', { style: { width: `${(done / 50) * 100}%` } })),
      h('span', { class: 'meta' }, `${done} / 50 level`)));
  });
  scr.appendChild(grid);
  scr.appendChild(h('div', { class: 'center muted', style: { fontSize: '13px', marginTop: '8px' } }, 'Dunia Cilik · tiada iklan · tiada sembang · data disimpan dalam peranti ini sahaja'));
  return scr;
}

// ---------------- PENDAFTARAN PERTAMA ----------------
export function onboardingScreen({ addMode = false } = {}) {
  let step = 0, name = '', age = 4, avatar = 'mimi';
  const scr = h('div', { class: 'screen' });
  const body = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', textAlign: 'center' } });
  scr.appendChild(h('div', { class: 'logo' }, h('h1', {}, 'Dunia Cilik'), h('p', {}, 'Belajar Sambil Bermain, Bijak Sambil Meneroka.')));
  scr.appendChild(body);
  const render = () => {
    body.replaceChildren();
    if (step === 0) {
      body.append(
        h('div', { style: { fontSize: '64px' } }, CHARACTERS.map((c) => h('span', { class: 'emo float', style: { display: 'inline-block', animationDelay: Math.random() + 's' } }, c.e))),
        h('div', { class: 'guide', style: { maxWidth: '560px' } }, h('div', { class: 'bubble' }, 'Hai! Kami Mimi, Bobo, Coco, Dino dan Lala. Siapa nama kamu?', h('small', {}, 'Ibu bapa boleh bantu menaip nama anak.'))),
        (() => {
          const inp = h('input', { type: 'text', maxlength: '16', placeholder: 'Nama', 'aria-label': 'Nama pemain', value: name, style: { fontSize: '30px', textAlign: 'center', padding: '14px', borderRadius: '22px', border: '4px solid #e1d8ef', width: 'min(360px, 90vw)', fontWeight: 900 } });
          inp.addEventListener('input', () => { name = inp.value.trim(); nextBtn.disabled = !name; });
          setTimeout(() => inp.focus(), 50);
          return inp;
        })(),
        nextBtn);
      nextBtn.disabled = !name;
      speak('Hai! Siapa nama kamu?');
    } else if (step === 1) {
      body.append(
        h('div', { class: 'guide' }, h('div', { class: 'bubble' }, `Hai ${name}! Berapa umur kamu?`)),
        h('div', { class: 'row-wrap' }, [3, 4, 5, 6].map((a) => h('button', { class: `btn big ${a === age ? 'green' : 'ghost'}`, type: 'button', onclick: () => { age = a; sfx.tap(); render(); } }, `${a} tahun`))),
        nextBtn);
      nextBtn.disabled = false;
      speak(`Hai ${name}! Berapa umur kamu?`);
    } else {
      body.append(
        h('div', { class: 'guide' }, h('div', { class: 'bubble' }, 'Pilih kawan bermain kamu!')),
        h('div', { class: 'grid-coll', style: { width: '100%', maxWidth: '640px' } }, AVATARS.filter((a) => a.cost === 0).map((a) => h('button', { class: `coll-item ${a.id === avatar ? 'on' : ''}`, type: 'button', onclick: () => { avatar = a.id; sfx.tap(); speak(CHARACTERS.find((c) => c.id === a.id)?.n || a.n); render(); } }, emo(a.e), h('span', { class: 'lbl' }, CHARACTERS.find((c) => c.id === a.id)?.n || a.n)))),
        h('button', { class: 'btn big green', type: 'button', onclick: () => {
          addProfile({ name, age, avatar });
          sfx.win();
          speak(`Selamat datang ke Dunia Cilik, ${name}!`);
          go('/');
        } }, emo('🚀'), 'Jom Mula!'));
      if (!addMode) speak('Pilih kawan bermain kamu!');
    }
  };
  const nextBtn = h('button', { class: 'btn big', type: 'button', onclick: () => { step++; sfx.tap(); render(); } }, 'Seterusnya ➜');
  render();
  return scr;
}

// ---------------- PILIH PROFIL ----------------
export function profilesScreen() {
  const st = getState();
  const scr = h('div', { class: 'screen' });
  scr.appendChild(h('div', { class: 'topbar' }, h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Kembali', onclick: () => go('/') }, '⬅️'), h('div', { class: 'title' }, 'Siapa yang bermain?'), h('div', { class: 'spacer' })));
  scr.appendChild(h('div', { class: 'grid-coll' }, st.profiles.map((p) => h('button', { class: `coll-item ${p.id === st.currentId ? 'on' : ''}`, type: 'button', style: { padding: '18px 8px' }, onclick: () => { switchProfile(p.id); sfx.tap(); speak(`Hai ${p.name}!`); go('/'); } },
    avatarEl(p), h('span', { class: 'lbl', style: { fontSize: '18px' } }, p.name), h('span', { class: 'lbl muted' }, `⭐ ${p.stars}`)))));
  scr.appendChild(h('div', { class: 'row-wrap' }, h('button', { class: 'btn ghost', type: 'button', onclick: () => parentGate(() => go('/ibubapa/profil'), { reason: 'Profil baharu ditambah melalui Ruang Ibu Bapa.' }) }, emo('➕'), 'Tambah profil (ibu bapa)')));
  return scr;
}
