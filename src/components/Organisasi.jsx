import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const organizations = [
  {
    name: 'Pramuka SMK Negeri 1 Bangsri',
    role: 'Ketua Divisi Kegiatan',
    period: '2022 — 2024',
    description:
      'Menyusun agenda kegiatan, mengoordinasikan anggota, dan menjaga komunikasi antar divisi agar setiap program berjalan rapi dan terukur.',
    highlight: '12+ program',
  },
  {
    name: 'Dewan Siswa / OSIS',
    role: 'Koordinator Dokumentasi',
    period: '2021 — 2022',
    description:
      'Mengelola dokumentasi kegiatan sekolah, menyusun visual konten, dan membantu memperkuat branding acara melalui media yang lebih konsisten.',
    highlight: '8 acara',
  },
  {
    name: 'Komunitas Kreatif',
    role: 'Creative Team Member',
    period: '2023 — Sekarang',
    description:
      'Berkolaborasi dalam ide, strategi komunikasi, dan eksekusi proyek bersama dengan pendekatan kerja yang lebih terstruktur dan kolaboratif.',
    highlight: '4 kolaborasi',
  },
];

export default function Organisasi() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const titles = sectionRef.current.querySelectorAll('[data-animate]');
    const cards = cardsRef.current.filter(Boolean);

    gsap.fromTo(
      titles,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
      }
    );

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.15,
      }
    );

    return () => {
      gsap.killTweensOf([titles, cards]);
    };
  }, []);

  return (
    <section
      id="organisasi"
      ref={sectionRef}
      className="relative w-full bg-white px-4 py-20 md:px-8 md:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl" data-animate>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#71717A] dark:text-[#898A8C]">
            Experience
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#06151E] dark:text-white md:text-5xl">
            Organisasi
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr] lg:items-start">
          <div
            className="rounded-[30px] border border-[#D9DBDD] bg-white/70 p-6 shadow-[0_20px_40px_rgba(10,18,25,0.04)] backdrop-blur-sm dark:border-[#24292F] dark:bg-[#121518]/80"
            data-animate
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71717A] dark:text-[#898A8C]">
              Overview
            </p>

            <h3 className="mb-4 text-2xl font-semibold text-[#06151E] dark:text-white">
              Menjalani organisasi dengan cara yang terarah dan menyenangkan.
            </h3>

            <p className="mb-6 text-sm leading-7 text-[#545A5B] dark:text-[#B8BDC2]">
              Saya terbiasa bekerja dalam lingkungan kolaboratif, mengelola komitmen, dan menjaga komunikasi tetap tersusun agar setiap kegiatan bisa berjalan lancar.
            </p>

            <div className="flex flex-wrap gap-2">
              {['Leadership', 'Teamwork', 'Planning', 'Communication'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#DADCE0] bg-[#F5F6F7] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#06151E] dark:border-[#2B3036] dark:bg-[#171B1E] dark:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {organizations.map((org, index) => (
              <article
                key={org.name}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group relative overflow-hidden rounded-[28px] border border-[#D9DBDD] bg-white/70 p-5 shadow-[0_12px_30px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(17,24,39,0.08)] dark:border-[#24292F] dark:bg-[#121518]/80"
              >
                <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#06151E]/30 to-transparent dark:via-white/20" />

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71717A] dark:text-[#898A8C]">
                      {org.period}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#06151E] dark:text-white">
                      {org.name}
                    </h3>
                  </div>

                  <span className="rounded-full border border-[#D9DBDD] bg-[#F5F6F7] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#06151E] dark:border-[#2B3036] dark:bg-[#171B1E] dark:text-white">
                    {org.highlight}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#06151E] dark:bg-white" />
                  <p className="text-sm font-medium text-[#06151E] dark:text-white">{org.role}</p>
                </div>

                <p className="text-sm leading-7 text-[#545A5B] dark:text-[#B8BDC2]">
                  {org.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
