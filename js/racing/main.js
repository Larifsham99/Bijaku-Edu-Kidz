// =====================================================================
//  CILIK RACING — titik masuk modul (dimuat secara malas oleh penghala)
//  Laluan: #/lumba, #/lumba/peta, #/lumba/dunia/<d>, #/lumba/garaj,
//          #/lumba/koleksi, #/lumba/main/<d>/<level>
//  Modul ini terasing: jika ia gagal, 15 permainan asal tidak terjejas.
// =====================================================================
import { homeScreen, mapScreen, worldScreen, garageScreen, collectionScreen, raceScreen } from './ui.js';
import { restoreBackup } from './store.js';

let cssReady = null;
function ensureCss() {
  if (cssReady) return cssReady;
  cssReady = new Promise((res) => {
    if (document.querySelector('link[data-rc]')) return res();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'css/racing.css'; l.dataset.rc = '1';
    l.onload = () => res(); l.onerror = () => res();
    document.head.appendChild(l);
    setTimeout(res, 1500);
  });
  return cssReady;
}

export async function mount(el, args = []) {
  const cleanups = [];
  const onClean = (fn) => cleanups.push(fn);
  let dead = false;
  const cleanup = () => { dead = true; cleanups.splice(0).forEach((f) => { try { f(); } catch { /* */ } }); };
  await Promise.all([ensureCss(), restoreBackup()]);
  if (dead || !el.isConnected) return cleanup;
  const [a, b, c] = args;
  let scr;
  if (a === 'peta') scr = mapScreen();
  else if (a === 'dunia') scr = worldScreen(+b || 0);
  else if (a === 'garaj') scr = garageScreen(onClean);
  else if (a === 'koleksi') scr = collectionScreen();
  else if (a === 'main') scr = raceScreen(+b || 0, Math.round(+c) || 1, onClean);
  else scr = homeScreen(onClean);
  el.appendChild(scr);
  return cleanup;
}
