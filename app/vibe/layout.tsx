import type { ReactNode } from 'react';
import { Corben, Pacifico, Quicksand } from 'next/font/google';
import { vibeCopy, type Locale } from '@/components/vibe/content';
import '../globals.css';
import './vibe.css';

const quicksand = Quicksand({
  variable: '--vibe-font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const corben = Corben({
  variable: '--vibe-font-display',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const pacifico = Pacifico({
  variable: '--vibe-font-logo',
  subsets: ['latin'],
  weight: '400',
});

export const metadata = {
  title: vibeCopy.fi.metaTitle,
  description: vibeCopy.fi.metaDescription,
  robots: { index: false, follow: false },
};

export default function VibeLayout({ children }: { children: ReactNode }) {
  const locale: Locale = 'fi';
  return (
    <html lang={locale} className={`${quicksand.variable} ${corben.variable} ${pacifico.variable}`}>
      <body className="vibe-shell">{children}</body>
    </html>
  );
}
