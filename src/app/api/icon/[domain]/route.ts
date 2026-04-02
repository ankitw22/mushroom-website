import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

// Timeout duration in milliseconds
const FETCH_TIMEOUT_MS = 5000;

// 1x1 transparent PNG as fallback (base64)
const TRANSPARENT_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

// Proxy to thingsofbrand.com icon API - actually fetch and return the image
// This avoids CORS issues when loading images into canvas
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;

  try {
    const iconUrl = `https://thingsofbrand.com/api/icon/${domain}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    
    try {
      const response = await fetch(iconUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MushroomWebsite/1.0)',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Return transparent PNG on upstream error
        return new NextResponse(TRANSPARENT_PNG, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'Access-Control-Allow-Origin': '*',
          },
        });
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Check if it was a timeout/abort
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.warn(`Timeout fetching icon for ${domain} after ${FETCH_TIMEOUT_MS}ms`);
      } else {
        console.error(`Fetch error for ${domain}:`, fetchError);
      }
      
      // Return transparent PNG as graceful fallback
      return new NextResponse(TRANSPARENT_PNG, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300, s-maxage=300', // Shorter cache for fallback
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    console.error(`Failed to fetch icon for ${domain}:`, error);
    
    // Return transparent PNG on any error
    return new NextResponse(TRANSPARENT_PNG, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
