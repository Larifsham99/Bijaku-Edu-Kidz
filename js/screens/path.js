// =====================================================================
//  LALUAN BIJAK — satu jalan belajar berstruktur untuk menjawab
//  "anak nak mula dari mana?". Setiap unit = 10 langkah yang menggilirkan
//  bidang pembelajaran prasekolah (bahasa, nombor, Islam & akhlak, logik,
//  sains, kreatif) + 1 cabaran seronok. Langkah ialah level seterusnya bagi
//  sesuatu permainan, jadi kesukaran naik sedikit demi sedikit.
//  Matlamat harian (lalai 3 langkah ≈ 10–15 minit), streak, peti harta.
// =====================================================================
import { h, todayKey, confetti } from '../ui.js';
import { go } from '../nav.js';
import { profile, settings, save, callOf } from '../store.js';
import { MODES } from '../modes/index.js';
import { modeArt } from '../data/modeart.js';
import { STICKERS } from '../data/content.js';
import { icon } from '../icons.js';
import { speak, sfx } from '../audio.js';
import { DEMO, DEMO_MAX } from '../demo.js';
import { ribbon, cheer, selfieButton } from '../cheer.js';
import { EXTRAS } from './catalog.js';
import { tabBar } from './home.js';

// id modul berasingan (disemak dalam ujian supaya sepadan dengan data asal)
export const RC_WORLD_IDS = ['kampung', 'buah', 'hutan', 'bandar', 'dino', 'laut', 'angkasa', 'gula', 'bina', 'juara'];
export const TS_CHAPTER_IDS = ['allah', 'rukunislam', 'rukuniman', 'solat', 'wuduk', 'doa', 'adab', 'keluarga', 'masjid', 'nabi', 'kisah', 'makanan', 'ciptaan', 'ramadan', 'soleh'];
export const AK_STORY_IDS = ['salam', 'tangankanan', 'kongsi', 'sampah', 'paip', 'maaf', 'tolongibu', 'jujur', 'kucing', 'beratur', 'terimakasih', 'doatidur', 'bersin', 'dengarcikgu', 'jatuh', 'kemas', 'masjid', 'ziarah', 'adik', 'siram', 'ejek', 'senyum', 'amanah', 'solat', 'membazir', 'sopanayah', 'kongsimainan', 'sedekah', 'basuhtangan', 'giliran'];

export const DOMAINS = {
  bahasa: { n: 'Bahasa & Bacaan', c: '#ff6b6b', e: '🔤' },
  nombor: { n: 'Nombor & Matematik', c: '#3d8bff', e: '🔢' },
  islam: { n: 'Islam & Akhlak', c: '#2fbf71', e: '🤲' },
  minda: { n: 'Logik & Minda', c: '#9b5cff', e: '🧩' },
  sains: { n: 'Sains & Dunia', c: '#18b7c9', e: '🔬' },
  kreatif: { n: 'Kreatif & Seni', c: '#ff922b', e: '🎨' },
  seronok: { n: 'Cabaran Seronok', c: '#ffb020', e: '⭐' },
};
// [permainan, unit mula (umur ≥5), unit mula (umur ≤4)]
const POOL = {
  bahasa: [['abc', 1, 1], ['bunyi', 1, 1], ['silang', 4, 9]],
  nombor: [['nombor', 1, 1], ['warna', 1, 1], ['kedai', 2, 3], ['kelas', 3, 3]],
  islam: [['soleh', 1, 1], ['akhlak', 1, 1], ['wuduk', 2, 2]],
  minda: [['puzzle', 1, 1], ['ingatan', 1, 1], ['robot', 2, 4], ['bayang', 2, 2], ['maze', 2, 2], ['minda', 3, 4]],
  sains: [['haiwan', 1, 1], ['harian', 1, 1], ['makmal', 2, 3], ['pemburu', 3, 4], ['misi', 4, 5]],
  kreatif: [['seni', 1, 1], ['bina', 2, 3]],
  seronok: [['lumba', 1, 1], ['lompat', 2, 3], ['guling', 3, 4], ['imbang', 4, 5]],
};
const SLOTS = ['bahasa', 'nombor', 'islam', 'minda', 'sains', 'bahasa', 'nombor', 'kreatif', 'islam', 'seronok'];
export const UNIT_NAMES = ['Langkah Pertama', 'Kawan Baharu', 'Dunia Warna', 'Si Pintar', 'Penjelajah Cilik', 'Kembara Huruf', 'Wira Nombor', 'Hati Mulia', 'Saintis Kecil', 'Arkitek Muda', 'Juara Minda', 'Bintang Bijak', 'Pulau Ilmu', 'Pengembara Hebat', 'Cendekia Cilik', 'Raja Teka-teki', 'Budi Bahasa', 'Pakar Kira', 'Penemu Hebat', 'Bijak Sejati', 'Wira Kebaikan', 'Puncak Ilmu', 'Legenda Cilik', 'Juara BIJAKU'];
export const UNITS = UNIT_NAMES.length;
const MAXLV = { lumba: 500, silang: 450, akhlak: 30 };
const maxLevel = (g) => MAXLV[g] || (MODES[g] ? 50 : 30);

