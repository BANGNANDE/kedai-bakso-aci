# UI-SPEC — Kedai Bakso Aci

**Versi:** 1.0
**Tanggal:** 19 November 2026
**Mengacu pada:** `SPEC.md` v1.0 (fitur F-01…F-13, NFR-01…NFR-10, AC-01…AC-28)
**Stack UI:** Vite + HTML/CSS/JavaScript vanilla, tanpa framework dan tanpa aset eksternal

> Dokumen ini hanya mendefinisikan tampilan, interaksi, dan kriteria visual. Tidak ada kode aplikasi di sini.

---

## 1. Prinsip Desain

1. **Hangat dan mengundang, bukan norak.** Latar krem seperti kertas menu warung; merah cabai hanya untuk aksi utama dan penanda pedas; hijau daun jeruk untuk status buka, konfirmasi, dan aksen sekunder.
2. **Mobile-first, jempol-friendly.** Semua target sentuh ≥ 44×44 px. Alur pesan harus selesai dalam ≤ 3 ketukan dari kartu produk.
3. **Harga dan stok adalah bintang.** Harga Rupiah paling menonjol di kartu setelah nama; stok selalu terlihat tanpa harus membuka detail.
4. **Jujur soal keterbatasan.** Dashboard diberi banner "Mode Demo"; stok habis tidak disembunyikan; status buka/tutup dihitung dari jam WITA, bukan dikarang.
5. **Aksesibel sejak awal.** Kontras WCAG AA terverifikasi, fokus keyboard jelas, status tidak hanya dibedakan lewat warna, dan dialog dapat ditutup dengan Esc.
6. **Satu bahasa visual.** Radius, spasi, bayangan, dan ikon konsisten; tidak ada foto eksternal — semua ilustrasi SVG lokal bergaya flat.

---

## 2. Design Tokens

### 2.1 Palet warna

| Token | Hex | Peran | Pemakaian |
|---|---|---|---|
| `--bg` | `#FFF9F0` | Latar halaman (krem hangat) | Body, area utama |
| `--surface` | `#FFFFFF` | Permukaan kartu/panel | Kartu produk, modal, tabel |
| `--surface-warm` | `#FDEFD9` | Krem lebih tua | Hero illustration panel, header tabel, hover baris |
| `--border` | `#EAD8C0` | Garis batas lembut | Kartu, input, pemisah |
| `--text` | `#2B1A12` | Teks utama (coklat tua) | Judul, nama produk, angka |
| `--text-muted` | `#6B5142` | Teks sekunder | Deskripsi, label, meta |
| `--chili` | `#B3261E` | Merah cabai — aksi utama | Tombol pesan, badge Best Seller, active tab |
| `--chili-dark` | `#8E1B15` | Hover/pressed & teks danger | Hover tombol utama, error, stok habis |
| `--chili-soft` | `#FCE8E6` | Latar danger lembut | Chip "Stok habis", banner error |
| `--leaf` | `#2F6B3A` | Hijau daun jeruk — sekunder | Status buka, tombol outline WA, tautan |
| `--leaf-soft` | `#E6F1E4` | Latar hijau lembut | Chip "Buka", badge sukses |
| `--leaf-ink` | `#1F4A2A` | Teks di atas hijau lembut | Chip status buka |
| `--amber` | `#FFEFC7` | Latar badge unggulan | Badge Best Seller, stok terbatas |
| `--amber-ink` | `#7A4E00` | Teks di atas amber | Badge Best Seller |
| `--disabled-bg` | `#F1E4D2` | Latar kontrol nonaktif | Stepper `+` di batas stok, tombol habis |
| `--focus` | `#2B1A12` | Ring fokus | Semua elemen interaktif (ring + halo krem) |

**Kontras terverifikasi (WCAG 2.1 AA, ambang 4.5:1 teks normal / 3:1 teks besar & UI):**

| Kombinasi | Rasio | Status |
|---|---|---|
| `--text` #2B1A12 pada `--bg` #FFF9F0 | 15,93:1 | AAA |
| `--text-muted` #6B5142 pada `--bg` | 6,96:1 | AA |
| `--text-muted` pada `--surface` #FFFFFF | 7,29:1 | AA |
| Putih pada `--chili` #B3261E | 6,54:1 | AA |
| Putih pada `--chili-dark` #8E1B15 | 9,06:1 | AAA |
| Putih pada `--leaf` #2F6B3A | 6,39:1 | AA |
| `--leaf` #2F6B3A pada `--bg` | 6,11:1 | AA |
| `--amber-ink` #7A4E00 pada `--amber` | 6,32:1 | AA |
| `--chili-dark` pada `--chili-soft` | 7,69:1 | AAA |
| `--leaf-ink` pada `--leaf-soft` | 8,72:1 | AA |
| `--text-muted` pada `--disabled-bg` | 5,82:1 | AA |

Aturan: merah cabai di atas krem hanya 6,24:1 (masih AA) — pakai untuk tautan/label pendek, bukan paragraf panjang. Jangan menaruh teks putih di atas `--amber` (kontras ±1,9:1).

### 2.2 Tipografi

