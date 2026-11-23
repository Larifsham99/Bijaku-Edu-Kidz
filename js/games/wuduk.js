// =====================================================================
//  JOM BERWUDUK — langkah wuduk ikut tertib (amalan mazhab Syafie di Malaysia)
//  Rukun (wajib): niat, basuh muka, basuh kedua tangan hingga siku,
//  sapu sebahagian kepala, basuh kedua kaki hingga buku lali, tertib.
//  Sunat yang diajar: Bismillah, basuh tapak tangan, berkumur, masuk air ke hidung,
//  sapu telinga, ulang tiga kali, dahulukan kanan, doa selepas wuduk.
//  Watak ialah kanak-kanak biasa (bukan gambaran nabi).
//  Bab 1: ikut langkah · Bab 2: susun tertib · Bab 3: apa seterusnya / yang mana wajib
// =====================================================================
import { h, clear } from '../ui.js';
import { icon } from '../icons.js';
import { sfx, speak } from '../audio.js';
import { artSvg } from '../tekasilang/art.js';

const BISMILLAH = 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ';
const DOA_AR = 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ';
const DOA_RUMI = 'Asyhadu an la ilaha illallah wahdahu la syarika lah, wa asyhadu anna Muhammadan abduhu wa rasuluh.';
const DOA_MAKNA = 'Aku bersaksi bahawa tiada Tuhan melainkan Allah yang Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahawa Nabi Muhammad hamba-Nya dan pesuruh-Nya.';

