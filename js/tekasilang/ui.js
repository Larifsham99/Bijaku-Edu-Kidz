// =====================================================================
//  TEKA SILANG CILIK — skrin & enjin teka-teki (DOM). Kelas berawalan .ts-
//  TIADA suara: semua maklum balas melalui visual, animasi & kesan bunyi.
// =====================================================================
import { h, clear } from '../ui.js';
import { go } from '../nav.js';
import { lockNotice } from '../notice.js';
import { profile, save, addActivity } from '../store.js';
import { icon } from '../icons.js';
import { overLimit } from '../screens/timeout.js';
import { DEMO, DEMO_MAX } from '../demo.js';
import { demoUpgrade } from '../screens/shared.js';
import { CHAPTERS, LEVELS_PER_CHAPTER } from './data.js';
import { buildLevel, TOTAL, isPlate } from './levels.js';
import { artSvg } from './art.js';
import { sfx, unlock } from './sound.js';
import { cheer, ribbon, flashRibbon, RIBBON_WORDS, selfieButton } from '../cheer.js';
const praiseWord = () => RIBBON_WORDS[Math.floor(Math.random() * RIBBON_WORDS.length)];
import * as S from './store.js';

const later = (fn, ms) => setTimeout(fn, ms * (globalThis.__dcTimeScale || 1));
const TILE_COLORS = ['#ff6b6b', '#ff922b', '#fcc419', '#51cf66', '#22b8cf', '#4dabf7', '#845ef7', '#f06595'];
const tileColor = (ch) => TILE_COLORS[(ch.charCodeAt(0) * 7) % TILE_COLORS.length];
const tp = () => S.tprof(profile()?.id);

