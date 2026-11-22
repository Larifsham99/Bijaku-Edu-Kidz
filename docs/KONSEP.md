# BIJAKU oleh Mawar Ikhlas (dahulu "Dunia Cilik") — Ringkasan Konsep Aplikasi

**Tagline:** "Belajar Sambil Bermain, Bijak Sambil Meneroka."
**Sasaran:** kanak-kanak 4–5 tahun (sesuai juga 3–6 tahun) dan ibu bapa Muslim di Malaysia.
**Bahasa:** Bahasa Melayu Malaysia (pilihan dwibahasa BM + English untuk nama objek).
**Model perniagaan:** sekali bayar RM39 (cadangan). Tiada langganan, tiada iklan, dan tiada pembelian dalam aplikasi.

---

## Jenama: BIJAKU oleh Mawar Ikhlas

- **Nama aplikasi:** BIJAKU (bi-ja-ku, "bijakku"). **Syarikat:** Mawar Ikhlas (ditulis "oleh Mawar Ikhlas").
- **Logo:** enam huruf timbul berwarna (merah, jingga, hijau, biru, ungu, merah jambu) + bunga mawar kecil. Komponen `brandLogo()` dalam `js/brand.js`.
- **Ikon apl:** jubin "B" 2.5D di atas latar malam ungu (`icons/icon.svg`, PNG 192/512 + versi maskable).
- **Gaya visual 2.5D** (`css/bijaku.css`): kad timbul dengan bayang tebal di bawah, banner bergerak, rak kategori.
- **Skrin utama:** banner (sambung bermain + Taman Akhlak, Cilik Racing, Teka Silang), butang pantas, 5 rak kategori (Huruf & Nombor, Islam & Akhlak, Minda Pintar, Kreatif & Bunyi, Dunia Sekeliling), Doa Hari Ini, bar tab bawah.
- **Dunia BIJAKU** (`#/dunia`, `js/screens/world.js`): peta pulau isometrik, satu pulau untuk setiap permainan (18), disambung jalan bertitik.
- Katalog permainan dikongsi dalam `js/screens/catalog.js` (tambah permainan baharu ke `SHELVES`/`EXTRAS`).
- **Pujian bersama** (`js/cheer.js`): `cheer('good'|'try'|'done')` memainkan suara pujian/galakan yang sudah dirakam, dan `ribbon()` memaparkan reben "Hebat!/Tahniah!" bersayap dengan bintang. Digunakan dalam 15 permainan asal, Teka Silang, Cilik Racing & Taman Akhlak — guna juga untuk setiap permainan baharu.

## 1. Apa itu Dunia Cilik
Aplikasi permainan pendidikan untuk kanak-kanak prasekolah. Ia mempunyai **15 permainan** dan setiap permainan ada **50 level** (jumlah **750 level**). Setiap permainan menggunakan mekanik interaktif tersendiri seperti seret dan lepas, padanan, puzzle, memori, maze, mewarna, menyurih dan mengira, bukan sekadar soalan dan jawapan. Semua arahan dibacakan dengan suara, jadi anak yang belum boleh membaca pun boleh bermain sendiri.

Prinsip utama:
- **Tiada hukuman.** Jawapan salah mendapat galakan lembut, dan selepas dua kali salah, jawapan yang betul diserlahkan.
- **Tiada tekanan.** Tiada papan markah dan tiada persaingan dengan kanak-kanak lain.
- **Selamat.** Tiada iklan, sembang atau pautan sosial. Data disimpan dalam peranti sahaja.
- **Identiti tempatan.** Reka bentuknya bercorak Melayu Nusantara dan ada sentuhan Islamik.

## 2. 15 permainan

