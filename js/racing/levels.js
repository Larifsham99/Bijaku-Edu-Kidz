// =====================================================================
//  CILIK RACING — 10 dunia × 50 level = 500 level (dijana berbiji)
//  Level yang sama sentiasa menghasilkan cabaran, susunan baris, halangan
//  dan trek yang sama. Data tulen: boleh diuji dalam Node.
// =====================================================================
import { makeRng } from '../rng.js';
import { RC_WORLDS, TIER_NAMES } from './data.js';
import { GEN, TOPIC_NAMES } from './education.js';
import { NUM_WORDS } from '../data/content.js';

export const LEVELS_PER_WORLD = 50;
export const TOTAL_LEVELS = RC_WORLDS.length * LEVELS_PER_WORLD;
export const tierOf = (n) => (n === 50 ? 6 : Math.ceil(n / 10));
// kelajuan asas (segmen sesaat) mengikut peringkat
const SPEED = [0, 10.5, 12, 13.5, 14.5, 15.5, 16];
const TRACK_KINDS = ['Lurus', 'Selekoh', 'Selekoh S', 'Bukit', 'Zigzag', 'Jambatan', 'Terowong', 'Lingkaran', 'Terapung', 'Jalan bercabang'];

function lanesFor(tier, n) {
  if (tier === 1) return 2;
  if (tier === 2) return 3;
  if (tier === 3) return n % 3 === 0 ? 4 : 3;
  if (tier === 4) return n % 2 === 0 ? 4 : 3;
  return 4;
}
function nTasks(tier, n) {
  if (tier === 1) return n <= 3 ? 1 : 2;
  return [0, 2, 3, n % 2 ? 3 : 4, 4, n % 2 ? 4 : 5, 5][tier];
}

// ---------- trek ----------
function buildTrack(rng, world, tier, n) {
  const pieces = [{ k: 's', n: 24 }];
  const kinds = new Set();
  const total = 900;
  let len = 24;
  const curveMax = [0, 2, 3, 4, 5, 5.5, 6][tier];
  const hillMax = [0, 600, 1200, 1800, 2400, 2800, 3200][tier];
  const options = ['s', 'c', 'c'];
  if (tier >= 2) options.push('sc', 'h');
  if (tier >= 3) options.push('zz', 'h', 'sp');
  if (world.bridge && tier >= 2) options.push('br');
  if (world.tunnel && tier >= 2) options.push('tn');
  while (len < total) {
    const kind = rng.pick(options);
    const dir = rng.chance(0.5) ? 1 : -1;
    let add = [];
    if (kind === 's') { add = [{ k: 's', n: rng.int(15, 40) }]; kinds.add('Lurus'); }
    if (kind === 'c') { add = [{ k: 'c', n: rng.int(30, 60), c: dir * rng.int(10, curveMax * 10) / 10 }]; kinds.add('Selekoh'); }
    if (kind === 'sc') { const c = rng.int(15, curveMax * 10) / 10; add = [{ k: 'c', n: 35, c: dir * c }, { k: 'c', n: 35, c: -dir * c }]; kinds.add('Selekoh S'); }
    if (kind === 'zz') { const c = rng.int(15, curveMax * 10) / 10; for (let i = 0; i < 4; i++) add.push({ k: 'c', n: 18, c: (i % 2 ? -dir : dir) * c }); kinds.add('Zigzag'); }
    if (kind === 'sp') { add = [{ k: 'c', n: rng.int(80, 120), c: dir * Math.min(curveMax, 3.5) }]; kinds.add('Lingkaran'); }
    if (kind === 'h') { add = [{ k: 'h', n: rng.int(40, 70), h: rng.int(Math.round(hillMax / 3), hillMax) * (rng.chance(0.7) ? 1 : -1) }]; kinds.add('Bukit'); }
    if (kind === 'br') { add = [{ k: 's', n: rng.int(30, 45), f: 'br' }]; kinds.add('Jambatan'); }
    if (kind === 'tn') { add = [{ k: rng.chance(0.5) ? 's' : 'c', n: rng.int(40, 60), c: dir * 1.5, f: 'tn' }]; kinds.add('Terowong'); }
    add.forEach((p) => { pieces.push(p); len += p.n; });
  }
  if (world.float) kinds.add('Terapung');
  const kindName = n === 50 ? 'Litar Juara' : [...kinds].filter((k) => k !== 'Lurus')[0] || 'Lurus';
  return { pieces, kinds: [...kinds], kind: kindName };
}

