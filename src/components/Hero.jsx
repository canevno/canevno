const topLeft = 'Portofolio';
const topRight = 'Evand';
const bigWord = 'APRILLIANO';

const description =
  'Brand strategy, visual identity, digital campaigns, and media planning — crafted to grow your market share';

const buttons = [
  { label: 'Start your project', href: '#contact', variant: 'solid' },
  { label: 'Start your project', href: '#project', variant: 'outline' },
];

// Tiap array = satu baris label di sisi kanan
const labelRows = [
  ['Clarity in positioning'],
  ['Performance-Driven Marketing'],
  ['Media Planning', 'Growth Systems'],
];

function ArrowUpRight() {
  return (
    <svg
      className="hr-arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/*
  Skala fluid: --u = 1px di lebar sekitar 620px (ukuran referensi),
  lalu membesar proporsional di desktop (maksimal 2.2x).
  Setiap ukuran kecil punya batas minimum supaya tetap terbaca di HP.
*/
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@400;500;600;700&display=swap');

.hr-root {
  --u: clamp(1px, 0.115vw, 2.2px);
  --px: clamp(20px, 4.8vw, 160px);
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
  background: #F4F0E8;
  color: #090909;
  font-family: 'Outfit', system-ui, sans-serif;
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
  margin: 0;
  padding: max(10px, calc(var(--u) * 12)) var(--px) max(18px, calc(var(--u) * 40));
}
.hr-title svg { display: block; width: 100%; height: auto; overflow: visible; user-select: none; }

/* Area gambar */
.hr-media {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: max(400px, calc(var(--u) * 260));
  padding: max(18px, calc(var(--u) * 26)) var(--px) max(22px, calc(var(--u) * 28));
  background: #FF0808;
  color: #fff;
  /* buka batas atas (gambar boleh keluar ke area judul), batas bawah tetap dipotong */
  clip-path: inset(-300vh 0 0 0);
}
.hr-img {
  position: absolute;
  left: 0;
  top: 30%;
  transform: translateY(-30%);
  width: 100%;
  max-width: none;
  height: auto;
  min-height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  pointer-events: none;
  user-select: none;
}
.hr-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(60, 0, 0, 0.35), rgba(60, 0, 0, 0) 45%);
}
.hr-bottom { position: relative; z-index: 2; }

/* Bawah: deskripsi, tombol, label */
.hr-bottom {
  margin-top: auto;
  padding-top: 28px;
  display: flex;
  flex-direction: column-reverse;
  gap: 18px;
}
@media (min-width: 768px) {
  .hr-bottom { flex-direction: row; justify-content: space-between; align-items: flex-end; }
}
.hr-desc {
  margin: 0;
  max-width: max(260px, calc(var(--u) * 230));
  font-size: max(13px, calc(var(--u) * 9.5));
  line-height: 1.25;
}
.hr-btns { display: flex; flex-wrap: wrap; gap: max(6px, calc(var(--u) * 5)); margin-top: max(12px, calc(var(--u) * 10)); }
.hr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: max(8px, calc(var(--u) * 6));
  height: max(38px, calc(var(--u) * 27));
  min-width: calc(var(--u) * 104);
  padding: 0 max(16px, calc(var(--u) * 14));
  border-radius: 999px;
  font-size: max(13px, calc(var(--u) * 9.5));
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.hr-btn:hover { opacity: 0.88; }
.hr-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.hr-btn-solid { background: #fff; color: #FF3215; border: 1px solid #fff; }
.hr-btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.9); }
.hr-arrow { width: max(13px, calc(var(--u) * 10)); height: max(13px, calc(var(--u) * 10)); }

.hr-labels { align-self: flex-end; display: flex; flex-direction: column; align-items: flex-end; gap: max(5px, calc(var(--u) * 4)); }
.hr-label-row { display: flex; gap: max(5px, calc(var(--u) * 4)); }
.hr-pill {
  display: inline-flex;
  align-items: center;
  height: max(28px, calc(var(--u) * 20));
  padding: 0 max(12px, calc(var(--u) * 10));
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: max(11px, calc(var(--u) * 6.8));
  white-space: nowrap;
}
`;

export default function Hero() {
  return (
    <section id="home" className="hr-root">
      <style>{styles}</style>

      <div className="hr-top">
        <span>{topLeft}</span>
        <span>{topRight}</span>
      </div>

      <h1 className="hr-title">
        <svg viewBox="0 0 1000 205" role="img" aria-label={bigWord}>
          <defs>
            {/* gradasi horizontal: huruf bergantian merah tua dan oranye-merah */}
            <linearGradient id="hr-h" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
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
            fontSize="235"
            textLength="1000"
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
            fontSize="235"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#hr-v)"
            fontFamily="'Anton', 'Bebas Neue', Impact, 'Arial Narrow', sans-serif"
          >
            {bigWord}
          </text>
        </svg>
      </h1>

      <div className="hr-media">
        <img
          className="hr-img"
          src="/image/imagehero.webp"
          alt="Portrait"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hr-shade" aria-hidden="true" />

        <div className="hr-bottom">
          <div>
            <p className="hr-desc">{description}</p>
            <div className="hr-btns">
              {buttons.map((b, i) => (
                <a
                  key={i}
                  href={b.href}
                  className={`hr-btn ${b.variant === 'solid' ? 'hr-btn-solid' : 'hr-btn-outline'}`}
                >
                  {b.label}
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>

          <div className="hr-labels">
            {labelRows.map((row, i) => (
              <div key={i} className="hr-label-row">
                {row.map((text) => (
                  <span key={text} className="hr-pill">
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}