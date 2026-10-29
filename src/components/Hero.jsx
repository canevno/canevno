import { useEffect, useRef } from 'react';

const topLeft = 'Portofolio';
const topRight = 'Evand';
const bigWord = 'APRILLIANO';

/*
  CARA KERJA UKURAN
  - --u   : skala fluid. 1px di lebar sekitar 620px, membesar di desktop (maksimal 2.2x).
  - --vh  : tinggi layar yang DIBEKUKAN. Nilai awalnya svh (atau vh di browser lama), lalu komponen
            mengisinya dengan window.innerHeight saat dimuat dan hanya memperbaruinya bila lebar
            berubah (rotasi/resize jendela) atau tinggi berubah besar. Perubahan tinggi kecil
            (bar alamat/toolbar browser muncul-hilang, termasuk di emulator perangkat) diabaikan,
            sehingga judul dan foto tidak membesar-mengecil saat scroll.
  - --cw  : lebar hero (cqw). Browser lama yang belum mengenal cqw memakai lebar layar.
  - Judul : lebarnya = lebar hero dikurangi padding, dibatasi 140 x tinggi layar, supaya
            di layar lebar yang pendek judul tidak terlalu besar sampai mendorong foto keluar.
  - Foto  : kotak, selalu di tengah. Ukurannya mengikuti lebar hero, dibatasi 1,4x s/d 3,2x
            tinggi area merah. Batas bawah menyisakan cadangan agar bagian bawah foto tidak
            terbuka saat bar alamat HP hilang; batas atas mencegah wajah terlalu besar
            di layar sangat lebar dan pendek. Ujung rambut selalu masuk sedikit ke judul.
*/
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@400;500;600;700&display=swap');

.hr-root {
  --u: clamp(1px, 0.115vw, 2.2px);
  --px: clamp(20px, 6vw, 260px);
  --vh: 1vh;
  --cw: 100vw;
  /* rasio tinggi/lebar viewBox judul (205 / 1160) */
  --title-ratio: 0.1767;
  /* jarak bawah judul ke area merah */
  --pb: max(12px, calc(var(--u) * 24));

  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(var(--vh) * 100); /* ikut --vh yang dibekukan, bukan tinggi pembungkus */
  overflow: visible; /* foto boleh naik ke area judul */
  background: #F4F0E8;
  color: #090909;
  font-family: 'Outfit', system-ui, sans-serif;
}
@supports (height: 1svh) { .hr-root { --vh: 1svh; } }
@supports (width: 1cqw) { .hr-root { --cw: 100cqw; } }
/* foto yang lebih lebar dari layar tidak boleh memunculkan scroll horizontal */
@supports (overflow: clip) { .hr-root { overflow-x: clip; } }

/* Baris atas dan judul memakai lebar maksimum yang sama, jadi tepi kiri/kanannya selalu sejajar */
.hr-top,
.hr-title {
  box-sizing: border-box;
  width: 100%;
  max-width: calc(var(--vh) * 140 + 2 * var(--px));
  margin-inline: auto;
}

/* Baris paling atas */
.hr-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: max(14px, calc(var(--u) * 12)) var(--px) 0;
  font-size: max(15px, calc(var(--u) * 16));
  font-weight: 700;
  line-height: 1;
}

/* Tulisan besar */
.hr-title {
  margin-block: 0;
  padding: max(8px, calc(var(--u) * 10)) var(--px) var(--pb);
}
.hr-title svg { display: block; width: 100%; height: auto; overflow: visible; user-select: none; }

/* Area merah + foto */
.hr-media {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  background: #FF0808;
  color: #fff;
  /* lebar judul (sama dengan lebar svg judul) */
  --tw: min(calc(var(--cw) - 2 * var(--px)), calc(var(--vh) * 140));
  /* tinggi baris atas + tinggi judul, lalu tinggi area merah untuk layar setinggi 100svh */
  --top-h: calc(max(14px, calc(var(--u) * 12)) + max(15px, calc(var(--u) * 16)));
  --title-h: calc(max(8px, calc(var(--u) * 10)) + var(--tw) * var(--title-ratio) + var(--pb));
  --hm: max(120px, calc(var(--vh) * 100 - var(--top-h) - var(--title-h)));
  /* seberapa jauh ujung rambut masuk ke judul: jarak bawah judul + 3% lebar judul,
     sehingga huruf tetap terbaca */
  --ov: calc(var(--pb) + var(--tw) * 0.03);
  /* buka batas atas (foto boleh keluar ke area judul), tepi lain tetap dipotong */
  clip-path: inset(-300vh 0 0 0);
}

