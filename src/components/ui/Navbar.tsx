'use client';

import Link from 'next/link';

interface NavbarProps {
  onFreePillClick?: () => void;
}

export default function Navbar({ onFreePillClick }: NavbarProps) {
  return (
    <nav
      id="hero-nav"
      style={{ position: 'fixed', top: 28, right: 32, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 8, background: 'none', padding: 0, boxShadow: 'none' }}
    >
      <a
        href="#faq-free"
        onClick={(e) => { e.preventDefault(); onFreePillClick?.(); }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 100,
          background: '#FFD600', color: '#0a0a0a',
          fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700,
          whiteSpace: 'nowrap', textDecoration: 'none', cursor: 'pointer',
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, flexShrink: 0 }}>
          <path d="M20 12v10H4V12" />
          <path d="M22 7H2v5h20V7z" />
          <path d="M12 22V7" />
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
        Free
      </a>
      <Link
        href="#"
        className="max-[540px]:hidden"
        style={{
          display: 'inline-block',
          padding: '7px 18px', borderRadius: 100,
          background: 'var(--ink)', color: '#fff',
          fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
          whiteSpace: 'nowrap', textDecoration: 'none',
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
      >
        Explore Embed
      </Link>
      <Link
        href="https://app.mushrooms.viasocket.com/login"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '7px 18px', borderRadius: 100,
          background: 'var(--ink)', color: '#fff',
          fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
          whiteSpace: 'nowrap', textDecoration: 'none',
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
      >
        Dashboard →
      </Link>
    </nav>
  );
}
