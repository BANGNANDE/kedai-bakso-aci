/**
 * Bootstrap halaman landing: render status buka, katalog, dan kontrol filter.
 * Juga menghubungkan modul dashboard pengelola (CRUD) ke halaman.
 */

import { filterProducts, SEMUA_KATEGORI, URUTAN } from "./filter.js";
import { renderKatalog, renderStatusBuka } from "./ui.js";
import { muatProduk } from "./store.js";
import {
  RUTE_DASHBOARD,
  initDanRender,
  muatDanRenderUlang,
  bukaFormTambah,
  tampilkanToast,
} from "./dashboard.js";
import { eksporJson, imporJson, simpanProduk } from "./store.js";

const state = { q: "", kategori: SEMUA_KATEGORI, sort: URUTAN.NAMA_ASC };

const inputCari = document.querySelector("#cari-menu");
const pilihUrut = document.querySelector("#urut-menu");
const chipKategori = document.querySelectorAll(".chip[data-kategori]");
const tombolReset = document.querySelector("#reset-filter");

let dashboardDiinisialisasi = false;

function dataProduk() {
  return muatProduk();
}

function render() {
  renderKatalog(filterProducts(dataProduk(), state));
}

function setKategori(kategori) {
  state.kategori = kategori;
  chipKategori.forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.kategori === kategori));
  });
}

inputCari?.addEventListener("input", (event) => {
  state.q = event.target.value;
  render();
});

pilihUrut?.addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

chipKategori.forEach((chip) => {
  chip.addEventListener("click", () => {
    setKategori(chip.dataset.kategori);
    render();
  });
});

tombolReset?.addEventListener("click", () => {
  state.q = "";
  state.sort = URUTAN.NAMA_ASC;
  setKategori(SEMUA_KATEGORI);

  if (inputCari) {
    inputCari.value = "";
    inputCari.focus();
  }
  if (pilihUrut) pilihUrut.value = URUTAN.NAMA_ASC;

  render();
});

// --- Navigasi tampilan Katalog / Dashboard ---

function tampilanDariHash() {
  return location.hash === RUTE_DASHBOARD ? "dashboard" : "katalog";
}

function setTampilan(tampilan) {
  const dashboard = tampilan === "dashboard";
  const viewKatalog = document.querySelector("#view-katalog");
  const viewDashboard = document.querySelector("#view-dashboard");
  if (viewKatalog) viewKatalog.hidden = dashboard;
  if (viewDashboard) viewDashboard.hidden = !dashboard;

  document.querySelectorAll("[data-view]").forEach((el) => {
    el.setAttribute("aria-current", el.dataset.view === tampilan ? "page" : "false");
  });

  if (dashboard) {
    if (!dashboardDiinisialisasi) {
      initDanRender();
      dashboardDiinisialisasi = true;
    } else {
      muatDanRenderUlang();
    }
  } else {
    render();
  }
}

document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", () => {
    location.hash = el.dataset.view === "dashboard" ? RUTE_DASHBOARD : RUTE_KATALOG;
  });
});

window.addEventListener("hashchange", () => {
  setTampilan(tampilanDariHash());
});

// --- Wiring dashboard ---

document.querySelector("#tombol-tambah-menu")?.addEventListener("click", () => {
  bukaFormTambah();
});

document.querySelector("#tombol-tambah-kosong")?.addEventListener("click", () => {
  bukaFormTambah();
});

const tombolExport = document.querySelector("#tombol-export-json");
tombolExport?.addEventListener("click", () => {
  const isi = eksporJson();
  const blob = new Blob([isi], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "menu-kedai-bakso-aci.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  tampilkanToast("Data menu berhasil diekspor.");
});

const tombolImport = document.querySelector("#tombol-import-json");
const inputImport = document.querySelector("#input-import-json");
tombolImport?.addEventListener("click", () => {
  inputImport?.click();
});

inputImport?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const teks = await file.text();
    const hasil = imporJson(teks);
    if (!hasil.berhasil) {
      tampilkanToast(hasil.pesan);
      return;
    }
    simpanProduk(hasil.produk);
    muatDanRenderUlang();
    tampilkanToast("Data menu berhasil diimpor.");
  } catch {
    tampilkanToast("Gagal membaca file JSON.");
  } finally {
    event.target.value = "";
  }
});

// --- Init ---

renderStatusBuka();
render();
setTampilan(tampilanDariHash());
