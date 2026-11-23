// =====================================================================
//  TAMAN AKHLAK — skrin (kelas berawalan .ak-)
// =====================================================================
import { h, clear } from '../ui.js';
import { ribbon, selfieButton } from '../cheer.js';
import { go } from '../nav.js';
import { lockNotice } from '../notice.js';
import { profile, save, addActivity, callOf } from '../store.js';
import { speak, stopSpeak, sfx, haptic } from '../audio.js';
import { icon } from '../icons.js';
import { parentGate } from '../screens/shared.js';
import { overLimit } from '../screens/timeout.js';
import { STORIES, DEEDS, CATS, PLANTS, MILESTONES } from './data.js';
import { bgSvg, artBox, artInner, gardenSvg } from './scene.js';
import * as S from './store.js';

const later = (fn, ms) => setTimeout(fn, ms * (globalThis.__dcTimeScale || 1));
const MASCOT = ['mimi', 'bobo', 'coco', 'dino', 'lala'];
const NAMES = { mimi: 'Mimi', bobo: 'Bobo', coco: 'Coco', dino: 'Dino', lala: 'Lala' };
const GUEST_ART = { datuk: 'datuk', ibu: 'ibu', ayah: 'ayah', nenek: 'nenek', cikgu: 'mualim', pakcik: 'pakcik', bayi: 'bayi' };
const ap = () => S.aprof(profile()?.id);

