import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { vibeCopy, type Locale } from './content';
import VibeClosingSummary from './VibeClosingSummary';
import VibeFaq from './VibeFaq';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import { getVibeBookingRoute, getVibeRoute } from './routes';

export const pageCopy = {
  fi: {
    publicSessionCta: 'Varaa yleinen saunavuoro',
    journeyCaption: 'Meri-ilmaa, lämmintä puuta, talven valoa',
    faqEyebrow: 'Hyvä tietää',
    faqTitle: 'Usein kysytyt kysymykset',
    faqItems: [
      {
        question: 'Voiko tulla ensikertalaisena?',
        answer: 'Kyllä. Yleisille opastetuille saunavuoroille ovat tervetulleita myös ensikertalaiset, ja saunan voi varata myös yksityiskäyttöön.',
      },
      {
        question: 'Onko tämä sopiva polttariporukalle?',
        answer: 'Kyllä. Aalto ja Virta sopivat polttareiden lisäksi syntymäpäiville ja yritysryhmille. Voit tuoda mukanasi omat ruoat ja juomat.',
      },
      {
        question: 'Missä Hyvän Tuulen Sauna sijaitsee?',
        answer: 'Talvella sauna sijaitsee Meripellontie 11C:ssä Puotilassa. Kesällä sauna lähtee Kalkkihiekantorilta Aurinkolahdesta.',
      },
    ],
    closing: {
      eyebrow: 'Tervetuloa',
      title: 'Hyvän Tuulen Sauna ei somistusta tarvitse.',
      paragraphs: [
        'Hyvän Tuulen Sauna on paikka sinulle, joka arvostat luonnollista, autenttista ja alkuperäistä saunakokemusta. Ei tarvitse edes lähteä Helsingistä kokeaksesi mökin kaltaisen saunakokemuksen. Meillä reilu ilmapiiri ja lämpimät kiukaat toivottavat teidät tervetulleeksi.',
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
    faqEyebrow: 'Good to know',
    faqTitle: 'Frequently asked questions',
    faqItems: [
      {
        question: 'Can first-timers join?',
        answer: 'Yes. Our guided public sessions welcome first-timers, and private sauna sessions are also available.',
      },
      {
        question: 'Is this suitable for a bachelor party?',
        answer: 'Yes. Aalto and Virta are suitable for bachelor parties, birthdays and corporate groups. You are welcome to bring your own food and drinks.',
      },
      {
        question: 'Where is Hyvän Tuulen Sauna located?',
        answer: 'In winter, the sauna is based at Meripellontie 11C in Puotila. In summer, it departs from Kalkkihiekantori in Aurinkolahti.',
      },
    ],
    closing: {
      eyebrow: 'Welcome',
      title: 'Hyvän Tuulen Sauna needs no decoration.',
      paragraphs: [
        'Hyvän Tuulen Sauna is for anyone who appreciates a natural, authentic and traditional sauna experience. You do not even need to leave Helsinki to enjoy a cottage-like sauna. Our welcoming atmosphere and hot stoves are ready to welcome you.',
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
    faqEyebrow: 'Información útil',
    faqTitle: 'Preguntas frecuentes',
    faqItems: [
      {
        question: '¿Puedo venir si es mi primera vez?',
        answer: 'Sí. Las sesiones públicas guiadas están abiertas a quienes vienen por primera vez, y también puedes reservar una sesión privada.',
      },
      {
        question: '¿Es adecuado para una despedida de soltero?',
        answer: 'Sí. Aalto y Virta son adecuados para despedidas de soltero, cumpleaños y grupos de empresa. Puedes traer tu propia comida y bebida.',
      },
      {
        question: '¿Dónde se encuentra Hyvän Tuulen Sauna?',
        answer: 'En invierno, la sauna está en Meripellontie 11C, en Puotila. En verano, sale de Kalkkihiekantori, en Aurinkolahti.',
      },
    ],
    closing: {
      eyebrow: 'Te damos la bienvenida',
      title: 'Hyvän Tuulen Sauna no necesita adornos.',
      paragraphs: [
        'Hyvän Tuulen Sauna es para quienes valoran una experiencia de sauna natural, auténtica y tradicional. Ni siquiera hace falta salir de Helsinki para sentirse como en una cabaña. Nuestro ambiente acogedor y nuestros hornos calientes os dan la bienvenida.',
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
    faqEyebrow: 'Bon à savoir',
    faqTitle: 'Questions fréquentes',
    faqItems: [
      {
        question: 'Puis-je venir pour une première expérience ?',
        answer: 'Oui. Les séances publiques guidées accueillent aussi les débutants, et des séances privées sont également disponibles.',
      },
      {
        question: 'Est-ce adapté à un enterrement de vie de garçon ?',
        answer: 'Oui. Aalto et Virta conviennent aux enterrements de vie de garçon, aux anniversaires et aux groupes d’entreprise. Vous pouvez apporter votre propre nourriture et vos boissons.',
      },
      {
        question: 'Où se trouve Hyvän Tuulen Sauna ?',
        answer: 'En hiver, le sauna se trouve au Meripellontie 11C, à Puotila. En été, il part de Kalkkihiekantori, à Aurinkolahti.',
      },
    ],
    closing: {
      eyebrow: 'Bienvenue',
      title: 'Hyvän Tuulen Sauna n’a pas besoin d’artifices.',
      paragraphs: [
        'Hyvän Tuulen Sauna s’adresse à celles et ceux qui apprécient une expérience de sauna naturelle, authentique et traditionnelle. Pas besoin de quitter Helsinki pour retrouver l’ambiance d’un chalet. Notre atmosphère conviviale et nos poêles bien chauds vous accueillent.',
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
    faqEyebrow: 'Gut zu wissen',
    faqTitle: 'Häufig gestellte Fragen',
    faqItems: [
      {
        question: 'Ist die Sauna für Erstbesucher geeignet?',
        answer: 'Ja. Erstbesucher sind bei den öffentlichen geführten Saunasessions willkommen. Außerdem kannst du eine private Session buchen.',
      },
      {
        question: 'Eignet sich die Sauna für einen Junggesellenabschied?',
        answer: 'Ja. Aalto und Virta eignen sich für Junggesellenabschiede, Geburtstage und Firmengruppen. Du kannst dein eigenes Essen und deine Getränke mitbringen.',
      },
      {
        question: 'Wo befindet sich Hyvän Tuulen Sauna?',
        answer: 'Im Winter befindet sich die Sauna in der Meripellontie 11C in Puotila. Im Sommer legt sie am Kalkkihiekantori in Aurinkolahti ab.',
      },
    ],
    closing: {
      eyebrow: 'Willkommen',
      title: 'Hyvän Tuulen Sauna braucht keinen Schnickschnack.',
      paragraphs: [
        'Hyvän Tuulen Sauna ist für alle, die ein natürliches, authentisches und traditionelles Saunaerlebnis schätzen. Du musst Helsinki nicht einmal verlassen, um dich wie in einer Hütte zu fühlen. Unsere herzliche Atmosphäre und heißen Öfen heißen dich willkommen.',
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

      <section className="vibe-welcome" aria-labelledby="vibe-welcome-title">
        <h2 id="vibe-welcome-title">{c.welcomeTitle}</h2>
        <p>{c.welcomeBody}</p>
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

      <section className="vibe-faq-section" aria-labelledby="vibe-faq-title">
        <div className="vibe-faq-heading">
          <p className="vibe-eyebrow">{ui.faqEyebrow}</p>
          <h2 id="vibe-faq-title">{ui.faqTitle}</h2>
        </div>
        <VibeFaq items={ui.faqItems} />
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
