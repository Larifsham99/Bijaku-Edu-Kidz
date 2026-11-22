// =====================================================================
//  CILIK RACING — data dunia, kereta & hiasan (data tulen, tiada DOM)
// =====================================================================

// far: jenis latar jauh; side: hiasan tepi jalan [jenis, berat]; obs: halangan
export const RC_WORLDS = [
  {
    id: 'kampung', n: 'Litar Kampung', tag: 'Rumah kampung, sawah & pokok kelapa',
    sky: ['#6ec3ff', '#dff4ff'], sun: '#fff3b0', grass: ['#86d06a', '#76c35b'], road: ['#c79a6b', '#bd8f60'], edge: '#e9cf9f',
    rumble: ['#fff6e6', '#e2553f'], lane: '#fff6e6', fog: '#cfeeff', hill: ['#a7dc8b', '#8fcf74'], far: 'sawah',
    side: [['kelapa', 4], ['rumah', 2], ['padi', 3], ['ayam', 1], ['gerai', 1], ['masjid', 0.4], ['bungaraya', 2]],
    obs: 'jerami', bridge: true, tunnel: false, float: false,
    topics: ['huruf', 'awal', 'nombor', 'kira', 'warna', 'eja', 'adab'],
    music: { bpm: 112, root: 262 }, accent: '#e2553f', host: '🐔',
  },
  {
    id: 'buah', n: 'Lembah Buah', tag: 'Tembikai, pisang, strawberi & sungai jus',
    sky: ['#7fd3ff', '#fff2e0'], sun: '#ffe08a', grass: ['#9be07a', '#8ad46a'], road: ['#f6c27a', '#efb76c'], edge: '#ffe2ae',
    rumble: ['#ffffff', '#ff6f91'], lane: '#fff', fog: '#ffeedd', hill: ['#b8ea8f', '#a1de7c'], far: 'buahan',
    side: [['tembikai', 2], ['pokokpisang', 3], ['strawberi', 2], ['pokokepal', 3], ['anggur', 2], ['bungaraya', 1]],
    obs: 'peti', bridge: true, tunnel: false, float: false,
    topics: ['buah', 'warna', 'kira', 'besar', 'kategori', 'tambah', 'padan'],
    music: { bpm: 120, root: 294 }, accent: '#ff6f91', host: '🍓',
  },
  {
    id: 'hutan', n: 'Hutan Haiwan', tag: 'Gajah, monyet, air terjun & jambatan',
    sky: ['#58c2a8', '#d4f6e6'], sun: '#fff7c2', grass: ['#3fa865', '#369a5a'], road: ['#a77b52', '#9b7049'], edge: '#d1b27c',
    rumble: ['#fff2c4', '#2f9e6a'], lane: '#fff2c4', fog: '#bfe9d6', hill: ['#46a86a', '#34905a'], far: 'hutan',
    side: [['pokokhutan', 4], ['paku', 3], ['gajah', 1], ['monyet', 1.4], ['bungaraya', 1]],
    obs: 'balak', bridge: true, tunnel: true, float: false,
    topics: ['haiwan', 'habitat', 'bunyi', 'makanan', 'anak', 'kira'],
    music: { bpm: 108, root: 220 }, accent: '#2f9e6a', host: '🐒',
  },
  {
    id: 'bandar', n: 'Bandar Warna', tag: 'Bangunan mainan, lampu isyarat & jalan pelangi',
    sky: ['#8fd6ff', '#f2e9ff'], sun: '#fff2a8', grass: ['#9fe3b0', '#8fd8a2'], road: ['#6f7a96', '#677190'], edge: '#d9def0',
    rumble: ['#ffffff', '#2e5aac'], lane: '#ffe066', fog: '#e9e6ff', hill: ['#c9d8ff', '#b4c6f6'], far: 'bandar',
    side: [['bangunan', 4], ['lampuisyarat', 1.4], ['pokokbulat', 3], ['belon', 0.8]],
    obs: 'kon', bridge: false, tunnel: true, float: false, rainbow: true,
    topics: ['warna', 'bentuk', 'padan', 'corak', 'nombor'],
    music: { bpm: 124, root: 330 }, accent: '#2e5aac', host: '🚦',
  },
  {
    id: 'dino', n: 'Taman Dinosaur', tag: 'Dinosaur comel, telur & gunung berapi',
    sky: ['#ffb37a', '#ffe9c7'], sun: '#fff0a0', grass: ['#9acb5a', '#8cbd4e'], road: ['#b78a5e', '#ab7f55'], edge: '#e6c08e',
    rumble: ['#fff1d0', '#e87d2c'], lane: '#fff1d0', fog: '#ffe2c2', hill: ['#c99a6b', '#b8895b'], far: 'gunungapi',
    side: [['dino', 1.6], ['pakis', 4], ['telur', 1.4], ['batu', 2]],
    obs: 'batu', bridge: false, tunnel: false, float: false,
    topics: ['besar', 'urutan', 'kategori', 'memori', 'nombor', 'ganjil'],
    music: { bpm: 104, root: 196 }, accent: '#e87d2c', host: '🦕',
  },
  {
    id: 'laut', n: 'Pulau Ombak', tag: 'Pantai, penyu, batu karang & rumah api',
    sky: ['#5ccaff', '#e6fbff'], sun: '#fff7c9', grass: ['#f6e0a4', '#efd593'], road: ['#7a8aa6', '#73829d'], edge: '#fff4d1',
    rumble: ['#ffffff', '#00a7c7'], lane: '#fff', fog: '#d4f5ff', hill: ['#47c2e0', '#2fb0d3'], far: 'lautan',
    side: [['kelapa', 3], ['payung', 2], ['rumahapi', 0.6], ['penyu', 1.2], ['karang', 2.2]],
    obs: 'pelampung', bridge: true, tunnel: false, float: false, water: true,
    topics: ['habitat', 'warna', 'bentuk', 'kira', 'haiwan', 'kenderaan'],
    music: { bpm: 116, root: 247 }, accent: '#00a7c7', host: '🐢',
  },
  {
    id: 'angkasa', n: 'Angkasa Ria', tag: 'Planet, bulan, bintang & UFO comel',
    sky: ['#120b3a', '#3b2c8f'], sun: '#fff', grass: ['#2a1f6b', '#251b60'], road: ['#4a4f8a', '#434880'], edge: '#9aa6ff',
    rumble: ['#ffffff', '#ff5fc8'], lane: '#7ff3ff', fog: '#3b2c8f', hill: ['#4a3aa8', '#3a2d90'], far: 'angkasa',
    side: [['planet', 2], ['roket', 1], ['ufo', 1], ['kristal', 2.4]],
    obs: 'asteroid', bridge: false, tunnel: true, float: true, night: true,
    topics: ['bentuk', 'nombor', 'corak', 'urutan', 'angkasa', 'tambah'],
    music: { bpm: 100, root: 220 }, accent: '#ff5fc8', host: '👽',
  },
  {
    id: 'gula', n: 'Negeri Gula-gula', tag: 'Lolipop, donat, coklat & biskut',
    sky: ['#ffb6e1', '#fff0fa'], sun: '#fff', grass: ['#ffd1ea', '#ffc4e2'], road: ['#8a5a44', '#7f513c'], edge: '#ffe9c9',
    rumble: ['#ffffff', '#ff5fa2'], lane: '#fff', fog: '#ffe3f3', hill: ['#a8714f', '#946043'], far: 'coklat',
    side: [['lolipop', 3], ['tongkat', 2], ['donat', 2], ['kekcawan', 2]],
    obs: 'jeli', bridge: false, tunnel: true, float: false,
    topics: ['kira', 'padan', 'warna', 'bentuk', 'ganjil', 'sihat'],
    music: { bpm: 126, root: 349 }, accent: '#ff5fa2', host: '🧁',
  },
  {
    id: 'bina', n: 'Tapak Binaan Cilik', tag: 'Kren, jengkaut, kon & papan tanda',
    sky: ['#8cc9ff', '#fff4d6'], sun: '#ffe58a', grass: ['#d8b479', '#cda86d'], road: ['#5f6470', '#585d68'], edge: '#ffd23a',
    rumble: ['#ffd23a', '#2b2b2b'], lane: '#ffd23a', fog: '#f3e7cf', hill: ['#c79f68', '#b88f5a'], far: 'binaan',
    side: [['kren', 1], ['jengkaut', 1.2], ['bata', 2], ['papantanda', 2], ['pokokbulat', 1.5]],
    obs: 'penghadang', bridge: false, tunnel: true, float: false,
    topics: ['kenderaan', 'fungsi', 'bentuk', 'besar', 'urutan', 'tolak'],
    music: { bpm: 118, root: 262 }, accent: '#f2a922', host: '👷',
  },
  {
    id: 'juara', n: 'Pulau Juara', tag: 'Pulau terapung, stadium & gunung trofi',
    sky: ['#7a6cff', '#ffd9f0'], sun: '#fff5b8', grass: ['#8be0a8', '#7ad497'], road: ['#5c4bb8', '#5444ab'], edge: '#ffe066',
    rumble: ['#ffe066', '#ff5f7a'], lane: '#ffe066', fog: '#f4d9ff', hill: ['#a99bff', '#9585f5'], far: 'pulau',
    side: [['belon', 2], ['bendera', 3], ['trofi', 1], ['bintangbesar', 1.4]],
    obs: 'penghadang', bridge: false, tunnel: false, float: true, rainbow: true,
    topics: ['huruf', 'nombor', 'warna', 'bentuk', 'haiwan', 'corak', 'memori', 'tambah', 'tolak', 'adab', 'eja', 'habitat', 'sihat', 'ganjil'],
    music: { bpm: 128, root: 294 }, accent: '#7a4eb0', host: '🏆',
  },
];
export const worldById = (id) => RC_WORLDS.find((w) => w.id === id);
export const worldIndex = (id) => RC_WORLDS.findIndex((w) => w.id === id);

