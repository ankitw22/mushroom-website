'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Brand band */}
      <div className="bg-[var(--green)] flex flex-col items-center justify-end overflow-hidden">
        <div className="relative w-full flex items-end justify-center">
          <span className="font-[var(--pixel)] text-[clamp(20px,7.2vw,115px)] font-normal text-white leading-none whitespace-nowrap block text-center w-full mt-12 relative">
            Mushrooms.viaSocket
          </span>
        </div>
      </div>

      {/* Top section */}
      <div className="bg-[var(--cream)] py-8 px-12 flex items-center justify-between gap-6 max-[768px]:px-5 max-[540px]:flex-col max-[540px]:items-start max-[540px]:gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-[var(--body)] text-[22px] font-bold text-[#068F57] leading-tight">
            Power up
          </span>
          <span className="font-[var(--body)] text-[22px] font-bold text-[var(--ink)] leading-tight">
            Your AI client
          </span>
        </div>
        <nav className="flex flex-col items-end gap-1.5 max-[540px]:items-start">
          <Link
            href="https://viasocket.com/embed#ai_agent"
            target="_blank"
            className="font-[var(--body)] text-sm font-medium text-[var(--ink)] underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
          >
            Embed for AI Agents
          </Link>
          <Link
            href="https://viasocket.com/mcp/saas"
            target="_blank"
            className="font-[var(--body)] text-sm font-medium text-[var(--ink)] underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
          >
            SaaS Players
          </Link>
          <Link
            href="#faq-free"
            className="font-[var(--body)] text-sm font-medium text-[var(--ink)] underline underline-offset-[3px] decoration-[rgba(10,10,10,0.3)] transition-colors hover:text-[#068F57] hover:decoration-[#068F57]"
          >
            Pricing
          </Link>
        </nav>
      </div>

      {/* Bottom section */}
      <div className="bg-[var(--cream)] py-4 px-12 flex items-center justify-between gap-4 border-t border-[rgba(10,10,10,0.06)] max-[768px]:px-5 max-[768px]:flex-col max-[768px]:gap-1.5">
        <span className="font-[var(--mono)] text-[11px] text-[rgba(10,10,10,0.4)] whitespace-nowrap max-[768px]:whitespace-normal max-[768px]:text-center">
          ©2026 viaSocket | Privacy, Terms and Data Retention & Deletion Policy
        </span>
        <span className="font-[var(--mono)] text-[11px] text-[rgba(10,10,10,0.4)] whitespace-nowrap max-[768px]:whitespace-normal max-[768px]:text-center">
          Walkover Web Solutions Pvt Ltd. | All rights reserved.
        </span>
      </div>
    </footer>
  );
}
