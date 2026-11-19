import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { filterProducts, SEMUA_KATEGORI, URUTAN } from '../src/filter.js';
import {
  produkValid,
  SEED_PRODUCTS,
  KATEGORI,
  BATAS,
} from '../src/products.js';
import { buildWhatsAppUrl, nomorWhatsAppValid } from '../src/whatsapp.js';
import {
  muatProduk,
  simpanProduk,
  resetProduk,
  muatPrefs,
  simpanPrefs,
  imporJson,
  eksporJson,
  resetStateInternal,
  KUNCI_PRODUK,
  KUNCI_PREFS,
} from '../src/store.js';

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

/** Salinan produk seed sederhana untuk tes. */
function produkSederhana(overrides = {}) {
  return {
    id: 'p-1',
    nama: 'Bakso Aci Original',
    kategori: 'Menu Utama',
    harga: 12_000,
    stok: 10,
    deskripsi: 'Bakso aci kenyal.',
    unggulan: false,
    imageUrl: '/img/test.svg',
    ...overrides,
  };
}

/** Stub window.localStorage yang bisa dibaca dan ditulis saat tes. */
function buatLocalStorageStub(awal = {}) {
  const store = new Map(Object.entries(awal));
  const localStorage = {
    getItem(kunci) {
      return store.has(kunci) ? store.get(kunci) : null;
    },
    setItem(kunci, nilai) {
      store.set(kunci, nilai);
    },
    removeItem(kunci) {
      store.delete(kunci);
    },
  };
  return { store, localStorage };
}

// --------------------------------------------------------------------
// filterProducts
// --------------------------------------------------------------------

describe('filterProducts', () => {
  const produk = [
    {
      id: 'p1',
      nama: 'Bakso Aci Original',
      kategori: 'Menu Utama',
      harga: 12_000,
      stok: 10,
      deskripsi: 'Kuah gurih',
      unggulan: false,
    },
    {
      id: 'p2',
      nama: 'Boci Mix Bakso Sapi',
      kategori: 'Menu Utama',
      harga: 16_000,
      stok: 5,
      deskripsi: 'Campuran boci dan bakso sapi',
      unggulan: true,
    },
    {
      id: 'p3',
      nama: 'Es Teh Manis',
      kategori: 'Minuman',
      harga: 4_000,
      stok: 50,
      deskripsi: 'Teh manis dingin',
      unggulan: false,
    },
  ];

  it('should return semua produk bila filter kosong', () => {
    expect(filterProducts(produk)).toHaveLength(3);
  });

  it('should memfilter berdasarkan kata kunci nama/deskripsi', () => {
    const hasil = filterProducts(produk, { q: 'boci' });
    expect(hasil).toHaveLength(1);
    expect(hasil[0].id).toBe('p2');
  });

  it('should peka huruf besar/kecil pada kata kunci', () => {
    const hasil = filterProducts(produk, { q: 'BAKSO' });
    expect(hasil).toHaveLength(2);
  });

  it('should memfilter berdasarkan kategori', () => {
    const hasil = filterProducts(produk, { kategori: 'Minuman' });
    expect(hasil).toHaveLength(1);
    expect(hasil[0].id).toBe('p3');
  });

  it('should menangani kategori tak valid dengan hasil kosong', () => {
    const hasil = filterProducts(produk, { kategori: 'Kategori Tak Ada' });
    expect(hasil).toHaveLength(0);
  });

  it('should mengurutkan berdasarkan harga ascending', () => {
    const hasil = filterProducts(produk, { sort: URUTAN.HARGA_ASC });
    expect(hasil.map((p) => p.harga)).toEqual([4_000, 12_000, 16_000]);
  });

  it('should mengurutkan berdasarkan harga descending', () => {
    const hasil = filterProducts(produk, { sort: URUTAN.HARGA_DESC });
    expect(hasil.map((p) => p.harga)).toEqual([16_000, 12_000, 4_000]);
  });

  it('should menangani harga negatif bila ada (tetap muncul jika lolos filter)', () => {
    const produkDenganHargaNegatif = [
      ...produk,
      { id: 'p4', nama: 'Harga Minus', kategori: 'Minuman', harga: -100, stok: 1, deskripsi: '', unggulan: false },
    ];
    const hasil = filterProducts(produkDenganHargaNegatif, { sort: URUTAN.HARGA_ASC });
    expect(hasil[0].harga).toBe(-100);
  });

  it('should menangani stok nol', () => {
    const produkDenganStokNol = [
      ...produk,
      { id: 'p4', nama: 'Habis', kategori: 'Minuman', harga: 1_000, stok: 0, deskripsi: '', unggulan: false },
    ];
    const hasil = filterProducts(produkDenganStokNol, { q: 'habis' });
    expect(hasil).toHaveLength(1);
    expect(hasil[0].stok).toBe(0);
  });

  it('should menyaring item dengan deskripsi undefined', () => {
    const produkTanpaDeskripsi = [
      { id: 'p4', nama: 'Tanpa Deskripsi', kategori: 'Minuman', harga: 1_000, stok: 1, deskripsi: undefined, unggulan: false },
    ];
    const hasil = filterProducts(produkTanpaDeskripsi, { q: 'tanpa' });
    expect(hasil).toHaveLength(1);
  });

  it('should menggunakan URUTAN.NAMA_ASC sebagai default', () => {
    const hasil = filterProducts(produk, { q: 'b' });
    const namaOrdered = [...hasil].map((p) => p.nama);
    expect(namaOrdered).toEqual([...namaOrdered].sort((a, b) => a.localeCompare(b, 'id')));
  });
});

