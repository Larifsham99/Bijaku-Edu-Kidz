// Ujian struktur untuk semua 750 level (tanpa pelayar)
import { MODE_LIST, generateLevel, makeRound } from '../js/modes/index.js';
import { bfs } from '../js/engines/maze.js';
import { genMaze } from '../js/engines/maze.js';
import { COLORING, DOT_SHAPES, TRACE } from '../js/data/art.js';
import { hasSound } from '../js/audio.js';

let errors = 0, rounds = 0;
const fail = (where, msg) => { errors++; if (errors < 60) console.error('✗', where, msg); };
const typeCount = {};

for (const m of MODE_LIST) {
  const sigs = new Map();
  for (let L = 1; L <= 50; L++) {
    const where = `${m.id} L${L}`;
    let lvl;
    try { lvl = generateLevel(m.id, L); } catch (e) { fail(where, 'gagal jana: ' + e.stack); continue; }
    if (!lvl.rounds.length) fail(where, 'tiada pusingan');
    const sig = JSON.stringify(lvl.rounds);
    if (sigs.has(sig)) fail(where, `sama dengan level ${sigs.get(sig)}`);
    sigs.set(sig, L);
    lvl.rounds.forEach((r, i) => {
      rounds++;
      const w = `${where} R${i + 1} (${r.type}/${r.gen})`;
      typeCount[r.type] = (typeCount[r.type] || 0) + 1;
      if (!r.say) fail(w, 'tiada arahan suara');
      if (/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u.test(r.say)) fail(w, 'arahan suara mengandungi emoji: ' + r.say);
      if (/\b[A-Z]{3,}\b/.test(r.say)) fail(w, 'arahan suara mengandungi perkataan HURUF BESAR: ' + r.say);
      if (!r.skill || !m.skills[r.skill]) fail(w, 'kemahiran tidak sah: ' + r.skill);
      try { check(r, w); } catch (e) { fail(w, e.message); }
    });
  }
}

