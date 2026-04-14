'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type AiClient, getIconDomain } from '@/lib/ai-clients';

interface AppClientHeroProps {
  client: AiClient;
  appName: string;
  appIcon: string;
}

export function AppClientHero({ client, appName, appIcon }: AppClientHeroProps) {
  const clientDomain = getIconDomain(client);

  return (
    <div style={{ margin: 10 }}>
      <section className="client-hero" style={{ alignItems: 'flex-start', justifyContent: 'center', padding: 0 }}>
        <nav className="client-hero-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href={`/google-sheets/${client.id}`}>{client.title}</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{appName}</span>
        </nav>

        <div className="client-hero-inner" style={{ padding: '100px 48px 80px' }}>
          {/* Dual pill: Client × App */}
          <div className="client-pill" style={{ marginBottom: 20 }}>
            <span style={{ width: 22, height: 22, borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,10,0.06)', flexShrink: 0 }}>
              {clientDomain ? (
                <Image src={`/api/icon/${clientDomain}`} alt={client.title} width={22} height={22} unoptimized />
              ) : (
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--body)', color: '#555' }}>{client.title.charAt(0)}</span>
              )}
            </span>
            <span style={{ fontFamily: 'var(--body)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{client.title}</span>
            <span style={{ fontFamily: 'var(--body)', fontSize: 13, color: 'rgba(10,10,10,0.4)', margin: '0 2px' }}>×</span>
            <span style={{ width: 22, height: 22, borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,10,0.06)', flexShrink: 0 }}>
              {appIcon ? (
                <Image src={appIcon} alt={appName} width={22} height={22} unoptimized />
              ) : (
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--body)', color: '#555' }}>{appName.charAt(0)}</span>
              )}
            </span>
            <span style={{ fontFamily: 'var(--body)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{appName}</span>
          </div>

          <h1 className="client-hero-title">
            Connect {client.title} to {appName}
          </h1>

          <p className="client-hero-sub">
            Let {client.title} read data, take actions, and automate workflows in {appName} — directly from your conversation.
          </p>

          <Link href="https://app.mushrooms.viasocket.com/login" className="client-hero-cta">
            GET YOUR MCP SERVER URL
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h8M6 2.5L9.5 6 6 9.5" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
