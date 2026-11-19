# TASKS — Kedai Bakso Aci

**Versi:** 1.0
**Tanggal:** 19 November 2026
**Mengacu pada:** `SPEC.md` v1.0 (F-01…F-13, NFR-01…NFR-10, AC-01…AC-28) dan `UI-SPEC.md` v1.0 (token §2, komponen §5, aksesibilitas A-01…A-16, checklist U-01…U-24)
**Status:** Rencana eksekusi — belum ada kode aplikasi yang ditulis
**Stack:** Vite + JavaScript vanilla + HTML/CSS, tanpa backend, tanpa login, tanpa API key

> Dokumen ini adalah daftar pekerjaan, bukan implementasi. Setiap centang `[ ]` diisi saat tugas benar-benar selesai dan kriterianya terbukti.

---

## 0. Cara Memakai Dokumen Ini

1. Kerjakan berurutan M1 → M10. Prasyarat ditulis eksplisit; jangan melompati M6 sebelum M7 karena pengujian penyimpanan butuh lapisan storage.
2. Satu tugas selesai = semua kotak `AC-T…` di tugas itu tercentang **dan** ada bukti (perintah, angka, atau tangkapan layar). "Terlihat benar" bukan bukti.
3. ID kriteria penerimaan tugas memakai pola `AC-T<milestone>.<tugas>.<nomor>` agar bisa dirujuk di commit dan laporan uji.
4. Sebelum menjalankan uji manual: buka DevTools → Application → Local Storage → hapus kunci `kba:products:v1` dan `kba:prefs:v1`, lalu reload. Data awal harus kembali ke 8 produk seed.
5. Tanda **W** = wajib untuk demo; **T** = tambahan yang diminta pada brief milestone ini (tidak ada di `SPEC.md`).

### 0.1 Konvensi status

| Status | Arti |
|---|---|
| `[ ]` | Belum dikerjakan |
| `[x]` | Selesai, bukti tercatat |
| `[~]` | Selesai sebagian / diblokir (tulis alasannya di `TESTING.md`) |

### 0.2 Definition of Done satu tugas

- Kode berjalan tanpa error di console saat alur tugas diuji.
- Semua `AC-T` lulus dengan bukti yang bisa diulang orang lain.
- Tidak menambah dependensi runtime baru tanpa mencatat alasannya.
- Tidak ada `TODO` yang menggantung di jalur yang dipakai demo.

---

## 1. Ringkasan Milestone

| # | Milestone | Estimasi | Prasyarat | Target SPEC | Target UI | Sifat |
|---|---|---|---|---|---|---|
| M1 | Scaffold proyek | 45 mnt | — | NFR-01, NFR-08 | §2, §3, §11 | W |
| M2 | Implementasi katalog | 120 mnt | M1 | AC-01…AC-04, AC-28 | U-01, U-04, U-07, U-08 | W |
| M3 | Pencarian, filter, sorting | 60 mnt | M2 | AC-05…AC-10, AC-28 | U-11…U-13, U-22 | W |
| M4 | Tombol pesan WhatsApp | 75 mnt | M2, M3 | AC-11…AC-15, AC-27 | U-14, U-15 | W |
| M5 | CRUD dashboard pengelola | 120 mnt | M2 | AC-16…AC-22, AC-24 | U-16…U-21 | W |
| M6 | Integrasi localStorage | 45 mnt | M2, M5 | AC-23, AC-24, AC-25 | — | W |
| M7 | Pengujian manual | 45 mnt | M1…M6 | AC-01…AC-28 | U-01…U-24 | W |
| M8 | Keamanan dasar & aksesibilitas | 45 mnt | M2…M7 | NFR-03, NFR-05, AC-26 | A-01…A-16 | W |
| M9 | Build production | 20 mnt | M7, M8 | NFR-01, DoD | — | W |
| M10 | Deployment | 40 mnt | M9 | §8 butir 9 (diamandemen) | — | T |
| | **Total** | **± 10 jam 15 mnt** | | | | |

**Catatan waktu:** `SPEC.md` §10 merencanakan ± 7 jam + 1 jam buffer untuk 6 iterasi. Rencana 10 milestone ini menambah keamanan, pengujian terdokumentasi, build, dan deployment, sehingga melebihi anggaran 1 hari. Lihat §5 untuk cut line.

---

## 2. Konflik Dokumen yang Harus Diselesaikan Saat Eksekusi

Empat hal berikut sudah diputuskan di sini agar implementasi tidak berhenti di tengah jalan.

| # | Konflik | Keputusan untuk eksekusi |
|---|---|---|
| K-01 | `SPEC.md` §10 Iterasi 0 menyebut palet `#C0392B`, `#F28C28`, `#FFF6E9`; `UI-SPEC.md` §2.1 memakai token final `#B3261E`, `#FFF9F0`, `#2F6B3A`, dst. | **UI-SPEC §2.1 menang.** Hex di `SPEC.md` §10 adalah versi lama dan tidak dipakai. Token didefinisikan sekali di `:root`; komponen tidak menulis hex langsung. |
| K-02 | `SPEC.md` §8 butir 9 menyatakan deployment produksi *out of scope*; brief milestone 10 memintanya. | M10 dikerjakan sebagai **tambahan pasca-demo**. Saat M10 dimulai, ubah `SPEC.md` §8 butir 9 menjadi "deployment statis (GitHub Pages/Netlify) termasuk, tanpa backend". |
| K-03 | Brief M1 menyebut "instalasi dependensi (misal: ikon)"; NFR-01/NFR-08 melarang CDN dan dependensi runtime. | **Tanpa paket ikon.** Semua ikon adalah inline SVG 20×20/24×24 (UI-SPEC §2.4). Bila kelak benar-benar perlu paket ikon, hanya sebagai devDependency yang di-inline saat build, dan anggaran aset M9 harus tetap lulus. |
| K-04 | Brief M7 menyebut "pastikan stok berkurang/bertambah saat CRUD"; model tidak mengurangi stok otomatis setelah pesanan WhatsApp (R-05, AC-14). | Stok hanya berubah lewat **dashboard**: form ubah, tombol `−`/`+` cepat, atau reset. Tidak ada pengurangan otomatis saat tombol WA diklik. Penguji tidak boleh mengharapkan stok turun setelah mengirim pesan. |

Konvensi lain yang dipakai konsisten: kategori "Topping" pada brief = nilai enum **`Ekstra Topping`**; berkas gaya tetap **`src/style.css`** (bukan `style.css` di root) mengikuti `SPEC.md` §6.

---

## 3. Milestone 1 — Scaffold Proyek (W, ± 45 mnt)

**Tujuan:** proyek Vite vanilla berjalan, struktur direktori sesuai `SPEC.md` §6, token desain dasar terpasang, dan 9 ilustrasi SVG lokal tersedia.

### T1.1 — Inisialisasi Vite & bersihkan boilerplate

- **Langkah:** jalankan `npm create vite@latest . -- --template vanilla`; pastikan `package.json` punya `dev`, `build`, `preview`; hapus `counter.js`, `javascript.svg`, dan kode penghitung bawaan; pindahkan `main.js` + `style.css` ke `src/` dan perbarui `<script type="module" src="/src/main.js">`.
- **Kriteria Penerimaan:**
  - [ ] AC-T1.1.1 `npm install` selesai dengan exit code 0 dan menghasilkan `package-lock.json`.
  - [ ] AC-T1.1.2 `npm run dev` melayani `http://localhost:5173` dengan status HTTP 200 dan tanpa error di terminal.
  - [ ] AC-T1.1.3 `npm run build` selesai exit code 0 dan menghasilkan `dist/index.html`.
  - [ ] AC-T1.1.4 Tidak ada lagi teks "Vite + JavaScript" / tombol `count` bawaan di DOM; console browser bersih (0 error, 0 warning 404).
- **Berkas:** `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `src/main.js`, `src/style.css`; dihapus: `src/counter.js`, `src/javascript.svg`, `public/vite.svg`.

### T1.2 — Struktur direktori & kerangka HTML semantik

- **Langkah:** buat `src/data.js`, `src/catalog.js`, `src/dashboard.js`, `src/utils.js`, `public/img/` (boleh kosong dulu); susun `index.html` dengan `lang="id"`, `<meta name="viewport">`, `<title>`, deskripsi, skip link "Lewati ke menu", serta landmark `header`, `nav`, `main`, `footer`; sediakan satu wadah `#app` untuk kedua tampilan.
- **Kriteria Penerimaan:**
  - [ ] AC-T1.2.1 `document.documentElement.lang === "id"` dan `<title>` memuat "Kedai Bakso Aci".
  - [ ] AC-T1.2.2 `document.querySelectorAll("header,nav,main,footer").length === 4` dan hanya ada satu `<main>`.
  - [ ] AC-T1.2.3 Skip link adalah elemen pertama yang menerima fokus saat `Tab` ditekan dari address bar; saat diaktifkan, fokus berpindah ke area katalog.
  - [ ] AC-T1.2.4 Pada lebar 360 px, `document.documentElement.scrollWidth === clientWidth` (belum ada konten pun).
- **Berkas:** `index.html`, `src/main.js`, `src/style.css`, `src/data.js` (baru, kosong/berisi kontrak), `src/catalog.js`, `src/dashboard.js`, `src/utils.js`.

