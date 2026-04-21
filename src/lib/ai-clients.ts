export interface AiClient {
  id: string;
  title: string;
  link: string;
  icon: string;
  configType: 'npx' | 'url' | 'serverUrl';
  popular?: boolean;
  className?: string;
}

const TITLE_TO_DOMAIN: Record<string, string> = {
  'Claude': 'claude.ai',
  'ChatGPT': 'ChatGPT.com',
  'Cursor': 'cursor.com',
  'Amazon Quick Suite MCP Server': 'aws.amazon.com',
  'Anthropic API': 'anthropic.com',
  'OpenAI API': 'openai.com',
  'Gemini CLI': 'gemini.google.com',
  'Julius AI': 'julius.ai',
  'Manus': 'manus.im',
  'Mistral AI': 'mistral.ai',
  'Python': 'python.org',
  'TypeScript': 'typescriptlang.org',
  'Vapi': 'vapi.ai',
  'Visual Studio Code': 'vscode.dev',
  'Warp': 'warp.dev',
  'Windsurf': 'windsurf.com',
  'Zed': 'zed.dev',
  'Ravenala': 'ravenala.ai',
  'Toolhouse': 'toolhouse.ai',
  'Antigravity': 'antigravity.google',
};

export function getIconDomain(client: AiClient): string | null {
  if (TITLE_TO_DOMAIN[client.title]) return TITLE_TO_DOMAIN[client.title];
  try {
    const hostname = new URL(client.link).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export async function fetchAiClients(): Promise<AiClient[]> {
  try {
    const res = await fetch('https://flow.sokt.io/func/scriTg56Y2oZ', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success' || !data.result) return [];
    return data.result.filter((client: AiClient) => client.id !== 'other');
  } catch {
    return [];
  }
}
