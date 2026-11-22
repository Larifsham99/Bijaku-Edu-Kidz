// =====================================================================
//  TAMAN AKHLAK — latar cerita & Kebun Amal (SVG)
// =====================================================================
import { ART } from '../tekasilang/art.js';

const r = (x, y, w, h, rx, f, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${ex}/>`;
const c = (x, y, rr, f, ex = '') => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${f}" ${ex}/>`;
const p = (d, f, ex = '') => `<path d="${d}" fill="${f}" ${ex}/>`;
const e = (x, y, rx, ry, f, ex = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${ex}/>`;
const grad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

// ---------- latar cerita (viewBox 0 0 400 240) ----------
const BG = {
  rumah: () => `<defs>${grad('akW', '#ffe8cc', '#ffd8a8')}</defs>${r(0, 0, 400, 240, 0, 'url(#akW)')}${r(0, 170, 400, 70, 0, '#d9a066')}${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => r(i * 50, 170, 48, 70, 0, i % 2 ? '#d19458' : '#d9a066')).join('')}${r(40, 40, 90, 70, 8, '#a5d8ff', 'stroke="#fff" stroke-width="8"')}${p('M85 40V110M40 75H130', 'none', 'stroke="#fff" stroke-width="5"')}${r(270, 110, 110, 60, 14, '#ff8787')}${r(262, 98, 24, 72, 10, '#fa5252')}${r(364, 98, 24, 72, 10, '#fa5252')}${c(330, 50, 18, '#fff', 'stroke="#c47a3a" stroke-width="5"')}${p('M330 50V40M330 50L338 55', 'none', 'stroke="#2b2350" stroke-width="3"')}`,
  dapur: () => `<defs>${grad('akD', '#e6fcf5', '#c3fae8')}</defs>${r(0, 0, 400, 240, 0, 'url(#akD)')}${[...Array(8)].map((_, i) => r(i * 50, 0, 50, 100, 0, i % 2 ? '#d3f9d8' : '#e6fcf5')).join('')}${r(0, 120, 400, 120, 0, '#ced4da')}${r(0, 110, 400, 14, 0, '#adb5bd')}${r(20, 20, 120, 50, 6, '#fff', 'stroke="#dee2e6" stroke-width="3"')}${r(260, 30, 60, 70, 6, '#ffe066')}${c(300, 140, 22, '#495057')}${c(300, 140, 10, '#ff6b6b')}${r(330, 54, 50, 46, 4, '#74c0fc')}`,
  taman: () => `<defs>${grad('akT', '#74c0fc', '#d0ebff')}</defs>${r(0, 0, 400, 240, 0, 'url(#akT)')}${c(340, 40, 22, '#ffd43b')}${[[60, 40], [200, 30]].map(([x, y]) => c(x, y, 16, '#fff') + c(x + 18, y - 6, 20, '#fff') + c(x + 38, y, 15, '#fff')).join('')}${p('M0 150Q100 120 200 145T400 135V240H0Z', '#8ce99a')}${p('M0 180Q120 160 240 178T400 170V240H0Z', '#69db7c')}${r(320, 80, 12, 80, 4, '#8a5d36')}${c(326, 70, 36, '#37b24d')}${c(300, 86, 22, '#40c057')}${c(352, 86, 22, '#40c057')}${[[40, 190], [80, 205], [150, 198], [230, 210]].map(([x, y]) => c(x, y, 5, '#f783ac') + c(x, y, 2, '#ffd43b')).join('')}`,
  sekolah: () => `<defs>${grad('akS', '#fff9db', '#fff3bf')}</defs>${r(0, 0, 400, 240, 0, 'url(#akS)')}${r(0, 180, 400, 60, 0, '#c9a76b')}${r(110, 26, 180, 90, 8, '#2f6f4f', 'stroke="#a85d22" stroke-width="8"')}${p('M130 60h40M130 80h70M220 50h40', 'none', 'stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"')}${['A', 'B', 'C'].map((ch, i) => `<text x="${150 + i * 50}" y="104" font-size="18" font-weight="800" fill="#ffe066" font-family="Baloo 2,sans-serif">${ch}</text>`).join('')}${r(20, 120, 70, 60, 6, '#ffa94d')}${r(310, 120, 70, 60, 6, '#4dabf7')}`,
  masjid: () => `<defs>${grad('akM', '#e6fcf5', '#c3fae8')}</defs>${r(0, 0, 400, 240, 0, 'url(#akM)')}${[30, 130, 230, 330].map((x) => p(`M${x} 180V70Q${x + 20} 30 ${x + 40} 70V180Z`, '#fff8e6', 'stroke="#2f9e6a" stroke-width="4"')).join('')}${r(0, 180, 400, 60, 0, '#c92a2a')}${[...Array(8)].map((_, i) => r(i * 50 + 6, 190, 38, 44, 6, '#e8590c')).join('')}${c(200, 20, 10, '#ffd43b')}`,
  kedai: () => `<defs>${grad('akK', '#fff4e6', '#ffe8cc')}</defs>${r(0, 0, 400, 240, 0, 'url(#akK)')}${[30, 75, 120].map((y) => r(10, y, 380, 8, 2, '#a85d22')).join('')}${[...Array(14)].map((_, i) => r(20 + i * 27, 12 + (i % 3) * 45, 18, 18, 3, ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419'][i % 4])).join('')}${r(0, 175, 400, 65, 0, '#ced4da')}${r(250, 130, 130, 50, 6, '#868e96')}`,
  malam: () => `<defs>${grad('akN', '#1c2a5c', '#364fc7')}</defs>${r(0, 0, 400, 240, 0, 'url(#akN)')}${c(330, 50, 22, '#ffe066')}${c(342, 44, 20, '#25366f')}${[[40, 30], [90, 60], [160, 25], [240, 50], [280, 20]].map(([x, y]) => c(x, y, 2, '#fff')).join('')}${r(0, 170, 400, 70, 0, '#5c5f99')}${r(30, 130, 170, 50, 12, '#748ffc')}${r(30, 116, 50, 30, 10, '#fff')}`,
};
export const bgSvg = (id) => `<svg class="ak-bg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(BG[id] || BG.taman)()}</svg>`;
export const artInner = (id) => (ART[id] ? ART[id]() : '');
export const artBox = (id, size = 80) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${artInner(id)}</svg>`;

// ---------- Kebun Amal (viewBox 0 0 400 260) ----------
// tempat tanaman (deterministik) — dari belakang ke hadapan
const SLOTS = [];
for (let row = 0; row < 5; row++) for (let i = 0; i < 9; i++) {
  const y = 150 + row * 22, x = 24 + i * 44 + (row % 2 ? 20 : 0) + ((i * 7 + row * 3) % 9) - 4;
  if (x > 380) continue;
  if (row < 2 && x > 270) continue; // kawasan kolam & pokok
  SLOTS.push({ x, y, s: 0.75 + row * 0.08 });
}
function plantSvg(type, x, y, s, k, isNew) {
  const sway = `style="--d:${(k % 7) * 0.4}s"`;
  let o = `<g class="ak-plant ${isNew ? 'new' : ''}" transform="translate(${x} ${y}) scale(${s})"><g class="sway" ${sway}>`;
  o += p('M0 0V-26', 'none', 'stroke="#2f9e6a" stroke-width="3"') + e(-6, -10, 6, 3, '#51cf66', 'transform="rotate(-30 -6 -10)"') + e(6, -16, 6, 3, '#40c057', 'transform="rotate(30 6 -16)"');
  if (type === 'raya') o += [...Array(5)].map((_, i) => e(0, -34, 5, 9, '#e8412c', `transform="rotate(${i * 72} 0 -28)"`)).join('') + c(0, -28, 3, '#ffd43b');
  else if (type === 'matahari') o += [...Array(10)].map((_, i) => e(0, -38, 3.5, 7, '#fcc419', `transform="rotate(${i * 36} 0 -30)"`)).join('') + c(0, -30, 6, '#8a5d36');
  else if (type === 'tulip') o += p('M-8 -26Q-9 -40 -4 -42L0 -36L4 -42Q9 -40 8 -26Q0 -20 -8 -26Z', '#f783ac');
  else if (type === 'melur') o += [...Array(5)].map((_, i) => e(0, -34, 4, 7, '#fff', `transform="rotate(${i * 72} 0 -28)" stroke="#e9ecef"`)).join('') + c(0, -28, 2.5, '#ffe066');
  else if (type === 'teratai') o += [...Array(6)].map((_, i) => e(0, -32, 4, 9, '#da77f2', `transform="rotate(${-50 + i * 20} 0 -24)"`)).join('') + c(0, -26, 3, '#ffd43b');
  else if (type === 'pokok') o = `<g class="ak-plant ${isNew ? 'new' : ''}" transform="translate(${x} ${y}) scale(${s})"><g class="sway" ${sway}>${r(-3, -26, 6, 26, 2, '#8a5d36')}${c(0, -34, 14, '#37b24d')}${c(-8, -28, 8, '#40c057')}${c(8, -28, 8, '#40c057')}${c(-5, -36, 2.5, '#ff6b6b')}${c(6, -30, 2.5, '#ff922b')}`;
  return o + '</g></g>';
}
export function gardenSvg(state, { highlight = -1 } = {}) {
  const plants = state.plants || [];
  const n = plants.length, fruits = Math.min(40, state.deedsTotal || 0);
  const hour = new Date().getHours(), night = hour >= 19 || hour < 6;
  const sky = night ? ['#1c2a5c', '#364fc7'] : ['#74c0fc', '#e7f5ff'];
  const has = (k) => n >= k;
  let o = `<svg class="ak-garden-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Kebun Amal dengan ${n} tanaman"><defs>${grad('akG', sky[0], sky[1])}</defs>`;
  o += r(0, 0, 400, 260, 0, 'url(#akG)');
  o += night ? c(340, 40, 18, '#ffe066') + c(350, 34, 16, sky[0]) + [[40, 30], [120, 50], [220, 24], [280, 60]].map(([x, y]) => c(x, y, 1.8, '#fff')).join('') : c(340, 42, 20, '#ffd43b', 'class="ak-sun"');
  if (has(15)) o += ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'].map((col, i) => `<path d="M${40 + i * 6} 150A${150 - i * 6} ${120 - i * 6} 0 0 1 ${360 - i * 6} 150" fill="none" stroke="${col}" stroke-width="6" opacity=".55"/>`).join('');
  o += `<path d="M0 130Q100 100 200 125T400 115V260H0Z" fill="#a9e34b"/><path d="M0 150Q140 132 260 148T400 142V260H0Z" fill="#8ce99a"/>`;
  // pagar
  o += [...Array(21)].map((_, i) => r(i * 20, 128 + Math.sin(i) * 2, 6, 22, 2, '#e0a26a')).join('') + r(0, 134, 400, 4, 2, '#c47a3a');
  // pokok amal besar (buah = amal hari ini)
  o += `<g transform="translate(326 150)">${r(-8, -70, 16, 72, 6, '#8a5d36')}${c(0, -88, 42, '#2f9e6a')}${c(-30, -70, 24, '#37b24d')}${c(30, -70, 24, '#37b24d')}${c(0, -110, 26, '#40c057')}`;
  for (let i = 0; i < fruits; i++) { const a = i * 2.39, rr = 10 + (i % 5) * 7; o += c(Math.cos(a) * rr, -90 + Math.sin(a) * rr * 0.8, 4.2, ['#ff6b6b', '#ff922b', '#fcc419'][i % 3], 'class="ak-fruit"'); }
  o += '</g>';
  if (has(10)) o += e(250, 160, 34, 9, '#74c0fc', 'stroke="#a5d8ff" stroke-width="3"') + e(240, 158, 6, 2, '#69db7c') + e(262, 162, 6, 2, '#69db7c');
  if (has(20)) o += `<g transform="translate(40 140)">${r(-22, -26, 44, 28, 3, '#ffe8cc')}${p('M-28 -24L0 -46L28 -24Z', '#e8590c')}${r(-6, -14, 12, 16, 2, '#a85d22')}</g>`;
  // tanaman
  plants.forEach((pl, k) => { const sl = SLOTS[k % SLOTS.length]; if (sl) o += plantSvg(pl.type, sl.x + (k >= SLOTS.length ? 10 : 0), sl.y, sl.s, k, k === highlight); });
  if (!n) o += `<g transform="translate(200 200)">${e(0, 4, 26, 6, '#8a5d36')}${p('M0 0V-14', 'none', 'stroke="#51cf66" stroke-width="3"')}${e(-6, -12, 6, 3, '#51cf66')}${e(6, -14, 6, 3, '#51cf66')}</g>`;
  if (has(3)) o += [[90, 90, 0], [190, 70, 1.2], [140, 110, 2.1]].slice(0, n >= 8 ? 3 : 2).map(([x, y, d]) => `<g class="ak-fly" style="--d:${d}s" transform="translate(${x} ${y})">${e(-5, 0, 5, 7, '#f783ac')}${e(5, 0, 5, 7, '#da77f2')}${r(-1, -5, 2, 10, 1, '#2b2350')}</g>`).join('');
  if (has(6)) o += [[60, 50], [250, 40]].map(([x, y], i) => `<g class="ak-bird" style="--d:${i * 1.5}s" transform="translate(${x} ${y})">${p('M-10 0Q-5 -6 0 0Q5 -6 10 0', 'none', 'stroke="#2b2350" stroke-width="2.5" stroke-linecap="round"')}</g>`).join('');
  if (has(30)) o += [...Array(8)].map((_, i) => c(30 + i * 45, 20 + (i % 3) * 14, 3, '#ffd43b', 'class="ak-twinkle"')).join('');
  return o + '</svg>';
}
