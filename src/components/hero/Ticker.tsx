'use client';

import Image from 'next/image';

// AI Clients with Simple Icons slugs (same as HeroCanvas)
// icon: null means no Simple Icons slug available, will use fallback symbol
const AI_LIST = [
  { name: 'Claude', sym: '✳', col: '#D4845A', icon: 'anthropic' },
  { name: 'ChatGPT', sym: '◎', col: '#74AA9C', icon: 'openai' },
  { name: 'Cursor', sym: '⬡', col: '#aaa', icon: 'cursor' },
  { name: 'Windsurf', sym: '◈', col: '#4D9FE8', icon: 'codeium' },
  { name: 'Gemini', sym: '✦', col: '#8B9CF6', icon: 'googlegemini' },
  { name: 'Copilot', sym: '⊕', col: '#0078D4', icon: 'githubcopilot' },
  { name: 'Continue', sym: '▷', col: '#FF6B35', icon: 'continuedev' },
  { name: 'Cline', sym: '◆', col: '#E24444', icon: null },
  { name: 'Zed', sym: '⬢', col: '#7744DD', icon: 'zedindustries' },
  { name: 'Cody', sym: '✿', col: '#FF5959', icon: 'sourcegraph' },
  { name: 'Amp', sym: '⚡', col: '#FFCC00', icon: null },
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
              className="t-icon flex items-center justify-center" 
              style={{ width: 24, height: 24 }}
            >
              {ai.icon ? (
                <Image
                  src={`https://cdn.simpleicons.org/${ai.icon}/white`}
                  alt={ai.name}
                  width={20}
                  height={20}
                  unoptimized
                />
              ) : (
                <span className="text-xl" style={{ color: ai.col }}>
                  {ai.sym}
                </span>
              )}
            </span>
            {ai.name}
          </span>
        ))}
      </div>
    </div>
  );
}
