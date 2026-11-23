// =====================================================================
//  MUAT SATU SKRIN — kecilkan kandungan papan permainan secara automatik
//  apabila ia lebih tinggi daripada ruang yang ada (telefon kecil / landskap),
//  supaya anak tidak perlu menatal untuk melihat bahagian bawah.
//  Guna CSS `zoom` pada anak-anak kotak (susun atur sebenar mengecil).
// =====================================================================
const MIN = 0.5;
const zoomOK = typeof CSS !== 'undefined' && CSS.supports?.('zoom', '0.5');

export function autoFit(box, { min = MIN } = {}) {
  if (!box || !zoomOK) return () => {};
  box.classList.add('fz');
  let raf = 0, busy = false, z = 1;
  const pad = () => { const cs = getComputedStyle(box); return (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0); };
  let reset = true;
  const run = () => {
    raf = 0;
    if (!box.isConnected || busy) return;
    busy = true;
    try {
      const avail = box.clientHeight - pad();
      if (avail < 60) return;
      // pusingan baharu: mula dari saiz penuh; perubahan kecil dalam pusingan: hanya kecilkan (tiada kelip)
      if (reset) { z = 1; box.style.setProperty('--fz', '1'); reset = false; }
      // ketinggian semula jadi kandungan (lepaskan had ketinggian seketika untuk diukur)
      const natural = () => {
        const s = box.style, keep = [s.flex, s.height, s.maxHeight, s.minHeight];
        s.flex = 'none'; s.height = 'auto'; s.maxHeight = 'none'; s.minHeight = '0';
        const v = box.scrollHeight;
        [s.flex, s.height, s.maxHeight, s.minHeight] = keep;
        return v - pad();
      };
      for (let i = 0; i < 4; i++) {
        const need = natural();
        if (need <= avail + 1) break;
        z = Math.max(min, z * (avail / need) * 0.99);
        box.style.setProperty('--fz', z.toFixed(3));
        if (z <= min) break;
      }
    } finally { busy = false; }
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(run); };
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
  const watchKids = () => { if (!ro) return; ro.disconnect(); ro.observe(box); [...box.children].forEach((c) => ro.observe(c)); };
  watchKids();
  const mo = new MutationObserver(() => { reset = true; watchKids(); schedule(); });
  mo.observe(box, { childList: true });
  const onRs = () => { reset = true; schedule(); };
  addEventListener('resize', onRs);
  // imej yang dimuat lewat mengubah ketinggian
  box.addEventListener('load', schedule, true);
  schedule();
  setTimeout(schedule, 300);
  return () => { ro?.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); removeEventListener('resize', onRs); };
}
