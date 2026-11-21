// Jana semula senarai aset untuk service worker: node tools/build-sw.mjs
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const roots = ['index.html', 'manifest.webmanifest', 'css', 'js', 'icons', 'fonts', 'visual-assets'];
const out = [];
const walk = (p) => { if (statSync(p).isDirectory()) readdirSync(p).sort().forEach((f) => walk(join(p, f))); else if (!p.endsWith('.md')) out.push(p); };
roots.forEach(walk);
const hash = createHash('sha1'); out.forEach((f) => hash.update(readFileSync(f)));
const ver = 'dunia-cilik-' + hash.digest('hex').slice(0, 10);
let sw = readFileSync('sw.js', 'utf8');
sw = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${ver}';`);
sw = sw.replace(/const ASSETS = \[[\s\S]*?\];/, `const ASSETS = [\n  './',\n${out.map((f) => `  './${f}',`).join('\n')}\n];`);
writeFileSync('sw.js', sw);
console.log(`sw.js: ${out.length} aset, versi ${ver}`);