function check(r, w) {
  switch (r.type) {
    case 'choice': {
      const ids = r.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) throw new Error('id pilihan berulang ' + ids);
      if (r.options.length < 2) throw new Error('pilihan < 2');
      if (r.multi) { if (!r.answers.length || !r.answers.every((a) => ids.includes(a))) throw new Error('jawapan multi tiada'); }
      else if (!ids.includes(r.answer)) throw new Error('jawapan tiada dalam pilihan: ' + r.answer + ' / ' + ids);
      // pastikan muka pilihan tidak serupa (kecuali sengaja: multi item sama)
      const faces = r.options.map((o) => JSON.stringify({ e: o.e, lbl: o.lbl, t: o.t, html: o.html, shape: o.shape, color: o.color, swatch: o.swatch, scale: o.scale, flip: o.flip, rot: o.rot }));
      if (!r.multi && !['lainSendiri', 'kiraBeza'].includes(r.gen) && new Set(faces).size !== faces.length) throw new Error('pilihan kelihatan sama');
      if (r.show?.k === 'sound' && !hasSound(r.show.id)) throw new Error('bunyi tiada: ' + r.show.id);
      break;
    }
    case 'match': {
      if (r.pairs.length < 2) throw new Error('pasangan < 2');
      const s = r.pairs.map((p) => JSON.stringify(p.src));
      if (new Set(s).size !== s.length) throw new Error('sumber padanan berulang');
      const d = r.pairs.map((p) => JSON.stringify(p.dst));
      if (new Set(d).size !== d.length) throw new Error('sasaran padanan berulang');
      r.pairs.forEach((p) => { if (p.dst.sound && !hasSound(p.dst.sound)) throw new Error('bunyi tiada'); });
      break;
    }
    case 'sort': {
      if (r.bins.length < 2) throw new Error('bakul < 2');
      const b = new Set(r.bins.map((x) => x.id));
      if (r.items.length < 2) throw new Error('item < 2');
      r.items.forEach((it) => { if (!b.has(it.bin)) throw new Error('bakul item tiada'); });
      r.bins.forEach((bb) => { if (!r.items.some((it) => it.bin === bb.id)) throw new Error('bakul kosong ' + bb.id); });
      break;
    }
    case 'slots': {
      const need = r.slots.filter((s) => !s.given).map((s) => s.v);
      if (!need.length) throw new Error('tiada slot kosong');
      const tv = r.tiles.map((t) => t.v);
      const pool = [...tv];
      need.forEach((v) => { const i = pool.indexOf(v); if (i < 0) throw new Error('tiada jubin untuk ' + v); pool.splice(i, 1); });
      break;
    }
    case 'memory': {
      if (r.cards.length % 2) throw new Error('kad ganjil');
      const c = {}; r.cards.forEach((k) => { c[k.pair] = (c[k.pair] || 0) + 1; });
      if (!Object.values(c).every((v) => v === 2)) throw new Error('pasangan kad salah');
      break;
    }
    case 'recall': {
      if (r.variant === 'where') { r.ask.forEach((i) => { if (!r.grid[i]) throw new Error('petak ditanya kosong'); }); }
      else if (r.variant === 'missing') { if (!r.options.find((o) => o.id === r.answer)) throw new Error('jawapan hilang tiada'); }
      else if (r.variant === 'order') { if (r.tiles.length !== r.items.length) throw new Error('jubin susunan salah'); }
      break;
    }
    case 'simon': if (!r.seq.length || r.seq.some((i) => i >= r.pads.length)) throw new Error('urutan simon salah'); break;
    case 'maze': {
      const walls = r.walls ? genMaze(r.w, r.h, r.seed) : null;
      const rocks = new Set((r.rocks || []).map(([x, y]) => `${x},${y}`));
      let pos = r.start;
      for (const t of [...(r.items || []), r.goal]) { const p = bfs(r, walls, rocks, pos, t); if (!p) throw new Error('maze tiada laluan'); pos = t; }
      break;
    }
    case 'puzzle': {
      if (r.variant === 'missing') { if (r.options.filter((o) => o.correct).length !== 1) throw new Error('kepingan betul != 1'); const k = r.options.map((o) => o.pic.n + o.idx); if (new Set(k).size !== k.length) throw new Error('kepingan berulang'); }
      else if (r.order.length !== r.rows * r.cols) throw new Error('kepingan puzzle');
      break;
    }
    case 'color': { const a = COLORING.find((x) => x.id === r.art); if (!a) throw new Error('lukisan tiada'); r.guided.forEach((g) => { if (!a.regions.find((x) => x.id === g.region)) throw new Error('kawasan tiada'); }); break; }
    case 'dots': if (!DOT_SHAPES.find((x) => x.id === r.shape)) throw new Error('bentuk titik tiada'); break;
    case 'trace': if (!TRACE.find((x) => x.id === r.trace)) throw new Error('surih tiada'); break;
    case 'draw': break;
    case 'find': if (!r.items.some((i) => i.target)) throw new Error('tiada sasaran'); break;
    case 'diff': r.diffs.forEach((d) => { if (r.left[d] === r.right[d]) throw new Error('perbezaan tidak berbeza'); }); if (r.left.filter((e, i) => e !== r.right[i]).length !== r.diffs.length) throw new Error('bilangan beza'); break;
    default: throw new Error('jenis tidak dikenali ' + r.type);
  }
}

// Cabaran harian
for (let d = 0; d < 30; d++) {
  for (const [mid, gens] of [['abc'], ['nombor'], ['ingatan'], ['minda'], ['haiwan'], ['harian']]) {
    for (const L of [1, 15, 35]) { try { const r = makeRound(mid, L, `harian-${d}-${mid}`, gens); check(r, `harian ${mid}`); } catch (e) { fail(`harian ${mid} L${L}`, e.message); } }
  }
}

console.log(`Mod: ${MODE_LIST.length}, level: ${MODE_LIST.length * 50}, pusingan: ${rounds}`);
console.log('Jenis mekanik:', typeCount);
if (errors) { console.error(`\n${errors} ralat`); process.exit(1); }
console.log('✓ Semua level sah');

// Pemindahan tema lama -> tema baharu (pengguna tidak kehilangan tema yang dibeli)
{
  const { ensureThemeFields } = await import('../js/theme.js');
  const p = { theme: 'laut', owned: { themes: ['taman', 'klasik', 'laut', 'angkasa'] } };
  ensureThemeFields(p);
  const okMig = p.theme === 'batik' && ['kampung', 'batik', 'malam', 'masjid', 'klasik'].every((t) => p.owned.themes.includes(t)) && !p.owned.themes.includes('laut');
  if (!okMig) { console.error('✗ pemindahan tema lama gagal', p); process.exitCode = 1; } else console.log('✓ Tema lama dipindahkan (laut→batik, angkasa→malam, taman→kampung)');
}
