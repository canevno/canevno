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
    let ctx;

    const buildAnimation = () => {
      // Hapus inline style warna GSAP yang lama agar tidak mengunci warna tema baru
      if (ctx) ctx.revert();

      const isDark = document.documentElement.classList.contains('dark');
      const words = textRef.current.querySelectorAll('.scroll-word');

      ctx = gsap.context(() => {
        if (isDark) {
          // DARK MODE (2 SEGMEN): Abu-abu (#525252) -> Putih (#ffffff)
          gsap.fromTo(
            words,
            { color: '#525252' },
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
          // LIGHT MODE (3 SEGMEN): Putih Samar (#e5e5e5) -> Abu-abu (#737373) -> Hitam (#0a0a0a)
          gsap.fromTo(
            words,
            { color: '#e5e5e5' },
            {
              keyframes: [
                { color: '#737373', duration: 0.5 },
                { color: '#0a0a0a', duration: 0.5 }
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

    // Jalankan inisialisasi animasi pertama kali
    buildAnimation();

    // Deteksi perubahan kelas 'dark' pada tag <html> secara realtime
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
      className="relative w-full h-[100dvh] flex flex-col justify-end items-start px-6 sm:px-10 md:px-12 pb-8 md:pb-10 bg-white dark:bg-[#0a0a0a] transition-colors duration-400"
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