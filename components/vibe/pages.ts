import type { Locale } from './content';

export type VibeSlug =
  | 'avanto'
  | 'julkinen-sauna'
  | 'saunalauttaristeilyt'
  | 'tapahtumat'
  | 'sijainti'
  | 'meista'
  | 'ukk'
  | 'galleria';

export const vibeSlugs: VibeSlug[] = [
  'avanto',
  'julkinen-sauna',
  'saunalauttaristeilyt',
  'tapahtumat',
  'sijainti',
  'meista',
  'ukk',
  'galleria',
];

export interface VibeFeature {
  number: string;
  title: string;
  text: string;
}

export interface VibePriceRow {
  label: string;
  price: string;
  note: string;
}

export interface VibeFaqItem {
  question: string;
  answer: string;
}

export interface VibeCommunity {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  people: { name: string; role: string; note: string }[];
}

export interface VibePageData {
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroText: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  detailEyebrow: string;
  detailTitle: string;
  detailText: string;
  features: VibeFeature[];
  priceTitle?: string;
  prices?: VibePriceRow[];
  priceNote?: string;
  timelineTitle?: string;
  timeline?: VibeFeature[];
  timelineImage?: string;
  timelineImageAlt?: string;
  faqTitle?: string;
  faqs?: VibeFaqItem[];
  gallery?: { src: string; alt: string }[];
  mapTitle?: string;
  mapText?: string;
  community?: VibeCommunity;
}

