/**
 * Bootstrap halaman landing: render status buka, katalog, dan kontrol filter.
 */

import { produkSeed } from "./products.js";
import { filterProducts, SEMUA_KATEGORI, URUTAN } from "./filter.js";
import { renderKatalog, renderStatusBuka } from "./ui.js";

const produk = produkSeed();
const state = { q: "", kategori: SEMUA_KATEGORI, sort: URUTAN.NAMA_ASC };

const inputCari = document.querySelector("#cari-menu");
const pilihUrut = document.querySelector("#urut-menu");
const chipKategori = document.querySelectorAll(".chip[data-kategori]");
const tombolReset = document.querySelector("#reset-filter");

function render() {
  renderKatalog(filterProducts(produk, state));
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

renderStatusBuka();
render();
