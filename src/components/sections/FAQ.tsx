'use client';

import { useState, useEffect, useRef } from 'react';

const FAQ_ITEMS: { id: string; question: string; answer: React.ReactNode }[] = [
  {
    id: 'mcp',
    question: 'What is MCP?',
    answer:
      'MCP (Model Context Protocol) is an open standard that lets AI models connect to external tools and take real-world actions. In Mushrooms, each Cluster (MCP Server) you create gets its own URL — paste it into your AI client and your AI instantly has access to every Power-Up you\'ve connected.',
  },
  {
    id: 'mushrooms',
    question: 'What is Mushrooms?',
    answer:
      'Mushrooms is a power-up layer for your AI. Connect your AI client — Claude, ChatGPT, Cursor — to the apps you use, and your AI gains the ability to actually do things in those apps. Read emails, create tasks, post messages, pull data. Not just talk about it — do it.',
  },
  {
    id: 'platforms',
    question: 'Which AI platforms does Mushrooms work with?',
    answer:
      'Mushrooms works with any AI client that supports MCP — including Claude, Cursor, and other MCP-compatible clients. More are being added continuously.',
  },
  {
    id: 'faq-free',
    question: 'Is Mushrooms free?',
    answer: (
      <>
        Yes — Mushrooms is free to use. Connect your AI client, add Power-Ups, and start giving your AI real-world actions at no cost. Full access, no credit card required.{' '}
        <a
          href="https://viasocket.com/help/viasocket-mcp?source=single"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#068F57] underline hover:text-[#056b41] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Learn more
        </a>
      </>
    ),
  },
  {
    id: 'secure',
    question: 'Is Mushrooms secure?',
    answer:
      'Yes. Every app connection uses OAuth — you authorise exactly what your AI can and can\'t do, action by action. You stay in full control. Credentials are never stored in plain text and connections can be revoked at any time.',
  },
  {
    id: 'apps',
    question: 'Which apps can I connect?',
    answer:
      '2,000+ apps including Slack, Gmail, GitHub, Notion, Linear, HubSpot, Google Calendar, Airtable, Figma, Stripe, Shopify, and more. If it has an API, it\'s very likely already supported.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

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
      className="section-faq py-[60px] px-12 pb-[120px] max-w-[1200px] mx-auto max-[768px]:px-5 max-[768px]:pb-20" 
      id="faq"
    >
      <div className="faq-header reveal text-left mb-10">
        <h2 
          className="section-headline leading-tight"
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 3.4vw, 40px)',
            color: 'var(--ink)',
          }}
        >
          EVERYTHING YOU <span className="text-[#068F57]">NEED TO KNOW.</span>
        </h2>
      </div>

      <div className="faq-grid reveal grid grid-cols-1 gap-[12px] max-w-[1200px] mx-auto" data-delay="1">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.id}
            id={item.id}
            onClick={() => toggleFaq(item.id)}
            className={`faq-card bg-white border-[1.5px] border-[#e2e8f0] rounded-[14px] overflow-hidden transition-colors cursor-pointer hover:border-[#c8d4e0] ${
              openId === item.id ? 'border-[#068F57]' : ''
            }`}
          >
            <div className="faq-question flex items-center justify-between gap-4 py-5 px-[22px]">
              <span 
                className="faq-q-text"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  lineHeight: 1.4,
                }}
              >
                {item.question}
              </span>
              <span
                className={`faq-toggle w-[26px] h-[26px] rounded-full border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 transition-all text-base leading-none font-light ${
                  openId === item.id
                    ? 'bg-[var(--green)] border-[#068F57] text-[var(--ink)] rotate-45'
                    : 'text-[rgba(10,10,10,0.4)]'
                }`}
              >
                +
              </span>
            </div>
            <div
              className={`faq-answer overflow-hidden transition-[max-height] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                openId === item.id ? 'max-h-[200px]' : 'max-h-0'
              }`}
            >
              <div 
                className="faq-answer-inner py-0 px-[22px] pb-5 border-t border-[#f1f5f9] pt-4"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '13px',
                  color: 'var(--ink)',
                  lineHeight: 1.7,
                }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