// --------------------------------------------------------------------
// produkValid
// --------------------------------------------------------------------

describe('produkValid', () => {
  it('should validasi produk seed yang lengkap', () => {
    for (const produk of SEED_PRODUCTS) {
      expect(produkValid(produk)).toBe(true);
    }
  });

  it('should menolak kategori tak valid', () => {
    const produk = produkSederhana({ kategori: 'Kategori Salah' });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak harga di atas batas maksimum', () => {
    const produk = produkSederhana({ harga: BATAS.hargaMaks + 1 });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak harga negatif', () => {
    const produk = produkSederhana({ harga: -1 });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak stok di atas batas maksimum', () => {
    const produk = produkSederhana({ stok: BATAS.stokMaks + 1 });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak stok negatif', () => {
    const produk = produkSederhana({ stok: -1 });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak nama terlalu pendek', () => {
    const produk = produkSederhana({ nama: 'Ab' });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak nama kosong', () => {
    const produk = produkSederhana({ nama: '   ' });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak produk tanpa id', () => {
    const produk = produkSederhana({ id: '' });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak payload rusak (bukan object)', () => {
    expect(produkValid(null)).toBe(false);
    expect(produkValid(undefined)).toBe(false);
    expect(produkValid('string')).toBe(false);
    expect(produkValid(123)).toBe(false);
    expect(produkValid([])).toBe(false);
  });

  it('should menolak unggulan bukan boolean', () => {
    const produk = produkSederhana({ unggulan: 'iya' });
    expect(produkValid(produk)).toBe(false);
  });

  it('should menolak deskripsi bukan string', () => {
    const produk = produkSederhana({ deskripsi: 123 });
    expect(produkValid(produk)).toBe(false);
  });
});

// --------------------------------------------------------------------
// buildWhatsAppUrl / nomorWhatsAppValid
// --------------------------------------------------------------------

describe('nomorWhatsAppValid', () => {
  it('should menerima nomor dengan awalan +', () => {
    expect(nomorWhatsAppValid('+6285858754176')).toBe(true);
  });

  it('should menerima nomor tanpa awalan +', () => {
    expect(nomorWhatsAppValid('6285858754176')).toBe(true);
  });

  it('should menolak nomor terlalu pendek', () => {
    expect(nomorWhatsAppValid('6285875')).toBe(false);
  });

  it('should menolak spasi dalam nomor', () => {
    expect(nomorWhatsAppValid('62 858 5875 4176')).toBe(false);
  });

  it('should menolak teks kosong', () => {
    expect(nomorWhatsAppValid('')).toBe(false);
  });

  it('should menolak null/undefined', () => {
    expect(nomorWhatsAppValid(null)).toBe(false);
    expect(nomorWhatsAppValid(undefined)).toBe(false);
  });

  it('should menolak karakter non-digit', () => {
    expect(nomorWhatsAppValid('62858abc4176')).toBe(false);
  });
});

