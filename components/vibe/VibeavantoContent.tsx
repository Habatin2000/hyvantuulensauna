import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from './content';
import type { VibePageData } from './pages';
import VibeBookingFrame from './VibeBookingFrame';
import VibeBoatGallery from './VibeBoatGallery';
import VibeClosingSummary from './VibeClosingSummary';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import { getVibeRoute } from './routes';
import '../../app/vibe/avanto.css';

const avantoCopy = {
  fi: {
    meetSaunas: 'Tutustu lautoihin',
    entirelyYours: 'Kokonaan teidän',
    privateSauna: 'Yksityinen sauna',
    aaltoAlts: [
      'Aalto-saunalautta lumisella jäällä',
      'Aallon puulämmitteisen saunan sisätila',
      'Aallon terassi meren äärellä',
      'Eväitä Aallon grillissä',
    ],
    chooseAalto: 'Valitse Aalto',
    virtaAlts: [
      'Virta-saunalautta tyynessä vedessä',
      'Virran puulämmitteisen saunan sisätila',
      'Virran puiset lauteet',
      'Virta lumisella laiturilla auringonlaskussa',
    ],
    chooseVirta: 'Valitse Virta',
    privateSessions: 'Yksityisvuorot',
    rhythmImageAlt: 'Saunoja palaamassa merestä saunan terassille',
    rhythmCaption: 'Lämmitä. Vilvoittele. Toista.',
    rhythmEyebrow: 'Kaksi tuntia omaan tahtiin',
    closingEyebrow: 'Helppo tapa saunoa',
    closingTitle: 'Yksityinen saunavuoro on oiva tapa nauttia luonnosta, merestä ja saunasta matalalla kynnyksellä.',
    closingParagraphs: [
      'Palvelun ytimessä ovat lämmin asiakaspalvelu, toimivat tilat ja rustiikkinen fiilis. Yksityisellä saunavuorolla ei tarvitse olla turhan fiini: kokemus on mökkimäinen, mutta ilman ajomatkaa, saunan lämmittämistä, avannon sahaamista tai puiden kantoa. Me hoidamme kaiken valmiiksi, joten pääset heti saunomaan ja avantouimaan Helsingissä.',
      'Jos olet tulossa yksin tai kaksin, kurkkaa meidän Yleiset saunavuorot.',
    ],
    publicSaunaHref: '/julkinen-sauna/',
    publicSaunaLabel: 'Kurkkaa yleiset saunavuorot',
    bookingEyebrow: 'Aalto vai Virta?',
    bookingTitle: 'Ny Saunotaan',
    bookingText: 'Vuokraa luonnollisin sauna Helsingissä',
    homeHref: '/',
    homeLabel: 'Takaisin elämyksiin',
  },
  en: {
    meetSaunas: 'Meet the saunas',
    entirelyYours: 'Entirely yours',
    privateSauna: 'Private sauna',
    aaltoAlts: [
      'Aalto sauna on snowy ice',
      'Inside the Aalto wood-fired sauna',
      'Aalto terrace by the sea',
      'Food cooking on the Aalto grill',
    ],
    chooseAalto: 'Choose Aalto',
    virtaAlts: [
      'Virta floating sauna in calm water',
      'Inside the Virta wood-fired sauna',
      'Wooden benches inside Virta',
      'Virta at the snowy dock at sunset',
    ],
    chooseVirta: 'Choose Virta',
    privateSessions: 'Private sessions',
    rhythmImageAlt: 'A guest returning from the sea to the sauna terrace',
    rhythmCaption: 'Warm up. Cool down. Repeat.',
    rhythmEyebrow: 'Two hours at your own pace',
    closingEyebrow: 'The easy way to sauna',
    closingTitle: 'A private sauna session is an easy way to enjoy nature, the sea and the sauna.',
    closingParagraphs: [
      'At the heart of our service are warm hospitality, well-functioning facilities and a rustic atmosphere. A private sauna session does not need to be overly fancy: you get the feel of a cottage escape, but without the drive, heating the sauna, cutting a hole in the ice or carrying firewood. We have everything ready for you, so you can get straight to the sauna and ice swimming in Helsinki.',
      'Coming alone or as a pair? Take a look at our public sauna sessions.',
    ],
    publicSaunaHref: '/en/public-sauna-helsinki/',
    publicSaunaLabel: 'See public sauna sessions',
    bookingEyebrow: 'Aalto or Virta?',
    bookingTitle: 'Let’s sauna now',
    bookingText: 'Book the most natural sauna in Helsinki for your group.',
    homeHref: '/en/',
    homeLabel: 'Back to all experiences',
  },
  es: {
    meetSaunas: 'Descubre las saunas',
    entirelyYours: 'Todo para vosotros',
    privateSauna: 'Sauna privada',
    aaltoAlts: [
      'Sauna Aalto sobre el hielo cubierto de nieve',
      'Interior de la sauna de leña Aalto',
      'Terraza de Aalto junto al mar',
      'Comida cocinándose en la parrilla de Aalto',
    ],
    chooseAalto: 'Elegir Aalto',
    virtaAlts: [
      'Sauna flotante Virta en aguas tranquilas',
      'Interior de la sauna de leña Virta',
      'Bancos de madera en el interior de Virta',
      'Virta en el muelle nevado al atardecer',
    ],
    chooseVirta: 'Elegir Virta',
    privateSessions: 'Sesiones privadas',
    rhythmImageAlt: 'Una persona volviendo del mar a la terraza de la sauna',
    rhythmCaption: 'Calienta. Refréscate. Repite.',
    rhythmEyebrow: 'Dos horas a tu propio ritmo',
    closingEyebrow: 'La forma más sencilla de disfrutar de la sauna',
    closingTitle: 'Una sesión de sauna privada es una forma sencilla de disfrutar de la naturaleza, el mar y la sauna.',
    closingParagraphs: [
      'Nuestro servicio se centra en un trato cercano, unas instalaciones funcionales y un ambiente rústico. En una sesión privada de sauna no hacen falta lujos innecesarios: la experiencia es como una escapada a una cabaña, pero sin el trayecto en coche, sin calentar la sauna, sin abrir un agujero en el hielo ni cargar leña. Lo dejamos todo listo para que puedas disfrutar enseguida de la sauna y de un baño en agua helada en Helsinki.',
      '¿Vienes solo o en pareja? Echa un vistazo a nuestras sesiones públicas de sauna.',
    ],
    publicSaunaHref: getVibeRoute('julkinen-sauna', 'es'),
    publicSaunaLabel: 'Ver las sesiones públicas de sauna',
    bookingEyebrow: '¿Aalto o Virta?',
    bookingTitle: 'Ahora, a disfrutar de la sauna',
    bookingText: 'Reserva la sauna más natural de Helsinki para tu grupo.',
    homeHref: '/es/',
    homeLabel: 'Volver a todas las experiencias',
  },
  fr: {
    meetSaunas: 'Découvrir les saunas',
    entirelyYours: 'Rien que pour vous',
    privateSauna: 'Sauna privé',
    aaltoAlts: [
      'Sauna Aalto sur la glace enneigée',
      'Intérieur du sauna Aalto chauffé au bois',
      'Terrasse d’Aalto au bord de la mer',
      'Plats cuisant sur le grill d’Aalto',
    ],
    chooseAalto: 'Choisir Aalto',
    virtaAlts: [
      'Sauna flottant Virta sur une eau calme',
      'Intérieur du sauna Virta chauffé au bois',
      'Bancs en bois à l’intérieur de Virta',
      'Virta au ponton enneigé au coucher du soleil',
    ],
    chooseVirta: 'Choisir Virta',
    privateSessions: 'Séances privées',
    rhythmImageAlt: 'Retour de la mer vers la terrasse du sauna',
    rhythmCaption: 'Réchauffez-vous. Rafraîchissez-vous. Recommencez.',
    rhythmEyebrow: 'Deux heures à votre rythme',
    closingEyebrow: 'Le sauna en toute simplicité',
    closingTitle: 'Une séance de sauna privée est une manière simple de profiter de la nature, de la mer et du sauna.',
    closingParagraphs: [
      'Au cœur de notre service se trouvent un accueil chaleureux, des installations fonctionnelles et une ambiance rustique. Lors d’une séance de sauna privée, nul besoin d’en faire trop : l’expérience a le charme d’un séjour au chalet, sans le trajet en voiture, sans chauffer le sauna, sans scier un trou dans la glace ni porter le bois. Nous préparons tout pour que vous puissiez profiter immédiatement du sauna et d’un bain en eau glacée à Helsinki.',
      'Vous venez seul ou à deux ? Découvrez nos séances publiques de sauna.',
    ],
    publicSaunaHref: getVibeRoute('julkinen-sauna', 'fr'),
    publicSaunaLabel: 'Voir les séances publiques de sauna',
    bookingEyebrow: 'Aalto ou Virta ?',
    bookingTitle: 'Et maintenant, place au sauna',
    bookingText: 'Réservez le sauna le plus naturel de Helsinki pour votre groupe.',
    homeHref: '/fr/',
    homeLabel: 'Retour à toutes les expériences',
  },
  de: {
    meetSaunas: 'Die Saunen entdecken',
    entirelyYours: 'Ganz für euch allein',
    privateSauna: 'Private Sauna',
    aaltoAlts: [
      'Die Sauna Aalto auf schneebedecktem Eis',
      'Innenraum der holzbeheizten Aalto-Sauna',
      'Aaltos Terrasse am Meer',
      'Speisen auf dem Aalto-Grill',
    ],
    chooseAalto: 'Aalto wählen',
    virtaAlts: [
      'Schwimmende Virta-Sauna auf ruhigem Wasser',
      'Innenraum der holzbeheizten Virta-Sauna',
      'Holzbänke in der Virta',
      'Virta bei Sonnenuntergang am verschneiten Steg',
    ],
    chooseVirta: 'Virta wählen',
    privateSessions: 'Private Saunatermine',
    rhythmImageAlt: 'Ein Gast kehrt vom Meer auf die Saunaterrasse zurück',
    rhythmCaption: 'Aufwärmen. Abkühlen. Wiederholen.',
    rhythmEyebrow: 'Zwei Stunden in eurem eigenen Tempo',
    closingEyebrow: 'Der einfache Weg in die Sauna',
    closingTitle: 'Eine private Saunasession ist eine unkomplizierte Möglichkeit, Natur, Meer und Sauna zu genießen.',
    closingParagraphs: [
      'Im Mittelpunkt unseres Angebots stehen herzlicher Service, funktionierende Einrichtungen und eine rustikale Atmosphäre. Bei einer privaten Saunasession kommt es nicht auf unnötigen Luxus an: Das Erlebnis ist so urig wie auf einer Hütte, nur ohne Anfahrt, Saunaheizen, Eislochsägen und Holztragen. Wir bereiten alles vor, damit du in Helsinki sofort saunieren und im eiskalten Wasser baden kannst.',
      'Kommst du allein oder zu zweit? Dann schau dir unsere öffentlichen Saunagänge an.',
    ],
    publicSaunaHref: getVibeRoute('julkinen-sauna', 'de'),
    publicSaunaLabel: 'Öffentliche Saunagänge ansehen',
    bookingEyebrow: 'Aalto oder Virta?',
    bookingTitle: 'Jetzt ist Saunazeit',
    bookingText: 'Buche die natürlichste Sauna Helsinkis für deine Gruppe.',
    homeHref: '/de/',
    homeLabel: 'Zurück zu allen Erlebnissen',
  },
} as const;

