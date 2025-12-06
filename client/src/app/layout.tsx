import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Aetheria: The Legendary Card Game',
  description: 'Enter a world of legends, magic, and eternal battles. Build your legacy in the realm of Aetheria.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-inter antialiased bg-mystic-dark text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

