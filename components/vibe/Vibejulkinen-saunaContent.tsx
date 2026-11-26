import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from './content';
import type { VibePageData } from './pages';
import { getVibeBookingRoute, getVibeRoute } from './routes';
import VibeBookingFrame from './VibeBookingFrame';
import VibeFaq from './VibeFaq';
import VibeClosingSummary from './VibeClosingSummary';
import VibeWinterGallery from './VibeWinterGallery';
import VibeHeroBackdrop from './VibeHeroBackdrop';
import SubscriptionPurchase from '../booking/SubscriptionPurchase';
import '../../app/vibe/julkinen-sauna.css';

const copyByLocale = {
  fi: {
    publicIntroTitle: 'Hyvän Tuulen Saunan julkiset saunavuorot:',
    publicIntroText: 'Hyvän Tuulen Sauna on järjestänyt julkisia saunavuoroja vuoden ympäri vuodesta 2023! Meille tärkeintä julkisilla vuoroilla on hyvät saunat, rento tunnelma ja ystävällinen palvelu. Kaksi pukkaria, kaksi saunaa, kaksi avantoa. Homma toimii ja ihmiset nauttii. Tervetuloa❤️',
    heroNote: 'Yksin, kaksin tai kaveriporukalla',
    heroLocation: 'Puotila · Helsinki · Meren äärellä',
    explore: 'Katso, mitä vuoroon kuuluu',
    session: 'yksi vuoro',
    photoCaption: 'Kuumat kiukaat, kaksi tuntia ilman hoppua',
    pricing: 'Selkeä hinnoittelu',
    pricingIntro: 'Varaa kerta tai ota sarjakortti ja tule useammin!',
    earlyBird: 'Sarjakortit',
    passTitle: 'Lisää syitä palata lauteille.',
    passText: 'Valitse viisi tai kymmenen käyntiä ja tee saunomisesta tapa.',
    firstVisit: 'Ensimmäinen kertasi',
    finalEyebrow: 'Saunat on kuumana',
    finalTitle: 'Nähdään löylyissä.',
    back: 'Takaisin kaikkiin elämyksiin',
    verticalNote: 'TULI · MERI · KAIKKI',
    admissionIncluded: 'Sauna, avanto ja ohjaus sisältyvät',
    interiorAlt: 'Puusaunan sisätila, jossa on kerroslauteet ja kiuas',
    twoHoursLabel: 'Kaksi tuntia yhdellä vuorolla',
    winterGalleryAria: 'Talvinen saunagalleria',
    winterGalleryLabel: 'Talvi Hyvän Tuulen Saunalla',
    galleryAlts: [
      'Saunalautta ja saunarakennus jäätyneellä merellä auringonlaskussa',
      'Ystävät juttelevat puusaunan lauteilla',
      'Luminen laituri johtaa kahden saunan luo jäätyneellä merellä',
      'Nainen rentoutuu lämpimästi valaistun saunan lauteilla',
      'Revontulet Helsingin vesistön yllä ja SUP-laudalla istuva henkilö',
      'Nainen kylpytakissa jäätyneen meren äärellä talvisessa auringonvalossa',
      'Talviuimari nousee merestä saunalautan metallitikapuita pitkin',
      'Auringon valaisemat puulauteet sekä löylyvesiämpäri ja kauha',
    ],
    winterSwimmerAlt: 'Talviuimari nousee merestä saunalautan metallitikapuita pitkin',
    breathingText: 'Hengitä rauhassa. Kuuntele kehoasi.',
    faqEyebrow: 'Hyvä tietää',
    faqTitle: 'Usein kysyttyä ennen vuoroa',
    faqItems: [
      { question: 'Milloin yleisiä vuoroja on?', answer: 'Yleisiä vuoroja järjestetään läpi viikon. Näet vapaat ajat varauskalenterista.' },
      { question: 'Mitä otan mukaan?', answer: 'Pyyhe, uimapuku ja juomapullo riittävät. Ota myös sään mukainen vaatetus ja tarvittaessa sandaalit.' },
      { question: 'Voinko tulla ensimmäistä kertaa?', answer: 'Kyllä. Opastamme ensikertalaisia talviuinnin pariin, ja voit myös vain saunoa.' },
      { question: 'Mitä vuoro maksaa?', answer: 'Yleinen vuoro maksaa 15 € / 2 h. Opiskelijat, eläkeläiset ja alle 15-vuotiaat saunovat hintaan 12,50 € / 2 h.' },
      { question: 'Onko käytössä pukuhuone ja WC?', answer: 'Kyllä. Myös terassi on käytössäsi vuoron ajan.' },
    ],
    closingEyebrow: 'Tule sellaisena kuin olet',
    closingTitle: 'Meidän Yleiset vuorot ovat loistava tapa tulla nauttimaan vapaa-ajasta ja tutustua talviuintiin.',
    closingParagraphs: [
      'Edullisten, laadukkaiden ja kuumien puusaunojen ystäville. Meille on tervetulleita kaikki vauvasta vaariin. Avanto ja sauna, puukiuas ja rento ilmapiiri kivenheiton päässä Helsingin keskustasta.',
      'Ohjatulla vuorolla ensikertalaisilla opastetaan avantoon meneminen ja hengityksen kontrollointi. Ei rakettitiedettä mutta tsempin kanssa helpompaa! Yleiset vuorot ovat yhteisöllisiä vuoroja, jolloin huolet voi jättää mantereen puolelle.',
      'Jos haluat koko paikan itsellesi, varaa joko kaikki vapaat liput (17kpl) tai varaa yksityinen vuoro!',
    ],
    bookAll: 'Varaa kaikki 17 paikkaa',
    bookPrivate: 'Varaa yksityinen vuoro',
  },
  en: {
    publicIntroTitle: 'Public sauna sessions at Hyvän Tuulen Sauna:',
    publicIntroText: 'Hyvän Tuulen Sauna has been organising public sauna sessions all year round since 2023! At our public sessions, what matters most to us is great saunas, a relaxed atmosphere and friendly service. Two changing rooms, two saunas, two ice holes. It all works, and people love it. Welcome ❤️',
    heroNote: 'Alone, together or with friends',
    heroLocation: 'Puotila · Helsinki · By the sea',
    explore: 'See what is included',
    session: 'per session',
    photoCaption: 'Hot stoves, two hours without rushing',
    pricing: 'Simple pricing',
    pricingIntro: 'Book one visit or get a punch card and come more often!',
    earlyBird: 'Punch cards',
    passTitle: 'More reasons to return.',
    passText: 'Choose five or ten visits and make sauna a regular habit.',
    firstVisit: 'Your first visit',
    finalEyebrow: 'The saunas are hot',
    finalTitle: 'See you at the löyly.',
    back: 'Back to all experiences',
    verticalNote: 'FIRE · SEA · EVERYONE',
    admissionIncluded: 'Sauna, ice hole and guidance included',
    interiorAlt: 'Wood-fired sauna interior with tiered wooden benches and a stove',
    twoHoursLabel: 'Two hours per session',
    winterGalleryAria: 'Winter sauna gallery',
    winterGalleryLabel: 'Winter at Hyvän Tuulen Sauna',
    galleryAlts: [
      'Sauna boat and sauna cabin on the frozen sea at sunset',
      'Friends chatting on the benches of a wood-fired sauna',
      'Snow-covered jetty leading to two saunas on the frozen sea',
      'Woman relaxing on a wooden bench in a warmly lit sauna',
      'Northern lights over the Helsinki waterfront and a person sitting on a SUP board',
      'Woman in a bathrobe beside the frozen sea in winter sunlight',
      'Winter swimmer climbing a metal ladder out of the sea beside the sauna raft',
      'Sunlit wooden sauna benches with a water bucket and ladle',
    ],
    winterSwimmerAlt: 'A winter swimmer climbing a metal ladder out of the sea beside the sauna raft',
    breathingText: 'Breathe slowly. Listen to your body.',
    faqEyebrow: 'Good to know',
    faqTitle: 'Questions before your session',
    faqItems: [
      { question: 'When are public sessions available?', answer: 'Public sessions run throughout the week. See the booking calendar for available times.' },
      { question: 'What should I bring?', answer: 'Bring a towel, swimwear and a water bottle. Weather-appropriate clothing and sandals are useful too.' },
      { question: 'Can I come for my first time?', answer: 'Yes. We guide first-timers through winter swimming, and you can also simply enjoy the sauna.' },
      { question: 'How much does a session cost?', answer: 'A public session costs 15 € / 2 h. Students, pensioners and children under 15 pay 12.50 € / 2 h.' },
      { question: 'Are changing rooms and toilets available?', answer: 'Yes. You also have access to the terrace during your session.' },
    ],
    closingEyebrow: 'Come as you are',
    closingTitle: 'Our public sessions are a great way to enjoy your free time and discover winter swimming.',
    closingParagraphs: [
      'For everyone who loves affordable, high-quality, hot wood-fired saunas. Everyone is welcome, from babies to grandparents. An ice hole, a wood-fired stove and a relaxed atmosphere, just a stone’s throw from central Helsinki.',
      'Guided sessions teach first-timers how to enter the ice hole and control their breathing. It is not rocket science, but it is easier with a little encouragement! Public sessions are social occasions where you can leave your worries on the mainland.',
      'Want the whole place to yourself? Book all 17 available tickets or book a private session!',
    ],
    bookAll: 'Book all 17 places',
    bookPrivate: 'Book a private session',
  },
  es: {
    publicIntroTitle: 'Sesiones públicas de sauna en Hyvän Tuulen Sauna:',
    publicIntroText: 'Hyvän Tuulen Sauna organiza sesiones públicas de sauna durante todo el año desde 2023. En nuestras sesiones públicas, lo más importante para nosotros es ofrecer buenas saunas, un ambiente relajado y un servicio amable. Dos vestuarios, dos saunas y dos agujeros en el hielo. Todo funciona y la gente disfruta. ¡Te damos la bienvenida! ❤️',
    heroNote: 'Solo, en pareja o con amigos',
    heroLocation: 'Puotila · Helsinki · Junto al mar',
    explore: 'Descubre qué incluye la sesión',
    session: 'por sesión',
    photoCaption: 'Estufas calientes y dos horas sin prisas',
    pricing: 'Precios claros',
    pricingIntro: 'Reserva una visita o consigue un bono y ven más a menudo.',
    earlyBird: 'Bonos de sauna',
    passTitle: 'Más motivos para volver.',
    passText: 'Elige cinco o diez visitas y convierte la sauna en un hábito.',
    firstVisit: 'Tu primera visita',
    finalEyebrow: 'Las saunas están calientes',
    finalTitle: 'Nos vemos en la sauna.',
    back: 'Volver a todas las experiencias',
    verticalNote: 'FUEGO · MAR · TODOS',
    admissionIncluded: 'Sauna, baño en el hielo y asesoramiento incluidos',
    interiorAlt: 'Interior de una sauna de leña con bancos de madera a distintos niveles y estufa',
    twoHoursLabel: 'Dos horas por sesión',
    winterGalleryAria: 'Galería de sauna en invierno',
    winterGalleryLabel: 'Invierno en Hyvän Tuulen Sauna',
    galleryAlts: [
      'Barco sauna y cabaña de sauna sobre el mar helado al atardecer',
      'Amigos conversando en los bancos de una sauna de leña',
      'Muelle nevado que conduce a dos saunas sobre el mar helado',
      'Mujer relajándose en un banco de madera de una sauna con luz cálida',
      'Auroras boreales sobre la costa de Helsinki, con una persona sentada en una tabla de paddle surf',
      'Mujer con albornoz junto al mar helado bajo la luz del sol invernal',
      'Una persona sube del mar por una escalera metálica junto a la sauna flotante',
      'Bancos de madera iluminados por el sol, con un cubo de agua y un cazo',
    ],
    winterSwimmerAlt: 'Una persona sube del mar por una escalera metálica junto a la sauna flotante',
    breathingText: 'Respira despacio. Escucha a tu cuerpo.',
    faqEyebrow: 'Información útil',
    faqTitle: 'Preguntas antes de tu sesión',
    faqItems: [
      { question: '¿Cuándo hay sesiones públicas?', answer: 'Las sesiones públicas se organizan durante toda la semana. Consulta el calendario de reservas para ver los horarios disponibles.' },
      { question: '¿Qué debo llevar?', answer: 'Trae una toalla, bañador y una botella de agua. También conviene llevar ropa adecuada para el clima y sandalias.' },
      { question: '¿Puedo venir por primera vez?', answer: 'Sí. Guiamos a quienes se inician en la natación invernal; también puedes limitarte a disfrutar de la sauna.' },
      { question: '¿Cuánto cuesta una sesión?', answer: 'Una sesión pública cuesta 15 € / 2 h. Los estudiantes, jubilados y menores de 15 años pagan 12,50 € / 2 h.' },
      { question: '¿Hay vestuarios y aseos?', answer: 'Sí. También puedes usar la terraza durante la sesión.' },
    ],
    closingEyebrow: 'Ven como eres',
    closingTitle: 'Nuestras sesiones públicas son una forma estupenda de disfrutar del tiempo libre y descubrir la natación invernal.',
    closingParagraphs: [
      'Para quienes aman las saunas de leña asequibles, de alta calidad y bien calientes. Todos son bienvenidos, desde bebés hasta abuelos. Un agujero en el hielo, una estufa de leña y un ambiente relajado, a un paso del centro de Helsinki.',
      'En las sesiones guiadas, enseñamos a los principiantes a entrar en el agua helada y a controlar la respiración. No es ciencia espacial, ¡pero resulta más fácil con un poco de ánimo! Las sesiones públicas son encuentros sociales en los que puedes dejar tus preocupaciones en tierra firme.',
      '¿Quieres todo el lugar para ti? Reserva las 17 entradas disponibles o una sesión privada.',
    ],
    bookAll: 'Reserva las 17 plazas',
    bookPrivate: 'Reserva una sesión privada',
  },
  fr: {
    publicIntroTitle: 'Séances publiques de sauna à Hyvän Tuulen Sauna :',
    publicIntroText: 'Hyvän Tuulen Sauna organise des séances publiques de sauna toute l’année depuis 2023 ! Lors de nos séances publiques, l’essentiel pour nous est de proposer de bons saunas, une ambiance détendue et un accueil chaleureux. Deux vestiaires, deux saunas, deux trous dans la glace. Tout fonctionne et les gens s’y plaisent. Bienvenue ❤️',
    heroNote: 'Seul, à deux ou entre amis',
    heroLocation: 'Puotila · Helsinki · Au bord de la mer',
    explore: 'Découvrir ce que comprend la séance',
    session: 'par séance',
    photoCaption: 'Poêles bien chauds, deux heures sans se presser',
    pricing: 'Tarifs simples',
    pricingIntro: 'Réservez une visite ou choisissez une carte multi-entrées pour venir plus souvent !',
    earlyBird: 'Cartes multi-entrées',
    passTitle: 'Encore plus de raisons de revenir.',
    passText: 'Choisissez cinq ou dix visites et faites du sauna une habitude.',
    firstVisit: 'Votre première visite',
    finalEyebrow: 'Les saunas sont chauds',
    finalTitle: 'À bientôt au sauna.',
    back: 'Retour à toutes les expériences',
    verticalNote: 'FEU · MER · TOUS',
    admissionIncluded: 'Sauna, bain glacé et accompagnement inclus',
    interiorAlt: 'Intérieur d’un sauna au bois avec des bancs à plusieurs niveaux et un poêle',
    twoHoursLabel: 'Deux heures par séance',
    winterGalleryAria: 'Galerie du sauna en hiver',
    winterGalleryLabel: 'L’hiver à Hyvän Tuulen Sauna',
    galleryAlts: [
      'Bateau-sauna et cabine de sauna sur la mer gelée au coucher du soleil',
      'Des amis discutent sur les bancs d’un sauna au bois',
      'Ponton enneigé menant à deux saunas sur la mer gelée',
      'Une femme se détend sur un banc en bois dans un sauna à l’éclairage chaleureux',
      'Aurores boréales au-dessus du front de mer d’Helsinki, avec une personne assise sur une planche de paddle',
      'Une femme en peignoir au bord de la mer gelée, dans la lumière hivernale',
      'Une personne remonte de la mer par une échelle métallique, à côté du sauna flottant',
      'Bancs en bois éclairés par le soleil, avec un seau d’eau et une louche',
    ],
    winterSwimmerAlt: 'Une personne remonte de la mer par une échelle métallique, à côté du sauna flottant',
    breathingText: 'Respirez lentement. Écoutez votre corps.',
    faqEyebrow: 'Bon à savoir',
    faqTitle: 'Questions avant votre séance',
    faqItems: [
      { question: 'Quand ont lieu les séances publiques ?', answer: 'Les séances publiques ont lieu tout au long de la semaine. Consultez le calendrier de réservation pour voir les horaires disponibles.' },
      { question: 'Que dois-je apporter ?', answer: 'Apportez une serviette, un maillot de bain et une gourde. Prévoyez aussi des vêtements adaptés à la météo et des sandales.' },
      { question: 'Puis-je venir pour la première fois ?', answer: 'Oui. Nous accompagnons les débutants pour leur premier bain glacé, et vous pouvez aussi simplement profiter du sauna.' },
      { question: 'Combien coûte une séance ?', answer: 'Une séance publique coûte 15 € / 2 h. Les étudiants, les retraités et les moins de 15 ans paient 12,50 € / 2 h.' },
      { question: 'Y a-t-il des vestiaires et des toilettes ?', answer: 'Oui. Vous avez également accès à la terrasse pendant votre séance.' },
    ],
    closingEyebrow: 'Venez comme vous êtes',
    closingTitle: 'Nos séances publiques sont idéales pour profiter de votre temps libre et découvrir la baignade en eau glacée.',
    closingParagraphs: [
      'Pour celles et ceux qui aiment les saunas à bois abordables, de qualité et bien chauds. Tout le monde est le bienvenu, des bébés aux grands-parents. Un trou dans la glace, un poêle à bois et une atmosphère détendue, à deux pas du centre d’Helsinki.',
      'Lors des séances accompagnées, nous apprenons aux débutants à entrer dans l’eau glacée et à contrôler leur respiration. Rien de bien compliqué, mais c’est plus facile avec un peu d’encouragement ! Les séances publiques sont des moments conviviaux où vous pouvez laisser vos soucis sur la terre ferme.',
      'Envie de privatiser les lieux ? Réservez les 17 billets disponibles ou une séance privée !',
    ],
    bookAll: 'Réserver les 17 places',
    bookPrivate: 'Réserver une séance privée',
  },
  de: {
    publicIntroTitle: 'Öffentliche Saunazeiten bei Hyvän Tuulen Sauna:',
    publicIntroText: 'Hyvän Tuulen Sauna veranstaltet seit 2023 das ganze Jahr über öffentliche Saunazeiten! Bei unseren öffentlichen Saunazeiten sind uns gute Saunen, eine entspannte Atmosphäre und freundlicher Service am wichtigsten. Zwei Umkleiden, zwei Saunen, zwei Eislöcher. Alles funktioniert und die Menschen genießen es. Willkommen ❤️',
    heroNote: 'Allein, zu zweit oder mit Freunden',
    heroLocation: 'Puotila · Helsinki · Am Meer',
    explore: 'Entdecke, was im Termin enthalten ist',
    session: 'pro Session',
    photoCaption: 'Heiße Öfen, zwei Stunden ohne Eile',
    pricing: 'Einfache Preise',
    pricingIntro: 'Buche einen Besuch oder hol dir eine Mehrfachkarte und komm öfter vorbei!',
    earlyBird: 'Mehrfachkarten',
    passTitle: 'Mehr Gründe, wiederzukommen.',
    passText: 'Wähle fünf oder zehn Besuche und mach die Sauna zu deiner Gewohnheit.',
    firstVisit: 'Dein erster Besuch',
    finalEyebrow: 'Die Saunen sind heiß',
    finalTitle: 'Bis bald in der Sauna.',
    back: 'Zurück zu allen Erlebnissen',
    verticalNote: 'FEUER · MEER · ALLE',
    admissionIncluded: 'Sauna, Eisbad und Anleitung inklusive',
    interiorAlt: 'Innenraum einer holzbeheizten Sauna mit mehrstufigen Holzbänken und Ofen',
    twoHoursLabel: 'Zwei Stunden pro Session',
    winterGalleryAria: 'Winterliche Saunagalerie',
    winterGalleryLabel: 'Winter bei Hyvän Tuulen Sauna',
    galleryAlts: [
      'Saunaboot und Saunahütte auf dem zugefrorenen Meer bei Sonnenuntergang',
      'Freunde unterhalten sich auf den Bänken einer holzbeheizten Sauna',
      'Verschneiter Steg, der zu zwei Saunen auf dem zugefrorenen Meer führt',
      'Eine Frau entspannt auf einer Holzbank in einer warm beleuchteten Sauna',
      'Nordlichter über der Küste von Helsinki und eine Person, die auf einem SUP-Board sitzt',
      'Frau im Bademantel am zugefrorenen Meer im winterlichen Sonnenlicht',
      'Ein Winterschwimmer steigt über eine Metallleiter neben der Saunaplattform aus dem Meer',
      'Sonnenbeschienene Holzbänke in der Sauna mit Wassereimer und Kelle',
    ],
    winterSwimmerAlt: 'Ein Winterschwimmer steigt über eine Metallleiter neben der Saunaplattform aus dem Meer',
    breathingText: 'Atme langsam. Hör auf deinen Körper.',
    faqEyebrow: 'Gut zu wissen',
    faqTitle: 'Fragen vor deiner Session',
    faqItems: [
      { question: 'Wann finden öffentliche Sessions statt?', answer: 'Öffentliche Sessions finden die ganze Woche über statt. Die verfügbaren Termine findest du im Buchungskalender.' },
      { question: 'Was sollte ich mitbringen?', answer: 'Bring ein Handtuch, Badekleidung und eine Trinkflasche mit. Außerdem sind wettergerechte Kleidung und Sandalen praktisch.' },
      { question: 'Kann ich zum ersten Mal kommen?', answer: 'Ja. Wir begleiten Anfänger beim Winterschwimmen; du kannst aber auch einfach nur die Sauna genießen.' },
      { question: 'Wie viel kostet eine Session?', answer: 'Eine öffentliche Session kostet 15 € / 2 h. Studierende, Rentner und Kinder unter 15 Jahren zahlen 12,50 € / 2 h.' },
      { question: 'Gibt es Umkleiden und Toiletten?', answer: 'Ja. Während deiner Session kannst du auch die Terrasse nutzen.' },
    ],
    closingEyebrow: 'Komm, wie du bist',
    closingTitle: 'Unsere öffentlichen Sessions sind ideal, um deine Freizeit zu genießen und das Winterschwimmen kennenzulernen.',
    closingParagraphs: [
      'Für alle, die preiswerte, hochwertige und richtig heiße Holzsaunen lieben. Bei uns ist jede Generation willkommen, vom Baby bis zu den Großeltern. Eisloch, Holzofen und eine entspannte Atmosphäre, nur einen Steinwurf vom Zentrum Helsinkis entfernt.',
      'In den geführten Sessions zeigen wir Anfängern, wie sie ins Eisloch steigen und ihre Atmung kontrollieren. Das ist keine Raketenwissenschaft, aber mit ein bisschen Ermutigung geht es leichter! Öffentliche Sessions sind gesellige Treffen, bei denen du deine Sorgen am Festland lassen kannst.',
      'Möchtest du den ganzen Ort für dich? Buche alle 17 verfügbaren Tickets oder eine private Session!',
    ],
    bookAll: 'Alle 17 Plätze buchen',
    bookPrivate: 'Private Session buchen',
  },
};

