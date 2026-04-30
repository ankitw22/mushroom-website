import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import { fetchAiClients } from '@/lib/ai-clients';
import { fetchAiClientData } from '@/lib/ai-client-data';
import { fetchAiAppData, fetchAiAppWorkflows, type AiAppData, type Workflow } from '@/lib/ai-app-data';
import { HowToConnect } from '../HowToConnect';
import { AppClientHero } from './AppClientHero';
import { StatsStrip } from './StatsStrip';
import { WorkflowsSection } from './WorkflowsSection';
import { ChatDemoSection } from './ChatDemoSection';
import { ActionsPreview } from './ActionsPreview';
import { AboutSection } from './AboutSection';
import '../../client-ui.css';

export const runtime = 'edge';

const RECOMMEND_API = 'https://plug-service.viasocket.com/api/v1/plugins/recommend/integrations?service=';

interface PluginEvent {
  name: string;
  description: string;
  type: 'action' | 'trigger';
}

interface Plugin {
  name: string;
  description: string;
  iconurl: string;
  domain: string;
}

interface Combination {
  description: string;
  trigger: { name: string; id: string };
  actions: { name: string; id: string }[];
  score: number;
}

interface RecommendResponse {
  combinations: Combination[];
  plugins: Record<string, Plugin & { events: PluginEvent[] }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ clientId: string; appSlug: string }> }
): Promise<Metadata> {
  const { clientId, appSlug } = await params;
  
  // Production-ready error boundaries
  try {
    // Try to fetch from dbdash API first
    const [clients, dynamicAppData, res] = await Promise.all([
      fetchAiClients(),
      fetchAiAppData(appSlug, clientId),
      fetch(`${RECOMMEND_API}${appSlug}`, { next: { revalidate: 3600 } }),
    ]);
    
    const client = clients.find((c) => c.id === clientId);
    if (!client) return { title: 'Mushrooms MCP' };
    
    // Use dynamic data if available, otherwise fallback to static API
    let app: any = null;
    if (dynamicAppData) {
      app = {
        name: dynamicAppData.name,
        description: dynamicAppData.description,
        iconurl: dynamicAppData.iconurl,
        domain: dynamicAppData.domain,
      };
    } else if (res.ok) {
      const data: RecommendResponse = await res.json();
      app = data.plugins[appSlug];
    }
    
    if (!app) return { title: 'Mushrooms MCP' };
    
    const title = `Connect ${client.title} to ${app.name} — Mushrooms MCP`;
    const description = `Let ${client.title} take actions in ${app.name} via the Mushrooms MCP Server. Free. No code required.`;
    
    return {
      title,
      description,
      icons: { icon: '/mushroom-logo.svg' },
      openGraph: {
        title,
        description: app.description,
        images: app.iconurl ? [{ url: app.iconurl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: app.description,
        images: app.iconurl ? [app.iconurl] : undefined,
      },
    };
  } catch (error) {
    // Fallback metadata for production stability
    if (process.env.NODE_ENV === 'development') {
      console.error('Metadata generation error:', error);
    }
    return {
      title: 'Mushrooms MCP',
      description: 'Connect AI tools with your favorite apps via Mushrooms MCP Server.',
    };
  }
}

export default async function AppClientPage(
  { params }: { params: Promise<{ clientId: string; appSlug: string }> }
) {
  const { clientId, appSlug } = await params;

  // Production-ready data fetching with error boundaries
  try {
    // Try to fetch from dbdash API first, with fallback to static API
    const [clients, dynamicAppData, dynamicWorkflows, res, clientApiData] = await Promise.all([
      fetchAiClients(),
      fetchAiAppData(appSlug, clientId),
      fetchAiAppWorkflows(appSlug, clientId),
      fetch(`${RECOMMEND_API}${appSlug}`, { next: { revalidate: 3600 } }),
      fetchAiClientData(clientId),
    ]);

    const client = clients.find((c) => c.id === clientId);
    if (!client) notFound();

    // Use dynamic data if available, otherwise fallback to static API
    let app: any = null;
    let combinations: Combination[] = [];
    let actions: PluginEvent[] = [];

    if (dynamicAppData) {
      // Use dynamic data from dbdash API
      app = {
        name: dynamicAppData.name,
        description: dynamicAppData.description,
        iconurl: dynamicAppData.iconurl,
        domain: dynamicAppData.domain,
        events: dynamicAppData.events || [],
      };
      
      // Use dynamic workflows if available
      if (dynamicWorkflows && dynamicWorkflows.length > 0) {
        combinations = dynamicWorkflows.map(workflow => ({
          description: workflow.description,
          trigger: workflow.trigger,
          actions: workflow.actions,
          score: workflow.score,
        }));
      }
      
      actions = (dynamicAppData.actions || []).filter((e: PluginEvent) => e.type === 'action');
      
    } else if (res.ok) {
      // Fallback to static API
      const data: RecommendResponse = await res.json();
      app = data.plugins[appSlug];
      if (!app) notFound();
      combinations = data.combinations;
      actions = (app.events ?? []).filter((e: PluginEvent) => e.type === 'action');
    } else {
      notFound();
    }

    const otherClients = clients.filter((c) => c.id !== clientId);

    return (
      <div className="client-page-wrapper">
        <Navbar />

        <AppClientHero
          client={client}
          appName={app.name}
          appIcon={app.iconurl}
        />

        <WorkflowsSection
          clientTitle={client.title}
          appName={app.name}
          combinations={combinations}
        />

        <ChatDemoSection clientTitle={client.title} appName={app.name} />

        <ActionsPreview
          clientTitle={client.title}
          appName={app.name}
          appSlug={appSlug}
          actions={actions}
        />

        <HowToConnect client={client} otherClients={otherClients} clientApiData={clientApiData} />

        <Pricing />

        <Blog />

        <FAQ />

        <AboutSection
          client={client}
          appName={app.name}
          appIcon={app.iconurl}
          appDescription={app.description}
          appDomain={app.domain}
        />

        <Footer />
      </div>
    );
  } catch (error) {
    // Production error handling
    if (process.env.NODE_ENV === 'development') {
      console.error('AppClientPage error:', error);
    }
    notFound();
  }
}
