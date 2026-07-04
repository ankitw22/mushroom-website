'use client';

import Link from 'next/link';
import HeroCanvas from './HeroCanvas';
import Ticker from './Ticker';
import { useAppsCount } from '@/context/AppsCountContext';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { displayCount } = useAppsCount();

  return (
    <div className="hero relative h-[calc(100vh-20px)] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] bg-[var(--green)] rounded-2xl overflow-hidden m-[10px]">
      <HeroCanvas />

      <div id="hero-content" className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-[40px] px-4 sm:px-6 pb-16">
        <div id="hero-left" className="flex-none w-full" style={{ paddingTop: '3vh' }}>
          <div id="hero-copy" className="flex flex-col items-center gap-3 sm:gap-4 text-center pointer-events-none">
            <h1 
              id="hero-title"
              className="animate-pop-in w-full px-2"
              style={{
                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                fontSize: 'clamp(48px, 12vw, 160px)',
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1,
                letterSpacing: 'clamp(-2px, -0.5vw, -1px)',
                wordBreak: 'break-word',
              }}
            >
              MUSHROOMS
            </h1>
            <p 
              id="hero-sub"
              className="max-w-[560px] animate-fade-up px-3 sm:px-2"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(20px, 4vw, 42px)',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>Power up</strong> your AI <span style={{ color: 'var(--ink)' }}>with</span> {displayCount} apps
            </p>
            <Link
              href="https://app.mushrooms.viasocket.com/login"
              id="hero-cta"
              className="inline-flex items-center gap-2 pointer-events-auto animate-fade-up-delay transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(12px, 2.8vw, 15px)',
                fontWeight: 600,
                color: '#fff',
                background: 'var(--ink)',
                padding: 'clamp(12px, 2.5vw, 15px) clamp(24px, 5vw, 38px)',
                borderRadius: 8,
                marginTop: 4,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              SELECT AI AND YOUR APPS
              <ArrowRight className="inline-block flex-shrink-0" size={14} />
            </Link>
          </div>
        </div>
      </div>

      <Ticker />
    </div>
  );
}
