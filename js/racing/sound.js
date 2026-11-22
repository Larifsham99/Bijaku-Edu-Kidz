// =====================================================================
//  CILIK RACING — bunyi enjin kartun, kesan bunyi & muzik dunia
//  Konteks audio sendiri supaya sistem audio asal tidak disentuh.
//  Mematuhi tetapan "Bunyi" ibu bapa.
// =====================================================================
import { settings } from '../store.js';

let ctx = null, master = null, eng = null, musicGain = null, musicTimer = null, nextBar = 0;
const on = () => { try { return settings().sound !== false; } catch { return true; } };

function ac() {
  if (!ctx) {
    const C = self.AudioContext || self.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch { return null; }
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
export function unlock() { ac(); }

function tone(f, { t = 0, dur = 0.15, type = 'triangle', vol = 0.15, f2 = null, out = null } = {}) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + t;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(out || master); o.start(t0); o.stop(t0 + dur + 0.05);
}
function noise({ t = 0, dur = 0.3, vol = 0.12, f = 1200, f2 = null, type = 'bandpass' } = {}) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + t;
  const len = Math.ceil(c.sampleRate * dur);
  const b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b;
  const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t0); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  const g = c.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t0); s.stop(t0 + dur);
}

export const rsfx = {
  count(n) { if (!on()) return; tone(n ? 523 : 1047, { dur: n ? 0.18 : 0.4, type: 'square', vol: 0.07 }); },
  steer() { if (!on()) return; noise({ dur: 0.08, vol: 0.05, f: 2500, type: 'highpass' }); },
  ok() { if (!on()) return; [784, 988, 1175, 1568].forEach((f, i) => tone(f, { t: i * 0.06, dur: 0.2, vol: 0.13 })); },
  no() { if (!on()) return; tone(392, { f2: 330, dur: 0.22, type: 'sine', vol: 0.12 }); },
  collect() { if (!on()) return; tone(1319, { dur: 0.08, type: 'square', vol: 0.05 }); tone(1760, { t: 0.06, dur: 0.18, type: 'square', vol: 0.05 }); },
  star() { if (!on()) return; [1568, 2093, 2637].forEach((f, i) => tone(f, { t: i * 0.05, dur: 0.16, type: 'sine', vol: 0.09 })); },
  oops() { if (!on()) return; tone(300, { f2: 200, dur: 0.18, type: 'sine', vol: 0.1 }); },
  bump() { if (!on()) return; tone(220, { f2: 520, dur: 0.12, type: 'sine', vol: 0.16 }); tone(520, { t: 0.1, f2: 260, dur: 0.18, type: 'sine', vol: 0.12 }); },
  boost() { if (!on()) return; noise({ dur: 0.7, vol: 0.12, f: 400, f2: 3000 }); tone(220, { f2: 660, dur: 0.5, type: 'sawtooth', vol: 0.04 }); },
  check() { if (!on()) return; tone(988, { dur: 0.12, vol: 0.12 }); tone(1319, { t: 0.1, dur: 0.25, vol: 0.12 }); },
  pit() { if (!on()) return; for (let i = 0; i < 4; i++) noise({ t: i * 0.09, dur: 0.06, vol: 0.14, f: 3000, type: 'highpass' }); },
  finish() {
    if (!on()) return;
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, { t: i * 0.11, dur: 0.24, vol: 0.14 }));
    for (let i = 0; i < 6; i++) noise({ t: 0.9 + i * 0.12, dur: 0.05, vol: 0.2, f: 1400 });
  },
  champion() { if (!on()) return; rsfx.finish(); [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, { t: 1 + i * 0.16, dur: 0.5, vol: 0.12, type: 'sine' })); },
  pop() { if (!on()) return; tone(400, { f2: 1200, dur: 0.08, type: 'sine', vol: 0.12 }); },
};

// ---------------- ENJIN KARTUN ----------------
export function engineStart() {
  if (!on() || eng) return;
  const c = ac(); if (!c) return;
  const g = c.createGain(); g.gain.value = 0.0001;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; f.Q.value = 6;
  const o1 = c.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 60;
  const o2 = c.createOscillator(); o2.type = 'square'; o2.frequency.value = 90;
  const lfo = c.createOscillator(); lfo.frequency.value = 14; const lg = c.createGain(); lg.gain.value = 8;
  lfo.connect(lg); lg.connect(o1.frequency);
  o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
  o1.start(); o2.start(); lfo.start();
  g.gain.linearRampToValueAtTime(0.035, c.currentTime + 0.4);
  eng = { g, f, o1, o2, lfo };
}
export function engineSet(pct, boost) {
  if (!eng || !ctx) return;
  const t = ctx.currentTime;
  const f = 55 + pct * 75 + (boost ? 30 : 0);
  eng.o1.frequency.setTargetAtTime(f, t, 0.08);
  eng.o2.frequency.setTargetAtTime(f * 1.5, t, 0.08);
  eng.f.frequency.setTargetAtTime(380 + pct * 700 + (boost ? 600 : 0), t, 0.1);
  eng.lfo.frequency.setTargetAtTime(10 + pct * 14, t, 0.1);
}
export function engineStop() {
  if (!eng || !ctx) return;
  const e = eng; eng = null;
  try { e.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08); setTimeout(() => { try { e.o1.stop(); e.o2.stop(); e.lfo.stop(); e.g.disconnect(); } catch { /* */ } }, 400); } catch { /* */ }
}

// ---------------- MUZIK DUNIA ----------------
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16];
export function musicStart(world, seed = 1) {
  musicStop();
  if (!on()) return;
  const c = ac(); if (!c) return;
  musicGain = c.createGain(); musicGain.gain.value = 0.11; musicGain.connect(master);
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const beat = 60 / world.music.bpm / 2;
  const root = world.music.root;
  const mel = Array.from({ length: 16 }, (_, i) => (i % 4 === 3 && rnd() < 0.4 ? null : PENTA[Math.floor(rnd() * PENTA.length)]));
  const bass = [0, 0, 7, 5];
  nextBar = c.currentTime + 0.1;
  const sched = () => {
    if (!musicGain) return;
    while (nextBar < c.currentTime + 1.2) {
      const t0 = nextBar - c.currentTime;
      mel.forEach((st, i) => { if (st !== null) tone(root * 2 ** (st / 12), { t: t0 + i * beat, dur: beat * 0.9, vol: 0.09, out: musicGain }); });
      bass.forEach((st, i) => tone(root / 2 * 2 ** (st / 12), { t: t0 + i * beat * 4, dur: beat * 3.6, vol: 0.12, type: 'sine', out: musicGain }));
      for (let i = 0; i < 8; i++) tone(i % 2 ? 2400 : 1800, { t: t0 + i * beat * 2, dur: 0.03, vol: 0.02, type: 'square', out: musicGain });
      nextBar += beat * 16;
    }
  };
  sched();
  musicTimer = setInterval(sched, 400);
}
export function musicStop() {
  clearInterval(musicTimer); musicTimer = null;
  if (musicGain) { try { musicGain.disconnect(); } catch { /* */ } musicGain = null; }
}
export function stopAll() { engineStop(); musicStop(); }
export function suspend() { try { if (ctx && ctx.state === 'running') ctx.suspend(); } catch { /* */ } }
export function resume() { try { if (ctx && ctx.state === 'suspended') ctx.resume(); } catch { /* */ } }
