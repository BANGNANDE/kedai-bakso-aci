/**
 * Dashboard demo pengelola — tampilan CRUD produk, ringkasan stok, dan
 * reset data. Tersedia lewat hash #/kelola (tombol “Pengelola” di navbar).
 *
 * Ini adalah fitur demo, tanpa login/sesi; perubahan langsung tersimpan di
 * localStorage dan tampak di katalog pembeli (halaman #/).
 */

import { KATEGORI, produkSeed } from "./products.js";
import {
  muatProduk,
  simpanProduk,
  resetProduk,
  muatPrefs,
  simpanPrefs,
  penyimpananTersedia,
  penyimpananGagalTerakhir,
} from "./store.js";
import { produkValid } from "./products.js";
import { formatRupiah } from "./format.js";
import { escapeHtml } from "./ui.js";
import { filterProducts, SEMUA_KATEGORI, URUTAN } from "./filter.js";
import { renderKatalog as renderKatalogUi } from "./ui.js";

export const RUTE_DASHBOARD = "#/kelola";
export const RUTE_KATALOG = "#/";

const KATEGORI_HUMAN = new Map(KATEGORI.map((k) => [k, k]));

let produkAktif = [];
let sedangEdit = null; // id produk yang sedang dibuka untuk diubah (null = tambah)

// ---

/** Buat id unik untuk produk baru (bukan crypto.randomUUID, agar konsisten di semua lingkungan). */
export function idProdukBaru() {
  const penanda = Date.now().toString(36);
  const acak = String(Math.floor(Math.random() * 9000 + 1000));
  return `p-${penanda}-${acak}`;
}

/** Ringkasan statistik dari daftar produk. */
export function ringkasan(daftar) {
  const total = daftar.length;
  const totalStok = daftar.reduce((jumlah, p) => jumlah + Math.max(0, p.stok || 0), 0);
  const habis = daftar.filter((p) => (p.stok || 0) <= 0).length;
  const unggulan = daftar.filter((p) => !!p.unggulan).length;
  const estimasi = daftar.reduce((jumlah, p) => jumlah + (p.harga || 0) * Math.max(0, p.stok || 0), 0);
  return { total, totalStok, habis, unggulan, estimasi };
}

/** Render snapshot ringkasan. */
export function renderRingkasan() {
  const r = ringkasan(produkAktif);
  const kotak = document.querySelector("#ringkasan-grid");
  if (!kotak) return;

  kotak.innerHTML = `
    <div class="stat">
      <p class="stat__angka">${r.total}</p>
      <p class="stat__label">Total produk</p>
    </div>
    <div class="stat">
      <p class="stat__angka">${r.totalStok.toLocaleString("id-ID")}</p>
      <p class="stat__label">Total stok</p>
    </div>
    <div class="stat">
      <p class="stat__angka">${r.habis}</p>
      <p class="stat__label">Produk habis</p>
    </div>
    <div class="stat">
      <p class="stat__angka">${r.unggulan}</p>
      <p class="stat__label">Unggulan</p>
    </div>
    <div class="stat">
      <p class="stat__angka">${formatRupiah(r.estimasi)}</p>
      <p class="stat__label">Estimasi nilai stok</p>
    </div>
  `;
}

/** Render tabel (desktop) atau daftar kartu (mobile) dari produkAktif. */
export function renderDaftar() {
  const tabel = document.querySelector("#daftar-dashboard");
  const daftarMobile = document.querySelector("#daftar-mobile");
  if (!tabel && !daftarMobile) return;

  const htmlTabel = daftarBarisTabel();
  const htmlMobile = daftarKartuMobile();

  if (tabel) {
    tabel.innerHTML = htmlTabel;
  }
  if (daftarMobile) {
    daftarMobile.innerHTML = htmlMobile;
  }

  // Rekam perintah event (delegation) setelah render
  if (tabel) {
    tabel.addEventListener("click", handleKlikDashboard);
    tabel.addEventListener("change", handlePerubahanDashboard);
  }
  if (daftarMobile) {
    daftarMobile.addEventListener("click", handleKlikDashboard);
    daftarMobile.addEventListener("change", handlePerubahanDashboard);
  }

  const kosong = produkAktif.length === 0;
  const ruangKosong = document.querySelector("#ruang-kosong");
  if (ruangKosong) {
    ruangKosong.hidden = !kosong;
  }
}

