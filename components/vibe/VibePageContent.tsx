import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { vibeCopy, type Locale } from './content';
import VibeClosingSummary from './VibeClosingSummary';

export default function VibePageContent({ locale }: { locale: Locale }) {
  const c = vibeCopy[locale];
  const isEn = locale === 'en';
  const bookingHref = isEn ? '/en/ice-swimming-sauna-helsinki/#varaus' : '/avanto/#varaus';
  const publicBookingHref = isEn ? '/en/public-sauna-helsinki/#varaus' : '/julkinen-sauna/#varaus';

  return (
    <main id="main-content">
      <section className="vibe-hero" aria-labelledby="vibe-hero-title">
        <div className="vibe-hero-copy">
          <p className="vibe-eyebrow">{c.heroEyebrow}</p>
          <h1 id="vibe-hero-title">
            <span>{c.heroTitleA}</span>
            <span className="vibe-hero-title-accent">{c.heroTitleB}</span>
          </h1>
          <p className="vibe-hero-text">{c.heroText}</p>
          <p className="vibe-hero-location">{c.heroLocation}</p>
          <div className="vibe-hero-actions">
            <Link className="vibe-button" href={bookingHref}>
              {c.heroCta}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link className="vibe-button vibe-button-secondary" href={publicBookingHref}>
              {isEn ? 'Book a public sauna session' : 'Varaa yleinen saunavuoro'}<ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="vibe-text-link" href="#elamykset">
              {c.heroLink}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="vibe-hero-visual">
          <div className="vibe-hero-image-wrap">
            <Image
              src="/images/vibe-hero-new.webp"
              alt={isEn ? 'A floating sauna in winter sunlight' : 'Saunalautta talvisessa auringonvalossa'}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
          </div>
          <p className="vibe-hero-note">{c.heroNote}</p>
          <aside className="vibe-hero-detail">
            <span className="vibe-detail-rule" aria-hidden="true" />
            <h2>{c.heroCardTitle}</h2>
            <p>{c.heroCardText}</p>
          </aside>
        </div>
      </section>

      <section id="elamykset" className="vibe-experiences" aria-labelledby="vibe-experiences-title">
        <div className="vibe-section-intro">
          <p className="vibe-eyebrow">{c.experiencesEyebrow}</p>
          <h2 id="vibe-experiences-title">{c.experiencesTitle}</h2>
          <p>{c.experiencesText}</p>
        </div>
        <div className="vibe-experience-grid">
          {c.experiences.map((item, index) => (
            <Link key={item.number} href={item.href} className={`vibe-experience-card vibe-card-${index + 1}`}>
              <div className="vibe-experience-image">
                <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <div className="vibe-experience-meta">
                <span className="vibe-card-number">{item.number}</span>
                <div>
                  <p className="vibe-card-label">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p className="vibe-card-text">{item.text}</p>
                  <span className="vibe-card-link">{item.cta}<ArrowRight size={17} aria-hidden="true" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="retki" className="vibe-journey" aria-labelledby="vibe-journey-title">
        <div className="vibe-journey-photo">
          <Image
            src="/images/vibe-aurora-final.webp"
            alt={c.journeyImageAlt}
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <span>{isEn ? 'Sea air, warm timber, winter light' : 'Meri-ilmaa, lämmintä puuta, talven valoa'}</span>
        </div>
        <div className="vibe-journey-copy">
          <p className="vibe-eyebrow">{c.journeyEyebrow}</p>
          <h2 id="vibe-journey-title">{c.journeyTitle}</h2>
          <p className="vibe-journey-intro">{c.journeyText}</p>
          <ol className="vibe-steps">
            {c.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link className="vibe-journey-link" href={bookingHref}>
            {c.journeyCta}<ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="ihmiset" className="vibe-people" aria-labelledby="vibe-people-title">
        <div className="vibe-people-copy">
          <p className="vibe-eyebrow">{c.peopleEyebrow}</p>
          <h2 id="vibe-people-title">{c.peopleTitle}</h2>
          <p>{c.peopleText}</p>
          <ul>
            {c.peopleFacts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        </div>
        <div className="vibe-rating">
          <Star size={26} strokeWidth={1.5} aria-hidden="true" />
          <strong>{c.ratingValue}</strong>
          <span>{c.ratingLabel}</span>
          <small>{c.ratingNote}</small>
        </div>
      </section>

      <VibeClosingSummary
        eyebrow={isEn ? 'Welcome' : 'Tervetuloa'}
        title={isEn ? 'Hyvän Tuulen Sauna needs no decoration.' : 'Hyvän Tuulen Sauna ei somistusta tarvitse.'}
        paragraphs={isEn ? [
          'Our varied services offer something for everyone.',
          'We have been hosting saunas in Helsinki for nearly ten years, so the löyly is hot, the ice hole is cold and everything runs smoothly!',
          'Choose a public or private session and come enjoy yourself!',
          'Wood-fired löyly and the sea, swimming and time well spent. People come here from all over Helsinki to enjoy Finnish sauna culture. Welcome!',
        ] : [
          'Monipuolisilla palveluillamme haluammekin tarjota jokaiselle jotakin.',
          'Meillä on ollut saunoja Helsingissä jo kohta kymmenen vuotta, joten löyly on kuuma, avanto on kylmä ja homma toimii nätisti!',
          'Valitse joko Yleinen tai Yksityinen vuoro ja tule nauttimaan!',
          'Puulöylyt ja meri, uimista ja ajanviettoa. Tänne tullaan nauttimaan ympäri Helsinkiä suomalaisesta saunakulttuurista. Tervetuloa!',
        ]}
        links={[
          { href: isEn ? '/en/public-sauna-helsinki/' : '/julkinen-sauna/', label: isEn ? 'Public sauna' : 'Yleinen sauna' },
          { href: isEn ? '/en/ice-swimming-sauna-helsinki/' : '/avanto/', label: isEn ? 'Private sauna' : 'Yksityinen sauna' },
        ]}
      />

      <section className="vibe-next" aria-labelledby="vibe-next-title">
        <p className="vibe-eyebrow">{c.nextEyebrow}</p>
        <h2 id="vibe-next-title">{c.nextTitle}</h2>
        <p>{c.nextText}</p>
        <div className="vibe-next-actions">
          <Link className="vibe-next-main" href={bookingHref}>
            {c.nextCta}<ArrowUpRight aria-hidden="true" />
          </Link>
          <Link className="vibe-next-secondary" href={publicBookingHref}>
            {c.nextSecondary}<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
