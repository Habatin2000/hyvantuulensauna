import { HeroContent } from '@/types';

export type Locale = 'fi' | 'en';

const isEn = (locale: Locale) => locale === 'en';

export const getSummerPageHero = (locale: Locale): HeroContent => isEn(locale) ? {
  title: 'Sauna Boat Cruises in Helsinki — Aalto and Virta',
  subtitle: 'Summer 2026',
  description: 'Sauna boat cruises in the Eastern Helsinki archipelago. Two unique sauna boats, Aalto and Virta, depart from Kalkkihiekantori in Vuosaari.',
  ctaText: 'Book Your Cruise',
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
  title: 'Saunalauttaristeilyt Helsingissä — Aalto ja Virta',
  subtitle: 'Kesä 2026',
  description: 'Saunalauttaristeilyt Itä-Helsingin saaristossa. Kaksi ainutlaatuista saunalauttaa, Aalto ja Virta, lähtevät Kalkkihiekantorilta Vuosaaressa.',
  ctaText: 'Varaa Risteilysi',
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
  title: 'Sauna Boat Cruises in Helsinki',
  text: `The Hyvän Tuulen Sauna team has been offering sauna boat cruises since 2018. Our team continues to provide these wonderful experiences with solid eight years of experience. On the Virta boat we get to know the nearby Eastern Helsinki archipelago, and on the Aalto boat we float peacefully in a sheltered cove. On the Aalto boat we can also make a spin around the archipelago by motorboat! 🌊💪

Sauna boat Aalto is perfect for larger groups, while Virta is excellent for smaller crowds. Really big group? Take both!

Perfect maritime entertainment for bachelor parties, birthdays and team days! 🎉`,
} : {
  title: 'Saunalauttaristeilyt Helsingissä',
  text: `Hyvän Tuulen Saunan tiimi on tarjonnut saunalauttaristeilyjä jo vuodesta 2018. Tiimimme jatkaa vankalla kahdeksan vuoden kokemuksella näiden upeiden kokemusten tarjoamista. Virta-lautalla käymme tutustumassa Itä-Helsingin lähisaaristoon saunalautalla, ja Aalto-lautalla kelluttelemme rauhaisassa poukamassa. Aalto-lautalla pääsemme pyörähtämään saaristossa moottoriveneen voimin! 🌊💪

Saunalautta Aalto on täydellinen isommille seurueille, kun taas Virta-lautta on pienemmälle porukalle loistava. Todella iso ryhmä? Ota molemmat!

Täydellistä merellistä ajanvietettä niin polttareille, synttäreille kuin tyky-päiville! 🎉`,
};

export const summerIntroContent = getSummerIntroContent('fi');

export const getWhyChooseContent = (locale: Locale) => isEn(locale) ? {
  title: 'Why Choose a Sauna Boat Cruise in Helsinki?',
  text: `Renting a sauna boat in Helsinki is a unique way to enjoy the Eastern Helsinki archipelago. Unlike traditional saunas, a sauna boat cruise combines a wood-fired sauna, sea views and the chance to jump straight into the sea – all in one package.

Bachelor parties on a sauna boat are one of the most popular ways to celebrate an upcoming wedding in Helsinki. A sauna boat cruise offers a private and unforgettable experience for up to 25 people when you book both boats. Birthdays, team days and corporate events also work great at sea.

Sauna boat cruises operate from May to September and depart from Kalkkihiekantori in Vuosaari. Our experienced team has eight years of operating sauna boats in Helsinki, so you can trust that everything will go smoothly.

The price for a sauna boat cruise starts from €525 / 3 hours (€52 / person). Minimum booking is 3 hours. The price includes a captain, wood-fired sauna, Weber grill, ice for drinks, toilet and sound system. Own food and drinks are welcome!`,
} : {
  title: 'Miksi valita saunalauttaristeily Helsingissä?',
  text: `Saunalautan vuokraus Helsingissä on ainutlaatuinen tapa nauttia Itä-Helsingin saaristosta. Toisin kuin perinteisillä saunoilla, saunalauttaristeilyllä yhdistyvät puulämmitteinen sauna, merimaisema ja mahdollisuus pulahtaa suoraan mereen – kaikki yhdessä paketissa.

Polttarit saunalautalla ovat yksi suosituimmista tavoista juhlistaa tulevaa häätilaisuutta Helsingissä. Saunalauttaristeily tarjoaa yksityisen ja unohtumattoman kokemuksen, johon mahtuu jopa 25 henkeä kun varaat molemmat lautat. Myös synttärit, tyky-päivät ja yritystilaisuudet onnistuvat loistavasti merellä.

Saunalauttaristeilyt toimivat toukokuusta syyskuuhun ja lähtevät Kalkkihiekantorilta Vuosaaresta. Kokeneella tiimillämme on kahdeksan vuoden kokemus saunalauttojen operoinnista Helsingissä, joten voitte luottaa siihen, että kaikki sujuu moitteettomasti.

Saunalauttaristeilyn hinta alkaen 525 €/3 tuntia (52 €/hlö). Minimivaraus on 3 tuntia. Hintaan sisältyy kapteeni, puulämmitteinen sauna, Weber-grilli, jäät juomille, wc ja musiikkijärjestelmä. Omat eväät ja juomat ovat tervetulleita!`,
};

export const whyChooseContent = getWhyChooseContent('fi');

export const getArchipelagoContent = (locale: Locale) => isEn(locale) ? {
  title: 'Discover the Eastern Helsinki Archipelago',
  text: `The Eastern Helsinki archipelago is one of the most beautiful parts of Helsinki and the Gulf of Finland, and a sauna boat cruise is an incredible way to explore it. Our cruises depart from Kalkkihiekantori, where the journey begins towards the most scenic corners of the Helsinki archipelago.

From the sauna benches or the terrace you can watch the changing scenery. Depending on the weather, we either cruise around the crown of the archipelago or venture further out to take in the views. On the Aalto boat we move swiftly by motorboat, and you have the opportunity to visit the archipelago under the guidance of our skipper. There is a reason the Helsinki archipelago is considered one of the most beautiful in the world!`,
} : {
  title: 'Tutustu Itä-Helsingin saaristoon',
  text: `Itä-Helsingin saaristo on pala Helsingin ja Suomenlahden kauneinta osaa, ja saunalautta sekä saunalauttaristeilyt ovat uskomaton tapa tutustua siihen. Risteilyillämme lähdemme Kalkkihiekantorilta, josta matka alkaa kohti kauneinta Helsingin saaristoa.

Saunalautalla voit katsoa joko lauteilta tai terassilta vaihtuvaa maisemaa. Kelistä riippuen käymme joko saariston kaulalla tai pidemmällä katsomassa maisemia. Aalto-lautalla liikumme taas vauhdikkaasti veneellä, ja teillä on mahdollisuus käydä vierailemassa saaristossa kipparimme opastuksella. Sille on syy, että Helsingin saaristoa pidetään maailman kauneimpana!`,
};

export const archipelagoContent = getArchipelagoContent('fi');

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
