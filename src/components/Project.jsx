const projects = [
  {
    name: 'Zorie Store',
    category: 'E-commerce',
    year: '2024',
    description: 'Landing page toko online dengan fokus pada katalog produk, brand identity, dan konversi pembelian.',
    tags: ['React', 'Tailwind', 'UI/UX'],
    accent: 'from-[#E6E7E8] via-[#D9DADC] to-[#C4C7C9]',
  },
  {
    name: 'Pramuka SMK',
    category: 'Organization Website',
    year: '2023',
    description: 'Website profil organisasi dengan struktur konten yang rapi untuk kegiatan, agenda, dan pengurus.',
    tags: ['Astro', 'Design System', 'Content'],
    accent: 'from-[#DDE9E3] via-[#D4E3DC] to-[#B9D3C8]',
  },
  {
    name: 'Portfolio Studio',
    category: 'Personal Brand',
    year: '2025',
    description: 'Portofolio personal yang menonjolkan karya dengan tampilan minimal, modern, dan mudah dibaca.',
    tags: ['Portfolio', 'Motion', 'Brand'],
    accent: 'from-[#E5E2E9] via-[#D9D5E1] to-[#C7C3D4]',
  },
];

export default function Project() {
  return (
    <section
      id="project"
      className="relative w-full bg-white px-4 py-20 md:px-8 md:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#71717A] dark:text-[#898A8C]">
              Selected work
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#06151E] dark:text-white md:text-5xl">
              Project
            </h2>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center text-sm font-medium text-[#06151E] transition-opacity hover:opacity-70 dark:text-white"
          >
            Let&apos;s work together →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="group rounded-[28px] border border-[#D8D9DA] bg-white/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 dark:border-[#1F2328] dark:bg-[#111315]/70"
            >
              <div className="mb-5 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-[#545A5B] dark:text-[#B0B4B8]">
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>

              <div
                className={`mb-5 flex h-52 items-end rounded-[22px] bg-gradient-to-br ${project.accent} p-4`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="h-16 w-20 rounded-[18px] border border-white/50 bg-white/20 backdrop-blur-sm" />
                  <div className="flex gap-1.5">
                    <span className="h-8 w-2 rounded-full bg-white/70" />
                    <span className="h-12 w-2 rounded-full bg-white/80" />
                    <span className="h-5 w-2 rounded-full bg-white/60" />
                  </div>
                </div>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-[#06151E] dark:text-white">
                {project.name}
              </h3>
              <p className="mb-5 text-sm leading-6 text-[#545A5B] dark:text-[#B0B4B8]">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#DADCE0] bg-[#F4F5F6] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#06151E] dark:border-[#2A2E33] dark:bg-[#181B1F] dark:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
