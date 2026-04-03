'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer w-full">
      {/* Brand band */}
      <div className="footer-brand-band bg-[var(--green)] flex flex-col items-center justify-end overflow-hidden">
        <div className="footer-brand-scene relative w-full flex items-center justify-center">
          <span 
            className="footer-wordmark whitespace-nowrap block text-center mt-12 relative"
            style={{
              fontFamily: "'Symtext', 'Press Start 2P', monospace",
              fontSize: 'clamp(20px, 7.2vw, 115px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            Mushrooms.viaSocket
          </span>
        </div>
      </div>

      {/* Top section */}
      <div className="footer-top bg-[var(--cream)] py-8 px-12 flex items-center justify-between gap-[24px] max-[768px]:px-5 max-[540px]:flex-col max-[540px]:items-start max-[540px]:gap-[16px]">
        <div className="footer-tagline flex flex-col gap-[2px]">
          <span 
            className="footer-tagline-power"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#068F57',
              lineHeight: 1.2,
            }}
          >
            Power up
          </span>
          <span 
            className="footer-tagline-sub"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            Your AI client
          </span>
        </div>
        <nav className="footer-nav flex flex-col items-end gap-[6px] max-[540px]:items-start">
          <Link
            href="https://viasocket.com/embed#ai_agent"
            target="_blank"
            className="underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--ink)',
            }}
          >
            Embed for AI Agents
          </Link>
          <Link
            href="https://viasocket.com/mcp/saas"
            target="_blank"
            className="underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--ink)',
            }}
          >
            SaaS Players
          </Link>
          <Link
            href="/pricing"
            className="underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--ink)',
            }}
          >
            Pricing
          </Link>
          <Link
            href="https://viasocket.com/help/viaSocket-MCP/Fair-Usage-Policy"
            target="_blank"
            className="underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--ink)',
            }}
          >
            Fair Usage Policy
          </Link>
        </nav>
      </div>

      {/* Bottom section */}
      <div className="footer-bottom bg-[var(--cream)] py-4 px-12 flex items-center justify-between gap-4 border-t border-[rgba(10,10,10,0.06)] max-[768px]:px-5 max-[768px]:flex-col max-[768px]:gap-1.5">
        <span 
          className="whitespace-nowrap max-[768px]:whitespace-normal max-[768px]:text-center"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: 'rgba(10,10,10,0.4)',
          }}
        >
          ©2026 viaSocket | Privacy, Terms and Data Retention & Deletion Policy
        </span>
        <span 
          className="whitespace-nowrap max-[768px]:whitespace-normal max-[768px]:text-center"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: 'rgba(10,10,10,0.4)',
          }}
        >
          Walkover Web Solutions Pvt Ltd. | All rights reserved.
        </span>
      </div>
    </footer>
  );
}
