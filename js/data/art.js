// Lukisan garisan untuk aktiviti mewarna (viewBox 0 0 200 200).
// Setiap kawasan boleh diwarna mempunyai data-r (id kawasan); `want` = warna cadangan.
export const COLORING = [
  {
    id: 'epal', n: 'Epal', group: 'buah', reveal: '🍎',
    regions: [
      { id: 'tangkai', n: 'tangkai', want: 'coklat', svg: '<rect x="95" y="28" width="10" height="34" rx="4"/>' },
      { id: 'badan', n: 'buah epal', want: 'merah', svg: '<path d="M100 62 C 70 40, 28 55, 34 106 C 40 150, 76 182, 100 166 C 124 182, 160 150, 166 106 C 172 55, 130 40, 100 62 Z"/>' },
      { id: 'daun', n: 'daun', want: 'hijau', svg: '<path d="M106 46 C 122 24, 148 26, 154 34 C 142 52, 122 56, 106 46 Z"/>' },
    ],
    deco: '<path class="line" d="M62 90 C 58 104, 60 118, 66 128"/>',
  },
  {
    id: 'pisang', n: 'Pisang', group: 'buah', reveal: '🍌',
    regions: [
      { id: 'badan', n: 'pisang', want: 'kuning', svg: '<path d="M44 58 C 52 142, 132 172, 172 120 C 176 110, 168 104, 160 110 C 120 140, 76 118, 64 58 Z"/>' },
      { id: 'hujung', n: 'hujung pisang', want: 'coklat', svg: '<path d="M40 44 L 62 42 L 64 58 L 44 60 Z"/>' },
    ],
    deco: '<path class="line" d="M70 80 C 80 120, 110 138, 150 126"/>',
  },
  {
    id: 'tembikai', n: 'Tembikai', group: 'buah', reveal: '🍉',
    regions: [
      { id: 'kulit', n: 'kulit tembikai', want: 'hijau', svg: '<path d="M16 76 A 84 84 0 0 0 184 76 Z"/>' },
      { id: 'isi', n: 'isi tembikai', want: 'merah', svg: '<path d="M32 78 A 68 68 0 0 0 168 78 Z"/>' },
    ],
    deco: '<g fill="#3d3256" pointer-events="none"><ellipse cx="70" cy="100" rx="4" ry="7"/><ellipse cx="100" cy="112" rx="4" ry="7"/><ellipse cx="130" cy="100" rx="4" ry="7"/><ellipse cx="85" cy="128" rx="4" ry="7"/><ellipse cx="115" cy="128" rx="4" ry="7"/></g>',
  },
  {
    id: 'strawberi', n: 'Strawberi', group: 'buah', reveal: '🍓',
    regions: [
      { id: 'badan', n: 'buah strawberi', want: 'merah', svg: '<path d="M100 178 C 48 142, 38 92, 60 70 C 80 56, 120 56, 140 70 C 162 92, 152 142, 100 178 Z"/>' },
      { id: 'daun', n: 'daun', want: 'hijau', svg: '<path d="M58 70 L 78 46 L 90 60 L 100 40 L 110 60 L 122 46 L 142 70 C 120 80, 80 80, 58 70 Z"/>' },
    ],
    deco: '<g fill="#fff3a0" stroke="#3d3256" stroke-width="1.5" pointer-events="none"><ellipse cx="80" cy="95" rx="3" ry="5"/><ellipse cx="110" cy="92" rx="3" ry="5"/><ellipse cx="95" cy="120" rx="3" ry="5"/><ellipse cx="125" cy="118" rx="3" ry="5"/><ellipse cx="75" cy="125" rx="3" ry="5"/><ellipse cx="105" cy="148" rx="3" ry="5"/></g>',
  },
  {
    id: 'ikan', n: 'Ikan', group: 'haiwan', reveal: '🐟',
    regions: [
      { id: 'ekor', n: 'ekor', want: 'oren', svg: '<path d="M140 100 L 186 62 L 186 138 Z"/>' },
      { id: 'sirip', n: 'sirip', want: 'kuning', svg: '<path d="M78 64 C 90 38, 118 42, 122 66 Z"/>' },
      { id: 'badan', n: 'badan ikan', want: 'oren', svg: '<ellipse cx="94" cy="102" rx="62" ry="40"/>' },
      { id: 'mata', n: 'mata', want: 'putih', svg: '<circle cx="62" cy="92" r="10"/>' },
    ],
    deco: '<circle cx="60" cy="93" r="4" fill="#3d3256" pointer-events="none"/><path class="line" d="M40 112 C 48 116, 54 116, 60 112"/><path class="line" d="M110 80 C 120 96, 120 110, 110 124"/>',
  },
  {
    id: 'kucing', n: 'Kucing', group: 'haiwan', reveal: '🐱',
    regions: [
      { id: 'telingakiri', n: 'telinga kiri', want: 'oren', svg: '<path d="M48 84 L 58 28 L 96 62 Z"/>' },
      { id: 'telingakanan', n: 'telinga kanan', want: 'oren', svg: '<path d="M152 84 L 142 28 L 104 62 Z"/>' },
      { id: 'muka', n: 'muka kucing', want: 'oren', svg: '<circle cx="100" cy="112" r="62"/>' },
      { id: 'hidung', n: 'hidung', want: 'merahjambu', svg: '<path d="M90 114 L 110 114 L 100 126 Z"/>' },
    ],
    deco: '<g pointer-events="none"><ellipse cx="76" cy="98" rx="7" ry="10" fill="#3d3256"/><ellipse cx="124" cy="98" rx="7" ry="10" fill="#3d3256"/></g><path class="line" d="M100 126 C 96 138, 86 140, 80 134 M100 126 C 104 138, 114 140, 120 134 M60 120 L 30 112 M60 128 L 30 132 M140 120 L 170 112 M140 128 L 170 132"/>',
  },
  {
    id: 'ramarama', n: 'Rama-rama', group: 'haiwan', reveal: '🦋',
    regions: [
      { id: 'sayap1', n: 'sayap atas kiri', want: 'ungu', svg: '<path d="M96 96 C 60 28, 12 44, 28 90 C 38 112, 80 112, 96 102 Z"/>' },
      { id: 'sayap2', n: 'sayap atas kanan', want: 'ungu', svg: '<path d="M104 96 C 140 28, 188 44, 172 90 C 162 112, 120 112, 104 102 Z"/>' },
      { id: 'sayap3', n: 'sayap bawah kiri', want: 'merahjambu', svg: '<path d="M96 106 C 60 110, 32 150, 58 166 C 80 176, 94 140, 96 114 Z"/>' },
      { id: 'sayap4', n: 'sayap bawah kanan', want: 'merahjambu', svg: '<path d="M104 106 C 140 110, 168 150, 142 166 C 120 176, 106 140, 104 114 Z"/>' },
      { id: 'badan', n: 'badan', want: 'coklat', svg: '<ellipse cx="100" cy="106" rx="8" ry="48"/>' },
    ],
    deco: '<path class="line" d="M96 60 C 90 40, 80 32, 72 30 M104 60 C 110 40, 120 32, 128 30"/>',
  },
  {
    id: 'kurakura', n: 'Kura-kura', group: 'haiwan', reveal: '🐢',
    regions: [
      { id: 'kaki', n: 'kaki', want: 'hijau', svg: '<g><ellipse cx="62" cy="128" rx="16" ry="11"/><ellipse cx="138" cy="128" rx="16" ry="11"/></g>' },
      { id: 'kepala', n: 'kepala', want: 'hijau', svg: '<circle cx="170" cy="108" r="18"/>' },
      { id: 'cangkerang', n: 'cangkerang', want: 'coklat', svg: '<path d="M36 124 C 36 54, 158 54, 158 124 Z"/>' },
    ],
    deco: '<circle cx="176" cy="104" r="3" fill="#3d3256" pointer-events="none"/><path class="line" d="M64 124 L 74 92 L 120 92 L 132 124 M74 92 L 97 68 L 120 92"/>',
  },
  {
    id: 'kereta', n: 'Kereta', group: 'kenderaan', reveal: '🚗',
    regions: [
      { id: 'badan', n: 'badan kereta', want: 'merah', svg: '<path d="M18 132 L 18 106 C 18 96, 28 90, 44 90 L 64 90 L 86 58 L 140 58 L 166 90 L 176 92 C 184 94, 186 100, 186 110 L 186 132 Z"/>' },
      { id: 'tingkap', n: 'tingkap', want: 'biru', svg: '<g><path d="M92 66 L 112 66 L 112 90 L 76 90 Z"/><path d="M120 66 L 136 66 L 154 90 L 120 90 Z"/></g>' },
      { id: 'roda', n: 'roda', want: 'hitam', svg: '<g><circle cx="58" cy="136" r="19"/><circle cx="148" cy="136" r="19"/></g>' },
    ],
    deco: '<g fill="#ddd" stroke="#3d3256" stroke-width="2" pointer-events="none"><circle cx="58" cy="136" r="7"/><circle cx="148" cy="136" r="7"/></g>',
  },
  {
    id: 'bot', n: 'Bot layar', group: 'kenderaan', reveal: '⛵',
    regions: [
      { id: 'laut', n: 'laut', want: 'biru', svg: '<path d="M0 162 C 30 152, 60 172, 100 162 C 140 152, 170 172, 200 162 L 200 200 L 0 200 Z"/>' },
      { id: 'badan', n: 'badan bot', want: 'coklat', svg: '<path d="M28 130 L 172 130 L 146 162 L 54 162 Z"/>' },
      { id: 'layar', n: 'layar', want: 'putih', svg: '<g><path d="M98 34 L 98 122 L 38 122 Z"/><path d="M106 48 L 106 122 L 156 122 Z"/></g>' },
      { id: 'bendera', n: 'bendera', want: 'merah', svg: '<path d="M102 18 L 128 26 L 102 34 Z"/>' },
    ],
    deco: '<path class="line" d="M102 18 L 102 130"/>',
  },
  {
    id: 'roket', n: 'Roket', group: 'kenderaan', reveal: '🚀',
    regions: [
      { id: 'api', n: 'api', want: 'oren', svg: '<path d="M80 152 L 100 192 L 120 152 Z"/>' },
      { id: 'sirip', n: 'sirip', want: 'merah', svg: '<g><path d="M74 118 L 44 160 L 74 150 Z"/><path d="M126 118 L 156 160 L 126 150 Z"/></g>' },
      { id: 'badan', n: 'badan roket', want: 'putih', svg: '<path d="M100 18 C 132 50, 136 100, 128 152 L 72 152 C 64 100, 68 50, 100 18 Z"/>' },
      { id: 'tingkap', n: 'tingkap', want: 'biru', svg: '<circle cx="100" cy="82" r="17"/>' },
    ],
    deco: '',
  },
  {
    id: 'bas', n: 'Bas', group: 'kenderaan', reveal: '🚌',
    regions: [
      { id: 'badan', n: 'badan bas', want: 'kuning', svg: '<rect x="14" y="56" width="172" height="92" rx="14"/>' },
      { id: 'tingkap', n: 'tingkap', want: 'biru', svg: '<g><rect x="26" y="68" width="30" height="30" rx="4"/><rect x="64" y="68" width="30" height="30" rx="4"/><rect x="102" y="68" width="30" height="30" rx="4"/></g>' },
      { id: 'pintu', n: 'pintu', want: 'merah', svg: '<rect x="144" y="68" width="30" height="66" rx="4"/>' },
      { id: 'roda', n: 'roda', want: 'hitam', svg: '<g><circle cx="52" cy="150" r="17"/><circle cx="148" cy="150" r="17"/></g>' },
    ],
    deco: '<path class="line" d="M14 116 L 140 116"/>',
  },
  {
    id: 'rumah', n: 'Rumah', group: 'lain', reveal: '🏠',
    regions: [
      { id: 'cerobong', n: 'cerobong', want: 'coklat', svg: '<rect x="128" y="44" width="18" height="40"/>' },
      { id: 'bumbung', n: 'bumbung', want: 'merah', svg: '<path d="M26 102 L 100 38 L 174 102 Z"/>' },
      { id: 'dinding', n: 'dinding', want: 'kuning', svg: '<rect x="44" y="100" width="112" height="84"/>' },
      { id: 'pintu', n: 'pintu', want: 'coklat', svg: '<rect x="86" y="132" width="28" height="52" rx="3"/>' },
      { id: 'tingkap', n: 'tingkap', want: 'biru', svg: '<g><rect x="56" y="114" width="22" height="22"/><rect x="122" y="114" width="22" height="22"/></g>' },
    ],
    deco: '<circle cx="108" cy="160" r="2.5" fill="#3d3256" pointer-events="none"/>',
  },
  {
    id: 'matahari', n: 'Matahari', group: 'lain', reveal: '☀️',
    regions: [
      { id: 'sinar', n: 'sinar', want: 'oren', svg: '<g><path d="M100 6 L 112 40 L 88 40 Z"/><path d="M100 194 L 112 160 L 88 160 Z"/><path d="M6 100 L 40 88 L 40 112 Z"/><path d="M194 100 L 160 88 L 160 112 Z"/><path d="M34 34 L 64 52 L 52 64 Z"/><path d="M166 34 L 136 52 L 148 64 Z"/><path d="M34 166 L 52 136 L 64 148 Z"/><path d="M166 166 L 148 136 L 136 148 Z"/></g>' },
      { id: 'muka', n: 'matahari', want: 'kuning', svg: '<circle cx="100" cy="100" r="50"/>' },
    ],
    deco: '<g fill="#3d3256" pointer-events="none"><circle cx="82" cy="90" r="5"/><circle cx="118" cy="90" r="5"/></g><path class="line" d="M78 112 C 88 126, 112 126, 122 112"/>',
  },
  {
    id: 'bunga', n: 'Bunga', group: 'lain', reveal: '🌼',
    regions: [
      { id: 'batang', n: 'batang', want: 'hijau', svg: '<rect x="95" y="104" width="10" height="88" rx="4"/>' },
      { id: 'daun', n: 'daun', want: 'hijau', svg: '<path d="M104 150 C 130 128, 152 138, 158 150 C 142 162, 120 166, 104 156 Z"/>' },
      { id: 'kelopak1', n: 'kelopak', want: 'merahjambu', svg: '<circle cx="100" cy="52" r="24"/>' },
      { id: 'kelopak2', n: 'kelopak', want: 'merahjambu', svg: '<circle cx="138" cy="78" r="24"/>' },
      { id: 'kelopak3', n: 'kelopak', want: 'merahjambu', svg: '<circle cx="124" cy="120" r="24"/>' },
      { id: 'kelopak4', n: 'kelopak', want: 'merahjambu', svg: '<circle cx="76" cy="120" r="24"/>' },
      { id: 'kelopak5', n: 'kelopak', want: 'merahjambu', svg: '<circle cx="62" cy="78" r="24"/>' },
      { id: 'tengah', n: 'tengah bunga', want: 'kuning', svg: '<circle cx="100" cy="90" r="20"/>' },
    ],
    deco: '',
  },
  {
    id: 'pokok', n: 'Pokok', group: 'lain', reveal: '🌳',
    regions: [
      { id: 'batang', n: 'batang pokok', want: 'coklat', svg: '<path d="M86 192 L 90 118 L 110 118 L 114 192 Z"/>' },
      { id: 'daun', n: 'daun', want: 'hijau', svg: '<g><circle cx="100" cy="78" r="46"/><circle cx="64" cy="106" r="32"/><circle cx="136" cy="106" r="32"/></g>' },
      { id: 'buah', n: 'buah', want: 'merah', svg: '<g><circle cx="80" cy="80" r="9"/><circle cx="122" cy="94" r="9"/><circle cx="100" cy="56" r="9"/><circle cx="142" cy="116" r="8"/><circle cx="62" cy="114" r="8"/></g>' },
    ],
    deco: '',
  },
  {
    id: 'belon', n: 'Belon', group: 'lain', reveal: '🎈',
    regions: [
      { id: 'b1', n: 'belon kiri', want: 'merah', svg: '<ellipse cx="60" cy="70" rx="30" ry="38"/>' },
      { id: 'b2', n: 'belon tengah', want: 'kuning', svg: '<ellipse cx="100" cy="56" rx="30" ry="38"/>' },
      { id: 'b3', n: 'belon kanan', want: 'biru', svg: '<ellipse cx="140" cy="70" rx="30" ry="38"/>' },
    ],
    deco: '<path class="line" d="M60 108 C 70 140, 90 160, 100 186 M100 94 C 96 130, 104 160, 100 186 M140 108 C 130 140, 110 160, 100 186"/>',
  },
];

