import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Marquee } from '@/components/ui/Marquee';
import './../mcp-ui.css';
import { McpHero } from './McpHero';
import { McpActions } from './McpActions';
import UseCases from '@/components/sections/UseCases';
import Features from '@/components/sections/Features';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import Ticker from '@/components/hero/Ticker';

export const runtime = 'edge';

const RECOMMEND_API = 'https://plug-service.viasocket.com/api/v1/plugins/recommend/integrations?service=';

interface PluginEvent {
  rowid: string;
  name: string;
  description: string;
  type: 'action' | 'trigger';
  preposition: string | null;
}

interface Plugin {
  rowid: string;
  name: string;
  description: string;
  appslugname: string;
  iconurl: string;
  category: string[];
  domain: string;
  brandcolor: string | null;
  autonumber: number;
  events: PluginEvent[];
}

interface Combination {
  description: string;
  trigger: { name: string; id: string };
  actions: { name: string; id: string }[];
  score: number;
}

interface ApiResponse {
  combinations: Combination[];
  plugins: Record<string, Plugin>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${RECOMMEND_API}${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: 'Mushroom Server' };
    const data: ApiResponse = await res.json();
    const app = data.plugins[slug];
    if (!app) return { title: 'Mushroom Server' };
    const actionCount = (app.events ?? []).filter((e) => e.type === 'action').length;
    const triggerCount = (app.events ?? []).filter((e) => e.type === 'trigger').length;
    
    const title = `MCP Server for ${app.name} | Mushrooms`;
    const description = `Mushrooms connects your AI to ${app.name} with ${actionCount}+ supported actions and ${triggerCount}+ triggers. Select what your AI can do and let it execute.`;
    const url = `https://mushroom.viasocket.com/mcp/${slug}`;
    
    return {
      title,
      description,
      icons: {
        icon: "/mushroom-logo.svg",
        apple: "/mushroom-logo.svg",
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'Mushrooms',
        images: [
          {
            url: app.iconurl || "/mushroom-logo.svg",
            width: 1200,
            height: 630,
            alt: `${app.name} MCP Server - Mushrooms`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [app.iconurl || "/mushroom-logo.svg"],
        creator: '@mushrooms_sh',
        site: '@mushrooms_sh',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      metadataBase: new URL('https://mushroom.viasocket.com'),
      alternates: {
        canonical: url,
      },
      other: {
        'og:site_name': 'Mushrooms',
        'og:type': 'website',
        'twitter:domain': 'mushroom.viasocket.com',
        'application-name': 'Mushrooms MCP Server',
        'apple-mobile-web-app-title': 'Mushrooms',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'format-detection': 'telephone=no',
        'mobile-web-app-capable': 'yes',
        'msapplication-TileColor': '#000000',
        'msapplication-config': '/browserconfig.xml',
        'theme-color': '#000000',
      },
    };
  } catch {
    return { 
      title: 'Mushroom Server',
      description: 'Connect your AI to any application with Mushrooms MCP Server.',
    };
  }
}

export default async function McpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const res = await fetch(`${RECOMMEND_API}${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) notFound();

  const data: ApiResponse = await res.json();
  const app = data.plugins[slug];
  if (!app) notFound();

  const actions = app.events.filter(e => e.type === 'action');

  return (
    <div className="mcp-page-wrapper">
      {/* ── HERO (Dynamic) ── */}
      <McpHero app={app} />

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px 0', position: 'relative' }}>
        <h2 style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(18px, 2.5vw, 30px)', color: '#060606ff', lineHeight: 1.3, marginBottom: 28 }}>
          Works with
        </h2>
        <div style={{ position: 'relative', height: 52, borderRadius: 14, overflow: 'hidden' }}>
          <Ticker />
        </div>
      </section>

      {/* ── SUPPORTED ACTIONS (Dynamic) ── */}
      <McpActions actions={actions} appIcon={app.iconurl} appName={app.name} />

      {/* ── USE CASES (Reusable) ── */}
      <UseCases />

      {/* ── FEATURES & HOW IT WORKS (Reusable, Green Band) ── */}
      <Features />

      {/* ── PRICING (Reusable) ── */}
      <Pricing />

      {/* ── WORKS WITH AI CLIENTS (Ticker) ── */}

      {/* ── BLOG (Reusable) ── */}
      <Blog />

      {/* ── FAQ (Reusable) ── */}
      <FAQ />

      {/* ── SITE FOOTER (Reusable) ── */}
      <Footer />
    </div>
  );
}
