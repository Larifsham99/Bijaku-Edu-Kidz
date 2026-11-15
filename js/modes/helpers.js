// Pembantu bersama untuk penjana level
export const tier = (L) => Math.min(5, Math.ceil(L / 10));
export const TIERS = [
  { n: 'Peringkat Kenali', c: '#4cd18a', e: '🌱' },
  { n: 'Peringkat Fahami', c: '#54a0ff', e: '🌿' },
  { n: 'Peringkat Cekap', c: '#ff9f43', e: '🌳' },
  { n: 'Peringkat Bijak', c: '#a77bff', e: '🦉' },
  { n: 'Peringkat Juara Cilik', c: '#ff6b6b', e: '🏆' },
];
// Bilangan pilihan jawapan mengikut level (2 → 6)
export const nOpts = (L) => (L <= 4 ? 2 : L <= 12 ? 3 : L <= 30 ? 4 : 6);
export const lerp = (L, a, b) => Math.round(a + (b - a) * ((L - 1) / 49));

export const F = (e, lbl, en, say) => ({ e, lbl, en, say: say ?? lbl });
export const T = (t, say, extra = {}) => ({ t: String(t), say: say ?? String(t), ...extra });

// Bina pilihan: jawapan + pengganggu unik, dikocok. key() menentukan keunikan.
export function options(rng, pool, answer, n, key = (x) => x.id ?? x.e ?? x.t) {
  const seen = new Set([key(answer)]);
  const others = [];
  for (const x of rng.shuffle(pool)) {
    if (others.length >= n - 1) break;
    const k = key(x);
    if (seen.has(k)) continue;
    seen.add(k); others.push(x);
  }
  return rng.shuffle([answer, ...others]);
}
// Tetapkan id untuk setiap pilihan
export const withIds = (arr, key = (x) => x.id ?? x.e ?? x.t) => arr.map((x) => ({ ...x, id: String(key(x)) }));

export function choiceRound(o) {
  const opts = withIds(o.options, o.key);
  const answerId = String((o.key || ((x) => x.id ?? x.e ?? x.t))(o.answer));
  const r = { type: 'choice', ...o, options: opts, answer: answerId };
  delete r.key;
  return r;
}
export function multiRound(o) {
  const key = o.key || ((x) => x.id ?? x.e ?? x.t);
  const opts = withIds(o.options, key);
  const r = { type: 'choice', multi: true, ...o, options: opts, answers: o.answers.map((a) => String(key(a))) };
  delete r.key;
  return r;
}
// Pusingan slot (susun ikut urutan / eja). items: faces mengikut urutan betul; given: indeks yang diberi
export function slotsRound({ skill, say, items, given = [], distract = [], text = false, numbered = false, rng, show, sep }) {
  const slots = items.map((f, i) => ({ v: f.v ?? (f.t ?? f.e) + '', face: f, given: given.includes(i) }));
  const need = slots.filter((s) => !s.given).map((s) => ({ v: s.v, face: s.face }));
  const extra = distract.map((f) => ({ v: '__x' + (f.t ?? f.e), face: f }));
  return { type: 'slots', skill, say, slots, tiles: rng.shuffle([...need, ...extra]), text, numbered, show, sep };
}
export function matchRound({ skill, say, pairs, rng }) {
  const ps = pairs.map((p, i) => ({ id: 'p' + i, src: p[0], dst: p[1] }));
  return { type: 'match', skill, say, pairs: ps, srcOrder: rng.shuffle(ps.map((p) => p.id)), dstOrder: rng.shuffle(ps.map((p) => p.id)) };
}
export function sortRound({ skill, say, bins, items, rng }) {
  return { type: 'sort', skill, say, bins, items: rng.shuffle(items) };
}
export function memoryRound({ skill, say, pairs, rng, peek = 0 }) {
  const cards = rng.shuffle(pairs.flatMap((p, i) => [{ pair: i, face: p[0] }, { pair: i, face: p[1] ?? p[0] }]));
  const n = cards.length;
  const cols = n <= 4 ? 2 : n <= 6 ? 3 : n <= 8 ? 4 : n <= 12 ? 4 : n <= 16 ? 4 : 5;
  return { type: 'memory', skill, say, cards, cols, peek };
}
// Ambil n item unik dengan kunci tertentu
export function uniqBy(rng, arr, n, key) {
  const out = [], seen = new Set();
  for (const x of rng.shuffle(arr)) { const k = key(x); if (seen.has(k)) continue; seen.add(k); out.push(x); if (out.length >= n) break; }
  return out;
}
export const groupHtml = (e, n, size = 26) => `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:${size * 4 + 10}px;font-size:${size}px;font-family:var(--emoji);line-height:1.05">${Array.from({ length: n }, () => `<span>${e}</span>`).join('')}</div>`;
export const pencilHtml = (len, color = '#ffd60a') => `<svg viewBox="0 0 ${len + 24} 30" style="width:${len + 24}px;height:30px;display:block;margin:auto"><rect x="10" y="7" width="${len}" height="16" rx="3" fill="${color}" stroke="#3d3256" stroke-width="2"/><polygon points="${10 + len},7 ${22 + len},15 ${10 + len},23" fill="#f5d0a9" stroke="#3d3256" stroke-width="2"/><rect x="2" y="7" width="10" height="16" rx="3" fill="#ff8fab" stroke="#3d3256" stroke-width="2"/></svg>`;
export const ribbonHtml = (len, color = '#54a0ff') => `<svg viewBox="0 0 ${len + 2} 22" style="width:${len + 2}px;height:22px;display:block;margin:auto"><rect x="1" y="4" width="${len}" height="14" rx="7" fill="${color}" stroke="#3d3256" stroke-width="2"/></svg>`;
