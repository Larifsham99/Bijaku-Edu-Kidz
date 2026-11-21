// Eksport ilustrasi ikon (js/data/modeart.js) kepada fail SVG dalam visual-assets/icons/
// untuk digunakan oleh CSS (cth. jubin Main Bebas). Jalankan: node tools/export-visual-assets.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { MODE_ART } from '../js/data/modeart.js';
const OUT = 'visual-assets/icons';
mkdirSync(OUT, { recursive: true });
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>\n`;
const MAP = { 'mewarna': 'seni', 'bunyi': 'bunyi', 'susun': 'kelas', 'puzzle': 'puzzle', 'teroka': 'misi' };
for (const [name, id] of Object.entries(MAP)) writeFileSync(`${OUT}/${name}.svg`, svg(MODE_ART[id]));
// Krayon (Lukis dengan Jari)
writeFileSync(`${OUT}/lukis.svg`, svg(`<g transform="rotate(-28 32 32)"><rect x="14" y="20" width="9" height="30" rx="2" fill="#e2553f"/><path d="M14 20l4.5-9 4.5 9z" fill="#ff9a8a"/><rect x="14" y="27" width="9" height="4" fill="#b53a28"/></g>
<g transform="rotate(-4 32 32)"><rect x="27.5" y="18" width="9" height="32" rx="2" fill="#f2a922"/><path d="M27.5 18l4.5-9 4.5 9z" fill="#ffd56a"/><rect x="27.5" y="25" width="9" height="4" fill="#c9820b"/></g>
<g transform="rotate(22 32 32)"><rect x="41" y="20" width="9" height="30" rx="2" fill="#2e5aac"/><path d="M41 20l4.5-9 4.5 9z" fill="#7fa7e6"/><rect x="41" y="27" width="9" height="4" fill="#1f3f86"/></g>
<path d="M8 56c6-5 10 3 16-2s10 3 16-2 10 3 16-1" stroke="#2f9e6a" stroke-width="3" fill="none" stroke-linecap="round"/>`));
console.log('visual-assets/icons: siap');
