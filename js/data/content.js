// =====================================================================
//  KANDUNGAN DUNIA CILIK
//  Semua kandungan permainan disimpan di sini supaya mudah diurus dan
//  dikembangkan. Setiap item: e = emoji, n = nama BM, en = nama English.
// =====================================================================

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const VOWELS = ['A', 'E', 'I', 'O', 'U'];

// Perkataan bergambar mengikut huruf pertama (Bahasa Melayu)
export const WORDS = [
  { e: '🐔', n: 'Ayam', en: 'Chicken' }, { e: '🍇', n: 'Anggur', en: 'Grapes' }, { e: '🔥', n: 'Api', en: 'Fire' },
  { e: '🐰', n: 'Arnab', en: 'Rabbit' }, { e: '☁️', n: 'Awan', en: 'Cloud' }, { e: '🍦', n: 'Aiskrim', en: 'Ice cream' },
  { e: '⚽', n: 'Bola', en: 'Ball' }, { e: '📖', n: 'Buku', en: 'Book' }, { e: '🌙', n: 'Bulan', en: 'Moon' },
  { e: '🚌', n: 'Bas', en: 'Bus' }, { e: '🐻', n: 'Beruang', en: 'Bear' }, { e: '🎈', n: 'Belon', en: 'Balloon' },
  { e: '🌸', n: 'Bunga', en: 'Flower' }, { e: '🐦', n: 'Burung', en: 'Bird' }, { e: '⭐', n: 'Bintang', en: 'Star' },
  { e: '🍄', n: 'Cendawan', en: 'Mushroom' }, { e: '🌶️', n: 'Cili', en: 'Chilli' }, { e: '🍒', n: 'Ceri', en: 'Cherry' },
  { e: '🪱', n: 'Cacing', en: 'Worm' }, { e: '🍫', n: 'Coklat', en: 'Chocolate' },
  { e: '🍃', n: 'Daun', en: 'Leaf' }, { e: '🎲', n: 'Dadu', en: 'Dice' }, { e: '🦖', n: 'Dinosaur', en: 'Dinosaur' },
  { e: '🍩', n: 'Donat', en: 'Donut' }, { e: '🥁', n: 'Dram', en: 'Drum' },
  { e: '🍎', n: 'Epal', en: 'Apple' }, { e: '🦅', n: 'Elang', en: 'Eagle' },
  { e: '⛴️', n: 'Feri', en: 'Ferry' }, { e: '🦩', n: 'Flamingo', en: 'Flamingo' },
  { e: '🐘', n: 'Gajah', en: 'Elephant' }, { e: '🎸', n: 'Gitar', en: 'Guitar' }, { e: '⛰️', n: 'Gunung', en: 'Mountain' },
  { e: '🦷', n: 'Gigi', en: 'Tooth' }, { e: '🥛', n: 'Gelas', en: 'Glass' },
  { e: '🐯', n: 'Harimau', en: 'Tiger' }, { e: '🌧️', n: 'Hujan', en: 'Rain' }, { e: '🚁', n: 'Helikopter', en: 'Helicopter' },
  { e: '👃', n: 'Hidung', en: 'Nose' }, { e: '❤️', n: 'Hati', en: 'Heart' },
  { e: '🐟', n: 'Ikan', en: 'Fish' }, { e: '🦆', n: 'Itik', en: 'Duck' }, { e: '🏰', n: 'Istana', en: 'Palace' },
  { e: '⏰', n: 'Jam', en: 'Clock' }, { e: '🌽', n: 'Jagung', en: 'Corn' }, { e: '🌉', n: 'Jambatan', en: 'Bridge' },
  { e: '🐱', n: 'Kucing', en: 'Cat' }, { e: '🚗', n: 'Kereta', en: 'Car' }, { e: '🎂', n: 'Kek', en: 'Cake' },
  { e: '🐸', n: 'Katak', en: 'Frog' }, { e: '🐴', n: 'Kuda', en: 'Horse' }, { e: '👟', n: 'Kasut', en: 'Shoe' },
  { e: '🔑', n: 'Kunci', en: 'Key' }, { e: '🐢', n: 'Kura-kura', en: 'Turtle' },
  { e: '🐝', n: 'Lebah', en: 'Bee' }, { e: '🚚', n: 'Lori', en: 'Lorry' }, { e: '💡', n: 'Lampu', en: 'Lamp' },
  { e: '🍋', n: 'Lemon', en: 'Lemon' }, { e: '🥕', n: 'Lobak', en: 'Carrot' },
  { e: '🐒', n: 'Monyet', en: 'Monkey' }, { e: '☀️', n: 'Matahari', en: 'Sun' }, { e: '👁️', n: 'Mata', en: 'Eye' },
  { e: '🥭', n: 'Mangga', en: 'Mango' }, { e: '👑', n: 'Mahkota', en: 'Crown' }, { e: '🏍️', n: 'Motosikal', en: 'Motorcycle' },
  { e: '🍍', n: 'Nanas', en: 'Pineapple' }, { e: '🍚', n: 'Nasi', en: 'Rice' }, { e: '🦟', n: 'Nyamuk', en: 'Mosquito' },
  { e: '🍊', n: 'Oren', en: 'Orange' }, { e: '🌊', n: 'Ombak', en: 'Wave' }, { e: '🦧', n: 'Orang utan', en: 'Orangutan' },
  { e: '🍌', n: 'Pisang', en: 'Banana' }, { e: '☂️', n: 'Payung', en: 'Umbrella' }, { e: '🌳', n: 'Pokok', en: 'Tree' },
  { e: '✏️', n: 'Pensel', en: 'Pencil' }, { e: '🐧', n: 'Penguin', en: 'Penguin' }, { e: '🚪', n: 'Pintu', en: 'Door' },
  { e: '✈️', n: 'Pesawat', en: 'Aeroplane' },
  { e: '🦋', n: 'Rama-rama', en: 'Butterfly' }, { e: '🏠', n: 'Rumah', en: 'House' }, { e: '🍞', n: 'Roti', en: 'Bread' },
  { e: '🚀', n: 'Roket', en: 'Rocket' }, { e: '🦌', n: 'Rusa', en: 'Deer' },
  { e: '🐌', n: 'Siput', en: 'Snail' }, { e: '🦁', n: 'Singa', en: 'Lion' }, { e: '🥄', n: 'Sudu', en: 'Spoon' },
  { e: '🍓', n: 'Strawberi', en: 'Strawberry' }, { e: '🦑', n: 'Sotong', en: 'Squid' }, { e: '🏫', n: 'Sekolah', en: 'School' },
  { e: '🐜', n: 'Semut', en: 'Ant' },
  { e: '🐭', n: 'Tikus', en: 'Mouse' }, { e: '🥚', n: 'Telur', en: 'Egg' }, { e: '🍉', n: 'Tembikai', en: 'Watermelon' },
  { e: '✋', n: 'Tangan', en: 'Hand' }, { e: '📱', n: 'Telefon', en: 'Phone' }, { e: '🚕', n: 'Teksi', en: 'Taxi' },
  { e: '🍅', n: 'Tomato', en: 'Tomato' }, { e: '🧢', n: 'Topi', en: 'Cap' },
  { e: '🐍', n: 'Ular', en: 'Snake' }, { e: '🦐', n: 'Udang', en: 'Prawn' }, { e: '🐪', n: 'Unta', en: 'Camel' },
  { e: '🐛', n: 'Ulat', en: 'Caterpillar' }, { e: '🍠', n: 'Ubi', en: 'Sweet potato' },
  { e: '🚐', n: 'Van', en: 'Van' }, { e: '🎻', n: 'Violin', en: 'Violin' },
  { e: '🪁', n: 'Wau', en: 'Kite' }, { e: '💵', n: 'Wang', en: 'Money' },
  { e: '🪀', n: 'Yoyo', en: 'Yo-yo' }, { e: '🦈', n: 'Yu', en: 'Shark' },
  { e: '🦒', n: 'Zirafah', en: 'Giraffe' }, { e: '🦓', n: 'Zebra', en: 'Zebra' },
].filter((w) => !w.skip).map((w) => ({ ...w, l: w.n[0].toUpperCase() }));

export const wordsByLetter = (L) => WORDS.filter((w) => w.l === L);
export const LETTERS_WITH_WORDS = LETTERS.filter((L) => wordsByLetter(L).length > 0);
// Perkataan pendek untuk dieja (3–5 huruf, tanpa sempang/ruang)
export const SPELL_WORDS = WORDS.filter((w) => /^[A-Za-z]{2,6}$/.test(w.n));

