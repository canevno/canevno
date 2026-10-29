import { useState } from 'react';

const heading = 'Pengalaman Projek';
const subheading = 'Website dan aplikasi yang pernah saya kerjakan.';
const buttonLabel = 'Lihat langsung';

/*
  Isi tiap projek, diambil dari CV. Taruh gambar di public/image/projects/.
  Jika gambar belum ada, area gambar otomatis disembunyikan.
  href: ganti dengan alamat projek yang sudah online (https://...).
        Alamat eksternal otomatis dibuka di tab baru.
*/
const services = [
  {
    number: '01',
    category: 'Web Keuangan',
    title: 'KengQud',
    href: '#contact',
    image: '/image/projects/kengqud.webp',
    count: '2025',
    description:
      'Website untuk membantu pengguna menghitung keuangan harian, lengkap dengan pengingat kebutuhan dan perhitungan diagram pengeluaran.',
    tags: ['Kalkulasi Keuangan', 'Pengingat Kebutuhan', 'Diagram Pengeluaran'],
  },
  {
    number: '02',
    category: 'Web CRUD',
    title: 'Pengembangan CRUD',
    href: '#contact',
    image: '/image/projects/crud.webp',
    count: '2025',
    description:
      'Website CRUD yang mengandalkan Laravel dan Livewire, bertujuan membangun sistem berbasis CRUD.',
    tags: ['Laravel', 'Livewire', 'Sistem CRUD'],
  },
  {
    number: '03',
    category: 'E-Commerce Baju Batik Nusantara',
    title: 'JavaVidpa',
    href: '#contact',
    image: '/image/projects/javavidpa.webp',
    count: '2025',
    description:
      'Website e-commerce dengan cara beli yang sederhana bagi pengguna, tampilan yang interaktif, dan diskon bulanan yang besar.',
    tags: ['PHP', 'Tailwind CSS', 'Alpine.js'],
  },
  {
    number: '04',
    category: 'Website Portofolio',
    title: 'Portofolio (Vercel.app)',
    href: '#contact',
    image: '/image/projects/portofolio.webp',
    count: '2025',
    description:
      'Website portofolio pertama saya yang dibuat menggunakan HTML, CSS, dan JavaScript.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    number: '05',
    category: 'Web Penjualan Sepatu',
    title: 'Zorieshoes',
    href: '#contact',
    image: '/image/projects/zorieshoes.webp',
    count: '2026',
    description:
      'Website penjualan sepatu yang digunakan sebagai tugas akhir XI PPLG, dibuat dengan Laravel, PHP, Tailwind CSS, Alpine.js, dan Livewire.',
    tags: ['Laravel', 'PHP', 'Tailwind CSS'],
  },
  {
    number: '06',
    category: 'Website Pramuka',
    title: 'Pramuka SMK Negeri 1 Bangsri',
    href: '#contact',
    image: '/image/projects/pramuka.webp',
    count: '2026',
    description:
      'Website untuk menampilkan prestasi dan kegiatan Pramuka KH. Acmad Fauzan & Dewi Sartika, dirancang oleh 2 orang dengan Framer Motion, Alpine.js, Next.js, Laravel, dan PHP.',
    tags: ['Next.js', 'Laravel', 'Framer Motion'],
  },
  {
    number: '07',
    category: 'Sistem Pemesanan Barang',
    title: 'Simpesan',
    href: '#contact',
    image: '/image/projects/simpesan.webp',
    count: '2026',
    description:
      'Halaman aplikasi mobile sederhana untuk pemesanan barang, dibuat dengan Flutter dan Dart menggunakan sistem CRUD.',
    tags: ['Flutter', 'Dart', 'Sistem CRUD'],
  },
  {
    number: '08',
    category: 'Desain',
    title: 'Web & App Design',
    href: '#contact',
    image: '/image/projects/web-app-design.webp',
    count: '2026',
    description:
      'Desain website Pramuka SMKN 1 Bangsri yang lengkap dengan dashboard admin yang dinamis, elegan, dan minimalis.',
    tags: ['Dashboard Admin', 'Dinamis', 'Elegan & Minimalis'],
  },
];

const isExternal = (href) => /^https?:\/\//.test(href);

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches;

