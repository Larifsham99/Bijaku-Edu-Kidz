// =====================================================================
//  TEKA SILANG CILIK — titik masuk modul (dimuat secara malas oleh penghala)
//  Laluan: #/silang, #/silang/bab/<c>, #/silang/main/<c>/<level>, #/silang/pelekat
//  Modul terasing: jika gagal, permainan lain tidak terjejas.
// =====================================================================
import { homeScreen, chapterScreen, playScreen, stickerScreen } from './ui.js';
import { restoreBackup } from './store.js';
import { settings } from '../store.js';
import { h } from '../ui.js';

let cssReady = null;
function ensureCss() {
  if (cssReady) return cssReady;
  cssReady = new Promise((res) => {
    if (document.querySelector('link[data-ts]')) return res();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'css/tekasilang.css'; l.dataset.ts = '1';
    l.onload = () => res(); l.onerror = () => res();
    document.head.appendChild(l);
    setTimeout(res, 1500);
  });
  return cssReady;
}

export async function mount(el, args = []) {
  const cleanups = [];
  const onClean = (fn) => cleanups.push(fn);
  const cleanup = () => cleanups.splice(0).forEach((f) => { try { f(); } catch { /* */ } });
  await Promise.all([ensureCss(), restoreBackup()]);
  if (!el.isConnected) return cleanup;
  if (settings().disabledModes?.includes('silang')) {
    el.appendChild(h('div', { class: 'ts-screen', style: { textAlign: 'center', paddingTop: '60px' } }, h('h2', {}, 'Teka Silang Cilik sedang dikunci oleh ibu bapa.'), h('a', { class: 'ts-btn go', href: '#/' }, 'Kembali')));
    return cleanup;
  }
  const [a, b, c] = args;
  let scr;
  if (a === 'bab') scr = chapterScreen(+b || 0);
  else if (a === 'main') scr = playScreen(+b || 0, Math.round(+c) || 1, onClean);
  else if (a === 'pelekat') scr = stickerScreen();
  else scr = homeScreen();
  el.appendChild(scr);
  return cleanup;
}
