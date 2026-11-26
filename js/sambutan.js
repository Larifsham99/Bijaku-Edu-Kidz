// =====================================================================
//  VERSI KESAN BUNYI: hanya pujian dan pujukan di bawah yang disebut.
//  Ucapan pembuka, arahan, soalan, nama objek, cerita dan doa dipaparkan sebagai teks sahaja.
//  Untuk menghidupkan semula ucapan pembuka, tambah GREETINGS ke dalam ALLOWED.
//  Semua ayat ini dimainkan daripada rakaman; suara peranti tidak digunakan.
// =====================================================================
import { PRAISE, ISLAMIC_PRAISE, ENCOURAGE, ISLAMIC_ENCOURAGE } from './data/content.js';
import { TALK } from './talk.js';
import { normalizeMalay, splitSentences, clipKey } from './malay-text.js';

// Ucapan pembuka (tidak disebut buat masa ini)
export const GREETINGS = [
  'Assalamualaikum!', 'Hai!', 'Selamat pagi.', 'Selamat tengah hari.', 'Selamat petang.', 'Selamat malam.',
  'Jom belajar sambil bermain!', 'Selamat datang ke Cilik Racing!', 'Jom, kita mula!',
];
// Ucapan apabila berjaya
export const CELEBRATIONS = [...PRAISE, ...ISLAMIC_PRAISE, ...TALK.doneAll, ...TALK.done, 'Alhamdulillah!', 'Yeay!', 'Cantiknya!', 'Pandainya!'];

// Pujukan apabila jawapan salah berulang atau anak lama diam (rentak versi asal:
// salah kali pertama hanya bunyi "boing"; suara pujukan bermula selepas itu)
export const COAXING = [...ENCOURAGE, ...ISLAMIC_ENCOURAGE, ...TALK.retry, ...TALK.hint, ...TALK.idle];

const bare = (t) => clipKey(t).replace(/[.!?,]+$/, '');
const sentences = (t) => splitSentences(normalizeMalay(t, { letters: false }));
const ALLOWED = new Set([...CELEBRATIONS, ...COAXING].flatMap(sentences).map(bare));

// "Assalamualaikum, Kakak!" -> "Assalamualaikum!" (nama tidak dirakam)
const dropName = (s) => s.replace(/^(assalamualaikum|hai|selamat (?:pagi|tengah hari|petang|malam)),? .*$/i, '$1!');

export const isAllowed = (sentence) => ALLOWED.has(bare(sentence));
// Ayat yang boleh disebut daripada satu teks
export function greetingParts(text) {
  return sentences(text).map(dropName).filter(isAllowed);
}
// Masa membaca teks senyap, supaya cerita dan langkah tidak bertukar terlalu cepat
export const readingMs = (text) => Math.min(4000, 500 + String(text).length * 45);
