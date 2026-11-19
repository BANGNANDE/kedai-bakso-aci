# SPEC — Kedai Bakso Aci (Katalog & Pesanan WhatsApp)

**Versi:** 1.0 (MVP latihan 1 hari)
**Tanggal:** 19 November 2026
**Stack:** Vite + JavaScript vanilla + HTML/CSS (tanpa framework, tanpa backend, tanpa login)
**Status dokumen:** Disetujui untuk implementasi

---

## 1. Tujuan

Membangun aplikasi web satu halaman untuk **Kedai Bakso Aci — Pasraman Unud Jimbaran** yang memungkinkan calon pembeli melihat katalog menu, mencari dan menyaring produk, lalu mengirim pesanan ke WhatsApp kedai dengan format pesan otomatis. Pengelola toko dapat mengelola menu dan stok melalui **dashboard demo** pada perangkat yang sama.

Tujuan pembelajaran (latihan 1 hari):

1. Melatih alur kerja analisis → desain data → implementasi → verifikasi manual.
2. Memakai stack minimal (Vite + vanilla JS) tanpa ketergantungan backend.
3. Menghasilkan aplikasi yang benar-benar bisa dipakai di lapangan (buka di ponsel, kirim pesanan ke WhatsApp).

**Non-tujuan:** sistem kasir, pembayaran online, manajemen pesanan masuk, atau akun pengguna.

---

## 2. Pengguna

| Persona | Kebutuhan utama | Konteks pemakaian |
|---|---|---|
| **Pembeli — mahasiswa** (mayoritas) | Lihat menu + harga cepat, cari menu, pesan tanpa antre/telepon | Ponsel, sering sebelum jam makan, koneksi tidak selalu cepat |
| **Pembeli — warga sekitar** | Cek stok/harga, pesan untuk dibungkus | Ponsel/desktop, jam buka Selasa–Minggu 11.00–21.00 WITA |
| **Pengelola toko (demo)** | Ubah harga/stok, tambah menu baru, tandai menu habis | Satu perangkat yang sama (tablet/ponsel kasir), tanpa login |

Karena hanya ada **satu perangkat** dan **tanpa login**, dashboard pengelola bukan sistem multi-pengguna. Dashboard ditandai jelas sebagai **Mode Demo** dan dapat dibuka siapa pun yang memegang perangkat tersebut. Ini keputusan sadar, bukan kelalaian keamanan.

**Info bisnis publik yang dipakai (satu-satunya data "nyata"):**
- Nama: Kedai Bakso Aci
- Alamat: Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran
- Jam buka: Selasa–Minggu, 11.00–21.00 WITA; Senin tutup
- Nomor WhatsApp pesanan: 6285858754176

Tidak ada data pribadi pelanggan yang disimpan di aplikasi. Nama pemesan (opsional) hanya dipakai untuk menyusun teks pesan WhatsApp dan tidak dikirim ke server mana pun.

---

## 3. Ruang Lingkup MVP