### T1.3 — Kebijakan dependensi & aset eksternal

- **Langkah:** pastikan `dependencies` kosong; hanya `devDependencies` Vite; tulis aturan aset di `README.md` (tanpa CDN, tanpa webfont, ikon inline SVG); cek tidak ada URL eksternal di HTML/CSS/JS selain `https://wa.me/`.
- **Kriteria Penerimaan:**
  - [ ] AC-T1.3.1 `package.json` → `"dependencies"` tidak ada atau `{}`; `npm ls --omit=dev --depth=0` hanya menampilkan proyek.
  - [ ] AC-T1.3.2 `grep -RIn "https\\?://" index.html src public` tidak menemukan domain selain `wa.me` (komentar/dokumentasi tidak dihitung).
  - [ ] AC-T1.3.3 Tidak ada `@font-face` dengan `src: url(http…)` dan tidak ada `<link>` ke Google Fonts/CDN.
- **Berkas:** `package.json`, `README.md` (baru), `index.html`, `src/style.css`.

### T1.4 — Token desain, reset, dan tipografi dasar

- **Langkah:** definisikan seluruh token `UI-SPEC.md` §2.1–§2.3 sebagai CSS custom properties di `:root` (`--bg`, `--surface`, `--surface-warm`, `--border`, `--text`, `--text-muted`, `--chili`, `--chili-dark`, `--chili-soft`, `--leaf`, `--leaf-soft`, `--leaf-ink`, `--amber`, `--amber-ink`, `--disabled-bg`, `--focus`, skala `--fs-*`, `--sp-*`, radius, bayangan); reset box-sizing, margin; atur font system stack; gaya `:focus-visible` (ring 3 px + halo 2 px); blok `prefers-reduced-motion`.
- **Kriteria Penerimaan:**
  - [ ] AC-T1.4.1 `getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() === "#FFF9F0"` dan `--chili === "#B3261E"`.
  - [ ] AC-T1.4.2 Body memakai `font-family` yang dimulai `system-ui`; tidak ada permintaan font di Network tab.
  - [ ] AC-T1.4.3 Elemen fokus pertama menampilkan ring 3 px berwarna `#2B1A12` pada `:focus-visible` (diperiksa di DevTools).
  - [ ] AC-T1.4.4 Dengan `prefers-reduced-motion: reduce` aktif, `transition-duration` elemen = `0s`.
- **Berkas:** `src/style.css`.

### T1.5 — Ilustrasi SVG lokal (8 produk + placeholder)

- **Langkah:** buat 9 SVG flat 4:3 (800×600) di `public/img/` dengan nama sesuai `SPEC.md` §4.3: `bakso-aci-original.svg`, `boci-mix.svg`, `tulang-rangu.svg`, `komplit-mercon.svg`, `topping-cuanki-pilus.svg`, `sambal-chili-oil.svg`, `josua.svg`, `es-teh.svg`, `placeholder.svg`; latar `--surface-warm`, tanpa teks di dalam gambar, tanpa referensi eksternal.
- **Kriteria Penerimaan:**
  - [ ] AC-T1.5.1 Tepat 9 berkas `.svg` di `public/img/`; tidak ada nama lain yang tertinggal.
  - [ ] AC-T1.5.2 Setiap berkas < 15 KB dan total folder < 150 KB (`du -sk`).
  - [ ] AC-T1.5.3 Setiap berkas dapat dibuka lewat dev server dengan status 200 dan tampil utuh di browser.
  - [ ] AC-T1.5.4 Tidak ada `href`/`src` ke domain eksternal di dalam SVG.
- **Berkas:** `public/img/*.svg` (9 berkas baru).

### T1.6 — Verifikasi fondasi

- **Kriteria Penerimaan:**
  - [ ] AC-T1.6.1 `npm run build` exit 0 dan total `dist/` < 100 KB (belum ada data).
  - [ ] AC-T1.6.2 `git status --short` hanya menampilkan berkas yang memang bagian scaffold (tidak ada `node_modules`, `dist`).
  - [ ] AC-T1.6.3 `.gitignore` memuat `node_modules` dan `dist`.
- **Berkas:** `.gitignore`, `README.md`.

**Selesai bila:** dev server jalan, halaman kosong tanpa error, 9 SVG dapat diakses, token terpasang. → lanjut M2.

---

## 4. Milestone 2 — Implementasi Katalog (W, ± 120 mnt)

**Tujuan:** 8 produk seed tampil sebagai grid kartu dari data model, lengkap dengan hero, info toko, status buka WITA, dan styling krem/merah cabai/hijau daun jeruk yang responsif.

### T2.1 — Modul data: model, seed, dan validasi

- **Langkah:** tulis `data.js` berisi konstanta 8 produk sesuai `SPEC.md` §4.3 (id unik, nama, kategori enum, harga angka, stok angka, deskripsi ≤ 160 karakter, `imageUrl` lokal, `unggulan`); tulis `isValidProduct()` yang memeriksa tipe dan batas §4.1; sediakan `getProducts()` yang untuk sementara mengembalikan salinan seed (belum persistensi).
- **Kriteria Penerimaan:**
  - [ ] AC-T2.1.1 Panjang seed = 8; semua `id` unik dan tidak kosong; semua `nama` unik.
  - [ ] AC-T2.1.2 Setiap produk memiliki 8 field dengan tipe benar (`harga`/`stok` number integer, `unggulan` boolean); `harga` 0…1.000.000; `stok` 0…9.999.
  - [ ] AC-T2.1.3 Σ `stok` = **216**; Σ (`harga` × `stok`) = **1.755.000**; jumlah `unggulan` = **2**.
  - [ ] AC-T2.1.4 Semua `imageUrl` cocok dengan berkas yang ada di `public/img/`; semua `deskripsi` 1…160 karakter.
  - [ ] AC-T2.1.5 `isValidProduct()` mengembalikan `false` untuk harga negatif, stok desimal, kategori asing, dan nama < 3 karakter (diuji lewat console).
- **Berkas:** `src/data.js`, `src/utils.js`.

### T2.2 — Utilitas format & waktu WITA

- **Langkah:** implementasikan `formatRupiah`, `escapeHtml`/pembuat teks aman, `clamp`, `hitungStatusBuka(now)` dengan offset WITA (UTC+8) eksplisit (bukan zona perangkat), serta label "buka berikutnya".
- **Kriteria Penerimaan:**
  - [ ] AC-T2.2.1 `formatRupiah(16000) === "Rp16.000"`, `formatRupiah(0) === "Rp0"`, `formatRupiah(1755000) === "Rp1.755.000"`.
  - [ ] AC-T2.2.2 `clamp(5, 1, 3) === 3`, `clamp(0, 1, 3) === 1`, `clamp(2, 1, 3) === 2`.
  - [ ] AC-T2.2.3 Status untuk Selasa 10.59 WITA = tutup, Selasa 11.00 = buka, Minggu 20.59 = buka, Minggu 21.00 = tutup, Senin 12.00 = tutup.
  - [ ] AC-T2.2.4 Saat tutup, label menyebut buka berikutnya dengan benar ("Buka Selasa 11.00 WITA" untuk Senin, "Buka besok 11.00 WITA" untuk malam hari).
  - [ ] AC-T2.2.5 Perhitungan tidak berubah saat zona waktu perangkat diubah ke UTC-5 (diuji dengan `new Date` tetap).
- **Berkas:** `src/utils.js`, `src/data.js` (bila konstanta jam ditaruh di sana).

### T2.3 — Render grid katalog dari data

- **Langkah:** buat `renderKatalog()` yang membangun kartu dengan `createElement` + `textContent` (bukan `innerHTML` untuk data dinamis); setiap kartu memuat gambar 4:3, badge unggulan bila `unggulan`, nama, chip kategori, deskripsi 2 baris, harga, chip stok, stepper (statis dahulu), dan tombol WA (nonaktif sampai M4); pasang handler `error` gambar → `/img/placeholder.svg`; beri atribut Hook stabil (`data-product-card`, `data-id`) untuk pengujian.
- **Kriteria Penerimaan:**
  - [ ] AC-T2.3.1 `document.querySelectorAll("[data-product-card]").length === 8` setelah halaman dimuat.
  - [ ] AC-T2.3.2 Setiap kartu memuat `img[alt="Ilustrasi <nama>"]`, nama, kategori, harga berformat `Rp`, dan teks stok ("Stok N" / "Sisa N" / "Stok habis").
  - [ ] AC-T2.3.3 Tepat 2 kartu menampilkan badge "Best Seller"; tidak ada kartu lain yang menampilkannya.
  - [ ] AC-T2.3.4 Produk dengan `stok` 1–5 menampilkan "Sisa N"; `stok` 0 menampilkan "Stok habis" dan gambar `filter: grayscale`.
  - [ ] AC-T2.3.5 Saat salah satu `imageUrl` diubah menjadi path rusak, gambar berganti ke `/img/placeholder.svg` dan tidak ada error tak tertangani di console.
  - [ ] AC-T2.3.6 Urutan default = nama A–Z (Bakso Aci Komplit Mercon, Bakso Aci Original, Bakso Aci Tulang Rangu, Boci Mix Bakso Sapi, Es Teh Manis, Josua / Extra Joss Susu, Paket Ekstra Topping Cuanki & Pilus, Sambal Chili Oil Spesial).