Font: **system sans-serif stack** — `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Tidak memakai webfont/CDN agar memenuhi NFR-01 (aset < 500 KB, tanpa jaringan eksternal). Huruf tebal untuk judul, jarak huruf `-0.01em` pada judul besar.

| Token | Ukuran / line-height | Berat | Penggunaan |
|---|---|---|---|
| `--fs-xs` | 12 / 16 | 600 | Label badge, kategori, caption |
| `--fs-sm` | 14 / 20 | 400–600 | Meta, deskripsi, error, label form |
| `--fs-base` | 16 / 24 | 400 | Body, input, tombol |
| `--fs-lg` | 18 / 26 | 700 | Nama produk di kartu |
| `--fs-xl` | 22 / 30 | 700 | Judul seksi ("Menu Favorit") |
| `--fs-2xl` | 28 / 36 | 800 | H1 hero (mobile) |
| `--fs-3xl` | 40 / 48 | 800 | H1 hero (≥ 900 px) |
| `--fs-price` | 20 / 28 | 800 | Harga di kartu (tabular-nums) |

- Angka uang dan stok memakai `font-variant-numeric: tabular-nums`.
- Panjang baris teks maksimal 68 karakter untuk paragraf.
- Tidak ada teks di bawah 12 px. Teks 12 px hanya untuk badge/meta, tidak untuk isi penting.

### 2.3 Spasi, radius, bayangan, gerak

| Kategori | Token | Nilai |
|---|---|---|
| Spasi | `--sp-1…-10` | 4, 8, 12, 16, 24, 32, 40, 48, 64, 80 px |
| Jarak antar kartu | grid gap | 12 px mobile, 20 px tablet, 24 px desktop |
| Padding halaman | gutter | 16 px (< 600), 24 px (600–899), 32 px (≥ 900) |
| Radius | sm / md / lg / xl / pill | 8 / 12 / 16 / 24 / 999 px |
| Bayangan | `shadow-sm` | `0 1px 2px rgba(43,26,18,.06)` |
| | `shadow-md` | `0 6px 16px rgba(43,26,18,.08)` |
| | `shadow-lg` (modal) | `0 16px 40px rgba(43,26,18,.14)` |
| Gerak | mikro / panel | 120 ms / 180 ms, `ease-out` |
| Fokus | ring | 3 px `--focus` + halo 2 px `--bg`, offset 2 px |

`prefers-reduced-motion: reduce` → hilangkan transisi, animasi, dan efek angkat kartu.

### 2.4 Ikonografi & ilustrasi

- Ikon inline SVG 20×20 (24×24 untuk navigasi), stroke 1,75 px, `currentColor`.
- Ikon WhatsApp memakai glyph telepon dalam gelembung (isi penuh) + **selalu disertai label teks**; tidak ada tombol ikon-saja untuk aksi utama.
- Ilustrasi produk: SVG flat 4:3 (800×600), gaya kartun makanan, latar `--surface-warm`, tanpa foto orang, tanpa teks di dalam gambar. Total 8 ilustrasi + 1 `placeholder.svg`.
- `alt` gambar kartu: `"Ilustrasi <nama produk>"`. Gambar dekoratif di hero memakai `alt=""` + `aria-hidden="true"`.

---

## 3. Layout Responsif

| Breakpoint | Nama | Perubahan utama |
|---|---|---|
| 360–599 px | base (mobile) | 1 kolom; navbar 64 px dengan toggle mode full-width; toolbar menempel; tabel dashboard menjadi daftar kartu; modal form menjadi bottom sheet |
| 600–899 px | sm (tablet kecil) | Katalog 2 kolom; ringkasan 2 kolom; hero tetap bertumpuk; modal 560 px |
| 900–1199 px | md (desktop) | Katalog 3 kolom; hero 2 kolom (7/5); tabel dashboard muncul; ringkasan 5 kolom (auto-fit) |
| ≥ 1200 px | lg (desktop lebar) | Container maksimal 1180 px; katalog tetap 3 kolom agar kartu tidak terlalu ramping |

Container: `max-width: 1180px`, `margin-inline: auto`, padding sesuai gutter. Tidak ada scroll horizontal pada 360 px (AC-28).

---

## 4. Struktur Halaman & Navigasi

Dua tampilan dalam satu halaman, berpindah lewat hash:

| Hash | Tampilan | Navigasi |
|---|---|---|
| `#/` | Katalog pembeli | Default saat dibuka |
| `#/kelola` | Dashboard demo pengelola | Tombol mode di navbar |

Navbar (sticky, tinggi 64 px mobile / 72 px desktop, latar `rgba(255,249,240,.94)` + border bawah):

- **Kiri:** logo mark (lingkaran `--chili` 36 px berisi ikon mangkuk putih) + wordmark dua baris: "Kedai Bakso Aci" (16/700) dan "JIMBARAN" (11/600, letter-spacing 0.08em, `--text-muted`).
- **Tengah/kanan:** segmented control **Pembeli | Pengelola**. Desktop: pill container `--surface` + border, segmen aktif `--chili` dengan teks putih. Mobile: dua tab selebar 50% di baris kedua navbar. Aktif ditandai `aria-current="page"` + warna + border, bukan warna saja.
- **Kanan ekstra (≥ 900 px):** tombol outline hijau "Pesan via WhatsApp" (membuka WA tanpa produk) — disembunyikan di mobile untuk menghemat ruang (tetap tersedia di hero).
- **Bawah/samping:** badge status buka (`● Buka Sekarang` hijau) tampil di hero, bukan di navbar, agar navbar tidak padat.

Footer: nama, alamat, jam buka, "Senin tutup", nomor telepon tampil `+62 858-5875-4176`, catatan "Mode demo — data tersimpan di perangkat ini".

---

## 5. Komponen

### 5.1 Hero (F-01)