### 3.1 Fitur (F)

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-01 | Header & info toko | Nama kedai, alamat, jam buka, status "Buka Sekarang — Dine-in & Takeaway", tombol ke WhatsApp | Wajib |
| F-02 | Katalog produk | Grid kartu: gambar/placeholder lokal, nama, kategori, harga Rupiah, stok, badge "Unggulan/Best Seller" | Wajib |
| F-03 | Pencarian | Input cari berdasarkan nama dan deskripsi, tidak peka huruf besar/kecil | Wajib |
| F-04 | Filter kategori | Semua / Menu Utama / Ekstra Topping / Minuman (satu pilihan aktif) | Wajib |
| F-05 | Sorting | Nama A–Z, Nama Z–A, Harga termurah, Harga termahal | Wajib |
| F-06 | Pesan WhatsApp | Pilih jumlah porsi (dibatasi stok), tombol membuka `wa.me/6285858754176` dengan pesan terformat otomatis | Wajib |
| F-07 | Dashboard demo CRUD | Daftar produk dalam tabel, tambah, ubah, hapus (dengan konfirmasi), ubah stok cepat | Wajib |
| F-08 | Ringkasan stok | Total produk, total stok, jumlah produk habis, estimasi nilai stok, jumlah produk unggulan | Wajib |
| F-09 | Penyimpanan lokal | Semua perubahan produk tersimpan di `localStorage`, bertahan setelah reload | Wajib |
| F-10 | Reset data demo | Tombol mengembalikan 8 produk contoh ke kondisi awal | Wajib |
| F-11 | Placeholder gambar lokal | 8 SVG lokal di `public/img/`, fallback otomatis bila `imageUrl` gagal dimuat | Wajib |
| F-12 | Data pemesan ringan | Input nama pemesan (opsional) + metode Dine-in/Takeaway, dipakai pada teks WhatsApp | Wajib |
| F-13 | Empty & error state | Pesan jelas saat hasil filter kosong, stok habis, atau data lokal rusak | Wajib |

### 3.2 Alur utama pembeli

1. Buka halaman → katalog tampil dengan 8 produk, status toko terlihat.
2. Cari "mercon" atau pilih filter **Menu Utama** → daftar menyempit.
3. Ubah sorting ke **Harga termurah** → urutan berubah.
4. Isi nama pemesan (opsional), pilih metode **Bungkus**.
5. Atur jumlah porsi pada kartu (maksimal = stok; tombol `+` nonaktif di batas stok).
6. Klik **Pesan via WhatsApp** → WhatsApp terbuka dengan pesan berisi produk, jumlah, harga satuan, subtotal, metode, nama, dan alamat kedai.
7. Pengguna menekan kirim di WhatsApp (langkah ini di luar aplikasi).

### 3.3 Alur utama pengelola (demo)

1. Klik tautan **Kelola Menu (Demo)** di header → tampilan dashboard.
2. Lihat ringkasan (total produk/stok, produk habis, estimasi nilai stok).
3. Tambah produk baru lewat form → muncul di katalog dan tabel.
4. Ubah harga/stok → katalog ikut berubah.
5. Hapus produk → muncul konfirmasi → produk hilang dari katalog dan tabel.
6. Reload halaman → semua perubahan masih ada.

### 3.4 Keputusan desain yang disengaja

- **Tanpa keranjang multi-item.** Sesuai MVP, pesanan dikirim per produk (satu item per pesan WhatsApp). Keranjang, modal kustomisasi (level pedas, topping, catatan), dan struk digital **tidak** termasuk MVP ini (lihat §8).
- **Stok tidak berkurang otomatis** saat pesanan WhatsApp dikirim. Aplikasi tidak tahu apakah pesanan jadi dikirim/diproses; pengelola menurunkan stok manual di dashboard.
- **Status "Buka Sekarang" dihitung dari jam perangkat** (WITA) dan hari. Di luar jam operasional atau hari Senin, badge berubah menjadi **"Tutup"** beserta jam buka berikutnya. Tidak ada panggilan jaringan.
- **Tanpa login palsu.** Tidak ada form login, token, atau sesi tiruan. Dashboard adalah tampilan demo dengan banner peringatan.

---

## 4. Data Model

### 4.1 Entitas `Product`

| Field | Tipe | Aturan validasi | Contoh |
|---|---|---|---|
| `id` | string | unik, tidak kosong. Dibuat sekali saat produk dibuat, tidak berubah saat edit. Format `p-<timestamp>-<acak 4>` atau `crypto.randomUUID()` | `"p-1732000000000-a1b2"` |
| `nama` | string | wajib, 3–60 karakter, di-trim | `"Boci Mix Bakso Sapi"` |
| `kategori` | string (enum) | salah satu: `"Menu Utama"`, `"Ekstra Topping"`, `"Minuman"` | `"Menu Utama"` |
| `harga` | number | bilangan bulat, `>= 0`, maks 1.000.000; disimpan sebagai angka Rupiah tanpa titik | `16000` |
| `stok` | number | bilangan bulat, `>= 0`, maks 9.999 | `20` |
| `deskripsi` | string | opsional, maks 160 karakter | `"Bakso sapi, aci, kuah gurih, chili oil."` |
| `imageUrl` | string | opsional; path lokal (`/img/...`) atau URL `https://`. Bila kosong/gagal → placeholder | `"/img/boci-mix.svg"` |
| `unggulan` | boolean | `true`/`false` | `true` |

