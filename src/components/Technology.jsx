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
    name: 'React.js',
    category: 'Frontend Library',
    description: 'Membangun antarmuka pengguna berbasis komponen.',
    icon: `${DEVICON}/react/react-original.svg`,
    fallback: `${SIMPLE}/react/61DAFB`,
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
    name: 'MySQL',
    category: 'Database',
    description: 'Menyimpan dan mengelola data aplikasi.',
    icon: `${DEVICON}/mysql/mysql-original.svg`,
    fallback: `${SIMPLE}/mysql/4479A1`,
  },
  {
    name: 'phpMyAdmin',
    category: 'Database Management',
    description: 'Mengelola database MySQL melalui antarmuka web.',
    icon: `${DEVICON}/phpmyadmin/phpmyadmin-original.svg`,
    fallback: `${SIMPLE}/phpmyadmin/6C78AF`,
  },
  {
    name: 'GSAP',
    category: 'Animation',
    description: 'Membuat animasi web yang halus dan interaktif.',
    // Devicon tidak punya logo GSAP, jadi langsung memakai Simple Icons.
    icon: `${SIMPLE}/gsap/88CE02`,
    fallback: null,
  },
  {
    name: 'Astro',
    category: 'Web Framework',
    description: 'Membangun website yang cepat dengan pendekatan berbasis komponen.',
    icon: `${DEVICON}/astro/astro-original.svg`,
    fallback: `${SIMPLE}/astro/FF5D01`,
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
      className="relative w-full bg-[#F3EFE8] px-5 py-20 text-[#111111] md:px-10 md:py-28 scroll-mt-20"
      style={{ fontFamily: "'Manrope', 'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-12 md:mb-16">
          <p
            data-tech-head
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#666666]"
          >
            Skillset
          </p>
          <h2
            id="kemampuan-title"
            data-tech-head
            className="text-[clamp(2.25rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
          >
            Kemampuan Saya
          </h2>
          <p
            data-tech-head
            className="mt-6 max-w-xl text-sm leading-7 text-[#666666] md:text-base"
          >
            Berbagai kemampuan dan teknologi yang saya gunakan untuk membangun
            website modern, aplikasi yang rapi, serta pengalaman digital yang
            cepat dan berkesan.
          </p>
        </div>

        {/* GRID */}
        <ul
          data-tech-grid
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4"
        >
          {technologies.map((tech) => (
            <li
              key={tech.name}
              data-tech-item
              className="group flex h-full min-h-[184px] flex-col rounded-[10px] border border-[#D8D5CF] bg-white/40 p-5 transition-[transform,border-color,background-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[#FF493D] hover:bg-white/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Tile putih supaya logo gelap (mis. Astro) tetap terlihat jelas */}
              <span className="mb-5 flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-[#D8D5CF] bg-white">
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

              <h3 className="text-lg font-semibold leading-tight transition-[font-weight,color] duration-[250ms] group-hover:font-bold">
                {tech.name}
              </h3>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#666666] transition-colors duration-[250ms] group-hover:text-[#FF493D]">
                {tech.category}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#666666]">
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