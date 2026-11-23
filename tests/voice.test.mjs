// Ujian pemilihan suara & penyediaan teks (tanpa pelayar)
import { rankVoices, speechText, splitSentences, isFemaleVoice } from '../js/audio.js';
let fails = 0;
const ok = (c, m) => { console.log(c ? '✓' : '✗', m); if (!c) fails++; };
const V = (name, lang, localService = true) => ({ name, lang, localService, voiceURI: name });

// Edge (Windows/Android): wanita neural mesti mengatasi lelaki neural
let r = rankVoices([V('Microsoft Osman Online (Natural) - Malay (Malaysia)', 'ms-MY', false), V('Microsoft Yasmin Online (Natural) - Malay (Malaysia)', 'ms-MY', false), V('Microsoft Zira - English', 'en-US')]);
ok(r[0].name.includes('Yasmin'), 'Edge: Yasmin (wanita, natural) dipilih berbanding Osman');
ok(!r.find((v) => v.lang === 'en-US'), 'suara Inggeris tidak disenaraikan');
// iPhone: Amira (Dipertingkat)
r = rankVoices([V('Amira', 'ms-MY'), V('Amira (Dipertingkat)', 'ms-MY'), V('Damayanti', 'id-ID')]);
ok(r[0].name === 'Amira (Dipertingkat)', 'iPhone: Amira (Dipertingkat) dipilih');
// Melayu sentiasa didahulukan berbanding Indonesia
r = rankVoices([V('Microsoft Gadis Online (Natural) - Indonesian', 'id-ID', false), V('Malay Malaysia', 'ms-MY')]);
ok(r[0].lang === 'ms-MY', 'Bahasa Melayu didahulukan berbanding Indonesia');
// Hanya Indonesia tersedia: pilih wanita
r = rankVoices([V('Microsoft Ardi Online (Natural) - Indonesian', 'id-ID', false), V('Microsoft Gadis Online (Natural) - Indonesian', 'id-ID', false)]);
ok(r[0].name.includes('Gadis'), 'sandaran Indonesia: Gadis (wanita) dipilih berbanding Ardi');
ok(isFemaleVoice(V('Google female voice', 'ms-MY')) && !isFemaleVoice(V('Google male voice', 'ms-MY')), 'pengesanan "female" tidak tertukar dengan "male"');
// Teks
ok(speechText('Masya-Allah, pandainya! ⭐') === 'Masya Allah, pandainya!', 'emoji dibuang & Masya-Allah dibaca dengan betul');
ok(speechText('Insya-Allah boleh 🤲') === 'Insya Allah boleh', 'Insya-Allah dibaca dengan betul');
const parts = splitSentences('Bismillah. Mari kita cari huruf A! Boleh?');
ok(parts.length === 3 && parts[0] === 'Bismillah.' && parts[2] === 'Boleh?', 'ayat dipecah untuk jeda semula jadi');
ok(splitSentences('Cari huruf A').length === 1, 'ayat tanpa tanda baca kekal satu');
// Penormal teks Bahasa Melayu
const { normalizeMalay: N, nombor } = await import('../js/malay-text.js');
const eq = (inp, out) => ok(N(inp) === out, `"${inp}" → "${N(inp)}"${N(inp) === out ? '' : `  (dijangka: "${out}")`}`);
ok(nombor(0) === 'kosong' && nombor(11) === 'sebelas' && nombor(19) === 'sembilan belas' && nombor(21) === 'dua puluh satu', 'nombor asas');
ok(nombor(100) === 'seratus' && nombor(150) === 'seratus lima puluh' && nombor(1000) === 'seribu' && nombor(2026) === 'dua ribu dua puluh enam', 'ratus & ribu (seratus, seribu)');
ok(nombor(1000000) === 'satu juta' && nombor(250000) === 'dua ratus lima puluh ribu', 'juta & ratus ribu');
eq('Level 25 selesai.', 'Level dua puluh lima selesai.');
eq('Pusingan 1 / 3', 'Pusingan satu daripada tiga');
eq('Harga RM39 sahaja', 'Harga tiga puluh sembilan ringgit sahaja');
eq('RM 12.50', 'dua belas ringgit lima puluh sen');
eq('Diskaun 50%', 'Diskaun lima puluh peratus');
eq('Tarikh 17/11/2026', 'Tarikh tujuh belas November dua ribu dua puluh enam');
eq('Pukul 8:30 pagi', 'Pukul lapan tiga puluh pagi');
eq('Kelas mula 8.30 pagi', 'Kelas mula pukul lapan tiga puluh pagi');
eq('Jumpa 9:00', 'Jumpa pukul sembilan');
eq('Ini kali ke-2', 'Ini kali kedua');
eq('Juara ke-1', 'Juara pertama');
eq('3 + 2 = 5', 'tiga tambah dua sama dengan lima');
eq('Buah, sayur dll.', 'Buah, sayur dan lain-lain');
eq('Main Puzzle Pintar', 'Main Pazel Pintar');
eq('Tekan SEMUA huruf', 'Tekan Semua huruf');
eq('Berat 1.5 kg', 'Berat satu perpuluhan lima kilogram');
eq('Jarak 3km', 'Jarak tiga kilometer');
eq('Hebat! ⭐🎉', 'Hebat!');
eq('Jom main ABC Ceria!', 'Jom main ei, bi, si Ceria!');
// nama huruf ikut sebutan sekolah Malaysia
eq('Ini huruf E. Mana satu lagi huruf E?', 'Ini huruf i. Mana satu lagi huruf i?');
eq('Tekan semua huruf vokal. A, E, I, O, U.', 'Tekan semua huruf vokal. ei, i, ai, o, yu.');
eq('Cari huruf W.', 'Cari huruf dabel yu.');
eq('Huruf H dan huruf K.', 'Huruf heish dan huruf kei.');
eq('Allah s.w.t. Maha Esa', 'Allah s.w.t. Maha Esa');

console.log(fails ? `\n✗ ${fails} kegagalan` : '\n✓ Ujian suara lulus');
process.exit(fails ? 1 : 0);
