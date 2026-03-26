import { PluginsAllResponse, PluginIntegrationsResponse } from '@/types/api';

const API_BASE = 'https://plug-service.viasocket.com/api/v1/plugins';

export async function getAllApps(): Promise<PluginsAllResponse> {
  const res = await fetch(`${API_BASE}/all`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch apps');
  }
  
  return res.json();
}

export async function getAppIntegrations(slug: string): Promise<PluginIntegrationsResponse> {
  const res = await fetch(`${API_BASE}/recommend/integrations?service=${encodeURIComponent(slug)}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch app integrations');
  }
  
  return res.json();
}
