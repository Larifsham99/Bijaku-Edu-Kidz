// Enjin "Tap to select" / pilihan berganda / kira objek / teka bunyi / corak
import { h, sleep } from '../ui.js';
import { face, colsFor, hintEl, shakeEl } from './common.js';
import { NUM_WORDS } from '../data/content.js';
import { colorById } from '../data/content.js';

export function renderShow(show, api) {
  if (!show) return null;
  const k = show.k;
  if (k === 'big') {
    const el = h('div', { class: `prompt-big ${show.t !== undefined && !show.e ? 'letter' : ''}` }, face(show, { dual: api.dual }));
    if (show.color) el.style.color = colorById(show.color)?.hex || show.color;
    if (show.font) el.style.fontFamily = show.font;
    if (show.say) { el.style.cursor = 'pointer'; el.addEventListener('click', () => api.speak(show.say)); }
    return el;
  }
  if (k === 'text') return h('div', { class: 'prompt-text', style: { maxWidth: '640px' } }, show.t);
  if (k === 'objects') {
    const wrap = h('div', { class: 'objects' });
    let n = 0;
    show.items.forEach((e) => {
      const b = h('button', { class: 'o', type: 'button', 'aria-label': 'objek' }, e);
      if (show.tap) {
        b.addEventListener('click', () => {
          if (b.classList.contains('counted')) return;
          n++;
          b.classList.add('counted');
          b.appendChild(h('span', { class: 'n' }, n));
          api.sfx.pop();
          api.speak(NUM_WORDS[n] || String(n));
        });
      }
      wrap.appendChild(b);
    });
    return wrap;
  }
  if (k === 'groups') {
    // dua atau lebih kumpulan objek bersebelahan (tanpa pilihan)
    return h('div', { class: 'eq' }, show.groups.map((g) => h('div', { class: 'grp' }, g.map((e) => h('span', {}, e)))));
  }
  if (k === 'eq') {
    const grp = (n, gone = 0) => h('div', { class: 'grp' }, Array.from({ length: n }, (_, i) => h('span', { class: i >= n - gone ? 'gone' : '' }, show.e)));
    if (show.op === '+') return h('div', { class: 'eq' }, grp(show.a), h('span', {}, '+'), grp(show.b), h('span', {}, '='), h('span', {}, '?'));
    return h('div', { class: 'eq' }, grp(show.a, show.b), h('span', {}, `− ${show.b} = ?`));
  }
  if (k === 'strip') {
    return h('div', { class: 'strip' }, show.items.map((it) => it === '?' ? h('div', { class: 's q' }, '?') : h('div', { class: 's' }, face(it, { label: false }))));
  }
  if (k === 'sound') {
    const btn = h('button', { class: 'btn big speak-btn', type: 'button', 'aria-label': 'Dengar bunyi' }, h('span', { class: 'emo' }, '🔊'), 'Dengar');
    const play = async () => { btn.disabled = true; await api.playSound(show.id, { withOno: show.ono && show.withOno, ono: show.ono }); btn.disabled = false; };
    btn.addEventListener('click', play);
    if (show.auto !== false) setTimeout(play, show.delay ?? 1600);
    return btn;
  }
  if (k === 'mix') {
    const sw = (id) => h('span', { style: { display: 'inline-block', width: '84px', height: '84px', borderRadius: '50%', background: colorById(id).hex, boxShadow: 'inset 0 -8px 0 rgba(0,0,0,.1), 0 4px 0 rgba(0,0,0,.1)' } });
    return h('div', { class: 'eq' }, sw(show.a), h('span', {}, '+'), sw(show.b), h('span', {}, '='), h('span', {}, '?'));
  }
  if (k === 'html') return h('div', { html: show.html });
  if (k === 'arabic') return h('div', { class: 'prompt-big', style: { fontFamily: '"Amiri", "Scheherazade New", "Noto Naskh Arabic", "Traditional Arabic", serif', color: '#1dd1a1', fontWeight: 700 }, dir: 'rtl', lang: 'ar' }, show.t);
  if (k === 'doa') {
    return h('div', { class: 'panel', style: { maxWidth: '620px', textAlign: 'center' } },
      h('div', { dir: 'rtl', lang: 'ar', style: { fontSize: 'clamp(26px,6vw,40px)', fontFamily: '"Amiri","Noto Naskh Arabic","Traditional Arabic",serif', lineHeight: 1.7 } }, show.ar),
      h('div', { style: { fontSize: '20px', fontWeight: 800, marginTop: '6px' } }, show.rumi),
      h('div', { class: 'muted', style: { fontSize: '16px' } }, `"${show.makna}"`),
      h('div', { class: 'muted', style: { fontSize: '13px', marginTop: '4px' } }, `Sumber: ${show.src}`));
  }
  return null;
}

export function choice(stage, r, api) {
  const show = renderShow(r.show, api);
  if (show) stage.appendChild(h('div', { class: 'prompt-row' }, show));

  const n = r.options.length;
  const wide = r.wide || r.options.some((o) => o.wide);
  const cols = r.cols || (wide ? (n > 3 ? 2 : 1) : colsFor(n));
  const grid = h('div', { class: 'choices', style: `--cols:${cols}` });
  if (wide) grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, ${cols === 1 ? 520 : 300}px))`;
  const answers = new Set(r.multi ? r.answers : [r.answer]);
  const found = new Set();
  let locked = false;
  const btns = new Map();

  r.options.forEach((o) => {
    const isTxt = o.t !== undefined && !o.e && !o.shape;
    const cls = ['choice'];
    if (wide) cls.push('wide');
    else if (isTxt) cls.push('txt');
    if (o.flat) cls.push('flat');
    const b = h('button', { class: cls.join(' '), type: 'button', 'aria-label': o.say || o.lbl || o.t || 'pilihan' }, face(o, { dual: api.dual }));
    if (o.color && isTxt) b.style.color = colorById(o.color)?.hex || o.color;
    if (o.font) b.style.fontFamily = o.font;
    if (o.bg) b.style.background = o.bg;
    b.addEventListener('click', () => pick(o.id, b));
    btns.set(o.id, b);
    grid.appendChild(b);
  });
  stage.appendChild(grid);

  let wrongs = 0;
  async function pick(id, b) {
    if (locked || found.has(id)) return;
    const opt = r.options.find((o) => o.id === id);
    if (opt?.say && r.sayOnTap) api.speak(opt.say);
    if (answers.has(id)) {
      found.add(id);
      b.classList.add('right');
      if (found.size >= answers.size) {
        locked = true;
        btns.forEach((x, k) => { if (!answers.has(k)) x.classList.add('dim'); });
        if (r.reveal) await r.reveal(stage);
        api.finish();
      } else api.good(b, { quiet: true });
    } else {
      shakeEl(b);
      wrongs++;
      api.bad(b);
      if (wrongs >= 2) [...answers].filter((a) => !found.has(a)).slice(0, 1).forEach((a) => hintEl(btns.get(a)));
    }
  }
  return {
    async solve() {
      for (const a of answers) { await sleep(60); pick(a, btns.get(a)); }
    },
  };
}
