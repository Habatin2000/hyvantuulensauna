import { FAQItem } from '@/types';
import type { Locale } from './pages';

const isEn = (locale: Locale) => locale === 'en';

export const getFaqItems = (locale: Locale = 'fi'): FAQItem[] => isEn(locale) ? [
  // Summer page specific
  {
    id: 'departure',
    question: 'Where do the sauna boats depart from in Helsinki?',
    answer: 'The sauna boats depart from Kalkkihiekantori in Vuosaari. The exact address is Kalkkihiekantori, 00980 Helsinki. The location is easily accessible by metro (Vuosaari station) or by car – there is 4-hour disc parking in the area. Kalkkihiekantori is located on the shore of Aurinkolahti, and it is a short walk to the departure point.',
    category: 'summer',
  },
  {
    id: 'own-food',
    question: 'Can I bring my own drinks and food on the sauna boat?',
    answer: 'Yes, own food and drinks are allowed and recommended! The sauna boat has a Weber grill available for you and ice for cooling drinks. We also offer catering services such as grill burgers – ask more when booking.',
    category: 'summer',
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring for a sauna boat cruise?',
    answer: 'Bring your own towels, swimwear and weather-appropriate clothing. Towels can also be rented from us (€5/pc). Everything else is on the boat – sauna, grill, speakers and great vibes!',
    category: 'summer',
  },
  {
    id: 'crew',
    question: 'Is there staff on the sauna boat?',
    answer: 'Yes! Every sauna boat cruise has a trained skipper on board who handles navigation and helps you throughout the cruise. You can focus on enjoying the sauna, swimming and company – the skipper takes care of the rest.',
    category: 'summer',
  },
  {
    id: 'wc',
    question: 'Do the sauna boats have toilets?',
    answer: 'Yes, both sauna boats (Aalto and Virta) have their own toilet. In addition, the Aalto boat has a separate changing room, so changing is convenient.',
    category: 'summer',
  },
  {
    id: 'price',
    question: 'How much does it cost to rent a sauna boat in Helsinki?',
    answer: 'The price for a sauna boat cruise starts from €525 / 3 hours (€52 / person). Minimum booking is 3 hours. The price includes the sauna boat with captain, wood-fired sauna, Weber grill, ice for drinks, toilet and sound system. The price is the same for both boats.',
    category: 'summer',
  },
  {
    id: 'bachelor',
    question: 'Is a sauna boat suitable for bachelor parties or corporate events?',
    answer: 'Absolutely! Sauna boat cruises are one of the most popular ways to organize bachelor parties, birthdays or team days in Helsinki. By booking both boats (Aalto + Virta) you can host an event for up to 25 people. Contact us and we will tailor a suitable package for you!',
    category: 'summer',
  },
  // General
  {
    id: 'what-is',
    question: 'What is Hyvän Tuulen Sauna?',
    answer: 'Hyvän Tuulen Sauna is a maritime sauna experience in Helsinki. We offer sauna opportunities in our traditional sauna boats Aalto and Virta. In summer we operate as floating saunas at sea, and in winter we also offer ice swimming opportunities.',
    category: 'general',
  },
  {
    id: 'where-located',
    question: 'Where is your sauna located?',
    answer: 'Our sauna boats depart from Kalkkihiekantori in Vuosaari, address Kalkkihiekantori, 00980 Helsinki. The location is easily accessible by metro (Vuosaari station) or by car.',
    category: 'general',
  },
  {
    id: 'bring-own',
    question: 'What do I need to bring?',
    answer: 'Bring your own towels and swimwear. Towels can also be rented from us (€5/pc). Own food and drinks are welcome – we have a Weber grill and ice for drinks.',
    category: 'general',
  },
  // Private
  {
    id: 'private-booking',
    question: 'How do I book a private sauna session?',
    answer: 'You can book a private sauna session through our website or by contacting us by email or phone. We recommend booking at least a week in advance, especially on weekends.',
    category: 'private',
  },
  {
    id: 'private-duration',
    question: 'How long is a private sauna session?',
    answer: 'The standard session lasts 4 hours (minimum booking). You can also book a longer cruise. Contact us and we will tailor a package just for you.',
    category: 'private',
  },
  {
    id: 'private-events',
    question: 'Are the saunas suitable for corporate events?',
    answer: 'Yes! Our saunas are excellent for corporate events, team days and customer events. We also offer additional services such as catering and activities. Contact us and we will plan the perfect event together.',
    category: 'private',
  },
  // Public
  {
    id: 'public-when',
    question: 'When are the public sauna sessions?',
    answer: 'Public sauna sessions are held every Sunday 10-16. There are also sessions on varying weekdays – we update the calendar here every Monday!',
    category: 'public',
  },
  {
    id: 'public-price',
    question: 'How much does the public sauna cost?',
    answer: 'A public sauna session costs €15 and lasts two hours. Students and seniors €12.5!',
    category: 'public',
  },
  {
    id: 'public-capacity',
    question: 'How many people fit in a public session?',
    answer: '17 people',
    category: 'public',
  },
  // Practical
  {
    id: 'parking',
    question: 'Is there parking available?',
    answer: 'Yes, the Kalkkihiekantori area has 4-hour disc parking. You can also take the metro directly to Vuosaari station, from where it is a short walk to the departure point.',
    category: 'practical',
  },
  {
    id: 'accessibility',
    question: 'Are the saunas accessible?',
    answer: 'Unfortunately the sauna boats are not fully accessible at the moment. You board the boats via a dock. However, we are happy to help – contact us in advance and we will arrange the best possible arrival.',
    category: 'practical',
  },
  {
    id: 'cancel',
    question: 'How does cancellation work?',
    answer: 'The booking can be cancelled free of charge 7 days before the reserved time. For cancellations 7-3 days before, we charge 50% of the booking value. For cancellations with less than 3 days notice, we charge the full booking amount. In case of illness we will agree separately.',
    category: 'practical',
  },
  {
    id: 'gift-card',
    question: 'Can I buy a gift card?',
    answer: 'Yes! Gift cards are available in our online store. You can choose a ready amount or a specific service. The gift card is valid for 12 months from the date of purchase and is delivered by email.',
    category: 'practical',
  },
] : [
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
    answer: 'Saunalauttaristeilyn hinta alkaen 525 €/3 tuntia (52 €/hlö). Minimivaraus on 3 tuntia. Hintaan sisältyy saunalautta kapteeneineen, puulämmitteinen sauna, Weber-grilli, jäät juomille, wc ja musiikkijärjestelmä. Saunalauttaristeilyn hinta on sama molemmille lautoille.',
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
    answer: 'Standardivuoro kestää 4 tuntia (minimivaraus). Voit myös varata pidemmän risteilyn. Ota yhteyttä, niin räätälöidään juuri teille sopiva paketti.',
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

export const faqItems = getFaqItems('fi');

export const getFAQsByCategory = (category: FAQItem['category'], locale: Locale = 'fi') => {
  return getFaqItems(locale).filter((faq) => faq.category === category);
};

export const getAllFAQs = (locale: Locale = 'fi') => {
  return getFaqItems(locale);
};

export const getFaqCategories = (locale: Locale = 'fi') => isEn(locale) ? [
  { id: 'general', label: 'General' },
  { id: 'summer', label: 'Sauna Boat Cruises' },
  { id: 'private', label: 'Private Sauna' },
  { id: 'public', label: 'Public Sauna' },
  { id: 'practical', label: 'Practical' },
] : [
  { id: 'general', label: 'Yleistä' },
  { id: 'summer', label: 'Saunalauttaristeilyt' },
  { id: 'private', label: 'Yksityissauna' },
  { id: 'public', label: 'Julkinen sauna' },
  { id: 'practical', label: 'Käytännön asiat' },
];

export const faqCategories = getFaqCategories('fi');
