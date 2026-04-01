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
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} antialiased`}
      >
        <AppsCountProvider>{children}</AppsCountProvider>
      </body>
    </html>
  );
}
