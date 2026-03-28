import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Plugin {
  name: string;
  iconurl: string;
  domain: string;
}

interface McpHeroProps {
  app: Plugin;
}

export function McpHero({ app }: McpHeroProps) {
  return (
    <div className="mcp-hero-section">
      <div className="hero-inner">
        <div className="hero-left">
          <nav className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(10,10,10,0.5)', marginBottom: 24 }}>
            <Link href="/" style={{ color: 'rgba(10,10,10,0.5)', textDecoration: 'none' }}>Home</Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <Link href="/#integrations" style={{ color: 'rgba(10,10,10,0.5)', textDecoration: 'none' }}>Mushrooms(MCP)</Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{app.name}</span>
          </nav>

          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            {app.iconurl ? (
              <Image src={app.iconurl} alt={app.name} width={32} height={32} unoptimized />
            ) : (
              <span style={{ fontSize: 20, fontWeight: 700 }}>{app.name.charAt(0)}</span>
            )}
          </div>

          <h1 className="hero-title">
            MCP SERVER<br />FOR<br />{app.name.toUpperCase()}
          </h1>
          <p className="hero-sub">
            Connect {app.name} actions with AI tools like ChatGPT, Claude, and Cursor using the Mushrooms MCP Server.
          </p>
          <Link href="https://app.mushroom.viasocket.com/login" target="_blank" className="hero-cta">
            Get Your Cluster URL
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" />
            </svg>
          </Link>
        </div>

        <div className="hero-right">
          <McpChatMockup appName={app.name} />
        </div>
      </div>
    </div>
  );
}

function McpChatMockup({ appName }: { appName: string }) {
  return (
    <div className="mcp-chat-window">
      <div className="chat-titlebar">
        <div style={{ display: 'flex', gap: 5 }}>
          <span className="chat-dot chat-dot-r"></span>
          <span className="chat-dot chat-dot-y"></span>
          <span className="chat-dot chat-dot-g"></span>
        </div>
        <span style={{ fontFamily: 'var(--pixel)', fontSize: 8, color: 'rgba(255,255,255,0.5)', marginLeft: 4, letterSpacing: '0.04em' }}>AI AGENT</span>
      </div>
      <div className="chat-messages">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AI</div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(10,10,10,0.35)', marginBottom: 4 }}>AI Agent</div>
            <div className="chat-bubble chat-bubble-ai">What can I help you with?</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>You</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(10,10,10,0.35)', marginBottom: 4 }}>You</div>
            <div className="chat-bubble chat-bubble-user">I want to use {appName} with my AI agent.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AI</div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(10,10,10,0.35)', marginBottom: 4 }}>AI Agent · MCP Tool Calling…</div>
            <div className="chat-tool-call">
              <div style={{ width: 22, height: 22, background: 'var(--green-dark)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="10" height="10" rx="2" /><path d="M4 6h4M6 4v4" /></svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--green-dark)', fontWeight: 600 }}>Use {appName}</div>
                <div style={{ fontFamily: 'var(--body)', fontSize: 10, color: 'rgba(10,10,10,0.4)' }}>Action in Progress…</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', marginLeft: 'auto' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
