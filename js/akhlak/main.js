// =====================================================================
//  TAMAN AKHLAK — titik masuk modul (dimuat secara malas oleh penghala)
//  Laluan: #/akhlak, #/akhlak/kisah, #/akhlak/kisah/<id>, #/akhlak/kebun, #/akhlak/amal
// =====================================================================
import { hubScreen, listScreen, storyScreen, gardenScreen, deedsScreen } from './ui.js';
import { restoreBackup } from './store.js';
import { settings } from '../store.js';
import { h } from '../ui.js';

let cssReady = null;
function ensureCss() {
  if (cssReady) return cssReady;
  cssReady = new Promise((res) => {
    if (document.querySelector('link[data-ak]')) return res();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'css/akhlak.css'; l.dataset.ak = '1';
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
  if (settings().disabledModes?.includes('akhlak')) {
    el.appendChild(h('div', { class: 'ak-screen', style: { textAlign: 'center', paddingTop: '60px' } }, h('h2', {}, 'Taman Akhlak sedang dikunci oleh ibu bapa.'), h('a', { class: 'ak-btn go', href: '#/' }, 'Kembali')));
    return cleanup;
  }
  const [a, b] = args;
  let scr;
  if (a === 'kisah' && b) scr = storyScreen(b, onClean);
  else if (a === 'kisah') scr = listScreen();
  else if (a === 'kebun') scr = gardenScreen();
  else if (a === 'amal') scr = deedsScreen();
  else scr = hubScreen();
  el.appendChild(scr);
  return cleanup;
}
