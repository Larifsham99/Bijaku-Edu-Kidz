// Pendaftaran 15 mod permainan + penjana level (50 level setiap mod = 750 level)
import { makeRng } from '../rng.js';
import { tier, TIERS } from './helpers.js';
import { abc, nombor, warna, bunyi, puzzle, ingatan, seni, bayang } from './modesA.js';
import { maze, harian, kelas, soleh, haiwan, minda, misi } from './modesB.js';

export const MODE_LIST = [abc, nombor, warna, bunyi, puzzle, ingatan, seni, bayang, maze, harian, kelas, soleh, haiwan, minda, misi];
export const MODES = Object.fromEntries(MODE_LIST.map((m) => [m.id, m]));
export const LEVELS_PER_MODE = 50;
export { TIERS, tier };

const BASE_ROUNDS = [3, 4, 4, 5, 5];

export function isSpecial(L) { return L % 5 === 0; }

export function levelPlan(mode, L, rng) {
  const t = tier(L);
  if (mode.plan) return mode.plan(L, rng);
  const count = mode.rounds ? mode.rounds(L) : BASE_ROUNDS[t - 1];
  const pool = mode.tiers[t - 1];
  // putar kumpulan permainan supaya level berturutan bermula dengan aktiviti berbeza
  const rot = (L - 1) % pool.length;
  const rotated = [...pool.slice(rot), ...pool.slice(0, rot)];
  const head = rotated[0];
  const rest = rng.shuffle(rotated.slice(1));
  const seq = [head, ...rest];
  const plan = Array.from({ length: count }, (_, i) => seq[i % seq.length]);
  if (isSpecial(L)) {
    // Cabaran khas setiap 5 level: tambah satu pusingan gabungan kemahiran daripada peringkat sebelumnya
    const all = [...new Set(mode.tiers.slice(0, t).flat())].filter((g) => !plan.includes(g));
    plan.push(all.length ? rng.pick(all) : rng.pick(pool));
  }
  return plan;
}

const cache = new Map();
export function generateLevel(modeId, L) {
  const key = `${modeId}:${L}`;
  if (cache.has(key)) return cache.get(key);
  const mode = MODES[modeId];
  if (!mode) throw new Error('Mod tidak wujud: ' + modeId);
  const rng = makeRng(`dunia-cilik:${key}`);
  const plan = levelPlan(mode, L, rng);
  const ctx = { world: mode.world ? mode.world(L) : null };
  const rounds = plan.map((g) => {
    const fn = mode.gens[g];
    if (!fn) throw new Error(`Penjana ${g} tiada dalam ${modeId}`);
    const r = fn(rng, L, ctx);
    r.gen = g;
    return r;
  });
  const lvl = { modeId, level: L, tier: tier(L), special: isSpecial(L), rounds, world: ctx.world };
  cache.set(key, lvl);
  return lvl;
}

// Satu pusingan rawak daripada mod tertentu (untuk Cabaran Harian)
export function makeRound(modeId, L, seed, gens) {
  const mode = MODES[modeId];
  const rng = makeRng(seed);
  const pool = gens || mode.tiers[tier(L) - 1];
  const g = rng.pick(pool.filter((x) => !['kira', 'jalan', 'susun', 'gambar', 'bantu'].includes(x) || modeId !== 'misi'));
  const ctx = { world: mode.world ? mode.world(L) : null };
  const r = mode.gens[g](rng, L, ctx);
  r.gen = g;
  return r;
}

// Senarai semua kemahiran (untuk dashboard ibu bapa)
export const ALL_SKILLS = MODE_LIST.flatMap((m) => Object.entries(m.skills).map(([id, n]) => ({ id, n, mode: m.id })));