// part = bahagian badan pada watak; wajib = rukun wuduk
export const STEPS = [
  { id: 'bismillah', n: 'Baca Bismillah', say: 'Mula dengan membaca Bismillah.', art: 'bism', taps: 1 },
  { id: 'tapak', n: 'Basuh tapak tangan', say: 'Basuh kedua-dua tapak tangan, tiga kali.', part: 'tapak', art: 'tangan', taps: 3 },
  { id: 'kumur', n: 'Berkumur', say: 'Berkumur-kumur, tiga kali.', part: 'mulut', art: 'mulut', taps: 3 },
  { id: 'hidung', n: 'Masukkan air ke hidung', say: 'Masukkan sedikit air ke hidung, kemudian hembus. Tiga kali.', part: 'hidung', art: 'hidung', taps: 3 },
  { id: 'muka', n: 'Basuh muka & berniat', say: 'Basuh muka tiga kali, sambil berniat di dalam hati: Sahaja aku mengangkat hadas kecil kerana Allah Taala.', part: 'muka', art: 'muka', taps: 3, wajib: true },
  { id: 'tangankanan', n: 'Basuh tangan kanan hingga siku', say: 'Basuh tangan kanan hingga ke siku, tiga kali.', part: 'tanganKanan', art: 'siku', taps: 3, wajib: true },
  { id: 'tangankiri', n: 'Basuh tangan kiri hingga siku', say: 'Sekarang tangan kiri pula, hingga ke siku. Tiga kali.', part: 'tanganKiri', art: 'siku', flip: true, taps: 3, wajib: true },
  { id: 'kepala', n: 'Sapu sebahagian kepala', say: 'Sapu sebahagian kepala dengan tangan yang basah.', part: 'kepala', art: 'kepala', taps: 3, wajib: true },
  { id: 'telinga', n: 'Sapu telinga', say: 'Sapu kedua-dua telinga.', part: 'telinga', art: 'telinga', taps: 3 },
  { id: 'kakikanan', n: 'Basuh kaki kanan hingga buku lali', say: 'Basuh kaki kanan hingga ke buku lali, tiga kali.', part: 'kakiKanan', art: 'kaki', taps: 3, wajib: true },
  { id: 'kakikiri', n: 'Basuh kaki kiri hingga buku lali', say: 'Akhir sekali, kaki kiri hingga ke buku lali. Tiga kali.', part: 'kakiKiri', art: 'kaki', flip: true, taps: 3, wajib: true },
  { id: 'doa', n: 'Baca doa selepas wuduk', say: 'Wuduk sudah selesai. Jom baca doa selepas wuduk.', art: 'tadah', taps: 1 },
];
const BISM_SVG = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="8" y="22" width="84" height="56" rx="14" fill="#2f9e6a"/><rect x="14" y="28" width="72" height="44" rx="10" fill="#fff9db"/><text x="50" y="58" text-anchor="middle" font-family="Amiri, Noto Naskh Arabic, serif" font-size="17" fill="#2f9e6a">بِسْمِ اللهِ</text></svg>`;
const stepArt = (s, size = 64) => (s.art === 'bism' ? BISM_SVG.replace('<svg ', `<svg width="${size}" height="${size}" `) : artSvg(s.art, { size }).replace('<svg ', s.flip ? '<svg style="transform:scaleX(-1)" ' : '<svg '));

// Watak kanak-kanak (pandangan depan: tangan KANAN watak berada di sebelah KIRI skrin)
const KID = `<svg class="wd-kid" viewBox="0 0 200 330" aria-label="Kanak-kanak sedang berwuduk">
  <ellipse cx="100" cy="322" rx="70" ry="7" fill="#000" opacity=".12"/>
  <g data-part="kakiKanan" class="wd-part"><rect x="70" y="250" width="24" height="56" rx="10" fill="#f8cfa8"/><path d="M62 306q0-12 12-12h20v16H66q-4 0-4-4z" fill="#f8cfa8"/><rect x="70" y="250" width="24" height="26" rx="6" fill="#ffffff" opacity=".9"/></g>
  <g data-part="kakiKiri" class="wd-part"><rect x="106" y="250" width="24" height="56" rx="10" fill="#f8cfa8"/><path d="M138 306q0-12-12-12h-20v16h28q4 0 4-4z" fill="#f8cfa8"/><rect x="106" y="250" width="24" height="26" rx="6" fill="#ffffff" opacity=".9"/></g>
  <path d="M64 150h72l8 112H56z" fill="#e9ecef"/><path d="M64 150h72l8 112H56z" fill="url(#wdKain)"/>
  <path d="M56 116q44-20 88 0l6 70H50z" fill="#2fb380"/><path d="M100 106v40" stroke="#1f8a5f" stroke-width="3"/><circle cx="100" cy="122" r="2.6" fill="#ffd43b"/><circle cx="100" cy="134" r="2.6" fill="#ffd43b"/>
  <g data-part="tanganKanan" class="wd-part"><path d="M58 120q-22 14-26 60" stroke="#2fb380" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M33 168q-3 18 0 36" stroke="#f8cfa8" stroke-width="18" stroke-linecap="round" fill="none"/></g>
  <g data-part="tanganKiri" class="wd-part"><path d="M142 120q22 14 26 60" stroke="#2fb380" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M167 168q3 18 0 36" stroke="#f8cfa8" stroke-width="18" stroke-linecap="round" fill="none"/></g>
  <g data-part="tapak" class="wd-part"><circle cx="33" cy="212" r="14" fill="#f8cfa8"/><circle cx="167" cy="212" r="14" fill="#f8cfa8"/></g>
  <rect x="90" y="92" width="20" height="18" fill="#f2c193"/>
  <g data-part="telinga" class="wd-part"><ellipse class="wd-hit" cx="52" cy="62" rx="14" ry="18" fill="transparent"/><ellipse class="wd-hit" cx="148" cy="62" rx="14" ry="18" fill="transparent"/><ellipse cx="56" cy="62" rx="9" ry="13" fill="#f2c193"/><ellipse cx="144" cy="62" rx="9" ry="13" fill="#f2c193"/></g>
  <g data-part="muka" class="wd-part"><ellipse cx="100" cy="62" rx="44" ry="42" fill="#f8cfa8"/></g>
  <g data-part="kepala" class="wd-part"><path d="M56 56q0-46 44-46t44 46q-10-22-44-24-34 2-44 24z" fill="#3b2a1e"/></g>
  <circle cx="82" cy="60" r="6" fill="#2b2350"/><circle cx="118" cy="60" r="6" fill="#2b2350"/><circle cx="84" cy="58" r="2" fill="#fff"/><circle cx="120" cy="58" r="2" fill="#fff"/>
  <ellipse cx="72" cy="76" rx="7" ry="4" fill="#ff8fab" opacity=".55"/><ellipse cx="128" cy="76" rx="7" ry="4" fill="#ff8fab" opacity=".55"/>
  <g data-part="hidung" class="wd-part"><circle class="wd-hit" cx="100" cy="72" r="11" fill="transparent"/><ellipse cx="100" cy="72" rx="6" ry="5" fill="#eab28a"/></g>
  <g data-part="mulut" class="wd-part"><ellipse class="wd-hit" cx="100" cy="90" rx="18" ry="9" fill="transparent"/><path d="M88 84q12 12 24 0" fill="#e8596e"/><path d="M88 84q12 6 24 0" fill="#fff"/></g>
  <defs><linearGradient id="wdKain" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4dabf7" stop-opacity=".25"/><stop offset="1" stop-color="#1c7ed6" stop-opacity=".35"/></linearGradient></defs>
