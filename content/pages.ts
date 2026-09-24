import { HeroContent } from '@/types';

export type Locale = 'fi' | 'en';

const isEn = (locale: Locale) => locale === 'en';

export const getSummerPageHero = (locale: Locale): HeroContent => isEn(locale) ? {
  title: 'Sauna boat in Helsinki',
  subtitle: 'Sauna boat cruises and private sauna in the Eastern Helsinki archipelago',
  description: 'Sauna boat cruises and private sauna experiences in Helsinki. Two unique sauna boats, Aalto and Virta, offer a private sauna space, sea views and the chance to enjoy Helsinki in a whole new way. Departing from Kalkkihiekantori near Vuosaari.',
  ctaText: 'Book a sauna boat',
  ctaHref: '#boats',
  image: '/images/aalto-01.webp',
  images: [
    '/images/aalto-01.webp',
    '/images/virta-01.webp',
    '/images/gallery-sauna-woman.webp',
    '/images/seasauna.webp',
    '/images/SAUNAHELSINKI.webp',
  ],
} : {
  title: 'Saunalautta Helsingissä',
  subtitle: 'Saunalauttaristeilyjä ja yksityistä saunomista Itä-Helsingin saaristossa',
  description: 'Kaksi ainutlaatuista saunalauttaa, Aalto ja Virta, tarjoavat yksityisen saunatilan, merelliset maisemat ja mahdollisuuden nauttia Helsingistä aivan uudella tavalla. Kalkkihiekantorilta Vuosaaren läheltä.',
  ctaText: 'Varaa saunalautta',
  ctaHref: '#boats',
  image: '/images/aalto-01.webp',
  images: [
    '/images/aalto-01.webp',
    '/images/virta-01.webp',
    '/images/gallery-sauna-woman.webp',
    '/images/seasauna.webp',
    '/images/SAUNAHELSINKI.webp',
  ],
};

export const summerPageHero = getSummerPageHero('fi');

export const getPrivatePageHero = (locale: Locale): HeroContent => isEn(locale) ? {
  title: 'Events and Private Sauna | Helsinki',
  subtitle: 'Events',
  description: 'From sauna rituals to quick private sessions – changing events by the sea.',
  ctaText: 'See Events',
  ctaHref: '#events',
  image: '/images/gallery-sauna-steam.webp',
} : {
  title: 'Hyvän Tuulen Saunan tapahtumat',
  subtitle: 'Tapahtumat',
  description: 'vaihtuvia tapahtumia saunarituaaleista nopeisiin yksityisiin vuoroihin',
  ctaText: 'Katso tapahtumat',
  ctaHref: '#tapahtumat',
  image: '/images/gallery-sauna-steam.webp',
};

export const privatePageHero = getPrivatePageHero('fi');

export const getPublicPageHero = (locale: Locale): HeroContent => isEn(locale) ? {
  title: 'Public Sauna in Helsinki | Sauna Session by the Sea',
  subtitle: 'Helsinki\'s Most Unique Sauna Session on a Sauna Boat',
  description: 'Eight years of experience with sauna boats, prime löyly and great vibes. We guarantee hot saunas here.',
  ctaText: 'Book Your Spot',
  ctaHref: '#booking',
  image: '/images/public-sauna-hero.webp',
} : {
  title: 'Julkinen saunavuoro Hyvän Tuulen Saunalla Helsingissä',
  subtitle: 'Helsingin uniikein saunavuoro Saunalautalla',
  description: '8 Vuoden kokemuksella saunalauttoja, priimaa löylyä ja hyvää tunnelmaa. Näistä pidämme kiinni, kuumat saunat ovat täällä taattuja.',
  ctaText: 'Varaa paikkasi',
  ctaHref: '#varaus',
  image: '/images/public-sauna-hero.webp',
};

export const publicPageHero = getPublicPageHero('fi');

