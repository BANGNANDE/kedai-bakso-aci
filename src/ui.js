/**
 * Render halaman: kartu produk dari data `products.js` dan status buka WITA.
 * Fungsi render murni menghasilkan markup dari data yang sudah divalidasi.
 */

import { NOMOR_WHATSAPP } from "./products.js";
import { formatRupiah } from "./format.js";
import { buildWhatsAppUrl } from "./whatsapp.js";

const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BUKA_MENIT = 11 * 60;
const TUTUP_MENIT = 21 * 60;
const HARI_TUTUP = 1; // Senin

const IKON_WHATSAPP = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
  <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Z" />
  <path d="M9.3 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.7 2 .8 2.4.7 2.9.6.4 0 1.3-.5 1.5-1s.2-1 .1-1.1c0-.1-.2-.2-.4-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4l-.6-1.6Z" />
</svg>`;

/** Escape teks yang akan disisipkan ke template HTML. */
export function escapeHtml(teks) {
  return String(teks).replace(
    /[&<>"']/g,
    (karakter) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[karakter],
  );
}

function infoStok(stok) {
  if (stok <= 0) return { kelas: "stok--habis", teks: "Stok habis" };
  if (stok <= 5) return { kelas: "stok--tipis", teks: `Sisa ${stok}` };
  return { kelas: "stok--aman", teks: `Stok ${stok}` };
}

function tombolPesan(produk) {
  if (produk.stok <= 0) {
    return '<button class="card__pesan" type="button" disabled>Stok habis</button>';
  }

  const url = buildWhatsAppUrl(NOMOR_WHATSAPP, produk);
  if (!url) {
    return '<button class="card__pesan" type="button" disabled>Pemesanan tidak tersedia</button>';
  }

  return `<a
    class="card__pesan"
    href="${escapeHtml(url)}"
    target="_blank"
    rel="noopener"
    aria-label="Pesan ${escapeHtml(produk.nama)} via WhatsApp"
  >${IKON_WHATSAPP}Pesan via WhatsApp</a>`;
}

function kartuProduk(produk) {
  const stok = infoStok(produk.stok);
  const gambar = escapeHtml(produk.imageUrl || "/img/placeholder.svg");
  const redup = produk.stok === 0 ? ' data-redup="true"' : "";
  const badge = produk.unggulan ? '<span class="badge-unggulan">★ Best Seller</span>' : "";

  return `
    <article class="card">
      <div class="card__media">
        <img
          src="${gambar}"
          alt="Ilustrasi ${escapeHtml(produk.nama)}"
          width="800"
          height="600"
          loading="lazy"
          decoding="async"
          ${redup}
        />
        ${badge}
      </div>
      <div class="card__body">
        <h3 class="card__name">${escapeHtml(produk.nama)}</h3>
        <p class="card__kategori">${escapeHtml(produk.kategori)}</p>
        <p class="card__desc">${escapeHtml(produk.deskripsi)}</p>
        <div class="card__foot">
          <span class="card__harga">${formatRupiah(produk.harga)}</span>
          <span class="stok ${stok.kelas}">${stok.teks}</span>
        </div>
        ${tombolPesan(produk)}
      </div>
    </article>`;
}

/** Render seluruh kartu + jumlah menu; gambar gagal diganti placeholder lokal. */
export function renderKatalog(daftar) {
  const wadah = document.querySelector("#daftar-produk");
  if (!wadah) return;

  const kosong = daftar.length === 0;
  wadah.innerHTML = daftar.map(kartuProduk).join("");
  wadah.hidden = kosong;

  wadah.querySelectorAll("img").forEach((gambar) => {
    gambar.addEventListener(
      "error",
      () => {
        gambar.src = "/img/placeholder.svg";
      },
      { once: true },
    );
  });

  const jumlah = document.querySelector("#jumlah-menu");
  if (jumlah) jumlah.textContent = `Menampilkan ${daftar.length} menu`;

  const emptyState = document.querySelector("#empty-state");
  if (emptyState) emptyState.hidden = !kosong;
}

function labelBukaBerikutnya(hari, menit) {
  for (let langkah = 0; langkah <= 7; langkah += 1) {
    const calon = (hari + langkah) % 7;
    if (calon === HARI_TUTUP) continue;

    if (langkah === 0) {
      if (menit < BUKA_MENIT) return "Buka hari ini 11.00 WITA";
      continue; // sudah lewat jam tutup hari ini
    }

    const besok = (hari + 1) % 7;
    return calon === besok ? "Buka besok 11.00 WITA" : `Buka ${NAMA_HARI[calon]} 11.00 WITA`;
  }

  return "Buka Selasa 11.00 WITA";
}

/** Status buka dihitung dari jam WITA (UTC+8), bukan zona waktu perangkat. */
export function renderStatusBuka() {
  const wadah = document.querySelector("#status-toko");
  if (!wadah) return;

  const label = wadah.querySelector(".status__label");
  const meta = wadah.querySelector(".status__meta");
  if (!label || !meta) return;

  const wita = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const hari = wita.getUTCDay();
  const menit = wita.getUTCHours() * 60 + wita.getUTCMinutes();
  const buka = hari !== HARI_TUTUP && menit >= BUKA_MENIT && menit < TUTUP_MENIT;

  if (buka) {
    wadah.dataset.state = "buka";
    label.textContent = "Buka Sekarang";
    meta.textContent = "Dine-in & Takeaway";
    return;
  }

  wadah.dataset.state = "tutup";
  label.textContent = "Tutup";
  meta.textContent = labelBukaBerikutnya(hari, menit);
}
