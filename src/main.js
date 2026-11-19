/**
 * Bootstrap aplikasi: muat data, pasang routing hash, dan render awal.
 * Katalog (M2) dan dashboard (M5) akan mengisi modul ui.js berikutnya.
 */

import { muatProduk, penyimpananGagalTerakhir, penyimpananTersedia } from "./store.js";
import { renderStatusFondasi, tandaiNavigasiAktif } from "./ui.js";

const produk = muatProduk();

function render() {
  // Routing hash: "#/" katalog, "#/kelola" dashboard demo.
  const hash = window.location.hash || "#/";
  tandaiNavigasiAktif(hash);
  renderStatusFondasi(produk);
}

if (!penyimpananTersedia() || penyimpananGagalTerakhir()) {
  const catatan = document.querySelector("#status-fondasi");
  if (catatan) catatan.dataset.penyimpanan = "gagal";
}

window.addEventListener("hashchange", render);
render();
