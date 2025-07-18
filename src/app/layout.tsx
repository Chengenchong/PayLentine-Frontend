import type { Metadata } from 'next';
import { Outfit, Fredoka } from 'next/font/google';
import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import { MultiSignProvider } from '../pages/MultiSign-Settings/Content';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PayLentine - Revolutionary Currency Exchange',
  description:
    'Eliminate exchange rate fluctuations, high fees, and slow transactions through our innovative Web 2.5 C2C matchmaking platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${fredoka.variable} antialiased`}
      >
        <ThemeProvider>
          <MultiSignProvider>
            {children}
          </MultiSignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
