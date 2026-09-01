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

    // 1. ANIMASI SCROLL TEKS GSAP
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

    // 2. ANIMASI KURSOR: 3D ACCORDION / FOLDING GLASS (GRID DIAM & TERLIPAT)
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (!container) return;

      const slats = container.querySelectorAll('.slat-item');
      const mouseX = e.clientX;
      const radius = 220; // Jangkauan kursor untuk efek lipatan

      slats.forEach((slat, index) => {
        const rect = slat.getBoundingClientRect();
        const slatCenter = rect.left + rect.width / 2;
        const dist = Math.abs(mouseX - slatCenter);

        if (dist < radius) {
          const intensity = Math.pow(1 - dist / radius, 2);
          
          // Arah lipatan bergantian selang-seling (accordion fold effect)
          const foldDirection = index % 2 === 0 ? 1 : -1;
          const foldAngle = foldDirection * intensity * 40; // Sudut terlipat hingga 40 derajat

          gsap.to(slat, {
            x: 0, // Posisi grid tetap diam
            y: 0,
            rotateY: foldAngle, // Kaca terlipat miring pada sumbu 3D
            transformPerspective: 700,
            transformOrigin: 'center center',
            filter: `brightness(${1 + intensity * 0.7})`,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          // Kembalikan ke posisi semula (rata)
          gsap.to(slat, {
            x: 0,
            y: 0,
            rotateY: 0,
            filter: 'brightness(1)',
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const handleMouseLeave = () => {
      const slats = containerRef.current?.querySelectorAll('.slat-item');
      if (!slats) return;

      gsap.to(slats, {
        x: 0,
        y: 0,
        rotateY: 0,
        filter: 'brightness(1)',
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
      containerEl.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      observer.disconnect();
      if (ctx) ctx.revert();
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
        containerEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-6 sm:px-10 md:px-12 pb-8 md:pb-10 bg-[#EBECEE] dark:bg-black transition-colors duration-400 overflow-hidden"
    >
      {/* PRISMATIC REFRACTED GLASS BACKGROUND WITH FOLDING GRID */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="flex w-full h-full">
          {Array.from({ length: slatCount }).map((_, index) => {
            const normalizedIndex = (index / (slatCount - 1)) * 2 - 1;
            const waveOffset = Math.cos(normalizedIndex * Math.PI * 0.85) * 22;

            return (
              <div
                key={index}
                className="slat-item flex-1 h-full relative border-r border-[#898A8C]/25 dark:border-white/10 will-change-transform"
                style={{
                  background: `linear-gradient(
                    180deg,
                    transparent 0%,
                    transparent ${25 + waveOffset}%,
                    rgba(84, 90, 91, 0.35) ${42 + waveOffset}%,
                    rgba(137, 138, 140, 0.65) ${50 + waveOffset}%,
                    rgba(84, 90, 91, 0.35) ${58 + waveOffset}%,
                    transparent ${75 + waveOffset}%,
                    transparent 100%
                  )`
                }}
              >
                {/* Highlight Kiri Kaca */}
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#898A8C]/35 dark:via-white/30 to-transparent" />
                
                {/* Bayangan Kanan Kaca */}
                <div className="absolute inset-y-0 right-0 w-[2px] bg-black/15 dark:bg-black/90" />
              </div>
            );
          })}
        </div>

        {/* Gradasi Bawah */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-[#EBECEE]/80 dark:via-black/70 to-[#EBECEE] dark:to-black transition-colors duration-400" />
      </div>

      {/* GSAP TEXT CONTENT */}
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