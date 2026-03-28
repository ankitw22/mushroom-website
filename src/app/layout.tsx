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
  title: "Mushroom | AI powered MCP Server Manager",
  description: "Mushroom - Connect your AI to 2000+ apps using MCP (Model Context Protocol). Give your AI agent the power to take real-world actions with secure MCP servers.",
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
