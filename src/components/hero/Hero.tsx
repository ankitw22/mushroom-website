'use client';

import Link from 'next/link';
import HeroCanvas from './HeroCanvas';
import Ticker from './Ticker';

export default function Hero() {
  return (
    <div className="relative h-[calc(100vh-20px)] min-h-[600px] bg-[var(--green)] rounded-2xl overflow-hidden m-[10px]">
      <HeroCanvas />

      <div className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-[88px] px-6 pb-16">
        <div className="flex-none w-full pt-[10vh]">
          <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
            <h1 className="font-[var(--pixel)] text-[clamp(64px,13vw,160px)] font-normal text-[var(--ink)] leading-none tracking-[-2px] animate-pop-in max-[540px]:text-[min(11vw,64px)] max-[540px]:tracking-[-1px]">
              MUSHROOMS
            </h1>
            <p className="font-[var(--body)] text-[clamp(20px,3vw,28px)] font-medium text-white max-w-[560px] leading-relaxed animate-fade-up max-[540px]:text-[clamp(16px,4vw,20px)]">
              <strong className="text-[var(--ink)] font-bold">Power up</strong> your AI clients with 2,000+ apps
            </p>
            <Link
              href="#"
              className="inline-flex items-center py-[15px] px-[38px] bg-[var(--ink)] text-white font-[var(--pixel)] text-[clamp(11px,1.3vw,14px)] font-normal tracking-[0.08em] no-underline rounded-lg pointer-events-auto mt-1 animate-fade-up-delay transition-transform hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
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