- **Berkas:** `src/catalog.js` (baru), `src/main.js`, `src/data.js`, `index.html`.

### T2.4 — Hero, info toko, dan status buka

- **Langkah:** render hero dua kolom (≥ 900 px) / bertumpuk (mobile) berisi chip status, H1, subhero, alamat, jam + "Senin tutup", CTA "Lihat Menu" (scroll ke katalog) dan "Pesan via WhatsApp" (pesan umum); footer dengan nama, alamat, jam, nomor `+62 858-5875-4176`, catatan mode demo; ilustrasi hero `alt=""` + `aria-hidden="true"`.
- **Kriteria Penerimaan:**
  - [ ] AC-T2.4.1 Teks persis tersedia: "Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran", "Selasa–Minggu 11.00–21.00 WITA", "Senin tutup", dan nomor tampilan `+62 858-5875-4176`.
  - [ ] AC-T2.4.2 Chip status menampilkan "Buka Sekarang" atau "Tutup — buka …" sesuai jam WITA saat pengujian, disertai ikon (bukan warna saja).
  - [ ] AC-T2.4.3 Klik "Lihat Menu" menggulir hingga judul katalog terlihat dan fokus berpindah ke elemen katalog (atau `scrollIntoView` terbukti di posisi target).
  - [ ] AC-T2.4.4 Tautan WA hero membuka `https://wa.me/6285858754176` dengan pesan umum ter-encode; `target="_blank"` dan `rel="noopener"`.
- **Berkas:** `src/main.js`, `src/catalog.js`, `src/utils.js`, `index.html`, `src/style.css`.

### T2.5 — Styling katalog & responsif

- **Langkah:** terapkan anatomi kartu `UI-SPEC.md` §5.3 (radius 16, border, `shadow-sm`, hover `shadow-md` + naik 2 px), grid 1/2/3 kolom, gutter 16/24/32 px, container maks 1180 px; semua warna lewat token; target sentuh ≥ 44 px.
- **Kriteria Penerimaan:**
  - [ ] AC-T2.5.1 Kolom grid = 1 pada 360 px, 2 pada 700 px, 3 pada 1000 px dan 1440 px (dibaca dari `grid-template-columns`).
  - [ ] AC-T2.5.2 Tidak ada scroll horizontal (`scrollWidth === clientWidth`) pada 360, 768, 1024, 1440 px.
  - [ ] AC-T2.5.3 Tinggi tombol dan stepper ≥ 44 px (diukur `getBoundingClientRect`).
  - [ ] AC-T2.5.4 Lateral: tidak ada deklarasi `#` hex di `src/style.css` di luar blok `:root` (kecuali `rgba()` untuk bayangan).
  - [ ] AC-T2.5.5 Kartu dengan `stok` 0 memakai latar tombol `--disabled-bg` dan teks `--text-muted`; kontras teks tersebut ≥ 4,5:1.
- **Berkas:** `src/style.css`, `src/catalog.js`.

### T2.6 — Verifikasi katalog terhadap SPEC

- **Kriteria Penerimaan:**
  - [ ] AC-T2.6.1 AC-01, AC-02, AC-03, AC-04 lulus (dicatat di `TESTING.md` saat M7; untuk M2 cukup dicentang dengan bukti sementara).
  - [ ] AC-T2.6.2 Network tab saat muat pertama hanya meminta aset dari origin sendiri; tidak ada domain eksternal.
  - [ ] AC-T2.6.3 Console bersih setelah halaman dimuat dan digulir sampai bawah.
- **Berkas:** `TESTING.md` (dibuat sebagai draf), `src/*`.

**Selesai bila:** 8 kartu tampil dengan harga dan stok benar, hero lengkap, responsif tanpa scroll horizontal, dan aset tetap lokal.

---

## 5. Milestone 3 — Pencarian & Filter (W, ± 60 mnt)

**Tujuan:** pencarian nama/deskripsi, filter kategori, dan sorting bekerja real-time tanpa reload, dengan empty state yang bisa dipulihkan.

### T3.1 — Pipeline filter di `catalog.js`

- **Langkah:** buat `terapkanFilter(products, { q, kategori, sort })` murni (tanpa efek samping): normalisasi `q` ke huruf kecil + trim, cocokkan `nama` **dan** `deskripsi`, filter kategori (`Semua` = semua), lalu urutkan (nama asc/desc dengan `localeCompare("id")`, harga asc/desc); hasil mengembalikan array baru.
- **Kriteria Penerimaan:**
  - [ ] AC-T3.1.1 `q="mercon"` mengembalikan "Bakso Aci Komplit Mercon" dan hanya produk yang nama/deskripsinya memuat "mercon".
  - [ ] AC-T3.1.2 `q="MERCON"` menghasilkan array id yang sama persis dengan `q="mercon"`.
  - [ ] AC-T3.1.3 `kategori="Minuman"` → 2 item; `"Ekstra Topping"` → 2 item; `"Semua"` → 8 item.
  - [ ] AC-T3.1.4 Sort harga asc → elemen pertama `4000`, terakhir `18000`; desc → kebalikannya; nama asc/desc konsisten untuk 8 item.
  - [ ] AC-T3.1.5 Kombinasi `q="bakso"` + `"Menu Utama"` + harga desc menghasilkan hanya produk Menu Utama yang memuat "bakso", urut dari `18000` turun.
  - [ ] AC-T3.1.6 Fungsi tidak memutasi array `products` asli (dibandingkan sebelum/sesudah).
- **Berkas:** `src/catalog.js`.

### T3.2 — Kontrol toolbar: pencarian, chip kategori, sorting

- **Langkah:** tambahkan input pencarian 44 px dengan ikon, label sr-only, tombol `×` 44×44; chip kategori `Semua` / `Menu Utama` / `Ekstra Topping` / `Minuman` dengan `aria-pressed`; `<select>` sorting berlabel "Urutkan" dengan 4 opsi; baris "Menampilkan {n} menu" sebagai `aria-live="polite"`; debounce 150 ms; `Esc` dan `×` mengosongkan pencarian serta mengembalikan fokus ke input.
- **Kriteria Penerimaan:**
  - [ ] AC-T3.2.1 Mengetik "mercon" menyaring kartu tanpa reload; jumlah pada baris hasil sama dengan jumlah kartu.
  - [ ] AC-T3.2.2 Mengetik cepat 10 karakter menghasilkan paling banyak satu render setelah 150 ms idle (dibuktikan dengan penghitung render sementara).
  - [ ] AC-T3.2.3 Hanya satu chip ber-`aria-pressed="true"`; mengklik chip lain memindahkan status aktif dan memperbarui hasil.
  - [ ] AC-T3.2.4 `Esc` saat fokus di input mengosongkan nilai, memulihkan 8 kartu, dan fokus tetap di input.
  - [ ] AC-T3.2.5 `×` hanya terlihat saat input berisi teks, berukuran ≥ 44×44, dan bekerja sama seperti `Esc`.
  - [ ] AC-T3.2.6 Mengubah sorting tidak mengubah filter/pencarian yang sedang aktif.
- **Berkas:** `src/main.js`, `src/catalog.js`, `index.html` (bila toolbar ada di markup), `src/style.css`.

### T3.3 — Empty state & reset filter

- **Langkah:** tampilkan state kosong "Menu tidak ditemukan" + "Coba kata kunci lain atau reset filter." + tombol "Reset filter"; tombol mengosongkan `q`, mengembalikan kategori ke `Semua`, sorting ke `Nama A–Z`, dan fokus ke input pencarian.
- **Kriteria Penerimaan:**
  - [ ] AC-T3.3.1 `q="xyz"` menampilkan tepat satu empty state dan 0 kartu; toolbar tetap terlihat.
  - [ ] AC-T3.3.2 Klik "Reset filter" memulihkan 8 kartu, chip `Semua` aktif, sorting `Nama A–Z`, input kosong, dan fokus di input.
  - [ ] AC-T3.3.3 Empty state juga muncul saat filter kategori valid menghasilkan 0 item (mis. stok semua minuman dihapus) dan reset tetap berfungsi.
- **Berkas:** `src/catalog.js`, `src/main.js`, `src/style.css`.

### T3.4 — Styling toolbar & sticky mobile

- **Kriteria Penerimaan:**
  - [ ] AC-T3.4.1 Di 360 px toolbar menempel di bawah navbar (`top` = tinggi navbar) dan chip dapat digeser horizontal tanpa membuat halaman ikut bergulir horizontal.
  - [ ] AC-T3.4.2 Chip aktif tidak terpotong di tepi layar 360 px.
  - [ ] AC-T3.4.3 Semua kontrol toolbar dapat difokuskan dengan `Tab` dan ring fokus terlihat (U-10, U-24 sebagian).
- **Berkas:** `src/style.css`.

**Selesai bila:** AC-05…AC-10 lulus dan empty state dapat dipulihkan tanpa reload.

---

## 6. Milestone 4 — Tombol Pesan WhatsApp (W, ± 75 mnt)

