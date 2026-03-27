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

export default function EventsTabs({ actions, triggers }: EventsTabsProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'triggers'>('actions');
  const displayed = activeTab === 'actions' ? actions : triggers;

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 'clamp(18px,2.5vw,30px)', color: '#0a0a0a', lineHeight: 1.3, marginBottom: 6 }}>
            Supported Events
          </h2>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: 'rgba(10,10,10,0.5)' }}>
            {actions.length} actions · {triggers.length} triggers available
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(10,10,10,0.06)', borderRadius: 10, padding: 4 }}>
          {(['actions', 'triggers'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: "'Poppins',sans-serif", fontSize: 13,
                fontWeight: activeTab === tab ? 700 : 400,
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#068F57' : 'rgba(10,10,10,0.5)',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'actions' ? actions.length : triggers.length})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 12 }}>
        {displayed.map(ev => (
          <div key={ev.rowid} style={{ background: '#fff', border: '1.5px solid rgba(10,10,10,0.07)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: activeTab === 'actions' ? 'rgba(6,143,87,0.1)' : 'rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {activeTab === 'actions' ? (
                <svg viewBox="0 0 16 16" fill="none" stroke="#068F57" strokeWidth="1.8" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" style={{ width: 14, height: 14, opacity: 0.5 }}>
                  <circle cx="8" cy="8" r="5" /><path d="M8 5v3l2 2" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: '#0a0a0a', marginBottom: 4 }}>{ev.name}</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6 }}>{ev.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