- Dua kolom pada ≥ 900 px; bertumpuk di mobile (teks dulu, ilustrasi sesudah).
- Isi kiri: chip status buka/tutup (ikon + teks), H1 "Bakso aci pedas, gurih, ramah kantong mahasiswa.", paragraf 1–2 baris, baris alamat dengan ikon pin, baris jam dengan ikon jam ("Selasa–Minggu 11.00–21.00 WITA · Senin tutup"), dua CTA:
  - **Lihat Menu** (primary `--chili`, putih) → scroll ke katalog.
  - **Pesan via WhatsApp** (outline `--leaf`) → `wa.me/6285858754176` dengan pesan umum.
- Isi kanan: panel ilustrasi 4:3 `--surface-warm`, radius 24, stiker "★ BEST SELLER" amber, dan pola dekoratif cabai/daun opacity 8%.
- Status buka dihitung dari jam WITA: Selasa–Minggu 11.00–21.00. Di luar itu tampil chip **"Tutup"** (`--chili-soft` + `--chili-dark`, ikon bulan) dengan teks "Buka Selasa 11.00 WITA" / "Buka besok 11.00 WITA".
- Pada 200% zoom, hero boleh bertumpuk; tidak boleh memotong teks atau menyembunyikan CTA.

### 5.2 Toolbar katalog (F-03, F-04, F-05, F-12)

Susunan mobile: pencarian (baris 1) → chip kategori (baris 2, scroll horizontal) → sorting (baris 3). Desktop: pencarian + sorting satu baris, chip kategori di bawahnya. Toolbar sticky di bawah navbar pada mobile (`top: 64px`, latar `--bg`, border bawah) agar mudah dijangkau saat menggulir.

- **Pencarian:** input 44 px, ikon kaca pembesar di kiri, placeholder "Cari menu, mis. mercon…", label sr-only "Cari menu". Tombol `×` 44×44 muncul saat ada teks (menghapus isi + fokus balik ke input). `Esc` juga menghapus. Debounce 150 ms; hasil dihitung ulang tanpa reload.
- **Chip kategori:** `Semua`, `Menu Utama`, `Ekstra Topping`, `Minuman`. Satu aktif; aktif = latar `--chili`, teks putih, border `--chili`, ditambah `aria-pressed="true"`. Nonaktif = `--surface`, border, teks `--text`. Tinggi 40 px (area sentuh dipadding ke 44 px), jarak antar chip 8 px, bisa digeser horizontal di mobile dengan petunjuk tepi memudar.
- **Sorting:** `<select>` native 44 px dengan opsi "Nama A–Z", "Nama Z–A", "Harga termurah", "Harga termahal". Label terlihat "Urutkan".
- **Baris hasil:** "Menampilkan 8 menu" (`--fs-sm`, `--text-muted`), menjadi live region `aria-live="polite"` saat filter berubah.
- **Data pemesan ringan:** baris ringkas di bawah toolbar — input "Nama pemesan (opsional)" (maks 40 karakter) + toggle Dine-in / Bungkus. Disimpan di `localStorage` (`kba:prefs:v1`); dipakai di teks WhatsApp.

### 5.3 Kartu produk (F-02, F-06, F-11)

Anatomi (atas → bawah), radius 16, border 1 px `--border`, latar `--surface`, `shadow-sm`, hover: `shadow-md` + border `--chili` 40% + naik 2 px (dimatikan saat reduced motion).

1. **Gambar 4:3** `object-fit: cover`, sudut atas membulat. `imageUrl` gagal → `/img/placeholder.svg`.
2. **Badge unggulan** overlay kiri-atas: `★ Best Seller` (`--amber` + `--amber-ink`, radius pill, 12/600). Hanya produk `unggulan: true`.
3. **Nama produk** `--fs-lg` 700, maksimal 2 baris (line-clamp), lalu kategori chip kecil (12/600, `--surface-warm`).
4. **Deskripsi** `--fs-sm` `--text-muted`, maksimal 2 baris + elipsis.
5. **Baris harga & stok:** harga `Rp16.000` (`--fs-price`, tabular, `--text`); chip stok di kanan:
   - stok ≥ 6: "Stok 20" netral (`--surface-warm`);
   - stok 1–5: "Sisa 3" amber (`--amber` + `--amber-ink`, ikon peringatan);
   - stok 0: "Stok habis" (`--chili-soft` + `--chili-dark`), gambar `grayscale(60%)` + opacity 80%.
6. **Pemisah** 1 px.
7. **Stepper porsi** `[−]  2  [+]` (44×44 tiap tombol, angka tabular di tengah, `aria-label="Jumlah porsi Boci Mix Bakso Sapi"`), min 1, maks = stok. `−` nonaktif di 1; `+` nonaktif di stok; stok 0 → seluruh stepper nonaktif.
8. **Tombol "Pesan via WhatsApp"** selebar kartu, 44 px, `--chili` + putih + ikon WA. Stok 0 → `--disabled-bg`, teks `--text-muted`, label "Stok habis", `disabled`.

Kartu tidak memiliki tombol tambah-ke-keranjang (di luar MVP). Jumlah porsi hanya memengaruhi pesan WhatsApp produk tersebut.

### 5.4 Dashboard demo (F-07, F-08, F-09, F-10)

