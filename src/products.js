/**
 * Data produk: konstanta domain, validasi bentuk, dan 8 produk seed.
 * Tidak ada persistensi di sini — baca/tulis localStorage ada di `store.js`.
 */

/** Nomor WhatsApp pesanan (tanpa "+", tanpa spasi). */
export const NOMOR_WHATSAPP = "6285858754176";

/** Nomor yang ditampilkan ke pengguna. */
export const NOMOR_WHATSAPP_TAMPIL = "+62 858-5875-4176";

/** Kategori tunggal yang dipakai katalog, filter, dan form dashboard. */
export const KATEGORI = ["Menu Utama", "Ekstra Topping", "Minuman"];

/** Alamat & jam buka — satu-satunya data bisnis nyata di aplikasi. */
export const INFO_TOKO = {
  nama: "Kedai Bakso Aci",
  alamat: "Jl. Perum Pasraman Unud No.125 Blk B, Jimbaran",
  jamBuka: "Selasa–Minggu 11.00–21.00 WITA",
  catatanJam: "Senin tutup",
};

export const BATAS = {
  namaMin: 3,
  namaMaks: 60,
  deskripsiMaks: 160,
  hargaMaks: 1_000_000,
  stokMaks: 9_999,
};

/**
 * Data contoh 8 produk (SPEC.md §4.3).
 * Total stok 216, estimasi nilai stok Rp1.755.000, 2 produk unggulan.
 */
export const SEED_PRODUCTS = [
  {
    id: "p-seed-01",
    nama: "Bakso Aci Original",
    kategori: "Menu Utama",
    harga: 12_000,
    stok: 25,
    deskripsi: "Bakso aci kenyal dengan kuah gurih hangat, disajikan bersama sambal.",
    imageUrl: "/img/bakso-aci-original.svg",
    unggulan: false,
  },
  {
    id: "p-seed-02",
    nama: "Boci Mix Bakso Sapi",
    kategori: "Menu Utama",
    harga: 16_000,
    stok: 20,
    deskripsi: "Campuran boci dan bakso sapi dalam satu mangkuk, ditemani chili oil.",
    imageUrl: "/img/boci-mix.svg",
    unggulan: true,
  },
  {
    id: "p-seed-03",
    nama: "Bakso Aci Tulang Rangu",
    kategori: "Menu Utama",
    harga: 15_000,
    stok: 15,
    deskripsi: "Bakso aci dengan tulang rangu renyah untuk penggemar tekstur.",
    imageUrl: "/img/tulang-rangu.svg",
    unggulan: false,
  },
  {
    id: "p-seed-04",
    nama: "Bakso Aci Komplit Mercon",
    kategori: "Menu Utama",
    harga: 18_000,
    stok: 12,
    deskripsi: "Versi lengkap dengan level pedas mercon bagi yang suka tantangan.",
    imageUrl: "/img/komplit-mercon.svg",
    unggulan: true,
  },
  {
    id: "p-seed-05",
    nama: "Paket Ekstra Topping Cuanki & Pilus",
    kategori: "Ekstra Topping",
    harga: 5_000,
    stok: 30,
    deskripsi: "Tambahan cuanki dan pilus gurih untuk melengkapi semangkuk bakso aci.",
    imageUrl: "/img/topping-cuanki-pilus.svg",
    unggulan: false,
  },
  {
    id: "p-seed-06",
    nama: "Sambal Chili Oil Spesial",
    kategori: "Ekstra Topping",
    harga: 5_000,
    stok: 40,
    deskripsi: "Sambal chili oil buatan sendiri dengan pedas yang pas untuk kuah.",
    imageUrl: "/img/sambal-chili-oil.svg",
    unggulan: false,
  },
  {
    id: "p-seed-07",
    nama: "Josua / Extra Joss Susu",
    kategori: "Minuman",
    harga: 6_000,
    stok: 24,
    deskripsi: "Minuman serbuk susu dingin, segar sebagai pendamping bakso pedas.",
    imageUrl: "/img/josua.svg",
    unggulan: false,
  },
  {
    id: "p-seed-08",
    nama: "Es Teh Manis",
    kategori: "Minuman",
    harga: 4_000,
    stok: 50,
    deskripsi: "Teh manis dingin klasik, pelepas pedas paling sederhana.",
    imageUrl: "/img/es-teh.svg",
    unggulan: false,
  },
];

const batasTeks = (nilai, min, maks) => {
  if (typeof nilai !== "string") return false;
  const panjang = nilai.trim().length;
  return panjang >= min && panjang <= maks;
};

const bilanganBulatDalam = (nilai, min, maks) =>
  Number.isInteger(nilai) && nilai >= min && nilai <= maks;

/** True bila produk memenuhi aturan model SPEC.md §4.1. */
export function produkValid(produk) {
  if (!produk || typeof produk !== "object") return false;

  const { id, nama, kategori, harga, stok, deskripsi, imageUrl, unggulan } = produk;

  if (typeof id !== "string" || id.trim() === "") return false;
  if (!batasTeks(nama, BATAS.namaMin, BATAS.namaMaks)) return false;
  if (!KATEGORI.includes(kategori)) return false;
  if (!bilanganBulatDalam(harga, 0, BATAS.hargaMaks)) return false;
  if (!bilanganBulatDalam(stok, 0, BATAS.stokMaks)) return false;
  if (deskripsi !== undefined && typeof deskripsi !== "string") return false;
  if ((deskripsi ?? "").length > BATAS.deskripsiMaks) return false;
  if (typeof unggulan !== "boolean") return false;
  if (imageUrl !== undefined && typeof imageUrl !== "string") return false;

  return true;
}

/** Salinan bersih data seed, supaya pemanggil tidak bisa merusak konstanta. */
export function produkSeed() {
  return SEED_PRODUCTS.map((produk) => ({ ...produk }));
}