**Tujuan:** setiap kartu dapat memesan produk dengan jumlah porsi yang dibatasi stok, membuka `wa.me/6285858754176` dengan pesan terformat sesuai `SPEC.md` §4.5.

### T4.1 — Preferensi pemesan (nama + metode)

- **Langkah:** tambahkan input "Nama pemesan (opsional)" (maks 40 karakter) dan toggle Dine-in / Bungkus; simpan ke `localStorage["kba:prefs:v1"]` bila tersedia (kegagalan diabaikan diam-diam, bukan error); nilai awal `""` dan `dine-in`.
- **Kriteria Penerimaan:**
  - [ ] AC-T4.1.1 Mengisi "Rina" + memilih Bungkus lalu reload mempertahankan kedua nilai.
  - [ ] AC-T4.1.2 Nama > 40 karakter terpotong atau ditolak dengan pesan; karakter `<`/`>` tidak merusak tampilan.
  - [ ] AC-T4.1.3 Bila `localStorage.setItem` dilempar error, halaman tetap berfungsi dan tidak ada error tak tertangani.
- **Berkas:** `src/main.js`, `src/catalog.js`, `src/utils.js`, `index.html`, `src/style.css`.

### T4.2 — Stepper porsi per kartu

- **Langkah:** tombol `−` / `+` 44×44, angka tabular, `aria-label="Jumlah porsi <nama>"`; min 1, maks = `stok`; `−` nonaktif di 1; `+` nonaktif di batas stok dan memakai `aria-disabled`; stok 0 → seluruh stepper nonaktif; state `qtyDraft` per id, default 1, tidak dipersistensi.
- **Kriteria Penerimaan:**
  - [ ] AC-T4.2.1 Default setiap kartu = 1 porsi.
  - [ ] AC-T4.2.2 Menekan `+` tiga kali pada Bakso Aci Original (stok 25) menampilkan angka 4 dan teks subtotal `Rp48.000`.
  - [ ] AC-T4.2.3 `+` nonaktif tepat pada angka = stok; nilai tidak pernah melebihi stok meski tombol ditekan berulang.
  - [ ] AC-T4.2.4 `−` nonaktif pada 1; nilai tidak pernah < 1.
  - [ ] AC-T4.2.5 Setelah stok produk diubah menjadi 0 di dashboard, stepper dan tombol pesan nonaktif, label "Stok habis".
  - [ ] AC-T4.2.6 Mengubah porsi satu kartu tidak mengubah porsi kartu lain.
- **Berkas:** `src/catalog.js`, `src/main.js`, `src/style.css`.

### T4.3 — Penyusun pesan & URL WhatsApp

- **Langkah:** buat `buatPesanWhatsApp(product, qty, prefs)` yang menghasilkan template `SPEC.md` §4.5 persis (baris baru `\n`, bullet `•`, total, metode, nama atau `-`, alamat, jam); buat URL `https://wa.me/6285858754176?text=` + `encodeURIComponent(pesan)`; tombol berupa `<a target="_blank" rel="noopener noreferrer">` agar tidak diblokir popup.
- **Kriteria Penerimaan:**
  - [ ] AC-T4.3.1 `new URL(href)` memiliki `hostname === "wa.me"` dan `pathname === "/6285858754176"`.
  - [ ] AC-T4.3.2 `decodeURIComponent(new URL(href).searchParams.get("text"))` memuat baris: `• <nama> x<qty> = Rp<subtotal>`, `Harga satuan: Rp<harga>`, `Total: Rp<total>`, `Metode: …`, `Nama pemesan: …`, alamat lengkap.
  - [ ] AC-T4.3.3 Nama "Rina" + Bungkus + Es Teh qty 1 → pesan memuat "Metode: Bungkus/Takeaway", "Nama pemesan: Rina", "Total: Rp4.000".
  - [ ] AC-T4.3.4 Nama kosong → "Nama pemesan: -".
  - [ ] AC-T4.3.5 Nama berisi emoji dan `&`/`#` tetap utuh setelah decode; panjang URL < 2.000 karakter.
  - [ ] AC-T4.3.6 Pesan tidak pernah memuat kata `undefined`, `NaN`, atau `null`.
- **Berkas:** `src/catalog.js`, `src/utils.js`.

### T4.4 — Aksi klik & batas stok

- **Langkah:** pada klik, clamp `qtyDraft` ke `stok` terkini, bila stok 0 cegah navigasi dan tampilkan label "Stok habis"; tidak mengurangi stok (lihat K-04); tidak ada modal perantara.
- **Kriteria Penerimaan:**
  - [ ] AC-T4.4.1 Klik tombol pesan membuka tab `wa.me` baru; tab aplikasi tetap di halaman.
  - [ ] AC-T4.4.2 Bila qty di state 5 lalu stok diubah menjadi 2 di tab lain, pesan yang dibuat memakai qty 2 (clamp) dan angka yang terlihat ikut 2.
  - [ ] AC-T4.4.3 Stok tetap sama sebelum dan sesudah tombol diklik (tidak ada pengurangan otomatis).
  - [ ] AC-T4.4.4 Tidak ada error console; tidak ada permintaan jaringan dari aplikasi sendiri saat tombol diklik.
- **Berkas:** `src/catalog.js`, `src/main.js`.

### T4.5 — Verifikasi pesanan

- [ ] AC-T4.5.1 AC-11, AC-12, AC-13, AC-14, AC-15 lulus dengan bukti tangkapan pesan WhatsApp.
- [ ] AC-T4.5.2 AC-27 lulus: console bersih, hanya aset lokal + `wa.me` setelah klik.
- [ ] AC-T4.5.3 U-14 dan U-15 lulus (stepper berhenti di stok; pesan lengkap tanpa teks terpotong).

- **Berkas:** `TESTING.md`, `src/catalog.js`.

**Selesai bila:** pesan WhatsApp dari kartu mana pun lengkap, ter-encode benar, dan tidak pernah melebihi stok.

---

## 7. Milestone 5 — CRUD Dashboard Pengelola (W, ± 120 mnt)

**Tujuan:** dashboard `#/kelola` dengan ringkasan, tabel/daftar produk, tambah, ubah, hapus berkonfirmasi, ubah stok cepat, dan toggle unggulan.

### T5.1 — Routing hash & perpindahan tampilan

- **Langkah:** implementasikan `#/` → katalog dan `#/kelola` → dashboard; dengar `hashchange`; perbarui `aria-current="page"` pada segmented control; saat pindah tampilan, sembunyikan tampilan lain dengan `hidden`, pindahkan fokus ke `h1` tampilan baru, dan umumkan lewat live region.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.1.1 Membuka `#/kelola` langsung (URL ditempel) menampilkan dashboard tanpa kedipan konten katalog.
  - [ ] AC-T5.1.2 Tombol back/forward browser berpindah tampilan dan `aria-current` mengikuti.
  - [ ] AC-T5.1.3 Hanya satu `h1` yang terlihat pada satu waktu; fokus berada di `h1` setelah perpindahan.
  - [ ] AC-T5.1.4 Reload di `#/kelola` tetap membuka dashboard.
- **Berkas:** `src/main.js`, `index.html`, `src/style.css`.

### T5.2 — Banner Mode Demo & kartu ringkasan

- **Langkah:** banner amber permanen (tanpa tombol tutup) dengan teks `UI-SPEC.md` §5.4; lima kartu ringkasan: Produk, Total stok, Produk habis, Unggulan, Estimasi nilai stok; nilai dihitung ulang dari `products` setiap render; angka tabular.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.2.1 Nilai awal: 8 / 216 / 0 / 2 / `Rp1.755.000`.
  - [ ] AC-T5.2.2 Setelah menambah produk harga 5.000 stok 10: Produk 9, Total stok 226, Estimasi nilai `Rp1.805.000`.
  - [ ] AC-T5.2.3 Setelah stok sebuah produk diubah ke 0: "Produk habis" bertambah 1 dan Total stok berkurang sesuai.
  - [ ] AC-T5.2.4 Banner tidak memiliki kontrol tutup dan tetap terlihat setelah reload.
- **Berkas:** `src/dashboard.js` (baru), `src/main.js`, `src/style.css`.

### T5.3 — Tabel desktop & daftar kartu mobile

- **Langkah:** tabel ≥ 900 px dengan kolom Menu (thumbnail 40 px + nama + deskripsi 1 baris), Kategori, Harga, Stok (stepper cepat), Unggulan (tombol bintang `aria-pressed`), Aksi ("Ubah"/"Hapus" sebagai teks); < 900 px berubah menjadi daftar kartu dengan data yang sama; empty state "Belum ada menu…" + tombol tambah.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.3.1 Pada 1000 px terlihat `table` dengan 8 baris data; pada 899 px tabel tidak terlihat dan 8 kartu daftar tampil.
  - [ ] AC-T5.3.2 Setiap baris/kartu menampilkan nama, kategori, harga `Rp`, dan kontrol stok; tidak ada data yang hilang saat beralih breakpoint.
  - [ ] AC-T5.3.3 Setelah semua produk dihapus, empty state tampil dan tombol tambah membuka form.
  - [ ] AC-T5.3.4 Thumbnail yang gagal dimuat memakai `/img/placeholder.svg` dan tidak memecah layout.
