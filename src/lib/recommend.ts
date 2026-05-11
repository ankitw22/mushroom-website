const RECOMMEND_API =
  'https://plug-service.viasocket.com/api/v1/plugins/recommend/integrations?service=';

export interface PluginEvent {
  rowid?: string;
  name: string;
  description: string;
  type: 'action' | 'trigger';
  preposition?: string | null;
}

export interface Plugin {
  rowid?: string;
  name: string;
  description: string;
  appslugname?: string;
  iconurl: string;
  category?: string[];
  domain: string;
  brandcolor?: string | null;
  autonumber?: number;
  events: PluginEvent[];
}

export interface Combination {
  description: string;
  trigger: { name: string; id: string };
  actions: { name: string; id: string }[];
  score: number;
}

export interface RecommendResponse {
  combinations: Combination[];
  plugins: Record<string, Plugin>;
}

/**
 * Fetches recommended integrations / plugin metadata for a given app slug.
 * Returns `null` if the request fails or the response is not OK.
 */
export async function fetchRecommendedIntegrations(
  slug: string,
  options: { revalidate?: number } = {}
): Promise<RecommendResponse | null> {
  try {
    const res = await fetch(`${RECOMMEND_API}${slug}`, {
      next: { revalidate: options.revalidate ?? 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as RecommendResponse;
  } catch {
    return null;
  }
}
