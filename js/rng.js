// Penjana nombor rawak berbiji (seeded) supaya setiap level sentiasa sama
// tetapi berbeza antara satu level dengan level lain.
export function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function makeRng(seed) {
  let a = typeof seed === 'number' ? seed >>> 0 : hashStr(String(seed));
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
    shuffle: (arr) => {
      const a2 = arr.slice();
      for (let i = a2.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a2[i], a2[j]] = [a2[j], a2[i]]; }
      return a2;
    },
    sample: (arr, n) => r.shuffle(arr).slice(0, Math.min(n, arr.length)),
    // pilih n item berbeza termasuk `must`
    withAnswer: (pool, answer, n, key = (x) => x) => {
      const others = r.shuffle(pool.filter((x) => key(x) !== key(answer))).slice(0, n - 1);
      return r.shuffle([answer, ...others]);
    },
  };
  return r;
}

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
