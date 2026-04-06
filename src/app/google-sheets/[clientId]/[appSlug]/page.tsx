import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import { fetchAiClients } from '@/lib/ai-clients';
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
  const [clients, res] = await Promise.all([
    fetchAiClients(),
    fetch(`${RECOMMEND_API}${appSlug}`, { next: { revalidate: 3600 } }),
  ]);
  const client = clients.find((c) => c.id === clientId);
  if (!client || !res.ok) return { title: 'Mushrooms MCP' };
  const data: RecommendResponse = await res.json();
  const app = data.plugins[appSlug];
  if (!app) return { title: 'Mushrooms MCP' };
  return {
    title: `Connect ${client.title} to ${app.name} — Mushrooms MCP`,
    description: `Let ${client.title} take actions in ${app.name} via the Mushrooms MCP Server. Free. No code required.`,
    icons: { icon: '/mushroom-logo.svg' },
  };
}

export default async function AppClientPage(
  { params }: { params: Promise<{ clientId: string; appSlug: string }> }
) {
  const { clientId, appSlug } = await params;

  const [clients, res] = await Promise.all([
    fetchAiClients(),
    fetch(`${RECOMMEND_API}${appSlug}`, { next: { revalidate: 3600 } }),
  ]);

  const client = clients.find((c) => c.id === clientId);
  if (!client) notFound();
  if (!res.ok) notFound();

  const data: RecommendResponse = await res.json();
  const app = data.plugins[appSlug];
  if (!app) notFound();

  const actions = (app.events ?? []).filter((e) => e.type === 'action');
  const otherClients = clients.filter((c) => c.id !== clientId);

  return (
    <div className="client-page-wrapper">
      <Navbar />

      <AppClientHero
        client={client}
        appName={app.name}
        appIcon={app.iconurl}
      />

      <StatsStrip />

      <WorkflowsSection
        clientTitle={client.title}
        appName={app.name}
        combinations={data.combinations}
      />

      <ChatDemoSection clientTitle={client.title} appName={app.name} />

      <ActionsPreview
        clientTitle={client.title}
        appName={app.name}
        appSlug={appSlug}
        actions={actions}
      />

      <HowToConnect client={client} otherClients={otherClients} />

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
}
