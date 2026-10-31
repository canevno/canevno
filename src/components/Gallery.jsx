import { useEffect, useRef } from 'react';

const title = 'EVAND';
const descriptionLines = [
  'A kid who wants to grow every day,',
  'and seeks good, positive relationships',
  'across Passus, Pramuka, PMR, and OSIS.',
];
const portraitPoster = '/image/imagehero.webp'; // tampil sebelum video siap / cadangan
const portraitVideo = ''; // sementara kosong = pakai gambar. Nanti isi: '/video/herovideo.mp4' (video 3 detik, berulang)
// (opsional) tambahkan versi .webm di /video/herovideo.webm untuk ukuran lebih kecil

// Gambar portfolio yang muncul di jalur kursor (ratio = lebar / tinggi)
const works = [
  { src: '/image/gallery/1.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/2.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/3.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/4.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/5.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/6.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/7.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/8.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/9.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/10.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/11.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/12.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/13.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/14.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/15.jpeg', ratio: 4 / 3 },
  { src: '/image/gallery/16.jpeg', ratio: 4 / 3 },
];

const POOL_SIZE = 16; // elemen yang dipakai ulang (tidak ada elemen baru tanpa batas)
const MAX_ACTIVE = 16; // jumlah gambar aktif sekaligus (6-10)
const FADE_MS = 900; // durasi memudar sampai hilang (0,8-1 detik)
const EVICT_MS = 450; // durasi menghilang untuk gambar tertua saat batas tercapai
const APPEAR_MS = 500; // durasi muncul (0,5 detik), setelah itu gambar langsung memudar
const SIZES = [240, 200, 260, 220]; // lebar (px) bergantian, rapi dan konsisten
const SPAWN_DIST = 90; // jarak gerak kursor minimum antar gambar (px) agar tidak menumpuk
const NEXT_MS = 300; // gambar berikutnya boleh muncul 0,3 detik setelah gambar sebelumnya

// Opacity berdasarkan urutan: 0 = paling baru (depan), makin ke belakang makin transparan
const DEPTH = [0.97, 0.9, 0.75, 0.62, 0.52, 0.44, 0.38, 0.35];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;900&display=swap');

.gal-root {
  --u: clamp(0.62px, calc(100vw / 560), 0.95px);
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #fff;
  color: #000;
  font-family: 'Inter', 'Manrope', system-ui, sans-serif;
  padding: max(28px, calc(var(--u) * 36)) 20px max(36px, calc(var(--u) * 48));
  touch-action: pan-y;
  scroll-margin-top: 80px;
}
@media (min-width: 900px) {
  .gal-root {
    --u: clamp(0.62px, 0.0617vw, 1.5px);
    padding-left: 0;
    padding-right: 0;
  }
}

.gal-col { position: relative; display: flex; flex-direction: column; align-items: center; }
@media (min-width: 900px) { .gal-col { padding-left: 5.6vw; } }

