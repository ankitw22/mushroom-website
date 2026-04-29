import React from 'react';
import type { UseCaseCard } from '@/lib/mcp-app-data';

export function McpUseCases({ cards }: { cards: UseCaseCard[] }) {
  if (!cards.length) return null;

  return (
    <section
      id="use-cases"
      style={{ padding: '0px 48px 240px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 3.4vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.3,
          }}
        >
          USE CASES YOUR <span style={{ color: '#068F57' }}>AI CAN EXECUTE.</span>
        </h2>
      </div>

      <div
        className="grid grid-cols-3 max-[1200px]:grid-cols-2 max-[540px]:grid-cols-1"
        style={{ gap: 16, maxWidth: 1100, margin: '0 auto' }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              background: '#fff',
              border: '2px dashed #068F57',
              borderRadius: 14,
              padding: '28px 26px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              minHeight: 180,
            }}
          >
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13,
                color: 'rgba(10,10,10,0.55)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