function tile(ch, extra = {}) {
  return h('span', { class: `ts-tile ${extra.cls || ''}`, style: `--tc:${extra.color || tileColor(ch)}`, ...(extra.attrs || {}) }, ch);
}
function art(id, size, cls = '') { return h('span', { class: `ts-artcard ${cls}`, html: artSvg(id, { size }) }); }
function top(title, back, right = null) {
  return h('div', { class: 'ts-top' },
    h('button', { class: 'ts-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { sfx.tap(); go(back); } }, icon('back')),
    h('div', { class: 'ts-top-title' }, title), right || h('span', { class: 'ts-spacer' }));
}
const starPill = (n) => h('span', { class: 'ts-pill' }, icon('star'), String(n));
function logo() {
  const row = (w, cls) => h('span', { class: `ts-logo-row ${cls}` }, ...[...w].map((ch, i) => (ch === ' ' ? h('i', { class: 'gap' }) : tile(ch, { cls: 'mini', attrs: { style: `--tc:${tileColor(ch)};animation-delay:${i * 0.06}s` } }))));
  return h('div', { class: 'ts-logo' }, row('TEKA SILANG', 'a'), row('CILIK', 'b'));
}

// ---------- seret & lepas (sentuhan + tetikus) ----------
function dragTile(el, { onTap, onDrop, data }) {
  let start = null, ghost = null, moved = false;
  el.addEventListener('pointerdown', (e) => {
    if (el.classList.contains('used') || el.classList.contains('gone')) return;
    unlock(); e.preventDefault();
    start = { x: e.clientX, y: e.clientY }; moved = false;
    el.setPointerCapture?.(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!moved && Math.hypot(dx, dy) > 9) {
      moved = true; sfx.drag();
      const r = el.getBoundingClientRect();
      ghost = el.cloneNode(true); ghost.classList.add('ts-ghost');
      Object.assign(ghost.style, { width: r.width + 'px', height: r.height + 'px', left: r.left + 'px', top: r.top + 'px' });
      ghost.dataset.ox = String(start.x - r.left); ghost.dataset.oy = String(start.y - r.top);
      document.body.appendChild(ghost); el.classList.add('lifted');
    }
    if (ghost) { ghost.style.left = e.clientX - +ghost.dataset.ox + 'px'; ghost.style.top = e.clientY - +ghost.dataset.oy + 'px'; }
  });
  const end = (e) => {
    if (!start) return;
    const wasMoved = moved; start = null;
    if (ghost) {
      ghost.style.display = 'none';
      const under = document.elementFromPoint(e.clientX, e.clientY);
      ghost.remove(); ghost = null; el.classList.remove('lifted');
      const zone = under?.closest?.('[data-drop]');
      if (zone) onDrop(zone, data); else sfx.wrong();
    } else if (!wasMoved) onTap(data);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', () => { start = null; ghost?.remove(); ghost = null; el.classList.remove('lifted'); });
}
function wobble(el) { if (!el) return; el.classList.remove('ts-wobble'); void el.offsetWidth; el.classList.add('ts-wobble'); }
function sparkle(target, n = 10) {
  const r = target.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const s = h('i', { class: 'ts-spark' });
    const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50;
    Object.assign(s.style, { left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px', '--dx': Math.cos(a) * d + 'px', '--dy': Math.sin(a) * d + 'px', background: TILE_COLORS[i % TILE_COLORS.length] });
    document.body.appendChild(s); setTimeout(() => s.remove(), 900);
  }
}
function confettiBurst(n = 40) {
  for (let i = 0; i < n; i++) {
    const s = h('i', { class: 'ts-conf' });
    Object.assign(s.style, { left: Math.random() * 100 + 'vw', background: TILE_COLORS[i % TILE_COLORS.length], animationDuration: 1.4 + Math.random() * 1.4 + 's', animationDelay: Math.random() * 0.3 + 's' });
    document.body.appendChild(s); setTimeout(() => s.remove(), 3400);
  }
}

// =====================================================================
//  LAMAN UTAMA: 15 chapter
// =====================================================================
export function homeScreen() {
  const t = tp();
  const nx = S.nextLevel(t);
  const scr = h('div', { class: 'ts-screen ts-home' });
  scr.appendChild(top(h('span', {}, ''), '/', h('div', { class: 'ts-pills' }, starPill(S.totalStars(t)), h('span', { class: 'ts-pill' }, icon('medal'), String(S.medals(t))))));
  scr.appendChild(logo());
  scr.appendChild(h('p', { class: 'ts-sub' }, 'Susun huruf, cari jawapan!'));
  const ch = CHAPTERS[nx.ci];
  scr.appendChild(h('button', { class: 'ts-cta', type: 'button', 'aria-label': `Main ${ch.n} level ${nx.n}`, onclick: () => { unlock(); sfx.tap(); go(`/silang/main/${nx.ci}/${nx.n}`); } },
    h('span', { class: 'ts-cta-play' }, icon('play')),
    art(ch.icon, 64, 'ts-cta-art'),
    h('span', { class: 'ts-cta-txt' }, h('b', {}, ch.n), h('small', {}, `Level ${nx.n}`)),
    h('span', { class: 'ts-cta-tiles' }, tile('A', { cls: 'mini' }), tile('B', { cls: 'mini' }))));
  const grid = h('div', { class: 'ts-chapters' });
  CHAPTERS.forEach((c, ci) => {
    const open = S.chapterOpen(t, ci), done = S.chapterDone(t, c.id);
    grid.appendChild(h('button', { class: `ts-chap ${open ? '' : 'locked'}`, type: 'button', style: `--cc:${c.c};--cc2:${c.c2}`, 'aria-label': `${c.n}, ${done} daripada 30`, onclick: () => {
      unlock();
      if (!open) { wobble(grid.children[ci]); lockNotice(`Bab ${c.n} masih berkunci.`, { sub: `Tamatkan 10 level dalam bab ${CHAPTERS[ci - 1].n} dahulu. Kemajuan disimpan dalam peranti ini.`, action: () => go(`/silang/bab/${ci - 1}`), actionLabel: `Buka ${CHAPTERS[ci - 1].n}` }); return; }
      sfx.tap(); go(`/silang/bab/${ci}`);
    } },
      h('span', { class: 'ts-chap-num' }, String(ci + 1)),
      art(c.icon, 78, 'ts-chap-art'),
      h('b', {}, c.n),
      h('span', { class: 'ts-bar' }, h('i', { style: { width: `${(done / 30) * 100}%` } })),
      h('small', {}, `${done}/30`),
      S.medalOf(t, c.id) ? h('span', { class: 'ts-medal' }, icon('medal')) : null,
      open ? null : h('span', { class: 'ts-lock' }, icon('lock'))));
  });
  scr.appendChild(grid);
  scr.appendChild(h('button', { class: 'ts-book-btn', type: 'button', onclick: () => { sfx.tap(); go('/silang/pelekat'); } }, icon('star'), 'Buku Pelekat'));
  scr.appendChild(h('p', { class: 'ts-foot' }, `${TOTAL} level · ${CHAPTERS.length} chapter · tanpa iklan`));
  return scr;
}

// =====================================================================
//  CHAPTER: 30 level
// =====================================================================
export function chapterScreen(ci) {
  const t = tp(), c = CHAPTERS[ci];
  if (!c || !S.chapterOpen(t, ci)) { later(() => go('/silang'), 0); return h('div'); }
  const scr = h('div', { class: 'ts-screen ts-chapter', style: `--cc:${c.c};--cc2:${c.c2}` });
  scr.appendChild(top(c.n, '/silang', h('span', { class: 'ts-pill' }, `${S.chapterDone(t, c.id)}/30`)));
  scr.appendChild(h('div', { class: 'ts-chap-hero' }, art(c.icon, 110, 'float'), h('div', { class: 'ts-chap-words' }, ...c.words.slice(0, 8).map((w) => (isPlate(w) ? null : art(w.art, 40, 'mini'))))));
  const path = h('div', { class: 'ts-levels' });
  let cur = null;
  for (let n = 1; n <= LEVELS_PER_CHAPTER; n++) {
    const st = S.stars(t, c.id, n), open = S.levelOpen(t, ci, n);
    const demoLock = DEMO && (ci > 0 || n > DEMO_MAX);
    const row = Math.floor((n - 1) / 5), col = row % 2 ? 4 - ((n - 1) % 5) : (n - 1) % 5;
    const b = h('button', { class: `ts-lv ${st ? 'done' : ''} ${open ? '' : 'locked'} ${open && !st ? 'cur' : ''} ${n === 30 ? 'master' : ''}`, type: 'button', style: { gridRow: row + 1, gridColumn: col + 1 }, 'aria-label': `Level ${n}`, onclick: () => {
      unlock();
      if (!open) { wobble(b); const nx = Array.from({ length: LEVELS_PER_CHAPTER }, (_, k) => k + 1).find((k) => S.levelOpen(t, ci, k) && !S.stars(t, c.id, k)) || 1; lockNotice(`Level ${n} masih berkunci.`, { action: () => go(`/silang/main/${ci}/${nx}`), actionLabel: `Main level ${nx}` }); return; }
      if (demoLock) { demoUpgrade(); return; }
      sfx.tap(); go(`/silang/main/${ci}/${n}`);
    } },
      n === 30 ? h('span', { class: 'ts-lv-medal' }, icon('medal')) : h('b', {}, String(n)),
      st ? h('span', { class: 'ts-lv-stars' }, ...[1, 2, 3].map((k) => h('i', { class: k <= st ? 'on' : '' }, icon('star')))) : null,
      open ? null : h('span', { class: 'ts-lv-lock' }, icon('lock')));
    if (open && !st) cur = b;
    path.appendChild(b);
  }
  scr.appendChild(path);
  if (cur) later(() => cur.scrollIntoView({ block: 'center' }), 50);
  return scr;
}

// =====================================================================
//  BUKU PELEKAT
// =====================================================================
export function stickerScreen() {
  const t = tp();
  const scr = h('div', { class: 'ts-screen ts-stickers' });
  scr.appendChild(top('Buku Pelekat', '/silang', starPill(S.totalStars(t))));
  scr.appendChild(h('div', { class: 'ts-book' }, ...CHAPTERS.map((c) => {
    const got = S.medalOf(t, c.id);
    return h('div', { class: `ts-sticker ${got ? 'got' : ''}`, style: `--cc:${c.c};--cc2:${c.c2}` }, art(c.icon, 76), h('small', {}, c.n), got ? h('span', { class: 'ts-medal' }, icon('medal')) : h('span', { class: 'ts-lock' }, icon('lock')));
  })));
  return scr;
}

// =====================================================================
//  PERMAINAN
// =====================================================================
export function playScreen(ci, n, onClean) {
  const t = tp(), c = CHAPTERS[ci], p = profile();
  if (!c || n < 1 || n > LEVELS_PER_CHAPTER || !S.levelOpen(t, ci, n)) { later(() => { go('/silang'); if (c) setTimeout(() => lockNotice(`${c.n} level ${n} belum dibuka.`, { sub: 'Level & bab dibuka satu demi satu. Kemajuan disimpan dalam peranti ini.' }), 300); }, 0); return h('div'); }
  if (DEMO && (ci > 0 || n > DEMO_MAX)) { later(() => { go('/silang/bab/0'); demoUpgrade(); }, 0); return h('div'); }
  const level = buildLevel(ci, n);
  const scr = h('div', { class: `ts-screen ts-play ${level.master ? 'is-master' : ''}`, style: `--cc:${c.c};--cc2:${c.c2}` });
  const dots = h('div', { class: 'ts-dots' }, ...level.rounds.map(() => h('i')));
  const hintBtn = h('button', { class: 'ts-round ts-hint', type: 'button', 'aria-label': 'Petunjuk', onclick: () => { unlock(); cur?.hint(true); } }, icon('hint'));
  scr.appendChild(top(h('span', { class: 'ts-lvchip' }, art(c.icon, 30, 'mini'), `${n}`), `/silang/bab/${ci}`, hintBtn));
  scr.appendChild(dots);
  const stage = h('div', { class: 'ts-stage' });
  scr.appendChild(stage);
  let ri = 0, mistakes = 0, cur = null, alive = true;
  let roundMiss = 0;
  const api = {
    // galakan bersuara setiap dua kesilapan (tidak membebel)
    mistake: () => { mistakes++; roundMiss++; if (roundMiss % 2 === 0) cheer('try'); },
    done: () => {
      roundMiss = 0;
      if (ri < level.rounds.length - 1) { cheer('good'); flashRibbon(praiseWord(), { parent: scr, ms: 1100 }); }
      nextRound();
    },
  };
  globalThis.__tsPlay = { solve: () => cur?.solve(), level };

  function startRound() {
    clear(stage);
    [...dots.children].forEach((d, i) => d.className = i < ri ? 'on' : i === ri ? 'cur' : '');
    const r = level.rounds[ri];
    cur = r.entries ? crossPuzzle(r, api, c) : r.mode === 'I' ? findPuzzle(r, api) : r.mode === 'G' ? shadowPuzzle(r, api) : r.mode === 'F' ? matchPuzzle(r, api) : slotPuzzle(r, api);
    stage.appendChild(cur.el);
    stage.classList.remove('ts-in'); void stage.offsetWidth; stage.classList.add('ts-in');
  }
  function nextRound() {
    ri++;
    if (ri < level.rounds.length) { later(startRound, 700); return; }
    later(finish, 600);
  }
  function finish() {
    if (!alive) return;
    const st = mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1;
    const res = S.record(t, level, st);
    save();
    if (p && overLimit(p)) { go('/'); return; }
    sfx.complete(); confettiBurst(level.master ? 70 : 36);
    cheer('done', { perfect: mistakes === 0 });
    const box = h('div', { class: `ts-win ${level.master ? 'master' : ''}` },
      h('div', { class: 'ts-rays' }),
      ribbon(level.master ? 'Tahniah!' : st === 3 ? 'Hebat!' : st === 2 ? 'Syabas!' : 'Bagus!', { sub: level.master ? 'Chapter Selesai!' : 'Tahap Selesai!' }),
      selfieButton(`Teka Silang · ${c.n}`),
      level.master ? h('div', { class: 'ts-win-sticker' }, art(c.icon, 120), h('span', { class: 'ts-medal big' }, icon('medal'))) : h('div', { class: 'ts-win-board' }, ...level.words.slice(0, 3).map((w) => h('span', { class: 'ts-win-word' }, ...[...w].map((ch, i) => tile(ch, { cls: 'mini', attrs: { style: `--tc:${tileColor(ch)};animation-delay:${0.2 + i * 0.05}s` } }))))),
      h('div', { class: 'ts-win-stars' }, ...[1, 2, 3].map((k) => h('span', { class: `ts-bigstar ${k <= st ? 'on' : ''}`, style: { animationDelay: `${0.3 + k * 0.25}s` } }, icon('star')))),
      res.openedChapter !== null ? h('div', { class: 'ts-unlocked' }, icon('lock'), art(CHAPTERS[res.openedChapter].icon, 46, 'mini'), h('b', {}, CHAPTERS[res.openedChapter].n)) : null,
      h('div', { class: 'ts-win-btns' },
        h('button', { class: 'ts-btn', type: 'button', 'aria-label': 'Main semula', onclick: () => { sfx.tap(); go(`/silang/main/${ci}/${n}`); } }, icon('replay')),
        h('button', { class: 'ts-btn', type: 'button', 'aria-label': 'Peta chapter', onclick: () => { sfx.tap(); go(`/silang/bab/${ci}`); } }, icon('map')),
        n < LEVELS_PER_CHAPTER ? h('button', { class: 'ts-btn go', type: 'button', 'aria-label': 'Level seterusnya', onclick: () => { sfx.tap(); go(`/silang/main/${ci}/${n + 1}`); } }, icon('next')) : h('button', { class: 'ts-btn go', type: 'button', 'aria-label': 'Semua chapter', onclick: () => { sfx.tap(); go('/silang'); } }, icon('next'))));
    [1, 2, 3].forEach((k) => { if (k <= st) later(() => sfx.star(k - 1), 300 + k * 250); });
    if (level.master) later(() => sfx.sticker(), 1300);
    if (res.openedChapter !== null) later(() => sfx.unlock(), 1800);
    scr.appendChild(h('div', { class: 'ts-win-back' }, box));
  }
  // masa bermain dikira (had masa ibu bapa)
  let last = Date.now();
  const ticker = setInterval(() => { const now = Date.now(); if (document.visibilityState === 'visible' && p) { addActivity(p, { time: Math.min(10, (now - last) / 1000) }); save(); } last = now; }, 5000);
  onClean(() => { alive = false; clearInterval(ticker); document.querySelectorAll('.ts-ghost,.ts-spark,.ts-conf').forEach((e) => e.remove()); globalThis.__tsPlay = null; });
  later(startRound, 0);
  if (level.n <= 2 && ci === 0) later(() => { const hand = h('span', { class: 'ts-tut' }); stage.appendChild(hand); setTimeout(() => hand.remove(), 4200); }, 400);
  return scr;
}

// ---------- A / B / C: kotak perkataan ----------
function slotPuzzle(r, api) {
  const word = r.word, n = word.length;
  const filled = [...Array(n)].map((_, i) => r.given.includes(i));
  let wrong = 0, target = null;
  const el = h('div', { class: `ts-pz ts-slot-pz mode-${r.mode}` });
  const pic = art(r.art, isPlate(r) ? 120 : 150, 'big float');
  const slots = [...word].map((ch, i) => h('span', { class: `ts-slot ${filled[i] ? 'filled given' : ''}`, 'data-drop': '1', 'data-i': i, onclick: () => { if (!filled[i]) { target = i; slots.forEach((s) => s.classList.remove('sel')); slots[i].classList.add('sel'); sfx.tap(); } } }, filled[i] ? tile(ch) : null));
  const tray = h('div', { class: `ts-tray ${r.mode === 'C' ? 'floating' : ''}` });
  const tiles = r.pool.map((ch, k) => {
    const tl = tile(ch, { cls: 'big', attrs: { style: `--tc:${tileColor(ch)};--d:${(k % 5) * 0.3}s` } });
    dragTile(tl, { data: { ch, tl }, onTap: (d) => tryPlace(d, nextEmpty()), onDrop: (zone, d) => tryPlace(d, +zone.dataset.i) });
    return tl;
  });
  tray.append(...tiles);
  el.append(pic, h('div', { class: 'ts-slots', style: `--n:${n}` }, ...slots), tray);
  const nextEmpty = () => (target !== null && !filled[target] ? target : filled.findIndex((f) => !f));
  function tryPlace({ ch, tl }, i) {
    if (i < 0 || i === undefined || filled[i] || tl.classList.contains('used')) return;
    if (word[i] === ch) {
      filled[i] = true; target = null; tl.classList.add('used'); sfx.place();
      slots[i].classList.remove('sel', 'hint'); slots[i].classList.add('filled', 'pop'); slots[i].appendChild(tile(ch));
      tiles.forEach((x) => x.classList.remove('glow'));
      if (filled.every(Boolean)) { sfx.word(); slots.forEach((s, k) => setTimeout(() => s.classList.add('win'), k * 60)); sparkle(slots[Math.floor(n / 2)], 16); pic.classList.add('win'); api.done(); }
    } else { wrong++; api.mistake(); sfx.wrong(); wobble(tl); wobble(slots[i]); hint(false); }
  }
  function hint(manual) {
    const i = nextEmpty(); if (i < 0) return;
    const need = word[i];
    const good = tiles.find((x) => !x.classList.contains('used') && x.textContent === need);
    if (manual) { sfx.hint(); wrong++; api.mistake(); }
    slots[i].classList.add('hint');
    if (wrong >= 1 && good) good.classList.add('glow');
    if (wrong >= 2) tiles.forEach((x) => { if (!x.classList.contains('used') && !word.split('').some((w, k) => !filled[k] && w === x.textContent)) x.classList.add('gone'); });
    if (wrong >= 3 && good) { wrong = 1; later(() => tryPlace({ ch: need, tl: good }, i), 350); }
  }
  return { el, hint, solve: () => { for (let i = 0; i < n; i++) if (!filled[i]) { const g = tiles.find((x) => !x.classList.contains('used') && x.textContent === word[i]); tryPlace({ ch: word[i], tl: g }, i); } } };
}

// ---------- I: cari huruf ----------
function findPuzzle(r, api) {
  let found = 0, wrong = 0;
  const el = h('div', { class: 'ts-pz ts-find-pz' });
  const wordRow = h('div', { class: 'ts-word-show' }, ...[...r.word].map((ch, i) => tile(ch, { cls: i === r.idx ? 'target' : 'dim' })));
  const target = h('div', { class: 'ts-find-target' }, tile(r.target, { cls: 'big' }), h('span', { class: 'ts-count' }, ...Array.from({ length: r.count }, () => h('i'))));
  const grid = h('div', { class: 'ts-find-grid', style: `--cols:${r.tiles.length > 6 ? 3 : 3}` });
  const tiles = r.tiles.map((ch) => {
    const b = h('button', { class: 'ts-find-cell', type: 'button', onclick: () => {
      unlock();
      if (b.classList.contains('ok')) return;
      if (ch === r.target) {
        b.classList.add('ok'); sfx.place(); target.querySelectorAll('.ts-count i')[found++]?.classList.add('on'); sparkle(b, 6);
        if (found >= r.count) { sfx.word(); sparkle(target, 14); api.done(); }
      } else { wrong++; api.mistake(); sfx.wrong(); wobble(b); hint(false); }
    } }, tile(ch, { cls: 'big' }));
    return b;
  });
  grid.append(...tiles);
  el.append(art(r.art, isPlate(r) ? 100 : 120, 'float'), wordRow, target, grid);
  function hint(manual) {
    if (manual) { sfx.hint(); wrong++; api.mistake(); }
    const g = tiles.filter((b) => !b.classList.contains('ok') && b.textContent === r.target);
    if (wrong >= 1) g[0]?.classList.add('glow');
    if (wrong >= 2) tiles.forEach((b) => { if (b.textContent !== r.target) b.classList.add('gone'); });
  }
  return { el, hint, solve: () => tiles.filter((b) => b.textContent === r.target && !b.classList.contains('ok')).forEach((b) => b.click()) };
}

// ---------- G: bayang ----------
function shadowPuzzle(r, api) {
  let wrong = 0, done = false;
  const el = h('div', { class: 'ts-pz ts-shadow-pz' });
  const pic = art(r.art, 160, 'shadow float');
  const opts = r.options.map((w) => {
    const b = h('button', { class: 'ts-word-opt', type: 'button', onclick: () => {
      unlock(); if (done) return;
      if (w === r.word) { done = true; b.classList.add('ok'); pic.classList.remove('shadow'); pic.classList.add('win'); sfx.word(); sparkle(pic, 16); api.done(); }
      else { wrong++; api.mistake(); sfx.wrong(); wobble(b); b.classList.add('no'); hint(false); }
    } }, ...[...w].map((ch) => tile(ch, { cls: 'mini' })));
    return b;
  });
  el.append(pic, h('div', { class: 'ts-opts' }, ...opts));
  function hint(manual) {
    if (manual) { sfx.hint(); wrong++; api.mistake(); }
    if (wrong >= 1) pic.classList.add('peek');
    if (wrong >= 2) opts.find((b) => b.textContent === r.word)?.classList.add('glow');
  }
  return { el, hint, solve: () => opts.find((b) => b.textContent === r.word).click() };
}

// ---------- F: padan perkataan ----------
function matchPuzzle(r, api) {
  let sel = null, left = r.items.length, wrong = 0;
  const el = h('div', { class: 'ts-pz ts-match-pz' });
  const zones = r.items.map((it) => h('div', { class: 'ts-mzone', 'data-drop': '1', 'data-w': it.word, onclick: () => sel && attempt(sel, zones.find((z) => z.dataset.w === it.word)) }, art(it.art, 96), h('span', { class: 'ts-mslot' })));
  const chips = r.words.map((w) => {
    const chip = h('span', { class: 'ts-chip' }, ...[...w].map((ch) => tile(ch, { cls: 'mini' })));
    dragTile(chip, { data: w, onTap: () => { if (chip.classList.contains('used')) return; sfx.pick(); chips.forEach((x) => x.classList.remove('sel')); chip.classList.add('sel'); sel = chip; }, onDrop: (zone) => attempt(chip, zone) });
    chip.dataset.w = w;
    return chip;
  });
  function attempt(chip, zone) {
    if (!zone || chip.classList.contains('used') || zone.classList.contains('ok')) return;
    if (zone.dataset.w === chip.dataset.w) {
      chip.classList.add('used'); chip.classList.remove('sel'); sel = null; zone.classList.add('ok'); sfx.place(); sfx.coin();
      zone.querySelector('.ts-mslot').append(...[...chip.dataset.w].map((ch) => tile(ch, { cls: 'mini' }))); sparkle(zone, 10);
      if (--left === 0) { sfx.word(); api.done(); }
    } else { wrong++; api.mistake(); sfx.wrong(); wobble(zone); wobble(chip); hint(false); }
  }
  el.append(h('div', { class: 'ts-mzones' }, ...zones), h('div', { class: 'ts-chips' }, ...chips));
  function hint(manual) {
    if (manual) { sfx.hint(); wrong++; api.mistake(); }
    const chip = sel && !sel.classList.contains('used') ? sel : chips.find((x) => !x.classList.contains('used'));
    if (!chip) return;
    chips.forEach((x) => x.classList.remove('glow')); zones.forEach((z) => z.classList.remove('glow'));
    if (wrong >= 1) { chip.classList.add('glow'); zones.find((z) => z.dataset.w === chip.dataset.w)?.classList.add('glow'); }
    if (wrong >= 3) { wrong = 1; later(() => attempt(chip, zones.find((z) => z.dataset.w === chip.dataset.w)), 400); }
  }
  return { el, hint, solve: () => chips.forEach((ch) => attempt(ch, zones.find((z) => z.dataset.w === ch.dataset.w))) };
}

// ---------- D / E / J: teka silang ----------
function crossPuzzle(r, api, chap) {
  const cells = new Map(); // "r,c" -> { ch, entries:[ei], el, filled }
  r.entries.forEach((en, ei) => { for (let i = 0; i < en.word.length; i++) { const k = `${en.r + (en.dir === 'v' ? i : 0)},${en.c + (en.dir === 'h' ? i : 0)}`; if (!cells.has(k)) cells.set(k, { ch: en.word[i], entries: [], filled: r.given.includes(k) }); cells.get(k).entries.push(ei); } });
  const keysOf = (ei) => { const en = r.entries[ei]; return [...en.word].map((_, i) => `${en.r + (en.dir === 'v' ? i : 0)},${en.c + (en.dir === 'h' ? i : 0)}`); };
  const wordDone = (ei) => keysOf(ei).every((k) => cells.get(k).filled);
  let active = 0, activeCell = null, wrong = 0;
  const el = h('div', { class: `ts-pz ts-cross-pz mode-${r.mode} ${r.master ? 'master' : ''}` });
  const clues = h('div', { class: 'ts-clues' });
  const chipEls = r.entries.map((en, ei) => h('button', { class: 'ts-clue', type: 'button', style: `--wc:${en.color}`, onclick: () => { sfx.tap(); setActive(ei); } },
    art(en.art, isPlate(en) ? 44 : 52, 'mini'),
    isPlate(en) ? h('span', { class: 'ts-clue-first' }, tile(en.word[0], { cls: 'micro' })) : null,
    h('span', { class: 'ts-clue-dir' }, en.dir === 'h' ? '→' : '↓'),
    h('span', { class: 'ts-clue-len' }, ...[...en.word].map(() => h('i')))));
  clues.append(...chipEls);
  const grid = h('div', { class: 'ts-grid', style: `--gw:${r.w};--gh:${r.h}` });
  for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) {
    const k = `${y},${x}`, cell = cells.get(k);
    if (!cell) { grid.appendChild(h('span', { class: 'ts-gap' })); continue; }
    const colors = cell.entries.map((ei) => r.entries[ei].color);
    cell.el = h('span', { class: `ts-cell ${cell.filled ? 'filled given' : ''}`, 'data-drop': '1', 'data-k': k, style: `--c1:${colors[0]};--c2:${colors[1] || colors[0]}`, onclick: () => { unlock(); if (cell.filled) return; sfx.tap(); setActive(cell.entries.find((ei) => !wordDone(ei)) ?? cell.entries[0], k); } }, cell.filled ? tile(cell.ch, { cls: 'cell' }) : null);
    grid.appendChild(cell.el);
  }
  const tray = h('div', { class: 'ts-tray cross' });
  const tiles = r.pool.map((ch) => {
    const tl = tile(ch, { cls: 'big' });
    dragTile(tl, { data: { ch, tl }, onTap: (d) => tryFill(d, activeCell), onDrop: (zone, d) => tryFill(d, zone.dataset.k) });
    return tl;
  });
  tray.append(...tiles);
  el.append(clues, h('div', { class: 'ts-grid-wrap' }, grid), tray);
  function firstEmpty(ei) { return keysOf(ei).find((k) => !cells.get(k).filled) || null; }
  function setActive(ei, k = null) {
    active = ei; activeCell = k && !cells.get(k).filled ? k : firstEmpty(ei);
    chipEls.forEach((cEl, i) => cEl.classList.toggle('on', i === ei));
    cells.forEach((cell, kk) => { cell.el.classList.toggle('act', r.entries[ei] && keysOf(ei).includes(kk)); cell.el.classList.toggle('sel', kk === activeCell); cell.el.style.setProperty('--ac', r.entries[ei].color); });
    tiles.forEach((x) => x.classList.remove('glow', 'gone')); wrong = 0;
  }
  function advance() {
    if (activeCell) return;
    const next = r.entries.findIndex((_, ei) => !wordDone(ei));
    if (next >= 0) setActive(next);
  }
  function tryFill({ ch, tl }, k) {
    if (!k) { advance(); k = activeCell; if (!k) return; }
    const cell = cells.get(k); if (!cell || cell.filled) return;
    if (cell.ch === ch) {
      cell.filled = true; cell.el.classList.add('filled', 'pop'); cell.el.appendChild(tile(ch, { cls: 'cell' })); sfx.place(); wrong = 0;
      tiles.forEach((x) => x.classList.remove('glow', 'gone'));
      const finished = cell.entries.filter((ei) => wordDone(ei));
      finished.forEach((ei) => { if (!chipEls[ei].classList.contains('ok')) { chipEls[ei].classList.add('ok'); sfx.word(); keysOf(ei).forEach((kk, i) => setTimeout(() => cells.get(kk).el.classList.add('win'), i * 50)); sparkle(chipEls[ei], 10); } });
      if ([...cells.values()].every((x) => x.filled)) { el.classList.add('complete'); later(() => { sparkle(grid, 24); api.done(); }, 350); return; }
      const curDone = wordDone(active);
      activeCell = null;
      if (!curDone) activeCell = firstEmpty(active);
      if (!activeCell) { const nx = r.entries.findIndex((_, ei) => !wordDone(ei)); if (nx >= 0) setActive(nx); }
      else setActive(active, activeCell);
    } else { wrong++; api.mistake(); sfx.wrong(); wobble(tl); wobble(cell.el); hintAt(k); }
  }
  function hintAt(k) {
    const need = cells.get(k)?.ch; if (!need) return;
    const good = tiles.find((x) => x.textContent === need);
    if (wrong >= 1) good?.classList.add('glow');
    if (wrong >= 2) tiles.forEach((x) => { if (x !== good) x.classList.add('gone'); });
    if (wrong >= 3 && good) { later(() => tryFill({ ch: need, tl: good }, k), 350); }
  }
  setActive(r.entries.findIndex((_, ei) => !wordDone(ei)) >= 0 ? r.entries.findIndex((_, ei) => !wordDone(ei)) : 0);
  // saiz sel ikut skrin
  const fit = () => { const W = Math.min(window.innerWidth, 700) - 92, H = window.innerHeight * 0.46; const cs = Math.floor(Math.min(64, (W - r.w * 4) / r.w, (H - r.h * 4) / r.h)); grid.style.setProperty('--cs', Math.max(30, cs) + 'px'); };
  fit(); const onR = () => (el.isConnected ? fit() : removeEventListener('resize', onR)); addEventListener('resize', onR);
  return {
    el,
    hint: (manual) => { if (manual) { sfx.hint(); api.mistake(); } wrong = Math.max(wrong + 1, 1); if (activeCell) { cells.get(activeCell).el.classList.add('hint'); hintAt(activeCell); } },
    solve: () => { for (const [k, cell] of cells) if (!cell.filled) tryFill({ ch: cell.ch, tl: tiles.find((x) => x.textContent === cell.ch) }, k); },
  };
}
