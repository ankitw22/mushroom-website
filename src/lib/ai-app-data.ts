const TABLE_API = 'https://table-api.viasocket.com/69d49705c98b7a1ea940fbc9/tblwftut9';
const AUTH_KEY = 'keyAVEFEZnbZoW1';

export interface AiAppData {
  // Core fields (required)
  id: string;
  name: string;
  description: string;
  iconurl: string;
  domain: string;
  
  // Optional metadata
  category?: string;
  tags?: string[];
  features?: string[];
  pricing?: string;
  documentation_url?: string;
  api_docs?: string;
  github_url?: string;
  website_url?: string;
  popularity?: number;
  rating?: number;
  total_installs?: number;
  last_updated?: string;
  version?: string;
  author?: string;
  license?: string;
  
  // Interactive elements
  events?: PluginEvent[];
  actions?: PluginEvent[];
  triggers?: PluginEvent[];
  workflows?: Workflow[];
  integrations?: string[];
  
  // Media and support
  screenshots?: string[];
  video_url?: string;
  tutorials?: Tutorial[];
  faqs?: FAQ[];
  support_contact?: string;
  community_url?: string;
  
  // Status
  status?: 'active' | 'beta' | 'deprecated' | 'coming_soon';
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
    // Build query with proper escaping
    let url = `${TABLE_API}?filter=app_slug = '${appSlug.replace(/'/g, "''")}'`;
    if (clientId) {
      url += ` AND ai_client = '${clientId.replace(/'/g, "''")}'`;
    }

    const res = await fetch(url, {
      headers: { 'auth-key': AUTH_KEY },
      next: { revalidate: DEFAULT_CACHE_TTL / 1000 }, // Convert to seconds
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
      description: row.app_description || '',
      iconurl: row.iconurl || '',
      domain: row.app_domain || '',
      category: row.category,
      tags: parseJsonSafely(row.tags, []),
      features: parseJsonSafely(row.features, []),
      pricing: row.pricing,
      documentation_url: row.documentation_url,
      api_docs: row.api_docs,
      github_url: row.github_url,
      website_url: row.website_url,
      popularity: row.popularity ? Number(row.popularity) : undefined,
      rating: row.rating ? Number(row.rating) : undefined,
      total_installs: row.total_installs ? Number(row.total_installs) : undefined,
      last_updated: row.last_updated,
      version: row.version,
      author: row.author,
      license: row.license,
      events: parseJsonSafely(row.app_actions, []).map((action: string) => ({
        name: action,
        description: action,
        type: 'action' as const
      })),
      actions: parseJsonSafely(row.app_actions, []).map((action: string) => ({
        name: action,
        description: action,
        type: 'action' as const
      })),
      triggers: parseJsonSafely(row.app_triggers, []).map((trigger: string) => ({
        name: trigger,
        description: trigger,
        type: 'trigger' as const
      })),
      workflows: parseJsonSafely(row.workflows, []),
      integrations: parseJsonSafely(row.integrations, []),
      screenshots: parseJsonSafely(row.screenshots, []),
      video_url: row.video_url,
      tutorials: parseJsonSafely(row.tutorials, []),
      faqs: parseJsonSafely(row.faqs, []),
      support_contact: row.support_contact,
      community_url: row.community_url,
      status: row.status || 'active',
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

export async function fetchAiAppWorkflows(appSlug: string, clientId: string): Promise<Workflow[] | null> {
  const cacheKey = `workflows-${appSlug}-${clientId}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    // Workflows are stored in the same table as app data
    const url = `${TABLE_API}?filter=app_slug = '${appSlug.replace(/'/g, "''")}' AND ai_client = '${clientId.replace(/'/g, "''")}'`;
    
    const res = await fetch(url, {
      headers: { 'auth-key': AUTH_KEY },
      next: { revalidate: WORKFLOW_CACHE_TTL / 1000 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const row = json?.data?.rows?.[0];
    
    if (!row) return null;

    // Parse workflows safely
    const parseJsonSafely = <T>(raw: unknown, fallback: T): T => {
      if (typeof raw !== 'string') return (raw as T) ?? fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    };

    const workflows = parseJsonSafely(row.workflows, []).map((workflow: any) => ({
      id: workflow.id || workflow.name || `workflow-${Date.now()}`,
      name: workflow.name || 'Unnamed Workflow',
      description: workflow.description || '',
      trigger: workflow.trigger || { name: '', id: '' },
      actions: Array.isArray(workflow.actions) ? workflow.actions : [],
      score: typeof workflow.score === 'number' ? workflow.score : 0,
      complexity: workflow.complexity,
      estimated_time: workflow.estimated_time,
      tags: Array.isArray(workflow.tags) ? workflow.tags : [],
    }));

    setCache(cacheKey, workflows, WORKFLOW_CACHE_TTL);
    return workflows;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching workflows for ${appSlug}:`, error);
    }
    return null;
  }
}

// Production utility functions
export function clearAiAppCache(): void {
  cache.clear();
}

// Preload popular apps for better performance
export async function preloadPopularApps(popularSlugs: string[]): Promise<void> {
  if (process.env.NODE_ENV !== 'production') return; // Only in production
  
  const promises = popularSlugs.map(slug => 
    fetchAiAppData(slug).catch(() => null) // Don't fail preload
  );
  await Promise.allSettled(promises);
}

// Health check for API
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(TABLE_API, {
      headers: { 'auth-key': AUTH_KEY },
    });
    return res.ok;
  } catch {
    return false;
  }
}