describe('buildWhatsAppUrl', () => {
  const produk = {
    nama: 'Bakso Aci Original',
    harga: 12_000,
  };

  it('should membangun URL WhatsApp untuk nomor dan produk valid', () => {
    const url = buildWhatsAppUrl('6285858754176', produk);
    expect(url).toContain('https://wa.me/6285858754176');
    expect(url).toContain(encodeURIComponent('Bakso Aci Original'));
  });

  it('should mengembalikan null bila nomor tidak valid', () => {
    expect(buildWhatsAppUrl('123', produk)).toBeNull();
    expect(buildWhatsAppUrl('', produk)).toBeNull();
  });

  it('should mengembalikan null bila produk kosong', () => {
    expect(buildWhatsAppUrl('6285858754176', null)).toBeNull();
    expect(buildWhatsAppUrl('6285858754176', undefined)).toBeNull();
  });

  it('should mengembalikan null bila nama produk kosong', () => {
    const produkKosong = { nama: '   ', harga: 1_000 };
    expect(buildWhatsAppUrl('6285858754176', produkKosong)).toBeNull();
  });

  it('should mengembalikan null bila harga produk negatif', () => {
    const produkNegatif = { nama: 'Test', harga: -100 };
    expect(buildWhatsAppUrl('6285858754176', produkNegatif)).toBeNull();
  });

  it('should encode teks pesan agar aman di URL', () => {
    const url = buildWhatsAppUrl('6285858754176', produk);
    expect(decodeURIComponent(url.split('?text=')[1])).toContain('Bakso Aci Original x1 = Rp12.000');
  });

  it('should menangani nomor dengan awalan +', () => {
    const url = buildWhatsAppUrl('+6285858754176', produk);
    expect(url).toContain('https://wa.me/6285858754176');
    expect(url).not.toContain('+6285858754176');
  });

  it('should menangani payload rusak (nama bukan string)', () => {
    const produkRusak = { nama: 12345, harga: 1000 };
    expect(buildWhatsAppUrl('6285858754176', produkRusak)).toBeNull();
  });
});

// --------------------------------------------------------------------
// localStorage parser (muatProduk, simpanProduk, muatPrefs, simpanPrefs)
// --------------------------------------------------------------------

