// =====================================================================
//  TEMA: identiti Melayu Nusantara — latar dilukis dengan SVG
//  (kampung, batik, songket, malam bulan, kuih-muih, taman masjid)
// =====================================================================
import { THEMES, DEFAULT_THEME, FREE_THEMES, LEGACY_THEMES, DARK_THEMES } from './data/content.js';

let current = null;

// Pastikan profil lama mempunyai medan tema & petakan tema lama kepada tema baharu
export function ensureThemeFields(p) {
  if (!p) return;
  p.owned ||= {};
  p.owned.themes ||= [...FREE_THEMES];
  p.owned.themes = [...new Set(p.owned.themes.map((t) => LEGACY_THEMES[t] || t))];
  FREE_THEMES.forEach((t) => { if (!p.owned.themes.includes(t)) p.owned.themes.push(t); });
  if (LEGACY_THEMES[p.theme]) p.theme = LEGACY_THEMES[p.theme];
  if (!p.theme || !THEMES.find((t) => t.id === p.theme)) p.theme = DEFAULT_THEME;
}

const rnd = (a, b) => a + Math.random() * (b - a);
const piece = (cls, html, style) => {
  const d = document.createElement('div');
  d.className = 'sc ' + cls;
  if (html) d.innerHTML = html;
  Object.assign(d.style, style || {});
  return d;
};

