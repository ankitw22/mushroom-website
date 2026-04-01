import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

// This route is deprecated - icons are now loaded from reliable CDN sources
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;

  // Redirect to a reliable icon source as fallback
  const iconMap: Record<string, string> = {
    'slack.com': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
    'notion.so': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
    'gmail.com': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    'github.com': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    'linear.app': 'https://api.iconify.design/logos/linear.svg',
    'hubspot.com': 'https://api.iconify.design/logos/hubspot.svg',
  };

  const iconUrl = iconMap[domain];
  if (iconUrl) {
    return NextResponse.redirect(iconUrl);
  }

  return new NextResponse(null, { status: 404 });
}
