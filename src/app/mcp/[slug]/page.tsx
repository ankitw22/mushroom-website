import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import './../mcp-ui.css';
import { fetchMcpAppData } from '@/lib/mcp-app-data';
import { fetchRecommendedIntegrations } from '@/lib/recommend';
import { McpPageContent } from './McpPageContent';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [data, tableData] = await Promise.all([
      fetchRecommendedIntegrations(slug),
      fetchMcpAppData(slug),
    ]);
    if (!data) return { title: 'Mushroom Server' };
    const app = data.plugins[slug];
    if (!app) return { title: 'Mushroom Server' };
    const actionCount = (app.events ?? []).filter((e) => e.type === 'action').length;
    const triggerCount = (app.events ?? []).filter((e) => e.type === 'trigger').length;

    const title = tableData?.page_title || `MCP Server for ${app.name} | Mushrooms`;
    const description = tableData?.meta_description || `Mushrooms connects your AI to ${app.name} with ${actionCount}+ supported actions and ${triggerCount}+ triggers. Select what your AI can do and let it execute.`;
    const keywords = [
      ...(tableData?.primary_keyword ?? []),
      ...(tableData?.secondary_keyword ?? []),
    ];
    const url = `https://mushroom.viasocket.com/mcp/${slug}`;

    return {
      title,
      description,
      keywords: keywords.length ? keywords : undefined,
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

  const data = await fetchRecommendedIntegrations(slug);
  if (!data) notFound();

  const app = data.plugins[slug];
  if (!app) notFound();

  return <McpPageContent slug={slug} app={app} />;
}
