// =====================================================================
//  PERCAKAPAN SEMULA JADI — gaya cikgu tadika / ibu bercakap dengan anak
//  Ayat-ayat ringkas yang dipilih secara rawak (tanpa ulangan berturut-turut)
//  supaya aplikasi tidak kedengaran seperti mesin membaca skrip.
// =====================================================================
export const TALK = {
  // penyambung antara soalan
  next: ['Okey, jom seterusnya.', 'Jom sambung.', 'Bagus. Sekarang, yang ini pula.', 'Seterusnya, ya.'],
  last: ['Satu lagi, ini yang terakhir!', 'Yang terakhir, jom!', 'Tinggal satu lagi!'],
  // selepas jawapan salah (selepas menyebut apa yang dipilih)
  notThis: ['Bukan yang itu.', 'Hmm, bukan yang itu.'],
  retry: ['Cuba lagi, ya.', 'Cuba sekali lagi.', 'Tak apa, cuba lagi.', 'Cuba yang lain pula, ya.'],
  // petunjuk selepas dua kali salah
  hint: ['Cuba tengok yang ini.', 'Psst, cuba yang bersinar itu.'],
  // anak diam terlalu lama
  idle: ['Tak apa, ambil masa. Cuba pilih satu, ya.', 'Kamu boleh. Cuba tekan satu.', 'Jom, cuba dulu. Salah pun tak apa.'],
  // level selesai
  doneAll: ['Wah, semua betul! Terbaik!', 'Hebatnya, semua betul!', 'Semua betul! Pandai sungguh.'],
  done: ['Dah siap! Pandainya kamu.', 'Tahniah, level ini selesai. Kamu makin pandai!', 'Syabas, dah habis satu level!'],
  doneName: (name) => [`Pandainya, ${name}!`, `Terbaik, ${name}!`],
};

// Pilih rawak tanpa mengulang pilihan terakhir bagi senarai yang sama
const lastPick = new Map();
export function pick(list) {
  if (!list.length) return '';
  if (list.length === 1) return list[0];
  let x;
  do { x = list[Math.floor(Math.random() * list.length)]; } while (x === lastPick.get(list));
  lastPick.set(list, x);
  return x;
}

// Gema jawapan: hanya untuk nama/label ringkas (bukan ayat panjang)
export function echoable(say) {
  if (!say) return '';
  const t = String(say).trim().replace(/[.!?]+$/, '');
  return t.length && t.length <= 24 ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}
