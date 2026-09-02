import { Boat } from '@/types';
import type { Locale } from './pages';

const isEn = (locale: Locale) => locale === 'en';

export const getBoats = (locale: Locale = 'fi'): Boat[] => isEn(locale) ? [
  {
    id: 'aalto',
    name: 'Sauna Boat Aalto',
    slug: 'aalto',
    description: 'Anchored at sea – perfect for larger groups.\n\nItinerary\n\nThe event starts at Kalkkihiekantori, where a boat transfer takes you to a peacefully anchored sauna boat. The sauna boat has SUP boards parked, a large grill, a magnificent wood-fired sauna and a large terrace for dining and spending time. If you wish, our skippers also act as grill masters, so you have more time to enjoy the company. Of course there is also a changing room and a toilet. Aalto is an excellent choice for an evening gathering for a larger group!',
    capacity: { min: 8, max: 12, recommended: 10 },
    features: [
      'Max. 12 people',
      'Harvia heater',
      '12m length',
      'Weber grill',
      'SUP boards',
      'Large terrace',
      'Boat ride',
      'Changing room',
      'WC',
    ],
    images: [
      '/images/aalto-12.webp',
      '/images/gallery-aalto-sohva.webp',
      '/images/gallery-aalto-raft.webp',
      '/images/aalto-11.webp',
      '/images/aalto-09.webp',
      '/images/aalto-08.webp',
      '/images/aalto-07.webp',
      '/images/aalto-04.webp',
    ],
    pricing: { basePrice: 525, currency: 'EUR', unit: '3h' },
    amenities: ['Captain', 'Towels', 'Grill equipment', 'Ice for drinks'],
    idealFor: ['Bachelor parties', 'Birthdays', 'Team days', 'Corporate events'],
  },
  {
    id: 'virta',
    name: 'Sauna Boat Virta',
    slug: 'virta',
    description: 'Cruise in the archipelago – a more intimate experience for smaller groups.\n\nItinerary\n\nThe cruise starts from Kalkkihiekantori, where the sauna boat picks you up. During the cruise we travel along a route chosen by the captain, stopping a few times to take a dip – actually as many times as you wish! The boat has a rooftop terrace, grill, small indoor spaces, a fine wood sauna and a toilet. If you wish, our skippers will grill for you – leave the grilling to us and enjoy the cruise yourself.',
    capacity: { min: 4, max: 10, recommended: 8 },
    features: [
      'Max. 10 people',
      'Harvia heater',
      '10m length',
      'Weber grill',
      'Rooftop terrace',
      'Small indoor spaces',
      'Wood sauna',
      'WC',
    ],
    images: [
      '/images/virta-01.webp',
      '/images/gallery-virta-deck.webp',
      '/images/virta-06.webp',
      '/images/virta-02.webp',
      '/images/virta-03.webp',
      '/images/virta-04.webp',
      '/images/virta-07.webp',
      '/images/virta-05.webp',
      '/images/virta-grill-deck.webp',
      '/images/virta-stern-calm.webp',
    ],
    pricing: { basePrice: 525, currency: 'EUR', unit: '3h' },
    amenities: ['Captain', 'Towels', 'Grill equipment', 'Ice for drinks'],
    idealFor: ['Small groups', 'Families', 'Friend groups', 'Bachelor parties'],
  },
] : [
  {
    id: 'aalto',
    name: 'Saunalautta Aalto',
    slug: 'aalto',
    description: 'Ankkuroituna merellä – täydellinen isommille seurueille.\n\nMatkasuunnitelma\n\nTilaisuus alkaa Kalkkihiekantorilta, josta venekuljetus hakee teidät rauhaisaan paikkaan ankkuroidulle saunalautalle. Saunalautalla on Sup-lautoja parkissa, iso grilli, mahtava puu-sauna sekä iso terassi jossa voi ruokailla ja viettää aikaa. Halutessanne kipparimme toimivat myös grillimestareina, joten teillä jää enemmän aikaa nauttia seurasta. Myös tietysti pukkari ja wc löytyy. Aalto on loistava valinta illan istumiseen isommalle porukalle!',
    capacity: { min: 8, max: 12, recommended: 10 },
    features: [
      'Max. 12 hlö',
      'Harvia-kiuas',
      '12m pituus',
      'Weber-grilli',
      'Sup-laudat',
      'Iso terassi',
      'Vene-ajelu',
      'Pukuhuone',
      'WC',
    ],
    images: [
      '/images/aalto-12.webp',
      '/images/gallery-aalto-sohva.webp',
      '/images/gallery-aalto-raft.webp',
      '/images/aalto-11.webp',
      '/images/aalto-09.webp',
      '/images/aalto-08.webp',
      '/images/aalto-07.webp',
      '/images/aalto-04.webp',
    ],
    pricing: { basePrice: 525, currency: 'EUR', unit: '3h' },
    amenities: ['Kapteeni', 'Pyyhkeet', 'Grillivarusteet', 'Jäät juomille'],
    idealFor: ['Polttarit', 'Synttärit', 'Tyky-päivät', 'Yritystilaisuudet'],
  },
  {
    id: 'virta',
    name: 'Saunalautta Virta',
    slug: 'virta',
    description: 'Risteily saaristossa – intiimimpi kokemus pienemmälle porukalle.\n\nMatkasuunnitelma\n\nRisteily alkaa Kalkkihiekantorilta, josta saunalautta nappaa teidät kyytiin. Risteilyn aikana kuljemme kapteenin valikoimaa reittiä, ja pysähdymme pari kertaa pulahtamaan, oikeastaan niin monta kertaa kuin toivotte! Lautalla on kattoterassi, grilli, pienet sisätilat, hieno puusauna ja wc. Halutessanne kipparimme grillaa puolestanne – jätä huoli grillimestarin harteille ja nauti itse risteilystä.',
    capacity: { min: 4, max: 10, recommended: 8 },
    features: [
      'Max. 10 hlö',
      'Harvia-kiuas',
      '10m pituus',
      'Weber-grilli',
      'Kattoterassi',
      'Pienet sisätilat',
      'Puusauna',
      'WC',
    ],
    images: [
      '/images/virta-01.webp',
      '/images/gallery-virta-deck.webp',
      '/images/virta-06.webp',
      '/images/virta-02.webp',
      '/images/virta-03.webp',
      '/images/virta-04.webp',
      '/images/virta-07.webp',
      '/images/virta-05.webp',
      '/images/virta-grill-deck.webp',
      '/images/virta-stern-calm.webp',
    ],
    pricing: { basePrice: 525, currency: 'EUR', unit: '3h' },
    amenities: ['Kapteeni', 'Pyyhkeet', 'Grillivarusteet', 'Jäät juomille'],
    idealFor: ['Pienet ryhmät', 'Perheet', 'Kaveriporukat', 'Polttarit'],
  },
];

