// =====================================================================
//  KESERASIAN PELAYAR LAMA
//  • aspect-ratio (Chrome < 88, Safari/iOS < 15): tinggi elemen dikira dengan JS
//    — tanpa ini papan Robot Kod Cilik setinggi 0 piksel & tidak boleh dimainkan
//  • color-mix() (Chrome < 111, Safari < 16.2): warna sandaran dalam css/compat.css
//  • laporan ciri peranti untuk Ruang Ibu Bapa
// =====================================================================
import { AR_RULES } from './compat-rules.js';

const sup = (p, v) => { try { return CSS.supports(p, v); } catch { return false; } };
export const FEATURES = () => [
  ['Paparan nisbah (aspect-ratio)', sup('aspect-ratio', '1 / 1'), 'Dibantu secara automatik'],
  ['Campuran warna (color-mix)', sup('color', 'color-mix(in srgb, red 50%, blue)'), 'Warna sandaran digunakan'],
  ['Jarak flex (gap)', sup('gap', '1px') && sup('display', 'flex'), ''],
  ['Simpanan (localStorage)', (() => { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; } catch { return false; } })(), 'Kemajuan tidak dapat disimpan'],
  ['Sandaran (IndexedDB)', typeof indexedDB !== 'undefined', ''],
  ['Bunyi (Web Audio)', !!(self.AudioContext || self.webkitAudioContext), 'Tiada kesan bunyi'],
  ['Suara (Speech)', typeof speechSynthesis !== 'undefined', 'Arahan suara tidak berfungsi'],
  ['Kamera', !!navigator.mediaDevices?.getUserMedia, 'Selfie & Pemburu Warna guna mod gambar'],
  ['Luar talian (Service Worker)', 'serviceWorker' in navigator, 'Perlu internet'],
  ['Pemerhati saiz (ResizeObserver)', typeof ResizeObserver !== 'undefined', 'Lompat Blok & Bina Dunia mungkin tidak muat'],
];

export function browserInfo() {
  const ua = navigator.userAgent;
  const chrome = ua.match(/(?:Chrome|CriOS)\/(\d+)/), safari = ua.match(/Version\/(\d+)(?:\.(\d+))?.*Safari/), ios = ua.match(/OS (\d+)_(\d+)/);
  const name = /CriOS/.test(ua) ? `Chrome iOS ${chrome?.[1] || ''}` : chrome ? `Chrome ${chrome[1]}` : safari ? `Safari ${safari[1]}${safari[2] ? '.' + safari[2] : ''}` : /Firefox\/(\d+)/.test(ua) ? `Firefox ${ua.match(/Firefox\/(\d+)/)[1]}` : 'Pelayar lain';
  const old = (chrome && +chrome[1] < 100 && !/CriOS/.test(ua)) || (safari && +safari[1] < 15) || (ios && +ios[1] < 15);
  return { name, os: ios ? `iOS ${ios[1]}.${ios[2]}` : /Android (\d+)/.test(ua) ? `Android ${ua.match(/Android (\d+)/)[1]}` : '', old: !!old };
}

// ---------- polyfill aspect-ratio ----------
const SKIP = { '.choice': '.wide', '.lvl': '*' };
function fixAspect() {
  for (const [sel, r] of AR_RULES) {
    if (SKIP[sel] === '*') continue;
    document.querySelectorAll(sel).forEach((el) => {
      if (SKIP[sel] && el.matches(SKIP[sel])) return;
      if (el.dataset.arFixed === '0') return;
      const w = el.getBoundingClientRect().width;
      if (!w) return;
      const want = Math.round(w * r);
      const cur = el.getBoundingClientRect().height;
      // hanya betulkan elemen yang "runtuh" (lebih rendah daripada sepatutnya)
      if (el.dataset.arFixed === '1' || cur < want * 0.85) { el.style.height = `${want}px`; el.dataset.arFixed = '1'; }
    });
  }
}
export function installCompat() {
  const root = document.documentElement;
  const noAR = !sup('aspect-ratio', '1 / 1');
  if (noAR) root.classList.add('no-ar');
  if (!sup('color', 'color-mix(in srgb, red 50%, blue)')) root.classList.add('no-color-mix');
  if (!noAR) return;
  let q = 0;
  const run = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; fixAspect(); }); };
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', () => { document.querySelectorAll('[data-ar-fixed="1"]').forEach((e) => { e.style.height = ''; e.dataset.arFixed = ''; }); run(); });
  run();
}
