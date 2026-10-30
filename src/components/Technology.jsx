import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
  LOGO
  - Sumber utama : Devicon (versi dipin supaya URL stabil).
  - Cadangan     : Simple Icons dengan warna brand (jika Devicon gagal dimuat).
  - Terakhir     : monogram netral, supaya layout tidak pernah rusak.
  Untuk performa maksimal, unduh SVG-nya ke public/logos/ lalu ganti `icon`
  menjadi '/logos/<nama>.svg' (lihat catatan di bagian bawah file ini).
*/
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';
const SIMPLE = 'https://cdn.simpleicons.org';

const TITLE = 'KEMAMPUAN SAYA';
// Ganti ke '#FFFFFF' kalau ingin putih bersih, bukan putih krem seperti section lain
const BG = '#F3EFE8';

const technologies = [
  {
    name: 'HTML',
    category: 'Structure',
    description: 'Membuat struktur dan susunan konten halaman web.',
    icon: `${DEVICON}/html5/html5-original.svg`,
    fallback: `${SIMPLE}/html5/E34F26`,
  },
  {
    name: 'CSS',
    category: 'Styling',
    description: 'Mengatur warna, layout, tipografi, dan tampilan website.',
    icon: `${DEVICON}/css3/css3-original.svg`,
    fallback: `${SIMPLE}/css3/1572B6`,
  },
  {
    name: 'JavaScript',
    category: 'Programming',
    description: 'Menambahkan interaksi dan perilaku dinamis pada website.',
    icon: `${DEVICON}/javascript/javascript-original.svg`,
    fallback: `${SIMPLE}/javascript/F7DF1E`,
  },
  {
    name: 'Tailwind CSS',
    category: 'CSS Framework',
    description: 'Membuat desain antarmuka menggunakan utility classes.',
    icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
    fallback: `${SIMPLE}/tailwindcss/06B6D4`,
  },
  {
    name: 'Alpine.js',
    category: 'JavaScript Framework',
    description: 'Membuat interaksi antarmuka sederhana secara deklaratif.',
    icon: `${DEVICON}/alpinejs/alpinejs-original.svg`,
    fallback: `${SIMPLE}/alpinedotjs/8BC0D0`,
  },
  {
    name: 'PHP',
    category: 'Backend',
    description: 'Menangani logika server dan pemrosesan data.',
    icon: `${DEVICON}/php/php-original.svg`,
    fallback: `${SIMPLE}/php/777BB4`,
  },
  {
    name: 'Laravel',
    category: 'Backend Framework',
    description: 'Membangun aplikasi web dengan struktur yang terorganisasi.',
    icon: `${DEVICON}/laravel/laravel-original.svg`,
    fallback: `${SIMPLE}/laravel/FF2D20`,
  },
  {
    name: 'Livewire',
    category: 'Laravel Framework',
    description: 'Membuat komponen web yang dinamis di Laravel.',
    // Devicon tidak punya logo Livewire, jadi langsung memakai Simple Icons.
    icon: `${SIMPLE}/livewire/FB70A9`,
    fallback: null,
  },
  {
    name: 'Next.js',
    category: 'React Framework',
    description: 'Membangun website berbasis React yang cepat dan terstruktur.',
    icon: `${DEVICON}/nextjs/nextjs-original.svg`,
    fallback: `${SIMPLE}/nextdotjs/000000`,
  },
  {
    name: 'Flutter',
    category: 'Mobile Framework',
    description: 'Membuat aplikasi mobile dengan satu basis kode.',
    icon: `${DEVICON}/flutter/flutter-original.svg`,
    fallback: `${SIMPLE}/flutter/02569B`,
  },
  {
    name: 'Dart',
    category: 'Programming',
    description: 'Bahasa pemrograman yang digunakan untuk membangun aplikasi Flutter.',
    icon: `${DEVICON}/dart/dart-original.svg`,
    fallback: `${SIMPLE}/dart/0175C2`,
  },
];

// Jika gambar gagal dimuat: coba cadangan, lalu tampilkan monogram.
function handleLogoError(event, fallback, name) {
  const img = event.currentTarget;
  if (fallback && img.dataset.tried !== '1') {
    img.dataset.tried = '1';
    img.src = fallback;
    return;
  }
  const mono = document.createElement('span');
  mono.textContent = name.charAt(0);
  mono.setAttribute('aria-hidden', 'true');
  mono.className = 'text-base font-bold text-[#111111]';
  img.replaceWith(mono);
}

// Gradasi huruf bergantian merah tua dan oranye-merah, sama seperti judul Hero.
const titleStops = [
  [0, '#4A0908'], [0.05, '#850D08'], [0.085, '#FF3215'], [0.125, '#FF590A'],
  [0.14, '#4A0908'], [0.2, '#850D08'], [0.23, '#FF3215'], [0.29, '#FF590A'],
  [0.31, '#7A1008'], [0.37, '#850D08'], [0.4, '#FF3215'], [0.455, '#FF590A'],
  [0.48, '#FF3215'], [0.525, '#850D08'], [0.54, '#FF3215'], [0.6, '#FF590A'],
  [0.62, '#4A0908'], [0.67, '#850D08'], [0.72, '#FF3215'], [0.775, '#FF590A'],
  [0.79, '#FF3215'], [0.85, '#FF590A'], [0.865, '#4A0908'], [0.915, '#850D08'],
  [0.93, '#FF3215'], [0.975, '#FF590A'], [1, '#850D08'],
];
const TITLE_FONT = "'Anton', 'Bebas Neue', Impact, 'Arial Narrow', sans-serif";

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@400;500;600;700&display=swap');`;