| # | Permainan | Kandungan | Mekanik utama |
|---|---|---|---|
| 1 | ABC Ceria | Huruf A–Z, huruf besar dan kecil, huruf awal gambar, eja perkataan | Pilih, padan, susun huruf, kad memori, surih huruf |
| 2 | Dunia Nombor | Nombor 1–20, kira objek, banding, tambah dan tolak bergambar | Ketik untuk mengira, padan nombor–kuantiti, susun nombor |
| 3 | Warna & Bentuk | Kenal warna dan bentuk, cari ikut warna, kelaskan, corak | Pilih, seret ke bakul, lengkapkan corak |
| 4 | Teka Bunyi | 35 bunyi haiwan, kenderaan, alam dan sekeliling | Dengar dan pilih, padankan audio dengan gambar |
| 5 | Puzzle Pintar | Jigsaw 2, 4, 6, 9 dan 12 keping, lengkapkan gambar hilang | Seret kepingan |
| 6 | Ingatan Hebat | Pasangan kad, ingat kedudukan, gambar hilang, susunan | Kad memori, ingat dan ulang urutan warna atau bentuk |
| 7 | Seni & Mewarna | Mewarna berpandu dan bebas, sambung titik, campuran warna | Mewarna, sambung titik, surih dan lukis dengan jari |
| 8 | Cari Bayang | Siluet, padan bayang, objek tersembunyi, cari perbezaan | Pilih, seret, cari dalam pemandangan |
| 9 | Maze Pengembaraan | Bantu watak ke destinasi, elak halangan, kutip objek | Seret watak, leret, atau butang arah |
| 10 | Kehidupan Harian | Anggota badan, pakaian ikut cuaca, makanan berkhasiat, rutin, kebersihan | Pilih, asingkan, susun urutan |
| 11 | Bijak Mengelaskan | Buah dan sayur, haiwan darat/air/udara, kenderaan, besar/kecil, panjang/pendek | Seret ke kumpulan, susun ikut saiz |
| 12 | Si Cilik Soleh | 29 huruf hijaiyah, 25 nabi, rukun Islam, rukun Iman, wuduk, adab, doa harian | Pilih, padan, susun urutan |
| 13 | Dunia Haiwan | Nama, habitat, makanan dan anak haiwan, kelaskan haiwan | Pilih, padan, asingkan |
| 14 | Asah Minda | Cari yang berbeza, corak, teka-teki, selesaikan masalah, urutan | Pilih, padan, susun |
| 15 | Misi Pengembaraan | Misi bercerita ke hutan, laut, angkasa dan ladang | Gabungan: cari, kira, maze, asingkan, puzzle |
| 17 | **Teka Silang Cilik** | Pendidikan awal Islam: Allah, rukun Islam & iman, solat, wuduk, doa, adab, keluarga, masjid, 25 nabi, kisah nabi, makanan halal, ciptaan Allah, Ramadan | Teka silang bergambar, huruf hilang, cari huruf, padan, bayang (tiada arahan bersuara; hanya suara pujian (tanpa suara) galakan) |
| 16 | **Cilik Racing** | Berlumba sambil belajar: huruf, nombor, warna, bentuk, haiwan, ejaan, memori, adab | Lumba 2.5D: tukar lorong, pintu jawapan, kutip, elak, pit stop |

