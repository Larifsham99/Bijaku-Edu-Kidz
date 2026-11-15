// Jana ikon PNG daripada icons/icon.svg: node tools/icons.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';
const svg = readFileSync('icons/icon.svg', 'utf8');
const b = await chromium.launch();
for (const s of [192, 512]) {
  const pg = await b.newPage({ viewport: { width: s, height: s } });
  await pg.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${s}" height="${s}" `)}</body></html>`);
  await pg.screenshot({ path: `icons/icon-${s}.png`, omitBackground: true });
}
await b.close();
console.log('ikon siap');
