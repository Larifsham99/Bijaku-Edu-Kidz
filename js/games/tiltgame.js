// =====================================================================
//  PENGENDALI PERMAINAN SENGET (dikongsi Bola Guling & Titian Imbang)
//  Gelung fizik tetap 120 Hz + interpolasi kamera, HUD, checkpoint,
//  jatuh & respawn, kutip syiling/bintang, rekod masa, tutorial & kawalan.
// =====================================================================
import { h } from '../ui.js';
import { icon } from '../icons.js';
import { synth, speak, sfx, haptic } from '../audio.js';
import { go as nav } from '../nav.js';
import { GAMES } from './registry.js';
import { ico, tsfx, flyTo, bump } from './tiltui.js';
import { World, makeBody, step, autopilot } from './tiltworld.js';
import { Renderer, rollOri } from './tiltrender.js';
import { createTilt, tutorial } from './tilt.js';
import { bsfx } from './blocksfx.js';

const DT = 1 / 120;
const BEST = 'bj-tilt-best';
const best = (k) => { try { return JSON.parse(localStorage.getItem(BEST) || '{}')[k]; } catch { return null; } };
const setBest = (k, v) => { try { const o = JSON.parse(localStorage.getItem(BEST) || '{}'); o[k] = v; localStorage.setItem(BEST, JSON.stringify(o)); } catch { /* */ } };

