'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import { fetchAiAppData, type AiAppData, type PluginEvent } from '@/lib/ai-app-data';
import { type AiClient } from '@/lib/ai-clients';
import { type AiClientApiData } from '@/lib/ai-client-data';
import { HowToConnect } from '../HowToConnect';
import { AppClientHero } from './AppClientHero';
import { WorkflowsSection } from './WorkflowsSection';
import { ChatDemoSection } from './ChatDemoSection';
import { ActionsPreview } from './ActionsPreview';
import { AboutSection } from './AboutSection';

interface AppClientPageContentProps {
  client: AiClient;
  otherClients: AiClient[];
  clientApiData: AiClientApiData | null;
  appSlug: string;
}

export function AppClientPageContent({
  client,
  otherClients,
  clientApiData,
  appSlug,
}: AppClientPageContentProps) {
  const [appData, setAppData] = useState<AiAppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAiAppData(appSlug, client.title)
      .then((data) => {
        if (!cancelled) {
          setAppData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [appSlug, client.title]);

  if (loading) {
    return (
      <div className="client-page-wrapper">
        <Navbar />
        <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--body)', color: 'rgba(10,10,10,0.5)' }}>
          Loading…
        </div>
        <Footer />
      </div>
    );
  }

  if (!appData) {
    return (
      <div className="client-page-wrapper">
        <Navbar />
        <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--body)', color: 'rgba(10,10,10,0.5)' }}>
          No data available for this integration.
        </div>
        <Footer />
      </div>
    );
  }

  const actions = (appData.actions ?? []).filter((e: PluginEvent) => e.type === 'action');

  return (
    <div className="client-page-wrapper">
      <Navbar />

      <AppClientHero
        client={client}
        appName={appData.name}
        appIcon={appData.iconurl}
        description={appData.description}
      />

      <WorkflowsSection
        clientTitle={client.title}
        appName={appData.name}
        useCases={appData.use_cases ?? []}
      />

      <ChatDemoSection
        clientTitle={client.title}
        appName={appData.name}
        prompts={appData.prompt_to_action ?? []}
      />

      <ActionsPreview
        clientTitle={client.title}
        appName={appData.name}
        appSlug={appSlug}
        actions={actions}
      />

      <HowToConnect client={client} otherClients={otherClients} clientApiData={clientApiData} />

      <Pricing />

      <Blog />

      <FAQ items={appData.faqs ?? []} />

      <AboutSection
        client={client}
        appName={appData.name}
        appIcon={appData.iconurl}
        appDescription={appData.description}
        appDomain={appData.domain}
      />

      <Footer />
    </div>
  );
}
