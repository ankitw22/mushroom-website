'use client';

const AI_LIST = [
  { name: 'Claude', sym: '✳', col: '#D4845A' },
  { name: 'ChatGPT', sym: '◎', col: '#74AA9C' },
  { name: 'Cursor', sym: '⬡', col: '#aaa' },
  { name: 'Windsurf', sym: '◈', col: '#4D9FE8' },
  { name: 'Gemini', sym: '✦', col: '#8B9CF6' },
  { name: 'Copilot', sym: '⊕', col: '#0078D4' },
  { name: 'Continue', sym: '▷', col: '#FF6B35' },
  { name: 'Cline', sym: '◆', col: '#E24444' },
  { name: 'Zed', sym: '⬢', col: '#7744DD' },
  { name: 'Cody', sym: '✿', col: '#FF5959' },
  { name: 'Amp', sym: '⚡', col: '#FFCC00' },
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
            <span className="t-icon text-2xl" style={{ color: ai.col }}>
              {ai.sym}
            </span>
            {ai.name}
          </span>
        ))}
      </div>
    </div>
  );
}
