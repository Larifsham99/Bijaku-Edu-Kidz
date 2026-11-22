// =====================================================================
//  KEDAI RUNCIT CILIK — belajar wang Ringgit Malaysia
//  Pelanggan (maskot) minta tolong belikan barang. Anak bayar harga tepat
//  dengan duit kertas dari dompet ke dulang juruwang.
//  Bab 1: RM1 sahaja (harga 1–9) · Bab 2: RM1, RM5 & RM10 (harga 3–20)
//  Bab 3: dua barang — campur harga, kemudian bayar jumlahnya
// =====================================================================
import { h, clear } from '../ui.js';
import { icon } from '../icons.js';
import { sfx, speak } from '../audio.js';
import { nombor } from '../malay-text.js';
import { artSvg } from '../tekasilang/art.js';

const ITEMS = [
  ['epal', 'epal'], ['pisang', 'pisang'], ['roti', 'roti'], ['susu', 'susu'], ['telur', 'telur'], ['ikan', 'ikan'],
  ['kek', 'kek'], ['tembikai', 'tembikai'], ['anggur', 'anggur'], ['mangga', 'mangga'], ['oren', 'oren'], ['nanas', 'nanas'],
  ['kelapa', 'kelapa'], ['jagung', 'jagung'], ['lobak', 'lobak merah'], ['madu', 'madu'], ['kurma', 'kurma'], ['teh', 'teh'],
  ['mi', 'mi'], ['gula', 'gula'], ['kuih', 'kuih'], ['sayur', 'sayur'], ['beras', 'beras'], ['garam', 'garam'],
];
const CUSTOMERS = [['mimi', 'Mimi'], ['bobo', 'Bobo'], ['coco', 'Coco'], ['dino', 'Dino'], ['lala', 'Lala']];
const NOTE = { 1: ['#3d8bff', '#1f5fc4'], 5: ['#2fbf71', '#16834a'], 10: ['#ff5d5d', '#c22f36'] };
const rm = (v) => `${nombor(v)} ringgit`;

function noteSvg(v) {
  const [c, d] = NOTE[v];
  return `<svg viewBox="0 0 120 64" aria-hidden="true"><rect x="2" y="4" width="116" height="56" rx="8" fill="${d}"/><rect x="2" y="2" width="116" height="56" rx="8" fill="${c}"/>
    <rect x="8" y="8" width="104" height="44" rx="5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-dasharray="4 3"/>
    <circle cx="92" cy="30" r="15" fill="#fff" fill-opacity=".25"/><path d="M92 18l3.5 7 7.5 1-5.5 5.3 1.3 7.6L92 35.3l-6.8 3.6 1.3-7.6L81 26l7.5-1z" fill="#fff" fill-opacity=".8"/>
    <text x="40" y="40" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="900" font-size="${v === 10 ? 24 : 26}" fill="#fff">RM${v}</text></svg>`;
}

export function makeRound(n, r, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  const pool = rng.shuffle(ITEMS);
  if (ch === 0) {
    const max = k < 3 ? 3 : k < 6 ? 5 : 9;
    return { items: [{ it: pool[0], p: rng.int(k < 3 ? 1 : 2, max) }], notes: [1] };
  }
  if (ch === 1) {
    const lo = k < 4 ? 5 : 6, hi = k < 4 ? 10 : k < 7 ? 15 : 20;
    return { items: [{ it: pool[0], p: rng.int(lo, hi) }], notes: k < 4 ? [1, 5] : [1, 5, 10] };
  }
  const hi = k < 5 ? 5 : 9;
  return { items: [{ it: pool[0], p: rng.int(1, hi) }, { it: pool[1], p: rng.int(1, hi) }], notes: k < 5 ? [1, 5] : [1, 5, 10] };
}
// bayaran paling sedikit keping (untuk ujian / petunjuk)
export function bestPay(total, notes) {
  const out = []; let left = total;
  [...notes].sort((a, b) => b - a).forEach((v) => { while (left >= v) { out.push(v); left -= v; } });
  return out;
}

