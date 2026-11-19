/** Format angka Rupiah tanpa spasi setelah "Rp" — dipakai kartu dan pesan WhatsApp. */

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 16000 → "Rp16.000". */
export function formatRupiah(nilai) {
  return rupiah.format(Number(nilai) || 0).replace(/\s/g, "");
}
