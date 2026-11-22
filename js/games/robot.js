// =====================================================================
//  ROBOT KOD CILIK — asas pengaturcaraan tanpa membaca
//  Susun anak panah (atas/bawah/kiri/kanan), tekan "Jalan", robot ikut arahan.
//  Bab 1: laluan terus · Bab 2: elak halangan · Bab 3: kutip bateri dahulu
// =====================================================================
import { h, clear } from '../ui.js';
import { icon } from '../icons.js';
import { sfx } from '../audio.js';

const DIRS = { atas: [0, -1], bawah: [0, 1], kiri: [-1, 0], kanan: [1, 0] };
const DIR_KEYS = ['atas', 'kanan', 'bawah', 'kiri'];
const DIR_COL = { atas: '#ff6b6b', kanan: '#2fbf71', bawah: '#3d8bff', kiri: '#ffb020' };
const ROT = { atas: 0, kanan: 90, bawah: 180, kiri: 270 };
const key = (x, y) => `${x},${y}`;

// BFS laluan terpendek (senarai arah) atau null
function bfs(size, blocked, from, to) {
  const q = [[from[0], from[1]]];
  const prev = new Map([[key(...from), null]]);
  while (q.length) {
    const [x, y] = q.shift();
    if (x === to[0] && y === to[1]) break;
    for (const d of DIR_KEYS) {
      const nx = x + DIRS[d][0], ny = y + DIRS[d][1];
      const k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= size || ny >= size || blocked.has(k) || prev.has(k)) continue;
      prev.set(k, [x, y, d]);
      q.push([nx, ny]);
    }
  }
  if (!prev.has(key(...to))) return null;
  const path = [];
  let cur = prev.get(key(...to));
  while (cur) { path.unshift(cur[2]); cur = prev.get(key(cur[0], cur[1])); }
  return path;
}
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));

// Jana teka-teki boleh selesai untuk level n (pusingan r)
export function makePuzzle(n, r, rng) {
  const ch = Math.min(2, Math.floor((n - 1) / 10)), k = (n - 1) % 10;
  const size = ch === 0 ? 4 : ch === 1 ? 5 : (k < 5 ? 5 : 6);
  for (let tries = 0; tries < 400; tries++) {
    const cells = [];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) cells.push([x, y]);
    const sh = rng.shuffle(cells);
    const start = sh[0], goal = sh[1];
    const blocked = new Set();
    const nObs = ch === 0 ? 0 : ch === 1 ? 2 + Math.floor(k / 2) : 2 + Math.floor(k / 3);
    for (let i = 0; i < nObs; i++) blocked.add(key(...sh[2 + i]));
    const nBat = ch === 2 ? 1 + Math.floor(k / 4) : 0;
    const bats = sh.slice(2 + nObs, 2 + nObs + nBat);
    // laluan terbaik: semua bateri (sebarang urutan) kemudian bintang
    let best = null;
    for (const order of perms(bats)) {
      let pos = start, total = [];
      let ok = true;
      for (const b of [...order, goal]) { const p = bfs(size, blocked, pos, b); if (!p) { ok = false; break; } total = total.concat(p); pos = b; }
      if (ok && (!best || total.length < best.length)) best = total;
    }
    if (!best) continue;
    const len = best.length;
    // sasaran panjang ikut kesukaran
    const [lo, hi] = ch === 0 ? [[1, 2], [2, 3], [2, 3], [3, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6], [5, 6]][k]
      : ch === 1 ? [4 + Math.floor(k / 3), 6 + Math.floor(k / 3)] : [5 + Math.floor(k / 2), 8 + Math.floor(k / 2)];
    if (len < lo || len > hi) continue;
    // Bab 1 awal: laluan lurus dahulu (satu arah sahaja)
    if (ch === 0 && k < 3 && new Set(best).size > 1) continue;
    // Bab 2: halangan mesti mengubah laluan (bukan laluan terus)
    if (ch === 1 && bfs(size, new Set(), start, goal).length === bfs(size, blocked, start, goal).length && r === 0 && k > 2) continue;
    const deco = [...blocked].map((b, i) => ({ k: b, kind: ['batu', 'pokok', 'kolam', 'kotak'][(i + n) % 4] }));
    return { size, start, goal, blocked, deco, bats: bats.map((b) => key(...b)), solution: best, maxSlots: Math.min(16, len + 4) };
  }
  // sandaran (tidak sepatutnya berlaku)
  return { size: 4, start: [0, 0], goal: [2, 0], blocked: new Set(), deco: [], bats: [], solution: ['kanan', 'kanan'], maxSlots: 6 };
}