Catatan: `harga` dan `stok` **wajib** berupa angka di state, bukan string. Konversi dilakukan di satu tempat saat submit form.

### 4.2 Bentuk data di `localStorage`

Kunci: `kba:products:v1`

```json
{
  "version": 1,
  "updatedAt": "2026-11-19T04:00:00.000Z",
  "products": [ { "id": "p-1", "nama": "…", "kategori": "Menu Utama", "harga": 12000, "stok": 25, "deskripsi": "…", "imageUrl": "/img/…svg", "unggulan": false } ]
}
```

Kunci tambahan: `kba:prefs:v1` → `{ "namaPemesan": "", "metode": "dine-in" }` (opsional, hanya kenyamanan; boleh hilang tanpa merusak aplikasi).

**Aturan baca-tulis:**
1. Saat start: baca kunci → parse → validasi setiap item dengan aturan §4.1. Item tidak valid dibuang; bila hasil akhir kosong atau parse gagal → pakai data seed dan tulis ulang.
2. Setiap operasi CRUD langsung menulis seluruh array (dataset kecil, tidak perlu migrasi rumit).
3. Bila `localStorage` tidak tersedia (mode privat/quota penuh) → aplikasi tetap berjalan dengan data di memori + banner "Perubahan tidak tersimpan".
4. `version` dibaca; versi tak dikenal → reset ke seed dengan konfirmasi.

### 4.3 Data seed (8 produk)

Harga mengikuti daftar menu resmi latihan. Semua gambar memakai SVG lokal.

| # | Nama | Kategori | Harga | Stok | Unggulan | imageUrl |
|---|---|---|---|---|---|---|
| 1 | Bakso Aci Original | Menu Utama | 12.000 | 25 | tidak | `/img/bakso-aci-original.svg` |
| 2 | Boci Mix Bakso Sapi | Menu Utama | 16.000 | 20 | **ya** (Best Seller) | `/img/boci-mix.svg` |
| 3 | Bakso Aci Tulang Rangu | Menu Utama | 15.000 | 15 | tidak | `/img/tulang-rangu.svg` |
| 4 | Bakso Aci Komplit Mercon | Menu Utama | 18.000 | 12 | **ya** | `/img/komplit-mercon.svg` |
| 5 | Paket Ekstra Topping Cuanki & Pilus | Ekstra Topping | 5.000 | 30 | tidak | `/img/topping-cuanki-pilus.svg` |
| 6 | Sambal Chili Oil Spesial | Ekstra Topping | 5.000 | 40 | tidak | `/img/sambal-chili-oil.svg` |
| 7 | Josua / Extra Joss Susu | Minuman | 6.000 | 24 | tidak | `/img/josua.svg` |
| 8 | Es Teh Manis | Minuman | 4.000 | 50 | tidak | `/img/es-teh.svg` |

Total stok awal: **216**. Estimasi nilai stok awal: **Rp1.755.000** (Σ harga × stok).
Deskripsi singkat wajib diisi untuk tiap produk (1 kalimat, nonpribadi, tanpa klaim kesehatan).

### 4.4 State aplikasi (sisi klien)

