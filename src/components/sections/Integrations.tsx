'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PluginApp } from '@/types/api';

interface IntegrationsProps {
  apps: PluginApp[];
}

export default function Integrations({ apps }: IntegrationsProps) {
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Extract unique categories from apps
  const categories = useMemo(() => {
    const cats = new Set<string>();
    apps.forEach((app) => {
      if (app.category && app.category.length > 0) {
        // Clean up category names - capitalize and trim
        const cat = app.category[0].replace(/\./g, '').trim();
        const formatted = cat.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        cats.add(formatted);
      }
    });
    return ['All', ...Array.from(cats).sort()];
  }, [apps]);

  const getPerPage = () => {
    if (typeof window === 'undefined') return 40;
    return (window.innerWidth > 1024 ? 4 : 3) * 10;
  };

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const appCat = a.category?.[0]?.replace(/\./g, '').trim() || '';
      const formattedCat = appCat.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      const catOk = activeCat === 'All' || formattedCat === activeCat;
      const qOk = !query || a.name.toLowerCase().includes(query.toLowerCase());
      return catOk && qOk;
    });
  }, [activeCat, query, apps]);

  const PER_PAGE = getPerPage();
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const slice = filtered.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) {
              el.style.transitionDelay = `${parseInt(delay) * 0.13}s`;
            }
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    const section = sectionRef.current;
    if (section) {
      section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [activeCat, query]);

  return (
    <section 
      ref={sectionRef} 
      className="section-integrations bg-[var(--cream)] py-20 px-12 pb-[182px] max-w-[1200px] mx-auto max-[768px]:py-[60px] max-[768px]:px-5 max-[768px]:pb-[140px] max-[540px]:hidden" 
      id="integrations"
    >
      <div className="integrations-header reveal text-left mb-10 relative z-[3]">
        <h2 
          className="section-headline leading-tight mb-3.5 whitespace-nowrap max-[768px]:whitespace-normal"
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(24px, 3vw, 42px)',
            color: 'var(--ink)',
          }}
        >
          Give your <span className="text-[#068F57]">AI agent</span> the power to act
        </h2>
        <Link
          href="#"
          className="integrations-cta inline-block py-[15px] px-[38px] rounded-full mb-5 transition-transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: '#fff',
            background: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          Get Your Cluster URL
        </Link>
      </div>

      <div className="integrations-box border-2 border-[rgba(10,10,10,0.1)] rounded-xl overflow-hidden bg-white relative z-[3]">
        <div className="integrations-search relative max-w-full border-b-2 border-[rgba(10,10,10,0.1)]">
          <span 
            className="integrations-search-icon absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(10,10,10,0.35)', fontSize: '16px' }}
          >
            ⌕
          </span>
          <input
            type="text"
            placeholder="SEARCH YOUR FAVOURITE APPS"
            className="w-full py-4 pl-11 pr-4 bg-white border-none outline-none focus:bg-[rgba(6,143,87,0.03)]"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.05em',
              color: 'var(--ink)',
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="integrations-layout grid grid-cols-[200px_1fr] gap-0 bg-white max-[768px]:grid-cols-1">
          <div className="integrations-sidebar border-r-2 border-[rgba(10,10,10,0.08)] py-2 bg-white max-[768px]:border-r-0 max-[768px]:border-b-2 max-[768px]:flex max-[768px]:flex-wrap max-[768px]:gap-1 max-[768px]:p-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`integ-cat block w-full text-left py-[9px] px-[18px] bg-none border-none border-l-[3px] border-transparent cursor-pointer transition-all whitespace-nowrap overflow-hidden text-ellipsis hover:text-[var(--ink)] hover:bg-[rgba(10,10,10,0.03)] max-[768px]:w-auto max-[768px]:rounded-full max-[768px]:border-l-0 ${
                  cat === activeCat
                    ? 'text-[var(--ink)] font-semibold !border-l-[#068F57] bg-[rgba(6,143,87,0.06)] max-[768px]:bg-[#068F57] max-[768px]:text-white'
                    : ''
                }`}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '13px',
                  color: 'var(--ink)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="integrations-grid-wrap flex flex-col">
            <div className="integrations-grid grid grid-cols-4 auto-rows-[54px] min-h-0 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-3">
              {slice.length === 0 ? (
                <div 
                  className="integ-empty col-span-full p-12 text-center"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '14px',
                    color: 'rgba(10,10,10,0.4)',
                  }}
                >
                  No apps found.
                </div>
              ) : (
                slice.map((app, idx) => (
                  <Link
                    key={idx}
                    href={`/integrations/${app.appslugname}`}
                    className="integ-cell flex items-center gap-2.5 py-[13px] px-4 border-r border-b border-[rgba(10,10,10,0.07)] transition-colors cursor-pointer hover:bg-[rgba(6,143,87,0.05)] [&:nth-child(4n)]:border-r-0 max-[1024px]:[&:nth-child(4n)]:border-r max-[1024px]:[&:nth-child(3n)]:border-r-0"
                  >
                    {app.iconurl ? (
                      <Image
                        src={app.iconurl}
                        alt={app.name}
                        width={28}
                        height={28}
                        className="integ-icon w-7 h-7 rounded-[7px] flex-shrink-0 object-contain"
                        unoptimized
                      />
                    ) : (
                      <span
                        className="integ-icon w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: app.brandcolor || '#666',
                          color: '#fff',
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      >
                        {app.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span 
                      className="integ-name whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '13px',
                        color: 'var(--ink)',
                      }}
                    >
                      {app.name}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="integrations-footer flex items-center justify-end pt-4 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="integ-page-btn bg-none border-[1.5px] border-[rgba(10,10,10,0.15)] rounded-md py-[5px] px-3.5 cursor-pointer transition-all hover:border-[#068F57] hover:text-[#068F57] disabled:opacity-35 disabled:cursor-default disabled:hover:border-[rgba(10,10,10,0.15)] disabled:hover:text-[var(--ink)]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: 'var(--ink)',
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage >= totalPages - 1}
          className="integ-page-btn bg-none border-[1.5px] border-[rgba(10,10,10,0.15)] rounded-md py-[5px] px-3.5 cursor-pointer transition-all hover:border-[#068F57] hover:text-[#068F57] disabled:opacity-35 disabled:cursor-default disabled:hover:border-[rgba(10,10,10,0.15)] disabled:hover:text-[var(--ink)]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: 'var(--ink)',
          }}
        >
          Next →
        </button>
      </div>

      <div className="apps-missing reveal bg-white border-[1.5px] border-[#e2e8f0] rounded-[14px] p-9 px-10 mt-6 relative z-[1] max-[540px]:p-7 max-[540px]:px-5" data-delay="2">
        <p 
          className="apps-missing-headline mb-7"
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(16px, 2vw, 24px)',
            color: 'var(--ink)',
            letterSpacing: '0.04em',
          }}
        >
          DON&apos;T SEE YOUR APP?
        </p>
        <div className="apps-missing-paths flex items-start gap-0 max-[540px]:flex-col max-[540px]:gap-6">
          <div className="apps-missing-path flex-1 flex flex-col gap-2">
            <strong 
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Request it
            </strong>
            <span 
              className="max-w-[340px]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px',
                color: 'var(--ink)',
                lineHeight: 1.6,
              }}
            >
              Can&apos;t find what you need? We&apos;ll build the integration within 48 hours.
            </span>
            <Link
              href="#"
              className="apps-missing-cta mt-2.5 inline-flex items-center self-start py-3 px-[26px] rounded-lg transition-transform hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
              style={{
                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                fontSize: 'clamp(10px, 1.1vw, 13px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                color: '#fff',
                background: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              Request an app →
            </Link>
          </div>
          <div className="apps-missing-divider w-px bg-[#e2e8f0] self-stretch mx-10 flex-shrink-0 max-[540px]:hidden" />
          <div className="apps-missing-path flex-1 flex flex-col gap-2">
            <strong 
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              List it yourself
            </strong>
            <span 
              className="max-w-[340px]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px',
                color: 'var(--ink)',
                lineHeight: 1.6,
              }}
            >
              Own an app? Connect it to Mushrooms and reach thousands of AI users.
            </span>
            <Link
              href="#"
              className="apps-missing-cta mt-2.5 inline-flex items-center self-start py-3 px-[26px] rounded-lg transition-transform hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)]"
              style={{
                fontFamily: "'Symtext', 'Press Start 2P', monospace",
                fontSize: 'clamp(10px, 1.1vw, 13px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                color: '#fff',
                background: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              Get started →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