function top(title, back, right = null) {
  return h('div', { class: 'ak-top' },
    h('button', { class: 'ak-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { sfx.tap(); stopSpeak(); go(back); } }, icon('back')),
    h('div', { class: 'ak-title' }, title), right || h('span', { class: 'ak-spacer' }));
}
const pill = (ic, n, label) => h('span', { class: 'ak-pill', title: label }, ic, String(n));
const flowerIc = () => h('span', { class: 'ak-ic', html: '<svg viewBox="-12 -12 24 24" width="22" height="22"><g>' + [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="4" ry="6" fill="#e8412c" transform="rotate(${a})"/>`).join('') + '<circle r="3" fill="#ffd43b"/></g></svg>' });
const fruitIc = () => h('span', { class: 'ak-ic', html: '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="14" r="8" fill="#ff6b6b"/><path d="M12 6q2-4 6-4" stroke="#2f9e6a" stroke-width="2.5" fill="none"/></svg>' });
function mascotImg(id, cls = '') { return h('img', { class: `ak-char ${cls}`, src: `visual-assets/mascots/${MASCOT.includes(id) ? id : 'mimi'}.svg`, alt: NAMES[id] || '' }); }

// =====================================================================
//  HAB
// =====================================================================
export function hubScreen() {
  const a = ap(), p = profile();
  const scr = h('div', { class: 'ak-screen ak-hub' });
  scr.appendChild(top('Taman Akhlak', '/', h('div', { class: 'ak-pills' }, pill(flowerIc(), a.plants.length, 'Bunga'), pill(fruitIc(), a.deedsTotal, 'Buah amal'))));
  const g = h('button', { class: 'ak-garden-card', type: 'button', 'aria-label': 'Lihat Kebun Amal', html: gardenSvg(a), onclick: () => { sfx.tap(); go('/akhlak/kebun'); } });
  g.appendChild(h('span', { class: 'ak-garden-label' }, 'Kebun Amal ', h('b', {}, p?.name || '')));
  scr.appendChild(g);
  const done = S.storiesDone(a), today = S.deedsToday(a).length;
  const card = (cls, art, title, sub, path, extra) => h('button', { class: `ak-card ${cls}`, type: 'button', onclick: () => { sfx.tap(); go(path); } },
    h('span', { class: 'ak-card-art', html: artBox(art, 70) }), h('span', { class: 'ak-card-txt' }, h('b', {}, title), h('small', {}, sub)), extra || null);
  scr.appendChild(h('div', { class: 'ak-cards' },
    card('c-kisah', 'buku', 'Kisah Pilihan', `${done} daripada ${STORIES.length} kisah`, '/akhlak/kisah', h('span', { class: 'ak-bar' }, h('i', { style: { width: `${(done / STORIES.length) * 100}%` } }))),
    card('c-amal', 'tolong', 'Amal Hari Ini', `${today} kebaikan hari ini`, '/akhlak/amal'),
    card('c-kebun', 'bunga', 'Kebun Saya', `${a.plants.length} bunga · ${a.deedsTotal} buah`, '/akhlak/kebun')));
  later(() => speak(a.plants.length ? `Selamat datang ke Taman Akhlak! Kebun kamu ada ${a.plants.length} bunga.` : 'Selamat datang ke Taman Akhlak! Jom pilih kebaikan, dan kebun kamu akan mekar.'), 300);
  return scr;
}

// =====================================================================
//  SENARAI KISAH
// =====================================================================
export function listScreen() {
  const a = ap();
  const scr = h('div', { class: 'ak-screen ak-list' });
  scr.appendChild(top('Kisah Pilihan', '/akhlak', pill(flowerIc(), `${S.storiesDone(a)}/${STORIES.length}`, 'Kisah selesai')));
  const grid = h('div', { class: 'ak-stories' });
  STORIES.forEach((st, i) => {
    const open = S.storyOpen(a, i), done = S.storyDone(a, st.id);
    const good = st.choices.find((c) => c.good);
    grid.appendChild(h('button', { class: `ak-story ${done ? 'done' : ''} ${open ? '' : 'locked'}`, type: 'button', style: `--pc:${PLANTS[CATS[st.cat].plant].ui || PLANTS[CATS[st.cat].plant].c}`, onclick: () => {
      if (!open) { const nx = STORIES.find((s2, k) => S.storyOpen(a, k) && !S.storyDone(a, s2.id)); lockNotice('Kisah ini masih berkunci.', { sub: 'Tamatkan kisah yang terbuka dahulu. Kemajuan disimpan dalam peranti ini.', action: nx ? () => go(`/akhlak/kisah/${nx.id}`) : null, actionLabel: nx ? `Baca: ${nx.n}` : '' }); return; }
      sfx.tap(); go(`/akhlak/kisah/${st.id}`);
    } },
      h('span', { class: 'ak-story-num' }, String(i + 1)),
      h('span', { class: 'ak-story-art', html: artBox(good.art, 64) }),
      h('b', {}, st.n), h('small', {}, CATS[st.cat].n),
      done ? h('span', { class: 'ak-story-done' }, flowerIc()) : null,
      open ? null : h('span', { class: 'ak-lock' }, icon('lock'))));
  });
  scr.appendChild(grid);
  return scr;
}

// =====================================================================
//  PEMAIN KISAH
// =====================================================================
export function storyScreen(id, onClean) {
  const a = ap(), p = profile();
  const idx = STORIES.findIndex((s) => s.id === id);
  const st = STORIES[idx];
  if (!st || !S.storyOpen(a, idx)) { later(() => go('/akhlak/kisah'), 0); return h('div'); }
  let alive = true;
  onClean(() => { alive = false; stopSpeak(); });
  const scr = h('div', { class: 'ak-screen ak-play' });
  scr.appendChild(top(st.n, '/akhlak/kisah', h('span', { class: 'ak-pill cat', style: `--pc:${PLANTS[CATS[st.cat].plant].ui || PLANTS[CATS[st.cat].plant].c}` }, CATS[st.cat].n)));
  const hero = mascotImg(st.who, 'hero');
  const stage = h('div', { class: 'ak-stage', html: bgSvg(st.bg) },
    h('div', { class: 'ak-actors' },
      h('div', { class: 'ak-actor' }, hero, h('span', { class: 'ak-emote' })),
      st.with ? h('div', { class: 'ak-actor' }, mascotImg(st.with, 'friend')) : st.guest ? h('div', { class: 'ak-actor guest', html: artBox(GUEST_ART[st.guest], 150) }) : null));
  const bubble = h('button', { class: 'ak-bubble', type: 'button', 'aria-label': 'Dengar semula' }, h('span', { class: 'ak-bubble-txt' }), h('span', { class: 'ak-bubble-ic' }, icon('sound')));
  const choicesEl = h('div', { class: 'ak-choices' });
  const lessonEl = h('div', { class: 'ak-lesson' });
  scr.append(stage, bubble, choicesEl, lessonEl);
  const emote = stage.querySelector('.ak-emote');
  let lastSay = '', lastMood = 'arahan';
  const say = (t, mood = 'arahan') => { lastSay = t; lastMood = mood; bubble.querySelector('.ak-bubble-txt').textContent = t; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); return speak(t, { mood }); };
  bubble.addEventListener('click', () => { sfx.tap(); if (lastSay) speak(lastSay, { mood: lastMood }); });
  const setMood = (m) => { stage.dataset.mood = m; emote.className = `ak-emote ${m}`; };

  async function intro() {
    for (const line of st.lines) { if (!alive) return; await say(line); await new Promise((r) => later(r, 350)); }
    if (!alive) return;
    showChoices();
    say(st.q);
  }
  function showChoices() {
    clear(choicesEl);
    const order = st.choices.map((c, i) => ({ c, i })).sort((x, y) => ((x.i * 7 + idx) % 3) - ((y.i * 7 + idx) % 3));
    order.forEach(({ c }) => {
      const b = h('button', { class: 'ak-choice', type: 'button', onclick: () => choose(c, b) }, h('span', { class: 'ak-choice-art', html: artBox(c.art, 86) }), h('span', { class: 'ak-choice-txt' }, c.t));
      b.addEventListener('pointerenter', () => {}, { passive: true });
      choicesEl.appendChild(b);
    });
    choicesEl.classList.add('show');
    later(() => { if (alive) choicesEl.querySelectorAll('.ak-choice').forEach((b, i) => b.style.setProperty('--i', i)); }, 0);
  }
  let finished = false;
  async function choose(c, btn) {
    if (finished) return;
    haptic(10);
    if (c.good) {
      finished = true; sfx.correct(); setMood('happy');
      btn.classList.add('ok'); choicesEl.querySelectorAll('.ak-choice').forEach((x) => { if (x !== btn) x.classList.add('fade'); });
      // pengajaran muncul tanpa menunggu suara habis (maks. 1.8 saat)
      await Promise.race([say(c.r, 'pujian'), new Promise((r) => later(r, 1800))]);
      if (!alive) return;
      const res = S.completeStory(a, st);
      lessonEl.append(
        ribbon(['Syabas!', 'Hebat!', 'Terbaik!', 'Tahniah!'][idx % 4], { sub: 'Pilihan yang baik!' }),
        h('div', { class: 'ak-lesson-card' },
          h('span', { class: 'ak-seed', html: '<svg viewBox="-20 -40 40 46" width="64" height="72"><ellipse cx="0" cy="2" rx="16" ry="4" fill="#8a5d36"/><path d="M0 0V-22" stroke="#2f9e6a" stroke-width="3"/>' + [0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-30" rx="5" ry="8" fill="${PLANTS[CATS[st.cat].plant].c}" transform="rotate(${r} 0 -24)" stroke="#fff" stroke-width=".6"/>`).join('') + '<circle cy="-24" r="3" fill="#ffd43b"/></svg>' }),
          h('div', {}, h('small', {}, 'Pengajaran'), h('b', {}, st.lesson), res.first ? h('span', { class: 'ak-planted' }, `${PLANTS[CATS[st.cat].plant].n} ditanam di kebun!`) : null),
          h('div', { class: 'ak-lesson-btns' },
            selfieButton(`Taman Akhlak · ${st.n}`),
            h('button', { class: 'ak-btn', type: 'button', onclick: () => { sfx.tap(); go('/akhlak/kebun'); } }, 'Lihat kebun'),
            STORIES[idx + 1] ? h('button', { class: 'ak-btn go', type: 'button', onclick: () => { sfx.tap(); go(`/akhlak/kisah/${STORIES[idx + 1].id}`); } }, 'Kisah seterusnya', icon('next')) : null)));
      lessonEl.classList.add('show');
      sfx.reward();
      save();
      later(() => alive && speak(`${st.lesson} ${res.first ? `${PLANTS[CATS[st.cat].plant].n} ditanam di kebun kamu!` : ''}${res.milestone ? ` ${res.milestone.n}` : ''}`, { mood: 'pujian', interrupt: false }), 0);
      if (p && overLimit(p)) later(() => go('/'), 4000);
    } else {
      sfx.wrong(); setMood('sad'); btn.classList.add('no');
      btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
      await say(c.r, 'galakan');
      if (alive && !finished) setMood('');
    }
  }
  // masa bermain dikira (had masa ibu bapa)
  let last = Date.now();
  const ticker = setInterval(() => { const now = Date.now(); if (document.visibilityState === 'visible' && p) { addActivity(p, { time: Math.min(10, (now - last) / 1000) }); save(); } last = now; }, 5000);
  onClean(() => clearInterval(ticker));
  globalThis.__akPlay = { choose: (good) => { const c = st.choices.find((x) => x.good === good); const b = [...choicesEl.querySelectorAll('.ak-choice')].find((x) => x.textContent.includes(c.t)); if (b) choose(c, b); }, ready: () => choicesEl.classList.contains('show') };
  onClean(() => { globalThis.__akPlay = null; });
  later(intro, 250);
  return scr;
}