// ---------------- kurikulum (bergantung kepada umur sahaja) ----------------
const cache = new Map();
export function pathNodes(age = 5) {
  const young = age <= 4;
  if (cache.has(young)) return cache.get(young);
  const nodes = [], count = {}, rot = {};
  for (let u = 1; u <= UNITS; u++) {
    SLOTS.forEach((dom, s) => {
      const pool = POOL[dom].filter(([g, a, b]) => u >= (young ? b : a) && (count[g] || 0) < maxLevel(g));
      // pusingan adil: pilih permainan yang paling kurang dimainkan dalam bidang ini
      rot[dom] = (rot[dom] || 0) + 1;
      pool.sort((p, q) => (count[p[0]] || 0) - (count[q[0]] || 0) || POOL[dom].indexOf(p) - POOL[dom].indexOf(q));
      const [g] = pool[0];
      count[g] = (count[g] || 0) + 1;
      nodes.push({ i: nodes.length, unit: u, slot: s, dom, g, k: count[g] });
    });
  }
  cache.set(young, nodes);
  return nodes;
}

// ---------------- laluan & semakan selesai (segerak, tanpa memuat modul) ----------------
export function nodeRoute(nd) {
  const { g, k } = nd;
  if (MODES[g]) return `/main/${g}/${k}`;
  if (g === 'lumba') return `/lumba/main/${Math.floor((k - 1) / 50)}/${((k - 1) % 50) + 1}`;
  if (g === 'silang') return `/silang/main/${Math.floor((k - 1) / 30)}/${((k - 1) % 30) + 1}`;
  if (g === 'akhlak') return `/akhlak/kisah/${AK_STORY_IDS[k - 1]}`;
  return `/g/${g}/${k}`;
}
const ls = (key) => { try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; } };
export function nodeDone(nd, p = profile()) {
  if (!p) return false;
  const { g, k } = nd, pid = String(p.id);
  if (MODES[g]) return p.modes[g]?.done?.[k] !== undefined;
  if (g === 'lumba') return !!ls('dc-racing-v1')[pid]?.done?.[RC_WORLD_IDS[Math.floor((k - 1) / 50)]]?.[((k - 1) % 50) + 1];
  if (g === 'silang') return !!ls('dc-silang-v1')[pid]?.done?.[TS_CHAPTER_IDS[Math.floor((k - 1) / 30)]]?.[((k - 1) % 30) + 1];
  if (g === 'akhlak') return !!ls('dc-akhlak-v1')[pid]?.stories?.[AK_STORY_IDS[k - 1]];
  return !!ls('dc-games-v1')[pid]?.[g]?.stars?.[k];
}
export function gameName(g) { return MODES[g]?.n || EXTRAS[g]?.n || g; }
function nodeArt(nd, cls = '') {
  if (MODES[nd.g]) { const a = modeArt(MODES[nd.g]); a.classList.add('lp-art'); if (cls) a.classList.add(cls); return a; }
  return h('img', { class: `lp-art ${cls}`, src: EXTRAS[nd.g]?.img || '', alt: '' });
}