describe('localStorage parser', () => {
  // Set up global window.localStorage sesuai dengan yang diinginkan sebelum setiap tes
  beforeEach(() => {
    global.window = {
      localStorage: {
        store: new Map(),
        getItem(kunci) {
          return this.store.has(kunci) ? this.store.get(kunci) : null;
        },
        setItem(kunci, nilai) {
          this.store.set(kunci, nilai);
        },
        removeItem(kunci) {
          this.store.delete(kunci);
        },
      },
    };
    global.window.localStorage = global.window.localStorage;
    // Reset state internal module
    resetStateInternal();
  });

  afterEach(() => {
    delete global.window;
  });

  it('should memuat produk dari localStorage yang valid', () => {
    const produk = [{ id: 'p1', nama: 'Test', kategori: 'Menu Utama', harga: 5000, stok: 1, deskripsi: '', unggulan: false }];
    simpanProduk(produk);
    const result = muatProduk();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('should memuat ulang seed bila localStorage kosong', () => {
    // localStorage sudah kosong karena beforeEach
    const result = muatProduk();
    expect(result).toHaveLength(SEED_PRODUCTS.length);
  });

  it('should membuang item tidak valid dari localStorage', () => {
    const produkValid = { id: 'p1', nama: 'Valid', kategori: 'Menu Utama', harga: 5000, stok: 1, deskripsi: '', unggulan: false };
    const produkTidakValid = { id: 'p2', nama: 'Invalid', kategori: 'Kategori Salah', harga: 5000, stok: 1, deskripsi: '', unggulan: false };
    // Simpan produk, pastikan cache direset agar membaca dari localStorage
    resetStateInternal();
    simpanProduk([produkValid, produkTidakValid]);
    resetStateInternal(); // reset cache agar muatProduk membaca dari localStorage
    const result = muatProduk();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('should menyimpan produk ke localStorage', () => {
    const produk = [{ id: 'p1', nama: 'Test', kategori: 'Minuman', harga: 1000, stok: 2, deskripsi: '', unggulan: false }];
    const berhasil = simpanProduk(produk);
    expect(berhasil).toBe(true);
    const tersimpan = JSON.parse(global.window.localStorage.getItem(KUNCI_PRODUK));
    expect(tersimpan.products).toHaveLength(1);
    expect(tersimpan.products[0].id).toBe('p1');
    expect(tersimpan.version).toBe(1);
    expect('updatedAt' in tersimpan).toBe(true);
  });

  it('should menangani JSON rusak di localStorage', () => {
    global.window.localStorage.setItem(KUNCI_PRODUK, 'bukan-json');
    const result = muatProduk();
    expect(result).toHaveLength(SEED_PRODUCTS.length);
  });

  it('should menangani payload rusak (bukan array) di localStorage', () => {
    global.window.localStorage.setItem(KUNCI_PRODUK, JSON.stringify({ products: 'bukan-array' }));
    const result = muatProduk();
    expect(result).toHaveLength(SEED_PRODUCTS.length);
  });

  it('should menangani payload tanpa properti products', () => {
    global.window.localStorage.setItem(KUNCI_PRODUK, JSON.stringify({ version: 1 }));
    const result = muatProduk();
    expect(result).toHaveLength(SEED_PRODUCTS.length);
  });

  it('should mereset produk ke seed', () => {
    simpanProduk([{ id: 'p1', nama: 'Test', kategori: 'Menu Utama', harga: 1000, stok: 1, deskripsi: '', unggulan: false }]);
    resetProduk();
    const result = muatProduk();
    expect(result).toHaveLength(SEED_PRODUCTS.length);
  });

  it('should memuat preferensi dari localStorage', () => {
    simpanPrefs({ namaPemesan: 'Budi', metode: 'bungkus' });
    const prefs = muatPrefs();
    expect(prefs.namaPemesan).toBe('Budi');
    expect(prefs.metode).toBe('bungkus');
  });

  it('should mengembalikan default bila preferensi tidak ada', () => {
    const prefs = muatPrefs();
    expect(prefs.namaPemesan).toBe('');
    expect(prefs.metode).toBe('dine-in');
  });

  it('should membuang metode tidak valid dalam preferensi', () => {
    simpanPrefs({ metode: 'kirim' });
    const prefs = muatPrefs();
    expect(prefs.metode).toBe('dine-in');
  });

  it('should memotong nama pemesan maksimal 60 karakter', () => {
    simpanPrefs({ namaPemesan: 'A'.repeat(100), metode: 'bungkus' });
    const prefs = muatPrefs();
    expect(prefs.namaPemesan.length).toBe(60);
  });

  it('should menangani JSON rusak pada preferensi', () => {
    global.window.localStorage.setItem(KUNCI_PREFS, 'rusak');
    const prefs = muatPrefs();
    expect(prefs.namaPemesan).toBe('');
    expect(prefs.metode).toBe('dine-in');
  });

  it('should menangani impor JSON produk yang valid', () => {
    const data = {
      version: 1,
      products: [
        { id: 'p1', nama: 'Produk Baru', kategori: 'Menu Utama', harga: 20000, stok: 5, deskripsi: 'Desc', unggulan: true },
      ],
    };
    const result = imporJson(JSON.stringify(data));
    expect(result.berhasil).toBe(true);
    expect(result.produk).toHaveLength(1);
  });

  it('should menolak impor tanpa produk yang valid', () => {
    const data = {
      version: 1,
      products: [
        { id: 'p1', nama: 'Salah Kategori', kategori: 'Tak Valid', harga: 20000, stok: 5, deskripsi: 'Desc', unggulan: true },
      ],
    };
    const result = imporJson(JSON.stringify(data));
    expect(result.berhasil).toBe(false);
    expect(result.produk).toBeNull();
  });

  it('should menolak impor JSON tidak valid', () => {
    const result = imporJson('bukan json');
    expect(result.berhasil).toBe(false);
    expect(result.pesan).toContain('JSON tidak valid');
  });

  it('should menolak impor tanpa versi', () => {
    const data = { products: [] };
    const result = imporJson(JSON.stringify(data));
    expect(result.berhasil).toBe(false);
    expect(result.pesan).toContain('versi');
  });

  it('should mengembalikan ekspor JSON yang valid', () => {
    const json = eksporJson();
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(Array.isArray(parsed.products)).toBe(true);
    expect(parsed.products.length).toBe(SEED_PRODUCTS.length);
  });
});
