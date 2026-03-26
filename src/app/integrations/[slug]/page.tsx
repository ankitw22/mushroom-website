import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAppIntegrations } from '@/lib/api';
import Footer from '@/components/ui/Footer';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Pricing from '@/components/sections/Pricing';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getAppIntegrations(slug);
    const app = data.plugins?.[slug];
    if (!app) return { title: 'App Not Found' };
    return {
      title: `MCP Server for ${app.name} — Mushrooms by viaSocket`,
      description: `Connect ${app.name} actions with AI tools like ChatGPT, Claude, and Cursor using the Mushrooms MCP Server.`,
    };
  } catch {
    return { title: 'Integration - Mushrooms' };
  }
}

export default async function IntegrationDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let data;
  try {
    data = await getAppIntegrations(slug);
  } catch {
    notFound();
  }

  const app = data.plugins?.[slug];
  if (!app) {
    notFound();
  }

  const actions = app.events?.filter((e) => e.type === 'action') || [];
  const triggers = app.events?.filter((e) => e.type === 'trigger') || [];
  const totalEvents = actions.length + triggers.length;

  const brandColor = app.brandcolor || '#52c49a';

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Navbar */}
      <nav className="fixed top-7 right-8 z-[1000] flex items-center gap-2">
        <span className="nav-free-pill flex items-center gap-1.5 py-[7px] px-4 rounded-full font-['Poppins',sans-serif] text-[13px] font-bold text-[#0a0a0a] bg-[#FFD600] whitespace-nowrap">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M20 12v10H4V12" />
            <path d="M22 7H2v5h20V7z" />
            <path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
          </svg>
          Free
        </span>
        <Link href="#" className="font-['Poppins',sans-serif] text-[13px] font-semibold text-white bg-[var(--ink)] no-underline py-[7px] px-[18px] rounded-full transition-transform hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] whitespace-nowrap">
          Explore Embed
        </Link>
        <Link href="#" className="font-['Poppins',sans-serif] text-[13px] font-semibold text-white bg-[var(--ink)] no-underline py-[7px] px-[18px] rounded-full transition-transform hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
          Dashboard →
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="m-[10px]">
        <div 
          className="relative rounded-2xl overflow-hidden py-20 px-[60px] min-h-[520px] flex items-center max-[900px]:py-20 max-[900px]:px-8 max-[900px]:min-h-auto"
          style={{ background: brandColor }}
        >
          {/* Pixel grid texture */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(10,10,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-[2] flex items-center gap-16 w-full max-w-[1100px] mx-auto max-[900px]:flex-col max-[900px]:gap-10">
            {/* Left side */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 font-['JetBrains_Mono',monospace] text-[11px] text-[rgba(10,10,10,0.5)] mb-6">
                <Link href="/#integrations" className="text-[rgba(10,10,10,0.5)] no-underline transition-colors hover:text-[var(--ink)]">
                  MCP
                </Link>
                <span className="opacity-40">›</span>
                <span className="text-[var(--ink)] font-semibold">{app.name}</span>
              </nav>

              {/* App icon */}
              <div className="w-[52px] h-[52px] rounded-[14px] bg-white flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                {app.iconurl ? (
                  <Image
                    src={app.iconurl}
                    alt={app.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="text-xl font-bold" style={{ color: brandColor }}>
                    {app.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <h1 
                className="font-['Symtext','Press_Start_2P',monospace] leading-[1.15] tracking-[-1px] mb-4 text-[var(--ink)] animate-[fadeUp_0.5s_ease_0.1s_both]"
                style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
              >
                MCP SERVER FOR<br />{app.name.toUpperCase()}
              </h1>

              <p 
                className="font-['Poppins',sans-serif] font-normal text-[rgba(10,10,10,0.65)] max-w-[480px] leading-[1.65] mb-7 animate-[fadeUp_0.5s_ease_0.25s_both]"
                style={{ fontSize: 'clamp(14px, 1.6vw, 17px)' }}
              >
                Connect {app.name} actions with AI tools like ChatGPT, Claude, and Cursor using the Mushrooms MCP Server.
              </p>

              <Link
                href="#"
                className="inline-flex items-center gap-2 py-[15px] px-[38px] bg-[var(--ink)] text-white font-['Symtext','Press_Start_2P',monospace] font-normal tracking-[0.08em] no-underline rounded-lg transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)] animate-[fadeUp_0.5s_ease_0.4s_both]"
                style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}
              >
                Get Your Cluster URL
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" />
                </svg>
              </Link>
            </div>

            {/* Right side - Chat window mockup */}
            <div className="flex-shrink-0 w-[340px] animate-[fadeUp_0.6s_ease_0.3s_both] max-[900px]:w-full max-[900px]:max-w-[400px] max-[900px]:self-center">
              <div className="bg-[#fafaf8] border-[1.5px] border-[rgba(10,10,10,0.12)] rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.16)] overflow-hidden">
                <div className="bg-[rgba(10,10,10,0.88)] py-2.5 px-4 flex items-center gap-2.5">
                  <div className="flex gap-[5px]">
                    <span className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]"></span>
                    <span className="w-[9px] h-[9px] rounded-full bg-[#febc2e]"></span>
                    <span className="w-[9px] h-[9px] rounded-full bg-[#28c840]"></span>
                  </div>
                  <span className="font-['Symtext','Press_Start_2P',monospace] text-[8px] text-[rgba(255,255,255,0.5)] ml-1 tracking-[0.04em]">
                    AI AGENT
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--green)] text-[var(--ink)] flex items-center justify-center font-['Poppins',sans-serif] text-[10px] font-bold flex-shrink-0">
                      AI
                    </div>
                    <div>
                      <div className="font-['JetBrains_Mono',monospace] text-[9px] text-[rgba(10,10,10,0.35)] mb-1">AI Agent</div>
                      <div className="py-2 px-3 bg-white border border-[#e2e8f0] rounded-[10px] rounded-tl-[2px] font-['Poppins',sans-serif] text-[12px] leading-[1.55] max-w-[220px] text-[var(--ink)]">
                        What can I help you with?
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-full bg-[#e2e8f0] text-[var(--ink)] flex items-center justify-center font-['Poppins',sans-serif] text-[10px] font-bold flex-shrink-0">
                      You
                    </div>
                    <div>
                      <div className="font-['JetBrains_Mono',monospace] text-[9px] text-[rgba(10,10,10,0.35)] mb-1 text-right">You</div>
                      <div className="py-2 px-3 bg-[var(--ink)] text-white rounded-[10px] rounded-tr-[2px] font-['Poppins',sans-serif] text-[12px] leading-[1.55] max-w-[220px]">
                        I want to use {app.name} integration.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--green)] text-[var(--ink)] flex items-center justify-center font-['Poppins',sans-serif] text-[10px] font-bold flex-shrink-0">
                      AI
                    </div>
                    <div>
                      <div className="font-['JetBrains_Mono',monospace] text-[9px] text-[rgba(10,10,10,0.35)] mb-1">AI Agent · MCP Tool Calling…</div>
                      <div className="bg-[#e8f5f0] border border-[#b2e0ce] rounded-lg py-2 px-3 flex items-center gap-2 my-1">
                        <div 
                          className="w-[22px] h-[22px] rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        >
                          {app.iconurl ? (
                            <Image
                              src={app.iconurl}
                              alt={app.name}
                              width={12}
                              height={12}
                              className="w-3 h-3 object-contain"
                              unoptimized
                            />
                          ) : (
                            <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" className="w-3 h-3">
                              <rect x="1" y="1" width="10" height="10" rx="2" />
                              <path d="M4 6h4M6 4v4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-['JetBrains_Mono',monospace] text-[10px] text-[#068F57] font-semibold">
                            {actions[0]?.name || `${app.name} Action`}
                          </div>
                          <div className="font-['Poppins',sans-serif] text-[10px] text-[rgba(10,10,10,0.4)]">
                            Action in Progress…
                          </div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse ml-auto flex-shrink-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 py-2.5 px-3.5 border-t border-[#f0f0ec] bg-[#fafaf8]">
                  <input 
                    className="flex-1 font-['Poppins',sans-serif] text-[12px] text-[rgba(10,10,10,0.35)] border-none bg-transparent outline-none"
                    type="text" 
                    placeholder="Message your agent…" 
                    readOnly 
                  />
                  <div className="w-[26px] h-[26px] rounded-full bg-[var(--ink)] flex items-center justify-center cursor-pointer flex-shrink-0">
                    <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <path d="M10.5 1.5L1.5 6l4 1 1 4 4-9z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Actions Section */}
      <section className="py-24 px-12 max-w-[1200px] mx-auto pb-[182px] max-[900px]:py-16 max-[900px]:px-7" id="actions">
        <div className="actions-header mb-9">
          <div className="inline-flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[var(--ink)] bg-[rgba(6,143,87,0.15)] border-[1.5px] border-[rgba(6,143,87,0.45)] py-[5px] px-3 rounded-full mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#068F57]"></span>
            {totalEvents} Actions Available
          </div>
          <h2 
            className="font-['Symtext','Press_Start_2P',monospace] leading-[1.35] mb-3 text-[var(--ink)]"
            style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}
          >
            Supported Actions <span className="text-[#068F57]">✓</span>
          </h2>
          <p 
            className="font-['Poppins',sans-serif] text-[var(--ink)] max-w-[560px] leading-[1.7]"
            style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}
          >
            Add {totalEvents} power ups to your AI client for seamless integration
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
          {app.events?.slice(0, 8).map((event, idx) => (
            <div 
              key={idx}
              className="bg-white border-[1.5px] border-[#e2e8f0] rounded-[14px] py-5 px-[22px] flex items-start gap-3.5 transition-all cursor-default hover:border-[#068F57] hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(6,143,87,0.1)]"
            >
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0">
                {app.iconurl ? (
                  <Image
                    src={app.iconurl}
                    alt={app.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain"
                    unoptimized
                  />
                ) : (
                  <div 
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: brandColor }}
                  >
                    {app.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-['Poppins',sans-serif] text-[14px] font-bold text-[var(--ink)] mb-1">
                  {event.name}
                </div>
                <div className="font-['Poppins',sans-serif] text-[12px] text-[rgba(10,10,10,0.45)] leading-[1.6]">
                  {event.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {app.events && app.events.length > 8 && (
          <div className="flex justify-end mt-4">
            <button className="font-['JetBrains_Mono',monospace] text-[12px] text-[#068F57] bg-none border-[1.5px] border-[rgba(6,143,87,0.3)] py-2 px-5 rounded-full cursor-pointer transition-all hover:bg-[rgba(6,143,87,0.06)] hover:border-[#068F57]">
              Load More ({app.events.length - 8} more) ↓
            </button>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <div className="relative bg-[var(--green)] py-[60px] px-12 w-full">
        {/* Pixel edges - simplified version */}
        <section className="py-[100px] px-6 max-w-[1200px] mx-auto max-[768px]:py-[60px] max-[768px]:px-5">
          <div className="text-center mb-14">
            <h2 
              className="font-['Symtext','Press_Start_2P',monospace] leading-[1.35] mb-2.5 text-[var(--ink)]"
              style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}
            >
              Connect {app.name} to Any<br /><span className="text-white">AI Assistant</span>
            </h2>
            <p 
              className="font-['Poppins',sans-serif] text-[var(--ink)] max-w-none leading-[1.7]"
              style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}
            >
              Mushrooms connects your AI to real-world tools and translates intent into controlled actions.
            </p>
          </div>

          <div className="flex items-stretch gap-0 max-[768px]:flex-col max-[768px]:gap-4">
            <div className="flex-1 min-w-0 py-11 px-10 flex flex-col gap-4 rounded-2xl bg-white max-[768px]:py-8 max-[768px]:px-7">
              <div className="font-['Poppins',sans-serif] text-[28px] font-bold text-[#068F57] leading-[1.15]">
                Get Your Cluster URL
              </div>
              <div className="font-['Poppins',sans-serif] text-[15px] text-[var(--ink)] leading-[1.65]">
                Instantly get a unique, secure URL that connects your AI assistant to Mushrooms&apos; network of integrations.
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 px-2 max-[768px]:hidden">
              <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-11 opacity-20">
                <line x1="6" y1="15" x2="46" y2="15" stroke="white" strokeWidth="4" strokeLinecap="square"/>
                <line x1="6" y1="29" x2="46" y2="29" stroke="white" strokeWidth="4" strokeLinecap="square"/>
                <polyline points="42,7 58,22 42,37" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0 py-11 px-10 flex flex-col gap-4 rounded-2xl bg-white max-[768px]:py-8 max-[768px]:px-7">
              <div className="font-['Poppins',sans-serif] text-[28px] font-bold text-[#068F57] leading-[1.15]">
                Choose Your Actions
              </div>
              <div className="font-['Poppins',sans-serif] text-[15px] text-[var(--ink)] leading-[1.65]">
                Choose and configure the {app.name} actions your AI can perform, with granular per-action permissions.
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 px-2 max-[768px]:hidden">
              <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-11 opacity-20">
                <line x1="6" y1="15" x2="46" y2="15" stroke="white" strokeWidth="4" strokeLinecap="square"/>
                <line x1="6" y1="29" x2="46" y2="29" stroke="white" strokeWidth="4" strokeLinecap="square"/>
                <polyline points="42,7 58,22 42,37" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0 py-11 px-10 flex flex-col gap-4 rounded-2xl bg-white max-[768px]:py-8 max-[768px]:px-7">
              <div className="font-['Poppins',sans-serif] text-[28px] font-bold text-[#068F57] leading-[1.15]">
                Connect Your AI Assistant
              </div>
              <div className="font-['Poppins',sans-serif] text-[15px] text-[var(--ink)] leading-[1.65]">
                Paste your Cluster URL into Claude, ChatGPT, or Cursor. Every action is scoped and approved.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pricing */}
      <Pricing />

      {/* Blog */}
      <Blog />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
