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
    return {
      title: `${app.name} MCP Server | Mashroom`,
      description: `Mushrooms is a power-up layer for your AI. Connect your AI client to apps you use, and give your AI the ability to do things in those apps.`,
      icons: {
        icon: "/mushroom-logo.svg",
      },
    };
  } catch {
    return { title: 'Mushroom Server' };
  }
}

// Mock Image component for when next/image is used inside server components that might not have it imported
import Image from 'next/image';

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

      {/* ── SUPPORTED ACTIONS (Dynamic) ── */}
      <McpActions actions={actions} appIcon={app.iconurl} appName={app.name} />

      {/* ── USE CASES (Reusable) ── */}
      <UseCases />

      {/* ── FEATURES & HOW IT WORKS (Reusable, Green Band) ── */}
      <Features />

      {/* ── PRICING (Reusable) ── */}
      <Pricing />

      {/* ── WORKS WITH AI CLIENTS (Ticker) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px 0', position: 'relative' }}>
        <h2 style={{ fontFamily: 'var(--pixel)', fontSize: 'clamp(18px, 2.5vw, 30px)', color: '#0a0a0a', lineHeight: 1.3, marginBottom: 28 }}>
          Works with
        </h2>
        <div style={{ position: 'relative', height: 52, borderRadius: 14, overflow: 'hidden' }}>
          <Ticker />
        </div>
      </section>

      {/* ── BLOG (Reusable) ── */}
      <Blog />

      {/* ── FAQ (Reusable) ── */}
      <FAQ />

      {/* ── SITE FOOTER (Reusable) ── */}
      <Footer />
    </div>
  );
}
