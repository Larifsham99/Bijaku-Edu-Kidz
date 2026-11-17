// Mod Permainan Bebas: tiada markah, tiada had, tiada hukuman
import { h, emo, toast, confetti, sleep } from '../ui.js';
import { go } from '../nav.js';
import { profile, save, addActivity } from '../store.js';
import { topbar, guide } from './shared.js';
import { speak, sfx, playSound, speakWord } from '../audio.js';
import { ENGINES } from '../engines/index.js';
import { COLORING } from '../data/art.js';
import { artSvg } from '../engines/art.js';
import * as C from '../data/content.js';
import { picture } from '../engines/puzzle.js';
import { makeRng } from '../rng.js';
import { settings } from '../store.js';
import { checkBadges } from '../rewards.js';

const ACTS = [
  { id: 'warna', e: '🖍️', n: 'Mewarna Bebas', c: 'linear-gradient(160deg,#ff8fab,#ff6b6b)' },
  { id: 'lukis', e: '✍️', n: 'Lukis dengan Jari', c: 'linear-gradient(160deg,#feca57,#ff9f43)' },
  { id: 'bunyi', e: '🐮', n: 'Dengar Bunyi', c: 'linear-gradient(160deg,#48dbfb,#54a0ff)' },
  { id: 'susun', e: '🧺', n: 'Susun Objek', c: 'linear-gradient(160deg,#4cd18a,#10ac84)' },
  { id: 'puzzle', e: '🧩', n: 'Main Puzzle', c: 'linear-gradient(160deg,#a77bff,#5f27cd)' },
  { id: 'teroka', e: '🔭', n: 'Teroka Gambar', c: 'linear-gradient(160deg,#ff9f43,#e17055)' },
];

let ticker = null;
function trackTime() {
  clearInterval(ticker);
  const p = profile();
  let last = Date.now();
  ticker = setInterval(() => {
    if (!document.body.contains(document.querySelector('.free-active'))) { clearInterval(ticker); return; }
    const now = Date.now();
    if (document.visibilityState === 'visible') { addActivity(p, { time: Math.min(10, (now - last) / 1000) }); save(); }
    last = now;
  }, 5000);
}

function freeApi(g, onFinish) {
  return {
    get dual() { return settings().lang === 'dual'; },
    sfx, playSound, speakWord,
    speak: (t) => speak(t),
    say: (t) => g.say(t),
    good() { sfx.pick(); },
    bad() { sfx.bump(); },
    finish() { sfx.win(); confetti(20); toast('Hebat!', 'good', '🌟'); speak('Hebat!', { mood: 'pujian' }); onFinish && setTimeout(onFinish, 1300); },
  };
}