// Bentuk untuk aktiviti sambung titik (koordinat 0–100, mengikut lilitan)
export const DOT_SHAPES = [
  { id: 'segitiga', n: 'Segi tiga', reveal: '🔺', poly: [[50, 10], [90, 85], [10, 85]] },
  { id: 'segiempat', n: 'Segi empat', reveal: '🟦', poly: [[15, 15], [85, 15], [85, 85], [15, 85]] },
  { id: 'berlian', n: 'Berlian', reveal: '💎', poly: [[50, 8], [90, 50], [50, 92], [10, 50]] },
  { id: 'bintang', n: 'Bintang', reveal: '⭐', poly: [[50, 6], [61, 38], [95, 38], [68, 58], [79, 92], [50, 72], [21, 92], [32, 58], [5, 38], [39, 38]] },
  { id: 'rumah', n: 'Rumah', reveal: '🏠', poly: [[50, 8], [90, 45], [80, 45], [80, 90], [20, 90], [20, 45], [10, 45]] },
  { id: 'hati', n: 'Hati', reveal: '❤️', poly: [[50, 88], [20, 62], [8, 40], [12, 22], [26, 12], [42, 16], [50, 28], [58, 16], [74, 12], [88, 22], [92, 40], [80, 62]] },
  { id: 'ikan', n: 'Ikan', reveal: '🐟', poly: [[8, 50], [25, 30], [50, 24], [72, 36], [92, 20], [86, 50], [92, 80], [72, 64], [50, 76], [25, 70]] },
  { id: 'bot', n: 'Bot', reveal: '⛵', poly: [[50, 8], [50, 60], [90, 60], [76, 86], [24, 86], [10, 60], [46, 60], [14, 56]] },
  { id: 'pokok', n: 'Pokok', reveal: '🌲', poly: [[50, 6], [76, 36], [64, 36], [86, 62], [56, 62], [56, 92], [44, 92], [44, 62], [14, 62], [36, 36], [24, 36]] },
  { id: 'payung', n: 'Payung', reveal: '☂️', poly: [[50, 10], [76, 18], [92, 44], [74, 40], [56, 46], [56, 84], [46, 92], [36, 84], [42, 84], [46, 88], [48, 46], [26, 40], [8, 44], [24, 18]] },
  { id: 'bulan', n: 'Bulan', reveal: '🌙', poly: [[60, 6], [36, 14], [18, 36], [16, 62], [30, 84], [56, 94], [80, 86], [56, 76], [42, 56], [44, 30]] },
  { id: 'kupu', n: 'Rama-rama', reveal: '🦋', poly: [[50, 30], [70, 10], [92, 18], [88, 44], [66, 52], [88, 66], [80, 90], [56, 80], [50, 62], [44, 80], [20, 90], [12, 66], [34, 52], [12, 44], [8, 18], [30, 10]] },
];

