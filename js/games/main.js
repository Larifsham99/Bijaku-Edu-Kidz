// =====================================================================
//  PERMAINAN BAHARU BIJAKU — titik masuk (dimuat secara malas oleh penghala)
//  #/g/<id> peta level · #/g/<id>/<n> main
// =====================================================================
import { mapScreen, playScreen } from './shell.js';
import { restoreBackup } from './store.js';
import { GAMES } from './registry.js';
import { settings } from '../store.js';
import { h } from '../ui.js';

let cssReady = null;
function ensureCss() {
  if (cssReady) return cssReady;
  cssReady = new Promise((res) => {
    if (document.querySelector('link[data-gm]')) return res();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'css/games.css'; l.dataset.gm = '1';
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
  const [id, nStr] = args;
  await Promise.all([ensureCss(), restoreBackup()]);
  if (!el.isConnected) return cleanup;
  const g = GAMES[id];
  if (!g) { location.hash = '/'; return cleanup; }
  if (settings().disabledModes?.includes(id)) {
    el.appendChild(h('div', { class: 'gm-screen', style: { textAlign: 'center', paddingTop: '60px' } }, h('h2', {}, `${g.n} sedang dikunci oleh ibu bapa.`), h('a', { class: 'gm-btn go', href: '#/' }, 'Kembali')));
    return cleanup;
  }
  const n = parseInt(nStr, 10);
  const scr = Number.isFinite(n) ? await playScreen(id, n, onClean) : mapScreen(id);
  if (el.isConnected) el.appendChild(scr); else cleanup();
  return cleanup;
}
