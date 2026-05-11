const APPS_COUNT_API = 'https://plug-service.viasocket.com/get-apps-count';

export interface AppsCountResponse {
  count?: string | number;
}

/**
 * Fetches the total number of supported apps.
 * Returns a formatted string with thousands separators (e.g. "2,143"),
 * or `null` if the request fails.
 */
export async function fetchAppsCount(
  options: { revalidate?: number } = {}
): Promise<string | null> {
  try {
    const res = await fetch(APPS_COUNT_API, {
      next: { revalidate: options.revalidate ?? 3600 },
    });
    if (!res.ok) return null;
    const data: AppsCountResponse = await res.json();
    if (!data?.count) return null;
    return parseInt(String(data.count), 10).toLocaleString();
  } catch {
    return null;
  }
}