// ---------------- KERETA ----------------
// shape: bubble | sport | jeep | retro | robo | buggy
export const CARS = [
  { id: 'tomato', n: 'Turbo Tomato', say: 'Tomato Turbo', body: '#e8412c', acc: '#2f9e6a', shape: 'bubble', deco: 'leaf', face: true, need: { stars: 0 } },
  { id: 'banana', n: 'Banana Bolt', say: 'Pisang Kilat', body: '#ffd23a', acc: '#7a4a1c', shape: 'sport', deco: 'bolt', need: { stars: 5 } },
  { id: 'comet', n: 'Blue Comet', say: 'Komet Biru', body: '#2f7cf6', acc: '#ffe066', shape: 'sport', deco: 'stars', spoiler: true, need: { stars: 12 } },
  { id: 'dino', n: 'Dino Wheels', say: 'Roda Dino', body: '#3bb36b', acc: '#ff9a3c', shape: 'bubble', deco: 'spikes', face: true, need: { stars: 20 } },
  { id: 'panda', n: 'Panda Drift', say: 'Panda Laju', body: '#fbfbfb', acc: '#26262b', shape: 'bubble', deco: 'panda', ears: true, need: { stars: 30 } },
  { id: 'cloud', n: 'Cloud Rider', say: 'Awan Laju', body: '#eaf6ff', acc: '#58b4ff', shape: 'bubble', deco: 'cloud', need: { stars: 42 } },
  { id: 'firefly', n: 'Mini Firefly', say: 'Kelip-kelip Mini', body: '#ffe45c', acc: '#5a3d8a', shape: 'bubble', deco: 'glow', antenna: true, glow: true, need: { stars: 55 } },
  { id: 'jeep', n: 'Jungle Jeep', say: 'Jip Hutan', body: '#8fae4a', acc: '#6b4a2b', shape: 'jeep', deco: 'spots', rack: true, need: { stars: 70 } },
  { id: 'tiger', n: 'Tiger Turbo', say: 'Harimau Turbo', body: '#ff8c1a', acc: '#2b1a10', shape: 'sport', deco: 'tiger', ears: true, need: { stars: 90 } },
  { id: 'rainbow', n: 'Rainbow Rocket', say: 'Roket Pelangi', body: '#ff5f7a', acc: '#ffffff', shape: 'sport', deco: 'rainbow', fins: true, need: { stars: 110 } },
  { id: 'kampung', n: 'Kampung Cruiser', say: 'Kereta Kampung', body: '#2bb3a3', acc: '#fff1d0', shape: 'retro', deco: 'songket', need: { stars: 135 } },
  { id: 'ocean', n: 'Ocean Speedster', say: 'Laju Lautan', body: '#16b6d4', acc: '#ffffff', shape: 'sport', deco: 'waves', fins: true, need: { stars: 160 } },
  { id: 'robo', n: 'Robo Racer', say: 'Robot Pelumba', body: '#b9c6d6', acc: '#25d9ff', shape: 'robo', deco: 'robo', antenna: true, face: true, need: { stars: 190 } },
  { id: 'moon', n: 'Moon Buggy', say: 'Kereta Bulan', body: '#b9a4ff', acc: '#fff6a8', shape: 'buggy', deco: 'craters', dome: true, need: { stars: 225 } },
  { id: 'golden', n: 'Golden Champion', say: 'Juara Emas', body: '#f5c542', acc: '#fff4c4', shape: 'sport', deco: 'crown', spoiler: true, gold: true, need: { champion: 1 } },
];
export const carById = (id) => CARS.find((c) => c.id === id) || CARS[0];

