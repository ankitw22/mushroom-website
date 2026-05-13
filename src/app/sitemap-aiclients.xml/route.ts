import { fetchAiClients } from '@/lib/ai-clients';
import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const clients = await fetchAiClients();

    const urls = clients
      .filter((client) => client?.id)
      .map(
        (client) => `
  <url>
    <loc>${SITE_URL}/aiclients/${client.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control':
          'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('AI CLIENT SITEMAP ERROR:', error);

    return new NextResponse('Failed to generate sitemap', {
      status: 500,
    });
  }
}