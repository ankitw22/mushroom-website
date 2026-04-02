'use client';

import Image from 'next/image';

// AI Clients with domain for icon fetching via thingsofbrand.com
const AI_LIST = [
  { name: 'Claude', sym: '✳', col: '#D4845A', domain: 'anthropic.com' },
  { name: 'ChatGPT', sym: '◎', col: '#74AA9C', domain: 'openai.com' },
  { name: 'Cursor', sym: '⬡', col: '#aaa', domain: 'cursor.com' },
  { name: 'Windsurf', sym: '◈', col: '#4D9FE8', domain: 'codeium.com' },
  { name: 'Gemini', sym: '✦', col: '#8B9CF6', domain: 'gemini.google.com' },
  { name: 'Copilot', sym: '⊕', col: '#0078D4', domain: 'github.com' },
  { name: 'Continue', sym: '▷', col: '#FF6B35', domain: 'continue.dev' },
  { name: 'Cline', sym: '◆', col: '#E24444', domain: 'cline.bot' },
  { name: 'Zed', sym: '⬢', col: '#7744DD', domain: 'zed.dev' },
  { name: 'Cody', sym: '✿', col: '#FF5959', domain: 'sourcegraph.com' },
  { name: 'Amp', sym: '⚡', col: '#FFCC00', domain: 'amp.dev' },
];

export default function Ticker() {
  // Repeat the list 3 times for seamless scrolling
  const items = [...AI_LIST, ...AI_LIST, ...AI_LIST];

  return (
    <div id="ticker" className="absolute bottom-0 left-0 right-0 h-[52px] bg-[var(--ink)] overflow-hidden flex items-center z-20">
      <div className="t-track flex items-center animate-ticker will-change-transform flex-shrink-0">
        {items.map((ai, idx) => (
          <span
            key={idx}
            className="t-item inline-flex items-center gap-[10px] px-[28px] whitespace-nowrap flex-shrink-0 font-body text-[16px] font-bold text-white"
          >
            <span 
              className="t-icon flex items-center justify-center rounded-md overflow-hidden" 
              style={{ width: 24, height: 24 }}
            >
              <Image
                src={`https://thingsofbrand.com/api/icon/${ai.domain}`}
                alt={ai.name}
                width={24}
                height={24}
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </span>
            {ai.name}
          </span>
        ))}
      </div>
    </div>
  );
}