const fi: Record<VibeSlug, VibePageData> = {
  avanto: {
    title: 'Yksityinen avantosauna Helsingissä | Hyvän Tuulen Sauna',
    description: 'Yksityinen sauna ja avantouinti Helsingissä: Aalto tai Virta, puulöylyt, avanto ja terassi vain teille.',
    eyebrow: 'Yksityinen sauna · Puotila',
    heroTitle: 'Vuokraa sauna kokonaan omalle porukalle. Sauno omaan tahtiin.',
    heroText: 'Varaa Aalto tai Virta kahdeksi tunniksi: puulöylyt, avanto ja terassi vain teille.',
    image: '/images/gallery-avanto-woman.webp',
    imageAlt: 'Talviuimari yksityisen saunan meren rannalla',
    ctaLabel: 'Varaa yksityinen sauna',
    ctaHref: '/avanto#varaus',
    detailEyebrow: 'Kaksi saunaa, ehkä Helsingin kovimmat?',
    detailTitle: 'Vuokraa sauna omaksesi',
    detailText: 'Saavu viisi minuuttia ennen vuoroa; kippari opastaa, jonka jälkeen saunot omaan tahtiisi.',
    features: [
      { number: '01', title: 'Aalto — tilaa isommalle porukalle', text: 'Enintään 10 henkeä synttäreille, tyky-päiville tai muulle yksityiselle tilaisuudelle.' },
      { number: '02', title: 'Virta — intiimimpi vaihtoehto', text: 'Enintään 6 henkeä perheelle tai kaveriporukalle.' },
      { number: '03', title: 'Avanto kuuluu aina hintaan', text: 'Puusauna, iso avanto, pukuhuone, WC ja terassi kuuluvat hintaan.' },
    ],
    priceTitle: 'Selkeä hinta. Hyvät löylyt.',
    prices: [
      { label: 'Aalto · enintään 10 hlö', price: 'alk. 140 € / 2 h', note: '2 h yksityisvuoro' },
      { label: 'Virta · enintään 6 hlö', price: 'alk. 120 € / 2 h', note: '2 h yksityisvuoro' },
      { label: 'Molemmat lautat', price: 'Kysy tarjous', note: 'Pikkujoulut ja isot tilaisuudet' },
    ],
    priceNote: 'Omat eväät ja juomat sallittu.',
    timelineTitle: 'Näin vuoro etenee',
    timeline: [
      { number: '01', title: 'Saavu rantaan', text: 'Meripellontie 11C; sauna on lämmin ja kippari valmiina.' },
      { number: '02', title: 'Sauna ja avanto', text: 'Kaksi tuntia löylyjä, avantoa ja vilvoittelua.' },
      { number: '03', title: 'Jatka päivää kevyemmin', text: 'Kokoonnu vielä terassille ennen lähtöä.' },
    ],
  },
  'julkinen-sauna': {
    title: 'Yleinen sauna ja talviuinti Helsingissä | Hyvän Tuulen Sauna',
    description: 'Yleinen sauna ja talviuinti Helsingissä: kaksi puusaunaa, ohjausta ja kaksituntiset vuorot Puotilassa.',
    eyebrow: 'Yleinen sauna · kaikki ovat tervetulleita',
    heroTitle: 'Yleiset saunavuorot Helsingissä, kaksi puusaunaa',
    heroText: 'Tule yksin tai yhdessä; pyyhe ja uikkarit riittävät. Yleiset vuorot läpi viikon.',
    image: '/images/gallery-avanto-woman.webp',
    imageAlt: 'Talviuinnin harrastaja meren äärellä',
    ctaLabel: 'Varaa paikka yleiselle vuorolle',
    ctaHref: '/julkinen-sauna',
    detailEyebrow: 'Helppo ensimmäinen kerta',
    detailTitle: 'Yleinen Sauna, uikkarit päälle',
    detailText: 'Talvikaudella opastamme talviuintiin; voit myös vain saunoa.',
    features: [
      { number: '01', title: 'Kaksi kuumaa puusaunaa', text: 'Kaksi saunaa, kaksi eri lämpötilaa. Kuumat pienessä, lempeät isossa.' },
      { number: '02', title: 'Ohjattua talviuintia', text: 'Opastamme ensikertalaisia talviuinnin pariin.' },
      { number: '03', title: 'Pieni hinta, iso elämys', text: 'Yleinen vuoro 15 € / 2 h; opiskelijat ja eläkeläiset 12,50 €.' },
    ],
    priceTitle: 'Reilut hinnat, niin kuin kuuluukin',
    prices: [
      { label: 'Yleinen vuoro', price: '15 € / 2 h', note: 'Sauna, avanto ja ohjaus sisältyvät' },
      { label: 'Opiskelijat ja eläkeläiset', price: '12,50 € / 2 h', note: 'Alle 15-vuotiaat samaan hintaan' },
      { label: 'Sarjakortit', price: '55 € / 90 €', note: '5× tai 10× -sarjakortti' },
    ],
    priceNote: 'Omat grillattavat eivät kuulu yleiselle vuorolle; saunamajurit hoitavat grilin ja tarjoilun.',
    timelineTitle: 'Ekalla kertaa näin',
    timeline: [
      { number: '01', title: 'Varaa paikkasi', text: 'Valitse vuoro kalenterista; paikkoja on rajoitetusti.' },
      { number: '02', title: 'Tule Meripellontielle', text: 'Saavu muutama minuutti etukäteen; lähellä on 4 h kiekkopaikkoja ja julkisen liikenteen pysäkki.' },
      { number: '03', title: 'Löyly, avanto, toisto', text: 'Aloita saunasta tai avannosta ja etene rauhassa.' },
    ],
  },
  saunalauttaristeilyt: {
    title: 'Saunalauttaristeilyt Helsingissä | Hyvän Tuulen Sauna',
    description: 'Saunalauttaristeily Helsingissä Aallolla tai Virralla: löylyt, uinti ja grillaus saaristossa.',
    eyebrow: 'Saunalauttaristeilyt · kesä merellä',
    heroTitle: 'Kesä vietetään vesillä.',
    heroText: 'Varaa Aalto tai Virta omalle porukalle ja lähde puulöylyille Itä-Helsingin saaristoon.',
    image: '/images/hero-raft-dusk.webp',
    imageAlt: 'Saunalautta auringonlaskussa',
    ctaLabel: 'Varaa saunalauttaristeily',
    ctaHref: '/saunalauttaristeilyt-helsingissa#varaus',
    detailEyebrow: 'Aalto ja Virta',
    detailTitle: 'Risteily on enemmän kuin sauna.',
    detailText: 'Kapteeni vie teidät Kalkkihiekantorilta Itä-Helsingin saaristoon; te saunotte, uitte ja grillaatte.',
    features: [
      { number: '01', title: 'Aalto — kelluva oleskelutila', text: 'Enintään 12 henkeä; Harvia-kiuas, iso terassi, Weber-grilli, SUP-laudat ja veneajelu lisänä.' },
      { number: '02', title: 'Virta — rennompi saunaretki', text: 'Enintään 10 henkeä; kattoterassi, puusauna ja rauhallinen risteily lähisaaristossa.' },
      { number: '03', title: 'Omat eväät ja juomat ovat tervetulleita', text: 'Grilli, jäät ja musiikkijärjestelmä ovat valmiina; catering ja aktiviteetit lisänä.' },
    ],
    priceTitle: 'Koko lautta vain teille.',
    prices: [
      { label: 'Aalto', price: 'alk. 225 € / 2 h', note: 'Max 12 henkeä' },
      { label: 'Virta', price: 'alk. 225 € / 2 h', note: 'Max 10 henkeä' },
      { label: 'Molemmat lautat yhdessä', price: 'Kysy tarjous', note: 'Jopa 25 hengen kokonaisuus' },
    ],
    priceNote: 'Minimivaraus on kaksi tuntia. Illat ja viikonloput hinnoitellaan erikseen.',
    timelineTitle: 'Risteilyn kolme vaihetta',
    timeline: [
      { number: '01', title: 'Lähde', text: 'Tapaaminen Kalkkihiekantorin laiturilla. Kapteeni ja sauna ovat valmiina.' },
      { number: '02', title: 'Ajele', text: 'Pysähdy uimaan tai nauti saaristomaisemasta.' },
      { number: '03', title: 'Palaa', text: 'Palaa rantaan ja viihdy vielä terassilla.' },
    ],
  },
  tapahtumat: {
    title: 'Polttarit, synttärit ja yritystilaisuudet | Hyvän Tuulen Sauna',
    description: 'Koko saunalautta vain teille. Polttarit, pikkujoulut, synttärit ja tyky-päivät Helsingin saaristossa.',
    eyebrow: 'Tilaisuudet · vain oma porukka',
    heroTitle: 'Juhlat, joissa ei tarvitse istua paikoillaan.',
    heroText: 'Polttarit, synttärit, pikkujoulut tai tyky-päivä: löylyt, uinti ja ruoka omassa rauhassa.',
    image: '/images/gallery-sauna-group.webp',
    imageAlt: 'Seurue saunomassa puulämmitteisessä saunassa',
    timelineImage: '/images/gallery-bbq.webp',
    timelineImageAlt: 'Eväitä valmistumassa saunalautan grillissä',
    ctaLabel: 'Kysy tilaisuutta porukallesi',
    ctaHref: 'tel:+358442313546',
    detailEyebrow: 'Tilaisuus ilman pakotettua ohjelmaa',
    detailTitle: 'Me hoidamme tilan. Te päätätte päivän.',
    detailText: 'Pidä pelkät löylyt tai lisää ruokaa, grillausta, uintia ja veneajelua.',
    features: [
      { number: '01', title: 'Polttarit ja synttärit', text: 'Koko lautta on teidän, eväät ja musiikki ovat omia.' },
      { number: '02', title: 'Tyky-päivät ja virkistys', text: 'Puhetta lauteilla, vilvoittelua merellä ja tauko kalenterista.' },
      { number: '03', title: 'Pikkujoulut ja isot kokoukset', text: 'Varaa Aalto, Virta tai molemmat ja tilaa pizzat naapurin pizzeriasta.' },
    ],
    timelineTitle: 'Näin tilaisuus rakentuu',
    timeline: [
      { number: '01', title: 'Kerro porukan koko', text: 'Kerro porukan koko, niin ehdotamme saunan ja ajan.' },
      { number: '02', title: 'Valitse lisät maistuvat', text: 'Catering, grilli, SUP tai veneajelu — vain jos ne sopivat teidän päivään.' },
      { number: '03', title: 'Tule juhlistamaan', text: 'Kapteeni ja tila ovat valmiina; teidän tarvitsee vain tulla.' },
    ],
  },
  sijainti: {
    title: 'Sijainti ja saapumisohjeet | Hyvän Tuulen Sauna',
    description: 'Hyvän Tuulen Sauna: talvella Meripellontie 11C Puotilassa, kesällä Kalkkihiekantori Aurinkolahdessa.',
    eyebrow: 'Sijainti · helppo saapua',
    heroTitle: 'Kaupunki jää taakse. Meri alkaa tästä.',
    heroText: 'Talvella Meripellontie 11C Puotilassa; kesällä risteilyt lähtevät Kalkkihiekantorilta Aurinkolahdesta.',
    image: '/images/location-map.png',
    imageAlt: 'Hyvän Tuulen Saunan sijainti kartalla',
    ctaLabel: 'Avaa reitti Google Mapsissa',
    ctaHref: 'https://maps.app.goo.gl/VtS6aSXd3hxFEPxH6',
    detailEyebrow: 'Näin pääset perille',
    detailTitle: 'Helppo tulla autolla tai julkisilla.',
    detailText: 'Saavu muutama minuutti ennen vuoroa; sauna ja kippari ovat valmiina.',
    features: [
      { number: '01', title: 'Autolla', text: 'Jätä auto Meripellontien varteen maksuttomalle neljän tunnin kiekkopaikalle.' },
      { number: '02', title: 'Julkisilla', text: 'Bussi pysähtyy Meripellontien vieressä; Rastilan metrosta kävelet noin 15 minuuttia.' },
      { number: '03', title: 'Kesäisin Aurinkolahteen', text: 'Kävele lyhyt matka Aurinkolahden metrosta Kalkkihiekantorin risteilylaiturille.' },
    ],
    mapTitle: 'Meripellontie 11C, 00970 Helsinki',
    mapText: 'Puotilan laituri on meren äärellä; tarvittaessa soita 044 231 3546.',
  },
  meista: {
    title: 'Meidän tarinamme | Hyvän Tuulen Sauna',
    description: 'Kelluvia saunaelämyksiä Helsingissä vuodesta 2018: puulöylyt, meri ja paikallinen yhteisö.',
    eyebrow: 'Meidät · vuodesta 2018',
    heroTitle: 'Sauna on meidän tapa tuoda ihmiset yhteen.',
    heroText: 'Hyvät löylyt, meri ja rento seura ovat riittäneet vuodesta 2018.',
    image: '/images/crew-founders.webp',
    imageAlt: 'Hyvän Tuulen Saunan perustajat',
    ctaLabel: 'Tule saunomaan',
    ctaHref: '/julkinen-sauna',
    detailEyebrow: 'Tampereelta ja Helsingistä samoille lauteille',
    detailTitle: 'Kippari Kalle ja kaksoset.',
    detailText: 'Kalle oppi kipparin hommat Tampereella, Onni ja Ilmari laskivat saunat vesille Helsingissä, ja vuonna 2022 yhteistyö alkoi.',
    features: [
      { number: '01', title: 'Aito sauna ennen kaikkea', text: 'Puusauna, hyvät löylyt ja reilu hinta ovat säilyneet alusta asti.' },
      { number: '02', title: 'Yhteisö lauteiden ympärille', text: 'Rentoimme yhdessä hyvällä meiningillä, joskus vähän villimminkin.' },
      { number: '03', title: 'Hyvän Tuulen Sauna vuodesta 2024', text: 'Vuonna 2024 nimeksi tuli Hyvän Tuulen Sauna; toiminta pysyi samana.' },
    ],
    timelineTitle: 'Arvot, joita emme luovu',
    timeline: [
      { number: '01', title: 'Reiluus', text: 'Selkeät hinnat, ei piilokuluja.' },
      { number: '02', title: 'Laatu ilman ylimääräistä', text: 'Kuumat löylyt, meri ja hyvä seura ilman eksklusiivisuutta.' },
      { number: '03', title: 'Ihmiset ensin', text: 'Tervetuloa sellaisena kuin olet — ensikertalainen tai vanha tuttu.' },
    ],
    community: {
      eyebrow: 'Ihmiset lauteilla',
      title: 'Pieni tiimi, paljon sydäntä.',
      text: 'Paikallinen tiimi opastaa ensimmäiseen avantoon ja kertoo meren äären vinkit.',
      image: '/images/crew2.webp',
      imageAlt: 'Hyvän Tuulen Saunan tiimi yhdessä',
      people: [
        { name: 'Kalle', role: 'Kippari', note: 'Kalle oppi kipparin hommat Tampereen kelluvilla saunoilla ja liittyi mukaan Helsingissä vuonna 2022.' },
        { name: 'Onni & Ilmari', role: 'Kaksoset ja vanhemmat purjehtijat', note: 'He laskivat ensimmäiset saunat vesille Itä-Helsingissä; kahdeksatta vuotta samoilla vesillä, paikalliset polut ja sää tuttuina.' },
        { name: 'Tuure', role: 'Kesän nuorin vahvistus', note: 'Toinen kesä lautoilla, hyvä meininki ja apua tarvittaessa.' },
      ],
    },
  },
  ukk: {
    title: 'Usein kysyttyä saunasta | Hyvän Tuulen Sauna',
    description: 'Vastaukset saunavarauksiin, hinnoitteluun, avantoihin ja mukaan otettaviin tavaroihin.',
    eyebrow: 'Usein kysyttyä · käytännön asiat',
    heroTitle: 'Hyvä tietää ennen rantaa.',
    heroText: 'Mitä mukaan ja miten avanto toimii? Tässä käytännön vastaukset.',
    image: '/images/gallery-sauna-interior.webp',
    imageAlt: 'Puulämmitteisen saunan sisätila',
    ctaLabel: 'Katso vapaat vuorot',
    ctaHref: '/julkinen-sauna',
    detailEyebrow: 'Kysy ja sauno',
    detailTitle: 'Vastauksia ennen ensimmäistä kertaa.',
    detailText: 'Jos et löydä vastausta omaan kysymykseesi, soita 044 231 3546 tai laita viestiä info@hyvantuulensauna.fi.',
    features: [],
    faqTitle: 'Useimmin kysytyt',
    faqs: [
      { question: 'Mitä otan mukaan saunaan?', answer: 'Pyyhe, uimapuku ja juomapullo riittävät; ota lisäksi sandaalit ja sään mukainen vaatetus. Talviuinnissa sukat ja hanskat ovat vapaaehtoisia.' },
      { question: 'Pitääkö minun osata uida?', answer: 'Vahvaa uintitaitoa ei tarvita; henkilökunta opastaa ja kaikki etenee omaan tahtiin.' },
      { question: 'Mistä saunavuoro lähtee?', answer: 'Talvella Meripellontie 11C Puotilassa; kesällä risteilyt Kalkkihiekantorilta Aurinkolahdesta.' },
      { question: 'Saako omat eväät ja juomat ottaa mukaan?', answer: 'Yksityisillä vuoroilla kyllä; yleisellä vuorolla saunamajurit hoitavat grilin ja tarjoilun.' },
      { question: 'Onko saunalla WC ja pukuhuone?', answer: 'Kyllä, käytössäsi ovat pukuhuone, WC ja terassi.' },
      { question: 'Miten sarjakortti toimii?', answer: 'Sähköpostisi tunnistaa sarjakortin varauksessa, ja käynti vähennetään automaattisesti.' },
    ],
  },
  galleria: {
    title: 'Tunnelmia saunalautoilta | Hyvän Tuulen Sauna',
    description: 'Aallon ja Virran saunat, avannot ja meri Hyvän Tuulen Saunalla kesältä ja talvelta.',
    eyebrow: 'Galleria · hetkiä merellä',
    heroTitle: 'Löylyä, valoa ja vähän vilvoittelua.',
    heroText: 'Aallon ja Virran kesäillat ja talviavannot kuvina.',
    image: '/images/gallery-sunset-raft.webp',
    imageAlt: 'Saunalautta auringonlaskussa',
    ctaLabel: 'Koe itse paikan päällä',
    ctaHref: '/avanto#varaus',
    detailEyebrow: 'Tunnelmia lautoilta',
    detailTitle: 'Kesä ja talvi samassa maisemassa.',
    detailText: 'Vuodenajat vaihtuvat; sauna ja meri pysyvät.',
    features: [],
    gallery: [
      { src: '/images/gallery-winter-sunset.webp', alt: 'Saunalautta talvisessa auringonlaskussa' },
      { src: '/images/hero-raft-dusk.webp', alt: 'Kesäinen saunalautta illalla' },
      { src: '/images/gallery-avanto-woman.webp', alt: 'Talviuinnin harrastaja meren äärellä' },
      { src: '/images/gallery-sauna-interior.webp', alt: 'Puulämmitteisen saunan sisätila' },
      { src: '/images/gallery-winter-dock.webp', alt: 'Lumen peittämä laituri' },
      { src: '/images/gallery-sup-boards.webp', alt: 'SUP-lautoja saunalautan vieressä' },
      { src: '/images/gallery-bbq.webp', alt: 'Grillausta saunalautalla' },
      { src: '/images/gallery-sauna-group.webp', alt: 'Porukka saunomassa lauteilla' },
    ],
  },
};

