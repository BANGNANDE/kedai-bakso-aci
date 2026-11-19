/**
 * Persistensi: baca/tulis produk dan preferensi ke localStorage.
 * Semua data divalidasi saat dibaca; data rusak dibuang tanpa membuat halaman blank.
 */

import { produkSeed, produkValid } from "./products.js";

export const KUNCI_PRODUK = "kba:products:v1";
export const KUNCI_PREFS = "kba:prefs:v1";

const VERSI = 1;
const PREFS_AWAL = { namaPemesan: "", metode: "dine-in" };

/** Salinan data di memori, dipakai saat localStorage tidak bisa ditulis. */
let cacheProduk = null;
let penyimpananGagal = false;

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

  cacheProduk = produkSeed();
  simpanProduk(cacheProduk);
  return cacheProduk.map((produk) => ({ ...produk }));
}

/** Tulis seluruh array produk (dataset kecil, tanpa migrasi bertahap). */
export function simpanProduk(daftar) {
  cacheProduk = daftar.map((produk) => ({ ...produk }));
  const amplop = {
    version: VERSI,
    updatedAt: new Date().toISOString(),
    products: cacheProduk,
  };
  return tulisMentah(KUNCI_PRODUK, JSON.stringify(amplop));
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