- **Header dashboard:** H1 "Kelola Menu", subteks "Perubahan langsung tampil di katalog pembeli.", tombol primary "+ Tambah Menu".
- **Banner Mode Demo** (wajib, tidak bisa ditutup): latar `--amber`, ikon info, teks "Mode Demo — tanpa login. Data hanya tersimpan di perangkat ini (localStorage)." Bila penulisan localStorage gagal: banner berubah menjadi `--chili-soft` + teks "Perubahan tidak dapat disimpan di perangkat ini."
- **Kartu ringkasan** (grid auto-fit, min 150 px): Produk, Total stok, Produk habis, Unggulan, Estimasi nilai stok. Angka `--fs-2xl` tabular; label 12/600 `--text-muted`. Nilai seed: 8 / 216 / 0 / 2 / Rp1.755.000.
- **Filter dashboard:** pencarian produk (nama) + tombol "Reset data demo" (outline `--chili-dark`). Reset memicu dialog konfirmasi dan mengembalikan 8 seed.
- **Tabel (≥ 900 px):** kolom `Menu` (thumbnail 40 px + nama + deskripsi 1 baris), `Kategori`, `Harga`, `Stok` (stepper `−`/`+` cepat), `Unggulan` (tombol bintang dengan `aria-pressed`), `Aksi` (tautan teks "Ubah" dan "Hapus", bukan ikon saja). Header tabel `--surface-warm`, baris zebra tipis, hover krem.
- **Daftar kartu (< 900 px):** setiap produk menjadi kartu ringkas berisi nama, kategori, harga, stok stepper, badge unggulan, dan baris tombol "Ubah" / "Hapus".
- **Empty state:** "Belum ada menu. Tambahkan menu pertama untuk mulai berjualan." + tombol "+ Tambah Menu".
- **Toast** sukses (tambah/ubah/hapus/reset): pojok kanan-atas desktop, bawah-tengah mobile, 4 detik, `role="status"`, ada tombol tutup. Tidak menutupi tombol aksi tetap.
- **Dialog konfirmasi hapus/reset:** maks 400 px, judul jelas ("Hapus Es Teh Manis?"), teks akibat ("Menu akan hilang dari katalog. Tindakan ini tidak bisa dibatalkan."), tombol "Batal" (sekunder, fokus awal) dan "Hapus" (`--chili`). Esc/klik backdrop = batal. Fokus kembali ke tombol pemicu.

### 5.5 Form tambah/ubah produk

- Modal desktop (maks 560 px, radius 24, `shadow-lg`); bottom sheet layar penuh di mobile dengan footer sticky.
- Field berurutan: Nama*, Kategori*, Harga (Rp)*, Stok*, Deskripsi, Image URL, checkbox "Jadikan menu unggulan".
- Harga & stok berdampingan pada ≥ 600 px; input angka `inputmode="numeric"`, awalan "Rp" statis di dalam field harga, tanpa pemisah ribuan saat mengetik (pemisah hanya pada tampilan).
- Wajib ditandai `*` + catatan "Wajib diisi". Error inline di bawah field: ikon + teks `--chili-dark`, border field `--chili`, `aria-invalid="true"`, `aria-describedby` ke pesan error; fokus otomatis ke field salah pertama.
- Tombol footer: "Batal" (sekunder) dan "Simpan Menu" (primary). Saat menyimpan, tombol tidak perlu loading spinner (operasi lokal, instan) tetapi dinonaktifkan 1 frame untuk mencegah klik ganda.
- Dialog: `aria-modal="true"`, `aria-labelledby` judul, fokus terperangkap, Esc menutup, klik backdrop menutup **hanya** jika form belum berubah; jika sudah diubah, muncul konfirmasi "Buang perubahan?".

### 5.6 State global

| State | Tampilan |
|---|---|
| Hasil filter kosong | Ilustrasi kecil + "Menu tidak ditemukan" + "Coba kata kunci lain atau reset filter." + tombol "Reset filter" |
| Stok habis (kartu) | Chip merah + gambar redup + stepper & tombol pesan nonaktif |
| Data lokal rusak | Banner krem-merah di atas katalog: "Data menu tidak terbaca. Kami memuat menu contoh." + tombol "Mengerti" |
| localStorage gagal | Banner "Perubahan tidak tersimpan di perangkat ini." |
| Mode demo | Banner amber permanen di dashboard |
| Offline | Tidak ada indikator khusus; halaman tetap berfungsi, tombol WA tetap bisa diklik (WhatsApp menangani jaringannya) |

---

## 6. Wireframe Teks

