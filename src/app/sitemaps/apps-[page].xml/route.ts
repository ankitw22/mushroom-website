import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://plug-service.viasocket.com/api/v1/plugins/all';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const LIMIT = 45;

const buildAppsUrl = (limit: number, offset: number) => {
  return `${BASE_URL}?limit=${limit}&offset=${offset}`;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await context.params;
    const pageNum = Number(page);

    if (!pageNum || pageNum < 1) {
      return new NextResponse('Invalid sitemap page', { status: 400 });
    }

    const offset = (pageNum - 1) * LIMIT;
    const apiUrl = buildAppsUrl(LIMIT, offset);

    const res = await fetch(apiUrl, {
      headers: { accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch apps', { status: 500 });
    }

    const json = await res.json();
    const apps = json?.data || [];

    if (!apps.length) {
      return new NextResponse('No sitemap data found', { status: 404 });
    }

    const urls = apps
      .filter((app: any) => app?.app_slug)
      .map(
        (app: any) => `
  <url>
    <loc>${SITE_URL}/mcp/${app.app_slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('SITEMAP ERROR:', error);
    return new NextResponse('Failed to generate sitemap', { status: 500 });
  }
}
