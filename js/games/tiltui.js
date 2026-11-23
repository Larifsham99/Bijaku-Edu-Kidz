// =====================================================================
//  UI & BUNYI PERMAINAN SENGET — ikon SVG (ganti emoji), syiling terbang,
//  kiraan 3-2-1 & pek bunyi tambahan (disintesis, luar talian).
// =====================================================================
import { synth } from '../audio.js';

const T = synth.tone, N = synth.noise;
const NOTE = (n) => 440 * 2 ** ((n - 69) / 12);

// ---------- ikon SVG berwarna (seragam di semua telefon, tidak bergantung pada fon emoji) ----------
const SV = (vb, body) => `<svg viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
export const TI = {
  phone: SV('0 0 48 48', '<rect x="13" y="4" width="22" height="40" rx="6" fill="#2b2350"/><rect x="16" y="9" width="16" height="27" rx="2.5" fill="#7cc4ff"/><circle cx="24" cy="40" r="2" fill="#a8a2c8"/><path d="M19 22l5-5 5 5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  joy: SV('0 0 48 48', '<ellipse cx="24" cy="38" rx="17" ry="6" fill="#2b2350"/><rect x="21" y="18" width="6" height="18" rx="3" fill="#6b628c"/><circle cx="24" cy="15" r="9" fill="#ff5d8f"/><circle cx="21" cy="12" r="3" fill="#fff" opacity=".6"/><circle cx="12" cy="36" r="2.4" fill="#ffd43b"/><circle cx="36" cy="36" r="2.4" fill="#7dff9c"/>'),
  target: SV('0 0 48 48', '<circle cx="24" cy="24" r="19" fill="#ff5d5d"/><circle cx="24" cy="24" r="13.5" fill="#fff"/><circle cx="24" cy="24" r="8" fill="#ff5d5d"/><circle cx="24" cy="24" r="3" fill="#fff"/><path d="M24 2v8M24 38v8M2 24h8M38 24h8" stroke="#2b2350" stroke-width="3" stroke-linecap="round"/>'),
  clock: SV('0 0 48 48', '<circle cx="24" cy="27" r="17" fill="#fff" stroke="#3d8bff" stroke-width="5"/><rect x="19" y="3" width="10" height="6" rx="2" fill="#3d8bff"/><path d="M24 27V17M24 27l7 4" stroke="#2b2350" stroke-width="3.4" stroke-linecap="round"/>'),
  coin: SV('0 0 48 48', '<circle cx="24" cy="24" r="20" fill="#e8a10b"/><circle cx="24" cy="22" r="18" fill="#ffd43b"/><circle cx="24" cy="22" r="12" fill="none" stroke="#fff3bf" stroke-width="3"/><path d="M24 14v16" stroke="#e8a10b" stroke-width="4" stroke-linecap="round"/><ellipse cx="16" cy="14" rx="4" ry="2.5" fill="#fff" opacity=".7"/>'),
  star: SV('0 0 48 48', '<path d="M24 3l6.2 13 14.2 1.8-10.4 9.8 2.7 14.1L24 34.8 11.3 41.7l2.7-14.1L3.6 17.8 17.8 16z" fill="#ffd43b" stroke="#e8a10b" stroke-width="2.6" stroke-linejoin="round"/><path d="M16 18l5-.7" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>'),
  starOff: SV('0 0 48 48', '<path d="M24 3l6.2 13 14.2 1.8-10.4 9.8 2.7 14.1L24 34.8 11.3 41.7l2.7-14.1L3.6 17.8 17.8 16z" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.55)" stroke-width="2.6" stroke-linejoin="round"/>'),
  pause: SV('0 0 48 48', '<rect x="12" y="10" width="9" height="28" rx="3" fill="currentColor"/><rect x="27" y="10" width="9" height="28" rx="3" fill="currentColor"/>'),
  play: SV('0 0 48 48', '<path d="M15 9l25 15-25 15z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'),
  replay: SV('0 0 48 48', '<path d="M38 24a14 14 0 1 1-4.1-9.9" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M36 6v10H26" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  flag: SV('0 0 48 48', '<rect x="9" y="5" width="4" height="39" rx="2" fill="#6b628c"/><path d="M13 7h24l-6 8 6 8H13z" fill="#2fbf71"/><path d="M13 7h8v16h-8z" fill="#fff" opacity=".25"/>'),
  trophy: SV('0 0 48 48', '<path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="#ffd43b" stroke="#e8a10b" stroke-width="2.5"/><path d="M14 10H7a7 7 0 0 0 8 9M34 10h7a7 7 0 0 1-8 9" stroke="#e8a10b" stroke-width="3" fill="none"/><rect x="21" y="28" width="6" height="7" fill="#e8a10b"/><rect x="14" y="35" width="20" height="7" rx="2" fill="#6b628c"/>'),
  ball: SV('0 0 48 48', '<circle cx="24" cy="24" r="18" fill="#ff5d8f"/><circle cx="17" cy="17" r="6" fill="#fff" opacity=".55"/><circle cx="30" cy="30" r="3" fill="#ffd43b"/><circle cx="31" cy="16" r="2.5" fill="#7cc4ff"/>'),
  bulat: SV('0 0 48 48', '<ellipse cx="24" cy="27" rx="14" ry="17" fill="#ff9f1c"/><rect x="15" y="7" width="18" height="6" rx="3" fill="#3d8bff"/><circle cx="19" cy="24" r="3" fill="#fff"/><circle cx="29" cy="24" r="3" fill="#fff"/><circle cx="19.5" cy="24.5" r="1.6" fill="#2b2350"/><circle cx="29.5" cy="24.5" r="1.6" fill="#2b2350"/><path d="M19 32q5 4 10 0" stroke="#2b2350" stroke-width="2.4" fill="none" stroke-linecap="round"/>'),
  sens: SV('0 0 48 48', '<path d="M6 40h36" stroke="#d9d2f2" stroke-width="4" stroke-linecap="round"/><rect x="8" y="30" width="6" height="8" rx="2" fill="#7dff9c"/><rect x="17" y="24" width="6" height="14" rx="2" fill="#b4f05f"/><rect x="26" y="17" width="6" height="21" rx="2" fill="#ffd43b"/><rect x="35" y="9" width="6" height="29" rx="2" fill="#ff8a3d"/>'),
  arrow: SV('0 0 48 48', '<path d="M24 4l16 18H30v20H18V22H8z" fill="#fff" stroke="#2b2350" stroke-width="3" stroke-linejoin="round"/>'),
};
export const ico = (name, cls = '') => { const s = document.createElement('span'); s.className = `ti ${cls}`; s.innerHTML = TI[name]; return s; };

// ---------- pek bunyi tambahan ----------
export const tsfx = {
  count(final) { T({ type: 'triangle', f: final ? NOTE(84) : NOTE(72), dur: final ? 0.38 : 0.14, vol: 0.13 }); if (final) { T({ type: 'triangle', f: NOTE(88), t: 0.06, dur: 0.34, vol: 0.08 }); T({ type: 'sine', f: NOTE(91), t: 0.12, dur: 0.4, vol: 0.06 }); } },
  coin(k = 0) { const n = 81 + Math.min(12, k) * 1; T({ type: 'square', f: NOTE(n), dur: 0.06, vol: 0.05, filter: { type: 'lowpass', f: 3500 } }); T({ type: 'square', f: NOTE(n + 5), t: 0.06, dur: 0.16, vol: 0.05, filter: { type: 'lowpass', f: 3500 } }); },
  star() { [84, 88, 91, 96].forEach((n, i) => T({ type: 'triangle', f: NOTE(n), t: i * 0.06, dur: 0.25, vol: 0.09 })); for (let i = 0; i < 6; i++) T({ type: 'sine', f: NOTE(100 + i * 2), t: 0.22 + i * 0.04, dur: 0.12, vol: 0.035 }); },
  whoosh(v = 1) { N({ dur: 0.35, vol: 0.07 * v, a: 0.05, filter: { type: 'bandpass', f: 500, f2: 2200, q: 1.4 } }); },
  creak() { T({ type: 'sawtooth', f: 120 + Math.random() * 40, f2: 90, dur: 0.22, vol: 0.035, filter: { type: 'bandpass', f: 700, q: 6 }, vib: { rate: 30, depth: 12 } }); },
  wind() { N({ dur: 0.9, vol: 0.05, a: 0.3, filter: { type: 'bandpass', f: 400, f2: 900, q: 0.8 } }); },
  pause() { T({ type: 'sine', f: 660, f2: 440, dur: 0.12, vol: 0.09 }); },
  resume() { T({ type: 'sine', f: 440, f2: 760, dur: 0.12, vol: 0.09 }); },
  record() { [72, 76, 79, 84, 88].forEach((n, i) => T({ type: 'triangle', f: NOTE(n), t: i * 0.08, dur: 0.22, vol: 0.1 })); T({ type: 'sine', f: NOTE(96), t: 0.42, dur: 0.8, vol: 0.06, vib: { rate: 7, depth: 10 } }); },
  danger() { T({ type: 'sine', f: 880, dur: 0.06, vol: 0.05 }); T({ type: 'sine', f: 880, t: 0.12, dur: 0.06, vol: 0.05 }); },
  ui() { T({ type: 'sine', f: 520, f2: 780, dur: 0.06, vol: 0.08 }); },
};

// ---------- objek terbang dari dunia permainan ke HUD ----------
export function flyTo(layer, from, toEl, icon, onEnd) {
  try {
    const box = layer.getBoundingClientRect(), r = toEl.getBoundingClientRect();
    const el = ico(icon, 'tg-fly');
    el.style.left = `${from[0]}px`; el.style.top = `${from[1]}px`;
    layer.append(el);
    const dx = r.left + r.width / 2 - box.left - from[0], dy = r.top + r.height / 2 - box.top - from[1];
    const a = el.animate([
      { transform: 'translate(-50%,-50%) scale(.6)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.35}px), calc(-50% + ${dy * 0.35 - 40}px)) scale(1.35)`, opacity: 1, offset: 0.35 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.7)`, opacity: 0.9 },
    ], { duration: 620, easing: 'cubic-bezier(.4,0,.6,1)' });
    a.onfinish = () => { el.remove(); onEnd?.(); };
  } catch { onEnd?.(); }
}
export function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
