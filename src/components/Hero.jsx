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

      // ScrollRevealText ala Framer (Word-by-word)
      gsap.fromTo(
        words,
        { 
          color: '#a3a3a3', // Warna awal: abu-abu netral padat
        },
        {
          color: '#141414', // Warna akhir: hitam pekat
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

    return () => ctx.revert(); // Menghapus instance animasi GSAP secara sempurna
  }, []);

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-4 sm:px-8 md:px-12 pb-12 md:pb-16 bg-[#f5f5f3]"
    >
      <div ref={textRef} className="text-left flex flex-col gap-0.5 sm:gap-1 max-w-xl">
        {lines.map((line, lineIndex) => (
          <h1 
            key={lineIndex} 
            className="text-xs sm:text-sm md:text-base font-bold leading-snug tracking-tight flex flex-wrap gap-x-[0.3em]"
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