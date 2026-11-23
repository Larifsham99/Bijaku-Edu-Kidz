// =====================================================================
//  SELFIE JUARA — gambar kejayaan dengan bingkai/filter comel + Album Selfie
//  • Dimuat secara malas (hanya apabila butang ditekan)
//  • Tiada pengecaman wajah / ML: anak letak muka dalam bulatan panduan
//  • Foto JPEG kecil (≈40–70 KB) dalam IndexedDB peranti sahaja; maks. 30 / anak
// =====================================================================
import { h, clear, todayKey } from './ui.js';
import { icon } from './icons.js';
import { profile } from './store.js';
import { speak, sfx, synth } from './audio.js';
import { openCamera, stopCamera, cameraMessage } from './camera.js';
import { go } from './nav.js';

const W = 600, H = 800, MAX_PHOTOS = 30;
// bulatan panduan muka (relatif kepada kanvas)
const FACE = { x: 0.5, y: 0.46, rx: 0.3, ry: 0.27 };

// ---------------- filter (lukisan kanvas, tiada fail imej) ----------------
function star(g, x, y, r, c) { g.fillStyle = c; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); }
function heart(g, x, y, s, c) { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + s * 0.3); g.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3); g.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s); g.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3); g.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3); g.fill(); }
function cloud(g, x, y, s) { g.fillStyle = '#fff'; [[0, 0, 1], [0.8, -0.3, 1.2], [1.7, 0, 0.9]].forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s * 0.6, 0, 7); g.fill(); }); }
const top = (w, hh) => [FACE.x * w, (FACE.y - FACE.ry) * hh];
export const FILTERS = [
  { id: 'juara', n: 'Juara', e: '👑', draw(g, w, hh) {
    const [cx, cy] = top(w, hh); const s = w * 0.34;
    g.fillStyle = '#ffd43b'; g.strokeStyle = '#e08a00'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(cx - s / 2, cy); g.lineTo(cx - s / 2, cy - s * 0.45); g.lineTo(cx - s / 4, cy - s * 0.2); g.lineTo(cx, cy - s * 0.55); g.lineTo(cx + s / 4, cy - s * 0.2); g.lineTo(cx + s / 2, cy - s * 0.45); g.lineTo(cx + s / 2, cy); g.closePath(); g.fill(); g.stroke();
    [[-0.25, '#ff5d5d'], [0, '#3d8bff'], [0.25, '#2fbf71']].forEach(([dx, c]) => { g.fillStyle = c; g.beginPath(); g.arc(cx + dx * s, cy - s * 0.1, s * 0.06, 0, 7); g.fill(); });
    [[0.12, 0.2, 26], [0.88, 0.25, 22], [0.1, 0.72, 18], [0.9, 0.7, 24], [0.2, 0.1, 14], [0.8, 0.08, 16]].forEach(([x, y, r]) => star(g, x * w, y * hh, r, '#ffd43b'));
  } },
  { id: 'graduan', n: 'Graduan', e: '🎓', draw(g, w, hh) {
    const [cx, cy] = top(w, hh); const s = w * 0.42;
    g.fillStyle = '#2b2350'; g.beginPath(); g.moveTo(cx, cy - s * 0.32); g.lineTo(cx + s / 2, cy - s * 0.14); g.lineTo(cx, cy + s * 0.04); g.lineTo(cx - s / 2, cy - s * 0.14); g.closePath(); g.fill();
    g.fillRect(cx - s * 0.26, cy - s * 0.12, s * 0.52, s * 0.2);
    g.strokeStyle = '#ffd43b'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx, cy - s * 0.14); g.lineTo(cx + s * 0.38, cy - s * 0.06); g.lineTo(cx + s * 0.38, cy + s * 0.22); g.stroke();
    g.fillStyle = '#ffd43b'; g.fillRect(cx + s * 0.35, cy + s * 0.2, s * 0.07, s * 0.12);
    g.save(); g.translate(w * 0.82, hh * 0.78); g.rotate(-0.4); g.fillStyle = '#fff9db'; g.fillRect(-60, -16, 120, 32); g.fillStyle = '#ff5d5d'; g.fillRect(-8, -18, 16, 36); g.restore();
  } },
  { id: 'pelangi', n: 'Pelangi', e: '🌈', draw(g, w, hh) {
    const cx = w / 2, cy = hh * (FACE.y - FACE.ry + 0.02);
    ['#ff5d5d', '#ff922b', '#ffd43b', '#2fbf71', '#3d8bff', '#9b5cff'].forEach((c, i) => { g.strokeStyle = c; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy + w * 0.12, w * (0.42 - i * 0.03), Math.PI * 1.05, Math.PI * 1.95); g.stroke(); });
    cloud(g, w * 0.06, hh * 0.3, 34); cloud(g, w * 0.78, hh * 0.3, 34);
    [[0.1, 0.8, 40, '#ff8fab'], [0.86, 0.84, 34, '#ff5d8f'], [0.2, 0.92, 26, '#ffa8c5']].forEach(([x, y, s, c]) => heart(g, x * w, y * hh, s, c));
  } },
  { id: 'angkasa', n: 'Angkasawan', e: '🚀', draw(g, w, hh) {
    const cx = FACE.x * w, cy = FACE.y * hh, r = w * 0.38;
    g.strokeStyle = 'rgba(220,235,255,.95)'; g.lineWidth = 26; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
    g.strokeStyle = 'rgba(160,190,230,.9)'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, r + 13, 0, 7); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy, r - 30, Math.PI * 1.15, Math.PI * 1.45); g.stroke();
    g.fillStyle = '#ff922b'; g.beginPath(); g.arc(w * 0.12, hh * 0.12, 34, 0, 7); g.fill(); g.strokeStyle = '#ffd8a8'; g.lineWidth = 6; g.beginPath(); g.ellipse(w * 0.12, hh * 0.12, 56, 14, -0.3, 0, 7); g.stroke();
    g.fillStyle = '#74c0fc'; g.beginPath(); g.arc(w * 0.88, hh * 0.86, 26, 0, 7); g.fill();
    [[0.85, 0.12, 14], [0.08, 0.6, 12], [0.92, 0.5, 10], [0.15, 0.88, 14]].forEach(([x, y, rr]) => star(g, x * w, y * hh, rr, '#fff'));
  } },
  { id: 'bunga', n: 'Bunga', e: '🌸', draw(g, w, hh) {
    const cx = FACE.x * w, cy = (FACE.y - FACE.ry * 0.85) * hh, rx = FACE.rx * w * 1.05;
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (1.1 + i * 0.1), x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * rx * 0.55 + rx * 0.35;
      const col = ['#ff8fab', '#ffd43b', '#b197fc', '#ff922b'][i % 4];
      for (let k = 0; k < 5; k++) { const b = (k / 5) * Math.PI * 2; g.fillStyle = col; g.beginPath(); g.arc(x + Math.cos(b) * 14, y + Math.sin(b) * 14, 12, 0, 7); g.fill(); }
      g.fillStyle = '#fff3bf'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill();
    }
    g.fillStyle = '#51cf66'; [[0.05, 0.95], [0.95, 0.95]].forEach(([x, y]) => { g.beginPath(); g.ellipse(x * w, y * hh, 60, 26, x < 0.5 ? -0.6 : 0.6, 0, 7); g.fill(); });
  } },
];

