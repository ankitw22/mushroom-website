'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type AiClient } from '@/lib/ai-clients';

const URL_STEPS = (clientTitle: string): { title: string; detail: string; code?: string }[] => [
  {
    title: 'Sign up for free',
    detail: 'Create your Mushrooms account at mushroom.viasocket.com. No credit card needed.',
  },
  {
    title: 'Copy your MCP Server URL',
    detail: 'From your dashboard, copy your cluster URL.',
    code: 'https://mcp.viasocket.com/mcp/YOUR_MCP_ID',
  },
  {
    title: `Paste into ${clientTitle}`,
    detail: `Open ${clientTitle} settings, navigate to the MCP Servers section, and paste your URL.`,
  },
];

const JSON_STEPS = (clientTitle: string): { title: string; detail: string; code?: string }[] => [
  {
    title: 'Sign up for free',
    detail: 'Create your Mushrooms account at mushroom.viasocket.com. No credit card needed.',
  },
  {
    title: 'Copy your cluster key',
    detail: 'From your Mushrooms dashboard, copy your cluster key.',
  },
  {
    title: `Add config to ${clientTitle}`,
    detail: `Open your ${clientTitle} config file and add the JSON snippet shown on the right, then restart.`,
  },
];

const JSON_PREVIEW = `{
  <span class="jk">"mcpServers"</span>: {
    <span class="jk">"mushroom"</span>: {
      <span class="jk">"url"</span>: <span class="js">"https://mcp.viasocket.com/mcp/YOUR_MCP_ID"</span>,
      <span class="jk">"transport"</span>: <span class="js">"sse"</span>
    }
  }
}`;

interface HowToConnectProps {
  client: AiClient;
  otherClients: AiClient[];
}

export function HowToConnect({ client, otherClients }: HowToConnectProps) {
  const hasJson = client.configType === 'npx';
  const [tab, setTab] = useState<'url' | 'json'>('url');

  const steps = tab === 'json' ? JSON_STEPS(client.title) : URL_STEPS(client.title);

  return (
    <div className="htc-section">
      <div className="htc-inner">
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <h2
            className="section-headline"
            style={{
              fontFamily: 'var(--pixel)',
              fontSize: 'clamp(20px, 2.8vw, 36px)',
              color: 'var(--ink)',
              marginBottom: 10,
            }}
          >
            How to Connect <span style={{ color: '#fff' }}>{client.title}</span>
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: 16, color: 'rgba(10,10,10,0.65)' }}>
            Pick your setup method — both take under two minutes.
          </p>
        </div>

        <div className="htc-card">
          {/* Left: tabs + steps */}
          <div className="htc-card-left">
            {hasJson && (
              <div className="htc-tabs">
                <button
                  className={`htc-tab${tab === 'url' ? ' active' : ''}`}
                  onClick={() => setTab('url')}
                >
                  URL Method
                </button>
                <button
                  className={`htc-tab${tab === 'json' ? ' active' : ''}`}
                  onClick={() => setTab('json')}
                >
                  JSON Config
                </button>
              </div>
            )}

            <div className="htc-spine">
              {steps.map((step, i) => (
                <div key={i} className="htc-node">
                  <div className="htc-node-num-col">
                    <span className="htc-node-num">{i + 1}</span>
                    <div className="htc-node-line" />
                  </div>
                  <div className="htc-node-text">
                    <div className="htc-node-title">{step.title}</div>
                    <div className="htc-node-detail">{step.detail}</div>
                    {step.code && (
                      <div className="htc-code-wrap">
                        <pre className="htc-code">{step.code}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: JSON panel */}
          {hasJson && tab === 'json' && (
            <div className="htc-json-panel">
              <div className="htc-json-bar">claude_desktop_config.json</div>
              <div
                className="htc-json-code"
                dangerouslySetInnerHTML={{ __html: JSON_PREVIEW }}
              />
            </div>
          )}
        </div>

        {/* Below card */}
        <div className="htc-below">
          {otherClients.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontFamily: 'var(--body)', fontSize: 12, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                Using a different AI client?
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {otherClients.slice(0, 6).map((c) => (
                  <Link key={c.id} href={`/google-sheets/${c.id}`} className="htc-client-pill">
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link href="https://app.mushroom.viasocket.com/login" className="htc-cta">
            Get your MCP Server URL
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
