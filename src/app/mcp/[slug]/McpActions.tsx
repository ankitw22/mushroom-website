'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Action {
  name: string;
  description: string;
}

interface McpActionsProps {
  actions: Action[];
  appIcon?: string;
  appName: string;
}

export function McpActions({ actions, appIcon, appName }: McpActionsProps) {
  const [visibleCount, setVisibleCount] = useState(8);
  const showLoadMore = visibleCount < actions.length;

  return (
    <section className="section" id="actions" style={{ padding: '72px 48px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="actions-header" style={{ marginBottom: 36 }}>
        <div className="actions-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: 'rgba(6, 143, 87, 0.1)', color: 'var(--green-dark)', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, border: '1.5px solid rgba(6, 143, 87, 0.2)', marginBottom: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-dark)', display: 'inline-block' }} />
          {actions.length} Actions Available
        </div>
        <h2 className="section-headline">Supported Actions <span style={{ color: 'var(--green-dark)' }}>✓</span></h2>
        <p className="section-sub">Add {actions.length} power ups to your AI client for seamless integration</p>
      </div>

      <div className="actions-grid">
        {actions.slice(0, visibleCount).map((action, idx) => (
          <div key={idx} className="mcp-action-card">
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              {appIcon ? (
                <Image 
                  src={appIcon} 
                  alt={appName} 
                  width={24} 
                  height={24} 
                  unoptimized 
                  style={{ width: 'auto', height: 'auto' }}
                />
              ) : (
                <div style={{ width: 24, height: 24, background: '#e2e8f0', borderRadius: 6 }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4, fontSize: 15 }}>{action.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(10, 10, 10, 0.45)', lineHeight: 1.6 }}>{action.description}</div>
            </div>
          </div>
        ))}
      </div>

      {showLoadMore && (
        <div className="load-more-row">
          <button className="load-more-btn" onClick={() => setVisibleCount(actions.length)}>
            Load More ↓
          </button>
        </div>
      )}
    </section>
  );
}
