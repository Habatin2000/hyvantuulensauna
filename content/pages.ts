import { HeroContent } from '@/types';

export const summerPageHero: HeroContent = {
  title: 'Hyvän Tuulen Saunalauttaristeilyt Helsingissä',
  subtitle: 'Kesä 2026',
  description: 'Saunalauttaristeilyt Helsingin itäisessä saaristossa. Kaksi ainutlaatuista saunalauttaa, Aalto ja Virta, odottavat sinua.',
  ctaText: 'Varaa Risteilysi',
  ctaHref: '#varaus',
  image: '/images/gallery-deck-view.jpg',
};

export const privatePageHero: HeroContent = {
  title: 'Hyvän Tuulen Saunan tapahtumat',
  subtitle: 'Tapahtumat',
  description: 'vaihtuvia tapahtumia saunarituaaleista nopeisiin yksityisiin vuoroihin',
  ctaText: 'Katso tapahtumat',
  ctaHref: '#tapahtumat',
  image: '/images/gallery-sauna-steam.jpg',
};

export const publicPageHero: HeroContent = {
  title: 'Julkinen saunavuoro Hyvän Tuulen Saunalla Helsingissä',
  subtitle: 'Helsingin uniikein saunavuoro Saunalautalla',
  description: '8 Vuoden kokemuksella saunalauttoja, priimaa löylyä ja hyvää tunnelmaa. Näistä pidämme kiinni, kuumat saunat ovat täällä taattuja.',
  ctaText: 'Varaa paikkasi',
  ctaHref: '#varaus',
  image: '/images/gallery-sauna-group.jpg',
};

export const locationPageHero: HeroContent = {
  title: 'Sijainti',
  subtitle: 'Tule käymään',
  description: 'Olemme helposti saavutettavissa Kalkkihiekantorilla Aurinkolahdessa. Tervetuloa nauttimaan saunaelämyksestä meren äärellä.',
  ctaText: 'Katso reitti',
  ctaHref: '#kartta',
  image: '/images/location-map.png',
};

export const galleryPageHero: HeroContent = {
  title: 'Galleria',
  subtitle: 'Tunnelmia',
  description: 'Kurkista saunaelämyksiimme kuvien välityksellä. Kesän auringonlaskut, talven avantouinnit ja kaikki siltä väliltä.',
  ctaText: 'Tutustu palveluihin',
  ctaHref: '/saunalauttaristeilyt-helsingissa',
  image: '/images/gallery-raft-sunset.jpg',
};

export const thankYouPageContent = {
  title: 'Kiitos varauksestasi!',
  description: 'Olemme vastaanottaneet varauskyselysi. Vahvistamme varauksen sähköpostitse 24 tunnin sisällä.',
  nextSteps: [
    'Tarkista sähköpostisi (myös roskaposti) varausvahvistusta varten',
    'Saat maksuohjeet sähköpostitse',
    'Tule paikalle 10 minuuttia ennen varattua aikaa',
  ],
  contact: {
    title: 'Kysyttävää?',
    description: 'Ota yhteyttä, autamme mielellämme.',
    phone: '+358 44 231 3546',
    email: 'info@hyvantuulensauna.fi',
  },
};

export const summerIntroContent = {
  title: 'Saunalauttaristeilyt Helsingissä',
  text: `Hyvän Tuulen Saunan tiimi on tarjonnut saunalauttaristeilyjä jo vuodesta 2018. Tiimimme jatkaa vankalla kahdeksan vuoden kokemuksella näiden upeiden kokemusten tarjoamista. Virta-lautalla käymme tutustumassa Itä-Helsingin lähisaaristoon saunalautalla, ja Aalto-lautalla kelluttelemme rauhaisassa poukamassa.

Saunalautta Aalto on täydellinen isommille seurueille, kun taas Virta-lautta on pienemmälle porukalle loistava. Todella iso ryhmä? Ota molemmat!

Täydellistä merellistä ajanvietettä niin polttareille, synttäreille kuin tyky-päiville! 🎉`,
};

export const whyChooseContent = {
  title: 'Miksi valita saunalauttaristeily Helsingissä?',
  text: `Saunalautan vuokraus Helsingissä on ainutlaatuinen tapa nauttia Itä-Helsingin saaristosta. Toisin kuin perinteisillä saunoilla, saunalauttaristeilyllä yhdistyvät puulämmitteinen sauna, merimaisema ja mahdollisuus pulahtaa suoraan mereen – kaikki yhdessä paketissa.

Polttarit saunalautalla ovat yksi suosituimmista tavoista juhlistaa tulevaa häätilaisuutta Helsingissä. Saunalauttaristeily tarjoaa yksityisen ja unohtumattoman kokemuksen, johon mahtuu jopa 25 henkeä kun varaat molemmat lautat. Myös synttärit, tyky-päivät ja yritystilaisuudet onnistuvat loistavasti merellä.

Saunalauttaristeilyt toimivat toukokuusta syyskuuhun ja lähtevät Kalkkihiekantorilta Vuosaaresta. Kokeneella tiimillämme on kahdeksan vuoden kokemus saunalauttojen operoinnista Helsingissä, joten voitte luottaa siihen, että kaikki sujuu moitteettomasti.

Saunalauttaristeilyn hinta alkaa 150 €/tunti, ja minimivaraus on 3 tuntia. Hintaan sisältyy kapteeni, puulämmitteinen sauna, Weber-grilli, jäät juomille, wc ja musiikkijärjestelmä. Omat eväät ja juomat ovat tervetulleita!`,
};

export const useCases = [
  {
    id: 'company',
    title: 'Yritystilaisuudet',
    description: 'Virittäydy tiimipäivään tai juhlista kauden saavutuksia. Tarjoamme täydelliset puitteet yritystapahtumille, aina cateringista ohjelmaan.',
    image: '/images/gallery-company-event.jpg',
  },
  {
    id: 'celebration',
    title: 'Juhlat ja merkkipäivät',
    description: 'Syntymäpäivät, polttarit, valmistujaiset – mikä tahansa juhla kruunataan merellisellä saunaelämyksellä.',
    image: '/images/gallery-bbq.jpg',
  },
  {
    id: 'relax',
    title: 'Rentoutumista ystävien kanssa',
    description: 'Kokoa ystäväpiiri ja nauti yhteisestä saunapäivästä. Grilli kuumana, sauna lämpimänä ja meri kutsuu.',
    image: '/images/gallery-deck-chairs.jpeg',
  },
];

export const includedFeatures = [
  'Puulämmitteinen sauna',
  'Pyyhkeet',
  'Saunajuomat',
  'Grillausmahdollisuus',
  'WC-tilat',
  'Pelastusliivit',
  'Opastus saunomiseen',
  'Vakuutus',
];
