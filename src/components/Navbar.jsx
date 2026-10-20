import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Gallery');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const fullMenuRef = useRef(null);
  const iconMenuRef = useRef(null);
  const isCollapsedRef = useRef(false);

  // Inisialisasi Deteksi & Toggle Tema Global
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Fungsi scroll halus ke puncak halaman
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const nav = navRef.current;
    const container = containerRef.current;
    const full = fullMenuRef.current;
    const icon = iconMenuRef.current;

    if (!nav || !container || !full || !icon) return;

    let menuTl = null;

    // Mengukur lebar container tengah untuk salah satu mode (tanpa terlihat di layar)
    const measureWidth = (showFull) => {
      const prevFull = full.style.display;
      const prevIcon = icon.style.display;
      const prevWidth = container.style.width;

      full.style.display = showFull ? 'flex' : 'none';
      icon.style.display = showFull ? 'none' : 'flex';
      container.style.width = 'auto';

      const w = container.offsetWidth;

      full.style.display = prevFull;
      icon.style.display = prevIcon;
      container.style.width = prevWidth;

      return w;
    };

    // 1. Kuncup (menu lengkap memudar -> lebar menyusut -> ikon muncul)
    const collapseMenu = () => {
      if (isCollapsedRef.current) return;
      isCollapsedRef.current = true;

      if (menuTl) menuTl.kill();
      gsap.killTweensOf([full, icon, container]);

      const startW = container.offsetWidth;
      const endW = measureWidth(false);

      menuTl = gsap.timeline();

      // Hanya fade-out jika menu lengkap memang masih tampil
      if (full.style.display !== 'none') {
        menuTl.to(full, {
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: 'power2.in',
        });
        menuTl.add(() => {
          full.style.display = 'none';
          icon.style.display = 'flex';
          gsap.set(icon, { opacity: 0, scale: 0.7 });
        });
      }

      menuTl
        .fromTo(
          container,
          { width: startW },
          { width: endW, duration: 0.45, ease: 'power3.inOut', clearProps: 'width' },
          '>'
        )
        .to(
          icon,
          { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
          '<0.1'
        );
    };

    // 2. Mekar (ikon memudar -> lebar melebar -> menu lengkap muncul)
    const expandMenu = () => {
      if (!isCollapsedRef.current) return;
      isCollapsedRef.current = false;

      if (menuTl) menuTl.kill();
      gsap.killTweensOf([full, icon, container]);

      const startW = container.offsetWidth;
      const endW = measureWidth(true);

      menuTl = gsap.timeline();

      if (icon.style.display === 'flex') {
        menuTl.to(icon, {
          opacity: 0,
          scale: 0.7,
          duration: 0.15,
          ease: 'power2.in',
        });
        menuTl.add(() => {
          icon.style.display = 'none';
          full.style.display = 'flex';
          gsap.set(full, { opacity: 0, scale: 0.9, filter: 'blur(4px)' });
        });
        menuTl
          .fromTo(
            container,
            { width: startW },
            { width: endW, duration: 0.5, ease: 'power3.out', clearProps: 'width' },
            '>'
          )
          .to(
            full,
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'filter',
            },
            '<'
          );
      } else {
        // Kuncup terpotong sebelum menu lengkap sempat disembunyikan:
        // lanjutkan saja dari kondisi saat ini tanpa lompatan.
        menuTl.to(full, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'power3.out',
          clearProps: 'filter',
        });
      }
    };

    // 3. Gerak vertikal navbar: satu tween yang dipakai ulang (tidak dibuat ulang tiap scroll)
    const moveY = gsap.quickTo(nav, 'y', {
      duration: 1.2,
      ease: 'expo.out',
    });

    let lastTargetY = 0;
    let lastShowBackToTop = false;

    // 4. Listener Scroll dengan Penyejajaran Presisi
    const st = ScrollTrigger.create({
      onUpdate: () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Update state hanya ketika nilainya benar-benar berubah
        const shouldShowBackToTop = scrollY > 150;
        if (shouldShowBackToTop !== lastShowBackToTop) {
          lastShowBackToTop = shouldShowBackToTop;
          setShowBackToTop(shouldShowBackToTop);
        }

        const isAtTop = scrollY < 120;
        const isNearBottom = (windowHeight + scrollY) >= (documentHeight - 120);

        if (isAtTop || isNearBottom) {
          expandMenu();
        } else {
          collapseMenu();
        }

        const topOffset = window.innerWidth >= 768 ? 20 : 16;
        const navHeight = nav.offsetHeight || 44;
        const targetY = isAtTop ? 0 : windowHeight - navHeight - (topOffset * 2);

        // Hanya gerakkan navbar saat target berubah, supaya easing tidak restart tiap tick scroll
        if (targetY !== lastTargetY) {
          lastTargetY = targetY;
          moveY(targetY);
        }
      },
    });

    return () => {
      st.kill();
      if (menuTl) menuTl.kill();
      gsap.killTweensOf([nav, full, icon, container]);
    };
  }, []);

  return (
    <>
      {/* NAVBAR WRAPPER */}
      <header className="fixed top-4 md:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav 
          ref={navRef}
          className="pointer-events-auto flex items-center gap-1 md:gap-1.5 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 'rounded-[6px]' shadow-sm dark:shadow-none transition-[scale,background-color,border-color,box-shadow] duration-300 ease-out hover:scale-[1.015] will-change-transform"
        >
          {/* LOGO */}
          <a 
            href="#" 
            className="flex items-center justify-center h-7 md:h-8.5 px-2 md:px-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-white dark:text-[#171717] dark:hover:bg-neutral-200 rounded-sm font-bold text-[10px] md:text-xs transition-colors border border-black/10 dark:border-white/50 tracking-wider shrink-0"
          >
            CANEVNO
          </a>

          {/* CONTAINER TENGAH */}
          <div
            ref={containerRef}
            className="flex items-center justify-center bg-[#dedee3]/80 dark:bg-[#202020]/60 p-0.5 rounded-sm border border-[#d1d1d6]/60 dark:border-[#3d3d3d]/50 overflow-hidden min-w-8 md:min-w-9 min-h-7 md:min-h-8"
          >
            {/* Menu Lengkap */}
            <div ref={fullMenuRef} className="flex items-center gap-0.5 origin-center">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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

            {/* Hamburger Icon */}
            <div ref={iconMenuRef} className="hidden items-center justify-center origin-center">
              <button 
                aria-label="Menu"
                className="h-6 md:h-7.5 w-7 md:w-8 flex items-center justify-center text-[#1c1c1e] bg-[#f2f2f7] dark:text-white dark:bg-[#3a3a3a]/90 rounded-[3px] border border-[#b0b0b8] dark:border-neutral-300/90"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* TOGGLE THEME BUTTON */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex items-center justify-center h-7 w-7 md:h-8.5 md:w-8.5 bg-[#d8d8dd] hover:bg-[#ceced3] text-[#1c1c1e] dark:bg-[#3d3d3d]/80 dark:hover:bg-[#4a4a4a] dark:text-white rounded-sm transition-all duration-300 shrink-0 cursor-pointer"
          >
            {isDark ? (
              /* Sun Icon */
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              /* Moon Icon (Sesuai gambar referensi) */
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* CONTACT ME */}
          <a
            href="#contact"
            className="flex items-center justify-center h-7 md:h-8.5 px-2.5 md:px-3.5 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-[#ececec] dark:hover:bg-white dark:text-[#121212] font-semibold text-[10px] md:text-xs rounded-sm transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0"
          >
            Contact Me
          </a>
        </nav>
      </header>

      {/* TOMBOL BACK TO TOP (BOTTOM RIGHT) */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-5 md:right-5 z-50 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 rounded-md shadow-sm dark:shadow-none transition-all duration-500 hover:scale-[1.03] ${
          showBackToTop 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
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
  { id: 'Home', label: 'Home' },
  { id: 'Aboutme', label: 'Aboutme' },
  { id: 'Project', label: 'Project' },
  { id: 'Gallery', label: 'Gallery' },
];