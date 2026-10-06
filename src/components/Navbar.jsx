import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Gallery');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const navRef = useRef(null);
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

    // 1. Kuncup Cepat (Instant Collapse)
    const collapseMenu = () => {
      if (isCollapsedRef.current) return;
      isCollapsedRef.current = true;

      gsap.killTweensOf([fullMenuRef.current, iconMenuRef.current]);

      gsap.to(fullMenuRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.08,
        ease: 'power4.out',
        onComplete: () => {
          if (fullMenuRef.current) fullMenuRef.current.style.display = 'none';
          if (iconMenuRef.current) {
            iconMenuRef.current.style.display = 'flex';
            gsap.fromTo(
              iconMenuRef.current,
              { opacity: 0, scale: 0.7 },
              { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' }
            );
          }
        },
      });
    };

    // 2. Mekar Halus (Smooth Organic Expand)
    const expandMenu = () => {
      if (!isCollapsedRef.current) return;
      isCollapsedRef.current = false;

      gsap.killTweensOf([fullMenuRef.current, iconMenuRef.current]);

      gsap.to(iconMenuRef.current, {
        opacity: 0,
        scale: 0.7,
        duration: 0.12,
        ease: 'power2.in',
        onComplete: () => {
          if (iconMenuRef.current) iconMenuRef.current.style.display = 'none';
          if (fullMenuRef.current) {
            fullMenuRef.current.style.display = 'flex';
            gsap.fromTo(
              fullMenuRef.current,
              { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
              { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
            );
          }
        },
      });
    };

    // 3. Listener Scroll dengan Penyejajaran Presisi
    const st = ScrollTrigger.create({
      onUpdate: () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        setShowBackToTop(scrollY > 150);

        const isAtTop = scrollY < 120;
        const isNearBottom = (windowHeight + scrollY) >= (documentHeight - 120);

        if (isAtTop || isNearBottom) {
          expandMenu();
        } else {
          collapseMenu();
        }

        const topOffset = window.innerWidth >= 768 ? 20 : 16;
        const navHeight = navRef.current ? navRef.current.offsetHeight : 44;
        const targetY = isAtTop ? 0 : windowHeight - navHeight - (topOffset * 2);

        gsap.to(navRef.current, {
          y: targetY,
          duration: 1.2,
          ease: 'expo.out',
          overwrite: 'auto',
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <>
      {/* NAVBAR WRAPPER */}
      <header className="fixed top-4 md:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav 
          ref={navRef}
          className="pointer-events-auto flex items-center gap-1 md:gap-1.5 p-1 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/75 backdrop-blur-md border border-[#d1d1d6]/80 dark:border-[#444444]/60 'rounded-[6px]' shadow-sm dark:shadow-none transition-all duration-300 ease-out hover:scale-[1.015]"
        >
          {/* LOGO */}
          <a 
            href="#" 
            className="flex items-center justify-center h-7 md:h-8.5 px-2 md:px-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white dark:bg-white dark:text-[#171717] dark:hover:bg-neutral-200 rounded-sm font-bold text-[10px] md:text-xs transition-colors border border-black/10 dark:border-white/50 tracking-wider shrink-0"
          >
            CANEVNO
          </a>

          {/* CONTAINER TENGAH */}
          <div className="flex items-center justify-center bg-[#dedee3]/80 dark:bg-[#202020]/60 p-0.5 rounded-sm border border-[#d1d1d6]/60 dark:border-[#3d3d3d]/50 overflow-hidden min-w-8 md:min-w-9 min-h-7 md:min-h-8">
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
  { id: 'Project', label: 'Project' },
  { id: 'Organisasi', label: 'Organisasi' },
  { id: 'Gallery', label: 'Gallery' },
];