export default {
  play(ctx) {
    const { n, ch, rng, stage, later } = ctx;
    const ROUNDS = 3;
    let ri = 0;
    ctx.rounds(ROUNDS);
    const custOrder = rng.shuffle(CUSTOMERS);

    function startRound() {
      clear(stage);
      ctx.round(ri);
      const rd = makeRound(n, ri, rng);
      const total = rd.items.reduce((a, b) => a + b.p, 0);
      const [cid, cname] = custOrder[ri % custOrder.length];
      const tray = [];
      let busy = false;

      const cust = h('div', { class: 'kd-cust' }, h('img', { src: `visual-assets/mascots/${cid}.svg`, alt: cname }), h('span', { class: 'kd-cust-name' }, cname));
      const want = h('div', { class: 'kd-want' }, ...rd.items.map((x, i) => h('div', { class: 'kd-item', style: `animation-delay:${0.15 + i * 0.15}s` },
        h('span', { class: 'kd-item-art', html: artSvg(x.it[0], { size: 84 }) }),
        h('span', { class: 'kd-tag' }, `RM${x.p}`))),
      rd.items.length > 1 ? h('div', { class: 'kd-sum' }, `RM${rd.items[0].p} + RM${rd.items[1].p} = ?`) : null);
      const trayEl = h('div', { class: 'kd-tray', 'aria-label': 'Dulang bayaran' });
      const totalEl = h('b', {}, 'RM0');
      const payBtn = h('button', { class: 'kd-pay', type: 'button', onclick: () => pay() }, icon('check'), 'Bayar');
      const counter = h('div', { class: 'kd-counter' },
        h('div', { class: 'kd-tray-wrap' }, h('div', { class: 'kd-tray-head' }, h('span', {}, 'Dulang'), totalEl), trayEl),
        payBtn);
      const purse = h('div', { class: 'kd-purse' }, h('span', { class: 'kd-purse-lbl' }, 'Dompet'),
        h('div', { class: 'kd-notes' }, ...rd.notes.map((v) => h('button', { class: `kd-note n${v}`, type: 'button', 'aria-label': `Duit RM${v}`, html: noteSvg(v), onclick: (e) => add(v, e.currentTarget) }))));
      stage.append(h('div', { class: 'kd-shop' },
        h('div', { class: 'kd-awning', 'aria-hidden': 'true' }),
        h('div', { class: 'kd-sign' }, 'KEDAI RUNCIT CILIK'),
        h('div', { class: 'kd-scene' }, cust, want), counter, purse));

      const sum = () => tray.reduce((a, b) => a + b, 0);
      function renderTray() {
        clear(trayEl);
        tray.forEach((v, i) => trayEl.appendChild(h('button', { class: `kd-note in n${v}`, type: 'button', 'aria-label': `Ambil balik RM${v}`, html: noteSvg(v), style: `--i:${i}`, onclick: () => { if (busy) return; sfx.pop(); tray.splice(i, 1); renderTray(); } })));
        totalEl.textContent = `RM${sum()}`;
        totalEl.classList.remove('bump'); void totalEl.offsetWidth; totalEl.classList.add('bump');
      }
      function add(v, src) {
        if (busy) return;
        if (tray.length >= 20) { sfx.bump(); return; }
        sfx.coin(); tray.push(v); renderTray();
        src?.classList.remove('fly'); void src?.offsetWidth; src?.classList.add('fly');
        speak(rm(sum()), { interrupt: true });
      }
      function pay() {
        if (busy) return;
        const s = sum();
        if (!s) { ctx.say(`Pilih duit dari dompet dahulu. Harganya ${rm(total)}.`); return; }
        if (s === total) {
          busy = true;
          counter.classList.add('paid'); cust.classList.add('happy');
          ctx.good({ speakIt: false });
          ctx.say(`${['Terima kasih!', 'Betul, cukup-cukup!', 'Tepat sekali!'][ri % 3]} ${rm(total)}.`, 'pujian');
          ri++;
          later(() => (ri < ROUNDS ? startRound() : ctx.done()), 1900);
          return;
        }
        ctx.miss();
        want.classList.remove('shake'); void want.offsetWidth; want.classList.add('shake');
        ctx.say(s < total ? `Belum cukup. Ada ${rm(s)}, harganya ${rm(total)}. Tambah lagi!` : `Terlebih! Ada ${rm(s)}, harganya ${rm(total)} sahaja. Tekan duit di dulang untuk ambil balik.`, 'galakan');
      }
      globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { tray.splice(0, tray.length, ...bestPay(total, rd.notes)); renderTray(); pay(); });

      const names = rd.items.map((x) => `${x.it[1]} ${rm(x.p)}`).join(', dan ');
      if (rd.items.length > 1) ctx.say(`${cname} mahu beli ${names}. Berapa jumlahnya? Bayar dengan tepat!`);
      else if (n === 1 && ri === 0) ctx.say(`${cname} mahu beli ${names}. Tekan duit di dompet untuk bayar. Kemudian tekan Bayar!`);
      else ctx.say(`${cname} mahu beli ${names}. Bayar dengan tepat!`);
    }
    startRound();
  },
};
