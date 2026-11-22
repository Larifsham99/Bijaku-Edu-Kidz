// =====================================================================
//  PEK BUNYI DUNIA BLOK — disintesis (luar talian, tiada fail audio)
//  lompat · mendarat · permata · checkpoint · jatuh · runtuh · spring · duri
//  letak/padam blok · sambutan: fanfare + tepukan gemuruh + percikan bunga api
// =====================================================================
import { synth } from '../audio.js';

const T = synth.tone, N = synth.noise;
const NOTE = (n) => 440 * 2 ** ((n - 69) / 12); // MIDI → Hz

export const bsfx = {
  jump() { T({ type: 'square', f: 280, f2: 620, dur: 0.12, vol: 0.07, filter: { type: 'lowpass', f: 2400 } }); T({ type: 'sine', f: 560, f2: 1240, dur: 0.1, vol: 0.06 }); },
  land() { N({ dur: 0.07, vol: 0.12, filter: { type: 'lowpass', f: 700 } }); T({ type: 'sine', f: 150, f2: 80, dur: 0.09, vol: 0.14 }); },
  bigland() { N({ dur: 0.16, vol: 0.18, filter: { type: 'lowpass', f: 500 } }); T({ type: 'sine', f: 120, f2: 55, dur: 0.2, vol: 0.22 }); },
  gem() { [88, 93, 100].forEach((n, i) => T({ type: 'triangle', f: NOTE(n), t: i * 0.055, dur: 0.18, vol: 0.09 })); T({ type: 'sine', f: NOTE(105), t: 0.17, dur: 0.3, vol: 0.05 }); },
  checkpoint() {
    [72, 76, 79, 84].forEach((n, i) => T({ type: 'triangle', f: NOTE(n), t: i * 0.09, dur: 0.3, vol: 0.12 }));
    T({ type: 'sine', f: NOTE(96), t: 0.36, dur: 0.6, vol: 0.06, vib: { rate: 6, depth: 8 } });
  },
  fall() { T({ type: 'sine', f: 700, f2: 90, dur: 0.6, vol: 0.13 }); N({ t: 0.05, dur: 0.5, vol: 0.06, filter: { type: 'bandpass', f: 1200, f2: 300, q: 1.2 } }); },
  splash() { N({ dur: 0.35, vol: 0.16, filter: { type: 'highpass', f: 900 } }); N({ t: 0.04, dur: 0.25, vol: 0.1, filter: { type: 'bandpass', f: 2400, q: 2 } }); T({ type: 'sine', f: 520, f2: 180, dur: 0.18, vol: 0.06 }); },
  sizzle() { N({ dur: 0.5, vol: 0.12, filter: { type: 'highpass', f: 3000 }, lfo: { rate: 30, depth: 0.6 } }); T({ type: 'sawtooth', f: 160, f2: 70, dur: 0.3, vol: 0.05, filter: { type: 'lowpass', f: 600 } }); },
  crack() { N({ dur: 0.1, vol: 0.12, filter: { type: 'bandpass', f: 1600, q: 3 } }); N({ t: 0.08, dur: 0.12, vol: 0.1, filter: { type: 'bandpass', f: 900, q: 3 } }); },
  crumble() { N({ dur: 0.45, vol: 0.14, filter: { type: 'lowpass', f: 900, f2: 200 }, lfo: { rate: 22, depth: 0.7 } }); },
  spring() { T({ type: 'sine', f: 180, f2: 1100, dur: 0.28, vol: 0.14, vib: { rate: 28, depth: 60 } }); },
  ouch() { T({ type: 'square', f: 420, f2: 210, dur: 0.18, vol: 0.07, filter: { type: 'lowpass', f: 1600 } }); T({ type: 'square', f: 300, f2: 150, t: 0.12, dur: 0.2, vol: 0.06, filter: { type: 'lowpass', f: 1200 } }); },
  bump() { T({ type: 'sine', f: 160, f2: 110, dur: 0.1, vol: 0.16 }); },
  tick() { T({ type: 'sine', f: 1800, dur: 0.025, vol: 0.015 }); },
  ready() { T({ type: 'triangle', f: NOTE(72), dur: 0.12, vol: 0.1 }); T({ type: 'triangle', f: NOTE(72), t: 0.25, dur: 0.12, vol: 0.1 }); T({ type: 'triangle', f: NOTE(84), t: 0.5, dur: 0.3, vol: 0.13 }); },
  // ---- Bina Dunia ----
  place(i = 0) { const f = [196, 220, 247, 262, 294][i % 5]; T({ type: 'triangle', f: f * 2, dur: 0.06, vol: 0.12 }); N({ dur: 0.04, vol: 0.12, filter: { type: 'bandpass', f: 2200, q: 4 } }); T({ type: 'sine', f, f2: f * 0.7, dur: 0.12, vol: 0.12 }); },
  remove() { T({ type: 'sine', f: 900, f2: 300, dur: 0.12, vol: 0.12 }); N({ dur: 0.06, vol: 0.06, filter: { type: 'highpass', f: 3000 } }); },
  layer(up) { T({ type: 'triangle', f: up ? 500 : 700, f2: up ? 760 : 460, dur: 0.12, vol: 0.09 }); },
  rotate() { N({ dur: 0.25, vol: 0.06, filter: { type: 'bandpass', f: 600, f2: 2000, q: 2 } }); },
  wrongBlock() { T({ type: 'sine', f: 300, f2: 240, dur: 0.16, vol: 0.12 }); },
  // ---- SAMBUTAN ----
  applause(dur = 2.2) {
    // tepukan gemuruh: ratusan "tepuk" hingar kecil dengan masa rawak
    for (let i = 0; i < 70; i++) {
      const t = Math.random() * dur * (0.4 + 0.6 * Math.random());
      N({ t, dur: 0.03 + Math.random() * 0.03, vol: 0.05 + Math.random() * 0.05, filter: { type: 'bandpass', f: 1200 + Math.random() * 2200, q: 1.5 } });
    }
    N({ dur, vol: 0.03, a: 0.3, filter: { type: 'bandpass', f: 1800, q: 0.7 } });
  },
  fireworks(n = 4) {
    for (let i = 0; i < n; i++) {
      const t = 0.3 + i * 0.35 + Math.random() * 0.1;
      T({ type: 'sine', f: 400, f2: 1600, t, dur: 0.3, vol: 0.04 });
      N({ t: t + 0.3, dur: 0.45, vol: 0.13, filter: { type: 'lowpass', f: 1800, f2: 300 } });
      for (let k = 0; k < 6; k++) N({ t: t + 0.4 + k * 0.05 + Math.random() * 0.05, dur: 0.03, vol: 0.05, filter: { type: 'highpass', f: 4000 } });
    }
  },
  fanfare() {
    // trompet sintetik: C–E–G–C', akhir dengan kord besar + timpani + kilauan
    const brass = (n, t, d, v = 0.08) => { T({ type: 'sawtooth', f: NOTE(n), t, dur: d, vol: v, a: 0.02, filter: { type: 'lowpass', f: 2600 } }); T({ type: 'square', f: NOTE(n), t, dur: d, vol: v * 0.4, filter: { type: 'lowpass', f: 1400 } }); };
    [[60, 0, 0.14], [64, 0.15, 0.14], [67, 0.3, 0.14], [72, 0.45, 0.32], [67, 0.8, 0.12], [72, 0.94, 0.7]].forEach(([n, t, d]) => brass(n, t, d));
    [60, 64, 67, 72, 76].forEach((n) => brass(n, 0.94, 0.9, 0.04));
    T({ type: 'sine', f: 70, f2: 45, t: 0.9, dur: 0.6, vol: 0.25 });
    T({ type: 'sine', f: 70, f2: 45, t: 0.45, dur: 0.3, vol: 0.18 });
    for (let i = 0; i < 10; i++) T({ type: 'triangle', f: NOTE(96 + (i % 5) * 2), t: 1.0 + i * 0.05, dur: 0.15, vol: 0.04 });
  },
  celebrate() { bsfx.fanfare(); setTimeout(() => { bsfx.applause(); bsfx.fireworks(3); }, 700); },
};
