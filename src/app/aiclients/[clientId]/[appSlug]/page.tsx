import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchAiClients } from '@/lib/ai-clients';
import { fetchAiClientData } from '@/lib/ai-client-data';
import { fetchAiAppData } from '@/lib/ai-app-data';
import { AppClientPageContent } from './AppClientPageContent';
import '../../client-ui.css';

export const runtime = 'edge';

export async function generateMetadata(
  { params }: { params: Promise<{ clientId: string; appSlug: string }> }
): Promise<Metadata> {
  const { clientId, appSlug } = await params;

  try {
    const clients = await fetchAiClients();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return { title: 'Mushrooms MCP' };

    const appData = await fetchAiAppData(appSlug, client.title);
    if (!appData) return { title: 'Mushrooms MCP' };

    const title = appData.page_title || `Connect ${client.title} to ${appData.name} — Mushrooms MCP`;
    const description = appData.meta_description || appData.description || `Let ${client.title} take actions in ${appData.name} via Mushrooms.`;
    const keywords = [
      ...(appData.primary_keywords ?? []),
      ...(appData.secondary_keywords ?? []),
    ];

    return {
      title,
      description,
      keywords: keywords.length ? keywords : undefined,
      icons: { icon: '/mushroom-logo.svg' },
      openGraph: {
        title,
        description,
        images: appData.iconurl ? [{ url: appData.iconurl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: appData.iconurl ? [appData.iconurl] : undefined,
      },
    };
  } catch (error) {
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

  const clients = await fetchAiClients();
  const client = clients.find((c) => c.id === clientId);
  if (!client) notFound();

  const clientApiData = await fetchAiClientData(clientId);
  const otherClients = clients.filter((c) => c.id !== clientId);

  return (
    <AppClientPageContent
      client={client}
      otherClients={otherClients}
      clientApiData={clientApiData}
      appSlug={appSlug}
    />
  );
}
