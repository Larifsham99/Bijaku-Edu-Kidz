// =====================================================================
//  ILUSTRASI IKON MOD — dilukis khas (SVG) menggantikan emoji simbol
//  yang kelihatan kelabu pada Android (🔤 🔢 dan lain-lain).
// =====================================================================
const T = (x, y, txt, fill = '#fff', size = 17) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Baloo 2', Nunito, sans-serif" font-weight="800" font-size="${size}" fill="${fill}">${txt}</text>`;
const BLOCK = (x, y, c, c2, letter, tc = '#fff', rot = 0) => `<g transform="rotate(${rot} ${x + 11.5} ${y + 11.5})"><rect x="${x}" y="${y + 2}" width="23" height="23" rx="6" fill="rgba(0,0,0,.15)"/><rect x="${x}" y="${y}" width="23" height="23" rx="6" fill="${c}"/><rect x="${x + 3}" y="${y + 2.5}" width="17" height="5" rx="2.5" fill="${c2}"/>${T(x + 11.5, y + 19.5, letter, tc)}</g>`;

export const MODE_ART = {
  // Wau bulan membawa huruf A
  abc: `<path d="M32 3C24 14 16 16 4 18c9 6 18 8 26 11-9 3-18 7-23 17 10-3 18-3 25 1 7-4 15-4 25-1-5-10-14-14-23-17 8-3 17-5 26-11-12-2-20-4-28-15z" fill="#e2553f"/>
    <path d="M32 9c-5 8-10 10-18 11.5 6 3.5 12 5.4 18 7.6 6-2.2 12-4.1 18-7.6C42 19 37 17 32 9z" fill="#f2a922"/><path d="M32 33c-6 3-11 5.5-15 10 6-1.2 11-1 15 1.5 4-2.5 9-2.7 15-1.5-4-4.5-9-7-15-10z" fill="#2e5aac"/>
    <path d="M32 47c-3 5-3.5 9-1.5 15M32 47c3 5 3.5 9 1.5 15" stroke="#e2553f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="26" r="10.5" fill="#fff6e6"/>${T(32, 32.5, 'A', '#b53a28', 17)}`,

  // Papan congkak dengan guli
  nombor: `<path d="M4 28c0-6 6-10 14-10h28c8 0 14 4 14 10v8c0 6-6 10-14 10H18c-8 0-14-4-14-10z" fill="#9a5b34"/><path d="M6 27c1-5 6-8 12-8h28c6 0 11 3 12 8" stroke="#c48a5e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="9.5" cy="32" rx="4" ry="8" fill="#6f3f22"/><ellipse cx="54.5" cy="32" rx="4" ry="8" fill="#6f3f22"/>
    <g fill="#6f3f22">${[0, 1, 2, 3, 4].map((k) => `<circle cx="${18 + k * 7}" cy="26" r="3.2"/><circle cx="${18 + k * 7}" cy="38" r="3.2"/>`).join('')}</g>
    <g>${[['#f2a922', 18, 26], ['#e2553f', 25, 26], ['#2f9e6a', 39, 38], ['#2e5aac', 46, 26], ['#f2a922', 32, 38], ['#e2553f', 54.5, 30], ['#2f9e6a', 9.5, 34], ['#fff6e6', 53.5, 35]].map(([c, x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${c}"/>`).join('')}</g>
    ${T(32, 60, '1 2 3', '#9a5b34', 12)}`,

  // Bentuk tempatan: ketupat, bulan & pucuk rebung
  warna: `<path d="M20 6l13 15-13 15L7 21z" fill="#3fa66b"/><path d="M13.5 13.5l13 15M26.5 13.5l-13 15M10 17l13 15M30 17l-13 15" stroke="#2a7a4a" stroke-width="1.6"/><path d="M20 36c-1 4 1 6 3 7" stroke="#3fa66b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="45" cy="19" r="12" fill="#f2a922"/><circle cx="41" cy="15" r="3.5" fill="#ffd56a"/>
    <path d="M30 58l12-20 12 20z" fill="#e2553f"/><path d="M36 58l6-10 6 10z" fill="#f2a922"/>
    <circle cx="13" cy="50" r="6" fill="#2e5aac"/><circle cx="24" cy="54" r="4" fill="#7a4eb0"/>`,

  // Kompang
  bunyi: `<path d="M10 32a22 10 0 0 0 44 0v6a22 10 0 0 1-44 0z" fill="#9a5b34"/><ellipse cx="32" cy="32" rx="22" ry="10" fill="#fff1d6"/><ellipse cx="32" cy="32" rx="22" ry="10" fill="none" stroke="#9a5b34" stroke-width="3"/>
    <path d="M12 36h40" stroke="#f2a922" stroke-width="2.5" stroke-dasharray="3 3"/><ellipse cx="27" cy="30" rx="7" ry="2.5" fill="#fff" opacity=".7"/>
    <path d="M8 18c-3 4-3 8 0 12M56 18c3 4 3 8 0 12M4 13c-5 7-5 15 0 22M60 13c5 7 5 15 0 22" stroke="#e2553f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M34 8l-6 14" stroke="#c48a5e" stroke-width="4" stroke-linecap="round"/><circle cx="35" cy="6" r="3.5" fill="#e2553f"/>`,

  // Kepingan puzzle bercorak songket
  puzzle: `<g transform="rotate(-8 32 32)"><rect x="32" y="24" width="25" height="25" rx="4" fill="#f2a922"/><circle cx="44.5" cy="24" r="5.5" fill="#f2a922"/><circle cx="44.5" cy="49" r="5.5" fill="#f2a922"/>
    <path d="M44.5 29l6 7.5-6 7.5-6-7.5z" fill="none" stroke="#c9820b" stroke-width="2"/><circle cx="44.5" cy="36.5" r="1.8" fill="#c9820b"/>
    <rect x="7" y="17" width="25" height="25" rx="4" fill="#8f2531"/><circle cx="19.5" cy="17" r="5.5" fill="#8f2531"/><circle cx="32" cy="29.5" r="5.5" fill="#8f2531"/>
    <path d="M19.5 22l6 7.5-6 7.5-6-7.5z" fill="none" stroke="#f2c14e" stroke-width="2"/><circle cx="19.5" cy="29.5" r="1.8" fill="#f2c14e"/><path d="M9 39h21" stroke="#f2c14e" stroke-width="1.6" stroke-dasharray="2 2"/></g>`,

  // Kad memori: belakang songket & bunga raya
  ingatan: `<g transform="rotate(-12 24 34)"><rect x="9" y="14" width="28" height="38" rx="6" fill="#7a1f2b"/><rect x="12" y="17" width="22" height="32" rx="4" fill="none" stroke="#f2c14e" stroke-width="1.5"/>
    <path d="M23 24l7 9-7 9-7-9z" fill="none" stroke="#f2c14e" stroke-width="1.8"/><path d="M23 29l3 4-3 4-3-4z" fill="#f2c14e"/></g>
    <g transform="rotate(10 42 32)"><rect x="28" y="11" width="28" height="38" rx="6" fill="#fffaf1" stroke="#ecdcc3" stroke-width="2"/>
    <g transform="translate(42 30)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6.5" rx="5" ry="7" fill="#e2553f" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#f2a922"/><path d="M0 0l2-9" stroke="#f2a922" stroke-width="1.4"/></g></g>`,

  // Canting batik melukis bunga
  seni: `<rect x="6" y="22" width="40" height="36" rx="4" fill="#fff1d6"/><rect x="6" y="22" width="40" height="36" rx="4" fill="none" stroke="#ecdcc3" stroke-width="2"/>
    <g transform="translate(24 41)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="4.5" ry="6.5" fill="#2e5aac" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#f2a922"/></g>
    <path d="M10 54c6-4 10-2 14-4M34 30c3 2 6 1 8 4" stroke="#2f9e6a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M60 4L44 22" stroke="#9a5b34" stroke-width="4.5" stroke-linecap="round"/><path d="M41 19h9l-1.5 5.5h-6z" fill="#d98a3a"/><path d="M44 24.5l-4 6" stroke="#b5642a" stroke-width="2" stroke-linecap="round"/><circle cx="39.5" cy="31.5" r="2" fill="#2e5aac"/>`,

  // Wayang kulit di hadapan kelir bercahaya
  bayang: `<circle cx="32" cy="30" r="27" fill="#ffe7b0"/><circle cx="32" cy="28" r="17" fill="#fff4d6"/>
    <path d="M27 6l3-5 3 5 2 3c2 1 3 3 2 5l5 2-5 1c0 2-1 3-3 4v3c4 1 7 4 8 9l-2 13 4 12H21l4-12-2-13c1-5 4-8 8-9v-3c-3-1-5-4-5-7 0-3 1-5 1-8z" fill="#3b2a1f"/>
    <path d="M40 27l12 9-2 2-11-7M25 28l-10 12 2 1 10-10" fill="#3b2a1f"/>
    <path d="M51 37l3 22M16 40l-3 19M30 59v4M34 59v4" stroke="#9a5b34" stroke-width="1.8" stroke-linecap="round"/>
    <g fill="#ffe7b0"><circle cx="32" cy="31" r="1.4"/><circle cx="29" cy="35" r="1.2"/><circle cx="35" cy="35" r="1.2"/><circle cx="32" cy="39" r="1.4"/><circle cx="30" cy="12" r="1.1"/><circle cx="33.5" cy="14" r="1"/></g>
    <path d="M26 47h12M25 51h14" stroke="#ffe7b0" stroke-width="1.2" stroke-dasharray="2 2"/>`,

  // Batas sawah menuju rumah
  maze: `<rect x="5" y="5" width="54" height="54" rx="10" fill="#7fc36b"/>
    <g fill="#9fd48a">${[[9, 9], [24, 9], [39, 24], [9, 39], [24, 39], [39, 47]].map(([x, y]) => `<rect x="${x}" y="${y}" width="${x === 39 && y === 47 ? 16 : 12}" height="${y === 47 ? 8 : 12}" rx="2.5"/>`).join('')}</g>
    <g stroke="#a7d897" stroke-width="1">${[0, 1, 2, 3].map((k) => `<path d="M${10 + k * 3} 12v6M${25 + k * 3} 12v6M${10 + k * 3} 42v6M${25 + k * 3} 42v6"/>`).join('')}</g>
    <path d="M13 26h24V14h15v24H37" stroke="#d8a46a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 26h24V14h15v24H37" stroke="#f2c14e" stroke-width="1.5" stroke-dasharray="1 4" fill="none" stroke-linecap="round"/>
    <circle cx="13" cy="26" r="4.5" fill="#e2553f"/><path d="M28 40l6-5 6 5z" fill="#7a3f22"/><rect x="29" y="40" width="10" height="7" fill="#b77748"/>`,

  // Rumah kampung bertiang
  harian: `<circle cx="50" cy="12" r="7" fill="#f2a922"/>
    <path d="M6 30L32 9l26 21z" fill="#7a3f22"/><path d="M32 9l-5 4M32 9l5 4" stroke="#f2a922" stroke-width="2.5" stroke-linecap="round"/><path d="M22 30L32 18l10 12" fill="#9a5b34"/>
    <rect x="10" y="29" width="44" height="18" rx="1.5" fill="#c48a5e"/><path d="M10 34h44M10 40h44" stroke="#9a5b34" stroke-width="1.2"/>
    <rect x="15" y="33" width="9" height="8" fill="#5a3a24"/><rect x="40" y="33" width="9" height="8" fill="#5a3a24"/><rect x="28" y="33" width="8" height="14" fill="#7a4a2a"/>
    <path d="M14 47v11M50 47v11M32 47v11" stroke="#7a4a2a" stroke-width="2.6"/><path d="M36 47l8 11M39 51h4M41.5 54.5h4" stroke="#9a5b34" stroke-width="2" stroke-linecap="round"/><path d="M4 59h56" stroke="#7fc36b" stroke-width="3" stroke-linecap="round"/>`,

  // Bakul anyaman dengan buah tempatan
  kelas: `<circle cx="18" cy="21" r="7.5" fill="#e2553f"/><g stroke="#2f9e6a" stroke-width="1.4">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M${18 + 7.5 * Math.cos(a * Math.PI / 180)} ${21 + 7.5 * Math.sin(a * Math.PI / 180)}l${2.5 * Math.cos(a * Math.PI / 180)} ${2.5 * Math.sin(a * Math.PI / 180)}"/>`).join('')}</g>
    <path d="M28 26c2-12 12-18 22-16-6 2-12 7-14 16z" fill="#f2c14e"/><circle cx="46" cy="22" r="7" fill="#6a2e5a"/><path d="M43 15.5h6l-1 2h-4z" fill="#2f9e6a"/>
    <path d="M6 28h52l-5 28H11z" fill="#c48a5e"/><g stroke="#9a5b34" stroke-width="1.8"><path d="M9 34h46M10 40h44M11.5 46h41M12.5 52h39"/></g><g stroke="#e3b88f" stroke-width="1.8">${[0, 1, 2, 3, 4, 5, 6].map((k) => `<path d="M${14 + k * 6} 29l${-0.6 + k * 0.2} 26"/>`).join('')}</g>
    <path d="M4 28h56" stroke="#9a5b34" stroke-width="4" stroke-linecap="round"/>`,

  soleh: `<path d="M14 58V36h36v22z" fill="#fff6e6"/><path d="M14 36c0-10 8-17 18-19 10 2 18 9 18 19z" fill="#2f9e6a"/><path d="M19 33c1-7 6-11 13-13-4 3-7 7-8 13z" fill="#5fc28f"/>
    <path d="M32 17v-5" stroke="#c9820b" stroke-width="2.2" stroke-linecap="round"/><path d="M33.5 4.5a4 4 0 1 0 2.5 7 4.7 4.7 0 1 1-2.5-7z" fill="#f2a922"/>
    <path d="M26 58V47a6 6 0 0 1 12 0v11z" fill="#1f7a50"/><rect x="4" y="22" width="7" height="36" rx="2" fill="#fff6e6"/><path d="M4 22l3.5-8 3.5 8z" fill="#2f9e6a"/>
    <rect x="53" y="22" width="7" height="36" rx="2" fill="#fff6e6"/><path d="M53 22l3.5-8 3.5 8z" fill="#2f9e6a"/><path d="M2 58h60" stroke="#c9820b" stroke-width="3" stroke-linecap="round"/>
    <path d="M17 42h30" stroke="#f2a922" stroke-width="1.6" stroke-dasharray="3 2"/>`,

  // Harimau Malaya
  haiwan: `<circle cx="14" cy="16" r="8" fill="#f28a24"/><circle cx="50" cy="16" r="8" fill="#f28a24"/><circle cx="14" cy="16" r="4" fill="#ffd9b0"/><circle cx="50" cy="16" r="4" fill="#ffd9b0"/>
    <ellipse cx="32" cy="34" rx="24" ry="22" fill="#f28a24"/>
    <g fill="#2b2140"><path d="M32 12l-3 8h6z"/><path d="M22 14l1 7 3-6z"/><path d="M42 14l-1 7-3-6z"/><path d="M8.5 30l8 2-8 4z"/><path d="M55.5 30l-8 2 8 4z"/><path d="M10 40l7 0-6 4z"/><path d="M54 40l-7 0 6 4z"/></g>
    <ellipse cx="32" cy="43" rx="13" ry="10" fill="#fff6e6"/>
    <circle cx="23" cy="31" r="3" fill="#2b2140"/><circle cx="41" cy="31" r="3" fill="#2b2140"/><circle cx="24" cy="30" r="1" fill="#fff"/><circle cx="42" cy="30" r="1" fill="#fff"/>
    <path d="M28 38h8l-4 4z" fill="#e2553f"/><path d="M32 42v3M32 45c-2 2-5 2-6 0M32 45c2 2 5 2 6 0" stroke="#2b2140" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,

  // Pelita minyak tanah
  minda: `<circle cx="32" cy="24" r="20" fill="#ffe7b0" opacity=".85"/>
    <path d="M32 4c6 9 8 15 0 23-8-8-6-14 0-23z" fill="#f2a922"/><path d="M32 12c3 5 3 9 0 13-3-4-3-8 0-13z" fill="#fff3c4"/>
    <path d="M30 27h4v5h-4z" fill="#6f3f22"/><path d="M20 32h24l-3 18H23z" fill="#c48a5e"/><path d="M20 32h24l-1 5H21z" fill="#9a5b34"/><path d="M25 38v10M32 38v10M39 38v10" stroke="#e3b88f" stroke-width="1.5"/>
    <rect x="15" y="50" width="34" height="6" rx="3" fill="#7a4a2a"/><path d="M8 20h4M52 20h4M12 8l3 3M52 8l-3 3" stroke="#f2a922" stroke-width="2.6" stroke-linecap="round"/>`,

  // Perahu layar di ombak
  misi: `<path d="M31 6v36" stroke="#5a3a24" stroke-width="2.6"/><path d="M33 8c13 7 19 19 20 30H33z" fill="#fff6e6"/><path d="M33 8c13 7 19 19 20 30h-8c-2-10-6-18-12-24z" fill="#f2a922"/>
    <path d="M29 12c-8 7-13 16-14 26h14z" fill="#e2553f"/><path d="M8 42h48c-3 8-11 12-20 12H28C19 54 11 50 8 42z" fill="#9a5b34"/><path d="M11 46h42" stroke="#f2a922" stroke-width="2.2"/>
    <path d="M2 56c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0" stroke="#2e5aac" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M8 61c5-3 9-3 14 0s9 3 14 0 9-3 14 0" stroke="#7fa7e6" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
};

// Elemen ikon mod; jatuh balik ke emoji jika tiada ilustrasi
export function modeArt(mode, cls = '') {
  const s = document.createElement('span');
  s.className = `mode-art ${cls}`.trim();
  s.setAttribute('aria-hidden', 'true');
  const art = MODE_ART[mode.id];
  if (art) s.innerHTML = `<svg viewBox="0 0 64 64">${art}</svg>`;
  else { s.textContent = mode.e; s.classList.add('emo'); }
  return s;
}

// Pembesar suara berwarna untuk soalan "dengar dan cari"
export const SPEAKER_ART = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="#e6f6ff"/><path d="M14 25h9l12-10v34L23 39h-9a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3z" fill="#3d8bff"/><path d="M14 25h9l12-10v8L23 31h-12v-3a3 3 0 0 1 3-3z" fill="#6ec3ff"/><path d="M41 24a11 11 0 0 1 0 16" stroke="#ff8a2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M46 18a19 19 0 0 1 0 28" stroke="#ff5fa8" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
