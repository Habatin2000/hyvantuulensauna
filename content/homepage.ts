import { HeroContent, Feature } from '@/types';

export type Locale = 'fi' | 'en';

export const getHomepageHero = (locale: Locale): HeroContent => {
  if (locale === 'en') {
    return {
      title: 'The most unique sauna in Helsinki',
      subtitle: 'Hyvän Tuulen Sauna',
      description: 'Sauna experiences, cruises and unforgettable moments on the water. In the beautiful Eastern Helsinki archipelago.',
      ctaText: 'Book a sauna boat cruise',
      ctaHref: '/saunalauttaristeilyt-helsingissa',
      secondaryCta: {
        text: 'Book a public sauna session',
        href: '/julkinen-sauna',
      },
      image: '/images/gallery-sauna-woman.webp',
      images: [
        '/images/gallery-sauna-woman.webp',
        '/images/hero-raft-sup.webp',
        '/images/hero-helsinki-night.webp',
        '/images/hero-rainbow.webp',
        '/images/hero-raft-dusk.webp',
        '/images/generated-image.webp',
        '/images/seasauna.webp',
        '/images/saunagang.webp',
        '/images/SAUNAHELSINKI.webp',
      ],
    };
  }
  return {
    title: 'Se uniikein sauna Helsingissä',
    subtitle: 'Hyvän Tuulen Sauna',
    description: 'Saunomista, risteilyjä ja unohtumattomia hetkiä vesillä. Itä-Helsingin upeassa saaristossa.',
    ctaText: 'Varaa saunalauttaristeily',
    ctaHref: '/saunalauttaristeilyt-helsingissa',
    secondaryCta: {
      text: 'Varaa julkinen saunavuoro',
      href: '/julkinen-sauna',
    },
    image: '/images/gallery-sauna-woman.webp',
    images: [
      '/images/gallery-sauna-woman.webp',
      '/images/hero-raft-sup.webp',
      '/images/hero-helsinki-night.webp',
      '/images/hero-rainbow.webp',
      '/images/hero-raft-dusk.webp',
      '/images/generated-image.webp',
      '/images/seasauna.webp',
      '/images/saunagang.webp',
      '/images/SAUNAHELSINKI.webp',
    ],
  };
};

export const homepageHero = getHomepageHero('fi');

export const getHomepageFeatures = (locale: Locale): Feature[] => {
  if (locale === 'en') {
    return [
      {
        id: 'authentic',
        title: 'Authentic sauna experience in Helsinki',
        description: 'Traditional wood-fired sauna in a genuine maritime environment',
        icon: 'flame',
      },
      {
        id: 'location',
        title: 'In the heart of nature',
        description: 'Beautiful scenery in the Eastern Helsinki archipelago, only a stone\'s throw from the city centre',
        icon: 'map-pin',
      },
      {
        id: 'swim',
        title: 'Year-round activities',
        description: 'Winter ice swimming and summer swimming — open all year round!',
        icon: 'waves',
      },
      {
        id: 'catering',
        title: 'Dining on deck',
        description: 'Grilling options and catering services available for your events',
        icon: 'utensils',
      },
      {
        id: 'value',
        title: 'Best price-quality ratio',
        description: 'Thousands of cruises at the best price in Helsinki. Unbeatable value for your money.',
        icon: 'ship',
      },
    ];
  }
  return [
    {
      id: 'authentic',
      title: 'Aito saunakokemus Helsingissä',
      description: 'Mökkimäinen puusauna vain kivenheiton päässä Helsingin keskustasta',
      icon: 'flame',
    },
    {
      id: 'location',
      title: 'Luonnon keskellä',
      description: 'Upeat maisemat Itä-Helsingin saaristossa',
      icon: 'map-pin',
    },
    {
      id: 'swim',
      title: 'Toimintaa koko vuoden',
      description: 'Talvella avanto ja kesällä uimista, vuoden ympäri toimintaa!',
      icon: 'waves',
    },
    {
      id: 'catering',
      title: 'Ruokailu kannelle',
      description: 'Grillausmahdollisuus ja catering-palvelut saatavilla tilaisuuksiinne',
      icon: 'utensils',
    },
    {
      id: 'value',
      title: 'Hinta-laatu-suhde',
      description: 'Tuhansia saunaristeilyjä Helsingin parhaimpaan hintaan. Vertaamaton vastine rahalle.',
      icon: 'ship',
    },
  ];
};

