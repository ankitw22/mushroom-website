'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroCanvas from './HeroCanvas';
import Ticker from './Ticker';

export default function Hero() {
  const [appsCount, setAppsCount] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppsCount() {
      try {
        const response = await fetch('https://plug-service.viasocket.com/get-apps-count');
        if (response.ok) {
          const data = await response.json();
          if (data.count) {
            // Format the count with comma separators
            const count = parseInt(data.count, 10);
            setAppsCount(count.toLocaleString());
          }
        }
      } catch (error) {
        console.error('Failed to fetch apps count:', error);
      }
    }
    fetchAppsCount();
  }, []);

  // Display dynamic count or fallback to "2,000+" while loading/on error
  const displayCount = appsCount ? `${appsCount}+` : '2,000+';

  return (
    <div className="hero relative h-[calc(100vh-20px)] min-h-[600px] bg-[var(--green)] rounded-2xl overflow-hidden m-[10px]">
      <HeroCanvas />

      <div id="hero-content" className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-[88px] px-6 pb-16">
        <div id="hero-left" className="flex-none w-full" style={{ paddingTop: '10vh' }}>
          <div id="hero-copy" className="flex flex-col items-center gap-4 text-center pointer-events-none">
            <h1 
              id="hero-title"
              className="animate-pop-in max-[540px]:tracking-[-1px]"
              style={{ fontFamily: "'Symtext', 'Press Start 2P', monospace", fontSize: 'clamp(64px,13vw,160px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-2px' }}
            >
              MUSHROOMS
            </h1>
            <p 
              id="hero-sub"
              className="max-w-[560px] animate-fade-up"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}
            >
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>Power up</strong> your AI with {displayCount} apps
            </p>
            <Link
              href="https://app.mushroom.viasocket.com/login"
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta"
              className="inline-flex items-center pointer-events-auto animate-fade-up-delay transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
              style={{ fontFamily: "'Symtext', 'Press Start 2P', monospace", fontSize: 'clamp(11px,1.3vw,14px)', fontWeight: 400, letterSpacing: '0.08em', color: '#fff', background: 'var(--ink)', padding: '15px 38px', borderRadius: 8, marginTop: 4, textDecoration: 'none' }}
            >
              SELECT AI AND YOUR APPS
            </Link>
          </div>
        </div>
      </div>

      <Ticker />
    </div>
  );
}
