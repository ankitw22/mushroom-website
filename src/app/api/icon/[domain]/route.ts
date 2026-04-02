import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

// Timeout duration in milliseconds
const FETCH_TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // Start with 1 second

// Helper function for retry with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries: number = MAX_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      
      // If it's the last attempt, return the failed response
      if (attempt === retries) {
        return response;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

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
      const response = await fetchWithRetry(iconUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MushroomWebsite/1.0)',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Return proper error response
        return NextResponse.json(
          { error: `Failed to fetch icon: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
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
        return NextResponse.json(
          { error: `Timeout fetching icon for ${domain}` },
          { status: 408 }
        );
      } else {
        console.error(`Fetch error for ${domain}:`, fetchError);
        return NextResponse.json(
          { error: `Failed to fetch icon: ${fetchError}` },
          { status: 502 }
        );
      }
    }
  } catch (error) {
    console.error(`Failed to fetch icon for ${domain}:`, error);
    
    // Return proper error response
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