// ---------- baris objek ----------
function collectRows(rng, task, L, tier) {
  const rows = [];
  const count = task.need + (tier <= 2 ? 3 : 2);
  let last = -1;
  for (let r = 0; r < count; r++) {
    let lane = rng.int(0, L - 1);
    if (lane === last) lane = (lane + 1) % L;
    last = lane;
    const items = [{ lane, good: true }];
    if (task.distract.length && rng.chance(tier <= 2 ? 0.45 : 0.7)) {
      const other = (lane + rng.int(1, L - 1)) % L;
      items.push({ lane: other, good: false, d: rng.int(0, task.distract.length - 1) });
    }
    rows.push(items);
  }
  return rows;
}
function orderRows(rng, task, L) {
  return task.seq.map((s, k) => {
    const lane = rng.int(0, L - 1);
    const others = rng.shuffle(task.pool.filter((p) => p.v !== s.v)).slice(0, L - 1);
    const items = [];
    let oi = 0;
    for (let i = 0; i < L; i++) items.push(i === lane ? { lane: i, good: true, k } : { lane: i, good: false, spec: others[oi++] });
    return items;
  });
}
function dodgeRows(rng, L, tier, nRows) {
  const rows = [];
  for (let r = 0; r < nRows; r++) {
    const block = tier <= 2 ? 1 : rng.int(1, L - 1);
    // lorong pertama selepas kocok sentiasa bebas; baki dipilih sebagai halangan
    const lanes = rng.shuffle([...Array(L).keys()]);
    rows.push(lanes.slice(1, 1 + block));
  }
  return rows;
}

// ---------- pembina level ----------
const cache = new Map();
export function buildLevel(wi, n) {
  const key = `${wi}-${n}`;
  if (cache.has(key)) return cache.get(key);
  const world = RC_WORLDS[wi];
  const rng = makeRng(`cilik-racing-${world.id}-${n}`);
  const tier = tierOf(n);
  const L = lanesFor(tier, n);
  const count = nTasks(tier, n);
  const topics = world.topics;
  // giliran topik berbeza bagi setiap level supaya tidak berulang
  // topik utama berputar sama rata; topik tambahan dipilih rawak berbiji
  const learnCount = tier === 1 ? 1 : tier === 6 ? 4 : count - 1;
  const chosen = [topics[(n - 1) % topics.length]];
  for (const t of rng.shuffle(topics)) if (chosen.length < learnCount && !chosen.includes(t)) chosen.push(t);
  const tasks = [];
  chosen.forEach((topic, i) => {
    let t;
    // "Puzzle Racing": corak kadangkala menjadi hentian pit
    if (topic === 'corak' && (n + i) % 2 === 0) t = GEN.corak(rng, { k: L, tier }, true);
    else t = GEN[topic](rng, { k: L, tier });
    tasks.push(t);
  });
  // cabaran pemanduan: elak halangan & kutip bintang
  const extra = count - tasks.length;
  for (let i = 0; i < extra; i++) {
    const pick = (n + i) % 2 === 0 ? 'dodge' : 'stars';
    if (pick === 'dodge') tasks.push({ kind: 'dodge', topic: 'elak', skill: 'pemanduan', say: 'Elak halangan di hadapan!', nRows: Math.min(8, 3 + tier + (n === 50 ? 1 : 0)) });
    else { const need = rng.int(2, Math.min(4, tier + 1)); tasks.push({ kind: 'collect', topic: 'bintang', skill: 'pemanduan', say: `Kutip ${NUM_WORDS[need]} bintang!`, target: { t: 'star', n: 'bintang' }, need, distract: [], card: [{ t: 'star' }] }); }
  }
  // susun: pemanasan dahulu, pemanduan diselang-seli
  const ordered = n === 50 ? tasks : rng.shuffle(tasks.slice(0, -1)).concat(tasks.slice(-1));
  ordered.forEach((t, i) => {
    t.id = `${key}-t${i}`;
    if (t.kind === 'collect') t.rows = collectRows(rng, t, L, tier);
    if (t.kind === 'order') t.rows = orderRows(rng, t, L);
    if (t.kind === 'dodge') t.rows = dodgeRows(rng, L, tier, t.nRows);
    t.gap = rng.int(tier <= 1 ? 22 : 16, tier <= 1 ? 30 : 26); // jarak pemanduan bebas selepas tugasan (segmen)
  });
  const track = buildTrack(rng, world, tier, n);
  const skills = [...new Set(ordered.map((t) => t.topic))];
  const level = {
    id: `${world.id}-${n}`,
    world: world.id, wi, n, tier,
    difficulty: Math.min(5, tier),
    tierName: TIER_NAMES[tier],
    lanes: L,
    speed: SPEED[tier],
    objective: skills.map((s) => TOPIC_NAMES[s] || (s === 'elak' ? 'Elak halangan' : s === 'bintang' ? 'Kutip bintang' : s)).join(' · '),
    skills,
    tasks: ordered,
    track,
    obstacle: world.obs,
    collectibles: ordered.filter((t) => t.kind === 'collect').map((t) => t.target),
    checkpoints: ordered.length,
    reward: { stars: 3, coinsLike: 0, medalAt: [10, 25, 50].includes(n) ? n : 0, trophy: n === 50 },
    complete: 'Selesaikan semua cabaran dan sampai ke garisan penamat',
    special: n === 50,
    tutorial: wi === 0 && n <= 3,
  };
  cache.set(key, level);
  return level;
}
export { TRACK_KINDS };
