# 🌈 Dunia Cilik

**Belajar Sambil Bermain, Bijak Sambil Meneroka.**

Aplikasi permainan pendidikan interaktif untuk kanak-kanak berumur 4–5 tahun. Ia dibina sebagai Progressive Web App (PWA): boleh dipasang di skrin utama telefon/tablet Android, berfungsi luar talian, dan semua kemajuan disimpan dalam peranti.

## Cara menjalankan

```bash
npm start            # = python3 -m http.server 8080
# buka http://localhost:8080
```

Tiada langkah binaan diperlukan. Aplikasi ini hanya menggunakan HTML, CSS dan JavaScript (ES modules) biasa. Untuk dipasang sebagai aplikasi, hoskan folder ini pada HTTPS (contohnya GitHub Pages, Netlify atau Firebase Hosting), kemudian pilih **"Tambah ke skrin utama"** dalam Chrome Android.

## Kandungan

| # | Mod | Mekanik utama |
|---|-----|---------------|
| 1 | 🔤 ABC Ceria | ketik pilih, seret padan huruf besar/kecil, susun huruf, eja perkataan, memori, surih huruf |
| 2 | 🔢 Dunia Nombor | kira objek (ketik untuk mengira), padan nombor–kuantiti, banding, tambah/tolak bergambar, susun nombor |
| 3 | 🎨 Warna & Bentuk | kenal warna/bentuk, cari ikut warna, seret padan bentuk, kelaskan ke bakul, corak |
| 4 | 🎵 Teka Bunyi | teka bunyi haiwan/kenderaan/alam, padan audio dengan gambar |
| 5 | 🧩 Puzzle Pintar | jigsaw 2/4/6/9/12 keping, lengkapkan gambar hilang |
| 6 | 🧠 Ingatan Hebat | kad memori, ingat kedudukan, gambar hilang, ulang susunan warna/bentuk (Simon), ingat urutan |
| 7 | 🖍️ Seni & Mewarna | mewarna berpandu & bebas, sambung titik, surih dengan jari, lukis bebas, campuran warna |
| 8 | 👤 Cari Bayang | siluet, padan bayang, cari objek tersembunyi, cari perbezaan |
| 9 | 🧭 Maze Pengembaraan | grid berhalangan → labirin berdinding → kutip objek (seret watak, leret, butang arah) |
| 10 | 🏡 Kehidupan Harian | anggota badan, pakaian ikut cuaca, makanan berkhasiat, susun rutin, kebersihan |
| 11 | 🗂️ Bijak Mengelaskan | buah/sayur, haiwan darat/air/udara, kenderaan, besar/kecil, panjang/pendek, kategori |
| 12 | 🕌 Si Cilik Soleh | hijaiyah, 25 nabi, rukun Islam, rukun Iman, wuduk, adab, doa harian |
| 13 | 🦁 Dunia Haiwan | nama, habitat, makanan, anak haiwan, kelaskan haiwan |
| 14 | 💡 Asah Minda | cari yang berbeza, corak, teka-teki, selesaikan masalah, pasangan sesuai, urutan |
| 15 | 🚀 Misi Pengembaraan | misi bercerita di hutan/laut/angkasa/ladang: kumpul → kira → jalan → bantu rakan |

* **750 level** (50 setiap mod) dijana secara berbiji (*seeded*). Setiap level sentiasa sama apabila dimainkan semula, tetapi berbeza daripada level lain.
* **5 peringkat:** Kenali (1–10), Fahami (11–20), Cekap (21–30), Bijak (31–40), Juara Cilik (41–50). Bilangan pilihan, saiz grid/maze, bilangan kepingan dan panjang urutan meningkat secara beransur-ansur.
* **Cabaran Khas** setiap 5 level, dengan satu pusingan tambahan yang menggabungkan kemahiran.

## Ciri-ciri lain

