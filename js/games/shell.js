// =====================================================================
//  RANGKA KONGSI PERMAINAN BAHARU: peta level 2.5D, skrin main & skrin tamat
// =====================================================================
import { h, clear, later as uiLater } from '../ui.js';
import { go, onBack } from '../nav.js';
import { pauseMenu } from '../pause.js';
import { profile, save, addActivity } from '../store.js';
import { icon } from '../icons.js';
import { speak, sfx, haptic, stopSpeak } from '../audio.js';
import { overLimit } from '../screens/timeout.js';
import { DEMO, DEMO_MAX } from '../demo.js';
import { demoUpgrade } from '../screens/shared.js';
import { makeRng } from '../rng.js';
import { cheer, ribbon, flashRibbon, RIBBON_WORDS, selfieButton, breakStreak, winBar } from '../cheer.js';
import { shade } from '../brand.js';
import { lockNotice } from '../notice.js';
import { GAMES, GAME_LEVELS, chapterOf } from './registry.js';
import * as S from './store.js';
import { autoFit } from '../fit.js';
import { coach } from '../coach.js';

// Langkah tangan penunjuk pada level 1 (permainan berbilang langkah)
const COACH = {
  kedai: ['.kd-notes .kd-note', '.kd-pay'],
  robot: ['.rb-arrow', '.rb-ctl.run'],
  bina: ['.bd-pal button', '.bd-build'],
};

const pid = () => profile()?.id;
const vars = (g) => `--gc:${g.c};--ga:${g.bg[0]};--gb:${g.bg[1]};--gd:${g.bg[2]};--gl:${shade(g.c, 0.82)}`;
const starRow = (k, cls = '') => h('span', { class: `gm-stars ${cls}` }, ...[1, 2, 3].map((i) => h('i', { class: i <= k ? 'on' : '' }, icon('star'))));