### Cilik Racing — "Belajar, Pecut, Teroka!"
- Modul **berasingan** (`js/racing/`, gaya `css/racing.css`), dimuat hanya apabila dibuka melalui laluan `#/lumba`. Jika modul ini gagal dimuatkan, 15 permainan asal tetap boleh dimainkan.
- **10 dunia × 50 level = 500 level**: Litar Kampung, Lembah Buah, Hutan Haiwan, Bandar Warna, Taman Dinosaur, Pulau Ombak, Angkasa Ria, Negeri Gula-gula, Tapak Binaan Cilik dan Pulau Juara. Dunia seterusnya dibuka selepas 10 level di dunia sebelumnya.
- Kereta bergerak sendiri. Anak menukar lorong (butang ◀ ▶, leret, atau ketik sebelah kiri/kanan) dan boleh menekan butang Turbo.
- Mekanik pembelajaran: pintu huruf/nombor/jawapan, lorong warna, kutip objek mengikut bilangan, kutip bentuk, isyarat memori (kutip ikut urutan), pit stop ejaan, puzzle corak, checkpoint haiwan (soalan habitat, bunyi, makanan dan anak haiwan) serta misi campuran.
- **Tiada hukuman berat.** Jika anak melanggar halangan, kereta perlahan dan melantun sebentar. Jika jawapan salah, pintu baharu muncul di depan; selepas itu jawapan betul diberi cahaya dan anak panah. Ujian automatik memastikan semua 500 level boleh ditamatkan walaupun dipandu secara rawak.
- Level 1–10 ialah Pemandu Cilik (2 lorong), dan level 11–49 semakin mencabar (3–4 lorong, 2–5 cabaran). **Level 50 ialah Level Juara**: 5 cabaran, pusingan akhir dan trofi juara dunia.
- Ganjaran racing berasingan daripada ganjaran asal: bintang lumba, pingat gangsa/perak/emas bagi setiap dunia, trofi juara, 15 kereta mainan, cat, pelekat dan rim tayar. Tiada pembelian, kotak rawak atau leaderboard.
- Visual: jalan pseudo-3D berperspektif dengan bukit, selekoh, terowong, jambatan dan jalan terapung. Kereta, hiasan dan halangan dilukis sendiri dalam Canvas, dengan latar paralaks serta kesan zarah ringan. Muzik dunia dan bunyi enjin kartun mematuhi tetapan bunyi.
- Kemajuan disimpan dalam kunci storan sendiri (`dc-racing-v1`) dengan sandaran IndexedDB. Masa bermain racing dikira dalam had masa harian ibu bapa.

### Taman Akhlak — "Pilih yang baik, kebun pun mekar!"
- Modul **berasingan** (`js/akhlak/`, gaya `css/akhlak.css`) dengan laluan `#/akhlak`.
- **Kisah Pilihan (30 kisah):** situasi harian bergambar dan bersuara, seperti beri salam, makan dengan tangan kanan, berkongsi, jujur, minta maaf, tolong ibu, sayang haiwan, beratur, solat, bersedekah dan menjaga kebersihan. Anak memilih tindakan. Pilihan yang baik membuat watak gembira dan diikuti pengajaran ringkas. Pilihan yang kurang baik tidak dihukum; watak berasa sedih dan anak diajak cuba lagi.
- **Kebun Amal:** setiap kisah yang selesai menanam bunga mengikut kategori akhlak (sopan, rajin, keluarga, ibadah, jujur, alam). Pencapaian kebun: rama-rama, burung, kolam, pelangi, pondok dan "Kebun Mekar". Kebun ini tidak pernah layu (tiada tekanan, tiada streak).
- **Amal Hari Ini:** 10 kebaikan sebenar di rumah, contohnya beri salam, kemas mainan dan gosok gigi. Ibu atau bapa mengesahkannya melalui pintu ibu bapa, dan setiap amal menjadi buah di pokok kebun.
- Kemajuan disimpan dalam kunci sendiri (`dc-akhlak-v1`) dengan sandaran IndexedDB. Ibu bapa boleh mengunci modul ini dan set semula kemajuannya.

