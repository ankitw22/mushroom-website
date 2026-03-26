'use client';

import { useEffect, useRef, useState } from 'react';

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

function PixelEdge({ position }: { position: 'top' | 'bottom' }) {
  const [pixels, setPixels] = useState<Array<{ x: number; y: number }>>([]);
  
  useEffect(() => {
    const generatePixels = () => {
      const SZ = 32;
      const w = window.innerWidth;
      const MAX_ROWS = window.innerWidth <= 540 ? 4 : window.innerWidth <= 768 ? 5 : 7;
      const cols = Math.ceil(w / SZ) + 1;
      const midCol = cols / 2;
      const newPixels: Array<{ x: number; y: number }> = [];

      for (let col = 0; col < cols; col++) {
        const edgeness = Math.abs(col - midCol) / midCol;
        const rowCount = Math.round(1 + edgeness * edgeness * (MAX_ROWS - 1));

        for (let row = 0; row < rowCount; row++) {
          let prob = ((rowCount - row) / rowCount) * 0.85;
          if (row === 0) prob = 0.95;
          if (Math.random() < prob) {
            const x = col * SZ;
            const y = position === 'bottom' ? row * SZ : (MAX_ROWS - 1 - row) * SZ;
            newPixels.push({ x, y });
          }
        }
      }
      setPixels(newPixels);
    };

    generatePixels();
    window.addEventListener('resize', generatePixels);
    return () => window.removeEventListener('resize', generatePixels);
  }, [position]);

  return (
    <div 
      className={`pixel-edge-${position} absolute left-0 right-0 overflow-hidden pointer-events-none z-[2]`}
      style={{
        height: '224px',
        [position === 'top' ? 'top' : 'bottom']: '-224px',
      }}
    >
      {pixels.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: 32,
            height: 32,
            background: 'var(--green)',
          }}
        />
      ))}
    </div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <div ref={sectionRef} className="pixel-band relative w-full" id="green-band" style={{ background: 'var(--green)', padding: '60px 48px' }}>
      <PixelEdge position="top" />
      <PixelEdge position="bottom" />
      
      <section className="section-features" id="features" style={{ paddingTop: 256, paddingBottom: 80, maxWidth: 1200, margin: '0 auto' }}>
        <div className="features-header reveal text-center mb-[52px]">
          <h2 
            className="features-headline leading-tight"
            style={{
              fontFamily: "'Symtext', 'Press Start 2P', monospace",
              fontSize: 'clamp(28px, 3.8vw, 48px)',
              color: 'var(--ink)',
              marginBottom: 0,
            }}
          >
            Don&apos;t just chat,
            <br />
            <span className="text-white">Put your AI to work</span>
          </h2>
        </div>

        <div className="features-grid grid grid-cols-3 gap-4 max-w-[1100px] mx-auto max-[1200px]:grid-cols-2 max-[540px]:grid-cols-1" style={{gap:'16px'}}>
          {FEATURES.slice(0, 3).map((f, idx) => (
            <div
              key={idx}
              className={`feature-card reveal bg-white border-[3px] border-[#068F57] rounded-[14px] py-6 px-6 pb-7 transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_32px_rgba(6,143,87,0.15)] ${
                idx === 2 ? 'max-[1200px]:col-span-full max-[1200px]:max-w-[calc(50%-8px)] max-[1200px]:mx-auto max-[540px]:col-auto max-[540px]:max-w-none max-[540px]:mx-0' : ''
              }`}
              data-delay={idx}
            >
              <h3 
                className="feature-title mb-2.5"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(16px, 1.6vw, 22px)',
                  fontWeight: 700,
                  color: '#068F57',
                }}
              >
                {f.title}
              </h3>
              <p 
                className="feature-desc"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(10,10,10,0.7)',
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
          <div className="features-bottom col-span-full flex justify-center gap-4 max-[1200px]:flex-col" style={{gap:'16px'}}>
            {FEATURES.slice(3).map((f, idx) => (
              <div
                key={idx}
                className="feature-card reveal flex-1 max-w-[calc(33.333%-10px)] bg-white border-[3px] border-[#068F57] rounded-[14px] py-6 px-6 pb-7 transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_32px_rgba(6,143,87,0.15)] max-[1200px]:max-w-none"
                data-delay={idx + 3}
              >
                <h3 
                  className="feature-title mb-2.5"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(16px, 1.6vw, 22px)',
                    fontWeight: 700,
                    color: '#068F57',
                  }}
                >
                  {f.title}
                </h3>
                <p 
                  className="feature-desc"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '14px',
                    color: 'rgba(10,10,10,0.7)',
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section pt-[100px] pb-[60px] px-6 max-w-[1200px] mx-auto max-[768px]:pt-[60px]">
        <div className="how-header text-center mb-[56px]">
          <h2 
            className="section-headline leading-tight mb-2.5"
            style={{
              fontFamily: "'Symtext', 'Press Start 2P', monospace",
              fontSize: 'clamp(22px, 3.4vw, 40px)',
              color: 'var(--ink)',
            }}
          >
            AI THAT DOESN&apos;T JUST RESPOND.
            <br />
            <span className="text-white">IT EXECUTES.</span>
          </h2>
          <p 
            className="section-sub max-w-none mx-auto text-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: 'var(--ink)',
              lineHeight: 1.65,
            }}
          >
            Mushrooms connects your AI to real-world tools and translates intent into controlled actions.
          </p>
        </div>

        {/* Stepper - hidden on mobile */}
        <div className="how-stepper flex items-end relative mb-0 max-[768px]:hidden">
          <div className="absolute top-[26px] left-[calc((100%-144px)/6)] right-[calc((100%-144px)/6)] h-0.5 bg-[rgba(255,255,255,0.3)] z-0" />
          {HOW_STEPS.map((_, idx) => (
            <div key={idx} className="how-step flex-1 flex justify-center relative z-[1]">
              <div 
                className="how-step-circle w-[52px] h-[52px] rounded-[14px] bg-[var(--green)] text-white flex items-center justify-center mb-3.5"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  boxShadow: '0 0 0 4px var(--cream)',
                }}
              >
                {idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="how-cards flex items-stretch gap-0 bg-none rounded-none overflow-visible max-[768px]:flex-col max-[768px]:gap-4">
          {HOW_STEPS.map((step, idx) => (
            <div key={idx} className="contents">
              <div
                className="how-card reveal flex-1 min-w-0 py-11 px-10 pb-[52px] flex flex-col gap-4 bg-white rounded-2xl max-[768px]:py-8 max-[768px]:px-7 max-[768px]:pb-9"
                data-delay={idx}
              >
                <div 
                  className="how-card-title"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#068F57',
                    lineHeight: 1.15,
                  }}
                >
                  {step.title}
                </div>
                <div 
                  className="how-card-desc"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '15px',
                    color: 'var(--ink)',
                    lineHeight: 1.65,
                  }}
                >
                  {step.desc}
                </div>
              </div>
              {idx < HOW_STEPS.length - 1 && (
                <div className="how-card-arrow flex items-center justify-center flex-shrink-0 px-2 max-[768px]:hidden">
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
