import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const galleryItems = [
  {
    title: 'Brand direction',
    caption: 'Visual identity for a clean digital experience.',
    tone: 'from-[#E7E7E9] via-[#D5D7DB] to-[#C7CDD3]',
  },
  {
    title: 'Creative studio',
    caption: 'Minimal composition with subtle depth and contrast.',
    tone: 'from-[#DDE7E3] via-[#D2E0D9] to-[#B9D0C7]',
  },
  {
    title: 'Event coverage',
    caption: 'Documentation and storytelling through a simple layout.',
    tone: 'from-[#EFE2D7] via-[#E4D5C5] to-[#D9C5B5]',
  },
  {
    title: 'Motion study',
    caption: 'Working with rhythm, spacing, and flow in design.',
    tone: 'from-[#EEE4F5] via-[#E2D9F0] to-[#D3C4E8]',
  },
];

export default function Gallery() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const heading = sectionRef.current.querySelector('[data-animate-title]');
    const cards = cardsRef.current.filter(Boolean);

    gsap.fromTo(
      heading,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }
    );

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.12,
      }
    );

    return () => gsap.killTweensOf([heading, cards]);
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative w-full bg-white px-4 py-20 md:px-8 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div data-animate-title className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#71717A] dark:text-[#898A8C]">
              Visuals
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#06151E] dark:text-white md:text-5xl">
              Gallery
            </h2>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D5D7DB] bg-white/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#06151E] dark:border-[#2C3137] dark:bg-[#121518]/80 dark:text-white">
            Selected moments
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((item, index) => (
            <article
              key={item.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group overflow-hidden rounded-[26px] border border-[#D9DBDD] bg-white/70 shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(15,23,42,0.08)] dark:border-[#24292F] dark:bg-[#121518]/80"
            >
              <div className={`h-72 bg-gradient-to-br ${item.tone} p-4`}>
                <div className="flex h-full w-full flex-col justify-between rounded-[22px] border border-white/40 bg-white/10 p-3 backdrop-blur-[2px]">
                  <div className="flex justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/20 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#06151E] dark:text-white">
                      0{index + 1}
                    </span>
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#06151E]/70 dark:bg-white/80" />
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div className="space-y-2">
                      <div className="h-2.5 w-16 rounded-full bg-[#06151E]/60 dark:bg-white/80" />
                      <div className="h-2.5 w-12 rounded-full bg-[#06151E]/35 dark:bg-white/60" />
                    </div>
                    <div className="flex gap-1.5">
                      <span className="h-8 w-2 rounded-full bg-[#06151E]/75 dark:bg-white/80" />
                      <span className="h-12 w-2 rounded-full bg-[#06151E]/70 dark:bg-white/80" />
                      <span className="h-6 w-2 rounded-full bg-[#06151E]/55 dark:bg-white/60" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-[#06151E] dark:text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-[#545A5B] dark:text-[#B7BBC0]">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
