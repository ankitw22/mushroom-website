'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: "What is MCP?",
    a: "MCP (Model Context Protocol) is an open standard that lets AI models connect with external tools and data — a universal bridge for AI integrations. It enables AI assistants to take real actions in your apps."
  },
  {
    q: "What is Mushrooms MCP?",
    a: "Mushrooms MCP connects your AI to 2,000+ apps through MCP, handling authentication, API limits, and security so you don't have to."
  },
  {
    q: "Can I use Mushrooms MCP with any AI platform?",
    a: "Yes. Mushrooms MCP works with any MCP-compatible client — Claude, ChatGPT, Cursor, Windsurf, GitHub Copilot, and more. One endpoint, universal compatibility."
  },
  {
    q: "Is MCP secure?",
    a: "Yes. Every MCP endpoint is secured with built-in authentication and encryption. Your data stays within your control boundary — nothing is stored or shared without your explicit permission."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-faq" id="faq" style={{ padding: '60px 48px 120px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="faq-header" style={{ marginBottom: 40 }}>
        <h2 className="section-headline">EVERYTHING YOU <span style={{ color: 'var(--green-dark)' }}>NEED TO KNOW.</span></h2>
      </div>
      <div className="faq-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQS.map((faq, idx) => (
          <div 
            key={idx} 
            className={`faq-card ${openIndex === idx ? 'open' : ''}`} 
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            style={{ 
              background: '#fff', 
              border: openIndex === idx ? '1.5px solid var(--green-dark)' : '1.5px solid #e2e8f0', 
              borderRadius: 14, 
              overflow: 'hidden', 
              cursor: 'pointer' 
            }}
          >
            <div className="faq-question" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px' }}>
              <span className="faq-q-text" style={{ fontWeight: 600, color: 'var(--ink)' }}>{faq.q}</span>
              <span className="faq-toggle" style={{ 
                width: 26, height: 26, borderRadius: '50%', border: '1.5px solid #e2e8f0', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                transform: openIndex === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' 
              }}>+</span>
            </div>
            {openIndex === idx && (
              <div className="faq-answer-inner" style={{ padding: '0 22px 20px', color: 'rgba(10, 10, 10, 0.65)', lineHeight: 1.75, borderTop: '1px solid #f1f5f9' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
