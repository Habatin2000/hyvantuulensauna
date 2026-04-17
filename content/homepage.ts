import { HeroContent, Testimonial, Feature } from '@/types';

export const homepageHero: HeroContent = {
  title: 'Saunomista, risteilyjä ja unohtumattomia hetkiä',
  subtitle: 'Hyvän Tuulen Sauna',
  description: 'Saunalauttaristeilyitä, polttareita, synttäreitä, julkisia saunavuoroja ja saunarituaaleja. Itä-Helsingin upeassa saaristossa.',
  ctaText: 'Varaa saunalauttaristeily',
  ctaHref: '/saunalauttaristeilyt-helsingissa',
  secondaryCta: {
    text: 'Varaa Julkinen saunavuoro',
    href: '/julkinen-sauna',
  },
  image: '/images/gallery-raft-sunset.jpg',
};

export const homepageFeatures: Feature[] = [
  {
    id: 'authentic',
    title: 'Aito saunakokemus',
    description: 'Perinteinen puulämmitteinen sauna aidossa merellisessä ympäristössä',
    icon: 'flame',
  },
  {
    id: 'location',
    title: 'Luonnon keskellä',
    description: 'Upeat maisemat itäisessä saaristossa',
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
];

export const serviceCards = [
  {
    id: 'summer',
    title: 'Saunalauttaristeilyt',
    description: 'Koe kesän kohikohta merellä. Varaa saunalautta ryhmällesi ja nauti saunomisesta, uinnista ja kauniista merinäkymistä.',
    image: '/images/gallery-aalto-raft.jpeg',
    href: '/saunalauttaristeilyt-helsingissa',
    cta: 'Varaa saunalauttaristeily',
    badge: 'Suosituin',
  },
  {
    id: 'public',
    title: 'Julkinen sauna',
    description: 'Tule mukaan avoimille saunavuoroille. Tapaa uusia ihmisiä ja nauti yhteisestä saunakokemuksesta meren äärellä.',
    image: '/images/gallery-sauna-group.jpg',
    href: '/julkinen-sauna',
    cta: 'Varaa saunavuoro merellä',
  },
  {
    id: 'events',
    title: 'Tapahtumat',
    description: 'Hyvän Tuulen Sauna järjestää kesällä kaikennäköisiä tapahtumia. Saunarituaaleja, julkisia risteilyitä ja telttasaunoja!',
    image: '/images/gallery-sauna-steam.jpg',
    href: '/yksityissauna',
    cta: 'Katso tapahtumat',
  },
];

export const trustBadges = [
  {
    id: 'years',
    value: '8+',
    label: 'Vuotta toimintaa',
  },
  {
    id: 'guests',
    value: '10 000+',
    label: 'Tyytyväistä saunojaa',
  },
  {
    id: 'rating',
    value: '5.0',
    label: 'Keskiarvo Googlessa',
  },
  {
    id: 'location',
    value: 'Helsinki',
    label: 'Aurinkolahti',
  },
];

// Testimonials removed - using Google Reviews widget instead

export const galleryPreviewImages = [
  {
    id: '1',
    src: '/images/gallery-sunset-raft.jpeg',
    alt: 'Saunalautta auringonlaskussa',
  },
  {
    id: '2',
    src: '/images/gallery-sauna-interior.jpg',
    alt: 'Saunan sisätilat',
  },
  {
    id: '3',
    src: '/images/gallery-deck-view.jpg',
    alt: 'Näkymä kannelta',
  },
  {
    id: '4',
    src: '/images/gallery-ice-swimming.jpg',
    alt: 'Talviuinti',
  },
  {
    id: '5',
    src: '/images/gallery-bbq.jpg',
    alt: 'Grillailua laiturilla',
  },
  {
    id: '6',
    src: '/images/gallery-sauna-guy.jpg',
    alt: 'Saunojat nauttivat löylyistä',
  },
  {
    id: '7',
    src: '/images/gallery-deck-chairs.jpeg',
    alt: 'Rentoutumista kannella',
  },
  {
    id: '8',
    src: '/images/gallery-winter-sunset.jpeg',
    alt: 'Talvi-ilta saunalla',
  },
  {
    id: '9',
    src: '/images/gallery-sauna-bench.jpg',
    alt: 'Saunan lauteet',
  },
];

export const storyContent = {
  title: 'Meidän tarina',
  quote: 'Hyvän Tuulen Sauna tarkoittaa hyvää tuulta ja hyvää mieltä. Toivomme hyviä tuulia, mutta tarjoamme hyvää mieltä joka tapauksessa.',
  paragraphs: [
    'Hyvän Tuulen Saunan missio on tuoda rentoutumista ja hyvää oloa ihmisille. Tavoittelemme erinomaisuutta löylyissä, palveluissa, reiluudessa ja siinä, että SINÄ tunnet olosi mahdollisimman mukavaksi.',
    'Olemme tarjonneet saunalauttaristeilyjä Helsingissä jo kahdeksan vuotta. Merellisten kokemusten tuottaminen on siis meille jo kuin toinen luonne! Kippari Kalle on ajanut saunalauttaa niin Tampereella kuin Helsingissä, Onni ja Ile stadissa, samoilla vesillä jo kahdeksatta vuotta, Tuure tulee toiselle kesälle ja meininki on edelleen mainio.',
    'Vuoden uniikeimmat kokemukset syntyvät täällä, joten-',
    'Tervetuloa Hyvän Tuulen Saunaan.',
  ],
  image: {
    src: '/images/crew2.png',
    alt: 'Hyvän Tuulen Saunan tiimi',
  },
};