// Laluan untuk menyurih (finger tracing). Senarai garisan (strokes) dalam koordinat 0–100.
const arc = (cx, cy, r, a0, a1, n = 16) => Array.from({ length: n + 1 }, (_, i) => {
  const a = (a0 + (a1 - a0) * (i / n)) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
export const TRACE = [
  { id: 'I', n: 'huruf I', strokes: [[[50, 12], [50, 88]]] },
  { id: 'L', n: 'huruf L', strokes: [[[32, 12], [32, 88], [74, 88]]] },
  { id: 'T', n: 'huruf T', strokes: [[[20, 14], [80, 14]], [[50, 14], [50, 88]]] },
  { id: 'V', n: 'huruf V', strokes: [[[20, 12], [50, 88], [80, 12]]] },
  { id: 'O', n: 'huruf O', strokes: [arc(50, 50, 36, -90, 270, 24)] },
  { id: 'C', n: 'huruf C', strokes: [arc(52, 50, 36, -40, -320, 20)] },
  { id: 'U', n: 'huruf U', strokes: [[[24, 12], ...arc(50, 60, 26, 180, 0, 14).slice(0), [76, 12]]] },
  { id: 'Z', n: 'huruf Z', strokes: [[[22, 14], [78, 14], [22, 86], [78, 86]]] },
  { id: 'N', n: 'huruf N', strokes: [[[26, 88], [26, 12], [74, 88], [74, 12]]] },
  { id: 'M', n: 'huruf M', strokes: [[[16, 88], [16, 12], [50, 60], [84, 12], [84, 88]]] },
  { id: 'W', n: 'huruf W', strokes: [[[12, 12], [30, 88], [50, 36], [70, 88], [88, 12]]] },
  { id: 'A', n: 'huruf A', strokes: [[[18, 88], [50, 12], [82, 88]], [[32, 58], [68, 58]]] },
  { id: 'E', n: 'huruf E', strokes: [[[72, 12], [28, 12], [28, 88], [72, 88]], [[28, 50], [64, 50]]] },
  { id: 'H', n: 'huruf H', strokes: [[[26, 12], [26, 88]], [[74, 12], [74, 88]], [[26, 50], [74, 50]]] },
  { id: 'X', n: 'huruf X', strokes: [[[22, 12], [78, 88]], [[78, 12], [22, 88]]] },
  { id: '1', n: 'nombor 1', strokes: [[[36, 26], [52, 12], [52, 88]]] },
  { id: '7', n: 'nombor 7', strokes: [[[24, 14], [76, 14], [42, 88]]] },
  { id: '4', n: 'nombor 4', strokes: [[[60, 88], [60, 12], [20, 62], [80, 62]]] },
  { id: 'segitiga', n: 'segi tiga', strokes: [[[50, 12], [86, 84], [14, 84], [50, 12]]] },
  { id: 'segiempat', n: 'segi empat', strokes: [[[18, 18], [82, 18], [82, 82], [18, 82], [18, 18]]] },
  { id: 'bulatan', n: 'bulatan', strokes: [arc(50, 50, 36, 0, 360, 28)] },
  { id: 'gelombang', n: 'garis ombak', strokes: [Array.from({ length: 25 }, (_, i) => [8 + i * 3.5, 50 + 22 * Math.sin(i / 24 * Math.PI * 4)])] },
  { id: 'zigzag', n: 'garis zig-zag', strokes: [[[8, 70], [24, 30], [40, 70], [56, 30], [72, 70], [88, 30]]] },
];
