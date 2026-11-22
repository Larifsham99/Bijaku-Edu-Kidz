// =====================================================================
//  TEKA SILANG CILIK — 15 chapter perkataan (data tulen, tiada DOM)
//  w: perkataan (huruf besar, tanpa ruang), art: id ilustrasi (art.js)
//  Ilustrasi 'plat' / 'nabi' = papan nama (perkataan abstrak / nama nabi):
//  perkataan ini sentiasa dipaparkan sebahagian supaya anak boleh mengenalnya.
//  Kandungan agama: istilah asas sahaja (tiada hukum baharu, tiada ayat al-Quran).
// =====================================================================
const W = (w, art, cat) => ({ w, art, cat });

export const CHAPTERS = [
  {
    id: 'allah', n: 'Allah Tuhan Kita', c: '#2f9e6a', c2: '#bff0d4', icon: 'allah',
    words: [W('ALLAH', 'allah', 'iman'), W('TUHAN', 'langitcahaya', 'iman'), W('ISLAM', 'bulanbintang', 'islam'), W('IMAN', 'hatisinar', 'iman'),
      W('DOA', 'tadah', 'doa'), W('SYUKUR', 'syukur', 'adab'), W('BAIK', 'hati', 'adab'), W('AMANAH', 'peti', 'adab'), W('KASIH', 'hatipink', 'adab'),
      W('SOLAT', 'sejadah', 'solat'), W('NIKMAT', 'hadiah', 'iman')],
  },
  {
    id: 'rukunislam', n: 'Rukun Islam', c: '#2e5aac', c2: '#cfe0ff', icon: 'kaabah',
    words: [W('SYAHADAH', 'telunjuk', 'islam'), W('SOLAT', 'sejadah', 'solat'), W('PUASA', 'puasa', 'islam'), W('ZAKAT', 'zakat', 'islam'),
      W('HAJI', 'kaabah', 'islam'), W('RUKUN', 'tiang', 'islam'), W('ISLAM', 'bulanbintang', 'islam'), W('LIMA', 'lima', 'nombor'),
      W('KAABAH', 'kaabah', 'islam'), W('IHRAM', 'ihram', 'islam'), W('MAKKAH', 'makkah', 'islam'), W('FITRAH', 'beras', 'islam')],
  },
  {
    id: 'rukuniman', n: 'Rukun Iman', c: '#7a4eb0', c2: '#e6d9fb', icon: 'kitab',
    words: [W('ALLAH', 'allah', 'iman'), W('MALAIKAT', 'cahaya', 'iman'), W('KITAB', 'kitab', 'iman'), W('RASUL', 'skrol', 'iman'),
      W('AKHIRAT', 'fajar', 'iman'), W('QADA', 'plat', 'iman'), W('QADAR', 'plat', 'iman'), W('IMAN', 'hatisinar', 'iman'), W('RUKUN', 'tiang', 'iman'),
      W('ENAM', 'enam', 'nombor'), W('QURAN', 'quran', 'quran'), W('TAURAT', 'plat', 'iman'), W('ZABUR', 'plat', 'iman'), W('INJIL', 'plat', 'iman')],
  },
  {
    id: 'solat', n: 'Jom Solat', c: '#0f9fb3', c2: '#c6f1f7', icon: 'sejadah',
    words: [W('SOLAT', 'sejadah', 'solat'), W('MASJID', 'masjid', 'masjid'), W('SEJADAH', 'sejadah', 'solat'), W('WUDUK', 'titisair', 'solat'),
      W('TAKBIR', 'takbir', 'solat'), W('RUKUK', 'rukuk', 'solat'), W('SUJUD', 'sujud', 'solat'), W('SALAM', 'salamsolat', 'solat'),
      W('KIBLAT', 'kiblat', 'solat'), W('AZAN', 'menara', 'solat'), W('SUBUH', 'subuh', 'waktu'), W('ZOHOR', 'zohor', 'waktu'),
      W('ASAR', 'asar', 'waktu'), W('MAGHRIB', 'maghrib', 'waktu'), W('ISYAK', 'isyak', 'waktu'), W('SONGKOK', 'songkok', 'pakaian'), W('TELEKUNG', 'telekung', 'pakaian')],
  },
  {
    id: 'wuduk', n: 'Wuduk', c: '#1c7ed6', c2: '#d0ebff', icon: 'titisair',
    words: [W('AIR', 'air', 'wuduk'), W('PAIP', 'paip', 'wuduk'), W('WUDUK', 'titisair', 'wuduk'), W('TANGAN', 'tangan', 'anggota'), W('JARI', 'jari', 'anggota'),
      W('MULUT', 'mulut', 'anggota'), W('HIDUNG', 'hidung', 'anggota'), W('MUKA', 'muka', 'anggota'), W('KEPALA', 'kepala', 'anggota'),
      W('TELINGA', 'telinga', 'anggota'), W('KAKI', 'kaki', 'anggota'), W('SIKU', 'siku', 'anggota'), W('NIAT', 'plat', 'wuduk'), W('BERSIH', 'bersih', 'adab')],
  },
  {
    id: 'doa', n: 'Doa Harian', c: '#e07b00', c2: '#ffe3bf', icon: 'tadah',
    words: [W('DOA', 'tadah', 'doa'), W('MAKAN', 'makan', 'doa'), W('TIDUR', 'katil', 'doa'), W('BANGUN', 'jamloceng', 'doa'), W('TANDAS', 'tandas', 'doa'),
      W('IBU', 'ibu', 'keluarga'), W('BAPA', 'ayah', 'keluarga'), W('BELAJAR', 'buku', 'doa'), W('RUMAH', 'rumah', 'doa'), W('PINTU', 'pintu', 'doa'),
      W('AMIN', 'plat', 'doa'), W('ILMU', 'lampu', 'doa'), W('BISMILLAH', 'plat', 'doa')],
  },
  {
    id: 'adab', n: 'Adab Mulia', c: '#d6336c', c2: '#ffd8e6', icon: 'salaman',
    words: [W('SALAM', 'salaman', 'adab'), W('SENYUM', 'senyum', 'adab'), W('SOPAN', 'sopan', 'adab'), W('HORMAT', 'hormat', 'adab'), W('TOLONG', 'tolong', 'adab'),
      W('MAAF', 'maaf', 'adab'), W('AMANAH', 'peti', 'adab'), W('JUJUR', 'plat', 'adab'), W('BERSIH', 'bersih', 'adab'), W('SABAR', 'sabar', 'adab'),
      W('KONGSI', 'kongsi', 'adab'), W('KASIH', 'hatipink', 'adab')],
  },
  {
    id: 'keluarga', n: 'Keluarga', c: '#f08c00', c2: '#ffe8cc', icon: 'keluarga',
    words: [W('IBU', 'ibu', 'keluarga'), W('AYAH', 'ayah', 'keluarga'), W('ABANG', 'abang', 'keluarga'), W('KAKAK', 'kakak', 'keluarga'), W('ADIK', 'adik', 'keluarga'),
      W('NENEK', 'nenek', 'keluarga'), W('DATUK', 'datuk', 'keluarga'), W('KELUARGA', 'keluarga', 'keluarga'), W('KASIH', 'hatipink', 'adab'),
      W('SAYANG', 'hati', 'adab'), W('RUMAH', 'rumah', 'keluarga'), W('BAYI', 'bayi', 'keluarga')],
  },
  {
    id: 'masjid', n: 'Masjid & Al-Quran', c: '#087f5b', c2: '#c3fae8', icon: 'masjid',
    words: [W('MASJID', 'masjid', 'masjid'), W('QURAN', 'quran', 'quran'), W('SURAH', 'plat', 'quran'), W('AYAT', 'plat', 'quran'), W('JUZUK', 'plat', 'quran'),
      W('IQRA', 'iqra', 'quran'), W('MUALIM', 'mualim', 'quran'), W('MIMBAR', 'mimbar', 'masjid'), W('AZAN', 'menara', 'masjid'), W('KUBAH', 'kubah', 'masjid'),
      W('MENARA', 'menara', 'masjid'), W('RIHAL', 'rihal', 'quran'), W('TASBIH', 'tasbih', 'masjid'), W('IMAM', 'imam', 'masjid')],
  },
  {
    id: 'nabi', n: '25 Nabi', c: '#9c6b16', c2: '#ffeec2', icon: 'nabi',
    // 25 nabi dan rasul yang wajib diketahui (susunan lazim)
    words: ['ADAM', 'IDRIS', 'NUH', 'HUD', 'SOLEH', 'IBRAHIM', 'LUT', 'ISMAIL', 'ISHAK', 'YAAKUB', 'YUSUF', 'AYUB', 'SYUAIB', 'MUSA', 'HARUN',
      'ZULKIFLI', 'DAUD', 'SULAIMAN', 'ILYAS', 'ILYASA', 'YUNUS', 'ZAKARIA', 'YAHYA', 'ISA', 'MUHAMMAD'].map((w) => W(w, 'nabi', 'nabi')),
  },
  {
    id: 'kisah', n: 'Kisah Nabi', c: '#1971c2', c2: '#d0ebff', icon: 'bahtera',
    words: [W('BAHTERA', 'bahtera', 'kisah'), W('LAUT', 'laut', 'kisah'), W('TONGKAT', 'tongkat', 'kisah'), W('IKAN', 'ikanpaus', 'kisah'), W('API', 'api', 'kisah'),
      W('KAABAH', 'kaabah', 'kisah'), W('UNTA', 'unta', 'kisah'), W('BINTANG', 'bintang', 'kisah'), W('MAKKAH', 'makkah', 'kisah'), W('MADINAH', 'madinah', 'kisah'),
      W('SEMUT', 'semut', 'kisah'), W('GUA', 'gua', 'kisah'), W('BULAN', 'bulan', 'kisah')],
  },
  {
    id: 'makanan', n: 'Makanan Halal', c: '#e8590c', c2: '#ffe0cc', icon: 'kurma',
    words: [W('KURMA', 'kurma', 'makanan'), W('SUSU', 'susu', 'makanan'), W('MADU', 'madu', 'makanan'), W('ROTI', 'roti', 'makanan'), W('AIR', 'air', 'makanan'),
      W('BUAH', 'buah', 'makanan'), W('IKAN', 'ikan', 'makanan'), W('ZAITUN', 'zaitun', 'makanan'), W('NASI', 'nasi', 'makanan'), W('TELUR', 'telur', 'makanan'),
      W('AYAM', 'ayam', 'makanan'), W('EPAL', 'epal', 'makanan'), W('PISANG', 'pisang', 'makanan'), W('HALAL', 'halal', 'makanan'), W('KANAN', 'tangankanan', 'adab')],
  },
  {
    id: 'ciptaan', n: 'Ciptaan Allah', c: '#2b8a3e', c2: '#d3f9d8', icon: 'matahari',
    words: [W('MATAHARI', 'matahari', 'alam'), W('BULAN', 'bulan', 'alam'), W('BINTANG', 'bintang', 'alam'), W('LANGIT', 'langit', 'alam'), W('LAUT', 'laut', 'alam'),
      W('GUNUNG', 'gunung', 'alam'), W('HUJAN', 'hujan', 'alam'), W('POKOK', 'pokok', 'alam'), W('BUNGA', 'bunga', 'alam'), W('BURUNG', 'burung', 'alam'),
      W('AWAN', 'awan', 'alam'), W('PELANGI', 'pelangi', 'alam'), W('SUNGAI', 'sungai', 'alam'), W('BUMI', 'bumi', 'alam')],
  },
  {
    id: 'ramadan', n: 'Ramadan Ceria', c: '#7048e8', c2: '#e5dbff', icon: 'ramadan',
    words: [W('RAMADAN', 'ramadan', 'ramadan'), W('PUASA', 'puasa', 'ramadan'), W('SAHUR', 'sahur', 'ramadan'), W('IFTAR', 'iftar', 'ramadan'), W('KURMA', 'kurma', 'makanan'),
      W('DOA', 'tadah', 'doa'), W('TARAWIH', 'tarawih', 'ramadan'), W('MASJID', 'masjid', 'masjid'), W('SEDEKAH', 'sedekah', 'ramadan'), W('SYAWAL', 'ketupat', 'ramadan'),
      W('KETUPAT', 'ketupat', 'ramadan'), W('PELITA', 'pelita', 'ramadan'), W('ZAKAT', 'zakat', 'ramadan'), W('FITRAH', 'beras', 'ramadan'), W('BULAN', 'bulan', 'ramadan')],
  },
  {
    id: 'soleh', n: 'Si Cilik Soleh', c: '#c2255c', c2: '#ffdeeb', icon: 'bintang',
    words: [], // diisi daripada semua chapter (di bawah)
  },
];
// Chapter akhir menggabungkan semua kategori
const seen = new Set();
CHAPTERS[14].words = CHAPTERS.slice(0, 14).flatMap((c) => c.words).filter((x) => x.art !== 'plat' && (seen.has(x.w) ? false : seen.add(x.w)));

export const LEVELS_PER_CHAPTER = 30;
export const CATEGORY_NAMES = {
  iman: 'Iman', islam: 'Islam', solat: 'Solat', waktu: 'Waktu solat', pakaian: 'Pakaian solat', wuduk: 'Wuduk', anggota: 'Anggota badan', doa: 'Doa harian',
  adab: 'Adab', keluarga: 'Keluarga', masjid: 'Masjid', quran: 'Al-Quran', nabi: 'Nabi', kisah: 'Kisah nabi', makanan: 'Makanan', alam: 'Ciptaan Allah',
  ramadan: 'Ramadan', nombor: 'Nombor',
};