export const getLocationPageHero = (locale: Locale): HeroContent => isEn(locale) ? {
  title: 'Location',
  subtitle: 'Come Visit Us',
  description: 'We are easily accessible at Kalkkihiekantori in Aurinkolahti. Welcome to enjoy a sauna experience by the sea.',
  ctaText: 'See Route',
  ctaHref: '#map',
  image: '/images/gallery-sea-view.webp',
} : {
  title: 'Sijainti',
  subtitle: 'Tule käymään',
  description: 'Olemme helposti saavutettavissa Kalkkihiekantorilla Aurinkolahdessa. Tervetuloa nauttimaan saunaelämyksestä meren äärellä.',
  ctaText: 'Katso reitti',
  ctaHref: '#kartta',
  image: '/images/gallery-sea-view.webp',
};

export const locationPageHero = getLocationPageHero('fi');

export const getGalleryPageHero = (locale: Locale): HeroContent => isEn(locale) ? {
  title: 'Gallery',
  subtitle: 'Moments',
  description: 'Take a peek at our sauna experiences through pictures. Summer sunsets, winter ice swimming and everything in between.',
  ctaText: 'Explore Services',
  ctaHref: '/saunalauttaristeilyt-helsingissa',
  image: '/images/gallery-raft-sunset.webp',
} : {
  title: 'Galleria',
  subtitle: 'Tunnelmia',
  description: 'Kurkista saunaelämyksiimme kuvien välityksellä. Kesän auringonlaskut, talven avantouinnit ja kaikki siltä väliltä.',
  ctaText: 'Tutustu palveluihin',
  ctaHref: '/saunalauttaristeilyt-helsingissa',
  image: '/images/gallery-raft-sunset.webp',
};

export const galleryPageHero = getGalleryPageHero('fi');

export const thankYouPageContent = {
  fi: {
    title: 'Kiitos varauksestasi!',
    description: 'Olemme vastaanottaneet varauskyselysi. Vahvistamme varauksen sähköpostitse 24 tunnin sisällä.',
    nextSteps: [
      'Tarkista sähköpostisi (myös roskaposti) varausvahvistusta varten',
      'Tule paikalle vähintään 5 minuuttia ennen varattua aikaa',
    ],
    contact: {
      title: 'Kysyttävää?',
      description: 'Ota yhteyttä, autamme mielellämme.',
      phone: '+358 44 231 3546',
      email: 'info@hyvantuulensauna.fi',
    },
  },
  en: {
    title: 'Thank You for Your Booking!',
    description: 'We have received your booking request. We will confirm your booking by email within 24 hours.',
    nextSteps: [
      'Check your email (including spam) for the booking confirmation',
      'Arrive at least 5 minutes before your scheduled time',
    ],
    contact: {
      title: 'Questions?',
      description: 'Contact us, we are happy to help.',
      phone: '+358 44 231 3546',
      email: 'info@hyvantuulensauna.fi',
    },
  },
};

export const getSummerIntroContent = (locale: Locale) => isEn(locale) ? {
  title: 'Sauna space in Helsinki – your own sauna by the sea',
  text: `The sauna boat of Hyvän Tuulen Sauna is a private sauna space in Helsinki when you want to spend time with your own group. On the sauna boat, a warm wood-fired sauna, sea views, lounge areas and the possibility to jump straight into the sea come together.

A sauna boat is perfect for parties, bachelor parties, birthdays, corporate events, team days and relaxed time together. When the whole sauna boat is reserved for your group, you can sauna and spend time in your own peace.

The sauna space is located in the Eastern Helsinki archipelago, just a stone's throw from Helsinki city centre. Here the sauna is not just a space, but part of a maritime experience.

Looking for a sauna space in Helsinki? Get to know Aalto and Virta and choose the right sauna boat for your group.`,
} : {
  title: 'Saunatila Helsingissä – oma sauna merellä',
  text: `Hyvän Tuulen Saunan saunalautta on yksityinen saunatila Helsingissä, kun haluat viettää aikaa oman porukan kesken. Saunalautalla yhdistyvät lämmin puusauna, merelliset maisemat, oleskelutilat ja mahdollisuus pulahtaa suoraan mereen.

Saunalautta sopii erinomaisesti juhliin, polttareihin, synttäreille, yritystilaisuuksiin, tyky-päiviin ja rentoon yhdessäoloon. Kun koko saunalautta on varattu omalle seurueelle, saatte saunoa ja viettää aikaa omassa rauhassa.

Saunatila sijaitsee Itä-Helsingin saaristossa, vain kivenheiton päässä Helsingin keskustasta. Täällä sauna ei ole vain tila, vaan osa merellistä elämystä.

Etsitkö saunatilaa Helsingistä? Tutustu Aaltoon ja Virtaan ja valitse teidän porukallenne sopiva saunalautta.`,
};