- **Berkas:** `src/dashboard.js`, `src/style.css`.

### T5.4 — Form tambah produk + validasi

- **Langkah:** modal (desktop) / bottom sheet (mobile) dengan field Nama*, Kategori*, Harga*, Stok*, Deskripsi, Image URL, checkbox unggulan; validasi `SPEC.md` §4.6 dengan pesan inline, `aria-invalid`, `aria-describedby`, fokus ke field salah pertama, ringkasan error di atas form; konversi `harga`/`stok` ke angka di satu fungsi; id baru unik; fokus terperangkap; `Esc` menutup; fokus kembali ke pemicu; konfirmasi "Buang perubahan?" bila form sudah diubah.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.4.1 Tambah "Es Jeruk", Minuman, 5000, 10, deskripsi terisi → produk ke-9 muncul di tabel dan katalog, harga `Rp5.000`, id unik.
  - [ ] AC-T5.4.2 Submit kosong menampilkan error pada Nama, Kategori, Harga, Stok; form tidak tertutup; fokus di field Nama.
  - [ ] AC-T5.4.3 Harga `-1`, `2,5`, `abc`, kosong → ditolak dengan pesan "Harga harus angka ≥ 0."; stok `2,5`, `-3`, `10000` → ditolak.
  - [ ] AC-T5.4.4 Nama 2 karakter dan 61 karakter → ditolak; 3 dan 60 karakter → diterima.
  - [ ] AC-T5.4.5 Deskripsi 161 karakter → ditolak; Image URL `ftp://…` → ditolak, `/img/x.svg` dan `https://…` → diterima.
  - [ ] AC-T5.4.6 20 kali `Tab` di dalam modal tidak memindahkan fokus ke luar dialog; `Esc` menutup dan fokus kembali ke "+ Tambah Menu".
  - [ ] AC-T5.4.7 Menutup dengan perubahan terisi memunculkan konfirmasi "Buang perubahan?"; "Batal" mengembalikan ke form.
- **Berkas:** `src/dashboard.js`, `src/data.js`, `src/utils.js`, `src/style.css`, `index.html` (kontainer dialog).

### T5.5 — Form ubah produk

- **Langkah:** form yang sama dalam mode ubah, terisi nilai saat ini; `id` tidak berubah; simpan memperbarui array dan render katalog + tabel + ringkasan.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.5.1 Ubah Boci Mix → harga 17000, stok 5: tabel dan kartu katalog menampilkan `Rp17.000` / stok 5; Total stok turun 15 menjadi 201.
  - [ ] AC-T5.5.2 `id` produk sama sebelum dan sesudah ubah.
  - [ ] AC-T5.5.3 Membatalkan ubah tidak mengubah data apa pun.
  - [ ] AC-T5.5.4 Validasi yang sama dengan T5.4 berlaku di mode ubah.
- **Berkas:** `src/dashboard.js`, `src/data.js`.

### T5.6 — Hapus & reset dengan dialog konfirmasi

- **Langkah:** dialog maks 400 px, judul "Hapus <nama>?", teks akibat, fokus awal "Batal", `Esc`/backdrop = batal, fokus kembali ke pemicu; hapus menghilangkan produk dari tabel + katalog + ringkasan; tombol "Reset data demo" memakai dialog serupa dan mengembalikan 8 seed.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.6.1 Klik "Hapus" menampilkan dialog; "Batal"/`Esc` membuat produk tetap ada dan fokus kembali ke tombol Hapus.
  - [ ] AC-T5.6.2 Konfirmasi menghapus Es Teh: produk hilang dari tabel, katalog, dan ringkasan (Produk 7, Total stok 166).
  - [ ] AC-T5.6.3 Menghapus produk terakhir menampilkan empty state, bukan error.
  - [ ] AC-T5.6.4 "Reset data demo" setelah perubahan memulihkan 8 produk, Total stok 216, Estimasi `Rp1.755.000`; membatalkan reset tidak mengubah data.
  - [ ] AC-T5.6.5 Dialog memakai `role="dialog"`, `aria-modal="true"`, `aria-labelledby` judul; `Tab` terperangkap.
- **Berkas:** `src/dashboard.js`, `src/data.js`, `src/style.css`.

### T5.7 — Stok cepat & toggle unggulan

- **Langkah:** stepper `−`/`+` di tabel/daftar mengubah stok satu langkah tanpa membuka form; batas 0…9.999; tombol bintang mengubah `unggulan` dengan `aria-pressed`; kedua aksi langsung menyimpan (lihat M6) dan merender ulang katalog.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.7.1 `+` menambah 1 dan `−` mengurangi 1; nilai tidak turun di bawah 0 atau melewati 9.999.
  - [ ] AC-T5.7.2 Perubahan stok langsung terlihat di katalog tanpa reload.
  - [ ] AC-T5.7.3 Tombol bintang mengubah badge "Best Seller" di kartu katalog dan nilai "Unggulan" di ringkasan.
  - [ ] AC-T5.7.4 `aria-pressed` dan label aksesibel bintang berubah sesuai state.
- **Berkas:** `src/dashboard.js`, `src/data.js`, `src/style.css`.

### T5.8 — Toast & umpan balik aksi

- **Langkah:** toast sukses untuk tambah/ubah/hapus/reset/stok, `role="status"`, 4 detik, ada tombol tutup, posisi kanan-atas (desktop) / bawah-tengah (mobile), tidak menutupi tombol aksi.
- **Kriteria Penerimaan:**
  - [ ] AC-T5.8.1 Setiap aksi CRUD memunculkan tepat satu toast dengan teks sesuai `UI-SPEC.md` §8.
  - [ ] AC-T5.8.2 Toast hilang otomatis dalam 4 ± 0,5 detik dan dapat ditutup manual.
  - [ ] AC-T5.8.3 Memunculkan toast tidak memindahkan fokus keyboard dari kontrol yang sedang dipakai.
- **Berkas:** `src/dashboard.js`, `src/style.css`.

### T5.9 — Verifikasi dashboard

- [ ] AC-T5.9.1 AC-16…AC-22 dan AC-24 lulus (AC-23 menyusul di M6).
- [ ] AC-T5.9.2 U-16…U-21 lulus.
- [ ] AC-T5.9.3 Tidak ada error console setelah urutan: tambah → ubah → stok cepat → toggle unggulan → hapus → reset.

- **Berkas:** `TESTING.md`.

**Selesai bila:** semua operasi CRUD bekerja dari UI, tervalidasi, dan katalog ikut berubah.

---

## 8. Milestone 6 — Integrasi localStorage (W, ± 45 mnt)

**Tujuan:** data awal dimuat sekali saat pertama dibuka, semua perubahan dashboard tersimpan, dan data bertahan setelah reload tanpa membuat halaman blank saat data rusak.

### T6.1 — Lapisan penyimpanan berversi

- **Langkah:** implementasikan `loadProducts()` / `saveProducts()` pada kunci `kba:products:v1` dengan envelope `{ version: 1, updatedAt: ISO, products: [...] }`; tulis seluruh array setiap perubahan; sediakan deteksi ketersediaan `localStorage` (try/catch pada set/get) dan flag `storageAvailable`.
- **Kriteria Penerimaan:**
  - [ ] AC-T6.1.1 Setelah perubahan pertama, `localStorage["kba:products:v1"]` berisi JSON valid dengan `version === 1`, `updatedAt` berupa ISO string yang berubah setiap simpan, dan `products` array.
  - [ ] AC-T6.1.2 Tidak ada kunci lain yang dibuat aplikasi selain `kba:products:v1` dan `kba:prefs:v1`.
  - [ ] AC-T6.1.3 Menyimpan 8 produk menghasilkan ukuran < 10 KB.
- **Berkas:** `src/data.js`.

### T6.2 — Hidrasi awal & fallback data rusak

- **Langkah:** saat start: baca → parse → validasi tiap item dengan aturan §4.1 (buang yang tidak valid) → bila gagal/kosong, pakai seed dan tulis ulang; tampilkan banner "Data menu tidak terbaca. Kami memuat menu contoh." + tombol "Mengerti" hanya saat pemulihan terjadi; versi tak dikenal → reset ke seed dengan konfirmasi.
- **Kriteria Penerimaan:**
  - [ ] AC-T6.2.1 Kunjungan pertama (kunci kosong) menampilkan 8 seed dan langsung menulis envelope ke storage.
  - [ ] AC-T6.2.2 `localStorage["kba:products:v1"] = "{rusak"` lalu reload: halaman tidak blank, 8 seed tampil, banner pemulihan muncul, dan kunci ditulis ulang menjadi JSON valid.
  - [ ] AC-T6.2.3 Envelope valid dengan 1 produk rusak (harga `"12.000"`) → produk itu dibuang, 7 produk valid tetap dipakai, tidak ada crash.
  - [ ] AC-T6.2.4 `version: 2` → konfirmasi reset muncul; setelah disetujui, seed dipakai.
  - [ ] AC-T6.2.5 Banner pemulihan dapat ditutup dan tidak muncul lagi pada reload berikutnya selama data valid.
- **Berkas:** `src/data.js`, `src/main.js`, `src/style.css`.