function badge(g, w, hh, label) {
  const y = hh - 92;
  g.fillStyle = 'rgba(28,23,71,.78)'; roundRect(g, 24, y, w - 48, 68, 22); g.fill();
  g.fillStyle = '#ffd43b'; g.font = '900 30px "Baloo 2", sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.fillText('BIJAKU', 46, y + 24);
  g.fillStyle = '#fff'; g.font = '800 20px "Baloo 2", sans-serif'; g.fillText(label.slice(0, 34), 46, y + 50);
  g.textAlign = 'right'; g.fillStyle = 'rgba(255,255,255,.8)'; g.font = '700 18px "Baloo 2", sans-serif';
  g.fillText(new Date().toLocaleDateString('ms-MY'), w - 46, y + 24);
}
function roundRect(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ---------------- storan album (IndexedDB) ----------------
function db() {
  return new Promise((res, rej) => {
    const rq = indexedDB.open('bj-selfie', 1);
    rq.onupgradeneeded = () => { const st = rq.result.createObjectStore('photos', { keyPath: 'id', autoIncrement: true }); st.createIndex('pid', 'pid'); };
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
  });
}
const tx = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => { const t = d.transaction('photos', mode); const out = fn(t.objectStore('photos')); t.oncomplete = () => { d.close(); res(out?.result ?? out); }; t.onerror = () => { d.close(); rej(t.error); }; }); };
export async function listPhotos(pid = profile()?.id) {
  const all = await tx('readonly', (st) => st.index('pid').getAll(String(pid)));
  return (all || []).sort((a, b) => b.t - a.t);
}
export async function addPhoto(blob, label) {
  const pid = String(profile()?.id);
  await tx('readwrite', (st) => st.add({ pid, t: Date.now(), label, blob }));
  const list = await listPhotos(pid);
  for (const old of list.slice(MAX_PHOTOS)) await tx('readwrite', (st) => st.delete(old.id));
}
export const deletePhoto = (id) => tx('readwrite', (st) => st.delete(id));
export async function deleteAllPhotos(pid) { const list = await listPhotos(pid); for (const p of list) await deletePhoto(p.id); }

