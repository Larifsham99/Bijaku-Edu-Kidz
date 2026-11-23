// =====================================================================
//  CILIK RACING — skrin & HUD (DOM). Semua elemen berawalan .rc-
// =====================================================================
import { h, clear, sleep } from '../ui.js';
import { ribbon, selfieButton, praiseGate, breakStreak, winBar } from '../cheer.js';
import { go, onBack } from '../nav.js';
import { lockNotice } from '../notice.js';
import { profile, save, addActivity } from '../store.js';
import { speak, stopSpeak, playSound, hasSound, haptic, sfx } from '../audio.js';
import { icon } from '../icons.js';
import { shapeSvg, NUM_WORDS } from '../data/content.js';
import { overLimit } from '../screens/timeout.js';
import { DEMO, DEMO_MAX } from '../demo.js';
import { demoUpgrade } from '../screens/shared.js';
import { pick } from '../talk.js';
import { RC_WORLDS, CARS, PAINTS, STICKERS_RC, RIMS, MEDALS, carById } from './data.js';
import { buildLevel, LEVELS_PER_WORLD, TOTAL_LEVELS } from './levels.js';
import { createRace } from './engine.js';
import { createRenderer, worldScene } from './render.js';
import { drawCarSide, drawCarRear, drawSticker, rr } from './cars.js';
import { spriteCanvas, ball } from './sprites.js';
import { TOPIC_NAMES } from './education.js';
import * as S from './store.js';
import * as snd from './sound.js';

