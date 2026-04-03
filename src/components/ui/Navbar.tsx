'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onFreePillClick?: () => void;
}

export default function Navbar({ onFreePillClick }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show header when user has scrolled more than 50px
      const scrolled = window.scrollY > 50;
      setIsVisible(scrolled);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position (in case page is already scrolled on load)
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      id="hero-nav"
      style={{
        position: 'fixed',
        top: 28,
        right: 32,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        padding: 0,
        boxShadow: 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Link
        href="/pricing"
        className="max-[540px]:hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFD600] text-[#0a0a0a] font-['Poppins'] text-[13px] font-bold whitespace-nowrap no-underline cursor-pointer transition-opacity hover:opacity-80"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, flexShrink: 0 }}>
          <path d="M20 12v10H4V12" />
          <path d="M22 7H2v5h20V7z" />
          <path d="M12 22V7" />
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
        Free
      </Link>
      <Link
        href="https://viasocket.com/embed"
        target="_blank"
        rel="noopener noreferrer"
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
        href="https://app.mushroom.viasocket.com/login"
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
