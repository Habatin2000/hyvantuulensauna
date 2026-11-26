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
      'Aalto-saunalautta lumisella jäällä talviyössä',
      'Aallon puulämmitteisen saunan lauteet ja löylyvesiämpäri',
      'Aallon katetun terassin pöytä, lyhdyt ja merinäköala',
      'Lihaa ja keltaisia paprikoita kypsymässä Aallon grillissä',
    ],
    chooseAalto: 'Valitse Aalto',
    virtaAlts: [
      'Virta-saunalautta tyynessä vedessä',
      'Virran puusaunan puukiuas ja puiset lauteet',
      'Virran puiset lauteet ja ikkunoista avautuva merinäköala',
      'Virta lumisella laiturilla auringonlaskussa',
    ],
    chooseVirta: 'Valitse Virta',
    privateSessions: 'Yksityisvuorot',
    rhythmImageAlt: 'Talviuimari nousee merestä saunalautan metallitikapuita pitkin',
    rhythmCaption: 'Lämmitä. Vilvoittele. Toista.',
    rhythmEyebrow: 'Kaksi tuntia omaan tahtiin',
    closingEyebrow: 'Helppo tapa saunoa',
    closingTitle: 'Yksityinen saunavuoro on oiva tapa nauttia luonnosta, merestä ja saunasta matalalla kynnyksellä.',
    closingParagraphs: [
      'Jos etsit paikkaa, jossa saunoa ja harrastaa avanto-uintia omalla porukalla Helsingissä edullisesti, on tämä sivu sinulle. Meillä yhdistyy rento ilmapiiri, laadukkaat puusaunat ja luonnollisuus meren äärellä saumattomaan kokonaisuuteen.',
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
      'Aalto sauna boat on snow-covered ice at night',
      'Wooden benches and a water bucket inside the Aalto sauna',
      'A table, lanterns and a sea view on Aalto’s covered terrace',
      'Meat and yellow peppers cooking on the Aalto grill',
    ],
    chooseAalto: 'Choose Aalto',
    virtaAlts: [
      'Virta floating sauna in calm water',
      'Wood-burning stove and wooden benches inside the Virta sauna',
      'Wooden benches and windows overlooking the sea inside the Virta sauna',
      'Virta at the snowy dock at sunset',
    ],
    chooseVirta: 'Choose Virta',
    privateSessions: 'Private sessions',
    rhythmImageAlt: 'A winter swimmer climbing a metal ladder out of the sea beside the sauna raft',
    rhythmCaption: 'Warm up. Cool down. Repeat.',
    rhythmEyebrow: 'Two hours at your own pace',
    closingEyebrow: 'The easy way to sauna',
    closingTitle: 'A private sauna session is an easy way to enjoy nature, the sea and the sauna.',
    closingParagraphs: [
      'If you are looking for an affordable place to enjoy the sauna and ice swimming with your own group in Helsinki, this page is for you. We combine a relaxed atmosphere, high-quality wood-fired saunas and nature by the sea into one seamless experience.',
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
      'Barco sauna Aalto sobre el hielo cubierto de nieve por la noche',
      'Bancos de madera y un cubo de agua en el interior de la sauna Aalto',
      'Mesa, farolillos y vistas al mar en la terraza cubierta de Aalto',
      'Carne y pimientos amarillos cocinándose en la parrilla de Aalto',
    ],
    chooseAalto: 'Elegir Aalto',
    virtaAlts: [
      'Sauna flotante Virta en aguas tranquilas',
      'Estufa de leña y bancos de madera en el interior de la sauna Virta',
      'Bancos de madera y ventanas con vistas al mar en el interior de la sauna Virta',
      'Virta en el muelle nevado al atardecer',
    ],
    chooseVirta: 'Elegir Virta',
    privateSessions: 'Sesiones privadas',
    rhythmImageAlt: 'Una persona sube del mar por una escalera metálica junto a la sauna flotante',
    rhythmCaption: 'Calienta. Refréscate. Repite.',
    rhythmEyebrow: 'Dos horas a tu propio ritmo',
    closingEyebrow: 'La forma más sencilla de disfrutar de la sauna',
    closingTitle: 'Una sesión de sauna privada es una forma sencilla de disfrutar de la naturaleza, el mar y la sauna.',
    closingParagraphs: [
      'Si buscas un lugar asequible para disfrutar de la sauna y de un baño en agua helada con tu propio grupo en Helsinki, esta página es para ti. Combinamos un ambiente relajado, saunas de leña de alta calidad y naturaleza junto al mar para crear una experiencia única.',
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
      'Bateau-sauna Aalto sur la glace enneigée, de nuit',
      'Bancs en bois et seau d’eau à l’intérieur du sauna Aalto',
      'Table, lanternes et vue sur la mer sur la terrasse couverte d’Aalto',
      'Viande et poivrons jaunes cuisant sur le grill d’Aalto',
    ],
    chooseAalto: 'Choisir Aalto',
    virtaAlts: [
      'Sauna flottant Virta sur une eau calme',
      'Poêle à bois et bancs en bois à l’intérieur du sauna Virta',
      'Bancs en bois et fenêtres donnant sur la mer à l’intérieur du sauna Virta',
      'Virta au ponton enneigé au coucher du soleil',
    ],
    chooseVirta: 'Choisir Virta',
    privateSessions: 'Séances privées',
    rhythmImageAlt: 'Une personne remonte de la mer par une échelle métallique, à côté du sauna flottant',
    rhythmCaption: 'Réchauffez-vous. Rafraîchissez-vous. Recommencez.',
    rhythmEyebrow: 'Deux heures à votre rythme',
    closingEyebrow: 'Le sauna en toute simplicité',
    closingTitle: 'Une séance de sauna privée est une manière simple de profiter de la nature, de la mer et du sauna.',
    closingParagraphs: [
      'Si vous cherchez un lieu abordable pour profiter du sauna et d’un bain en eau glacée avec votre propre groupe à Helsinki, cette page est faite pour vous. Nous réunissons une atmosphère détendue, des saunas à bois de grande qualité et la nature au bord de la mer pour offrir une expérience harmonieuse.',
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
      'Saunaboot Aalto bei Nacht auf schneebedecktem Eis',
      'Holzbänke und Wassereimer im Innenraum der Aalto-Sauna',
      'Tisch, Laternen und Meerblick auf der überdachten Terrasse der Aalto',
      'Fleisch und gelbe Paprikaringe auf dem Grill der Aalto',
    ],
    chooseAalto: 'Aalto wählen',
    virtaAlts: [
      'Schwimmende Virta-Sauna auf ruhigem Wasser',
      'Holzofen und Holzbänke im Innenraum der Virta-Sauna',
      'Holzbänke und Fenster mit Meerblick im Innenraum der Virta-Sauna',
      'Virta bei Sonnenuntergang am verschneiten Steg',
    ],
    chooseVirta: 'Virta wählen',
    privateSessions: 'Private Saunatermine',
    rhythmImageAlt: 'Ein Winterschwimmer steigt über eine Metallleiter neben der Saunaplattform aus dem Meer',
    rhythmCaption: 'Aufwärmen. Abkühlen. Wiederholen.',
    rhythmEyebrow: 'Zwei Stunden in eurem eigenen Tempo',
    closingEyebrow: 'Der einfache Weg in die Sauna',
    closingTitle: 'Eine private Saunasession ist eine unkomplizierte Möglichkeit, Natur, Meer und Sauna zu genießen.',
    closingParagraphs: [
      'Wenn du in Helsinki einen preiswerten Ort suchst, an dem du mit deiner eigenen Gruppe saunieren und im Eiswasser baden kannst, bist du hier richtig. Wir verbinden eine entspannte Atmosphäre, hochwertige Holzsaunen und die Natur am Meer zu einem rundum stimmigen Erlebnis.',
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