export const homepageFeatures = getHomepageFeatures('fi');

export const getExperienceCards = (locale: Locale) => {
  if (locale === 'en') {
    return [
      {
        id: 'private',
        title: 'Private sauna',
        description: 'A private sauna moment for your own group. Sauna boat for private use, parties, bachelor parties, corporate events or relaxed time together.',
        image: '/images/gallery-aalto-raft.webp',
        href: '/saunalauttaristeilyt-helsingissa',
        cta: 'Explore private sauna boat',
      },
      {
        id: 'public',
        title: 'Public sauna',
        description: 'Come and enjoy the sauna without a private booking. Public sauna sessions in a maritime environment in Helsinki. Come alone or with a friend to enjoy the löyly.',
        image: '/images/gallery-sauna-group.webp',
        href: '/julkinen-sauna',
        cta: 'See public sauna sessions',
      },
    ];
  }
  return [
    {
      id: 'private',
      title: 'Yksityinen sauna',
      description: 'Oma saunahetki omalle porukalle. Saunalautta yksityiseen käyttöön, juhliin, polttareihin, yritystilaisuuksiin tai rentoon yhdessäoloon.',
      image: '/images/gallery-aalto-raft.webp',
      href: '/saunalauttaristeilyt-helsingissa',
      cta: 'Tutustu yksityiseen saunalauttaan',
    },
    {
      id: 'public',
      title: 'Julkinen sauna',
      description: 'Tule saunomaan ilman yksityistä varausta. Julkiset saunavuorot merellisessä ympäristössä Helsingissä. Tule yksin tai kaverin kanssa nauttimaan löylyistä.',
      image: '/images/gallery-sauna-group.webp',
      href: '/julkinen-sauna',
      cta: 'Katso julkiset saunavuorot',
    },
  ];
};

export const experienceCards = getExperienceCards('fi');

export const getServiceCards = (locale: Locale) => {
  if (locale === 'en') {
    return [
      {
        id: 'summer',
        title: 'Sauna boat cruises',
        description: 'Experience the summer highlight at sea. Book a sauna boat for your group and enjoy sauna, swimming and beautiful sea views.',
        image: '/images/gallery-aalto-raft.webp',
        href: '/saunalauttaristeilyt-helsingissa',
        cta: 'Book a sauna boat cruise',
        badge: 'Most popular',
      },
      {
        id: 'public',
        title: 'Public sauna',
        description: 'Join our open sauna sessions. Meet new people and enjoy a shared sauna experience by the sea.',
        image: '/images/gallery-sauna-group.webp',
        href: '/julkinen-sauna',
        cta: 'Book a sauna session by the sea',
      },
      {
        id: 'events',
        title: 'Events',
        description: 'Hyvän Tuulen Sauna organizes all kinds of events in the summer. Sauna rituals, public cruises and tent saunas!',
        image: '/images/gallery-sauna-steam.webp',
        href: '/yksityissauna',
        cta: 'See events',
      },
    ];
  }
  return [
    {
      id: 'summer',
      title: 'Saunalauttaristeilyt',
      description: 'Koe kesän kohikohta merellä. Varaa saunalautta ryhmällesi ja nauti saunomisesta, uinnista ja kauniista merinäkymistä.',
      image: '/images/gallery-aalto-raft.webp',
      href: '/saunalauttaristeilyt-helsingissa',
      cta: 'Varaa saunalauttaristeily',
      badge: 'Suosituin',
    },
    {
      id: 'public',
      title: 'Julkinen sauna',
      description: 'Tule mukaan avoimille saunavuoroille. Tapaa uusia ihmisiä ja nauti yhteisestä saunakokemuksesta meren äärellä.',
      image: '/images/gallery-sauna-group.webp',
      href: '/julkinen-sauna',
      cta: 'Varaa saunavuoro merellä',
    },
    {
      id: 'events',
      title: 'Tapahtumat',
      description: 'Hyvän Tuulen Sauna järjestää kesällä kaikennäköisiä tapahtumia. Saunarituaaleja, julkisia risteilyitä ja telttasaunoja!',
      image: '/images/gallery-sauna-steam.webp',
      href: '/yksityissauna',
      cta: 'Katso tapahtumat',
    },
  ];
};

