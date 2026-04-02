import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

// Proxy to thingsofbrand.com icon API
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;

  // Redirect to thingsofbrand.com icon API
  const iconUrl = `https://thingsofbrand.com/api/icon/${domain}`;
  return NextResponse.redirect(iconUrl);
}
