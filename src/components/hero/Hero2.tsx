'use client';

import Link from 'next/link';
import Ticker from './Ticker';
import { useAppsCount } from '@/context/AppsCountContext';
import { INTEGRATION_APPS } from '@/config/brand-icons';
import HeroChatDemo from '@/components/hero/HeroChatDemo';
import HeroCanvas2 from './HeroCanvas2';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import type { HeroContent } from '@/lib/hero-content';

interface Hero2Props {
    content: HeroContent;
}

export default function Hero2({ content }: Hero2Props) {
    const { displayCount } = useAppsCount();
    const [, setRandomApps] = useState<typeof INTEGRATION_APPS[number][]>([]);

    useEffect(() => {
        const shuffled = [...INTEGRATION_APPS].sort(() => 0.5 - Math.random());
        setRandomApps(shuffled.slice(0, 4));

        const interval = setInterval(() => {
            const newShuffled = [...INTEGRATION_APPS].sort(() => 0.5 - Math.random());
            setRandomApps(newShuffled.slice(0, 4));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Replace {count} placeholder with the live app count
    const subtitleSuffix = content.subtitleSuffix.replace('{count}', displayCount);

    return (
        <div
            className="hero relative min-h-screen rounded-2xl m-[10px]"
            style={{
                minHeight: content.minHeightBase,
                background: content.bgColor,
                overflow: 'hidden',
            }}
        >
            <style>{`
                @media (min-width: 640px)  { .hero { min-height: ${content.minHeightSm}; } }
                @media (min-width: 768px)  { .hero { min-height: ${content.minHeightMd}; } }
                @media (min-width: 1024px) { .hero { min-height: ${content.minHeightLg}; } }
                #chat-demo-container { margin-top: ${content.chatDemoMarginTopMobile}; }
                @media (min-width: 640px)  { #chat-demo-container { margin-top: ${content.chatDemoMarginTopSm}; } }
                @media (min-width: 1024px) { #chat-demo-container { margin-top: ${content.chatDemoMarginTopLg}; } }
            `}</style>

            <HeroCanvas2 />

            <div
                id="hero-content"
                className="relative z-10 flex flex-col items-center justify-start w-full h-full px-4 sm:px-6 pb-16"
                style={{ paddingTop: content.containerPaddingTop }}
            >
                <div
                    id="hero-left"
                    className="flex-none w-full"
                    style={{ paddingTop: content.contentPaddingTopVh }}
                >
                    <div id="hero-copy" className="flex flex-col items-center gap-3 sm:gap-4 text-center pointer-events-none">

                        {/* Title */}
                        <h1
                            id="hero-title"
                            className="animate-pop-in w-full px-2"
                            style={{
                                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                                fontSize: `clamp(${content.titleSizeMin}, ${content.titleSizeVw}, ${content.titleSizeMax})`,
                                fontWeight: 400,
                                color: content.titleColor,
                                lineHeight: 1,
                                letterSpacing: 'clamp(-2px, -0.5vw, -1px)',
                                wordBreak: 'break-word',
                            }}
                        >
                            {content.title}
                        </h1>

                        {/* Subtitle */}
                        <div
                            id="hero-sub"
                            className="w-full max-w-[700px] animate-fade-up px-3 sm:px-2"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: `clamp(${content.subtitleSizeMin}, ${content.subtitleSizeVw}, ${content.subtitleSizeMax})`,
                                fontWeight: 600,
                                color: content.subtitleColor,
                                lineHeight: 1.5,
                            }}
                        >
                            <span style={{ color: content.subtitleMutedColor, fontWeight: 200 }}>
                                {content.subtitlePrefix}
                            </span>
                            {' '}{content.subtitleHighlight}{' '}
                            <span style={{ color: content.subtitleMutedColor, fontWeight: 200 }}>
                                {subtitleSuffix}
                            </span>
                        </div>

                        {/* CTA */}
                        <Link
                            href={content.ctaHref}
                            id="hero-cta"
                            className="inline-flex items-center gap-2 pointer-events-auto animate-fade-up-delay transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
                            style={{
                                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                                fontSize: `clamp(${content.ctaSizeMin}, ${content.ctaSizeVw}, ${content.ctaSizeMax})`,
                                fontWeight: 600,
                                color: content.ctaTextColor,
                                background: content.ctaBgColor,
                                padding: 'clamp(12px, 2.5vw, 15px) clamp(24px, 5vw, 38px)',
                                borderRadius: 8,
                                marginTop: 4,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {content.ctaText}
                            <ArrowRight className="inline-block flex-shrink-0" size={14} />
                        </Link>

                        <div id="chat-demo-container" className="w-full">
                            <HeroChatDemo />
                        </div>

                    </div>
                </div>
            </div>

            <Ticker />
        </div>
    );
}