export const serviceCards = getServiceCards('fi');

export const getTrustBadges = (locale: Locale) => {
  if (locale === 'en') {
    return [
      { id: 'years', value: '8+', label: 'Years in operation', icon: 'calendar' },
      { id: 'guests', value: '10 000+', label: 'Happy sauna guests', icon: 'users' },
      { id: 'rating', value: '5.0', label: 'Average on Google', icon: 'star' },
      { id: 'location', value: 'Helsinki', label: 'Aurinkolahti', icon: 'map-pin' },
    ];
  }
  return [
    { id: 'years', value: '8+', label: 'Vuotta toimintaa', icon: 'calendar' },
    { id: 'guests', value: '10 000+', label: 'Tyytyväistä saunojaa', icon: 'users' },
    { id: 'rating', value: '5.0', label: 'Keskiarvo Googlessa', icon: 'star' },
    { id: 'location', value: 'Helsinki', label: 'Aurinkolahti', icon: 'map-pin' },
  ];
};

export const trustBadges = getTrustBadges('fi');

export const getGalleryPreviewImages = (locale: Locale = 'fi') => locale === 'en' ? [
  { id: '1', src: '/images/gallery-sunset-raft.webp', alt: 'Sauna boat at sunset' },
  { id: '2', src: '/images/gallery-sauna-interior.webp', alt: 'Sauna interior' },
  { id: '3', src: '/images/gallery-deck-view.webp', alt: 'View from the deck' },
  { id: '4', src: '/images/gallery-ice-swimming.webp', alt: 'Winter swimming' },
  { id: '5', src: '/images/gallery-bbq.webp', alt: 'Grilling at the pier' },
  { id: '6', src: '/images/gallery-sauna-guy.webp', alt: 'Bathers enjoying the löyly' },
  { id: '7', src: '/images/gallery-deck-chairs.webp', alt: 'Relaxing on the deck' },
  { id: '8', src: '/images/gallery-winter-sunset.webp', alt: 'Winter evening at the sauna' },
  { id: '9', src: '/images/gallery-sauna-bench.webp', alt: 'Sauna benches' },
] : [
  { id: '1', src: '/images/gallery-sunset-raft.webp', alt: 'Saunalautta auringonlaskussa' },
  { id: '2', src: '/images/gallery-sauna-interior.webp', alt: 'Saunan sisätilat' },
  { id: '3', src: '/images/gallery-deck-view.webp', alt: 'Näkymä kannelta' },
  { id: '4', src: '/images/gallery-ice-swimming.webp', alt: 'Talviuinti' },
  { id: '5', src: '/images/gallery-bbq.webp', alt: 'Grillailua laiturilla' },
  { id: '6', src: '/images/gallery-sauna-guy.webp', alt: 'Saunojat nauttivat löylyistä' },
  { id: '7', src: '/images/gallery-deck-chairs.webp', alt: 'Rentoutumista kannella' },
  { id: '8', src: '/images/gallery-winter-sunset.webp', alt: 'Talvi-ilta saunalla' },
  { id: '9', src: '/images/gallery-sauna-bench.webp', alt: 'Saunan lauteet' },
];

