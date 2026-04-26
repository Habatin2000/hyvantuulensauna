import { FAQItem } from '@/types';

export const faqItems: FAQItem[] = [
  // Summer page specific - NEW
  {
    id: 'departure',
    question: 'Mistä saunalautat lähtevät liikenteeseen Helsingissä?',
    answer: 'Saunalautat lähtevät Kalkkihiekantorilta Vuosaaresta. Tarkka osoite on Kalkkihiekantori, 00980 Helsinki. Paikalle pääsee helposti metrolla (Vuosaaren asema) tai autolla – alueella on 4 tunnin kiekollinen pysäköinti. Kalkkihiekantori sijaitsee Aurinkolahden rannassa, ja sieltä on lyhyt kävelymatka lähtöpaikalle.',
    category: 'summer',
  },
  {
    id: 'own-food',
    question: 'Saako saunalautalle ottaa omat juomat ja ruoat?',
    answer: 'Kyllä, omat eväät ovat sallittuja ja suositeltuja! Saunalautalla on Weber-grilli käytössänne ja jäät juomien viilentämiseen tulevat mukana. Tarjoamme myös catering-palveluita, kuten grilliburgereita – kysy lisää varatessasi.',
    category: 'summer',
  },
  {
    id: 'what-to-bring',
    question: 'Mitä tarvitsen mukaan saunalauttaristeilylle?',
    answer: 'Ota mukaan omat pyyhkeet, uima-asu ja säähän sopiva vaatetus. Pyyhkeitä voi myös vuokrata meiltä (5 €/kpl). Kaikki muu löytyy lautalta – sauna, grilli, kajarit ja hyvä tunnelma!',
    category: 'summer',
  },
  {
    id: 'crew',
    question: 'Onko saunalautalla henkilökuntaa mukana?',
    answer: 'Kyllä! Jokaisella saunalauttaristeilyllä on mukana koulutettu kippari, joka hoitaa navigoinnin ja auttaa teitä koko risteilyn ajan. Voitte keskittyä nauttimaan saunomisesta, uimisesta ja seurasta – kippari huolehtii lopusta.',
    category: 'summer',
  },
  {
    id: 'wc',
    question: 'Onko saunalautoilla wc?',
    answer: 'Kyllä, molemmilla saunalautoilla (Aalto ja Virta) on oma wc. Lisäksi Aalto-lautalla on erillinen pukuhuone, joten vaihtaminen käy kätevästi.',
    category: 'summer',
  },
  {
    id: 'price',
    question: 'Paljonko saunalautan vuokraus Helsingissä maksaa?',
    answer: 'Saunalautan vuokraus alkaa 150 €/tunti. Minimivaraus on 3 tuntia, eli kokonaishinta alkaen 450 €. Hintaan sisältyy saunalautta kapteeneineen, puulämmitteinen sauna, Weber-grilli, jäät juomille, wc ja musiikkijärjestelmä. Saunalauttaristeilyn hinta on sama molemmille lautoille.',
    category: 'summer',
  },
  {
    id: 'bachelor',
    question: 'Sopiiko saunalautta polttareihin tai yritystilaisuuksiin?',
    answer: 'Ehdottomasti! Saunalauttaristeilyt ovat yksi suosituimmista tavoista järjestää polttarit, synttärit tai tyky-päivä Helsingissä. Vuokraamalla molemmat lautat (Aalto + Virta) voitte järjestää tilaisuuden jopa 25 hengelle. Ota yhteyttä, niin räätälöidään teille sopiva paketti!',
    category: 'summer',
  },
  
  // General
  {
    id: 'what-is',
    question: 'Mikä on Hyvän Tuulen Sauna?',
    answer: 'Hyvän Tuulen Sauna on merellinen saunaelämys Helsingissä. Tarjoamme saunomismahdollisuuksia perinteisissä saunalautoissamme Aallossa ja Virrassa. Kesäisin toimimme kelluvina saunoina merellä, ja talvisin tarjoamme myös avantouintimahdollisuuksia.',
    category: 'general',
  },
  {
    id: 'where-located',
    question: 'Missä saunanne sijaitsee?',
    answer: 'Saunalauttamme lähtevät Kalkkihiekantorilta Vuosaaresta, osoitteesta Kalkkihiekantori, 00980 Helsinki. Paikalle pääsee helposti metrolla (Vuosaaren asema) tai autolla.',
    category: 'general',
  },
  {
    id: 'bring-own',
    question: 'Mitä minun pitää tuoda mukana?',
    answer: 'Ota mukaan omat pyyhkeet ja uima-asu. Pyyhkeitä voi myös vuokrata meiltä (5 €/kpl). Omat eväät ja juomat ovat tervetulleita – meiltä löytyy Weber-grilli ja jäät juomille.',
    category: 'general',
  },
  
  // Private
  {
    id: 'private-booking',
    question: 'Miten varaan yksityisen saunavuoron?',
    answer: 'Voit varata yksityisen saunavuoron verkkosivujemme kautta tai ottamalla yhteyttä meihin sähköpostitse tai puhelimitse. Suosittelemme varaamista vähintään viikkoa etukäteen, erityisesti viikonloppuisin.',
    category: 'private',
  },
  {
    id: 'private-duration',
    question: 'Kuinka pitkä on yksityinen saunavuoro?',
    answer: 'Standardivuoro kestää 3 tuntia (minimivaraus). Voit myös varata pidemmän risteilyn. Ota yhteyttä, niin räätälöidään juuri teille sopiva paketti.',
    category: 'private',
  },
  {
    id: 'private-events',
    question: 'Sopivatko saunat yritystilaisuuksiin?',
    answer: 'Kyllä! Saunamme ovat erinomaisia yritystilaisuuksiin, tiimipäiviin ja asiakastapahtumiin. Tarjoamme myös lisäpalveluja, kuten cateringin ja ohjelmaa. Ota yhteyttä, niin suunnitellaan yhdessä täydellinen tilaisuus.',
    category: 'private',
  },
  
  // Public
  {
    id: 'public-when',
    question: 'Milloin julkiset saunavuorot ovat?',
    answer: 'Julkiset saunavuorot järjestetään joka sunnuntai 10-16. Vuoroja on vaihtelevasti viikolla, päivitämme tänne kalenteria joka maanantai!',
    category: 'public',
  },
  {
    id: 'public-price',
    question: 'Paljonko julkisen saunan hinta on?',
    answer: 'Julkinen saunavuoro maksaa 15€, ja vuoro kestää kaksi tuntia. Opiskelijat ja eläkeläiset 12.5€!',
    category: 'public',
  },
  {
    id: 'public-capacity',
    question: 'Kuinka monta henkeä mahtuu julkiselle vuorolle?',
    answer: '17hlö',
    category: 'public',
  },
  
  // Practical
  {
    id: 'parking',
    question: 'Onko paikalla pysäköintimahdollisuus?',
    answer: 'Kyllä, Kalkkihiekantorin alueella on 4 tunnin kiekollinen pysäköinti. Metrolla pääsee suoraan Vuosaaren asemalle, josta on lyhyt kävelymatka lähtöpaikalle.',
    category: 'practical',
  },
  {
    id: 'accessibility',
    question: 'Ovatko saunat esteettömiä?',
    answer: 'Valitettavasti saunalautat eivät tällä hetkellä ole täysin esteettömiä. Lautoille kuljetaan laituria pitkin. Autamme kuitenkin mielellämme – ota yhteyttä etukäteen, niin järjestämme parhaan mahdollisen saapumisen.',
    category: 'practical',
  },
  {
    id: 'cancel',
    question: 'Miten peruutus toimii?',
    answer: 'Varauksen voi peruuttaa maksutta 7 vuorokautta ennen varattua ajankohtaa. 7-3 vuorokautta ennen peruutuksesta veloitamme 50% varauksen arvosta. Alle 3 vuorokauden varoitusajalla tehdyistä peruutuksista veloitamme koko varauksen summan. Sairastapauksissa sovimme erikseen.',
    category: 'practical',
  },
  {
    id: 'gift-card',
    question: 'Voinko ostaa lahjakortin?',
    answer: 'Kyllä! Lahjakortit ovat saatavilla verkkokaupastamme. Voit valita valmiin summan tai tietyn palvelun. Lahjakortti on voimassa 12 kuukautta ostopäivästä ja se toimitetaan sähköpostitse.',
    category: 'practical',
  },
];

export const getFAQsByCategory = (category: FAQItem['category']) => {
  return faqItems.filter((faq) => faq.category === category);
};

export const getAllFAQs = () => {
  return faqItems;
};

export const faqCategories = [
  { id: 'general', label: 'Yleistä' },
  { id: 'summer', label: 'Saunalauttaristeilyt' },
  { id: 'private', label: 'Yksityissauna' },
  { id: 'public', label: 'Julkinen sauna' },
  { id: 'practical', label: 'Käytännön asiat' },
] as const;