const en: Record<VibeSlug, VibePageData> = {
  avanto: {
    title: 'Private ice sauna in Helsinki | Hyvän Tuulen Sauna',
    description: 'Private sauna and ice swimming in Helsinki: Aalto or Virta, wood-fired löyly, an ice hole and a terrace just for you.',
    eyebrow: 'Private sauna · Puotila',
    heroTitle: 'Rent a sauna entirely for your group. Sauna at your own pace.',
    heroText: 'Book Aalto or Virta for two hours: wood-fired löyly, an ice hole and a terrace just for you.',
    image: '/images/gallery-avanto-woman.webp',
    imageAlt: 'A winter swimmer beside the private sauna by the sea',
    ctaLabel: 'Book a private sauna',
    ctaHref: '/en/ice-swimming-sauna-helsinki/#varaus',
    detailEyebrow: 'Two saunas, perhaps Helsinki’s hottest?',
    detailTitle: 'Rent the sauna for yourselves',
    detailText: 'Arrive five minutes early; your host gets you started, then you set the pace.',
    features: [
      { number: '01', title: 'Aalto — room for a bigger group', text: 'Up to 10 people for birthdays, team days or another private occasion.' },
      { number: '02', title: 'Virta — the intimate option', text: 'Up to 6 people for family or friends.' },
      { number: '03', title: 'The ice hole is included', text: 'Wood-fired sauna, large ice hole, changing room, WC and terrace are included.' },
    ],
    priceTitle: 'Clear pricing. Good löyly.',
    prices: [
      { label: 'Aalto · up to 10 people', price: 'from 140 € / 2 h', note: '2-hour private session' },
      { label: 'Virta · up to 6 people', price: 'from 120 € / 2 h', note: '2-hour private session' },
      { label: 'Both rafts', price: 'Ask for an offer', note: 'Christmas parties and large events' },
    ],
    priceNote: 'Bring your own food and drinks.',
    timelineTitle: 'How your visit unfolds',
    timeline: [
      { number: '01', title: 'Arrive at the shore', text: 'Meripellontie 11C; the sauna is warm and your host is ready.' },
      { number: '02', title: 'Sauna and ice hole', text: 'Two hours of löyly, the ice hole and cooling off.' },
      { number: '03', title: 'Leave a little lighter', text: 'Gather on the terrace before heading home.' },
    ],
  },
  'julkinen-sauna': {
    title: 'Public sauna and winter swimming in Helsinki | Hyvän Tuulen Sauna',
    description: 'Public sauna and winter swimming in Helsinki: two wood-fired saunas, guidance and two-hour sessions in Puotila.',
    eyebrow: 'Public sauna · everyone is welcome',
    heroTitle: 'Public sauna sessions in Helsinki, two wood-fired saunas',
    heroText: 'Come alone or together; a towel and swimwear are enough. Public sessions run throughout the week.',
    image: '/images/gallery-avanto-woman.webp',
    imageAlt: 'A winter swimmer by the sea',
    ctaLabel: 'Book a public session',
    ctaHref: '/en/public-sauna-helsinki/',
    detailEyebrow: 'An easy first time',
    detailTitle: 'Public sauna, swimwear on',
    detailText: 'In winter, we guide your first dip; you can also just enjoy the sauna.',
    features: [
      { number: '01', title: 'Two hot wood-fired saunas', text: 'Two saunas, two temperatures. Hotter in the small one, gentler in the large one.' },
      { number: '02', title: 'Guided winter swimming', text: 'We guide first-timers through winter swimming.' },
      { number: '03', title: 'Small price, big experience', text: 'Public session 15 € / 2 h; students and pensioners 12.50 €.' },
    ],
    priceTitle: 'Fair prices, just as they should be.',
    prices: [
      { label: 'Public session', price: '15 € / 2 h', note: 'Sauna, ice hole and guidance included' },
      { label: 'Students and pensioners', price: '12.50 € / 2 h', note: 'Children under 15 at the same price' },
      { label: 'Punch cards', price: '55 € / 90 €', note: '5× or 10× punch card' },
    ],
    priceNote: 'Own barbecue food is not part of public sessions; our sauna hosts handle the grill and serving.',
    timelineTitle: 'Your first visit, like this',
    timeline: [
      { number: '01', title: 'Book your spot', text: 'Choose a session in the calendar; spots are limited.' },
      { number: '02', title: 'Come to Meripellontie', text: 'Arrive a few minutes early; four-hour parking and public transport stops are nearby.' },
      { number: '03', title: 'Löyly, dip, repeat', text: 'Start with the sauna or ice hole and go at your own pace.' },
    ],
  },
  saunalauttaristeilyt: {
    title: 'Sauna boat cruises in Helsinki | Hyvän Tuulen Sauna',
    description: 'Sauna boat cruise in Helsinki on Aalto or Virta: löyly, swimming and grilling in the archipelago.',
    eyebrow: 'Sauna boat cruises · summer at sea',
    heroTitle: 'Summer is spent on the water.',
    heroText: 'Book Aalto or Virta for your group and head for wood-fired löyly in the Eastern Helsinki archipelago.',
    image: '/images/hero-raft-dusk.webp',
    imageAlt: 'A sauna boat at sunset',
    ctaLabel: 'Book a sauna boat cruise',
    ctaHref: '/en/sauna-boat-cruises-helsinki/#varaus',
    detailEyebrow: 'Aalto and Virta',
    detailTitle: 'A cruise is more than a sauna.',
    detailText: 'Your captain takes you from Kalkkihiekantori to the Eastern Helsinki archipelago; you sauna, swim and grill.',
    features: [
      { number: '01', title: 'Aalto — a floating living room', text: 'Up to 12 people; Harvia stove, large terrace, Weber grill, SUP boards and an optional boat ride.' },
      { number: '02', title: 'Virta — a slower sauna trip', text: 'Up to 10 people; rooftop terrace, wood-fired sauna and a quieter cruise through the nearby islands.' },
      { number: '03', title: 'Bring your own food and drinks', text: 'Grill, ice and sound system are ready; catering and activities are optional.' },
    ],
    priceTitle: 'The whole raft is yours.',
    prices: [
      { label: 'Aalto', price: 'from 225 € / 2 h', note: 'Up to 12 people' },
      { label: 'Virta', price: 'from 225 € / 2 h', note: 'Up to 10 people' },
      { label: 'Both rafts together', price: 'Ask for an offer', note: 'Up to 25 people' },
    ],
    priceNote: 'Minimum booking two hours. Evening and weekend pricing varies.',
    timelineTitle: 'Three parts of a cruise',
    timeline: [
      { number: '01', title: 'Depart', text: 'Meet at Kalkkihiekantori pier. Your captain and the sauna are ready.' },
      { number: '02', title: 'Drift', text: 'Stop for a swim or enjoy the archipelago view.' },
      { number: '03', title: 'Return', text: 'Return to shore and linger on the terrace.' },
    ],
  },
  tapahtumat: {
    title: 'Bachelor parties, birthdays and company events | Hyvän Tuulen Sauna',
    description: 'The whole floating sauna just for you. Bachelor parties, Christmas parties, birthdays and team days in the Helsinki archipelago.',
    eyebrow: 'Occasions · your group only',
    heroTitle: 'A party without assigned seats.',
    heroText: 'Bachelor parties, birthdays, Christmas parties or a team day: löyly, swimming and food in privacy.',
    image: '/images/gallery-sauna-group.webp',
    imageAlt: 'A group enjoying a wood-fired sauna together',
    timelineImage: '/images/gallery-bbq.webp',
    timelineImageAlt: 'Food cooking on the sauna boat grill',
    ctaLabel: 'Ask about your event',
    ctaHref: 'tel:+358442313546',
    detailEyebrow: 'No forced programme',
    detailTitle: 'We provide the space. You own the day.',
    detailText: 'Keep just the löyly or add food, grilling, swimming and a boat ride.',
    features: [
      { number: '01', title: 'Bachelor parties and birthdays', text: 'The whole raft is yours, with your own food and music.' },
      { number: '02', title: 'Team and wellness days', text: 'Conversation on the benches, a dip in the sea and a break from the calendar.' },
      { number: '03', title: 'Christmas parties and larger groups', text: 'Book Aalto, Virta or both and order pizza from our neighbouring pizzeria.' },
    ],
    timelineTitle: 'How your event comes together',
    timeline: [
      { number: '01', title: 'Tell us your group size', text: 'Tell us your group size and we will suggest a sauna and time.' },
      { number: '02', title: 'Choose your extras', text: 'Catering, grill, SUP or a boat ride — only if they fit your day.' },
      { number: '03', title: 'Come and celebrate', text: 'Your captain and space are ready; all you need to do is arrive.' },
    ],
  },
  sijainti: {
    title: 'Location and directions | Hyvän Tuulen Sauna',
    description: 'Hyvän Tuulen Sauna: Meripellontie 11C in Puotila in winter, Kalkkihiekantori in Aurinkolahti in summer.',
    eyebrow: 'Location · easy to reach',
    heroTitle: 'The city ends here. The sea begins.',
    heroText: 'In winter, find us at Meripellontie 11C in Puotila; summer cruises depart from Kalkkihiekantori in Aurinkolahti.',
    image: '/images/location-map.png',
    imageAlt: 'Hyvän Tuulen Sauna on the map',
    ctaLabel: 'Open route in Google Maps',
    ctaHref: 'https://maps.app.goo.gl/VtS6aSXd3hxFEPxH6',
    detailEyebrow: 'Getting here',
    detailTitle: 'Easy by car or public transport.',
    detailText: 'Arrive a few minutes early; your host and sauna will be ready.',
    features: [
      { number: '01', title: 'By car', text: 'Park along Meripellontie in a free four-hour disc parking space.' },
      { number: '02', title: 'By public transport', text: 'Buses stop beside Meripellontie; Rastila metro is about a 15-minute walk away.' },
      { number: '03', title: 'Aurinkolahti in summer', text: 'Walk the short distance from Aurinkolahti metro to the cruise pier at Kalkkihiekantori.' },
    ],
    mapTitle: 'Meripellontie 11C, 00970 Helsinki',
    mapText: 'Puotila pier is by the sea; call +358 442313546 if you need help.',
  },
  meista: {
    title: 'Our story | Hyvän Tuulen Sauna',
    description: 'Floating sauna experiences in Helsinki since 2018: wood-fired löyly, the sea and a local community.',
    eyebrow: 'Our way · since 2018',
    heroTitle: 'Sauna is our way of bringing people together.',
    heroText: 'Good löyly, the sea and relaxed company have been enough since 2018.',
    image: '/images/crew-founders.webp',
    imageAlt: 'The founders of Hyvän Tuulen Sauna',
    ctaLabel: 'Come and sauna',
    ctaHref: '/en/public-sauna-helsinki/',
    detailEyebrow: 'From Tampere and Helsinki to the same benches',
    detailTitle: 'Captain Kalle and the twins.',
    detailText: 'Kalle learned the captain’s craft in Tampere, Onni and Ilmari launched the saunas in Helsinki, and their collaboration began in 2022.',
    features: [
      { number: '01', title: 'Real sauna first', text: 'Wood-fired sauna, great löyly and fair prices have stayed since day one.' },
      { number: '02', title: 'Community around the benches', text: 'We bring people together with a relaxed, sometimes slightly wild spirit.' },
      { number: '03', title: 'Hyvän Tuulen Sauna since 2024', text: 'In 2024 we became Hyvän Tuulen Sauna; the experience stayed the same.' },
    ],
    timelineTitle: 'Values we keep',
    timeline: [
      { number: '01', title: 'Fairness', text: 'Clear prices, no hidden costs.' },
      { number: '02', title: 'Quality without fuss', text: 'Hot löyly, the sea and good company without exclusivity.' },
      { number: '03', title: 'People first', text: 'Come as you are — first timer or old friend.' },
    ],
    community: {
      eyebrow: 'The people on the benches',
      title: 'A small crew with a lot of heart.',
      text: 'Our local crew guides your first dip and shares tips for the sea.',
      image: '/images/crew2.webp',
      imageAlt: 'The Hyvän Tuulen Sauna crew together',
      people: [
        { name: 'Kalle', role: 'Captain', note: 'Kalle learned the craft on Tampere’s floating saunas and joined the Helsinki crew in 2022.' },
        { name: 'Onni & Ilmari', role: 'Twins and the original skippers', note: 'They launched the first saunas in East Helsinki; eight seasons on these waters have made the local routes and weather familiar.' },
        { name: 'Tuure', role: 'The crew’s newest energy', note: 'His second summer on the rafts, with good spirit and help when you need it.' },
      ],
    },
  },
  ukk: {
    title: 'Sauna FAQ | Hyvän Tuulen Sauna',
    description: 'Practical answers about sauna bookings, prices, ice holes and what to bring.',
    eyebrow: 'FAQ · practical things',
    heroTitle: 'Good to know before the shore.',
    heroText: 'What should you bring and how does the ice hole work? Here are the practical answers.',
    image: '/images/gallery-sauna-interior.webp',
    imageAlt: 'Inside a wood-fired sauna',
    ctaLabel: 'See available sessions',
    ctaHref: '/en/public-sauna-helsinki/',
    detailEyebrow: 'Ask, then sauna',
    detailTitle: 'Answers for your first visit.',
    detailText: 'If your question is not here, call +358 442313546 or email info@hyvantuulensauna.fi.',
    features: [],
    faqTitle: 'Frequently asked',
    faqs: [
      { question: 'What should I bring?', answer: 'A towel, swimwear and water bottle are enough; add sandals and weather-appropriate clothing. Winter swimming socks and gloves are optional.' },
      { question: 'Do I need to be a good swimmer?', answer: 'Strong swimming skills are not needed; our team guides you at your own pace.' },
      { question: 'Where does the session start?', answer: 'Winter: Meripellontie 11C in Puotila; summer cruises: Kalkkihiekantori in Aurinkolahti.' },
      { question: 'Can we bring our own food and drinks?', answer: 'Yes for private sessions; on public sessions our sauna hosts handle the grill and serving.' },
      { question: 'Is there a WC and changing room?', answer: 'Yes, you have a changing room, WC and terrace.' },
      { question: 'How does a punch card work?', answer: 'Your email identifies your punch card during booking, and one visit is deducted automatically.' },
    ],
  },
  galleria: {
    title: 'Sauna boat gallery | Hyvän Tuulen Sauna',
    description: 'Summer and winter at Hyvän Tuulen Sauna: Aalto and Virta’s saunas, ice holes and sea.',
    eyebrow: 'Gallery · moments at sea',
    heroTitle: 'Löyly, light and a little cool down.',
    heroText: 'See Aalto and Virta through summer evenings and winter ice holes.',
    image: '/images/gallery-sunset-raft.webp',
    imageAlt: 'A sauna boat at sunset',
    ctaLabel: 'Experience it yourself',
    ctaHref: '/en/ice-swimming-sauna-helsinki/#varaus',
    detailEyebrow: 'Life on the rafts',
    detailTitle: 'Summer and winter, same sea.',
    detailText: 'Seasons change; the sauna and sea remain.',
    features: [],
    gallery: [
      { src: '/images/gallery-winter-sunset.webp', alt: 'A floating sauna in winter sunset' },
      { src: '/images/hero-raft-dusk.webp', alt: 'A summer sauna boat in the evening' },
      { src: '/images/gallery-avanto-woman.webp', alt: 'A winter swimmer by the sea' },
      { src: '/images/gallery-sauna-interior.webp', alt: 'Inside the wood-fired sauna' },
      { src: '/images/gallery-winter-dock.webp', alt: 'A snowy dock' },
      { src: '/images/gallery-sup-boards.webp', alt: 'SUP boards beside the sauna boat' },
      { src: '/images/gallery-bbq.webp', alt: 'Grilling on a floating sauna' },
      { src: '/images/gallery-sauna-group.webp', alt: 'Friends on the sauna benches' },
    ],
  },
};

export function getVibePage(slug: VibeSlug, locale: Locale): VibePageData {
  return locale === 'en' ? en[slug] : fi[slug];
}