### T6.3 — Persistensi setiap mutasi & kegagalan tulis

- **Langkah:** panggil `saveProducts()` setelah tambah/ubah/hapus/stok cepat/toggle unggulan/reset; bila tulis gagal, pertahankan data di memori dan ubah banner Mode Demo menjadi "Perubahan tidak dapat disimpan di perangkat ini." (warna `--chili-soft`); jangan menampilkan error mentah ke pembeli.
- **Kriteria Penerimaan:**
  - [ ] AC-T6.3.1 Tambah produk → reload → produk masih ada (9 produk); ubah harga → reload → harga baru; hapus → reload → produk tetap hilang.
  - [ ] AC-T6.3.2 Setelah 5 operasi berturut-turut lalu reload, state akhir sama persis (dibandingkan jumlah, nama, harga, stok).
  - [ ] AC-T6.3.3 Bila `Storage.prototype.setItem` diubah agar melempar error, aplikasi tetap dapat menambah/mengubah produk dalam sesi dan banner kegagalan tampil; tidak ada error tak tertangani.
  - [ ] AC-T6.3.4 Reset data demo menulis ulang seed ke storage (timestamp `updatedAt` berubah).
- **Berkas:** `src/data.js`, `src/dashboard.js`, `src/main.js`.

### T6.4 — Sinkronisasi antar-tab (batas wajar)

- **Langkah:** dengar event `storage` untuk kunci produk; muat ulang state dan render tampilan aktif; tidak menjanjikan sinkronisasi real-time di UI.
- **Kriteria Penerimaan:**
  - [ ] AC-T6.4.1 Dua tab dibuka; tambah produk di tab A → tab B memperbarui tabel/katalog dalam < 1 detik setelah event.
  - [ ] AC-T6.4.2 Perubahan `kba:prefs:v1` tidak memicu render ulang penuh katalog.
  - [ ] AC-T6.4.3 Tidak ada loop render tak berujung (console tidak banjir pesan; CPU stabil).
- **Berkas:** `src/main.js`, `src/data.js`.

### T6.5 — Verifikasi penyimpanan

- [ ] AC-T6.5.1 AC-23 dan AC-25 lulus.
- [ ] AC-T6.5.2 Reload 3 kali berturut-turut di `#/kelola` mempertahankan data dan tidak menduplikasi produk.
- [ ] AC-T6.5.3 Menghapus kunci secara manual lalu reload mengembalikan 8 seed tanpa banner pemulihan (bukan kasus rusak).

- **Berkas:** `TESTING.md`, `src/data.js`.

**Selesai bila:** data persisten, fallback aman, dan kegagalan storage tidak mematikan aplikasi.

---

## 9. Milestone 7 — Pengujian Manual (W, ± 45 mnt)

**Tujuan:** checklist pengujian yang dapat diulang, dijalankan penuh, dengan bukti dan catatan cacat.

### T7.1 — Susun `TESTING.md`

- **Langkah:** buat tabel AC-01…AC-28 (dari `SPEC.md` §9) dan U-01…U-24 (dari `UI-SPEC.md` §10) dengan kolom: ID, langkah, hasil diharapkan, status (Lulus/Gagal/Tidak berlaku), bukti (file tangkapan layar/nilai console), catatan; tambahkan bagian lingkungan (tanggal, OS, browser + versi, lebar viewport, commit hash) dan bagian cacat (ID, tingkat P0–P3, deskripsi, status).
- **Kriteria Penerimaan:**
  - [ ] AC-T7.1.1 `TESTING.md` memuat 28 baris AC dan 24 baris U, tanpa ID yang hilang atau ganda.
  - [ ] AC-T7.1.2 Setiap baris punya kolom status dan bukti yang harus diisi (tidak ada baris kosong saat dinyatakan selesai).
  - [ ] AC-T7.1.3 Ada instruksi reset data di bagian atas (hapus dua kunci localStorage + reload).
- **Berkas:** `TESTING.md` (baru).

### T7.2 — Jalankan AC-01…AC-28

- **Langkah:** jalankan berurutan di Chrome; untuk AC yang bergantung waktu (status buka), catat jam WITA saat uji; untuk AC-26 gunakan payload XSS; untuk AC-25 rusak kan storage; simpan tangkapan layar bernama `ac-01.png` dst. di `docs/test/` bila memungkinkan.
- **Kriteria Penerimaan:**
  - [ ] AC-T7.2.1 Semua 28 AC berstatus terisi; minimal 26 "Lulus" pada percobaan pertama.
  - [ ] AC-T7.2.2 AC-03 (harga) dicocokkan satu per satu dengan `SPEC.md` §4.3, bukan hanya "terlihat benar".
  - [ ] AC-T7.2.3 AC-12/AC-13 diperiksa dari teks pesan hasil decode, bukan dari pratinjau WhatsApp.
  - [ ] AC-T7.2.4 AC-21 diuji pada batas 0 dan 9.999.
  - [ ] AC-T7.2.5 AC-26 tidak memunculkan alert dan nama produk tampil sebagai teks.
- **Berkas:** `TESTING.md`, `docs/test/*` (opsional).

### T7.3 — Jalankan U-01…U-24 & uji perangkat

- **Langkah:** uji visual di 360, 768, 1024, 1440 px; uji keyboard penuh; uji `prefers-reduced-motion`; uji di Chrome + satu browser lain (Edge/Firefox).
- **Kriteria Penerimaan:**
  - [ ] AC-T7.3.1 Semua 24 U berstatus terisi dengan bukti.
  - [ ] AC-T7.3.2 U-04 dan U-17 dibuktikan pada keempat lebar.
  - [ ] AC-T7.3.3 U-24 diselesaikan hanya dengan keyboard, dicatat urutan fokusnya.
  - [ ] AC-T7.3.4 Tidak ada scroll horizontal di 360 px pada kedua tampilan.
  - [ ] AC-T7.3.5 Hasil di browser kedua tidak berbeda secara fungsi (minimal alur katalog → WA → dashboard → CRUD).
- **Berkas:** `TESTING.md`.

### T7.4 — Perbaiki temuan & regresi

- **Langkah:** catat setiap kegagalan sebagai cacat, perbaiki, lalu ulangi hanya AC/U yang gagal **dan** AC/U yang menyentuh area yang diubah; perbarui `TESTING.md`.
- **Kriteria Penerimaan:**
  - [ ] AC-T7.4.1 Tidak ada cacat P0/P1 terbuka; P2/P3 tersisa didokumentasikan dengan alasan.
  - [ ] AC-T7.4.2 Setiap perbaikan punya baris "diuji ulang pada <tanggal>" di `TESTING.md`.
  - [ ] AC-T7.4.3 Setelah perbaikan, `npm run build` masih exit 0.
- **Berkas:** `src/*`, `TESTING.md`.

**Selesai bila:** 52 baris checklist terisi, P0/P1 nol, dan hasil dapat direproduksi.

---

## 10. Milestone 8 — Keamanan Dasar & Aksesibilitas (W, ± 45 mnt)

**Tujuan:** tidak ada rahasia/API key, input pengguna tidak dapat mengeksekusi skrip, angka tervalidasi, dan seluruh kriteria WCAG AA terpenuhi.

### T8.1 — Audit rahasia & dependensi

- **Langkah:** pindai repo untuk pola rahasia; pastikan tidak ada `.env` berisi kredensial; jalankan audit dependensi.
- **Kriteria Penerimaan:**
  - [ ] AC-T8.1.1 `grep -RInE "(api[_-]?key|secret|token|password|bearer)" --exclude-dir=node_modules --exclude-dir=.git .` tidak menemukan nilai rahasia (hanya dokumentasi yang menyebut larangan).
  - [ ] AC-T8.1.2 Tidak ada berkas `.env`/`.env.*` yang ter-commit; `.gitignore` mencakup `.env*`.
  - [ ] AC-T8.1.3 `npm audit --omit=dev` melaporkan 0 kerentanan high/critical.
- **Berkas:** `.gitignore`, `README.md`, `package-lock.json`.

### T8.2 — Audit XSS & rendering aman

- **Langkah:** pastikan semua data dinamis (nama, deskripsi, imageUrl, nama pemesan) dirender dengan `textContent`/atribut yang aman; tidak ada `innerHTML` berisi data pengguna; `imageUrl` hanya diterima bila diawali `/` atau `https://`; tidak ada `eval`, `Function`, atau `setTimeout(string)`.
- **Kriteria Penerimaan:**
  - [ ] AC-T8.2.1 `grep -RIn "innerHTML\|outerHTML\|insertAdjacentHTML\|eval(\|new Function" src` hanya menemukan kemunculan yang tidak menerima data pengguna, dan setiap kemunculan diberi komentar alasan.
  - [ ] AC-T8.2.2 Payload `<img src=x onerror="alert(1)">` sebagai nama produk tampil sebagai teks di tabel dan kartu; tidak ada alert, tidak ada elemen `img` tambahan.
  - [ ] AC-T8.2.3 Payload `"><script>alert(1)</script>` pada nama pemesan tidak merusak atribut/href WhatsApp.
  - [ ] AC-T8.2.4 `imageUrl` berisi `javascript:alert(1)` ditolak validasi dan tidak pernah menjadi `src`.