export function runTiltGame(ctx, opt) {
  const { n, stage, later } = ctx;
  const level = opt.makeLevel(n, ctx.rng);
  ctx.rounds(1); ctx.round(0);
  ctx.scr?.classList.add('tg-full'); // muat satu skrin: kanvas mengisi ruang yang tinggal
  const G = GAMES[opt.id] || {};
  const bestKey = `${opt.id}:${n}`;
  // ---------- DOM ----------
  const cv = h('canvas', { class: 'tg-canvas', 'aria-label': opt.title });
  const tTime = h('b', {}, '0.0'), tCoin = h('b', {}, '0');
  const timeChip = h('span', { class: 'tg-chip' }, ico('clock'), tTime);
  const coinChip = h('span', { class: 'tg-chip' }, ico('coin'), tCoin, h('small', {}, `/${level.coins.length}`));
  const tStar = h('span', { class: 'tg-stars' }, ...level.stars.map(() => h('span', { class: 'tg-st' }, ico('starOff'), ico('star', 'on'))));
  const pauseBtn = h('button', { class: 'tg-pause', type: 'button', 'aria-label': 'Jeda', onclick: () => pause() }, ico('pause'));
  const prog = h('i', { class: 'tg-fill' });
  const mark = h('span', { class: 'tg-mark' }, ico(opt.id === 'imbang' ? 'bulat' : 'ball'));
  const totalY0 = level.goal.y - level.start[1];
  const ticks = level.checks.map((c) => h('i', { class: 'tg-tick', style: `left:${Math.round(Math.min(1, Math.max(0, (c.y - level.start[1]) / totalY0)) * 100)}%` }));
  const b0 = best(bestKey);
  const hud = h('div', { class: 'tg-hud' },
    h('div', { class: 'tg-row' }, pauseBtn, timeChip, coinChip, tStar),
    h('div', { class: 'tg-track' }, h('span', { class: 'tg-rail' }, prog, ...ticks, mark), ico('flag', 'tg-end')),
    b0 ? h('span', { class: 'tg-best' }, ico('trophy'), `Rekod ${b0.toFixed(1)}s`) : null);
  const ctl = h('div', { class: 'tg-ctl' });
  const msg = h('div', { class: 'tg-msg' });
  const view = h('div', { class: 'tg-view' }, cv, hud, msg, ctl);
  stage.append(h('div', { class: `tg-wrap tg-${opt.id}` }, view));
  const R = new Renderer(cv, level.theme);
  if (opt.cam) { R.B = opt.cam.B; R.H = opt.cam.H; }
  const ro = new ResizeObserver(() => R.resize()); ro.observe(cv);
  const tilt = createTilt(ctl);
  // ---------- keadaan ----------
  const world = new World(level.pieces);
  let body = makeBody(opt.cfg, ...level.start);
  let ck = level.start.slice(), ckIdx = -1;
  const coins = level.coins.map((c) => ({ ...c, got: false }));
  const stars = level.stars.map((c) => ({ ...c, got: false }));
  const parts = [];
  let ori = [1, 0, 0, 0, 1, 0, 0, 0, 1], squash = 0, time = 0, running = false, dead = null, won = false, ap = null, speed = 1;
  const anim = { lean: 0, leanY: 0, panic: 0, arm: 0, spin: 0, blink: 0, walk: 0 };
  let rollT = 0, stepT = 0, whoaT = 0, raf = 0, last = performance.now(), hudT = 0;
  const totalY = level.goal.y - level.start[1];
  const drawStars = () => stars.forEach((s, i) => tStar.children[i]?.classList.toggle('got', s.got));
  drawStars();
  let combo = 0, comboT = 0, paused = false, counting = false, wasGround = true, airT = 0, creakT = 0, windT = 3 + Math.random() * 3;
  const scrPt = (x, y, z) => { const [sx, sy] = R.proj(x, y, z); return [sx, sy]; };

  const burst = (x, y, z, c, nn = 12, star = false, sp = 2.5) => { for (let i = 0; i < nn; i++) { const a = Math.random() * Math.PI * 2, u = Math.random() * sp; parts.push({ x, y, z, vx: Math.cos(a) * u, vy: Math.sin(a) * u, vz: 1 + Math.random() * 2.5, life: 0.6 + Math.random() * 0.4, c, s: 0.06, star }); } };
  function say(t, mood) { ctx.say(t, mood); }
  function pop(t, ic) { msg.textContent = ''; if (ic) msg.append(ico(ic)); msg.append(t); msg.classList.remove('on'); void msg.offsetWidth; msg.classList.add('on'); }

  function events() {
    for (const [k, v] of body.events.splice(0)) {
      if (k === 'land') { if (v > 2.5) { squash = Math.min(0.5, v / 14); bsfx.land(); burst(body.x, body.y, body.z, 'rgba(255,255,255,.9)', 6, false, 1.2); } }
      else if (k === 'bounce') { squash = Math.min(0.6, v / 12); bsfx.land(); }
      else if (k === 'wall') { if (v > 2.5) { synth.tone({ type: 'sine', f: 220, f2: 140, dur: 0.08, vol: Math.min(0.12, v / 40) }); if (v > 4) haptic(12); } }
      else if (k === 'bump') { bsfx.spring(); haptic(25); burst(body.x, body.y, body.z + 0.3, '#ff5fa2', 10, true); }
      else if (k === 'dead' && !dead) fall();
    }
  }
  function fall() {
    dead = { t0: performance.now() };
    ctx.miss({ quiet: true });
    bsfx.fall(); tsfx.whoosh(1.4); later(() => bsfx.splash(), 500);
    haptic([40, 50, 80]); combo = 0;
    view.classList.remove('hurt'); void view.offsetWidth; view.classList.add('hurt');
    say(opt.fallText(), 'galakan');
    later(respawn, 1300);
  }
  function respawn() {
    body = makeBody(opt.cfg, ...ck); dead = null; anim.spin = 0; anim.panic = 0;
    if (ap) { ap.i = Math.max(0, level.wps.findIndex((p) => p.ck === ckIdx) + 1); ap.phase = null; ap.prev = [ck[0], ck[1]]; }
    bsfx.ready(); burst(body.x, body.y, body.z + 0.4, '#ffffff', 14, true);
  }
  function collect() {
    for (const c of coins) if (!c.got && Math.hypot(body.x - c.x, body.y - c.y) < 0.55 && Math.abs(body.z + 0.3 - c.z) < 0.9) {
      c.got = true; combo = time - comboT < 0.9 ? combo + 1 : 0; comboT = time;
      tsfx.coin(combo); haptic(6); burst(c.x, c.y, c.z, '#ffd43b', 8, true);
      const k = coins.filter((q) => q.got).length;
      flyTo(view, scrPt(c.x, c.y, c.z), coinChip, 'coin', () => { tCoin.textContent = k; bump(coinChip); });
      if (k === coins.length) later(() => { pop('Semua syiling!', 'coin'); bsfx.gem(); }, 650);
    }
    stars.forEach((s, i) => {
      if (s.got || Math.hypot(body.x - s.x, body.y - s.y) >= 0.6 || Math.abs(body.z + 0.3 - s.z) >= 1) return;
      s.got = true; tsfx.star(); haptic([15, 30, 15]); burst(s.x, s.y, s.z, '#ffe066', 18, true, 3.5);
      const slot = tStar.children[i];
      flyTo(view, scrPt(s.x, s.y, s.z), slot, 'star', () => { drawStars(); bump(slot); });
      pop('Bintang!', 'star');
    });
    level.checks.forEach((c, i) => { if (i > ckIdx && Math.hypot(body.x - c.x, body.y - c.y) < 0.9 && Math.abs(body.z - c.z) < 1) { ckIdx = i; ck = [c.x, c.y, c.z]; bsfx.checkpoint(); haptic(20); ticks[i]?.classList.add('on'); burst(c.x, c.y, c.z + 1, '#7dff9c', 16, true); pop('Checkpoint!', 'flag'); } });
    if (!won && Math.hypot(body.x - level.goal.x, body.y - level.goal.y) < 0.9 && Math.abs(body.z - level.goal.z) < 1) win();
  }
  function win() {
    won = true; running = false;
    for (let i = 0; i < 5; i++) later(() => burst(level.goal.x + (Math.random() - 0.5) * 2, level.goal.y, level.goal.z + 2, ['#ff5d8f', '#ffd43b', '#5ff0ff', '#9b5cff', '#7dff9c'][i], 24, true, 4), i * 220);
    const key = `${opt.id}:${n}`, b0 = best(key), rec = !b0 || time < b0;
    if (rec) setBest(key, +time.toFixed(1));
    if (rec && b0) later(() => { tsfx.record(); pop('Rekod baharu!', 'trophy'); }, 300);
    haptic([20, 40, 20, 40, 60]); pauseBtn.hidden = true;
    ctx.good({ speakIt: false, flash: false });
    // masa dipaparkan sahaja (tidak disebut: nilainya berbeza setiap kali)
    say(`${opt.winText}${rec && b0 ? ' Rekod baharu!' : ''}`, 'pujian');
    pop(`⏱ ${time.toFixed(1)} s`);
    later(() => ctx.done(), 1700);
  }
  // ---------- gelung ----------
  function frame(now) {
    if (!ctx.alive()) return;
    raf = requestAnimationFrame(frame);
    let dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (document.hidden) return;
    if (paused) { R.follow({ x: body.x, y: body.y, z: body.z }, 0, false); last = now; }
    if (running && !dead && !paused) {
      let acc = dt * speed; let steps = 0;
      while (acc > 1e-6 && steps < 8 * speed) {
        const h2 = Math.min(DT, acc); acc -= h2; steps++;
        const inp = ap ? autopilot(body, world, level.wps, ap) : tilt.read(h2);
        lastInp = inp;
        const px = body.x, py = body.y;
        world.update(h2, body);
        step(body, world, inp, h2);
        ori = rollOri(ori, body.x - px, body.y - py, Math.hypot(body.x - px, body.y - py), body.cfg.r);
        events(); if (dead) break;
        collect(); if (won) break;
        time += h2;
      }
      opt.animate?.(anim, body, world, dt, inp0());
      // bunyi gelek / langkah
      const sp = Math.hypot(body.vx, body.vy);
      // lompatan dari ramp: desiran angin
      airT -= dt;
      if (wasGround && !body.onGround && body.vz > 1.2 && airT <= 0) { tsfx.whoosh(Math.min(1.5, body.vz / 3)); airT = 0.6; }
      wasGround = body.onGround;
      // papan jongkang berkeriut; angin di pulau & puncak ribut
      creakT -= dt; if (body.ground?.p?.tilt && sp > 0.2 && creakT <= 0) { tsfx.creak(); creakT = 0.55 + Math.random() * 0.3; }
      windT -= dt; if (windT <= 0) { windT = 4 + Math.random() * 4; if (level.theme === 'ribut' || level.theme === 'pulau' || level.theme === 'goyang') tsfx.wind(); }
      if (opt.id === 'guling') { rollT -= dt; if (body.onGround && sp > 0.6 && rollT <= 0) { rollT = 0.09; synth.noise({ dur: 0.08, vol: Math.min(0.045, sp * 0.006), filter: { type: 'lowpass', f: 300 + sp * 60 } }); } }
      else { stepT -= dt; if (body.onGround && sp > 0.3 && stepT <= 0) { stepT = 0.34 / Math.min(2, sp); synth.tone({ type: 'sine', f: 180 + Math.random() * 40, dur: 0.05, vol: 0.05 }); } whoaT -= dt; if (anim.panic > 0.6 && whoaT <= 0) { whoaT = 1.6; synth.tone({ type: 'triangle', f: 500, f2: 820, dur: 0.25, vol: 0.06, vib: { rate: 12, depth: 40 } }); synth.tone({ type: 'triangle', f: 820, f2: 420, t: 0.25, dur: 0.3, vol: 0.05 }); } }
    } else if (dead) { // terus jatuh dengan graviti sambil berpusing (kamera mengikut)
      body.vz -= 15 * dt; body.z += body.vz * dt; body.x += body.vx * dt; body.y += body.vy * dt; anim.spin += dt * 9;
      opt.animate?.(anim, body, world, dt, { x: 0, y: 0 }, true);
    } else if (!paused) world.update(dt, null);
    squash *= Math.exp(-dt * 10);
    R.follow({ x: body.x + body.vx * 0.22, y: body.y + body.vy * 0.22, z: body.z }, dt, !!dead);
    // senarai objek untuk dilukis
    const items = [];
    const t = now;
    coins.forEach((c) => { if (!c.got) items.push({ x: c.x, y: c.y, z: c.z, bias: 0.9, draw: (r, d) => r.coin(c.x, c.y, c.z, t, d) }); });
    stars.forEach((s) => { if (!s.got) items.push({ x: s.x, y: s.y, z: s.z, bias: 0.9, draw: (r, d) => r.star(s.x, s.y, s.z, t, d) }); });
    level.checks.forEach((c, i) => items.push({ x: c.x + 0.6, y: c.y, z: c.z, bias: 0.9, draw: (r, d) => r.flag(c.x + 0.6, c.y, c.z, i <= ckIdx, t, d) }));
    items.push({ x: level.goal.x, y: level.goal.y + 0.4, z: level.goal.z, bias: 0.9, draw: (r, d) => r.gate(level.goal.x, level.goal.y + 0.4, level.goal.z, t, d) });
    const gnd = world.ground(body.x, body.y, body.z + 0.3);
    items.push({ x: body.x, y: body.y, z: body.z, bias: 1.0, draw: (r, d) => { if (gnd && !dead) r.shadow(body.x, body.y, gnd.top, body.z, body.cfg.r * (opt.id === 'imbang' ? 1.6 : 1)); opt.drawBody(r, body, { ori, squash, anim, dead, d, now: t }); } });
    R.frame(world, items, t);
    R.particles(parts, dt);
    hudT -= dt;
    if (hudT <= 0) { hudT = 0.1; tTime.textContent = time.toFixed(1); const pc = `${Math.round(Math.min(1, Math.max(0, (body.y - level.start[1]) / totalY)) * 100)}%`; prog.style.width = pc; mark.style.left = pc; }
  }
  let lastInp = { x: 0, y: 0 };
  const inp0 = () => lastInp;
  // ---------- mula ----------
  const tutKey = `bj-tilt-tut-${opt.id}`;
  let seen = false; try { seen = !!localStorage.getItem(tutKey); } catch { /* */ }
  // skrin kekal menyala semasa bermain (anak tidak menyentuh skrin ketika menyenget)
  let lock = null;
  const wake = async () => { try { if (!lock && navigator.wakeLock && document.visibilityState === 'visible') { lock = await navigator.wakeLock.request('screen'); lock.addEventListener?.('release', () => { lock = null; }); } } catch { /* */ } };
  const onVis = () => { if (document.visibilityState === 'visible' && running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  // kiraan 3-2-1-Jom! sebelum bola/watak boleh bergerak
  let countBox = null;
  const begin = (fast = false) => {
    if (running || counting) return;
    wake();
    if (fast || ap) { running = true; last = performance.now(); return; }
    counting = true;
    say(opt.intro(n), 'arahan');
    const num = h('b', {});
    countBox = h('div', { class: 'tg-count' }, num);
    view.append(countBox);
    ['3', '2', '1', 'Jom!'].forEach((s, i) => later(() => {
      if (!countBox) return;
      num.textContent = s; num.className = i === 3 ? 'go' : ''; num.style.animation = 'none'; void num.offsetWidth; num.style.animation = '';
      tsfx.count(i === 3); haptic(i === 3 ? 30 : 10);
      if (i === 3) later(() => { countBox?.remove(); countBox = null; counting = false; running = true; last = performance.now(); }, 450);
    }, 120 + i * 650));
  };
  // ---------- jeda ----------
  let pauseBox = null;
  function pause() {
    if (!running || won || paused) return;
    paused = true; tsfx.pause(); haptic(10); tTime.textContent = time.toFixed(1);
    const btn = (cls, ic, label, fn) => h('button', { class: `tg-pb ${cls}`, type: 'button', onclick: fn }, ico(ic), h('span', {}, label));
    pauseBox = h('div', { class: 'tg-pausebox' }, h('div', { class: 'tg-pcard' },
      h('b', {}, 'Rehat sekejap'),
      h('small', {}, `Masa ${time.toFixed(1)} s · ${coins.filter((q) => q.got).length}/${coins.length} syiling`),
      btn('go', 'play', 'Sambung', () => resume()),
      btn('', 'replay', 'Mula semula', () => { sfx.tap(); nav(`/g/${opt.id}/${n}`); }),
      btn('', 'target', 'Kalibrasi', () => { tilt.calibrate(); tilt.flash('Posisi neutral ditetapkan!'); resume(); })));
    view.append(pauseBox);
  }
  function resume() { if (!paused) return; pauseBox?.remove(); pauseBox = null; paused = false; last = performance.now(); tsfx.resume(); }
  const onHide = () => { if (document.visibilityState === 'hidden') pause(); };
  document.addEventListener('visibilitychange', onHide);
  // menu jeda kongsi (butang ⏸ atas / butang kembali telefon): beku tanpa lapisan sendiri
  const gPause = () => { if (running && !won && !paused) { paused = true; } };
  const gResume = () => { if (paused && !pauseBox) { paused = false; last = performance.now(); } };
  addEventListener('bj-pause', gPause); addEventListener('bj-resume', gResume);
  if (!seen) {
    tutorial(view, tilt, { title: opt.title, onDone: () => { try { localStorage.setItem(tutKey, '1'); } catch { /* */ } begin(); } });
  } else {
    let ready = null;
    const go = h('button', { class: 'gm-btn go tg-start', type: 'button', onclick: async () => { tsfx.ui(); haptic(15); ready.remove(); await tilt.start(); tilt.calibrate(); begin(); } }, icon('play'), 'Mula');
    ready = h('div', { class: 'tg-ready' }, h('div', { class: 'tg-rcard' },
      G.img ? h('img', { class: 'tg-rart', src: G.img, alt: '' }) : null,
      h('small', { class: 'tg-rk' }, G.chapters?.[Math.min(2, Math.floor((n - 1) / 10))] || opt.title),
      h('b', {}, `Level ${n}`),
      h('span', { class: 'tg-rinfo' }, h('span', {}, ico('coin'), `${level.coins.length}`), h('span', {}, ico('star'), `${level.stars.length}`), b0 ? h('span', {}, ico('trophy'), `${b0.toFixed(1)}s`) : null),
      h('span', { class: 'tg-rhint' }, ico('phone', 'tg-rph'), 'Pegang telefon dengan selesa, kemudian tekan Mula.'),
      go));
    view.append(ready);
    speak('Pegang telefon dengan selesa, kemudian tekan Mula.');
  }
  raf = requestAnimationFrame(frame);
  // ujian / demo: autopilot (laju)
  globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => {
    document.querySelectorAll('.tt-box, .tg-ready, .tg-count, .tg-pausebox').forEach((e) => e.remove());
    countBox = null; counting = false; paused = false;
    if (!ap) { ap = { i: 0 }; speed = globalThis.__gmFast ? 8 : 3; }
    if (!running && !won) begin(true);
  });
  return () => { cancelAnimationFrame(raf); ro.disconnect(); tilt.destroy(); document.removeEventListener('visibilitychange', onVis); document.removeEventListener('visibilitychange', onHide); removeEventListener('bj-pause', gPause); removeEventListener('bj-resume', gResume); try { lock?.release(); } catch { /* */ } lock = null; };
}
