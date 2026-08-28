import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const lines = [
    "Saya Evand Aprilliano",
    "Pelajar Aktif Di Sekolah Kejuruan",
    "Memiliki Minat Tinggi di Bidang",
    "Front-end Development"
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current.querySelectorAll('.scroll-word');

      // AnimasiOpacity (JS tidak lagi mengunci warna teks/background)
      gsap.fromTo(
        words,
        { 
          opacity: 0.25,
        },
        {
          opacity: 1,
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-6 sm:px-10 md:px-12 pb-8 md:pb-10 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-400"
    >
      <div ref={textRef} className="text-left flex flex-col gap-0.5 max-w-xl lg:max-w-2xl">
        {lines.map((line, lineIndex) => (
          <h1 
            key={lineIndex} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight flex flex-wrap gap-x-[0.25em]"
          >
            {line.split(" ").map((word, wordIndex) => (
              <span 
                key={wordIndex} 
                className="scroll-word inline-block will-change-[opacity]"
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