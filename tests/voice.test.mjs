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
console.log(fails ? `\n✗ ${fails} kegagalan` : '\n✓ Ujian suara lulus');
process.exit(fails ? 1 : 0);
