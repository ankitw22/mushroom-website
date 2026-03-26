'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';

const APPS = [
  // Communication
  { name: 'Slack', cat: 'Communication', color: '#4A154B', init: 'S' },
  { name: 'Microsoft Teams', cat: 'Communication', color: '#6264A7', init: 'MT' },
  { name: 'Discord', cat: 'Communication', color: '#5865F2', init: 'DC' },
  { name: 'Telegram', cat: 'Communication', color: '#26A5E4', init: 'TG' },
  { name: 'WhatsApp', cat: 'Communication', color: '#25D366', init: 'WA' },
  { name: 'Zoom', cat: 'Communication', color: '#2D8CFF', init: 'ZM' },
  { name: 'Twilio', cat: 'Communication', color: '#F22F46', init: 'TW' },
  // Email
  { name: 'Gmail', cat: 'Email', color: '#EA4335', init: 'GM' },
  { name: 'Outlook', cat: 'Email', color: '#0078D4', init: 'OL' },
  { name: 'SendGrid', cat: 'Email', color: '#1A82E2', init: 'SG' },
  { name: 'Mailchimp', cat: 'Email', color: '#FFE01B', init: 'MC', textColor: '#000' },
  { name: 'Brevo', cat: 'Email', color: '#0092FF', init: 'BR' },
  { name: 'ActiveCampaign', cat: 'Email', color: '#356AE6', init: 'AC' },
  { name: 'Klaviyo', cat: 'Email', color: '#00B300', init: 'KL' },
  // CRM
  { name: 'HubSpot', cat: 'CRM', color: '#FF7A59', init: 'HS' },
  { name: 'Salesforce', cat: 'CRM', color: '#00A1E0', init: 'SF' },
  { name: 'Pipedrive', cat: 'CRM', color: '#1F7E3E', init: 'PD' },
  { name: 'Zoho CRM', cat: 'CRM', color: '#E42527', init: 'ZC' },
  { name: 'Freshsales', cat: 'CRM', color: '#22C55E', init: 'FS' },
  { name: 'Close', cat: 'CRM', color: '#6C47FF', init: 'CL' },
  // Project Management
  { name: 'Notion', cat: 'Project Management', color: '#000000', init: 'N' },
  { name: 'Linear', cat: 'Project Management', color: '#5E6AD2', init: 'L' },
  { name: 'Jira', cat: 'Project Management', color: '#0052CC', init: 'J' },
  { name: 'Asana', cat: 'Project Management', color: '#F06A6A', init: 'AS' },
  { name: 'ClickUp', cat: 'Project Management', color: '#7B68EE', init: 'CU' },
  { name: 'Monday.com', cat: 'Project Management', color: '#FF3D57', init: 'MO' },
  { name: 'Trello', cat: 'Project Management', color: '#0052CC', init: 'TR' },
  { name: 'Basecamp', cat: 'Project Management', color: '#1D2D35', init: 'BA' },
  // Developer Tools
  { name: 'GitHub', cat: 'Developer Tools', color: '#181717', init: 'GH' },
  { name: 'GitLab', cat: 'Developer Tools', color: '#FC6D26', init: 'GL' },
  { name: 'Bitbucket', cat: 'Developer Tools', color: '#0052CC', init: 'BB' },
  { name: 'Vercel', cat: 'Developer Tools', color: '#000000', init: 'VC' },
  { name: 'Netlify', cat: 'Developer Tools', color: '#00C7B7', init: 'NE' },
  { name: 'CircleCI', cat: 'Developer Tools', color: '#161616', init: 'CI' },
  { name: 'Supabase', cat: 'Developer Tools', color: '#3ECF8E', init: 'SB' },
  { name: 'Firebase', cat: 'Developer Tools', color: '#FFCA28', init: 'FB', textColor: '#000' },
  // Documents & Storage
  { name: 'Google Sheets', cat: 'Documents', color: '#34A853', init: 'GS' },
  { name: 'Google Drive', cat: 'Documents', color: '#4285F4', init: 'GD' },
  { name: 'Google Docs', cat: 'Documents', color: '#4285F4', init: 'GD' },
  { name: 'Dropbox', cat: 'Documents', color: '#0061FF', init: 'DB' },
  { name: 'Box', cat: 'Documents', color: '#0061D5', init: 'BX' },
  { name: 'OneDrive', cat: 'Documents', color: '#0078D4', init: 'OD' },
  { name: 'Confluence', cat: 'Documents', color: '#0052CC', init: 'CF' },
  { name: 'DocuSign', cat: 'Documents', color: '#FFBE00', init: 'DS', textColor: '#000' },
  // Calendar
  { name: 'Google Calendar', cat: 'Calendar', color: '#4285F4', init: 'GC' },
  { name: 'Calendly', cat: 'Calendar', color: '#006BFF', init: 'CA' },
  { name: 'Cal.com', cat: 'Calendar', color: '#000000', init: 'CC' },
  // Accounting
  { name: 'QuickBooks', cat: 'Accounting', color: '#2CA01C', init: 'QB' },
  { name: 'Xero', cat: 'Accounting', color: '#13B5EA', init: 'XE' },
  { name: 'FreshBooks', cat: 'Accounting', color: '#0075DD', init: 'FB' },
  { name: 'Stripe', cat: 'Accounting', color: '#635BFF', init: 'ST' },
  { name: 'Razorpay', cat: 'Accounting', color: '#3395FF', init: 'RP' },
  // AI Tools
  { name: 'OpenAI', cat: 'AI Tools', color: '#10A37F', init: 'OA' },
  { name: 'Anthropic', cat: 'AI Tools', color: '#D97706', init: 'AN' },
  { name: 'Perplexity', cat: 'AI Tools', color: '#20808D', init: 'PP' },
  { name: 'Pinecone', cat: 'AI Tools', color: '#1C1C1C', init: 'PN' },
  { name: 'Cohere', cat: 'AI Tools', color: '#39594D', init: 'CO' },
  // E-Commerce
  { name: 'Shopify', cat: 'E-Commerce', color: '#96BF48', init: 'SH' },
  { name: 'WooCommerce', cat: 'E-Commerce', color: '#7F54B3', init: 'WC' },
  { name: 'BigCommerce', cat: 'E-Commerce', color: '#34313F', init: 'BC' },
  { name: 'Magento', cat: 'E-Commerce', color: '#EE672F', init: 'MG' },
  // Customer Support
  { name: 'Zendesk', cat: 'Customer Support', color: '#03363D', init: 'ZD' },
  { name: 'Intercom', cat: 'Customer Support', color: '#286EFA', init: 'IC' },
  { name: 'Freshdesk', cat: 'Customer Support', color: '#22AEE1', init: 'FD' },
  { name: 'Help Scout', cat: 'Customer Support', color: '#1292EE', init: 'HL' },
  // Marketing
  { name: 'Typeform', cat: 'Marketing', color: '#262627', init: 'TF' },
  { name: 'Webflow', cat: 'Marketing', color: '#4353FF', init: 'WF' },
  { name: 'Airtable', cat: 'Marketing', color: '#2D7FF9', init: 'AT' },
  { name: 'HubSpot Mktg', cat: 'Marketing', color: '#FF7A59', init: 'HM' },
  { name: 'Klaviyo Mktg', cat: 'Marketing', color: '#00B300', init: 'KM' },
];