export const summerIntroContent = getSummerIntroContent('fi');

export const getWhyChooseContent = (locale: Locale) => isEn(locale) ? {
  title: 'Why choose the Hyvän Tuulen Sauna sauna boat?',
  text: `Authentic sauna experience — Traditional wood-fired sauna in a genuine maritime environment.

Private sauna space — The whole sauna boat is at your group's disposal for the duration of the booking.

Eastern Helsinki archipelago — The sauna experience is combined with Helsinki's sea views and archipelago.

Space to celebrate and spend time — Aalto and Virta offer options for both small and larger groups.

Grilling and catering — The deck can be combined with grilling and various catering services.

Eight years of experience — The Hyvän Tuulen Sauna team has offered sauna boat experiences in Helsinki since 2018.`,
} : {
  title: 'Miksi valita Hyvän Tuulen Saunan saunalautta?',
  text: `Aito saunakokemus — Perinteinen puulämmitteinen sauna aidossa merellisessä ympäristössä.

Yksityinen saunatila — Koko saunalautta on oman porukkasi käytössä varauksen ajan.

Itä-Helsingin saaristo — Saunaelämys yhdistyy Helsingin merimaisemiin ja saaristoon.

Tilaa juhlia ja viettää aikaa — Aalto ja Virta tarjoavat vaihtoehdon sekä pienille että suuremmille seurueille.

Grillaus ja catering — Kannelle voi yhdistää grillauksen ja erilaisia catering-palveluita.

Kahdeksan vuotta kokemusta — Hyvän Tuulen Saunan tiimi on tarjonnut saunalauttaelämyksiä Helsingissä vuodesta 2018.`,
};

export const whyChooseContent = getWhyChooseContent('fi');

export const getArchipelagoContent = (locale: Locale) => isEn(locale) ? {
  title: 'Discover the Eastern Helsinki archipelago',
  text: `A sauna boat takes you to the heart of the Eastern Helsinki archipelago. The journey begins at Kalkkihiekantori, and during the cruise you can enjoy the sea and changing scenery from the sauna benches or the terrace.

With Virta we explore the nearby Eastern Helsinki archipelago, and on Aalto we can combine sauna with a boat ride. On a sauna boat, the maritime environment is part of the whole experience – sauna, sea and togetherness in one package.`,
} : {
  title: 'Tutustu Itä-Helsingin saaristoon',
  text: `Saunalautta vie sinut keskelle Itä-Helsingin saaristoa. Matka alkaa Kalkkihiekantorilta, ja risteilyn aikana pääset nauttimaan merestä ja vaihtuvista maisemista saunan lauteilta tai terassilta.

Virran kanssa tutustumme Itä-Helsingin lähisaaristoon ja Aallolla voimme yhdistää saunomiseen myös veneajelua. Saunalautalla merellinen ympäristö on osa koko kokemusta – sauna, meri ja yhdessäolo samassa paketissa.`,
};

export const archipelagoContent = getArchipelagoContent('fi');

