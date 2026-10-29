import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  // Fungsi scroll halus ke puncak halaman
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    const navOffset = 80;
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const nav = navRef.current;
    const container = containerRef.current;
    const full = fullMenuRef.current;
    const icon = iconMenuRef.current;
    const iconBtn = icon ? icon.firstElementChild : null;

    if (!nav || !container || !full || !icon || !iconBtn) return;

    // Dipakai saat mount & restore posisi scroll; diisi oleh mode desktop di bawah.
    let sync = () => {};

    // Animasi hanya aktif di desktop. Di mobile navbar statis (diatur lewat CSS).
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
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
      let alive = true;

      // Timeline dibangun sekali (dan ulang HANYA saat lebar berubah), lalu hanya di-play/reverse.
      // Semua ukuran diukur di sini, tidak pernah di tengah animasi atau saat scroll.
      // Posisi dock tidak diukur dari tinggi layar: ia dihitung CSS lewat variabel --dock (0..1),
      // jadi tetap menempel di dasar layar walau tinggi layar berubah (toolbar browser).
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

        dockTl.progress(dockP);
        closeTl.progress(closeP);
        drive(dockTl, docked);
        drive(closeTl, closed);
      };

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

      // Scroll berhenti: tidak ada update scroll selama IDLE_DELAY -> menu terbuka lagi
      const idleCall = gsap.delayedCall(IDLE_DELAY, () => {
        scrolling = false;
        evaluate();
      });
      idleCall.pause();

      // Dipanggil saat scroll berubah, saat scroll berhenti, dan saat ukuran berubah:
      // hanya membaca scrollY dan membandingkan angka.
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
      // Dipanggil setelah memilih menu / klik di luar navbar: kembali ke aturan scroll biasa
      actionsRef.current.close = () => {
        if (pinnedY === null) return;
        pinnedY = null;
        evaluate();
      };

      const onOutsidePointer = (e) => {
        if (pinnedY !== null && !nav.contains(e.target)) actionsRef.current.close();
      };
      document.addEventListener('pointerdown', onOutsidePointer);

      const st = ScrollTrigger.create({
        onUpdate: () => {
          scrolling = true;
          idleCall.restart(true);
          evaluate();
        },
      });

      // ScrollTrigger me-refresh saat ukuran berubah. Ukur ulang navbar HANYA jika LEBAR berubah.
      // Perubahan tinggi saja (toolbar browser muncul/hilang) tidak mengubah ukuran navbar,
      // jadi tidak perlu dibangun ulang, dan posisi dock sudah ikut tinggi layar lewat CSS.
      let lastW = window.innerWidth;
      const onRefresh = () => {
        if (window.innerWidth !== lastW) {
          lastW = window.innerWidth;
          build();
        }
        evaluate();
      };
      ScrollTrigger.addEventListener('refresh', onRefresh);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (alive) build();
        });
      }

      build();
      sync = (instant) => evaluate(instant);

      return () => {
        alive = false;
        sync = () => {};
        ScrollTrigger.removeEventListener('refresh', onRefresh);
        document.removeEventListener('pointerdown', onOutsidePointer);
        idleCall.kill();
        st.kill();
        if (dockTl) dockTl.kill();
        if (closeTl) closeTl.kill();
        gsap.set(nav, { clearProps: '--dock' });
        gsap.set(container, { clearProps: 'width' });
        gsap.set([full, icon], { clearProps: 'transform,opacity,visibility' });
        actionsRef.current = { open: () => {}, close: () => {} };
      };
    });

    // Mount: instan, supaya refresh di tengah halaman tidak memutar animasi navbar
    const mountTimer = setTimeout(() => {
      sync(true);
      // Beritahu index.astro bahwa Navbar sudah hydrate dan keadaannya benar
      window.__navReady = true;
      window.dispatchEvent(new Event('nav:ready'));
    }, 0);

    // Dikirim index.astro setelah posisi scroll dipulihkan: langsung snap ke keadaan yang benar
    const onRestored = () => sync(true);
    window.addEventListener('scroll:restored', onRestored);

    return () => {
      clearTimeout(mountTimer);
      window.__navReady = false;
      window.removeEventListener('scroll:restored', onRestored);
      mm.revert();
    };
  }, []);

  return (
    <>
      {/* NAVBAR WRAPPER */}
      <header data-site-nav className="fixed top-[max(1rem,env(safe-area-inset-top))] md:top-5 left-0 right-0 z-50 flex justify-center px-[max(1rem,env(safe-area-inset-left))] pointer-events-none">
        {/*
          Gerak turun ke dasar layar: `translate` dihitung CSS dari variabel --dock (0 = atas, 1 = bawah).
          100dvh = tinggi layar saat ini, 100% = tinggi navbar sendiri, 2.5rem = jarak atas + bawah (20px x 2).
        */}
        <nav
          ref={navRef}
          className="pointer-events-auto flex items-center gap-1 md:gap-1.5 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 rounded-[6px] shadow-sm dark:shadow-none transition-[scale,background-color,border-color,box-shadow] duration-300 ease-out hover:scale-[1.015] will-change-transform md:[translate:0_calc(var(--dock,0)*(100dvh_-_100%_-_2.5rem))]"
        >
          {/* LOGO */}
          <a 
            href="#home" 
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('home');
            }}
            className="flex items-center justify-center h-7 md:h-8.5 px-2 md:px-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-white dark:text-[#171717] dark:hover:bg-neutral-200 rounded-sm font-bold text-[10px] md:text-xs transition-colors border border-black/10 dark:border-white/50 tracking-wider shrink-0"
          >
            CANEVNO
          </a>

          {/* CONTAINER TENGAH */}
          <div
            ref={containerRef}
            className="flex items-center justify-center bg-[#dedee3]/80 dark:bg-[#202020]/60 p-0.5 rounded-sm border border-[#d1d1d6]/60 dark:border-[#3d3d3d]/50 relative overflow-hidden min-w-8 md:min-w-9 min-h-7 md:min-h-8"
          >
            {/* Menu Lengkap */}
            <div ref={fullMenuRef} className="flex items-center gap-0.5 origin-center max-md:hidden">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      scrollToSection(item.id);
                      actionsRef.current.close();
                    }}
                    className={`h-6 md:h-7.5 px-1.5 md:px-3 text-[10px] md:text-xs font-medium rounded-[3px] transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'text-[#1c1c1e] border border-[#b0b0b8] bg-[#f2f2f7] shadow-xs dark:text-white dark:border-neutral-300/90 dark:bg-[#3a3a3a]/90'
                        : 'text-[#636366] border border-transparent bg-transparent hover:bg-[#d5d5da]/70 hover:text-[#1c1c1e] dark:text-neutral-300 dark:border-neutral-700/40 dark:bg-[#2d2d2d]/60 dark:hover:border-neutral-500 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Hamburger Icon: klik untuk membuka menu lengkap saat navbar menutup */}
            <div ref={iconMenuRef} className="absolute inset-0 flex items-center justify-center origin-center invisible opacity-0 max-md:static max-md:visible max-md:opacity-100">
              <button 
                type="button"
                aria-label="Open menu"
                onClick={() => actionsRef.current.open()}
                className="h-6 md:h-7.5 w-7 md:w-8 flex items-center justify-center text-[#1c1c1e] bg-[#f2f2f7] dark:text-white dark:bg-[#3a3a3a]/90 rounded-[3px] border border-[#b0b0b8] dark:border-neutral-300/90 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* CONTACT ME */}
          <a
            href="#"
            className="flex items-center justify-center h-7 md:h-8.5 px-2.5 md:px-3.5 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-[#ececec] dark:hover:bg-white dark:text-[#121212] font-semibold text-[10px] md:text-xs rounded-sm transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0"
          >
            Contact Me
          </a>
        </nav>
      </header>

      {/* TOMBOL BACK TO TOP (BOTTOM RIGHT) */}
      <div
        ref={backTopRef}
        data-site-nav
        data-visible="false"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] md:bottom-5 md:right-5 z-50 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 rounded-md shadow-sm dark:shadow-none transition-all duration-500 hover:scale-[1.03] opacity-0 translate-y-3 pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 data-[visible=true]:pointer-events-auto"
      >
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="flex items-center justify-center h-7 w-7 md:h-8.5 md:w-8.5 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-[#ececec] dark:hover:bg-white dark:text-[#121212] rounded-sm transition-all duration-300 active:scale-90 cursor-pointer"
        >
          <svg 
            className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-current fill-none transition-transform duration-300 group-hover:-translate-y-0.5" 
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

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Aboutme' },
  { id: 'project', label: 'Project' },
  { id: 'gallery', label: 'Gallery' },
];