const MASCOTS = ['mimi', 'bobo', 'coco', 'dino', 'lala'];
const PRAISE = ['Hebat!', 'Betul!', 'Wah, laju betul!', 'Pandainya!', 'Terbaik!', 'Syabas!', 'Bijak!'];
const RETRY = ['Cuba lagi di depan, ya.', 'Tak apa, ada pintu baharu di depan.', 'Jom cuba sekali lagi.'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const later = (fn, ms) => setTimeout(fn, ms);

let driverCache = {};
export function driverImg(p) {
  const id = MASCOTS.includes(p?.avatar) ? p.avatar : 'mimi';
  if (!driverCache[id]) { const im = new Image(); im.src = `visual-assets/mascots/${id}.svg`; driverCache[id] = im; }
  return driverCache[id];
}
function rpNow() { const p = profile(); return { p, rp: S.rprof(p?.id) }; }
function currentCar(rp) { const c = carById(rp.car); return S.carUnlocked(rp, c) ? c : CARS[0]; }

// ---------- komponen kecil ----------
function topBar(title, back, right = null) {
  return h('div', { class: 'rc-top' },
    h('button', { class: 'rc-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { snd.rsfx.pop(); go(back); } }, icon('back')),
    h('div', { class: 'rc-top-title' }, title),
    right || h('span', { class: 'rc-spacer' }));
}
function starPill(n) { return h('span', { class: 'rc-pill', title: 'Bintang lumba' }, icon('star'), String(n)); }
function medalPill(n) { return h('span', { class: 'rc-pill', title: 'Pingat' }, icon('medal'), String(n)); }
function canvasEl(w, hh, draw, cls = '') {
  const c = document.createElement('canvas');
  const d = Math.min(2, self.devicePixelRatio || 1);
  c.width = Math.round(w * d); c.height = Math.round(hh * d); c.style.width = w + 'px'; c.style.height = hh + 'px';
  if (cls) c.className = cls;
  const g = c.getContext('2d'); g.scale(d, d); draw(g, w, hh);
  return c;
}
function spriteEl(name, v, hpx, cls = '') {
  const sp = spriteCanvas(name, v);
  const w = Math.round(hpx * sp.aspect);
  return canvasEl(w, hpx, (g) => g.drawImage(sp.img, 0, 0, w, hpx), cls);
}
function carStill(car, custom, driver, view = 'side', scale = 1, locked = false) {
  const w = (view === 'side' ? 260 : 200) * scale, hh = 160 * scale;
  return canvasEl(w, hh, (g) => {
    g.scale(scale, scale);
    if (view === 'side') drawCarSide(g, car, { custom, driver }); else drawCarRear(g, car, { custom, driver });
    if (locked) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(70,58,110,.86)'; g.fillRect(0, 0, 400, 200); g.globalCompositeOperation = 'source-over'; }
  });
}
// kereta beranimasi (roda berputar) di atas pentas
function carStage(car, custom, driver, scale, onClean, view = 'side') {
  const w = (view === 'side' ? 260 : 200) * scale, hh = 160 * scale;
  const c = canvasEl(w, hh, () => {}, 'rc-stage-car');
  const d = Math.min(2, self.devicePixelRatio || 1);
  const g = c.getContext('2d');
  let raf = 0, t = 0, last = performance.now();
  const frame = (now) => {
    t += (now - last) / 1000; last = now;
    g.setTransform(d * scale, 0, 0, d * scale, 0, 0); g.clearRect(0, 0, 400, 200);
    if (view === 'side') drawCarSide(g, car, { custom, driver, spin: t * 9, glowT: t }); else drawCarRear(g, car, { custom, driver, phase: (t * 3) % 1, glowT: t });
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  onClean(() => cancelAnimationFrame(raf));
  driver.decode?.().catch(() => {});
  return c;
}
export function specEl(spec) {
  if (!spec) return null;
  switch (spec.t) {
    case 'txt': return h('span', { class: 'rc-l rc-l-txt', style: { color: spec.c || '#3d3256' } }, spec.v);
    case 'emo': return h('span', { class: 'rc-l rc-l-emo emo' }, spec.v);
    case 'col': return h('span', { class: 'rc-l rc-l-col', style: { background: spec.hex }, 'aria-label': spec.n });
    case 'shp': return h('span', { class: 'rc-l rc-l-shp', html: shapeSvg(spec.id, spec.hex, '1em') });
    case 'star': return h('span', { class: 'rc-l rc-l-star' }, icon('star'));
    case 'grp': return h('span', { class: 'rc-l rc-l-grp emo' }, ...Array.from({ length: spec.k }, () => h('i', {}, spec.v)));
    case 'op': return h('span', { class: 'rc-l rc-l-op' }, spec.v);
    case 'q': return h('span', { class: 'rc-l rc-l-q' }, '?');
    case 'snd': return h('span', { class: 'rc-l rc-l-snd' }, icon('sound'));
    default: return null;
  }
}

// =====================================================================
//  LAMAN UTAMA CILIK RACING
// =====================================================================
export function homeScreen(onClean) {
  const { p, rp } = rpNow();
  const car = currentCar(rp);
  const nx = S.nextLevel(rp);
  const w = RC_WORLDS[nx.wi];
  const scr = h('div', { class: 'rc-screen rc-home', style: `--sky1:${w.sky[0]};--sky2:${w.sky[1]};--acc:${w.accent}` });
  scr.appendChild(topBar(h('span', { class: 'rc-brand' }, h('b', {}, 'CILIK'), h('i', {}, 'RACING')), '/', h('div', { class: 'rc-pills' }, starPill(S.totalStars(rp)), medalPill(S.medalCount(rp)))));
  const hero = h('div', { class: 'rc-hero' });
  const scene = worldScene(w, 640, 300); scene.className = 'rc-hero-bg';
  hero.append(scene,
    h('div', { class: 'rc-tagline' }, 'Belajar, Pecut, Teroka!'),
    h('div', { class: 'rc-podium' }, carStage(car, S.customOf(rp, car.id), driverImg(p), 0.95, onClean), h('div', { class: 'rc-podium-base' })),
    h('div', { class: 'rc-car-name' }, car.n));
  scr.appendChild(hero);
  scr.appendChild(h('button', { class: 'rc-cta', type: 'button', onclick: () => { snd.unlock(); snd.rsfx.pop(); go(`/lumba/main/${nx.wi}/${nx.n}`); } },
    h('span', { class: 'rc-cta-play' }, icon('play')),
    h('span', { class: 'rc-cta-txt' }, h('b', {}, S.totalStars(rp) ? 'Teruskan Lumba' : 'Jom Berlumba!'), h('small', {}, `${w.n} · Level ${nx.n}`)),
    h('span', { class: 'rc-cta-flag' })));
  const tile = (cls, label, art, path) => h('button', { class: `rc-tile ${cls}`, type: 'button', onclick: () => { snd.rsfx.pop(); speak(label); go(path); } }, h('span', { class: 'rc-tile-art' }, art), h('span', {}, label));
  scr.appendChild(h('div', { class: 'rc-tiles' },
    tile('t-map', 'Peta Dunia', canvasEl(86, 64, (g) => { const sc = worldScene(RC_WORLDS[1], 86, 64, { dpr: 1 }); g.save(); rr(g, 0, 0, 86, 64, 14); g.clip(); g.drawImage(sc, 0, 0, 86, 64); g.restore(); }), '/lumba/peta'),
    tile('t-garage', 'Garaj', carStill(CARS[2], {}, null, 'side', 0.36), '/lumba/garaj'),
    tile('t-coll', 'Koleksi', spriteEl('trofi', 0, 70), '/lumba/koleksi')));
  // dunia semasa
  const done = S.worldDone(rp, w.id);
  scr.appendChild(h('button', { class: 'rc-world-now', type: 'button', onclick: () => { snd.rsfx.pop(); go(`/lumba/dunia/${nx.wi}`); } },
    h('span', { class: 'rc-wn-ico' }, spriteEl(w.side[0][0], 0, 56)),
    h('span', { class: 'rc-wn-txt' }, h('b', {}, w.n), h('small', {}, w.tag), h('span', { class: 'rc-bar' }, h('i', { style: { width: `${(done / 50) * 100}%` } })), h('small', {}, `${done} / 50 level`))));
  scr.appendChild(h('p', { class: 'rc-foot' }, `${TOTAL_LEVELS} level · ${RC_WORLDS.length} dunia · ${CARS.length} kereta · tanpa iklan · tanpa pembelian`));
  later(() => speak(S.totalStars(rp) ? `Selamat datang ke Cilik Racing! Jom teruskan di ${w.n}.` : 'Selamat datang ke Cilik Racing! Belajar, pecut, teroka!'), 300);
  return scr;
}

// =====================================================================
//  PETA DUNIA
// =====================================================================
export function mapScreen() {
  const { rp } = rpNow();
  const scr = h('div', { class: 'rc-screen rc-map' });
  scr.appendChild(topBar('Peta Dunia', '/lumba', starPill(S.totalStars(rp))));
  const list = h('div', { class: 'rc-worlds' });
  RC_WORLDS.forEach((w, wi) => {
    const open = S.worldUnlocked(rp, wi);
    const done = S.worldDone(rp, w.id);
    const champ = S.levelStars(rp, w.id, 50) > 0;
    const sc = worldScene(w, 340, 150); sc.className = 'rc-wc-scene';
    const medals = MEDALS.map((m) => h('span', { class: `rc-medal ${done >= m.at ? 'on' : ''}`, style: `--m:${m.c}`, title: m.n }, icon('medal')));
    list.appendChild(h('button', { class: `rc-wcard ${open ? '' : 'locked'} ${wi % 2 ? 'r' : 'l'}`, type: 'button', style: `--acc:${w.accent}`, onclick: () => {
      snd.rsfx.pop();
      if (!open) { lockNotice(`${w.n} masih berkunci.`, { sub: `Tamatkan 10 level di ${RC_WORLDS[wi - 1].n} dahulu. Kemajuan disimpan dalam peranti ini.`, action: () => go(`/lumba/dunia/${wi - 1}`), actionLabel: `Buka ${RC_WORLDS[wi - 1].n}` }); return; }
      speak(w.n); go(`/lumba/dunia/${wi}`);
    } },
      h('span', { class: 'rc-wc-num' }, String(wi + 1)),
      sc,
      h('span', { class: 'rc-wc-info' },
        h('b', {}, w.n), h('small', {}, w.tag),
        h('span', { class: 'rc-bar' }, h('i', { style: { width: `${(done / 50) * 100}%` } })),
        h('span', { class: 'rc-wc-meta' }, `${done}/50`, ...medals, champ ? h('span', { class: 'rc-champ' }, icon('trophy')) : null)),
      open ? null : h('span', { class: 'rc-lock' }, icon('lock'), h('small', {}, `10 level di ${RC_WORLDS[wi - 1].n}`))));
  });
  scr.appendChild(list);
  return scr;
}

// =====================================================================
//  LALUAN LEVEL SESEBUAH DUNIA
// =====================================================================
export function worldScreen(wi) {
  const { rp } = rpNow();
  const w = RC_WORLDS[wi];
  if (!w || !S.worldUnlocked(rp, wi)) { later(() => go('/lumba/peta'), 0); return h('div'); }
  const done = S.worldDone(rp, w.id);
  const scr = h('div', { class: 'rc-screen rc-world', style: `--sky1:${w.sky[0]};--sky2:${w.sky[1]};--g1:${w.grass[0]};--g2:${w.grass[1]};--acc:${w.accent};--road:${w.road[0]}` });
  scr.appendChild(topBar(w.n, '/lumba/peta', h('span', { class: 'rc-pill' }, `${done} / 50`)));
  const STEP = 92, n = LEVELS_PER_WORLD;
  const path = h('div', { class: 'rc-path', style: { height: `${n * STEP + 140}px` } });
  const pts = [];
  for (let i = 0; i < n; i++) pts.push({ x: 50 + Math.sin(i * 0.62) * 30, y: 70 + i * STEP });
  const d = pts.map((q, i) => (i ? `L ${q.x} ${q.y}` : `M ${q.x} ${q.y}`)).join(' ');
  path.innerHTML = `<svg class="rc-path-svg" viewBox="0 0 100 ${n * STEP + 140}" preserveAspectRatio="none"><path d="${d}" class="rc-road-out"/><path d="${d}" class="rc-road-in"/><path d="${d}" class="rc-road-dash"/></svg>`;
  // hiasan tepi
  for (let i = 0; i < n; i += 3) {
    const nm = w.side[(i / 3) % w.side.length][0];
    const el = spriteEl(nm, i % 3, 64 + (i % 4) * 8, 'rc-deco');
    const left = Math.sin(i * 0.62) > 0;
    el.style.top = `${70 + i * STEP - 30}px`; el.style[left ? 'left' : 'right'] = `${2 + (i % 2) * 4}%`;
    path.appendChild(el);
  }
  let cur = null;
  pts.forEach((q, i) => {
    const L = i + 1;
    const st = S.levelStars(rp, w.id, L);
    const unlocked = S.levelUnlocked(rp, wi, L);
    const demoLock = DEMO && (wi > 0 || L > DEMO_MAX);
    const isCur = unlocked && !st;
    const big = L === 50;
    const node = h('button', { class: `rc-node ${st ? 'done' : ''} ${unlocked ? '' : 'locked'} ${isCur ? 'cur' : ''} ${big ? 'boss' : ''} ${L % 10 === 0 && !big ? 'ten' : ''}`, type: 'button', style: { left: `${q.x}%`, top: `${q.y}px` }, 'aria-label': `Level ${L}`, onclick: () => {
      snd.unlock(); snd.rsfx.pop();
      if (!unlocked) { lockNotice(`Level ${L} masih berkunci.`, { sub: 'Tamatkan level sebelum ini dahulu. Kemajuan disimpan dalam peranti ini.' }); return; }
      if (demoLock) { demoUpgrade(); return; }
      go(`/lumba/main/${wi}/${L}`);
    } },
      big ? h('span', { class: 'rc-node-trophy' }, icon('trophy')) : h('b', {}, String(L)),
      unlocked ? null : h('span', { class: 'rc-node-lock' }, icon('lock')),
      st ? h('span', { class: 'rc-node-stars' }, ...[1, 2, 3].map((k) => h('i', { class: k <= st ? 'on' : '' }, icon('star')))) : null,
      isCur ? h('span', { class: 'rc-node-car' }, carStill(currentCar(rp), S.customOf(rp, currentCar(rp).id), null, 'side', 0.28)) : null);
    if (isCur) cur = node;
    path.appendChild(node);
  });
  scr.appendChild(path);
  if (cur) later(() => cur.scrollIntoView({ block: 'center', behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' }), 60);
  later(() => speak(`${w.n}. ${w.tag}.`), 250);
  return scr;
}

// =====================================================================
//  GARAJ
// =====================================================================
export function garageScreen(onClean, tab = 'kereta') {
  const { p, rp } = rpNow();
  const scr = h('div', { class: 'rc-screen rc-garage' });
  scr.appendChild(topBar('Garaj', '/lumba', starPill(S.totalStars(rp))));
  const stage = h('div', { class: 'rc-g-stage' });
  const info = h('div', { class: 'rc-g-info' });
  let view = 'side';
  let stopStage = [];
  const localClean = (fn) => stopStage.push(fn);
  onClean(() => stopStage.forEach((f) => f()));
  const renderStage = () => {
    stopStage.forEach((f) => f()); stopStage = [];
    const car = currentCar(rp);
    clear(stage);
    stage.append(h('div', { class: 'rc-g-light' }), carStage(car, S.customOf(rp, car.id), driverImg(p), view === 'side' ? 1.25 : 1.4, localClean, view), h('div', { class: 'rc-g-floor' }));
    clear(info);
    info.append(h('b', {}, car.n), h('button', { class: 'rc-btn small', type: 'button', onclick: () => { snd.rsfx.pop(); view = view === 'side' ? 'rear' : 'side'; stage.classList.remove('flip'); void stage.offsetWidth; stage.classList.add('flip'); renderStage(); } }, icon('replay'), 'Pusing'));
  };
  scr.append(stage, info);
  const tabs = h('div', { class: 'rc-tabs' });
  const grid = h('div', { class: 'rc-g-grid' });
  const TABS = [['kereta', 'Kereta'], ['cat', 'Cat'], ['pelekat', 'Pelekat'], ['rim', 'Rim tayar']];
  const lockTag = (txt) => h('span', { class: 'rc-need' }, icon('lock'), txt);
  const renderGrid = () => {
    clear(tabs); clear(grid);
    TABS.forEach(([id, n]) => tabs.appendChild(h('button', { class: `rc-tab ${tab === id ? 'on' : ''}`, type: 'button', onclick: () => { snd.rsfx.pop(); tab = id; renderGrid(); } }, n)));
    const car = currentCar(rp), cust = rp.custom[car.id] ||= {};
    if (tab === 'kereta') CARS.forEach((c) => {
      const ok = S.carUnlocked(rp, c);
      grid.appendChild(h('button', { class: `rc-g-item car ${rp.car === c.id ? 'on' : ''} ${ok ? '' : 'locked'}`, type: 'button', onclick: () => {
        snd.rsfx.pop();
        if (!ok) { speak(c.need.champion ? 'Menangi satu trofi juara dunia untuk membuka kereta ini.' : `Kumpul ${c.need.stars} bintang untuk membuka kereta ini.`); return; }
        rp.car = c.id; S.rsave(); speak(c.say); renderStage(); renderGrid();
      } }, carStill(c, S.customOf(rp, c.id), null, 'side', 0.42, !ok), h('small', {}, c.n), ok ? null : lockTag(c.need.champion ? '1 trofi' : `${c.need.stars}`)));
    });
    if (tab === 'cat') PAINTS.forEach((pt) => {
      const ok = S.paintUnlocked(rp, pt);
      const on = (cust.paint || 'asal') === pt.id;
      grid.appendChild(h('button', { class: `rc-g-item ${on ? 'on' : ''} ${ok ? '' : 'locked'}`, type: 'button', onclick: () => {
        snd.rsfx.pop();
        if (!ok) { speak(`Kumpul ${pt.need} bintang untuk cat ini.`); return; }
        cust.paint = pt.id; S.rsave(); speak(`Cat ${pt.n.toLowerCase()}`); renderStage(); renderGrid();
      } }, h('span', { class: 'rc-swatch', style: { background: pt.hex || `linear-gradient(135deg, ${car.body}, ${car.acc})` } }), h('small', {}, pt.n), ok ? null : lockTag(`${pt.need}`)));
    });
    if (tab === 'pelekat') STICKERS_RC.forEach((s) => {
      const ok = S.stickerUnlocked(rp, s);
      const on = (cust.sticker || 'tiada') === s.id;
      grid.appendChild(h('button', { class: `rc-g-item ${on ? 'on' : ''} ${ok ? '' : 'locked'}`, type: 'button', onclick: () => {
        snd.rsfx.pop();
        if (!ok) { speak(`Kumpul ${NUM_WORDS[s.need] || s.need} pingat untuk pelekat ini.`); return; }
        cust.sticker = s.id; S.rsave(); speak(`Pelekat ${s.n.toLowerCase()}`); renderStage(); renderGrid();
      } }, canvasEl(54, 54, (g) => { if (s.id === 'tiada') { g.strokeStyle = '#c9c3d9'; g.lineWidth = 4; g.beginPath(); g.arc(27, 27, 18, 0, 7); g.moveTo(14, 40); g.lineTo(40, 14); g.stroke(); } else drawSticker(g, s.id, 27, 27, 46); }), h('small', {}, s.n), ok ? null : lockTag(`${s.need} pingat`)));
    });
    if (tab === 'rim') RIMS.forEach((r) => {
      const ok = S.rimUnlocked(rp, r);
      const on = (cust.rim || 'perak') === r.id;
      grid.appendChild(h('button', { class: `rc-g-item ${on ? 'on' : ''} ${ok ? '' : 'locked'}`, type: 'button', onclick: () => {
        snd.rsfx.pop();
        if (!ok) { speak(`Buka ${NUM_WORDS[r.need] || r.need} dunia untuk rim ini.`); return; }
        cust.rim = r.id; S.rsave(); speak(`Rim ${r.n.toLowerCase()}`); renderStage(); renderGrid();
      } }, canvasEl(60, 60, (g) => { g.translate(-34, -91); drawCarSide(g, car, { custom: { ...cust, rim: r.id } }); }), h('small', {}, r.n), ok ? null : lockTag(`${r.need} dunia`)));
    });
  };
  scr.append(tabs, grid);
  renderStage(); renderGrid();
  // animasi kereta baharu dibuka
  const fresh = CARS.filter((c) => S.carUnlocked(rp, c) && !rp.seenCars.includes(c.id));
  if (fresh.length) {
    rp.seenCars.push(...fresh.map((c) => c.id)); S.rsave();
    later(() => unlockModal(fresh[0], p, rp), 400);
  }
  return scr;
}
function unlockModal(car, p, rp) {
  snd.rsfx.champion?.();
  const back = h('div', { class: 'modal-back rc-modal-back' });
  const box = h('div', { class: 'rc-unlock' },
    h('div', { class: 'rc-rays' }),
    h('h2', {}, 'Kereta Baharu!'),
    carStill(car, {}, driverImg(p), 'side', 1),
    h('b', {}, car.n),
    h('button', { class: 'rc-btn green', type: 'button', onclick: () => { rp.car = car.id; S.rsave(); back.remove(); go('/lumba/garaj'); } }, 'Pandu sekarang'),
    h('button', { class: 'rc-btn ghost', type: 'button', onclick: () => back.remove() }, 'Nanti'));
  back.appendChild(box);
  document.body.appendChild(back);
  speak(`Tahniah! Kereta baharu, ${car.say}!`, { mood: 'pujian' });
}

// =====================================================================
//  KOLEKSI
// =====================================================================
export function collectionScreen() {
  const { rp } = rpNow();
  const scr = h('div', { class: 'rc-screen rc-coll' });
  scr.appendChild(topBar('Koleksi', '/lumba'));
  const levels = RC_WORLDS.reduce((s, w) => s + S.worldDone(rp, w.id), 0);
  scr.appendChild(h('div', { class: 'rc-stats' },
    h('div', {}, icon('star'), h('b', {}, String(S.totalStars(rp))), h('small', {}, 'bintang lumba')),
    h('div', {}, icon('check'), h('b', {}, `${levels}`), h('small', {}, `daripada ${TOTAL_LEVELS} level`)),
    h('div', {}, icon('medal'), h('b', {}, String(S.medalCount(rp))), h('small', {}, 'pingat')),
    h('div', {}, icon('trophy'), h('b', {}, String(S.championCount(rp))), h('small', {}, 'trofi juara'))));
  scr.appendChild(h('div', { class: 'section-title rc-sec' }, 'Pingat & Trofi Dunia'));
  const rows = h('div', { class: 'rc-medal-rows' });
  RC_WORLDS.forEach((w) => {
    const done = S.worldDone(rp, w.id);
    rows.appendChild(h('div', { class: 'rc-mrow', style: `--acc:${w.accent}` },
      spriteEl(w.side[0][0], 0, 44),
      h('span', { class: 'rc-mrow-n' }, h('b', {}, w.n), h('small', {}, `${done}/50`)),
      ...MEDALS.map((m) => h('span', { class: `rc-medal big ${done >= m.at ? 'on' : ''}`, style: `--m:${m.c}`, title: m.n }, icon('medal'))),
      h('span', { class: `rc-champ big ${S.levelStars(rp, w.id, 50) ? 'on' : ''}` }, icon('trophy'))));
  });
  scr.appendChild(rows);
  scr.appendChild(h('div', { class: 'section-title rc-sec' }, `Kereta (${CARS.filter((c) => S.carUnlocked(rp, c)).length}/${CARS.length})`));
  scr.appendChild(h('div', { class: 'rc-g-grid' }, ...CARS.map((c) => h('div', { class: `rc-g-item car ${S.carUnlocked(rp, c) ? '' : 'locked'}` }, carStill(c, S.customOf(rp, c.id), null, 'side', 0.42, !S.carUnlocked(rp, c)), h('small', {}, c.n)))));
  return scr;
}

// =====================================================================
//  PERLUMBAAN
// =====================================================================
export function raceScreen(wi, n, onClean) {
  const { p, rp } = rpNow();
  const world = RC_WORLDS[wi];
  if (!world || n < 1 || n > LEVELS_PER_WORLD || !S.levelUnlocked(rp, wi, n)) { later(() => go('/lumba'), 0); return h('div'); }
  if (DEMO && (wi > 0 || n > DEMO_MAX)) { later(() => { go('/lumba/dunia/0'); demoUpgrade(); }, 0); return h('div'); }
  const level = buildLevel(wi, n);
  const car = currentCar(rp);
  const custom = S.customOf(rp, car.id);
  const root = h('div', { class: 'rc-race', style: `--acc:${world.accent}` });
  const canvas = h('canvas', { class: 'rc-canvas', 'aria-label': `Litar ${world.n}, level ${n}` });
  root.appendChild(canvas);
  const race = createRace(level, { assist: !!rp.assist, autopilot: !!globalThis.__rcAutopilot });
  globalThis.__rcRace = race;
  let renderer = null;
  let raf = 0, last = performance.now(), paused = false, ended = false, alive = true, started = false;
  let lastBumpSay = -99, lastDraw = 0;

  // ---------- HUD ----------
  const hud = h('div', { class: 'rc-hud' });
  const pauseBtn = h('button', { class: 'rc-round rc-pause', type: 'button', 'aria-label': 'Rehat', onclick: () => openPause() }, h('span', { class: 'rc-pause-ic' }, h('i'), h('i')));
  const lvChip = h('div', { class: 'rc-lvchip' }, h('b', {}, `Level ${n}`), h('small', {}, world.n));
  const card = h('button', { class: 'rc-obj', type: 'button', 'aria-label': 'Dengar semula arahan', onclick: () => repeatSay() });
  const prog = h('div', { class: 'rc-prog' });
  const segs = level.tasks.map(() => h('i'));
  const progCar = h('span', { class: 'rc-prog-car' });
  prog.append(h('span', { class: 'rc-prog-flag s' }), ...segs, h('span', { class: 'rc-prog-flag f' }), progCar);
  hud.append(h('div', { class: 'rc-hud-top' }, pauseBtn, h('div', { class: 'rc-hud-mid' }, card, prog), lvChip));
  const btn = (cls, label, ic, fn) => {
    const b = h('button', { class: `rc-ctl ${cls}`, type: 'button', 'aria-label': label }, ic);
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); snd.unlock(); fn(); b.classList.add('press'); haptic(8); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => b.classList.remove('press')));
    return b;
  };
  const arrow = (dir) => h('span', { class: `rc-arrow ${dir}` });
  const pips = h('span', { class: 'rc-pips' });
  const boostBtn = btn('boost', 'Turbo', h('span', { class: 'rc-boost-in' }, h('b', {}, 'TURBO'), pips), () => { if (race.boost()) { snd.rsfx.boost(); } else snd.rsfx.oops(); });
  hud.append(h('div', { class: 'rc-hud-bot' }, btn('left', 'Ke kiri', arrow('l'), () => steer(-1)), boostBtn, btn('right', 'Ke kanan', arrow('r'), () => steer(1))));
  const banner = h('div', { class: 'rc-banner' });
  hud.appendChild(banner);
  root.appendChild(hud);

  function steer(d) { if (!started) return; race.steer(d); snd.rsfx.steer(); }
  function showBanner(txt, cls = '') { banner.textContent = txt; banner.className = `rc-banner show ${cls}`; clearTimeout(showBanner.t); showBanner.t = setTimeout(() => { banner.className = 'rc-banner'; }, 1600); }

  let lastSay = '', lastSound = null, cardKey = '';
  function sayTask(task) {
    lastSay = task.say; lastSound = task.sound || null;
    const pr = speak(task.say);
    if (task.sound && hasSound(task.sound)) Promise.resolve(pr).then(() => sleep(250)).then(() => alive && playSound(task.sound));
  }
  function repeatSay() { snd.rsfx.pop(); if (!lastSay) return; speak(lastSay); if (lastSound && hasSound(lastSound)) later(() => alive && playSound(lastSound), 1400); }
  function updateCard() {
    const t = race.task;
    const key = `${race.taskIdx}|${race.progress.got}|${race.progress.k}|${race.memT > 0}|${race.finishZ !== null}`;
    if (key === cardKey) return;
    cardKey = key;
    clear(card);
    if (!t) { card.append(race.finishZ !== null ? h('span', { class: 'rc-l rc-l-flag' }, icon('check')) : h('span', { class: 'rc-l rc-l-go' }, icon('play'))); card.className = 'rc-obj idle'; return; }
    card.className = `rc-obj k-${t.kind}`;
    if (t.kind === 'collect') card.append(specEl(t.target), h('span', { class: 'rc-count' }, ...Array.from({ length: t.need }, (_, i) => h('i', { class: i < race.progress.got ? 'on' : '' }))));
    else if (t.kind === 'order') card.append(h('span', { class: 'rc-seq' }, ...t.seq.map((s, i) => (i < race.progress.k ? specEl(s) : h('span', { class: 'rc-l rc-l-q' }, String(i + 1))))));
    else if (t.kind === 'dodge') card.append(h('span', { class: 'rc-l rc-l-emo' }, spriteEl(world.obs, 0, 40)), h('span', { class: 'rc-l rc-l-op' }, '↔'));
    else if (t.kind === 'pit') card.append(h('span', { class: 'rc-l rc-l-pit' }, 'PIT'), ...(t.card || []).slice(0, 1).map(specEl));
    else card.append(...(t.card || []).map(specEl));
  }
  let pipKey = -1;
  function updateHud() {
    updateCard();
    if (pipKey !== race.charges) { pipKey = race.charges; clear(pips); for (let i = 0; i < 3; i++) pips.appendChild(h('i', { class: i < race.charges ? 'on' : '' })); boostBtn.classList.toggle('ready', race.charges > 0); }
    const total = level.tasks.length;
    const f = race.finishZ !== null ? 1 : Math.min(1, Math.max(0, race.taskIdx + (race.task ? 0.5 : 0)) / total);
    progCar.style.left = `calc(${f * 100}% - 10px)`;
    segs.forEach((s, i) => s.classList.toggle('on', i < race.taskIdx || (i === race.taskIdx && !race.task) || race.finishZ !== null));
    boostBtn.classList.toggle('active', race.boostT > 0);
  }

  // ---------- peristiwa ----------
  function onEvent(e) {
    renderer.fx(e);
    switch (e.t) {
      case 'task':
        if (e.task.kind === 'pit') speak('Pit stop di depan! Jom berhenti sekejap.');
        else if (e.task.kind !== 'order') sayTask(e.task);
        if (level.tutorial && e.idx === 0) showTutorial();
        break;
      case 'memory': openMemory(e.task); break;
      case 'memoryHide': closeMemory(); speak('Sekarang, kutip ikut urutan!'); break;
      case 'correct': snd.rsfx.ok(); haptic([10, 40, 10]); if (praiseGate()) speak(pick(PRAISE), { mood: 'pujian' }); else setTimeout(() => sfx.yay(), 200); showBanner(pick(['Hebat!', 'Betul!', 'Turbo!', 'Terbaik!']), 'good'); break;
      case 'wrong': {
        snd.rsfx.no();
        const nm = e.obj?.opt?.n || e.obj?.spec?.n;
        breakStreak(); speak(`${nm ? `Itu ${nm}. ` : ''}${pick(RETRY)}${e.attempt >= 2 ? ' Ikut anak panah, ya.' : ''}`, { mood: 'galakan' });
        break;
      }
      case 'collect':
        if (e.good) {
          if (e.task.kind === 'collect' && e.task.target.t === 'star') snd.rsfx.star(); else snd.rsfx.collect();
          if (e.task.kind === 'collect' && race.progress.got < e.task.need) speak(`${cap(NUM_WORDS[race.progress.got])}!`, { mood: 'pujian' });
          if (e.task.kind === 'order' && race.progress.k < e.task.seq.length) speak(`${e.obj.spec.n}! Seterusnya?`, { mood: 'pujian' });
        } else { snd.rsfx.oops(); speak(`Itu bukan ${e.task.target.n}.`, { mood: 'galakan' }); }
        break;
      case 'bump':
        snd.rsfx.bump(); haptic(30);
        if (race.t - lastBumpSay > 7) { lastBumpSay = race.t; sfx.boing(); }
        break;
      case 'pit': openPit(e.task); break;
      case 'done': snd.rsfx.check(); break;
      case 'refill': sfx.ping(); break;
      case 'finalLap': showBanner('Pusingan Akhir!', 'big'); sfx.lastRound(); break;
      case 'finishSpawn': if (!level.special) sfx.whoosh(); break;
      case 'finish': finish(); break;
      default: break;
    }
  }

  // ---------- tutorial (animasi, tanpa teks panjang) ----------
  function showTutorial() {
    const tut = h('div', { class: 'rc-tut' }, h('span', { class: 'rc-tut-hand l' }), h('span', { class: 'rc-tut-hand r' }), h('span', { class: 'rc-tut-swipe' }));
    hud.appendChild(tut);
    speak('Tekan anak panah, atau leret ke kiri dan ke kanan untuk menukar laluan.');
    later(() => tut.remove(), 6500);
  }

  // ---------- memori ----------
  let memEl = null;
  function openMemory(task) {
    memEl = h('div', { class: 'rc-mem' }, h('b', {}, 'Ingat!'), h('div', { class: 'rc-mem-seq' }, ...task.seq.map((s, i) => h('span', { class: 'rc-mem-it', style: { animationDelay: `${i * 0.35}s` } }, specEl(s), h('small', {}, String(i + 1))))), h('div', { class: 'rc-mem-bar' }, h('i')));
    hud.appendChild(memEl);
    lastSay = task.say; speak(task.say);
  }
  function closeMemory() { memEl?.remove(); memEl = null; }

  // ---------- hentian pit (ejaan / corak) ----------
  let pitEl = null;
  function openPit(task) {
    snd.rsfx.pit(); snd.engineSet(0, false);
    let mist = 0;
    const panel = h('div', { class: 'rc-pit-panel' });
    pitEl = h('div', { class: 'rc-pit' }, panel);
    hud.appendChild(pitEl);
    const close = () => { const m = mist; pitEl?.remove(); pitEl = null; globalThis.__rcPit = null; race.pitDone(Math.min(2, m)); };
    if (task.sub === 'eja') {
      const word = task.word;
      let pos = 0;
      const slots = [...word].map(() => h('span', { class: 'rc-slot' }));
      const letters = [...word].map((ch, i) => ({ ch, i }));
      // susunan huruf berbiji (tetap untuk level yang sama)
      const order = letters.slice().sort((a, b) => ((a.i * 7 + n * 3) % 5) - ((b.i * 7 + n * 3) % 5) || a.i - b.i);
      if (order.every((x, k) => x.i === k) && order.length > 1) order.push(order.shift());
      const tiles = order.map((x) => {
        const b = h('button', { class: 'rc-tile-l', type: 'button' }, x.ch);
        b.addEventListener('click', () => {
          if (b.disabled) return;
          if (x.ch === word[pos]) {
            snd.rsfx.collect(); b.disabled = true; b.classList.add('used');
            slots[pos].textContent = x.ch; slots[pos].classList.add('on'); pos++;
            speak(x.ch, { mood: 'arahan' });
            tiles.forEach((t) => t.classList.remove('hint'));
            if (pos >= word.length) { snd.rsfx.ok(); speak(`${cap(word.toLowerCase())}! Hebat!`, { mood: 'pujian' }); later(close, 1300); }
          } else {
            mist++; snd.rsfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
            if (mist >= 2) tiles.find((t) => !t.disabled && t.textContent === word[pos])?.classList.add('hint');
            speak(`Cari huruf ${word[pos]}.`, { mood: 'galakan' });
          }
        });
        return b;
      });
      panel.append(h('div', { class: 'rc-pit-head' }, h('span', { class: 'rc-pit-badge' }, 'PIT STOP'), h('span', { class: 'emo rc-pit-pic' }, task.pic)), h('div', { class: 'rc-slots' }, ...slots), h('div', { class: 'rc-tiles-l' }, ...tiles));
      lastSay = task.say; speak(`${task.say} Tekan huruf mengikut urutan.`);
      globalThis.__rcPit = () => { for (let k = pos; k < word.length; k++) { const t = tiles.find((tt) => !tt.disabled && tt.textContent === word[k]); t?.click(); } };
    } else {
      const slot = h('span', { class: 'rc-pat-q' }, '?');
      const opts = task.opts.map((o, i) => {
        const b = h('button', { class: 'rc-pat-opt', type: 'button' }, specEl(o));
        b.addEventListener('click', () => {
          if (i === task.ans) { snd.rsfx.ok(); clear(slot); slot.appendChild(specEl(o)); slot.classList.add('on'); if (praiseGate()) speak(pick(PRAISE), { mood: 'pujian' }); else sfx.yay(); opts.forEach((x) => { x.disabled = true; }); later(close, 1100); }
          else { mist++; snd.rsfx.no(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); speak('Cuba lagi. Lihat coraknya.', { mood: 'galakan' }); if (mist >= 2) opts[task.ans].classList.add('hint'); }
        });
        return b;
      });
      panel.append(h('div', { class: 'rc-pit-head' }, h('span', { class: 'rc-pit-badge' }, 'PUZZLE')), h('div', { class: 'rc-pat' }, ...task.seq.map(specEl), slot), h('div', { class: 'rc-pat-opts' }, ...opts));
      lastSay = task.say; speak(task.say);
      globalThis.__rcPit = () => opts[task.ans].click();
    }
    if (race.autopilot) later(() => globalThis.__rcPit?.(), 200);
  }

  // ---------- rehat ----------
  let pauseEl = null;
  function openPause() {
    if (ended || pauseEl) return;
    snd.rsfx.pop(); paused = true; snd.engineStop(); snd.musicStop(); stopSpeak();
    const tog = (label, get, set) => { const b = h('button', { class: `rc-toggle ${get() ? 'on' : ''}`, type: 'button', onclick: () => { set(!get()); S.rsave(); b.classList.toggle('on', get()); } }, h('i'), label); return b; };
    pauseEl = h('div', { class: 'rc-pause-back' }, h('div', { class: 'rc-pause-box' },
      h('h2', {}, 'Rehat sekejap'),
      h('button', { class: 'rc-btn green big', type: 'button', onclick: () => resumeRace() }, icon('play'), 'Teruskan'),
      h('div', { class: 'rc-row' },
        h('button', { class: 'rc-btn', type: 'button', onclick: () => { pauseEl.remove(); restart(); } }, icon('replay'), 'Ulang'),
        h('button', { class: 'rc-btn', type: 'button', onclick: () => { pauseEl.remove(); go(`/lumba/dunia/${wi}`); } }, icon('map'), 'Peta'),
        h('button', { class: 'rc-btn', type: 'button', onclick: () => { pauseEl.remove(); go('/'); } }, icon('home'), 'Rumah')),
      h('div', { class: 'rc-row' },
        tog('Muzik', () => rp.music !== false, (v) => { rp.music = v; }),
        tog('Bantuan elak', () => !!rp.assist, (v) => { rp.assist = v; race.assist = v; }))));
    root.appendChild(pauseEl);
  }
  // butang kembali telefon: buka / tutup menu rehat
  onBack(() => { if (ended) return false; if (pauseEl) resumeRace(); else openPause(); return true; });
  function resumeRace() {
    pauseEl?.remove(); pauseEl = null; paused = false; last = performance.now();
    if (started && !ended) { snd.engineStart(); if (rp.music !== false) snd.musicStart(world, wi + 7); }
  }

  // ---------- tamat ----------
  async function finish() {
    if (ended) return;
    ended = true;
    snd.engineStop(); snd.musicStop();
    level.special ? snd.rsfx.champion() : snd.rsfx.finish();
    renderer.celebrate();
    showBanner(level.special ? 'JUARA!' : 'TAMAT!', 'big');
    const stars = race.stars || 1;
    const res = S.recordRace(rp, level, stars);
    save();
    await sleep(1400);
    if (!alive) return;
    if (overLimit(p)) { go('/'); return; }
    showResults(stars, res);
  }
  function showResults(stars, res) {
    const next = n < LEVELS_PER_WORLD ? { wi, n: n + 1 } : (wi + 1 < RC_WORLDS.length && S.worldUnlocked(rp, wi + 1) ? { wi: wi + 1, n: 1 } : null);
    const rewards = [];
    res.newCars.forEach((c) => { rewards.push(h('div', { class: 'rc-rw car' }, carStill(c, {}, driverImg(p), 'side', 0.5), h('small', {}, 'Kereta baharu!'), h('b', {}, c.n))); if (!rp.seenCars.includes(c.id)) rp.seenCars.push(c.id); });
    res.newMedals.forEach((m) => rewards.push(h('div', { class: 'rc-rw' }, h('span', { class: 'rc-medal big on', style: `--m:${m.medal.c}` }, icon('medal')), h('small', {}, m.medal.n), h('b', {}, m.world.n))));
    if (res.champion) rewards.push(h('div', { class: 'rc-rw champ' }, spriteEl('trofi', 0, 70), h('small', {}, 'Trofi Juara'), h('b', {}, world.n)));
    res.newPaints.forEach((pt) => rewards.push(h('div', { class: 'rc-rw' }, h('span', { class: 'rc-swatch', style: { background: pt.hex } }), h('small', {}, 'Cat baharu'), h('b', {}, pt.n))));
    res.newStickers.forEach((s) => rewards.push(h('div', { class: 'rc-rw' }, canvasEl(46, 46, (g) => drawSticker(g, s.id, 23, 23, 40)), h('small', {}, 'Pelekat baharu'), h('b', {}, s.n))));
    if (res.newWorld) rewards.push(h('div', { class: 'rc-rw world' }, spriteEl(res.newWorld.side[0][0], 0, 56), h('small', {}, 'Dunia baharu dibuka!'), h('b', {}, res.newWorld.n)));
    S.rsave();
    const head = level.special ? `Juara ${world.n}!` : stars === 3 ? 'Hebat! Kamu berjaya!' : stars === 2 ? 'Bagus! Kamu berjaya!' : 'Yeay! Kamu sampai!';
    const box = h('div', { class: `rc-result ${level.special ? 'champion' : ''}` },
      h('div', { class: 'rc-rays' }),
      h('div', { class: 'rc-res-car' }, carStill(car, custom, driverImg(p), 'side', 0.9)),
      ribbon(level.special ? 'JUARA!' : stars === 3 ? 'Hebat!' : stars === 2 ? 'Syabas!' : 'Tahniah!', { sub: level.special ? `Juara ${world.n}!` : stars >= 2 ? 'Kamu berjaya!' : 'Kamu sampai!', stars }),
      h('div', { class: 'rc-res-meta' }, h('span', {}, `Level ${n} · ${world.n}`), h('span', {}, level.objective)),
      rewards.length ? h('div', { class: 'rc-rewards' }, ...rewards) : null,
      selfieButton(`Cilik Racing · ${world.n}`),
      winBar({ next: next ? () => go(`/lumba/main/${next.wi}/${next.n}`) : null, replay: () => restart(), map: () => go(`/lumba/dunia/${wi}`) }));
    root.appendChild(h('div', { class: 'rc-result-back' }, box));
    const extra = res.newCars.length ? ` Kamu dapat kereta baharu, ${res.newCars[0].say}!` : res.champion ? ' Kamu dapat trofi juara!' : res.newMedals.length ? ` Kamu dapat ${res.newMedals[0].medal.n.toLowerCase()}!` : '';
    speak((level.special ? `Tahniah! Kamu juara ${world.n}!` : stars === 3 ? 'Hebat! Kamu berjaya!' : 'Yeay! Kita menang!') + extra, { mood: 'pujian' });
  }
  function restart() { go(`/lumba/main/${wi}/${n}`); }

  // ---------- gelung ----------
  function loop(now) {
    if (!alive) return;
    raf = requestAnimationFrame(loop);
    let dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (paused || document.hidden) return;
    try {
      const mul = globalThis.__rcSpeed || 1;
      let simT = dt * mul;
      while (simT > 0) { const st = Math.min(1 / 30, simT); race.step(st); simT -= st; if (race.state === 'pit' || race.state === 'done') break; }
      const evs = race.events.splice(0);
      for (const e of evs) onEvent(e);
      if (started && !ended) snd.engineSet(Math.min(1, race.speed / (race.base * 1.55)), race.boostT > 0);
      if (now - lastDraw > 12 || mul === 1) { renderer.draw(race, dt); lastDraw = now; }
      updateHud();
    } catch (err) {
      // pengaman: ralat paparan tidak boleh menyekat anak
      console.warn('Cilik Racing:', err);
    }
  }

  // ---------- input ----------
  const onKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') steer(-1);
    else if (e.key === 'ArrowRight' || e.key === 'd') steer(1);
    else if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); if (race.boost()) snd.rsfx.boost(); }
    else if (e.key === 'Escape') openPause();
  };
  let sx = null, sy = null, st0 = 0;
  canvas.addEventListener('pointerdown', (e) => { snd.unlock(); sx = e.clientX; sy = e.clientY; st0 = performance.now(); });
  canvas.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 1 : -1);
    else if (performance.now() - st0 < 350 && Math.abs(dx) < 12) steer(e.clientX < canvas.getBoundingClientRect().width / 2 ? -1 : 1);
    sx = null;
  });
  const onVis = () => { if (document.hidden) { snd.suspend(); if (started && !ended) openPause(); } else snd.resume(); };
  const onResize = () => renderer && renderer.resize();
  addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVis);
  addEventListener('resize', onResize);

  // masa bermain dikira (had masa ibu bapa tetap dipatuhi)
  let tickLast = Date.now();
  const ticker = setInterval(() => {
    const now = Date.now();
    if (document.visibilityState === 'visible' && !paused && p) { addActivity(p, { time: Math.min(10, (now - tickLast) / 1000) }); save(); }
    tickLast = now;
  }, 5000);

  onClean(() => {
    alive = false; cancelAnimationFrame(raf); clearInterval(ticker); clearTimeout(showBanner.t);
    removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); removeEventListener('resize', onResize);
    snd.stopAll(); stopSpeak();
    if (globalThis.__rcRace === race) globalThis.__rcRace = null;
    globalThis.__rcPit = null;
  });

  // ---------- mula ----------
  requestAnimationFrame(async () => {
    if (!alive) return;
    renderer = createRenderer(canvas, { world, level, car, custom, driverImg: driverImg(p) });
    raf = requestAnimationFrame(loop);
    const cd = h('div', { class: 'rc-count-big' });
    hud.appendChild(cd);
    const intro = level.special ? `Level juara! ${world.n}. Sedia?` : `${world.n}, level ${n}. Sedia?`;
    speak(intro);
    await sleep(globalThis.__rcAutopilot ? 50 : 1300);
    for (const k of [3, 2, 1]) { if (!alive) return; cd.textContent = String(k); cd.className = 'rc-count-big show'; snd.rsfx.count(k); await sleep(globalThis.__rcAutopilot ? 30 : 650); cd.className = 'rc-count-big'; await sleep(globalThis.__rcAutopilot ? 10 : 80); }
    if (!alive) return;
    cd.textContent = 'MULA!'; cd.className = 'rc-count-big show go'; snd.rsfx.count(0);
    speak('Jom, kita mula!', { mood: 'pujian' });
    started = true; race.go(); snd.engineStart(); if (rp.music !== false) snd.musicStart(world, wi + 7);
    later(() => cd.remove(), 700);
  });
  return root;
}