### 6.1 Desktop — Katalog pembeli (≥ 1200 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⟡ KEDAI BAKSO ACI           ┌──────────────┬─────────────┐   ( WhatsApp )   │
│    J I M B A R A N           │ ● Pembeli    │  Pengelola  │   outline hijau  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ● BUKA SEKARANG · Selasa–Minggu 11.00–21.00 WITA        Dine-in & Takeaway  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Bakso aci pedas, gurih,                ╔════════════════════════════════╗   │
│   ramah kantong mahasiswa.               ║   [ilustrasi mangkuk bakso]    ║   │
│                                          ║        ★ BEST SELLER           ║   │
│   📍 Jl. Perum Pasraman Unud No.125      ╚════════════════════════════════╝   │
│      Blk B, Jimbaran                                                         │
│   🕒 Selasa–Minggu 11.00–21.00 WITA · Senin tutup                             │
│                                                                              │
│   [ Lihat Menu ↓ ]   [ (WA) Pesan via WhatsApp ]                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Nama pemesan (opsional) [____________________]      (● Dine-in) ( Bungkus ) │
│  🔍 [ Cari menu, mis. mercon…              × ]        Urutkan [ Nama A–Z  ▾ ] │
│  ( Semua ) ( Menu Utama ) ( Ekstra Topping ) ( Minuman )                     │
├──────────────────────────────────────────────────────────────────────────────┤
│  Menampilkan 8 menu                                                          │
│                                                                              │
│ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐            │
│ │ [ gambar 4:3 ]    │ │ [ gambar 4:3 ]    │ │ [ gambar 4:3 ]    │            │
│ │ ★ Best Seller     │ │                   │ │ ★ Best Seller     │            │
│ │ Bakso Aci Original│ │ Boci Mix Bakso    │ │ Komplit Mercon    │            │
│ │ Menu Utama        │ │ Menu Utama        │ │ Menu Utama        │            │
│ │ Bakso aci kuah    │ │ Bakso sapi + aci  │ │ Level pedas max   │            │
│ │ gurih, chili oil. │ │ chili oil spesial.│ │ + topping melimpah│            │
│ │ Rp12.000  Stok 25 │ │ Rp16.000  Stok 20 │ │ Rp18.000  Sisa 12 │            │
│ │ ────────────────  │ │ ────────────────  │ │ ────────────────  │            │
│ │ [-]  1  [+]       │ │ [-]  1  [+]       │ │ [-]  1  [+]       │            │
│ │ [ (WA) Pesan    ] │ │ [ (WA) Pesan    ] │ │ [ (WA) Pesan    ] │            │
│ └───────────────────┘ └───────────────────┘ └───────────────────┘            │
│                                                                              │
│ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐            │
│ │ Tulang Rangu      │ │ Ekstra Cuanki &   │ │ Sambal Chili Oil  │            │
│ │ Rp15.000  Stok 15 │ │ Pilus Rp5.000 30  │ │ Spesial Rp5.000 40│            │
│ └───────────────────┘ └───────────────────┘ └───────────────────┘            │
│ ┌───────────────────┐ ┌───────────────────┐                                  │
│ │ Josua Rp6.000  24 │ │ Es Teh Rp4.000 50 │      (baris terakhir, rata kiri) │
│ └───────────────────┘ └───────────────────┘                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  Kedai Bakso Aci · Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran            │
│  Selasa–Minggu 11.00–21.00 WITA · Senin tutup · +62 858-5875-4176            │
│  Mode demo — data tersimpan di perangkat ini.                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Mobile — Katalog pembeli (360–599 px)

```
┌────────────────────────────────────────┐
│ ⟡ Kedai Bakso Aci                       │
│   JIMBARAN                              │
│ ┌────────────────┬───────────────────┐ │
│ │ ●  Pembeli     │    Pengelola      │ │  ← tab aktif = merah cabai
│ └────────────────┴───────────────────┘ │
├────────────────────────────────────────┤
│ ● BUKA · 11.00–21.00 WITA               │
│ 📍 Jl. Perum Pasraman Unud No.125       │
│    Blk B, Jimbaran                      │
│ 🕒 Selasa–Minggu · Senin tutup           │
│                                         │
│ Bakso aci pedas, gurih,                 │
│ ramah kantong mahasiswa.                │
│ ┌─────────────────────────────────────┐ │
│ │        [ilustrasi mangkuk]          │ │
│ │            ★ BEST SELLER            │ │
│ └─────────────────────────────────────┘ │
│ [ Lihat Menu ↓ ]   [ (WA) WhatsApp ]    │
├────────────────────────────────────────┤
│ Nama pemesan (opsional)                 │
│ [_____________________________]         │
│ ( ● Dine-in )   ( Bungkus )             │
│ 🔍 [ Cari menu, mis. mercon…      × ]   │  ← sticky
│ (Semua)(Menu Utama)(Ekstra Topping)→    │  ← geser horizontal
│ Urutkan [ Nama A–Z ▾ ]                  │
├────────────────────────────────────────┤
│ Menampilkan 8 menu                      │
│ ┌─────────────────────────────────────┐ │
│ │ [ gambar 4:3 ]            ★ Best    │ │
│ │ Boci Mix Bakso Sapi                 │ │
│ │ Menu Utama                          │ │
│ │ Bakso sapi + aci, chili oil.        │ │
│ │ Rp16.000                 Stok 20    │ │
│ │ ───────────────────────────────     │ │
│ │ [-]   1   [+]      [ (WA) Pesan ]   │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Bakso Aci Original                  │ │
│ │ Menu Utama · Rp12.000    Stok 25    │ │
│ │ [-]   1   [+]      [ (WA) Pesan ]   │ │
│ └─────────────────────────────────────┘ │
│ ... (6 kartu lainnya, 1 kolom)          │
├────────────────────────────────────────┤
│ Kedai Bakso Aci                         │
│ Jl. Perum Pasraman Unud No.125 Blk B    │
│ Selasa–Minggu 11.00–21.00 WITA          │
│ +62 858-5875-4176 · Mode demo           │
└────────────────────────────────────────┘
```

Catatan mobile: saat toolbar menempel, tinggi yang terpakai ± 190 px; kartu pertama harus tetap terlihat minimal 30% di layar 640 px tinggi.

