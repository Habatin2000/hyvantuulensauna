import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { vibeCopy, type Locale } from './content';
import type { VibePageData } from './pages';
import VibeFaq from './VibeFaq';
import VibeCommunity from './VibeCommunity';
import VibeavantoContent from './VibeavantoContent';
import VibejulkinenSaunaContent from './Vibejulkinen-saunaContent';
import VibesaunalauttaristeilytContent from './VibesaunalauttaristeilytContent';
import type { VibeSlug } from './pages';
import VibeHeroBackdrop from './VibeHeroBackdrop';

export default function VibeInnerPage({ data, locale, slug }: { data: VibePageData; locale: Locale; slug?: VibeSlug }) {
  if (slug === 'avanto') return <VibeavantoContent data={data} locale={locale} />;
  if (slug === 'julkinen-sauna') return <VibejulkinenSaunaContent data={data} locale={locale} />;
  if (slug === 'saunalauttaristeilyt') return <VibesaunalauttaristeilytContent data={data} locale={locale} />;

  const c = vibeCopy[locale];
  const isEn = locale === 'en';

  return (
    <main id="main-content">
      <section className="vibe-inner-hero" aria-labelledby="vibe-inner-title">
        <VibeHeroBackdrop />
        <div className="vibe-inner-hero-copy">
          <p className="vibe-eyebrow">{data.eyebrow}</p>
          <h1 id="vibe-inner-title">{data.heroTitle}</h1>
          <p>{data.heroText}</p>
          <div className="vibe-inner-hero-actions">
            <Link className="vibe-button" href={data.ctaHref}>
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a className="vibe-text-link" href="#lisatietoa">
              {isEn ? 'Read more' : 'Lue lisää'}<ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="vibe-inner-hero-image">
          <Image src={data.image} alt={data.imageAlt} fill priority sizes="(max-width: 760px) 100vw, 45vw" />
        </div>
      </section>

      <section id="lisatietoa" className="vibe-detail" aria-labelledby="vibe-detail-title">
        <div className="vibe-detail-intro">
          <p className="vibe-eyebrow">{data.detailEyebrow}</p>
          <h2 id="vibe-detail-title">{data.detailTitle}</h2>
          <p>{data.detailText}</p>
        </div>
        {data.features.length > 0 && (
          <ol className="vibe-detail-list">
            {data.features.map((feature) => (
              <li key={feature.number}>
                <span>{feature.number}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {data.prices && (
        <section className="vibe-pricing" aria-labelledby="vibe-pricing-title">
          <div className="vibe-pricing-heading">
            <p className="vibe-eyebrow">{isEn ? 'Pricing' : 'Hinnoittelu'}</p>
            <h2 id="vibe-pricing-title">{data.priceTitle}</h2>
          </div>
          <div className="vibe-price-table" role="table" aria-label={data.priceTitle}>
            {data.prices.map((row) => (
              <div className="vibe-price-row" role="row" key={row.label}>
                <strong role="cell">{row.label}</strong>
                <span role="cell">{row.price}</span>
                <small role="cell">{row.note}</small>
              </div>
            ))}
          </div>
          {data.priceNote && <p className="vibe-price-note">{data.priceNote}</p>}
        </section>
      )}

      {data.timeline && (
        <section className="vibe-timeline" aria-labelledby="vibe-timeline-title">
          <div className="vibe-timeline-photo">
            <Image src={data.timelineImage ?? data.image} alt={data.timelineImageAlt ?? ''} fill sizes="(max-width: 760px) 100vw, 40vw" />
          </div>
          <div className="vibe-timeline-copy">
            <p className="vibe-eyebrow">{isEn ? 'The simple journey' : 'Yksinkertainen retki'}</p>
            <h2 id="vibe-timeline-title">{data.timelineTitle}</h2>
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
            <Link href={data.ctaHref} className="vibe-journey-link">
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {data.faqs && (
        <section className="vibe-faq-section" aria-labelledby="vibe-faq-title">
          <div className="vibe-faq-heading">
            <p className="vibe-eyebrow">{isEn ? 'Practical answers' : 'Käytännön vastaukset'}</p>
            <h2 id="vibe-faq-title">{data.faqTitle}</h2>
          </div>
          <VibeFaq items={data.faqs} />
        </section>
      )}

      {data.gallery && (
        <section className="vibe-gallery" aria-label={isEn ? 'Photo gallery' : 'Kuvagalleria'}>
          {data.gallery.map((image, index) => (
            <div className={`vibe-gallery-image vibe-gallery-image-${(index % 4) + 1}`} key={image.src}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
            </div>
          ))}
        </section>
      )}

      {data.mapTitle && (
        <section className="vibe-location" aria-labelledby="vibe-location-title">
          <div className="vibe-location-pin"><MapPin size={32} strokeWidth={1.5} aria-hidden="true" /></div>
          <div>
            <h2 id="vibe-location-title">{data.mapTitle}</h2>
            <p>{data.mapText}</p>
            <Link href={data.ctaHref} className="vibe-journey-link">
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {data.community && <VibeCommunity data={data.community} />}

      <section className="vibe-next" aria-labelledby="vibe-next-title">
        <p className="vibe-eyebrow">{c.nextEyebrow}</p>
        <h2 id="vibe-next-title">{isEn ? 'Come as you are.' : 'Tule sellaisena kuin olet.'}</h2>
        <p>{data.heroText}</p>
        <div className="vibe-next-actions">
          <Link className="vibe-next-main" href={data.ctaHref}>
            {data.ctaLabel}<ArrowUpRight aria-hidden="true" />
          </Link>
          <Link className="vibe-next-secondary" href={locale === 'en' ? '/en/' : '/'}>
            {isEn ? 'Back to experiences' : 'Takaisin elämyksiin'}<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
