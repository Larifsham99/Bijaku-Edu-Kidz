// =====================================================================
//  DUNIA CILIK — titik mula aplikasi & penghala (router)
// =====================================================================
import { initStore, profile, getState, settings, flush, save } from './store.js';
import { markPlayed } from './recommend.js';
import { unlockAudio, startMusic, stopMusic, musicPlaying, loadVoicePack, speak, sfx } from './audio.js';
import { initCeria, ceria } from './ceria.js';
import { clear } from './ui.js';
import { homeScreen, onboardingScreen, profilesScreen } from './screens/home.js';
import { worldScreen } from './screens/world.js';
import { pathScreen, pathIntercept } from './screens/path.js';
import { installCompat } from './compat.js';
import { modeScreen } from './screens/modemap.js';
import { playScreen, dailyPlayScreen, stopPlay, currentSession } from './screens/play.js';
import { dailyScreen } from './screens/daily.js';
import { freeScreen } from './screens/free.js';
import { trophyScreen, certScreen } from './screens/trophy.js';
import { shopScreen } from './screens/shop.js';
import { parentScreen } from './screens/parent.js';
import { timeoutScreen, overLimit } from './screens/timeout.js';
import { MODES } from './modes/index.js';
import { go, clearBack, runBack, parentOf } from './nav.js';
import { pauseOpen, closePause } from './pause.js';
import { applyTheme, ensureThemeFields } from './theme.js';
import { DEMO } from './demo.js';
import { addProfile } from './store.js';

let pendingReload = false;
// Muzik latar di menu sahaja: berhenti semasa bermain (supaya anak fokus)
// dan dalam Cilik Racing / Teka Silang yang ada muzik sendiri.
let audioReady = false;
const musicless = () => inGame() || /^#\/(lumba|silang)/.test(location.hash);
function syncMusic() {
  if (!audioReady) return;
  if (!settings().music || musicless()) stopMusic();
  else if (!musicPlaying()) startMusic();
}
const inGame = () => /^#\/(main|harian\/|lumba\/main|silang\/main|akhlak\/kisah\/|g\/[a-z]+\/\d)/.test(location.hash);

