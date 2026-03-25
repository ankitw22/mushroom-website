'use client';

import Link from 'next/link';

const PRICING_CARDS = [
  {
    title: 'Free for Lifetime',
    desc: 'Mushrooms is free to use for lifetime under a fair usage policy, without rate limits.',
    cta: 'Get your Cluster URL',
  },
  {
    title: 'For Enterprises',
    desc: 'Mushrooms for Enterprises empowers AI models to securely connect to thousands of apps in minutes.',
    cta: 'Contact Sales',
  },
];

export default function Pricing() {
  return (
    <div className="bg-[var(--cream)] py-[182px] px-12 max-[768px]:py-[192px] max-[768px]:px-0 max-[540px]:py-[160px]" id="dark-band">
      <div className="max-w-[1100px] mx-auto bg-white border border-[rgba(0,0,0,0.1)] rounded-[20px] py-12 px-12 pb-[52px] max-[768px]:mx-4 max-[768px]:py-9 max-[768px]:px-7 max-[768px]:pb-10 max-[768px]:rounded-2xl max-[540px]:mx-3 max-[540px]:py-7 max-[540px]:px-5 max-[540px]:pb-8">
        <div className="mb-10">
          <h2 className="font-[var(--pixel)] text-[clamp(22px,2.8vw,36px)] text-[var(--ink)] leading-tight mb-2.5">
            Start getting work done via <span className="text-[#068F57]">Mushrooms</span>
          </h2>
          <p className="font-[var(--body)] text-[clamp(15px,1.5vw,18px)] text-[var(--ink)] max-w-none leading-relaxed">
            Break free from isolation. Connect your AI to real-world tools for smarter, more impactful results.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 max-[768px]:grid-cols-1">
          {PRICING_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="border border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 flex flex-col gap-3.5"
            >
              <h3 className="font-[var(--body)] text-[28px] font-bold text-[var(--ink)]">{card.title}</h3>
              <p className="font-[var(--body)] text-[15px] text-[var(--ink)] leading-relaxed flex-1">
                {card.desc}
              </p>
              <Link
                href="#"
                className="inline-block font-[var(--body)] text-[15px] font-bold text-white bg-[var(--ink)] no-underline py-3.5 px-8 rounded-full transition-transform self-start whitespace-nowrap hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
