import { useState } from 'react';

const columns = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About Me', href: '#about' },
      { label: 'Project', href: '#project' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Contact Me', href: '#contact' },
    ],
  },
  {
    title: 'CMS Pages',
    links: [
      { label: 'Work Details', href: '#work-details' },
      { label: 'Blog Details', href: '#blog-details' },
    ],
  },
  {
    title: 'Utility Pages',
    links: [
      { label: '404', href: '#404' },
      { label: 'Coming Soon', href: '#coming-soon' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms & Conditions', href: '#terms' },
    ],
  },
  {
    title: 'Social Links',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/evandaprilliano' },
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'GitHub', href: 'https://github.com/canevno' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'TikTok', href: 'https://tiktok.com' },
    ],
  },
];

const contacts = [
  {
    icon: 'message',
    value: '087874254445',
    href: 'https://wa.me/6287874254445',
    note: 'WhatsApp',
  },
  {
    icon: 'mail',
    value: 'evandaprilliano@gmail.com',
    href: 'mailto:evandaprilliano@gmail.com',
    note: 'Gmail',
  },
];

function ContactIcon({ name }) {
  const props = { className: 'gl-icon', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true };
  if (name === 'phone') {
    return (
      <svg {...props}>
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
      </svg>
    );
  }
  if (name === 'message') {
    return (
      <svg {...props}>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.35A10 10 0 1 0 12 2zm-4 11a1.2 1.2 0 1 1 0-2.4A1.2 1.2 0 0 1 8 13zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M4 4h16a2 2 0 0 1 2 2v1.2l-10 6.2L2 7.2V6a2 2 0 0 1 2-2zm18 5.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5l10 6.2 10-6.2z" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      className="gl-arrow"
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
  Skala fluid: --u = 1px pada lebar 1080px (ukuran referensi).
  Di layar desktop yang lebih lebar, semua ukuran font, jarak, input,
  dan ikon ikut membesar secara proporsional (maksimal 1.75x).
  Di bawah 1024px dipakai ukuran tetap yang nyaman dibaca di HP/tablet.
*/
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.gl-root {
  --u: 1px;
  background: #090909;
  color: #fff;
  font-family: 'Outfit', 'Manrope', 'Inter', system-ui, sans-serif;
  width: 100%;
  overflow: hidden;
  position: relative;
}
@media (min-width: 1024px) {
  .gl-root { --u: clamp(1px, 0.0926vw, 1.75px); }
}

.gl-wrap {
  max-width: 2400px;
  margin: 0 auto;
  padding: calc(var(--u) * 28) max(20px, calc(var(--u) * 28)) 0;
}

/* Atas */
.gl-top { display: flex; flex-direction: column; gap: 28px; }
@media (min-width: 1024px) {
  .gl-top { flex-direction: row; justify-content: space-between; align-items: flex-start; }
}
.gl-logo { font-size: max(34px, calc(var(--u) * 38)); font-weight: 600; line-height: 1; letter-spacing: -0.01em; }
.gl-desc {
  margin-top: calc(var(--u) * 14);
  max-width: max(300px, calc(var(--u) * 360));
  text-align: left;
  font-size: max(13px, calc(var(--u) * 11.5));
  line-height: 1.4;
  color: rgba(255,255,255,.9);
}

.gl-news { width: 100%; max-width: max(335px, calc(var(--u) * 360)); }
.gl-news-title { font-size: max(15px, calc(var(--u) * 14)); font-weight: 600; }
.gl-form {
  margin-top: calc(var(--u) * 14);
  display: flex;
  align-items: center;
  height: max(50px, calc(var(--u) * 48));
  padding: max(4px, calc(var(--u) * 4));
  padding-left: max(18px, calc(var(--u) * 18));
  border-radius: 999px;
  background: #414141;
}
.gl-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: 0;
  color: #fff;
  font: inherit;
  font-size: max(14px, calc(var(--u) * 12.5));
  font-weight: 500;
}
.gl-input::placeholder { color: #fff; opacity: 1; }
.gl-btn {
  flex-shrink: 0;
  height: 100%;
  display: inline-flex;
  align-items: center;
  gap: max(8px, calc(var(--u) * 8));
  padding: 0 max(20px, calc(var(--u) * 22));
  border: 0;
  border-radius: 999px;
  background: #FF493D;
  color: #fff;
  font: inherit;
  font-size: max(14px, calc(var(--u) * 12.5));
  font-weight: 600;
  cursor: pointer;
  transition: opacity .2s;
}
.gl-btn:hover { opacity: .9; }
.gl-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.gl-arrow { width: max(14px, calc(var(--u) * 14)); height: max(14px, calc(var(--u) * 14)); }
.gl-hint { margin-top: calc(var(--u) * 12); font-size: max(13px, calc(var(--u) * 12)); color: #929292; }

/* Tengah: navigasi */
.gl-nav {
  margin-top: calc(var(--u) * 36);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 24px;
}
@media (min-width: 640px) { .gl-nav { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) {
  .gl-nav {
    grid-template-columns: 164fr 164fr 167fr 199fr 163fr 199fr;
    gap: 0;
    margin-top: calc(var(--u) * 40);
  }
}
.gl-col-title { font-size: max(14px, calc(var(--u) * 13.5)); font-weight: 500; color: #929292; }
.gl-list { list-style: none; margin: calc(var(--u) * 14) 0 0; padding: 0; display: flex; flex-direction: column; gap: max(9px, calc(var(--u) * 9)); }
.gl-link {
  font-size: max(14px, calc(var(--u) * 12.5));
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  transition: opacity .2s;
}
.gl-link:hover { opacity: .65; }
.gl-link:focus-visible { outline: 2px solid #fff; outline-offset: 3px; border-radius: 2px; }

.gl-contact { grid-column: span 2; }
@media (min-width: 640px) { .gl-contact { grid-column: span 3; } }
@media (min-width: 1024px) { .gl-contact { grid-column: span 1; } }
.gl-contact-list { list-style: none; margin: calc(var(--u) * 14) 0 0; padding: 0; display: flex; flex-direction: column; gap: max(10px, calc(var(--u) * 10)); }
.gl-contact-item { display: flex; align-items: flex-start; gap: max(12px, calc(var(--u) * 14)); }
.gl-icon { flex-shrink: 0; width: max(15px, calc(var(--u) * 14)); height: max(15px, calc(var(--u) * 14)); margin-top: 3px; }
.gl-note { margin-top: 1px; font-size: max(12px, calc(var(--u) * 9.5)); color: rgba(255,255,255,.8); }
.gl-contact .gl-link { overflow-wrap: anywhere; }

/* Bawah: tulisan raksasa */
.gl-big { margin-top: calc(var(--u) * 32); }
.gl-big svg { display: block; width: 100%; height: auto; user-select: none; }
`;

export default function Contact() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: sambungkan ke endpoint newsletter kamu
    setSent(true);
    setEmail('');
  };

  return (
    <footer id="contact" className="gl-root">
      <style>{styles}</style>

      <div className="gl-wrap">
        <div className="gl-top">
          <div>
            <p className="gl-logo">Portofolio</p>
            <p className="gl-desc">
              I&apos;m a Junior Developer and Graphic Designer. Let&apos;s
              collaborate and build a great partnership together. Reach out to me through the
              platforms below.
            </p>
          </div>

          <div className="gl-news">
            <h3 className="gl-news-title">Subscribe to Our Newsletter</h3>
            <form className="gl-form" onSubmit={handleSubmit}>
              <label htmlFor="newsletter-email" style={{ position: 'absolute', left: -9999 }}>
                Email
              </label>
              <input
                id="newsletter-email"
                className="gl-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSent(false);
                }}
                placeholder="Enter your email"
              />
              <button type="submit" className="gl-btn">
                Subscribe
                <ArrowUpRight />
              </button>
            </form>
            <p className="gl-hint" role="status">
              {sent ? 'Thanks for subscribing!' : 'No spam. Just great content.'}
            </p>
          </div>
        </div>

        <div className="gl-nav">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="gl-col-title">{col.title}</h4>
              <ul className="gl-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="gl-link"
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="gl-contact">
            <h4 className="gl-col-title">Have a question?</h4>
            <ul className="gl-contact-list">
              {contacts.map((c) => (
                <li key={c.value} className="gl-contact-item">
                  <ContactIcon name={c.icon} />
                  <div style={{ minWidth: 0 }}>
                    <a className="gl-link" href={c.href}>
                      {c.value}
                    </a>
                    <p className="gl-note">{c.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gl-big" aria-hidden="true">
          <svg viewBox="0 0 1032 125" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="gl-grad" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="125">
                <stop offset="0" stopColor="#FF493D" />
                <stop offset="0.5" stopColor="#8E211B" />
                <stop offset="1" stopColor="#090909" />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="150"
              fontSize="185"
              fontWeight="600"
              fill="url(#gl-grad)"
              fontFamily="'Outfit', 'Manrope', 'Inter', system-ui, sans-serif"
              textLength="1032"
              lengthAdjust="spacingAndGlyphs"
            >
              APRILLIANO
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}