function ArrowUpRight() {
  return (
    <svg
      className="pj-arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/*
  Skala fluid: --u = 1px pada lebar referensi (sekitar 630px),
  membesar proporsional di desktop (maksimal 2.2x).
  Ukuran kecil diberi batas minimum agar tetap terbaca di HP.
*/
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.pj-root {
  --u: clamp(1px, 0.115vw, 2.2px);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur: 0.6s;
  width: 100%;
  background: #ffffff;
  color: #111;
  font-family: 'Outfit', 'Manrope', 'Inter', system-ui, sans-serif;
  scroll-margin-top: 80px;
}

/* ---------- Judul ---------- */
.pj-head {
  text-align: center;
  padding: max(24px, calc(var(--u) * 14)) 20px max(26px, calc(var(--u) * 26));
}
.pj-title {
  margin: 0;
  font-size: max(28px, calc(var(--u) * 31));
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.pj-sub {
  margin: max(10px, calc(var(--u) * 8)) auto 0;
  max-width: max(260px, calc(var(--u) * 200));
  font-size: max(13px, calc(var(--u) * 9));
  line-height: 1.3;
  color: #77736E;
}

/* ---------- Daftar & baris ---------- */
.pj-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid #85817B; }

.pj-row {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: max(44px, calc(var(--u) * 40)) 1fr;
  column-gap: 8px;
  padding: max(20px, calc(var(--u) * 22)) max(16px, calc(var(--u) * 16)) max(22px, calc(var(--u) * 24)) max(18px, calc(var(--u) * 18));
  border-bottom: 1px solid #85817B;
  background: #ffffff;
  color: #111;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.pj-row[data-open='true'] { background: #0F1011; color: #fff; }

.pj-num {
  grid-column: 1;
  grid-row: 1;
  align-self: start;
  font-size: max(12px, calc(var(--u) * 10));
  line-height: 1;
}

/* Blok kategori + judul */
.pj-block { grid-column: 2; grid-row: 1; }
.pj-cat {
  display: block;
  font-size: max(12px, calc(var(--u) * 7.5));
  line-height: 1;
  color: #77736E;
  transition: color var(--dur) var(--ease);
}
.pj-row[data-open='true'] .pj-cat { color: rgba(255, 255, 255, 0.85); }
.pj-name {
  margin: max(10px, calc(var(--u) * 11)) 0 0;
  font-size: max(24px, calc(var(--u) * 23.5));
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

/* ---------- Tombol ---------- */
.pj-action { grid-column: 2; margin-top: max(16px, calc(var(--u) * 14)); }
.pj-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: max(8px, calc(var(--u) * 6));
  height: max(40px, calc(var(--u) * 26));
  min-width: calc(var(--u) * 104);
  padding: 0 max(18px, calc(var(--u) * 14));
  border-radius: 999px;
  background: #FF493D;
  color: #fff;
  font-size: max(13px, calc(var(--u) * 8));
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 0.2s;
}
.pj-btn:hover { background: #E03A2E; }
.pj-btn:focus-visible { outline: 2px solid #FF493D; outline-offset: 3px; }
.pj-arrow {
  width: max(13px, calc(var(--u) * 9));
  height: max(13px, calc(var(--u) * 9));
  transition: transform 0.2s;
}
.pj-btn:hover .pj-arrow { transform: translate(2px, -2px); }

/* ---------- Gambar (muncul saat terbuka) ---------- */
.pj-media {
  grid-column: 1 / -1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur) var(--ease);
}
.pj-row[data-open='true'] .pj-media { grid-template-rows: 1fr; }
.pj-media-clip { min-height: 0; overflow: hidden; }
.pj-photo {
  position: relative;
  aspect-ratio: 16 / 10;
  margin-top: 18px;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(155deg, #2b2b2e 0%, #5a1a14 55%, #FF493D 140%);
  opacity: 0;
  transition: opacity 0.4s var(--ease);
}
.pj-row[data-open='true'] .pj-photo { opacity: 1; transition-delay: 0.12s; }
.pj-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

/* ---------- Panel isi (muncul saat terbuka) ---------- */
.pj-panel {
  grid-column: 1 / -1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur) var(--ease);
}
.pj-row[data-open='true'] .pj-panel { grid-template-rows: 1fr; }
.pj-panel-clip { min-height: 0; overflow: hidden; visibility: hidden; transition: visibility 0s linear var(--dur); }
.pj-row[data-open='true'] .pj-panel-clip { visibility: visible; transition-delay: 0s; }
.pj-panel-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: max(20px, calc(var(--u) * 20));
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.35s var(--ease), transform 0.5s var(--ease);
}
.pj-row[data-open='true'] .pj-panel-body { opacity: 1; transform: none; transition-delay: 0.14s; }

.pj-count { margin: 0; display: flex; align-items: baseline; gap: max(8px, calc(var(--u) * 6)); }
.pj-count b { font-size: max(30px, calc(var(--u) * 24)); font-weight: 600; line-height: 1; }
.pj-count span { font-size: max(20px, calc(var(--u) * 15)); font-weight: 400; line-height: 1; }
.pj-desc { margin: max(8px, calc(var(--u) * 7)) 0 0; font-size: max(13px, calc(var(--u) * 8.5)); line-height: 1.3; }

.pj-cards { display: grid; grid-template-columns: 1fr; gap: max(8px, calc(var(--u) * 9)); margin-top: max(16px, calc(var(--u) * 15)); }
.pj-card {
  display: flex;
  align-items: center;
  min-height: max(56px, calc(var(--u) * 50));
  padding: max(14px, calc(var(--u) * 11)) max(16px, calc(var(--u) * 10.5));
  border-radius: max(16px, calc(var(--u) * 15));
  background: #ffffff;
  color: #111;
  font-size: max(14px, calc(var(--u) * 9.5));
  font-weight: 500;
  line-height: 1.15;
}
@media (min-width: 768px) { .pj-cards { grid-template-columns: repeat(3, 1fr); } }

/* ---------- Desktop: tiga kolom, gambar di kiri, tombol di kanan atas ---------- */
@media (min-width: 640px) {
  .pj-row { grid-template-columns: 39.7% 1fr auto; column-gap: 0; align-items: center; }
  .pj-action { grid-column: 3; grid-row: 1; margin-top: 0; justify-self: end; }
  .pj-media {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: stretch;
    display: block;
    margin-left: 10.5%;
    width: 82.6%;
    transition: none;
  }
  .pj-media-clip { height: 100%; overflow: visible; }
  .pj-photo { height: 100%; aspect-ratio: auto; margin-top: 0; border-radius: max(18px, calc(var(--u) * 15)); }
  .pj-panel { grid-column: 2 / span 2; grid-row: 2; }
  .pj-panel-body { min-height: calc(var(--u) * 165); padding-top: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .pj-row, .pj-cat, .pj-media, .pj-panel, .pj-panel-body, .pj-photo, .pj-panel-clip { transition: none !important; }
}
`;

export default function Project() {
  const [active, setActive] = useState(null);

  return (
    <section id="project" className="pj-root">
      <style>{styles}</style>

      <div className="pj-head">
        <h2 className="pj-title">{heading}</h2>
        <p className="pj-sub">{subheading}</p>
      </div>

      <ul className="pj-list" onMouseLeave={() => canHover() && setActive(null)}>
        {services.map((item, i) => {
          const open = active === i;
          const external = isExternal(item.href);

          return (
            <li
              key={item.number}
              className="pj-row"
              data-open={open}
              onMouseEnter={() => canHover() && setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
              }}
              onClick={() => {
                if (!canHover()) setActive((a) => (a === i ? null : i));
              }}
            >
              <span className="pj-num">{item.number}</span>

              <div className="pj-block">
                <span className="pj-cat">{item.category}</span>
                <h3 className="pj-name">{item.title}</h3>
              </div>

              <div className="pj-action">
                <a
                  href={item.href}
                  className="pj-btn"
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                >
                  {buttonLabel}
                  <ArrowUpRight />
                </a>
              </div>

              <div className="pj-media" aria-hidden="true">
                <div className="pj-media-clip">
                  <div className="pj-photo">
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pj-panel">
                <div className="pj-panel-clip">
                  <div className="pj-panel-body">
                    <p className="pj-count">
                      <b>{item.count}</b>
                      <span>tahun pengerjaan</span>
                    </p>
                    <p className="pj-desc">{item.description}</p>
                    <div className="pj-cards">
                      {item.tags.map((tag) => (
                        <div key={tag} className="pj-card">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}