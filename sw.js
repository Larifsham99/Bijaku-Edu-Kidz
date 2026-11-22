// Service worker: sokongan luar talian (cache-first) untuk semua kandungan aplikasi
const VERSION = 'dunia-cilik-9a9254b586';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './css/racing.css',
  './css/tekasilang.css',
  './css/ui2.css',
  './css/ui3.css',
  './css/ui4.css',
  './js/audio.js',
  './js/data/art.js',
  './js/data/content.js',
  './js/data/modeart.js',
  './js/demo.js',
  './js/engines/art.js',
  './js/engines/choice.js',
  './js/engines/common.js',
  './js/engines/dnd.js',
  './js/engines/find.js',
  './js/engines/index.js',
  './js/engines/maze.js',
  './js/engines/memory.js',
  './js/engines/puzzle.js',
  './js/icons.js',
  './js/main.js',
  './js/malay-text.js',
  './js/modes/helpers.js',
  './js/modes/index.js',
  './js/modes/modesA.js',
  './js/modes/modesB.js',
  './js/nav.js',
  './js/racing/cars.js',
  './js/racing/data.js',
  './js/racing/education.js',
  './js/racing/engine.js',
  './js/racing/levels.js',
  './js/racing/main.js',
  './js/racing/render.js',
  './js/racing/sound.js',
  './js/racing/sprites.js',
  './js/racing/store.js',
  './js/racing/ui.js',
  './js/rewards.js',
  './js/rng.js',
  './js/screens/daily.js',
  './js/screens/free.js',
  './js/screens/home.js',
  './js/screens/modemap.js',
  './js/screens/parent.js',
  './js/screens/play.js',
  './js/screens/shared.js',
  './js/screens/shop.js',
  './js/screens/timeout.js',
  './js/screens/trophy.js',
  './js/store.js',
  './js/talk.js',
  './js/tekasilang/art.js',
  './js/tekasilang/data.js',
  './js/tekasilang/levels.js',
  './js/tekasilang/main.js',
  './js/tekasilang/sound.js',
  './js/tekasilang/store.js',
  './js/tekasilang/ui.js',
  './js/theme.js',
  './js/ui.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
  './fonts/baloo2-latin.woff2',
  './visual-assets/icons/bunyi.svg',
  './visual-assets/icons/lukis.svg',
  './visual-assets/icons/mewarna.svg',
  './visual-assets/icons/puzzle.svg',
  './visual-assets/icons/susun.svg',
  './visual-assets/icons/teroka.svg',
  './visual-assets/mascots/bobo.svg',
  './visual-assets/mascots/coco.svg',
  './visual-assets/mascots/dino.svg',
  './visual-assets/mascots/lala.svg',
  './visual-assets/mascots/mimi.svg',
  './visual-assets/racing/kereta.png',
  './visual-assets/tekasilang/papan.svg',
];
self.addEventListener('install', (e) => {
  // cache: 'reload' memastikan fail diambil terus dari pelayan, bukan salinan lama dalam cache HTTP pelayar
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // Halaman jualan & demo sentiasa diambil terus dari rangkaian (tidak di-cache)
  if (url.pathname.includes('/jualan/') || url.pathname.includes('/studio/') || url.searchParams.has('demo')) return;
  // Manifest pakej suara: rangkaian dahulu (supaya pakej baharu dikesan), cache sebagai sandaran luar talian
  if (url.pathname.endsWith('/audio/ms-MY/manifest.json')) {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
    return;
  }
  // Katalog hanya untuk alat pembangunan
  if (url.pathname.endsWith('/audio/ms-MY/catalog.json')) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