### Teka Silang Cilik — "Susun huruf, cari jawapan!"
- Modul **berasingan** (`js/tekasilang/`, gaya `css/tekasilang.css`) dengan laluan `#/silang`, dimuat hanya apabila dibuka.
- **15 chapter × 30 level = 450 level** pendidikan awal Islam, dari Allah Tuhan Kita hingga Si Cilik Soleh. Chapter seterusnya dibuka selepas 10 level di chapter sebelumnya.
- **10 mekanik:** A gambar ke perkataan, B huruf hilang, C huruf terapung, D silang mini, E silang bergambar, F padan perkataan, G bayang perkataan, H campuran, I cari huruf, J lengkapkan papan.
- Peringkat: level 1–5 perkataan pendek dengan bantuan penuh; level 6–10 huruf hilang dan cari huruf; level 11–15 silang mini; level 16–20 padan, huruf terapung dan campuran; level 21–25 silang 3 perkataan; level 26–29 papan 4–5 perkataan. **Level 30 ialah Chapter Master**, dengan papan besar, pingat dan pelekat chapter.
- **Tanpa suara.** Maklum balas hanya melalui visual dan kesan bunyi Web Audio (pop, tink, kilauan, melodi sambutan; bunyi salah yang lembut tanpa buzzer), dan semuanya mematuhi tetapan bunyi ibu bapa.
- Petunjuk berperingkat: sorotan lembut, kemudian kurangkan pilihan, kemudian bantu isi jawapan. Tiada nyawa, tiada kiraan masa, tiada "game over".
- Kosa kata kira-kira 340 perkataan berbeza (30+ setiap chapter), dengan ilustrasi SVG dilukis khas (kira-kira 250). Nabi tidak digambarkan; nama nabi dipaparkan pada papan nama, dan tiada ayat al-Quran dijadikan hiasan.
- Kemajuan disimpan dalam kunci sendiri (`dc-silang-v1`) dengan sandaran IndexedDB. Ibu bapa boleh mengunci permainan ini dan set semula kemajuannya.

## 3. Sistem level
- **50 level setiap permainan**, dibahagi kepada 5 peringkat:

  | Level | Peringkat | Ciri |
  |---|---|---|
  | 1–10 | Kenali | 2–3 pilihan, gambar besar |
  | 11–20 | Fahami | Lebih banyak pilihan, padanan |
  | 21–30 | Cekap | Memori, menyusun |
  | 31–40 | Bijak | Lebih banyak objek |
  | 41–50 | Juara Cilik | Gabungan kemahiran |

- **Cabaran Khas setiap 5 level**, iaitu satu pusingan tambahan yang menggabungkan kemahiran.
- Level dijana secara **berbiji** (*seeded*): setiap level sentiasa sama apabila dimainkan semula, tetapi berbeza daripada level lain. Setiap level mengandungi 2–6 pusingan.
- Level seterusnya dibuka selepas level sebelumnya selesai.

## 4. Ganjaran
- **1 bintang** bagi setiap jawapan betul.
- **10 syiling** bagi setiap level.
- **Bonus 25 syiling dan pelekat** setiap 5 level.
- **Trofi** setiap 10 level (75 trofi kesemuanya).
- **Sijil pencapaian yang boleh dicetak** selepas 50 level dalam satu permainan.
- **17 lencana pencapaian**.
- **Koleksi:** 50 pelekat, 16 avatar, 14 kostum (topi dan aksesori), dan **7 tema**. Semuanya ditukar dengan syiling permainan, bukan wang sebenar.
- **Cabaran Harian:** 5 permainan rawak setiap hari (ABC, nombor, memori, logik, pengetahuan am). Hadiahnya 30 syiling dan pelekat khas.
- **Main Bebas:** mewarna, melukis, papan bunyi, susun objek, puzzle pilihan sendiri, dan kamus bergambar. Tiada markah.

## 5. Ruang Ibu Bapa
Dilindungi soalan darab yang sukar dijawab oleh kanak-kanak.
- **Laporan:** jumlah masa bermain, level selesai, permainan paling kerap dimainkan, pencapaian setiap permainan, dan rekod harian serta mingguan.
- **Penilaian 77 kemahiran.** Ia mengambil kira ketepatan percubaan pertama, bilangan cubaan, masa menjawab, dan 10 pusingan terkini. Tahap penguasaan:
  - Belum dicuba
  - Sedang belajar
  - Hampir menguasai (≥60%, ≥3 pusingan)
  - Telah menguasai (≥85%, ≥6 pusingan)
  
  Ada juga **cadangan permainan** untuk kemahiran yang lemah.
