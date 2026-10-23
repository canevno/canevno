import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heroImageReady, setHeroImageReady] = useState(true);

  const toggleAudio = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (audioRef.current) {
      if (nextState) {
        audioRef.current.play().catch(() => {
          console.warn("File audio belum ada/tidak ditemukan, menjalankan mode pratinjau animasi.");
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    let ctx;

    const buildAnimation = () => {
      if (ctx) ctx.revert();

      const isDark = document.documentElement.classList.contains('dark');
      const words = textRef.current?.querySelectorAll('.scroll-word');
      if (!words || words.length === 0) return;

      ctx = gsap.context(() => {
        if (isDark) {
          gsap.fromTo(
            words,
            { color: '#898A8C' },
            {
              color: '#ffffff',
              stagger: 0.1,
              ease: 'power1.inOut',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=60%',
                scrub: 0.8,
              },
            }
          );
        } else {
          gsap.fromTo(
            words,
            { color: '#898A8C' },
            {
              keyframes: [
                { color: '#545A5B', duration: 0.5 },
                { color: '#06151E', duration: 0.5 }
              ],
              stagger: 0.1,
              ease: 'power1.inOut',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=60%',
                scrub: 0.8,
              },
            }
          );
        }
      }, containerRef);
    };

    buildAnimation();

    // Observer terbatas khusus class 'dark' agar tidak memicu infinite loop saat scroll/refresh
    let lastDark = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const currentDark = document.documentElement.classList.contains('dark');
          if (currentDark !== lastDark) {
            lastDark = currentDark;
            buildAnimation();
          }
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-6 sm:px-10 md:px-12 pb-8 md:pb-10 bg-[#EBECEE] dark:bg-black overflow-hidden"
    >
      {/* KEYFRAMES EQUALIZER ANIMATION */}
      <style>{`
        @keyframes soundWave1 {
          0%, 100% { height: 3px; }
          50% { height: 11px; }
        }
        @keyframes soundWave2 {
          0%, 100% { height: 9px; }
          50% { height: 4px; }
        }
        @keyframes soundWave3 {
          0%, 100% { height: 14px; }
          50% { height: 6px; }
        }
        @keyframes soundWave4 {
          0%, 100% { height: 6px; }
          50% { height: 12px; }
        }
        @keyframes soundWave5 {
          0%, 100% { height: 11px; }
          50% { height: 3px; }
        }
        .sw-bar-1 { animation: soundWave1 0.75s ease-in-out infinite; }
        .sw-bar-2 { animation: soundWave2 0.62s ease-in-out infinite; }
        .sw-bar-3 { animation: soundWave3 0.88s ease-in-out infinite; }
        .sw-bar-4 { animation: soundWave4 0.70s ease-in-out infinite; }
        .sw-bar-5 { animation: soundWave5 0.82s ease-in-out infinite; }
      `}</style>

      {/* AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        src="/audio/tarot-feast.mp3"
        loop
        preload="none"
      />

      <span className="absolute bottom-8 left-6 sm:left-10 md:left-12 z-20 text-[13px] sm:text-xs font-bold text-[#06151E] dark:text-white">
        evandaprilliano@gmail.com
      </span>

      {/* GAMBAR HERO DENGAN MASKING TRANSPARAN (TANPA SHADOW OVERLAY) */}
      <div className="absolute left-1/2 top-[62%] z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <div className="relative h-[520px] w-[340px] overflow-hidden sm:h-[620px] sm:w-[420px] md:h-[700px] md:w-[480px]">
          <img
            src="/image/imagehero.webp"
            alt="Hero visual"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setHeroImageReady(true)}
            onError={() => setHeroImageReady(true)}
            className={`relative block h-full w-full object-contain object-center transition-opacity duration-300 ${heroImageReady ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* SOUNDTRACK WIDGET */}
      <div className="absolute bottom-8 right-6 sm:right-10 md:right-12 z-20">
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 cursor-pointer select-none group text-left focus:outline-none"
          aria-label="Toggle Soundtrack"
        >
          {/* 5 BATANG EQUALIZER */}
          <div className="flex items-end h-4 w-auto gap-0.5 shrink-0">
            <span
              className={`w-[2.5px] bg-[#06151E] dark:bg-white rounded-full transition-all duration-300 ${
                isPlaying ? 'sw-bar-1' : 'h-[3px]'
              }`}
            />
            <span
              className={`w-[2.5px] bg-[#06151E] dark:bg-white rounded-full transition-all duration-300 ${
                isPlaying ? 'sw-bar-2' : 'h-[8px]'
              }`}
            />
            <span
              className={`w-[2.5px] bg-[#06151E] dark:bg-white rounded-full transition-all duration-300 ${
                isPlaying ? 'sw-bar-3' : 'h-[14px]'
              }`}
            />
            <span
              className={`w-[2.5px] bg-[#06151E] dark:bg-white rounded-full transition-all duration-300 ${
                isPlaying ? 'sw-bar-4' : 'h-[7px]'
              }`}
            />
            <span
              className={`w-[2.5px] bg-[#06151E] dark:bg-white rounded-full transition-all duration-300 ${
                isPlaying ? 'sw-bar-5' : 'h-[11px]'
              }`}
            />
          </div>

          {/* TEKS INFORMASI TRACK */}
          <div className="flex flex-col justify-center">
            <span className={`text-[8px] sm:text-[9px] text-[#71717A] font-medium leading-none tracking-tight mb-0.5 ${isPlaying ? 'animate-pulse' : ''}`}>
              Now playing
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#06151E] dark:text-white leading-none tracking-tight group-hover:underline">
              .Feast - Tarot
            </span>
          </div>
        </button>
      </div>

      {/* GSAP TEXT CONTENT */}
      <div ref={textRef} className="text-left flex flex-col gap-1 max-w-xl lg:max-w-2xl relative z-10" />

      <div
        aria-hidden="true"
        className="hero-to-about-mask pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 sm:h-24"
      />
    </section>
  );
}