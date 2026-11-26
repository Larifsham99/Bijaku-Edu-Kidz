// =====================================================================
//  PEK BUNYI CERIA: bunyi comel & interaktif untuk kanak-kanak
//  Semua disintesis (luar talian, tiada fail audio) dan mematuhi suis
//  "Kesan bunyi". "Sentuhan ceria" boleh dimatikan oleh ibu bapa.
//   - butang tanpa bunyi sendiri: "bloop" yang naik seperti gambang
//   - sentuh ruang kosong: gelembung + kilauan di tempat jari
//   - sentuh maskot: suara comel setiap haiwan + goyang
//   - sentuh soalan / gelembung kata: loceng kecil (ganti "dengar semula")
//   - bintang & konfeti: kilauan berderai
// =====================================================================
import { synth } from './audio.js';
import { settings } from './store.js';

const T = (o) => synth.tone(o);
const N = (o) => synth.noise(o);
const NOTE = (n) => 440 * 2 ** ((n - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const soundOn = () => { try { return settings().sound !== false; } catch { return false; } };
const touchOn = () => { try { return settings().cuteTaps !== false; } catch { return true; } };
const log = (name) => { (globalThis.__ceria ||= []).push(name); };

// Ketukan berturut-turut mendaki skala pentatonik (bunyi gambang), bermula semula selepas rehat
const SCALE = [72, 74, 76, 79, 81, 84, 86, 88, 91];
let step = -1, lastStep = 0;
function climb() {
  const now = performance.now();
  step = now - lastStep < 1400 ? Math.min(step + 1, SCALE.length - 1) : 0;
  lastStep = now;
  return NOTE(SCALE[step]);
}

export const ceria = {
  // butang biasa: gelembung bulat yang naik nada
  bloop() { log('bloop'); const f = climb(); T({ type: 'sine', f: f * 0.5, f2: f, dur: 0.09, vol: 0.13 }); T({ type: 'triangle', f: f * 2, t: 0.035, dur: 0.07, vol: 0.035 }); },
  // ruang kosong: gelembung sabun
  bubble() { log('bubble'); const f = rnd(420, 760); T({ type: 'sine', f, f2: f * 2.6, dur: 0.075, vol: 0.12 }); T({ type: 'sine', f: f * 3, t: 0.06, dur: 0.05, vol: 0.03 }); },
  // kilauan halus
  sparkle(n = 5, vol = 0.035) { log('sparkle'); for (let i = 0; i < n; i++) T({ type: 'sine', f: rnd(2000, 4200), t: i * 0.045 + rnd(0, 0.02), dur: 0.09, vol }); },
  // loceng kecil: ganti butang "dengar semula"
  chime() { log('chime'); const base = pick([72, 74, 77]); [0, 4, 7, 12].forEach((s, i) => T({ type: 'triangle', f: NOTE(base + s), t: i * 0.07, dur: 0.32, vol: 0.09 })); T({ type: 'sine', f: NOTE(base + 24), t: 0.28, dur: 0.4, vol: 0.03 }); },
  // gelak kecil comel
  giggle() { log('giggle'); for (let i = 0; i < 6; i++) T({ type: 'triangle', f: (i % 2 ? 880 : 700) * (1 + i * 0.06), t: i * 0.075, dur: 0.07, vol: 0.08, vib: { rate: 30, depth: 25 } }); },
  // itik getah
  squeak() { log('squeak'); T({ type: 'sine', f: 900, f2: 1600, dur: 0.1, vol: 0.1, vib: { rate: 40, depth: 60 } }); T({ type: 'sine', f: 1500, f2: 1100, t: 0.1, dur: 0.12, vol: 0.08 }); },
  // lompat "boing"
  hop() { log('hop'); T({ type: 'sine', f: 260, f2: 820, dur: 0.16, vol: 0.12, vib: { rate: 18, depth: 20 } }); },
  // bintang masuk ke kiraan
  starPling() { log('star'); const f = NOTE(pick([84, 86, 88, 91])); T({ type: 'triangle', f, dur: 0.16, vol: 0.09 }); T({ type: 'sine', f: f * 2, t: 0.05, dur: 0.22, vol: 0.04 }); },
  // jingle pembuka BIJAKU: gendang kecil, gambang mendaki, kemudian "ta-da!" berkilau
  intro() {
    log('intro');
    for (let i = 0; i < 6; i++) N({ t: i * 0.05, dur: 0.04, vol: 0.05 + i * 0.01, filter: { type: 'bandpass', f: 900, q: 2 } });
    [72, 76, 79, 84, 79, 84, 88].forEach((n, i) => T({ type: 'triangle', f: NOTE(n), t: 0.32 + i * 0.11, dur: 0.22, vol: 0.13 }));
    [79, 84, 88, 91].forEach((n) => T({ type: 'triangle', f: NOTE(n), t: 1.18, dur: 0.9, vol: 0.08 }));
    T({ type: 'sine', f: NOTE(48), t: 1.18, dur: 0.9, vol: 0.1 });
    T({ type: 'sine', f: 300, f2: 900, t: 1.12, dur: 0.08, vol: 0.08 });
    for (let i = 0; i < 9; i++) T({ type: 'sine', f: rnd(2200, 4400), t: 1.22 + i * 0.06, dur: 0.1, vol: 0.03 });
  },
  // konfeti: letupan kecil berderai
  popcorn(n = 6) { log('popcorn'); for (let i = 0; i < n; i++) { const t = i * rnd(0.06, 0.12); T({ type: 'sine', f: rnd(500, 900), f2: rnd(1400, 2200), t, dur: 0.05, vol: 0.06 }); } ceria.sparkle(4, 0.025); },
};

// Suara comel setiap maskot
const VOICE = {
  mimi() { T({ type: 'sawtooth', f: 700, f2: 980, dur: 0.14, vol: 0.09, filter: { type: 'bandpass', f: 1600, q: 3 } }); T({ type: 'sawtooth', f: 980, f2: 620, t: 0.14, dur: 0.24, vol: 0.09, filter: { type: 'bandpass', f: 1400, q: 3 } }); },
  bobo() { [0, 0.22].forEach((t, i) => T({ type: 'triangle', f: i ? 196 : 165, f2: i ? 220 : 175, t, dur: 0.18, vol: 0.16, filter: { type: 'lowpass', f: 900 } })); },
  coco() { ceria.squeak(); T({ type: 'sine', f: 1200, f2: 1700, t: 0.26, dur: 0.08, vol: 0.07 }); },
  dino() { T({ type: 'sawtooth', f: 220, f2: 150, dur: 0.32, vol: 0.1, filter: { type: 'lowpass', f: 700, q: 4 }, vib: { rate: 22, depth: 10 } }); T({ type: 'sine', f: 600, f2: 1100, t: 0.3, dur: 0.1, vol: 0.06 }); },
  lala() { ceria.giggle(); },
};
const NAME_TO_ID = { mimi: 'mimi', bobo: 'bobo', coco: 'coco', dino: 'dino', lala: 'lala' };
export function mascotVoice(id) {
  log('mascot:' + id);
  (VOICE[id] || (() => ceria.hop()))();
  ceria.sparkle(3, 0.025);
}

// ---------------- PENGESANAN "ADA BUNYI ATAU TIDAK" ----------------
// Setiap kesan bunyi (semua modul) mencipta Oscillator / BufferSource; rekod masanya.
let lastSound = 0;
function stamp(proto) {
  const start = proto?.start;
  if (!start || start.__ceria) return;
  proto.start = function (...a) { lastSound = performance.now(); return start.apply(this, a); };
  proto.start.__ceria = true;
}

// ---------------- KILAUAN VISUAL DI TEMPAT JARI ----------------
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function burst(x, y, chars = ['✨', '⭐', '💖', '🫧']) {
  if (still()) return;
  const n = 4;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'ceria-spark';
    s.textContent = pick(chars);
    const a = (Math.PI * 2 * i) / n + rnd(-0.4, 0.4), d = rnd(28, 52);
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}
function wiggle(el) {
  if (still() || !el) return;
  el.classList.remove('ceria-wiggle'); void el.offsetWidth; el.classList.add('ceria-wiggle');
  setTimeout(() => el.classList.remove('ceria-wiggle'), 650);
}

const INTERACTIVE = 'button, a, input, select, textarea, label, canvas, video, [role="button"], [role="switch"], [draggable], [tabindex], .choice, .o, .stage, .gm-stage, .maze, .toast, .modal';
const MASCOT = '.guide .char, [data-avatar], .ak-char, .lp-avatar, .kd-cust img, .emo.float';
const PROMPT = '.speaker-art, .prompt-big, .prompt-text, .gm-round.say, .ak-bubble, .guide .bubble';
const playing = () => /^#\/(main|harian\/|lumba\/main|silang\/main|akhlak\/kisah\/|g\/[a-z]+\/\d|warna|lukis)/.test(location.hash);

function mascotId(el) {
  const av = el.closest('[data-avatar]')?.dataset.avatar;
  if (av) return av;
  const src = el.getAttribute?.('src') || '';
  const m = src.match(/mascots\/([a-z]+)\.svg/);
  if (m) return m[1];
  const label = (el.getAttribute?.('aria-label') || el.textContent || '').toLowerCase();
  return Object.keys(NAME_TO_ID).find((k) => label.includes(k)) || '';
}

let lastTouch = 0;
export function initCeria() {
  if (initCeria.done) return;
  initCeria.done = true;
  stamp(self.OscillatorNode?.prototype);
  stamp(self.AudioBufferSourceNode?.prototype);

  // 1) maskot & 2) soalan: tangkap dahulu supaya tidak dikira butang biasa
  addEventListener('click', (e) => {
    if (!soundOn()) return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const m = t.closest(MASCOT);
    if (m && !t.closest('.choice, .coll-item, .shop-item, .grid-coll button')) { e.__ceria = true; mascotVoice(mascotId(m)); wiggle(m); burst(e.clientX, e.clientY, ['💖', '✨', '⭐']); return; }
    const p = t.closest(PROMPT);
    if (p) { e.__ceria = true; ceria.chime(); wiggle(p); }
  }, true);

  // 3) butang yang tidak berbunyi sendiri: bloop selepas pengendalinya selesai
  addEventListener('click', (e) => {
    if (e.__ceria || !soundOn()) return;
    const t = e.target instanceof Element ? e.target : null;
    const b = t?.closest('button, a, [role="button"], .choice, .o');
    if (!b || b.disabled) return;
    const at = performance.now();
    setTimeout(() => { if (lastSound < at - 5) ceria.bloop(); }, 0);
  });

  // 4) ruang kosong: gelembung + kilauan (bukan semasa bermain, supaya tidak mengelirukan)
  addEventListener('pointerdown', (e) => {
    if (!soundOn() || !touchOn() || playing()) return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t || t.closest(INTERACTIVE) || t.closest(MASCOT) || t.closest(PROMPT) || document.querySelector('.modal-back')) return;
    const now = performance.now();
    if (now - lastTouch < 140) return;
    lastTouch = now;
    ceria.bubble();
    burst(e.clientX, e.clientY);
  }, { passive: true });

  // 5) konfeti & bintang
  addEventListener('bj-confetti', (e) => { if (soundOn() && (e.detail || 0) >= 12) setTimeout(() => ceria.popcorn(Math.min(10, Math.round(e.detail / 4))), 250); });
  addEventListener('bj-star', () => { if (soundOn()) ceria.starPling(); });
}