```
products: Product[]            // sumber kebenaran, disinkronkan ke localStorage
filter: { q, kategori, sort }  // tidak dipersistensi (kecuali diinginkan; default: "", "Semua", "nama-asc")
prefs: { namaPemesan, metode } // dipersistensi ke kba:prefs:v1
qtyDraft: Record<id, number>   // jumlah porsi per kartu, default 1, tidak dipersistensi
```

Katalog yang dirender = `products` → filter kategori → pencarian (nama + deskripsi) → sort. Semua perhitungan dilakukan ulang setiap state berubah (tanpa cache).

### 4.5 Format pesan WhatsApp

Nomor tujuan: **6285858754176** (tanpa `+`, tanpa spasi).
URL: `https://wa.me/6285858754176?text=<encodeURIComponent(pesan)>`

Template (satu produk per pesan):

```
Halo Kedai Bakso Aci, saya mau pesan:

• {nama} x{qty} = Rp{subtotal}
Harga satuan: Rp{harga}

Total: Rp{total}
Metode: {Dine-in | Bungkus/Takeaway}
Nama pemesan: {nama atau "-"}

Alamat: Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran
Jam buka: Selasa–Minggu 11.00–21.00 WITA

Terima kasih!
```

Aturan:
- Angka diformat `Intl.NumberFormat("id-ID")` → `Rp16.000` (tanpa spasi setelah Rp).
- `subtotal = harga × qty`; `total = subtotal` (belum ada ongkir/pajak).
- Bila stok 0 → tombol pesan nonaktif, label "Stok habis".
- Bila `qtyDraft` melebihi stok (mis. stok diturunkan di tab lain) → clamp ke stok saat tombol diklik.
- Pesan tidak berisi data pribadi selain nama yang diketik sendiri oleh pengguna.

### 4.6 Aturan validasi form dashboard

| Field | Wajib | Aturan | Pesan error |
|---|---|---|---|
| Nama | ya | 3–60 karakter | "Nama produk 3–60 karakter." |
| Kategori | ya | salah satu dari 3 nilai | "Pilih kategori." |
| Harga | ya | angka bulat ≥ 0 | "Harga harus angka ≥ 0." |
| Stok | ya | angka bulat ≥ 0 | "Stok harus bilangan bulat ≥ 0." |
| Deskripsi | tidak | ≤ 160 karakter | "Deskripsi maksimal 160 karakter." |
| ImageUrl | tidak | diawali `/` atau `https://` | "Gunakan path lokal atau URL https." |

Error ditampilkan inline di bawah field; form tidak dikirim bila ada error; fokus otomatis ke field pertama yang salah.

---

## 5. Non-Functional Requirements

| ID | Kategori | Requirement | Cara cek |
|---|---|---|---|
| NFR-01 | Performa | Muat pertama < 1,5 dtk di localhost; total aset < 500 KB (SVG + CSS + JS); tanpa CDN, font eksternal, atau library tambahan | DevTools Network, ukur `dist/` |
| NFR-02 | Responsif | Layout benar pada lebar 360, 768, 1024, 1440 px tanpa scroll horizontal | Resize / device toolbar |
| NFR-03 | Aksesibilitas | Semua kontrol dapat dioperasikan keyboard; `focus-visible` terlihat; label form terkait (`for`/`id`); kontras teks ≥ 4.5:1; gambar punya `alt` | Tab melalui halaman, cek kontras |
| NFR-04 | Keandalan data | Reload tidak kehilangan perubahan; data rusak tidak membuat halaman blank | Ubah data → reload; isi localStorage dengan JSON rusak → reload |
| NFR-05 | Keamanan | Tidak ada API key/secret di repo; input pengguna dirender sebagai teks (bukan `innerHTML` mentah) untuk mencegah XSS; tidak ada `eval`; tautan WA memakai `encodeURIComponent` | Cari `eval`, `innerHTML`, `apikey`; uji nama `<img onerror=…>` |
| NFR-06 | Privasi | Tidak ada analytics, cookie pihak ketiga, atau permintaan jaringan selain aset lokal dan `wa.me` saat diklik | Network tab |
| NFR-07 | Kompatibilitas | Chrome/Edge/Firefox/Safari versi terkini (2 rilis terakhir) | Uji minimal 2 browser |
| NFR-08 | Maintainability | Struktur file datar & jelas; satu modul untuk data/storage; fungsi render terpisah dari handler; tanpa dependensi runtime | Review kode |
| NFR-09 | Aksesibilitas konten | Teks bahasa Indonesia, harga selalu berformat Rupiah, tanggal/jam memakai WITA | Inspeksi visual |
| NFR-10 | Offline-tolerant | Halaman tetap terbuka setelah load pertama tanpa jaringan (aset lokal); WhatsApp jelas butuh jaringan | DevTools offline setelah load |

