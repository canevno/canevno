import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Aboutme' },
  { id: 'project', label: 'Project' },
  { id: 'gallery', label: 'Gallery' },
];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('home');

  const navRef = useRef(null);
  const backTopRef = useRef(null);
  const containerRef = useRef(null);
  const fullMenuRef = useRef(null);
  const iconMenuRef = useRef(null);
  // Aksi buka/tutup manual dari tombol menu (diisi di dalam useEffect animasi)
  const actionsRef = useRef({ open: () => {}, close: () => {} });

  // Tema: class `dark` di <html> sudah dipasang script inline di <head> sebelum paint.
  // Efek ini hanya memastikan class sesuai preferensi tersimpan / sistem (idempoten).
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      document.documentElement.classList.toggle('dark', dark);
    } catch {
      // localStorage diblokir: biarkan class apa adanya
    }
  }, []);

  // Situs memakai Lenis (smooth scroll). Scroll native `behavior: 'smooth'` bertabrakan dengan Lenis
  // dan terasa tersendat, jadi pakai lenis.scrollTo bila ada.
  const smoothScrollTo = (top) => {
    const lenis = window.__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(top, { duration: 1.1 });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => smoothScrollTo(0);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    const navOffset = 80;
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset;
    smoothScrollTo(Math.max(0, top));
  };

  const goTo = (id) => {
    setActiveTab(id);
    scrollToSection(id);
    actionsRef.current.close();
  };

  /*
    ANIMASI NAVBAR (desktop DAN mobile)
    Dirancang agar tidak menghambat scroll dan tidak memengaruhi hero:
    - Tanpa ScrollTrigger: cukup satu listener scroll pasif yang hanya membaca scrollY.
    - Tidak ada pengukuran layout saat scroll. Ukuran hanya diukur saat mount, saat font selesai
      dimuat, dan saat LEBAR layar berubah (tinggi layar, mis. toolbar browser HP, diabaikan).
    - Posisi turun ke dasar layar dihitung CSS dari variabel --dock (0..1), 100dvh, dan safe-area,
      jadi tetap menempel di dasar walau tinggi layar berubah, tanpa JS mengukur tinggi.
    - Hanya menganimasikan elemen navbar sendiri (translate, lebar, opacity, scale).
  */
  useEffect(() => {
    const nav = navRef.current;
    const container = containerRef.current;
    const full = fullMenuRef.current;
    const icon = iconMenuRef.current;
    const iconBtn = icon ? icon.firstElementChild : null;

    if (!nav || !container || !full || !icon || !iconBtn) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DOCK_ON = 120; // mulai scroll lebih dari ini: navbar turun ke bawah
    const DOCK_OFF = 60; // kembali ke atas hanya jika scroll di bawah ini (hysteresis)
    const IDLE_DELAY = 0.2; // detik tanpa gerakan scroll sebelum menu terbuka lagi

    let dockTl = null; // timeline gerak vertikal (atas <-> bawah layar)
    let closeTl = null; // timeline buka/tutup menu (menu lengkap <-> ikon)
    let docked = false;
    let closed = false;
    // Posisi scroll saat menu dibuka manual lewat tombol menu (null = tidak dibuka manual).
    let pinnedY = null;
    let scrolling = false; // true selama ada gerakan scroll (ke atas maupun ke bawah)
    let lastShowBackToTop = false;
    let lastY = window.scrollY;
    let alive = true;

    // Mainkan maju/mundur dari posisi sekarang (aman dibalik di tengah jalan, tanpa lompatan)
    const drive = (tl, on) => {
      if (!tl) return;
      if (tl.progress() === (on ? 1 : 0)) {
        tl.pause();
        return;
      }
      if (on) tl.play();
      else tl.reverse();
    };

    // Timeline dibangun sekali (dan ulang HANYA saat lebar/font berubah), lalu hanya di-play/reverse.
    const build = () => {
      const dockP = dockTl ? dockTl.progress() : 0;
      const closeP = closeTl ? closeTl.progress() : 0;
      if (dockTl) dockTl.kill();
      if (closeTl) closeTl.kill();

      gsap.set(nav, { clearProps: '--dock' });
      gsap.set(container, { clearProps: 'width' });
      gsap.set([full, icon], { clearProps: 'transform,opacity,visibility' });

      // Koreksi skala hover navbar (scale 1.015) agar ukuran terukur akurat
      const s = nav.getBoundingClientRect().width / nav.offsetWidth || 1;
      const w = (el) => el.getBoundingClientRect().width / s;

      const fullW = w(container);
      const chrome = fullW - w(full);
      const minW = parseFloat(getComputedStyle(container).minWidth) || 0;
      const iconW = Math.max(w(iconBtn) + chrome, minW);

      closeTl = gsap.timeline({ paused: true });
      closeTl
        .to(full, { autoAlpha: 0, scale: 0.9, duration: 0.22, ease: 'power2.in' }, 0)
        .fromTo(
          container,
          { width: fullW },
          { width: iconW, duration: 0.5, ease: 'power3.inOut' },
          0.12
        )
        .fromTo(
          icon,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
          0.32
        );

      dockTl = gsap.timeline({ paused: true });
      dockTl.fromTo(
        nav,
        { '--dock': 0 },
        { '--dock': 1, duration: 0.9, ease: 'power3.inOut' }
      );

      // Pengguna dengan reduced motion: perpindahan hampir instan
      if (reduceMotion) {
        dockTl.timeScale(50);
        closeTl.timeScale(50);
      }

      dockTl.progress(dockP);
      closeTl.progress(closeP);
      drive(dockTl, docked);
      drive(closeTl, closed);
    };

    // Tombol back-to-top dikendalikan lewat atribut data (bukan React state) agar bisa di-snap.
    // instant: matikan transition sesaat, terapkan, paksa reflow, lalu kembalikan.
    const setBackTop = (visible, instant) => {
      const el = backTopRef.current;
      if (!el) return;
      if (instant) el.style.transition = 'none';
      el.dataset.visible = visible ? 'true' : 'false';
      if (instant) {
        void el.offsetHeight;
        el.style.transition = '';
      }
    };

    // Scroll berhenti: tidak ada gerakan selama IDLE_DELAY -> menu terbuka lagi
    const idleCall = gsap.delayedCall(IDLE_DELAY, () => {
      scrolling = false;
      evaluate();
    });
    idleCall.pause();

    // Hanya membaca scrollY dan membandingkan angka.
    // Animasi baru dimainkan kalau keadaan benar-benar berubah.
    // instant = true: terapkan keadaan akhir tanpa animasi (mount & restore posisi scroll).
    const evaluate = (instant = false) => {
      if (!alive || !dockTl || !closeTl) return;
      const y = window.scrollY;

      const showBackToTop = y > 150;
      if (showBackToTop !== lastShowBackToTop || instant) {
        lastShowBackToTop = showBackToTop;
        setBackTop(showBackToTop, instant);
      }

      // Menu yang dibuka manual dilepas lagi kalau pengguna sudah scroll cukup jauh
      if (pinnedY !== null && Math.abs(y - pinnedY) > 80) pinnedY = null;

      const nextDocked = docked ? y > DOCK_OFF : y > DOCK_ON;
      // Menutup selama scroll bergerak, membuka lagi saat gerakan berhenti
      const nextClosed = scrolling && pinnedY === null;

      if (instant) {
        // Mount / restore posisi: langsung ke keadaan diam (menu terbuka), tanpa animasi
        scrolling = false;
        lastY = y; // scroll susulan dari restore tidak dianggap gerakan baru
        idleCall.pause();
        docked = nextDocked;
        closed = false;
        dockTl.progress(docked ? 1 : 0).pause();
        closeTl.progress(0).pause();
        return;
      }

      if (nextDocked !== docked) {
        docked = nextDocked;
        drive(dockTl, docked);
      }
      if (nextClosed !== closed) {
        closed = nextClosed;
        drive(closeTl, closed);
      }
    };

    // Dipanggil tombol menu: buka menu lengkap walau berada di dasar halaman
    actionsRef.current.open = () => {
      pinnedY = window.scrollY;
      evaluate();
    };
    // Dipanggil setelah memilih menu / tap di luar navbar: kembali ke aturan scroll biasa
    actionsRef.current.close = () => {
      if (pinnedY === null) return;
      pinnedY = null;
      evaluate();
    };

    const onOutsidePointer = (e) => {
      if (pinnedY !== null && !nav.contains(e.target)) actionsRef.current.close();
    };
    document.addEventListener('pointerdown', onOutsidePointer);

    // Satu listener scroll pasif. Event tanpa perubahan posisi (mis. susulan setelah restore) diabaikan.
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 1) return;
      lastY = y;
      scrolling = true;
      idleCall.restart(true);
      evaluate();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Ukur ulang HANYA jika lebar berubah (tinggi layar tidak memengaruhi ukuran navbar).
    let lastW = window.innerWidth;
    let resizeT = 0;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        if (!alive) return;
        build();
        evaluate();
      }, 120);
    };
    window.addEventListener('resize', onResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) build();
      });
    }

    build();

    // Mount: instan, supaya refresh di tengah halaman tidak memutar animasi navbar
    const mountTimer = setTimeout(() => {
      evaluate(true);
      // Beritahu index.astro bahwa Navbar sudah hydrate dan keadaannya benar
      window.__navReady = true;
      window.dispatchEvent(new Event('nav:ready'));
    }, 0);

    // Dikirim index.astro setelah posisi scroll dipulihkan: langsung snap ke keadaan yang benar
    const onRestored = () => evaluate(true);
    window.addEventListener('scroll:restored', onRestored);

    return () => {
      alive = false;
      clearTimeout(mountTimer);
      clearTimeout(resizeT);
      window.__navReady = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll:restored', onRestored);
      document.removeEventListener('pointerdown', onOutsidePointer);
      idleCall.kill();
      if (dockTl) dockTl.kill();
      if (closeTl) closeTl.kill();
      gsap.set(nav, { clearProps: '--dock' });
      gsap.set(container, { clearProps: 'width' });
      gsap.set([full, icon], { clearProps: 'transform,opacity,visibility' });
      actionsRef.current = { open: () => {}, close: () => {} };
    };
  }, []);

  const itemClass = (isActive) =>
    `h-6 md:h-7.5 px-1 md:px-3 text-[9.5px] md:text-xs font-medium rounded-[3px] transition-colors duration-200 whitespace-nowrap ${
      isActive
        ? 'text-[#1c1c1e] border border-[#b0b0b8] bg-[#f2f2f7] shadow-xs dark:text-white dark:border-neutral-300/90 dark:bg-[#3a3a3a]/90'
        : 'text-[#636366] border border-transparent bg-transparent hover:bg-[#d5d5da]/70 hover:text-[#1c1c1e] dark:text-neutral-300 dark:border-neutral-700/40 dark:bg-[#2d2d2d]/60 dark:hover:border-neutral-500 dark:hover:text-white'
    }`;

  return (
    <>
      {/*
        NAVBAR WRAPPER
        --nav-t / --nav-b = jarak navbar dari tepi atas / bawah layar (memperhitungkan safe-area HP).
        Gerak turun ke dasar layar: `translate` dihitung CSS dari --dock (0 = atas, 1 = bawah):
        100dvh = tinggi layar saat ini, 100% = tinggi navbar sendiri.
      */}
      <header
        data-site-nav
        className="fixed top-[var(--nav-t)] left-0 right-0 z-50 flex justify-center px-[max(1rem,env(safe-area-inset-left))] pointer-events-none [--nav-t:max(1rem,env(safe-area-inset-top))] md:[--nav-t:1.25rem] [--nav-b:max(1rem,env(safe-area-inset-bottom))] md:[--nav-b:1.25rem]"
      >
        <nav
          ref={navRef}
          className="pointer-events-auto flex items-center gap-1 md:gap-1.5 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 rounded-[6px] shadow-sm dark:shadow-none transition-[scale,background-color,border-color,box-shadow] duration-300 ease-out hover:scale-[1.015] will-change-transform [translate:0_calc(var(--dock,0)*(100dvh_-_100%_-_var(--nav-t)_-_var(--nav-b)))]"
        >
          {/* LOGO (disembunyikan di layar sangat sempit agar menu muat) */}
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              goTo('home');
            }}
            className="flex items-center justify-center h-7 md:h-8.5 px-1.5 md:px-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-white dark:text-[#171717] dark:hover:bg-neutral-200 rounded-sm font-bold text-[9.5px] md:text-xs transition-colors border border-black/10 dark:border-white/50 tracking-wider shrink-0 max-[339px]:hidden"
          >
            CANEVNO
          </a>

          {/* CONTAINER TENGAH */}
          <div
            ref={containerRef}
            className="flex items-center justify-center bg-[#dedee3]/80 dark:bg-[#202020]/60 p-0.5 rounded-sm border border-[#d1d1d6]/60 dark:border-[#3d3d3d]/50 relative overflow-hidden min-w-8 md:min-w-9 min-h-7 md:min-h-8"
          >
            {/* Menu lengkap */}
            <div ref={fullMenuRef} className="flex items-center gap-0.5 origin-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  className={itemClass(activeTab === item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Ikon menu: bentuk saat navbar menutup. Ketuk untuk membuka menu lengkap lagi. */}
            <div
              ref={iconMenuRef}
              className="absolute inset-0 flex items-center justify-center origin-center invisible opacity-0"
            >
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => actionsRef.current.open()}
                className="h-6 md:h-7.5 w-7 md:w-8 flex items-center justify-center text-[#1c1c1e] bg-[#f2f2f7] dark:text-white dark:bg-[#3a3a3a]/90 rounded-[3px] border border-[#b0b0b8] dark:border-neutral-300/90 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </button>
            </div>
          </div>

          {/* CONTACT ME */}
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              goTo('contact');
            }}
            className="flex items-center justify-center h-7 md:h-8.5 px-2 md:px-3.5 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-[#ececec] dark:hover:bg-white dark:text-[#121212] font-semibold text-[9.5px] md:text-xs rounded-sm transition-colors whitespace-nowrap shrink-0"
          >
            Contact Me
          </a>
        </nav>
      </header>

      {/* TOMBOL BACK TO TOP (BOTTOM RIGHT). Di HP dinaikkan agar tidak bertumpuk dengan navbar yang turun ke dasar. */}
      <div
        ref={backTopRef}
        data-site-nav
        data-visible="false"
        className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.75rem)] right-[max(1rem,env(safe-area-inset-right))] md:bottom-5 md:right-5 z-50 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 rounded-md shadow-sm dark:shadow-none transition-[opacity,translate,scale] duration-500 hover:scale-[1.03] opacity-0 translate-y-3 pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:pointer-events-auto"
      >
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="flex items-center justify-center h-7 w-7 md:h-8.5 md:w-8.5 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-[#ececec] dark:hover:bg-white dark:text-[#121212] rounded-sm transition-colors active:scale-90 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </>
  );
}