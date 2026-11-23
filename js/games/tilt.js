// =====================================================================
//  KAWALAN SENGET — DeviceOrientation + kalibrasi + sensitiviti
//  Alternatif: joystick sentuh & anak panah papan kekunci.
//  Output: { x, y } dalam [-1, 1] (x: kanan, y: ke hadapan), dilicinkan.
// =====================================================================
import { h } from '../ui.js';
import { icon } from '../icons.js';
import { sfx, speak } from '../audio.js';

const KEY = 'bj-tilt-v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { return {}; } };
const save = (o) => { try { localStorage.setItem(KEY, JSON.stringify({ ...load(), ...o })); } catch { /* */ } };
const MAXDEG = [30, 24, 19, 15, 12]; // sensitiviti 1 (lembut) … 5 (laju)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createTilt(host) {
  const pref = load();
  const s = { mode: pref.mode || 'tilt', sens: pref.sens || 3, cal: pref.cal || null, raw: null, x: 0, y: 0, tx: 0, ty: 0, alive: true, sensorOK: false, keys: { x: 0, y: 0 }, auto: null };
  // ---------- sensor ----------
  const onOri = (e) => {
    if (e.beta == null || e.gamma == null) return;
    s.sensorOK = true;
    // ikut orientasi skrin (potret / landskap)
    const ang = (screen.orientation?.angle ?? window.orientation ?? 0) | 0;
    let fb = e.beta, lr = e.gamma;
    if (ang === 90) { fb = -e.gamma; lr = e.beta; } else if (ang === -90 || ang === 270) { fb = e.gamma; lr = -e.beta; }
    s.raw = { fb, lr };
    if (!s.cal) { s.cal = { fb, lr }; } // kalibrasi automatik pertama
    if (s.mode !== 'tilt') return;
    const m = MAXDEG[s.sens - 1];
    const dz = (v) => (Math.abs(v) < 1.2 ? 0 : v - Math.sign(v) * 1.2);
    const curve = (v) => Math.sign(v) * Math.pow(Math.min(1, Math.abs(v)), 1.25);
    s.tx = curve(clamp(dz(lr - s.cal.lr) / m, -1, 1));
    s.ty = curve(clamp(-dz(fb - s.cal.fb) / m, -1, 1));
  };
  async function start() {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const r = await DeviceOrientationEvent.requestPermission(); // iOS: mesti dalam sentuhan pengguna
        if (r !== 'granted') { setMode('joy'); return false; }
      }
    } catch { /* */ }
    addEventListener('deviceorientation', onOri);
    await new Promise((r) => setTimeout(r, 900));
    if (!s.sensorOK && s.mode === 'tilt') setMode('joy');
    return s.sensorOK;
  }
  function calibrate() { if (s.raw) { s.cal = { ...s.raw }; save({ cal: s.cal }); } s.x = s.y = s.tx = s.ty = 0; }
  function setMode(m) { s.mode = m; save({ mode: m }); joy.hidden = m !== 'joy'; s.tx = s.ty = 0; syncUI(); }
  function setSens(v) { s.sens = clamp(v | 0, 1, 5); save({ sens: s.sens }); }

  // ---------- joystick sentuh ----------
  const knob = h('i', { class: 'tj-knob' });
  const joy = h('div', { class: 'tj-joy', 'aria-label': 'Joystick' }, knob);
  let jid = null;
  const jmove = (e) => {
    const r = joy.getBoundingClientRect(), R = r.width / 2;
    let dx = (e.clientX - r.left - R) / R, dy = (e.clientY - r.top - R) / R;
    const d = Math.hypot(dx, dy); if (d > 1) { dx /= d; dy /= d; }
    knob.style.transform = `translate(${dx * R * 0.6}px, ${dy * R * 0.6}px)`;
    s.tx = dx; s.ty = -dy;
  };
  joy.addEventListener('pointerdown', (e) => { jid = e.pointerId; joy.setPointerCapture?.(e.pointerId); jmove(e); });
  joy.addEventListener('pointermove', (e) => { if (e.pointerId === jid) jmove(e); });
  const jend = (e) => { if (e.pointerId !== jid) return; jid = null; knob.style.transform = ''; s.tx = s.ty = 0; };
  joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
  joy.hidden = s.mode !== 'joy';
  // ---------- papan kekunci ----------
  const kd = (e) => { const m = { ArrowLeft: ['x', -1], ArrowRight: ['x', 1], ArrowUp: ['y', 1], ArrowDown: ['y', -1], a: ['x', -1], d: ['x', 1], w: ['y', 1], s: ['y', -1] }[e.key]; if (m) { e.preventDefault(); s.keys[m[0]] = m[1]; } };
  const ku = (e) => { const m = { ArrowLeft: 'x', ArrowRight: 'x', ArrowUp: 'y', ArrowDown: 'y', a: 'x', d: 'x', w: 'y', s: 'y' }[e.key]; if (m) s.keys[m] = 0; };
  addEventListener('keydown', kd); addEventListener('keyup', ku);

  // ---------- butang tetapan ----------
  const modeBtn = h('button', { class: 'tj-btn', type: 'button', onclick: () => { sfx.tap(); setMode(s.mode === 'tilt' ? 'joy' : 'tilt'); if (s.mode === 'tilt' && !s.sensorOK) start(); speak(s.mode === 'tilt' ? 'Kawalan senget telefon.' : 'Kawalan joystick.'); } });
  const calBtn = h('button', { class: 'tj-btn', type: 'button', 'aria-label': 'Kalibrasi', onclick: () => { sfx.pop(); calibrate(); flash('Posisi neutral ditetapkan!'); speak('Posisi neutral ditetapkan.'); } }, '🎯', h('small', {}, 'Kalibrasi'));
  const sensLbl = h('b', {}, s.sens);
  const sensBox = h('span', { class: 'tj-sens' }, h('small', {}, 'Sensitiviti'), h('button', { type: 'button', 'aria-label': 'Kurang sensitif', onclick: () => { setSens(s.sens - 1); sensLbl.textContent = s.sens; sfx.tap(); } }, '−'), sensLbl, h('button', { type: 'button', 'aria-label': 'Lebih sensitif', onclick: () => { setSens(s.sens + 1); sensLbl.textContent = s.sens; sfx.tap(); } }, '+'));
  const bar = h('div', { class: 'tj-bar' }, modeBtn, calBtn, sensBox);
  const note = h('div', { class: 'tj-flash' });
  function flash(t) { note.textContent = t; note.classList.remove('on'); void note.offsetWidth; note.classList.add('on'); }
  function syncUI() { modeBtn.textContent = ''; modeBtn.append(s.mode === 'tilt' ? '📱' : '🕹️', h('small', {}, s.mode === 'tilt' ? 'Senget' : 'Joystick')); calBtn.hidden = s.mode !== 'tilt'; }
  syncUI();
  host.append(bar, joy, note);

  return {
    s, start, calibrate, setMode, flash,
    // baca input dilicinkan (dt dalam saat)
    read(dt) {
      if (s.auto) return s.auto();
      let tx = s.tx, ty = s.ty;
      if (s.keys.x || s.keys.y) { tx = s.keys.x; ty = s.keys.y; }
      const k = 1 - Math.exp(-dt * (s.mode === 'tilt' ? 14 : 20));
      s.x += (tx - s.x) * k; s.y += (ty - s.y) * k;
      return { x: s.x, y: s.y };
    },
    destroy() { s.alive = false; removeEventListener('deviceorientation', onOri); removeEventListener('keydown', kd); removeEventListener('keyup', ku); },
  };
}