---

## 6. Arsitektur & Struktur File

```
/
├─ index.html
├─ package.json
├─ vite.config.js
├─ public/
│  └─ img/
│     ├─ bakso-aci-original.svg
│     ├─ boci-mix.svg
│     ├─ tulang-rangu.svg
│     ├─ komplit-mercon.svg
│     ├─ topping-cuanki-pilus.svg
│     ├─ sambal-chili-oil.svg
│     ├─ josua.svg
│     ├─ es-teh.svg
│     └─ placeholder.svg
└─ src/
   ├─ main.js          // bootstrap, routing hash, render
   ├─ data.js          // seed + validasi + baca/tulis localStorage
   ├─ catalog.js       // filter, search, sort, kartu produk, WA link
   ├─ dashboard.js     // tabel, form CRUD, ringkasan
   ├─ utils.js         // formatRupiah, escape, clamp, jam buka
   └─ style.css
```

- **Routing:** hash sederhana — `#/` (katalog), `#/kelola` (dashboard). Perubahan hash memicu render ulang; tombol back browser berfungsi.
- **Rendering:** template string + `textContent` untuk data dinamis; listener dipasang lewat event delegation pada container.
- **Tidak ada framework, router library, atau state library.** Semua di `main.js` + modul kecil.

---

## 7. Risiko

| # | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| R-01 | `localStorage` dibersihkan browser / mode privat → data hilang | Perubahan pengelola hilang | Sedang | Deteksi kegagalan tulis + banner; tombol reset seed; dokumentasi di UI |
| R-02 | Dua tab terbuka bersamaan → data saling menimpa (last write wins) | Stok/harga tidak konsisten | Rendah | Dokumentasikan batasan; dengar event `storage` untuk render ulang; tidak menjanjikan sinkronisasi real-time |
| R-03 | XSS melalui nama/deskripsi produk di dashboard demo | Eksekusi skrip di perangkat kasir | Rendah | Escape semua data saat render; uji payload `<script>` |
| R-04 | Nomor WhatsApp salah/tidak aktif | Pesanan tidak terkirim | Rendah | Nomor dikonfigurasi di satu konstanta; verifikasi manual sekali sebelum demo |
| R-05 | Stok tidak berkurang otomatis setelah pesanan | Pesanan melebihi stok tersedia | Tinggi | Jelas di UI ("stok dikelola manual"); pengelola menurunkan stok di dashboard |
| R-06 | Status buka salah karena jam perangkat/WITA | Info menyesatkan | Sedang | Hitung dengan offset WITA (UTC+8) eksplisit, bukan zona lokal perangkat; tampilkan jam buka tertulis |
| R-07 | Gambar gagal dimuat | Kartu terlihat rusak | Rendah | Handler `error` → `/img/placeholder.svg`; SVG lokal agar tidak bergantung jaringan |
| R-08 | Waktu 1 hari habis sebelum dashboard selesai | Fitur wajib tidak lengkap | Sedang | Urutan iterasi: katalog + WA dulu (§8), dashboard setelahnya; cutoff pada jam yang disepakati |
| R-09 | Harga/stok desimal/negatif masuk lewat form | Perhitungan kacau | Rendah | Validasi tipe + batas di §4.6, dinormalisasi sebelum simpan |
| R-10 | Nomor WA berisi karakter aneh saat di-encode | Link rusak | Rendah | `encodeURIComponent` + uji pesan dengan emoji/baris baru |

