'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type AiClient, getIconDomain, fetchAiClients } from '@/lib/ai-clients';

export default function AiClients({ appSlug }: { appSlug?: string } = {}) {
  const [clients, setClients] = useState<AiClient[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({ name: '', description: '' });
  const [showToast, setShowToast] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchAiClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitRequest = async () => {
    try {
      const response = await fetch('https://flow.sokt.io/func/scriu9vmqXqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aiClientName: requestForm.name || query,
          description: requestForm.description,
          originalSearch: query,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        setShowToast(true);
        setRequestForm({ name: '', description: '' });
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      alert('Error submitting request. Please try again.');
    }
  };

  const filtered = query.trim()
    ? clients.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : clients;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = `${parseInt(delay) * 0.13}s`;
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    const section = sectionRef.current;
    if (section) section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="max-[540px]:hidden"
      id="ai-clients"
      style={{ background: 'var(--cream)', padding: '0 48px 150px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="reveal text-left mb-10 relative z-[3]">
        <h2
          className="section-headline leading-tight whitespace-nowrap max-[768px]:whitespace-normal"
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 3.4vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 14,
          }}
        >
          WHICH AI CLIENT <span className="text-[#068F57]">ARE YOU USING?</span>
        </h2>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: 'rgba(10,10,10,0.55)', margin: 0 }}>
          Pick the AI you want to connect Apps with.
        </p>
      </div>

      <div className="reveal border-2 border-[rgba(10,10,10,0.1)] rounded-xl overflow-hidden bg-white relative z-[3]" data-delay="1">
        <div className="relative max-w-full border-b-2 border-[rgba(10,10,10,0.1)]">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(10,10,10,0.35)', fontSize: '16px' }}
          >
            ⌕
          </span>
          <input
            type="text"
            placeholder="SEARCH AI CLIENTS"
            className="w-full py-4 pl-11 pr-4 bg-white border-none outline-none focus:bg-[rgba(6,143,87,0.03)]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.05em', color: 'var(--ink)' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-4 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-3">
          {loading ? (
            <div
              className="col-span-full flex items-center justify-center"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)', minHeight: '108px' }}
            >
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="col-span-full flex flex-col items-center justify-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '140px', padding: '24px' }}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                  <div style={{ fontSize: '18px', color: 'rgba(10,10,10,0.8)', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px' }}>
                    AI NOT FOUND? WE'LL BUILD IT.
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="AI Client Name"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-[rgba(10,10,10,0.1)] rounded-lg outline-none focus:border-[#068F57] focus:bg-[rgba(6,143,87,0.02)]"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}
                  />
                  <textarea
                    placeholder="Additional Description (Optional)"
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-[rgba(10,10,10,0.1)] rounded-lg outline-none focus:border-[#068F57] focus:bg-[rgba(6,143,87,0.02)] resize-none"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}
                  />
                  <button
                    className="px-8 py-3 bg-[#068F57] text-white rounded-xl font-bold hover:bg-[#057a48] transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}
                    onClick={handleSubmitRequest}
                  >
                    Request for AI Client
                  </button>
                  <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', letterSpacing: '0.3px' }}>
                    We'll deliver your app within 6hr
                  </div>
                </div>
              </div>
            </div>
          ) : (
            filtered.map((client) => {
              const domain = getIconDomain(client);
              return (
                <Link
                  key={client.id}
                  href={appSlug ? `/aiclients/${client.id}/${appSlug}` : `/aiclients/${client.id}`}
                  className="flex items-center gap-[10px] border-r border-b border-[rgba(10,10,10,0.07)] transition-colors hover:bg-[rgba(6,143,87,0.05)] [&:nth-child(4n)]:border-r-0 max-[1024px]:[&:nth-child(4n)]:border-r max-[1024px]:[&:nth-child(3n)]:border-r-0"
                  style={{ padding: '13px 16px', textDecoration: 'none', height: '54px' }}
                >
                  <span
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-[rgba(10,10,10,0.06)]"
                  >
                    {domain ? (
                      <Image
                        src={`/api/icon/${domain}`}
                        alt={client.title}
                        width={28}
                        height={28}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }}
                        unoptimized
                      />
                    ) : (
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#555' }}>
                        {client.title.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span
                    className="whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'var(--ink)' }}
                  >
                    {client.title}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>
      
      {showToast && (
        <div
          className="fixed bottom-8 right-8 px-6 py-3 bg-[#068F57] text-white rounded-lg shadow-lg z-50 animate-pulse"
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 500 }}
        >
          Your request sent
        </div>
      )}
    </section>
  );
}
