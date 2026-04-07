'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type AiClient } from '@/lib/ai-clients';
import { type AiClientApiData } from '@/lib/ai-client-data';

// ── Fallback static steps ─────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

interface HowToConnectProps {
  client: AiClient;
  otherClients: AiClient[];
  clientApiData?: AiClientApiData | null;
}

export function HowToConnect({ client, otherClients, clientApiData }: HowToConnectProps) {
  const hasJson = client.configType === 'npx';

  // Derive tab options from API data or fallback
  const urlVariants = clientApiData?.url_steps
    ? Object.entries(clientApiData.url_steps)
    : null;
  const configVariants = clientApiData?.config_steps
    ? Object.entries(clientApiData.config_steps)
    : null;

  const hasUrlTab = (urlVariants?.length ?? 0) > 0;
  const hasConfigTab = (configVariants?.length ?? 0) > 0;

  // If API data available, default to first available tab; else follow existing logic
  const defaultTab = hasConfigTab ? 'json' : 'url';
  const [tab, setTab] = useState<'url' | 'json'>(hasJson || hasConfigTab ? defaultTab : 'url');

  // Which variant is selected within a tab (for multi-variant clients)
  const [urlVariantIdx, setUrlVariantIdx] = useState(0);
  const [configVariantIdx, setConfigVariantIdx] = useState(0);

  // Render steps: dynamic (API) or static fallback
  const renderSteps = () => {
    if (tab === 'json') {
      if (configVariants?.length) {
        const [, steps] = configVariants[configVariantIdx];
        return (
          <DynamicSteps
                        steps={steps}
            variants={configVariants}
            activeIdx={configVariantIdx}
            onSelect={setConfigVariantIdx}
          />
        );
      }
      // Static fallback
      return JSON_STEPS(client.title).map((step, i) => (
        <StaticStep key={i} index={i} step={step} />
      ));
    }

    // URL tab
    if (urlVariants?.length) {
      const [, steps] = urlVariants[urlVariantIdx];
      return (
        <DynamicSteps
          steps={steps}
          variants={urlVariants}
          activeIdx={urlVariantIdx}
          onSelect={setUrlVariantIdx}
          staticCode="https://mcp.viasocket.com/mcp/YOUR_MCP_ID"
        />
      );
    }
    // Static fallback
    return URL_STEPS(client.title).map((step, i) => (
      <StaticStep key={i} index={i} step={step} />
    ));
  };

  const showTabs = hasJson || hasUrlTab || hasConfigTab;
  const showJsonPanel = tab === 'json' && !configVariants?.length;

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
            {showTabs && (
              <div className="htc-tabs">
                {(hasUrlTab || !hasConfigTab) && (
                  <button
                    className={`htc-tab${tab === 'url' ? ' active' : ''}`}
                    onClick={() => setTab('url')}
                  >
                    URL Method
                  </button>
                )}
                {(hasJson || hasConfigTab) && (
                  <button
                    className={`htc-tab${tab === 'json' ? ' active' : ''}`}
                    onClick={() => setTab('json')}
                  >
                    JSON Config
                  </button>
                )}
              </div>
            )}

            <div className="htc-spine">
              {renderSteps()}
            </div>
          </div>

          {/* Right: JSON panel (only for static fallback json tab) */}
          {showJsonPanel && (
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

// ── Sub-components ────────────────────────────────────────────────────────────

function StaticStep({ index, step }: { index: number; step: { title: string; detail: string; code?: string } }) {
  return (
    <div className="htc-node">
      <div className="htc-node-num-col">
        <span className="htc-node-num">{index + 1}</span>
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
  );
}

function DynamicSteps({
  steps,
  variants,
  activeIdx,
  onSelect,
  staticCode,
}: {
  steps: string[];
  variants: [string, string[]][];
  activeIdx: number;
  onSelect: (i: number) => void;
  staticCode?: string;
}) {
  return (
    <>
      {/* Variant sub-tabs (only if more than one variant) */}
      {variants.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {variants.map(([name], i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                padding: '5px 14px',
                borderRadius: 100,
                border: '1.5px solid',
                borderColor: i === activeIdx ? '#068F57' : 'rgba(10,10,10,0.15)',
                background: i === activeIdx ? 'rgba(6,143,87,0.08)' : 'transparent',
                fontFamily: 'var(--body)',
                fontSize: 12,
                fontWeight: i === activeIdx ? 600 : 400,
                color: i === activeIdx ? '#068F57' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Steps */}
      {steps.map((stepText, i) => {
        const { text, code } = parseStep(stepText);
        return (
          <div key={i} className="htc-node">
            <div className="htc-node-num-col">
              <span className="htc-node-num">{i + 1}</span>
              <div className="htc-node-line" />
            </div>
            <div className="htc-node-text">
              <div className="htc-node-detail" style={{ color: 'var(--ink)', fontSize: 14 }}>
                {text}
              </div>
              {code && (
                <div className="htc-code-wrap" style={{ marginTop: 10 }}>
                  <pre className="htc-code" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{code}</pre>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {staticCode && (
        <div className="htc-code-wrap" style={{ marginTop: 10 }}>
          <pre className="htc-code">{staticCode}</pre>
        </div>
      )}
    </>
  );
}

// ── Step parser ───────────────────────────────────────────────────────────────
// Extracts embedded JSON or URLs from a step string so they can be rendered
// in a code block separate from the prose text.

function parseStep(stepText: string): { text: string; code?: string } {
  // Detect embedded JSON object: find first { and last }
  const jsonStart = stepText.indexOf('{');
  const jsonEnd = stepText.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    const raw = stepText.slice(jsonStart, jsonEnd + 1);
    const text = stepText.slice(0, jsonStart).trim().replace(/:$/, '');
    let code = raw;
    try {
      code = JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      // leave as-is if not valid JSON
    }
    return { text, code };
  }

  // Detect a URL (https://...)
  const urlMatch = stepText.match(/(https?:\/\/\S+)/);
  if (urlMatch) {
    const url = urlMatch[1].replace(/[.,;)]+$/, ''); // strip trailing punctuation
    const text = stepText.replace(urlMatch[1], '').replace(/\s{2,}/g, ' ').trim();
    return { text, code: url };
  }

  return { text: stepText };
}
