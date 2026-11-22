// =====================================================================
//  DAFTAR PERMAINAN BAHARU BIJAKU (Fasa 2+)
//  Maklumat ringan sahaja; kod permainan dimuat secara malas (load()).
//  Laluan: #/g/<id> (peta level) · #/g/<id>/<n> (main level n)
// =====================================================================
export const GAME_LEVELS = 30;

export const GAMES = {
  kedai: {
    id: 'kedai', n: 'Kedai Runcit Cilik', c: '#ff8a3d', img: 'visual-assets/games/kedai.svg',
    sub: 'Jual, kira & bayar dengan Ringgit!', bg: ['#ffc15a', '#ff7a2f', '#b8480c'],
    chapters: ['Bayar Tepat', 'Duit Kertas RM1, RM5 & RM10', 'Jumlah Dua Barang'],
    load: () => import('./kedai.js'),
  },
  makmal: {
    id: 'makmal', n: 'Makmal Cilik', c: '#18b7c9', img: 'visual-assets/games/makmal.svg',
    sub: 'Campur warna, timbul tenggelam & magnet!', bg: ['#5fe0e8', '#16a7c2', '#0b6d84'],
    chapters: ['Campur Warna', 'Timbul atau Tenggelam?', 'Kuasa Magnet'],
    load: () => import('./makmal.js'),
  },
  wuduk: {
    id: 'wuduk', n: 'Jom Berwuduk', c: '#2f9eea', img: 'visual-assets/games/wuduk.svg',
    sub: 'Ikut langkah wuduk dengan tertib', bg: ['#7fd0ff', '#2f8fe8', '#1a5aa8'],
    chapters: ['Ikut Langkah', 'Susun Tertib', 'Apa Seterusnya?'],
    load: () => import('./wuduk.js'),
  },
  robot: {
    id: 'robot', n: 'Robot Kod Cilik', c: '#7c5cff', img: 'visual-assets/games/robot.svg',
    sub: 'Susun anak panah, robot pun bergerak!', bg: ['#a98bff', '#7048e8', '#432a9e'],
    chapters: ['Langkah Pertama', 'Elak Halangan', 'Kutip Bateri'],
    load: () => import('./robot.js'),
  },
};
export const GAME_IDS = Object.keys(GAMES);
export const chapterOf = (n) => Math.min(2, Math.floor((n - 1) / 10));