// ---------------- storan laluan ('bj-path-v1') ----------------
const PKEY = 'bj-path-v1';
function pstore(pid) {
  const all = ls(PKEY);
  const k = String(pid);
  const s = all[k] || { seen: {}, chests: [], v: 1 };
  s.seen ||= {}; s.chests ||= [];
  return { s, save: () => { all[k] = s; try { localStorage.setItem(PKEY, JSON.stringify(all)); } catch { /* */ } } };
}
export const dailyGoal = () => settings().pathGoal || 3;
// keadaan semasa: bilangan selesai berturut dari awal, langkah semasa, kiraan hari ini
export function pathState(p = profile()) {
  const nodes = pathNodes(p?.age);
  const { s, save: ssave } = pstore(p?.id);
  const first = !Object.keys(s.seen).length && !s.init;
  let cur = nodes.length, changed = false;
  const today = todayKey();
  const fresh = [];
  for (const nd of nodes) {
    if (!nodeDone(nd, p)) { cur = nd.i; break; }
    if (!s.seen[nd.i]) { s.seen[nd.i] = first ? 'awal' : today; changed = true; if (!first) fresh.push(nd.i); }
  }
  if (first) { s.init = 1; changed = true; }
  if (changed) ssave();
  const todayCount = Object.values(s.seen).filter((d) => d === today).length;
  return { nodes, cur, node: nodes[cur], s, ssave, todayCount, fresh, goal: dailyGoal() };
}
// kemajuan setiap bidang (untuk ibu bapa)
export function domainProgress(p = profile()) {
  const st = pathState(p);
  const out = {};
  Object.keys(DOMAINS).forEach((d) => { out[d] = { done: 0, total: 0 }; });
  st.nodes.slice(0, Math.max(st.cur, 1) + 9).forEach((nd) => { out[nd.dom].total++; if (nd.i < st.cur) out[nd.dom].done++; });
  return { st, out };
}

// ---------------- mula langkah & kembali ke laluan ----------------
const AKEY = 'bj-path-active';
export function startNode(nd) {
  try { sessionStorage.setItem(AKEY, JSON.stringify({ i: nd.i, route: nodeRoute(nd), age: profile()?.age })); } catch { /* */ }
  go(nodeRoute(nd));
}
// dipanggil oleh penghala pada setiap navigasi: selepas langkah selesai, kembali ke laluan
export function pathIntercept(path) {
  let a = null;
  try { a = JSON.parse(sessionStorage.getItem(AKEY) || 'null'); } catch { /* */ }
  if (!a) return false;
  const p = profile();
  const nd = pathNodes(p?.age)[a.i];
  if (!nd) { sessionStorage.removeItem(AKEY); return false; }
  if (path === a.route) return false;
  if (nodeDone(nd, p)) { sessionStorage.removeItem(AKEY); sessionStorage.setItem('bj-path-cele', String(a.i)); if (path !== '/laluan') { go('/laluan'); return true; } return false; }
  // anak keluar sebelum selesai (selain laluan dalaman permainan yang sama)
  if (!path.startsWith(a.route.split('/').slice(0, 3).join('/'))) sessionStorage.removeItem(AKEY);
  return false;
}

// ---------------- skrin Laluan Bijak ----------------
const CHEST = (open) => `<svg viewBox="0 0 100 90" aria-hidden="true"><ellipse cx="50" cy="84" rx="38" ry="5" fill="#000" opacity=".15"/>${open ? '<path d="M14 30 50 14 86 30 86 40 14 40Z" fill="#c2410c" transform="rotate(-18 14 40)"/><circle cx="50" cy="38" r="22" fill="#ffe066" opacity=".7"/>' : '<path d="M14 40Q14 18 50 18Q86 18 86 40Z" fill="#f08c00"/><path d="M14 40Q14 18 50 18Q86 18 86 40" fill="none" stroke="#a14a00" stroke-width="3"/>'}<rect x="14" y="40" width="72" height="40" rx="6" fill="#e8590c"/><rect x="14" y="40" width="72" height="8" fill="#a14a00"/><rect x="44" y="40" width="12" height="18" rx="3" fill="#ffd43b" stroke="#a14a00" stroke-width="2"/><path d="M26 48V80M74 48V80" stroke="#ffd43b" stroke-width="5"/></svg>`;
const XS = [50, 72, 80, 66, 42, 24, 20, 34];

