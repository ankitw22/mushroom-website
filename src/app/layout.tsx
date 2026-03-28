import type { Metadata } from 'next';
import { Poppins, JetBrains_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';

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


export const metadata: Metadata = {
  title: "Mashroom | The AI Power-up Layer for Your Apps",
  description: "Connect any AI client (Claude, ChatGPT, Cursor) to your daily tools using MCP. Execute actions with granular permissions and full security.",
  icons: {
    icon: "/mushroom-logo.svg",
  },
};
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
        {children}
      </body>
    </html>
  );
}
