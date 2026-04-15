import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Integrations from '@/components/sections/Integrations';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import { fetchAiClients } from '@/lib/ai-clients';
import { fetchAiClientData } from '@/lib/ai-client-data';
import { ClientHero } from './ClientHero';
import { HowToConnect } from './HowToConnect';
import { AlsoWorksWith } from './AlsoWorksWith';
import '../client-ui.css';

export const runtime = 'edge';

export async function generateMetadata(
  { params }: { params: Promise<{ clientId: string }> }
): Promise<Metadata> {
  const { clientId } = await params;
  const clients = await fetchAiClients();
  const client = clients.find((c) => c.id === clientId);
  if (!client) return { title: 'Mushrooms MCP' };
  return {
    title: `Connect ${client.title} to 2,000+ Apps — Mushrooms MCP`,
    description: `Use ${client.title} with any app via the Mushrooms MCP Server. No code required. Free forever.`,
    icons: { icon: '/mushroom-logo.svg' },
  };
}

export default async function ClientPage(
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const [clients, clientApiData] = await Promise.all([
    fetchAiClients(),
    fetchAiClientData(clientId),
  ]);
  const client = clients.find((c) => c.id === clientId);
  if (!client) notFound();

  const otherClients = clients.filter((c) => c.id !== clientId);

  return (
    <div className="client-page-wrapper">
      <Navbar />

      {/* Hero */}
      <ClientHero client={client} />

      {/* Apps grid — links to /aiclients/[clientId]/[appSlug] */}
      <Integrations clientId={clientId} />

      {/* How to connect */}
      <HowToConnect client={client} otherClients={otherClients} clientApiData={clientApiData} />

      {/* Pricing */}
      <Pricing />

      {/* FAQ */}
      <FAQ />

      {/* Also works with */}
      <AlsoWorksWith currentClient={client} otherClients={otherClients} />

      <Footer />
    </div>
  );
}
