const TABLE_API = 'https://table-api.viasocket.com/69cfa010be357bedcfc5318e/tblnxdfjj';
const AUTH_KEY = 'keyv2Fo2j3YsniO';

export interface AiClientApiData {
  name: string;
  config_type: string;
  url_steps: Record<string, string[]>;
  config_steps: Record<string, string[]>;
}

export async function fetchAiClientData(clientId: string): Promise<AiClientApiData | null> {
  try {
    const url = `${TABLE_API}?filter=name = '${clientId}'`;
    const res = await fetch(url, {
      headers: { 'auth-key': AUTH_KEY },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const row = json?.data?.rows?.[0];
    if (!row) return null;

    return {
      name: row.name ?? '',
      config_type: row.config_type ?? '',
      url_steps: row.url_steps ?? {},
      config_steps: row.config_steps ?? {},
    };
  } catch {
    return null;
  }
}