// ---------- elemen lukisan ----------
const WAU = '<svg viewBox="0 0 120 150"><path d="M60 4 C 44 26 30 30 6 34 C 24 46 44 50 58 58 C 40 64 22 72 12 92 C 34 86 50 84 60 92 C 70 84 86 86 108 92 C 98 72 80 64 62 58 C 76 50 96 46 114 34 C 90 30 76 26 60 4 Z" fill="#e2553f"/><path d="M60 14 C 50 30 40 34 24 37 C 38 45 50 49 60 54 C 70 49 82 45 96 37 C 80 34 70 30 60 14 Z" fill="#f2a922"/><path d="M60 62 C 48 68 36 74 28 86 C 42 82 52 82 60 88 C 68 82 78 82 92 86 C 84 74 72 68 60 62 Z" fill="#2e5aac"/><path d="M60 92 C 52 106 50 120 56 146 M60 92 C 68 106 70 120 64 146" stroke="#e2553f" stroke-width="3" fill="none"/><path d="M60 4 V 96" stroke="#7a2e1f" stroke-width="2"/><circle cx="60" cy="56" r="5" fill="#fff6e6"/></svg>';
const CLOUD = '<svg viewBox="0 0 160 60"><path d="M20 52 h120 a20 20 0 0 0 -10 -36 a28 28 0 0 0 -50 -6 a22 22 0 0 0 -40 14 a16 16 0 0 0 -20 28 z" fill="#fff" opacity=".95"/></svg>';
const KAMPUNG = `<svg viewBox="0 0 1200 340" preserveAspectRatio="xMidYMax slice">
  <defs>
    <linearGradient id="kgM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b6e8"/><stop offset="1" stop-color="#e9d9f2"/></linearGradient>
    <linearGradient id="kgH1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6e39a"/><stop offset="1" stop-color="#8fd07a"/></linearGradient>
    <linearGradient id="kgH2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86cf6c"/><stop offset="1" stop-color="#5fb85a"/></linearGradient>
    <linearGradient id="kgR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fd6ff"/><stop offset=".5" stop-color="#cfeaff"/><stop offset="1" stop-color="#8cc8f5"/></linearGradient>
  </defs>
  <path d="M0 150 L120 92 L210 128 L330 70 L450 124 L560 84 L690 130 L820 76 L940 120 L1060 88 L1200 126 V340 H0 Z" fill="url(#kgM)" opacity=".8"/>
  <path d="M330 70 l-26 18 h52 z M820 76 l-24 17 h48 z" fill="#fff" opacity=".7"/>
  <path d="M0 176 C 180 112 330 150 480 122 C 650 92 780 156 950 120 C 1070 96 1140 122 1200 110 V340 H0 Z" fill="url(#kgH1)"/>
  <g fill="#7fc36b" opacity=".55"><ellipse cx="160" cy="150" rx="40" ry="16"/><ellipse cx="720" cy="140" rx="46" ry="15"/><ellipse cx="1010" cy="128" rx="38" ry="13"/></g>
  <path d="M0 214 C 230 168 440 206 660 178 C 880 150 1030 198 1200 168 V340 H0 Z" fill="url(#kgH2)"/>
  <g stroke="#b6e39a" stroke-width="3" fill="none" opacity=".85"><path d="M0 244 C 300 214 600 240 1200 204"/><path d="M0 270 C 320 246 640 266 1200 234"/><path d="M0 298 C 340 276 680 294 1200 262"/></g>
  <g fill="#cfeaff" opacity=".55"><path d="M60 252 C 260 234 420 246 560 238 L560 244 C 420 252 260 240 60 258 Z"/><path d="M700 240 C 860 226 1000 232 1160 220 L1160 226 C 1000 238 860 232 700 246 Z"/></g>
  <path d="M520 340 C 560 300 640 292 660 266 C 680 240 760 236 820 214 C 860 200 900 196 960 188 L 990 190 C 920 202 880 210 840 226 C 780 248 700 254 684 278 C 664 306 600 316 572 340 Z" fill="url(#kgR)"/>
  <path d="M600 322 c 14 -6 28 -6 40 -2 M700 268 c 12 -5 24 -5 34 -1 M840 226 c 10 -4 20 -4 28 -1" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".9"/>
  <g transform="translate(880 92)">
    <rect x="18" y="74" width="5" height="44" fill="#7a4a2a"/><rect x="92" y="74" width="5" height="44" fill="#7a4a2a"/><rect x="55" y="74" width="5" height="44" fill="#7a4a2a"/>
    <rect x="10" y="44" width="96" height="34" rx="2" fill="#c48a5e"/><path d="M10 52h96M10 62h96M10 70h96" stroke="#9a5b34" stroke-width="1.5"/>
    <rect x="24" y="52" width="16" height="14" fill="#ffd98a"/><rect x="72" y="52" width="16" height="14" fill="#ffd98a"/><path d="M24 59h16M80 52v14" stroke="#c48a5e" stroke-width="1.5"/>
    <path d="M0 46 L58 4 L116 46 Z" fill="#8a4a26"/><path d="M8 46 L58 10 L108 46" fill="none" stroke="#b5642a" stroke-width="3"/><path d="M58 4 L48 12 M58 4 L68 12" stroke="#f2a922" stroke-width="3"/><path d="M40 46 L58 20 L76 46" fill="#a86a3f"/>
    <path d="M100 78 l18 40 M108 78 l18 40 M102 88h8 M106 98h8 M110 108h8" stroke="#7a4a2a" stroke-width="3"/>
    <g fill="#e2553f"><circle cx="2" cy="112" r="5"/><circle cx="14" cy="116" r="4"/></g><g fill="#3f9a52"><ellipse cx="8" cy="120" rx="12" ry="5"/></g>
  </g>
  <g transform="translate(330 126) scale(.62)">
    <rect x="18" y="74" width="5" height="44" fill="#7a4a2a"/><rect x="92" y="74" width="5" height="44" fill="#7a4a2a"/>
    <rect x="10" y="44" width="96" height="34" rx="2" fill="#d9a273"/><rect x="40" y="52" width="16" height="14" fill="#ffd98a"/>
    <path d="M0 46 L58 4 L116 46 Z" fill="#7a3f22"/><path d="M58 4 L48 12 M58 4 L68 12" stroke="#f2a922" stroke-width="3"/>
  </g>
  <g fill="none" stroke-linecap="round"><path d="M170 240 C 166 180 174 128 196 92" stroke="#8a5a34" stroke-width="10"/>
    <g stroke="#3f9a52" stroke-width="8"><path d="M196 92 C 166 78 140 84 122 104"/><path d="M196 92 C 186 64 162 52 140 54"/><path d="M196 92 C 212 64 238 56 260 64"/><path d="M196 92 C 228 84 252 98 264 120"/><path d="M196 92 C 204 108 204 126 196 142"/></g>
    <path d="M1100 230 C 1104 180 1096 140 1076 110" stroke="#8a5a34" stroke-width="8"/>
    <g stroke="#3f9a52" stroke-width="6.5"><path d="M1076 110 C 1050 96 1028 102 1012 120"/><path d="M1076 110 C 1068 84 1046 72 1026 74"/><path d="M1076 110 C 1090 84 1112 76 1132 84"/><path d="M1076 110 C 1104 104 1124 116 1134 136"/></g>
    <path d="M560 196 C 558 166 562 140 574 120" stroke="#8a5a34" stroke-width="6"/>
    <g stroke="#4fab5f" stroke-width="5"><path d="M574 120 C 556 112 542 116 532 128"/><path d="M574 120 C 568 102 554 94 540 96"/><path d="M574 120 C 584 102 600 96 614 102"/><path d="M574 120 C 594 116 606 126 612 140"/></g></g>
  <g fill="#8a5a34"><circle cx="192" cy="100" r="7"/><circle cx="203" cy="102" r="7"/><circle cx="1072" cy="116" r="5.5"/></g>
  <g>${[[60, 300], [120, 312], [420, 292], [470, 306], [760, 300], [1150, 290], [1010, 306]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path d="M0 0 v12" stroke="#3f9a52" stroke-width="2.5"/><g fill="${['#e2553f', '#f2a922', '#ff8fab'][i % 3]}">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-5" rx="3.6" ry="5.2" transform="rotate(${a})"/>`).join('')}</g><circle r="2" fill="#fff3c4"/></g>`).join('')}</g>
</svg>`;
const WAVES = `<svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice">
  <path d="M0 70 C 100 40 200 100 300 70 C 400 40 500 100 600 70 C 700 40 800 100 900 70 C 1000 40 1100 100 1200 70 V220 H0 Z" fill="#3f78c9"/>
  <path d="M0 110 C 100 80 200 140 300 110 C 400 80 500 140 600 110 C 700 80 800 140 900 110 C 1000 80 1100 140 1200 110 V220 H0 Z" fill="#2e5aac"/>
  <path d="M0 150 C 100 120 200 180 300 150 C 400 120 500 180 600 150 C 700 120 800 180 900 150 C 1000 120 1100 180 1200 150 V220 H0 Z" fill="#1f3f86"/>
  <g fill="#f2d7a0" opacity=".85">${Array.from({ length: 24 }, (_, i) => `<circle cx="${25 + i * 50}" cy="${i % 2 ? 128 : 92}" r="3"/>`).join('')}</g>
  <g fill="none" stroke="#f2d7a0" stroke-width="2" opacity=".7">${Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 100} 170 c 10 -14 30 -14 40 0"/>`).join('')}</g>
