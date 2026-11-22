// Jana gambar kad "Taman Akhlak" untuk laman utama: node tools/export-akhlak-art.mjs
import { writeFileSync } from 'node:fs';
const c = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const e = (x, y, rx, ry, f, ex = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${ex}/>`;
const flower = (x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-30" stroke="#2f9e6a" stroke-width="4"/>${e(-8, -12, 8, 4, '#51cf66', 'transform="rotate(-30 -8 -12)"')}${[0, 72, 144, 216, 288].map((a) => e(0, -42, 7, 11, col, `transform="rotate(${a} 0 -34)" stroke="#fff" stroke-width="1"`)).join('')}${c(0, -34, 5, '#ffd43b')}</g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160">
${e(110, 150, 104, 14, '#1f7a50', 'opacity=".25"')}
<path d="M10 150Q110 118 210 150Z" fill="#8ce99a"/>
<g transform="translate(150 140)"><rect x="-8" y="-60" width="16" height="62" rx="6" fill="#8a5d36"/>${c(0, -78, 36, '#2f9e6a')}${c(-26, -62, 20, '#37b24d')}${c(26, -62, 20, '#37b24d')}${[[-14, -84], [10, -92], [20, -66], [-22, -64], [2, -70]].map(([x, y], i) => c(x, y, 5.5, ['#ff6b6b', '#ff922b', '#fcc419'][i % 3])).join('')}</g>
${flower(40, 146, 1, '#e8412c')}${flower(72, 150, 0.85, '#fcc419')}${flower(100, 148, 0.75, '#f783ac')}
<g transform="translate(64 40)">${e(-6, 0, 7, 10, '#f783ac')}${e(6, 0, 7, 10, '#da77f2')}<rect x="-1.5" y="-7" width="3" height="14" rx="1.5" fill="#2b2350"/></g>
<path d="M28 34l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fff9db"/>
</svg>`;
writeFileSync('visual-assets/akhlak/kebun.svg', svg);
console.log('visual-assets/akhlak/kebun.svg');
