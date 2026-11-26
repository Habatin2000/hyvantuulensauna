import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from './content';
import type { VibePageData } from './pages';
import VibeBookingFrame from './VibeBookingFrame';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import '../../app/vibe/saunalauttaristeilyt.css';

const cruiseCopy = {
  fi: {
    fromPrice: 'alk. 225 € / 2 h',
    meetBoats: 'Tutustu lautoihin',
    location: 'Kalkkihiekantori · Itä-Helsingin saaristo',
    heroAside: 'Löylyä · Merta · Valoa',
    privateCruise: 'Yksityisristeily',
    boatChoice: 'Aalto tai Virta',
    aaltoAlt: 'Aalto-saunalautta ja SUP-laudat merellä',
    virtaAlt: 'Virta-saunalautta kesäisessä saaristossa',
    floatingSaunaAlt: 'Kelluva sauna ja SUP-lauta merellä',
    grillingAlt: 'Lihaa ja keltaisia paprikoita kypsymässä saunalautan grillissä',
    journeyCaption: 'Saunaa, merta ja omia eväitä',
    journeyEyebrow: 'Laiturilta saaristoon',
    pricingEyebrow: 'Oma kelluva saunasi',
    pricingText: 'Aalto tai Virta vain teidän porukallenne.',
    nextEyebrow: 'Kun kesä kutsuu',
    nextTitle: 'Oma paikkasi vedellä.',
    backToExperiences: 'Takaisin elämyksiin',
  },
  en: {
    fromPrice: 'from 225 € / 2 h',
    meetBoats: 'Meet the boats',
    location: 'Kalkkihiekantori · Eastern Helsinki archipelago',
    heroAside: 'Löyly · Sea · Sunlight',
    privateCruise: 'Private cruise',
    boatChoice: 'Aalto or Virta',
    aaltoAlt: 'Aalto sauna boat with SUP boards on the water',
    virtaAlt: 'Virta sauna boat in the summer archipelago',
    floatingSaunaAlt: 'A floating sauna and SUP board at sea',
    grillingAlt: 'Meat and yellow peppers cooking on the sauna boat grill',
    journeyCaption: 'Sauna, sea and your own food',
    journeyEyebrow: 'From pier to archipelago',
    pricingEyebrow: 'Your own floating sauna',
    pricingText: 'Aalto or Virta, just for your group.',
    nextEyebrow: 'When summer calls',
    nextTitle: 'Your place on the water.',
    backToExperiences: 'Back to experiences',
  },
  es: {
    fromPrice: 'desde 225 € / 2 h',
    meetBoats: 'Descubre las embarcaciones',
    location: 'Kalkkihiekantori · Archipiélago del este de Helsinki',
    heroAside: 'Löyly · Mar · Luz del sol',
    privateCruise: 'Crucero privado',
    boatChoice: 'Aalto o Virta',
    aaltoAlt: 'Barco de sauna Aalto con tablas de paddle surf en el agua',
    virtaAlt: 'Barco de sauna Virta en el archipiélago en verano',
    floatingSaunaAlt: 'Una sauna flotante y una tabla de paddle surf en el mar',
    grillingAlt: 'Carne y pimientos amarillos cocinándose en la parrilla del barco sauna',
    journeyCaption: 'Sauna, mar y tu propia comida',
    journeyEyebrow: 'Del embarcadero al archipiélago',
    pricingEyebrow: 'Tu propia sauna flotante',
    pricingText: 'Aalto o Virta, solo para tu grupo.',
    nextEyebrow: 'Cuando el verano llama',
    nextTitle: 'Tu lugar en el agua.',
    backToExperiences: 'Volver a las experiencias',
  },
  fr: {
    fromPrice: 'à partir de 225 € / 2 h',
    meetBoats: 'Découvrez les bateaux',
    location: 'Kalkkihiekantori · Archipel de l’est d’Helsinki',
    heroAside: 'Löyly · Mer · Lumière du soleil',
    privateCruise: 'Croisière privée',
    boatChoice: 'Aalto ou Virta',
    aaltoAlt: 'Bateau-sauna Aalto avec des planches de paddle sur l’eau',
    virtaAlt: 'Bateau-sauna Virta dans l’archipel en été',
    floatingSaunaAlt: 'Un sauna flottant et une planche de paddle en mer',
    grillingAlt: 'Viande et poivrons jaunes cuisant sur le grill du bateau-sauna',
    journeyCaption: 'Sauna, mer et votre propre pique-nique',
    journeyEyebrow: 'Du ponton à l’archipel',
    pricingEyebrow: 'Votre propre sauna flottant',
    pricingText: 'Aalto ou Virta, rien que pour votre groupe.',
    nextEyebrow: 'Quand l’été appelle',
    nextTitle: 'Votre place sur l’eau.',
    backToExperiences: 'Retour aux expériences',
  },
  de: {
    fromPrice: 'ab 225 € / 2 h',
    meetBoats: 'Entdecke die Boote',
    location: 'Kalkkihiekantori · Schärengarten im Osten Helsinkis',
    heroAside: 'Löyly · Meer · Sonnenlicht',
    privateCruise: 'Private Bootstour',
    boatChoice: 'Aalto oder Virta',
    aaltoAlt: 'Saunaboot Aalto mit SUP-Boards auf dem Wasser',
    virtaAlt: 'Saunaboot Virta im sommerlichen Schärengarten',
    floatingSaunaAlt: 'Eine schwimmende Sauna und ein SUP-Board auf dem Meer',
    grillingAlt: 'Fleisch und gelbe Paprikaringe auf dem Grill des Saunaboots',
    journeyCaption: 'Sauna, Meer und eigenes Essen',
    journeyEyebrow: 'Vom Steg in den Schärengarten',
    pricingEyebrow: 'Deine eigene schwimmende Sauna',
    pricingText: 'Aalto oder Virta ganz für deine Gruppe.',
    nextEyebrow: 'Wenn der Sommer ruft',
    nextTitle: 'Dein Platz auf dem Wasser.',
    backToExperiences: 'Zurück zu den Erlebnissen',
  },
} as const;

