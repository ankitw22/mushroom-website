const TABLE_API = 'https://table-api.viasocket.com/69d49705c98b7a1ea940fbc9/tbllyuo80';
const AUTH_KEY = 'keyyZ74wvd8-mL_';

export interface UseCaseCard {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface McpAppData {
  app_name: string;
  app_domain: string;
  app_description: string;
  app_slug: string;
  page_title: string;
  meta_description: string;
  h1_title: string;
  subheadline: string;
  primary_keyword: string[];
  secondary_keyword: string[];
  use_case_cards: UseCaseCard[];
  faqs: FaqItem[];
}

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string') return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function fetchMcpAppData(slug: string): Promise<McpAppData | null> {
  try {
    const url = `${TABLE_API}?filter=app_slug = '${slug}'`;
    const res = await fetch(url, {
      headers: { 'auth-key': AUTH_KEY },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const row = json?.data?.rows?.[0];
    if (!row) return null;

    return {
      app_name: row.app_name ?? '',
      app_domain: row.app_domain ?? '',
      app_description: row.app_description ?? '',
      app_slug: row.app_slug ?? '',
      page_title: row.page_title ?? '',
      meta_description: row.meta_description ?? '',
      h1_title: row.h1_title ?? '',
      subheadline: row.subheadline ?? '',
      primary_keyword: parseJson<string[]>(row.primary_keyword, []),
      secondary_keyword: parseJson<string[]>(row.secondary_keyword, []),
      use_case_cards: parseJson<UseCaseCard[]>(row.use_case_cards, []),
      faqs: parseJson<FaqItem[]>(row.faqs, []),
    };
  } catch {
    return null;
  }
}