function daftarBarisTabel() {
  if (produkAktif.length === 0) return "";

  return `
    <thead>
      <tr>
        <th scope="col" class="kol-navigasi">Menu</th>
        <th scope="col">Kategori</th>
        <th scope="col">Harga</th>
        <th scope="col">Stok</th>
        <th scope="col">
          <span class="sr-only">Unggulan</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="M12 3l2.6 6.3 7 .4-5 4.9 1.3 6.9L12 17l-6 3.9L8.9 14.8 4 14.6l7-.4L12 3Z"/>
          </svg>
        </th>
        <th scope="col">Aksi</th>
      </tr>
    </thead>
    <tbody>
      ${produkAktif
        .map(
          (produk) => `
          <tr data-id="${escapeHtml(produk.id)}">
            <td>
              <div class="kol-navigasi">
                <img class="thumbnail" src="${escapeHtml(produk.imageUrl || "/img/placeholder.svg")}" alt="" width="40" height="30" loading="lazy" decoding="async" />
                <div>
                  <div class="baris-nama">${escapeHtml(produk.nama)}</div>
                  <div class="baris-deskripsi">${escapeHtml((produk.deskripsi || "").slice(0, 100))}</div>
                </div>
              </div>
            </td>
            <td class="kol-kategori">${escapeHtml(produk.kategori)}</td>
            <td class="kol-angka tabular-nums">${formatRupiah(produk.harga)}</td>
            <td class="kol-stok">
              <div class="stepper-stok" role="group" aria-label="Stok ${escapeHtml(produk.nama)}">
                <button type="button" class="tombol-stepper tombol-stepper--kurang" data-aksi="kurang-stok" data-id="${escapeHtml(produk.id)}" ${produk.stok <= 0 ? "disabled" : ""} aria-label="Kurangi stok ${escapeHtml(produk.nama)}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                <output class="nilai-stok tabular-nums" aria-live="polite">${produk.stok}</output>
                <button type="button" class="tombol-stepper tombol-stepper--lebih" data-aksi="lebih-stok" data-id="${escapeHtml(produk.id)}" aria-label="Tambah stok ${escapeHtml(produk.nama)}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>
            </td>
            <td class="kol-ahkan">
              <button
                type="button"
                class="tombol-uang tombol-ahkan"
                data-aksi="toggle-unggulan"
                data-id="${escapeHtml(produk.id)}"
                aria-pressed="${produk.unggulan ? "true" : "false"}"
                aria-label="${produk.unggulan ? "Hapus" : "Tandai"} sebagai menu unggulan"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  ${ikonBintang(produk.unggulan)}
                </svg>
                <span>${produk.unggulan ? "Unggulan" : "Jadikan unggulan"}</span>
              </button>
            </td>
            <td class="kol-aksi">
              <a class="tautan-ubah" href="#" data-aksi="ubah" data-id="${escapeHtml(produk.id)}">Ubah</a>
              <button type="button" class="tautan-hapus" data-aksi="hapus" data-id="${escapeHtml(produk.id)}">Hapus</button>
            </td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  `;
}

function daftarKartuMobile() {
  if (produkAktif.length === 0) return "";

  return produkAktif
    .map(
      (produk) => `
      <article class="mobile-row" data-id="${escapeHtml(produk.id)}">
        <div class="mobile-row__info">
          <img class="thumbnail" src="${escapeHtml(produk.imageUrl || "/img/placeholder.svg")}" alt="" width="40" height="30" loading="lazy" decoding="async" />
          <div>
            <div class="mobile-row__nama">${escapeHtml(produk.nama)}</div>
            <div class="mobile-row__meta">
              <span class="mobile-row__kategori">${escapeHtml(produk.kategori)}</span>
              <span class="mobile-row__harga">${formatRupiah(produk.harga)}</span>
              <span class="mobile-row__stok">Stok ${produk.stok}</span>
            </div>
          </div>
        </div>
        <div class="mobile-row__aksi">
          <button type="button" class="tombol-uang tombol-ahkan" data-aksi="toggle-unggulan" data-id="${escapeHtml(produk.id)}" aria-pressed="${produk.unggulan ? "true" : "false"}">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              ${ikonBintang(produk.unggulan)}
            </svg>
            ${produk.unggulan ? "Unggulan" : "Jadikan unggulan"}
          </button>
          <a class="tautan-ubah" href="#" data-aksi="ubah" data-id="${escapeHtml(produk.id)}">Ubah</a>
          <button type="button" class="tautan-hapus" data-aksi="hapus" data-id="${escapeHtml(produk.id)}">Hapus</button>
        </div>
      </article>
    `
    )
    .join("");
}

function ikonBintang(terisi) {
  if (terisi) {
    return `<path d="M12 3l2.6 6.3 7 .4-5 4.9 1.3 6.9L12 17l-6 3.9L8.9 14.8 4 14.6l7-.4L12 3Z" fill="currentColor"/>`;
  }
  return `<path d="M12 3l2.6 6.3 7 .4-5 4.9 1.3 6.9L12 17l-6 3.9L8.9 14.8 4 14.6l7-.4L12 3Z" fill="none"/>`;
}

// ---

/**
 * Binder event terpusat untuk elemen yang dirender ulang.
 * Menggunakan delegasi agar tetap aktif walau daftar di-render ulang.
 */
function handleKlikDashboard(event) {
  const target = event.target.closest("[data-aksi]");
  if (!target) return;

  const aksi = target.dataset.aksi;
  const id = target.dataset.id;
  if (!id) return;

  if (aksi === "kurang-stok") {
    event.preventDefault();
    ubahStok(id, -1);
  } else if (aksi === "lebih-stok") {
    event.preventDefault();
    ubahStok(id, 1);
  } else if (aksi === "toggle-unggulan") {
    event.preventDefault();
    toggleUnggulan(id);
    renderDaftar();
    renderRingkasan();
    tampilkanToast(`Status unggulan ${produkById(id)?.unggulan ? "dihapus" : "diaktifkan"}`);
  } else if (aksi === "ubah") {
    event.preventDefault();
    bukaFormUbah(id);
  } else if (aksi === "hapus") {
    event.preventDefault();
    mintaKonfirmasiHapus(id, target);
  }
}

function handlePerubahanDashboard(event) {
  const target = event.target.closest("select, input");
  if (!target) return;

  // Semua perubahan cepat (stepper/filter kategori dashboard) sudah ditangani
  // oleh handler spesifik. Handler ini cadangan jika ada input yang bereaksi
  // langsung.
}

// ---

/** Terapkan perubahan stok +/−1, tidak pernah di bawah 0. */
function ubahStok(id, delta) {
  const produk = produkById(id);
  if (!produk) return;

  const stokBaru = Math.max(0, (produk.stok || 0) + delta);
  produk.stok = stokBaru;
  simpanSemua();

  renderDaftar();
  renderRingkasan();
  renderKatalog();
}

/** Tandai/tanggalkan status unggulan. */
function toggleUnggulan(id) {
  const produk = produkById(id);
  if (!produk) return;

  produk.unggulan = !produk.unggulan;
  simpanSemua();
}

/** Salin perubahan dari cache ke penyimpanan & render ulang semuanya. */
function simpanSemua() {
  if (!simpanProduk(produkAktif)) {
    // Gagal tulis: UI akan menampilkan banner melalui renderBannerPenyimpanan()
    return false;
  }
  renderKatalog();
  return true;
}

/** Ambil produk dari daftar aktif. */
function produkById(id) {
  return produkAktif.find((p) => p.id === id) || null;
}

// ---

/** Render ulang katalog pembeli dari data terkini. */
export function renderKatalog() {
  const daftar = filterProducts(produkAktif, { q: "", kategori: SEMUA_KATEGORI, sort: URUTAN.NAMA_ASC });
  renderKatalogUi(daftar);
}

// ---

/** Buka form tambah produk. */
export function bukaFormTambah() {
  sedangEdit = null;
  tulisForm({
    id: "",
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
    deskripsi: "",
    imageUrl: "",
    unggulan: false,
  });
  setJudulForm("Tambah menu baru");
  tutupDialogJikaBuka();
  const dialog = document.querySelector("#dialog-form");
  if (dialog) dialog.showModal();
}

/** Buka form ubah produk (data ada di localStorage). */
export function bukaFormUbah(id) {
  const produk = produkById(id);
  if (!produk) return;

  sedangEdit = id;
  tulisForm({
    id: produk.id,
    nama: produk.nama,
    kategori: produk.kategori,
    harga: String(produk.harga),
    stok: String(produk.stok),
    deskripsi: produk.deskripsi || "",
    imageUrl: produk.imageUrl || "",
    unggulan: !!produk.unggulan,
  });
  setJudulForm(`Ubah ${produk.nama}`);
  tutupDialogJikaBuka();
  const dialog = document.querySelector("#dialog-form");
  if (dialog) dialog.showModal();
}

// ---

/** Tulis nilai ke form (termasuk tersembunyi id). */
function tulisForm(data) {
  setField("input-form-nama", data.nama);
  setSelect("pilih-kategori", data.kategori);
  setField("input-form-harga", data.harga);
  setField("input-form-stok", data.stok);
  setField("input-form-deskripsi", data.deskripsi);
  setField("input-form-image", data.imageUrl);
  setCheckbox("check-unggulan", data.unggulan);
}

function setField(id, nilai) {
  const el = document.getElementById(id);
  if (el) el.value = nilai ?? "";
}

function setSelect(id, nilai) {
  const el = document.getElementById(id);
  if (el) el.value = nilai;
}

function setCheckbox(id, aktif) {
  const el = document.getElementById(id);
  if (el) el.checked = !!aktif;
}

function setJudulForm(teks) {
  const el = document.querySelector("#judul-form");
  if (el) el.textContent = teks;
}

// ---

/**
 * Validasi satu field sesuai SPEC.md §4.6.
 * Mengembalikan array pesan error (boleh kosong).
 */
function validasiField(nama, nilai, memo = {}) {
  if (nama === "nama") {
    if (typeof nilai !== "string" || nilai.trim().length < 3 || nilai.trim().length > 60) {
      return ["Nama produk 3–60 karakter."];
    }
    return [];
  }

  if (nama === "kategori") {
    if (!KATEGORI.includes(nilai)) {
      return ["Pilih kategori."];
    }
    return [];
  }

  if (nama === "harga") {
    if (!/^-?\d+(\.\d+)?$/.test(String(nilai ?? "").trim())) {
      return ["Harga harus angka ≥ 0."];
    }
    const hasil = Number(nilai);
    if (!Number.isInteger(hasil) || hasil < 0 || hasil > 1_000_000) {
      return ["Harga harus angka ≥ 0."];
    }
    return [];
  }

  if (nama === "stok") {
    if (!/^-?\d+(\.\d+)?$/.test(String(nilai ?? "").trim())) {
      return ["Stok harus bilangan bulat ≥ 0."];
    }
    const hasil = Number(nilai);
    if (!Number.isInteger(hasil) || hasil < 0 || hasil > 9_999) {
      return ["Stok harus bilangan bulat ≥ 0."];
    }
    return [];
  }

  if (nama === "deskripsi") {
    if (typeof nilai !== "string") return [];
    if (nilai.length > 160) {
      return ["Deskripsi maksimal 160 karakter."];
    }
    return [];
  }

  if (nama === "imageUrl") {
    const bersih = String(nilai ?? "").trim();
    if (bersih === "") return [];
    if (!bersih.startsWith("/") && !bersih.startsWith("https://")) {
      return ["Gunakan path lokal atau URL https."];
    }
    return [];
  }

  return [];
}

/**
 * Validasi seluruh form yang sedang terbuka.
 * Mengembalikan{mapError, dataBersih} — dataBersih null bila ada error.
 */
function validasiForm() {
  const nama = getField("input-form-nama");
  const kategori = getSelect("pilih-kategori");
  const hargaRaw = getField("input-form-harga");
  const stokRaw = getField("input-form-stok");
  const deskripsi = getField("input-form-deskripsi");
  const imageRaw = getField("input-form-image");
  const unggulan = getCheckbox("check-unggulan");

  const errors = {};

  errors.nama = validasiField("nama", nama);
  errors.kategori = validasiField("kategori", kategori);
  errors.harga = validasiField("harga", hargaRaw);
  errors.stok = validasiField("stok", stokRaw);
  errors.deskripsi = validasiField("deskripsi", deskripsi);
  errors.imageUrl = validasiField("imageUrl", imageRaw);

  const adaError = Object.values(errors).some((arr) => arr.length > 0);
  if (adaError) {
    return { errors, data: null };
  }

  const harga = parseInt(hargaRaw, 10);
  const stok = parseInt(stokRaw, 10);

  return {
    errors,
    data: {
      id: sedangEdit || idProdukBaru(),
      nama: nama.trim(),
      kategori,
      harga,
      stok,
      deskripsi: deskripsi.trim(),
      imageUrl: imageRaw.trim(),
      unggulan,
    },
  };
}

function getField(id) {
  return document.getElementById(id)?.value ?? "";
}

function getSelect(id) {
  return document.getElementById(id)?.value ?? "";
}

function getCheckbox(id) {
  return !!document.getElementById(id)?.checked;
}

// ---

/** Tampilkan/mesankan error di bawah field. */
function tampilkanErrorNama(id, pesan) {
  const container = document.getElementById(`error-${id}`);
  if (!container) return;
  container.textContent = pesan[0] ?? "";
  container.hidden = (!pesan || pesan.length === 0);
  const field = document.getElementById(id);
  if (field) {
    field.setAttribute("aria-invalid", pesan.length > 0 ? "true" : "false");
    field.setAttribute("aria-describedby", container.id);
  }
}

function sembunyikanErrorNama(id) {
  const container = document.getElementById(`error-${id}`);
  if (!container) return;
  container.textContent = "";
  container.hidden = true;
  const field = document.getElementById(id);
  if (field) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  }
}

// ---

/**
 * Submit form.
 * Bila validasi gagal → tampilkan error + fokus ke field pertama yang bermasalah.
 * Bila berhasil → simpan ke state, tutup dialog, tampilkan toast.
 */
export function submitForm() {
  const { errors, data } = validasiForm();

  // Tampilkan semua error
  [
    ["input-form-nama", errors.nama],
    ["pilih-kategori", errors.kategori],
    ["input-form-harga", errors.harga],
    ["input-form-stok", errors.stok],
    ["input-form-deskripsi", errors.deskripsi],
    ["input-form-image", errors.imageUrl],
  ].forEach(([id, pesan]) => {
    if (id === "pilih-kategori") {
      const select = document.getElementById(id);
      select.setAttribute("aria-invalid", pesan.length > 0 ? "true" : "false");
      select.setAttribute("aria-describedby", pesan.length > 0 ? `error-${id}` : "");
    }
    tampilkanErrorNama(id, pesan);
  });

  if (!data) {
    // Fokus ke field pertama yang bermasalah, bila belum fokus
    const pertama = [
      "input-form-nama",
      "pilih-kategori",
      "input-form-harga",
      "input-form-stok",
      "input-form-deskripsi",
      "input-form-image",
    ].find((id) => (errors[id]?.length ?? 0) > 0);
    if (pertama) {
      const el = document.getElementById(pertama);
      if (el && document.activeElement !== el) {
        el.focus({ preventScroll: true });
      }
    }
    return;
  }

  // Simpan ke state
  if (data.id && sedangEdit) {
    const indeks = produkAktif.findIndex((p) => p.id === data.id);
    if (indeks >= 0) {
      produkAktif[indeks] = data;
    } else {
      produkAktif.push(data);
    }
  } else if (data.id) {
    produkAktif.push(data);
  } else {
    return;
  }

  simpanProduk(produkAktif);
  renderRingkasan();
  renderDaftar();
  renderKatalog();
  tutupDialog();
  resetForm();
  tampilkanToast(sedangEdit ? "Menu berhasil diubah." : "Menu baru berhasil ditambahkan.");
}

/** Reset form ke keadaan kosong setelah penyimpanan. */
function resetForm() {
  tulisForm({
    id: "",
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
    deskripsi: "",
    imageUrl: "",
    unggulan: false,
  });
  [
    "input-form-nama",
    "pilih-kategori",
    "input-form-harga",
    "input-form-stok",
    "input-form-deskripsi",
    "input-form-image",
  ].forEach(sembunyikanErrorNama);
  const select = document.getElementById("pilih-kategori");
  if (select) select.removeAttribute("aria-invalid");
}

/** Tutup dialog form. */
export function tutupDialog() {
  const dialog = document.querySelector("#dialog-form");
  if (dialog) {
    dialog.close();
  }
  sedangEdit = null;
}

/** Tutup dialog jika sedang terbuka (dipakai saat navigasi). */
export function tutupDialogJikaBuka() {
  const dialog = document.querySelector("#dialog-form");
  if (dialog && dialog.open) {
    dialog.close();
  }
  sedangEdit = null;
}

// ---

/** Hapus produk dengan dialog konfirmasi. */
function mintaKonfirmasiHapus(id, elemenPemicu) {
  const produk = produkById(id);
  if (!produk) return;

  const dialog = document.querySelector("#dialog-hapus");
  if (!dialog) return;

  const judul = document.querySelector("#hapus-judul");
  const teks = document.querySelector("#hapus-teks");
  if (judul) judul.textContent = `Hapus ${produk.nama}?`;
  if (teks) teks.textContent = `Menu “${produk.nama}” akan hilang dari katalog dan daftar menu. Tindakan ini tidak dapat dibatalkan.`;

  const tombolHapus = document.querySelector("#tombol-hapus");
  if (tombolHapus) {
    tombolHapus.dataset.id = id;
  }

  dialog.showModal();

  // Fokus ke tombol batal (aman)
  const batal = document.querySelector("#tombol-batal-hapus");
  if (batal) {
    batal.focus();
  }

  // Sembunyikan dialog saat tidak lagi dibutuhkan
  dialog.addEventListener("close", () => {
    teks.textContent = "";
  }, { once: true });
}

/** Terapkan hapus setelah dikonfirmasi. */
export function terapkanHapus(id) {
  const indeks = produkAktif.findIndex((p) => p.id === id);
  if (indeks < 0) return;

  const nama = produkAktif[indeks].nama;
  produkAktif.splice(indeks, 1);
  simpanProduk(produkAktif);
  renderRingkasan();
  renderDaftar();
  renderKatalog();

  const dialog = document.querySelector("#dialog-hapus");
  if (dialog) dialog.close();
  tampilkanToast(`“${nama}” berhasil dihapus.`);
}

/** Batalkan hapus (tutup dialog tanpa melakukan apa-apa). */
export function batalkanHapus() {
  const dialog = document.querySelector("#dialog-hapus");
  if (dialog) dialog.close();
}

// ---

/** Reset data ke seed. */
export function initResetDemo() {
  const tombol = document.querySelector("#tombol-reset-demo");
  if (!tombol) return;

  tombol.addEventListener("click", () => {
    const dialog = document.querySelector("#dialog-reset");
    if (!dialog) return;

    const judul = document.querySelector("#reset-judul");
    if (judul) judul.textContent = "Reset data demo?";
    const teks = document.querySelector("#reset-teks");
    if (teks) teks.textContent = "Semua perubahan (tambah, ubah, hapus) akan hilang dan 8 menu awal akan dipulihkan. Tindakan ini tidak dapat dibatalkan.";

    dialog.showModal();

    const batal = document.querySelector("#tombol-batal-reset");
    if (batal) batal.focus();
  });
}

export function terapkanResetDemo() {
  resetProduk();
  muatDanRenderUlang();
  const dialog = document.querySelector("#dialog-reset");
  if (dialog) dialog.close();
  tampilkanToast("Data demo berhasil direset ke menu awal.");
}

function batalkanResetDemo() {
  const dialog = document.querySelector("#dialog-reset");
  if (dialog) dialog.close();
}

/** Muat ulang dari penyimpanan, update state & tampilan. */
export function muatDanRenderUlang() {
  produkAktif = muatProduk().map((p) => ({ ...p }));
  renderRingkasan();
  renderDaftar();
  renderKatalog();
}

// ---

/** Toast notifikasi kecil. */
export function tampilkanToast(teks) {
  const wadah = document.querySelector("#toast-wadah");
  if (!wadah) return;

  const pesan = document.createElement("div");
  pesan.className = "toast";
  pesan.setAttribute("role", "status");
  pesan.innerHTML = `
    <span>${escapeHtml(teks)}</span>
    <button type="button" class="toast__tutup" aria-label="Tutup notifikasi">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18"/>
      </svg>
    </button>
  `;

  wadah.appendChild(pesan);

  // Fokus ke tombol tutup agar bisa langsung ditutup
  const tutup = pesan.querySelector(".toast__tutup");
  if (tutup) {
    tutup.addEventListener("click", () => {
      pesan.remove();
    });
  }

  setTimeout(() => {
    if (pesan.parentNode) {
      pesan.remove();
    }
  }, 4000);
}

// ---

/** Pastikan navbar & footer sesuai dengan tampilan hak akses (demo). */
export function renderNavbarDanFooter() {
  const tombolMode = document.querySelector("#tombol-mode-demo");
  const tombolModeReverse = document.querySelector("#tombol-mode-pembeli");
  const badgeMode = document.querySelector("#badge-mode");

  if (tombolMode) {
    tombolMode.hidden = false;
    tombolModeReverse.hidden = false;
  }

  if (badgeMode) {
    badgeMode.hidden = false;
    badgeMode.textContent = "Mode Demo — tanpa login";
  }
}

/** Banner penyimpanan: ubah tampilan bila penyimpanan gagal. */
export function renderBannerPenyimpanan() {
  const banner = document.querySelector("#banner-penyimpanan");
  if (!banner) return;

  if (penyimpananTersedia()) {
    banner.hidden = true;
    return;
  }

  const gagal = penyimpananGagalTerakhir();
  if (gagal) {
    banner.className = "banner-penyimpanan banner-penyimpanan--gagal";
    banner.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path d="M12 9v4M12 17h.01"/>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>
      </svg>
      <span>Perubahan tidak dapat disimpan di perangkat ini.</span>
    `;
    banner.hidden = false;
  } else {
    banner.className = "banner-penyimpanan";
    banner.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v5M12 17h.01"/>
      </svg>
      <span>Data hanya tersimpan di perangkat ini (localStorage).</span>
    `;
    banner.hidden = false;
  }
}

// ---

/** Verifikasi format data localStorage; tampilkan pesan pemulihan bila rusak. */
export function renderBannerPemulihan() {
  const banner = document.querySelector("#banner-pemulihan");
  if (!banner) return;

  if (penyimpananTersedia()) {
    // Cek dengan membaca ulang
    const data = bacaLocalStorageUji();
    if (data && produkValid(data)) {
      banner.hidden = true;
      return;
    }
  }

  // Tampilkan pesan bantuan
  banner.hidden = false;
}

function bacaLocalStorageUji() {
  try {
    const raw = localStorage.getItem("kba:products:v1");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj && Array.isArray(obj.products) ? obj.products : null;
  } catch {
    return null;
  }
}

// ---

/**
 * Inisialisasi semua event listener yang hidup sepanjang sesi.
 * Dipanggil sekali saat dashboard dibuka.
 */
export function initDashboard() {
  // Navigasi
  const tombolMode = document.querySelector("#tombol-mode-demo");
  const tombolModeReverse = document.querySelector("#tombol-mode-pembeli");

  if (tombolMode) {
    tombolMode.addEventListener("click", () => {
      location.hash = RUTE_DASHBOARD;
    });
  }

  if (tombolModeReverse) {
    tombolModeReverse.addEventListener("click", () => {
      location.hash = RUTE_KATALOG;
    });
  }

  // Form
  const dialogForm = document.querySelector("#dialog-form");
  if (dialogForm) {
    dialogForm.addEventListener("click", (event) => {
      if (event.target.tagName === "DIALOG") {
        // Klik backdrop — tutup hanya jika form tidak berubah
        dialogForm.close();
        sedangEdit = null;
      }
    });

    // Perubahan input → sembunyikan error untuk field tersebut
    dialogForm.addEventListener("input", (event) => {
      const target = event.target;
      const id = target.id;
      if (!id) return;
      if (id === "pilih-kategori") {
        sembunyikanErrorNama("pilih-kategori");
        target.removeAttribute("aria-invalid");
      } else if (id.startsWith("input-form-")) {
        sembunyikanErrorNama(id);
      }
    });
  }

  // Button form
  const tombolSimpan = document.querySelector("#tombol-simpan");
  if (tombolSimpan) {
    tombolSimpan.addEventListener("click", () => {
      submitForm();
      // Cegah klik ganda sebentar
      tombolSimpan.disabled = true;
      setTimeout(() => {
        if (tombolSimpan) tombolSimpan.disabled = false;
      }, 150);
    });
  }

  // Tutup form lewat tombol batal (tapi jangan tanya konfirmasi)
  const tombolBatalForm = document.querySelector("#tombol-batal-form");
  if (tombolBatalForm) {
    tombolBatalForm.addEventListener("click", () => {
      tutupDialog();
    });
  }

  // Tutup dialog hapus
  const tombolBatalHapus = document.querySelector("#tombol-batal-hapus");
  if (tombolBatalHapus) {
    tombolBatalHapus.addEventListener("click", batalkanHapus);
  }

  // Tombol reset (dialog dibuka oleh initResetDemo yang dipanggil saat init)

  const tombolTerapkanReset = document.querySelector("#tombol-terapkan-reset");
  if (tombolTerapkanReset) {
    tombolTerapkanReset.addEventListener("click", () => {
      terapkanResetDemo();
    });
  }

  const tombolBatalReset = document.querySelector("#tombol-batal-reset");
  if (tombolBatalReset) {
    tombolBatalReset.addEventListener("click", batalkanResetDemo);
  }

  // Listener untuk Tutup dialog hapus (tombol Hapus di dalam dialog)
  const tombolHapus = document.querySelector("#tombol-hapus");
  if (tombolHapus) {
    tombolHapus.addEventListener("click", () => {
      const id = tombolHapus.dataset.id;
      if (id) {
        terapkanHapus(id);
      }
      tombolHapus.dataset.id = "";
    });
  }

  // Listener form dialog (dialog hapus) — delegasi
  const dialogHapus = document.querySelector("#dialog-hapus");
  if (dialogHapus) {
    dialogHapus.addEventListener("click", (event) => {
      if (event.target.tagName === "DIALOG") {
        // Klik backdrop → batal
        batalkanHapus();
      }
    });
  }

  const dialogReset = document.querySelector("#dialog-reset");
  if (dialogReset) {
    dialogReset.addEventListener("click", (event) => {
      if (event.target.tagName === "DIALOG") {
        batalkanResetDemo();
      }
    });
  }
}

// ---

/** Siap: muat data, render awal dashboard, & listener global. */
export function initDanRender() {
  produkAktif = muatProduk().map((p) => ({ ...p }));
  renderRingkasan();
  renderDaftar();
  renderKatalog();
  renderBannerPenyimpanan();
  renderBannerPemulihan();

  initDashboard();
  initResetDemo();
}

// filterProducts, SEMUA_KATEGORI, URUTAN, dan renderKatalogUi sudah diimpor di atas.