export default function VibesaunalauttaristeilytContent({ data, locale }: { data: VibePageData; locale: Locale }) {
  const copy = cruiseCopy[locale];
  const bookingHref = '#varaus';
  const [aalto, virta, provisions] = data.features;
  const fromPrice = data.prices?.[0]?.price ?? copy.fromPrice;

  return (
    <main id="main-content" className="vibe-saunalauttaristeilyt-page">
      <section className="cruise-hero" aria-labelledby="cruise-hero-title">
        <VibeHeroBackdrop tone="dark" />
        <div className="cruise-hero-copy">
          <p className="cruise-eyebrow">{data.eyebrow}</p>
          <h1 id="cruise-hero-title">{data.heroTitle}</h1>
          <p className="cruise-hero-text">{data.heroText}</p>
          <div className="cruise-hero-actions">
            <Link className="cruise-button" href={bookingHref}>
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a className="cruise-text-link" href="#lautat">
              {copy.meetBoats}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="cruise-hero-location">{copy.location}</p>
        </div>
        <div className="cruise-hero-visual">
          <div className="cruise-hero-image">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 760px) 100vw, 48vw"
            />
          </div>
          <p className="cruise-hero-aside" aria-hidden="true">
            {copy.heroAside}
          </p>
          <div className="cruise-hero-price">
            <span>{copy.privateCruise}</span>
            <strong>{fromPrice}</strong>
            <small>{copy.boatChoice}</small>
          </div>
        </div>
      </section>

      <section id="lautat" className="cruise-boats" aria-labelledby="cruise-boats-title">
        <div className="cruise-section-intro">
          <p className="cruise-eyebrow">{data.detailEyebrow}</p>
          <h2 id="cruise-boats-title">{data.detailTitle}</h2>
          <p>{data.detailText}</p>
        </div>

        {aalto && (
          <article className="cruise-boat cruise-boat-aalto">
            <div className="cruise-boat-photo">
              <Image
                src="/images/aalto-raft.webp"
                alt={copy.aaltoAlt}
                fill
                sizes="(max-width: 760px) 100vw, 58vw"
              />
            </div>
            <div className="cruise-boat-copy">
              <span className="cruise-number">{aalto.number}</span>
              <p className="cruise-boat-name">Aalto</p>
              <h3>{aalto.title}</h3>
              <p>{aalto.text}</p>
              {data.prices?.[0] && <span className="cruise-capacity">{data.prices[0].note}</span>}
            </div>
          </article>
        )}

        {virta && (
          <article className="cruise-boat cruise-boat-virta">
            <div className="cruise-boat-copy">
              <span className="cruise-number">{virta.number}</span>
              <p className="cruise-boat-name">Virta</p>
              <h3>{virta.title}</h3>
              <p>{virta.text}</p>
              {data.prices?.[1] && <span className="cruise-capacity">{data.prices[1].note}</span>}
            </div>
            <div className="cruise-boat-photo">
              <Image
                src="/images/virta-raft.webp"
                alt={copy.virtaAlt}
                fill
                sizes="(max-width: 760px) 100vw, 52vw"
              />
            </div>
          </article>
        )}

        {provisions && (
          <div className="cruise-provisions">
            <span className="cruise-number">{provisions.number}</span>
            <h3>{provisions.title}</h3>
            <p>{provisions.text}</p>
          </div>
        )}
      </section>

      {data.timeline && (
        <section className="cruise-journey" aria-labelledby="cruise-journey-title">
          <div className="cruise-journey-gallery">
            <div className="cruise-journey-sea">
              <Image
                src="/images/hero-raft-sup.webp"
                alt={copy.floatingSaunaAlt}
                fill
                sizes="(max-width: 760px) 100vw, 44vw"
              />
            </div>
            <div className="cruise-journey-food">
              <Image
                src="/images/gallery-bbq.webp"
                alt={copy.grillingAlt}
                fill
                sizes="(max-width: 760px) 46vw, 22vw"
              />
            </div>
            <p>{copy.journeyCaption}</p>
          </div>
          <div className="cruise-journey-copy">
            <p className="cruise-eyebrow">{copy.journeyEyebrow}</p>
            <h2 id="cruise-journey-title">{data.timelineTitle}</h2>
            <ol>
              {data.timeline.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link className="cruise-journey-link" href={bookingHref}>
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {data.prices && (
        <section className="cruise-pricing" aria-labelledby="cruise-pricing-title">
          <div className="cruise-pricing-heading">
            <p className="cruise-eyebrow">{copy.pricingEyebrow}</p>
            <h2 id="cruise-pricing-title">{data.priceTitle}</h2>
            <p className="cruise-from-price">{fromPrice}</p>
            <span>{copy.pricingText}</span>
          </div>
          <div className="cruise-pricing-detail">
            <ol className="cruise-price-list">
              {data.prices.map((row) => (
                <li key={row.label}>
                  <div>
                    <h3>{row.label}</h3>
                    <p>{row.note}</p>
                  </div>
                  <strong>{row.price}</strong>
                </li>
              ))}
            </ol>
            {data.priceNote && <p className="cruise-price-note">{data.priceNote}</p>}
            <Link className="cruise-pricing-link" href={bookingHref}>
              {data.ctaLabel}<ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <VibeBookingFrame kind="summer" locale={locale} />

      <section className="cruise-next" aria-labelledby="cruise-next-title">
        <p className="cruise-eyebrow">{copy.nextEyebrow}</p>
        <h2 id="cruise-next-title">{copy.nextTitle}</h2>
        <p>{data.heroText}</p>
        <Link className="cruise-next-main" href={bookingHref}>
          <span>{data.ctaLabel}</span><ArrowUpRight aria-hidden="true" />
        </Link>
        <Link className="cruise-next-secondary" href={locale === 'fi' ? '/' : `/${locale}/`}>
          {copy.backToExperiences}<ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
