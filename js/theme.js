// =====================================================================
//  TEMA: menukar warna & latar beranimasi mengikut pilihan anak
// =====================================================================
import { THEMES, DEFAULT_THEME, FREE_THEMES } from './data/content.js';

let current = null;

// Pastikan profil lama mempunyai medan tema
export function ensureThemeFields(p) {
  if (!p) return;
  p.owned ||= {};
  p.owned.themes ||= [...FREE_THEMES];
  FREE_THEMES.forEach((t) => { if (!p.owned.themes.includes(t)) p.owned.themes.push(t); });
  if (!p.theme || !THEMES.find((t) => t.id === p.theme)) p.theme = DEFAULT_THEME;
}

const rnd = (a, b) => a + Math.random() * (b - a);
const piece = (cls, text, style) => {
  const d = document.createElement('div');
  d.className = 'sc ' + cls;
  if (text) d.textContent = text;
  Object.assign(d.style, style);
  return d;
};

// Hiasan latar bagi setiap tema (ringan: hanya animasi transform/opacity)
const SCENES = {
  taman(s) {
    s.append(piece('sun', '', {}));
    for (let i = 0; i < 4; i++) s.append(piece('cloud', '', { top: `${6 + i * 11}%`, animationDuration: `${rnd(55, 90)}s`, animationDelay: `${-rnd(0, 80)}s`, transform: `scale(${rnd(0.6, 1.2)})` }));
    s.append(piece('hill h1', '', {}), piece('hill h2', '', {}));
    ['🌷', '🌼', '🌻', '🌸', '🍄', '🌷'].forEach((e, i) => s.append(piece('flower emo', e, { left: `${4 + i * 17 + rnd(0, 6)}%`, animationDelay: `${-rnd(0, 3)}s` })));
    ['🦋', '🐝'].forEach((e, i) => s.append(piece('flutter emo', e, { top: `${30 + i * 25}%`, animationDuration: `${rnd(22, 30)}s`, animationDelay: `${-rnd(0, 20)}s` })));
  },
  laut(s) {
    s.append(piece('rays', '', {}));
    ['🐠', '🐟', '🐡', '🐬', '🐢'].forEach((e, i) => s.append(piece('swim emo', e, { top: `${12 + i * 16}%`, animationDuration: `${rnd(26, 42)}s`, animationDelay: `${-rnd(0, 40)}s`, fontSize: `${rnd(26, 44)}px` })));
    for (let i = 0; i < 12; i++) s.append(piece('bubble', '', { left: `${rnd(0, 100)}%`, width: `${rnd(8, 22)}px`, height: '0', paddingBottom: '0', animationDuration: `${rnd(9, 18)}s`, animationDelay: `${-rnd(0, 18)}s` }));
    s.querySelectorAll('.bubble').forEach((b) => { b.style.height = b.style.width; });
    s.append(piece('sand', '', {}));
    ['🌿', '🪸', '🐚', '🌿', '🪸', '⭐'].forEach((e, i) => s.append(piece('weed emo', e, { left: `${3 + i * 17 + rnd(0, 5)}%`, animationDelay: `${-rnd(0, 4)}s` })));
  },
  angkasa(s) {
    for (let i = 0; i < 46; i++) s.append(piece('star', '', { left: `${rnd(0, 100)}%`, top: `${rnd(0, 100)}%`, animationDuration: `${rnd(2, 5)}s`, animationDelay: `${-rnd(0, 5)}s`, transform: `scale(${rnd(0.4, 1.3)})` }));
    s.append(piece('planet emo', '🪐', {}), piece('moon emo', '🌙', {}));
    s.append(piece('drift emo', '🚀', { top: '58%', animationDuration: '38s' }), piece('drift emo', '☄️', { top: '22%', animationDuration: '27s', animationDelay: '-12s' }));
  },
  gula(s) {
    ['🍭', '🍬', '🧁', '🍩', '🍓', '🍬', '🍭', '⭐'].forEach((e, i) => s.append(piece('candy emo', e, { left: `${4 + i * 12 + rnd(0, 4)}%`, top: `${rnd(5, 85)}%`, animationDuration: `${rnd(5, 9)}s`, animationDelay: `${-rnd(0, 8)}s`, fontSize: `${rnd(26, 46)}px` })));
    s.append(piece('drip', '', {}));
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
  if (!THEMES.find((t) => t.id === id)) id = DEFAULT_THEME;
  if (id === current) return;
  current = id;
  document.documentElement.dataset.theme = id;
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
  if (meta) meta.content = { taman: '#8fd3ff', klasik: '#ffb84d', laut: '#3a9bdc', angkasa: '#1b1046', gula: '#ff8fc8', masjid: '#7fd8b4' }[id];
}
export const currentTheme = () => current;
