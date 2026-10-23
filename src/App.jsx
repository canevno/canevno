import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#121212] text-white overflow-x-hidden">
      {/* Floating Navbar & Back to Top */}
      <Navbar />

      {/* 1. HALAMAN UTAMA / HERO SECTION */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 text-center"
      >
      </section>

      {/* 2. ABOUT SECTION */}
      <section 
        id="about" 
        className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 scroll-mt-16 border-t border-neutral-800/60"
      >
      </section>

      {/* 3. PROJECT SECTION */}
      <section 
        id="project" 
        className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 scroll-mt-16 border-t border-neutral-800/60"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Project</h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Daftar karya dan proyek terbaik yang pernah Anda kerjakan.
          </p>
        </div>
      </section>

      {/* 4. ORGANISASI SECTION */}
      <section 
        id="organisasi" 
        className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 scroll-mt-16 border-t border-neutral-800/60"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Organisasi</h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Pengalaman berorganisasi, peran, dan kontribusi Anda.
          </p>
        </div>
      </section>

      {/* 5. GALLERY SECTION */}
      <section 
        id="gallery" 
        className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 scroll-mt-16 border-t border-neutral-800/60"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Kumpulan dokumentasi, foto kegiatan, atau desain visual.
          </p>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section 
        id="contact" 
        className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 scroll-mt-16 border-t border-neutral-800/60"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Contact Me</h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Formulir atau informasi kontak untuk terhubung langsung dengan Anda.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-xs text-neutral-500 border-t border-neutral-800/80">
        © {new Date().getFullYear()} All Rights Reserved.
      </footer>
    </div>
  );
}