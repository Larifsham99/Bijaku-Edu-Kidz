// =====================================================================
//  MAKMAL CILIK — sains awal yang selamat & tepat
//  Bab 1: Campur Warna (warna primer → sekunder; tambah putih/hitam)
//  Bab 2: Timbul atau Tenggelam? (ramal, kemudian uji dalam tangki air)
//  Bab 3: Kuasa Magnet (hanya benda besi/keluli melekat pada magnet)
// =====================================================================
import { h, clear } from '../ui.js';
import { icon } from '../icons.js';
import { sfx } from '../audio.js';
import { artSvg } from '../tekasilang/art.js';

// ---------- warna ----------
const PAINT = { merah: '#f03e3e', kuning: '#ffd43b', biru: '#1c7ed6', putih: '#ffffff', hitam: '#212529' };
const MIX = {
  'kuning+merah': ['oren', '#ff8a1f'], 'biru+merah': ['ungu', '#8f3fc9'], 'biru+kuning': ['hijau', '#2fb344'],
  'merah+putih': ['merah jambu', '#ff8fb8'], 'biru+putih': ['biru muda', '#74c0fc'], 'kuning+putih': ['kuning cair', '#fff3a3'],
  'hitam+putih': ['kelabu', '#9aa0a6'], 'hitam+merah': ['merah tua', '#9b1c1c'], 'biru+hitam': ['biru tua', '#123e7a'], 'hitam+kuning': ['kuning gelap', '#8c7a12'],
};
const mixOf = (a, b) => (a === b ? [a, PAINT[a]] : MIX[[a, b].sort().join('+')]);
const TARGETS = [['oren', 'merah', 'kuning'], ['hijau', 'biru', 'kuning'], ['ungu', 'merah', 'biru'], ['merah jambu', 'merah', 'putih'], ['biru muda', 'biru', 'putih'], ['kelabu', 'hitam', 'putih']];

