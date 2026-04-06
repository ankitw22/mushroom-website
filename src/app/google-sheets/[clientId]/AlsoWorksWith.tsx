import Link from 'next/link';
import Image from 'next/image';
import { type AiClient, getIconDomain } from '@/lib/ai-clients';

interface AlsoWorksWithProps {
  currentClient: AiClient;
  otherClients: AiClient[];
}

export function AlsoWorksWith({ currentClient, otherClients }: AlsoWorksWithProps) {
  const domain = getIconDomain(currentClient);

  return (
    <section className="also-works-section">
      <div className="also-works-inner">
        {/* Left: about this client */}
        <div className="client-about-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(10,10,10,0.06)',
                flexShrink: 0,
              }}
            >
              {domain ? (
                <Image src={`/api/icon/${domain}`} alt={currentClient.title} width={40} height={40} unoptimized />
              ) : (
                <span style={{ fontSize: 16, fontWeight: 700, color: '#555', fontFamily: 'var(--body)' }}>
                  {currentClient.title.charAt(0)}
                </span>
              )}
            </span>
            <span
              style={{
                fontFamily: 'var(--pixel)',
                fontSize: 15,
                color: 'var(--ink)',
                textTransform: 'uppercase',
              }}
            >
              {currentClient.title}
            </span>
          </div>

          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: 14,
              color: 'rgba(10,10,10,0.65)',
              lineHeight: 1.7,
              flex: 1,
            }}
          >
            Connect {currentClient.title} to 2,000+ apps via Mushrooms MCP. Your AI can take real actions
            across your entire stack — no code required.
          </p>

          <Link
            href={currentClient.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              fontWeight: 500,
              color: '#068F57',
              textDecoration: 'none',
              borderBottom: '1.5px solid #068F57',
              paddingBottom: 1,
              alignSelf: 'flex-start',
            }}
          >
            Learn more about {currentClient.title} →
          </Link>
        </div>

        {/* Right: other clients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(10,10,10,0.6)',
              margin: 0,
            }}
          >
            Also works with
          </p>
          <div className="clients-grid">
            {otherClients.map((client) => {
              const d = getIconDomain(client);
              return (
                <Link key={client.id} href={`/google-sheets/${client.id}`} className="client-grid-pill">
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(10,10,10,0.06)',
                      flexShrink: 0,
                    }}
                  >
                    {d ? (
                      <Image src={`/api/icon/${d}`} alt={client.title} width={26} height={26} unoptimized />
                    ) : (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#555', fontFamily: 'var(--body)' }}>
                        {client.title.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--body)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: 0,
                    }}
                  >
                    {client.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
