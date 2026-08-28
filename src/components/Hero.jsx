import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.7,
        delay: 0.1,
      })
      .from(titleRef.current.children, {
        opacity: 0,
        y: 40,
        rotateX: -15,
        duration: 0.9,
        stagger: 0.1,
      }, '-=0.4')
      .from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.7,
      }, '-=0.5')
      .from(ctaRef.current.children, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.08,
      }, '-=0.4')
      .from(scrollIndicatorRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-between items-center px-4 md:px-8 pt-20 pb-8 overflow-hidden bg-white"
    >
      <div className="w-full shrink-0 h-4" />

      {/* KONTEN UTAMA */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center my-auto">
        
        {/* Status Badge Minimalis */}
        <div 
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 md:mb-8 rounded-full bg-neutral-100 border border-neutral-200/80"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] md:text-xs font-semibold tracking-widest text-neutral-700 uppercase">
            Available for new projects
          </span>
        </div>

        {/* Tipografi Utama Tajam & Kontras */}
        <div ref={titleRef} className="perspective-1000 mb-6 flex flex-col items-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[9.5rem] font-black tracking-tighter leading-[0.88] text-black uppercase">
            CREATIVE
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[9.5rem] font-black tracking-tighter leading-[0.88] text-neutral-400 uppercase">
            DEVELOPER
          </h1>
        </div>

        {/* Subtitle Deskripsi */}
        <p 
          ref={subtitleRef}
          className="max-w-lg text-neutral-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-8 md:mb-10 text-balance px-4"
        >
          Membangun antarmuka web presisi tinggi dengan animasi mikro interaktif, estetika visual bersih, dan performa optimal.
        </p>

        {/* Tombol CTA */}
        <div ref={ctaRef} className="flex flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <a
            href="#project"
            className="h-10 md:h-11 px-6 md:px-8 flex items-center justify-center bg-black hover:bg-neutral-800 text-white font-semibold text-xs md:text-sm rounded-[4px] transition-all duration-300 active:scale-95"
          >
            Lihat Project
          </a>
          <a
            href="#contact"
            className="h-10 md:h-11 px-6 md:px-8 flex items-center justify-center bg-white hover:bg-neutral-100 text-black border border-neutral-300 font-medium text-xs md:text-sm rounded-[4px] transition-all duration-300 active:scale-95"
          >
            Hubungi Saya
          </a>
        </div>

      </div>

      {/* INDIKATOR SCROLL */}
      <div 
        ref={scrollIndicatorRef}
        className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer pb-2 opacity-50 hover:opacity-100 transition-opacity"
        onClick={() => {
          const aboutSection = document.getElementById('about');
          aboutSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Scroll</span>
        <svg 
          className="w-4 h-4 text-black stroke-current" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

    </section>
  );
}