// =====================================================================
//  PEMBURU WARNA — permainan kamera: cari objek sebenar ikut warna
//  Halakan kamera belakang ke objek di rumah; bulatan tengah mengesan warna.
//  Tahan 1 saat bila warna betul → objek "ditangkap" ke koleksi.
//  Ringan: sampel 24×24 piksel, 6 kali sesaat; kamera ditutup bila tamat/tersembunyi.
//  Tiada kamera / tidak dibenarkan → Mod Gambar (pilih objek bergambar).
//  Bab 1: warna asas · Bab 2: warna campuran · Bab 3: hitam, putih + cabaran 4 warna
// =====================================================================
import { h, clear } from '../ui.js';
import { icon } from '../icons.js';
import { speak, sfx, synth } from '../audio.js';
import { COLORS } from '../data/content.js';
import { openCamera, stopCamera, cameraMessage, cameraAllowed, cameraSupported } from '../camera.js';

const NAME = Object.fromEntries(COLORS.map((c) => [c.id, c]));
const SETS = [['merah', 'kuning', 'biru', 'hijau'], ['merah', 'kuning', 'biru', 'hijau', 'oren', 'ungu', 'merahjambu', 'coklat'], ['merah', 'kuning', 'biru', 'hijau', 'oren', 'ungu', 'merahjambu', 'coklat', 'hitam', 'putih']];

// RGB purata → nama warna (HSV dengan ambang yang mesra kanak-kanak)
export function classify(r, g, b) {
  const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255, d = mx - mn;
  const v = mx, s = mx ? d / mx : 0;
  let hue = 0;
  if (d) { if (mx === r / 255) hue = 60 * (((g - b) / 255 / d) % 6); else if (mx === g / 255) hue = 60 * ((b - r) / 255 / d + 2); else hue = 60 * ((r - g) / 255 / d + 4); }
  if (hue < 0) hue += 360;
  if (v < 0.2) return 'hitam';
  if (s < 0.2) return v > 0.78 ? 'putih' : v < 0.32 ? 'hitam' : 'kelabu';
  if (hue < 14 || hue >= 340) return s < 0.5 && v > 0.7 ? 'merahjambu' : 'merah';
  if (hue < 40) return v < 0.55 ? 'coklat' : 'oren';
  if (hue < 70) return v < 0.45 ? 'coklat' : 'kuning';
  if (hue < 165) return 'hijau';
  if (hue < 255) return 'biru';
  if (hue < 290) return 'ungu';
  return 'merahjambu';
}

export function makeTargets(n, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10));
  const pool = ch === 2 ? [...SETS[2].slice(8), ...rng.shuffle(SETS[1])] : rng.shuffle(SETS[ch]);
  const k = ch === 2 ? 4 : 3;
  const out = [];
  for (const c of (ch === 2 ? [...rng.shuffle(pool.slice(0, 2)).slice(0, 1), ...rng.shuffle(pool.slice(2))] : pool)) { if (!out.includes(c)) out.push(c); if (out.length === k) break; }
  return out;
}

const ring = (p) => `conic-gradient(#2fbf71 ${p * 360}deg, rgba(255,255,255,.35) 0)`;