- **Tetapan:**
  - Had masa bermain sehari (anak diminta berehat apabila tamat).
  - Bunyi, muzik, suara, getaran dan ucapan Islamik.
  - Kelajuan, nada dan ekspresi suara, serta pilihan suara.
  - Bahasa (BM atau dwibahasa).
  - Permainan yang dibenarkan, dan kunci kedai.
  - Profil untuk ramai anak.
  - Sandaran dan pemulihan data.

## 6. Reka bentuk: identiti Melayu Nusantara
- **Palet:** kunyit, pandan, cili, biru nila, terung, kayu dan krim.
- **Motif:** pucuk rebung (jalur segi tiga pada kad) dan corak songket.
- **Ikon 15 permainan dilukis khas** (bukan emoji): wau, papan congkak, ketupat, kompang, songket, canting batik, wayang kulit, batas sawah, rumah kampung, bakul anyaman, masjid, harimau Malaya, pelita dan perahu layar.
- **7 tema berlatar animasi:**

  | Tema | Harga |
  |---|---|
  | Kampung Ceria (lalai) | Percuma |
  | Taman Masjid | Percuma |
  | Klasik Lembut | Percuma |
  | Batik Laut | 120 syiling |
  | Songket Diraja | 150 syiling |
  | Malam Bulan | 180 syiling |
  | Kuih-muih | 240 syiling |

- **5 watak pemandu:** Mimi si Kucing, Bobo si Beruang, Coco si Arnab, Dino si Dinosaur dan Lala si Panda.
- **Responsif:** telefon kecil, telefon landskap (soalan di kiri, jawapan di kanan), serta tablet potret dan landskap.
- **Fon:** Baloo 2, disimpan dalam aplikasi.
- **Butang:** gaya 3D. Gambar kandungan dipaparkan sebagai pelekat.

## 7. Suara & percakapan
- **Suara:** semua arahan dibacakan dalam Bahasa Melayu. Aplikasi memilih suara wanita Bahasa Melayu yang terbaik pada peranti (melalui Web Speech API), dengan gaya lembut keibuan dan jeda semula jadi antara ayat.
- **Penormal teks Bahasa Melayu:** nombor, tarikh, masa, RM, peratus, pecahan, ordinal, unit, singkatan dan simbol dibaca dengan betul.
- **Ekspresi mengikut konteks:** arahan lembut, pujian ceria, galakan memujuk, dan doa tenang.
- **Percakapan semula jadi, seperti cikgu tadika:**
  - Jawapan disebut semula: "Kucing! Pandainya!", atau "Itik? Bukan yang itu. Cuba lagi, ya."
  - Petunjuk suara selepas dua kali salah.
  - Penyambung antara soalan: "Okey, jom seterusnya.", "Satu lagi, ini yang terakhir!"
  - Pujukan jika anak diam lama.
  - Pujian tidak berulang dua kali berturut-turut.
- **Pakej suara rakaman (sedia, belum diisi):** aplikasi boleh memainkan fail audio bagi setiap ayat (rakaman manusia atau suara neural) supaya suara sama pada semua peranti dan boleh luar talian. Ayat tanpa rakaman jatuh balik ke suara peranti.
  - Katalog mengandungi ±1,846 ayat, dibahagikan kepada Teras (±277), Awal (±622) dan Lengkap.
  - **Studio Rakaman** (`/studio/`) membolehkan ayat dirakam satu demi satu di telefon, kemudian dieksport sebagai satu ZIP.
- **Kesan bunyi dan 35 bunyi** (haiwan, kenderaan, alam) disintesis dengan Web Audio, jadi tiada fail audio diperlukan.