</svg>`;
const PAIP = '<svg class="wd-paip" viewBox="0 0 100 100" aria-hidden="true"><rect x="0" y="18" width="62" height="18" rx="6" fill="#adb5bd"/><rect x="48" y="18" width="18" height="38" rx="6" fill="#ced4da"/><rect x="22" y="6" width="18" height="14" rx="4" fill="#4dabf7"/><path d="M57 56v40" stroke="#74c0fc" stroke-width="9" stroke-linecap="round" opacity=".85" class="wd-stream"/></svg>';

export function makeLevel(n, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  if (ch === 0) {
    const ranges = [[0, 3], [4, 6], [7, 11], [0, 6], [4, 11], [0, 11], [0, 11], [0, 11], [0, 11], [0, 11]];
    const [a, b] = ranges[k];
    return { kind: 'ikut', steps: STEPS.slice(a, b + 1), markWajib: k >= 6 };
  }
  if (ch === 1) {
    const len = Math.min(8, 3 + Math.floor(k / 2));
    return { kind: 'susun', rounds: [0, 1].map(() => { const st = rng.int(0, STEPS.length - len); return STEPS.slice(st, st + len); }) };
  }
  if (k < 5) {
    const idx = rng.sample(Array.from({ length: STEPS.length - 1 }, (_, i) => i), 4);
    return { kind: 'seterusnya', rounds: idx.map((i) => ({ cur: STEPS[i], ans: STEPS[i + 1], opts: rng.shuffle([STEPS[i + 1], ...rng.sample(STEPS.filter((s, j) => j !== i + 1 && j !== i), 2)]) })) };
  }
  const wajib = STEPS.filter((s) => s.wajib), sunat = STEPS.filter((s) => !s.wajib && s.part);
  return { kind: 'wajib', rounds: rng.sample(wajib, 4).map((w) => ({ ans: w, opts: rng.shuffle([w, ...rng.sample(sunat, 2)]) })) };
}

export default {
  play(ctx) {
    const { n, rng, stage, later } = ctx;
    const lv = makeLevel(n, rng);
    if (lv.kind === 'ikut') guided(lv); else if (lv.kind === 'susun') arrange(lv); else quiz(lv);

    // ---------- Bab 1: ikut langkah ----------
    function guided(lv) {
      ctx.rounds(lv.steps.length);
      let si = 0, count = 0;
      const kidBox = h('div', { class: 'wd-kidbox', html: KID + PAIP });
      const drops = h('div', { class: 'wd-drops' });
      kidBox.appendChild(drops);
      const card = h('div', { class: 'wd-card' });
      const list = h('ol', { class: 'wd-list' }, ...lv.steps.map((s) => h('li', { class: s.wajib && lv.markWajib ? 'wajib' : '' }, h('span', { class: 'wd-li-art', html: stepArt(s, 30) }), s.n)));
      stage.append(h('div', { class: 'wd-room' }, h('div', { class: 'wd-left' }, kidBox), h('div', { class: 'wd-right' }, card, list)));
      const parts = () => [...kidBox.querySelectorAll('.wd-part')];
      kidBox.addEventListener('click', (e) => {
        const s = lv.steps[si];
        if (!s?.part) return;
        // jari kanak-kanak besar: terima sentuhan berhampiran bahagian yang diminta (hidung/mulut kecil)
        const want = kidBox.querySelector(`.wd-part[data-part="${s.part}"]`);
        if (want) {
          const near = [...want.children].some((sh) => { const r = sh.getBoundingClientRect(); const pad = Math.max(16, Math.min(r.width, r.height) * 0.5); return e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad; });
          if (near) { splash(want); return; }
        }
        const part = e.target.closest('.wd-part');
        if (!part) return;
        if (part.dataset.part !== s.part) { sfx.bump(); ctx.miss({ quiet: true }); ctx.say(`Bukan di situ. ${s.n}.`, 'galakan'); return; }
        splash(part);
      });
      function splash(part) {
        const s = lv.steps[si];
        count++;
        sfx.drop();
        const kr = kidBox.getBoundingClientRect(), pr = part.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
          const d = h('i', { class: 'wd-drop', style: `left:${pr.left - kr.left + pr.width * (0.2 + 0.6 * Math.random())}px;top:${pr.top - kr.top + pr.height * Math.random() * 0.6}px;animation-delay:${i * 0.04}s` });
          drops.appendChild(d); later(() => d.remove(), 900);
        }
        part.classList.remove('wet'); void part.getBoundingClientRect(); part.classList.add('wet');
        const chip = card.querySelector('.wd-count b'); if (chip) chip.textContent = `${count}/${s.taps}`;
        if (count >= s.taps) stepDone();
        else speak(['Satu', 'Dua', 'Tiga'][count - 1]);
      }
      function stepDone() {
        const s = lv.steps[si];
        list.children[si]?.classList.add('done');
        sfx.correct();
        si++;
        if (si >= lv.steps.length) { ctx.good({ speakIt: false }); ctx.say('Alhamdulillah, wuduk kamu sudah sempurna!', 'pujian'); later(() => ctx.done(), 1200); return; }
        later(showStep, s.part ? 500 : 200);
      }
      function showStep() {
        const s = lv.steps[si];
        count = 0;
        ctx.round(si);
        [...list.children].forEach((li, i) => li.classList.toggle('cur', i === si));
        parts().forEach((p) => p.classList.toggle('glow', p.dataset.part === s.part));
        kidBox.classList.toggle('water', !!s.part);
        clear(card);
        card.append(h('div', { class: 'wd-card-head' }, h('span', { class: 'wd-card-art', html: stepArt(s, 56) }), h('div', {}, h('small', {}, `Langkah ${STEPS.indexOf(s) + 1}`), h('b', {}, s.n), s.wajib && lv.markWajib ? h('span', { class: 'wd-wajib' }, 'WAJIB') : null)));
        if (s.id === 'bismillah') {
          card.append(h('button', { class: 'wd-say ar', type: 'button', lang: 'ar', dir: 'rtl', onclick: () => { speak('Bismillahirrahmanirrahim', { mood: 'tenang' }); later(stepDone, 1200); } }, BISMILLAH));
        } else if (s.id === 'doa') {
          card.append(h('div', { class: 'wd-doa' }, h('div', { class: 'ar', lang: 'ar', dir: 'rtl' }, DOA_AR), h('div', { class: 'wd-rumi' }, DOA_RUMI), h('div', { class: 'wd-makna' }, `“${DOA_MAKNA}”`), h('small', {}, 'Sumber: Hadis riwayat Muslim')),
            h('button', { class: 'wd-say', type: 'button', onclick: () => { speak(`Maksudnya, ${DOA_MAKNA}`, { mood: 'tenang' }); later(stepDone, 1500); } }, icon('sound'), 'Baca doa'));
        } else {
          card.append(h('div', { class: 'wd-count' }, 'Tekan bahagian yang bercahaya ', h('b', {}, `0/${s.taps}`)));
          if (s.id === 'muka') card.append(h('div', { class: 'wd-niat' }, h('small', {}, 'Niat di dalam hati'), 'Sahaja aku mengangkat hadas kecil kerana Allah Taala.'));
        }
        ctx.say(si === 0 && n === 1 ? `Jom belajar berwuduk! ${s.say}` : s.say);
      }
      globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => {
        const s = lv.steps[si]; if (!s) return;
        if (!s.part) { stepDone(); return; }
        const part = parts().find((p) => p.dataset.part === s.part);
        for (let i = count; i < s.taps; i++) splash(part);
      });
      showStep();
    }

    // ---------- Bab 2: susun tertib ----------
    function arrange(lv) {
      ctx.rounds(lv.rounds.length);
      let ri = 0;
      const startR = () => {
        clear(stage); ctx.round(ri);
        const seq = lv.rounds[ri];
        let placed = 0;
        const slots = h('div', { class: 'wd-slots' }, ...seq.map((_, i) => h('div', { class: 'wd-slot' }, h('span', { class: 'wd-no' }, i + 1))));
        const cards = rng.shuffle(seq);
        const pile = h('div', { class: 'wd-pile' }, ...cards.map((s) => h('button', { class: 'wd-sc', type: 'button', 'aria-label': s.n, onclick: (e) => place(s, e.currentTarget) }, h('span', { html: stepArt(s, 54) }), h('small', {}, s.n))));
        stage.append(h('div', { class: 'wd-arr' }, h('div', { class: 'wd-arr-q' }, 'Susun langkah wuduk ikut tertib'), slots, pile));
        const place = (s, el) => {
          if (el.classList.contains('used')) return;
          if (s !== seq[placed]) { ctx.miss(); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); ctx.say(`Belum lagi. Apa langkah nombor ${placed + 1}?`, 'galakan'); return; }
          sfx.drop(); el.classList.add('used');
          slots.children[placed].append(h('span', { class: 'wd-placed', html: stepArt(s, 44) }), h('small', {}, s.n));
          slots.children[placed].classList.add('full');
          placed++;
          if (placed === seq.length) { ctx.good({ speakIt: false }); ctx.say('Tertib! Semua langkah tersusun dengan betul.', 'pujian'); ri++; later(() => (ri < lv.rounds.length ? startR() : ctx.done()), 1700); }
          else speak(s.n);
        };
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { for (let i = placed; i < seq.length; i++) place(seq[i], pile.children[cards.indexOf(seq[i])]); });
        ctx.say(ri === 0 ? `Tertib ialah salah satu rukun wuduk. Susun ${seq.length} langkah ini ikut urutan yang betul!` : 'Satu lagi! Susun ikut tertib.');
      };
      startR();
    }

    // ---------- Bab 3: apa seterusnya / yang mana wajib ----------
    function quiz(lv) {
      ctx.rounds(lv.rounds.length);
      let ri = 0;
      const startR = () => {
        clear(stage); ctx.round(ri);
        const r = lv.rounds[ri];
        let ok = false;
        const q = lv.kind === 'seterusnya'
          ? h('div', { class: 'wd-q' }, h('small', {}, 'Selepas'), h('span', { class: 'wd-q-art', html: stepArt(r.cur, 80) }), h('b', {}, r.cur.n), h('em', {}, 'apa seterusnya?'))
          : h('div', { class: 'wd-q' }, h('span', { class: 'wd-q-art', html: artSvg('titisair', { size: 80 }) }), h('b', {}, 'Yang mana WAJIB dalam wuduk?'), h('em', {}, 'Rukun wuduk mesti dibuat.'));
        const opts = h('div', { class: 'wd-opts' }, ...r.opts.map((s) => h('button', { class: 'wd-sc big', type: 'button', 'aria-label': s.n, onclick: (e) => pick(s, e.currentTarget) }, h('span', { html: stepArt(s, 70) }), h('small', {}, s.n))));
        stage.append(h('div', { class: 'wd-arr' }, q, opts));
        const pick = (s, el) => {
          if (ok) return;
          if (s === r.ans) {
            ok = true; el.classList.add('ok'); ctx.good({ speakIt: false });
            ctx.say(lv.kind === 'seterusnya' ? `Betul! Selepas itu, ${s.n.toLowerCase()}.` : `Betul! ${s.n} ialah rukun wuduk.`, 'pujian');
            ri++; later(() => (ri < lv.rounds.length ? startR() : ctx.done()), 1700);
          } else { ctx.miss(); el.classList.add('no'); ctx.say(lv.kind === 'seterusnya' ? 'Bukan yang itu. Ingat tertib wuduk, cuba lagi!' : `${s.n} ialah sunat, bukan wajib. Cuba lagi!`, 'galakan'); }
        };
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => pick(r.ans, opts.children[r.opts.indexOf(r.ans)]));
        ctx.say(lv.kind === 'seterusnya' ? `Selepas ${r.cur.n.toLowerCase()}, apa langkah seterusnya?` : 'Antara tiga ini, yang mana wajib dalam wuduk?');
      };
      startR();
    }
  },
};