// ---------- tutorial interaktif ----------
export function tutorial(host, tilt, { title, onDone }) {
  const steps = [['kiri', (v) => v.x < -0.55, '⬅️'], ['kanan', (v) => v.x > 0.55, '➡️'], ['depan', (v) => v.y > 0.55, '⬆️'], ['belakang', (v) => v.y < -0.55, '⬇️']];
  let i = -1, raf = 0;
  const arrow = h('div', { class: 'tt-arrow' });
  const txt = h('b', {});
  const sub = h('small', {});
  const dot = h('i', { class: 'tt-dot' });
  const pad = h('div', { class: 'tt-pad' }, dot);
  const skip = h('button', { class: 'tt-skip', type: 'button', onclick: () => finish() }, 'Langkau');
  const go = h('button', { class: 'gm-btn go', type: 'button' }, icon('play'), 'Mula');
  const box = h('div', { class: 'tt-box' }, h('div', { class: 'tt-card' }, h('small', { class: 'tt-k' }, title), arrow, txt, sub, pad, go, skip));
  host.append(box);
  const say = (a, b) => { txt.textContent = a; sub.textContent = b || ''; speak(a); };
  say('Pegang telefon dengan selesa, seperti sedang membaca.', 'Kemudian tekan Mula. Kedudukan ini menjadi posisi neutral.');
  go.onclick = async () => {
    sfx.tap(); go.hidden = true;
    await tilt.start(); tilt.calibrate();
    next();
    const loop = () => {
      if (!box.isConnected) return;
      const v = tilt.read(1 / 60);
      dot.style.transform = `translate(${v.x * 46}px, ${-v.y * 46}px)`;
      if (i >= 0 && i < steps.length && steps[i][1](v)) { sfx.correct(); next(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  };
  function next() {
    i++;
    if (i >= steps.length) { say('Hebat! Kamu sudah pandai mengawal.', ''); setTimeout(finish, 900); return; }
    const [d, , e] = steps[i];
    arrow.textContent = e;
    say(tilt.s.mode === 'tilt' ? `Sengetkan telefon ke ${d}.` : `Seret bulatan ke ${d}.`, tilt.s.mode === 'tilt' ? '' : 'Telefon ini tiada sensor senget, jadi kita guna joystick.');
  }
  function finish() { cancelAnimationFrame(raf); box.remove(); onDone?.(); }
  return { finish };
}