</svg>`;
const PERAHU = '<svg viewBox="0 0 140 110"><path d="M66 6 V78" stroke="#5a3a24" stroke-width="4"/><path d="M68 10 C 98 26 112 54 114 74 H68 Z" fill="#fff6e6"/><path d="M68 10 C 98 26 112 54 114 74 H96 C 92 52 82 32 68 20 Z" fill="#f2a922"/><path d="M64 18 C 46 34 36 54 34 72 H64 Z" fill="#e2553f"/><path d="M8 78 H132 C 124 96 108 104 88 104 H52 C 32 104 16 96 8 78 Z" fill="#9a5b34"/><path d="M14 84 H126" stroke="#f2a922" stroke-width="4"/><path d="M8 78 C 4 70 6 62 12 58" stroke="#9a5b34" stroke-width="6" fill="none" stroke-linecap="round"/></svg>';
const IKAN = (c1, c2) => `<svg viewBox="0 0 120 60"><path d="M10 30 C 30 6 70 4 92 30 C 70 56 30 54 10 30 Z" fill="${c1}"/><path d="M92 30 L116 12 L110 30 L116 48 Z" fill="${c2}"/><g fill="none" stroke="#fff6e6" stroke-width="2" opacity=".8"><path d="M40 16 c 6 8 6 20 0 28"/><path d="M54 14 c 6 9 6 23 0 32"/><path d="M68 18 c 5 7 5 17 0 24"/></g><circle cx="24" cy="27" r="3.5" fill="#fff6e6"/><circle cx="24" cy="27" r="1.6" fill="#1f2a4a"/></svg>`;
const MOON = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fff3c4"/><circle cx="36" cy="40" r="7" fill="#f2e0a0"/><circle cx="60" cy="62" r="9" fill="#f2e0a0"/><circle cx="62" cy="34" r="4" fill="#f2e0a0"/></svg>';
const KAMPUNG_MALAM = `<svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice">
  <path d="M0 120 C 200 80 400 110 600 90 C 800 70 1000 110 1200 86 V220 H0 Z" fill="#1b2a57"/>
  <g fill="#0f1a3a">
    <path d="M120 150 l50-38 50 38 z"/><rect x="128" y="148" width="84" height="30"/><path d="M134 178v26M206 178v26" stroke="#0f1a3a" stroke-width="5"/>
    <path d="M520 140 l60-46 60 46 z"/><rect x="530" y="138" width="100" height="36"/><path d="M538 174v30M622 174v30" stroke="#0f1a3a" stroke-width="5"/>
    <path d="M900 152 l46-34 46 34 z"/><rect x="908" y="150" width="76" height="28"/><path d="M914 178v26M978 178v26" stroke="#0f1a3a" stroke-width="5"/>
    <path d="M0 204 H1200 V220 H0 Z"/>
  </g>
  <g fill="#ffc94a"><rect x="146" y="156" width="12" height="11" rx="1"/><rect x="182" y="156" width="12" height="11" rx="1"/><rect x="552" y="148" width="14" height="13" rx="1"/><rect x="594" y="148" width="14" height="13" rx="1"/><rect x="938" y="158" width="12" height="10" rx="1"/></g>
  <g fill="none" stroke-linecap="round"><path d="M360 204 C 356 160 364 126 384 100" stroke="#0f1a3a" stroke-width="8"/><g stroke="#0f1a3a" stroke-width="6"><path d="M384 100 C 360 88 340 92 326 108"/><path d="M384 100 C 378 78 360 66 342 68"/><path d="M384 100 C 398 78 418 72 436 78"/><path d="M384 100 C 408 96 426 108 434 126"/></g></g>
