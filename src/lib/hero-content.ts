/**
 * Fetches Hero2 component content and positioning from the viasocket table API.
 *
 * DB table: https://table-api.viasocket.com/69d49705c98b7a1ea940fbc9/tblw93xqh
 *
 * The row is stored with:
 *   name: "hero2"
 *   componentjson[0].componentJSON: JSON string of all hero content fields
 */

const TABLE_API = 'https://table-api.viasocket.com/69d49705c98b7a1ea940fbc9/tblw93xqh';
const AUTH_KEY = 'keyWWd7noIucHa1';

// Validates CSS length values to prevent injection into <style> blocks
// Allows: 48px, 3vh, 12vw, 1.5rem, 80%, etc.
function safeCssLength(value: unknown, fallback: string): string {
  if (typeof value === 'string' && /^\d+(\.\d+)?(px|vh|vw|rem|em|%)$/.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

// Validates URLs — only allows http/https to prevent javascript: XSS
function safeUrl(value: unknown, fallback: string): string {
  if (typeof value === 'string' && /^https?:\/\/.+/.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

export interface HeroContent {
  // Content
  title: string;
  subtitlePrefix: string;
  subtitleHighlight: string;
  subtitleSuffix: string; // {count} is replaced at render time
  ctaText: string;
  ctaHref: string;

  // Colors
  bgColor: string;
  titleColor: string;
  subtitleColor: string;
  subtitleMutedColor: string;
  ctaBgColor: string;
  ctaTextColor: string;

  // Typography (used in CSS clamp())
  titleSizeMin: string;
  titleSizeMax: string;
  titleSizeVw: string;
  subtitleSizeMin: string;
  subtitleSizeMax: string;
  subtitleSizeVw: string;
  ctaSizeMin: string;
  ctaSizeMax: string;
  ctaSizeVw: string;

  // Spacing
  containerPaddingTop: string;
  contentPaddingTopVh: string;
  chatDemoMarginTopMobile: string;
  chatDemoMarginTopSm: string;
  chatDemoMarginTopLg: string;

  // Min-heights
  minHeightBase: string;
  minHeightSm: string;
  minHeightMd: string;
  minHeightLg: string;
}

export const HERO_CONTENT_DEFAULTS: HeroContent = {
  title: 'MUSHROOMS',
  subtitlePrefix: 'Give your AI the',
  subtitleHighlight: 'Power to act',
  subtitleSuffix: 'across {count} apps',
  ctaText: 'Get Started free',
  ctaHref: 'https://app.mushrooms.viasocket.com/login',

  bgColor: 'var(--green)',
  titleColor: 'var(--ink)',
  subtitleColor: '#ffffff',
  subtitleMutedColor: 'var(--ink)',
  ctaBgColor: 'var(--ink)',
  ctaTextColor: '#ffffff',

  titleSizeMin: '48px',
  titleSizeMax: '160px',
  titleSizeVw: '12vw',
  subtitleSizeMin: '16px',
  subtitleSizeMax: '40px',
  subtitleSizeVw: '3.5vw',
  ctaSizeMin: '11px',
  ctaSizeMax: '16px',
  ctaSizeVw: '2.8vw',

  containerPaddingTop: '40px',
  contentPaddingTopVh: '3vh',
  chatDemoMarginTopMobile: '50px',
  chatDemoMarginTopSm: '80px',
  chatDemoMarginTopLg: '120px',

  minHeightBase: '580px',
  minHeightSm: '750px',
  minHeightMd: '1000px',
  minHeightLg: '1350px',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToHeroContent(row: Record<string, any>): HeroContent {
  const d = HERO_CONTENT_DEFAULTS;
  const css = safeCssLength;
  return {
    title:                   typeof row.title === 'string'               ? row.title               : d.title,
    subtitlePrefix:          typeof row.subtitle_prefix === 'string'     ? row.subtitle_prefix     : d.subtitlePrefix,
    subtitleHighlight:       typeof row.subtitle_highlight === 'string'  ? row.subtitle_highlight  : d.subtitleHighlight,
    subtitleSuffix:          typeof row.subtitle_suffix === 'string'     ? row.subtitle_suffix     : d.subtitleSuffix,
    ctaText:                 typeof row.cta_text === 'string'            ? row.cta_text            : d.ctaText,
    ctaHref:                 safeUrl(row.cta_href, d.ctaHref),

    bgColor:                 typeof row.bg_color === 'string'            ? row.bg_color            : d.bgColor,
    titleColor:              typeof row.title_color === 'string'         ? row.title_color         : d.titleColor,
    subtitleColor:           typeof row.subtitle_color === 'string'      ? row.subtitle_color      : d.subtitleColor,
    subtitleMutedColor:      typeof row.subtitle_muted_color === 'string' ? row.subtitle_muted_color : d.subtitleMutedColor,
    ctaBgColor:              typeof row.cta_bg_color === 'string'        ? row.cta_bg_color        : d.ctaBgColor,
    ctaTextColor:            typeof row.cta_text_color === 'string'      ? row.cta_text_color      : d.ctaTextColor,

    // CSS length values injected into <style> block — must be validated
    titleSizeMin:            css(row.title_size_min,             d.titleSizeMin),
    titleSizeMax:            css(row.title_size_max,             d.titleSizeMax),
    titleSizeVw:             css(row.title_size_vw,              d.titleSizeVw),
    subtitleSizeMin:         css(row.subtitle_size_min,          d.subtitleSizeMin),
    subtitleSizeMax:         css(row.subtitle_size_max,          d.subtitleSizeMax),
    subtitleSizeVw:          css(row.subtitle_size_vw,           d.subtitleSizeVw),
    ctaSizeMin:              css(row.cta_size_min,               d.ctaSizeMin),
    ctaSizeMax:              css(row.cta_size_max,               d.ctaSizeMax),
    ctaSizeVw:               css(row.cta_size_vw,                d.ctaSizeVw),

    containerPaddingTop:     css(row.container_padding_top,      d.containerPaddingTop),
    contentPaddingTopVh:     css(row.content_padding_top_vh,     d.contentPaddingTopVh),
    chatDemoMarginTopMobile: css(row.chat_demo_margin_top_mobile, d.chatDemoMarginTopMobile),
    chatDemoMarginTopSm:     css(row.chat_demo_margin_top_sm,    d.chatDemoMarginTopSm),
    chatDemoMarginTopLg:     css(row.chat_demo_margin_top_lg,    d.chatDemoMarginTopLg),

    minHeightBase:           css(row.min_height_base,            d.minHeightBase),
    minHeightSm:             css(row.min_height_sm,              d.minHeightSm),
    minHeightMd:             css(row.min_height_md,              d.minHeightMd),
    minHeightLg:             css(row.min_height_lg,              d.minHeightLg),
  };
}

/**
 * Fetches the hero2 content row from the DB.
 * The webhook stores content as a JSON string inside componentjson[0].componentJSON.
 * Falls back to hardcoded defaults on any error or missing field.
 */
export async function fetchHeroContent(): Promise<HeroContent> {
  try {
    const url = `${TABLE_API}?filter=name = 'hero2'`;
    const res = await fetch(url, {
      headers: { 'auth-key': AUTH_KEY },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000), // don't block the page render if DB is slow
    });

    if (!res.ok) return HERO_CONTENT_DEFAULTS;

    const json = await res.json();
    const row = json?.data?.rows?.[0];
    if (!row) return HERO_CONTENT_DEFAULTS;

    // Data is stored as a JSON string inside componentjson[0].componentJSON
    const componentJsonStr = row?.componentjson?.[0]?.componentJSON;
    if (componentJsonStr) {
      const parsed = JSON.parse(componentJsonStr);
      return mapRowToHeroContent(parsed);
    }

    // Fallback: try flat columns on the row itself
    return mapRowToHeroContent(row);
  } catch {
    return HERO_CONTENT_DEFAULTS;
  }
}