export const NUM_WORDS = ['kosong', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh',
  'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'lapan belas', 'sembilan belas', 'dua puluh'];
export const NUM_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

// Objek untuk dikira (dengan penjodoh bilangan)
export const COUNTABLES = [
  { e: '🍎', n: 'epal', pj: 'biji' }, { e: '🍌', n: 'pisang', pj: 'biji' }, { e: '⭐', n: 'bintang', pj: 'buah' },
  { e: '🐟', n: 'ikan', pj: 'ekor' }, { e: '🐥', n: 'anak ayam', pj: 'ekor' }, { e: '🎈', n: 'belon', pj: 'biji' },
  { e: '🌸', n: 'bunga', pj: 'kuntum' }, { e: '🚗', n: 'kereta', pj: 'buah' }, { e: '🍓', n: 'strawberi', pj: 'biji' },
  { e: '🐞', n: 'kumbang', pj: 'ekor' }, { e: '⚽', n: 'bola', pj: 'biji' }, { e: '🧁', n: 'kek cawan', pj: 'biji' },
  { e: '🦋', n: 'rama-rama', pj: 'ekor' }, { e: '🍊', n: 'oren', pj: 'biji' }, { e: '🐢', n: 'kura-kura', pj: 'ekor' },
  { e: '🌳', n: 'pokok', pj: 'batang' }, { e: '✏️', n: 'pensel', pj: 'batang' }, { e: '🥚', n: 'telur', pj: 'biji' },
];

export const COLORS = [
  { id: 'merah', n: 'Merah', en: 'Red', hex: '#ff4d4d', items: ['🍎', '🍓', '🍅', '🌹', '🚒', '🍒', '❤️', '🌶️'] },
  { id: 'biru', n: 'Biru', en: 'Blue', hex: '#3a86ff', items: ['💙', '🐳', '🫐', '🧢', '🚙', '🐋', '🧊', '👖'] },
  { id: 'kuning', n: 'Kuning', en: 'Yellow', hex: '#ffd60a', items: ['🍌', '🌻', '⭐', '🐥', '🍋', '🌽', '🧀', '🚕'] },
  { id: 'hijau', n: 'Hijau', en: 'Green', hex: '#38b000', items: ['🥦', '🐸', '🍀', '🥒', '🌲', '🍏', '🐢', '🥬'] },
  { id: 'oren', n: 'Oren', en: 'Orange', hex: '#ff8c1a', items: ['🍊', '🥕', '🎃', '🦊', '🏀', '🧡', '🦁', '🍑'] },
  { id: 'ungu', n: 'Ungu', en: 'Purple', hex: '#9d4edd', items: ['🍇', '🍆', '💜', '🔮', '☂️', '🟣', '🦄', '👾'] },
  { id: 'merahjambu', n: 'Merah jambu', en: 'Pink', hex: '#ff70a6', items: ['🌸', '🐷', '🎀', '🦩', '💗', '🍑', '🌷', '🩷'] },
  { id: 'coklat', n: 'Coklat', en: 'Brown', hex: '#8b5a2b', items: ['🐻', '🍫', '🥔', '🌰', '🪵', '🍪', '🐴', '🥥'] },
  { id: 'hitam', n: 'Hitam', en: 'Black', hex: '#222222', items: ['🖤', '🎱', '🐈‍⬛', '🕶️', '🎩', '⚫', '🦍', '🐜'] },
  { id: 'putih', n: 'Putih', en: 'White', hex: '#f4f4f4', items: ['⚪', '☁️', '🐑', '🥚', '🦢', '⛄', '🦷', '🍚'] },
].map((c) => ({ ...c, items: c.items.filter((x, i, a) => a.indexOf(x) === i) }));
// Hanya item yang warnanya jelas digunakan untuk soalan "cari objek berdasarkan warna"
export const COLOR_OBJECTS = {
  merah: ['🍎', '🍓', '🍅', '🚒', '🍒', '❤️'],
  biru: ['💙', '🐳', '🫐', '🧢', '👖', '🐋'],
  kuning: ['🍌', '🌻', '⭐', '🐥', '🍋', '🌽'],
  hijau: ['🥦', '🐸', '🍀', '🥒', '🌲', '🍏'],
  oren: ['🍊', '🥕', '🎃', '🏀', '🧡'],
  ungu: ['🍇', '🍆', '💜', '🔮'],
  merahjambu: ['🐷', '🎀', '🦩', '💗', '🌷'],
  coklat: ['🐻', '🍫', '🥔', '🌰', '🍪'],
};
// Gabungan warna (asas -> sekunder)
export const COLOR_MIX = [
  { a: 'merah', b: 'kuning', r: 'oren' },
  { a: 'biru', b: 'kuning', r: 'hijau' },
  { a: 'merah', b: 'biru', r: 'ungu' },
  { a: 'merah', b: 'putih', r: 'merahjambu' },
];
export const colorById = (id) => COLORS.find((c) => c.id === id);

export const SHAPES = [
  { id: 'bulatan', n: 'Bulatan', en: 'Circle', svg: '<circle cx="50" cy="50" r="42"/>' },
  { id: 'segitiga', n: 'Segi tiga', en: 'Triangle', svg: '<polygon points="50,8 94,90 6,90"/>' },
  { id: 'segiempat', n: 'Segi empat sama', en: 'Square', svg: '<rect x="10" y="10" width="80" height="80" rx="4"/>' },
  { id: 'segiempattepat', n: 'Segi empat tepat', en: 'Rectangle', svg: '<rect x="4" y="26" width="92" height="48" rx="4"/>' },
  { id: 'bintang', n: 'Bintang', en: 'Star', svg: '<polygon points="50,5 61,38 96,38 68,59 79,93 50,72 21,93 32,59 4,38 39,38"/>' },
  { id: 'hati', n: 'Hati', en: 'Heart', svg: '<path d="M50 90 C 10 62, 4 36, 22 20 C 36 8, 50 18, 50 30 C 50 18, 64 8, 78 20 C 96 36, 90 62, 50 90 Z"/>' },
  { id: 'bujur', n: 'Bujur', en: 'Oval', svg: '<ellipse cx="50" cy="50" rx="44" ry="30"/>' },
  { id: 'berlian', n: 'Berlian', en: 'Diamond', svg: '<polygon points="50,4 94,50 50,96 6,50"/>' },
  { id: 'bulansabit', n: 'Bulan sabit', en: 'Crescent', svg: '<path d="M62 8 A 44 44 0 1 0 62 92 A 34 34 0 1 1 62 8 Z"/>' },
];
// Objek sebenar berdasarkan bentuk
export const SHAPE_OBJECTS = {
  bulatan: ['⚽', '🍪', '🕛', '🍩', '🌕', '🏀'],
  segitiga: ['🍕', '🔺', '⛺', '📐'],
  segiempat: ['🎁', '🧊', '🖼️', '🎲'],
  segiempattepat: ['🚪', '📱', '📺', '🍫'],
  bintang: ['⭐', '🌟', '✴️'],
  hati: ['❤️', '💖', '💙', '💚'],
  bujur: ['🥚', '🏉', '🥥'],
  berlian: ['💎', '🔷', '🪁'],
  bulansabit: ['🌙', '🍌', '🥐'],
};
export const shapeSvg = (id, fill = '#a77bff', size = '1em') => {
  const s = SHAPES.find((x) => x.id === id);
  return `<svg class="shape-svg" viewBox="0 0 100 100" style="width:${size};height:${size}" aria-label="${s.n}"><g fill="${fill}" stroke="rgba(0,0,0,.18)" stroke-width="3">${s.svg}</g></svg>`;
};

// Haiwan: hab = darat/air/udara, home = id habitat, food = makanan, size = saiz relatif (1 kecil -> 10 besar)
export const ANIMALS = [
  { id: 'kucing', e: '🐱', n: 'Kucing', en: 'Cat', hab: 'darat', home: 'rumah', food: 'ikan', size: 3, legs: 4, kind: 'mamalia', snd: 'kucing' },
  { id: 'anjing', e: '🐶', n: 'Anjing', en: 'Dog', hab: 'darat', home: 'rumah', food: 'tulang', size: 4, legs: 4, kind: 'mamalia', snd: 'anjing' },
  { id: 'lembu', e: '🐄', n: 'Lembu', en: 'Cow', hab: 'darat', home: 'ladang', food: 'rumput', size: 7, legs: 4, kind: 'mamalia', snd: 'lembu' },
  { id: 'kambing', e: '🐐', n: 'Kambing', en: 'Goat', hab: 'darat', home: 'ladang', food: 'rumput', size: 5, legs: 4, kind: 'mamalia', snd: 'kambing' },
  { id: 'biri', e: '🐑', n: 'Biri-biri', en: 'Sheep', hab: 'darat', home: 'ladang', food: 'rumput', size: 5, legs: 4, kind: 'mamalia', snd: 'biri' },
  { id: 'ayam', e: '🐔', n: 'Ayam', en: 'Chicken', hab: 'darat', home: 'ladang', food: 'jagung', size: 2, legs: 2, kind: 'burung', snd: 'ayam' },
  { id: 'itik', e: '🦆', n: 'Itik', en: 'Duck', hab: 'darat', home: 'kolam', food: 'jagung', size: 2, legs: 2, kind: 'burung', snd: 'itik' },
  { id: 'kuda', e: '🐴', n: 'Kuda', en: 'Horse', hab: 'darat', home: 'ladang', food: 'rumput', size: 7, legs: 4, kind: 'mamalia', snd: 'kuda' },
  { id: 'arnab', e: '🐰', n: 'Arnab', en: 'Rabbit', hab: 'darat', home: 'ladang', food: 'lobak', size: 2, legs: 4, kind: 'mamalia' },
  { id: 'tikus', e: '🐭', n: 'Tikus', en: 'Mouse', hab: 'darat', home: 'rumah', food: 'keju', size: 1, legs: 4, kind: 'mamalia' },
  { id: 'singa', e: '🦁', n: 'Singa', en: 'Lion', hab: 'darat', home: 'hutan', food: 'daging', size: 7, legs: 4, kind: 'mamalia', snd: 'singa' },
  { id: 'harimau', e: '🐯', n: 'Harimau', en: 'Tiger', hab: 'darat', home: 'hutan', food: 'daging', size: 7, legs: 4, kind: 'mamalia' },
  { id: 'gajah', e: '🐘', n: 'Gajah', en: 'Elephant', hab: 'darat', home: 'hutan', food: 'rumput', size: 10, legs: 4, kind: 'mamalia', snd: 'gajah' },
  { id: 'monyet', e: '🐒', n: 'Monyet', en: 'Monkey', hab: 'darat', home: 'hutan', food: 'pisang', size: 3, legs: 2, kind: 'mamalia', snd: 'monyet' },
  { id: 'panda', e: '🐼', n: 'Panda', en: 'Panda', hab: 'darat', home: 'hutan', food: 'buluh', size: 6, legs: 4, kind: 'mamalia' },
  { id: 'beruang', e: '🐻', n: 'Beruang', en: 'Bear', hab: 'darat', home: 'hutan', food: 'madu', size: 7, legs: 4, kind: 'mamalia' },
  { id: 'zirafah', e: '🦒', n: 'Zirafah', en: 'Giraffe', hab: 'darat', home: 'padang', food: 'daun', size: 9, legs: 4, kind: 'mamalia' },
  { id: 'zebra', e: '🦓', n: 'Zebra', en: 'Zebra', hab: 'darat', home: 'padang', food: 'rumput', size: 7, legs: 4, kind: 'mamalia' },
  { id: 'unta', e: '🐪', n: 'Unta', en: 'Camel', hab: 'darat', home: 'gurun', food: 'rumput', size: 8, legs: 4, kind: 'mamalia' },
  { id: 'katak', e: '🐸', n: 'Katak', en: 'Frog', hab: 'darat', home: 'kolam', food: 'serangga', size: 1, legs: 4, kind: 'amfibia', snd: 'katak' },
  { id: 'penguin', e: '🐧', n: 'Penguin', en: 'Penguin', hab: 'air', home: 'kutub', food: 'ikan', size: 3, legs: 2, kind: 'burung' },
  { id: 'ikan', e: '🐟', n: 'Ikan', en: 'Fish', hab: 'air', home: 'laut', food: 'serangga', size: 2, legs: 0, kind: 'ikan' },
  { id: 'paus', e: '🐳', n: 'Ikan paus', en: 'Whale', hab: 'air', home: 'laut', food: 'udang', size: 10, legs: 0, kind: 'mamalia' },
  { id: 'lumba', e: '🐬', n: 'Ikan lumba-lumba', en: 'Dolphin', hab: 'air', home: 'laut', food: 'ikan', size: 7, legs: 0, kind: 'mamalia' },
  { id: 'sotong', e: '🦑', n: 'Sotong', en: 'Squid', hab: 'air', home: 'laut', food: 'ikan', size: 3, legs: 0, kind: 'lain' },
  { id: 'ketam', e: '🦀', n: 'Ketam', en: 'Crab', hab: 'air', home: 'laut', food: 'ikan', size: 1, legs: 8, kind: 'lain' },
  { id: 'gurita', e: '🐙', n: 'Gurita', en: 'Octopus', hab: 'air', home: 'laut', food: 'ketam', size: 4, legs: 0, kind: 'lain' },
  { id: 'yu', e: '🦈', n: 'Ikan yu', en: 'Shark', hab: 'air', home: 'laut', food: 'ikan', size: 8, legs: 0, kind: 'ikan' },
  { id: 'kurakura', e: '🐢', n: 'Kura-kura', en: 'Turtle', hab: 'air', home: 'laut', food: 'daun', size: 3, legs: 4, kind: 'reptilia' },
  { id: 'udang', e: '🦐', n: 'Udang', en: 'Prawn', hab: 'air', home: 'laut', food: 'serangga', size: 1, legs: 10, kind: 'lain' },
  { id: 'burung', e: '🐦', n: 'Burung', en: 'Bird', hab: 'udara', home: 'sarang', food: 'serangga', size: 1, legs: 2, kind: 'burung', snd: 'burung' },
  { id: 'helang', e: '🦅', n: 'Burung helang', en: 'Eagle', hab: 'udara', home: 'sarang', food: 'ikan', size: 4, legs: 2, kind: 'burung' },
  { id: 'burunghantu', e: '🦉', n: 'Burung hantu', en: 'Owl', hab: 'udara', home: 'sarang', food: 'tikus', size: 3, legs: 2, kind: 'burung', snd: 'burunghantu' },
  { id: 'lebah', e: '🐝', n: 'Lebah', en: 'Bee', hab: 'udara', home: 'sarang', food: 'bunga', size: 1, legs: 6, kind: 'serangga', snd: 'lebah' },
  { id: 'ramarama', e: '🦋', n: 'Rama-rama', en: 'Butterfly', hab: 'udara', home: 'taman', food: 'bunga', size: 1, legs: 6, kind: 'serangga' },
  { id: 'kelawar', e: '🦇', n: 'Kelawar', en: 'Bat', hab: 'udara', home: 'gua', food: 'buah', size: 2, legs: 2, kind: 'mamalia' },
];
export const animalById = (id) => ANIMALS.find((a) => a.id === id);

export const HABITATS = {
  rumah: { e: '🏠', n: 'Rumah' }, ladang: { e: '🌾', n: 'Ladang' }, hutan: { e: '🌳', n: 'Hutan' },
  laut: { e: '🌊', n: 'Laut' }, kutub: { e: '❄️', n: 'Kutub' }, gurun: { e: '🏜️', n: 'Gurun' },
  kolam: { e: '🪷', n: 'Kolam' }, sarang: { e: '🪺', n: 'Sarang' }, padang: { e: '🌄', n: 'Padang rumput' },
  taman: { e: '🌷', n: 'Taman bunga' }, gua: { e: '🕳️', n: 'Gua' },
};
export const FOODS = {
  ikan: { e: '🐟', n: 'Ikan' }, tulang: { e: '🦴', n: 'Tulang' }, rumput: { e: '🌿', n: 'Rumput' }, jagung: { e: '🌽', n: 'Jagung' },
  lobak: { e: '🥕', n: 'Lobak merah' }, keju: { e: '🧀', n: 'Keju' }, daging: { e: '🍖', n: 'Daging' }, pisang: { e: '🍌', n: 'Pisang' },
  buluh: { e: '🎋', n: 'Buluh' }, madu: { e: '🍯', n: 'Madu' }, daun: { e: '🍃', n: 'Daun' }, serangga: { e: '🦟', n: 'Serangga' },
  udang: { e: '🦐', n: 'Udang kecil' }, ketam: { e: '🦀', n: 'Ketam' }, tikus: { e: '🐭', n: 'Tikus' }, bunga: { e: '🌸', n: 'Bunga' },
  buah: { e: '🍉', n: 'Buah-buahan' },
};
// Ibu dan anak haiwan (anak ditunjukkan sebagai emoji kecil kecuali yang ada emoji khas)
export const BABIES = [
  { mom: '🐔', n: 'Ayam', baby: '🐣', bn: 'Anak ayam' },
  { mom: '🦋', n: 'Rama-rama', baby: '🐛', bn: 'Ulat (anak rama-rama)' },
  { mom: '🐸', n: 'Katak', baby: '🥚', bn: 'Telur katak', soft: true },
  { mom: '🐱', n: 'Kucing', baby: '🐱', bn: 'Anak kucing', small: true },
  { mom: '🐶', n: 'Anjing', baby: '🐶', bn: 'Anak anjing', small: true },
  { mom: '🐄', n: 'Lembu', baby: '🐮', bn: 'Anak lembu' },
  { mom: '🐖', n: 'Babi hutan', baby: '🐷', bn: 'Anak', skip: true },
  { mom: '🐑', n: 'Biri-biri', baby: '🐑', bn: 'Anak biri-biri', small: true },
  { mom: '🐘', n: 'Gajah', baby: '🐘', bn: 'Anak gajah', small: true },
  { mom: '🐴', n: 'Kuda', baby: '🐴', bn: 'Anak kuda', small: true },
  { mom: '🦆', n: 'Itik', baby: '🐥', bn: 'Anak itik' },
  { mom: '🐼', n: 'Panda', baby: '🐼', bn: 'Anak panda', small: true },
].filter((b) => !b.skip && !b.soft);

export const FRUITS = [
  { e: '🍎', n: 'Epal', en: 'Apple' }, { e: '🍌', n: 'Pisang', en: 'Banana' }, { e: '🍇', n: 'Anggur', en: 'Grapes' },
  { e: '🍊', n: 'Oren', en: 'Orange' }, { e: '🍉', n: 'Tembikai', en: 'Watermelon' }, { e: '🍍', n: 'Nanas', en: 'Pineapple' },
  { e: '🥭', n: 'Mangga', en: 'Mango' }, { e: '🍓', n: 'Strawberi', en: 'Strawberry' }, { e: '🍐', n: 'Pear', en: 'Pear' },
  { e: '🍒', n: 'Ceri', en: 'Cherry' }, { e: '🥝', n: 'Kiwi', en: 'Kiwi' }, { e: '🍋', n: 'Lemon', en: 'Lemon' },
  { e: '🥥', n: 'Kelapa', en: 'Coconut' }, { e: '🍑', n: 'Pic', en: 'Peach' }, { e: '🫐', n: 'Beri biru', en: 'Blueberry' },
];
export const VEGETABLES = [
  { e: '🥕', n: 'Lobak merah', en: 'Carrot' }, { e: '🥦', n: 'Brokoli', en: 'Broccoli' }, { e: '🌽', n: 'Jagung', en: 'Corn' },
  { e: '🍆', n: 'Terung', en: 'Eggplant' }, { e: '🥒', n: 'Timun', en: 'Cucumber' }, { e: '🥬', n: 'Sawi', en: 'Greens' },
  { e: '🧅', n: 'Bawang', en: 'Onion' }, { e: '🥔', n: 'Kentang', en: 'Potato' }, { e: '🌶️', n: 'Cili', en: 'Chilli' },
  { e: '🫑', n: 'Lada benggala', en: 'Bell pepper' }, { e: '🍄', n: 'Cendawan', en: 'Mushroom' }, { e: '🧄', n: 'Bawang putih', en: 'Garlic' },
];
export const VEHICLES = [
  { e: '🚗', n: 'Kereta', en: 'Car', way: 'darat', snd: 'kereta' }, { e: '🚌', n: 'Bas', en: 'Bus', way: 'darat' },
  { e: '🚚', n: 'Lori', en: 'Lorry', way: 'darat' }, { e: '🚲', n: 'Basikal', en: 'Bicycle', way: 'darat', snd: 'basikal' },
  { e: '🏍️', n: 'Motosikal', en: 'Motorcycle', way: 'darat', snd: 'motosikal' }, { e: '🚂', n: 'Kereta api', en: 'Train', way: 'darat', snd: 'keretaapi' },
  { e: '🚑', n: 'Ambulans', en: 'Ambulance', way: 'darat', snd: 'ambulans' }, { e: '🚒', n: 'Kereta bomba', en: 'Fire engine', way: 'darat', snd: 'bomba' },
  { e: '🚓', n: 'Kereta polis', en: 'Police car', way: 'darat', snd: 'polis' }, { e: '🚜', n: 'Traktor', en: 'Tractor', way: 'darat' },
  { e: '🚕', n: 'Teksi', en: 'Taxi', way: 'darat' },
  { e: '✈️', n: 'Kapal terbang', en: 'Aeroplane', way: 'udara', snd: 'kapalterbang' }, { e: '🚁', n: 'Helikopter', en: 'Helicopter', way: 'udara', snd: 'helikopter' },
  { e: '🚀', n: 'Roket', en: 'Rocket', way: 'udara' }, { e: '🎈', n: 'Belon udara', en: 'Balloon', way: 'udara' }, { e: '🪂', n: 'Payung terjun', en: 'Parachute', way: 'udara' },
  { e: '⛵', n: 'Kapal layar', en: 'Sailboat', way: 'air' }, { e: '🚤', n: 'Bot laju', en: 'Speedboat', way: 'air' },
  { e: '🛳️', n: 'Kapal', en: 'Ship', way: 'air', snd: 'kapal' }, { e: '🛶', n: 'Sampan', en: 'Canoe', way: 'air' }, { e: '⛴️', n: 'Feri', en: 'Ferry', way: 'air' },
];
export const BODY = [
  { e: '👁️', n: 'Mata', en: 'Eye', fn: 'melihat' }, { e: '👂', n: 'Telinga', en: 'Ear', fn: 'mendengar' },
  { e: '👃', n: 'Hidung', en: 'Nose', fn: 'menghidu bau' }, { e: '👅', n: 'Lidah', en: 'Tongue', fn: 'merasa makanan' },
  { e: '✋', n: 'Tangan', en: 'Hand', fn: 'memegang' }, { e: '🦶', n: 'Kaki', en: 'Foot', fn: 'berjalan' },
  { e: '🦷', n: 'Gigi', en: 'Tooth', fn: 'mengunyah makanan' }, { e: '👄', n: 'Mulut', en: 'Mouth', fn: 'bercakap' },
  { e: '💪', n: 'Lengan', en: 'Arm', fn: 'mengangkat' }, { e: '🧠', n: 'Otak', en: 'Brain', fn: 'berfikir' },
];
export const CLOTHES = [
  { e: '👕', n: 'Baju', en: 'Shirt', part: 'badan' }, { e: '👖', n: 'Seluar', en: 'Trousers', part: 'kaki' },
  { e: '👗', n: 'Gaun', en: 'Dress', part: 'badan' }, { e: '🧦', n: 'Stoking', en: 'Socks', part: 'tapak' },
  { e: '👟', n: 'Kasut', en: 'Shoes', part: 'tapak' }, { e: '🧢', n: 'Topi', en: 'Cap', part: 'kepala' },
  { e: '🧥', n: 'Jaket', en: 'Jacket', part: 'badan' }, { e: '🧤', n: 'Sarung tangan', en: 'Gloves', part: 'tangan' },
  { e: '🧣', n: 'Selendang', en: 'Scarf', part: 'leher' }, { e: '🩳', n: 'Seluar pendek', en: 'Shorts', part: 'kaki' },
  { e: '🥾', n: 'But', en: 'Boots', part: 'tapak' }, { e: '👒', n: 'Topi bunga', en: 'Sun hat', part: 'kepala' },
  { e: '🩴', n: 'Selipar', en: 'Slippers', part: 'tapak' }, { e: '🕶️', n: 'Cermin mata hitam', en: 'Sunglasses', part: 'mata' },
];
export const CLOTHES_FOR = [
  { q: 'Hari hujan. Apa yang kita pakai?', e: '🌧️', a: ['☂️', '🥾', '🧥'], no: ['🩳', '🕶️', '👒'] },
  { q: 'Hari panas di pantai. Apa yang kita pakai?', e: '☀️', a: ['🕶️', '👒', '🩳', '🩴'], no: ['🧤', '🧣', '🧥'] },
  { q: 'Cuaca sejuk. Apa yang kita pakai?', e: '❄️', a: ['🧤', '🧣', '🧥'], no: ['🩳', '🩴', '🕶️'] },
  { q: 'Mahu tidur. Apa yang kita pakai?', e: '🛏️', a: ['🩲', '👕'], no: ['🥾', '🧢', '🧤'], skip: true },
].filter((x) => !x.skip);
export const HEALTHY = [
  { e: '🍎', n: 'Epal' }, { e: '🥦', n: 'Brokoli' }, { e: '🥕', n: 'Lobak merah' }, { e: '🍚', n: 'Nasi' }, { e: '🥛', n: 'Susu' },
  { e: '🐟', n: 'Ikan' }, { e: '🥚', n: 'Telur' }, { e: '🍌', n: 'Pisang' }, { e: '🍊', n: 'Oren' }, { e: '💧', n: 'Air kosong' },
];
export const UNHEALTHY = [
  { e: '🍬', n: 'Gula-gula' }, { e: '🍭', n: 'Lolipop' }, { e: '🍟', n: 'Kentang goreng' }, { e: '🥤', n: 'Air bergas' },
  { e: '🍩', n: 'Donat' }, { e: '🍫', n: 'Coklat' },
];
export const FOOD_MEALS = [
  { e: '🍳', n: 'Telur goreng' }, { e: '🍞', n: 'Roti' }, { e: '🍚', n: 'Nasi' }, { e: '🍜', n: 'Mi' }, { e: '🥣', n: 'Bijirin' },
  { e: '🥛', n: 'Susu' }, { e: '🍗', n: 'Ayam' }, { e: '🥗', n: 'Salad' }, { e: '🍲', n: 'Sup' }, { e: '🧇', n: 'Wafel' },
];

// Urutan aktiviti harian (untuk susun mengikut urutan)
export const ROUTINES = [
  { id: 'pagi', n: 'Rutin pagi', steps: [{ e: '🛏️', n: 'Bangun tidur' }, { e: '🪥', n: 'Gosok gigi' }, { e: '🛁', n: 'Mandi' }, { e: '👕', n: 'Pakai baju' }, { e: '🥣', n: 'Sarapan' }] },
  { id: 'malam', n: 'Rutin tidur', steps: [{ e: '🛁', n: 'Mandi' }, { e: '👕', n: 'Pakai baju tidur' }, { e: '🪥', n: 'Gosok gigi' }, { e: '📖', n: 'Baca buku' }, { e: '😴', n: 'Tidur' }] },
  { id: 'tangan', n: 'Cuci tangan', steps: [{ e: '🚰', n: 'Basahkan tangan' }, { e: '🧼', n: 'Sapu sabun' }, { e: '👐', n: 'Gosok tangan' }, { e: '💦', n: 'Bilas air' }, { e: '🧻', n: 'Lap kering' }] },
  { id: 'makan', n: 'Waktu makan', steps: [{ e: '🧼', n: 'Cuci tangan' }, { e: '🤲', n: 'Baca doa' }, { e: '🍽️', n: 'Makan' }, { e: '🧽', n: 'Kemas pinggan' }] },
  { id: 'hari', n: 'Waktu sehari', steps: [{ e: '🌅', n: 'Pagi' }, { e: '☀️', n: 'Tengah hari' }, { e: '🌇', n: 'Petang' }, { e: '🌙', n: 'Malam' }] },
  { id: 'sekolah', n: 'Ke tadika', steps: [{ e: '👕', n: 'Pakai baju sekolah' }, { e: '🎒', n: 'Bawa beg' }, { e: '🚌', n: 'Naik bas' }, { e: '🏫', n: 'Sampai tadika' }] },
  { id: 'gigi', n: 'Gosok gigi', steps: [{ e: '🪥', n: 'Ambil berus' }, { e: '🧴', n: 'Letak ubat gigi' }, { e: '😁', n: 'Gosok gigi' }, { e: '💦', n: 'Kumur air' }] },
];
export const HYGIENE = [
  { q: 'Tangan kotor. Apa kita perlu buat?', a: { e: '🧼', n: 'Cuci dengan sabun' }, no: [{ e: '🍭', n: 'Makan gula-gula' }, { e: '📺', n: 'Tonton TV' }] },
  { q: 'Selepas makan gula-gula, kita perlu...', a: { e: '🪥', n: 'Gosok gigi' }, no: [{ e: '😴', n: 'Terus tidur' }, { e: '🍬', n: 'Makan lagi' }] },
  { q: 'Badan berpeluh selepas bermain. Kita perlu...', a: { e: '🛁', n: 'Mandi' }, no: [{ e: '🍟', n: 'Makan kentang goreng' }, { e: '🎮', n: 'Main lagi' }] },
  { q: 'Mahu bersin. Kita tutup mulut dengan...', a: { e: '🤧', n: 'Tisu / siku' }, no: [{ e: '✋', n: 'Tangan terbuka' }, { e: '🍽️', n: 'Pinggan' }] },
  { q: 'Sampah selepas makan dibuang ke...', a: { e: '🗑️', n: 'Tong sampah' }, no: [{ e: '🛋️', n: 'Bawah sofa' }, { e: '🌳', n: 'Tepi pokok' }] },
  { q: 'Kuku sudah panjang. Kita perlu...', a: { e: '✂️', n: 'Potong kuku' }, no: [{ e: '🎨', n: 'Mewarna kuku' }, { e: '🙈', n: 'Biarkan' }] },
  { q: 'Sebelum makan, kita perlu...', a: { e: '🧼', n: 'Cuci tangan' }, no: [{ e: '🛏️', n: 'Tidur' }, { e: '🏃', n: 'Berlari' }] },
];
export const TIME_OF_DAY = [
  { q: 'Bila kita bangun tidur?', a: { e: '🌅', n: 'Pagi' } },
  { q: 'Bila kita tidur?', a: { e: '🌙', n: 'Malam' } },
  { q: 'Bila matahari paling terik?', a: { e: '☀️', n: 'Tengah hari' } },
  { q: 'Bila matahari terbenam?', a: { e: '🌇', n: 'Petang' } },
];
export const TIME_OPTS = [{ e: '🌅', n: 'Pagi' }, { e: '☀️', n: 'Tengah hari' }, { e: '🌇', n: 'Petang' }, { e: '🌙', n: 'Malam' }];

// Kategori objek untuk aktiviti mengelaskan
export const CATEGORIES = {
  alattulis: { n: 'Alat tulis', e: '✏️', items: ['✏️', '🖍️', '📏', '✂️', '📒', '🖊️'] },
  mainan: { n: 'Mainan', e: '🧸', items: ['🧸', '🪀', '🪁', '🎲', '🧩', '🪅'] },
  makanan: { n: 'Makanan', e: '🍔', items: ['🍔', '🍕', '🍞', '🍚', '🍜', '🧀'] },
  pakaian: { n: 'Pakaian', e: '👕', items: ['👕', '👖', '👗', '🧦', '🧢', '🧥'] },
  dapur: { n: 'Alat dapur', e: '🍳', items: ['🍳', '🥄', '🍴', '🔪', '🫖', '🥣'], },
  muzik: { n: 'Alat muzik', e: '🎸', items: ['🎸', '🥁', '🎹', '🎺', '🎻', '🪘'] },
  sukan: { n: 'Sukan', e: '⚽', items: ['⚽', '🏀', '🏸', '🏓', '🎾', '🏐'] },
  cuaca: { n: 'Cuaca', e: '🌦️', items: ['☀️', '🌧️', '⛈️', '🌈', '❄️', '🌪️'] },
  bunga: { n: 'Tumbuhan', e: '🌱', items: ['🌱', '🌵', '🌻', '🌷', '🌳', '🍀'] },
};

// Saiz objek (besar/kecil) — nilai relatif
export const SIZED = [
  { e: '🐘', n: 'Gajah', s: 10 }, { e: '🐭', n: 'Tikus', s: 1 }, { e: '🐋', n: 'Ikan paus', s: 10 }, { e: '🐜', n: 'Semut', s: 0 },
  { e: '🦒', n: 'Zirafah', s: 9 }, { e: '🐝', n: 'Lebah', s: 0 }, { e: '🏠', n: 'Rumah', s: 9 }, { e: '🍎', n: 'Epal', s: 2 },
  { e: '🚌', n: 'Bas', s: 9 }, { e: '⚽', n: 'Bola', s: 3 }, { e: '🌳', n: 'Pokok', s: 9 }, { e: '🐞', n: 'Kumbang', s: 0 },
  { e: '🐄', n: 'Lembu', s: 8 }, { e: '🐥', n: 'Anak ayam', s: 1 }, { e: '✈️', n: 'Kapal terbang', s: 10 }, { e: '🍇', n: 'Anggur', s: 1 },
  { e: '🐱', n: 'Kucing', s: 4 }, { e: '🚗', n: 'Kereta', s: 7 }, { e: '🔑', n: 'Kunci', s: 1 }, { e: '🛏️', n: 'Katil', s: 7 },
];

// Objek yang selalu berpasangan (logik)
export const GO_TOGETHER = [
  ['🦷', '🪥'], ['🔒', '🔑'], ['⚽', '🥅'], ['🐝', '🍯'], ['🐰', '🥕'], ['🐒', '🍌'], ['☕', '🫖'], ['🥣', '🥄'],
  ['✏️', '📒'], ['🧦', '👟'], ['🌧️', '☂️'], ['🍳', '🥚'], ['🐶', '🦴'], ['🐱', '🐟'], ['🧠', '📚'], ['🎂', '🕯️'],
  ['🖌️', '🎨'], ['🐄', '🥛'], ['🚗', '⛽'], ['🌱', '🚿'], ['🍞', '🧈'], ['📺', '🎮'], ['🛏️', '🛌'], ['🐼', '🎋'],
];
// Urutan pertumbuhan / proses
export const SEQUENCES = [
  { n: 'Ayam membesar', steps: [{ e: '🥚', n: 'Telur' }, { e: '🐣', n: 'Menetas' }, { e: '🐥', n: 'Anak ayam' }, { e: '🐔', n: 'Ayam' }] },
  { n: 'Pokok membesar', steps: [{ e: '🫘', n: 'Biji benih' }, { e: '🌱', n: 'Anak pokok' }, { e: '🌿', n: 'Pokok kecil' }, { e: '🌳', n: 'Pokok besar' }] },
  { n: 'Rama-rama', steps: [{ e: '🥚', n: 'Telur' }, { e: '🐛', n: 'Ulat' }, { e: '🫛', n: 'Kepompong' }, { e: '🦋', n: 'Rama-rama' }] },
  { n: 'Makan epal', steps: [{ e: '🍎', n: 'Epal' }, { e: '🔪', n: 'Potong' }, { e: '😋', n: 'Makan' }] },
  { n: 'Bulan', steps: [{ e: '🌑', n: 'Gelap' }, { e: '🌒', n: 'Sabit' }, { e: '🌓', n: 'Separuh' }, { e: '🌕', n: 'Purnama' }] },
  { n: 'Membina manusia salji', steps: [{ e: '❄️', n: 'Salji turun' }, { e: '⚪', n: 'Gulung salji' }, { e: '⛄', n: 'Manusia salji' }] },
  { n: 'Bunga berkembang', steps: [{ e: '🌱', n: 'Tunas' }, { e: '🥀', n: 'Kudup', skip: true }, { e: '🌷', n: 'Kudup' }, { e: '🌸', n: 'Bunga kembang' }].filter((s) => !s.skip) },
  { n: 'Membuat kek', steps: [{ e: '🥚', n: 'Bahan' }, { e: '🥣', n: 'Gaul' }, { e: '♨️', n: 'Bakar' }, { e: '🎂', n: 'Kek siap' }] },
];
// Teka-teki mudah
export const RIDDLES = [
  { q: 'Saya kuning dan panjang. Monyet suka makan saya. Siapa saya?', a: '🍌', no: ['🍎', '🍇', '🥕'] },
  { q: 'Saya bersinar di waktu siang. Siapa saya?', a: '☀️', no: ['🌙', '⭐', '☁️'] },
  { q: 'Saya ada belalai yang panjang. Siapa saya?', a: '🐘', no: ['🦒', '🐴', '🐄'] },
  { q: 'Saya berenang di dalam air dan ada sirip. Siapa saya?', a: '🐟', no: ['🐦', '🐱', '🐢'] },
  { q: 'Saya melindungi kamu daripada hujan. Apa saya?', a: '☂️', no: ['🕶️', '🧢', '👟'] },
  { q: 'Saya ada empat roda dan membawa ramai orang ke sekolah. Apa saya?', a: '🚌', no: ['🚲', '✈️', '⛵'] },
  { q: 'Saya terbang dan membuat madu. Siapa saya?', a: '🐝', no: ['🦋', '🐦', '🦟'] },
  { q: 'Saya digunakan untuk menulis. Apa saya?', a: '✏️', no: ['🥄', '🔑', '🧸'] },
  { q: 'Saya berbunyi "kukuruyuk" pada waktu pagi. Siapa saya?', a: '🐓', no: ['🐱', '🐶', '🦆'] },
  { q: 'Saya sejuk dan manis. Saya cair jika panas. Apa saya?', a: '🍦', no: ['🍞', '🍚', '🥚'] },
  { q: 'Saya muncul di langit selepas hujan dan berwarna-warni. Apa saya?', a: '🌈', no: ['⚡', '🌙', '☁️'] },
  { q: 'Saya ada leher yang sangat panjang. Siapa saya?', a: '🦒', no: ['🐘', '🦁', '🐻'] },
  { q: 'Kamu pakai saya di kaki sebelum keluar rumah. Apa saya?', a: '👟', no: ['🧢', '🧤', '👓'] },
  { q: 'Saya bulat dan kamu sepak saya. Apa saya?', a: '⚽', no: ['🎲', '📦', '🪁'] },
  { q: 'Saya menunjukkan masa. Apa saya?', a: '⏰', no: ['📱', '💡', '📺'] },
  { q: 'Saya hijau dan suka melompat. Saya berbunyi "kuak kuak". Siapa saya?', a: '🐸', no: ['🐢', '🐍', '🐊'] },
  { q: 'Saya membantu kamu melihat dalam gelap. Apa saya?', a: '🔦', no: ['🔑', '✂️', '🧸'] },
  { q: 'Saya berbulu putih dan memberikan bulu untuk baju. Siapa saya?', a: '🐑', no: ['🐄', '🐐', '🐖'] },
];
// Masalah mudah / pilih yang sesuai
export const PROBLEMS = [
  { q: 'Hari gelap. Apa yang kita perlukan?', a: '💡', no: ['🧊', '🍦', '⚽'] },
  { q: 'Kamu dahaga. Apa yang kamu minum?', a: '💧', no: ['🍞', '🧸', '🪥'] },
  { q: 'Pokok bunga layu. Apa yang ia perlukan?', a: '🚿', no: ['🍔', '📺', '🧦'] },
  { q: 'Kawan terjatuh dan menangis. Apa kita buat?', a: '🤗', no: ['😂', '🏃', '🙈'] },
  { q: 'Mainan bersepah di lantai. Kita simpan dalam...', a: '🧺', no: ['🍳', '🚽', '🛁'] },
  { q: 'Mahu potong kertas. Kita guna...', a: '✂️', no: ['🥄', '🪥', '🔑'] },
  { q: 'Kucing lapar. Kita beri...', a: '🐟', no: ['🥕', '🌽', '🍌'] },
  { q: 'Mahu buka pintu yang berkunci. Kita perlukan...', a: '🔑', no: ['✏️', '🧽', '🧢'] },
  { q: 'Hari panas terik. Apa yang kita pakai?', a: '🧢', no: ['🧣', '🧤', '🧥'] },
  { q: 'Mahu melukis gambar. Kita perlukan...', a: '🖍️', no: ['🍴', '🔨', '🧹'] },
  { q: 'Rambut kusut. Kita guna...', a: '🪮', no: ['🥄', '🪥', '✏️'] },
  { q: 'Lantai kotor. Kita guna...', a: '🧹', no: ['🎸', '📖', '🍩'] },
];

// ================== BUNYI ==================
// Bunyi disintesis oleh enjin audio (lihat audio.js) + sebutan bunyi (ono).
export const SOUNDS = [
  { id: 'kucing', e: '🐱', n: 'Kucing', cat: 'haiwan', ono: 'Ngiau, ngiau!' },
  { id: 'anjing', e: '🐶', n: 'Anjing', cat: 'haiwan', ono: 'Gong, gong!' },
  { id: 'lembu', e: '🐄', n: 'Lembu', cat: 'haiwan', ono: 'Mooo!' },
  { id: 'kambing', e: '🐐', n: 'Kambing', cat: 'haiwan', ono: 'Mbeee!' },
  { id: 'biri', e: '🐑', n: 'Biri-biri', cat: 'haiwan', ono: 'Beee!' },
  { id: 'ayam', e: '🐓', n: 'Ayam jantan', cat: 'haiwan', ono: 'Kukuruyuk!' },
  { id: 'itik', e: '🦆', n: 'Itik', cat: 'haiwan', ono: 'Kuek, kuek!' },
  { id: 'kuda', e: '🐴', n: 'Kuda', cat: 'haiwan', ono: 'Hiii hi hi!' },
  { id: 'singa', e: '🦁', n: 'Singa', cat: 'haiwan', ono: 'Aummm!' },
  { id: 'katak', e: '🐸', n: 'Katak', cat: 'haiwan', ono: 'Kuak, kuak!' },
  { id: 'burung', e: '🐦', n: 'Burung', cat: 'haiwan', ono: 'Cip, cip, cip!' },
  { id: 'burunghantu', e: '🦉', n: 'Burung hantu', cat: 'haiwan', ono: 'Hu, hu!' },
  { id: 'lebah', e: '🐝', n: 'Lebah', cat: 'haiwan', ono: 'Bzzzz!' },
  { id: 'gajah', e: '🐘', n: 'Gajah', cat: 'haiwan', ono: 'Pruuuut!' },
  { id: 'monyet', e: '🐒', n: 'Monyet', cat: 'haiwan', ono: 'Uk uk ak ak!' },
  { id: 'kereta', e: '🚗', n: 'Hon kereta', cat: 'kenderaan', ono: 'Pon, pon!' },
  { id: 'ambulans', e: '🚑', n: 'Ambulans', cat: 'kenderaan', ono: 'Niu, niu, niu!' },
  { id: 'polis', e: '🚓', n: 'Kereta polis', cat: 'kenderaan', ono: 'Wiu, wiu!' },
  { id: 'bomba', e: '🚒', n: 'Kereta bomba', cat: 'kenderaan', ono: 'Ting, ting, ting!' },
  { id: 'keretaapi', e: '🚂', n: 'Kereta api', cat: 'kenderaan', ono: 'Cuu, cuu! Cik, cik, cik!' },
  { id: 'kapalterbang', e: '✈️', n: 'Kapal terbang', cat: 'kenderaan', ono: 'Wuuuush!' },
  { id: 'helikopter', e: '🚁', n: 'Helikopter', cat: 'kenderaan', ono: 'Pak, pak, pak!' },
  { id: 'motosikal', e: '🏍️', n: 'Motosikal', cat: 'kenderaan', ono: 'Vrooom!' },
  { id: 'basikal', e: '🚲', n: 'Loceng basikal', cat: 'kenderaan', ono: 'Kring, kring!' },
  { id: 'kapal', e: '🛳️', n: 'Hon kapal', cat: 'kenderaan', ono: 'Buuuu!' },
  { id: 'hujan', e: '🌧️', n: 'Hujan', cat: 'alam', ono: 'Rintik, rintik...' },
  { id: 'guruh', e: '⛈️', n: 'Guruh', cat: 'alam', ono: 'Dum, dum!' },
  { id: 'angin', e: '🌬️', n: 'Angin', cat: 'alam', ono: 'Wuuu...' },
  { id: 'ombak', e: '🌊', n: 'Ombak', cat: 'alam', ono: 'Syuuu, syuuu...' },
  { id: 'jam', e: '⏰', n: 'Jam', cat: 'rumah', ono: 'Tik, tok, tik, tok!' },
  { id: 'loceng', e: '🔔', n: 'Loceng pintu', cat: 'rumah', ono: 'Ding, dong!' },
  { id: 'telefon', e: '☎️', n: 'Telefon', cat: 'rumah', ono: 'Kring, kring!' },
  { id: 'dram', e: '🥁', n: 'Dram', cat: 'rumah', ono: 'Dum, dum, tak!' },
  { id: 'tepuk', e: '👏', n: 'Tepuk tangan', cat: 'rumah', ono: 'Prok, prok, prok!' },
  { id: 'wisel', e: '📯', n: 'Wisel', cat: 'rumah', ono: 'Priiit!' },
];
export const SOUND_CATS = { haiwan: 'Bunyi haiwan', kenderaan: 'Bunyi kenderaan', alam: 'Bunyi alam', rumah: 'Bunyi di sekeliling' };

// ================== GAMBAR UNTUK PUZZLE ==================
export const PUZZLE_PICS = [
  { n: 'Kucing di taman', bg: ['#bde0fe', '#caffbf'], main: '🐱', deco: ['🌸', '🌼', '☀️', '🦋'] },
  { n: 'Ikan di laut', bg: ['#90e0ef', '#0096c7'], main: '🐠', deco: ['🫧', '🐚', '🪸', '🐟'] },
  { n: 'Roket di angkasa', bg: ['#3a0ca3', '#7209b7'], main: '🚀', deco: ['⭐', '🌙', '🪐', '✨'] },
  { n: 'Arnab di ladang', bg: ['#fff3b0', '#9ef01a'], main: '🐰', deco: ['🥕', '🌻', '☁️', '🌾'] },
  { n: 'Gajah di hutan', bg: ['#d8f3dc', '#52b788'], main: '🐘', deco: ['🌳', '🍌', '🦜', '☀️'] },
  { n: 'Kereta di bandar', bg: ['#ffd6a5', '#adb5bd'], main: '🚗', deco: ['🏢', '🚦', '☁️', '🌳'] },
  { n: 'Panda makan buluh', bg: ['#e9f5db', '#95d5b2'], main: '🐼', deco: ['🎋', '🍃', '☁️', '🌸'] },
  { n: 'Dinosaur comel', bg: ['#fde68a', '#f4a261'], main: '🦖', deco: ['🌋', '🌴', '🥚', '☁️'] },
  { n: 'Rumah saya', bg: ['#a2d2ff', '#b7e4c7'], main: '🏠', deco: ['🌳', '☀️', '🌷', '🐦'] },
  { n: 'Kapal di laut', bg: ['#caf0f8', '#48cae4'], main: '⛵', deco: ['☀️', '🐬', '☁️', '🌊'] },
  { n: 'Kek hari jadi', bg: ['#ffc8dd', '#ffafcc'], main: '🎂', deco: ['🎈', '🎁', '🎉', '⭐'] },
  { n: 'Penguin di kutub', bg: ['#e0fbfc', '#98c1d9'], main: '🐧', deco: ['❄️', '🧊', '⛄', '☁️'] },
  { n: 'Singa raja hutan', bg: ['#ffe8a3', '#f4a259'], main: '🦁', deco: ['🌳', '☀️', '🌾', '🦋'] },
  { n: 'Pelangi ceria', bg: ['#e0c3fc', '#8ec5fc'], main: '🌈', deco: ['☁️', '☀️', '🦄', '✨'] },
  { n: 'Lebah dan bunga', bg: ['#fff1c1', '#ffd166'], main: '🐝', deco: ['🌻', '🌼', '🍯', '🌷'] },
  { n: 'Kura-kura berenang', bg: ['#b5ead7', '#00b4d8'], main: '🐢', deco: ['🫧', '🐟', '🪸', '🐚'] },
];

// ================== SI CILIK SOLEH ==================
// Kandungan disusun berdasarkan sukatan Pendidikan Islam prasekolah (KSPK) yang lazim di Malaysia.
// Doa harian hanya menggunakan lafaz yang diriwayatkan dalam hadis sahih / ayat al-Quran,
// beserta rujukan sumber. Tiada doa direka.
export const HIJAIYAH = [
  { a: 'ا', n: 'Alif' }, { a: 'ب', n: 'Ba' }, { a: 'ت', n: 'Ta' }, { a: 'ث', n: 'Tsa' }, { a: 'ج', n: 'Jim' },
  { a: 'ح', n: 'Ha' }, { a: 'خ', n: 'Kho' }, { a: 'د', n: 'Dal' }, { a: 'ذ', n: 'Dzal' }, { a: 'ر', n: 'Ro' },
  { a: 'ز', n: 'Zai' }, { a: 'س', n: 'Sin' }, { a: 'ش', n: 'Syin' }, { a: 'ص', n: 'Sod' }, { a: 'ض', n: 'Dhod' },
  { a: 'ط', n: 'Tho' }, { a: 'ظ', n: 'Zho' }, { a: 'ع', n: 'Ain' }, { a: 'غ', n: 'Ghain' }, { a: 'ف', n: 'Fa' },
  { a: 'ق', n: 'Qof' }, { a: 'ك', n: 'Kaf' }, { a: 'ل', n: 'Lam' }, { a: 'م', n: 'Mim' }, { a: 'ن', n: 'Nun' },
  { a: 'و', n: 'Wau' }, { a: 'ه', n: 'Ha (simpul)' }, { a: 'ء', n: 'Hamzah' }, { a: 'ي', n: 'Ya' },
];
// 25 nabi dan rasul yang wajib diketahui, mengikut urutan
export const NABI = ['Adam', 'Idris', 'Nuh', 'Hud', 'Soleh', 'Ibrahim', 'Lut', 'Ismail', 'Ishak', 'Yaakub', 'Yusuf', 'Ayub', 'Syuaib',
  'Musa', 'Harun', 'Zulkifli', 'Daud', 'Sulaiman', 'Ilyas', 'Ilyasa', 'Yunus', 'Zakaria', 'Yahya', 'Isa', 'Muhammad'];
export const RUKUN_ISLAM = [
  { e: '☝️', n: 'Mengucap dua kalimah syahadah' },
  { e: '🕌', n: 'Menunaikan solat lima waktu' },
  { e: '🌙', n: 'Berpuasa pada bulan Ramadan' },
  { e: '🤲', n: 'Menunaikan zakat' },
  { e: '🕋', n: 'Menunaikan haji bagi yang mampu' },
];
export const RUKUN_IMAN = [
  { e: '☝️', n: 'Beriman kepada Allah' },
  { e: '✨', n: 'Beriman kepada malaikat' },
  { e: '📖', n: 'Beriman kepada kitab-kitab' },
  { e: '👳', n: 'Beriman kepada rasul-rasul' },
  { e: '🌅', n: 'Beriman kepada hari akhirat' },
  { e: '⚖️', n: "Beriman kepada qada' dan qadar" },
];
// Anggota wuduk (fardu) mengikut tertib
export const WUDUK = [
  { e: '😊', n: 'Membasuh muka (dengan niat)' },
  { e: '💪', n: 'Membasuh kedua-dua tangan hingga siku' },
  { e: '🙆', n: 'Menyapu sebahagian kepala' },
  { e: '🦶', n: 'Membasuh kedua-dua kaki hingga buku lali' },
];
export const WUDUK_PARTS = [
  { e: '😊', n: 'Muka', yes: true }, { e: '💪', n: 'Tangan hingga siku', yes: true }, { e: '🙆', n: 'Kepala', yes: true },
  { e: '🦶', n: 'Kaki hingga buku lali', yes: true }, { e: '🎒', n: 'Beg sekolah', yes: false }, { e: '👕', n: 'Baju', yes: false },
  { e: '🧸', n: 'Anak patung', yes: false }, { e: '👟', n: 'Kasut', yes: false },
];
export const ADAB = [
  { q: 'Kita makan dengan tangan...', a: { e: '🫱', n: 'Kanan' }, no: [{ e: '🫲', n: 'Kiri' }] },
  { q: 'Apabila berjumpa kawan, kita memberi...', a: { e: '👋', n: 'Salam' }, no: [{ e: '😠', n: 'Marah' }, { e: '🙈', n: 'Lari' }] },
  { q: 'Apabila menerima hadiah, kita ucapkan...', a: { e: '🙏', n: 'Terima kasih' }, no: [{ e: '😝', n: 'Ejek' }, { e: '🤐', n: 'Diam sahaja' }] },
  { q: 'Sebelum masuk bilik orang, kita...', a: { e: '🚪', n: 'Ketuk dan minta izin' }, no: [{ e: '🏃', n: 'Terus masuk' }] },
  { q: 'Apabila bercakap dengan ibu bapa, kita...', a: { e: '😊', n: 'Bercakap dengan sopan' }, no: [{ e: '😤', n: 'Menjerit' }] },
  { q: 'Sebelum makan, kita membaca...', a: { e: '🤲', n: 'Bismillah' }, no: [{ e: '🎵', n: 'Lagu' }, { e: '📺', n: 'Tonton TV' }] },
  { q: 'Selepas makan, kita mengucap...', a: { e: '🤲', n: 'Alhamdulillah' }, no: [{ e: '😴', n: 'Terus tidur' }] },
  { q: 'Apabila bersalah, kita ucapkan...', a: { e: '🙇', n: 'Minta maaf' }, no: [{ e: '😛', n: 'Jelir lidah' }] },
  { q: 'Apabila kawan bersin dan berkata Alhamdulillah, kita jawab...', a: { e: '🤲', n: 'Yarhamukallah' }, no: [{ e: '🤣', n: 'Ketawa' }] },
  { q: 'Masuk ke rumah, kita mulakan dengan kaki...', a: { e: '🦶', n: 'Kanan' }, no: [{ e: '🦶', n: 'Kiri' }], keyed: true },
  { q: 'Masuk ke tandas, kita mulakan dengan kaki...', a: { e: '🦶', n: 'Kiri' }, no: [{ e: '🦶', n: 'Kanan' }], keyed: true },
  { q: 'Apabila orang tua bercakap, kita...', a: { e: '👂', n: 'Mendengar' }, no: [{ e: '🗣️', n: 'Menyampuk' }] },
];
export const DOA = [
  { id: 'bismillah', sit: 'Sebelum memulakan sesuatu / sebelum makan', e: '🍽️', ar: 'بِسْمِ اللّٰهِ', rumi: 'Bismillah', makna: 'Dengan nama Allah', src: 'Hadis riwayat Abu Daud & at-Tirmizi' },
  { id: 'lepasmakan', sit: 'Selepas makan', e: '😋', ar: 'اَلْحَمْدُ لِلّٰهِ', rumi: 'Alhamdulillah', makna: 'Segala puji bagi Allah', src: 'Hadis riwayat Muslim' },
  { id: 'tidur', sit: 'Sebelum tidur', e: '😴', ar: 'بِاسْمِكَ اللّٰهُمَّ أَمُوْتُ وَأَحْيَا', rumi: 'Bismikallahumma amutu wa ahya', makna: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup', src: 'Hadis riwayat al-Bukhari' },
  { id: 'bangun', sit: 'Bangun tidur', e: '🌅', ar: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ', rumi: "Alhamdulillahil-lazi ahyana ba'da ma amatana wa ilaihin-nusyur", makna: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali', src: 'Hadis riwayat al-Bukhari' },
  { id: 'masuktandas', sit: 'Masuk tandas', e: '🚽', ar: 'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', rumi: "Allahumma inni a'uzu bika minal khubuthi wal khaba'ith", makna: 'Ya Allah, aku berlindung kepada-Mu daripada syaitan lelaki dan perempuan', src: 'Hadis riwayat al-Bukhari & Muslim' },
  { id: 'keluartandas', sit: 'Keluar tandas', e: '🚪', ar: 'غُفْرَانَكَ', rumi: 'Ghufranaka', makna: 'Aku memohon keampunan-Mu', src: 'Hadis riwayat Abu Daud & at-Tirmizi' },
  { id: 'ilmu', sit: 'Sebelum belajar', e: '📚', ar: 'رَبِّ زِدْنِيْ عِلْمًا', rumi: "Rabbi zidni 'ilma", makna: 'Wahai Tuhanku, tambahkanlah ilmuku', src: 'Surah Taha, ayat 114' },
  { id: 'ibubapa', sit: 'Doa untuk ibu bapa', e: '👨‍👩‍👧', ar: 'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ', rumi: 'Rabbighfir li wa liwalidayya', makna: 'Wahai Tuhanku, ampunkanlah aku dan kedua ibu bapaku', src: 'Surah Nuh, ayat 28' },
  { id: 'keluarrumah', sit: 'Keluar rumah', e: '🏡', ar: 'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', rumi: "Bismillahi tawakkaltu 'alallah, la haula wa la quwwata illa billah", makna: 'Dengan nama Allah, aku bertawakal kepada Allah; tiada daya dan kekuatan melainkan dengan Allah', src: 'Hadis riwayat Abu Daud & at-Tirmizi' },
  { id: 'bersin', sit: 'Selepas bersin', e: '🤧', ar: 'اَلْحَمْدُ لِلّٰهِ', rumi: 'Alhamdulillah', makna: 'Segala puji bagi Allah', src: 'Hadis riwayat al-Bukhari', dupOf: 'lepasmakan' },
];

// ================== MISI PENGEMBARAAN ==================
export const WORLDS = [
  { id: 'hutan', n: 'Hutan', e: '🌳', bg: ['#d8f3dc', '#74c69d'], hero: '🐰', heroN: 'Coco', goal: '🏡', items: ['🍄', '🍌', '🌰', '🍓'], deco: ['🌳', '🌲', '🌿', '🦜', '🐒', '🦋', '🌺', '🐿️'], friends: ['🐒', '🦜', '🐿️', '🐻'], obstacle: '🪨' },
  { id: 'laut', n: 'Laut', e: '🌊', bg: ['#caf0f8', '#0096c7'], hero: '🐢', heroN: 'Kura-kura', goal: '🪸', items: ['🐚', '⭐', '🦪', '🫧'], deco: ['🐟', '🐠', '🐡', '🦀', '🐙', '🪸', '🐬', '🦑'], friends: ['🐟', '🐙', '🦀', '🐬'], obstacle: '🪨' },
  { id: 'angkasa', n: 'Angkasa', e: '🚀', bg: ['#240046', '#5a189a'], hero: '🚀', heroN: 'Roket Dino', goal: '🪐', items: ['⭐', '🌙', '☄️', '💎'], deco: ['✨', '🌍', '🛰️', '👽', '🌟', '🌕', '🪐', '☄️'], friends: ['👽', '🤖', '🛸', '👨‍🚀'], obstacle: '☄️' },
  { id: 'ladang', n: 'Ladang', e: '🌾', bg: ['#fff3b0', '#b5e48c'], hero: '🐱', heroN: 'Mimi', goal: '🏠', items: ['🥕', '🥚', '🌽', '🍎'], deco: ['🐄', '🐔', '🐑', '🚜', '🌻', '🌾', '🐖', '🐐'], friends: ['🐄', '🐔', '🐑', '🐴'], obstacle: '🪵' },
];

// ================== KARAKTER, AVATAR & KOSTUM ==================
export const CHARACTERS = [
  { id: 'mimi', e: '🐱', n: 'Mimi si Kucing' },
  { id: 'bobo', e: '🐻', n: 'Bobo si Beruang' },
  { id: 'coco', e: '🐰', n: 'Coco si Arnab' },
  { id: 'dino', e: '🦖', n: 'Dino si Dinosaur' },
  { id: 'lala', e: '🐼', n: 'Lala si Panda' },
];
export const AVATARS = [
  { id: 'mimi', e: '🐱', n: 'Mimi', cost: 0 }, { id: 'bobo', e: '🐻', n: 'Bobo', cost: 0 }, { id: 'coco', e: '🐰', n: 'Coco', cost: 0 },
  { id: 'dino', e: '🦖', n: 'Dino', cost: 0 }, { id: 'lala', e: '🐼', n: 'Lala', cost: 0 },
  { id: 'fox', e: '🦊', n: 'Musang', cost: 60 }, { id: 'koala', e: '🐨', n: 'Koala', cost: 60 }, { id: 'frog', e: '🐸', n: 'Katak', cost: 60 },
  { id: 'lion', e: '🦁', n: 'Singa', cost: 90 }, { id: 'unicorn', e: '🦄', n: 'Unikorn', cost: 120 }, { id: 'owl', e: '🦉', n: 'Burung hantu', cost: 90 },
  { id: 'penguin', e: '🐧', n: 'Penguin', cost: 90 }, { id: 'tiger', e: '🐯', n: 'Harimau', cost: 120 }, { id: 'monkey', e: '🐵', n: 'Monyet', cost: 90 },
  { id: 'octopus', e: '🐙', n: 'Gurita', cost: 150 }, { id: 'dragon', e: '🐲', n: 'Naga comel', cost: 200 },
];
export const COSTUMES = [
  { id: 'none', e: '', n: 'Tiada', slot: 'hat', cost: 0 },
  { id: 'cap', e: '🧢', n: 'Topi', slot: 'hat', cost: 40 }, { id: 'crown', e: '👑', n: 'Mahkota', slot: 'hat', cost: 150 },
  { id: 'tophat', e: '🎩', n: 'Topi tinggi', slot: 'hat', cost: 80 }, { id: 'party', e: '🥳', n: 'Topi parti', slot: 'hat', cost: 60, show: '🎉' },
  { id: 'bow', e: '🎀', n: 'Reben', slot: 'hat', cost: 50 }, { id: 'grad', e: '🎓', n: 'Topi graduasi', slot: 'hat', cost: 200 },
  { id: 'flower', e: '🌸', n: 'Bunga', slot: 'hat', cost: 40 }, { id: 'helmet', e: '⛑️', n: 'Topi keledar', slot: 'hat', cost: 80 },
  { id: 'anone', e: '', n: 'Tiada', slot: 'acc', cost: 0 },
  { id: 'glasses', e: '👓', n: 'Cermin mata', slot: 'acc', cost: 50 }, { id: 'sun', e: '🕶️', n: 'Cermin mata hitam', slot: 'acc', cost: 70 },
  { id: 'balloon', e: '🎈', n: 'Belon', slot: 'acc', cost: 30 }, { id: 'star', e: '⭐', n: 'Bintang', slot: 'acc', cost: 40 },
  { id: 'medal', e: '🏅', n: 'Pingat', slot: 'acc', cost: 120 }, { id: 'heart', e: '💖', n: 'Hati', slot: 'acc', cost: 40 },
];
export const STICKERS = ['🦄', '🌈', '🍭', '🚀', '🦕', '🐳', '🌻', '🍩', '🎠', '🦜', '🍉', '🧸', '🐞', '🌟', '🎨', '🦩', '🐬', '🍀', '🪁', '🎡',
  '🐙', '🍓', '🦔', '🌵', '🧁', '🐠', '🦋', '🍕', '🛸', '🏰', '🐲', '🎪', '🥥', '🐿️', '🦚', '🍿', '🎺', '🌋', '⛄', '🐨',
  '🍒', '🚂', '🦒', '🎃', '🌙', '🐢', '🍪', '🛶', '🐼', '🎁'];

// ================== UCAPAN KARAKTER ==================
export const PRAISE = ['Bagus!', 'Hebat!', 'Pandai!', 'Syabas!', 'Bijak!', 'Betul!', 'Wah, hebatnya!', 'Kamu semakin bijak!', 'Cemerlang!', 'Tahniah!'];
export const ENCOURAGE = ['Bagus, cuba sekali lagi!', 'Tidak mengapa, kita cuba sama-sama!', 'Hampir betul! Cuba lagi.', 'Jangan risau, cuba lagi ya!', 'Kamu boleh! Cuba lagi.'];