// CILIK RACING: modul terasing yang dimuat secara malas. Jika ia gagal dimuat,
// hanya skrin racing terjejas — 15 permainan asal tidak disentuh.
let racingCleanup = null, racingToken = 0;
function stopRacing() {
  racingToken++;
  if (racingCleanup) { const c = racingCleanup; racingCleanup = null; try { c(); } catch { /* */ } }
}
// TEKA SILANG CILIK: modul terasing yang dimuat secara malas (corak yang sama)
let silangCleanup = null, silangToken = 0;
function stopSilang() {
  silangToken++;
  if (silangCleanup) { const c = silangCleanup; silangCleanup = null; try { c(); } catch { /* */ } }
}
function silangView(args) {
  const el = document.createElement('div');
  el.className = 'ts-host';
  const tok = ++silangToken;
  import('./tekasilang/main.js')
    .then((m) => m.mount(el, args))
    .then((cl) => { if (tok === silangToken && el.isConnected) silangCleanup = cl; else cl(); })
    .catch((err) => {
      console.warn('Teka Silang Cilik:', err);
      if (tok !== silangToken) return;
      el.innerHTML = '<div class="screen" style="text-align:center;padding:40px 16px"><h2>Teka Silang Cilik belum dapat dibuka.</h2><p>Permainan lain masih boleh dimainkan seperti biasa.</p><a class="btn green" href="#/">Kembali</a></div>';
    });
  return el;
}
// PERMAINAN BAHARU (Fasa 2+): modul terasing yang dimuat secara malas
let gamesCleanup = null, gamesToken = 0;
function stopGames() {
  gamesToken++;
  if (gamesCleanup) { const c = gamesCleanup; gamesCleanup = null; try { c(); } catch { /* */ } }
}
function gamesView(args) {
  const el = document.createElement('div');
  el.className = 'gm-host';
  const tok = ++gamesToken;
  import('./games/main.js')
    .then((m) => m.mount(el, args))
    .then((cl) => { if (tok === gamesToken && el.isConnected) gamesCleanup = cl; else cl(); })
    .catch((err) => {
      console.warn('Permainan baharu:', err);
      if (tok !== gamesToken) return;
      el.innerHTML = '<div class="screen" style="text-align:center;padding:40px 16px"><h2>Permainan ini belum dapat dibuka.</h2><p>Semak sambungan internet (kali pertama), atau kemas kini pelayar Chrome / Safari kepada versi terkini. Ibu bapa boleh semak di Ruang Ibu Bapa → Tetapan → Semak Peranti.</p><a class="btn green" href="#/">Kembali</a></div>';
    });
  return el;
}
// TAMAN AKHLAK: modul terasing yang dimuat secara malas (corak yang sama)
let akhlakCleanup = null, akhlakToken = 0;
function stopAkhlak() {
  akhlakToken++;
  if (akhlakCleanup) { const c = akhlakCleanup; akhlakCleanup = null; try { c(); } catch { /* */ } }
}
function akhlakView(args) {
  const el = document.createElement('div');
  el.className = 'ak-host';
  const tok = ++akhlakToken;
  import('./akhlak/main.js')
    .then((m) => m.mount(el, args))
    .then((cl) => { if (tok === akhlakToken && el.isConnected) akhlakCleanup = cl; else cl(); })
    .catch((err) => {
      console.warn('Taman Akhlak:', err);
      if (tok !== akhlakToken) return;
      el.innerHTML = '<div class="screen" style="text-align:center;padding:40px 16px"><h2>Taman Akhlak belum dapat dibuka.</h2><p>Permainan lain masih boleh dimainkan seperti biasa.</p><a class="btn green" href="#/">Kembali</a></div>';
    });
  return el;
}
function racingView(args) {
  const el = document.createElement('div');
  el.className = 'rc-host';
  const tok = ++racingToken;
  import('./racing/main.js')
    .then((m) => m.mount(el, args))
    .then((cl) => { if (tok === racingToken && el.isConnected) racingCleanup = cl; else cl(); })
    .catch((err) => {
      console.warn('Cilik Racing:', err);
      if (tok !== racingToken) return;
      el.innerHTML = '<div class="screen" style="text-align:center;padding:40px 16px"><h2>Cilik Racing belum dapat dibuka.</h2><p>Permainan lain masih boleh dimainkan seperti biasa.</p><a class="btn green" href="#/">Kembali</a></div>';
    });
  return el;
}

const app = document.getElementById('app');


// skrin yang dimuat secara malas (cth. Album Selfie)
function lazyScreen(load) {
  const el = document.createElement('div');
  el.style.display = 'contents';
  load().then((scr) => { if (el.isConnected) el.appendChild(scr); }).catch(() => { el.innerHTML = '<div class="screen center"><p>Tidak dapat dibuka.</p><a class="btn green" href="#/">Kembali</a></div>'; });
  return el;
}