### 6.3 Desktop — Dashboard pengelola (≥ 900 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ⟡ KEDAI BAKSO ACI          [ Pembeli ][ ● Pengelola ]         Mode Demo       │
├──────────────────────────────────────────────────────────────────────────────┤
│ ⓘ MODE DEMO — tanpa login. Perubahan hanya tersimpan di perangkat ini.       │
├──────────────────────────────────────────────────────────────────────────────┤
│  Kelola Menu                                               [+ Tambah Menu]   │
│  Perubahan langsung tampil di katalog pembeli.                               │
│                                                                              │
│ ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌────────────────┐           │
│ │ 8        ││ 216      ││ 0        ││ 2        ││ Rp1.755.000    │           │
│ │ Produk   ││ Total stok││ Habis   ││ Unggulan ││ Estimasi nilai │           │
│ └──────────┘└──────────┘└──────────┘└──────────┘└────────────────┘           │
├──────────────────────────────────────────────────────────────────────────────┤
│ 🔍 [ Cari produk…                ]                  [ Reset data demo ]      │
├───────────────────────┼───────────────┼──────────┼────────────┼─┼──────────────┤
│ Menu                  │ Kategori      │ Harga    │ Stok       │★│ Aksi         │
├───────────────────────┼───────────────┼──────────┼────────────┼─┼──────────────┤
│ [img] Bakso Aci Orig. │ Menu Utama    │ Rp12.000 │ [-] 25 [+] │☆│ Ubah  Hapus  │
│ [img] Boci Mix Sapi   │ Menu Utama    │ Rp16.000 │ [-] 20 [+] │★│ Ubah  Hapus  │
│ [img] Tulang Rangu    │ Menu Utama    │ Rp15.000 │ [-] 15 [+] │☆│ Ubah  Hapus  │
│ [img] Komplit Mercon  │ Menu Utama    │ Rp18.000 │ [-] 12 [+] │★│ Ubah  Hapus  │
│ [img] Paket Cuanki    │ Ekstra Topping│ Rp5.000  │ [-] 30 [+] │☆│ Ubah  Hapus  │
│ [img] Sambal Chili    │ Ekstra Topping│ Rp5.000  │ [-] 40 [+] │☆│ Ubah  Hapus  │
│ [img] Josua / EJS     │ Minuman       │ Rp6.000  │ [-] 24 [+] │☆│ Ubah  Hapus  │
│ [img] Es Teh Manis    │ Minuman       │ Rp4.000  │ [-] 50 [+] │☆│ Ubah  Hapus  │
└──────────────────────────────────────────────────────────────────────────────┘
        (★ = tombol unggulan, ★ aktif = amber, ☆ = nonaktif)
```

### 6.4 Mobile — Dashboard pengelola (360–599 px)

```
┌────────────────────────────────────────┐
│ ⟡ Kedai Bakso Aci                       │
│ ┌────────────────┬───────────────────┐ │
│ │    Pembeli     │ ●  Pengelola      │ │
│ └────────────────┴───────────────────┘ │
├────────────────────────────────────────┤
│ ⓘ MODE DEMO — data di perangkat ini.    │
├────────────────────────────────────────┤
│ Kelola Menu                             │
│ [+ Tambah Menu]            (full width) │
│                                         │
│ ┌────────────┐ ┌────────────┐           │
│ │ 8 Produk   │ │ 216 Stok   │           │
│ └────────────┘ └────────────┘           │
│ ┌────────────┐ ┌────────────┐           │
│ │ 0 Habis    │ │ 2 Unggulan │           │
│ └────────────┘ └────────────┘           │
│ ┌──────────────────────────┐            │
│ │ Rp1.755.000 nilai stok   │            │
│ └──────────────────────────┘            │
├────────────────────────────────────────┤
│ 🔍 [ Cari produk…            ]          │
│ [ Reset data demo ]                     │
├────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [img] Boci Mix Bakso Sapi     ★     │ │
│ │ Menu Utama · Rp16.000               │ │
│ │ Stok  [-] 20 [+]                    │ │
│ │ [ Ubah ]            [ Hapus ]       │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [img] Bakso Aci Original      ☆     │ │
│ │ Menu Utama · Rp12.000               │ │
│ │ Stok  [-] 25 [+]                    │ │
│ │ [ Ubah ]            [ Hapus ]       │ │
│ └─────────────────────────────────────┘ │
│ ... (6 kartu lainnya)                   │
└────────────────────────────────────────┘
```

### 6.5 Modal form & konfirmasi (desktop)

```
        ┌─────────────────────────────────────────────┐
        │ Tambah Menu                             [×] │
        │                                             │
        │ Nama produk *                               │
        │ [_________________________________________] │
        │                                             │
        │ Kategori *                                  │
        │ [ Menu Utama ▾ ]                            │
        │                                             │
        │ Harga (Rp) *              Stok *            │
        │ [ Rp 12000        ]       [ 25          ]   │
        │                                             │
        │ Deskripsi                                   │
        │ [_________________________________________] │
        │ [_________________________________________] │
        │                                             │
        │ Image URL                                   │
        │ [ /img/bakso-aci-original.svg             ] │
        │                                             │
        │ [ ] Jadikan menu unggulan                   │
        │                                             │
        │                     [ Batal ] [ Simpan Menu]│
        └─────────────────────────────────────────────┘

        ┌───────────────────────────────────┐
        │ Hapus Es Teh Manis?               │
        │ Menu akan hilang dari katalog.    │
        │ Tindakan ini tidak bisa dibatalkan│
        │                                   │
        │          [ Batal ]   [ Hapus ]    │  ← fokus awal di "Batal"
        └───────────────────────────────────┘
