import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const lines = [
    "I'm Evand Aprilliano",
    "Active student in software engineering",
    "Have high anticipation In the field",
    "Front-end Development"
  ];

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

      ScrollTrigger.refresh();
    };

    buildAnimation();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          buildAnimation();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-6 sm:px-10 md:px-12 pb-8 md:pb-10 bg-[#EBECEE] dark:bg-black transition-colors duration-400 overflow-hidden"
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

      {/* SOUNDTRACK WIDGET */}
      <div className="absolute bottom-8 right-6 sm:right-10 md:right-12 z-20">
        <button 
          onClick={toggleAudio}
          className="flex items-center gap-2 cursor-pointer select-none group text-left focus:outline-none"
          aria-label="Toggle Soundtrack"
        >
          {/* 5 BATANG EQUALIZER */}
          <div className="flex items-end h-4 w-auto gap-[2px] shrink-0">
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
      <div ref={textRef} className="text-left flex flex-col gap-0.5 max-w-lg lg:max-w-xl relative z-10">
        {lines.map((line, lineIndex) => (
          <h1 
            key={lineIndex} 
            className="text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-tight tracking-tight flex flex-wrap gap-x-[0.25em]"
          >
            {line.split(" ").map((word, wordIndex) => (
              <span 
                key={wordIndex} 
                className="scroll-word inline-block will-change-[color]"
              >
                {word}
              </span>
            ))}
          </h1>
        ))}
      </div>
    </section>
  );
}