// ---------------- bunyi ----------------
const beep = (f) => synth.tone({ type: 'triangle', f, dur: 0.12, vol: 0.12 });
const shutter = () => { synth.noise({ dur: 0.05, vol: 0.2, filter: { type: 'highpass', f: 3000 } }); synth.noise({ t: 0.07, dur: 0.06, vol: 0.14, filter: { type: 'bandpass', f: 1500, q: 2 } }); };

// ---------------- skrin selfie (lapisan penuh) ----------------
export async function openSelfie(label = 'Juara hari ini!') {
  let stream = null, fi = 0, busy = false, stopped = false;
  const video = h('video', { class: 'sf-video', playsinline: '', muted: '', autoplay: '' });
  video.muted = true;
  const over = h('canvas', { class: 'sf-over', width: W, height: H });
  const guide = h('div', { class: 'sf-guide' });
  const count = h('div', { class: 'sf-count' });
  const flash = h('div', { class: 'sf-flash' });
  const msg = h('div', { class: 'sf-msg' }, 'Membuka kamera…');
  const tapHint = h('button', { class: 'sf-tapshot', type: 'button', 'aria-label': 'Ambil gambar', onclick: (e) => { e.stopPropagation(); capture(); } }, h('span', { class: 'emo' }, '📸'));
  const stage = h('div', { class: 'sf-stage', onclick: () => capture() }, video, over, guide, count, flash, msg, tapHint);
  const filters = h('div', { class: 'sf-filters' });
  const shot = h('button', { class: 'sf-shot', type: 'button', 'aria-label': 'Ambil gambar', onclick: () => capture() });
  const close = () => { stopped = true; stopCamera(stream); root.remove(); document.removeEventListener('visibilitychange', onVis); removeEventListener('resize', fit); window.visualViewport?.removeEventListener('resize', fit); };
  const root = h('div', { class: 'sf-root', role: 'dialog', 'aria-label': 'Selfie Juara' },
    h('div', { class: 'sf-top' }, h('button', { class: 'sf-x', type: 'button', 'aria-label': 'Tutup', onclick: () => { sfx.tap(); close(); } }, icon('close')), h('b', {}, '📸 Selfie Juara'), h('span')),
    stage, filters, h('div', { class: 'sf-bar' }, shot));
  document.body.appendChild(root);
  // muatkan kotak kamera dalam ruang skrin yang BENAR-BENAR kelihatan (bar alamat pelayar telefon)
  function fit() {
    const vh = window.visualViewport?.height || window.innerHeight;
    root.style.height = `${vh}px`;
    const others = [...root.children].filter((c) => c !== stage && !c.hidden).reduce((a, c) => a + c.offsetHeight, 0);
    const gaps = 10 * root.children.length + 24;
    const hAvail = Math.max(180, vh - others - gaps);
    const w = Math.max(150, Math.min(root.clientWidth - 24, 420, hAvail * 0.75));
    stage.style.width = `${Math.floor(w)}px`;
  }
  addEventListener('resize', fit); window.visualViewport?.addEventListener('resize', fit);
  requestAnimationFrame(fit);
  const drawOverlay = () => { const g = over.getContext('2d'); g.clearRect(0, 0, W, H); FILTERS[fi].draw(g, W, H); };
  FILTERS.forEach((f, i) => filters.appendChild(h('button', { class: `sf-f ${i === fi ? 'on' : ''}`, type: 'button', 'aria-label': `Filter ${f.n}`, onclick: (e) => { fi = i; sfx.pop(); drawOverlay(); filters.querySelectorAll('.sf-f').forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); } }, h('span', { class: 'emo' }, f.e), h('small', {}, f.n))));
  drawOverlay();
  const onVis = () => { if (document.hidden) { stopCamera(stream); stream = null; } else if (!stopped && !stream) start(); };
  document.addEventListener('visibilitychange', onVis);
  async function start() {
    try {
      stream = await openCamera('user', 640);
      if (stopped) { stopCamera(stream); return; }
      video.srcObject = stream; await video.play().catch(() => {});
      msg.textContent = ''; msg.hidden = true; fit();
      speak('Letakkan muka kamu dalam bulatan, kemudian ketik skrin atau tekan butang kamera!');
    } catch (e) {
      msg.textContent = cameraMessage(e.code); msg.hidden = false; shot.disabled = true;
      speak(cameraMessage(e.code));
    }
  }
  async function capture() {
    if (busy || !stream) return;
    busy = true; shot.disabled = true; tapHint.hidden = true;
    for (const n of [3, 2, 1]) { count.textContent = n; count.classList.remove('pop'); void count.offsetWidth; count.classList.add('pop'); beep(n === 1 ? 880 : 660); await new Promise((r) => setTimeout(r, 700)); if (stopped) return; }
    count.textContent = '';
    const c = h('canvas', { width: W, height: H }); const g = c.getContext('2d');
    // potong (cover) & cermin seperti cermin
    const vw = video.videoWidth || 640, vh = video.videoHeight || 480;
    const sc = Math.max(W / vw, H / vh), dw = vw * sc, dh = vh * sc;
    g.save(); g.translate(W, 0); g.scale(-1, 1); g.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh); g.restore();
    FILTERS[fi].draw(g, W, H); badge(g, W, H, label);
    shutter(); flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
    stopCamera(stream); stream = null; // jimat bateri: kamera ditutup serta-merta
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.78));
    const url = URL.createObjectURL(blob);
    clear(stage); filters.hidden = true; stage.onclick = null; requestAnimationFrame(fit);
    stage.appendChild(h('img', { class: 'sf-photo', src: url, alt: 'Selfie juara' }));
    sfx.reward?.();
    speak('Cantiknya! Simpan dalam album?', { mood: 'pujian' });
    const bar = root.querySelector('.sf-bar'); clear(bar);
    bar.append(
      h('button', { class: 'sf-btn', type: 'button', onclick: () => { sfx.tap(); URL.revokeObjectURL(url); root.remove(); stopped = false; document.removeEventListener('visibilitychange', onVis); openSelfie(label); } }, icon('replay'), 'Ulang'),
      h('button', { class: 'sf-btn go', type: 'button', onclick: async () => { sfx.correct(); try { await addPhoto(blob, label); speak('Disimpan dalam Album Selfie!', { mood: 'pujian' }); } catch { speak('Maaf, gambar tidak dapat disimpan.'); } URL.revokeObjectURL(url); close(); } }, icon('check'), 'Simpan'));
    busy = false;
  }
  start();
  return close;
}

