/**
 * Endpoints for submitting user-driven requests (AI client requests, plugin requests).
 * These are public sokt.io flow webhooks.
 */
const AI_CLIENT_REQUEST_API = 'https://flow.sokt.io/func/scriu9vmqXqr';
const PLUGIN_REQUEST_API = 'https://flow.sokt.io/func/scriPIvL7pBP';

export interface AiClientRequestPayload {
  aiClientName: string;
  description: string;
  originalSearch: string;
  timestamp?: string;
}

/**
 * Submits a "request a new AI client" form.
 * Returns true on success, false on any failure.
 */
export async function submitAiClientRequest(
  payload: AiClientRequestPayload
): Promise<boolean> {
  try {
    const response = await fetch(AI_CLIENT_REQUEST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export interface PluginRequestPayload {
  userNeed: string;
  category?: string;
  userEmail?: string;
  [key: string]: unknown;
}

export interface PluginRequestResponse {
  data?: { success?: boolean };
}

/**
 * Submits a "request a new plugin / app" form.
 * Returns the parsed response, or null on failure.
 */
export async function submitPluginRequest(
  payload: PluginRequestPayload
): Promise<PluginRequestResponse | null> {
  try {
    const response = await fetch(PLUGIN_REQUEST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return (await response.json()) as PluginRequestResponse;
  } catch {
    return null;
  }
}
