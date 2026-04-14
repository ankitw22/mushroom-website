'use client';

import Link from 'next/link';
import Ticker from './Ticker';
import { useAppsCount } from '@/context/AppsCountContext';
import { INTEGRATION_APPS } from '@/config/brand-icons';
import HeroChatDemo from '@/components/hero/HeroChatDemo';
import HeroCanvas2 from './HeroCanvas2';
import { useState, useEffect } from 'react';

export default function Hero2() {
    const { displayCount } = useAppsCount();
    const [randomApps, setRandomApps] = useState<typeof INTEGRATION_APPS[number][]>([]);

    useEffect(() => {
        const shuffled = [...INTEGRATION_APPS].sort(() => 0.5 - Math.random());
        setRandomApps(shuffled.slice(0, 4));
    }, []);

    return (
        <div className="hero relative h-[calc(100vh-20px)] min-h-[1350px] bg-[var(--green)] rounded-2xl overflow-hidden m-[10px]">
            <HeroCanvas2 />
            <div id="hero-content" className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-[40px] px-6 pb-16">
                <div id="hero-left" className="flex-none w-full" style={{ paddingTop: '5vh' }}>
                    <div id="hero-copy" className="flex flex-col items-center gap-4 text-center pointer-events-none">
                        <h1
                            id="hero-title"
                            className="animate-pop-in max-[540px]:tracking-[-1px]"
                            style={{ fontFamily: "'Symtext', 'Press Start 2P', monospace", fontSize: 'clamp(64px,13vw,160px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-2px' }}
                        >
                            MUSHROOMS
                        </h1>
                        <div
                            id="hero-sub"
                            className="max-w-[700px] animate-fade-up flex items-center justify-center gap-x-2"
                            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}
                        >
                            <span>
                                <strong style={{ color: 'var(--ink)', fontWeight: 200 }}>Give your AI the</strong> Power to act <span style={{ color: 'var(--ink)', fontWeight: 200 }}>across {displayCount} apps </span>
                                <span className="inline-flex items-center space-x-[-12px] ml-2 align-middle">
                                    {randomApps.map((app, index) => (
                                        <span
                                            key={index}
                                            className="w-[clamp(32px,4vw,42px)] h-[clamp(32px,4vw,42px)] rounded-[10px] flex items-center justify-center relative shadow-sm border-[2px] border-[var(--green)] bg-white"
                                            style={{ zIndex: 4 - index }}
                                        >
                                            <img src={`/api/icon/${app.domain}`} alt={app.name} className="w-[60%] h-[60%] object-contain" />
                                        </span>
                                    ))}
                                </span>
                            </span>

                        </div>
                        <Link
                            href="https://app.mushrooms.viasocket.com/login"
                            id="hero-cta"
                            className="inline-flex items-center gap-2 pointer-events-auto animate-fade-up-delay transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
                            style={{ fontFamily: "'Symtext', 'Press Start 2P', monospace", fontSize: '16px', fontWeight: 600, color: '#fff', background: 'var(--ink)', padding: '15px 38px', borderRadius: 8, marginTop: 4, textDecoration: 'none' }}
                        >
                            Get Started free
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <div id="chat-demo-container" className="w-full mt-[150px]">
                            <HeroChatDemo />
                        </div>
                    </div>
                </div>
            </div>

            <Ticker />
        </div >
    );
}