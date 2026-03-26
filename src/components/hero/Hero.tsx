'use client';

import Link from 'next/link';
import HeroCanvas from './HeroCanvas';
import Ticker from './Ticker';

export default function Hero() {
  return (
    <div className="hero relative h-[calc(100vh-20px)] min-h-[600px] bg-[var(--green)] rounded-2xl overflow-hidden m-[10px]">
      <HeroCanvas />

      <div id="hero-content" className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-[88px] px-6 pb-16">
        <div id="hero-left" className="flex-none w-full pt-[10vh]">
          <div id="hero-copy" className="flex flex-col items-center gap-4 text-center pointer-events-none">
            <h1 
              id="hero-title"
              className="animate-pop-in leading-none tracking-[-2px] max-[540px]:tracking-[-1px]"
              style={{
                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                fontSize: 'clamp(64px, 13vw, 160px)',
                fontWeight: 400,
                color: 'var(--ink)',
              }}
            >
              MUSHROOMS
            </h1>
            <p 
              id="hero-sub"
              className="max-w-[560px] leading-relaxed animate-fade-up"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 500,
                color: '#ffffff',
              }}
            >
              <strong className="text-[var(--ink)] font-bold">Power up</strong> your AI clients with 2,000+ apps
            </p>
            <Link
              href="#"
              id="hero-cta"
              className="inline-flex items-center py-[15px] px-[38px] bg-[var(--ink)] text-white rounded-lg pointer-events-auto mt-1 animate-fade-up-delay transition-transform hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
              style={{
                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                fontSize: 'clamp(11px, 1.3vw, 14px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              START POWERING UP →
            </Link>
          </div>
        </div>
      </div>

      <Ticker />
    </div>
  );
}