---

## 8. Out of Scope

Tidak dikerjakan pada MVP ini:

1. Backend, database, API, serverless function.
2. Login/autentikasi/otorisasi nyata (tidak ada akun, token, atau "login demo").
3. Pembayaran online, QRIS, atau integrasi payment gateway.
4. Keranjang multi-item, modal kustomisasi level pedas/topping, dan struk digital (kemungkinan iterasi lanjutan).
5. Pengurangan stok otomatis setelah pesanan WhatsApp terkirim.
6. Notifikasi pesanan masuk, status pesanan, riwayat pesanan, atau dashboard pesanan.
7. Upload gambar dari perangkat (hanya path/URL teks + SVG bawaan).
8. Multi-outlet, multi-bahasa, PWA/service worker, mode gelap, animasi kompleks.
9. Analitik, SEO lanjutan, sitemap, deployment produksi.
10. Data pelanggan, ulasan, atau fitur loyalitas.

---

## 9. Acceptance Criteria (dapat diperiksa manual)

Prasyarat semua uji: `npm install && npm run dev`, buka `http://localhost:5173` di Chrome, lalu **DevTools → Application → Local Storage → Clear** dan reload sekali.

### Katalog & info toko

| ID | Langkah manual | Hasil yang diharapkan |
|---|---|---|
| AC-01 | Buka halaman utama | Terlihat nama "Kedai Bakso Aci", alamat "Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran", jam "Selasa–Minggu 11.00–21.00 WITA", keterangan "Senin Tutup", dan badge status buka/tutup yang sesuai jam WITA saat diuji |
| AC-02 | Hitung kartu produk | Tepat **8 kartu**, masing-masing punya gambar, nama, kategori, harga `Rp` bergaris titik, stok, dan badge pada 2 produk unggulan |
| AC-03 | Cek harga | Bakso Aci Original `Rp12.000`, Boci Mix `Rp16.000`, Tulang Rangu `Rp15.000`, Komplit Mercon `Rp18.000`, topping `Rp5.000`, Sambal `Rp5.000`, Josua `Rp6.000`, Es Teh `Rp4.000` |
| AC-04 | Lihat gambar di Network tab | Semua gambar berasal dari `/img/*.svg` lokal (status 200), tidak ada permintaan ke domain eksternal saat halaman dibuka |

### Pencarian, filter, sorting

| ID | Langkah manual | Hasil yang diharapkan |
|---|---|---|
| AC-05 | Ketik `mercon` di kolom cari | Hanya kartu yang nama/deskripsinya mengandung "mercon" yang tampil; hasil berubah saat mengetik, tanpa reload |
| AC-06 | Ketik `MERCON` (huruf besar) | Hasil sama dengan AC-05 (tidak peka huruf besar/kecil) |
| AC-07 | Ketik `xyz` | Muncul empty state "Menu tidak ditemukan" + tombol "Reset filter" yang mengembalikan semua kartu |
| AC-08 | Pilih filter **Minuman** | Hanya 2 kartu minuman tampil; pilih **Ekstra Topping** → 2 kartu; **Semua** → 8 kartu |
| AC-09 | Pilih sorting **Harga termurah** | Harga urut naik (4.000 → 18.000); **Harga termahal** urut turun; **Nama A–Z** alfabetis naik |
| AC-10 | Kombinasikan cari `bakso` + filter **Menu Utama** + sorting termahal | Hasil hanya produk menu utama yang mengandung "bakso", urut dari harga tertinggi; tidak ada error di console |

### Pesan WhatsApp

