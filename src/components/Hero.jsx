import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.1,
      })
      .from(titleRef.current.children, {
        opacity: 0,
        y: 45,
        rotateX: -15,
        duration: 1,
        stagger: 0.12,
      }, '-=0.5')
      .from(subtitleRef.current, {
        opacity: 0,
        y: 25,
        duration: 0.8,
      }, '-=0.6')
      .from(ctaRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
      }, '-=0.5');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 pt-24 pb-16 overflow-hidden bg-[#0d0d0d]"
    >
      {/* Dynamic Ambient Blur Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-neutral-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Availability Indicator */}
        <div 
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-[#1b1b1b]/80 border border-neutral-800/80 backdrop-blur-md shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] md:text-xs font-medium tracking-wide text-neutral-300 uppercase">
            Available for new projects
          </span>
        </div>

        {/* Main Kinetic Headline */}
        <div ref={titleRef} className="perspective-1000 mb-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.02] text-white">
            CREATING DIGITAL
          </h1>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.02] text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-700">
            EXPERIENCES
          </h1>
        </div>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="max-w-xl text-neutral-400 text-sm md:text-base font-normal leading-relaxed mb-10 text-balance"
        >
          Frontend Developer & Visual Designer berpikiran Awwwards-style. Berfokus pada interaksi mikro presisi, animasi dinamis, dan performa tinggi.
        </p>

        {/* Action Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href="#project"
            className="w-full sm:w-auto h-10 md:h-11 px-7 flex items-center justify-center bg-[#ececec] hover:bg-white text-[#121212] font-semibold text-xs md:text-sm rounded-[5px] transition-all duration-300 active:scale-95 shadow-md"
          >
            Lihat Project
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto h-10 md:h-11 px-7 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#252525] text-white border border-neutral-800 font-medium text-xs md:text-sm rounded-[5px] transition-all duration-300 active:scale-95 backdrop-blur-md"
          >
            Hubungi Saya
          </a>
        </div>

      </div>
    </section>
  );
}