const ROBOT_SVG = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <ellipse cx="50" cy="92" rx="30" ry="6" fill="#000" opacity=".18"/>
  <path d="M50 6v10" stroke="#5c4bd1" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="6" r="5" fill="#ff5d8f"/>
  <rect x="18" y="16" width="64" height="44" rx="16" fill="#e9e6ff"/><rect x="18" y="16" width="64" height="44" rx="16" fill="url(#rbG)"/>
  <rect x="26" y="25" width="48" height="26" rx="11" fill="#2b2350"/>
  <circle cx="40" cy="38" r="6" fill="#5ff0ff"/><circle cx="60" cy="38" r="6" fill="#5ff0ff"/><circle cx="42" cy="36" r="2" fill="#fff"/><circle cx="62" cy="36" r="2" fill="#fff"/>
  <rect x="12" y="30" width="8" height="16" rx="4" fill="#9b87ff"/><rect x="80" y="30" width="8" height="16" rx="4" fill="#9b87ff"/>
  <rect x="26" y="60" width="48" height="24" rx="10" fill="#7c5cff"/><circle cx="50" cy="72" r="6" fill="#ffd43b"/><path d="M47 72h6M50 69v6" stroke="#b07c00" stroke-width="2"/>
  <rect x="28" y="84" width="14" height="8" rx="4" fill="#5c4bd1"/><rect x="58" y="84" width="14" height="8" rx="4" fill="#5c4bd1"/>
  <defs><linearGradient id="rbG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#c9c0ff" stop-opacity=".6"/></linearGradient></defs>
</svg>`;
const GOAL_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="70" rx="38" ry="16" fill="#ffe066"/><ellipse cx="50" cy="66" rx="30" ry="12" fill="#fff3bf"/><path d="M50 14l9 18 20 3-14.5 14 3.5 20L50 59.5 32 69l3.5-20L21 35l20-3z" fill="#ffd23f" stroke="#e08a00" stroke-width="3" stroke-linejoin="round"/></svg>';
const BAT_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="88" rx="20" ry="5" fill="#000" opacity=".15"/><rect x="42" y="12" width="16" height="8" rx="3" fill="#868e96"/><rect x="30" y="18" width="40" height="66" rx="10" fill="#2fbf71" stroke="#1a8a4e" stroke-width="4"/><path d="M54 30 40 54h10l-4 20 14-26H50z" fill="#fff"/></svg>';
const OBS_SVG = {
  batu: '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="84" rx="34" ry="8" fill="#000" opacity=".15"/><path d="M18 80 28 46 48 30 72 38 84 62 78 82Z" fill="#a0a7b4"/><path d="M28 46 48 30 72 38 60 52 36 56Z" fill="#c4cad4"/><path d="M60 52 72 38 84 62Z" fill="#868e96"/></svg>',
  pokok: '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="88" rx="26" ry="6" fill="#000" opacity=".15"/><rect x="44" y="58" width="12" height="30" rx="4" fill="#8a5d36"/><circle cx="50" cy="40" r="28" fill="#37b24d"/><circle cx="38" cy="32" r="12" fill="#51cf66"/><circle cx="62" cy="48" r="10" fill="#2f9e44"/></svg>',
  kolam: '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="60" rx="42" ry="26" fill="#4dabf7"/><ellipse cx="50" cy="56" rx="34" ry="18" fill="#74c0fc"/><path d="M30 54q6-4 12 0M56 62q6-4 12 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="70" cy="46" rx="8" ry="4" fill="#51cf66"/></svg>',
  kotak: '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="88" rx="32" ry="6" fill="#000" opacity=".15"/><path d="M20 36 50 22 80 36V74L50 88 20 74Z" fill="#d9a066"/><path d="M20 36 50 50 80 36 50 22Z" fill="#f0c48a"/><path d="M50 50V88" stroke="#a8743f" stroke-width="3"/><path d="M35 29l30 14" stroke="#a8743f" stroke-width="5" opacity=".5"/></svg>',
};
const arrowSvg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(${ROT[d]}deg)"><path d="M12 3 4 12h5v9h6v-9h5z" fill="currentColor"/></svg>`;

