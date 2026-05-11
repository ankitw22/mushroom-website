'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Ticker from '@/components/hero/Ticker';
import AiClients from '@/components/sections/AiClients';
import UseCases from '@/components/sections/UseCases';
import Features from '@/components/sections/Features';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import { fetchMcpAppData, type McpAppData } from '@/lib/mcp-app-data';
import { type Plugin } from '@/lib/recommend';
import { McpHero } from './McpHero';
import { McpActions } from './McpActions';
import { McpUseCases } from './McpUseCases';
import { McpFAQ } from './McpFAQ';

interface McpPageContentProps {
  slug: string;
  app: Plugin;
}

export function McpPageContent({ slug, app }: McpPageContentProps) {
  const [tableData, setTableData] = useState<McpAppData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMcpAppData(slug)
      .then((data) => {
        if (!cancelled) setTableData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const actions = app.events.filter((e) => e.type === 'action');

  return (
    <div className="mcp-page-wrapper">
      <Navbar />
      <McpHero
        app={app}
        h1Title={tableData?.h1_title}
        subheadline={tableData?.subheadline}
      />

      <div style={{ position: 'relative', height: 52, overflow: 'hidden' }}>
        <Ticker />
      </div>

      <McpActions actions={actions} appIcon={app.iconurl} appName={app.name} />

      <AiClients appSlug={slug} />

      {tableData?.use_case_cards?.length
        ? <McpUseCases cards={tableData.use_case_cards} />
        : <UseCases />
      }

      <Features />

      <Pricing />

      <Blog />

      {tableData?.faqs?.length
        ? <McpFAQ faqs={tableData.faqs} />
        : <FAQ />
      }

      <Footer />
    </div>
  );
}