export default function VibeavantoContent({ data, locale }: { data: VibePageData; locale: Locale }) {
  const copy = avantoCopy[locale];
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
              {copy.meetSaunas}<ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="vibe-avanto-hero-footnote">
            <span aria-hidden="true">02 h</span>
            {copy.entirelyYours}
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
            <span>{copy.privateSauna}</span>
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
              { src: '/images/vibe-hero-upright.webp', alt: copy.aaltoAlts[0] },
              { src: '/images/aalto-08.webp', alt: copy.aaltoAlts[1] },
              { src: '/images/gallery-aalto-7547.webp', alt: copy.aaltoAlts[2] },
              { src: '/images/aalto-07.webp', alt: copy.aaltoAlts[3] },
            ]}
          />
          <div className="vibe-avanto-aalto-copy">
            <span className="vibe-avanto-feature-number">{aalto.number}</span>
            <p className="vibe-avanto-feature-label">Aalto</p>
            <h3 id="vibe-avanto-aalto-title">{aalto.title}</h3>
            <p>{aalto.text}</p>
            <Link href={bookingHref} className="vibe-avanto-inline-link">
              {copy.chooseAalto}<ArrowRight size={17} aria-hidden="true" />
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
                {copy.chooseVirta}<ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <VibeBoatGallery
              className="vibe-avanto-virta-image"
              label="Virta"
              badge="V / 06"
              locale={locale}
              sizes="(max-width: 760px) calc(100vw - 44px), 48vw"
              images={[
                { src: '/images/virta-stern-calm.webp', alt: copy.virtaAlts[0] },
                { src: '/images/virta-02.webp', alt: copy.virtaAlts[1] },
                { src: '/images/virta-04.webp', alt: copy.virtaAlts[2] },
                { src: '/images/gallery-winter-sunset.webp', alt: copy.virtaAlts[3] },
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
              <p className="vibe-avanto-eyebrow">{copy.privateSessions}</p>
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
              alt={copy.rhythmImageAlt}
              fill
              sizes="(max-width: 760px) calc(100vw - 44px), 38vw"
            />
            <p>{copy.rhythmCaption}</p>
          </div>
          <div className="vibe-avanto-rhythm-copy">
            <p className="vibe-avanto-eyebrow">{copy.rhythmEyebrow}</p>
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
        eyebrow={copy.closingEyebrow}
        title={copy.closingTitle}
        paragraphs={[...copy.closingParagraphs]}
        links={[
          { href: copy.publicSaunaHref, label: copy.publicSaunaLabel },
        ]}
      />

      <section className="vibe-avanto-booking" aria-labelledby="vibe-avanto-booking-title">
        <p className="vibe-avanto-eyebrow">{copy.bookingEyebrow}</p>
        <h2 id="vibe-avanto-booking-title">
          {copy.bookingTitle}
        </h2>
        <p>{copy.bookingText}</p>
        <div className="vibe-avanto-booking-actions">
          <Link className="vibe-avanto-booking-link" href={bookingHref}>
            <span>{data.ctaLabel}</span><ArrowUpRight aria-hidden="true" />
          </Link>
          <Link className="vibe-avanto-home-link" href={copy.homeHref}>
            {copy.homeLabel}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
