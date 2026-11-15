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
  if (meta) meta.content = { taman: '#8fd3ff', klasik: '#ffb84d', laut: '#3a9bdc', angkasa: '#1b1046', gula: '#ff8fc8' }[id];
}
export const currentTheme = () => current;
