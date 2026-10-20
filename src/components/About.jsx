import { useEffect, useRef, useState, useMemo } from 'react';

/* ------------------------------------------------------------------
   KONFIGURASI — DATA KARYA PORTFOLIO
   Foto editorial berkualitas tinggi sesuai referensi desain
------------------------------------------------------------------- */
const SHUTTER_URL = '';

const WORKS = [
  {
    id: '01',
    title: 'NEDBANK POLO',
    cat: 'EVENTS',
    type: 'STILLS',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '02',
    title: 'INSTAX IN ALEXANDRA',
    cat: 'CAMPAIGN',
    type: 'MOTION',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '03',
    title: 'O_STUDIOZA',
    cat: 'EDITORIAL',
    type: 'STILLS',
    year: '2024',
    // Foto wanita berambut biru sesuai screenshot referensi
    src: 'https://images.unsplash.com/photo-1559577093-3fd9d1f021a7?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '04',
    title: 'NETFLIX @ COMIC CON CPT',
    cat: 'EVENTS',
    type: 'DOCUMENTARY',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '05',
    title: '@STUDIO88_BRANDED X ADIDAS',
    cat: 'EDITORIAL',
    type: 'STILLS',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '06',
    title: 'PUMA SLIPSTREAM',
    cat: 'COMMERCIAL',
    type: 'STILLS',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '07',
    title: 'BE AN ALL STAR',
    cat: 'CAMPAIGN',
    type: 'MOTION',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '08',
    title: 'SLAPS REEL',
    cat: 'SOCIAL MEDIA',
    type: 'REELS',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '09',
    title: 'SOLITUDE ARCHITECTURE',
    cat: 'DESIGN',
    type: 'STILLS',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '10',
    title: 'CYBER VELVET SESSIONS',
    cat: 'STUDIO',
    type: 'PORTRAIT',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '11',
    title: 'RAW MONOCHROME EXPRESS',
    cat: 'STREET',
    type: 'STILLS',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '12',
    title: 'DUSK HORIZON CAMPAIGN',
    cat: 'CAMPAIGN',
    type: 'MOTION',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '13',
    title: 'NEON NOIR TOKYO',
    cat: 'EDITORIAL',
    type: 'STILLS',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '14',
    title: 'VOGUE SHADOWS',
    cat: 'FASHION',
    type: 'STILLS',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '15',
    title: 'URBAN VIBES CAPE TOWN',
    cat: 'CULTURE',
    type: 'MOTION',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
  {
    id: '16',
    title: 'GOLDEN HOUR EDITORIAL',
    cat: 'EDITORIAL',
    type: 'STILLS',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    aspect: 'portrait',
  },
];

const MODES = ['slider', 'grid', 'list'];
const MONO = '"Courier New", Courier, monospace';
const N = WORKS.length;
const GAP = 0; // ZERO-GAP: berdempetan rapat tanpa jarak antar card
const pad = (n) => String(n).padStart(2, '0');

// Posisi relatif kartu loop horizontal [-N/2, N/2)
const wrap = (v) => ((((v + N / 2) % N) + N) % N) - N / 2;

function smoothDamp(current, target, state, smoothTime, dt) {
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const ease = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (state.vel + omega * change) * dt;
  state.vel = (state.vel - omega * temp) * ease;
  return target + (change + temp) * ease;
}

/* ------------------------------------------------------------------
   Sintesis Suara Jepretan Shutter Mekanis
------------------------------------------------------------------- */
const POOL_SIZE = 4;
let soundEnabled = true;
let pool = null;
let poolIdx = 0;
let primed = false;

function makeShutterWav() {
  const rate = 44100;
  const len = Math.floor(rate * 0.22);
  const data = new Float32Array(len);

  const click = (start, amp, tone) => {
    const n = Math.floor(rate * 0.035);
    let prev = 0;
    for (let i = 0; i < n; i++) {
      const env = Math.pow(1 - i / n, 2.5);
      const noise = Math.random() * 2 - 1;
      const sharp = noise - prev;
      prev = noise;
      data[start + i] += (sharp * 0.6 + Math.sin((i / rate) * 2 * Math.PI * tone) * 0.5) * env * amp;
    }
  };
  click(0, 1, 1800);
  click(Math.floor(rate * 0.08), 0.75, 1200);

  const thump = Math.floor(rate * 0.05);
  for (let i = 0; i < thump; i++) {
    data[i] += Math.sin((i / rate) * 2 * Math.PI * 130) * Math.pow(1 - i / thump, 2) * 0.5;
  }

  let peak = 0;
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(data[i]));

  const buf = new ArrayBuffer(44 + len * 2);
  const view = new DataView(buf);
  const text = (o, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(o + i, str.charCodeAt(i));
  };
  text(0, 'RIFF');
  view.setUint32(4, 36 + len * 2, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, len * 2, true);
  for (let i = 0; i < len; i++) {
    const v = Math.max(-1, Math.min(1, (data[i] / peak) * 0.9));
    view.setInt16(44 + i * 2, v * 32767, true);
  }

  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(bin)}`;
}

function getPool() {
  if (!pool) {
    const src = SHUTTER_URL || makeShutterWav();
    pool = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(src);
      a.preload = 'auto';
      a.volume = 0.8;
      return a;
    });
  }
  return pool;
}

function unlockAudio() {
  if (primed) return;
  primed = true;
  getPool()
    .slice(1)
    .forEach((a) => {
      a.muted = true;
      const p = a.play();
      const done = () => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      };
      if (p && p.then) p.then(done).catch(() => (a.muted = false));
      else done();
    });
}

function playShutter() {
  if (!soundEnabled) return;
  const a = getPool()[poolIdx++ % POOL_SIZE];
  try {
    a.currentTime = 0;
  } catch (e) {}
  const p = a.play();
  if (p && p.catch) p.catch(() => {});
}

/* ------------------------------------------------------------------
   Komponen Foto Mandiri (Menangani fallback & loading mulus)
------------------------------------------------------------------- */
function SmartImage({ work, index, className = '' }) {
  const [error, setError] = useState(false);

  const fallbackSvg = useMemo(() => {
    const g = 18 + index * 4;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">` +
      `<rect width="300" height="400" fill="rgb(${g},${g},${g})"/>` +
      `<text x="150" y="215" fill="#ffffff" fill-opacity=".3" font-family="Courier New,monospace" font-size="64" text-anchor="middle">${pad(index + 1)}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [index]);

  return (
    <img
      src={!error && work.src ? work.src : fallbackSvg}
      alt={work.title}
      draggable={false}
      onError={() => setError(true)}
      className={`w-full h-full object-cover pointer-events-none ${className}`}
    />
  );
}

const triangle =
  'w-0 h-0 border-x-[5px] border-x-transparent border-b-[8px] border-b-[#e5322d]';

/* ------------------------------------------------------------------
   KOMPONEN UTAMA
------------------------------------------------------------------- */
export default function About() {
  const [mode, setMode] = useState('grid'); // Default awal: GRID (sesuai spesifikasi)
  const [soundOn, setSoundOn] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const rootRef = useRef(null);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const S = useRef({ pos: 0, target: 0, vel: 0, step: 1, idx: 0, mode: 'idle' });

  // Engine Kanvas 360° Panning pada Grid
  const gridContainerRef = useRef(null);
  const gridPlaneRef = useRef(null);
  const G = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velX: 0,
    velY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startPanX: 0,
    startPanY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  /* ------------------------------------------------------------------
     1. ENGINE SLIDER: Loop horizontal zero-gap tanpa batas
  ------------------------------------------------------------------- */
  useEffect(() => {
    if (mode !== 'slider') return;
    const slider = sliderRef.current;
    const track = trackRef.current;
    const root = rootRef.current;
    if (!slider || !track || !root) return;

    const cards = Array.from(track.children);
    const s = S.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smoothTime = reduce ? 0.001 : 0.22;
    let raf = 0;
    let last = 0;
    let drawn = NaN;
    let wheelTimer = 0;
    let dragX = 0, dragPos = 0, lastX = 0, lastT = 0, moved = 0;

    const measure = () => {
      s.step = cards[0].offsetWidth + GAP; // Zero-gap
      drawn = NaN;
    };

    const draw = () => {
      for (let i = 0; i < N; i++) {
        const d = wrap(i - s.pos);
        const a = Math.min(1, Math.abs(d));
        const edge = Math.max(0, Math.min(1, (N / 2 - Math.abs(d)) / 0.75));
        const c = cards[i];
        // Zero-gap edge-to-edge
        c.style.transform = `translate3d(${(d * s.step).toFixed(2)}px,0,0)`;
        c.style.opacity = ((1 - 0.45 * a) * edge).toFixed(3);
      }
    };

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60);
      last = t;

      if (s.mode === 'snap') {
        s.pos = smoothDamp(s.pos, s.target, s, smoothTime, dt);
        if (Math.abs(s.pos - s.target) < 0.0005 && Math.abs(s.vel) < 0.01) {
          s.pos = s.target;
          s.vel = 0;
          s.mode = 'idle';
        }
      }

      const cur = ((Math.round(s.pos) % N) + N) % N;
      if (cur !== s.idx) {
        s.idx = cur;
        playShutter();
      }
      if (s.pos !== drawn) {
        draw();
        drawn = s.pos;
      }
    };

    const snapTo = (target) => {
      s.target = target;
      s.mode = 'snap';
    };

    const onDown = (e) => {
      e.stopPropagation();
      clearTimeout(wheelTimer);
      s.mode = 'drag';
      s.vel = 0;
      dragX = lastX = e.clientX;
      dragPos = s.pos;
      moved = 0;
      lastT = performance.now();
      slider.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      if (s.mode !== 'drag') return;
      e.preventDefault();
      e.stopPropagation();
      const now = performance.now();
      const dtSec = Math.max(0.001, (now - lastT) / 1000);
      const inst = -((e.clientX - lastX) / s.step) / dtSec;
      s.vel = s.vel * 0.65 + inst * 0.35;
      lastX = e.clientX;
      lastT = now;
      moved = Math.max(moved, Math.abs(e.clientX - dragX));
      s.pos = dragPos - (e.clientX - dragX) / s.step;
    };

    const onUp = (e) => {
      if (s.mode !== 'drag') return;
      e.stopPropagation();
      if (moved < 6) {
        s.vel = 0;
        const i = cards.findIndex((c) => {
          const r = c.getBoundingClientRect();
          return e.clientX >= r.left && e.clientX <= r.right;
        });
        snapTo(Math.round(i >= 0 ? s.pos + wrap(i - s.pos) : s.pos));
      } else {
        const stale = performance.now() - lastT > 90;
        s.vel = stale ? 0 : Math.max(-14, Math.min(14, s.vel));
        snapTo(Math.round(s.pos + s.vel * 0.2));
      }
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      e.stopPropagation();
      s.mode = 'free';
      s.vel = 0;
      s.pos += e.deltaX / s.step;
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => snapTo(Math.round(s.pos)), 120);
    };

    measure();
    draw();
    drawn = s.pos;
    raf = requestAnimationFrame(frame);
    slider.addEventListener('pointerdown', onDown);
    slider.addEventListener('pointermove', onMove);
    slider.addEventListener('pointerup', onUp);
    slider.addEventListener('pointercancel', onUp);
    slider.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(wheelTimer);
      slider.removeEventListener('pointerdown', onDown);
      slider.removeEventListener('pointermove', onMove);
      slider.removeEventListener('pointerup', onUp);
      slider.removeEventListener('pointercancel', onUp);
      slider.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', measure);
    };
  }, [mode]);

  /* ------------------------------------------------------------------
     2. ENGINE GRID: 360° Free 2D Pan, 3 Kolom Desktop (~33.3vw), Zero-Gap
  ------------------------------------------------------------------- */
  useEffect(() => {
    if (mode !== 'grid') return;
    const container = gridContainerRef.current;
    const plane = gridPlaneRef.current;
    if (!container || !plane) return;

    const g = G.current;
    let raf = 0;
    let lastTime = 0;

    const updateBounds = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const pw = plane.scrollWidth || plane.offsetWidth;
      const ph = plane.scrollHeight || plane.offsetHeight;

      // Batas jelajah 2D canvas dengan margin bebas gerak 360 derajat
      g.minX = Math.min(0, cw - pw);
      g.maxX = 0;
      g.minY = Math.min(0, ch - ph);
      g.maxY = 0;

      // Posisikan awal sedikit di tengah agar card 03 terlihat sentral
      if (g.x === 0 && g.y === 0) {
        g.targetX = g.x = Math.max(g.minX, (cw - pw) * 0.25);
        g.targetY = g.y = 0;
      }
    };

    updateBounds();

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.04, lastTime ? (t - lastTime) / 1000 : 1 / 60);
      lastTime = t;

      if (!g.isDragging) {
        // Friksi luncur inersia halus
        const friction = Math.pow(0.93, dt * 60);
        g.velX *= friction;
        g.velY *= friction;
        g.targetX += g.velX * dt;
        g.targetY += g.velY * dt;

        // Pegas elastis saat ditarik melampaui batas tepi kanvas
        if (g.targetX > g.maxX) {
          g.targetX += (g.maxX - g.targetX) * 0.14;
        } else if (g.targetX < g.minX) {
          g.targetX += (g.minX - g.targetX) * 0.14;
        }

        if (g.targetY > g.maxY) {
          g.targetY += (g.maxY - g.targetY) * 0.14;
        } else if (g.targetY < g.minY) {
          g.targetY += (g.minY - g.targetY) * 0.14;
        }
      }

      // Smooth damp koordinat X & Y langsung ke GPU (transform3d)
      g.x += (g.targetX - g.x) * (g.isDragging ? 1.0 : 0.22);
      g.y += (g.targetY - g.y) * (g.isDragging ? 1.0 : 0.22);

      plane.style.transform = `translate3d(${g.x.toFixed(2)}px, ${g.y.toFixed(2)}px, 0)`;
    };

    raf = requestAnimationFrame(frame);

    const onPointerDown = (e) => {
      e.stopPropagation();
      g.isDragging = true;
      g.dragStartX = e.clientX;
      g.dragStartY = e.clientY;
      g.startPanX = g.targetX;
      g.startPanY = g.targetY;
      g.lastX = e.clientX;
      g.lastY = e.clientY;
      g.lastTime = performance.now();
      g.velX = 0;
      g.velY = 0;
      hasMovedRef.current = false;
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!g.isDragging) return;
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - g.dragStartX;
      const dy = e.clientY - g.dragStartY;

      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      const now = performance.now();
      const dt = Math.max(0.001, (now - g.lastTime) / 1000);
      const instX = (e.clientX - g.lastX) / dt;
      const instY = (e.clientY - g.lastY) / dt;

      g.velX = g.velX * 0.6 + instX * 0.4;
      g.velY = g.velY * 0.6 + instY * 0.4;
      g.lastX = e.clientX;
      g.lastY = e.clientY;
      g.lastTime = now;

      // 1:1 gerakan langsung 360° ke segala arah
      g.targetX = g.startPanX + dx;
      g.targetY = g.startPanY + dy;
    };

    const onPointerUp = (e) => {
      if (!g.isDragging) return;
      e.stopPropagation();
      g.isDragging = false;
      const stale = performance.now() - g.lastTime > 70;
      if (stale) {
        g.velX = 0;
        g.velY = 0;
      } else {
        g.velX = Math.max(-2800, Math.min(2800, g.velX));
        g.velY = Math.max(-2800, Math.min(2800, g.velY));
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      g.targetX -= e.deltaX * 0.9;
      g.targetY -= e.deltaY * 0.9;
      g.velX = -e.deltaX * 5;
      g.velY = -e.deltaY * 5;
    };

    window.addEventListener('resize', updateBounds);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateBounds);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('wheel', onWheel);
    };
  }, [mode]);

  const pickMode = (m) => {
    playShutter();
    setMode(m);
  };

  const openFrom = (i) => {
    playShutter();
    const st = S.current;
    st.pos = st.target = i;
    st.idx = i;
    st.vel = 0;
    st.mode = 'idle';
    setMode('slider');
  };

  const toggleSound = () => {
    unlockAudio();
    soundEnabled = !soundEnabled;
    setSoundOn(soundEnabled);
    if (soundEnabled) playShutter();
  };

  return (
    <section
      ref={rootRef}
      id="about"
      className="relative w-full h-[100dvh] min-h-[580px] overflow-hidden bg-[#070707] text-white select-none"
      style={{
        fontFamily: MONO,
        '--cw': 'min(78vw, 480px, calc((100dvh - 240px) * 0.75))',
      }}
    >
      {/* ------------------------------------------------------------------
         HEADER MENU VIEW: SLIDER / GRID / LIST (dengan panah merah di mode aktif)
      ------------------------------------------------------------------- */}
      <nav
        aria-label="Tampilan Mode"
        className="absolute top-[80px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-7 sm:gap-11"
      >
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => pickMode(m)}
            className={`relative text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] transition-colors duration-250 cursor-pointer ${
              mode === m ? 'text-white font-semibold' : 'text-white/40 hover:text-white'
            }`}
          >
            {m}
            {mode === m && (
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-full mt-[6px] -ml-[5px] ${triangle} transition-all duration-300`}
              />
            )}
          </button>
        ))}
      </nav>

      {/* ------------------------------------------------------------------
         PANGGUNG UTAMA (TRANSISI TATA LETAK DINAMIS TANPA RELOAD)
      ------------------------------------------------------------------- */}
      <div className="absolute inset-x-0 top-[120px] bottom-[54px] overflow-hidden no-scrollbar">
        
        {/* ==============================================================
           MODE 1: SLIDER (Horizontal Zero-Gap Strip + Kurung Fokus Viewfinder)
        ============================================================== */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            mode === 'slider' ? 'opacity-100 pointer-events-auto z-20' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <div
            ref={sliderRef}
            className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing no-scrollbar"
            style={{ touchAction: 'pan-y' }}
          >
            <div ref={trackRef} className="absolute inset-0">
              {WORKS.map((w, i) => (
                <div
                  key={w.id}
                  className="absolute left-1/2 top-1/2 w-[var(--cw)] will-change-[transform,opacity]"
                  style={{
                    marginLeft: 'calc(var(--cw) / -2)',
                    marginTop: 'calc(var(--cw) * -2 / 3)',
                    opacity: 0,
                  }}
                >
                  <div className="w-full aspect-[3/4] bg-[#121212] overflow-hidden">
                    <SmartImage work={w} index={i} />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-[11px] tracking-[0.14em] text-white/90">
                      {w.id}. {w.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kurung Fokus Viewfinder Kamera & Crosshair */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div
              className="relative"
              style={{
                width: 'calc(var(--cw) + 24px)',
                height: 'calc(var(--cw) * 4 / 3 + 24px)',
              }}
            >
              <i className="absolute left-0 top-0 w-[20px] h-[20px] border-t border-l border-white/90" />
              <i className="absolute right-0 top-0 w-[20px] h-[20px] border-t border-r border-white/90" />
              <i className="absolute left-0 bottom-0 w-[20px] h-[20px] border-b border-l border-white/90" />
              <i className="absolute right-0 bottom-0 w-[20px] h-[20px] border-b border-r border-white/90" />
              <b className="absolute left-1/2 top-1/2 w-[14px] h-[1px] -translate-x-1/2 -translate-y-1/2 bg-white/70" />
              <b className="absolute left-1/2 top-1/2 w-[1px] h-[14px] -translate-x-1/2 -translate-y-1/2 bg-white/70" />
            </div>
          </div>
        </div>

        {/* ==============================================================
           MODE 2: GRID (Full-Bleed, Zero-Gap, 3 Kolom Desktop 33.3vw, 360° Pan)
        ============================================================== */}
        <div
          ref={gridContainerRef}
          data-lenis-prevent
          className={`absolute inset-0 overflow-hidden no-scrollbar cursor-grab active:cursor-grabbing select-none transition-opacity duration-500 ease-out ${
            mode === 'grid' ? 'opacity-100 pointer-events-auto z-20' : 'opacity-0 pointer-events-none z-0'
          }`}
          style={{
            touchAction: 'none',
            overscrollBehavior: 'contain',
          }}
        >
          {/* Kanvas 2D yang memanjang lebih luas dari viewport untuk gerak bebas 360° */}
          <div
            ref={gridPlaneRef}
            className="absolute left-0 top-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 will-change-transform"
            style={{
              width: 'max(100vw, 133vw)', // Memberikan ruang panning 360° horizontal & vertikal
            }}
          >
            {WORKS.map((w, i) => {
              const isHovered = hoveredIndex === i;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <div
                  key={w.id}
                  onPointerEnter={() => {
                    if (!G.current.isDragging) setHoveredIndex(i);
                  }}
                  onPointerLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (!hasMovedRef.current) openFrom(i);
                  }}
                  className="relative group cursor-pointer overflow-hidden transition-[filter,opacity] duration-300 ease-out border border-white/5"
                  style={{
                    // INTERAKSI SPOTLIGHT: Card di-hover Full Color & Terang, Card di sekelilingnya Grayscale & Dimmed
                    filter: isHovered
                      ? 'grayscale(0%) brightness(1.12) contrast(1.05)'
                      : isAnyHovered
                      ? 'grayscale(100%) brightness(0.35) contrast(0.85)'
                      : 'grayscale(15%) brightness(0.92)',
                    opacity: isHovered ? 1 : isAnyHovered ? 0.35 : 0.92,
                    zIndex: isHovered ? 30 : 1,
                  }}
                >
                  <div className="w-full aspect-[3/4] bg-[#111111] overflow-hidden">
                    <SmartImage
                      work={w}
                      index={i}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* OVERLAY METADATA PADA HOVER */}
                  <div
                    className={`absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none transition-opacity duration-250 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.9) 100%)',
                    }}
                  >
                    {/* Atas: Nomor Seri & Tipe Proyek (seperti "03. O_STUDIOZA", "STILLS") */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.14em] text-white bg-black/75 px-2 py-0.5 border border-white/20">
                        {w.id}. {w.title}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.16em] text-[#e5322d] bg-black/75 px-2 py-0.5 border border-[#e5322d]/40">
                        {w.type}
                      </span>
                    </div>

                    {/* Bawah: Kategori & Tahun & Status Action */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.16em] text-white/60">
                          {w.cat}
                        </p>
                        <p className="text-xs font-mono tracking-[0.12em] text-white font-medium">
                          {w.year}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono tracking-[0.14em] text-white border-b border-white/60 pb-0.5">
                        [ VIEW ]
                      </span>
                    </div>

                    {/* Sudut Kurung Viewfinder Kamera */}
                    <i className="absolute left-2 top-2 w-2.5 h-2.5 border-t-2 border-l-2 border-white/90" />
                    <i className="absolute right-2 top-2 w-2.5 h-2.5 border-t-2 border-r-2 border-white/90" />
                    <i className="absolute left-2 bottom-2 w-2.5 h-2.5 border-b-2 border-l-2 border-white/90" />
                    <i className="absolute right-2 bottom-2 w-2.5 h-2.5 border-b-2 border-r-2 border-white/90" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==============================================================
           MODE 3: LIST (Tampilan Indeks Editorial Terstruktur)
        ============================================================== */}
        <div
          data-lenis-prevent
          className={`absolute inset-0 overflow-y-auto no-scrollbar px-4 sm:px-12 py-4 transition-opacity duration-500 ease-out ${
            mode === 'list' ? 'opacity-100 pointer-events-auto z-20' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <div className="max-w-4xl mx-auto divide-y divide-white/10">
            <div className="grid grid-cols-12 py-2 text-[10px] tracking-[0.18em] text-white/40 uppercase font-mono">
              <span className="col-span-2">NO</span>
              <span className="col-span-4 sm:col-span-5">TITLE</span>
              <span className="col-span-3 sm:col-span-3">CATEGORY</span>
              <span className="col-span-3 sm:col-span-2 text-right">TYPE</span>
            </div>
            {WORKS.map((w, i) => (
              <div
                key={w.id}
                onClick={() => openFrom(i)}
                className="grid grid-cols-12 py-4 items-center text-xs sm:text-sm font-mono tracking-[0.12em] cursor-pointer transition-colors duration-200 hover:text-[#e5322d] hover:bg-white/[0.02] px-2"
              >
                <span className="col-span-2 text-white/50">{w.id}</span>
                <span className="col-span-4 sm:col-span-5 font-medium truncate text-white">
                  {w.title}
                </span>
                <span className="col-span-3 sm:col-span-3 text-white/60 text-[11px]">
                  {w.cat}
                </span>
                <span className="col-span-3 sm:col-span-2 text-right text-white/50 text-[11px]">
                  [{w.type}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
         FOOTER: INDIKATOR 360° & KONTROL AUDIO SHUTTER
      ------------------------------------------------------------------- */}
      {mode === 'grid' && (
        <div className="absolute bottom-4 left-6 z-20 hidden sm:flex items-center gap-2 text-[10px] tracking-[0.15em] text-white/40 font-mono pointer-events-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e5322d] animate-pulse" />
          <span>DRAG 360° / PAN TO EXPLORE CONTACT SHEET</span>
        </div>
      )}

      <button
        onClick={toggleSound}
        className="absolute bottom-4 right-6 sm:right-[88px] z-20 text-xs font-mono uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        SOUND: [{soundOn ? 'ON' : 'OFF'}]
      </button>
    </section>
  );
}
