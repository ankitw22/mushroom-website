'use client';

import React, { useState } from 'react';

interface PluginEvent {
  rowid: string;
  name: string;
  description: string;
  type: 'action' | 'trigger';
}

interface EventsTabsProps {
  actions: PluginEvent[];
  triggers: PluginEvent[];
}

export default function EventsTabs({ actions }: EventsTabsProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 6;
  
  const displayedActions = showAll ? actions : actions.slice(0, INITIAL_COUNT);
  const hasMore = actions.length > INITIAL_COUNT;

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px 0' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: '#0a0a0a', background: 'rgba(6,143,87,0.12)', border: '1.5px solid rgba(6,143,87,0.35)', padding: '5px 12px', borderRadius: 100, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#068F57', display: 'inline-block' }} />
          {actions.length} Actions Available
        </div>
        <h2 style={{ fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 'clamp(18px,2.5vw,30px)', color: '#0a0a0a', lineHeight: 1.3, marginBottom: 6 }}>
          Supported Actions
        </h2>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: 'rgba(10,10,10,0.5)' }}>
          Add {actions.length} power ups to your AI client for seamless integration
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 12 }}>
        {displayedActions.map(ev => (
          <div key={ev.rowid} style={{ background: '#fff', border: '1.5px solid rgba(10,10,10,0.07)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(6,143,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="#068F57" strokeWidth="1.8" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>{ev.name}</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6 }}>{ev.description}</div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !showAll && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: '1.5px solid rgba(10,10,10,0.15)',
              background: '#fff',
              cursor: 'pointer',
              fontFamily: "'Poppins',sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: '#0a0a0a',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(10,10,10,0.03)';
              e.currentTarget.style.borderColor = 'rgba(10,10,10,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = 'rgba(10,10,10,0.15)';
            }}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
