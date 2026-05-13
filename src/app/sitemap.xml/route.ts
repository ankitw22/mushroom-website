const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const APPS_PER_SITEMAP = 45;
const TOTAL_APPS = 500; // dynamically fetch later

export async function GET() {
  const totalPages = Math.ceil(TOTAL_APPS / APPS_PER_SITEMAP);

  const sitemapUrls = [];

  // apps sitemap chunks
  for (let i = 1; i <= totalPages; i++) {
    sitemapUrls.push({
      url: `${baseUrl}/sitemaps/apps-${i}.xml`,
      lastModified: new Date(),
    });
  }

  // other sitemap files
  sitemapUrls.push({
    url: `${baseUrl}/sitemap-aiclients.xml`,
    lastModified: new Date(),
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
      .map(
        (item) => `
  <sitemap>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
  </sitemap>`
      )
      .join('')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control':
        'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}