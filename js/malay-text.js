// =====================================================================
//  PENORMAL TEKS BAHASA MELAYU UNTUK PERTUTURAN
//  Menukar nombor, tarikh, masa, mata wang, peratus, pecahan, ordinal,
//  singkatan dan simbol kepada bentuk bacaan Bahasa Melayu Malaysia.
// =====================================================================
const SATU = ['kosong', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan'];
const BULAN = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

// 0 – 999 999 999 999 kepada perkataan
export function nombor(n) {
  n = Math.floor(Math.abs(Number(n)));
  if (!Number.isFinite(n)) return '';
  if (n < 10) return SATU[n];
  if (n === 10) return 'sepuluh';
  if (n === 11) return 'sebelas';
  if (n < 20) return `${SATU[n - 10]} belas`;
  if (n < 100) { const p = Math.floor(n / 10), s = n % 10; return `${SATU[p]} puluh${s ? ' ' + SATU[s] : ''}`; }
  const besar = [[1e9, 'bilion'], [1e6, 'juta'], [1e3, 'ribu'], [100, 'ratus']];
  for (const [v, w] of besar) {
    if (n >= v) {
      const q = Math.floor(n / v), r = n % v;
      // seratus, seribu (bukan "satu ratus"); tetapi "satu juta", "satu bilion"
      const head = q === 1 && (v === 100 || v === 1e3) ? `se${w}` : `${nombor(q)} ${w}`;
      return r ? `${head} ${nombor(r)}` : head;
    }
  }
  return String(n);
}

// ke-1 -> pertama, ke-2 -> kedua
export function ordinal(n) {
  n = Number(n);
  return n === 1 ? 'pertama' : `ke${nombor(n)}`;
}

const SINGKATAN = [
  [/\bdll\b\.?/gi, 'dan lain-lain'], [/\bdsb\b\.?/gi, 'dan sebagainya'], [/\bcth\b\.?/gi, 'contoh'], [/\bspt\b\.?/gi, 'seperti'],
  [/\byg\b/gi, 'yang'], [/\bdgn\b/gi, 'dengan'], [/\btdk\b/gi, 'tidak'], [/\bkpd\b/gi, 'kepada'], [/\bsbg\b/gi, 'sebagai'],
  [/\bDr\./g, 'Doktor'], [/\bEn\./g, 'Encik'], [/\bPn\./g, 'Puan'], [/\bCik\./g, 'Cik'], [/\bSdn\.? Bhd\.?/g, 'Sendirian Berhad'],
  [/\bNo\.\s?(?=\d)/g, 'nombor '], [/\bm\.s\.\b/gi, 'muka surat'], [/\bOK\b/g, 'okey'], [/\bTV\b/g, 'televisyen'],
];
// Perkataan yang sering disebut salah oleh enjin suara -> ejaan bunyi
const LEKSIKON = [
  [/\bpuzzle\b/gi, 'pazel'], [/\bdinosaur\b/gi, 'dinosor'],
];
// Nama huruf mengikut sebutan sekolah di Malaysia (KSPK)
export const HURUF = { A: 'ei', B: 'bi', C: 'si', D: 'di', E: 'i', F: 'ef', G: 'ji', H: 'heish', I: 'ai', J: 'jei', K: 'kei', L: 'el', M: 'em', N: 'en', O: 'o', P: 'pi', Q: 'kiu', R: 'ar', S: 'es', T: 'ti', U: 'yu', V: 'vi', W: 'dabel yu', X: 'eks', Y: 'wai', Z: 'zed' };
// Kekalkan huruf besar di awal perkataan semasa menggantikan
const keepCase = (src, w) => (src[0] === src[0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w);
const UNIT = [[/(\d)\s?kg\b/g, '$1 kilogram'], [/(\d)\s?km\b/g, '$1 kilometer'], [/(\d)\s?cm\b/g, '$1 sentimeter'], [/(\d)\s?ml\b/g, '$1 mililiter']];

// Huruf tunggal -> nama huruf (untuk suara peranti / skrip ElevenLabs)
export const letterize = (s) => String(s).replace(/(^|[\s,(“"'])([A-Za-z])(?=$|[\s,!?;:)”"']|\.(?![A-Za-z]))/g, (m, pre, c) => pre + HURUF[c.toUpperCase()]);

// letters: false -> kekalkan huruf asal (kunci rakaman pek suara tidak berubah)
export function normalizeMalay(input, { letters = true } = {}) {
  let t = String(input);
  // emoji & simbol hiasan
  t = t.replace(/[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu, '');
  // ejaan Arab-Melayu bersempang
  t = t.replace(/Masya-Allah/g, 'Masya Allah').replace(/Insya-Allah/g, 'Insya Allah');
  for (const [re, w] of SINGKATAN) t = t.replace(re, w);
  for (const [re, w] of LEKSIKON) t = t.replace(re, (m) => keepCase(m, w));
  for (const [re, w] of UNIT) t = t.replace(re, w);
  // tarikh: 17/11/2026, 17-11-2026, 2026-11-17
  t = t.replace(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g, (m, y, mo, d) => `${nombor(d)} ${BULAN[mo - 1] || mo} ${nombor(y)}`);
  t = t.replace(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/g, (m, d, mo, y) => (mo >= 1 && mo <= 12 ? `${nombor(d)} ${BULAN[mo - 1]} ${nombor(y)}` : m));
  // masa: 8:30, 8.30 pagi
  // "pukul" hanya ditambah jika belum ada sebelumnya
  t = t.replace(/(\bpukul\s+)?\b(\d{1,2})[:.](\d{2})\s?(pagi|petang|malam|tengah hari)\b/gi, (m, pk, h, mi, w) => `${pk || 'pukul '}${nombor(h)}${+mi ? ' ' + nombor(mi) : ''} ${w}`);
  t = t.replace(/(\bpukul\s+)?\b(\d{1,2}):(\d{2})\b/gi, (m, pk, h, mi) => `${pk || 'pukul '}${nombor(h)}${+mi ? ' ' + nombor(mi) : ''}`);
  // mata wang: RM5, RM 12.50
  t = t.replace(/\bRM\s?(\d+)(?:\.(\d{1,2}))?\b/g, (m, r, s) => `${nombor(r)} ringgit${s && +s ? ` ${nombor(s.length === 1 ? s * 10 : s)} sen` : ''}`);
  // peratus
  t = t.replace(/(\d+(?:\.\d+)?)\s?%/g, (m, n) => `${n} peratus`);
  // ordinal: ke-3
  t = t.replace(/\bke-(\d+)\b/gi, (m, n) => ordinal(n));
  // pecahan / kemajuan: 1 / 3, 1/3
  t = t.replace(/\b(\d+)\s?\/\s?(\d+)\b/g, (m, a, b) => `${nombor(a)} daripada ${nombor(b)}`);
  // operasi matematik antara nombor
  t = t.replace(/(\d)\s?\+\s?(?=\d)/g, '$1 tambah ').replace(/(\d)\s?[−-]\s?(?=\d)/g, '$1 tolak ').replace(/(\d)\s?[×x]\s?(?=\d)/g, '$1 darab ').replace(/(\d)\s?÷\s?(?=\d)/g, '$1 bahagi ').replace(/\s?=\s?/g, ' sama dengan ');
  // perpuluhan: 1.5 -> satu perpuluhan lima
  t = t.replace(/\b(\d+)\.(\d+)\b/g, (m, a, b) => `${nombor(a)} perpuluhan ${b.split('').map((d) => SATU[d]).join(' ')}`);
  // huruf tunggal (A, b, "huruf E") -> nama huruf Bahasa Melayu Malaysia supaya enjin suara
  // tidak membaca "E" sebagai "e" pepet atau "A" sebagai "ah"
  if (letters) t = letterize(t);
  // nombor bulat (buang pemisah ribu 1,000)
  t = t.replace(/\b\d{1,3}(?:,\d{3})+\b/g, (m) => m.replace(/,/g, ''));
  t = t.replace(/\b\d+\b/g, (m) => nombor(m));
  // simbol lain
  t = t.replace(/&/g, ' dan ').replace(/@/g, ' di ').replace(/[·•➜→|]/g, ',').replace(/[“”"«»]/g, '').replace(/…|\.{3}/g, ', ');
  // Akronim dieja huruf demi huruf; perkataan HURUF BESAR lain -> huruf kecil
  t = t.replace(/\b(ABC|PdPC|KSPK)\b/g, (m) => m.split('').map((c) => (letters ? HURUF[c.toUpperCase()] : c)).join(', '));
  t = t.replace(/\b([A-Z])([A-Z]{2,})\b/g, (m, a, b) => a + b.toLowerCase());
  return t.replace(/\s+([,.!?])/g, '$1').replace(/\s+/g, ' ').trim();
}

// Pecah kepada ayat untuk jeda semula jadi
export function splitSentences(t) {
  const parts = String(t).match(/[^.!?]+[.!?]*/g) || [t];
  return parts.map((x) => x.trim()).filter(Boolean);
}

// Kunci untuk mencari klip audio (huruf kecil, ruang dipadatkan)
export const clipKey = (sentence) => String(sentence).toLowerCase().replace(/\s+/g, ' ').trim();