// =====================================================================
//  KEBUN
// =====================================================================
export function gardenScreen() {
  const a = ap(), p = profile();
  const scr = h('div', { class: 'ak-screen ak-kebun' });
  scr.appendChild(top('Kebun Amal', '/akhlak', h('div', { class: 'ak-pills' }, pill(flowerIc(), a.plants.length, 'Bunga'), pill(fruitIc(), a.deedsTotal, 'Buah amal'))));
  const garden = h('div', { class: 'ak-garden-big', html: gardenSvg(a, { highlight: a.plants.length - 1 }) });
  garden.addEventListener('click', () => { sfx.pop(); speak(`Kebun ${p ? callOf(p) : 'kamu'} ada ${a.plants.length} bunga dan ${a.deedsTotal} buah kebaikan. Teruskan berbuat baik!`, { mood: 'pujian' }); });
  scr.appendChild(garden);
  const count = {}; a.plants.forEach((pl) => { count[pl.type] = (count[pl.type] || 0) + 1; });
  scr.appendChild(h('div', { class: 'ak-legend' }, ...Object.entries(CATS).map(([, cat]) => h('div', { class: 'ak-leg' },
    h('i', { style: { background: PLANTS[cat.plant].c } }), h('span', {}, h('b', {}, `${count[cat.plant] || 0}`), ` ${PLANTS[cat.plant].n}`), h('small', {}, cat.n)))));
  scr.appendChild(h('div', { class: 'ak-miles' }, ...MILESTONES.map((m) => h('span', { class: `ak-mile ${a.plants.length >= m.at ? 'on' : ''}` }, a.plants.length >= m.at ? icon('star') : icon('lock'), `${m.n} (${m.at})`))));
  scr.appendChild(h('p', { class: 'ak-note' }, 'Kebun ini tidak akan layu. Setiap kebaikan menjadikannya lebih cantik.'));
  return scr;
}

