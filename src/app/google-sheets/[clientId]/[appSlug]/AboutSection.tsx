import Image from 'next/image';
import Link from 'next/link';
import { type AiClient, getIconDomain } from '@/lib/ai-clients';

interface AboutSectionProps {
  client: AiClient;
  appName: string;
  appIcon: string;
  appDescription: string;
  appDomain: string;
}

export function AboutSection({ client, appName, appIcon, appDescription, appDomain }: AboutSectionProps) {
  const clientDomain = getIconDomain(client);

  return (
    <section className="about-section">
      <h2
        style={{
          fontFamily: 'var(--pixel)',
          fontSize: 'clamp(20px, 2.5vw, 32px)',
          color: 'var(--ink)',
          textAlign: 'center',
        }}
      >
        About <span style={{ color: '#068F57' }}>{client.title} + {appName}</span>
      </h2>

      <div className="about-grid">
        {/* Client card */}
        <div className="about-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,10,0.06)', flexShrink: 0 }}>
              {clientDomain ? (
                <Image src={`/api/icon/${clientDomain}`} alt={client.title} width={40} height={40} unoptimized />
              ) : (
                <span style={{ fontSize: 16, fontWeight: 700, color: '#555', fontFamily: 'var(--body)' }}>{client.title.charAt(0)}</span>
              )}
            </span>
            <span style={{ fontFamily: 'var(--pixel)', fontSize: 14, color: 'var(--ink)', textTransform: 'uppercase' }}>
              {client.title}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--body)', fontSize: 14, color: 'rgba(10,10,10,0.65)', lineHeight: 1.7, flex: 1 }}>
            {client.title} is an AI assistant that can take real actions across your apps via Mushrooms MCP — no code required.
          </p>
          <Link href={client.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500, color: '#068F57', textDecoration: 'none', borderBottom: '1.5px solid #068F57', paddingBottom: 1, alignSelf: 'flex-start' }}>
            Learn more about {client.title} →
          </Link>
        </div>

        {/* App card */}
        <div className="about-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,10,0.06)', flexShrink: 0 }}>
              {appIcon ? (
                <Image src={appIcon} alt={appName} width={40} height={40} unoptimized />
              ) : (
                <span style={{ fontSize: 16, fontWeight: 700, color: '#555', fontFamily: 'var(--body)' }}>{appName.charAt(0)}</span>
              )}
            </span>
            <span style={{ fontFamily: 'var(--pixel)', fontSize: 14, color: 'var(--ink)', textTransform: 'uppercase' }}>
              {appName}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--body)', fontSize: 14, color: 'rgba(10,10,10,0.65)', lineHeight: 1.7, flex: 1 }}>
            {appDescription || `${appName} is a powerful platform used by millions of teams worldwide. Connect it to your AI via Mushrooms MCP.`}
          </p>
          {appDomain && (
            <Link href={`https://${appDomain}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500, color: '#068F57', textDecoration: 'none', borderBottom: '1.5px solid #068F57', paddingBottom: 1, alignSelf: 'flex-start' }}>
              Learn more about {appName} →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
