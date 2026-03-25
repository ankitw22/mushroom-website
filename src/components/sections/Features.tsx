'use client';

import { useEffect, useRef } from 'react';

const FEATURES = [
  {
    title: 'OPTIMIZED EXECUTION',
    desc: 'Less tokens. Faster responses. No bloated context windows.',
  },
  {
    title: '2,000+ INTEGRATIONS',
    desc: '2,000+ apps. No custom API wrappers. Just plug in.',
  },
  {
    title: 'SECURE CHANNEL',
    desc: 'Your data stays within your boundary. Nothing stored, nothing shared.',
  },
  {
    title: 'LOG HISTORY',
    desc: 'Every action recorded. Full visibility into what happened and when.',
  },
  {
    title: 'YOU CONTROL THE AI',
    desc: 'Granular permissions per action. Nothing runs without your approval.',
  },
];

const HOW_STEPS = [
  {
    title: 'Connect your AI',
    desc: 'One MCP URL connects any AI client — Claude, Cursor, Windsurf, ChatGPT — instantly to your stack.',
  },
  {
    title: 'Select tools & actions',
    desc: 'Choose from 2,000+ apps and define exactly what your AI can do — granular, per-action permissions.',
  },
  {
    title: 'Execute with control',
    desc: 'Every action is scoped, logged, and approved. Your AI runs with intent — nothing happens without your rules.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) {
              el.style.transitionDelay = `${parseInt(delay) * 0.13}s`;
            }
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    const section = sectionRef.current;
    if (section) {
      section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="relative bg-[var(--green)] py-15 px-12 w-full" id="green-band">
      {/* Pixel dissolve edges would go here - simplified for now */}
      
      <section className="py-[256px] pb-20 max-w-[1200px] mx-auto max-[768px]:pt-[192px] max-[540px]:pt-[160px]" id="features">
        <div className="reveal text-center mb-[52px]">
          <h2 className="font-[var(--pixel)] text-[clamp(28px,3.8vw,48px)] text-[var(--ink)] leading-tight">
            Don&apos;t just chat,
            <br />
            <span className="text-white">Put your AI to work</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[1100px] mx-auto max-[1200px]:grid-cols-2 max-[540px]:grid-cols-1">
          {FEATURES.slice(0, 3).map((f, idx) => (
            <div
              key={idx}
              className="reveal bg-white border-[3px] border-[#068F57] rounded-[14px] py-6 px-6 pb-7 transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_32px_rgba(6,143,87,0.15)] max-[1024px]:[&:nth-child(3)]:col-span-full max-[1024px]:[&:nth-child(3)]:max-w-[calc(50%-8px)] max-[1024px]:[&:nth-child(3)]:mx-auto max-[540px]:[&:nth-child(3)]:col-auto max-[540px]:[&:nth-child(3)]:max-w-none max-[540px]:[&:nth-child(3)]:mx-0"
              data-delay={idx}
            >
              <h3 className="font-[var(--body)] text-[clamp(16px,1.6vw,22px)] font-bold text-[#068F57] mb-2.5">
                {f.title}
              </h3>
              <p className="font-[var(--body)] text-sm text-[rgba(10,10,10,0.7)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
          <div className="col-span-full flex justify-center gap-4 max-[1200px]:flex-col max-[1200px]:items-stretch">
            {FEATURES.slice(3).map((f, idx) => (
              <div
                key={idx}
                className="reveal flex-1 max-w-[calc(33.333%-10px)] bg-white border-[3px] border-[#068F57] rounded-[14px] py-6 px-6 pb-7 transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_32px_rgba(6,143,87,0.15)] max-[1200px]:max-w-none"
                data-delay={idx + 3}
              >
                <h3 className="font-[var(--body)] text-[clamp(16px,1.6vw,22px)] font-bold text-[#068F57] mb-2.5">
                  {f.title}
                </h3>
                <p className="font-[var(--body)] text-sm text-[rgba(10,10,10,0.7)] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-[100px] px-6 max-w-[1200px] mx-auto max-[768px]:pt-15">
        <div className="text-center mb-14">
          <h2 className="font-[var(--pixel)] text-[clamp(22px,3.4vw,40px)] text-[var(--ink)] leading-tight mb-2.5">
            AI THAT DOESN&apos;T JUST RESPOND.
            <br />
            <span className="text-white">IT EXECUTES.</span>
          </h2>
          <p className="font-[var(--body)] text-[clamp(15px,1.5vw,18px)] text-[rgba(10,10,10,0.5)] max-w-[560px] mx-auto leading-relaxed">
            Mushrooms connects your AI to real-world tools and translates intent into controlled actions.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-end relative mb-0 max-[768px]:hidden">
          <div className="absolute top-[26px] left-[calc((100%-144px)/6)] right-[calc((100%-144px)/6)] h-0.5 bg-[rgba(255,255,255,0.3)] z-0" />
          {HOW_STEPS.map((_, idx) => (
            <div key={idx} className="flex-1 flex justify-center relative z-[1]">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-[var(--green)] text-white font-[var(--body)] text-[26px] font-bold flex items-center justify-center shadow-[0_0_0_4px_var(--cream)] mb-3.5">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="flex items-stretch gap-0 bg-none rounded-none overflow-visible max-[768px]:flex-col max-[768px]:gap-4">
          {HOW_STEPS.map((step, idx) => (
            <div key={idx} className="contents">
              <div
                className="reveal flex-1 min-w-0 py-11 px-10 pb-[52px] flex flex-col gap-4 bg-white rounded-2xl max-[768px]:py-8 max-[768px]:px-7 max-[768px]:pb-9"
                data-delay={idx}
              >
                <div className="font-[var(--body)] text-[28px] font-bold text-[#068F57] leading-tight">
                  {step.title}
                </div>
                <div className="font-[var(--body)] text-[15px] text-[var(--ink)] leading-relaxed">
                  {step.desc}
                </div>
              </div>
              {idx < HOW_STEPS.length - 1 && (
                <div className="flex items-center justify-center flex-shrink-0 px-2 max-[768px]:hidden">
                  <svg viewBox="0 0 64 44" fill="none" className="w-14 h-11 opacity-90">
                    <line x1="6" y1="15" x2="46" y2="15" stroke="white" strokeWidth="4" strokeLinecap="square" />
                    <line x1="6" y1="29" x2="46" y2="29" stroke="white" strokeWidth="4" strokeLinecap="square" />
                    <polyline
                      points="42,7 58,22 42,37"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