let routed = false, curHash = '', skipHash = false;
function route() {
  if (skipHash) { skipHash = false; if (location.hash === curHash) return; }
  curHash = location.hash;
  clearBack();
  if (routed) { try { sfx.swish(); } catch { /* */ } } routed = true;
  stopPlay();
  stopRacing();
  stopSilang();
  stopAkhlak();
  stopGames();
  syncMusic();
  const path = (location.hash || '#/').slice(1) || '/';
  const parts = path.split('/').filter(Boolean);
  clear(app);
  // tutup modal / toast yang masih terbuka (cth. apabila butang kembali Android ditekan)
  document.querySelectorAll('.modal-back, .toast, .drag-ghost').forEach((e) => e.remove());
  window.scrollTo(0, 0);
  // versi baharu aplikasi sudah dimuat turun: muat semula di luar permainan
  if (pendingReload && !inGame()) { location.reload(); return; }
  const st = getState();
  // demo: terus bermain tanpa pendaftaran
  if (DEMO && !st.profiles.length) addProfile({ name: 'Kawan', age: 4, avatar: 'coco' });
  const p = profile();
  ensureThemeFields(p);
  applyTheme(p?.theme);
  if (!st.profiles.length && parts[0] !== 'ibubapa') { app.appendChild(onboardingScreen()); return; }
  // had masa: hanya ruang ibu bapa boleh dibuka apabila masa tamat
  if (p && overLimit(p) && parts[0] !== 'ibubapa') { app.appendChild(timeoutScreen()); return; }
  // Laluan Bijak: selepas langkah selesai, sebarang navigasi kembali ke laluan
  if (pathIntercept(path)) return;
  // rekod permainan yang dibuka (untuk cadangan bercahaya di skrin utama)
  const playedId = parts[0] === 'main' ? parts[1] : parts[0] === 'g' && parts[2] ? parts[1] : parts[0] === 'lumba' && parts[1] === 'main' ? 'lumba' : parts[0] === 'silang' && parts[1] === 'main' ? 'silang' : parts[0] === 'akhlak' && parts[1] === 'kisah' ? 'akhlak' : null;
  if (playedId && p) { markPlayed(p, playedId); save(); }
  let el;
  switch (parts[0]) {
    case undefined: el = homeScreen(); break;
    case 'profil': el = profilesScreen(); break;
    case 'dunia': el = worldScreen(); break;
    case 'laluan': el = pathScreen(); break;
    case 'album': el = lazyScreen(() => import('./selfie.js').then((mm) => mm.albumScreen())); break;
    case 'mod': el = MODES[parts[1]] ? modeScreen(parts[1]) : homeScreen(); break;
    case 'main': el = MODES[parts[1]] ? playScreen(parts[1], Math.max(1, Math.min(50, +parts[2] || 1))) : homeScreen(); break;
    case 'harian': el = parts[1] !== undefined ? dailyPlayScreen(+parts[1]) : dailyScreen(); break;
    case 'bebas': el = freeScreen(parts[1], parts.slice(2)); break;
    case 'trofi': el = trophyScreen(parts[1]); break;
    case 'sijil': el = certScreen(parts[1]); break;
    case 'kedai': el = shopScreen(parts[1]); break;
    case 'ibubapa': el = parentScreen(parts[1]); break;
    case 'lumba': el = racingView(parts.slice(1)); break;
    case 'silang': el = silangView(parts.slice(1)); break;
    case 'akhlak': el = akhlakView(parts.slice(1)); break;
    case 'g': el = gamesView(parts.slice(1)); break;
    default: el = homeScreen();
  }
  app.appendChild(el);
}

function handleBack(path) {
  // tutup lapisan yang terbuka dahulu
  if (pauseOpen()) { closePause(true); return; }
  const mb = document.querySelector('.modal-back'); if (mb && !mb.querySelector('.bj-winbar')) { mb.remove(); return; }
  if (runBack()) return; // skrin permainan: menu jeda
  const parent = parentOf(path);
  go(parent || '/');
}