// ---------------- skrin Album Selfie ----------------
export function albumScreen() {
  const p = profile();
  const scr = h('div', { class: 'screen sf-album' });
  scr.appendChild(h('div', { class: 'topbar' }, h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Kembali', onclick: () => go('/trofi') }, icon('back')), h('div', { class: 'title' }, '📸 Album Selfie'), h('div', { class: 'spacer' })));
  const grid = h('div', { class: 'sf-grid' }, h('div', { class: 'muted center' }, 'Memuatkan…'));
  scr.appendChild(grid);
  scr.appendChild(h('p', { class: 'muted center', style: { fontSize: '13px' } }, `Foto disimpan dalam peranti ini sahaja (maksimum ${MAX_PHOTOS}). Tiada foto dimuat naik ke internet.`));
  const urls = [];
  listPhotos(p?.id).then((list) => {
    clear(grid);
    if (!list.length) { grid.appendChild(h('div', { class: 'panel center' }, h('div', { class: 'emo', style: { fontSize: '54px' } }, '📸'), h('p', {}, 'Belum ada selfie. Tamatkan satu level, kemudian tekan "Selfie Juara"!'))); return; }
    list.forEach((ph) => {
      const u = URL.createObjectURL(ph.blob); urls.push(u);
      grid.appendChild(h('button', { class: 'sf-thumb', type: 'button', onclick: () => view(ph, u) }, h('img', { src: u, alt: ph.label || 'Selfie' }), h('small', {}, new Date(ph.t).toLocaleDateString('ms-MY'))));
    });
  }).catch(() => { clear(grid); grid.appendChild(h('p', { class: 'muted center' }, 'Album tidak dapat dibuka pada peranti ini.')); });
  function view(ph, u) {
    const back = h('div', { class: 'sf-view', onclick: (e) => { if (e.target === back) back.remove(); } },
      h('div', { class: 'sf-view-box' }, h('img', { src: u, alt: '' }),
        h('div', { class: 'row-wrap' },
          h('button', { class: 'btn small ghost', type: 'button', onclick: async () => { await deletePhoto(ph.id); sfx.pop(); back.remove(); go('/album'); } }, icon('trash'), 'Padam'),
          h('a', { class: 'btn small green', href: u, download: `bijaku-selfie-${todayKey()}.jpg`, style: { textDecoration: 'none' } }, 'Simpan ke telefon'),
          h('button', { class: 'btn small', type: 'button', onclick: () => back.remove() }, 'Tutup'))));
    document.body.appendChild(back);
  }
  return scr;
}