/* Lapisan: foto (2) < jejak gambar kursor (3) < teks (4) */
.gal-title {
  position: relative;
  z-index: 4;
  margin: 0 0 calc(var(--u) * 6);
  font-size: max(64px, calc(var(--u) * 118));
  font-weight: 900;
  line-height: 0.86;
  letter-spacing: -0.045em;
  text-transform: uppercase;
}
.gal-visual {
  position: relative;
  z-index: 2;
  width: calc(var(--u) * 338);
  height: calc(var(--u) * 452);
}
.gal-portrait {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  border-radius: max(8px, calc(var(--u) * 10));
  background: linear-gradient(160deg, #FF4A1C 0%, #C21A0B 100%);
}
.gal-portrait img,
.gal-portrait video { width: 100%; height: 100%; object-fit: cover; object-position: 50% 25%; display: block; }

.gal-desc {
  position: relative;
  z-index: 4;
  margin: calc(var(--u) * 26) 0 0;
  max-width: max(300px, calc(var(--u) * 470));
  text-align: center;
  font-size: max(16px, calc(var(--u) * 21.5));
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
}
.gal-line { display: inline; }
@media (min-width: 900px) { .gal-line { display: block; } }

/* Jejak gambar yang tertinggal di jalur kursor */
.gal-trail-layer { position: absolute; inset: 0; z-index: 3; overflow: hidden; pointer-events: none; }
.gal-trail {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  border-radius: 4px;
  background: #eee;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 14px rgba(0, 0, 0, 0.08);
  will-change: transform, opacity;
}
.gal-trail img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

export default function Gallery() {
  const sectionRef = useRef(null);
  const poolRef = useRef([]);
  const videoRef = useRef(null);

  // video utama: berulang terus selama section terlihat, jeda saat keluar dari layar
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      video.pause(); // hormati reduced motion: tampilkan poster saja
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = poolRef.current.filter(Boolean).map((el) => ({
      el,
      img: el.firstChild,
      state: 'idle', // idle | active | leaving
      w: 0,
      h: 0,
      born: 0,
      timer: 0, // timer pembersih setelah fade-out selesai
      hold: 0, // timer: mulai memudar setelah selesai muncul
    }));

    // muat semua gambar lebih awal agar tidak berkedip saat pertama muncul
    works.forEach((w) => {
      const pre = new Image();
      pre.src = w.src;
    });

    const cur = { x: 0, y: 0, sx: null, sy: null, dx: 1, dy: 0, lastSpawn: 0 };
    let rect = section.getBoundingClientRect();
    let z = 1;
    let pick = 0; // urutan gambar tetap dari atas ke bawah
    let seq = 0;

    const sizeScale = () => Math.min(1.15, Math.max(0.6, window.innerWidth / 1500));

    // jaga gambar tetap di dalam section dan di dalam viewport
    const clampPos = (w, h, x, y) => {
      const vh = window.innerHeight;
      const minX = w / 2;
      const maxX = Math.max(minX, rect.width - w / 2);
      const minY = Math.max(h / 2, -rect.top + h / 2);
      const maxY = Math.max(minY, Math.min(rect.height - h / 2, vh - rect.top - h / 2));
      return [Math.min(Math.max(x, minX), maxX), Math.min(Math.max(y, minY), maxY)];
    };

    // atur opacity berdasarkan urutan: yang terbaru paling jelas, yang lama makin transparan
    const applyDepth = () => {
      const act = items.filter((i) => i.state === 'active').sort((a, b) => b.born - a.born);
      act.forEach((it, i) => {
        it.el.style.opacity = String(DEPTH[Math.min(i, DEPTH.length - 1)]);
      });
    };

    const leave = (it, ms = FADE_MS) => {
      if (it.state !== 'active') return;
      it.state = 'leaving';
      clearTimeout(it.hold);
      it.el.style.transition = `opacity ${ms}ms ease, scale ${ms}ms ease`;
      it.el.style.opacity = '0';
      if (!reduce) it.el.style.scale = '0.96';
      clearTimeout(it.timer);
      it.timer = setTimeout(() => {
        it.state = 'idle';
        it.el.style.visibility = 'hidden';
      }, ms + 60);
    };

    const spawn = () => {
      const active = items.filter((i) => i.state === 'active');
      if (active.length >= MAX_ACTIVE) {
        active.sort((a, b) => a.born - b.born);
        leave(active[0], EVICT_MS); // hapus yang tertua dengan transisi halus
      }
      const it = items.find((i) => i.state === 'idle');
      if (!it) return;

      const work = works[pick++ % works.length];
      const s = sizeScale();
      it.w = SIZES[seq++ % SIZES.length] * s; // pola ukuran tetap, bukan acak
      it.h = it.w / work.ratio;

      // posisi rapi: selalu di kanan-bawah kursor dengan jarak tetap,
      // sehingga jejak membentuk garis diagonal yang konsisten
      const gap = 14 * s;
      const [x, y] = clampPos(it.w, it.h, cur.x + it.w / 2 + gap, cur.y + it.h / 2 + gap);

      it.born = performance.now();
      it.state = 'active';
      clearTimeout(it.timer);

      const el = it.el;
      const slide = 10 * s;
      el.style.transition = 'none';
      el.style.width = `${it.w}px`;
      el.style.height = `${it.h}px`;
      el.style.zIndex = String(++z); // gambar baru selalu di atas yang lama
      el.style.opacity = '0';
      el.style.visibility = 'visible';
      // posisi final tetap (tidak ikut kursor); hanya sedikit meluncur masuk
      el.style.transform = `translate3d(${(x - it.w / 2).toFixed(1)}px, ${(y - it.h / 2).toFixed(1)}px, 0)`;
      el.style.rotate = '0deg'; // lurus, tanpa rotasi
      el.style.scale = reduce ? '1' : '0.92';
      el.style.translate = reduce ? '0 0' : `0px ${slide.toFixed(1)}px`;
      it.img.src = work.src;
      void el.offsetWidth; // paksa reflow agar transisi berjalan dari keadaan awal
      const ease = 'cubic-bezier(.22,1,.36,1)';
      el.style.transition = `opacity ${APPEAR_MS}ms ease, scale ${APPEAR_MS}ms ${ease}, rotate ${APPEAR_MS}ms ${ease}, translate ${APPEAR_MS}ms ${ease}`;
      el.style.scale = '1';
      el.style.translate = '0 0';
      applyDepth();

      // setelah selesai muncul (0,5 detik), gambar ini memudar sendiri lalu hilang
      clearTimeout(it.hold);
      it.hold = setTimeout(() => {
        leave(it, FADE_MS);
        applyDepth();
      }, APPEAR_MS);
    };

    const onMove = (e) => {
      rect = section.getBoundingClientRect();
      cur.x = e.clientX - rect.left;
      cur.y = e.clientY - rect.top;

      const now = performance.now();
      // bergantian: gambar berikutnya boleh muncul 0,3 detik setelah gambar sebelumnya
      // mulai muncul (gambar sebelumnya masih tampil, lalu memudar di 0,5 detik)
      const ready = now - cur.lastSpawn >= NEXT_MS;
      const moved = cur.sx === null ? Infinity : Math.hypot(cur.x - cur.sx, cur.y - cur.sy);

      if (ready && moved > SPAWN_DIST * sizeScale()) {
        if (cur.sx !== null && moved > 1) {
          cur.dx = (cur.x - cur.sx) / moved;
          cur.dy = (cur.y - cur.sy) / moved;
        }
        spawn();
        cur.sx = cur.x;
        cur.sy = cur.y;
        cur.lastSpawn = now;
      }
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerdown', onMove, { passive: true });

    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerdown', onMove);
      items.forEach((it) => {
        clearTimeout(it.timer);
        clearTimeout(it.hold);
      });
    };
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="gal-root" aria-label="Gallery">
      <style>{styles}</style>

      {/* Pool gambar jejak kursor (dipakai ulang) */}
      <div className="gal-trail-layer" aria-hidden="true">
        {Array.from({ length: POOL_SIZE }).map((_, i) => (
          <div
            key={i}
            className="gal-trail"
            ref={(el) => {
              poolRef.current[i] = el;
            }}
          >
            <img alt="" decoding="async" draggable="false" />
          </div>
        ))}
      </div>

      <div className="gal-col">
        <h2 className="gal-title">{title}</h2>

        <div className="gal-visual">
          <div className="gal-portrait">
            {portraitVideo ? (
              <video
                ref={videoRef}
                src={portraitVideo}
                poster={portraitPoster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label={`Video of ${title}`}
              />
            ) : (
              <img src={portraitPoster} alt={`Portrait of ${title}`} loading="eager" decoding="async" />
            )}
          </div>
        </div>

        <p className="gal-desc">
          {descriptionLines.map((line, i) => (
            <span key={i} className="gal-line">
              {line}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}