export default {
  play(ctx) {
    const { n, rng, stage, later } = ctx;
    const targets = makeTargets(n, rng);
    let ti = 0, stream = null, timer = 0, hold = 0, mode = null, stopped = false;
    ctx.rounds(targets.length);
    const found = h('div', { class: 'pw-found' });
    const wrap = h('div', { class: 'pw-wrap' });
    stage.append(wrap);

    // ---------- mod kamera ----------
    const video = h('video', { class: 'pw-video', playsinline: '', muted: '', autoplay: '' }); video.muted = true;
    const sample = h('canvas', { width: 24, height: 24 }); const sg = sample.getContext('2d', { willReadFrequently: true });
    const reticle = h('div', { class: 'pw-reticle' }, h('i'));
    const seen = h('div', { class: 'pw-seen' }, 'Mencari…');
    const card = h('div', { class: 'pw-card' });
    function showTarget() {
      ctx.round(ti);
      const t = NAME[targets[ti]];
      clear(card);
      card.append(h('span', { class: 'pw-splat', style: `--c:${t.hex}` }), h('span', {}, h('small', {}, `Cari ${ti + 1} / ${targets.length}`), h('b', {}, t.n.toUpperCase()), h('em', {}, t.en)));
      card.style.setProperty('--c', t.hex);
      return t;
    }
    async function startCamera() {
      mode = 'kamera';
      clear(wrap);
      wrap.append(card, h('div', { class: 'pw-view' }, video, reticle, seen), found,
        h('button', { class: 'pw-switch', type: 'button', onclick: () => { sfx.tap(); stopAll(); startPictures(); } }, '🖼️ Main tanpa kamera'));
      const t = showTarget();
      ctx.say(n === 1 && ti === 0 ? `Jom jadi Pemburu Warna! Halakan kamera ke sesuatu berwarna ${t.n.toLowerCase()} di rumah, dan masukkan dalam bulatan.` : `Cari sesuatu berwarna ${t.n.toLowerCase()}!`);
      try {
        stream = await openCamera('environment', 480);
        if (stopped || !ctx.alive()) { stopCamera(stream); return; }
        video.srcObject = stream; await video.play().catch(() => {});
        timer = setInterval(tick, 170);
      } catch (e) {
        ctx.say(`${cameraMessage(e.code)} Kita main dengan gambar dahulu.`, 'galakan');
        startPictures();
      }
    }
    function tick() {
      if (!video.videoWidth || stopped) return;
      const vw = video.videoWidth, vh = video.videoHeight, s = Math.min(vw, vh) * 0.22;
      sg.drawImage(video, (vw - s) / 2, (vh - s) / 2, s, s, 0, 0, 24, 24);
      const d = sg.getImageData(0, 0, 24, 24).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const px = d.length / 4; r /= px; g /= px; b /= px;
      judge(classify(r, g, b), `rgb(${r | 0},${g | 0},${b | 0})`);
    }
    function judge(name, rgb) {
      const want = targets[ti];
      const nm = NAME[name]?.n || (name === 'kelabu' ? 'Kelabu' : name);
      seen.textContent = `Kamera nampak: ${nm}`; seen.style.setProperty('--c', rgb);
      reticle.style.setProperty('--seen', rgb);
      if (name === want) {
        hold += 170;
        if (hold === 170) synth.tone({ type: 'sine', f: 520, f2: 780, dur: 0.15, vol: 0.06 });
        reticle.firstChild.style.background = ring(Math.min(1, hold / 1000));
        reticle.classList.add('lock');
        if (hold >= 1000) capture(rgb);
      } else { hold = Math.max(0, hold - 340); reticle.classList.remove('lock'); reticle.firstChild.style.background = ring(hold / 1000); }
    }
    function capture(rgb) {
      clearInterval(timer); hold = 0;
      const t = NAME[targets[ti]];
      // gambar kecil sementara (tidak disimpan)
      const th = h('canvas', { class: 'pw-thumb', width: 72, height: 72 });
      try { const vw = video.videoWidth, vh = video.videoHeight, s = Math.min(vw, vh) * 0.5; th.getContext('2d').drawImage(video, (vw - s) / 2, (vh - s) / 2, s, s, 0, 0, 72, 72); } catch { /* */ }
      found.append(h('span', { class: 'pw-got', style: `--c:${t.hex}` }, th, h('small', {}, t.n)));
      synth.noise({ dur: 0.05, vol: 0.15, filter: { type: 'highpass', f: 3000 } });
      ctx.good({ speakIt: false });
      ctx.say(`Hebat! Kamu jumpa warna ${t.n.toLowerCase()}! Dalam bahasa Inggeris, ${t.en}.`, 'pujian');
      next(() => { timer = setInterval(tick, 170); });
    }
    function next(resume) {
      ti++;
      later(() => {
        if (ti >= targets.length) { stopAll(); ctx.done(); return; }
        const t = showTarget(); reticle.classList.remove('lock'); reticle.firstChild.style.background = ring(0);
        if (mode === 'kamera') ctx.say(`Sekarang, cari sesuatu berwarna ${t.n.toLowerCase()}!`);
        resume?.();
      }, 1800);
    }

    // ---------- mod gambar (tanpa kamera) ----------
    function startPictures() {
      mode = 'gambar';
      clear(wrap);
      const grid = h('div', { class: 'pw-pics' });
      wrap.append(card, grid, found);
      const render = () => {
        const t = showTarget();
        clear(grid);
        const right = rng.pick(t.items);
        const others = rng.shuffle(COLORS.filter((c) => c.id !== t.id && !(t.id === 'merah' && c.id === 'merahjambu') && !(t.id === 'merahjambu' && c.id === 'merah'))).slice(0, 3).map((c) => rng.pick(c.items.filter((x) => !t.items.includes(x))) || c.items[0]);
        const opts = rng.shuffle([right, ...others]);
        let done = false;
        opts.forEach((e) => grid.appendChild(h('button', { class: 'pw-pic', type: 'button', onclick: (ev) => {
          if (done) return;
          if (e === right) { done = true; ev.currentTarget.classList.add('ok'); found.append(h('span', { class: 'pw-got', style: `--c:${t.hex}` }, h('span', { class: 'emo pw-emo' }, e), h('small', {}, t.n))); ctx.good({ speakIt: false }); ctx.say(`Betul! Itu warna ${t.n.toLowerCase()}. ${t.en}!`, 'pujian'); next(() => ti < targets.length && render()); }
          else { ctx.miss(); ev.currentTarget.classList.add('no'); ctx.say(`Bukan yang itu. Cari yang berwarna ${t.n.toLowerCase()}.`, 'galakan'); }
        } }, h('span', { class: 'emo' }, e))));
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => grid.children[opts.indexOf(right)]?.click());
        ctx.say(`Tekan gambar yang berwarna ${t.n.toLowerCase()}.`);
      };
      render();
    }
    function stopAll() { stopped = true; clearInterval(timer); stopCamera(stream); stream = null; }
    const onVis = () => { if (document.hidden && mode === 'kamera') { clearInterval(timer); stopCamera(stream); stream = null; } else if (!document.hidden && mode === 'kamera' && !stream && !stopped && ti < targets.length) { stopped = false; startCamera(); } };
    document.addEventListener('visibilitychange', onVis);
    globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { if (mode === 'kamera') { clearInterval(timer); judge(targets[ti], NAME[targets[ti]].hex); hold = 1000; capture(NAME[targets[ti]].hex); } });

    // pilihan mula
    if (cameraAllowed() && cameraSupported() && !globalThis.__gmNoCamera) {
      clear(wrap);
      wrap.append(h('div', { class: 'pw-intro' },
        h('div', { class: 'pw-intro-art' }, '📷🌈'),
        h('b', {}, 'Pemburu Warna'),
        h('p', {}, 'Cari objek sebenar di sekeliling kamu ikut warna!'),
        h('button', { class: 'gm-btn go', type: 'button', onclick: () => { sfx.tap(); startCamera(); } }, icon('play'), 'Buka kamera'),
        h('button', { class: 'gm-btn', type: 'button', onclick: () => { sfx.tap(); startPictures(); } }, '🖼️ Main tanpa kamera')));
      ctx.say('Jom jadi Pemburu Warna! Tekan Buka kamera.');
      globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { startPictures(); });
    } else startPictures();
    return () => { stopAll(); document.removeEventListener('visibilitychange', onVis); };
  },
};
