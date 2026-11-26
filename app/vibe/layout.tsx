import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { vibeCopy, type Locale } from '@/components/vibe/content';
import '../globals.css';
import './vibe.css';

const quicksand = localFont({
  src: '../../public/fonts/quicksand-latin.woff2',
  variable: '--vibe-font-body',
  weight: '400 700',
  display: 'swap',
});

const corben = localFont({
  src: [
    {
      path: '../../public/fonts/corben-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/corben-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--vibe-font-display',
  display: 'swap',
});

const pacifico = localFont({
  src: '../../public/fonts/pacifico-regular.woff2',
  variable: '--vibe-font-logo',
  weight: '400',
  display: 'swap',
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