| ID | Langkah manual | Hasil yang diharapkan |
|---|---|---|
| AC-11 | Klik `+` pada kartu Bakso Aci Original sampai 3 | Angka porsi jadi 3; subtotal kartu berubah menjadi `Rp36.000` |
| AC-12 | Klik `Pesan via WhatsApp` pada produk tersebut | Tab baru membuka `wa.me/6285858754176`; pesan berisi nama produk, `x3`, harga satuan `Rp12.000`, total `Rp36.000`, metode, nama pemesan (`-` bila kosong), dan alamat kedai; baris baru tampil rapi |
| AC-13 | Isi nama "Rina", pilih **Bungkus**, lalu pesan Es Teh Manis qty 1 | Pesan berisi "Metode: Bungkus/Takeaway", "Nama pemesan: Rina", total `Rp4.000` |
| AC-14 | Set stok produk menjadi 0 lewat dashboard, kembali ke katalog | Tombol pesan nonaktif bertuliskan "Stok habis"; tombol `+` tidak bisa menambah porsi |
| AC-15 | Naikkan porsi hingga batas stok | Tombol `+` nonaktif tepat di angka stok; nilai tidak pernah melebihi stok |

### Dashboard demo & CRUD

| ID | Langkah manual | Hasil yang diharapkan |
|---|---|---|
| AC-16 | Klik **Kelola Menu (Demo)** | Halaman `#/kelola` tampil dengan banner "Mode Demo", tabel 8 produk, dan ringkasan: `Total produk: 8`, `Total stok: 216`, `Produk habis: 0`, estimasi nilai stok `Rp1.755.000` |
| AC-17 | Tambah produk: nama "Es Jeruk", kategori Minuman, harga 5000, stok 10, deskripsi diisi | Produk muncul di tabel dan di katalog sebagai kartu ke-9; harga tampil `Rp5.000` |
| AC-18 | Submit form kosong / harga `-1` / stok `2,5` | Form tidak terkirim dan muncul pesan error inline pada field terkait |
| AC-19 | Ubah Boci Mix: harga 17000, stok 5 | Tabel dan kartu katalog menampilkan `Rp17.000` dan stok 5; ringkasan total stok berkurang sesuai |
| AC-20 | Hapus Es Teh Manis | Muncul dialog konfirmasi; setelah dikonfirmasi, produk hilang dari tabel dan katalog; setelah dibatalkan, produk tetap ada |
| AC-21 | Klik `-`/`+` stok cepat di tabel | Stok berubah 1 langkah tanpa membuka form; tidak bisa di bawah 0; katalog ikut berubah |
| AC-22 | Tandai produk sebagai unggulan lewat form | Badge "Best Seller/Unggulan" muncul di kartu katalog |
| AC-23 | Reload halaman di `#/kelola` lalu buka `#/` | Semua perubahan (tambah/ubah/hapus) masih ada; filter kembali ke default |

### Reset, penyimpanan, dan ketahanan

| ID | Langkah manual | Hasil yang diharapkan |
|---|---|---|
| AC-24 | Klik **Reset data demo** | Konfirmasi muncul; setelah disetujui, 8 produk seed kembali, ringkasan kembali ke total stok 216 |
| AC-25 | Isi `localStorage["kba:products:v1"]` dengan `{rusak` lalu reload | Aplikasi tidak blank; data seed dipakai dan pesan pemulihan tampil (toast/banner) |
| AC-26 | Tambah produk dengan nama `<img src=x onerror="alert(1)">` | Teks tampil apa adanya di tabel/kartu; tidak ada alert; tidak ada elemen `img` yang dieksekusi |
| AC-27 | Buka DevTools Network, klik semua tombol, cek Console | Tidak ada error; tidak ada permintaan jaringan selain aset lokal dan `wa.me` setelah tombol pesan diklik |
| AC-28 | Uji lebar 360 px dan 1440 px | Tidak ada scroll horizontal; tombol dan teks tetap terbaca; drawer/tabel dapat dipakai |

