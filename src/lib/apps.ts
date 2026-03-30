export interface App {
  rowid: string;
  name: string;
  description: string;
  appslugname: string;
  iconurl: string;
  category: string[];
  domain: string;
  brandcolor: string | null;
  autonumber: number;
}

export interface ApiResponse {
  data: App[];
  total: number;
  limit: number;
  offset: number;
}

export const APPS_PER_PAGE = 45;

export const buildAppsUrl = (category: string, limit: number, offset: number): string => {
  const baseUrl = 'https://plug-service.viasocket.com/api/v1/plugins/all';
  const params = new URLSearchParams();
  
  if (category && category !== 'All') {
    params.append('category', category);
  }
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  
  return `${baseUrl}?${params.toString()}`;
};

export const buildSearchUrl = (query: string): string => {
  return `https://plug-service.viasocket.com/plugins/search?key=${encodeURIComponent(query)}&integrationOnly=true`;
};

export const fetchApps = async (category: string, page: number): Promise<ApiResponse> => {
  const offset = page * APPS_PER_PAGE;
  const url = buildAppsUrl(category, APPS_PER_PAGE, offset);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch apps');
  }
  
  const data = await response.json();
  const apps = data.data || [];
  
  // Since API doesn't return total count, estimate based on response length
  // If we get fewer apps than the limit, we're likely on the last page
  const hasMore = apps.length === APPS_PER_PAGE;
  const estimatedTotal = hasMore ? (page + 2) * APPS_PER_PAGE : (page * APPS_PER_PAGE) + apps.length;
  
  return {
    data: apps,
    total: estimatedTotal,
    limit: APPS_PER_PAGE,
    offset: offset
  };
};

export const searchApps = async (query: string): Promise<ApiResponse> => {
  const url = buildSearchUrl(query);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search apps');
  }
  
  const data = await response.json();
  const apps = data.data || [];
  
  // Since API doesn't return total count, estimate based on response length
  // For search, we'll assume there are no more pages if we get results
  // This is a limitation of the search API
  const hasMore = apps.length === APPS_PER_PAGE;
  const estimatedTotal = hasMore ? APPS_PER_PAGE * 2 : apps.length;
  
  return {
    data: apps,
    total: estimatedTotal,
    limit: APPS_PER_PAGE,
    offset: 0
  };
};
