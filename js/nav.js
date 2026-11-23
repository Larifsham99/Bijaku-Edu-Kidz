// =====================================================================
//  NAVIGASI — berasaskan hash, tetapi sejarah pelayar dikekalkan cetek:
//  navigasi dalam aplikasi menggantikan entri semasa (tiada "undo" berantai).
//  Butang kembali telefon diuruskan oleh main.js (lihat onBack):
//   - dalam permainan  -> menu jeda
//   - skrin lain       -> skrin induk (cth. peta, kemudian Rumah)
//   - skrin utama      -> "Mahu keluar dari BIJAKU?"
// =====================================================================
export function go(path) {
  const url = '#' + path;
  try {
    // di entri akar (selepas 'tekan sekali lagi untuk keluar'): pulihkan entri pengawal
    if (history.state?.bj === 'root') { document.querySelector('.bj-exit-toast')?.remove(); history.pushState({ bj: 'top' }, '', url); }
    else if (location.hash !== url) history.replaceState(history.state, '', url);
  } catch { if (location.hash !== url) { location.hash = path; return; } }
  dispatchEvent(new HashChangeEvent('hashchange'));
}

// Pengendali butang kembali untuk skrin semasa (dikosongkan setiap kali skrin bertukar).
// fn() pulangkan true jika ia sudah mengendalikan tekanan kembali.
let backFn = null;
export function onBack(fn) { backFn = fn; return () => { if (backFn === fn) backFn = null; }; }
export function clearBack() { backFn = null; }
export function runBack() { try { return !!(backFn && backFn()); } catch { return false; } }

// skrin induk yang logik (bukan sejarah)
export function parentOf(path) {
  const p = path.split('/').filter(Boolean);
  switch (p[0]) {
    case undefined: return null;
    case 'main': return p[1] ? `/mod/${p[1]}` : '/';
    case 'g': return p[2] ? `/g/${p[1]}` : '/';
    case 'lumba': return p[1] === 'main' ? `/lumba/dunia/${p[2] || 0}` : p.length > 1 ? '/lumba' : '/';
    case 'silang': return p[1] === 'main' ? `/silang/bab/${p[2] || 0}` : p.length > 1 ? '/silang' : '/';
    case 'akhlak': return p.length > 1 ? '/akhlak' : '/';
    case 'harian': return p.length > 1 ? '/harian' : '/';
    default: return '/';
  }
}