**Definition of Done:** AC-01 s/d AC-28 lulus manual; tidak ada error console; perubahan tidak hilang setelah reload; `npm run build` sukses.

---

## 10. Implementation Plan per Iterasi (1 hari)

Asumsi: 1 pengembang, total jam kerja efektif ±7 jam + 1 jam buffer demo. Setiap iterasi diakhiri dengan AC terkait lulus sebelum lanjut.

### Iterasi 0 — Fondasi (60 menit)
- Scaffold Vite vanilla (`npm create vite@latest . -- --template vanilla`), bersihkan boilerplate.
- Struktur folder §6, `style.css` dasar, palet warna (merah cabai `#C0392B`, oranye `#F28C28`, krem `#FFF6E9`), tipografi sistem.
- Buat 8 SVG placeholder + `placeholder.svg`.
- **Selesai bila:** `npm run dev` jalan, halaman kosong tanpa error, aset SVG dapat dibuka.

### Iterasi 1 — Data & katalog baca-saja (150 menit)
- `data.js`: seed 8 produk, validasi, `loadProducts`/`saveProducts`, fallback data rusak.
- `utils.js`: `formatRupiah`, `escapeHtml`, `clamp`, hitung status buka WITA.
- Header + info toko + status buka (F-01), grid kartu katalog (F-02, F-11).
- Ringkasan kecil di katalog (opsional: jumlah menu).
- **AC target:** AC-01 s/d AC-04, AC-25.

### Iterasi 2 — Pencarian, filter, sorting (90 menit)
- State filter + render ulang, debounce ±150 ms.
- Empty state + reset filter; kontrol kategori dan sorting.
- **AC target:** AC-05 s/d AC-10, AC-28.

### Iterasi 3 — Pesanan WhatsApp (75 menit)
- Prefs nama pemesan + metode (F-12), stepper qty per kartu dengan batas stok.
- Builder pesan + `encodeURIComponent`, tombol nonaktif saat stok 0.
- **AC target:** AC-11 s/d AC-15, AC-27.

### Iterasi 4 — Dashboard demo CRUD & ringkasan (135 menit)
- Route `#/kelola`, banner Mode Demo, tabel produk.
- Form tambah/ubah dengan validasi §4.6, hapus + konfirmasi, stok cepat, toggle unggulan.
- Ringkasan (F-08), reset seed (F-10), banner kegagalan `localStorage`.
- **AC target:** AC-16 s/d AC-24.

### Iterasi 5 — Pengerasan & demo (60 menit)
- Uji XSS (AC-26), perbaikan aksesibilitas (fokus, label, `alt`), rapikan copy.
- `npm run build` + `npm run preview`, cek ukuran bundle.
- Jalankan seluruh AC-01–AC-28, catat hasil di tabel uji manual.
- Siapkan skrip demo 3 menit (buka katalog → cari → pesan → dashboard → reload).
- **Selesai bila:** Definition of Done terpenuhi; buffer 60 menit dipakai untuk perbaikan temuan.

**Cutoff:** bila waktu tersisa < 60 menit sebelum batas, hentikan fitur baru dan selesaikan hanya AC yang belum lulus pada katalog + WhatsApp; dashboard ditandai "demo terbatas" di UI.

---

## 11. Pertanyaan Terbuka (perlu konfirmasi sebelum/saat implementasi)

1. Apakah harga menu sudah final (Rp12.000–Rp18.000) atau perlu disesuaikan dengan papan menu terbaru?
2. Apakah "Sambal Chili Oil Spesial" dijual per porsi atau per jar — memengaruhi label satuan pada kartu?
3. Apakah perlu field `satuan` (porsi/botol/paket) di model produk, atau cukup di deskripsi?
4. Apakah pesanan via WhatsApp perlu menyebut waktu pengambilan yang diinginkan?

Selama belum dijawab, implementasi memakai asumsi yang tercatat di §4 dan menampilkan satuan "porsi" untuk semua produk.
