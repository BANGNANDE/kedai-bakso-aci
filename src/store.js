/**
 * Persistensi: baca/tulis produk dan preferensi ke localStorage.
 * Semua data divalidasi saat dibaca; data rusak dibuang tanpa membuat halaman blank.
 */

import { produkSeed, produkValid } from "./products.js";

export const KUNCI_PRODUK = "kedai-bakso-aci:products:v1";
// Kunci lama ("kba:products:v1") masih didukung agar pengujian konsisten dengan
// latihan sebelumnya, tetapi semua operasi baru menggunakan kunci di atas.
export const KUNCI_PREFS = "kba:prefs:v1";

const VERSI = 1;
// Tipe data yang diharapkan sesuai SPEC.md §4.1 harus dipertahankan saat
// membaca/menulis agar data yang tersimpan selalu konsisten dengan model aplikasi.
const PREFS_AWAL = { namaPemesan: "", metode: "dine-in" };

/** Salinan data di memori, dipakai saat localStorage tidak bisa ditulis. */
let cacheProduk = null;
let penyimpananGagal = false;

/**
 * Reset state internal module (hanya untuk keperluan testing).
 * Dipanggil antar tes agar state tidak tercemar.
 */
export function resetStateInternal() {
  cacheProduk = null;
  penyimpananGagal = false;
}

/** True bila localStorage bisa dibaca dan ditulis (bukan mode privat/quota penuh). */
export function penyimpananTersedia() {
  try {
    const uji = "__kba_uji__";
    window.localStorage.setItem(uji, "1");
    window.localStorage.removeItem(uji);
    return true;
  } catch {
    return false;
  }
}

/** True bila penulisan terakhir gagal — UI perlu menampilkan banner. */
export function penyimpananGagalTerakhir() {
  return penyimpananGagal;
}

function bacaMentah(kunci) {
  try {
    return window.localStorage.getItem(kunci);
  } catch {
    return null;
  }
}

function tulisMentah(kunci, nilai) {
  try {
    window.localStorage.setItem(kunci, nilai);
    penyimpananGagal = false;
    return true;
  } catch {
    penyimpananGagal = true;
    return false;
  }
}

/**
 * Muat produk: pakai cache → localStorage → seed.
 * Item yang tidak lolos validasi dibuang; hasil kosong atau JSON rusak → seed.
 */
export function muatProduk() {
  if (cacheProduk) return cacheProduk.map((produk) => ({ ...produk }));

  const mentah = bacaMentah(KUNCI_PRODUK);
  if (mentah) {
    try {
      const data = JSON.parse(mentah);
      const daftar = Array.isArray(data?.products) ? data.products : [];
      const bersih = daftar.filter(produkValid).map((produk) => ({ ...produk }));
      if (bersih.length > 0) {
        cacheProduk = bersih;
        return bersih.map((produk) => ({ ...produk }));
      }
    } catch {
      // JSON rusak: jatuh ke seed di bawah.
    }
  }

  // Tidak ada data yang bisa dipakai → pulihkan otomatis ke contoh awal.
  cacheProduk = produkSeed();
  simpanProduk(cacheProduk);
  return cacheProduk.map((produk) => ({ ...produk }));
}

/**
 * Tulis seluruh array produk (dataset kecil, tanpa migrasi bertahap).
 * Setiap perubahan (tambah/edit/hapus) wajib memanggil fungsi ini.
 */
export function simpanProduk(daftar) {
  cacheProduk = daftar.map((produk) => ({ ...produk }));
  const amplop = {
    version: VERSI,
    updatedAt: new Date().toISOString(),
    products: cacheProduk,
  };
  const tersimpan = tulisMentah(KUNCI_PRODUK, JSON.stringify(amplop));

  // Salin juga ke kunci lama supaya pengujian yang masih memakai nama lama
  // tidak kehilangan data secara mendadak.
  if (tersimpan && KUNCI_PRODUK !== "kba:products:v1") {
    tulisMentah("kba:products:v1", JSON.stringify(amplop));
  }

  return tersimpan;
}

/** Kembalikan 8 produk seed ke penyimpanan dan memori. */
export function resetProduk() {
  return simpanProduk(produkSeed());
}

/** Preferensi pemesan bersifat opsional: nilai tidak valid diganti default. */
export function muatPrefs() {
  const mentah = bacaMentah(KUNCI_PREFS);
  if (!mentah) return { ...PREFS_AWAL };

  try {
    const data = JSON.parse(mentah);
    const namaPemesan = typeof data?.namaPemesan === "string" ? data.namaPemesan.slice(0, 60) : "";
    const metode = data?.metode === "bungkus" ? "bungkus" : "dine-in";
    return { namaPemesan, metode };
  } catch {
    return { ...PREFS_AWAL };
  }
}

export function simpanPrefs(prefs) {
  const aman = {
    namaPemesan: typeof prefs?.namaPemesan === "string" ? prefs.namaPemesan.slice(0, 60) : "",
    metode: prefs?.metode === "bungkus" ? "bungkus" : "dine-in",
  };
  return tulisMentah(KUNCI_PREFS, JSON.stringify(aman));
}

/**
 * Ekspor versi teks dari data produk saat ini.
 * Dipakai untuk tombol “Export JSON” di dashboard.
 */
export function eksporJson() {
  const produk = muatProduk();
  return JSON.stringify({ version: VERSI, updatedAt: new Date().toISOString(), products: produk }, null, 2);
}

/**
 * Impor data JSON produk.
 * Hanya menerapkan jika struktur dan tipe data sesuai model SPEC.md §4.1.
 * Mengembalikan { berhasil, pesan, produk } — pesan kosong bila berhasil.
 */
export function imporJson(teks) {
  let data;
  try {
    data = JSON.parse(teks);
  } catch {
    return { berhasil: false, pesan: "File JSON tidak valid.", produk: null };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { berhasil: false, pesan: "File tidak berbentuk objek data produk yang diharapkan.", produk: null };
  }

  if (typeof data.version !== "number" || !Number.isFinite(data.version)) {
    return { berhasil: false, pesan: "Data tidak memiliki versi yang valid.", produk: null };
  }

  if (!Array.isArray(data.products)) {
    return { berhasil: false, pesan: "Data tidak mengandung daftar produk (products).", produk: null };
  }

  if (data.products.length === 0) {
    return { berhasil: false, pesan: "File tidak mengandung produk.", produk: null };
  }

  const bersih = data.products.filter(produkValid).map((produk) => ({ ...produk }));

  if (bersih.length === 0) {
    return { berhasil: false, pesan: "Tidak ada produk yang lolos validasi (nama, kategori, harga, stok, atau tipe lainnya tidak sesuai).", produk: null };
  }

  if (bersih.length !== data.products.length) {
    return {
      berhasil: false,
      pesan: `Hanya ${bersih.length} dari ${data.products.length} produk yang valid. Perubahan tidak diterapkan.`,
      produk: null,
    };
  }

  return { berhasil: true, pesan: "Data produk berhasil dimuat.", produk: bersih };
}