```

Di mobile, modal form menjadi sheet penuh dari bawah: header "Tambah Menu" + `×`, isi dapat digulir, footer sticky berisi "Batal" dan "Simpan Menu".

---

## 7. Aksesibilitas (WCAG 2.1 AA)

| ID | Persyaratan | Implementasi UI |
|---|---|---|
| A-01 | Kontras teks ≥ 4.5:1 (besar ≥ 3:1) | Semua pasangan di §2.1 terverifikasi; `--amber` hanya untuk latar badge dengan teks `--amber-ink` |
| A-02 | Tidak mengandalkan warna | Status buka = ikon ●/🌙 + kata; stok = teks "Sisa 3"/"Stok habis"; aktif chip = `aria-pressed` + tebal + isi; error = ikon + teks |
| A-03 | Fokus terlihat | Ring 3 px `--focus` + halo 2 px `--bg`, offset 2 px, di semua elemen interaktif; tidak pernah `outline: none` tanpa pengganti |
| A-04 | Target sentuh ≥ 44×44 | Tombol stepper, `×` pencarian, tab mode, tombol aksi kartu |
| A-05 | Struktur & landmark | `header`, `nav`, `main`, `footer`; skip link "Lewati ke menu" sebagai elemen fokus pertama |
| A-06 | Hierarki heading | Satu `h1` per tampilan; seksi `h2`; nama produk di kartu `h3` (bukan heading palsu) |
| A-07 | Form berlabel | Setiap input punya `<label for>`; placeholder bukan pengganti label; field wajib ditandai teks + `aria-required` |
| A-08 | Error dapat dipahami | Pesan spesifik per field, `aria-invalid`, `aria-describedby`, fokus ke field salah pertama, ringkasan error di atas form |
| A-09 | Dialog | `role="dialog"`/`aria-modal`, `aria-labelledby`, fokus terperangkap, Esc menutup, fokus kembali ke pemicu |
| A-10 | Konten dinamis | Jumlah hasil filter & toast dalam `aria-live="polite"`; toast tidak menghapus fokus |
| A-11 | Teks alternatif | `alt="Ilustrasi <nama>"`; ikon dekoratif `aria-hidden="true"`; tombol ikon punya `aria-label` |
| A-12 | Keyboard penuh | Semua alur (cari → filter → porsi → WA → dashboard → CRUD) bisa diselesaikan tanpa mouse |
| A-13 | Zoom & reflow | 200% zoom dan lebar 320 px tidak memotong konten atau memaksa scroll horizontal (target resmi 360 px) |
| A-14 | Gerak | `prefers-reduced-motion` menonaktifkan transisi/animasi/efek angkat |
| A-15 | Bahasa | `lang="id"`; istilah konsisten ("pesan", "porsi", "stok", "unggulan") |
| A-16 | Fokus awal halaman | Saat pindah mode lewat hash, fokus dipindahkan ke `h1` tampilan baru dan diumumkan lewat live region |

---

## 8. Copy Deck (teks UI)

| Elemen | Teks |
|---|---|
| Judul hero | "Bakso aci pedas, gurih, ramah kantong mahasiswa." |
| Subhero | "Bakso aci khas Jimbaran dengan chili oil racikan sendiri. Dine-in atau bungkus, pesan langsung lewat WhatsApp." |
| Alamat | "Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran" |
| Jam | "Selasa–Minggu 11.00–21.00 WITA · Senin tutup" |
| Status buka | "Buka Sekarang" / "Tutup — buka Selasa 11.00 WITA" |
| CTA hero | "Lihat Menu" · "Pesan via WhatsApp" |
| CTA kartu | "Pesan via WhatsApp" / "Stok habis" |
| Pencarian | Label "Cari menu"; placeholder "Cari menu, mis. mercon…" |
| Sorting | "Urutkan" + opsi "Nama A–Z", "Nama Z–A", "Harga termurah", "Harga termahal" |
| Hasil | "Menampilkan {n} menu" |
| Kosong | "Menu tidak ditemukan" / "Coba kata kunci lain atau reset filter." / "Reset filter" |
| Modal WA | Tidak ada modal; pesan langsung dibuka di WhatsApp |
| Dashboard | "Kelola Menu", "Mode Demo — tanpa login. Data hanya tersimpan di perangkat ini (localStorage)." |
| Ringkasan | "Produk", "Total stok", "Produk habis", "Unggulan", "Estimasi nilai stok" |
| Aksi | "Tambah Menu", "Ubah", "Hapus", "Reset data demo", "Simpan Menu", "Batal" |
| Konfirmasi | "Hapus {nama}?" / "Menu akan hilang dari katalog. Tindakan ini tidak bisa dibatalkan." |
| Toast | "Menu ditambahkan.", "Perubahan disimpan.", "Menu dihapus.", "Data demo dipulihkan." |
| Footer | "Mode demo — data tersimpan di perangkat ini." |

Nada bahasa: hangat, singkat, tanpa jargon teknis di sisi pembeli. Jangan memakai "user", "submit", "error 500", atau "login" di UI pembeli.

---

## 9. Matriks State Komponen

| Komponen | Default | Hover | Focus | Active/Pressed | Disabled | Catatan |
|---|---|---|---|---|---|---|
| Tab mode | Teks `--text`, latar transparan | Latar `--surface-warm` | Ring fokus | Latar `--chili`, teks putih | — | `aria-current="page"` pada aktif |
| Chip kategori | `--surface` + border | Border `--chili` | Ring fokus | `--chili` + putih | — | `aria-pressed` |
| Tombol primary | `--chili` | `--chili-dark` | Ring fokus | `--chili-dark`, turun 1 px | `--disabled-bg` + teks muted | Tinggi 44 px |
| Tombol outline | Border `--leaf`, teks `--leaf` | Latar `--leaf-soft` | Ring fokus | Latar `--leaf`, teks putih | Border `--border`, teks muted | Untuk WA sekunder |
| Input | `--surface`, border `--border` | Border `--text-muted` | Ring fokus + border `--chili` | — | Latar `--disabled-bg` | Error: border `--chili` + pesan |
| Stepper | Tombol 44 px, border | Latar `--surface-warm` | Ring fokus | Latar `--disabled-bg` | Teks muted, kursor not-allowed | `+` nonaktif di batas stok |
| Kartu | `--surface` + `shadow-sm` | `shadow-md`, naik 2 px | Ring pada elemen fokus di dalamnya | — | — | Stok 0: gambar redup |
| Baris tabel | Putih | `--surface-warm` | Ring pada kontrol | — | — | Zebra `#FFFCF7` |

