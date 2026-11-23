// =====================================================================
//  TANGAN PENUNJUK (coach) — untuk kanak-kanak yang belum membaca:
//  tangan kecil menunjuk ke butang yang perlu ditekan, langkah demi langkah.
//  Setiap langkah tamat apabila anak menekan sasaran itu.
// =====================================================================
const HAND = '<svg viewBox="0 0 48 48"><path d="M19 6c2 0 3.5 1.6 3.5 3.6V22l1.2-.2c.6-1.6 2-2.6 3.6-2.6 1.4 0 2.6.7 3.2 1.8.7-.4 1.4-.6 2.2-.6 1.6 0 3 .9 3.6 2.3.5-.2 1-.3 1.6-.3 2.2 0 4 1.8 4 4v7.6C42 42 36.4 46 30 46h-3.2c-4 0-7.6-1.9-9.9-5.1L9.3 30.2c-1-1.5-.7-3.5.8-4.6 1.4-1 3.3-.8 4.5.4l.9 1V9.6C15.5 7.6 17 6 19 6z" fill="#fff" stroke="#2b2350" stroke-width="2.6" stroke-linejoin="round"/></svg>';

// steps: senarai pemilih CSS (atau fungsi yang memulangkan elemen), dalam `root`
export function coach(root, steps, { delay = 1200 } = {}) {
  let i = 0, raf = 0, dead = false;
  const hand = document.createElement('div');
  hand.className = 'bj-coach'; hand.innerHTML = `<i class="bj-coach-ring"></i>${HAND}`; hand.setAttribute('aria-hidden', 'true');
  const target = () => { const s = steps[i]; const el = typeof s === 'function' ? s() : root.querySelector(s); return el && el.isConnected && el.getClientRects().length ? el : null; };
  const place = () => {
    if (dead) return;
    if (!root.isConnected) { stop(); return; }
    const el = target();
    if (el) {
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      hand.style.transform = `translate(${x - 8}px, ${y + 4}px)`;
      hand.style.opacity = '1';
    } else { hand.style.opacity = '0'; }
    raf = requestAnimationFrame(place);
  };
  const onDown = (e) => { const el = target(); if (el && (el === e.target || el.contains(e.target))) { i++; if (i >= steps.length) stop(); } };
  function stop() { dead = true; cancelAnimationFrame(raf); hand.remove(); document.removeEventListener('pointerdown', onDown, true); }
  setTimeout(() => {
    if (dead || !root.isConnected) return;
    document.body.append(hand);
    document.addEventListener('pointerdown', onDown, true);
    place();
  }, delay);
  return stop;
}
