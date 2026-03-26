'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { App, APPS_API } from '@/lib/apps';


export default function Integrations() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch(APPS_API)
      .then((r) => r.json())
      .then((json) => {
        setApps(json.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    apps.forEach((a) => (a.category ?? []).forEach((c) => cats.add(c)));
    return ['All', ...Array.from(cats).sort()];
  }, [apps]);

  const getPerPage = () => {
    if (typeof window === 'undefined') return 40;
    return (window.innerWidth > 1024 ? 4 : 3) * 10;
  };

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const catOk = activeCat === 'All' || (a.category ?? []).includes(activeCat);
      const qOk = !query || a.name.toLowerCase().includes(query.toLowerCase());
      return catOk && qOk;
    });
  }, [apps, activeCat, query]);

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
      className="section-integrations max-[540px]:hidden" 
      id="integrations"
      style={{ background: 'var(--cream)', padding: '80px 48px 80px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="integrations-header reveal text-left mb-10 relative z-[3]">
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
          Give your <span className="text-[#068F57]">AI agent</span> the power to act
        </h2>
        <Link
          href="https://app.mushroom.viasocket.com/login"
          target="_blank"
          rel="noopener noreferrer"
          className="integrations-cta transition-transform hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
          style={{
            display: 'inline-block',
            padding: '15px 38px',
            borderRadius: 8,
            marginBottom: 20,
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(11px, 1.3vw, 14px)',
            fontWeight: 400,
            letterSpacing: '0.08em',
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
          <div className="integrations-sidebar border-r-2 border-[rgba(10,10,10,0.08)] py-2 bg-white max-[768px]:border-r-0 max-[768px]:border-b-2 max-[768px]:flex max-[768px]:flex-wrap max-[768px]:gap-1 max-[768px]:p-2" style={{ overflowY: 'auto', maxHeight: 487 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`integ-cat cursor-pointer transition-all whitespace-nowrap overflow-hidden text-ellipsis hover:bg-[rgba(10,10,10,0.03)]`}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '9px 18px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '13px',
                color: 'var(--ink)',
                background: cat === activeCat ? 'rgba(6,143,87,0.06)' : 'none',
                border: 'none',
                borderLeft: cat === activeCat ? '3px solid #068F57' : '3px solid transparent',
                fontWeight: cat === activeCat ? 600 : 400,
              }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="integrations-grid-wrap flex flex-col" style={{ overflowY: 'auto', maxHeight: 487 }}>
            <div className="integrations-grid grid grid-cols-4 auto-rows-[54px] min-h-0 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-3">
              {loading ? (
                <div className="integ-empty col-span-full p-12 text-center" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)' }}>
                  Loading apps…
                </div>
              ) : slice.length === 0 ? (
                <div className="integ-empty col-span-full p-12 text-center" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)' }}>
                  No apps found.
                </div>
              ) : (
                slice.map((app: App, idx: number) => (
                  <Link
                    key={app.rowid ?? idx}
                    href={`/app/${app.appslugname}`}
                    className="integ-cell flex items-center gap-[10px] border-r border-b border-[rgba(10,10,10,0.07)] transition-colors hover:bg-[rgba(6,143,87,0.05)] [&:nth-child(4n)]:border-r-0 max-[1024px]:[&:nth-child(4n)]:border-r max-[1024px]:[&:nth-child(3n)]:border-r-0"
                    style={{ padding: '13px 16px', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <span
                      className="integ-icon w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: app.brandcolor || '#888', flexShrink: 0 }}
                    >
                      {app.iconurl ? (
                        <Image src={app.iconurl} alt={app.name} width={28} height={28} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} unoptimized />
                      ) : (
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#fff' }}>{app.name.charAt(0).toUpperCase()}</span>
                      )}
                    </span>
                    <span
                      className="integ-name whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'var(--ink)' }}
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

      <div className="integrations-footer flex items-center justify-end pt-4 gap-3" style={{paddingTop:'16px'}}>
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

      <div className="apps-missing reveal bg-white border-[1.5px] border-[#e2e8f0] rounded-[14px] py-9 px-10 mt-6 relative z-[1] max-[540px]:py-7 max-[540px]:px-5" data-delay="2">
        <p 
          className="apps-missing-headline mb-7 tracking-[0.04em]"
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
              href="https://app.mushroom.viasocket.com/login"
              target="_blank"
              rel="noopener noreferrer"
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
              href="https://app.mushroom.viasocket.com/login"
              target="_blank"
              rel="noopener noreferrer"
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
