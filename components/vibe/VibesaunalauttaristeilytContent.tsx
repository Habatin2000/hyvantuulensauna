import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from './content';
import type { VibePageData } from './pages';
import VibeBookingFrame from './VibeBookingFrame';
import '../../app/vibe/saunalauttaristeilyt.css';

export default function VibesaunalauttaristeilytContent({ data, locale }: { data: VibePageData; locale: Locale }) {
  const isEn = locale === 'en';
  const bookingHref = '#varaus';
  const [aalto, virta, provisions] = data.features;
  const fromPrice = data.prices?.[0]?.price ?? (isEn ? 'from 225 € / 2 h' : 'alk. 225 € / 2 h');

  return (
    <main id="main-content" className="vibe-saunalauttaristeilyt-page">
      <section className="cruise-hero" aria-labelledby="cruise-hero-title">
        <div className="cruise-hero-copy">
          <p className="cruise-eyebrow">{data.eyebrow}</p>
          <h1 id="cruise-hero-title">{data.heroTitle}</h1>
          <p className="cruise-hero-text">{data.heroText}</p>
          <div className="cruise-hero-actions">
            <Link className="cruise-button" href={bookingHref}>
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a className="cruise-text-link" href="#lautat">
              {isEn ? 'Meet the boats' : 'Tutustu lautoihin'}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="cruise-hero-location">
            {isEn ? 'Kalkkihiekantori · Eastern Helsinki archipelago' : 'Kalkkihiekantori · Itä-Helsingin saaristo'}
          </p>
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
            {isEn ? 'Löyly · Sea · Sunlight' : 'Löylyä · Merta · Valoa'}
          </p>
          <div className="cruise-hero-price">
            <span>{isEn ? 'Private cruise' : 'Yksityisristeily'}</span>
            <strong>{fromPrice}</strong>
            <small>{isEn ? 'Aalto or Virta' : 'Aalto tai Virta'}</small>
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
                alt={isEn ? 'Aalto sauna boat with SUP boards on the water' : 'Aalto-saunalautta ja SUP-laudat merellä'}
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
                alt={isEn ? 'Virta sauna boat in the summer archipelago' : 'Virta-saunalautta kesäisessä saaristossa'}
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
                alt={isEn ? 'A floating sauna and SUP board at sea' : 'Kelluva sauna ja SUP-lauta merellä'}
                fill
                sizes="(max-width: 760px) 100vw, 44vw"
              />
            </div>
            <div className="cruise-journey-food">
              <Image
                src="/images/gallery-bbq.webp"
                alt={isEn ? 'Food cooking on the sauna boat grill' : 'Eväitä kypsymässä saunalautan grillissä'}
                fill
                sizes="(max-width: 760px) 46vw, 22vw"
              />
            </div>
            <p>{isEn ? 'Sauna, sea and your own food' : 'Saunaa, merta ja omia eväitä'}</p>
          </div>
          <div className="cruise-journey-copy">
            <p className="cruise-eyebrow">{isEn ? 'From pier to archipelago' : 'Laiturilta saaristoon'}</p>
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
            <p className="cruise-eyebrow">{isEn ? 'Your own floating sauna' : 'Oma kelluva saunasi'}</p>
            <h2 id="cruise-pricing-title">{data.priceTitle}</h2>
            <p className="cruise-from-price">{fromPrice}</p>
            <span>{isEn ? 'Aalto or Virta, just for your group.' : 'Aalto tai Virta vain teidän porukallenne.'}</span>
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
        <p className="cruise-eyebrow">{isEn ? 'When summer calls' : 'Kun kesä kutsuu'}</p>
        <h2 id="cruise-next-title">{isEn ? 'Your place on the water.' : 'Oma paikkasi vedellä.'}</h2>
        <p>{data.heroText}</p>
        <Link className="cruise-next-main" href={bookingHref}>
          <span>{data.ctaLabel}</span><ArrowUpRight aria-hidden="true" />
        </Link>
        <Link className="cruise-next-secondary" href={locale === 'en' ? '/en/' : '/'}>
          {isEn ? 'Back to experiences' : 'Takaisin elämyksiin'}<ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