const CATEGORIES = [
  'All',
  'AI Tools',
  'Accounting',
  'Calendar',
  'Communication',
  'CRM',
  'Customer Support',
  'Developer Tools',
  'Documents',
  'E-Commerce',
  'Email',
  'Marketing',
  'Project Management',
];

export default function Integrations() {
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const getPerPage = () => {
    if (typeof window === 'undefined') return 40;
    return (window.innerWidth > 1024 ? 4 : 3) * 10;
  };

  const filtered = useMemo(() => {
    return APPS.filter((a) => {
      const catOk = activeCat === 'All' || a.cat === activeCat;
      const qOk = !query || a.name.toLowerCase().includes(query.toLowerCase());
      return catOk && qOk;
    });
  }, [activeCat, query]);

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
            {CATEGORIES.map((cat) => (
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
                  <div
                    key={idx}
                    className="integ-cell flex items-center gap-2.5 py-[13px] px-4 border-r border-b border-[rgba(10,10,10,0.07)] transition-colors cursor-default hover:bg-[rgba(6,143,87,0.05)] [&:nth-child(4n)]:border-r-0 max-[1024px]:[&:nth-child(4n)]:border-r max-[1024px]:[&:nth-child(3n)]:border-r-0"
                  >
                    <span
                      className="integ-icon w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: app.color,
                        color: app.textColor || '#fff',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {app.init}
                    </span>
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
                  </div>
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