export const getCruiseExperienceContent = (locale: Locale) => isEn(locale) ? {
  title: 'Sauna boat cruise in Helsinki',
  text: `A sauna boat cruise combines a sauna experience and a maritime experience in a way that an ordinary sauna space cannot. Between löyly sessions you can enjoy the Helsinki archipelago, changing scenery and the sea.

With Virta we explore the nearby Eastern Helsinki archipelago, and on Aalto we can combine sauna with a boat ride.

The sauna boat cruise departs from Kalkkihiekantori in the Vuosaari area, and the content of the cruise is determined by the day, weather and chosen sauna boat.`,
} : {
  title: 'Saunalauttaristeily Helsingissä',
  text: `Saunalauttaristeily yhdistää saunomisen ja merellisen elämyksen tavalla, johon tavallinen saunatila ei pysty. Löylyjen lomassa pääset nauttimaan Helsingin saaristosta, vaihtuvista maisemista ja merestä.

Virran kanssa tutustumme Itä-Helsingin lähisaaristoon ja Aallolla voimme yhdistää saunomiseen myös veneajelua.

Saunalauttaristeily lähtee Kalkkihiekantorilta Vuosaaren alueelta, ja risteilyn sisältö määräytyy päivän, kelin ja valitun saunalautan mukaan.`,
};

export const cruiseExperienceContent = getCruiseExperienceContent('fi');

export const getRentalContent = (locale: Locale) => isEn(locale) ? {
  title: 'Sauna boat rental in Helsinki',
  text: `When you rent a sauna boat, the whole space is at your group's disposal. You can sauna, relax, grill, dine and enjoy the sea with your own group.

Sauna boat rental is suitable for:

Bachelor parties
Birthdays
Team and recreation days
Corporate events
Friend groups
Families
Parties and evenings out

A sauna boat can be booked for a minimum of two hours, and for a larger group you can book both boats. Together, Aalto and Virta enable an experience for up to 25 people.`,
} : {
  title: 'Saunalautan vuokraus Helsingissä',
  text: `Kun varaat saunalautan, koko tila on teidän käytössänne. Voitte saunoa, oleskella, grillata, ruokailla ja nauttia merestä oman porukan kesken.

Saunalautan vuokraus sopii esimerkiksi:

Polttareihin
Syntymäpäiville
Tyky- ja virkistyspäiviin
Yritystilaisuuksiin
Kaveriporukoille
Perheille
Juhliin ja illanviettoihin

Saunalautan voi varata vähintään kahdeksi tunniksi, ja suuremmalle seurueelle voidaan varata molemmat lautat. Yhdessä Aalto ja Virta mahdollistavat jopa 25 hengen kokonaisuuden.`,
};

export const rentalContent = getRentalContent('fi');

export const getOccasionContent = (locale: Locale) => isEn(locale) ? {
  title: 'Sauna boat for bachelor parties, parties and team days',
  text: `A sauna boat offers a ready-made environment for shared activities and relaxed togetherness. A whole event can be built around the sauna, or you can combine it with dining, grilling, swimming or a boat ride.

For bachelor parties, a sauna boat serves as a private and experiential base for the whole group. For companies and team days, it offers the chance to spend time with colleagues in a completely different environment.

One space, your own group and the Helsinki archipelago around you.`,
} : {
  title: 'Saunalautta polttareihin, juhliin ja tyky-päivään',
  text: `Saunalautta tarjoaa valmiin ympäristön yhteiseen tekemiseen ja rentoon yhdessäoloon. Saunomisen ympärille voi rakentaa koko tilaisuuden tai yhdistää siihen esimerkiksi ruokailun, grillauksen, uimisen tai veneajelun.

Polttareissa saunalautta toimii yksityisenä ja elämyksellisenä tukikohtana koko porukalle. Yrityksille ja tyky-päivään se tarjoaa mahdollisuuden viettää työporukan kanssa aikaa aivan erilaisessa ympäristössä.

Yksi tila, oma porukka ja Helsingin saaristo ympärillä.`,
};

export const occasionContent = getOccasionContent('fi');