## 8. Sentuhan Islamik (boleh dimatikan)
- **Salam** di halaman utama.
- **"Bismillah"** sebelum memulakan level, dan **"Alhamdulillah"** apabila selesai.
- **"Insya-Allah"** dalam galakan.
- **Doa Hari Ini** di halaman utama, bertukar setiap hari.
- **Tema Taman Masjid.**
- **Doa:** 9 doa harian, hanya daripada al-Quran dan hadis sahih, dipaparkan bersama sumber, tulisan Arab, rumi dan maksud. Suara sintetik **tidak** membaca teks Arab.
- **Wuduk:** mengikut fardu wuduk.
- Kandungan agama disyorkan disemak oleh guru agama sebelum dijual.

## 9. Teknologi
- **PWA (Progressive Web App):** HTML, CSS dan JavaScript ES modules biasa, tanpa langkah binaan. Ia boleh dipasang di skrin utama Android dan iPhone, dan berfungsi **luar talian** melalui service worker.
- **Data:** IndexedDB dan localStorage (salinan berganda, yang terbaru digunakan). Kemajuan disimpan automatik dan tidak hilang semasa kemas kini.
- **Hos:** GitHub Pages. GitHub Actions menguji semua level sebelum menerbitkan.
- **Kemas kini automatik:** pengguna menerima versi baharu apabila membuka aplikasi. Muat semula tidak berlaku di tengah-tengah permainan.
- **Pengawal ralat:** jika berlaku ralat semasa bermain, anak tidak tersekat (mesej "Teruskan").
- **Ujian automatik:**
  - Struktur 750 level (jawapan wujud, maze boleh diselesaikan, tiada level berulang, tiada emoji dalam ayat suara).
  - Kesemua 750 level dimainkan dalam pelayar.
  - Ujian kemas kini daripada versi lama tanpa kehilangan data.
  - Ujian penormal teks dan pakej suara.
- **Struktur kod:**

  | Folder / fail | Kandungan |
  |---|---|
  | `js/data/` | Semua kandungan |
  | `js/modes/` | 15 penjana level |
  | `js/engines/` | 15 enjin mekanik |
  | `js/screens/` | Skrin-skrin aplikasi |
  | `js/audio.js` | Enjin suara |
  | `js/malay-text.js` | Penormal teks |
  | `js/talk.js` | Percakapan |
  | `js/theme.js` | Tema |
  | `studio/` | Studio Rakaman |
  | `jualan/` | Halaman jualan |

## 10. Halaman jualan & demo
- **Halaman jualan** (`/jualan/`): masalah → penyelesaian, **demo yang boleh dimainkan** dalam mockup telefon, 15 permainan, galeri mockup, ciri, Ruang Ibu Bapa, tema, Si Cilik Soleh, keselamatan, harga RM39, cara mendapatkan dan soalan lazim. Tiada testimoni atau kiraan detik palsu.
- **Butang beli** menggunakan satu pemboleh ubah `PAYMENT_URL` (untuk pautan ToyyibPay).
- **Mod demo** (`?demo`): 3 level pertama setiap permainan, storan berasingan, dan tanpa pendaftaran.

## 11. Batasan & kerja tertunggak (penting)
1. **Akses versi penuh belum dikawal.** Aplikasi penuh boleh dibuka oleh sesiapa yang tahu pautannya, dan repositori GitHub ialah awam. Sistem kod akses pembeli belum dibina.
2. **Suara bergantung pada peranti** sehingga pakej suara diisi (melalui rakaman manusia atau perkhidmatan seperti Google TTS atau ElevenLabs). Peranti tanpa suara Bahasa Melayu akan menggunakan suara Indonesia.
3. **Gambar kandungan** (haiwan, buah, objek) masih menggunakan emoji, yang rupanya sedikit berbeza antara peranti.
4. **Ujian hanya dijalankan dalam Chrome.** Perlu diuji pada iPhone dan iPad sebenar.
5. **Pautan ToyyibPay belum dimasukkan**, dan cara penghantaran akses kepada pembeli belum ditetapkan.
6. **Kandungan agama** perlu disemak oleh pihak bertauliah.
