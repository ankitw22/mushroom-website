'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

// App domain mapping for icon fetching via thingsofbrand.com API
const APP_DOMAINS: Record<string, string> = {
  gmail: 'gmail.com',
  notion: 'notion.so',
  github: 'github.com',
  slack: 'slack.com',
  linear: 'linear.app',
  hubspot: 'hubspot.com',
};

// Keywords to detect apps in card content
const APP_KEYWORDS: Record<string, string[]> = {
  gmail: ['email', 'emails', 'gmail', 'draft email', 'draft emails'],
  notion: ['notion'],
  github: ['pr', 'pull request', 'github'],
  slack: ['#engineering', '#standup', '#product', 'slack', 'post it to #', 'post the summary to #'],
  linear: ['linear', 'blocking', 'team this week'],
  hubspot: ['hubspot', 'deals'],
};

// Use cases with explicit app associations
const USE_CASES = [
  {
    apps: ['gmail', 'notion'],
    title: 'Summarise my unread emails and log the action items to Notion',
  },
  {
    apps: ['github', 'slack'],
    title: 'Summarise what changed in this PR and post it to #engineering',
  },
  {
    apps: ['linear', 'slack'],
    title: "What's blocking the team this week? Post the summary to #standup",
  },
  {
    apps: ['notion', 'gmail'],
    title: 'Draft emails to everyone in my meeting notes who has a follow-up',
  },
  {
    apps: ['hubspot', 'gmail'],
    title: "Find deals that haven't been touched in 7 days and draft a follow-up",
  },
  {
    apps: ['slack', 'notion'],
    title: 'Collect all decisions made in #product this week and write them up in Notion',
  },
];

// Get icon URL for an app using thingsofbrand.com API
function getIconUrl(appName: string): string {
  const domain = APP_DOMAINS[appName.toLowerCase()];
  if (!domain) return '';
  return `https://thingsofbrand.com/api/icon/${domain}`;
}

// App icon component with fallback
function AppIcon({ app, index }: { app: string; index: number }) {
  const iconUrl = getIconUrl(app);
  
  return (
    <div
      className="usecase-icon w-8 h-8 rounded-lg overflow-hidden border-2 border-[var(--cream)] bg-white flex items-center justify-center"
      style={{ marginLeft: index > 0 ? '8px' : 0, zIndex: 10 - index }}
    >
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={`${app} icon`}
          width={32}
          height={32}
          className="w-full h-full object-contain"
          unoptimized
        />
      )}
    </div>
  );
}

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
      style={{ padding: '40px 48px 182px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="usecases-header reveal text-left relative z-[3]" style={{ marginBottom: 48 }}>
        <h2 className="section-headline leading-tight mb-3.5 font-pixel font-normal text-[var(--ink)] text-[clamp(22px,3.4vw,40px)]">
          USE CASES YOUR <span className="text-[#068F57]">AI CAN EXECUTE.</span>
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
                {uc.apps.map((app, i) => (
                  <AppIcon key={`${app}-${i}`} app={app} index={i} />
                ))}
              </div>
            </div>
            <h3 className="usecase-title font-body text-[22px] font-bold text-[var(--ink)] leading-[1.3]">
              {uc.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
