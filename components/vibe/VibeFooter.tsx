import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { vibeCopy, type Locale } from './content';
import { getVibeRoute } from './routes';

const backToTop: Record<Locale, string> = {
  fi: 'Takaisin ylös',
  en: 'Back to top',
  es: 'Volver arriba',
  fr: 'Retour en haut',
  de: 'Nach oben',
};

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
        <p><a href="mailto:info@hyvantuulensauna.fi">info@hyvantuulensauna.fi</a></p>
      </div>
      <div className="vibe-footer-bottom">
        <p>{c.footerContact}</p>
        <a href="#main-content" aria-label={backToTop[locale]}>
          <ArrowUp size={18} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