export default function Kemampuan() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Pengguna dengan reduced motion: konten langsung tampil, tanpa animasi.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const head = root.querySelectorAll('[data-tech-head]');
      const items = root.querySelectorAll('[data-tech-item]');
      const foot = root.querySelectorAll('[data-tech-foot]');

      const reveal = (targets, trigger, vars = {}) =>
        gsap.from(targets, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: 'power2.out',
          // Lepas transform/opacity inline agar hover CSS berfungsi setelah reveal.
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger,
            start: 'top 85%',
            once: true, // jalan sekali saja, tidak diulang saat scroll naik/turun
          },
          ...vars,
        });

      reveal(head, head[0], { stagger: 0.1 });
      reveal(items, root.querySelector('[data-tech-grid]'), {
        stagger: 0.06,
        delay: 0.1,
      });
      reveal(foot, foot[0]);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="kemampuan"
      ref={sectionRef}
      aria-labelledby="kemampuan-title"
      className="relative w-full px-4 py-16 sm:px-5 sm:py-20 text-[#111111] md:px-10 md:py-28 scroll-mt-20"
      style={{ background: BG, fontFamily: "'Outfit', 'Manrope', 'Inter', system-ui, sans-serif" }}
    >
      <style>{fontImport}</style>

      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-12 md:mb-16">
          <p
            data-tech-head
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#77736E]"
          >
            Skillset
          </p>

          {/* Judul gaya Hero: Anton besar, satu baris, gradasi merah-oranye per huruf */}
          <h2 id="kemampuan-title" data-tech-head className="m-0">
            <svg
              viewBox="0 0 1000 150"
              role="img"
              aria-label="Kemampuan Saya"
              className="block h-auto w-full select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="kp-h" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
                  {titleStops.map(([offset, color]) => (
                    <stop key={offset} offset={offset} stopColor={color} />
                  ))}
                </linearGradient>
                <linearGradient id="kp-v" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="150">
                  <stop offset="0" stopColor="#000" stopOpacity="0" />
                  <stop offset="1" stopColor="#2A0504" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="148"
                fontSize="165"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fill="url(#kp-h)"
                fontFamily={TITLE_FONT}
              >
                {TITLE}
              </text>
              <text
                aria-hidden="true"
                x="0"
                y="148"
                fontSize="165"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fill="url(#kp-v)"
                fontFamily={TITLE_FONT}
              >
                {TITLE}
              </text>
            </svg>
          </h2>

          <p
            data-tech-head
            className="mt-6 max-w-xl text-sm leading-7 text-[#77736E] md:text-base"
          >
            Front-end Development, Debugging, Problem Solving, Animation Editing,
            Leadership, dan Graphic Design, didukung teknologi yang saya gunakan
            dalam proyek web dan aplikasi.
          </p>
        </div>

        {/* GRID */}
        <ul
          data-tech-grid
          className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 md:gap-4"
        >
          {technologies.map((tech) => (
            <li
              key={tech.name}
              data-tech-item
              className="group flex h-full min-h-[156px] flex-col rounded-[10px] border border-[#D8D5CF] bg-white/40 p-3.5 sm:min-h-[184px] sm:p-5 transition-[transform,border-color,background-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[#FF493D] hover:bg-white/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Tile putih supaya logo gelap (mis. Next.js) tetap terlihat jelas */}
              <span className="mb-3 flex h-10 w-10 flex-none sm:mb-5 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-[#D8D5CF] bg-white">
                <img
                  src={tech.icon}
                  alt={`Logo ${tech.name}`}
                  width="28"
                  height="28"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleLogoError(e, tech.fallback, tech.name)}
                  className="h-7 w-7 object-contain transition-transform duration-[250ms] ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>

              <h3 className="break-words text-base font-semibold leading-tight sm:text-lg transition-[font-weight,color] duration-[250ms] group-hover:font-bold">
                {tech.name}
              </h3>
              <p className="mt-1 break-words text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.16em] text-[#77736E] transition-colors duration-[250ms] group-hover:text-[#FF493D]">
                {tech.category}
              </p>
              <p className="mt-2 text-[13px] leading-5 text-[#77736E] sm:mt-3 sm:text-sm sm:leading-6">
                {tech.description}
              </p>
            </li>
          ))}
        </ul>

        {/* PENUTUP */}
        <p
          data-tech-foot
          className="mt-14 text-base font-medium text-[#111111] md:mt-20 md:text-lg"
        >
          Terus belajar. Terus membangun.
        </p>
      </div>
    </section>
  );
}

/*
  CATATAN LOGO LOKAL (opsional, disarankan untuk produksi)
  1. Unduh SVG tiap teknologi ke public/logos/ (mis. html.svg, css.svg, ...).
  2. Ganti nilai `icon` di atas menjadi '/logos/html.svg', dst., dan set `fallback: null`.
  Dengan begitu logo tidak bergantung CDN dan halaman tetap cepat/offline-safe.
*/