/**
 * Shared brand icon configuration
 * Used by HeroCanvas and UseCases components
 * Icons are fetched from thingsofbrand.com via /api/icon/[domain] proxy
 */

// AI Clients with their brand domains for icon fetching
export const AI_CLIENTS = [
  { name: 'Claude', sym: '✳', col: '#D4845A', domain: 'anthropic.com' },
  { name: 'ChatGPT', sym: '◎', col: '#74AA9C', domain: 'openai.com' },
  { name: 'Cursor', sym: '⬡', col: '#aaa', domain: 'cursor.com' },
  { name: 'Windsurf', sym: '◈', col: '#4D9FE8', domain: 'codeium.com' },
  { name: 'Gemini', sym: '✦', col: '#8B9CF6', domain: 'gemini.google.com' },
  { name: 'Copilot', sym: '⊕', col: '#0078D4', domain: 'github.com' },
  { name: 'Continue', sym: '▷', col: '#FF6B35', domain: 'continue.dev' },
  { name: 'Cline', sym: '◆', col: '#E24444', domain: 'cline.bot' },
  { name: 'Zed', sym: '⬢', col: '#7744DD', domain: 'zed.dev' },
  { name: 'Cody', sym: '✿', col: '#FF5959', domain: 'sourcegraph.com' },
  { name: 'Amp', sym: '⚡', col: '#FFCC00', domain: 'amp.dev' },
] as const;

// Integration apps with brand domains, colors, and fallback letters
export const INTEGRATION_APPS = [
  { name: 'Slack',      bg: '#4A154B', fg: '#fff', letter: 'S',  domain: 'slack.com' },
  { name: 'Notion',     bg: '#000000', fg: '#fff', letter: 'N',  domain: 'notion.so' },
  { name: 'Gmail',      bg: '#EA4335', fg: '#fff', letter: 'G',  domain: 'gmail.com' },
  { name: 'GitHub',     bg: '#181717', fg: '#fff', letter: 'GH', domain: 'github.com' },
  { name: 'Linear',     bg: '#5E6AD2', fg: '#fff', letter: 'L',  domain: 'linear.app' },
  { name: 'ClickUp',    bg: '#7B68EE', fg: '#fff', letter: 'CU', domain: 'clickup.com' },
  { name: 'Sheets',     bg: '#34A853', fg: '#fff', letter: 'S',  domain: 'sheets.google.com' },
  { name: 'Trello',     bg: '#0052CC', fg: '#fff', letter: 'T',  domain: 'trello.com' },
  { name: 'Airtable',   bg: '#18BFFF', fg: '#000', letter: 'AT', domain: 'airtable.com' },
  { name: 'Figma',      bg: '#F24E1E', fg: '#fff', letter: 'F',  domain: 'figma.com' },
  { name: 'Jira',       bg: '#0052CC', fg: '#fff', letter: 'J',  domain: 'jira.atlassian.com' },
  { name: 'Asana',      bg: '#F06A6A', fg: '#fff', letter: 'A',  domain: 'asana.com' },
  { name: 'HubSpot',    bg: '#FF7A59', fg: '#fff', letter: 'H',  domain: 'hubspot.com' },
  { name: 'Discord',    bg: '#5865F2', fg: '#fff', letter: 'D',  domain: 'discord.com' },
  { name: 'Dropbox',    bg: '#0061FF', fg: '#fff', letter: 'DB', domain: 'dropbox.com' },
  { name: 'Stripe',     bg: '#635BFF', fg: '#fff', letter: 'ST', domain: 'stripe.com' },
  { name: 'Salesforce', bg: '#00A1E0', fg: '#fff', letter: 'SF', domain: 'salesforce.com' },
  { name: 'Twilio',     bg: '#F22F46', fg: '#fff', letter: 'TW', domain: 'twilio.com' },
  { name: 'Zendesk',    bg: '#03363D', fg: '#fff', letter: 'Z',  domain: 'zendesk.com' },
] as const;

// App domain mapping for UseCases component (simplified lookup)
export const APP_DOMAIN_MAP: Record<string, string> = Object.fromEntries(
  INTEGRATION_APPS.map(app => [app.name.toLowerCase(), app.domain])
);

// App actions for HeroCanvas animations
export const APP_ACTIONS: Record<string, string> = {
  Slack: 'Sent message',
  Notion: 'Updated wiki',
  Gmail: 'Sent email',
  GitHub: 'Created issue',
  Linear: 'Filed ticket',
  ClickUp: 'Created task',
  Sheets: 'Updated data',
  Trello: 'Moved card',
  Airtable: 'Added record',
  Figma: 'Left comment',
  Jira: 'Logged issue',
  Asana: 'Assigned task',
  HubSpot: 'Logged contact',
};

// Type exports for components
export type AIClient = typeof AI_CLIENTS[number];
export type IntegrationApp = typeof INTEGRATION_APPS[number];