export const boats = getBoats('fi');

export const getPrivateSaunaProducts = (locale: Locale = 'fi') => isEn(locale) ? [
  { id: 'private-aalto', name: 'Private sauna session in Aalto', boatId: 'aalto', duration: 120, description: 'Book Aalto for your private use for two hours.', basePrice: 800 },
  { id: 'private-virta', name: 'Private sauna session in Virta', boatId: 'virta', duration: 120, description: 'Book Virta for your private use for two hours.', basePrice: 580 },
  { id: 'private-extended', name: 'Full day sauna experience', boatId: 'aalto', duration: 480, description: 'A full day sauna experience in Aalto. Includes dining and activities.', basePrice: 2500 },
] : [
  { id: 'private-aalto', name: 'Yksityinen saunavuoro Aallossa', boatId: 'aalto', duration: 120, description: 'Varaa Aalto omaan käyttöösi kahdeksi tunniksi.', basePrice: 800 },
  { id: 'private-virta', name: 'Yksityinen saunavuoro Virrassa', boatId: 'virta', duration: 120, description: 'Varaa Virta omaan käyttöösi kahdeksi tunniksi.', basePrice: 580 },
  { id: 'private-extended', name: 'Koko päivän saunaelämys', boatId: 'aalto', duration: 480, description: 'Koko päivän kestävä saunaelämys Aallossa. Sisältää ruokailun ja aktiviteetteja.', basePrice: 2500 },
];

export const privateSaunaProducts = getPrivateSaunaProducts('fi');

export const getSummerFeatures = (locale: Locale = 'fi') => isEn(locale) ? [
  { id: 'location', title: 'Departure from Kalkkihiekantori', description: 'From Aurinkolahti in Vuosaari, easy to reach by metro or car', icon: 'map-pin' },
  { id: 'experience', title: 'Wood-fired sauna', description: 'Authentic Harvia heater and traditional löyly in a maritime environment', icon: 'flame' },
  { id: 'swimming', title: 'Dip in the sea', description: 'At stopping points you can swim and enjoy the stunning archipelago views', icon: 'waves' },
  { id: 'grill', title: 'Weber grill', description: 'Grill delicacies on the boat – own food and drinks welcome', icon: 'utensils' },
] : [
  { id: 'location', title: 'Lähtö Kalkkihiekantorilta', description: 'Vuosaaren Aurinkolahdesta, helppo saavuttaa metrolla tai autolla', icon: 'map-pin' },
  { id: 'experience', title: 'Puulämmitteinen sauna', description: 'Aito Harvia-kiuas ja perinteiset löylyt merellisessä ympäristössä', icon: 'flame' },
  { id: 'swimming', title: 'Pulahtaminen mereen', description: 'Pysähdyspaikoissa voit uida ja nauttia saariston upeista maisemista', icon: 'waves' },
  { id: 'grill', title: 'Weber-grilli', description: 'Grillaa herkut lautalla – omat eväät ja juomat tervetulleita', icon: 'utensils' },
];

export const summerFeatures = getSummerFeatures('fi');