* **Ganjaran:** 1 bintang bagi setiap jawapan betul, syiling bagi setiap level, bonus dan pelekat setiap 5 level, trofi setiap 10 level, sijil (boleh dicetak) selepas 50 level, 17 lencana pencapaian, serta avatar, kostum dan 7 tema bercorak tempatan (Kampung Ceria, Taman Masjid, Batik Laut, Songket Diraja, Malam Bulan, Kuih-muih, Klasik Lembut) yang boleh ditukar dengan syiling. Tiada wang sebenar digunakan.
* **Tiada hukuman:** jawapan salah mendapat galakan ("Bagus, cuba sekali lagi!"). Selepas dua kali salah, jawapan yang betul akan diserlahkan sebagai petunjuk.
* **Audio:** suara Bahasa Melayu melalui Web Speech API (`ms-MY`, dengan sandaran `id-ID`), kesan bunyi, dan 35 bunyi haiwan/kenderaan/alam yang disintesis dengan Web Audio supaya berfungsi luar talian. Muzik latar juga disediakan. Arahan boleh dimainkan semula (🔊 atau ketik karakter) dan semua bunyi boleh dimatikan.
* **Suara lembut keibuan:** aplikasi memilih suara wanita Bahasa Melayu yang terbaik pada peranti secara automatik (contohnya Yasmin Natural dalam Edge, Amira pada iPhone), dengan gaya "Lembut keibuan" dan jeda semula jadi antara ayat. Ibu bapa boleh mendengar dan memilih suara lain di Ruang Ibu Bapa → Tetapan.
* **Cabaran Harian:** 5 permainan rawak setiap hari (ABC, nombor, memori, logik, pengetahuan am) dengan hadiah khas.
* **Sentuhan Islamik** (boleh dimatikan di Ruang Ibu Bapa): salam di halaman utama, "Bismillah" sebelum memulakan level, "Alhamdulillah" dan "Masya-Allah" apabila berjaya, "Insya-Allah" sebagai galakan, kad Doa Hari Ini (doa sahih bersama sumber) dan tema Taman Masjid.
* **Main Bebas:** mewarna, lukis, papan bunyi, susun objek, puzzle pilihan sendiri, dan teroka gambar. Tiada markah.
* **Ruang Ibu Bapa** (dilindungi soalan darab): ringkasan, pencapaian setiap mod, penguasaan setiap kemahiran (Belum dicuba, Sedang belajar, Hampir menguasai, Telah menguasai), cadangan permainan, rekod harian/mingguan, had masa bermain, kawalan bunyi/muzik/suara, bahasa (BM atau dwibahasa BM + English), akses mod, kunci kedai, pengurusan profil, serta sandaran dan pemulihan data.
* **Keselamatan:** tiada iklan, pautan sosial, sembang atau pembelian. Hanya nama panggilan dan umur disimpan, dan data tidak pernah meninggalkan peranti.

## Kemas kini & kestabilan

* **Pautan kekal sama.** Setiap kali kod ditolak ke cabang utama, GitHub Actions menguji kesemua 750 level dan kemudian menerbitkan semula ke alamat yang sama. Pengguna sedia ada menerima versi baharu secara automatik apabila membuka aplikasi. Muat semula tidak berlaku di tengah-tengah level.
* **Kemajuan tidak hilang** semasa kemas kini. Data disimpan dua kali dalam peranti (IndexedDB dan localStorage, dan salinan paling baharu digunakan), dan pelayar diminta untuk tidak memadamnya.
* **Jangan tukar alamat** (nama repositori, nama pengguna GitHub atau domain). Data anak terikat pada alamat. Jika alamat berubah, pengguna perlu "Simpan sandaran" dan "Pulihkan sandaran" dari Ruang Ibu Bapa.
* **Ralat tidak dijangka** semasa bermain memaparkan mesej "Teruskan" supaya anak tidak tersekat.
* Ujian kemas kini (`npm run test:upgrade`) memasang versi pertama, bermain, menerbitkan versi terkini pada alamat yang sama (meniru cache GitHub Pages), dan mengesahkan kemajuan kekal, kemas kini automatik berfungsi, dan aplikasi boleh dimainkan tanpa internet.

## Struktur kod

```
index.html, manifest.webmanifest, sw.js   PWA + luar talian
css/app.css, css/ui2.css                    reka bentuk asas + lapisan antara muka v2 (butang 3D, responsif, tema)
fonts/                                      fon Baloo 2 (disimpan untuk luar talian, lesen OFL)
js/icons.js                                 set ikon SVG untuk butang (konsisten pada semua peranti)
js/main.js, nav.js                          penghala (hash)
js/store.js                                 IndexedDB + localStorage, profil, kemajuan, penilaian
js/audio.js                                 TTS, kesan bunyi, bunyi sintesis, muzik
js/rewards.js                               bintang, syiling, trofi, sijil, lencana
js/data/content.js, art.js                  SEMUA kandungan (mudah disunting/ditambah)
js/engines/*                                15 enjin mekanik (choice, match, sort, slots, memory,
                                            recall, simon, puzzle, maze, color, dots, trace, draw, find, diff)
js/modes/*                                  15 mod + penjana level
js/screens/*                                skrin-skrin aplikasi
```

**Menambah kandungan:** tambah item dalam `js/data/content.js`. Penjana level akan menggunakannya secara automatik.
**Menambah aktiviti:** tambah fungsi penjana dalam objek `gens` mod berkenaan, kemudian masukkan namanya dalam `tiers`.

## Ujian

```bash
npm run test:gen               # sahkan struktur kesemua 750 level (jawapan wujud, maze boleh diselesaikan, tiada level berulang)
npm run test:e2e               # main 105 level sebenar dalam Chromium + uji semua skrin
node tests/e2e.test.mjs --all  # main kesemua 750 level
npm run test:upgrade           # uji kemas kini dari versi lama tanpa kehilangan data
node tools/build-sw.mjs        # kemas kini senarai cache luar talian selepas menukar fail
```

## Nota kandungan agama

Doa harian hanya menggunakan lafaz daripada al-Quran atau hadis sahih, dan setiap doa dipaparkan bersama rujukan sumbernya (contohnya al-Bukhari, Muslim, Surah Taha:114). Langkah wuduk mengikut fardu wuduk (mazhab Syafi'i). Sebutan teks Arab tidak dibacakan oleh suara sintetik. Kami mengesyorkan kandungan ini disemak semula oleh guru agama atau pihak berautoriti sebelum diterbitkan.