export const galleryPreviewImages = getGalleryPreviewImages('fi');

export const getStoryContent = (locale: Locale) => {
  if (locale === 'en') {
    return {
      title: 'Our story',
      quote: 'Hyvän Tuulen Sauna means good wind and good mood. We wish for good winds, but we provide good vibes in any case.',
      paragraphs: [
        'The purpose of Hyvän Tuulen Sauna is to relax you in the sauna, sometimes even spice things up at events, bring communities together on the sauna benches and serve you in the best possible way.',
        'We strive for excellence in sauna quality, good löyly, fairness and in making YOU feel as comfortable as possible.',
        'The story begins at the same time in Tampere and Helsinki, when Captain Kalle and the twins became interested in floating saunas. On the Helsinki side, Onni and Ilmari put saunas on the water, while Kalle took up captain\u2019s duties in Tampere. Our paths ran separately until 2022, when Kalle joined the twins\u2019 crew in Helsinki. The bonds deepened, and in 2023 Kalle and the twins were pushing the sauna business forward together. In 2024 we changed our name to Hyvän Tuulen Sauna — and that\u2019s how we roll!',
        'We have offered sauna experiences in Helsinki for eight years. Creating maritime experiences is like second nature to us! Captain Kalle has driven sauna boats in Tampere and Helsinki, Onni and Ile in Helsinki, on the same waters for eight years now. Tuure is coming for his second summer and the vibe is still great.',
        'The most unique experiences of the year are created here, so —',
        'Welcome to Hyvän Tuulen Sauna.',
      ],
      image: { src: '/images/crew2.webp', alt: 'Hyvän Tuulen Sauna team' },
    };
  }
  return {
    title: 'Meidän tarina',
    quote: 'Hyvän Tuulen Sauna tarkoittaa hyvää tuulta ja hyvää mieltä. Toivomme hyviä tuulia, mutta tarjoamme hyvää mieltä joka tapauksessa.',
    paragraphs: [
      'Hyvän Tuulen Saunan tarkoituksena on rentouttaa teitä saunan parissa, joskus jopa villitä tilaisuuksissa, tuoda yhteisöjä yhteen saunan lauteilla ja palvella teitä parhaalla mahdollisella tavalla.',
      'Tavoittelemme erinomaisuutta saunan laadussa, hyvissä löylyissä, reiluudessa ja siinä, että SINÄ tunnet olosi mahdollisimman mukavaksi.',
      'Tarina alkaa samaan aikaan Tampereella ja Helsingissä, kun Kippari Kalle ja kaksoset kiinnostuvat kelluvista saunoista. Helsingin päädyssä Onni ja Ilmari laittavat saunat vesille, ja Kalle käy Tampereella Kipparin hommiin. Tiet olivat erillään vuoteen 2022, jolloin Kalle hyppäsi Helsingin päädyssä kaksosten remmiin. Välit syvenivät, ja vuonna 2023 Kalle ja kaksoset onkin painanut kimpassa saunojen kanssa eteenpäin. 2024 vaihdoimme nimeksi Hyvän Tuulen Sauna, ja sillä mennään!',
      'Olemme tarjonneet saunomista Helsingissä jo kahdeksan vuotta. Merellisten kokemusten tuottaminen on siis meille jo kuin toinen luonne! Kippari Kalle on kipparoinut saunoja niin Tampereella kuin Helsingissä, Onni ja Ile stadissa, samoilla vesillä jo kahdeksatta vuotta, Tuure tulee toiselle kesälle ja meininki on edelleen mainio.',
      'Vuoden uniikeimmat kokemukset syntyvät täällä, joten-',
      'Tervetuloa Hyvän Tuulen Saunaan.',
    ],
    image: { src: '/images/crew2.webp', alt: 'Hyvän Tuulen Saunan tiimi' },
  };
};

export const storyContent = getStoryContent('fi');