/* Kepala mulai di 8,45% dari atas gambar. Posisi atas dihitung supaya ujung rambut masuk --ov ke judul. */
.hr-img {
  --s: clamp(calc(var(--hm) * 1.4), var(--cw), calc(var(--hm) * 3.2));
  position: absolute;
  left: 50%;
  top: calc(var(--s) * -0.0845 - var(--ov));
  transform: translateX(-50%);
  width: var(--s);
  max-width: none;
  height: var(--s);
  pointer-events: none;
  user-select: none;
}

.hr-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(60, 0, 0, 0.35), rgba(60, 0, 0, 0) 45%);
}
`;

export default function Hero() {
  const rootRef = useRef(null);

  // Bekukan tinggi layar: abaikan perubahan tinggi kecil akibat toolbar browser.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const apply = () => root.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    apply();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w !== lastW || Math.abs(h - lastH) > Math.max(160, lastH * 0.2)) {
        lastW = w;
        lastH = h;
        apply();
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section id="home" ref={rootRef} className="hr-root">
      <style>{styles}</style>

      <div className="hr-top">
        <span>{topLeft}</span>
        <span>{topRight}</span>
      </div>

      <h1 className="hr-title" data-animate="hero-text">
        <svg viewBox="0 0 1160 205" role="img" aria-label={bigWord}>
          <defs>
            {/* gradasi horizontal: huruf bergantian merah tua dan oranye-merah */}
            <linearGradient id="hr-h" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1160" y2="0">
              <stop offset="0" stopColor="#4A0908" />
              <stop offset="0.07" stopColor="#850D08" />
              <stop offset="0.12" stopColor="#FF3215" />
              <stop offset="0.22" stopColor="#FF590A" />
              <stop offset="0.26" stopColor="#7A1008" />
              <stop offset="0.31" stopColor="#FF3215" />
              <stop offset="0.34" stopColor="#FF590A" />
              <stop offset="0.39" stopColor="#FF590A" />
              <stop offset="0.42" stopColor="#4A0908" />
              <stop offset="0.49" stopColor="#850D08" />
              <stop offset="0.53" stopColor="#FF3215" />
              <stop offset="0.58" stopColor="#FF590A" />
              <stop offset="0.63" stopColor="#FF590A" />
              <stop offset="0.67" stopColor="#FF3215" />
              <stop offset="0.74" stopColor="#FF590A" />
              <stop offset="0.76" stopColor="#7A1008" />
              <stop offset="0.84" stopColor="#4A0908" />
              <stop offset="0.88" stopColor="#850D08" />
              <stop offset="0.95" stopColor="#4A0908" />
              <stop offset="1" stopColor="#850D08" />
            </linearGradient>
            {/* gradasi vertikal tipis di atasnya */}
            <linearGradient id="hr-v" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="205">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#2A0504" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="203"
            fontSize="245"
            textLength="1160"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#hr-h)"
            fontFamily="'Anton', 'Bebas Neue', Impact, 'Arial Narrow', sans-serif"
          >
            {bigWord}
          </text>
          <text
            aria-hidden="true"
            x="0"
            y="203"
            fontSize="245"
            textLength="1160"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#hr-v)"
            fontFamily="'Anton', 'Bebas Neue', Impact, 'Arial Narrow', sans-serif"
          >
            {bigWord}
          </text>
        </svg>
      </h1>

      <div className="hr-media" data-animate="hero-visual">
        <img
          className="hr-img"
          src="/image/imagehero.webp"
          alt="Portrait"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hr-shade" aria-hidden="true" />
      </div>
    </section>
  );
}