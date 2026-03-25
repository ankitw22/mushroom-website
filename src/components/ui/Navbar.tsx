'use client';

import Link from 'next/link';

interface NavbarProps {
  onFreePillClick?: () => void;
}

export default function Navbar({ onFreePillClick }: NavbarProps) {
  return (
    <nav className="fixed top-[28px] right-[32px] z-[1000] flex items-center gap-2 max-[540px]:top-4 max-[540px]:right-3 max-[540px]:gap-[5px]">
      <button
        onClick={onFreePillClick}
        className="flex items-center gap-[6px] font-[var(--body)] text-[13px] font-bold text-[#0a0a0a] bg-[#FFD600] py-[7px] px-4 rounded-full whitespace-nowrap cursor-pointer max-[540px]:py-[6px] max-[540px]:px-3 max-[540px]:text-xs"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
          <path d="M20 12v10H4V12" />
          <path d="M22 7H2v5h20V7z" />
          <path d="M12 22V7" />
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
        Free
      </button>
      <Link
        href="#"
        className="font-[var(--body)] text-[13px] font-semibold text-white bg-[var(--ink)] no-underline py-[7px] px-[18px] rounded-full transition-transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] whitespace-nowrap max-[540px]:hidden"
      >
        Explore Embed
      </Link>
      <Link
        href="#"
        className="font-[var(--body)] text-[13px] font-semibold text-white bg-[var(--ink)] no-underline py-[7px] px-[18px] rounded-full transition-transform hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] whitespace-nowrap max-[540px]:py-[6px] max-[540px]:px-3 max-[540px]:text-xs"
      >
        Dashboard →
      </Link>
    </nav>
  );
}
