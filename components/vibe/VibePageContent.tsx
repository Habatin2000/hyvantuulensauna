import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { vibeCopy, type Locale } from './content';
import VibeClosingSummary from './VibeClosingSummary';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import { getVibeBookingRoute, getVibeRoute } from './routes';

const pageCopy = {
  fi: {
    publicSessionCta: 'Varaa yleinen saunavuoro',
    journeyCaption: 'Meri-ilmaa, lämmintä puuta, talven valoa',
    closing: {
      eyebrow: 'Tervetuloa',
      title: 'Hyvän Tuulen Sauna ei somistusta tarvitse.',
      paragraphs: [
        'Monipuolisilla palveluillamme haluammekin tarjota jokaiselle jotakin.',
        'Meillä on ollut saunoja Helsingissä jo kohta kymmenen vuotta, joten löyly on kuuma, avanto on kylmä ja homma toimii nätisti!',
        'Valitse joko Yleinen tai Yksityinen vuoro ja tule nauttimaan!',
        'Puulöylyt ja meri, uimista ja ajanviettoa. Tänne tullaan nauttimaan ympäri Helsinkiä suomalaisesta saunakulttuurista. Tervetuloa!',
      ],
      publicSaunaLabel: 'Yleinen sauna',
      privateSaunaLabel: 'Yksityinen sauna',
    },
  },
  en: {
    publicSessionCta: 'Book a public sauna session',
    journeyCaption: 'Sea air, warm timber, winter light',
    closing: {
      eyebrow: 'Welcome',
      title: 'Hyvän Tuulen Sauna needs no decoration.',
      paragraphs: [
        'Our varied services offer something for everyone.',
        'We have been hosting saunas in Helsinki for nearly ten years, so the löyly is hot, the ice hole is cold and everything runs smoothly!',
        'Choose a public or private session and come enjoy yourself!',
        'Wood-fired löyly and the sea, swimming and time well spent. People come here from all over Helsinki to enjoy Finnish sauna culture. Welcome!',
      ],
      publicSaunaLabel: 'Public sauna',
      privateSaunaLabel: 'Private sauna',
    },
  },
  es: {
    publicSessionCta: 'Reserva una sesión de sauna pública',
    journeyCaption: 'Aire de mar, madera cálida, luz de invierno',
    closing: {
      eyebrow: 'Te damos la bienvenida',
      title: 'Hyvän Tuulen Sauna no necesita adornos.',
      paragraphs: [
        'Nuestra variada oferta tiene algo para todos.',
        'Llevamos casi diez años ofreciendo saunas en Helsinki, así que el löyly está caliente, el agua helada y todo funciona a la perfección.',
        'Elige una sesión pública o privada y ven a disfrutar.',
        'Calor de leña y mar, natación y tiempo bien aprovechado. Personas de toda Helsinki vienen aquí para disfrutar de la cultura finlandesa de la sauna. ¡Te damos la bienvenida!',
      ],
      publicSaunaLabel: 'Sauna pública',
      privateSaunaLabel: 'Sauna privada',
    },
  },
  fr: {
    publicSessionCta: 'Réservez une séance de sauna public',
    journeyCaption: 'Air marin, bois chaleureux, lumière d’hiver',
    closing: {
      eyebrow: 'Bienvenue',
      title: 'Hyvän Tuulen Sauna n’a pas besoin d’artifices.',
      paragraphs: [
        'Notre offre variée propose quelque chose pour chacun.',
        'Nous vous accueillons dans nos saunas à Helsinki depuis presque dix ans : le löyly est chaud, le trou dans la glace est froid et tout fonctionne parfaitement !',
        'Choisissez une séance publique ou privée et venez en profiter !',
        'Chaleur du poêle à bois et mer, baignade et moments de détente. Des visiteurs de tout Helsinki viennent ici pour découvrir la culture finlandaise du sauna. Bienvenue !',
      ],
      publicSaunaLabel: 'Sauna public',
      privateSaunaLabel: 'Sauna privé',
    },
  },
  de: {
    publicSessionCta: 'Buche eine öffentliche Saunasession',
    journeyCaption: 'Meeresluft, warmes Holz, winterliches Licht',
    closing: {
      eyebrow: 'Willkommen',
      title: 'Hyvän Tuulen Sauna braucht keinen Schnickschnack.',
      paragraphs: [
        'Unser vielfältiges Angebot hält für jeden etwas bereit.',
        'Seit fast zehn Jahren betreiben wir Saunen in Helsinki – das Löyly ist heiß, das Eisloch ist kalt und alles läuft reibungslos!',
        'Wähle eine öffentliche oder private Saunasession und komm vorbei!',
        'Holzfeuer und Meer, Schwimmen und schöne Stunden. Menschen aus ganz Helsinki kommen hierher, um die finnische Saunakultur zu genießen. Willkommen!',
      ],
      publicSaunaLabel: 'Öffentliche Sauna',
      privateSaunaLabel: 'Private Sauna',
    },
  },
};

export default function VibePageContent({ locale }: { locale: Locale }) {
  const c = vibeCopy[locale];
  const ui = pageCopy[locale];
  const bookingHref = getVibeBookingRoute('avanto', locale);
  const publicBookingHref = getVibeBookingRoute('julkinen-sauna', locale);

  return (
    <main id="main-content">
      <section className="vibe-hero" aria-labelledby="vibe-hero-title">
        <VibeHeroBackdrop />
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
              {ui.publicSessionCta}<ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="vibe-text-link" href="#elamykset">
              {c.heroLink}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
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
          <span>{ui.journeyCaption}</span>
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
        eyebrow={ui.closing.eyebrow}
        title={ui.closing.title}
        paragraphs={ui.closing.paragraphs}
        links={[
          { href: getVibeRoute('julkinen-sauna', locale), label: ui.closing.publicSaunaLabel },
          { href: getVibeRoute('avanto', locale), label: ui.closing.privateSaunaLabel },
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
