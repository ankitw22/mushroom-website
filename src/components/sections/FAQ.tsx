'use client';

import { useState, useEffect, useRef } from 'react';

const FAQ_ITEMS = [
  {
    id: 'mcp',
    question: 'What is MCP?',
    answer:
      'MCP (Model Context Protocol) is an open standard that lets AI models connect to external tools and take real-world actions. In Mushrooms, each Cluster you create gets its own MCP server URL — paste it into your AI client and your AI instantly has access to every Power-Up you\'ve connected.',
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
    answer:
      'Yes — Mushrooms is free to use. Connect your AI client, add Power-Ups, and start giving your AI real-world actions at no cost. Full access, no credit card required.',
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
    <section ref={sectionRef} className="py-15 px-12 pb-[120px] max-w-[1200px] mx-auto max-[768px]:px-5 max-[768px]:pb-20" id="faq">
      <div className="reveal text-left mb-10">
        <h2 className="font-[var(--pixel)] text-[clamp(22px,3.4vw,40px)] text-[var(--ink)] leading-tight">
          EVERYTHING YOU <span className="text-[#068F57]">NEED TO KNOW.</span>
        </h2>
      </div>

      <div className="reveal grid grid-cols-1 gap-3 max-w-[1200px] mx-auto" data-delay="1">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.id}
            id={item.id}
            onClick={() => toggleFaq(item.id)}
            className={`bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden transition-colors cursor-pointer hover:border-[#c8d4e0] ${
              openId === item.id ? 'border-[#068F57]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-4 py-5 px-[22px]">
              <span className="font-[var(--body)] text-sm font-semibold text-[var(--ink)] leading-snug">
                {item.question}
              </span>
              <span
                className={`w-[26px] h-[26px] rounded-full border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 transition-all text-[rgba(10,10,10,0.4)] text-base leading-none font-light ${
                  openId === item.id
                    ? 'bg-[var(--green)] border-[#068F57] text-[var(--ink)] rotate-45'
                    : ''
                }`}
              >
                +
              </span>
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-350 ease-out ${
                openId === item.id ? 'max-h-[200px]' : 'max-h-0'
              }`}
            >
              <div className="py-0 px-[22px] pb-5 font-[var(--body)] text-[13px] text-[var(--ink)] leading-relaxed border-t border-[#f1f5f9] pt-4">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