export default {
  play(ctx) {
    const { n, ch, rng, stage, later } = ctx;
    const rounds = ch < 2 ? 2 : 1;
    let ri = 0, running = false;
    ctx.rounds(rounds);

    function startRound() {
      clear(stage);
      ctx.round(ri);
      const pz = makePuzzle(n, ri, rng);
      const prog = [];
      const cellPct = 100 / pz.size;
      const board = h('div', { class: 'rb-board', style: `--sz:${pz.size}` });
      for (let y = 0; y < pz.size; y++) for (let x = 0; x < pz.size; x++) board.appendChild(h('div', { class: `rb-cell ${(x + y) % 2 ? 'b' : ''}` }));
      const place = (el, x, y) => { el.style.left = `${x * cellPct}%`; el.style.top = `${y * cellPct}%`; el.style.width = `${cellPct}%`; el.style.height = `${cellPct}%`; return el; };
      pz.deco.forEach((o) => { const [x, y] = o.k.split(',').map(Number); board.appendChild(place(h('div', { class: 'rb-obj rb-obs', html: OBS_SVG[o.kind] }), x, y)); });
      board.appendChild(place(h('div', { class: 'rb-obj rb-goal', html: GOAL_SVG }), ...pz.goal));
      const batEls = new Map();
      pz.bats.forEach((b) => { const [x, y] = b.split(',').map(Number); const el = place(h('div', { class: 'rb-obj rb-bat', html: BAT_SVG }), x, y); batEls.set(b, el); board.appendChild(el); });
      const robot = place(h('div', { class: 'rb-obj rb-robot', html: ROBOT_SVG }), ...pz.start);
      board.appendChild(robot);

      const slots = h('div', { class: 'rb-prog', 'aria-label': 'Arahan robot' });
      const renderProg = () => {
        clear(slots);
        for (let i = 0; i < pz.maxSlots; i++) {
          const d = prog[i];
          slots.appendChild(d ? h('button', { class: 'rb-slot full', type: 'button', style: `--ac:${DIR_COL[d]}`, 'aria-label': `Buang ${d}`, html: arrowSvg(d), onclick: () => { if (running) return; sfx.pop(); prog.splice(i, 1); renderProg(); } })
            : h('span', { class: `rb-slot ${i === prog.length ? 'next' : ''}` }));
        }
        runBtn.disabled = !prog.length;
      };
      const pad = h('div', { class: 'rb-pad' }, ...DIR_KEYS.map((d) => h('button', { class: `rb-arrow ${d}`, type: 'button', style: `--ac:${DIR_COL[d]}`, 'aria-label': d, html: arrowSvg(d), onclick: () => {
        if (running) return;
        if (prog.length >= pz.maxSlots) { sfx.bump(); return; }
        sfx.tap(); prog.push(d); renderProg();
      } })));
      const clearBtn = h('button', { class: 'rb-ctl clear', type: 'button', 'aria-label': 'Padam semua', onclick: () => { if (running) return; sfx.pop(); prog.length = 0; renderProg(); } }, icon('trash'));
      const runBtn = h('button', { class: 'rb-ctl run', type: 'button', onclick: () => run() }, icon('play'), 'Jalan');
      stage.append(h('div', { class: 'rb-wrap' }, board, h('div', { class: 'rb-panel' }, slots, h('div', { class: 'rb-ctls' }, clearBtn, pad, runBtn))));
      renderProg();

      const reset = () => { place(robot, ...pz.start); robot.style.setProperty('--rot', '0deg'); batEls.forEach((el) => el.classList.remove('got')); };
      async function run(auto = null) {
        if (running) return;
        const program = auto || prog.slice();
        if (!program.length) return;
        running = true; board.classList.add('running');
        let [x, y] = pz.start;
        const got = new Set();
        const wait = (ms) => new Promise((r) => later(r, ms));
        for (let i = 0; i < program.length; i++) {
          if (!ctx.alive()) return;
          const d = program[i];
          slots.children[i]?.classList.add('now');
          robot.dataset.dir = d;
          const nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          if (nx < 0 || ny < 0 || nx >= pz.size || ny >= pz.size || pz.blocked.has(key(nx, ny))) {
            robot.classList.remove('bump'); void robot.offsetWidth; robot.classList.add('bump');
            sfx.bump(); ctx.miss({ quiet: true });
            ctx.say(nx < 0 || ny < 0 || nx >= pz.size || ny >= pz.size ? 'Aduh, robot terkeluar dari papan! Cuba susun semula.' : 'Aduh, ada halangan! Cuba laluan lain.', 'galakan');
            await wait(900); reset(); running = false; board.classList.remove('running'); [...slots.children].forEach((s) => s.classList.remove('now'));
            return;
          }
          x = nx; y = ny; place(robot, x, y); sfx.step();
          const bk = key(x, y);
          if (batEls.has(bk) && !got.has(bk)) { got.add(bk); batEls.get(bk).classList.add('got'); sfx.coin(); }
          await wait(380);
          slots.children[i]?.classList.remove('now');
        }
        const atGoal = x === pz.goal[0] && y === pz.goal[1];
        if (atGoal && got.size === pz.bats.length) {
          robot.classList.add('win'); ctx.good();
          ri++;
          later(() => { running = false; if (ri < rounds) startRound(); else ctx.done(); }, 1500);
          return;
        }
        ctx.miss();
        ctx.say(atGoal ? 'Robot sampai, tetapi bateri belum dikutip semua. Cuba lagi!' : 'Robot belum sampai ke bintang. Tambah atau tukar anak panah, ya.', 'galakan');
        await wait(1000); reset(); running = false; board.classList.remove('running');
      }
      globalThis.__gmPlay && (globalThis.__gmPlay.solve = () => { prog.splice(0, prog.length, ...pz.solution); renderProg(); return run(pz.solution); });
      if (ri === 0) {
        ctx.say(ch === 2 ? 'Kutip semua bateri dahulu, kemudian bawa robot ke bintang. Susun anak panah, kemudian tekan Jalan!'
          : ch === 1 ? 'Ada halangan di papan. Susun anak panah supaya robot sampai ke bintang tanpa terlanggar!'
            : n === 1 ? 'Bantu robot sampai ke bintang! Tekan anak panah untuk menyusun arahan, kemudian tekan Jalan.' : 'Bawa robot ke bintang. Susun anak panah, kemudian tekan Jalan!');
      } else ctx.say('Satu lagi! Bawa robot ke bintang.');
    }
    startRound();
    return () => { running = false; };
  },
};