export const PAINTS = [
  { id: 'asal', n: 'Asal', hex: null, need: 0 },
  { id: 'merah', n: 'Merah', hex: '#e8412c', need: 8 },
  { id: 'oren', n: 'Oren', hex: '#ff8c1a', need: 16 },
  { id: 'kuning', n: 'Kuning', hex: '#ffd23a', need: 24 },
  { id: 'hijau', n: 'Hijau', hex: '#3bb36b', need: 36 },
  { id: 'biru', n: 'Biru', hex: '#2f7cf6', need: 48 },
  { id: 'ungu', n: 'Ungu', hex: '#8f5fe0', need: 64 },
  { id: 'jambu', n: 'Merah jambu', hex: '#ff6fae', need: 80 },
  { id: 'emas', n: 'Emas', hex: '#f5c542', need: 300 },
];
// pelekat dibuka dengan pingat
export const STICKERS_RC = [
  { id: 'tiada', n: 'Tiada', need: 0 },
  { id: 'bintang', n: 'Bintang', need: 1 },
  { id: 'petir', n: 'Petir', need: 2 },
  { id: 'bunga', n: 'Bunga raya', need: 3 },
  { id: 'hati', n: 'Hati', need: 4 },
  { id: 'satu', n: 'Nombor 1', need: 6 },
  { id: 'wau', n: 'Wau', need: 8 },
  { id: 'bulan', n: 'Bulan', need: 10 },
];
// rim tayar dibuka mengikut bilangan dunia yang terbuka
export const RIMS = [
  { id: 'perak', n: 'Perak', c: ['#e9eef5', '#9aa7b8'], need: 1 },
  { id: 'merah', n: 'Merah', c: ['#ff7a6b', '#c22d1c'], need: 2 },
  { id: 'biru', n: 'Biru', c: ['#7ab8ff', '#2a62c9'], need: 3 },
  { id: 'emas', n: 'Emas', c: ['#ffe58a', '#c99512'], need: 5 },
  { id: 'pelangi', n: 'Pelangi', c: ['rainbow', '#7a4eb0'], need: 7 },
];
export const MEDALS = [
  { id: 'gangsa', n: 'Pingat Gangsa', at: 10, c: '#d08a4a' },
  { id: 'perak', n: 'Pingat Perak', at: 25, c: '#b8c3d1' },
  { id: 'emas', n: 'Pingat Emas', at: 50, c: '#f5c542' },
];
export const TIER_NAMES = ['', 'Pemandu Cilik', 'Peneroka Jalan', 'Pelajar Turbo', 'Pelumba Mahir', 'Pemandu Super', 'Juara Dunia'];
