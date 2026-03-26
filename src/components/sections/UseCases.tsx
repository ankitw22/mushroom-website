'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const USE_CASES = [
  {
    icons: [
      { bg: '#EA4335', letter: 'G' },
      { bg: '#000', letter: 'N' },
    ],
    title: 'Summarise my unread emails and log the action items to Notion',
  },
  {
    icons: [
      { bg: '#1a1a2e', letter: 'GH' },
      { bg: '#4A154B', letter: 'S' },
    ],
    title: 'Summarise what changed in this PR and post it to #engineering',
  },
  {
    icons: [
      { bg: '#5E6AD2', letter: 'L' },
      { bg: '#4A154B', letter: 'S' },
    ],
    title: "What's blocking the team this week? Post the summary to #standup",
  },
  {
    icons: [
      { bg: '#000', letter: 'N' },
      { bg: '#EA4335', letter: 'G' },
    ],
    title: 'Draft emails to everyone in my meeting notes who has a follow-up',
  },
  {
    icons: [
      { bg: '#FF7A59', letter: 'H' },
      { bg: '#EA4335', letter: 'G' },
    ],
    title: "Find deals that haven't been touched in 7 days and draft a follow-up",
  },
  {
    icons: [
      { bg: '#4A154B', letter: 'S' },
      { bg: '#000', letter: 'N' },
    ],
    title: 'Collect all decisions made in #product this week and write them up in Notion',
  },
];

export default function UseCases() {
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
    <section 
      ref={sectionRef} 
      className="section-usecases" 
      id="use-cases"
      style={{ padding: '80px 48px 182px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="usecases-header reveal text-left relative z-[3]" style={{ marginBottom: 48 }}>
        <h2 className="section-headline leading-tight mb-3.5 font-pixel font-normal text-[var(--ink)] text-[clamp(22px,3.4vw,40px)]">
          START WITH REAL <span className="text-[#068F57]">USE CASES.</span>
        </h2>
      </div>
      <div className="usecases-grid grid grid-cols-3 max-w-[1100px] mx-auto relative z-[3] max-[1200px]:grid-cols-2 max-[540px]:grid-cols-1" style={{ gap: 16 }}>
        {USE_CASES.map((uc, idx) => (
          <div
            key={idx}
            className="usecase-card reveal bg-white border-2 border-dashed border-[#068F57] rounded-[14px] py-7 px-[26px] pb-8 flex flex-col gap-3.5 min-h-[180px] transition-all hover:translate-y-[-3px] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:border-solid hover:border-[#068F57]"
            data-delay={idx % 3}
          >
            <div className="usecase-top flex items-center justify-between">
              <div className="usecase-icons flex">
                {uc.icons.map((icon, i) => (
                  <span
                    key={i}
                    className="usecase-icon w-8 h-8 rounded-lg flex items-center justify-center text-white border-2 border-[var(--cream)] font-body text-[11px] font-bold"
                    style={{ backgroundColor: icon.bg, marginLeft: i > 0 ? '-8px' : 0 }}
                  >
                    {icon.letter}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="usecase-title font-body text-[22px] font-bold text-[var(--ink)] leading-[1.3]">
              {uc.title}
            </h3>
            <Link 
              href="#" 
              className="usecase-link mt-auto font-mono text-[12px] font-medium text-[#068F57] no-underline hover:underline"
            >
              Use template →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
