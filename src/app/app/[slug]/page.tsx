import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import EventsTabs from './EventsTabs';
import { Marquee } from '@/components/ui/Marquee';

export const runtime = 'edge';

// MCP clients list - same as displayed in Hero section's Ticker
// Using thingsofbrand.com API for icons
const MCP_CLIENTS = [
  { name: 'Claude', col: '#D4845A', domain: 'claude.ai' },
  { name: 'ChatGPT', col: '#74AA9C', domain: 'chatgpt.com' },
  { name: 'Cursor', col: '#aaa', domain: 'cursor.com' },
  { name: 'Windsurf', col: '#4D9FE8', domain: 'codeium.com' },
  { name: 'Gemini', col: '#8B9CF6', domain: 'gemini.google.com' },
  { name: 'Copilot', col: '#0078D4', domain: 'github.com' },
  { name: 'Continue', col: '#FF6B35', domain: 'continue.dev' },
  { name: 'Cline', col: '#E24444', domain: 'cline.bot' },
  { name: 'Zed', col: '#7744DD', domain: 'zed.dev' },
  { name: 'Cody', col: '#FF5959', domain: 'sourcegraph.com' },
  { name: 'Amp', col: '#FFCC00', domain: 'amp.dev' },
];

const RECOMMEND_API = 'https://plug-service.viasocket.com/api/v1/plugins/recommend/integrations?service=';

interface PluginEvent {
  rowid: string;
  name: string;
  description: string;
  type: 'action' | 'trigger';
  preposition: string | null;
}

interface Plugin {
  rowid: string;
  name: string;
  description: string;
  appslugname: string;
  iconurl: string;
  category: string[];
  domain: string;
  brandcolor: string | null;
  autonumber: number;
  events: PluginEvent[];
}

interface Combination {
  description: string;
  trigger: { name: string; id: string };
  actions: { name: string; id: string }[];
  score: number;
}

interface ApiResponse {
  combinations: Combination[];
  plugins: Record<string, Plugin>;
}