// =====================================================================
//  AMAL HARI INI (disahkan ibu bapa)
// =====================================================================
export function deedsScreen() {
  const a = ap();
  const scr = h('div', { class: 'ak-screen ak-amal' });
  const head = pill(fruitIc(), a.deedsTotal, 'Buah amal');
  scr.appendChild(top('Amal Hari Ini', '/akhlak', head));
  scr.appendChild(h('p', { class: 'ak-intro' }, 'Buat kebaikan di rumah, kemudian minta ibu atau ayah tekan untuk sahkan. Setiap amal menjadi buah di pokok kebun!'));
  const today = new Set(S.deedsToday(a));
  const grid = h('div', { class: 'ak-deeds' });
  DEEDS.forEach((d) => {
    const b = h('button', { class: `ak-deed ${today.has(d.id) ? 'done' : ''}`, type: 'button', onclick: () => {
      if (b.classList.contains('done')) { sfx.pop(); speak(`${d.n}. Sudah dibuat hari ini. Terbaik!`, { mood: 'pujian' }); return; }
      sfx.tap(); speak(`${d.n}. Minta ibu atau ayah sahkan, ya.`);
      parentGate(() => {
        if (S.addDeed(a, d)) {
          b.classList.add('done', 'pop'); sfx.reward(); haptic([10, 40, 10]);
          clear(head); head.append(fruitIc(), String(a.deedsTotal));
          speak(`Alhamdulillah! ${d.n}. Satu buah kebaikan tumbuh di pokok kebun kamu!`, { mood: 'pujian' });
          save();
        }
      }, { reason: `Sahkan bahawa anak sudah: ${d.n.toLowerCase()}.` });
    } }, h('span', { class: 'ak-deed-art', html: artBox(d.art, 72) }), h('b', {}, d.n), h('span', { class: 'ak-deed-tick' }, icon('check')));
    grid.appendChild(b);
  });
  scr.appendChild(grid);
  later(() => speak('Kebaikan apa yang kamu buat hari ini?'), 300);
  return scr;
}