- **Berkas:** `src/catalog.js`, `src/dashboard.js`, `src/data.js`, `src/utils.js`.

### T8.3 — Validasi angka & normalisasi

- **Langkah:** pusatkan konversi harga/stok di satu fungsi; tolak kosong, desimal, negatif, bukan angka, dan di luar batas; bulatkan hanya bila aturan mengizinkan (tidak: desimal harus ditolak); pastikan nilai tersimpan selalu `number` integer.
- **Kriteria Penerimaan:**
  - [ ] AC-T8.3.1 Harga: `-1`, `2,5`, `2.5`, `abc`, `` ditolak; `0`, `5000`, `1000000` diterima; `1000001` ditolak.
  - [ ] AC-T8.3.2 Stok: `-1`, `2,5`, `abc` ditolak; `0`, `1`, `9999` diterima; `10000` ditolak.
  - [ ] AC-T8.3.3 Setelah semua uji, tidak ada produk dengan `typeof harga !== "number"` atau `Number.isInteger(...) === false` di state/storage.
  - [ ] AC-T8.3.4 Stok cepat tidak dapat menghasilkan nilai negatif meski tombol ditekan 5× pada stok 1.
- **Berkas:** `src/data.js`, `src/dashboard.js`, `src/utils.js`.

### T8.4 — Verifikasi kontras & token

- **Langkah:** buat skrip kecil `scripts/check-contrast.mjs` yang menghitung rasio WCAG untuk pasangan warna di `UI-SPEC.md` §2.1; jalankan; catat hasil di `TESTING.md`; periksa tidak ada teks yang memakai kombinasi terlarang (putih di atas amber).
- **Kriteria Penerimaan:**
  - [ ] AC-T8.4.1 Skrip mengeluarkan 11 pasangan dengan rasio yang sama seperti `UI-SPEC.md` §2.1 (toleransi ± 0,05).
  - [ ] AC-T8.4.2 Semua pasangan teks normal ≥ 4,5:1 dan semua elemen UI/batas fokus ≥ 3:1.
  - [ ] AC-T8.4.3 `grep` tidak menemukan `color: #fff` (atau ekuivalen) pada elemen berlatar `--amber`.
  - [ ] AC-T8.4.4 Pemeriksaan DevTools pada chip "Buka Sekarang", badge "Best Seller", tombol primary, dan teks muted mengonfirmasi nilai skrip.
- **Berkas:** `scripts/check-contrast.mjs` (baru), `TESTING.md`, `src/style.css`.

### T8.5 — Keyboard, fokus, dan pembaca layar

- **Langkah:** verifikasi skip link, urutan tab, ring fokus, perangkap fokus dialog, pengembalian fokus, `aria-live` untuk hasil filter & toast, label form, `alt` gambar, `lang="id"`, serta heading hierarchy; jalankan Lighthouse Accessibility pada kedua tampilan.
- **Kriteria Penerimaan:**
  - [ ] AC-T8.5.1 A-01…A-16 lulus dengan catatan bukti per ID.
  - [ ] AC-T8.5.2 Lighthouse Accessibility ≥ 95 untuk `#/` dan `#/kelola`.
  - [ ] AC-T8.5.3 Seluruh alur (cari → filter → porsi → WA → dashboard → CRUD) selesai tanpa mouse.
  - [ ] AC-T8.5.4 Pada zoom 200% dan lebar 320 px tidak ada konten terpotong (U-03).
- **Berkas:** `TESTING.md`, `src/style.css`, `src/main.js`, `src/dashboard.js`.

**Selesai bila:** tidak ada rahasia, XSS tidak tereksekusi, validasi angka ketat, dan kontras/aksibilitas terbukti.

---

## 11. Milestone 9 — Build Production (W, ± 20 mnt)

**Tujuan:** menghasilkan `dist/` statis yang terminifikasi, di bawah anggaran aset, dan berfungsi di `vite preview`.

### T9.1 — Konfigurasi build

- **Langkah:** pastikan `vite.config.js` memakai `base: "./"` **atau** path repo (lihat T10.2) secara sadar; nonaktifkan sourcemap produksi bila tidak diperlukan; pastikan target browser modern wajar; tidak ada plugin tambahan tanpa alasan.
- **Kriteria Penerimaan:**
  - [ ] AC-T9.1.1 `npm run build` exit 0 tanpa warning konfigurasi.
  - [ ] AC-T9.1.2 `dist/index.html` mereferensikan aset dengan nama ber-hash dan path sesuai `base`.
  - [ ] AC-T9.1.3 Tidak ada sourcemap `.map` di `dist/` (atau didokumentasikan bila sengaja dipertahankan).
- **Berkas:** `vite.config.js`, `package.json`.

### T9.2 — Verifikasi anggaran & minifikasi

- **Kriteria Penerimaan:**
  - [ ] AC-T9.2.1 Total ukuran `dist/` < 500 KB (NFR-01), diukur dengan `du -sk dist`.
  - [ ] AC-T9.2.2 Total JS + CSS ter-gzip < 100 KB.
  - [ ] AC-T9.2.3 Berkas JS/CSS produksi terminifikasi (tidak ada komentar pengembangan/nama variabel panjang yang menandakan build gagal).
  - [ ] AC-T9.2.4 `dist/` memuat 9 SVG + `index.html` + aset JS/CSS; tidak ada berkas pengembangan yang ikut.
- **Berkas:** `dist/` (hasil generate, tidak di-commit), `TESTING.md`.

### T9.3 — Smoke test `vite preview`

- **Langkah:** jalankan `npm run preview`, uji alur inti pada build produksi.
- **Kriteria Penerimaan:**
  - [ ] AC-T9.3.1 `npm run preview` melayani halaman dengan status 200.
  - [ ] AC-T9.3.2 8 kartu tampil, pencarian "mercon" menyaring, dan link WA terbentuk pada build produksi.
  - [ ] AC-T9.3.3 `#/kelola` dapat dibuka langsung dan CRUD + reload berfungsi.
  - [ ] AC-T9.3.4 Semua gambar mengembalikan 200 (tidak ada 404 akibat `base`).
  - [ ] AC-T9.3.5 Console produksi bersih.
- **Berkas:** `TESTING.md`.

**Selesai bila:** build sukses, di bawah anggaran, dan alur demo berjalan di preview.

---

## 12. Milestone 10 — Deployment (T, ± 40 mnt)

> **Prasyarat eksternal:** butuh remote Git dan izin pengguna untuk push. Jangan push/deploy tanpa persetujuan eksplisit. Ini juga melampaui `SPEC.md` §8 butir 9 (lihat K-02).

**Tujuan:** aplikasi dapat diakses publik lewat HTTPS dari GitHub Pages **atau** Netlify, dengan aset dan routing hash yang benar.

### T10.1 — Pilih target & catat keputusan

- **Langkah:** pilih satu target (default **GitHub Pages**; Netlify bila butuh preview per-PR). Catat pilihan + alasan di `README.md`; jangan mengonfigurasi keduanya sekaligus.
- **Kriteria Penerimaan:**
  - [ ] AC-T10.1.1 `README.md` menyebut satu target deployment dan URL produksinya.
  - [ ] AC-T10.1.2 Tidak ada konfigurasi target kedua yang tertinggal (mis. `netlify.toml` saat memakai Pages).
- **Berkas:** `README.md`.

### T10.2 — Tangani base path & routing hash

- **Langkah:** untuk GitHub Pages proyek, set `base: "/<nama-repo>/"`; untuk Netlify, `base: "/"`; pastikan semua `imageUrl` seed dan tautan internal memakai path yang bekerja pada base tersebut (gunakan `import.meta.env.BASE_URL` bila perlu); routing hash tidak memerlukan redirect.
- **Kriteria Penerimaan:**
  - [ ] AC-T10.2.1 Pada URL produksi, semua 9 gambar mengembalikan 200 (tidak ada `/img/...` yang menunjuk root domain).
  - [ ] AC-T10.2.2 Membuka `https://<domain>/<path>/#/kelola` langsung menampilkan dashboard (tidak 404).
  - [ ] AC-T10.2.3 Reload pada `#/` dan `#/kelola` tidak menghasilkan halaman 404.
  - [ ] AC-T10.2.4 Build lokal dengan `base` produksi tetap lulus `npm run preview` (path aset benar).
- **Berkas:** `vite.config.js`, `src/data.js`, `index.html`, `README.md`.

### T10.3 — Otomatisasi build & deploy

- **Langkah:** GitHub Pages → workflow `.github/workflows/deploy.yml` (install, build, upload artifact, deploy Pages) dengan izin minimal; Netlify → `netlify.toml` (`command = "npm run build"`, `publish = "dist"`, Node version). Jangan menaruh token di repo.
- **Kriteria Penerimaan:**
  - [ ] AC-T10.3.1 Push ke branch utama memicu build otomatis dan selesai sukses.
  - [ ] AC-T10.3.2 Deploy pertama menghasilkan URL HTTPS yang dapat dibuka (status 200).
  - [ ] AC-T10.3.3 Workflow tidak memuat rahasia plaintext; hanya `GITHUB_TOKEN` bawaan dengan izin minimum.
  - [ ] AC-T10.3.4 `dist/` tidak di-commit; hanya artefak hasil CI.
