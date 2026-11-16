// =====================================================================
//  ILUSTRASI IKON MOD — dilukis khas (SVG) menggantikan emoji simbol
//  yang kelihatan kelabu pada Android (🔤 🔢 dan lain-lain).
// =====================================================================
const T = (x, y, txt, fill = '#fff', size = 17) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Baloo 2', Nunito, sans-serif" font-weight="800" font-size="${size}" fill="${fill}">${txt}</text>`;
const BLOCK = (x, y, c, c2, letter, tc = '#fff', rot = 0) => `<g transform="rotate(${rot} ${x + 11.5} ${y + 11.5})"><rect x="${x}" y="${y + 2}" width="23" height="23" rx="6" fill="rgba(0,0,0,.15)"/><rect x="${x}" y="${y}" width="23" height="23" rx="6" fill="${c}"/><rect x="${x + 3}" y="${y + 2.5}" width="17" height="5" rx="2.5" fill="${c2}"/>${T(x + 11.5, y + 19.5, letter, tc)}</g>`;

export const MODE_ART = {
  abc: `${BLOCK(5, 30, '#ff5d5d', '#ff9a9a', 'A', '#fff', -8)}${BLOCK(36, 30, '#3d8bff', '#8cbcff', 'C', '#fff', 7)}${BLOCK(20.5, 6, '#ffc531', '#ffe28a', 'B', '#8a5300', -4)}`,

  nombor: `<path d="M15 38c-2 7 3 9 0 14M32 31c2 8-3 11 1 21M49 38c-2 7 3 9 0 14" stroke="#9b8fb8" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="15" cy="25" rx="10" ry="11.5" fill="#22c36f"/><path d="M13.5 36.5h3l-1.5 2z" fill="#22c36f"/><ellipse cx="11.5" cy="19.5" rx="2.6" ry="4" fill="#fff" opacity=".35"/>${T(15, 30.5, '1', '#fff', 15)}
    <ellipse cx="49" cy="26" rx="10" ry="11.5" fill="#8d5cff"/><path d="M47.5 37.5h3l-1.5 2z" fill="#8d5cff"/><ellipse cx="45.5" cy="20.5" rx="2.6" ry="4" fill="#fff" opacity=".35"/>${T(49, 31.5, '3', '#fff', 15)}
    <ellipse cx="32" cy="18" rx="10.5" ry="12.5" fill="#ff8a2a"/><path d="M30.5 31h3l-1.5 2z" fill="#ff8a2a"/><ellipse cx="28" cy="12" rx="3" ry="4.5" fill="#fff" opacity=".35"/>${T(32, 24.5, '2')}`,

  warna: `<path d="M32 8C17 8 6 18 6 31c0 12 10 22 22 22 4 0 5-3 4-6-1-4 1-7 5-7h6c8 0 15-6 15-14C58 15 46 8 32 8z" fill="#ffe7b8"/><path d="M32 8C17 8 6 18 6 31c0 3 .6 6 1.8 8.7C9 27 19 16 33 16c10 0 18 4 22 10C53 15 44 8 32 8z" fill="#fff3d6"/>
    <circle cx="18" cy="31" r="5" fill="#ff5d5d"/><circle cx="24" cy="19.5" r="5" fill="#ffc531"/><circle cx="37" cy="17" r="5" fill="#22c36f"/><circle cx="48" cy="25" r="5" fill="#3d8bff"/><circle cx="21" cy="43" r="5" fill="#a96bff"/>
    <path d="M58 40 44 54" stroke="#b9774a" stroke-width="5" stroke-linecap="round"/><path d="M45.5 52.5l-4 4.5c-1.5 1.6-4.5 1-4-1.5l1-4z" fill="#ff5fa8"/>`,

  bunyi: `<circle cx="32" cy="32" r="26" fill="#e6f6ff"/><path d="M14 18a24 24 0 0 0 0 28M50 18a24 24 0 0 1 0 28" stroke="#48dbfb" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M27 42V17l18-4v24" stroke="#8d5cff" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M27 17l18-4v6l-18 4z" fill="#8d5cff"/>
    <ellipse cx="22" cy="43" rx="7" ry="5.5" transform="rotate(-20 22 43)" fill="#ff5fa8"/><ellipse cx="40" cy="38.5" rx="7" ry="5.5" transform="rotate(-20 40 38.5)" fill="#ff8a2a"/>
    <circle cx="20" cy="41.5" r="1.8" fill="#fff" opacity=".6"/><circle cx="38" cy="37" r="1.8" fill="#fff" opacity=".6"/>`,

  puzzle: `<g transform="rotate(-8 32 32)"><rect x="32" y="24" width="25" height="25" rx="4" fill="#ff8a2a"/><circle cx="44.5" cy="24" r="5.5" fill="#ff8a2a"/><circle cx="44.5" cy="49" r="5.5" fill="#ff8a2a"/><rect x="35" y="27" width="19" height="4" rx="2" fill="#ffb46b"/>
    <rect x="7" y="17" width="25" height="25" rx="4" fill="#22c36f"/><circle cx="19.5" cy="17" r="5.5" fill="#22c36f"/><circle cx="32" cy="29.5" r="5.5" fill="#22c36f"/><rect x="10" y="20" width="19" height="4" rx="2" fill="#6fe3a6"/></g>`,

  ingatan: `<g transform="rotate(-12 24 34)"><rect x="9" y="14" width="28" height="38" rx="6" fill="#8d5cff"/><rect x="13" y="18" width="20" height="30" rx="4" fill="none" stroke="#c4a8ff" stroke-width="2" stroke-dasharray="3 3"/>${T(23, 39, '?', '#fff', 22)}</g>
    <g transform="rotate(10 42 32)"><rect x="28" y="11" width="28" height="38" rx="6" fill="#fff" stroke="#e3daf3" stroke-width="2"/><path d="M42 18.5l3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1z" fill="#ffc531" stroke="#f29b05" stroke-width="1.2" stroke-linejoin="round"/></g>`,

  seni: `<g transform="rotate(-28 32 32)"><rect x="14" y="20" width="9" height="30" rx="2" fill="#ff5d5d"/><path d="M14 20l4.5-9 4.5 9z" fill="#ff9a9a"/><rect x="14" y="27" width="9" height="4" fill="#c93b3b"/></g>
    <g transform="rotate(-4 32 32)"><rect x="27.5" y="18" width="9" height="32" rx="2" fill="#ffc531"/><path d="M27.5 18l4.5-9 4.5 9z" fill="#ffe28a"/><rect x="27.5" y="25" width="9" height="4" fill="#d99400"/></g>
    <g transform="rotate(22 32 32)"><rect x="41" y="20" width="9" height="30" rx="2" fill="#3d8bff"/><path d="M41 20l4.5-9 4.5 9z" fill="#8cbcff"/><rect x="41" y="27" width="9" height="4" fill="#2463c9"/></g>
    <path d="M8 56c6-5 10 3 16-2s10 3 16-2 10 3 16-1" stroke="#22c36f" stroke-width="3" fill="none" stroke-linecap="round"/>`,

  bayang: `<circle cx="27" cy="27" r="19" fill="#d7f1ff"/><circle cx="27" cy="27" r="19" fill="none" stroke="#3d8bff" stroke-width="5"/>
    <path d="M18 36c0-7 3-11 9-11s9 4 9 11z" fill="#3d3256"/><circle cx="27" cy="22.5" r="6.5" fill="#3d3256"/><path d="M21.5 19l-1-6 5 3.5zM32.5 19l1-6-5 3.5z" fill="#3d3256"/>
    <path d="M40.5 40.5 54 54" stroke="#ff8a2a" stroke-width="7" stroke-linecap="round"/><ellipse cx="20" cy="17" rx="4" ry="2.5" transform="rotate(-35 20 17)" fill="#fff" opacity=".8"/>`,

  maze: `<rect x="6" y="6" width="52" height="52" rx="12" fill="#fff"/><rect x="6" y="6" width="52" height="52" rx="12" fill="none" stroke="#8d5cff" stroke-width="4"/>
    <path d="M6 22h18M40 6v16M24 22v16M24 38h18M42 38v-8M58 42H48" stroke="#8d5cff" stroke-width="4" stroke-linecap="round"/>
    <path d="M14 14v15h17v15h20" stroke="#ff8a2a" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round" fill="none"/>
    <circle cx="14" cy="14" r="4.5" fill="#22c36f"/><path d="M50 52V38" stroke="#3d3256" stroke-width="2.4" stroke-linecap="round"/><path d="M50 38h9l-3 3.5 3 3.5h-9z" fill="#ff5d5d"/>`,

  harian: `<circle cx="49" cy="14" r="8" fill="#ffc531"/><path d="M49 1.5v3M61.5 14h-3M58 5l-2 2M40 5l2 2" stroke="#ffc531" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M8 30 30 12l22 18" fill="#ff5d5d"/><path d="M5 31 30 10l25 21" stroke="#e03c3c" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="12" y="29" width="36" height="27" rx="3" fill="#ffe28a"/><rect x="25" y="39" width="10" height="17" rx="2" fill="#b9774a"/><circle cx="32.5" cy="48" r="1.2" fill="#fff"/>
    <rect x="16" y="35" width="7" height="7" rx="1.5" fill="#6ec3ff"/><rect x="37" y="35" width="7" height="7" rx="1.5" fill="#6ec3ff"/><path d="M4 57h56" stroke="#22c36f" stroke-width="4" stroke-linecap="round"/>`,

  kelas: `<circle cx="20" cy="17" r="7" fill="#ff5d5d"/><path d="M32 6l8 13H24z" fill="#22c36f"/><rect x="38" y="10" width="13" height="13" rx="3" fill="#3d8bff" transform="rotate(12 44.5 16.5)"/>
    <path d="M8 30h48l-4 26H12z" fill="#ff8a2a"/><path d="M8 30h48l-2 7H10z" fill="#d9660c"/><path d="M6 28h52" stroke="#ffb46b" stroke-width="5" stroke-linecap="round"/>
    <path d="M24 43h16" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,

  soleh: `<path d="M14 58V36h36v22z" fill="#fff4dc"/><path d="M14 36c0-10 8-17 18-19 10 2 18 9 18 19z" fill="#22c36f"/><path d="M19 33c1-7 6-11 13-13-4 3-7 7-8 13z" fill="#6fe3a6"/>
    <path d="M32 17v-5" stroke="#d99400" stroke-width="2.2" stroke-linecap="round"/><path d="M33.5 4.5a4 4 0 1 0 2.5 7 4.7 4.7 0 1 1-2.5-7z" fill="#ffc531"/>
    <path d="M26 58V47a6 6 0 0 1 12 0v11z" fill="#13985a"/><rect x="4" y="22" width="7" height="36" rx="2" fill="#fff4dc"/><path d="M4 22l3.5-8 3.5 8z" fill="#22c36f"/>
    <rect x="53" y="22" width="7" height="36" rx="2" fill="#fff4dc"/><path d="M53 22l3.5-8 3.5 8z" fill="#22c36f"/><path d="M2 58h60" stroke="#d99400" stroke-width="3" stroke-linecap="round"/>`,

  haiwan: `<g fill="#ff8a2a">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<circle cx="${32 + 20 * Math.cos(a * Math.PI / 180)}" cy="${33 + 20 * Math.sin(a * Math.PI / 180)}" r="9"/>`).join('')}</g><circle cx="32" cy="33" r="20" fill="#ff8a2a"/>
    <circle cx="32" cy="34" r="15" fill="#ffd36b"/><circle cx="20" cy="22" r="4" fill="#ffd36b"/><circle cx="44" cy="22" r="4" fill="#ffd36b"/>
    <circle cx="26" cy="31" r="2.6" fill="#3d3256"/><circle cx="38" cy="31" r="2.6" fill="#3d3256"/><circle cx="26.8" cy="30.2" r=".9" fill="#fff"/><circle cx="38.8" cy="30.2" r=".9" fill="#fff"/>
    <path d="M29 37h6l-3 3z" fill="#b9574a"/><path d="M32 40c-1 3-5 3.5-6 1.5M32 40c1 3 5 3.5 6 1.5" stroke="#b9574a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="22" cy="38" r="2.5" fill="#ff9a9a" opacity=".7"/><circle cx="42" cy="38" r="2.5" fill="#ff9a9a" opacity=".7"/>`,

  minda: `<circle cx="32" cy="26" r="24" fill="#fff6c9" opacity=".8"/><path d="M32 6a17 17 0 0 0-10 30.8c2 1.6 3 3.4 3 5.7V45h14v-2.5c0-2.3 1-4.1 3-5.7A17 17 0 0 0 32 6z" fill="#ffc531"/>
    <path d="M24 13a12 12 0 0 1 9-4" stroke="#fff3c4" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 40l4-10 4 10" stroke="#e08a00" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
    <rect x="25" y="45" width="14" height="5" rx="2" fill="#9b8fb8"/><rect x="26" y="51" width="12" height="5" rx="2.5" fill="#7b6f98"/>
    <path d="M7 26h4M53 26h4M12 9l3 3M52 9l-3 3" stroke="#ff8a2a" stroke-width="3" stroke-linecap="round"/>`,

  misi: `<path d="M8 12l1.2 2.6L12 16l-2.8 1.2L8 20l-1.2-2.8L4 16l2.8-1.4z" fill="#ffc531"/><circle cx="54" cy="50" r="2" fill="#ffc531"/><circle cx="12" cy="44" r="1.6" fill="#a96bff"/>
    <g transform="rotate(35 32 32)"><path d="M32 4c9 7 12 18 9 32H23c-3-14 0-25 9-32z" fill="#fff" stroke="#e3daf3" stroke-width="1.5"/><path d="M32 4c4 3 7 7 8.5 12h-17C25 11 28 7 32 4z" fill="#ff5d5d"/>
    <circle cx="32" cy="24" r="5" fill="#3d8bff" stroke="#e3daf3" stroke-width="2"/><path d="M23 30l-8 10 9-1zM41 30l8 10-9-1z" fill="#ff5d5d"/>
    <path d="M26 37h12l-3 10-3-4-3 4z" fill="#ff8a2a"/><path d="M29 37h6l-3 6z" fill="#ffc531"/></g>`,
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