export function freeScreen(act, args = []) {
  const p = profile();
  if (act && !p._freeCounted) { p.freeplay = (p.freeplay || 0) + 1; checkBadges(p); save(); }
  const scr = h('div', { class: 'screen free-active' });
  if (!act) {
    scr.appendChild(topbar('🎈 Main Bebas', '/'));
    scr.appendChild(guide('coco', 'Main apa sahaja yang kamu suka. Tiada markah, tiada had!', { speakNow: true }).el);
    scr.appendChild(h('div', { class: 'free-grid' }, ACTS.map((a) => h('button', { class: 'tile-btn', style: { background: a.c, minHeight: '140px' }, type: 'button', onclick: () => { sfx.tap(); speak(a.n); go('/bebas/' + a.id); } }, emo(a.e), a.n))));
    return scr;
  }
  trackTime();
  const meta = ACTS.find((a) => a.id === act) || ACTS[0];
  scr.appendChild(topbar(`${meta.e} ${meta.n}`, act && args.length ? '/bebas/' + act : '/bebas'));
  const g = guide('lala', '');
  scr.appendChild(g.el);
  const stage = h('div', { class: 'stage' });
  scr.appendChild(stage);
  const api = (fin) => freeApi(g, fin);

  if (act === 'warna') {
    if (!args[0]) {
      g.say('Pilih gambar untuk diwarnakan.');
      stage.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))' } }, COLORING.map((a) => h('button', { class: 'coll-item', type: 'button', onclick: () => go('/bebas/warna/' + a.id) }, h('div', { style: { width: '100px', height: '100px' }, html: artSvg(a) }), h('span', { class: 'lbl' }, a.n)))));
    } else {
      g.say('Pilih warna, kemudian tekan bahagian gambar.');
      ENGINES.color(stage, { art: args[0], guided: [], prompt: 'Warnakan ikut suka hati kamu!' }, api(() => go('/bebas/warna')));
    }
  } else if (act === 'lukis') {
    g.say('Lukis apa sahaja dengan jari kamu!');
    ENGINES.draw(stage, {}, api(), { free: true });
  } else if (act === 'bunyi') {
    g.say('Tekan gambar untuk mendengar bunyinya.');
    Object.entries(C.SOUND_CATS).forEach(([cat, n]) => {
      stage.appendChild(h('div', { class: 'section-title', style: { fontSize: '20px' } }, n));
      stage.appendChild(h('div', { class: 'sound-board' }, C.SOUNDS.filter((s) => s.cat === cat).map((s) => h('button', { class: 'explore-card', type: 'button', onclick: async (e) => {
        const b = e.currentTarget; b.style.transform = 'scale(1.08)';
        await speak(s.n);
        await playSound(s.id, { withOno: true, ono: s.ono });
        b.style.transform = '';
      } }, h('div', { class: 'emo' }, s.e), h('div', { class: 'lbl' }, s.n)))));
    });
  } else if (act === 'susun') {
    let n = 0;
    const run = () => {
      stage.replaceChildren();
      const rng = makeRng('bebas-susun-' + Date.now() + n++);
      const sets = [
        () => { const cats = rng.sample(Object.entries(C.CATEGORIES), 2); return { bins: cats.map(([id, c]) => ({ id, e: c.e, n: c.n })), items: rng.shuffle(cats.flatMap(([id, c]) => rng.sample(c.items, 3).map((e) => ({ e, bin: id })))) }; },
        () => ({ bins: [{ id: 'buah', e: '🧺', n: 'Buah' }, { id: 'sayur', e: '🥬', n: 'Sayur' }], items: rng.shuffle([...rng.sample(C.FRUITS, 3).map((x) => ({ e: x.e, bin: 'buah' })), ...rng.sample(C.VEGETABLES, 3).map((x) => ({ e: x.e, bin: 'sayur' }))]) }),
        () => ({ bins: [{ id: 'darat', e: '🛣️', n: 'Darat' }, { id: 'udara', e: '☁️', n: 'Udara' }, { id: 'air', e: '🌊', n: 'Air' }], items: rng.shuffle(['darat', 'udara', 'air'].flatMap((w) => rng.sample(C.VEHICLES.filter((v) => v.way === w), 2).map((v) => ({ e: v.e, bin: w })))) }),
      ];
      const r = rng.pick(sets)();
      g.say('Susun objek ke dalam kumpulannya. Tiada markah, main sahaja!');
      ENGINES.sort(stage, { ...r }, api(run));
    };
    run();
  } else if (act === 'puzzle') {
    if (!args[0]) {
      g.say('Pilih gambar dan bilangan kepingan.');
      let pieces = 4;
      const pc = h('div', { class: 'tabs' }, [[2, '2'], [4, '4'], [6, '6'], [9, '9'], [12, '12']].map(([v, n]) => {
        const b = h('button', { class: v === pieces ? 'on' : '', type: 'button', onclick: () => { pieces = v; [...pc.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); sfx.tap(); } }, `${n} keping`);
        return b;
      }));
      stage.appendChild(pc);
      stage.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))' } }, C.PUZZLE_PICS.map((pic, i) => h('button', { class: 'coll-item', type: 'button', onclick: () => go(`/bebas/puzzle/${i}/${pieces}`) }, h('img', { src: picture(pic), alt: pic.n, style: { width: '96px', height: '96px', borderRadius: '14px' } }), h('span', { class: 'lbl' }, pic.n)))));
    } else {
      const pic = C.PUZZLE_PICS[+args[0]] || C.PUZZLE_PICS[0];
      const n = +args[1] || 4;
      const [rows, cols] = { 2: [1, 2], 4: [2, 2], 6: [2, 3], 9: [3, 3], 12: [3, 4] }[n] || [2, 2];
      const rng = makeRng('fp' + Date.now());
      g.say(`Susun puzzle ${pic.n}.`);
      ENGINES.puzzle(stage, { pic, rows, cols, ghost: true, order: rng.shuffle([...Array(rows * cols).keys()]) }, api(() => go('/bebas/puzzle')));
    }
  } else if (act === 'teroka') {
    const groups = {
      haiwan: { n: 'Haiwan', e: '🦁', items: C.ANIMALS.map((a) => ({ e: a.e, n: a.n, en: a.en })) },
      buah: { n: 'Buah', e: '🍎', items: C.FRUITS },
      sayur: { n: 'Sayur', e: '🥕', items: C.VEGETABLES },
      kenderaan: { n: 'Kenderaan', e: '🚗', items: C.VEHICLES },
      pakaian: { n: 'Pakaian', e: '👕', items: C.CLOTHES },
      badan: { n: 'Anggota Badan', e: '👁️', items: C.BODY },
      huruf: { n: 'Huruf', e: '🔤', items: C.LETTERS.map((l) => { const w = C.wordsByLetter(l)[0]; return { t: l, n: w ? `${l} untuk ${w.n}` : `Huruf ${l}`, e2: w?.e }; }) },
      nombor: { n: 'Nombor', e: '🔢', items: Array.from({ length: 20 }, (_, i) => ({ t: String(i + 1), n: C.NUM_WORDS[i + 1], en: C.NUM_EN[i + 1] })) },
      warna: { n: 'Warna', e: '🎨', items: C.COLORS.map((c) => ({ sw: c.hex, n: c.n, en: c.en })) },
      bentuk: { n: 'Bentuk', e: '🔷', items: C.SHAPES.map((s) => ({ shape: s.id, n: s.n, en: s.en })) },
      hijaiyah: { n: 'Hijaiyah', e: 'ا', items: C.HIJAIYAH.map((x) => ({ ar: x.a, n: x.n })) },
    };
    if (!args[0]) {
      g.say('Pilih kategori untuk diteroka.');
      stage.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))' } }, Object.entries(groups).map(([id, gr]) => h('button', { class: 'explore-card', type: 'button', onclick: () => go('/bebas/teroka/' + id) }, h('div', { class: 'emo' }, gr.e), h('div', { class: 'lbl' }, gr.n)))));
    } else {
      const gr = groups[args[0]] || groups.haiwan;
      g.say(`Tekan gambar untuk dengar namanya.`);
      const dual = settings().lang === 'dual';
      stage.appendChild(h('div', { class: 'grid-coll', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))' } }, gr.items.map((it) => {
        let pic;
        if (it.sw) pic = h('div', { style: { width: '64px', height: '64px', borderRadius: '50%', background: it.sw, margin: 'auto', boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.1)' } });
        else if (it.shape) pic = h('div', { html: C.shapeSvg(it.shape, '#a77bff', '64px'), style: { display: 'flex', justifyContent: 'center' } });
        else if (it.ar) pic = h('div', { dir: 'rtl', style: { fontSize: '60px', fontFamily: '"Amiri","Noto Naskh Arabic",serif', color: '#00b894' } }, it.ar);
        else if (it.t) pic = h('div', { style: { fontSize: '56px', fontWeight: 900, color: '#a77bff' } }, it.t, it.e2 ? h('span', { class: 'emo', style: { fontSize: '30px', marginLeft: '6px' } }, it.e2) : null);
        else pic = h('div', { class: 'emo' }, it.e);
        return h('button', { class: 'explore-card', type: 'button', onclick: (e) => { e.currentTarget.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], { duration: 300 }); speakWord(it.n, it.en); } },
          pic, h('div', { class: 'lbl' }, it.n), dual && it.en ? h('div', { class: 'lbl', style: { color: '#54a0ff', fontSize: '14px' } }, it.en) : null);
      })));
    }
  }
  return scr;
}
