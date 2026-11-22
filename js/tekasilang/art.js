// =====================================================================
//  TEKA SILANG CILIK — ilustrasi SVG khas (tanpa emoji)
//  Setiap lukisan dalam viewBox 0 0 100 100. Gaya: bentuk bulat, warna ceria,
//  kilauan putih & bayang lembut seperti pelekat mainan.
//  Nabi tidak digambarkan; Kaabah, masjid & mushaf dilukis secara ringkas dan sopan.
// =====================================================================
const c = (x, y, r, f, ex = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${ex}/>`;
const e = (x, y, rx, ry, f, ex = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${ex}/>`;
const r = (x, y, w, h, rx, f, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${ex}/>`;
const p = (d, f, ex = '') => `<path d="${d}" fill="${f}" ${ex}/>`;
const s = (d, col, w = 3, ex = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
const hl = (x, y, rx, ry, a = 0.55) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${a}"/>`;
const sh = (x = 50, y = 92, rx = 30) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="4.5" fill="#000" opacity=".13"/>`;
const t = (x, y, txt, size, f, ex = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" font-weight="800" font-family="Baloo 2, Nunito, sans-serif" fill="${f}" ${ex}>${txt}</text>`;
const star = (cx, cy, r1, r2, f, n = 5) => { let d = ''; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r2 : r1; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`; } return p(d + 'Z', f); };
const moon = (cx, cy, rr, f, cut = '#fff') => c(cx, cy, rr, f) + c(cx + rr * 0.45, cy - rr * 0.25, rr * 0.85, cut);
const heart = (cx, cy, k, f) => p(`M${cx} ${cy + 16 * k}C${cx - 26 * k} ${cy - 2 * k} ${cx - 16 * k} ${cy - 22 * k} ${cx} ${cy - 10 * k}C${cx + 16 * k} ${cy - 22 * k} ${cx + 26 * k} ${cy - 2 * k} ${cx} ${cy + 16 * k}Z`, f);
const SKIN = '#f6c99e';

// watak ringkas (bukan nabi): kepala & badan bulat
function person({ x = 50, y = 92, k = 1, top = '#4dabf7', head = 'hair', hair = '#3b2a1e', hijab = '#ff8fab', glasses = false, beard = null, mouth = 'smile', arms = 'down', bottom = null } = {}) {
  const S = (v) => v * k;
  let o = `<g transform="translate(${x} ${y})">`;
  o += e(0, 0, S(16), S(3), '#000', 'opacity=".12"');
  o += r(S(-12), S(-34), S(24), S(34), S(11), top);
  if (bottom) o += r(S(-12), S(-14), S(24), S(14), S(6), bottom);
  if (arms === 'up') o += s(`M${S(-11)} ${S(-28)}L${S(-19)} ${S(-46)}M${S(11)} ${S(-28)}L${S(19)} ${S(-46)}`, top, S(6)) + c(S(-19), S(-47), S(3.5), SKIN) + c(S(19), S(-47), S(3.5), SKIN);
  else if (arms === 'front') o += s(`M${S(-10)} ${S(-26)}L${S(-4)} ${S(-18)}M${S(10)} ${S(-26)}L${S(4)} ${S(-18)}`, top, S(6)) + c(S(-3), S(-17), S(3.5), SKIN) + c(S(3), S(-17), S(3.5), SKIN);
  else if (arms === 'wave') o += s(`M${S(-11)} ${S(-26)}L${S(-16)} ${S(-10)}M${S(11)} ${S(-28)}L${S(20)} ${S(-44)}`, top, S(6)) + c(S(-16), S(-9), S(3.5), SKIN) + c(S(20), S(-45), S(3.5), SKIN);
  else o += s(`M${S(-11)} ${S(-26)}L${S(-15)} ${S(-10)}M${S(11)} ${S(-26)}L${S(15)} ${S(-10)}`, top, S(6)) + c(S(-15), S(-9), S(3.5), SKIN) + c(S(15), S(-9), S(3.5), SKIN);
  o += hl(S(-5), S(-29), S(5), S(2), 0.35);
  if (head === 'hijab' || head === 'telekung') o += c(0, S(-46), S(15), head === 'telekung' ? '#ffffff' : hijab) + p(`M${S(-15)} ${S(-44)}Q0 ${S(-24)} ${S(15)} ${S(-44)}L${S(15)} ${S(-36)}Q0 ${S(-20)} ${S(-15)} ${S(-36)}Z`, head === 'telekung' ? '#f1f3f5' : hijab);
  o += c(0, S(-46), S(head === 'hijab' || head === 'telekung' ? 10.5 : 12), SKIN);
  if (head === 'hair') o += p(`M${S(-12)} ${S(-47)}Q${S(-12)} ${S(-60)} 0 ${S(-59)}Q${S(12)} ${S(-60)} ${S(12)} ${S(-47)}Q${S(4)} ${S(-54)} ${S(-12)} ${S(-47)}Z`, hair);
  if (head === 'songkok') o += r(S(-11), S(-62), S(22), S(10), S(2), '#26262b');
  if (head === 'kopiah') o += p(`M${S(-11)} ${S(-52)}Q0 ${S(-64)} ${S(11)} ${S(-52)}Z`, '#ffffff', 'stroke="#dee2e6"');
  if (head === 'serban') o += e(0, S(-56), S(13), S(7), '#ffffff', 'stroke="#dee2e6"');
  if (head === 'bun') o += p(`M${S(-12)} ${S(-46)}Q${S(-12)} ${S(-60)} 0 ${S(-59)}Q${S(12)} ${S(-60)} ${S(12)} ${S(-46)}Q${S(6)} ${S(-52)} ${S(-12)} ${S(-46)}Z`, hair) + c(0, S(-61), S(5), hair);
  o += c(S(-4), S(-47), S(1.5), '#2b2350') + c(S(4), S(-47), S(1.5), '#2b2350');
  o += c(S(-7), S(-43), S(2), '#ff9aa2', 'opacity=".6"') + c(S(7), S(-43), S(2), '#ff9aa2', 'opacity=".6"');
  if (mouth === 'smile') o += s(`M${S(-3.5)} ${S(-41.5)}Q0 ${S(-38.5)} ${S(3.5)} ${S(-41.5)}`, '#c2255c', S(1.4));
  if (mouth === 'sad') o += s(`M${S(-3)} ${S(-39.5)}Q0 ${S(-42)} ${S(3)} ${S(-39.5)}`, '#c2255c', S(1.4));
  if (glasses) o += s(`M${S(-8)} ${S(-47)}h${S(6)}M${S(2)} ${S(-47)}h${S(6)}`, '#495057', S(1.2)) + `<circle cx="${S(-4.5)}" cy="${S(-47)}" r="${S(3)}" fill="none" stroke="#495057" stroke-width="${S(1)}"/><circle cx="${S(4.5)}" cy="${S(-47)}" r="${S(3)}" fill="none" stroke="#495057" stroke-width="${S(1)}"/>`;
  if (beard) o += p(`M${S(-9)} ${S(-42)}Q0 ${S(-28)} ${S(9)} ${S(-42)}Q0 ${S(-36)} ${S(-9)} ${S(-42)}Z`, beard);
  return o + '</g>';
}
const hand = (x, y, k = 1, rot = 0, f = SKIN) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">${r(-9, -6, 18, 22, 8, f)}${r(-9, -20, 4.5, 18, 2.2, f)}${r(-4.3, -24, 4.5, 20, 2.2, f)}${r(0.4, -22, 4.5, 18, 2.2, f)}${r(5, -17, 4.5, 14, 2.2, f)}${r(-16, -3, 9, 5, 2.5, f, 'transform="rotate(-30 -12 0)"')}</g>`;
const book = (x, y, w, h, col, k = '') => r(x, y, w, h, 3, col) + r(x + 3, y + 2, w - 6, h - 4, 2, '#fff', 'opacity=".25"') + r(x, y + h - 5, w, 5, 2, '#000', 'opacity=".15"') + k;
const masjidShape = (x = 50, y = 88, k = 1, dome = '#2f9e6a') => `<g transform="translate(${x} ${y}) scale(${k})">${r(-30, -30, 60, 30, 3, '#fff8e6')}${p('M-20 -30Q-20 -58 0 -62Q20 -58 20 -30Z', dome)}${hl(-6, -50, 4, 7, 0.4)}${r(-1, -72, 2, 10, 1, '#f2a922')}${moon(1, -76, 4, '#f2a922', '#fff8e6')}${r(-38, -56, 8, 56, 2, '#fff8e6')}${p('M-40 -56L-34 -68L-28 -56Z', dome)}${r(30, -56, 8, 56, 2, '#fff8e6')}${p('M28 -56L34 -68L40 -56Z', dome)}${p('M-6 0V-14Q0 -22 6 -14V0Z', '#9c6b16')}${p('M-20 -8V-16Q-16 -22 -12 -16V-8Z', '#a5d8ff')}${p('M12 -8V-16Q16 -22 20 -16V-8Z', '#a5d8ff')}</g>`;
const kaabah = (x = 50, y = 86, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">${sh(0, 2, 32)}${p('M-28 0V-40L0 -48L28 -40V0Z', '#26262b')}${p('M0 -48V0', 'none', 'stroke="#3b3b44" stroke-width="2"')}${p('M-28 -30L0 -37L28 -30V-24L0 -31L-28 -24Z', '#f2c14e')}${r(8, -18, 9, 18, 1, '#c99512')}${hl(-14, -40, 8, 2, 0.15)}</g>`;
const sejadah = (x = 50, y = 54) => `<g transform="translate(${x} ${y})">${sh(0, 38, 30)}${r(-22, -36, 44, 72, 6, '#c92a2a')}${r(-17, -31, 34, 62, 4, '#e8590c')}${p('M-12 -12Q-12 -28 0 -30Q12 -28 12 -12V22H-12Z', '#fff3bf')}${p('M-7 -10Q-7 -20 0 -22Q7 -20 7 -10V16H-7Z', '#2f9e6a')}${r(-22, 30, 44, 6, 3, '#ffd43b')}${[-16, -8, 0, 8, 16].map((xx) => r(xx - 1, 36, 2, 5, 1, '#ffd43b')).join('')}</g>`;
const plate = (y = 64, f = '#fff') => e(50, y + 6, 36, 9, '#000', 'opacity=".12"') + e(50, y, 36, 11, '#dee2e6') + e(50, y - 1.5, 29, 8, f);
const sun = (x, y, rr, f = '#ffd43b') => [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return s(`M${(x + Math.cos(a) * (rr + 4)).toFixed(1)} ${(y + Math.sin(a) * (rr + 4)).toFixed(1)}L${(x + Math.cos(a) * (rr + 11)).toFixed(1)} ${(y + Math.sin(a) * (rr + 11)).toFixed(1)}`, '#fcc419', 4); }).join('') + c(x, y, rr, f) + hl(x - rr * 0.35, y - rr * 0.4, rr * 0.35, rr * 0.2, 0.5);
const cloud = (x, y, k = 1, f = '#fff') => `<g transform="translate(${x} ${y}) scale(${k})">${c(-12, 2, 10, f)}${c(0, -4, 13, f)}${c(13, 2, 10, f)}${r(-20, 0, 40, 12, 6, f)}</g>`;
const sky = (a, b) => `<defs><linearGradient id="g${a.slice(1)}${b.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>${r(6, 6, 88, 88, 16, `url(#g${a.slice(1)}${b.slice(1)})`)}`;
const tree = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">${r(-4, -22, 8, 24, 3, '#8a5d36')}${c(0, -34, 18, '#2f9e6a')}${c(-11, -26, 11, '#37b24d')}${c(11, -26, 11, '#37b24d')}${hl(-6, -42, 6, 3, 0.35)}</g>`;
const fish = (x, y, k = 1, f = '#4dabf7') => `<g transform="translate(${x} ${y}) scale(${k})">${p('M14 0L28 -10V10Z', f)}${e(0, 0, 18, 11, f)}${c(-8, -2, 2.6, '#2b2350')}${hl(-3, -5, 7, 2.5, 0.5)}${s('M4 -6Q8 0 4 6', '#fff', 1.6, 'opacity=".6"')}</g>`;

export const ART = {
  bulanbintang: () => c(50, 50, 38, '#1c3d72') + moon(44, 50, 22, '#ffd43b', '#1c3d72') + star(70, 40, 9, 4, '#ffd43b') + star(30, 26, 3, 1.4, '#fff') + star(74, 72, 3, 1.4, '#fff'),
  hatisinar: () => [...Array(10)].map((_, i) => { const a = i * Math.PI / 5; return s(`M${50 + Math.cos(a) * 30} ${52 + Math.sin(a) * 30}L${50 + Math.cos(a) * 42} ${52 + Math.sin(a) * 42}`, '#ffd43b', 4); }).join('') + heart(50, 50, 1.25, '#f03e3e') + hl(40, 38, 6, 3, 0.6) + star(50, 50, 7, 3, '#fff3bf'),
  tadah: () => sh() + hand(34, 70, 1.2, -18) + hand(66, 70, 1.2, 18) + [...Array(5)].map((_, i) => s(`M${38 + i * 6} 26l0 -8`, '#ffd43b', 3)).join('') + star(50, 14, 5, 2, '#ffd43b'),
  syukur: () => sh() + person({ top: '#69db7c', head: 'kopiah', arms: 'front' }) + heart(50, 72, 0.4, '#f03e3e') + star(22, 22, 5, 2, '#ffd43b') + star(80, 28, 4, 2, '#ffd43b'),
  hati: () => sh(50, 88, 28) + heart(50, 50, 1.6, '#ff6b6b') + hl(36, 34, 8, 4, 0.6),
  hatipink: () => sh(50, 88, 28) + heart(44, 52, 1.2, '#f783ac') + heart(64, 42, 0.8, '#ff8787') + hl(34, 40, 6, 3, 0.6),
  peti: () => sh(50, 88, 34) + r(18, 46, 64, 40, 6, '#c47a3a') + p('M18 50Q18 30 50 28Q82 30 82 50Z', '#a85d22') + r(18, 48, 64, 7, 2, '#f2a922') + r(44, 52, 12, 14, 3, '#f2a922') + c(50, 58, 2.5, '#5b3d22') + r(18, 72, 64, 5, 2, '#f2a922') + hl(32, 36, 10, 3, 0.35),
  hadiah: () => sh(50, 88, 30) + r(22, 44, 56, 42, 6, '#ff6b6b') + r(18, 36, 64, 14, 5, '#fa5252') + r(46, 36, 8, 50, 2, '#ffd43b') + p('M50 36C40 20 26 26 34 36ZM50 36C60 20 74 26 66 36Z', '#ffd43b') + hl(34, 54, 6, 10, 0.3),
  sejadah: () => sejadah(),
  telunjuk: () => sh() + `<g transform="translate(50 62) scale(1.5)">${r(-10, -4, 20, 22, 8, SKIN)}${r(-3, -30, 7, 28, 3.5, SKIN)}${r(4, -6, 6, 10, 3, SKIN)}${r(-12, -2, 7, 12, 3, SKIN)}</g>` + star(70, 20, 6, 2.5, '#ffd43b'),
  puasa: () => plate(70) + moon(48, 34, 16, '#ffd43b', '#fff') + c(30, 70, 0, '#000') + s('M36 70h28', '#ced4da', 3) + star(72, 24, 4, 2, '#ffd43b'),
  zakat: () => sh() + hand(50, 78, 1.4, 0) + [[40, 40], [54, 34], [60, 48], [46, 52]].map(([x, y]) => c(x, y, 9, '#f2c14e') + c(x, y, 6, '#ffd43b') + t(x, y + 3.5, 'RM', 6, '#c99512')).join(''),
  kaabah: () => kaabah(50, 82, 1.15) + star(20, 20, 4, 2, '#ffd43b'),
  tiang: () => sh(50, 90, 38) + r(14, 20, 72, 10, 3, '#f2c14e') + [20, 33, 46, 59, 72].map((x) => r(x, 30, 8, 54, 3, '#fff8e6', 'stroke="#e9d8b4"')).join('') + r(10, 84, 80, 7, 3, '#e9d8b4'),
  lima: () => t(50, 72, '5', 70, '#7a4eb0', 'stroke="#fff" stroke-width="4" paint-order="stroke"') + star(80, 22, 6, 2.5, '#ffd43b'),
  enam: () => t(50, 72, '6', 70, '#2e5aac', 'stroke="#fff" stroke-width="4" paint-order="stroke"') + star(80, 22, 6, 2.5, '#ffd43b'),
  ihram: () => sh() + r(30, 40, 40, 50, 14, '#ffffff', 'stroke="#dee2e6" stroke-width="2"') + p('M30 50L70 74', 'none', 'stroke="#e9ecef" stroke-width="6"') + c(50, 30, 12, SKIN) + p('M38 28Q50 14 62 28Q50 22 38 28Z', '#2b2350') + c(46, 30, 1.4, '#2b2350') + c(54, 30, 1.4, '#2b2350'),
  makkah: () => sky('#ffd8a8', '#fff4e6') + p('M6 70Q30 46 50 64Q72 44 94 66V94H6Z', '#d9a066') + kaabah(50, 88, 0.8),
  beras: () => sh(50, 90, 26) + p('M28 40Q50 30 72 40L76 86H24Z', '#e9d8b4') + p('M30 40Q50 50 70 40', 'none', 'stroke="#c9a76b" stroke-width="3"') + [...Array(9)].map((_, i) => e(38 + (i % 3) * 12, 26 + Math.floor(i / 3) * 5, 3, 1.6, '#fff', 'stroke="#e9ecef"')).join(''),
  cahaya: () => c(50, 50, 38, '#fff9db') + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return s(`M${50 + Math.cos(a) * 14} ${50 + Math.sin(a) * 14}L${50 + Math.cos(a) * 36} ${50 + Math.sin(a) * 36}`, '#ffe066', 5); }).join('') + c(50, 50, 13, '#ffe066') + star(50, 50, 8, 3.5, '#fff'),
  kitab: () => sh(50, 88, 32) + book(20, 54, 60, 14, '#2f9e6a') + book(24, 40, 54, 14, '#2e5aac') + book(18, 26, 62, 14, '#c92a2a') + star(49, 33, 4, 2, '#ffd43b'),
  skrol: () => sh() + r(26, 22, 48, 60, 4, '#fff3bf') + c(26, 22, 6, '#e9c46a') + c(74, 22, 6, '#e9c46a') + r(20, 16, 60, 10, 5, '#d4a72c') + r(20, 78, 60, 10, 5, '#d4a72c') + [34, 44, 54, 64].map((y) => r(34, y, 32, 3, 1.5, '#e9c46a')).join(''),
  fajar: () => sky('#ffa94d', '#ffe8cc') + c(50, 74, 22, '#ffd43b') + p('M6 72H94V94H6Z', '#7a4eb0') + [...Array(5)].map((_, i) => s(`M${20 + i * 15} 46l0 -10`, '#fff3bf', 3)).join(''),
  plat: () => '',
  quran: () => sh(50, 90, 30) + r(22, 18, 56, 70, 6, '#2f9e6a') + r(27, 23, 46, 60, 4, 'none', 'stroke="#ffd43b" stroke-width="2.5"') + c(50, 53, 13, 'none', 'stroke="#ffd43b" stroke-width="2.5"') + star(50, 53, 8, 3.5, '#ffd43b') + r(22, 18, 8, 70, 3, '#1f7a50') + hl(40, 28, 10, 3, 0.25),
  masjid: () => sky('#a5d8ff', '#e7f5ff') + masjidShape(50, 90, 1),
  takbir: () => sh() + person({ top: '#ffffff', head: 'kopiah', arms: 'up', bottom: '#e9ecef' }),
  rukuk: () => sh(50, 90, 28) + `<g transform="translate(50 90)">${r(-20, -30, 8, 30, 4, '#e9ecef')}${r(-24, -38, 40, 12, 6, '#ffffff', 'stroke="#dee2e6"')}${c(22, -32, 10, SKIN)}${p('M14 -38Q22 -46 30 -38Z', '#ffffff')}${s('M6 -30L6 -10', '#ffffff', 6)}</g>`,
  sujud: () => sh(50, 90, 32) + `<g transform="translate(50 90)">${p('M-26 0Q-30 -26 -8 -24L14 -10Q20 -4 14 0Z', '#ffffff', 'stroke="#dee2e6"')}${c(22, -6, 8, SKIN)}${p('M15 -10Q22 -16 29 -9Z', '#ffffff')}${r(-4, -4, 26, 4, 2, '#c92a2a')}</g>`,
  salamsolat: () => sh() + person({ top: '#ffffff', head: 'kopiah', bottom: '#e9ecef' }) + s('M24 36Q16 30 20 22', '#fcc419', 3) + p('M18 20l4 2l-4 3z', '#fcc419') + s('M76 36Q84 30 80 22', '#fcc419', 3) + p('M82 20l-4 2l4 3z', '#fcc419'),
  kiblat: () => c(50, 52, 36, '#e7f5ff', 'stroke="#74c0fc" stroke-width="4"') + p('M50 22L58 52L50 82L42 52Z', '#ced4da') + p('M50 22L58 52H42Z', '#2f9e6a') + kaabah(50, 34, 0.32) + c(50, 52, 4, '#2b2350'),
  menara: () => sky('#ffe8cc', '#fff9db') + r(40, 34, 20, 58, 4, '#fff8e6', 'stroke="#e9d8b4"') + r(36, 46, 28, 6, 2, '#f2c14e') + p('M38 34Q50 10 62 34Z', '#2f9e6a') + moon(51, 12, 4, '#f2a922', '#fff9db') + r(46, 58, 8, 12, 4, '#a5d8ff') + s('M68 30q8 4 0 10M74 26q12 8 0 18', '#f08c00', 2.5),
  subuh: () => sky('#4c6ef5', '#ffa8a8') + c(50, 86, 16, '#ffd43b') + p('M6 82H94V94H6Z', '#364fc7') + star(24, 22, 3, 1.4, '#fff') + star(76, 18, 3, 1.4, '#fff') + moon(70, 36, 6, '#fff', '#748ffc'),
  zohor: () => sky('#4dabf7', '#d0ebff') + sun(50, 36, 14) + p('M6 82H94V94H6Z', '#69db7c'),
  asar: () => sky('#74c0fc', '#ffe8cc') + sun(68, 50, 11, '#ffc078') + p('M6 82H94V94H6Z', '#69db7c'),
  maghrib: () => sky('#f76707', '#ffc078') + c(50, 80, 18, '#ffd43b') + p('M6 80H94V94H6Z', '#862e9c'),
  isyak: () => sky('#1c2a5c', '#364fc7') + moon(56, 40, 16, '#ffe066', '#25366f') + [[22, 22], [78, 28], [30, 60], [80, 70], [60, 76]].map(([x, y]) => star(x, y, 3, 1.3, '#fff')).join(''),
  songkok: () => sh(50, 84, 30) + p('M20 74V46Q50 36 80 46V74Q50 80 20 74Z', '#26262b') + e(50, 46, 30, 6, '#3b3b44') + hl(34, 56, 6, 10, 0.12),
  telekung: () => sh() + person({ head: 'telekung', top: '#ffffff' }),
  air: () => p('M50 14C66 38 76 52 76 64A26 26 0 0 1 24 64C24 52 34 38 50 14Z', '#4dabf7') + hl(40, 60, 6, 10, 0.5) + c(56, 70, 3, '#fff', 'opacity=".5"'),
  titisair: () => [[34, 40, 0.6], [62, 30, 0.75], [50, 66, 0.9]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})">${p('M0 -22C11 -6 16 2 16 9A16 16 0 0 1 -16 9C-16 2 -11 -6 0 -22Z', '#4dabf7')}${hl(-5, 6, 4, 7, 0.5)}</g>`).join(''),
  paip: () => r(14, 24, 40, 12, 5, '#adb5bd') + r(46, 24, 14, 30, 5, '#adb5bd') + r(26, 16, 16, 8, 3, '#868e96') + hl(28, 28, 10, 2, 0.5) + p('M53 58C58 66 60 70 60 73A7 7 0 0 1 46 73C46 70 48 66 53 58Z', '#4dabf7') + p('M53 80C56 85 57 87 57 89A4 4 0 0 1 49 89C49 87 50 85 53 80Z', '#74c0fc'),
  tangan: () => sh() + hand(50, 66, 2),
  jari: () => sh() + `<g transform="translate(50 66) scale(1.9)">${r(-9, -6, 18, 22, 8, SKIN)}${r(-9, -20, 4.5, 18, 2.2, SKIN)}${r(-4.3, -24, 4.5, 20, 2.2, SKIN)}${r(0.4, -22, 4.5, 18, 2.2, SKIN)}${r(5, -17, 4.5, 14, 2.2, SKIN)}</g>` + [26, 38, 50, 62, 74].map((x, i) => c(x, 20 + Math.abs(i - 2) * 3, 0, '#000')).join(''),
  mulut: () => c(50, 50, 36, SKIN) + p('M28 50Q50 78 72 50Q50 58 28 50Z', '#c2255c') + p('M34 52Q50 58 66 52L64 55Q50 60 36 55Z', '#fff') + e(50, 64, 8, 3, '#ff8787'),
  hidung: () => c(50, 50, 36, SKIN) + p('M50 26Q44 50 38 58Q44 66 50 62Q56 66 62 58Q56 50 50 26Z', '#e9a87a') + e(44, 60, 3, 2, '#b5725a') + e(56, 60, 3, 2, '#b5725a'),
  muka: () => c(50, 52, 34, SKIN) + p('M16 46Q18 14 50 14Q82 14 84 46Q70 30 50 32Q28 30 16 46Z', '#3b2a1e') + c(38, 50, 4, '#2b2350') + c(62, 50, 4, '#2b2350') + s('M40 66Q50 74 60 66', '#c2255c', 3) + c(30, 62, 5, '#ff9aa2', 'opacity=".6"') + c(70, 62, 5, '#ff9aa2', 'opacity=".6"'),
  kepala: () => c(50, 54, 30, SKIN) + p('M20 52Q18 18 50 18Q82 18 80 52Q72 32 50 32Q30 32 20 52Z', '#3b2a1e') + c(40, 56, 3, '#2b2350') + c(60, 56, 3, '#2b2350') + s('M43 68Q50 73 57 68', '#c2255c', 2.5) + s('M18 18Q50 -2 82 18', '#fcc419', 3, 'stroke-dasharray="2 6"'),
  telinga: () => p('M42 18Q78 14 76 46Q74 66 56 70Q52 84 40 82Q34 74 44 66Q30 48 42 18Z', SKIN) + s('M50 32Q66 30 64 46Q62 56 52 58', '#e9a87a', 4),
  kaki: () => sh(50, 88, 34) + p('M24 30Q22 60 24 80Q26 90 46 88Q52 86 48 78Q40 66 40 30Z', SKIN) + p('M60 30Q58 60 60 80Q62 90 82 88Q88 86 84 78Q76 66 76 30Z', SKIN) + [...Array(3)].map((_, i) => c(30 + i * 5, 92, 0, '#000')).join(''),
  siku: () => sh() + s('M22 30L50 64L82 44', SKIN, 16) + c(50, 64, 10, '#e9a87a') + hand(84, 40, 0.8, 60),
  bersih: () => sh() + r(46, 12, 8, 50, 3, '#c47a3a') + p('M30 62H70L76 90H24Z', '#ffd43b') + [32, 40, 48, 56, 64].map((x) => s(`M${x} 66L${x - 2} 88`, '#e0a800', 2)).join('') + [[24, 30], [76, 26], [80, 50]].map(([x, y]) => star(x, y, 5, 2, '#74c0fc')).join(''),
  makan: () => plate(66) + e(50, 58, 20, 9, '#fff') + c(42, 54, 4, '#f08c00') + c(56, 56, 4, '#37b24d') + s('M22 40V72M18 40V50Q22 54 26 50V40', '#adb5bd', 2.5) + s('M80 40V72', '#adb5bd', 3) + e(80, 44, 4, 7, '#adb5bd'),
  katil: () => sh(50, 88, 38) + r(14, 50, 72, 26, 6, '#748ffc') + r(14, 40, 14, 42, 4, '#c47a3a') + r(72, 52, 14, 30, 4, '#c47a3a') + r(26, 44, 22, 12, 6, '#fff') + moon(70, 24, 9, '#ffd43b') + t(84, 22, 'z', 10, '#748ffc') + t(90, 14, 'z', 7, '#748ffc'),
  jamloceng: () => sh() + c(50, 54, 30, '#ff6b6b') + c(50, 54, 24, '#fff') + s('M50 54V38M50 54L60 60', '#2b2350', 3) + c(30, 26, 9, '#ffd43b') + c(70, 26, 9, '#ffd43b') + s('M34 82L28 90M66 82L72 90', '#2b2350', 4) + s('M14 30q-6 6 0 12M86 30q6 6 0 12', '#f08c00', 2.5),
  tandas: () => sh(50, 90, 30) + r(26, 12, 48, 78, 4, '#c47a3a') + r(30, 16, 40, 70, 3, '#e0a26a') + c(62, 54, 3, '#f2a922') + r(36, 24, 28, 16, 3, '#fff') + `<g transform="translate(43 32) scale(.35)">${c(0, -10, 5, '#2b2350')}${r(-5, -4, 10, 16, 4, '#2b2350')}</g><g transform="translate(57 32) scale(.35)">${c(0, -10, 5, '#2b2350')}${p('M-7 12L0 -4L7 12Z', '#2b2350')}</g>`,
  ibu: () => person({ head: 'hijab', hijab: '#f783ac', top: '#e64980', k: 1.15 }),
  ayah: () => person({ head: 'songkok', top: '#2e5aac', k: 1.15, beard: null }),
  abang: () => person({ head: 'hair', top: '#37b24d', k: 1.05 }),
  kakak: () => person({ head: 'hijab', hijab: '#b197fc', top: '#845ef7', k: 1.05 }),
  adik: () => person({ head: 'hair', top: '#ffa94d', k: 0.82, arms: 'wave' }),
  nenek: () => person({ head: 'hijab', hijab: '#ced4da', top: '#ae3ec9', glasses: true, k: 1.1 }),
  datuk: () => person({ head: 'kopiah', top: '#868e96', glasses: true, beard: '#e9ecef', k: 1.1 }),
  bayi: () => sh(50, 86, 26) + e(50, 64, 24, 20, '#fff3bf') + c(50, 40, 16, SKIN) + c(45, 40, 1.8, '#2b2350') + c(55, 40, 1.8, '#2b2350') + s('M46 46Q50 49 54 46', '#c2255c', 1.6) + s('M50 22q4 -4 2 -8', '#3b2a1e', 2) + c(50, 60, 4, '#74c0fc'),
  keluarga: () => person({ x: 26, head: 'songkok', top: '#2e5aac', k: 0.95 }) + person({ x: 74, head: 'hijab', hijab: '#f783ac', top: '#e64980', k: 0.9 }) + person({ x: 50, head: 'hair', top: '#ffa94d', k: 0.62 }) + heart(50, 18, 0.35, '#ff6b6b'),
  buku: () => sh(50, 88, 32) + p('M50 30Q34 22 16 26V80Q34 76 50 84Z', '#4dabf7') + p('M50 30Q66 22 84 26V80Q66 76 50 84Z', '#74c0fc') + p('M50 34Q36 28 22 31V74Q36 71 50 78Z', '#fff') + p('M50 34Q64 28 78 31V74Q64 71 50 78Z', '#f8f9fa') + [44, 52, 60].map((y) => s(`M28 ${y}Q38 ${y - 2} 46 ${y + 2}M54 ${y + 2}Q62 ${y - 2} 72 ${y}`, '#ced4da', 2)).join(''),
  rumah: () => sh(50, 90, 36) + r(24, 48, 52, 40, 3, '#ffe8cc') + p('M14 52L50 20L86 52Z', '#e8590c') + r(42, 64, 16, 24, 3, '#a85d22') + r(28, 56, 10, 10, 2, '#a5d8ff') + r(62, 56, 10, 10, 2, '#a5d8ff') + r(28, 86, 52, 6, 2, '#8a5d36'),
  pintu: () => sh(50, 92, 28) + r(26, 10, 48, 82, 5, '#a85d22') + r(31, 16, 38, 30, 3, '#c47a3a') + r(31, 52, 38, 34, 3, '#c47a3a') + c(64, 54, 3.5, '#ffd43b'),
  lampu: () => p('M50 14A24 24 0 0 1 64 58V66H36V58A24 24 0 0 1 50 14Z', '#ffe066') + hl(42, 30, 6, 9, 0.6) + r(36, 66, 28, 8, 3, '#adb5bd') + r(39, 74, 22, 8, 3, '#868e96') + [...Array(5)].map((_, i) => { const a = Math.PI + i * Math.PI / 4; return s(`M${50 + Math.cos(a) * 30} ${38 + Math.sin(a) * 30}L${50 + Math.cos(a) * 38} ${38 + Math.sin(a) * 38}`, '#fcc419', 3.5); }).join(''),
  salaman: () => person({ x: 26, head: 'songkok', top: '#4dabf7', k: 0.95, arms: 'front' }) + person({ x: 74, head: 'kopiah', top: '#69db7c', k: 0.95, arms: 'front' }) + hand(50, 66, 0.7, 90) + heart(50, 24, 0.35, '#ff6b6b'),
  senyum: () => c(50, 50, 38, '#ffd43b') + c(38, 42, 5, '#2b2350') + c(62, 42, 5, '#2b2350') + p('M30 56Q50 82 70 56Q50 66 30 56Z', '#c2255c') + c(28, 58, 6, '#ff8787', 'opacity=".6"') + c(72, 58, 6, '#ff8787', 'opacity=".6"') + hl(36, 26, 10, 4, 0.5),
  sopan: () => person({ x: 32, head: 'hijab', hijab: '#ced4da', top: '#ae3ec9', glasses: true, k: 1 }) + person({ x: 70, head: 'hair', top: '#4dabf7', k: 0.8, arms: 'front' }) + heart(52, 24, 0.3, '#ff6b6b'),
  hormat: () => person({ x: 30, head: 'kopiah', top: '#868e96', beard: '#e9ecef', glasses: true, k: 1 }) + person({ x: 70, head: 'songkok', top: '#4dabf7', k: 0.8, arms: 'front' }) + star(50, 22, 5, 2, '#ffd43b'),
  tolong: () => person({ x: 30, head: 'hair', top: '#69db7c', k: 0.9, arms: 'front' }) + r(46, 50, 26, 20, 4, '#c47a3a') + person({ x: 76, head: 'hijab', hijab: '#ffa8a8', top: '#ff6b6b', k: 0.8, arms: 'front' }) + heart(52, 30, 0.3, '#ff6b6b'),
  maaf: () => person({ x: 34, head: 'hair', top: '#4dabf7', k: 0.95, mouth: 'sad', arms: 'front' }) + person({ x: 72, head: 'hijab', hijab: '#ffc078', top: '#ff922b', k: 0.85 }) + heart(52, 24, 0.35, '#f783ac'),
  sabar: () => sh() + r(30, 14, 40, 6, 3, '#c47a3a') + r(30, 82, 40, 6, 3, '#c47a3a') + p('M34 20H66Q66 40 52 50Q66 60 66 82H34Q34 60 48 50Q34 40 34 20Z', '#e7f5ff', 'stroke="#a5d8ff" stroke-width="2"') + p('M40 32H60Q58 42 50 46Q42 42 40 32Z', '#ffd43b') + p('M38 80H62Q60 66 50 62Q40 66 38 80Z', '#ffd43b'),
  kongsi: () => sh() + c(34, 54, 20, '#d9a066') + c(66, 54, 20, '#d9a066') + p('M50 34L46 54L52 74', 'none', 'stroke="#fff" stroke-width="6"') + [[28, 48], [36, 60], [70, 46], [62, 62], [74, 58]].map(([x, y]) => c(x, y, 3, '#5b3d22')).join('') + heart(50, 20, 0.3, '#ff6b6b'),
  iqra: () => sh(50, 90, 30) + r(22, 18, 56, 70, 6, '#ff922b') + r(27, 24, 46, 58, 4, '#fff4e6') + t(50, 62, 'اقرأ', 22, '#e8590c', 'font-family="Amiri, Noto Naskh Arabic, serif"') + r(22, 18, 8, 70, 3, '#e8590c'),
  mualim: () => person({ head: 'kopiah', top: '#2f9e6a', k: 1.05, arms: 'front' }) + book(36, 62, 28, 10, '#f2a922'),
  mimbar: () => sh(50, 92, 30) + r(22, 30, 40, 60, 4, '#a85d22') + r(26, 36, 32, 50, 3, '#c47a3a') + p('M22 30Q42 14 62 30Z', '#2f9e6a') + [...Array(5)].map((_, i) => r(62, 80 - i * 10, 18 - i * 2, 10, 2, '#8a5d36')).join(''),
  kubah: () => sky('#a5d8ff', '#e7f5ff') + r(20, 64, 60, 26, 4, '#fff8e6') + p('M22 64Q22 22 50 18Q78 22 78 64Z', '#ffd43b') + hl(38, 36, 6, 12, 0.5) + r(48, 6, 4, 14, 2, '#f2a922') + moon(51, 6, 4, '#f2a922', '#bde0fb'),
  rihal: () => sh(50, 90, 32) + p('M20 86L80 40M80 86L20 40', 'none', 'stroke="#a85d22" stroke-width="8" stroke-linecap="round"') + p('M18 40L50 56L82 40L50 30Z', '#2f9e6a') + p('M50 56L50 30', 'none', 'stroke="#ffd43b" stroke-width="2"'),
  tasbih: () => [...Array(16)].map((_, i) => { const a = i * Math.PI / 8; return c(50 + Math.cos(a) * 26, 44 + Math.sin(a) * 26, 5, i % 4 ? '#a85d22' : '#2f9e6a') + hl(48 + Math.cos(a) * 26, 42 + Math.sin(a) * 26, 1.6, 1, 0.6); }).join('') + r(47, 70, 6, 14, 3, '#2f9e6a') + c(50, 88, 4, '#f2a922'),
  imam: () => person({ head: 'serban', top: '#ffffff', beard: '#3b2a1e', k: 1.1 }) + masjidShape(84, 40, 0.3),
  nabi: () => '',
  bahtera: () => sky('#74c0fc', '#d0ebff') + p('M6 72Q20 66 30 72T54 72T78 72T94 72V94H6Z', '#1c7ed6') + p('M18 58H82L72 74H28Z', '#a85d22') + r(30, 40, 40, 18, 3, '#c47a3a') + p('M26 40L50 26L74 40Z', '#8a5d36') + r(36, 46, 6, 6, 1, '#ffe066') + r(58, 46, 6, 6, 1, '#ffe066'),
  laut: () => sky('#4dabf7', '#a5d8ff') + sun(76, 24, 8) + [60, 70, 80].map((y, i) => p(`M6 ${y}Q20 ${y - 6} 34 ${y}T62 ${y}T94 ${y}V94H6Z`, ['#339af0', '#228be6', '#1971c2'][i])).join(''),
  tongkat: () => sh(50, 92, 20) + s('M56 90L44 24', '#8a5d36', 7) + s('M44 24Q40 12 50 10Q60 10 58 20', '#8a5d36', 7) + hl(46, 50, 2, 10, 0.3),
  ikanpaus: () => sky('#74c0fc', '#1c7ed6') + p('M6 34Q20 28 34 34T62 34T94 34V94H6Z', '#1971c2', 'opacity=".6"') + `<g transform="translate(48 62)">${p('M28 0L44 -14L40 0L44 14Z', '#495057')}${e(0, 0, 32, 18, '#5c7cfa')}${e(0, 8, 26, 9, '#dbe4ff')}${c(-18, -4, 3, '#2b2350')}${hl(-6, -10, 10, 3, 0.4)}</g>`,
  api: () => p('M50 10C62 30 78 40 74 64A24 24 0 0 1 26 64C24 48 36 42 38 28C44 38 48 40 50 10Z', '#ff6b6b') + p('M50 34C58 48 64 56 62 68A12 12 0 0 1 38 68C38 58 46 54 50 34Z', '#ffd43b') + sh(50, 92, 22),
  unta: () => sky('#ffe8cc', '#fff4e6') + p('M6 82Q50 70 94 82V94H6Z', '#f2c14e') + `<g transform="translate(50 78)">${r(-24, -6, 5, 18, 2, '#c47a3a')}${r(-12, -6, 5, 18, 2, '#c47a3a')}${r(6, -6, 5, 18, 2, '#c47a3a')}${r(16, -6, 5, 18, 2, '#c47a3a')}${p('M-28 -4Q-30 -26 -14 -24Q-8 -40 0 -24Q8 -40 16 -24Q24 -24 24 -4Z', '#d9a066')}${s('M22 -14Q32 -24 32 -40', '#d9a066', 7)}${e(36, -42, 7, 5, '#d9a066')}${c(37, -44, 1.3, '#2b2350')}</g>`,
  bintang: () => c(50, 50, 38, '#25366f') + star(50, 50, 22, 9, '#ffd43b') + hl(44, 40, 5, 2.5, 0.6) + star(24, 26, 4, 1.6, '#fff') + star(76, 72, 4, 1.6, '#fff'),
  madinah: () => sky('#a5d8ff', '#e7f5ff') + r(16, 60, 68, 30, 3, '#fff8e6') + p('M40 60Q40 32 54 30Q68 32 68 60Z', '#2f9e6a') + hl(50, 44, 3, 7, 0.4) + r(22, 30, 8, 30, 2, '#fff8e6') + p('M20 30L26 18L32 30Z', '#ffd43b') + r(74, 30, 8, 30, 2, '#fff8e6') + p('M72 30L78 18L84 30Z', '#ffd43b'),
  semut: () => sh(50, 76, 30) + c(30, 60, 9, '#495057') + c(48, 58, 7, '#495057') + c(66, 54, 10, '#495057') + c(70, 50, 2, '#fff') + s('M70 44Q74 30 82 30M66 44Q62 30 56 28', '#495057', 2) + s('M28 66L22 76M34 68L34 78M46 64L44 76M50 64L54 76M30 54L22 46M48 52L46 44', '#495057', 2),
  gua: () => sky('#ffe8cc', '#fff4e6') + p('M6 92Q10 30 50 24Q90 30 94 92Z', '#a68a64') + p('M30 92Q32 56 50 52Q68 56 70 92Z', '#3b2a1e') + p('M10 92Q30 84 50 88Q70 84 90 92', 'none', 'stroke="#69db7c" stroke-width="5"'),
  bulan: () => c(50, 50, 38, '#25366f') + moon(46, 50, 24, '#ffe066', '#25366f') + star(72, 32, 4, 1.6, '#fff') + star(74, 70, 3, 1.3, '#fff'),
  kurma: () => sh(50, 84, 34) + [[30, 60, -20], [50, 54, 0], [70, 60, 20], [40, 72, -10], [62, 72, 10]].map(([x, y, a]) => e(x, y, 8, 13, '#8a3c1e', `transform="rotate(${a} ${x} ${y})"`) + hl(x - 2, y - 5, 2, 4, 0.4)).join(''),
  susu: () => sh(50, 90, 22) + p('M34 30H66V84Q66 90 60 90H40Q34 90 34 84Z', '#fff', 'stroke="#ced4da" stroke-width="2"') + p('M36 22H64L66 30H34Z', '#4dabf7') + r(40, 44, 20, 20, 4, '#4dabf7') + c(50, 54, 5, '#fff') + hl(40, 70, 2, 8, 0.6),
  madu: () => sh(50, 90, 26) + p('M30 34H70V80Q70 90 60 90H40Q30 90 30 80Z', '#ffa94d') + r(28, 26, 44, 10, 4, '#c47a3a') + r(36, 50, 28, 20, 4, '#fff4e6') + `<g transform="translate(50 60) scale(.6)">${p('M0 -10L9 -5V5L0 10L-9 5V-5Z', '#ffd43b')}</g>` + hl(36, 44, 3, 8, 0.4),
  roti: () => sh(50, 88, 32) + p('M20 50Q20 26 50 26Q80 26 80 50V84H20Z', '#e0a26a') + p('M26 50Q26 34 50 34Q74 34 74 50V80H26Z', '#ffe8cc') + hl(36, 34, 8, 3, 0.4),
  buah: () => sh(50, 88, 34) + p('M20 60Q50 92 80 60Z', '#c47a3a') + c(36, 54, 10, '#ff6b6b') + c(52, 50, 10, '#ffa94d') + c(66, 56, 9, '#69db7c') + e(48, 62, 16, 5, '#ffd43b', 'transform="rotate(-15 48 62)"') + s('M52 40q2 -6 6 -8', '#2f9e6a', 2.5),
  ikan: () => sh(50, 82, 30) + fish(46, 54, 1.5, '#ff922b'),
  zaitun: () => s('M14 80Q50 50 86 26', '#5c940d', 3) + [[30, 66, -40], [46, 54, 30], [60, 44, -40], [74, 34, 30]].map(([x, y, a]) => e(x, y, 9, 4, '#82c91e', `transform="rotate(${a} ${x} ${y})"`)).join('') + [[38, 70], [56, 58], [70, 50]].map(([x, y]) => e(x, y, 6, 8, '#5c940d') + hl(x - 2, y - 3, 1.5, 2.5, 0.5)).join(''),
  nasi: () => plate(70) + p('M28 64Q30 40 50 38Q70 40 72 64Z', '#fff', 'stroke="#e9ecef"') + [...Array(10)].map((_, i) => e(34 + (i % 5) * 8, 52 + Math.floor(i / 5) * 6, 2.5, 1.2, '#e9ecef')).join(''),
  telur: () => sh(50, 88, 26) + e(50, 54, 24, 32, '#fff4e6', 'stroke="#ffe8cc" stroke-width="2"') + hl(42, 38, 6, 10, 0.7),
  ayam: () => sh(50, 90, 28) + c(46, 60, 22, '#fff') + c(66, 38, 12, '#fff') + p('M60 26Q64 18 68 26Q72 18 76 28Z', '#f03e3e') + p('M77 38L86 41L77 44Z', '#fcc419') + c(69, 36, 2, '#2b2350') + p('M28 52Q14 40 24 62Z', '#ffe8cc') + s('M42 82V90M52 82V90', '#fcc419', 3),
  epal: () => sh(50, 88, 26) + c(40, 56, 22, '#f03e3e') + c(60, 56, 22, '#f03e3e') + s('M50 36Q50 26 56 20', '#8a5d36', 4) + e(62, 26, 9, 5, '#37b24d', 'transform="rotate(-30 62 26)"') + hl(36, 46, 6, 9, 0.5),
  pisang: () => sh(50, 84, 30) + p('M20 40Q30 80 78 70Q84 66 80 62Q40 70 30 36Z', '#ffd43b') + p('M28 36Q48 70 82 56Q86 52 82 48Q48 62 36 32Z', '#fcc419') + r(24, 30, 10, 8, 3, '#8a5d36'),
  halal: () => c(50, 50, 36, '#2f9e6a') + c(50, 50, 30, '#fff') + star(50, 30, 6, 2.5, '#2f9e6a') + t(50, 56, 'حلال', 18, '#2f9e6a', 'font-family="Amiri, Noto Naskh Arabic, serif"') + t(50, 72, 'HALAL', 10, '#2f9e6a'),
  tangankanan: () => sh() + hand(56, 66, 1.8, 10) + s('M18 30H38M30 22L38 30L30 38', '#2f9e6a', 5),
  matahari: () => sky('#74c0fc', '#d0ebff') + sun(50, 48, 18),
  langit: () => sky('#4dabf7', '#e7f5ff') + cloud(30, 40, 0.9) + cloud(70, 62, 1.1) + p('M20 20l8 3-8 3z', '#fff', 'opacity=".0"'),
  gunung: () => sky('#a5d8ff', '#e7f5ff') + p('M6 90L38 30L70 90Z', '#868e96') + p('M38 30L30 46L38 42L46 48Z', '#fff') + p('M40 90L66 44L94 90Z', '#adb5bd') + p('M66 44L60 56L66 52L72 58Z', '#fff'),
  hujan: () => sky('#a5d8ff', '#dbe4ff') + cloud(50, 36, 1.4, '#adb5bd') + [[30, 60], [44, 70], [58, 62], [72, 72], [38, 82], [64, 84]].map(([x, y]) => p(`M${x} ${y - 6}C${x + 4} ${y} ${x + 4} ${y + 2} ${x} ${y + 4}C${x - 4} ${y + 2} ${x - 4} ${y} ${x} ${y - 6}Z`, '#4dabf7')).join(''),
  pokok: () => sh(50, 90, 30) + tree(50, 90, 1.6),
  bunga: () => sh(50, 90, 20) + s('M50 90V50', '#37b24d', 5) + e(40, 74, 10, 5, '#37b24d', 'transform="rotate(-30 40 74)"') + [...Array(6)].map((_, i) => { const a = i * Math.PI / 3; return c(50 + Math.cos(a) * 14, 38 + Math.sin(a) * 14, 10, '#f783ac'); }).join('') + c(50, 38, 9, '#ffd43b'),
  burung: () => sky('#a5d8ff', '#e7f5ff') + `<g transform="translate(50 52)">${e(0, 0, 22, 16, '#4dabf7')}${p('M-4 -4Q-24 -26 -26 -4Z', '#1c7ed6')}${c(16, -10, 10, '#4dabf7')}${p('M25 -12L34 -9L25 -6Z', '#fcc419')}${c(18, -12, 2, '#2b2350')}${p('M-20 2L-34 -2L-30 10Z', '#1c7ed6')}</g>`,
  awan: () => sky('#4dabf7', '#a5d8ff') + cloud(50, 50, 2) + hl(40, 42, 10, 3, 0.6),
  pelangi: () => sky('#a5d8ff', '#e7f5ff') + ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'].map((col, i) => s(`M${16 + i * 4} 84A${34 - i * 4} ${34 - i * 4} 0 0 1 ${84 - i * 4} 84`, col, 4.5)).join('') + cloud(20, 80, 0.6) + cloud(80, 80, 0.6),
  sungai: () => sky('#a5d8ff', '#e7f5ff') + p('M6 50H94V94H6Z', '#69db7c') + p('M40 50Q60 62 44 72Q28 84 56 94H80Q56 84 66 72Q80 60 54 50Z', '#4dabf7') + tree(20, 66, 0.6) + tree(84, 74, 0.6),
  bumi: () => c(50, 50, 36, '#4dabf7') + p('M30 26Q40 22 44 32Q40 44 30 40Q22 34 30 26ZM58 44Q70 40 76 50Q72 66 60 62Q52 54 58 44ZM36 62Q44 60 46 70Q40 78 34 72Z', '#69db7c') + hl(36, 30, 8, 4, 0.5),
  ramadan: () => c(50, 50, 38, '#2b1b6b') + moon(40, 46, 20, '#ffd43b', '#2b1b6b') + `<g transform="translate(68 40)">${s('M0 -26V-14', '#f2a922', 2)}${p('M-9 -14H9L11 6Q0 14 -11 6Z', '#ff922b')}${r(-6, -8, 12, 10, 3, '#ffe066')}${r(-10, 6, 20, 4, 2, '#f2a922')}</g>` + star(24, 74, 3, 1.4, '#fff') + star(78, 78, 3, 1.4, '#fff'),
  sahur: () => c(50, 50, 38, '#25366f') + moon(70, 26, 8, '#ffe066', '#25366f') + e(50, 70, 28, 8, '#dee2e6') + e(50, 68, 22, 6, '#fff') + p('M34 66Q36 54 50 52Q64 54 66 66Z', '#fff') + c(62, 60, 4, '#ff922b') + star(22, 34, 3, 1.4, '#fff'),
  iftar: () => sky('#ff922b', '#ffd8a8') + c(50, 54, 12, '#ffd43b') + plate(74) + [[38, 68], [50, 66], [62, 68]].map(([x, y]) => e(x, y, 4, 6, '#8a3c1e')).join(''),
  tarawih: () => sky('#1c2a5c', '#364fc7') + masjidShape(50, 90, 0.9, '#5c940d') + star(20, 20, 3, 1.4, '#fff') + star(80, 16, 3, 1.4, '#fff') + moon(78, 30, 5, '#ffe066', '#2a3c86'),
  sedekah: () => sh() + hand(36, 74, 1.1, 20) + hand(66, 66, 1.1, -160) + c(52, 54, 8, '#f2c14e') + c(52, 54, 5, '#ffd43b') + heart(50, 24, 0.35, '#ff6b6b'),
  ketupat: () => [[38, 52], [62, 52]].map(([x, y]) => `<g transform="translate(${x} ${y}) rotate(45)">${r(-14, -14, 28, 28, 3, '#8ce99a')}${s('M-14 -5H14M-14 5H14M-5 -14V14M5 -14V14', '#2f9e6a', 2.5)}</g>`).join('') + s('M38 32Q50 12 62 32', '#2f9e6a', 3) + star(50, 84, 4, 2, '#ffd43b'),
  pelita: () => sh(50, 90, 26) + p('M30 70Q30 86 50 86Q70 86 70 70Z', '#c47a3a') + r(46, 54, 8, 16, 3, '#adb5bd') + p('M50 26C58 38 60 44 58 50A8 8 0 0 1 42 50C40 44 42 38 50 26Z', '#ff922b') + p('M50 36C54 42 55 46 54 49A4 4 0 0 1 46 49C45 46 46 42 50 36Z', '#ffe066') + c(50, 42, 22, '#ffe066', 'opacity=".2"'),
  // ======== KOSA KATA TAMBAHAN ========
  satu: () => t(50, 74, '1', 72, '#2f9e6a', 'stroke="#fff" stroke-width="4" paint-order="stroke"') + star(78, 22, 6, 2.5, '#ffd43b'),
  dua: () => t(50, 74, '2', 72, '#e8590c', 'stroke="#fff" stroke-width="4" paint-order="stroke"') + star(78, 22, 6, 2.5, '#ffd43b'),
  tiga: () => t(50, 74, '3', 72, '#1c7ed6', 'stroke="#fff" stroke-width="4" paint-order="stroke"') + star(78, 22, 6, 2.5, '#ffd43b'),
  muslim: () => person({ head: 'kopiah', top: '#37b24d', k: 1.15, arms: 'wave' }) + moon(80, 22, 7, '#ffd43b', '#fff'),
  pahala: () => sh(50, 90, 26) + p('M30 40Q30 30 50 30Q70 30 70 40L74 82Q74 90 50 90Q26 90 26 82Z', '#a5d8ff', 'opacity=".7"') + r(34, 22, 32, 10, 4, '#74c0fc') + [[42, 70], [58, 64], [48, 52], [60, 80], [38, 82]].map(([x, y]) => star(x, y, 7, 3, '#ffd43b')).join(''),
  cinta: () => sh(50, 88, 30) + heart(38, 50, 1, '#ff6b6b') + heart(62, 50, 1, '#f783ac') + hl(30, 40, 5, 2.5, 0.6),
  wang: () => sh(50, 84, 34) + r(18, 34, 64, 36, 5, '#69db7c') + r(22, 38, 56, 28, 3, 'none', 'stroke="#2f9e6a" stroke-width="2"') + c(50, 52, 9, '#2f9e6a') + t(50, 56, 'RM', 9, '#fff') + r(26, 28, 64, 36, 5, '#8ce99a', 'opacity=".55"'),
  syiling: () => sh(50, 86, 30) + [[36, 64], [60, 58], [48, 40]].map(([x, y]) => c(x, y, 16, '#e8a10b') + c(x, y, 12, '#ffd43b') + t(x, y + 4, '¢', 12, '#c99512')).join(''),
  tawaf: () => kaabah(50, 70, 0.7) + s('M18 70A32 14 0 1 0 82 70', '#4dabf7', 3, 'stroke-dasharray="6 6"') + p('M80 66l6 4l-7 3z', '#4dabf7') + [24, 40, 60, 76].map((x) => c(x, 84, 3.5, '#fff', 'stroke="#ced4da"')).join(''),
  arafah: () => sky('#ffe8cc', '#fff4e6') + sun(74, 24, 8) + p('M10 84Q50 30 90 84Z', '#d9a066') + r(46, 40, 8, 12, 2, '#fff') + [20, 34, 66, 80].map((x) => p(`M${x - 6} 90L${x} 80L${x + 6} 90Z`, '#fff', 'stroke="#ced4da"')).join(''),
  khemah: () => sh(50, 90, 36) + p('M12 88L50 24L88 88Z', '#fff', 'stroke="#dee2e6" stroke-width="2"') + p('M50 24L40 88H60Z', '#e7f5ff') + p('M44 88L50 64L56 88Z', '#adb5bd') + s('M50 24V14', '#868e96', 3) + p('M50 14L60 18L50 22Z', '#2f9e6a'),
  zamzam: () => sh(50, 90, 22) + p('M36 30H64V84Q64 90 58 90H42Q36 90 36 84Z', '#e7f5ff', 'stroke="#74c0fc" stroke-width="2"') + r(40, 18, 20, 12, 3, '#2f9e6a') + p('M38 56Q50 50 62 56V84Q62 88 58 88H42Q38 88 38 84Z', '#74c0fc') + hl(42, 66, 2, 9, 0.6),
  jemaah: () => person({ x: 22, head: 'kopiah', top: '#fff', k: 0.75, bottom: '#e9ecef' }) + person({ x: 50, head: 'kopiah', top: '#fff', k: 0.75, bottom: '#e9ecef' }) + person({ x: 78, head: 'kopiah', top: '#fff', k: 0.75, bottom: '#e9ecef' }) + r(8, 90, 84, 4, 2, '#c92a2a'),
  miskin: () => sh() + person({ head: 'hair', top: '#adb5bd', k: 1, arms: 'front' }) + e(50, 74, 14, 5, '#c47a3a') + heart(80, 26, 0.3, '#ff6b6b'),
  hilal: () => c(50, 50, 38, '#ff922b') + c(50, 50, 38, '#ffc078', 'opacity=".5"') + moon(52, 44, 14, '#fff9db', '#ffa94d') + p('M12 76Q50 62 88 76V88H12Z', '#862e9c', 'opacity=".7"'),
  kopiah: () => sh(50, 80, 30) + p('M20 72Q20 34 50 32Q80 34 80 72Z', '#fff', 'stroke="#dee2e6" stroke-width="2"') + [44, 52, 60].map((y) => s(`M24 ${y}Q50 ${y - 8} 76 ${y}`, '#e9ecef', 2)).join('') + r(18, 68, 64, 8, 4, '#f1f3f5'),
  serban: () => sh(50, 80, 30) + e(50, 58, 32, 18, '#fff', 'stroke="#dee2e6" stroke-width="2"') + s('M20 56Q50 40 80 56M22 64Q50 50 78 64', '#e9ecef', 3) + e(50, 44, 16, 10, '#f1f3f5'),
  kain: () => sh(50, 90, 26) + p('M28 18H72L76 88H24Z', '#2e5aac') + [30, 44, 58, 72].map((y) => r(26, y, 48, 5, 1, '#748ffc')).join('') + [36, 50, 64].map((x) => r(x, 18, 4, 70, 1, '#5c7cfa', 'opacity=".6"')).join(''),
  jubah: () => sh() + p('M34 22Q50 16 66 22L78 40L70 46L68 90H32L30 46L22 40Z', '#fff', 'stroke="#dee2e6" stroke-width="2"') + s('M50 22V54', '#dee2e6', 2) + c(50, 30, 1.5, '#adb5bd') + c(50, 38, 1.5, '#adb5bd'),
  saf: () => r(10, 22, 80, 18, 6, '#c92a2a') + r(10, 46, 80, 18, 6, '#c92a2a') + r(10, 70, 80, 18, 6, '#c92a2a') + [16, 40, 64].map((y) => [20, 40, 60, 80].map((x) => e(x, y + 9, 4, 2, '#ffd43b')).join('')).join(''),
  duduk: () => sh(50, 90, 30) + `<g transform="translate(50 90)">${p('M-20 0Q-24 -14 -6 -14H16Q22 -14 22 0Z', '#fff', 'stroke="#dee2e6"')}${r(-12, -46, 24, 34, 10, '#fff', 'stroke="#dee2e6"')}${c(0, -56, 11, SKIN)}${p('M-11 -58Q0 -70 11 -58Z', '#fff')}${c(-4, -57, 1.4, '#2b2350')}${c(4, -57, 1.4, '#2b2350')}${r(4, -30, 16, 5, 2, SKIN)}</g>`,
  lengan: () => sh() + s('M16 66H60', SKIN, 16) + s('M60 66L82 40', SKIN, 14) + c(84, 36, 8, SKIN) + s('M24 58q10 -6 20 0', '#e9a87a', 2),
  rambut: () => c(50, 58, 28, SKIN) + p('M18 58Q14 16 50 14Q86 16 82 58Q78 34 62 30Q50 40 36 30Q22 36 18 58Z', '#3b2a1e') + c(40, 60, 3, '#2b2350') + c(60, 60, 3, '#2b2350') + s('M44 72Q50 76 56 72', '#c2255c', 2.5),
  dahi: () => c(50, 54, 32, SKIN) + p('M18 46Q20 16 50 16Q80 16 82 46Q70 34 50 34Q30 34 18 46Z', '#3b2a1e') + e(50, 42, 16, 6, '#ffe066', 'opacity=".6"') + c(40, 58, 3, '#2b2350') + c(60, 58, 3, '#2b2350') + s('M44 70Q50 74 56 70', '#c2255c', 2.5),
  dagu: () => c(50, 46, 32, SKIN) + p('M18 40Q20 10 50 10Q80 10 82 40Q70 26 50 26Q30 26 18 40Z', '#3b2a1e') + c(40, 46, 3, '#2b2350') + c(60, 46, 3, '#2b2350') + s('M44 58Q50 62 56 58', '#c2255c', 2.5) + e(50, 74, 10, 5, '#ffe066', 'opacity=".7"'),
  mata: () => e(50, 50, 38, 24, '#fff', 'stroke="#2b2350" stroke-width="3"') + c(50, 50, 16, '#4dabf7') + c(50, 50, 8, '#2b2350') + c(45, 45, 4, '#fff') + s('M14 36Q50 6 86 36', '#2b2350', 3),
  gigi: () => p('M24 26Q50 14 76 26Q80 52 68 82Q62 90 58 72Q50 60 42 72Q38 90 32 82Q20 52 24 26Z', '#fff', 'stroke="#ced4da" stroke-width="3"') + hl(38, 36, 6, 4, 0.9) + star(78, 20, 5, 2, '#74c0fc'),
  kuku: () => sh() + hand(50, 66, 2) + [[-3.4, -23], [1.4, -21]].map(([x, y]) => '').join('') + [[33, 26], [42, 18], [52, 22], [61, 32]].map(([x, y]) => e(x, y, 3.2, 2.6, '#fff', 'opacity=".9"')).join(''),
  tuala: () => sh(50, 90, 30) + r(18, 22, 64, 66, 8, '#74c0fc') + r(18, 70, 64, 8, 0, '#4dabf7') + r(18, 30, 64, 4, 0, '#a5d8ff') + r(30, 16, 40, 10, 5, '#adb5bd'),
  sabun: () => sh(50, 84, 30) + r(22, 46, 56, 34, 12, '#f783ac') + hl(36, 54, 8, 3, 0.6) + c(30, 34, 7, '#fff', 'opacity=".9" stroke="#e7f5ff"') + c(46, 26, 9, '#fff', 'opacity=".9" stroke="#e7f5ff"') + c(64, 32, 6, '#fff', 'opacity=".9" stroke="#e7f5ff"'),
  sinki: () => r(14, 50, 72, 26, 10, '#e9ecef', 'stroke="#ced4da" stroke-width="2"') + e(50, 56, 28, 8, '#a5d8ff') + r(44, 76, 12, 16, 3, '#ced4da') + r(46, 26, 8, 22, 3, '#adb5bd') + r(46, 24, 20, 8, 3, '#adb5bd') + p('M62 34C64 38 65 40 65 42A3 3 0 0 1 59 42C59 40 60 38 62 34Z', '#4dabf7'),
  timba: () => sh(50, 90, 26) + p('M26 40H74L68 88H32Z', '#4dabf7') + e(50, 40, 24, 6, '#1c7ed6') + e(50, 40, 20, 4, '#a5d8ff') + s('M28 40Q50 6 72 40', '#868e96', 3),
  kolah: () => r(12, 40, 76, 48, 6, '#ced4da') + r(18, 46, 64, 18, 4, '#74c0fc') + hl(36, 52, 10, 2, 0.6) + [24, 44, 64].map((x) => r(x, 66, 14, 20, 2, '#adb5bd')).join('') + r(10, 34, 80, 8, 4, '#adb5bd'),
  basuh: () => hand(38, 70, 1.3, -12) + hand(64, 70, 1.3, 12) + [[50, 20], [42, 32], [58, 30], [50, 42]].map(([x, y]) => p(`M${x} ${y - 6}C${x + 4} ${y} ${x + 4} ${y + 2} ${x} ${y + 4}C${x - 4} ${y + 2} ${x - 4} ${y} ${x} ${y - 6}Z`, '#4dabf7')).join(''),
  kiri: () => sh() + `<g transform="translate(50 66) scale(-1.8 1.8)">${r(-9, -6, 18, 22, 8, SKIN)}${r(-9, -20, 4.5, 18, 2.2, SKIN)}${r(-4.3, -24, 4.5, 20, 2.2, SKIN)}${r(0.4, -22, 4.5, 18, 2.2, SKIN)}${r(5, -17, 4.5, 14, 2.2, SKIN)}</g>` + s('M82 30H62M70 22L62 30L70 38', '#e8590c', 5),
  bantal: () => sh(50, 82, 34) + p('M16 36Q14 28 24 28H76Q86 28 84 36V68Q86 76 76 76H24Q14 76 16 68Z', '#fff', 'stroke="#dee2e6" stroke-width="2"') + s('M22 40Q50 34 78 40', '#e9ecef', 2) + moon(70, 50, 6, '#ffd43b'),
  selimut: () => sh(50, 90, 36) + p('M12 40Q50 26 88 40V86H12Z', '#b197fc') + [[30, 54], [56, 62], [72, 48], [40, 74], [70, 78]].map(([x, y]) => star(x, y, 4, 1.8, '#fff')).join('') + r(12, 36, 76, 8, 4, '#9775fa'),
  pinggan: () => plate(58) + e(50, 56, 18, 5, '#fff', 'stroke="#f1f3f5"') + s('M50 46q4 -6 0 -12', '#ced4da', 2),
  cawan: () => sh(50, 86, 26) + p('M26 40H66L62 80Q62 86 56 86H36Q30 86 30 80Z', '#ff8787') + s('M66 50Q80 52 76 64Q72 72 62 70', '#ff8787', 5) + e(46, 40, 20, 5, '#c92a2a') + s('M40 28q4 -6 0 -12M52 28q4 -6 0 -12', '#ced4da', 2.5),
  sudu: () => sh(50, 90, 18) + e(50, 30, 14, 20, '#ced4da') + e(50, 30, 10, 15, '#e9ecef') + r(46, 46, 8, 42, 4, '#adb5bd'),
  baju: () => sh() + p('M34 20L50 26L66 20L84 32L76 46L68 42V88H32V42L24 46L16 32Z', '#4dabf7') + p('M44 22Q50 32 56 22', 'none', 'stroke="#1c7ed6" stroke-width="3"') + r(46, 40, 8, 6, 2, '#ffd43b'),
  kasut: () => sh(50, 82, 38) + p('M14 60Q14 46 26 46Q34 46 40 54L78 58Q90 60 88 72V76H14Z', '#ff6b6b') + r(14, 72, 74, 8, 3, '#fff') + s('M34 54l6 6M42 54l6 6', '#fff', 2),
  kereta: () => sh(50, 86, 38) + p('M12 72V58Q12 50 22 48L32 34Q36 28 44 28H62Q68 28 72 34L80 48Q88 50 88 58V72Z', '#ff6b6b') + p('M36 36H50V48H30Z', '#a5d8ff') + p('M54 36H66L72 48H54Z', '#a5d8ff') + c(30, 74, 9, '#2b2350') + c(70, 74, 9, '#2b2350') + c(30, 74, 4, '#ced4da') + c(70, 74, 4, '#ced4da'),
  sekolah: () => sky('#a5d8ff', '#e7f5ff') + r(16, 44, 68, 46, 3, '#ffe066') + p('M10 46L50 22L90 46Z', '#e8590c') + r(44, 66, 12, 24, 2, '#a85d22') + [22, 34, 60, 72].map((x) => r(x, 52, 8, 8, 1, '#4dabf7')).join('') + r(48, 10, 2, 14, 1, '#868e96') + p('M50 10L62 14L50 18Z', '#ff6b6b'),
  pensel: () => sh(50, 88, 26) + `<g transform="rotate(-40 50 50)">${r(20, 42, 50, 16, 2, '#ffd43b')}${p('M70 42L86 50L70 58Z', '#ffe8cc')}${p('M80 47L86 50L80 53Z', '#2b2350')}${r(14, 42, 8, 16, 2, '#ff8787')}${r(20, 47, 50, 2, 0, '#fcc419')}</g>`,
  bersin: () => c(46, 52, 30, SKIN) + c(38, 46, 2.5, '#2b2350') + c(54, 46, 2.5, '#2b2350') + r(52, 54, 34, 24, 6, '#fff', 'stroke="#e9ecef" stroke-width="2"') + s('M18 28l-6 -6M14 40l-8 -2M24 20l-2 -8', '#74c0fc', 3),
  cermin: () => sh(50, 92, 22) + e(50, 46, 28, 34, '#c47a3a') + e(50, 46, 23, 29, '#d0ebff') + p('M38 30L46 26L36 56L30 58Z', '#fff', 'opacity=".7"') + r(46, 80, 8, 10, 2, '#a85d22'),
  mandi: () => sh(50, 90, 36) + r(14, 56, 72, 26, 12, '#fff', 'stroke="#ced4da" stroke-width="2"') + e(50, 56, 34, 6, '#a5d8ff') + [[30, 46, 7], [44, 40, 9], [62, 44, 8]].map(([x, y, rr]) => c(x, y, rr, '#fff', 'stroke="#d0ebff" stroke-width="2"')).join('') + r(76, 20, 6, 36, 3, '#adb5bd'),
  rajin: () => person({ x: 40, head: 'hair', top: '#ffa94d', k: 0.95, arms: 'front' }) + book(56, 50, 30, 10, '#4dabf7') + book(58, 40, 26, 10, '#ff6b6b') + star(80, 22, 5, 2, '#ffd43b'),
  susun: () => sh(50, 90, 34) + r(20, 66, 22, 22, 4, '#ff6b6b') + r(44, 66, 22, 22, 4, '#4dabf7') + r(32, 42, 22, 22, 4, '#51cf66') + r(38, 18, 22, 22, 4, '#fcc419', 'transform="rotate(8 49 29)"') + t(31, 82, 'A', 14, '#fff') + t(55, 82, 'B', 14, '#fff') + t(43, 58, 'C', 14, '#fff'),
  kemas: () => sh(50, 90, 36) + r(14, 52, 72, 36, 4, '#c47a3a') + r(18, 58, 64, 12, 2, '#e0a26a') + r(18, 72, 64, 12, 2, '#e0a26a') + r(22, 28, 12, 24, 2, '#ff6b6b') + r(36, 32, 10, 20, 2, '#4dabf7') + r(48, 26, 12, 26, 2, '#51cf66') + star(76, 32, 6, 2.5, '#ffd43b'),
  kawan: () => person({ x: 30, head: 'hair', top: '#4dabf7', k: 0.95, arms: 'wave' }) + person({ x: 70, head: 'hijab', hijab: '#ffa8a8', top: '#ff6b6b', k: 0.95, arms: 'wave' }) + star(50, 22, 5, 2, '#ffd43b'),
  peluk: () => sh(50, 90, 30) + person({ x: 40, head: 'hijab', hijab: '#f783ac', top: '#e64980', k: 1.05 }) + person({ x: 60, head: 'hair', top: '#ffa94d', k: 0.75, arms: 'up' }) + heart(50, 18, 0.4, '#ff6b6b'),
  diam: () => c(50, 52, 34, SKIN) + c(40, 46, 3, '#2b2350') + c(60, 46, 3, '#2b2350') + s('M42 64H58', '#c2255c', 3) + r(46, 50, 8, 34, 4, '#f6b98a') + t(80, 26, 'sh', 12, '#868e96'),
  dengar: () => c(50, 52, 30, SKIN) + c(40, 50, 3, '#2b2350') + c(56, 50, 3, '#2b2350') + s('M44 64Q50 68 56 64', '#c2255c', 2.5) + e(80, 52, 8, 12, SKIN) + s('M88 40q8 12 0 24M94 34q12 18 0 36', '#4dabf7', 2.5),
  beratur: () => [16, 38, 60, 82].map((x, i) => person({ x, head: i % 2 ? 'hijab' : 'hair', hijab: '#b197fc', top: ['#4dabf7', '#ff6b6b', '#51cf66', '#ffa94d'][i], k: 0.58 })).join('') + s('M8 94H92', '#ced4da', 3, 'stroke-dasharray="6 5"'),
  sampah: () => sh(50, 90, 26) + p('M28 34H72L66 88H34Z', '#51cf66') + r(24, 26, 52, 10, 4, '#2f9e6a') + r(44, 18, 12, 8, 3, '#2f9e6a') + [40, 50, 60].map((x) => s(`M${x} 44V80`, '#2f9e6a', 3)).join('') + p('M46 54l4 -8 4 8-4 2z', '#fff'),
  pinjam: () => hand(28, 74, 1, 30) + hand(74, 74, 1, -30) + book(34, 34, 34, 12, '#4dabf7') + s('M30 26q20 -14 40 0', '#ffa94d', 3) + p('M66 22l6 4-7 3z', '#ffa94d'),
  siram: () => sh(50, 90, 30) + p('M62 80H82L80 92H64Z', '#c47a3a') + s('M72 80V64', '#37b24d', 3) + e(66, 62, 6, 3, '#51cf66') + e(78, 60, 6, 3, '#51cf66') + c(72, 56, 5, '#f783ac') + r(14, 32, 34, 26, 8, '#4dabf7') + s('M48 38L62 30', '#4dabf7', 6) + [[66, 38], [70, 46], [64, 48]].map(([x, y]) => c(x, y, 2, '#4dabf7')).join(''),
  anak: () => person({ head: 'hair', top: '#51cf66', k: 0.9, arms: 'wave' }) + star(78, 24, 5, 2, '#ffd43b'),
  cucu: () => person({ x: 34, head: 'kopiah', top: '#868e96', beard: '#e9ecef', glasses: true, k: 1 }) + person({ x: 70, head: 'hair', top: '#ffa94d', k: 0.7, arms: 'up' }),
  pakcik: () => person({ head: 'songkok', top: '#2f9e6a', beard: '#3b2a1e', k: 1.1 }),
  makcik: () => person({ head: 'hijab', hijab: '#ffc078', top: '#f76707', k: 1.1 }),
  dapur: () => r(10, 50, 80, 40, 4, '#e9ecef') + r(16, 56, 30, 28, 3, '#ced4da') + c(64, 58, 8, '#495057') + c(64, 58, 4, '#ff6b6b') + p('M22 38H42L40 50H24Z', '#adb5bd') + s('M42 40H50', '#868e96', 3) + s('M28 32q3 -5 0 -10M36 32q3 -5 0 -10', '#ced4da', 2),
  taman: () => sky('#a5d8ff', '#e7f5ff') + p('M6 70H94V94H6Z', '#69db7c') + tree(24, 76, 0.7) + [[50, 82], [62, 76], [74, 84], [86, 78]].map(([x, y]) => c(x, y, 5, '#f783ac') + c(x, y, 2, '#ffd43b')).join('') + r(40, 64, 26, 4, 2, '#a85d22') + r(42, 68, 3, 10, 1, '#8a5d36') + r(61, 68, 3, 10, 1, '#8a5d36'),
  kucing: () => sh(50, 88, 28) + e(50, 70, 22, 16, '#ffa94d') + c(50, 42, 20, '#ffa94d') + p('M32 30L34 14L44 26Z', '#ffa94d') + p('M68 30L66 14L56 26Z', '#ffa94d') + c(43, 42, 2.5, '#2b2350') + c(57, 42, 2.5, '#2b2350') + p('M48 48h4l-2 2z', '#f783ac') + s('M30 48h-12M30 52h-10M70 48h12M70 52h10', '#2b2350', 1.2) + s('M70 76q16 -4 14 -18', '#ffa94d', 5),
  gambar: () => sh(50, 88, 32) + r(14, 20, 72, 64, 6, '#c47a3a') + r(20, 26, 60, 52, 3, '#e7f5ff') + person({ x: 38, y: 76, head: 'songkok', top: '#4dabf7', k: 0.55 }) + person({ x: 62, y: 76, head: 'hijab', hijab: '#f783ac', top: '#e64980', k: 0.52 }),
  masak: () => sh(50, 88, 32) + p('M20 50H80V76Q80 86 70 86H30Q20 86 20 76Z', '#868e96') + r(14, 50, 72, 6, 3, '#495057') + s('M20 58H12M80 58H88', '#495057', 4) + s('M36 40q4 -6 0 -12M50 40q4 -6 0 -12M64 40q4 -6 0 -12', '#ced4da', 3),
  kek: () => sh(50, 88, 30) + r(22, 50, 56, 36, 6, '#f783ac') + r(22, 50, 56, 10, 5, '#fff') + r(30, 36, 4, 14, 2, '#74c0fc') + r(48, 34, 4, 16, 2, '#ffd43b') + r(66, 36, 4, 14, 2, '#69db7c') + [32, 50, 68].map((x) => e(x, 32, 2.5, 4, '#ff922b')).join(''),
  piknik: () => sh(50, 88, 36) + p('M16 50H84L76 86H24Z', '#e0a26a') + s('M16 50H84', '#a85d22', 4) + s('M30 50Q50 18 70 50', '#a85d22', 4) + [24, 40, 56, 72].map((x) => s(`M${x} 56L${x + 4} 82`, '#c47a3a', 2)).join('') + c(42, 44, 6, '#ff6b6b') + e(58, 44, 9, 5, '#ffd43b'),
  mihrab: () => r(14, 14, 72, 78, 6, '#fff8e6', 'stroke="#e9d8b4" stroke-width="2"') + p('M28 90V44Q28 22 50 18Q72 22 72 44V90Z', '#2f9e6a') + p('M34 90V46Q34 30 50 26Q66 30 66 46V90Z', '#c3fae8') + star(50, 42, 6, 2.5, '#f2a922'),
  beduk: () => sh(50, 90, 34) + r(30, 60, 6, 30, 2, '#8a5d36') + r(64, 60, 6, 30, 2, '#8a5d36') + r(18, 34, 64, 34, 16, '#c47a3a') + e(18, 51, 6, 17, '#fff3d6') + e(82, 51, 6, 17, '#fff3d6') + s('M30 36V66M70 36V66', '#8a5d36', 2) + s('M88 20L72 36', '#5b3d22', 4) + c(88, 20, 4, '#fff3d6'),
  karpet: () => r(10, 26, 80, 52, 6, '#c92a2a') + r(16, 32, 68, 40, 4, '#e8590c') + p('M50 38L66 52L50 66L34 52Z', '#ffd43b') + c(50, 52, 5, '#c92a2a') + [14, 86].map((x) => [32, 42, 52, 62, 72].map((y) => r(x - 4, y, 8, 2, 1, '#ffd43b')).join('')).join(''),
  rak: () => r(16, 14, 68, 78, 4, '#a85d22') + [36, 58, 80].map((y) => r(20, y, 60, 4, 1, '#8a5d36')).join('') + book(24, 20, 10, 16, '#2f9e6a') + book(36, 22, 8, 14, '#1c7ed6') + book(46, 20, 10, 16, '#c92a2a') + book(26, 42, 10, 16, '#ff922b') + book(40, 44, 8, 14, '#2f9e6a') + book(56, 64, 12, 16, '#845ef7'),
  selipar: () => sh(50, 84, 36) + e(34, 56, 14, 28, '#4dabf7') + e(66, 56, 14, 28, '#4dabf7') + s('M26 44L34 52L42 44M58 44L66 52L74 44', '#fff', 4),
  surau: () => sky('#a5d8ff', '#e7f5ff') + r(22, 54, 56, 36, 3, '#fff8e6') + p('M14 56L50 28L86 56Z', '#2f9e6a') + r(44, 70, 12, 20, 6, '#a85d22') + r(28, 62, 8, 10, 4, '#a5d8ff') + r(64, 62, 8, 10, 4, '#a5d8ff') + moon(50, 24, 5, '#f2a922', '#bde0fb'),
  hijaiyah: () => [[24, 30, 'ا', '#ff6b6b'], [50, 30, 'ب', '#4dabf7'], [76, 30, 'ت', '#51cf66'], [37, 70, 'ث', '#fcc419'], [63, 70, 'ج', '#845ef7']].map(([x, y, ch, col]) => r(x - 13, y - 15, 26, 30, 6, col) + t(x, y + 7, ch, 18, '#fff', 'font-family="Amiri, Noto Naskh Arabic, serif"')).join(''),
  banjir: () => sky('#748ffc', '#bac8ff') + cloud(30, 24, 0.8, '#adb5bd') + cloud(70, 20, 0.9, '#adb5bd') + p('M6 56Q20 50 34 56T62 56T94 56V94H6Z', '#1c7ed6') + p('M6 70Q20 64 34 70T62 70T94 70V94H6Z', '#1971c2') + tree(74, 62, 0.45) + r(20, 50, 16, 10, 2, '#e8590c', 'opacity=".8"'),
  angin: () => sky('#d0ebff', '#e7f5ff') + s('M12 34H58Q70 34 70 24Q70 14 60 16', '#74c0fc', 5) + s('M12 52H74Q88 52 86 64Q84 74 74 70', '#4dabf7', 5) + s('M18 70H46Q56 70 56 80', '#a5d8ff', 5) + e(80, 30, 6, 3, '#69db7c', 'transform="rotate(30 80 30)"'),
  perigi: () => sh(50, 92, 34) + r(18, 56, 64, 34, 6, '#adb5bd') + [62, 74].map((y) => r(18, y, 64, 3, 1, '#868e96')).join('') + e(50, 56, 32, 6, '#495057') + r(20, 18, 6, 40, 2, '#8a5d36') + r(74, 18, 6, 40, 2, '#8a5d36') + p('M14 22L50 6L86 22Z', '#c47a3a') + s('M50 22V44', '#5b3d22', 2) + r(44, 42, 12, 10, 2, '#4dabf7'),
  kibas: () => sh(50, 88, 30) + [30, 38, 58, 66].map((x) => r(x, 68, 5, 18, 2, '#495057')).join('') + c(44, 58, 18, '#f8f9fa') + c(58, 56, 16, '#f8f9fa') + c(34, 52, 12, '#f8f9fa') + c(72, 48, 10, '#495057') + s('M72 40q8 -6 6 4q-2 8 -8 4', '#e0a26a', 4) + c(75, 48, 1.6, '#fff'),
  ular: () => sh(50, 86, 32) + s('M18 76Q30 60 46 72T74 66Q86 60 80 46', '#51cf66', 10) + c(78, 40, 9, '#51cf66') + c(76, 38, 1.8, '#2b2350') + s('M86 40l6 -2M86 40l6 3', '#f03e3e', 1.6),
  bukit: () => sky('#a5d8ff', '#e7f5ff') + p('M6 90Q30 40 54 62Q74 30 94 90Z', '#8ce99a') + p('M6 90Q30 54 54 70Q74 48 94 90Z', '#69db7c') + cloud(30, 26, 0.7),
  besi: () => sh(50, 86, 34) + [[20, 64], [44, 64], [32, 48]].map(([x, y]) => p(`M${x} ${y + 14}L${x + 8} ${y}H${x + 28}L${x + 36} ${y + 14}Z`, '#868e96') + s(`M${x + 10} ${y + 2}H${x + 26}`, '#ced4da', 2)).join(''),
  hudhud: () => sky('#ffe8cc', '#fff4e6') + `<g transform="translate(50 56)">${e(0, 4, 20, 14, '#e0a26a')}${p('M-6 0Q-26 -10 -24 8Z', '#8a5d36')}${c(14, -8, 9, '#e0a26a')}${p('M10 -16L6 -30L14 -20L18 -32L20 -18Z', '#ff922b')}${p('M22 -8L36 -6L22 -4Z', '#2b2350')}${c(16, -10, 1.8, '#2b2350')}${s('M-2 16L-4 26M6 16L6 26', '#8a5d36', 2)}</g>`,
  merpati: () => sky('#d0ebff', '#e7f5ff') + `<g transform="translate(48 56)">${e(0, 0, 22, 14, '#e9ecef')}${p('M-4 -4Q-18 -28 6 -16Z', '#ced4da')}${c(18, -8, 9, '#e9ecef')}${p('M26 -9L34 -7L26 -5Z', '#ff922b')}${c(20, -10, 1.8, '#2b2350')}${p('M-20 2L-32 -4L-30 8Z', '#ced4da')}</g>` + s('M66 30q6 -8 14 -6', '#51cf66', 2.5),
  sayur: () => sh(50, 88, 32) + p('M20 62Q50 92 80 62Z', '#c47a3a') + c(38, 52, 12, '#37b24d') + c(30, 46, 8, '#51cf66') + c(46, 44, 9, '#51cf66') + p('M58 30L66 60L54 58Z', '#ff922b') + s('M60 30q-2 -8 4 -10', '#37b24d', 3),
  lobak: () => sh(50, 90, 18) + p('M40 32H60L52 88Q50 92 48 88Z', '#ff922b') + [44, 56, 68].map((y) => s(`M42 ${y}h6M54 ${y + 6}h4`, '#e8590c', 2)).join('') + e(44, 22, 5, 12, '#51cf66', 'transform="rotate(-20 44 22)"') + e(56, 20, 5, 12, '#37b24d', 'transform="rotate(20 56 20)"'),
  jagung: () => sh(50, 90, 20) + e(50, 52, 14, 32, '#ffd43b') + [...Array(12)].map((_, i) => c(44 + (i % 2) * 12, 30 + Math.floor(i / 2) * 8, 3, '#fcc419')).join('') + p('M36 60Q30 86 50 90Q40 70 44 58Z', '#51cf66') + p('M64 60Q70 86 50 90Q60 70 56 58Z', '#37b24d'),
  tembikai: () => sh(50, 88, 36) + `<g transform="translate(50 76)">${p('M-38 0A38 38 0 0 0 38 0Z', '#2f9e6a', 'transform="scale(1,-1)"')}${p('M-32 0A32 32 0 0 1 32 0Z', '#ff6b6b')}${p('M-38 0A38 38 0 0 1 38 0H32A32 32 0 0 0 -32 0Z', '#51cf66')}${[[-14, -12], [0, -20], [14, -12], [-6, -6], [8, -6]].map(([x, y]) => e(x, y, 2, 3, '#2b2350')).join('')}</g>`,
  anggur: () => sh(50, 90, 22) + [[50, 34], [40, 44], [60, 44], [34, 56], [50, 56], [66, 56], [42, 68], [58, 68], [50, 80]].map(([x, y]) => c(x, y, 8, '#9775fa') + hl(x - 2, y - 3, 2, 1.5, 0.6)).join('') + s('M50 26V16', '#8a5d36', 3) + e(58, 18, 8, 4, '#51cf66'),
  mangga: () => sh(50, 88, 26) + p('M50 24C76 24 82 56 70 76C60 90 34 88 28 70C22 50 30 24 50 24Z', '#ffa94d') + p('M50 24C66 26 72 44 66 58C58 50 52 38 50 24Z', '#ffd43b', 'opacity=".6"') + s('M50 24q2 -8 8 -10', '#8a5d36', 3) + e(62, 14, 8, 4, '#51cf66'),
  oren: () => sh(50, 88, 26) + c(50, 56, 28, '#ff922b') + [...Array(8)].map((_, i) => c(40 + (i % 4) * 7, 50 + Math.floor(i / 4) * 12, 1.2, '#e8590c')).join('') + hl(40, 44, 7, 4, 0.5) + e(56, 26, 8, 4, '#51cf66', 'transform="rotate(-20 56 26)"'),
  nanas: () => sh(50, 90, 22) + e(50, 62, 20, 26, '#fcc419') + [...Array(9)].map((_, i) => s(`M${38 + (i % 3) * 12} ${48 + Math.floor(i / 3) * 12}l6 6`, '#e0a800', 2)).join('') + [[-14, 0], [-6, -6], [0, -10], [6, -6], [14, 0]].map(([dx, dy]) => e(50 + dx, 30 + dy, 4, 12, '#37b24d', `transform="rotate(${dx * 2} ${50 + dx} ${30 + dy})"`)).join(''),
  kelapa: () => sh(50, 88, 26) + c(50, 56, 28, '#8a5d36') + c(50, 56, 22, '#fff') + c(50, 56, 18, '#f8f9fa') + p('M22 56A28 28 0 0 1 78 56', '#8a5d36') + s('M50 38q-6 -16 6 -22', '#51cf66', 3) + c(42, 44, 2, '#5b3d22') + c(58, 44, 2, '#5b3d22'),
  teh: () => sh(50, 88, 30) + p('M24 44H70L66 82Q66 88 60 88H34Q28 88 28 82Z', '#fff', 'stroke="#ced4da" stroke-width="2"') + p('M27 50H67L64 80Q64 84 60 84H34Q30 84 30 80Z', '#e0a26a') + s('M70 52Q84 54 80 66Q76 74 66 72', '#ced4da', 4) + s('M40 34q4 -6 0 -12M54 34q4 -6 0 -12', '#ced4da', 2.5),
  bubur: () => sh(50, 88, 32) + p('M18 54H82Q82 86 50 86Q18 86 18 54Z', '#4dabf7') + e(50, 54, 32, 8, '#fff4e6') + c(40, 52, 3, '#ff922b') + c(58, 54, 3, '#51cf66') + s('M70 40L80 20', '#ced4da', 4),
  mi: () => sh(50, 88, 32) + p('M18 54H82Q82 86 50 86Q18 86 18 54Z', '#ff6b6b') + e(50, 54, 32, 8, '#ffe066') + s('M26 54q6 -8 12 0t12 0t12 0t12 0', '#fcc419', 2.5) + s('M60 50L76 18M66 52L84 22', '#a85d22', 3),
  sup: () => sh(50, 88, 32) + p('M18 54H82Q82 86 50 86Q18 86 18 54Z', '#fff', 'stroke="#ced4da" stroke-width="2"') + e(50, 54, 32, 8, '#ffa94d') + c(38, 52, 3.5, '#51cf66') + c(54, 54, 3.5, '#ff6b6b') + c(64, 52, 3, '#fcc419') + s('M42 40q4 -6 0 -12M56 40q4 -6 0 -12', '#ced4da', 2.5),
  kuih: () => plate(74) + r(24, 50, 22, 18, 4, '#51cf66') + r(24, 56, 22, 6, 0, '#fff') + r(52, 50, 22, 18, 4, '#ff8787') + r(52, 56, 22, 6, 0, '#fff4e6') + c(50, 40, 9, '#fcc419'),
  daging: () => plate(70) + e(50, 58, 22, 13, '#c92a2a') + e(46, 56, 14, 8, '#e03131') + r(66, 50, 14, 5, 2, '#fff', 'transform="rotate(-20 72 52)"'),
  gula: () => sh(50, 88, 30) + p('M26 40H74V84Q74 88 70 88H30Q26 88 26 84Z', '#fff', 'stroke="#ced4da" stroke-width="2"') + r(22, 32, 56, 10, 4, '#74c0fc') + [[36, 60], [50, 66], [62, 58], [44, 76], [58, 78]].map(([x, y]) => r(x - 4, y - 4, 8, 8, 1, '#f1f3f5', 'stroke="#dee2e6"')).join(''),
  garam: () => sh(50, 88, 22) + p('M36 36H64V82Q64 88 58 88H42Q36 88 36 82Z', '#fff', 'stroke="#ced4da" stroke-width="2"') + p('M36 36Q50 22 64 36Z', '#adb5bd') + [44, 50, 56].map((x) => c(x, 32, 1.2, '#495057')).join(''),
  pantai: () => sky('#74c0fc', '#d0ebff') + sun(76, 22, 8) + p('M6 54Q30 48 50 54T94 54V70H6Z', '#4dabf7') + p('M6 66Q40 60 94 70V94H6Z', '#ffe8a3') + tree(22, 78, 0.45),
  pasir: () => sh(50, 90, 36) + p('M10 86Q20 46 50 44Q80 46 90 86Z', '#ffe066') + [...Array(14)].map((_, i) => c(20 + (i * 37) % 62, 60 + (i * 13) % 24, 1.5, '#e0a800')).join('') + p('M62 44V24L76 30L62 36', '#ff6b6b') + r(60, 24, 3, 22, 1, '#868e96'),
  batu: () => sh(50, 88, 34) + p('M14 86Q12 56 34 48Q46 30 66 40Q88 46 86 86Z', '#adb5bd') + p('M30 58Q40 52 48 56', 'none', 'stroke="#868e96" stroke-width="3"') + hl(44, 48, 10, 4, 0.4),
  daun: () => sh(50, 88, 26) + p('M20 80Q16 30 76 18Q86 70 20 80Z', '#51cf66') + s('M22 78Q50 54 74 22', '#2f9e6a', 3) + s('M36 62L32 46M48 50L46 34M58 40L62 30M44 58L58 56', '#2f9e6a', 2),
  biji: () => sh(50, 88, 30) + p('M6 80H94V94H6Z', '#a68a64') + e(50, 74, 12, 8, '#8a5d36') + s('M50 70V40', '#51cf66', 4) + e(40, 40, 10, 5, '#51cf66', 'transform="rotate(-30 40 40)"') + e(60, 36, 10, 5, '#37b24d', 'transform="rotate(30 60 36)"'),
  lebah: () => sky('#fff3bf', '#fff9db') + `<g transform="translate(50 54)">${e(-6, -18, 12, 9, '#e7f5ff', 'opacity=".9"')}${e(10, -18, 12, 9, '#e7f5ff', 'opacity=".9"')}${e(0, 0, 22, 16, '#fcc419')}${r(-8, -15, 6, 30, 3, '#2b2350')}${r(4, -15, 6, 30, 3, '#2b2350')}${c(22, -2, 9, '#2b2350')}${c(25, -4, 2, '#fff')}${p('M-22 0L-30 -3L-30 3Z', '#2b2350')}</g>`,
  lembu: () => sh(50, 88, 34) + [24, 34, 62, 72].map((x) => r(x, 66, 6, 20, 2, '#fff', 'stroke="#ced4da"')).join('') + e(48, 58, 30, 16, '#fff', 'stroke="#ced4da"') + e(40, 54, 8, 6, '#2b2350') + e(60, 62, 6, 4, '#2b2350') + c(80, 46, 12, '#fff', 'stroke="#ced4da"') + e(84, 52, 8, 5, '#ffc9c9') + p('M72 38L66 30M86 36L92 30', 'none', 'stroke="#e0a26a" stroke-width="3"') + c(78, 44, 1.6, '#2b2350'),
  gajah: () => sh(50, 88, 34) + [24, 36, 58, 70].map((x) => r(x, 64, 10, 22, 4, '#adb5bd')).join('') + e(46, 56, 28, 20, '#adb5bd') + c(74, 46, 14, '#adb5bd') + e(64, 46, 9, 13, '#ced4da') + s('M84 52Q90 68 82 78', '#adb5bd', 7) + c(76, 42, 1.8, '#2b2350'),
  kuda: () => sh(50, 88, 34) + [24, 34, 60, 70].map((x) => r(x, 62, 5, 24, 2, '#a85d22')).join('') + e(46, 56, 26, 14, '#c47a3a') + p('M64 50L74 26L86 30L80 52Z', '#c47a3a') + p('M70 26L66 46L72 46Z', '#5b3d22') + c(80, 32, 1.6, '#2b2350') + s('M20 52q-10 6 -8 22', '#5b3d22', 4),
  arnab: () => sh(50, 88, 26) + e(48, 68, 20, 16, '#fff', 'stroke="#ced4da"') + c(56, 46, 14, '#fff', 'stroke="#ced4da"') + e(50, 22, 5, 16, '#fff', 'stroke="#ced4da"') + e(62, 22, 5, 16, '#fff', 'stroke="#ced4da"') + e(50, 24, 2, 10, '#ffc9c9') + e(62, 24, 2, 10, '#ffc9c9') + c(52, 44, 1.8, '#2b2350') + c(62, 44, 1.8, '#2b2350') + c(57, 50, 2, '#f783ac') + c(28, 70, 5, '#fff', 'stroke="#ced4da"'),
  katak: () => sh(50, 86, 30) + e(50, 64, 28, 18, '#51cf66') + c(36, 44, 9, '#51cf66') + c(64, 44, 9, '#51cf66') + c(36, 44, 5, '#fff') + c(64, 44, 5, '#fff') + c(36, 44, 2.5, '#2b2350') + c(64, 44, 2.5, '#2b2350') + s('M38 66Q50 74 62 66', '#2f9e6a', 3) + e(24, 80, 8, 4, '#37b24d') + e(76, 80, 8, 4, '#37b24d'),
  salji: () => sky('#a5d8ff', '#e7f5ff') + [[30, 30, 8], [66, 26, 6], [48, 56, 12], [24, 70, 6], [74, 68, 8]].map(([x, y, rr]) => [0, 60, 120].map((a) => s(`M${x - rr} ${y}H${x + rr}`, '#fff', 3, `transform="rotate(${a} ${x} ${y})"`)).join('')).join(''),
  petir: () => sky('#495057', '#868e96') + cloud(50, 30, 1.3, '#adb5bd') + p('M54 42L40 66H52L44 90L66 58H54L62 42Z', '#ffd43b'),
  hutan: () => sky('#a5d8ff', '#d3f9d8') + tree(20, 86, 0.8) + tree(50, 80, 1) + tree(80, 86, 0.8) + tree(36, 92, 0.6) + tree(66, 92, 0.6),
  lemang: () => sh(50, 90, 30) + [30, 46, 62].map((x, i) => r(x, 22 + i * 4, 12, 62 - i * 4, 5, '#82c91e') + r(x, 22 + i * 4, 12, 6, 3, '#fff4e6') + s(`M${x} ${44 + i * 4}h12M${x} ${64}h12`, '#5c940d', 2)).join('') + p('M18 86H82', 'none', 'stroke="#ff922b" stroke-width="6"'),
  sampul: () => sh(50, 82, 32) + r(20, 30, 60, 46, 6, '#2f9e6a') + p('M20 34L50 56L80 34', 'none', 'stroke="#1f7a50" stroke-width="3"') + star(50, 64, 6, 2.5, '#ffd43b') + p('M24 76H76', 'none', 'stroke="#ffd43b" stroke-width="3"'),
  bazar: () => r(10, 46, 80, 40, 3, '#ffe8cc') + [...Array(5)].map((_, i) => p(`M${10 + i * 16} 46H${26 + i * 16}V34H${10 + i * 16}Z`, i % 2 ? '#fff' : '#ff6b6b') + p(`M${10 + i * 16} 46Q${18 + i * 16} 54 ${26 + i * 16} 46`, i % 2 ? '#fff' : '#ff6b6b')).join('') + c(30, 62, 6, '#ff922b') + e(50, 64, 8, 5, '#8a3c1e') + c(70, 62, 6, '#51cf66') + s('M50 30V12', '#868e96', 2),
  ziarah: () => sky('#a5d8ff', '#e7f5ff') + r(30, 50, 46, 40, 3, '#ffe8cc') + p('M24 52L53 28L82 52Z', '#e8590c') + r(48, 66, 12, 24, 2, '#a85d22') + person({ x: 18, head: 'songkok', top: '#2f9e6a', k: 0.62 }) + person({ x: 88, head: 'hijab', hijab: '#ffd43b', top: '#fcc419', k: 0.58 }),
};

// kad ilustrasi (latar pelekat 2.5D)
export function artSvg(id, { size = 120, word = '', tone = '#fff' } = {}) {
  const fn = ART[id];
  let inner = fn ? fn() : '';
  if (id === 'plat' || id === 'nabi' || !fn) {
    // papan nama: perkataan abstrak / nama nabi (tiada gambaran rupa)
    inner = `${r(10, 26, 80, 50, 12, id === 'nabi' ? '#9c6b16' : '#7a4eb0')}${r(15, 31, 70, 40, 9, '#fff8e6')}${star(50, 22, 9, 4, '#ffd43b')}${[20, 80].map((x) => c(x, 51, 3, id === 'nabi' ? '#e0a800' : '#b197fc')).join('')}` +
      (id === 'nabi' ? t(50, 47, 'NABI', 9, '#9c6b16') + s('M30 58H70', '#e9d8b4', 3) : s('M28 46H72M34 56H66', '#e6d9fb', 4));
  }
  return `<svg class="ts-art" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
export const ART_IDS = Object.keys(ART);
