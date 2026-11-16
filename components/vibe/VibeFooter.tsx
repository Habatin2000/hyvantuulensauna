import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { vibeCopy, type Locale } from './content';
import { getVibeRoute } from './routes';

export default function VibeFooter({ locale }: { locale: Locale }) {
  const c = vibeCopy[locale];
  return (
    <footer className="vibe-footer">
      <div className="vibe-footer-brand">
        <Link href={getVibeRoute('home', locale)}>
          <Image src="/images/logo.png" alt="" width={46} height={46} />
          <span>Hyvän Tuulen Sauna</span>
        </Link>
        <p>{c.footerNote}</p>
      </div>
      <div className="vibe-footer-bottom">
        <p>{c.footerContact}</p>
        <a href="#main-content" aria-label={locale === 'en' ? 'Back to top' : 'Takaisin ylös'}>
          <ArrowUp size={18} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