</svg>`;
const PELITA = '<svg viewBox="0 0 30 50"><path d="M15 4 C 20 12 21 18 15 24 C 9 18 10 12 15 4 Z" fill="#ffb03a"/><path d="M15 10 C 17 14 17 18 15 21 C 13 18 13 14 15 10 Z" fill="#fff3c4"/><path d="M8 26 H22 L20 40 H10 Z" fill="#b77748"/><rect x="5" y="40" width="20" height="5" rx="2" fill="#7a4a2a"/></svg>';
const KUIH = {
  ketupat: '<svg viewBox="0 0 80 100"><path d="M40 8 L72 46 L40 84 L8 46 Z" fill="#7fbf4f"/><path d="M24 27 L56 65 M56 27 L24 65 M16 37 L48 75 M64 37 L32 75 M32 17 L64 55 M48 17 L16 55" stroke="#5a9a35" stroke-width="3"/><path d="M40 8 L72 46 L40 84 L8 46 Z" fill="none" stroke="#4a8a2a" stroke-width="3"/><path d="M40 84 C 36 92 40 96 44 98 M40 84 C 46 90 42 96 38 99" stroke="#7fbf4f" stroke-width="3" fill="none"/></svg>',
  onde: '<svg viewBox="0 0 80 80"><circle cx="40" cy="42" r="30" fill="#3fa66b"/><circle cx="30" cy="32" r="8" fill="#6fd08f" opacity=".7"/><g fill="#fff6e6">' + Array.from({ length: 14 }, (_, i) => `<rect x="${18 + (i * 37) % 44}" y="${20 + (i * 23) % 44}" width="6" height="2.5" rx="1.2" transform="rotate(${i * 47} ${21 + (i * 37) % 44} ${21 + (i * 23) % 44})"/>`).join('') + '</g></svg>',
  lapis: '<svg viewBox="0 0 90 70"><g transform="skewX(-8)"><rect x="12" y="8" width="70" height="54" rx="6" fill="#ff8fab"/><rect x="12" y="16" width="70" height="7" fill="#fff6e6"/><rect x="12" y="30" width="70" height="7" fill="#e2553f"/><rect x="12" y="44" width="70" height="7" fill="#fff6e6"/><rect x="12" y="8" width="70" height="54" rx="6" fill="none" stroke="#d9667f" stroke-width="2"/></g></svg>',
  serimuka: '<svg viewBox="0 0 90 70"><rect x="10" y="10" width="70" height="26" rx="6" fill="#58b368"/><rect x="10" y="34" width="70" height="26" rx="6" fill="#fff6e6"/><g fill="#e8dcc0">' + Array.from({ length: 9 }, (_, i) => `<ellipse cx="${18 + (i % 5) * 13}" cy="${42 + Math.floor(i / 5) * 9}" rx="3" ry="2"/>`).join('') + '</g></svg>',
};

// Hiasan latar bagi setiap tema (ringan: hanya animasi transform/opacity)
const SCENES = {
  kampung(s) {
    s.append(piece('sun', '', {}));
    [[8, 70], [22, 55], [14, 95]].forEach(([top, dur], i) => s.append(piece('cloud', CLOUD, { top: `${top}%`, animationDuration: `${dur}s`, animationDelay: `${-rnd(0, dur)}s`, width: `${[150, 110, 130][i]}px` })));
    s.append(piece('wau', WAU, {}));
    s.append(piece('land', KAMPUNG, {}));
    for (let i = 0; i < 3; i++) s.append(piece('bird', '<svg viewBox="0 0 30 12"><path d="M2 8 C 8 2 12 2 15 8 C 18 2 22 2 28 8" stroke="#3b4a6b" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>', { top: `${18 + i * 6}%`, animationDuration: `${rnd(28, 40)}s`, animationDelay: `${-rnd(0, 30)}s` }));
  },
  batik(s) {
    s.append(piece('perahu', PERAHU, {}));
    [['#f2a922', '#e2553f'], ['#ff8fab', '#f2a922'], ['#fff6e6', '#9fd4ff']].forEach(([a, b], i) => s.append(piece('ikan', IKAN(a, b), { top: `${22 + i * 18}%`, animationDuration: `${rnd(30, 44)}s`, animationDelay: `${-rnd(0, 40)}s` })));
    s.append(piece('waves', WAVES, {}));
  },
  songket(s) {
    s.append(piece('band top', '', {}), piece('band bottom', '', {}));
    for (let i = 0; i < 18; i++) s.append(piece('spark', '', { left: `${rnd(0, 100)}%`, top: `${rnd(10, 85)}%`, animationDuration: `${rnd(2.5, 5)}s`, animationDelay: `${-rnd(0, 5)}s` }));
  },
  malam(s) {
    for (let i = 0; i < 40; i++) s.append(piece('star', '', { left: `${rnd(0, 100)}%`, top: `${rnd(0, 62)}%`, animationDuration: `${rnd(2, 5)}s`, animationDelay: `${-rnd(0, 5)}s`, transform: `scale(${rnd(0.5, 1.3)})` }));
    s.append(piece('moon', MOON, {}));
    s.append(piece('land', KAMPUNG_MALAM, {}));
    [12, 46, 80].forEach((x, i) => s.append(piece('pelita', PELITA, { left: `${x}%`, animationDelay: `${-i * 0.37}s` })));
  },
  kuih(s) {
    const names = ['ketupat', 'onde', 'lapis', 'serimuka', 'onde', 'ketupat', 'lapis'];
    names.forEach((n, i) => s.append(piece(`kuih k-${n}`, KUIH[n], { left: `${4 + i * 14 + rnd(0, 4)}%`, top: `${rnd(8, 80)}%`, animationDuration: `${rnd(5, 9)}s`, animationDelay: `${-rnd(0, 8)}s`, width: `${rnd(46, 70)}px` })));
  },
  masjid(s) {
    // bulan sabit & bintang, tanglung berayun, siluet masjid dan kilauan
    s.append(piece('crescent', '', {}));
    const lantern = '<svg viewBox="0 0 30 74"><path d="M15 0v14" stroke="#c9a227" stroke-width="1.6"/><path d="M9 14h12l-2 5H11z" fill="#d99400"/><path d="M8 19h14l3 9-3 22H8L5 28z" fill="#ffc531"/><path d="M11 23h8l2 7-2 16h-8l-2-16z" fill="#fff6c9"/><path d="M15 23v23M10 30h10" stroke="#ffc531" stroke-width="1.2"/><path d="M8 50h14l-3 5h-8z" fill="#d99400"/><path d="M15 55v6" stroke="#d99400" stroke-width="2" stroke-linecap="round"/></svg>';
    [8, 30, 74, 92].forEach((x, i) => { const l = piece('lantern', '', { left: `${x}%`, animationDelay: `${-i * 0.9}s`, height: `${[70, 52, 60, 46][i]}px` }); l.innerHTML = lantern; s.append(l); });
    for (let i = 0; i < 14; i++) s.append(piece('spark', '', { left: `${rnd(0, 100)}%`, top: `${rnd(5, 70)}%`, animationDuration: `${rnd(2.5, 5)}s`, animationDelay: `${-rnd(0, 5)}s` }));
    const m = piece('mosque', '', {});
    m.innerHTML = '<svg viewBox="0 0 400 130" preserveAspectRatio="xMidYMax meet"><g fill="#fff"><rect x="60" y="78" width="280" height="52"/><path d="M130 80c0-40 30-62 70-70 40 8 70 30 70 70z"/><path d="M196 10l4-12 4 12z"/><path d="M78 80c0-18 12-28 26-31 14 3 26 13 26 31z"/><path d="M270 80c0-18 12-28 26-31 14 3 26 13 26 31z"/><rect x="22" y="40" width="20" height="90"/><path d="M18 40h28l-14-26z"/><rect x="358" y="40" width="20" height="90"/><path d="M354 40h28l-14-26z"/></g><g fill="#a8e4cc"><path d="M186 130v-26a14 14 0 0 1 28 0v26z"/><path d="M110 112a8 8 0 0 1 16 0v18h-16zM274 112a8 8 0 0 1 16 0v18h-16zM150 106a6 6 0 0 1 12 0v12h-12zM238 106a6 6 0 0 1 12 0v12h-12z"/></g></svg>';
    s.append(m);
  },
  klasik() {},
};

export function applyTheme(id) {
  id = LEGACY_THEMES[id] || id;
  if (!THEMES.find((t) => t.id === id)) id = DEFAULT_THEME;
  if (id === current) return;
  current = id;
  const root = document.documentElement;
  root.dataset.theme = id;
  root.classList.toggle('dark-theme', DARK_THEMES.includes(id));
  let s = document.getElementById('scene');
  if (!s) {
    s = document.createElement('div');
    s.id = 'scene';
    s.setAttribute('aria-hidden', 'true');
    document.body.prepend(s);
  }
  s.replaceChildren();
  SCENES[id](s);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = { kampung: '#ffd98a', klasik: '#fff1dc', batik: '#2e5aac', songket: '#7a1f2b', malam: '#142046', kuih: '#cff2dc', masjid: '#7fd8b4' }[id];
}
export const currentTheme = () => current;
