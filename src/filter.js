/**
 * Logika filter katalog — fungsi murni, tanpa DOM.
 * Pencarian tidak peka huruf besar/kecil pada nama dan deskripsi,
 * filter kategori dan sorting dapat digunakan bersamaan.
 */

export const SEMUA_KATEGORI = "Semua";

export const URUTAN = {
  NAMA_ASC: "nama-asc",
  HARGA_ASC: "harga-asc",
  HARGA_DESC: "harga-desc",
};

const bandingkanNama = (a, b) => a.nama.localeCompare(b.nama, "id");

const pembanding = {
  [URUTAN.NAMA_ASC]: bandingkanNama,
  [URUTAN.HARGA_ASC]: (a, b) => a.harga - b.harga || bandingkanNama(a, b),
  [URUTAN.HARGA_DESC]: (a, b) => b.harga - a.harga || bandingkanNama(a, b),
};

/**
 * @param {Array} produk daftar produk (tidak diubah)
 * @param {{ q?: string, kategori?: string, sort?: string }} filter
 * @returns {Array} salinan hasil filter yang sudah diurutkan
 */
export function filterProducts(produk, { q = "", kategori = SEMUA_KATEGORI, sort = URUTAN.NAMA_ASC } = {}) {
  const kataKunci = String(q ?? "").trim().toLowerCase();

  const hasil = produk.filter((item) => {
    if (kategori !== SEMUA_KATEGORI && item.kategori !== kategori) return false;
    if (!kataKunci) return true;
    return `${item.nama} ${item.deskripsi ?? ""}`.toLowerCase().includes(kataKunci);
  });

  const urutkan = pembanding[sort] ?? bandingkanNama;
  return hasil.sort(urutkan);
}
