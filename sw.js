// Service worker: sokongan luar talian (cache-first) untuk semua kandungan aplikasi
const VERSION = 'dunia-cilik-cf1fe64236';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/audio.js',
  './js/data/art.js',
  './js/data/content.js',
  './js/engines/art.js',
  './js/engines/choice.js',
  './js/engines/common.js',
  './js/engines/dnd.js',
  './js/engines/find.js',
  './js/engines/index.js',
  './js/engines/maze.js',
  './js/engines/memory.js',
  './js/engines/puzzle.js',
  './js/main.js',
  './js/modes/helpers.js',
  './js/modes/index.js',
  './js/modes/modesA.js',
  './js/modes/modesB.js',
  './js/nav.js',
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
  './js/ui.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
