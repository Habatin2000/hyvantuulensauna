import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from './content';
import type { VibePageData } from './pages';
import VibeBookingFrame from './VibeBookingFrame';
import VibeBoatGallery from './VibeBoatGallery';
import VibeClosingSummary from './VibeClosingSummary';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import '../../app/vibe/avanto.css';

export default function VibeavantoContent({ data, locale }: { data: VibePageData; locale: Locale }) {
  const isEn = locale === 'en';
  const bookingHref = '#varaus';
  const [aalto, virta, included] = data.features;

  return (
    <main id="main-content" className="vibe-avanto-page">
      <section className="vibe-avanto-hero" aria-labelledby="vibe-avanto-title">
        <VibeHeroBackdrop tone="dark" />
        <div className="vibe-avanto-hero-copy">
          <p className="vibe-avanto-eyebrow">{data.eyebrow}</p>
          <h1 id="vibe-avanto-title">{data.heroTitle}</h1>
          <p className="vibe-avanto-hero-text">{data.heroText}</p>
          <div className="vibe-avanto-hero-actions">
            <Link className="vibe-avanto-button" href={bookingHref}>
              {data.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a className="vibe-avanto-text-link" href="#lautat">
              {isEn ? 'Meet the saunas' : 'Tutustu lautoihin'}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="vibe-avanto-hero-footnote">
            <span aria-hidden="true">02 h</span>
            {isEn ? 'Entirely yours' : 'Kokonaan teidän'}
          </p>
        </div>
        <div className="vibe-avanto-hero-visual">
          <div className="vibe-avanto-hero-image">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              priority
              sizes="(max-width: 760px) calc(100vw - 44px), 46vw"
            />
          </div>
          <p className="vibe-avanto-hero-caption">Aalto <span>/</span> Virta</p>
          <div className="vibe-avanto-hero-stamp" aria-hidden="true">
            <span>01</span>
            <span>{isEn ? 'Private sauna' : 'Yksityinen sauna'}</span>
          </div>
        </div>
      </section>

      <section id="lautat" className="vibe-avanto-intro" aria-labelledby="vibe-avanto-intro-title">
        <p className="vibe-avanto-eyebrow">{data.detailEyebrow}</p>
        <div>
          <h2 id="vibe-avanto-intro-title">{data.detailTitle}</h2>
          <p>{data.detailText}</p>
        </div>
      </section>

      {aalto && (
        <article className="vibe-avanto-aalto" aria-labelledby="vibe-avanto-aalto-title">
          <VibeBoatGallery
            className="vibe-avanto-aalto-image"
            label="Aalto"
            badge="A / 10"
            locale={locale}
            sizes="(max-width: 760px) calc(100vw - 44px), 55vw"
            images={[
              { src: '/images/vibe-hero-upright.webp', alt: isEn ? 'Aalto sauna on snowy ice' : 'Aalto-saunalautta lumisella jäällä' },
              { src: '/images/aalto-08.webp', alt: isEn ? 'Inside the Aalto wood-fired sauna' : 'Aallon puulämmitteisen saunan sisätila' },
              { src: '/images/gallery-aalto-7547.webp', alt: isEn ? 'Aalto terrace by the sea' : 'Aallon terassi meren äärellä' },
              { src: '/images/aalto-07.webp', alt: isEn ? 'Food cooking on the Aalto grill' : 'Eväitä Aallon grillissä' },
            ]}
          />
          <div className="vibe-avanto-aalto-copy">
            <span className="vibe-avanto-feature-number">{aalto.number}</span>
            <p className="vibe-avanto-feature-label">Aalto</p>
            <h3 id="vibe-avanto-aalto-title">{aalto.title}</h3>
            <p>{aalto.text}</p>
            <Link href={bookingHref} className="vibe-avanto-inline-link">
              {isEn ? 'Choose Aalto' : 'Valitse Aalto'}<ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </article>
      )}

      {virta && (
        <article className="vibe-avanto-virta" aria-labelledby="vibe-avanto-virta-title">
          <div className="vibe-avanto-virta-inner">
            <div className="vibe-avanto-virta-copy">
              <span className="vibe-avanto-feature-number">{virta.number}</span>
              <p className="vibe-avanto-feature-label">Virta</p>
              <h3 id="vibe-avanto-virta-title">{virta.title}</h3>
              <p>{virta.text}</p>
              <Link href={bookingHref} className="vibe-avanto-inline-link">
                {isEn ? 'Choose Virta' : 'Valitse Virta'}<ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <VibeBoatGallery
              className="vibe-avanto-virta-image"
              label="Virta"
              badge="V / 06"
              locale={locale}
              sizes="(max-width: 760px) calc(100vw - 44px), 48vw"
              images={[
                { src: '/images/virta-stern-calm.webp', alt: isEn ? 'Virta floating sauna in calm water' : 'Virta-saunalautta tyynessä vedessä' },
                { src: '/images/virta-02.webp', alt: isEn ? 'Inside the Virta wood-fired sauna' : 'Virran puulämmitteisen saunan sisätila' },
                { src: '/images/virta-04.webp', alt: isEn ? 'Wooden benches inside Virta' : 'Virran puiset lauteet' },
                { src: '/images/gallery-winter-sunset.webp', alt: isEn ? 'Virta at the snowy dock at sunset' : 'Virta lumisella laiturilla auringonlaskussa' },
              ]}
            />
          </div>
        </article>
      )}

      {included && (
        <section className="vibe-avanto-included" aria-labelledby="vibe-avanto-included-title">
          <span className="vibe-avanto-feature-number">{included.number}</span>
          <h2 id="vibe-avanto-included-title">{included.title}</h2>
          <p>{included.text}</p>
        </section>
      )}

      {data.prices && data.prices.length > 0 && (
        <section className="vibe-avanto-pricing" aria-labelledby="vibe-avanto-pricing-title">
          <div className="vibe-avanto-pricing-inner">
            <div className="vibe-avanto-pricing-heading">
              <p className="vibe-avanto-eyebrow">{isEn ? 'Private sessions' : 'Yksityisvuorot'}</p>
              <h2 id="vibe-avanto-pricing-title">{data.priceTitle}</h2>
              {data.priceNote && <p>{data.priceNote}</p>}
            </div>
            <div className="vibe-avanto-price-list">
              {data.prices.map((row) => (
                <div className="vibe-avanto-price-row" key={row.label}>
                  <h3>{row.label}</h3>
                  <p className="vibe-avanto-price">{row.price}</p>
                  <p className="vibe-avanto-price-note">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.timeline && data.timeline.length > 0 && (
        <section className="vibe-avanto-rhythm" aria-labelledby="vibe-avanto-rhythm-title">
          <div className="vibe-avanto-rhythm-image">
            <Image
              src="/images/gallery-ice-swimming.webp"
              alt={isEn ? 'A guest returning from the sea to the sauna terrace' : 'Saunoja palaamassa merestä saunan terassille'}
              fill
              sizes="(max-width: 760px) calc(100vw - 44px), 38vw"
            />
            <p>{isEn ? 'Warm up. Cool down. Repeat.' : 'Lämmitä. Vilvoittele. Toista.'}</p>
          </div>
          <div className="vibe-avanto-rhythm-copy">
            <p className="vibe-avanto-eyebrow">{isEn ? 'Two hours at your own pace' : 'Kaksi tuntia omaan tahtiin'}</p>
            <h2 id="vibe-avanto-rhythm-title">{data.timelineTitle}</h2>
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
          </div>
        </section>
      )}

      <VibeBookingFrame kind="winter" locale={locale} />

      <VibeClosingSummary
        eyebrow={isEn ? 'The easy way to sauna' : 'Helppo tapa saunoa'}
        title={isEn ? 'A private sauna session is an easy way to enjoy nature, the sea and the sauna.' : 'Yksityinen saunavuoro on oiva tapa nauttia luonnosta, merestä ja saunasta matalalla kynnyksellä.'}
        paragraphs={isEn ? [
          'At the heart of our service are warm customer care, working facilities and a rustic feel. Nothing about our private sessions is too fancy — the experience is like a cottage getaway, but without the drive, heating the sauna, cutting the ice hole or carrying wood. We take care of those.',
          'Coming alone or as a pair? Take a look at our public sauna sessions.',
        ] : [
          'Meidän palvelun ytimessä on lämmin asiakaspalvelu, toimivat tilat ja rustiikkinen fiilis. Meidän yksityisillä saunavuoroilla ei ole kaikki liian fiiniä, vaan kokemus on mökkimäinen. Kuitenkin ilman ajomatkaa, saunan lämmitystä, avannon sahaamista ja puiden kantoa! Me pidämme niistä huolen.',
          'Jos olet tulossa yksin tai kaksin, kurkkaa meidän Yleiset saunavuorot.',
        ]}
        links={[
          { href: isEn ? '/en/public-sauna-helsinki/' : '/julkinen-sauna/', label: isEn ? 'See public sauna sessions' : 'Kurkkaa yleiset saunavuorot' },
        ]}
      />

      <section className="vibe-avanto-booking" aria-labelledby="vibe-avanto-booking-title">
        <p className="vibe-avanto-eyebrow">{isEn ? 'Aalto or Virta?' : 'Aalto vai Virta?'}</p>
        <h2 id="vibe-avanto-booking-title">
          {isEn ? 'Let’s sauna now' : 'Ny Saunotaan'}
        </h2>
        <p>{isEn ? 'Book the most natural sauna in Helsinki for your group.' : 'Vuokraa luonnollisin sauna Helsingissä'}</p>
        <div className="vibe-avanto-booking-actions">
          <Link className="vibe-avanto-booking-link" href={bookingHref}>
            <span>{data.ctaLabel}</span><ArrowUpRight aria-hidden="true" />
          </Link>
          <Link className="vibe-avanto-home-link" href={locale === 'en' ? '/en/' : '/'}>
            {isEn ? 'Back to all experiences' : 'Takaisin elämyksiin'}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
