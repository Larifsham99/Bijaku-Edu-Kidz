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
    id: 'allah', n: 'Allah Tuhan Kita', c: '#2f9e6a', c2: '#bff0d4', icon: 'telunjuk',
    words: [W('ALLAH', 'plat', 'iman'), W('TUHAN', 'plat', 'iman'), W('ESA', 'satu', 'iman'), W('ISLAM', 'bulanbintang', 'iman'), W('IMAN', 'hatisinar', 'iman'), W('MUSLIM', 'muslim', 'iman'), W('DOA', 'tadah', 'iman'), W('ZIKIR', 'tasbih', 'iman'), W('SYUKUR', 'syukur', 'iman'), W('NIKMAT', 'hadiah', 'iman'), W('PAHALA', 'pahala', 'iman'), W('RAHMAT', 'plat', 'iman'), W('CAHAYA', 'plat', 'iman'), W('HIDAYAH', 'plat', 'iman'), W('TAKWA', 'plat', 'iman'), W('IKHLAS', 'plat', 'iman'), W('TAAT', 'plat', 'iman'), W('SYURGA', 'plat', 'iman'), W('BAIK', 'hati', 'iman'), W('KASIH', 'hatipink', 'iman'), W('CINTA', 'cinta', 'iman'), W('AMANAH', 'peti', 'iman'), W('JUJUR', 'plat', 'iman'), W('SABAR', 'sabar', 'iman'), W('MAAF', 'maaf', 'iman'), W('SEDEKAH', 'sedekah', 'iman'), W('BERSIH', 'bersih', 'iman'), W('SENYUM', 'senyum', 'iman'), W('SOLAT', 'sejadah', 'iman'), W('QURAN', 'quran', 'iman'), W('MASJID', 'masjid', 'iman'), W('KIBLAT', 'kiblat', 'iman')],
  },
  {
    id: 'rukunislam', n: 'Rukun Islam', c: '#2e5aac', c2: '#cfe0ff', icon: 'kaabah',
    words: [W('SYAHADAH', 'telunjuk', 'islam'), W('DUA', 'dua', 'islam'), W('SOLAT', 'sejadah', 'islam'), W('PUASA', 'puasa', 'islam'), W('ZAKAT', 'zakat', 'islam'), W('HAJI', 'kaabah', 'islam'), W('RUKUN', 'tiang', 'islam'), W('ISLAM', 'bulanbintang', 'islam'), W('LIMA', 'lima', 'islam'), W('KAABAH', 'kaabah', 'islam'), W('MAKKAH', 'makkah', 'islam'), W('IHRAM', 'ihram', 'islam'), W('TAWAF', 'tawaf', 'islam'), W('ARAFAH', 'arafah', 'islam'), W('KHEMAH', 'khemah', 'islam'), W('ZAMZAM', 'zamzam', 'islam'), W('JEMAAH', 'jemaah', 'islam'), W('UMRAH', 'plat', 'islam'), W('SAIE', 'plat', 'islam'), W('FITRAH', 'beras', 'islam'), W('BERAS', 'beras', 'islam'), W('WANG', 'wang', 'islam'), W('SYILING', 'syiling', 'islam'), W('MISKIN', 'miskin', 'islam'), W('FAKIR', 'plat', 'islam'), W('RAMADAN', 'ramadan', 'islam'), W('SAHUR', 'sahur', 'islam'), W('IFTAR', 'iftar', 'islam'), W('RAYA', 'ketupat', 'islam'), W('HILAL', 'hilal', 'islam'), W('NIAT', 'plat', 'islam'), W('TAKBIR', 'takbir', 'islam')],
  },
  {
    id: 'rukuniman', n: 'Rukun Iman', c: '#7a4eb0', c2: '#e6d9fb', icon: 'kitab',
    words: [W('ALLAH', 'plat', 'iman'), W('MALAIKAT', 'plat', 'iman'), W('KITAB', 'kitab', 'iman'), W('RASUL', 'skrol', 'iman'), W('NABI', 'nabi', 'iman'), W('AKHIRAT', 'plat', 'iman'), W('QADA', 'plat', 'iman'), W('QADAR', 'plat', 'iman'), W('IMAN', 'hatisinar', 'iman'), W('RUKUN', 'tiang', 'iman'), W('ENAM', 'enam', 'iman'), W('QURAN', 'quran', 'iman'), W('TAURAT', 'plat', 'iman'), W('ZABUR', 'plat', 'iman'), W('INJIL', 'plat', 'iman'), W('WAHYU', 'plat', 'iman'), W('YAKIN', 'plat', 'iman'), W('JIBRIL', 'plat', 'iman'), W('MIKAIL', 'plat', 'iman'), W('ISRAFIL', 'plat', 'iman'), W('IZRAIL', 'plat', 'iman'), W('MUNKAR', 'plat', 'iman'), W('NAKIR', 'plat', 'iman'), W('RAQIB', 'plat', 'iman'), W('ATID', 'plat', 'iman'), W('MALIK', 'plat', 'iman'), W('RIDWAN', 'plat', 'iman'), W('SYURGA', 'plat', 'iman'), W('ESA', 'satu', 'iman'), W('PERCAYA', 'hatisinar', 'iman')],
  },
  {
    id: 'solat', n: 'Jom Solat', c: '#0f9fb3', c2: '#c6f1f7', icon: 'sejadah',
    words: [W('SOLAT', 'sejadah', 'solat'), W('MASJID', 'masjid', 'solat'), W('SEJADAH', 'sejadah', 'solat'), W('WUDUK', 'titisair', 'solat'), W('TAKBIR', 'takbir', 'solat'), W('RUKUK', 'rukuk', 'solat'), W('SUJUD', 'sujud', 'solat'), W('SALAM', 'salamsolat', 'solat'), W('KIBLAT', 'kiblat', 'solat'), W('AZAN', 'menara', 'solat'), W('IQAMAH', 'plat', 'solat'), W('SUBUH', 'subuh', 'solat'), W('ZOHOR', 'zohor', 'solat'), W('ASAR', 'asar', 'solat'), W('MAGHRIB', 'maghrib', 'solat'), W('ISYAK', 'isyak', 'solat'), W('SONGKOK', 'songkok', 'solat'), W('TELEKUNG', 'telekung', 'solat'), W('KOPIAH', 'kopiah', 'solat'), W('SERBAN', 'serban', 'solat'), W('KAIN', 'kain', 'solat'), W('JUBAH', 'jubah', 'solat'), W('IMAM', 'imam', 'solat'), W('MAKMUM', 'jemaah', 'solat'), W('SAF', 'saf', 'solat'), W('DUDUK', 'duduk', 'solat'), W('RAKAAT', 'plat', 'solat'), W('JUMAAT', 'plat', 'solat'), W('DOA', 'tadah', 'solat'), W('ZIKIR', 'tasbih', 'solat'), W('TASBIH', 'tasbih', 'solat'), W('SURAU', 'surau', 'solat')],
  },
  {
    id: 'wuduk', n: 'Wuduk', c: '#1c7ed6', c2: '#d0ebff', icon: 'titisair',
    words: [W('AIR', 'air', 'wuduk'), W('PAIP', 'paip', 'wuduk'), W('WUDUK', 'titisair', 'wuduk'), W('TANGAN', 'tangan', 'wuduk'), W('JARI', 'jari', 'wuduk'), W('MULUT', 'mulut', 'wuduk'), W('HIDUNG', 'hidung', 'wuduk'), W('MUKA', 'muka', 'wuduk'), W('KEPALA', 'kepala', 'wuduk'), W('TELINGA', 'telinga', 'wuduk'), W('KAKI', 'kaki', 'wuduk'), W('SIKU', 'siku', 'wuduk'), W('LENGAN', 'lengan', 'wuduk'), W('RAMBUT', 'rambut', 'wuduk'), W('DAHI', 'dahi', 'wuduk'), W('DAGU', 'dagu', 'wuduk'), W('MATA', 'mata', 'wuduk'), W('GIGI', 'gigi', 'wuduk'), W('KUKU', 'kuku', 'wuduk'), W('NIAT', 'plat', 'wuduk'), W('BERSIH', 'bersih', 'wuduk'), W('TUALA', 'tuala', 'wuduk'), W('SABUN', 'sabun', 'wuduk'), W('SINKI', 'sinki', 'wuduk'), W('TIMBA', 'timba', 'wuduk'), W('KOLAH', 'kolah', 'wuduk'), W('BASUH', 'basuh', 'wuduk'), W('KANAN', 'tangankanan', 'wuduk'), W('KIRI', 'kiri', 'wuduk'), W('TIGA', 'tiga', 'wuduk'), W('TERTIB', 'plat', 'wuduk')],
  },
  {
    id: 'doa', n: 'Doa Harian', c: '#e07b00', c2: '#ffe3bf', icon: 'tadah',
    words: [W('DOA', 'tadah', 'doa'), W('MAKAN', 'makan', 'doa'), W('TIDUR', 'katil', 'doa'), W('BANGUN', 'jamloceng', 'doa'), W('TANDAS', 'tandas', 'doa'), W('IBU', 'ibu', 'doa'), W('BAPA', 'ayah', 'doa'), W('BELAJAR', 'buku', 'doa'), W('RUMAH', 'rumah', 'doa'), W('PINTU', 'pintu', 'doa'), W('AMIN', 'plat', 'doa'), W('ILMU', 'lampu', 'doa'), W('BANTAL', 'bantal', 'doa'), W('SELIMUT', 'selimut', 'doa'), W('PINGGAN', 'pinggan', 'doa'), W('CAWAN', 'cawan', 'doa'), W('SUDU', 'sudu', 'doa'), W('BAJU', 'baju', 'doa'), W('KASUT', 'kasut', 'doa'), W('KERETA', 'kereta', 'doa'), W('SEKOLAH', 'sekolah', 'doa'), W('PENSEL', 'pensel', 'doa'), W('BERSIN', 'bersin', 'doa'), W('CERMIN', 'cermin', 'doa'), W('MANDI', 'mandi', 'doa'), W('HUJAN', 'hujan', 'doa'), W('PAGI', 'subuh', 'doa'), W('MALAM', 'isyak', 'doa'), W('KATIL', 'katil', 'doa'), W('MINUM', 'susu', 'doa'), W('BISMILLAH', 'plat', 'doa')],
  },
  {
    id: 'adab', n: 'Adab Mulia', c: '#d6336c', c2: '#ffd8e6', icon: 'salaman',
    words: [W('SALAM', 'salaman', 'adab'), W('SENYUM', 'senyum', 'adab'), W('SOPAN', 'sopan', 'adab'), W('HORMAT', 'hormat', 'adab'), W('TOLONG', 'tolong', 'adab'), W('MAAF', 'maaf', 'adab'), W('AMANAH', 'peti', 'adab'), W('JUJUR', 'plat', 'adab'), W('BERSIH', 'bersih', 'adab'), W('SABAR', 'sabar', 'adab'), W('KONGSI', 'kongsi', 'adab'), W('KASIH', 'hatipink', 'adab'), W('RAJIN', 'rajin', 'adab'), W('SUSUN', 'susun', 'adab'), W('KEMAS', 'kemas', 'adab'), W('KAWAN', 'kawan', 'adab'), W('PELUK', 'peluk', 'adab'), W('DIAM', 'diam', 'adab'), W('DENGAR', 'dengar', 'adab'), W('BERATUR', 'beratur', 'adab'), W('SAMPAH', 'sampah', 'adab'), W('PINJAM', 'pinjam', 'adab'), W('SIRAM', 'siram', 'adab'), W('SAYANG', 'hati', 'adab'), W('BACA', 'buku', 'adab'), W('TERIMA', 'plat', 'adab'), W('LEMBUT', 'plat', 'adab'), W('MALU', 'plat', 'adab'), W('PEMURAH', 'plat', 'adab'), W('SANTUN', 'plat', 'adab')],
  },
  {
    id: 'keluarga', n: 'Keluarga', c: '#f08c00', c2: '#ffe8cc', icon: 'keluarga',
    words: [W('IBU', 'ibu', 'keluarga'), W('AYAH', 'ayah', 'keluarga'), W('ABANG', 'abang', 'keluarga'), W('KAKAK', 'kakak', 'keluarga'), W('ADIK', 'adik', 'keluarga'), W('NENEK', 'nenek', 'keluarga'), W('DATUK', 'datuk', 'keluarga'), W('KELUARGA', 'keluarga', 'keluarga'), W('BAYI', 'bayi', 'keluarga'), W('ANAK', 'anak', 'keluarga'), W('CUCU', 'cucu', 'keluarga'), W('PAKCIK', 'pakcik', 'keluarga'), W('MAKCIK', 'makcik', 'keluarga'), W('KASIH', 'hatipink', 'keluarga'), W('SAYANG', 'hati', 'keluarga'), W('RUMAH', 'rumah', 'keluarga'), W('DAPUR', 'dapur', 'keluarga'), W('TAMAN', 'taman', 'keluarga'), W('KUCING', 'kucing', 'keluarga'), W('GAMBAR', 'gambar', 'keluarga'), W('MASAK', 'masak', 'keluarga'), W('KEK', 'kek', 'keluarga'), W('PIKNIK', 'piknik', 'keluarga'), W('PELUK', 'peluk', 'keluarga'), W('MAKAN', 'makan', 'keluarga'), W('HADIAH', 'hadiah', 'keluarga'), W('KERETA', 'kereta', 'keluarga'), W('ZIARAH', 'ziarah', 'keluarga'), W('BERSAMA', 'plat', 'keluarga'), W('SEPUPU', 'plat', 'keluarga')],
  },
  {
    id: 'masjid', n: 'Masjid & Al-Quran', c: '#087f5b', c2: '#c3fae8', icon: 'masjid',
    words: [W('MASJID', 'masjid', 'masjid'), W('QURAN', 'quran', 'masjid'), W('SURAH', 'plat', 'masjid'), W('AYAT', 'plat', 'masjid'), W('JUZUK', 'plat', 'masjid'), W('IQRA', 'iqra', 'masjid'), W('MUALIM', 'mualim', 'masjid'), W('MIMBAR', 'mimbar', 'masjid'), W('AZAN', 'menara', 'masjid'), W('KUBAH', 'kubah', 'masjid'), W('MENARA', 'menara', 'masjid'), W('RIHAL', 'rihal', 'masjid'), W('TASBIH', 'tasbih', 'masjid'), W('IMAM', 'imam', 'masjid'), W('MIHRAB', 'mihrab', 'masjid'), W('BEDUK', 'beduk', 'masjid'), W('KARPET', 'karpet', 'masjid'), W('RAK', 'rak', 'masjid'), W('SELIPAR', 'selipar', 'masjid'), W('SURAU', 'surau', 'masjid'), W('HURUF', 'hijaiyah', 'masjid'), W('JEMAAH', 'jemaah', 'masjid'), W('SEJADAH', 'sejadah', 'masjid'), W('KIBLAT', 'kiblat', 'masjid'), W('KHUTBAH', 'plat', 'masjid'), W('JUMAAT', 'plat', 'masjid'), W('TADARUS', 'plat', 'masjid'), W('KHATAM', 'plat', 'masjid'), W('TAJWID', 'plat', 'masjid'), W('WUDUK', 'titisair', 'masjid')],
  },
  {
    id: 'nabi', n: '25 Nabi', c: '#9c6b16', c2: '#ffeec2', icon: 'nabi',
    // 25 nabi dan rasul yang wajib diketahui (susunan lazim)
    words: [W('ADAM', 'nabi', 'nabi'), W('IDRIS', 'nabi', 'nabi'), W('NUH', 'nabi', 'nabi'), W('HUD', 'nabi', 'nabi'), W('SOLEH', 'nabi', 'nabi'), W('IBRAHIM', 'nabi', 'nabi'), W('LUT', 'nabi', 'nabi'), W('ISMAIL', 'nabi', 'nabi'), W('ISHAK', 'nabi', 'nabi'), W('YAAKUB', 'nabi', 'nabi'), W('YUSUF', 'nabi', 'nabi'), W('AYUB', 'nabi', 'nabi'), W('SYUAIB', 'nabi', 'nabi'), W('MUSA', 'nabi', 'nabi'), W('HARUN', 'nabi', 'nabi'), W('ZULKIFLI', 'nabi', 'nabi'), W('DAUD', 'nabi', 'nabi'), W('SULAIMAN', 'nabi', 'nabi'), W('ILYAS', 'nabi', 'nabi'), W('ILYASA', 'nabi', 'nabi'), W('YUNUS', 'nabi', 'nabi'), W('ZAKARIA', 'nabi', 'nabi'), W('YAHYA', 'nabi', 'nabi'), W('ISA', 'nabi', 'nabi'), W('MUHAMMAD', 'nabi', 'nabi'), W('NABI', 'nabi', 'nabi'), W('RASUL', 'skrol', 'nabi')],
  },
  {
    id: 'kisah', n: 'Kisah Nabi', c: '#1971c2', c2: '#d0ebff', icon: 'bahtera',
    words: [W('BAHTERA', 'bahtera', 'kisah'), W('LAUT', 'laut', 'kisah'), W('TONGKAT', 'tongkat', 'kisah'), W('IKAN', 'ikanpaus', 'kisah'), W('PAUS', 'ikanpaus', 'kisah'), W('API', 'api', 'kisah'), W('KAABAH', 'kaabah', 'kisah'), W('UNTA', 'unta', 'kisah'), W('BINTANG', 'bintang', 'kisah'), W('MAKKAH', 'makkah', 'kisah'), W('MADINAH', 'madinah', 'kisah'), W('SEMUT', 'semut', 'kisah'), W('GUA', 'gua', 'kisah'), W('BULAN', 'bulan', 'kisah'), W('BANJIR', 'banjir', 'kisah'), W('ANGIN', 'angin', 'kisah'), W('PERIGI', 'perigi', 'kisah'), W('KIBAS', 'kibas', 'kisah'), W('ULAR', 'ular', 'kisah'), W('BUKIT', 'bukit', 'kisah'), W('BESI', 'besi', 'kisah'), W('HUDHUD', 'hudhud', 'kisah'), W('MERPATI', 'merpati', 'kisah'), W('KURMA', 'kurma', 'kisah'), W('MATAHARI', 'matahari', 'kisah'), W('HUJAN', 'hujan', 'kisah'), W('POKOK', 'pokok', 'kisah'), W('SUNGAI', 'sungai', 'kisah'), W('TAMAN', 'taman', 'kisah'), W('BURUNG', 'burung', 'kisah')],
  },
  {
    id: 'makanan', n: 'Makanan Halal', c: '#e8590c', c2: '#ffe0cc', icon: 'kurma',
    words: [W('KURMA', 'kurma', 'makanan'), W('SUSU', 'susu', 'makanan'), W('MADU', 'madu', 'makanan'), W('ROTI', 'roti', 'makanan'), W('AIR', 'air', 'makanan'), W('BUAH', 'buah', 'makanan'), W('IKAN', 'ikan', 'makanan'), W('ZAITUN', 'zaitun', 'makanan'), W('NASI', 'nasi', 'makanan'), W('TELUR', 'telur', 'makanan'), W('AYAM', 'ayam', 'makanan'), W('EPAL', 'epal', 'makanan'), W('PISANG', 'pisang', 'makanan'), W('HALAL', 'halal', 'makanan'), W('KANAN', 'tangankanan', 'makanan'), W('SAYUR', 'sayur', 'makanan'), W('LOBAK', 'lobak', 'makanan'), W('JAGUNG', 'jagung', 'makanan'), W('TEMBIKAI', 'tembikai', 'makanan'), W('ANGGUR', 'anggur', 'makanan'), W('MANGGA', 'mangga', 'makanan'), W('OREN', 'oren', 'makanan'), W('NANAS', 'nanas', 'makanan'), W('KELAPA', 'kelapa', 'makanan'), W('TEH', 'teh', 'makanan'), W('BUBUR', 'bubur', 'makanan'), W('MI', 'mi', 'makanan'), W('SUP', 'sup', 'makanan'), W('KUIH', 'kuih', 'makanan'), W('DAGING', 'daging', 'makanan'), W('GULA', 'gula', 'makanan'), W('GARAM', 'garam', 'makanan')],
  },
  {
    id: 'ciptaan', n: 'Ciptaan Allah', c: '#2b8a3e', c2: '#d3f9d8', icon: 'matahari',
    words: [W('MATAHARI', 'matahari', 'alam'), W('BULAN', 'bulan', 'alam'), W('BINTANG', 'bintang', 'alam'), W('LANGIT', 'langit', 'alam'), W('LAUT', 'laut', 'alam'), W('GUNUNG', 'gunung', 'alam'), W('HUJAN', 'hujan', 'alam'), W('POKOK', 'pokok', 'alam'), W('BUNGA', 'bunga', 'alam'), W('BURUNG', 'burung', 'alam'), W('AWAN', 'awan', 'alam'), W('PELANGI', 'pelangi', 'alam'), W('SUNGAI', 'sungai', 'alam'), W('BUMI', 'bumi', 'alam'), W('ANGIN', 'angin', 'alam'), W('PANTAI', 'pantai', 'alam'), W('PASIR', 'pasir', 'alam'), W('BATU', 'batu', 'alam'), W('DAUN', 'daun', 'alam'), W('BIJI', 'biji', 'alam'), W('LEBAH', 'lebah', 'alam'), W('SEMUT', 'semut', 'alam'), W('IKAN', 'ikan', 'alam'), W('KUCING', 'kucing', 'alam'), W('LEMBU', 'lembu', 'alam'), W('GAJAH', 'gajah', 'alam'), W('KUDA', 'kuda', 'alam'), W('ARNAB', 'arnab', 'alam'), W('KATAK', 'katak', 'alam'), W('SALJI', 'salji', 'alam'), W('PETIR', 'petir', 'alam'), W('HUTAN', 'hutan', 'alam')],
  },
  {
    id: 'ramadan', n: 'Ramadan Ceria', c: '#7048e8', c2: '#e5dbff', icon: 'ramadan',
    words: [W('RAMADAN', 'ramadan', 'ramadan'), W('PUASA', 'puasa', 'ramadan'), W('SAHUR', 'sahur', 'ramadan'), W('IFTAR', 'iftar', 'ramadan'), W('KURMA', 'kurma', 'ramadan'), W('DOA', 'tadah', 'ramadan'), W('TARAWIH', 'tarawih', 'ramadan'), W('MASJID', 'masjid', 'ramadan'), W('SEDEKAH', 'sedekah', 'ramadan'), W('SYAWAL', 'ketupat', 'ramadan'), W('KETUPAT', 'ketupat', 'ramadan'), W('PELITA', 'pelita', 'ramadan'), W('ZAKAT', 'zakat', 'ramadan'), W('FITRAH', 'beras', 'ramadan'), W('BULAN', 'bulan', 'ramadan'), W('HILAL', 'hilal', 'ramadan'), W('LEMANG', 'lemang', 'ramadan'), W('SAMPUL', 'sampul', 'ramadan'), W('BAZAR', 'bazar', 'ramadan'), W('BAJU', 'baju', 'ramadan'), W('KUIH', 'kuih', 'ramadan'), W('BUBUR', 'bubur', 'ramadan'), W('ZIARAH', 'ziarah', 'ramadan'), W('MAAF', 'maaf', 'ramadan'), W('QURAN', 'quran', 'ramadan'), W('TADARUS', 'plat', 'ramadan'), W('KHATAM', 'plat', 'ramadan'), W('IMSAK', 'plat', 'ramadan'), W('RAYA', 'ketupat', 'ramadan'), W('AIR', 'air', 'ramadan')],
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