export function pathScreen() {
  const p = profile();
  if (!p) { setTimeout(() => go('/'), 0); return h('div'); }
  const st = pathState(p);
  const { nodes, cur, s } = st;
  const curUnit = (nodes[cur] || nodes[nodes.length - 1]).unit;
  let cele = null;
  try { cele = sessionStorage.getItem('bj-path-cele'); sessionStorage.removeItem('bj-path-cele'); } catch { /* */ }
  const scr = h('div', { class: 'screen lp-screen' }, h('div', { class: 'lp-bg', 'aria-hidden': 'true' }));
  const goalDots = h('span', { class: 'lp-goal-dots' }, ...Array.from({ length: st.goal }, (_, i) => h('i', { class: i < st.todayCount ? 'on' : '' })));
  scr.appendChild(h('header', { class: 'lp-top' },
    h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Kembali', onclick: () => { sfx.tap(); go('/'); } }, icon('back')),
    h('div', { class: 'lp-title' }, h('b', {}, 'Laluan Bijak'), h('small', {}, `Unit ${curUnit} · ${UNIT_NAMES[curUnit - 1]}`)),
    h('span', { class: 'lp-streak', title: 'Hari berturut-turut' }, '🔥', h('b', {}, p.streak?.count || 0))));
  const goalDone = st.todayCount >= st.goal;
  scr.appendChild(h('div', { class: `lp-goal ${goalDone ? 'done' : ''}` },
    h('span', { class: 'lp-goal-ic' }, goalDone ? '🏆' : '🎯'),
    h('span', { class: 'lp-goal-t' }, h('b', {}, goalDone ? 'Matlamat hari ini tercapai!' : 'Matlamat hari ini'), h('small', {}, goalDone ? 'Hebat! Main bebas atau sambung lagi.' : `${st.todayCount} daripada ${st.goal} langkah`)),
    goalDots));

  // jalan berliku
  const road = h('div', { class: 'lp-road' });
  const lastUnit = Math.min(UNITS, curUnit + 1);
  for (let u = 1; u <= lastUnit; u++) {
    const un = nodes.filter((nd) => nd.unit === u);
    const unitDone = un.every((nd) => nd.i < cur);
    road.appendChild(h('div', { class: `lp-unit ${u === curUnit ? 'cur' : ''} ${u > curUnit ? 'lock' : ''}` },
      h('small', {}, `UNIT ${u}`), h('b', {}, UNIT_NAMES[u - 1]),
      h('span', { class: 'lp-unit-doms' }, ...[...new Set(un.map((nd) => nd.dom))].filter((d) => d !== 'seronok').map((d) => h('i', { title: DOMAINS[d].n, style: `--c:${DOMAINS[d].c}` }, DOMAINS[d].e))),
      unitDone ? h('span', { class: 'lp-unit-ok' }, icon('check')) : null));
    un.forEach((nd, j) => {
      const x = XS[(nd.i) % XS.length];
      const state = nd.i < cur ? 'done' : nd.i === cur ? 'cur' : 'lock';
      const demoLock = DEMO && nd.k > DEMO_MAX;
      const btn = h('button', { class: `lp-node ${state} ${nd.dom}`, type: 'button', style: `--x:${x}%;--c:${DOMAINS[nd.dom].c}`, 'data-i': nd.i, 'aria-label': `Langkah ${nd.i + 1}: ${gameName(nd.g)}${state === 'lock' ? ', dikunci' : ''}`, onclick: () => {
        if (state === 'lock') { sfx.bump?.(); speak('Selesaikan langkah yang bersinar dahulu, ya.'); return; }
        if (demoLock) { import('./shared.js').then((m) => m.demoUpgrade()); return; }
        sfx.tap(); speak(`${gameName(nd.g)}!`);
        if (state === 'cur') startNode(nd); else go(nodeRoute(nd));
      } },
      h('span', { class: 'lp-disc' }, nodeArt(nd), state === 'done' ? h('span', { class: 'lp-ok' }, icon('check')) : null, state === 'lock' ? h('span', { class: 'lp-lock' }, icon('lock')) : null),
      h('span', { class: 'lp-lbl' }, gameName(nd.g)));
      if (state === 'cur') btn.prepend(h('span', { class: 'lp-start' }, 'MULA'), h('img', { class: 'lp-avatar', src: `visual-assets/mascots/${['mimi', 'bobo', 'coco', 'dino', 'lala'].includes(p.avatar) ? p.avatar : 'coco'}.svg`, alt: '' }));
      road.appendChild(btn);
      // peti harta selepas langkah ke-5 & ke-10 setiap unit
      if (j === 4 || j === 9) {
        const cid = `${u}-${j === 4 ? 'a' : 'b'}`;
        const ready = nd.i < cur, opened = s.chests.includes(cid);
        road.appendChild(h('button', { class: `lp-chest ${ready ? 'ready' : ''} ${opened ? 'open' : ''} ${j === 9 ? 'big' : ''}`, type: 'button', style: `--x:${XS[(nd.i + 1) % XS.length]}%`, 'aria-label': j === 9 ? 'Peti harta unit' : 'Peti harta', html: CHEST(opened), onclick: () => openChest(cid, ready, opened, j === 9) }));
      }
    });
  }
  scr.appendChild(road);
  if (cur >= nodes.length) scr.appendChild(h('div', { class: 'panel center' }, h('b', {}, 'MasyaAllah! Semua unit Laluan Bijak selesai. Kamu Juara BIJAKU!')));
  scr.appendChild(h('p', { class: 'lp-foot' }, 'Ikut laluan ini setiap hari. Selepas matlamat tercapai, bebas main permainan kegemaran!'));
  scr.appendChild(tabBar('laluan'));

  function openChest(cid, ready, opened, big) {
    if (opened) { sfx.tap(); speak('Peti ini sudah dibuka.'); return; }
    if (!ready) { sfx.bump?.(); speak(big ? 'Selesaikan semua langkah dalam unit ini untuk membuka peti harta!' : 'Selesaikan lima langkah untuk membuka peti ini!'); return; }
    const coins = big ? 40 : 15;
    const stk = STICKERS[(cid.length * 7 + parseInt(cid, 10) * 13 + (big ? 5 : 0)) % STICKERS.length];
    p.coins += coins;
    p.stickers ||= [];
    if (!p.stickers.includes(stk)) p.stickers.push(stk);
    s.chests.push(cid); st.ssave(); save();
    sfx.reward(); confetti(30);
    const back = h('div', { class: 'lp-pop', onclick: () => { back.remove(); go('/laluan'); } },
      h('div', { class: 'lp-pop-box' }, h('div', { class: 'lp-pop-chest', html: CHEST(true) }), ribbon(big ? 'Tahniah!' : 'Hebat!', { sub: big ? 'Unit selesai!' : 'Peti harta dibuka!' }),
        h('div', { class: 'lp-pop-r' }, h('span', {}, icon('coin'), `+${coins}`), h('span', { class: 'emo' }, stk)), selfieButton(big ? `Unit ${parseInt(cid, 10)} selesai!` : 'Peti harta Laluan Bijak'), h('button', { class: 'btn green', type: 'button' }, 'Teruskan')));
    document.body.appendChild(back);
    speak(big ? `Tahniah! Unit selesai. Kamu dapat ${coins} syiling dan satu pelekat!` : `Hebat! Kamu dapat ${coins} syiling dan satu pelekat!`, { mood: 'pujian' });
  }

  // tatal ke langkah semasa + sambutan langkah yang baru selesai
  setTimeout(() => {
    const el = road.querySelector('.lp-node.cur') || road.querySelector('.lp-node:last-of-type');
    el?.scrollIntoView({ block: 'center', behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    const ci = cele !== null ? +cele : st.fresh.length ? st.fresh[st.fresh.length - 1] : null;
    if (ci !== null && ci < cur) {
      road.querySelector(`.lp-node[data-i="${ci}"]`)?.classList.add('just');
      sfx.correct(); confetti(18);
      if (st.todayCount === st.goal) { setTimeout(() => { sfx.reward(); speak('Syabas! Matlamat hari ini tercapai. Kamu memang rajin!', { mood: 'pujian' }); }, 600); }
      else { cheer('good'); setTimeout(() => speak(st.todayCount < st.goal ? `Lagi ${st.goal - st.todayCount} langkah untuk capai matlamat hari ini!` : 'Jom sambung langkah seterusnya!'), 1300); }
    } else if (!Object.values(s.seen).some((d) => d !== 'awal') && cur === 0) {
      speak(`Ini Laluan Bijak, ${callOf(p)}! Setiap hari, ikut ${st.goal} langkah. Tekan bulatan yang bersinar untuk mula.`);
    } else speak(st.todayCount >= st.goal ? 'Matlamat hari ini sudah tercapai. Hebat!' : `Jom! ${gameName(st.node?.g || 'abc')} sedang menunggu.`);
  }, 60);
  return scr;
}

// kad ringkas untuk skrin utama
export function pathHeroInfo(p = profile()) {
  const st = pathState(p);
  return { st, node: st.node, name: st.node ? gameName(st.node.g) : '', step: st.cur + 1 };
}
