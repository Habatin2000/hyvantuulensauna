import { Boat } from '@/types';

export const boats: Boat[] = [
  {
    id: 'aalto',
    name: 'Saunalautta Aalto',
    slug: 'aalto',
    description: 'Ankkuroituna merellä – täydellinen isommille seurueille.\n\nMatkasuunnitelma\n\nTilaisuus alkaa Kalkkihiekantorilta, josta venekuljetus hakee teidät rauhaisaan paikkaan ankkuroidulle saunalautalle. Saunalautalla on Sup-lautoja parkissa, iso grilli, mahtava puu-sauna sekä iso terassi jossa voi ruokailla ja viettää aikaa. Myös tietysti pukkari ja wc löytyy. Aalto on loistava valinta illan istumiseen isommalle porukalle!',
    capacity: {
      min: 8,
      max: 12,
      recommended: 10,
    },
    features: [
      'Max. 12 hlö',
      'Harvia-kiuas',
      '12m pituus',
      'Weber-grilli',
      'Sup-laudat',
      'Iso terassi',
      'Pukuhuone',
      'WC',
    ],
    images: [
      '/images/gallery-aalto-raft.jpeg',
      '/images/gallery-deck-chairs.jpeg',
      '/images/gallery-sauna-group.jpg',
      '/images/gallery-aalto-misty.jpeg',
      '/images/gallery-aalto-sohva.jpeg',
      '/images/gallery-sup-boards.jpeg',
      '/images/gallery-sauna-bench.jpg',
      '/images/gallery-led-sauna.jpg',
      '/images/gallery-sauna-woman.jpg',
    ],
    pricing: {
      basePrice: 150,
      currency: 'EUR',
      unit: 'hour',
    },
    amenities: ['Kapteeni', 'Pyyhkeet', 'Grillivarusteet', 'Jäät juomille'],
    idealFor: ['Polttarit', 'Synttärit', 'Tyky-päivät', 'Yritystilaisuudet'],
  },
  {
    id: 'virta',
    name: 'Saunalautta Virta',
    slug: 'virta',
    description: 'Risteily saaristossa – intiimimpi kokemus pienemmälle porukalle.\n\nMatkasuunnitelma\n\nRisteily alkaa Kalkkihiekantorilta, josta saunalautta nappaa teidät kyytiin. Risteilyn aikana kuljemme kapteenin valikoimaa reittiä, ja pysähdymme pari kertaa pulahtamaan, oikeastaan niin monta kertaa kuin toivotte! Lautalla on kattoterassi, grilli, pienet sisätilat, hieno puusauna ja wc.',
    capacity: {
      min: 4,
      max: 10,
      recommended: 8,
    },
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
      '/images/virta-raft.jpeg',
      '/images/gallery-virta-kall.jpg',
      '/images/gallery-virta-deck.jpeg',
      '/images/gallery-sauna-interior.jpg',
      '/images/gallery-raft-foggy.jpg',
      '/images/gallery-helm.jpeg',
      '/images/gallery-bbq.jpg',
    ],
    pricing: {
      basePrice: 150,
      currency: 'EUR',
      unit: 'hour',
    },
    amenities: ['Kapteeni', 'Pyyhkeet', 'Grillivarusteet', 'Jäät juomille'],
    idealFor: ['Pienet ryhmät', 'Perheet', 'Kaveriporukat', 'Polttarit'],
  },
];

export const privateSaunaProducts = [
  {
    id: 'private-aalto',
    name: 'Yksityinen saunavuoro Aallossa',
    boatId: 'aalto',
    duration: 120,
    description: 'Varaa Aalto omaan käyttöösi kahdeksi tunniksi.',
    basePrice: 800,
  },
  {
    id: 'private-virta',
    name: 'Yksityinen saunavuoro Virrassa',
    boatId: 'virta',
    duration: 120,
    description: 'Varaa Virta omaan käyttöösi kahdeksi tunniksi.',
    basePrice: 580,
  },
  {
    id: 'private-extended',
    name: 'Koko päivän saunaelämys',
    boatId: 'aalto',
    duration: 480,
    description: 'Koko päivän kestävä saunaelämys Aallossa. Sisältää ruokailun ja aktiviteetteja.',
    basePrice: 2500,
  },
];

export const summerFeatures = [
  {
    id: 'location',
    title: 'Lähtö Kalkkihiekantorilta',
    description: 'Vuosaaren Aurinkolahdesta, helppo saavuttaa metrolla tai autolla',
    icon: 'map-pin',
  },
  {
    id: 'experience',
    title: 'Puulämmitteinen sauna',
    description: 'Aito Harvia-kiuas ja perinteiset löylyt merellisessä ympäristössä',
    icon: 'flame',
  },
  {
    id: 'swimming',
    title: 'Pulahtaminen mereen',
    description: 'Pysähdyspaikoissa voit uida ja nauttia saariston upeista maisemista',
    icon: 'waves',
  },
  {
    id: 'grill',
    title: 'Weber-grilli',
    description: 'Grillaa herkut lautalla – omat eväät ja juomat tervetulleita',
    icon: 'utensils',
  },
];
