import { Star, Users } from 'lucide-react';
import type { Locale } from './content';

const copyByLocale = {
  fi: {
    ariaLabel: 'Asiakkaiden kokemukset',
    reviewsLabel: 'Google-arvostelut',
    guestsLabel: 'saunojaa',
  },
  en: {
    ariaLabel: 'Guest experiences',
    reviewsLabel: 'Google reviews',
    guestsLabel: 'sauna guests',
  },
  es: {
    ariaLabel: 'Experiencias de nuestros visitantes',
    reviewsLabel: 'Reseñas de Google',
    guestsLabel: 'visitantes de la sauna',
  },
  fr: {
    ariaLabel: 'Expériences de nos visiteurs',
    reviewsLabel: 'Avis Google',
    guestsLabel: 'visiteurs du sauna',
  },
  de: {
    ariaLabel: 'Erfahrungen unserer Gäste',
    reviewsLabel: 'Google-Bewertungen',
    guestsLabel: 'Saunagäste',
  },
} as const;

export default function VibeTrustBanner({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];

  return (
    <aside className="vibe-trust-banner" aria-label={copy.ariaLabel}>
      <ul className="vibe-trust-banner-list">
        <li className="vibe-trust-banner-item">
          <Star size={20} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
          <div className="vibe-trust-banner-fact">
            <strong className="vibe-trust-banner-value">4,9 / 5</strong>
            <span className="vibe-trust-banner-label">{copy.reviewsLabel}</span>
          </div>
        </li>
        <li className="vibe-trust-banner-item">
          <Users size={20} strokeWidth={1.5} aria-hidden="true" />
          <div className="vibe-trust-banner-fact">
            <strong className="vibe-trust-banner-value">5 000+</strong>
            <span className="vibe-trust-banner-label">{copy.guestsLabel}</span>
          </div>
        </li>
      </ul>
    </aside>
  );
}