// ---------- benda untuk uji ----------
const P = (d, f = 'none', s = 'none', w = 0, extra = '') => `<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const DRAW = {
  bola: '<circle cx="50" cy="52" r="32" fill="#ff6b6b"/><path d="M18 52h64" stroke="#fff" stroke-width="7"/><path d="M50 20q18 32 0 64" stroke="#ffd43b" stroke-width="7" fill="none"/><circle cx="38" cy="38" r="7" fill="#fff" opacity=".5"/>',
  itik: '<ellipse cx="54" cy="66" rx="32" ry="20" fill="#ffd43b"/><circle cx="36" cy="40" r="17" fill="#ffd43b"/><path d="M16 42l-10 4 10 4z" fill="#ff922b"/><circle cx="32" cy="36" r="3.5" fill="#212529"/><path d="M60 58q14-6 20 4" stroke="#fab005" stroke-width="5" fill="none"/>',
  span: '<path d="M18 34 74 26 86 40 86 72 30 80 18 66Z" fill="#ffe066"/><path d="M18 34 74 26 86 40 30 48Z" fill="#fff3bf"/><path d="M30 48 86 40V72L30 80Z" fill="#fcc419"/>' + [[36, 60], [52, 58], [68, 54], [44, 70], [62, 66], [40, 38], [60, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#e0a800"/>`).join(''),
  kayu: '<path d="M14 40 64 26 88 38 88 64 38 78 14 66Z" fill="#c68a4c"/><path d="M14 40 64 26 88 38 38 52Z" fill="#e0a96d"/><path d="M38 52 88 38V64L38 78Z" fill="#a86b32"/><path d="M28 44q20-6 40-11M34 49q20-6 40-11" stroke="#b07a40" stroke-width="2" fill="none"/>',
  botol: '<rect x="40" y="8" width="20" height="10" rx="3" fill="#1c7ed6"/><path d="M42 18h16v8q14 6 14 20v38q0 8-8 8H36q-8 0-8-8V46q0-14 14-20z" fill="#d0ebff" stroke="#74c0fc" stroke-width="3"/><path d="M38 50h24" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
  bulu: '<path d="M22 86 76 18" stroke="#868e96" stroke-width="3"/><path d="M76 18q8 30-30 54Q34 60 76 18Z" fill="#91a7ff"/><path d="M76 18q-34 10-38 48Q52 52 76 18Z" fill="#bac8ff"/>',
  kunci: '<circle cx="30" cy="50" r="18" fill="none" stroke="#fab005" stroke-width="9"/><path d="M48 50h40M78 50v12M68 50v9" stroke="#fab005" stroke-width="9" stroke-linecap="square"/>',
  paku: '<rect x="20" y="20" width="60" height="10" rx="3" fill="#868e96"/><path d="M44 30h12v42l-6 14-6-14z" fill="#adb5bd"/><path d="M47 34v36" stroke="#dee2e6" stroke-width="2"/>',
  guli: '<circle cx="50" cy="52" r="26" fill="#74c0fc"/><path d="M34 44q16 12 30-10" stroke="#e64980" stroke-width="7" fill="none"/><circle cx="40" cy="40" r="6" fill="#fff" opacity=".7"/>',
  gunting: '<circle cx="30" cy="72" r="12" fill="none" stroke="#e03131" stroke-width="7"/><circle cx="62" cy="76" r="12" fill="none" stroke="#e03131" stroke-width="7"/><path d="M36 62 76 14M56 66 30 16" stroke="#adb5bd" stroke-width="8" stroke-linecap="round"/><circle cx="46" cy="40" r="3" fill="#495057"/>',
  klip: '<path d="M38 82V30a12 12 0 0 1 24 0v44a7 7 0 0 1-14 0V36" fill="none" stroke="#adb5bd" stroke-width="6" stroke-linecap="round"/>',
  peniti: '<path d="M22 64 78 40" stroke="#adb5bd" stroke-width="5" stroke-linecap="round"/><path d="M22 64 74 52" stroke="#ced4da" stroke-width="5" stroke-linecap="round"/><circle cx="18" cy="66" r="7" fill="none" stroke="#adb5bd" stroke-width="5"/><rect x="72" y="36" width="16" height="20" rx="4" fill="#868e96" transform="rotate(-20 80 46)"/>',
  skru: '<path d="M30 22h40l-6 12H36z" fill="#868e96"/><path d="M40 34h20v40l-10 14-10-14z" fill="#adb5bd"/><path d="M40 42l20 6M40 52l20 6M40 62l20 6" stroke="#868e96" stroke-width="3"/><path d="M42 26h16" stroke="#495057" stroke-width="3"/>',
  sepana: '<path d="M26 30a16 16 0 1 0 14 22l34 30 8-8-30-34A16 16 0 0 0 26 30" fill="#adb5bd"/><path d="M20 26 30 40 40 30 30 20Z" fill="#e9ecef"/>',
  pemadam: '<path d="M16 50 54 24 84 46 46 74Z" fill="#ff8fab"/><path d="M16 50 46 74V84L16 60Z" fill="#e64980"/><path d="M46 74 84 46V56L46 84Z" fill="#f06595"/><path d="M34 38 64 60" stroke="#4dabf7" stroke-width="10"/>',
  kertas: '<path d="M24 14h40l14 14v58H24z" fill="#fff" stroke="#ced4da" stroke-width="3"/><path d="M64 14v14h14" fill="#e9ecef" stroke="#ced4da" stroke-width="3"/><path d="M34 42h34M34 54h34M34 66h22" stroke="#a5d8ff" stroke-width="4"/>',
  gelas: '<path d="M26 18h48l-6 66H32z" fill="#e7f5ff" stroke="#74c0fc" stroke-width="4"/><path d="M30 46h40l-3 36H33z" fill="#a5d8ff" opacity=".7"/><path d="M36 26 38 70" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
};
const objSvg = (id, size = 110) => (DRAW[id] ? `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${DRAW[id]}</svg>` : artSvg(id, { size }));

// [id, nama, timbul?]
const FLOAT = [['daun', 'daun', true], ['bola', 'bola plastik', true], ['itik', 'itik getah', true], ['span', 'span', true], ['kayu', 'kayu', true], ['epal', 'epal', true], ['botol', 'botol plastik kosong', true], ['bulu', 'bulu burung', true], ['kelapa', 'kelapa', true], ['pensel', 'pensel', true],
  ['batu', 'batu', false], ['syiling', 'syiling', false], ['kunci', 'kunci', false], ['paku', 'paku', false], ['guli', 'guli', false], ['gunting', 'gunting', false], ['telur', 'telur', false], ['sepana', 'sepana', false]];
// [id, nama, melekat pada magnet?] — hanya benda besi/keluli
const MAGNET = [['paku', 'paku', true], ['klip', 'klip kertas', true], ['peniti', 'peniti', true], ['skru', 'skru', true], ['gunting', 'gunting', true], ['sepana', 'sepana', true],
  ['kayu', 'kayu', false], ['daun', 'daun', false], ['pemadam', 'pemadam', false], ['kertas', 'kertas', false], ['pensel', 'pensel', false], ['bola', 'bola plastik', false], ['gelas', 'gelas', false], ['itik', 'itik getah', false], ['epal', 'epal', false], ['span', 'span', false]];

