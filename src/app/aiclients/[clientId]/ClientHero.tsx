'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type AiClient, getIconDomain } from '@/lib/ai-clients';
import { useAppsCount } from '@/context/AppsCountContext';

export function ClientHero({ client }: { client: AiClient }) {
  const { appsCount } = useAppsCount();
  const domain = getIconDomain(client);

  return (
    <section className="client-hero client-hero-left">
      <div className="client-hero-inner">
        <nav className="client-hero-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href="/#ai-clients">AI Clients</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{client.title}</span>
        </nav>

        <div className="client-pill">
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10,10,10,0.06)',
              flexShrink: 0,
            }}
          >
            {domain ? (
              <Image src={`/api/icon/${domain}`} alt={client.title} width={22} height={22} unoptimized />
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#555', fontFamily: 'var(--body)' }}>
                {client.title.charAt(0)}
              </span>
            )}
          </span>
          <span style={{ fontFamily: 'var(--body)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>
            {client.title}
          </span>
        </div>

        <h1 className="client-hero-title">
          Connect {client.title} to {appsCount ? `${appsCount}+` : '2,000+'} Apps
        </h1>

        <p className="client-hero-sub">
          Use {client.title} with your favourite apps via the Mushrooms MCP Server. No code required.
        </p>

        <Link href="https://app.mushrooms.viasocket.com/login" className="client-hero-cta">
          GET YOUR MCP SERVER URL
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h8M6 2.5L9.5 6 6 9.5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
