// Katalog permainan BIJAKU: 15 permainan asal + modul berasingan, disusun ikut rak kategori.
import { h } from '../ui.js';
import { go } from '../nav.js';
import { MODES } from '../modes/index.js';
import { modeArt } from '../data/modeart.js';
import { settings, levelsDone } from '../store.js';
import { speak, sfx } from '../audio.js';
import { icon } from '../icons.js';
import { GAMES } from '../games/registry.js';

// Modul berasingan (storan & enjin sendiri)
export const EXTRAS = {
  akhlak: { id: 'akhlak', n: 'Taman Akhlak', c: '#ff5fa2', img: 'visual-assets/akhlak/kebun.svg', sub: 'Pilih yang baik, kebun pun mekar!', route: '/akhlak', cls: 'ak-entry', bg: ['#ff8a5b', '#ff4d8d', '#b8326a'] },
  lumba: { id: 'lumba', n: 'Cilik Racing', c: '#3d6bff', img: 'visual-assets/racing/kereta.png', sub: 'Belajar, Pecut, Teroka!', route: '/lumba', cls: '', say: 'Cilik Racing!', bg: ['#4fc3ff', '#3d6bff', '#2a3fb0'] },
  silang: { id: 'silang', n: 'Teka Silang Cilik', c: '#ff9f1c', img: 'visual-assets/tekasilang/papan.svg', sub: 'Susun huruf, cari jawapan!', route: '/silang', cls: 'ts-entry', bg: ['#ffc94d', '#ff8a1f', '#c25e00'] },
};

// Permainan baharu Fasa 2+ (rangka kongsi js/games)
Object.values(GAMES).forEach((g) => { EXTRAS[g.id] = { id: g.id, n: g.n, c: g.c, img: g.img, sub: g.sub, route: `/g/${g.id}`, cls: '', bg: g.bg, isNew: true }; });

export const SHELVES = [
  { t: 'Aksi 3D', ids: ['guling', 'imbang', 'lompat', 'bina'] },
  { t: 'Huruf & Nombor', ids: ['abc', 'nombor', 'kedai', 'kelas', 'silang'] },
  { t: 'Islam & Akhlak', ids: ['soleh', 'wuduk', 'akhlak'] },
  { t: 'Minda Pintar', ids: ['robot', 'puzzle', 'ingatan', 'bayang', 'minda', 'maze'] },
  { t: 'Kreatif & Bunyi', ids: ['warna', 'seni', 'bunyi'] },
  { t: 'Sains & Dunia Sekeliling', ids: ['makmal', 'pemburu', 'harian', 'haiwan', 'misi', 'lumba'] },
];

export const ALL_IDS = SHELVES.flatMap((s) => s.ids);

export const isOff = (id) => settings().disabledModes.includes(id);

export function gameInfo(id, p) {
  const x = EXTRAS[id];
  if (x) return { ...x, extra: true, done: null };
  const m = MODES[id];
  return { id, n: m.n, c: m.c, mode: m, done: levelsDone(p, id), route: '/mod/' + id };
}

export function openGame(g) {
  sfx.tap();
  if (isOff(g.id)) { speak('Permainan ini sedang dikunci oleh ibu bapa.'); return; }
  if (g.extra) { if (g.say) speak(g.say); } else speak(g.n);
  go(g.route);
}

export function gameArt(g, cls = '') {
  if (g.extra) return h('img', { class: `bj-art ${cls}`, src: g.img, alt: '' });
  const a = modeArt(g.mode);
  a.classList.add('bj-art'); if (cls) a.classList.add(cls);
  return a;
}

export const lockIc = () => h('span', { class: 'lock-ic' }, icon('lock'));
