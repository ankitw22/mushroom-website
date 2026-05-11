const AI_APP_FLOW_URL = 'https://flow.sokt.io/func/scri0AaQsJHj';

export interface PromptToAction {
  user_prompt: string;
  ai_action: string;
}

export interface AiAppData {
  // Core fields (required)
  id: string;
  name: string;
  description: string;
  iconurl: string;
  domain: string;
  app_slug: string;
  ai_client: string;

  // SEO + page copy
  page_title?: string;
  meta_description?: string;
  primary_keywords?: string[];
  secondary_keywords?: string[];

  // Interactive elements
  actions?: PluginEvent[];
  prompt_to_action?: PromptToAction[];
  use_cases?: string[];
  faqs?: FAQ[];
}

export interface PluginEvent {
  name: string;
  description: string;
  type: 'action' | 'trigger';
  // Future extensions
  parameters?: Record<string, any>;
  examples?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: { name: string; id: string };
  actions: { name: string; id: string }[];
  score: number;
  // Optional metadata
  complexity?: 'simple' | 'medium' | 'complex';
  estimated_time?: string;
  tags?: string[];
}

export interface Tutorial {
  title: string;
  url: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

// Production-ready cache with TTL
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const WORKFLOW_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 1000; // Prevent memory leaks

function getCacheKey(appSlug: string, clientId?: string): string {
  return clientId ? `${appSlug}-${clientId}` : appSlug;
}

function isCacheValid(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
}

function setCache(key: string, data: any, ttl: number): void {
  // Prevent memory leaks by limiting cache size
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

function getCache(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (!isCacheValid(cached.timestamp, cached.ttl)) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export async function fetchAiAppData(appSlug: string, clientId?: string): Promise<AiAppData | null> {
  // Check cache first
  const cacheKey = getCacheKey(appSlug, clientId);
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const res = await fetch(AI_APP_FLOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_slug: appSlug,
        ai_client: clientId,
      }),
    });

    if (!res.ok) {
      // Only log in development or for critical errors
      if (process.env.NODE_ENV === 'development' || res.status >= 500) {
        console.error(`Failed to fetch app data for ${appSlug}: ${res.status}`);
      }
      return null;
    }

    const json = await res.json();
    const row = json?.data?.rows?.[0];
    
    if (!row) {
      return null; // Silent fail - fallback will handle this
    }

    // Parse JSON fields safely
    const parseJsonSafely = <T>(raw: unknown, fallback: T): T => {
      if (typeof raw !== 'string') return (raw as T) ?? fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    };

    const appData: AiAppData = {
      id: row.unique_id || appSlug,
      name: row.name || appSlug,
      description: row.description || row.app_description || '',
      iconurl: row.iconurl || '',
      domain: row.app_domain || '',
      app_slug: row.app_slug || appSlug,
      ai_client: row.ai_client || '',
      page_title: row.page_title,
      meta_description: row.meta_description,
      primary_keywords: parseJsonSafely(row.primary_keywords, []),
      secondary_keywords: parseJsonSafely(row.secondary_keywords, []),
      actions: parseJsonSafely<string[]>(row.app_actions, []).map((action: string) => ({
        name: action,
        description: action,
        type: 'action' as const,
      })),
      prompt_to_action: parseJsonSafely(row.prompt_to_action, []),
      use_cases: parseJsonSafely(row.use_cases, []),
      faqs: parseJsonSafely(row.faqs, []),
    };

    // Cache the result with TTL
    setCache(cacheKey, appData, DEFAULT_CACHE_TTL);
    
    return appData;
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching app data for ${appSlug}:`, error);
    }
    return null;
  }
}

// Production utility functions
export function clearAiAppCache(): void {
  cache.clear();
}
