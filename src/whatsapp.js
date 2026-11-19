/**
 * Pembuat tautan pesanan WhatsApp — fungsi murni tanpa DOM.
 * Nomor tujuan wajib format internasional: digit 8–15, boleh berawalan "+",
 * tanpa spasi/strip. Pesan selalu di-encode sebelum masuk URL.
 */

import { INFO_TOKO } from "./products.js";
import { formatRupiah } from "./format.js";

const POLA_NOMOR_INTERNASIONAL = /^\+?[1-9]\d{7,14}$/;

/** True bila nomor tampak seperti nomor internasional yang valid. */
export function nomorWhatsAppValid(nomor) {
  return POLA_NOMOR_INTERNASIONAL.test(String(nomor ?? "").trim());
}

/**
 * Bangun URL wa.me untuk satu produk. Mengembalikan null bila nomor atau
 * produk tidak valid, sehingga pemanggil dapat menonaktifkan tombol.
 */
export function buildWhatsAppUrl(nomor, produk) {
  if (!nomorWhatsAppValid(nomor)) return null;

  if (!produk || typeof produk.nama !== "string" || produk.nama.trim() === "") return null;
  if (!Number.isFinite(produk.harga) || produk.harga < 0) return null;

  const tujuan = String(nomor).trim().replace(/^\+/, "");
  const harga = formatRupiah(produk.harga);
  const nama = produk.nama.trim();

  const pesan = [
    "Halo Kedai Bakso Aci, saya mau pesan:",
    "",
    `• ${nama} x1 = ${harga}`,
    `Total: ${harga}`,
    "",
    `Alamat: ${INFO_TOKO.alamat}`,
    `Jam buka: ${INFO_TOKO.jamBuka}`,
    "",
    "Terima kasih!",
  ].join("\n");

  return `https://wa.me/${tujuan}?text=${encodeURIComponent(pesan)}`;
}