const MAGNET_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 14h22v40a8 8 0 0 0 16 0V14h22v40a30 30 0 0 1-60 0z" fill="#e03131"/><path d="M20 14h22v14H20zM58 14h22v14H58z" fill="#ced4da"/><path d="M26 42v12a24 24 0 0 0 12 20" stroke="#fff" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/></svg>';

// pusingan untuk level n
export function makeRounds(n, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  if (ch === 0) {
    const pool = TARGETS.slice(0, k < 4 ? 3 : k < 7 ? 5 : 6);
    const picks = rng.shuffle(pool).concat(rng.shuffle(pool)).slice(0, 3);
    return picks.map((t, i) => {
      const beakers = k < 4 ? ['merah', 'kuning', 'biru'] : k < 7 ? ['merah', 'kuning', 'biru', 'putih'] : ['merah', 'kuning', 'biru', 'putih', 'hitam'];
      // jenis 'buat' (pilih dua bikar) atau 'teka' (apa hasilnya?) — selang-seli dari level 3
      return { kind: k >= 2 && i === 1 ? 'teka' : 'buat', target: t, beakers };
    });
  }
  const list = ch === 1 ? FLOAT : MAGNET;
  if (k < 5) {
    const yes = rng.shuffle(list.filter((x) => x[2])), no = rng.shuffle(list.filter((x) => !x[2]));
    return rng.shuffle([yes[0], yes[1], no[0], no[1]]).map((o) => ({ kind: 'satu', test: ch === 1 ? 'air' : 'magnet', obj: o }));
  }
  return [0, 1, 2].map(() => {
    const yes = rng.shuffle(list.filter((x) => x[2])), no = rng.shuffle(list.filter((x) => !x[2]));
    const ny = rng.int(1, 2);
    return { kind: 'pilih', test: ch === 1 ? 'air' : 'magnet', objs: rng.shuffle([...yes.slice(0, ny), ...no.slice(0, 3 - ny)]) };
  });
}

