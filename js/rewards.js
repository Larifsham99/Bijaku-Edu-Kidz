// =====================================================================
//  SISTEM GANJARAN: bintang, syiling, bonus 5 level, trofi 10 level,
//  sijil 50 level, pelekat, lencana pencapaian
// =====================================================================
import { STICKERS } from './data/content.js';
import { modeProg, totalLevelsDone, mastery, save } from './store.js';
import { MODES, MODE_LIST } from './modes/index.js';

export const COIN_PER_LEVEL = 10;
export const BONUS_5 = 25;

export const TROPHY_NAMES = ['Trofi Gangsa', 'Trofi Perak', 'Trofi Emas', 'Trofi Berlian', 'Trofi Juara'];
export const TROPHY_E = ['🥉', '🥈', '🥇', '💎', '🏆'];

export const BADGES = [
  { id: 'first', e: '🌟', n: 'Langkah Pertama', d: 'Selesaikan level pertama', test: (p) => totalLevelsDone(p) >= 1 },
  { id: 'lv10', e: '🚀', n: 'Penjelajah Cilik', d: 'Selesaikan 10 level', test: (p) => totalLevelsDone(p) >= 10 },
  { id: 'lv50', e: '🧭', n: 'Pengembara Hebat', d: 'Selesaikan 50 level', test: (p) => totalLevelsDone(p) >= 50 },
  { id: 'lv150', e: '🦸', n: 'Wira Ilmu', d: 'Selesaikan 150 level', test: (p) => totalLevelsDone(p) >= 150 },
  { id: 'lv300', e: '👑', n: 'Raja Dunia Cilik', d: 'Selesaikan 300 level', test: (p) => totalLevelsDone(p) >= 300 },
  { id: 'star100', e: '⭐', n: '100 Bintang', d: 'Kumpul 100 bintang', test: (p) => p.totalStarsEarned >= 100 },
  { id: 'star500', e: '🌠', n: '500 Bintang', d: 'Kumpul 500 bintang', test: (p) => p.totalStarsEarned >= 500 },
  { id: 'allmodes', e: '🌈', n: 'Serba Boleh', d: 'Cuba kelima belas mod permainan', test: (p) => MODE_LIST.every((m) => Object.keys(p.modes[m.id]?.done || {}).length > 0) },
  { id: 'streak3', e: '🔥', n: '3 Hari Berturut', d: 'Bermain 3 hari berturut-turut', test: (p) => p.streak.count >= 3 },
  { id: 'streak7', e: '🏅', n: 'Seminggu Rajin', d: 'Bermain 7 hari berturut-turut', test: (p) => p.streak.count >= 7 },
  { id: 'daily1', e: '📅', n: 'Cabaran Harian', d: 'Selesaikan semua cabaran harian', test: (p) => Object.values(p.daily).some((d) => d.rewarded) },
  { id: 'daily5', e: '🗓️', n: 'Juara Harian', d: 'Selesaikan cabaran harian sebanyak 5 kali', test: (p) => Object.values(p.daily).filter((d) => d.rewarded).length >= 5 },
  { id: 'master5', e: '🎓', n: 'Pakar Cilik', d: 'Kuasai 5 kemahiran', test: (p) => Object.values(p.skills).filter((s) => mastery(s) === 3).length >= 5 },
  { id: 'master20', e: '🧠', n: 'Genius Cilik', d: 'Kuasai 20 kemahiran', test: (p) => Object.values(p.skills).filter((s) => mastery(s) === 3).length >= 20 },
  { id: 'cert1', e: '📜', n: 'Sijil Pertama', d: 'Tamatkan 50 level dalam satu mod', test: (p) => p.certs.length >= 1 },
  { id: 'free', e: '🎨', n: 'Seniman Bebas', d: 'Cuba Main Bebas', test: (p) => p.freeplay >= 1 },
  { id: 'shop', e: '🛍️', n: 'Bergaya', d: 'Dapatkan kostum atau avatar baharu', test: (p) => p.owned.avatars.length > 5 || p.owned.costumes.length > 2 },
];

export function checkBadges(p) {
  const fresh = [];
  for (const b of BADGES) if (!p.badges.includes(b.id) && b.test(p)) { p.badges.push(b.id); fresh.push(b); }
  return fresh;
}

function giveSticker(p) {
  const left = STICKERS.filter((s) => !p.stickers.includes(s));
  if (!left.length) return null;
  const s = left[(p.stickers.length * 7) % left.length];
  p.stickers.push(s);
  return s;
}

// Dipanggil apabila level selesai. Mengembalikan senarai ganjaran untuk dipaparkan
export function awardLevel(p, modeId, level, stars) {
  const prog = modeProg(p, modeId);
  const firstTime = prog.done[level] === undefined;
  const rewards = [];
  prog.done[level] = Math.max(prog.done[level] || 0, stars);
  prog.plays++;
  const coins = firstTime ? COIN_PER_LEVEL : Math.ceil(COIN_PER_LEVEL / 2);
  p.coins += coins;
  rewards.push({ e: '🪙', n: `+${coins} syiling` });
  if (firstTime && level % 5 === 0) {
    p.coins += BONUS_5;
    rewards.push({ e: '🎁', n: `Bonus 5 level: +${BONUS_5} syiling` });
    const st = giveSticker(p);
    if (st) rewards.push({ e: st, n: 'Pelekat baharu!' });
  }
  if (firstTime && level % 10 === 0) {
    const tid = `${modeId}-${level}`;
    if (!p.trophies.includes(tid)) {
      p.trophies.push(tid);
      const i = level / 10 - 1;
      rewards.push({ e: TROPHY_E[i], n: `${TROPHY_NAMES[i]} — ${MODES[modeId].n}`, big: true });
    }
  }
  if (Object.keys(prog.done).length >= 50 && !p.certs.includes(modeId)) {
    p.certs.push(modeId);
    rewards.push({ e: '📜', n: `Sijil Pencapaian ${MODES[modeId].n}!`, big: true, cert: modeId });
  }
  checkBadges(p).forEach((b) => rewards.push({ e: b.e, n: `Lencana: ${b.n}`, big: true }));
  save();
  return rewards;
}

export function addStars(p, n) {
  p.stars += n;
  p.totalStarsEarned += n;
}