export const getIncludedContent = (locale: Locale) => isEn(locale) ? {
  title: 'What is included in the sauna boat price?',
  text: `Sauna boat rental includes basic equipment so you can enjoy the day without unnecessary fuss.

Wood-fired sauna
Captain
Toilet
Weber grill
Ice for drinks
Sound system

Own food and drinks are welcome. In addition, various additional services and catering solutions are available.`,
} : {
  title: 'Mitä saunalautan hintaan kuuluu?',
  text: `Saunalautan vuokraukseen kuuluu perusvarustelu, jolla pääsette nauttimaan päivästä ilman turhaa säätämistä.

Puulämmitteinen sauna
Kapteeni
WC
Weber-grilli
Jäät juomille
Musiikkijärjestelmä

Omat eväät ja juomat ovat tervetulleita. Lisäksi saatavilla on erilaisia lisäpalveluita ja catering-ratkaisuja.`,
};

export const includedContent = getIncludedContent('fi');

export const getReadyToBookContent = (locale: Locale) => isEn(locale) ? {
  title: 'Ready to book a sauna boat in Helsinki?',
  text: `Choose Aalto or Virta and open the booking window. Minimum booking 2 hours. For a larger group you can book both sauna boats.

Want to pay later or ask about a group booking? Contact us by phone, WhatsApp or email.`,
} : {
  title: 'Valmis varaamaan saunalautan Helsingissä?',
  text: `Valitse Aalto tai Virta ja avaa varausikkuna. Minimivaraus 2 tuntia. Suuremmalle porukalle voit varata molemmat saunalautat.

Haluatko maksaa myöhemmin tai kysyä ryhmävarauksesta? Tiedustele saatavuutta puhelimitse, WhatsAppilla tai sähköpostilla.`,
};

export const readyToBookContent = getReadyToBookContent('fi');

export const getUseCases = (locale: Locale) => isEn(locale) ? [
  {
    id: 'company',
    title: 'Corporate Events',
    description: 'Get in the mood for a team day or celebrate the season\'s achievements. We offer perfect settings for corporate events, from catering to program.',
    image: '/images/gallery-deck-view.webp',
  },
  {
    id: 'celebration',
    title: 'Parties and Milestones',
    description: 'Birthdays, bachelor parties, graduations – any celebration is crowned with a maritime sauna experience.',
    image: '/images/gallery-bbq.webp',
  },
  {
    id: 'relax',
    title: 'Relaxing with Friends',
    description: 'Gather your friends and enjoy a shared sauna day. Grill hot, sauna warm and the sea calls.',
    image: '/images/gallery-deck-chairs.webp',
  },
] : [
  {
    id: 'company',
    title: 'Yritystilaisuudet',
    description: 'Virittäydy tiimipäivään tai juhlista kauden saavutuksia. Tarjoamme täydelliset puitteet yritystapahtumille, aina cateringista ohjelmaan.',
    image: '/images/gallery-deck-view.webp',
  },
  {
    id: 'celebration',
    title: 'Juhlat ja merkkipäivät',
    description: 'Syntymäpäivät, polttarit, valmistujaiset – mikä tahansa juhla kruunataan merellisellä saunaelämyksellä.',
    image: '/images/gallery-bbq.webp',
  },
  {
    id: 'relax',
    title: 'Rentoutumista ystävien kanssa',
    description: 'Kokoa ystäväpiiri ja nauti yhteisestä saunapäivästä. Grilli kuumana, sauna lämpimänä ja meri kutsuu.',
    image: '/images/gallery-deck-chairs.webp',
  },
];

export const useCases = getUseCases('fi');

export const getIncludedFeatures = (locale: Locale) => isEn(locale) ? [
  'Wood-fired sauna',
  'Towels',
  'Sauna drinks',
  'Grilling possibility',
  'Toilet facilities',
  'Life jackets',
  'Guidance to sauna',
  'Insurance',
] : [
  'Puulämmitteinen sauna',
  'Pyyhkeet',
  'Saunajuomat',
  'Grillausmahdollisuus',
  'WC-tilat',
  'Pelastusliivit',
  'Opastus saunomiseen',
  'Vakuutus',
];

export const includedFeatures = getIncludedFeatures('fi');