export default {
  play(ctx) {
    const { n, rng, stage, later } = ctx;
    const rounds = makeRounds(n, rng);
    let ri = 0;
    ctx.rounds(rounds.length);
    const next = () => { ri++; later(() => (ri < rounds.length ? start() : ctx.done()), 1700); };

    function start() {
      clear(stage);
      ctx.round(ri);
      const rd = rounds[ri];
      if (rd.kind === 'buat' || rd.kind === 'teka') colorRound(rd); else testRound(rd);
    }

    // ---------- campur warna ----------
    function colorRound(rd) {
      const [tName, a, b] = rd.target;
      const tCol = mixOf(a, b)[1];
      const flaskLiquid = h('div', { class: 'mk-liquid' });
      const flask = h('div', { class: 'mk-flask' }, h('div', { class: 'mk-flask-glass' }, flaskLiquid, h('i', { class: 'mk-bub' }), h('i', { class: 'mk-bub b2' })), h('div', { class: 'mk-flask-neck' }));
      const chosen = [];
      if (rd.kind === 'buat') {
        const goal = h('div', { class: 'mk-goal' }, h('span', { class: 'mk-splat', style: `--c:${tCol}` }), h('b', {}, tName.toUpperCase()));
        const shelf = h('div', { class: 'mk-beakers' }, ...rd.beakers.map((c) => h('button', { class: `mk-beaker ${c}`, type: 'button', style: `--c:${PAINT[c]}`, 'aria-label': `Cat ${c}`, onclick: (e) => pour(c, e.currentTarget) }, h('span', { class: 'mk-bk-liq' }), h('small', {}, c))));
        const resetBtn = h('button', { class: 'mk-reset', type: 'button', 'aria-label': 'Kosongkan kelalang', onclick: () => { sfx.pop(); empty(); } }, icon('replay'));
        stage.append(h('div', { class: 'mk-lab' }, goal, h('div', { class: 'mk-bench' }, flask, resetBtn), shelf));
        const empty = () => { chosen.length = 0; flaskLiquid.style.height = '0%'; shelf.querySelectorAll('.mk-beaker').forEach((x) => x.classList.remove('used')); };
        const pour = (c, el) => {
          if (chosen.length >= 2) return;
          sfx.drop(); chosen.push(c); el.classList.add('used', 'pouring'); later(() => el.classList.remove('pouring'), 700);
          flaskLiquid.style.background = PAINT[c]; flaskLiquid.style.height = chosen.length === 1 ? '35%' : '70%';
          if (chosen.length === 2) {
            const [mName, mCol] = mixOf(chosen[0], chosen[1]);
            later(() => {
              flaskLiquid.style.background = mCol; flask.classList.add('fizz'); sfx.pop();
              later(() => {
                flask.classList.remove('fizz');
                if (mName === tName) { ctx.good({ speakIt: false }); ctx.say(`${cap(chosen[0])} campur ${chosen[1]}, jadi ${mName}! Hebat!`, 'pujian'); next(); }
                else { ctx.miss(); ctx.say(`Itu warna ${mName}. Kita mahu ${tName}. Kosongkan dan cuba lagi!`, 'galakan'); later(empty, 1600); }
              }, 900);
            }, 650);
          }
        };
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { empty(); const btns = [...shelf.children]; pour(a, btns[rd.beakers.indexOf(a)]); later(() => pour(b, btns[rd.beakers.indexOf(b)]), 100); });
        ctx.say(ri === 0 && n === 1 ? `Jom jadi saintis! Buat warna ${tName}. Pilih dua cat untuk dicampur.` : `Buat warna ${tName}! Pilih dua cat.`);
      } else {
        // teka hasil campuran
        const opts = rng.shuffle([rd.target, ...rng.shuffle(TARGETS.filter((t) => t[0] !== tName)).slice(0, 2)]);
        flaskLiquid.style.height = '0%';
        const eq = h('div', { class: 'mk-eq' }, h('span', { class: 'mk-dot', style: `--c:${PAINT[a]}` }, a), h('b', {}, '+'), h('span', { class: 'mk-dot', style: `--c:${PAINT[b]}` }, b), h('b', {}, '='), h('b', { class: 'q' }, '?'));
        const choices = h('div', { class: 'mk-choices' }, ...opts.map((t) => h('button', { class: 'mk-choice', type: 'button', 'aria-label': t[0], onclick: (e) => answer(t, e.currentTarget) }, h('span', { class: 'mk-splat', style: `--c:${mixOf(t[1], t[2])[1]}` }), h('small', {}, t[0]))));
        stage.append(h('div', { class: 'mk-lab' }, eq, h('div', { class: 'mk-bench' }, flask), choices));
        let doneQ = false;
        const answer = (t, el) => {
          if (doneQ) return;
          if (t[0] === tName) {
            doneQ = true; el.classList.add('ok');
            flaskLiquid.style.background = PAINT[a]; flaskLiquid.style.height = '35%';
            later(() => { flaskLiquid.style.background = tCol; flaskLiquid.style.height = '70%'; flask.classList.add('fizz'); }, 500);
            ctx.good({ speakIt: false }); ctx.say(`Betul! ${cap(a)} campur ${b}, jadi ${tName}!`, 'pujian'); next();
          } else { ctx.miss(); el.classList.add('no'); ctx.say(`Bukan ${t[0]}. Cuba fikir lagi!`, 'galakan'); }
        };
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => answer(rd.target, choices.children[opts.indexOf(rd.target)]));
        ctx.say(`${cap(a)} campur ${b}, jadi warna apa?`);
      }
    }

    // ---------- timbul/tenggelam & magnet ----------
    function testRound(rd) {
      const air = rd.test === 'air';
      const YES = air ? 'Timbul' : 'Melekat', NO = air ? 'Tenggelam' : 'Tidak melekat';
      const objs = rd.kind === 'satu' ? [rd.obj] : rd.objs;
      const tank = h('div', { class: `mk-tank ${air ? 'air' : 'mag'}` },
        air ? h('div', { class: 'mk-water' }, h('i'), h('i', { class: 'w2' })) : h('div', { class: 'mk-magnet', html: MAGNET_SVG }),
        h('div', { class: 'mk-objs' }, ...objs.map((o, i) => h('div', { class: 'mk-obj', style: `--i:${i};--n:${objs.length}`, 'data-id': o[0], html: objSvg(o[0], 92) }))));
      const objEls = () => [...tank.querySelectorAll('.mk-obj')];
      const reveal = () => {
        objEls().forEach((el, i) => { el.classList.add(objs[i][2] ? 'yes' : 'no'); });
        if (air) sfx.drop(); else sfx.coin();
      };
      if (rd.kind === 'satu') {
        const o = rd.obj;
        let locked = false;
        const pick = (guess, el) => {
          if (locked) return;
          locked = true; el.classList.add('chosen');
          reveal();
          later(() => {
            const right = guess === o[2];
            const fact = air ? (o[2] ? `${cap(o[1])} timbul di atas air!` : `${cap(o[1])} tenggelam ke dasar!`)
              : (o[2] ? `${cap(o[1])} diperbuat daripada besi, jadi ia melekat pada magnet!` : `${cap(o[1])} tidak melekat pada magnet.`);
            if (right) { ctx.good({ speakIt: false }); ctx.say(`Betul! ${fact}`, 'pujian'); }
            else { ctx.miss({ quiet: true }); ctx.say(`Oh, ${fact.charAt(0).toLowerCase()}${fact.slice(1)} Tak apa, sekarang kita sudah tahu!`, 'galakan'); }
            next();
          }, 1100);
        };
        const btns = h('div', { class: 'mk-guess' },
          h('button', { class: 'mk-gbtn yes', type: 'button', onclick: (e) => pick(true, e.currentTarget) }, h('span', { class: 'mk-gic', html: air ? FLOAT_IC : STICK_IC }), YES),
          h('button', { class: 'mk-gbtn no', type: 'button', onclick: (e) => pick(false, e.currentTarget) }, h('span', { class: 'mk-gic', html: air ? SINK_IC : NOSTICK_IC }), NO));
        stage.append(h('div', { class: 'mk-lab' }, h('div', { class: 'mk-q' }, h('b', {}, cap(o[1]))), tank, btns));
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => pick(o[2], btns.children[o[2] ? 0 : 1]));
        ctx.say(air ? `${cap(o[1])}. Timbul atau tenggelam? Cuba teka!` : `${cap(o[1])}. Melekat pada magnet atau tidak? Cuba teka!`);
      } else {
        const sel = new Set();
        objEls().forEach((el, i) => { el.setAttribute('role', 'button'); el.setAttribute('aria-label', objs[i][1]); el.addEventListener('click', () => { if (tank.classList.contains('tested')) return; sfx.tap(); el.classList.toggle('sel'); el.classList.contains('sel') ? sel.add(i) : sel.delete(i); }); });
        const testBtn = h('button', { class: 'mk-test', type: 'button', onclick: () => test() }, icon('play'), 'Uji!');
        stage.append(h('div', { class: 'mk-lab' }, h('div', { class: 'mk-q' }, h('b', {}, air ? 'Tekan benda yang TIMBUL' : 'Tekan benda yang MELEKAT')), tank, testBtn));
        const test = () => {
          if (!sel.size) { ctx.say(air ? 'Tekan dahulu benda yang kamu rasa akan timbul.' : 'Tekan dahulu benda yang kamu rasa akan melekat.'); return; }
          tank.classList.add('tested'); reveal();
          const right = objs.every((o, i) => o[2] === sel.has(i));
          later(() => {
            const names = objs.filter((o) => o[2]).map((o) => o[1]).join(' dan ');
            if (right) { ctx.good({ speakIt: false }); ctx.say(`Tepat! ${cap(names)} ${air ? 'timbul' : 'melekat pada magnet'}!`, 'pujian'); next(); }
            else { ctx.miss(); ctx.say(`Hmm, lihat. ${cap(names)} ${air ? 'timbul' : 'melekat pada magnet'}. Jom cuba lagi!`, 'galakan'); later(() => { tank.classList.remove('tested'); objEls().forEach((el) => el.classList.remove('yes', 'no', 'sel')); sel.clear(); }, 2200); }
          }, 1200);
        };
        globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { sel.clear(); objEls().forEach((el, i) => { el.classList.toggle('sel', !!objs[i][2]); if (objs[i][2]) sel.add(i); }); test(); });
        ctx.say(air ? 'Benda mana yang akan timbul? Tekan semuanya, kemudian tekan Uji!' : 'Benda mana yang akan melekat pada magnet? Tekan semuanya, kemudian tekan Uji!');
      }
    }
    start();
  },
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const FLOAT_IC = '<svg viewBox="0 0 24 24"><path d="M2 16q2.5-2 5 0t5 0 5 0 5 0" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="10" r="4" fill="currentColor"/><path d="M12 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const SINK_IC = '<svg viewBox="0 0 24 24"><path d="M2 6q2.5-2 5 0t5 0 5 0 5 0" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="17" r="4" fill="currentColor"/><path d="M12 9v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const STICK_IC = '<svg viewBox="0 0 24 24"><path d="M5 3h5v8a2 2 0 0 0 4 0V3h5v8a7 7 0 0 1-14 0z" fill="currentColor"/><path d="M12 19v3M8 20l-1 2M16 20l1 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const NOSTICK_IC = '<svg viewBox="0 0 24 24"><path d="M5 3h5v8a2 2 0 0 0 4 0V3h5v8a7 7 0 0 1-14 0z" fill="currentColor"/><path d="M3 21 21 3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
