// =====================================================================
//  BOLA GULING — kawal guli dengan menyengetkan telefon
//  Graviti, cerun & momentum; lompat dari ramp, spiral, terowong, bumper,
//  platform bergerak & pulau terapung. Kutip syiling & 3 bintang, kalahkan rekod masa.
//  Kemahiran: koordinasi tangan-mata, konsep awal fizik (graviti, laju, cerun).
// =====================================================================
import { runTiltGame } from './tiltgame.js';
import { makeGuling } from './tiltlevels.js';
import { BALL } from './tiltworld.js';
import { bsfx } from './blocksfx.js';

const INTRO = [
  (n) => (n === 1 ? 'Sengetkan telefon untuk menggolek bola ke pintu penamat. Kutip syiling dan bintang!' : 'Golek bola ke pintu penamat. Bola lebih laju bila menuruni cerun, itu graviti!'),
  (n) => (n === 11 ? 'Pulau terapung! Pecut di atas ramp untuk melompat merentasi jurang.' : 'Pecut sebelum ramp, kemudian lompat! Tunggu platform kayu datang dekat.'),
  (n) => (n === 21 ? 'Kota Spiral! Golek perlahan di dalam spiral, dan hati-hati dengan bumper yang melantun.' : 'Cabaran besar! Spiral, terowong, bumper dan lompatan.'),
];
export default {
  celebrate() { bsfx.celebrate(); },
  play(ctx) {
    return runTiltGame(ctx, {
      id: 'guling', title: 'Bola Guling', cfg: BALL, makeLevel: makeGuling,
      intro: (n) => INTRO[Math.min(2, Math.floor((n - 1) / 10))](n),
      winText: 'Hebat! Bola sampai ke penamat!',
      fallText: () => ['Alamak, bola jatuh! Kita cuba lagi dari bendera.', 'Oops! Senget perlahan-lahan, ya.', 'Hampir! Jom cuba sekali lagi.'][Math.floor(Math.random() * 3)],
      drawBody: (r, b, st) => r.ball(b, st.ori, st.squash, ['#ff5d8f', '#3d8bff', '#9b5cff'][Math.min(2, Math.floor((ctx.n - 1) / 10))]),
    });
  },
};
