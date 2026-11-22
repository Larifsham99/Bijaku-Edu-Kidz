// =====================================================================
//  TEKA SILANG CILIK — kesan bunyi sahaja (TIADA suara / dialog)
//  Web Audio API, konteks sendiri, variasi nada supaya tidak membosankan.
//  Mematuhi tetapan "Bunyi" ibu bapa; tidak berbunyi sebelum sentuhan pertama.
// =====================================================================
import { settings } from '../store.js';

let ctx = null, out = null;
const on = () => { try { return settings().sound !== false; } catch { return true; } };
function ac() {
  if (!ctx) {
    const C = self.AudioContext || self.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch { return null; }
    out = ctx.createGain(); out.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor(); out.connect(comp); comp.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
export const unlock = () => ac();
const vary = (f, pct = 0.06) => f * (1 + (Math.random() * 2 - 1) * pct);
function tone(f, { t = 0, d = 0.15, type = 'sine', v = 0.12, f2 = null, a = 0.006 } = {}) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + t;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + d + 0.05);
}
function noise({ t = 0, d = 0.12, v = 0.08, f = 2000, f2 = null, q = 1, type = 'bandpass' } = {}) {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + t, len = Math.ceil(c.sampleRate * d);
  const b = c.createBuffer(1, len, c.sampleRate), dt = b.getChannelData(0);
  for (let i = 0; i < len; i++) dt[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource(); s.buffer = b;
  const fl = c.createBiquadFilter(); fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t0); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t0 + d);
  const g = c.createGain(); g.gain.setValueAtTime(v, t0);
  s.connect(fl); fl.connect(g); g.connect(out); s.start(t0);
}
const PENTA = [523, 587, 659, 784, 880, 1047, 1175, 1319];
let step = 0;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const sfx = {
  // pilih huruf: pop lembut / ketukan kayu / klik comel / gelembung
  pick() {
    if (!on()) return;
    pick([
      () => tone(vary(420), { f2: vary(900), d: 0.08, v: 0.13 }),
      () => { noise({ d: 0.05, v: 0.12, f: vary(1800), q: 6 }); tone(vary(720), { d: 0.06, type: 'triangle', v: 0.07 }); },
      () => tone(vary(1500), { d: 0.04, type: 'square', v: 0.035 }),
      () => tone(vary(300), { f2: vary(1100), d: 0.11, v: 0.12 }),
    ])();
  },
  // huruf dimasukkan: tink / plop / chime (naik mengikut urutan)
  place() {
    if (!on()) return;
    const f = PENTA[step++ % PENTA.length];
    pick([
      () => { tone(f * 2, { d: 0.22, v: 0.08 }); tone(f * 3, { d: 0.12, v: 0.03 }); },
      () => tone(vary(600), { f2: vary(260), d: 0.12, v: 0.13 }),
      () => { tone(f, { d: 0.3, type: 'triangle', v: 0.1 }); tone(f * 1.5, { t: 0.04, d: 0.25, v: 0.05 }); },
    ])();
  },
  drag() { if (!on()) return; noise({ d: 0.18, v: 0.05, f: vary(900), f2: vary(2600), q: 1.5 }); },
  // perkataan betul: kilauan ajaib + loceng gembira + melodi pendek
  word() {
    if (!on()) return;
    const base = pick([523, 587, 659]);
    [0, 4, 7, 12].forEach((st, i) => tone(base * 2 ** (st / 12), { t: i * 0.07, d: 0.28, type: 'triangle', v: 0.11 }));
    for (let i = 0; i < 6; i++) tone(vary(2400 + i * 300, 0.1), { t: 0.2 + i * 0.04, d: 0.12, v: 0.035 });
    tone(base * 4, { t: 0.3, d: 0.6, v: 0.05 });
  },
  coin() { if (!on()) return; tone(988, { d: 0.07, type: 'square', v: 0.04 }); tone(1319, { t: 0.07, d: 0.22, type: 'square', v: 0.04 }); },
  // salah: goyang lembut / boing comel / pop rendah (tiada buzzer)
  wrong() {
    if (!on()) return;
    pick([
      () => { tone(vary(260), { f2: vary(200), d: 0.18, v: 0.1 }); tone(vary(220), { t: 0.12, f2: vary(180), d: 0.2, v: 0.08 }); },
      () => tone(vary(160), { f2: vary(420), d: 0.22, type: 'triangle', v: 0.12 }),
      () => tone(vary(240), { f2: vary(120), d: 0.14, v: 0.12 }),
    ])();
  },
  hint() { if (!on()) return; [1568, 1976, 2349].forEach((f, i) => tone(f, { t: i * 0.06, d: 0.18, v: 0.04 })); },
  // papan siap: melodi sambutan + loceng berbilang + kilauan
  complete() {
    if (!on()) return;
    const mel = pick([[523, 659, 784, 1047, 784, 1047, 1319], [587, 740, 880, 1175, 880, 1175, 1480], [523, 587, 659, 784, 880, 1047]]);
    mel.forEach((f, i) => tone(f, { t: i * 0.11, d: 0.3, type: 'triangle', v: 0.12 }));
    [262, 330, 392].forEach((f) => tone(f, { d: 1.1, v: 0.05 }));
    for (let i = 0; i < 10; i++) tone(vary(2000 + Math.random() * 2000, 0), { t: 0.5 + i * 0.06, d: 0.15, v: 0.03 });
  },
  sticker() { if (!on()) return; tone(400, { f2: 1600, d: 0.25, v: 0.08 }); [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, { t: 0.2 + i * 0.08, d: 0.3, v: 0.07 })); },
  star(i = 0) { if (!on()) return; tone([1047, 1319, 1568][i % 3], { d: 0.25, type: 'triangle', v: 0.1 }); tone([2093, 2637, 3136][i % 3], { t: 0.05, d: 0.2, v: 0.04 }); },
  // buka chapter: pembukaan ajaib + harta karun
  unlock() {
    if (!on()) return;
    noise({ d: 0.6, v: 0.06, f: 600, f2: 4000, q: 2 });
    [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, { t: 0.15 + i * 0.07, d: 0.4, type: 'triangle', v: 0.09 }));
    tone(2093, { t: 0.6, d: 0.8, v: 0.05 });
  },
  tap() { if (!on()) return; tone(vary(660), { f2: vary(880), d: 0.07, v: 0.08 }); },
};