function topBar(title, back, right = null, onPause = null) {
  return h('header', { class: 'gm-top' },
    onPause
      ? h('button', { class: 'gm-round gm-pausebtn', type: 'button', 'aria-label': 'Jeda', onclick: () => { sfx.tap(); onPause(); } }, icon('pause'))
      : h('button', { class: 'gm-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { sfx.tap(); go(back); } }, icon('back')),
    h('div', { class: 'gm-title' }, title),
    right || h('span', { class: 'gm-round ghost' }));
}

// ---------------- PETA LEVEL ----------------
export function mapScreen(id) {
  const g = GAMES[id];
  const gp = S.gprof(pid(), id);
  const scr = h('div', { class: 'gm-screen gm-map', style: vars(g) }, h('div', { class: 'gm-bg', 'aria-hidden': 'true' }));
  scr.appendChild(topBar(g.n, '/', h('span', { class: 'gm-pill' }, icon('star'), h('b', {}, S.totalStars(gp)))));
  const next = Array.from({ length: GAME_LEVELS }, (_, i) => i + 1).find((n) => !gp.stars[n]) || GAME_LEVELS;
  scr.appendChild(h('button', { class: 'gm-hero', type: 'button', 'aria-label': `Main level ${next}`, onclick: () => { sfx.tap(); go(`/g/${id}/${next}`); } },
    h('img', { class: 'gm-hero-art', src: g.img, alt: '' }),
    h('span', { class: 'gm-hero-txt' }, h('small', {}, `${S.levelsDone(gp)} / ${GAME_LEVELS} level`), h('b', {}, g.n), h('span', {}, g.sub), h('span', { class: 'gm-go' }, icon('play'), `Level ${next}`))));
  scr.appendChild(h('p', { class: 'gm-note' }, '🔒 Level dibuka satu demi satu. Kemajuan disimpan dalam peranti ini.'));
  speak(S.levelsDone(gp) ? `${g.n}. Jom sambung level ${next}!` : `Selamat datang ke ${g.n}! ${g.sub}`);
  g.chapters.forEach((cn, ci) => {
    const grid = h('div', { class: 'gm-grid' });
    for (let n = ci * 10 + 1; n <= ci * 10 + 10; n++) {
      const st = gp.stars[n] || 0;
      const open = S.levelOpen(gp, n);
      const demoLock = DEMO && n > DEMO_MAX;
      grid.appendChild(h('button', { class: `gm-lv ${st ? 'done' : ''} ${open ? '' : 'locked'} ${n === next ? 'cur' : ''}`, type: 'button', 'aria-label': `Level ${n}${open ? '' : ', dikunci'}`, onclick: () => {
        if (!open) { lockNotice(`Level ${n} masih berkunci.`, { action: () => go(`/g/${id}/${next}`), actionLabel: `Main level ${next}` }); return; }
        if (demoLock) { demoUpgrade(); return; }
        sfx.tap(); go(`/g/${id}/${n}`);
      } }, h('b', {}, n), open ? starRow(st, 'sm') : h('span', { class: 'gm-lock' }, icon('lock'))));
    }
    scr.appendChild(h('section', { class: 'gm-chap' }, h('h2', {}, h('span', { class: 'gm-chap-no' }, ci + 1), cn), grid));
  });
  return scr;
}

// ---------------- SKRIN MAIN ----------------
export async function playScreen(id, n, onClean) {
  const g = GAMES[id];
  const gp = S.gprof(pid(), id);
  const p = profile();
  if (!g || n < 1 || n > GAME_LEVELS || !S.levelOpen(gp, n)) {
    const first = Array.from({ length: GAME_LEVELS }, (_, i) => i + 1).find((k) => !gp.stars[k]) || 1;
    uiLater(() => { go(`/g/${id}`); if (g && n >= 1 && n <= GAME_LEVELS) setTimeout(() => lockNotice(`Level ${n} belum dibuka.`, { action: () => go(`/g/${id}/${first}`), actionLabel: `Main level ${first}` }), 300); }, 0);
    return h('div');
  }
  if (DEMO && n > DEMO_MAX) { uiLater(() => { go(`/g/${id}`); demoUpgrade(); }, 0); return h('div'); }
  const mod = (await g.load()).default;
  let alive = true, misses = 0, roundMiss = 0, lastSay = '', lastMood = 'arahan', finished = false;
  const timers = [];
  const later = (fn, ms) => { const t = setTimeout(() => { if (alive) fn(); }, ms); timers.push(t); return t; };
  const scr = h('div', { class: `gm-screen gm-play gm-${id}`, style: vars(g) }, h('div', { class: 'gm-bg', 'aria-hidden': 'true' }));
  const sayBtn = h('button', { class: 'gm-round say', type: 'button', 'aria-label': 'Dengar semula', onclick: () => { sfx.tap(); if (lastSay) speak(lastSay, { mood: lastMood }); } }, icon('sound'));
  const openPause = () => { if (finished || !alive) return false; pauseMenu({ map: `/g/${id}`, mapLabel: 'Peta level', restart: `/g/${id}/${n}` }); return true; };
  const unBack = onBack(openPause);
  scr.appendChild(topBar(h('span', { class: 'gm-chip' }, h('img', { src: g.img, alt: '' }), `Level ${n}`), `/g/${id}`, sayBtn, openPause));
  const dots = h('div', { class: 'gm-dots' });
  const bubble = h('div', { class: 'gm-bubble', role: 'status' });
  const stage = h('div', { class: 'gm-stage' });
  scr.classList.add('gm-fit');
  const unfit = autoFit(stage);
  scr.append(dots, bubble, stage);

  const ctx = {
    n, ch: chapterOf(n), rng: makeRng(`${id}:${n}`), stage, scr, later,
    alive: () => alive,
    say(text, mood = 'arahan') {
      lastSay = text; lastMood = mood;
      bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
      return speak(text, { mood });
    },
    rounds(k) { clear(dots); for (let i = 0; i < k; i++) dots.appendChild(h('i')); },
    round(i) { [...dots.children].forEach((d, k) => { d.className = k < i ? 'on' : k === i ? 'cur' : ''; }); roundMiss = 0; },
    good({ flash = true, speakIt = true } = {}) {
      sfx.correct(); haptic([10, 40, 10]);
      if (speakIt) cheer('good');
      if (flash) flashRibbon(RIBBON_WORDS[Math.floor(Math.random() * RIBBON_WORDS.length)], { parent: scr, ms: 1000 });
    },
    miss({ quiet = false } = {}) {
      misses++; roundMiss++; sfx.boing(); haptic(30); breakStreak();
      if (!quiet && roundMiss % 2 === 0) cheer('try');
    },
    done() { if (!finished) { finished = true; later(finish, 500); } },
  };
  globalThis.__gmPlay = { id, n, ctx, solve: null };

  function finish() {
    const st = misses <= 1 ? 3 : misses <= 4 ? 2 : 1;
    const res = S.record(gp, n, st);
    if (p) { addActivity(p, { levels: 1, rounds: 1 }); save(); }
    if (p && overLimit(p)) { go('/'); return; }
    if (mod.celebrate) mod.celebrate(); else sfx.win();
    later(() => cheer('done', { perfect: misses === 0 }), mod.celebrate ? 1200 : 0);
    const nextN = n < GAME_LEVELS ? n + 1 : null;
    const box = h('div', { class: 'gm-win' },
      h('div', { class: 'gm-rays', 'aria-hidden': 'true' }),
      h('img', { class: 'gm-win-art', src: g.img, alt: '' }),
      ribbon(st === 3 ? 'Hebat!' : st === 2 ? 'Syabas!' : 'Tahniah!', { sub: `Level ${n} Selesai!`, stars: st }),
      selfieButton(`${g.n} · Level ${n}`),
      res.first && n % 10 === 0 ? h('div', { class: 'gm-unlock' }, icon('medal'), `Bab "${g.chapters[chapterOf(n)]}" tamat!`) : null,
      winBar({ next: nextN ? () => go(`/g/${id}/${nextN}`) : null, replay: () => go(`/g/${id}/${n}`), map: () => go(`/g/${id}`) }));
    scr.appendChild(h('div', { class: 'gm-win-back' }, box));
  }

  // masa bermain dikira (had masa ibu bapa)
  let last = Date.now();
  const ticker = setInterval(() => { const now = Date.now(); if (document.visibilityState === 'visible' && p) { addActivity(p, { time: Math.min(10, (now - last) / 1000) }); save(); } last = now; }, 5000);
  const gameClean = mod.play(ctx) || (() => {});
  const unCoach = n === 1 && COACH[id] && !globalThis.__gmFast ? coach(scr, COACH[id], { delay: 2200 }) : () => {};
  onClean(() => { unfit(); unBack(); unCoach(); alive = false; clearInterval(ticker); timers.forEach(clearTimeout); try { gameClean(); } catch { /* */ } stopSpeak(); document.querySelectorAll('.gm-ghost').forEach((e) => e.remove()); globalThis.__gmPlay = null; });
  return scr;
}

// Seret-dan-lepas ringkas (sentuh & tetikus). onDrop(zone) pulangkan true jika diterima.
export function draggable(el, { zones, onDrop, onTap }) {
  let start = null, ghost = null, moved = false;
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault(); start = { x: e.clientX, y: e.clientY }; moved = false;
    el.setPointerCapture?.(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!start) return;
    if (!moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
    if (!moved) { moved = true; ghost = el.cloneNode(true); ghost.classList.add('gm-ghost'); const r = el.getBoundingClientRect(); ghost.style.width = `${r.width}px`; ghost.style.height = `${r.height}px`; document.body.appendChild(ghost); el.classList.add('lifting'); sfx.pick?.(); }
    ghost.style.left = `${e.clientX}px`; ghost.style.top = `${e.clientY}px`;
    zones().forEach((z) => { const r = z.getBoundingClientRect(); z.classList.toggle('over', e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom); });
  });
  const end = (e) => {
    if (!start) return;
    const wasMoved = moved; start = null;
    el.classList.remove('lifting');
    if (ghost) { ghost.remove(); ghost = null; }
    const zs = zones(); zs.forEach((z) => z.classList.remove('over'));
    if (!wasMoved) { onTap?.(); return; }
    const hit = zs.find((z) => { const r = z.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
    if (hit) onDrop(hit);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', () => { start = null; el.classList.remove('lifting'); if (ghost) { ghost.remove(); ghost = null; } });
}
