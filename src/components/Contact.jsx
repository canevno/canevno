import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const contactLinks = [
  { label: 'Email', value: 'evandaprilliano@gmail.com', href: 'mailto:evandaprilliano@gmail.com' },
  { label: 'Instagram', value: '@evandaprilliano', href: 'https://instagram.com' },
  { label: 'WhatsApp', value: '+62 812-3456-7890', href: 'https://wa.me/6281234567890' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;

    const title = sectionRef.current.querySelector('[data-contact-title]');
    const panel = cardRef.current;

    gsap.fromTo(
      title,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );

    gsap.fromTo(
      panel,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.85, delay: 0.1, ease: 'power2.out' }
    );

    return () => gsap.killTweensOf([title, panel]);
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative w-full px-4 py-20 md:px-8 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div data-contact-title className="mb-10 max-w-2xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#71717A] dark:text-[#898A8C]">
            Contact
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#06151E] dark:text-white md:text-5xl">
            Let&apos;s build something meaningful.
          </h2>
        </div>

        <div
          ref={cardRef}
          className="rounded-[30px] border border-[#D9DBDD] bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm dark:border-[#24292F] dark:bg-[#121518]/80 md:p-7"
        >
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm leading-7 text-[#545A5B] dark:text-[#B7BBC0]">
                Saya terbuka untuk kolaborasi, proyek branding, desain web, maupun kebutuhan visual yang membutuhkan pendekatan clean, jelas, dan berkarakter.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:evandaprilliano@gmail.com"
                  className="inline-flex items-center justify-center rounded-full bg-[#1A1D1F] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-[#121212]"
                >
                  Email me
                </a>
                <a
                  href="#project"
                  className="inline-flex items-center justify-center rounded-full border border-[#D7D9DB] bg-[#F4F5F6] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#06151E] transition-transform duration-300 hover:-translate-y-0.5 dark:border-[#2C3137] dark:bg-[#171B1E] dark:text-white"
                >
                  View project
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {contactLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center justify-between rounded-[18px] border border-[#D9DBDD] bg-[#F5F6F7] px-4 py-3 transition-colors duration-300 hover:bg-[#EEF0F2] dark:border-[#2A2F35] dark:bg-[#171B1E] dark:hover:bg-[#1F2327]"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71717A] dark:text-[#90969D]">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-[#06151E] dark:text-white">{item.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
