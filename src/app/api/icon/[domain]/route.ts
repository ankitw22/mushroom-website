import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

// Proxy to thingsofbrand.com icon API - actually fetch and return the image
// This avoids CORS issues when loading images into canvas
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;

  try {
    const iconUrl = `https://thingsofbrand.com/api/icon/${domain}`;
    const response = await fetch(iconUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MushroomWebsite/1.0)',
      },
    });

    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error(`Failed to fetch icon for ${domain}:`, error);
    return new NextResponse(null, { status: 500 });
  }
}