export default function VibeJulkinenSaunaContent({ data, locale }: { data: VibePageData; locale: Locale }) {
  const copy = copyByLocale[locale];
  const sessionPrices = data.prices?.slice(0, 2) ?? [];
  const admission = sessionPrices[0];
  const visitSteps = data.timeline ?? [];
  const bookingHref = '#varaus';
  const privateSessionHref = getVibeBookingRoute('avanto', locale);
  const homeHref = getVibeRoute('home', locale);

  return (
    <main id="main-content" className="vibe-julkinen-sauna-page">
      <section className="vibe-julkinen-sauna-hero" aria-labelledby="vibe-julkinen-sauna-title">
        <VibeHeroBackdrop />
        <div className="vibe-julkinen-sauna-hero-copy">
          <p className="vibe-julkinen-sauna-eyebrow">{data.eyebrow}</p>
          <h1 id="vibe-julkinen-sauna-title">{data.heroTitle}</h1>
          <p className="vibe-julkinen-sauna-hero-note">{copy.heroNote}</p>
          <p className="vibe-julkinen-sauna-hero-text">{data.heroText}</p>
          <div className="vibe-julkinen-sauna-hero-actions">
            <Link className="vibe-julkinen-sauna-book" href={bookingHref}>
              {data.ctaLabel}<ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link className="vibe-julkinen-sauna-explore" href="#sisalto">
              {copy.explore}<ArrowDown size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="vibe-julkinen-sauna-location">{copy.heroLocation}</p>
        </div>

        <div className="vibe-julkinen-sauna-hero-visual">
          <div className="vibe-julkinen-sauna-hero-photo">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
          </div>
          <span className="vibe-julkinen-sauna-vertical-note" aria-hidden="true">
            {copy.verticalNote}
          </span>
          {admission && (
            <div className="vibe-julkinen-sauna-admission">
              <span>{admission.label}</span>
              <strong>{admission.price}</strong>
              <small>{copy.admissionIncluded}</small>
            </div>
          )}
        </div>
      </section>

      <section className="vibe-julkinen-sauna-public-intro" aria-labelledby="vibe-julkinen-sauna-public-intro-title">
        <h2 id="vibe-julkinen-sauna-public-intro-title">{copy.publicIntroTitle}</h2>
        <p>{copy.publicIntroText}</p>
      </section>


      <section className="vibe-julkinen-sauna-winter-gallery" aria-label={copy.winterGalleryAria}>
        <VibeWinterGallery
          label={copy.winterGalleryLabel}
          locale={locale}
          images={[
            { src: '/images/gallery-winter-sunset.webp', alt: copy.galleryAlts[0] },
            { src: '/images/gallery-sauna-group.webp', alt: copy.galleryAlts[1] },
            { src: '/images/gallery-winter-dock.webp', alt: copy.galleryAlts[2] },
            { src: '/images/gallery-sauna-woman.webp', alt: copy.galleryAlts[3] },
            { src: '/images/vibe-aurora-final.webp', alt: copy.galleryAlts[4] },
            { src: '/images/gallery-avanto-woman.webp', alt: copy.galleryAlts[5] },
            { src: '/images/gallery-ice-swimming.webp', alt: copy.galleryAlts[6] },
            { src: '/images/gallery-sauna-bench.webp', alt: copy.galleryAlts[7] },
          ]}
        />
      </section>

      <VibeBookingFrame kind="public" locale={locale} />

      <section className="vibe-julkinen-sauna-pricing" aria-labelledby="vibe-julkinen-sauna-pricing-title">
        <div className="vibe-julkinen-sauna-pricing-inner">
          <div className="vibe-julkinen-sauna-pricing-heading">
            <div>
              <p className="vibe-julkinen-sauna-eyebrow">{copy.pricing}</p>
              <h2 id="vibe-julkinen-sauna-pricing-title">{data.priceTitle}</h2>
            </div>
            <p>{copy.pricingIntro}</p>
          </div>

          <dl className="vibe-julkinen-sauna-session-prices">
            {sessionPrices.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd className="vibe-julkinen-sauna-session-price">{row.price}</dd>
                <dd>{row.note}</dd>
              </div>
            ))}
          </dl>

          <div id="sarjakortit" className="vibe-julkinen-sauna-passes">
            <div className="vibe-julkinen-sauna-passes-intro">
              <p>{copy.earlyBird}</p>
              <h3>{copy.passTitle}</h3>
              <span>{copy.passText}</span>
            </div>
            <div className="vibe-julkinen-sauna-purchase">
              <SubscriptionPurchase locale={locale} />
            </div>
          </div>

          {data.priceNote && <p className="vibe-julkinen-sauna-price-note">{data.priceNote}</p>}
        </div>
      </section>

      <section className="vibe-julkinen-sauna-visit" aria-labelledby="vibe-julkinen-sauna-visit-title">
        <div className="vibe-julkinen-sauna-visit-copy">
          <p className="vibe-julkinen-sauna-eyebrow">{copy.firstVisit}</p>
          <h2 id="vibe-julkinen-sauna-visit-title">{data.timelineTitle}</h2>
          <ol>
            {visitSteps.map((step) => (
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
        <div className="vibe-julkinen-sauna-visit-photo">
          <Image
            src="/images/gallery-ice-swimming.webp"
            alt={copy.winterSwimmerAlt}
            fill
            sizes="(max-width: 760px) calc(100vw - 44px), 44vw"
          />
          <p>{copy.breathingText}</p>
        </div>
      </section>


      <section className="vibe-faq-section" aria-labelledby="vibe-julkinen-sauna-faq-title">
        <div className="vibe-faq-heading">
          <p className="vibe-eyebrow">{copy.faqEyebrow}</p>
          <h2 id="vibe-julkinen-sauna-faq-title">{copy.faqTitle}</h2>
        </div>
        <VibeFaq items={copy.faqItems} />
      </section>

      <VibeClosingSummary
        eyebrow={copy.closingEyebrow}
        title={copy.closingTitle}
        paragraphs={copy.closingParagraphs}
        links={[
          { href: bookingHref, label: copy.bookAll },
          { href: privateSessionHref, label: copy.bookPrivate },
        ]}
      />

      <section className="vibe-julkinen-sauna-next" aria-labelledby="vibe-julkinen-sauna-next-title">
        <p className="vibe-julkinen-sauna-eyebrow">{copy.finalEyebrow}</p>
        <h2 id="vibe-julkinen-sauna-next-title">{copy.finalTitle}</h2>
        <p className="vibe-julkinen-sauna-next-text">{data.heroText}</p>
        <Link className="vibe-julkinen-sauna-next-main" href={bookingHref}>
          <span>{data.ctaLabel}</span>
          <ArrowUpRight size={38} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <Link className="vibe-julkinen-sauna-back" href={homeHref}>
          {copy.back}<ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