// Skrin utama: tekan kembali sekali -> mesej kecil; tekan sekali lagi (dalam 2.5 s) -> aplikasi terus keluar.
// (Aplikasi web tidak boleh menutup dirinya sendiri; hanya butang kembali telefon yang benar-benar keluar,
//  jadi kita tidak memulihkan entri pengawal buat seketika.)
let exitTimer = 0;
function armExit() {
  clearTimeout(exitTimer);
  document.querySelector('.bj-exit-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'bj-exit-toast'; t.setAttribute('role', 'status');
  t.innerHTML = '<span aria-hidden="true">👋</span> Tekan kembali sekali lagi untuk keluar';
  document.body.appendChild(t);
  try { sfx.ping(); } catch { /* */ }
  exitTimer = setTimeout(() => {
    t.remove();
    try { if (history.state?.bj === 'root') history.pushState({ bj: 'top' }, '', location.hash || '#/'); } catch { /* */ }
  }, 2500);
}

async function boot() {
  try { installCompat(); } catch { /* */ } // pelayar lama: aspect-ratio dll.
  await initStore();
  loadVoicePack(); // pakej suara neural (jika dipasang)
  initCeria(); // bunyi sentuhan comel
  addEventListener('hashchange', route);
  // ---- butang kembali telefon: bukan "undo" berantai ----
  // Sejarah: [akar] -> [atas]. Navigasi dalam aplikasi menggantikan [atas] (nav.go).
  // Tekan kembali = kembali ke [akar]: kita tangkap, pulihkan [atas] dan buat tindakan yang sesuai.
  try {
    const start = location.href;
    history.replaceState({ bj: 'root' }, '', '#/'); // akar sentiasa skrin utama
    history.pushState({ bj: 'top' }, '', start);
  } catch { /* */ }
  addEventListener('popstate', (e) => {
    if (e.state?.bj !== 'root') return; // entri pautan biasa: biar hashchange mengurus
    const here = curHash || '#/';
    const path = here.slice(1) || '/';
    const atHome = parentOf(path) === null && !pauseOpen() && !document.querySelector('.modal-back');
    if (atHome) { armExit(); return; } // tekan sekali lagi = keluar (tiada entri pengawal)
    try { history.pushState({ bj: 'top' }, '', here); } catch { /* */ }
    skipHash = true; setTimeout(() => { skipHash = false; }, 0);
    handleBack(path);
  });
  // bunyi suis (Ruang Ibu Bapa, tetapan): semua kotak semak
  addEventListener('change', (e) => { const el = e.target; if (el instanceof HTMLInputElement && el.type === 'checkbox') { try { sfx.toggle(el.checked); } catch { /* */ } } }, true);
  // buka kunci audio pada sentuhan pertama
  // sentuhan pertama: jingle pembuka BIJAKU (di menu), kemudian muzik latar
  const first = () => {
    if (audioReady) return;
    audioReady = true;
    unlockAudio();
    const intro = !inGame() && settings().sound !== false;
    if (intro) ceria.intro();
    setTimeout(syncMusic, intro ? 2300 : 0);
  };
  addEventListener('pointerdown', first, { once: true });
  addEventListener('click', first, { once: true });
  route();
  if (!DEMO && 'serviceWorker' in navigator && location.protocol !== 'file:') {
    // Kemas kini automatik: apabila versi baharu diterbitkan, ia diaktifkan terus
    // dan aplikasi dimuat semula (tetapi tidak di tengah-tengah permainan).
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) { hadController = true; return; }
      if (inGame()) pendingReload = true; else location.reload();
    });
    navigator.serviceWorker.register('sw.js').then((reg) => {
      addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => { /* luar talian tidak tersedia */ });
  }
  addEventListener('beforeunload', flush);
  window.__dc = { go, getState, MODES, session: currentSession, speak };
  // Pengawal ralat: jika berlaku ralat tidak dijangka semasa bermain, anak tidak tersekat
  let guardOpen = false;
  const onCrash = () => {
    flush();
    const s = currentSession();
    if (!s || guardOpen || document.querySelector('.modal-back')) return;
    guardOpen = true;
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = '<div class="modal"><div class="emo" style="font-size:56px">🙈</div><h2>Ops! Ada masalah kecil.</h2><p>Jangan risau, kita teruskan ke aktiviti seterusnya.</p><button class="btn green big" type="button">Teruskan</button></div>';
    back.querySelector('button').addEventListener('click', () => { back.remove(); guardOpen = false; s.skip(); });
    document.body.appendChild(back);
  };
  // hanya ralat daripada kod aplikasi sendiri (bukan sambungan pelayar / audio peranti)
  const ours = (err) => err instanceof Error && /\/js\//.test(err.stack || '');
  addEventListener('error', (e) => { if (ours(e.error)) onCrash(); });
  addEventListener('unhandledrejection', (e) => { if (ours(e.reason)) onCrash(); });
}
boot();