- **Berkas:** `.github/workflows/deploy.yml` (baru) atau `netlify.toml` (baru), `package.json`, `.gitignore`.

### T10.4 — Smoke test produksi

- **Langkah:** uji alur demo pada URL publik dari ponsel dan desktop.
- **Kriteria Penerimaan:**
  - [ ] AC-T10.4.1 Katalog memuat 8 produk; harga/stok sama dengan seed.
  - [ ] AC-T10.4.2 Pencarian, filter, sorting berfungsi pada produksi.
  - [ ] AC-T10.4.3 Tombol WA membuka `wa.me/6285858754176` dengan pesan lengkap.
  - [ ] AC-T10.4.4 CRUD + reload mempertahankan data (localStorage per origin produksi).
  - [ ] AC-T10.4.5 Tidak ada error console dan tidak ada permintaan ke domain selain origin + `wa.me`.
  - [ ] AC-T10.4.6 Uji di ponsel nyata: tidak ada scroll horizontal, tombol ≥ 44 px.
- **Berkas:** `TESTING.md`, `README.md`.

### T10.5 — Dokumentasi rilis & rollback

- **Langkah:** tulis di `README.md`: URL, cara build lokal, cara deploy, cara rollback (revert commit / "Rollback" di Netlify), dan catatan bahwa data tersimpan per perangkat.
- **Kriteria Penerimaan:**
  - [ ] AC-T10.5.1 README memuat langkah rollback yang bisa diikuti tanpa bertanya.
  - [ ] AC-T10.5.2 README menyatakan batasan: tanpa backend, data per perangkat, stok tidak berkurang otomatis.
  - [ ] AC-T10.5.3 Ada catatan versi/commit yang sedang ter-deploy.
- **Berkas:** `README.md`.

**Selesai bila:** URL publik berfungsi, alur inti lulus di produksi, dan rollback terdokumentasi.

---

## 13. Matriks Ketertelusuran

### 13.1 Fitur → Milestone

| Fitur | Milestone | Bukti utama |
|---|---|---|
| F-01 Header & info toko | M2 | AC-01, U-07 |
| F-02 Katalog produk | M2 | AC-02, AC-03, U-08 |
| F-03 Pencarian | M3 | AC-05…AC-07 |
| F-04 Filter kategori | M3 | AC-08 |
| F-05 Sorting | M3 | AC-09, AC-10 |
| F-06 Pesan WhatsApp | M4 | AC-11…AC-15 |
| F-07 Dashboard CRUD | M5 | AC-16…AC-22 |
| F-08 Ringkasan stok | M5 | AC-16, AC-19 |
| F-09 Penyimpanan lokal | M6 | AC-23, AC-25 |
| F-10 Reset data demo | M5, M6 | AC-24 |
| F-11 Placeholder gambar lokal | M1, M2 | AC-04, T1.5, T2.3.5 |
| F-12 Data pemesan ringan | M4 | AC-12, AC-13 |
| F-13 Empty & error state | M3, M6 | AC-07, AC-25 |

### 13.2 NFR → Milestone

| NFR | Milestone | Cara bukti |
|---|---|---|
| NFR-01 Performa/aset | M1, M9 | T9.2 |
| NFR-02 Responsif | M2, M7 | AC-28, U-04 |
| NFR-03 Aksesibilitas | M8 | A-01…A-16, Lighthouse |
| NFR-04 Keandalan data | M6 | AC-23, AC-25 |
| NFR-05 Keamanan | M8 | AC-26, T8.1–T8.3 |
| NFR-06 Privasi | M2, M9, M10 | AC-27, T10.4.5 |
| NFR-07 Kompatibilitas | M7 | T7.3.5 |
| NFR-08 Maintainability | M1, M2 | Struktur `SPEC.md` §6, T1.3 |
| NFR-09 Konsistensi konten | M2, M4 | AC-03, AC-12 |
| NFR-10 Offline-tolerant | M2, M9 | Muat ulang tanpa jaringan setelah load pertama |

### 13.3 AC/U → Milestone

| Kelompok | Milestone |
|---|---|
| AC-01…AC-04 | M2 |
| AC-05…AC-10 | M3 |
| AC-11…AC-15, AC-27 | M4 |
| AC-16…AC-22, AC-24 | M5 |
| AC-23, AC-25 | M6 |
| AC-26 | M8 |
| AC-28 | M2, M3, M7 |
| U-01, U-04, U-07, U-08 | M2 |
| U-11…U-13, U-22 | M3 |
| U-14, U-15 | M4 |
| U-16…U-21 | M5 |
| U-02, U-03, U-06, U-09, U-10, U-23, U-24 | M7, M8 |
| U-05 | M2, M3 |

---

## 14. Urutan Eksekusi, Cut Line, dan Risiko Jadwal

### 14.1 Urutan yang disarankan

`M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9 → (M10)`

M4 boleh dikerjakan paralel dengan M3 hanya jika pencarian/filter sudah stabil; M6 **harus** setelah M5 karena menguji persistensi seluruh mutasi.

### 14.2 Cut line untuk demo 1 hari

| Prioritas | Milestone | Alasan |
|---|---|---|
| P0 (wajib demo) | M1, M2, M3, M4 | Alur pembeli: lihat → cari → pesan |
| P0 (wajib demo) | M5, M6 | Dashboard dan persistensi adalah nilai jual utama |
| P0 (wajib) | M7 (AC-01…AC-25 minimal), M8 (T8.2, T8.3, T8.4) | Mencegah XSS dan klaim aksesibilitas palsu |
| P1 (sebelum publikasi) | M9 | Build harus lulus sebelum demo publik |
| P2 (setelah demo) | M10, T7.3 lengkap, Lighthouse | Tidak memblokir demo lokal |

Bila waktu tersisa < 60 menit sebelum batas: hentikan fitur baru, selesaikan AC yang gagal di katalog + WhatsApp, dan tandai dashboard "demo terbatas" di UI (sesuai `SPEC.md` §10).

### 14.3 Risiko jadwal yang perlu dipantau

| Risiko | Tanda awal | Tindakan |
|---|---|---|
| Rework storage (M2 → M6) | `data.js` menyebar panggilan `localStorage` di banyak modul | Pertahankan satu pintu `loadProducts`/`saveProducts` sejak M2 |
| Ilustrasi SVG memakan waktu | > 45 mnt untuk 9 gambar | Pakai bentuk geometris sederhana; kualitas "cukup flat", bukan ilustrasi detail |
| Validasi form berulang | Aturan angka ditulis di dua tempat | Satu validator di `data.js`, dipakai form dan T8.3 |
| Deployment molor | Base path/404 aset | Kerjakan T10.2 sebelum T10.3; uji `npm run preview` dengan `base` produksi |
| Waktu habis di aksesibilitas | Dialog tanpa focus trap | Kerjakan T5.4/T5.6 dengan trap sejak awal, bukan retrofit |

---

## 15. Checklist Go/No-Go Sebelum Demo

- [ ] `npm run dev` bersih; `npm run build` exit 0; `npm run preview` menampilkan 8 kartu.
- [ ] Data seed tepat: 8 produk, stok 216, estimasi `Rp1.755.000`, 2 unggulan.
- [ ] Alur pembeli selesai ≤ 3 ketukan dari kartu ke WhatsApp.
- [ ] Pesan WA memuat produk, jumlah, harga satuan, total, metode, nama, alamat.
- [ ] CRUD + reload mempertahankan perubahan; reset mengembalikan seed.
- [ ] Tidak ada API key/rahasia; payload XSS tidak tereksekusi.
- [ ] Tidak ada scroll horizontal di 360 px; kontras AA terverifikasi.
- [ ] Console bersih; tidak ada permintaan ke domain eksternal selain `wa.me` saat diklik.
- [ ] `TESTING.md` terisi; P0/P1 nol.
- [ ] Nomor WhatsApp `6285858754176` diverifikasi sekali secara manual.
- [ ] (Jika deploy) URL HTTPS hidup, aset 200, `#/kelola` dapat dibuka langsung.

---

## 16. Tidak Dikerjakan pada Rencana Ini

Sesuai `SPEC.md` §8, tugas-tugas berikut **tidak** dibuat dan tidak boleh diselipkan ke milestone:

1. Backend, database, API, atau serverless function.
2. Login/autentikasi nyata (dashboard tetap demo tanpa akun).
3. Pembayaran online, QRIS, atau payment gateway.
4. Keranjang multi-item, modal kustomisasi pedas/topping, struk digital.
5. Pengurangan stok otomatis setelah pesan WhatsApp.
6. Notifikasi/riwayat/status pesanan.
7. Upload gambar dari perangkat.
8. Multi-outlet, multi-bahasa, PWA/service worker, mode gelap, animasi kompleks.
9. Analitik atau SEO lanjutan.
10. Data pelanggan, ulasan, atau loyalitas.

**Pertanyaan terbuka yang masih berlaku** (dari `SPEC.md` §11): harga final, satuan sambal (porsi/jar), kebutuhan field `satuan`, dan apakah pesan WA perlu menyebut waktu pengambilan. Selama belum dijawab, semua produk memakai label "porsi".
