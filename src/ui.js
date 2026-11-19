/**
 * Utilitas tampilan: format Rupiah, escape teks, dan penanda navigasi.
 * Render katalog & dashboard akan ditambahkan pada milestone berikutnya.
 */

import { INFO_TOKO } from "./products.js";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 16000 → "Rp16.000" (tanpa spasi setelah Rp). */
export function formatRupiah(nilai) {
  return rupiah.format(Number(nilai) || 0).replace(/\s/g, "");
}

/** Escape teks yang akan disisipkan ke template HTML. */
export function escapeHtml(teks) {
  return String(teks).replace(
    /[&<>"']/g,
    (karakter) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[karakter],
  );
}

/** Tandai tautan navigasi yang aktif berdasarkan hash saat ini. */
export function tandaiNavigasiAktif(hash) {
  const tampilan = hash === "#/kelola" ? "#/kelola" : "#/";
  document.querySelectorAll(".site-nav__link").forEach((tautan) => {
    const aktif = tautan.getAttribute("href") === tampilan;
    if (aktif) tautan.setAttribute("aria-current", "page");
    else tautan.removeAttribute("aria-current");
  });
}

/**
 * Ringkasan fondasi pada milestone scaffold: hanya membuktikan data seed,
 * store, dan format Rupiah sudah tersambung.
 */
export function renderStatusFondasi(produk) {
  const wadah = document.querySelector("#status-fondasi");
  if (!wadah) return;

  const totalStok = produk.reduce((jumlah, item) => jumlah + item.stok, 0);
  const nilaiStok = produk.reduce((jumlah, item) => jumlah + item.harga * item.stok, 0);

  wadah.textContent =
    `Fondasi siap — ${produk.length} produk contoh dimuat dari penyimpanan lokal. ` +
    `Total stok ${totalStok}, estimasi nilai stok ${formatRupiah(nilaiStok)}. ` +
    `Katalog dan dashboard menyusul pada milestone berikutnya.`;
  wadah.dataset.siap = "true";
}

/** Info toko dipakai footer/hero; disimpan di sini agar tidak diulang di HTML. */
export { INFO_TOKO };
