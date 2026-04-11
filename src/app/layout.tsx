import type { Metadata } from 'next';
import { Poppins, JetBrains_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { AppsCountProvider } from '@/context/AppsCountContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start',
});


export async function generateMetadata(): Promise<Metadata> {
  let count = '2,000+';
  try {
    const res = await fetch('https://plug-service.viasocket.com/get-apps-count', { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.count) {
        count = `${parseInt(data.count, 10).toLocaleString()}+`;
      }
    }
  } catch {}

  return {
    title: `Mushrooms — Connect Your AI to ${count} Apps via MCP`,
    description: `Connect your AI tools with ${count} apps. Let AI take real world actions, turn your conversations into real outcomes.`,
    icons: {
      icon: '/mushroom-logo.svg',
    },
    verification: {
      google: 'plvKVsbSFbvkiIsLeK4UVcK_l2T_cI9SEe7QxiOCnrg',
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://mushrooms.viasocket.com/#website",
        "name": "Mushrooms",
        "alternateName": "Mushrooms by viaSocket",
        "url": "https://mushrooms.viasocket.com",
        "publisher": {
          "@id": "https://mushrooms.viasocket.com/#organization"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://mushrooms.viasocket.com/#software",
        "name": "Mushrooms",
        "alternateName": ["Mushrooms MCP", "Mushrooms by viaSocket"],
        "applicationCategory": "DeveloperApplication",
        "applicationSubCategory": "AI Integration, Automation, MCP Tools",
        "operatingSystem": "Web",
        "url": "https://mushrooms.viasocket.com",
        "description": "Mushrooms connects your AI to 2,000+ apps via MCP. Create a personal MCP server, choose which apps and actions your AI can use, and let it execute — with full logs and granular permissions. Works with Claude, Cursor, ChatGPT, Windsurf, Gemini, GitHub Copilot, and any MCP-compatible AI client. Free for lifetime.",
        "keywords": "MCP, Model Context Protocol, MCP server, AI app integrations, connect Claude to apps, Claude MCP, Cursor MCP, ChatGPT MCP, AI agent tools, MCP tools, agentic AI, AI integrations",
        "featureList": [
          "2,000+ app connections — Slack, Gmail, GitHub, Notion, Linear, HubSpot, Stripe, Shopify and more",
          "Personal MCP server URL — works with Claude, Cursor, ChatGPT, Windsurf, Gemini, Copilot and all MCP-compatible AI clients",
          "Optimized execution — fewer tokens, faster responses, no bloated context windows",
          "Granular per-action OAuth permissions — control exactly what your AI can and cannot do",
          "Secure — your data stays within your boundary, nothing stored or shared",
          "Full action log history — complete visibility into every action taken and when",
          "Free for lifetime under fair usage policy — no credit card required",
          "Enterprise plan available"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": "Free for lifetime under fair usage policy. No rate limits. No credit card required. Enterprise plan available.",
          "url": "https://mushrooms.viasocket.com/#dark-band"
        },
        "provider": {
          "@id": "https://mushrooms.viasocket.com/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://mushrooms.viasocket.com"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://mushrooms.viasocket.com/#organization",
        "name": "Mushrooms",
        "alternateName": "Mushrooms by viaSocket",
        "url": "https://mushrooms.viasocket.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://mushrooms.viasocket.com/assets/brand/logo.svg"
        },
        "description": "Mushrooms is an MCP-native layer that connects AI clients to 2,000+ apps. Built by viaSocket.",
        "parentOrganization": {
          "@type": "Organization",
          "name": "viaSocket",
          "url": "https://viasocket.com",
          "legalName": "Walkover Web Solutions Pvt Ltd"
        },
        "knowsAbout": [
          "Model Context Protocol",
          "MCP servers",
          "AI app integrations",
          "Agentic AI",
          "Claude integrations"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "url": "https://mushrooms.viasocket.com/support"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8YV0EJ00KZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8YV0EJ00KZ');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to connect your AI to apps using Mushrooms",
            "description": "Mushrooms connects your AI client to 2,000+ apps via MCP. Three steps to give your AI the ability to take real actions.",
            "totalTime": "PT5M",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "An MCP-compatible AI client (Claude, Cursor, ChatGPT, Windsurf, Gemini, or similar)"
              },
              {
                "@type": "HowToSupply",
                "name": "A free Mushrooms account — no credit card required"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Connect your AI",
                "text": "Create a personal MCP server in Mushrooms to get your unique server URL. Paste it into your AI client — Claude, ChatGPT, Cursor, or any MCP-compatible model — to connect it.",
                "url": "https://mushrooms.viasocket.com/#how-it-works"
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Select apps and actions",
                "text": "Choose from 2,000+ apps and define exactly what your AI can do — granular, per-action permissions. Add connections for Gmail, Slack, GitHub, Notion, and more.",
                "url": "https://mushrooms.viasocket.com/#how-it-works"
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Execute with control",
                "text": "Every action is scoped, logged, and governed by your permissions. Your AI executes with intent — nothing happens outside the rules you set. Full action history gives you complete visibility.",
                "url": "https://mushrooms.viasocket.com/#how-it-works"
              }
            ]
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is MCP?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "MCP (Model Context Protocol) is an open standard that lets AI models connect to external apps and take real actions in them. In Mushrooms, you get a personal MCP server URL — paste it into your AI client and your AI instantly has access to every app you've connected."
                }
              },
              {
                "@type": "Question",
                "name": "What is Mushrooms?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Mushrooms is an app connection layer for AI clients. Connect Claude, ChatGPT, Cursor, or any MCP-compatible AI to the apps you use — Gmail, Slack, GitHub, Notion, and 2,000+ more — and your AI gains the ability to take real actions in those apps. Read emails, create tasks, post messages, pull data. Not just talk about it — do it."
                }
              },
              {
                "@type": "Question",
                "name": "Which AI clients does Mushrooms work with?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Mushrooms works with any AI client that supports MCP — including Claude, Cursor, ChatGPT, Windsurf, Gemini, GitHub Copilot, Cline, Zed, Cody, and other MCP-compatible clients. More are added continuously."
                }
              },
              {
                "@type": "Question",
                "name": "Is Mushrooms free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — Mushrooms is free for lifetime under a fair usage policy, with no rate limits. Connect your AI client, add apps, and start taking real actions at no cost. No credit card required."
                }
              },
              {
                "@type": "Question",
                "name": "Is Mushrooms secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Every app connection uses OAuth — you authorise exactly what your AI can and cannot do, action by action. Credentials are never stored in plain text, connections can be revoked at any time, and your data stays within your boundary."
                }
              },
              {
                "@type": "Question",
                "name": "Which apps can I connect to my AI using Mushrooms?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "2,000+ apps including Slack, Gmail, GitHub, Notion, Linear, HubSpot, Google Calendar, Airtable, Figma, Stripe, Shopify, Microsoft Teams, Salesforce, Jira, Asana, Google Sheets, Dropbox, Zendesk, and more. If it has an API, it's very likely already supported. You can also request any missing app and it will be built within 48 hours."
                }
              }
            ]
          }) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} antialiased`}
      >
        <AppsCountProvider>{children}</AppsCountProvider>
      </body>
    </html>
  );
}