function AppIcon({ app, size = 40 }: { app: Plugin; size?: number }) {
  const bg = app.brandcolor && app.brandcolor !== '#fff' && app.brandcolor !== '#ffffff'
    ? app.brandcolor : '#888';
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: size * 0.22, overflow: 'hidden',
        background: bg, flexShrink: 0,
      }}
    >
      {app.iconurl ? (
        <Image src={app.iconurl} alt={app.name} width={size} height={size}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
      ) : (
        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: size * 0.35, fontWeight: 700, color: '#fff' }}>
          {app.name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function ChatMockup({ app }: { app: Plugin }) {
  return (
    <div style={{
      background: '#1a1a1a', borderRadius: 14, overflow: 'hidden',
      width: '100%', maxWidth: 360, boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
      border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
    }}>
      <div style={{ background: '#2a2a2a', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>AI AGENT</span>
      </div>
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#52c49a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="#0a0a0a" strokeWidth="1.8" style={{ width: 12, height: 12 }}><circle cx="8" cy="6" r="3"/><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5"/></svg>
          </span>
          <div style={{ background: '#2a2a2a', borderRadius: '0 10px 10px 10px', padding: '8px 12px', maxWidth: 200 }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>What can I help you with?</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ background: '#0a0a0a', borderRadius: '10px 0 10px 10px', padding: '8px 12px', maxWidth: 200 }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: '#fff', margin: 0, lineHeight: 1.5 }}>I want to use {app.name} with my AI agent.</p>
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>You</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#52c49a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="#0a0a0a" strokeWidth="1.8" style={{ width: 12, height: 12 }}><circle cx="8" cy="6" r="3"/><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5"/></svg>
          </span>
          <div style={{ background: '#2a2a2a', borderRadius: '0 10px 10px 10px', padding: '6px 10px' }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>Agent · MCP Tool Options</p>
            <div style={{ background: '#1a1a1a', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(82,196,154,0.3)' }}>
              <AppIcon app={app} size={20} />
              <div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, fontWeight: 600, color: '#52c49a', margin: 0 }}>{app.events[0]?.name ?? `Use ${app.name}`}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Action in Progress…</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 4, background: '#2a2a2a', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Message your agent…</span>
          <svg viewBox="0 0 24 24" fill="#52c49a" style={{ width: 16, height: 16 }}><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#52c49a" strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const res = await fetch(`${RECOMMEND_API}${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) notFound();

  const data: ApiResponse = await res.json();
  const app = data.plugins[slug];
  if (!app) notFound();

  const actions = app.events.filter(e => e.type === 'action');
  const triggers = app.events.filter(e => e.type === 'trigger');

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{ margin: '10px 10px 0' }}>
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#52c49a', minHeight: 360 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 52px' }}>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(10,10,10,0.55)', marginBottom: 28 }}>
              <Link href="/" style={{ color: 'rgba(10,10,10,0.55)', textDecoration: 'none' }}>Home</Link>
              <span style={{ opacity: 0.5 }}>/</span>
              <Link href="/#integrations" style={{ color: 'rgba(10,10,10,0.55)', textDecoration: 'none' }}>Mushrooms</Link>
              <span style={{ opacity: 0.5 }}>/</span>
              <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{app.name}</span>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 40, justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: 520 }}>
                <div style={{ marginBottom: 14 }}>
                  <AppIcon app={app} size={52} />
                </div>
                <h1 style={{ fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 'clamp(26px,3.8vw,52px)', fontWeight: 400, color: '#0a0a0a', lineHeight: 1.2, letterSpacing: '-1px', marginBottom: 14, textTransform: 'uppercase' }}>
                  MCP SERVER<br />FOR<br />{app.name.toUpperCase()}
                </h1>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(10,10,10,0.5)', marginBottom: 10 }}>
                  {app.domain}
                </p>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: 'rgba(10,10,10,0.7)', lineHeight: 1.65, marginBottom: 24 }}>
                  Connect {app.name} actions with AI tools like ChatGPT, Claude, and Cursor using the Mushrooms MCP Server.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Link href="https://app.mushroom.viasocket.com/login" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', background: '#0a0a0a', color: '#fff', fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 'clamp(9px,1vw,11px)', letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 8, whiteSpace: 'nowrap' }}>
                    Get Your Cluster URL →
                  </Link>
                  {(app.category ?? []).slice(0, 3).map(cat => (
                    <span key={cat} style={{ padding: '6px 14px', borderRadius: 100, background: 'rgba(10,10,10,0.1)', fontFamily: "'Poppins',sans-serif", fontSize: 12, color: 'rgba(10,10,10,0.65)', whiteSpace: 'nowrap' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <ChatMockup app={app} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EVENTS (client component for tab interactivity) ── */}
      <EventsTabs actions={actions} triggers={triggers} />



      {/* ── WORKS WITH (MCP Clients) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px 0' }}>
        <h2 style={{ fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 'clamp(18px,2.5vw,30px)', color: '#0a0a0a', lineHeight: 1.3, marginBottom: 28 }}>
          Works with
        </h2>
        <Marquee speed={7} gap={12} pauseOnHover={true}>
          {MCP_CLIENTS.map(client => (
            <div key={client.name}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: '#fff', border: '1.5px solid rgba(10,10,10,0.07)', borderRadius: 12, flexShrink: 0 }}
            >
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 28, 
                height: 28, 
                borderRadius: 6, 
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <Image
                  src={`https://thingsofbrand.com/api/icon/${client.domain}`}
                  alt={client.name}
                  width={28}
                  height={28}
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </span>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', whiteSpace: 'nowrap' }}>{client.name}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1200, margin: '72px auto 0', padding: '0 48px 96px' }}>
        <div style={{ background: '#0a0a0a', borderRadius: 16, padding: '52px 52px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 'clamp(16px,2.2vw,26px)', color: '#fff', lineHeight: 1.35, marginBottom: 10 }}>
              Connect {app.name} to your AI
            </h2>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 480 }}>
              Get your MCP endpoint and start automating {app.name} with any AI client in under 2 minutes.
            </p>
          </div>
          <Link href="https://app.mushroom.viasocket.com/login" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#52c49a', color: '#0a0a0a', fontFamily: "'Symtext','Press Start 2P',monospace", fontSize: 12, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Get Your Cluster URL →
          </Link>
        </div>
      </section>

    </div>
  );
}
