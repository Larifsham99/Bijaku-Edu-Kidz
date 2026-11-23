// =====================================================================
//  TITIAN IMBANG — bawa "Si Bulat" merentasi titian sempit, jongkang-jongket,
//  jambatan berayun, papan terapung & penolak, dengan menyengetkan telefon.
//  Watak terhuyung-hayang & melambai panik bila hampir jatuh; berpusing bila jatuh.
//  Kemahiran: keseimbangan, kawalan motor halus, sabar & fokus.
// =====================================================================
import { runTiltGame } from './tiltgame.js';
import { makeImbang } from './tiltlevels.js';
import { WALKER } from './tiltworld.js';
import { bsfx } from './blocksfx.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const INTRO = [
  (n) => (n === 1 ? 'Bantu Si Bulat berjalan di atas titian. Senget sedikit sahaja, perlahan-lahan!' : 'Titian makin sempit. Jalan perlahan dan seimbang!'),
  (n) => (n === 11 ? 'Papan jongkang-jongket bergoyang! Kekal di tengah supaya tidak senget.' : 'Jambatan berayun dan papan bergerak. Tunggu masa yang sesuai!'),
  (n) => (n === 21 ? 'Puncak Ribut! Tunggu blok merah lalu, kemudian cepat menyeberang.' : 'Cabaran terakhir! Sabar, fokus dan seimbang.'),
];
// animasi watak: condong, panik, langkah, pusing
function animate(a, b, w, dt, inp, dead) {
  const sp = Math.hypot(b.vx, b.vy);
  let panic = 0;
  if (!dead && b.onGround && sp > 0.08) {
    const ux = b.vx / sp, uy = b.vy / sp;
    const g = w.ground(b.x + ux * 0.34, b.y + uy * 0.34, b.z + 0.3);
    if (!g || g.top < b.z - 0.5) panic = 1;
    else if (Math.abs(b.ground?.p?.s || 0) > 0.22) panic = 0.7;
  }
  if (dead) panic = 1;
  a.panic += (panic - a.panic) * Math.min(1, dt * 7);
  const target = clamp(inp.x * 0.28 + b.vx * 0.06, -0.45, 0.45) + Math.sin(performance.now() / 70) * 0.18 * a.panic;
  a.lean += (target - a.lean) * Math.min(1, dt * 9);
  a.leanY += (clamp(inp.y * 0.2, -0.3, 0.3) - a.leanY) * Math.min(1, dt * 8);
  a.walk += sp * dt * 9;
}
function drawWalker(r, b, st) {
  const g = r.g, a = st.anim, now = st.now;
  const [sx, sy, d] = r.proj(b.x, b.y, b.z);
  const s = (r.F * 0.42) / d;
  g.save();
  g.translate(sx, sy);
  const fallSpin = st.dead ? a.spin : 0;
  g.rotate(a.lean + fallSpin);
  const sq = st.squash || 0;
  g.scale(1 + sq * 0.3, 1 - sq * 0.3);
  // kaki
  const step = Math.sin(a.walk) * 0.18;
  g.fillStyle = '#2b3a67';
  g.beginPath(); g.ellipse(-s * 0.22, -s * 0.08 - Math.max(0, step) * s * 0.4, s * 0.16, s * 0.1, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(s * 0.22, -s * 0.08 - Math.max(0, -step) * s * 0.4, s * 0.16, s * 0.1, 0, 0, 7); g.fill();
  // badan bulat
  const bodyY = -s * 0.75 - Math.abs(step) * s * 0.06;
  const gr = g.createRadialGradient(-s * 0.2, bodyY - s * 0.25, s * 0.1, 0, bodyY, s * 0.7);
  gr.addColorStop(0, '#fff3bf'); gr.addColorStop(0.35, '#ffb84d'); gr.addColorStop(1, '#e8590c');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, bodyY, s * 0.55, s * 0.65, 0, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(0, bodyY + s * 0.2, s * 0.3, s * 0.28, 0, 0, 7); g.fill();
  // tangan: melambai panik atau berayun biasa
  const flail = a.panic;
  for (const side of [-1, 1]) {
    const base = side * s * 0.5;
    const ang = flail > 0.2 ? -1.2 * side + Math.sin(now / 55 + side) * 0.9 * flail : side * (0.5 + Math.sin(a.walk + (side > 0 ? Math.PI : 0)) * 0.25);
    g.strokeStyle = '#e8590c'; g.lineWidth = s * 0.13; g.lineCap = 'round';
    const ex = base + Math.sin(ang) * s * 0.45 * side, ey = bodyY + Math.cos(ang) * s * 0.42 * (flail > 0.2 ? -1 : 1);
    g.beginPath(); g.moveTo(base, bodyY); g.lineTo(ex, ey); g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(ex, ey, s * 0.09, 0, 7); g.fill();
  }
  // muka
  const eyeR = s * (0.09 + a.panic * 0.05);
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(-s * 0.18, bodyY - s * 0.15, eyeR * 1.3, 0, 7); g.arc(s * 0.18, bodyY - s * 0.15, eyeR * 1.3, 0, 7); g.fill();
  g.fillStyle = '#2b2350';
  const look = clamp(b.vx * 0.03, -0.04, 0.04) * s;
  g.beginPath(); g.arc(-s * 0.18 + look, bodyY - s * 0.15, eyeR * 0.7, 0, 7); g.arc(s * 0.18 + look, bodyY - s * 0.15, eyeR * 0.7, 0, 7); g.fill();
  if (a.panic > 0.4) { g.fillStyle = '#7a2e1f'; g.beginPath(); g.ellipse(0, bodyY + s * 0.12, s * 0.08, s * 0.11 * a.panic, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(116,192,252,.9)'; g.beginPath(); g.ellipse(s * 0.42, bodyY - s * 0.45, s * 0.06, s * 0.1, 0.3, 0, 7); g.fill(); }
  else { g.strokeStyle = '#7a2e1f'; g.lineWidth = s * 0.05; g.beginPath(); g.arc(0, bodyY + s * 0.02, s * 0.14, 0.2, Math.PI - 0.2); g.stroke(); }
  g.fillStyle = 'rgba(255,143,171,.6)'; g.beginPath(); g.ellipse(-s * 0.33, bodyY, s * 0.08, s * 0.05, 0, 0, 7); g.ellipse(s * 0.33, bodyY, s * 0.08, s * 0.05, 0, 0, 7); g.fill();
  // topi kecil
  g.fillStyle = '#3d8bff'; g.beginPath(); g.ellipse(0, bodyY - s * 0.6, s * 0.3, s * 0.12, 0, 0, 7); g.fill(); g.fillRect(-s * 0.18, bodyY - s * 0.78, s * 0.36, s * 0.18);
  g.restore();
}
export default {
  celebrate() { bsfx.celebrate(); },
  play(ctx) {
    return runTiltGame(ctx, {
      id: 'imbang', title: 'Titian Imbang', cfg: WALKER, makeLevel: makeImbang,
      intro: (n) => INTRO[Math.min(2, Math.floor((n - 1) / 10))](n),
      winText: 'Syabas! Si Bulat sampai dengan selamat!',
      fallText: () => ['Alamak, Si Bulat terjatuh! Jom cuba lagi.', 'Wah, hampir! Senget sedikit sahaja, ya.', 'Tak apa, kita mula semula di bendera.'][Math.floor(Math.random() * 3)],
      animate, drawBody: drawWalker, cam: { B: 3.8, H: 4.4 },
    });
  },
};
