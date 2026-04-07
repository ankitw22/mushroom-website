'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/mcp-app-data';

export function McpFAQ({ faqs }: { faqs: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!faqs.length) return null;

  return (
    <section
      id="faq"
      className="py-[60px] px-12 pb-[120px] max-w-[1200px] mx-auto max-[768px]:px-5 max-[768px]:pb-20"
    >
      <div className="text-left mb-10">
        <h2
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 3.4vw, 40px)',
            color: 'var(--ink)',
          }}
        >
          EVERYTHING YOU <span style={{ color: '#068F57' }}>NEED TO KNOW.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-[1200px] mx-auto">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className={`bg-white border-[1.5px] rounded-[14px] overflow-hidden transition-colors cursor-pointer hover:border-[#c8d4e0] ${
              openIdx === idx ? 'border-[#068F57]' : 'border-[#e2e8f0]'
            }`}
          >
            <div className="flex items-center justify-between gap-4 py-5 px-[22px]">
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  lineHeight: 1.4,
                }}
              >
                {item.question}
              </span>
              <span
                className={`w-[26px] h-[26px] rounded-full border flex items-center justify-center flex-shrink-0 transition-all text-base leading-none font-light ${
                  openIdx === idx
                    ? 'bg-[var(--green)] border-[#068F57] rotate-45'
                    : 'border-[#e2e8f0] text-[rgba(10,10,10,0.4)]'
                }`}
              >
                +
              </span>
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                openIdx === idx ? 'max-h-[300px]' : 'max-h-0'
              }`}
            >
              <div
                className="px-[22px] pb-5 border-t border-[#f1f5f9] pt-4"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 13,
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