Status stok: `≥ 6` netral, `1–5` amber, `0` merah. Angka stok selalu disertai kata ("Stok 20", "Sisa 3", "Stok habis"), bukan hanya warna.

---

## 10. Checklist Verifikasi UI Manual

Dijalankan setelah implementasi, melengkapi AC di `SPEC.md`.

| ID | Langkah | Hasil yang diharapkan |
|---|---|---|
| U-01 | Buka `#/` di 360 px | Latar krem, aksen merah cabai & hijau terlihat; tidak ada scroll horizontal |
| U-02 | Periksa kontras dengan DevTools/contrast checker | Semua pasangan di §2.1 ≥ 4.5:1; badge amber terbaca |
| U-03 | Zoom 200% dan lebar 320 px | Tidak ada konten terpotong; CTA tetap dapat diklik |
| U-04 | Resize 600 / 900 / 1200 px | Katalog 1 → 2 → 3 kolom; hero bertumpuk → 2 kolom |
| U-05 | Scroll halaman | Navbar tetap di atas; toggle mode selalu terlihat; toolbar mobile menempel tanpa menutupi judul |
| U-06 | Klik "Pengelola" lalu "Pembeli" | URL berubah `#/kelola` ↔ `#/`; tab aktif jelas; tombol back browser berfungsi |
| U-07 | Cek hero | Alamat, jam, "Senin tutup", dan status buka/tutup sesuai jam WITA perangkat |
| U-08 | Lihat 8 kartu | Setiap kartu menampilkan gambar, nama, kategori, harga Rupiah, stok, stepper, tombol WA |
| U-09 | Ubah stok jadi 3 lalu 0 | Chip berubah "Sisa 3" amber, lalu "Stok habis" merah + tombol/stepper nonaktif |
| U-10 | Fokus keyboard di kartu | Ring fokus terlihat pada stepper, tombol WA, dan tautan; urutan tab logis |
| U-11 | Ketik pencarian lalu `Esc` | Hasil menyaring; `Esc`/`×` mengosongkan dan mengembalikan fokus ke input |
| U-12 | Geser chip kategori di 360 px | Chip bisa digeser; chip aktif tidak terpotong; tidak ada scrollbar horizontal halaman |
| U-13 | Pilih sorting | Urutan berubah sesuai opsi, tanpa reload |
| U-14 | Tekan `+` sampai batas stok | Angka berhenti di stok; tombol `+` nonaktif secara visual dan `aria-disabled` |
| U-15 | Klik "Pesan via WhatsApp" | Tab WhatsApp terbuka dengan pesan, jumlah, total, metode, nama, alamat; tidak ada teks terpotong |
| U-16 | Buka dashboard | Banner Mode Demo terlihat dan tidak bisa ditutup; 5 kartu ringkasan tampil dengan nilai seed |
| U-17 | Lihat tabel di 900 px dan daftar di 899 px | Perubahan bentuk tabel → kartu tanpa kehilangan data |
| U-18 | Klik "Tambah Menu", Tab di dalam modal | Fokus terperangkap; Esc menutup; fokus kembali ke tombol "+ Tambah Menu" |
| U-19 | Submit form kosong | Error inline muncul, fokus pindah ke field pertama yang salah, pesan terbaca pembaca layar |
| U-20 | Hapus produk | Dialog konfirmasi muncul dengan fokus awal "Batal"; Esc membatalkan |
| U-21 | Simpan/ubah/hapus/reset | Toast muncul di posisi yang benar dan hilang otomatis ± 4 dtk tanpa menggeser layout |
| U-22 | Kosongkan hasil filter | Empty state + tombol "Reset filter" berfungsi |
| U-23 | Aktifkan reduced motion | Tidak ada transisi/animasi/efek angkat; semua fungsi tetap |
| U-24 | Navigasi hanya keyboard dari awal | Skip link → navbar → pencarian → chip → kartu → WA → dashboard → CRUD dapat diselesaikan |

**Definition of Done UI:** U-01…U-24 lulus; tidak ada teks terpotong di 360 px; semua tombol ≥ 44 px; tidak ada aset dari domain eksternal; tidak ada warna yang dipakai sebagai satu-satunya pembeda status.

---

## 11. Catatan Handoff untuk Implementasi

1. Definisikan token §2 sebagai CSS custom properties di `:root`; jangan menulis hex langsung di komponen.
2. Susun CSS mobile-first (`min-width` media queries) dengan breakpoint 600/900/1200 px.
3. Gunakan satu komponen tombol dengan varian `primary`, `outline`, `ghost`, `danger`; semua tinggi 44 px.
4. Render data dinamis lewat `textContent` (bukan `innerHTML` mentah) untuk memenuhi NFR-05.
5. Ilustrasi SVG lokal di `public/img/`; handler `error` gambar mengarah ke `/img/placeholder.svg`.
6. Fokus dialog dikelola manual (simpan elemen pemicu, pindahkan fokus ke dialog, kembalikan saat tutup) karena tidak memakai library.
7. Uji di Chrome + satu browser lain pada lebar 360, 768, 1024, 1440 px sebelum demo.
8. Jangan menambah keranjang, modal kustomisasi pedas/topping, atau struk digital — di luar MVP (`SPEC.md` §8).
