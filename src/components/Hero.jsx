import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const lines = [
    "I'm Evand Aprilliano",
    "Active student in software engineering",
    "Have high anticipation In the field",
    "Front-end Development"
  ];

  const slatCount = 30;

  useEffect(() => {
    let ctx;

    const buildAnimation = () => {
      if (ctx) ctx.revert();

      const isDark = document.documentElement.classList.contains('dark');
      const words = textRef.current.querySelectorAll('.scroll-word');

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
            { color: '#a3a3a3' },
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

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          buildAnimation();
          ScrollTrigger.refresh();
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
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-6 sm:px-10 md:px-12 pb-8 md:pb-10 bg-white dark:bg-[#06151E] transition-colors duration-400 overflow-hidden"
    >
      {/* BACKGROUND REFRACTED GLASS (z-0 agar berada di atas bg section) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="flex w-full h-full">
          {Array.from({ length: slatCount }).map((_, index) => {
            const normalizedIndex = (index / (slatCount - 1)) * 2 - 1;
            const waveOffset = Math.cos(normalizedIndex * Math.PI * 0.85) * 22;

            return (
              <div
                key={index}
                className="flex-1 h-full relative border-r border-[#898A8C]/20 dark:border-[#898A8C]/15"
                style={{
                  background: `linear-gradient(
                    180deg,
                    transparent 0%,
                    transparent ${25 + waveOffset}%,
                    rgba(84, 90, 91, 0.45) ${42 + waveOffset}%,
                    rgba(137, 138, 140, 0.85) ${50 + waveOffset}%,
                    rgba(84, 90, 91, 0.45) ${58 + waveOffset}%,
                    transparent ${75 + waveOffset}%,
                    transparent 100%
                  )`
                }}
              >
                {/* Highlight Kiri */}
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#898A8C]/50 to-transparent" />
                
                {/* Bayangan Kanan */}
                <div className="absolute inset-y-0 right-0 w-[2px] bg-black/20 dark:bg-black/70" />
              </div>
            );
          })}
        </div>

        {/* Shadow Overlay Bawah */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-[#06151E] transition-colors duration-400" />
      </div>

      {/* GSAP TEXT CONTENT (z-10 di atas background) */}
      <div ref={textRef} className="text-left flex flex-col gap-0.5 max-w-xl lg:max-w-2xl relative z-10">
        {lines.map((line, lineIndex) => (
          <h1 
            key={lineIndex} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight flex flex-wrap gap-x-[0.25em]"
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