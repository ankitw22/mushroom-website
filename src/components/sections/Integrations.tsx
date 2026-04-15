'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { App, fetchApps, searchApps, APPS_PER_PAGE } from '@/lib/apps';
import { useAppsCount } from '@/context/AppsCountContext';
import { RequestPlugin } from '@/components/RequestPlugin';
import { fetchAiClients } from '@/lib/ai-clients';


export default function Integrations({ clientId }: { clientId?: string } = {}) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const { appsCount } = useAppsCount();
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchAppsData = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    
    try {
      let result;
      
      if (query.trim()) {
        // Use search API when there's a query
        result = await searchApps(query);
      } else {
        // Use apps API with category filter
        result = await fetchApps(activeCat, page);
      }
      
      setApps(result.data);
      setTotalApps(result.total);
      
      // Extract categories from the apps data
      if (!query.trim() && page === 0) {
        const cats = new Set<string>();
        result.data.forEach((app) => {
          (app.category || []).forEach((cat) => cats.add(cat));
        });
        setCategories(['All', ...Array.from(cats).sort()]);
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
      setHasError(true);
      setApps([]);
      setTotalApps(0);
    } finally {
      setLoading(false);
    }
  }, [activeCat, page, query]);

  useEffect(() => {
    fetchAppsData();
  }, [fetchAppsData]);

  useEffect(() => {
    if (clientId) {
      fetchAiClients().then(clients => {
        const client = clients.find((c) => c.id === clientId);
        setCurrentClient(client);
      });
    }
  }, [clientId]);

  const getPerPage = () => {
    if (typeof window === 'undefined') return APPS_PER_PAGE;
    return APPS_PER_PAGE;
  };

  const PER_PAGE = getPerPage();
  const totalPages = Math.ceil(totalApps / PER_PAGE);
  const currentPage = page;

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



  return (
    <section 
      ref={sectionRef} 
      className="section-integrations max-[540px]:hidden" 
      id="integrations"
      style={{ background: 'var(--cream)', padding: '80px 48px 80px', maxWidth: 1200, margin: '0 auto' }}
    >
      
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
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          />
        </div>

        <div className="integrations-layout grid grid-cols-[200px_1fr] gap-0 bg-white max-[768px]:grid-cols-1">
          <div className="integrations-sidebar border-r-2 border-[rgba(10,10,10,0.08)] py-2 bg-white max-[768px]:border-r-0 max-[768px]:border-b-2 max-[768px]:flex max-[768px]:flex-wrap max-[768px]:gap-1 max-[768px]:p-2" style={{ overflowY: 'auto', maxHeight: 487 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setPage(0); }}
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
            <div 
              className="integrations-grid grid grid-cols-4 auto-rows-[54px] min-h-0 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-3" 
              style={{ minHeight: '432px' }} // Fixed height: 8 rows * 54px = 432px
            >
              {loading ? (
                <div className="integ-empty col-span-full p-12 text-center" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)' }}>
                  Loading apps…
                </div>
              ) : hasError ? (
                <div className="integ-empty col-span-full p-12 text-center" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)' }}>
                  Error loading apps. Please try again.
                </div>
              ) : apps.length === 0 ? (
                <div className="integ-empty col-span-full p-8 flex flex-col items-center justify-center gap-8" style={{ minHeight: '432px' }}>
                  {query.trim() ? (
                    <>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)' }}>
                        No apps found for &quot;{query}&quot;
                      </p>
                      
                      {/* Request App Section */}
                      <div className="flex flex-col items-center text-center gap-3 max-w-md">
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: 'var(--ink)' }}>
                          Can&apos;t find the <span style={{ color: '#068F57', fontWeight: 600 }}>Mushroom </span> you&apos;re looking for?
                          <br />
                          <span style={{ color: 'rgba(10,10,10,0.6)' }}>We&apos;ll build it for you within 48 hours.</span>
                        </p>
                        <button
                          onClick={() => setShowRequestModal(true)}
                          className="transition-transform hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                          style={{
                            padding: '12px 24px',
                            borderRadius: 8,
                            fontFamily: "'Symtext', 'Press Start 2P', monospace",
                            fontSize: '11px',
                            fontWeight: 400,
                            letterSpacing: '0.06em',
                            color: '#fff',
                            background: 'var(--ink)',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Request a new Mushroom
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="w-16 h-px bg-[rgba(10,10,10,0.15)]"></div>

                      {/* Build Your Own Section */}
                      <div className="flex flex-col items-center text-center gap-3 max-w-md">
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: 'var(--ink)' }}>
                          Own this app?
                          <br />
                          <span style={{ color: 'rgba(10,10,10,0.6)' }}>Build its plug and make it live today!</span>
                        </p>
                        <Link
                          href="https://viasocket.com/help/plugin-builder"
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="transition-transform hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                          style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            borderRadius: 8,
                            fontFamily: "'Symtext', 'Press Start 2P', monospace",
                            fontSize: '11px',
                            fontWeight: 400,
                            letterSpacing: '0.06em',
                            color: '#fff',
                            background: '#068F57',
                            textDecoration: 'none',
                          }}
                        >
                          Read our Playbook
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.4)' }}>
                      No apps found.
                    </p>
                  )}
                </div>
              ) : (
                apps.map((app: App, idx: number) => (
                  <Link
                    key={app.rowid ?? idx}
                    href={clientId ? `/aiclients/${clientId}/${app.appslugname}` : `/mcp/${app.appslugname}`}
                    className="integ-cell flex items-center gap-[10px] border-r border-b border-[rgba(10,10,10,0.07)] transition-colors hover:bg-[rgba(6,143,87,0.05)] [&:nth-child(4n)]:border-r-0 max-[1024px]:[&:nth-child(4n)]:border-r max-[1024px]:[&:nth-child(3n)]:border-r-0"
                    style={{ padding: '13px 16px', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <span
                      className="integ-icon w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                      // style={{ backgroundColor: app.brandcolor || '#888', flexShrink: 0 }}
                    >
                      {app.iconurl ? (
                        <Image src={app.iconurl.trimStart()} alt={app.name} width={28} height={28}  />
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
          disabled={currentPage === 0 || loading}
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
          disabled={currentPage >= totalPages - 1 || totalPages <= 1 || loading}
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

      
      {showRequestModal && (
        <RequestPlugin
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </section>
  );
}
