import { NavItem } from '@/types';

// labelKey maps each item to a key in the `nav` messages namespace so
// labels can be localized via useTranslations('nav') in the components
// that render them. `label` remains as the Finnish fallback.
export type LocalizedNavItem = NavItem & { labelKey: string };

export const mainNavigation: LocalizedNavItem[] = [
  {
    label: 'Saunalauttaristeilyt',
    labelKey: 'saunaBoat',
    href: '/saunalauttaristeilyt-helsingissa',
    description: 'Kesän paras saunaelämys merellä Helsingissä',
  },
  {
    label: 'Tapahtumat',
    labelKey: 'events',
    href: '/yksityissauna',
    description: 'Kesän tapahtumat ja saunarituaalit',
  },
  {
    label: 'Toiminnastamme',
    labelKey: 'about',
    href: '/toiminnastamme',
    description: 'Lue meistä ja toiminnastamme',
  },
  {
    label: 'Julkinen sauna',
    labelKey: 'publicSauna',
    href: '/julkinen-sauna',
    description: 'Tule mukaan avoimille saunavuoroille',
  },
  {
    label: 'Sijainti',
    labelKey: 'location',
    href: '/sijainti',
    description: 'Saapumisohjeet ja yhteystiedot',
  },
  {
    label: 'Usein kysyttyä',
    labelKey: 'faq',
    href: '/usein-kysyttya',
    description: 'Vastaukset yleisimpiin kysymyksiin',
  },
  {
    label: 'Galleria',
    labelKey: 'gallery',
    href: '/galleria',
    description: 'Kuvia saunaelämyksistämme',
  },
];

export const footerNavigation: {
  services: LocalizedNavItem[];
  info: LocalizedNavItem[];
  contact: { email: string; phone: string; address: string };
  social: { instagram: string; facebook: string };
} = {
  services: [
    { label: 'Saunalauttaristeilyt', labelKey: 'saunaBoat', href: '/saunalauttaristeilyt-helsingissa' },
    { label: 'Tapahtumat', labelKey: 'events', href: '/yksityissauna' },
    { label: 'Toiminnastamme', labelKey: 'about', href: '/toiminnastamme' },
    { label: 'Julkinen sauna', labelKey: 'publicSauna', href: '/julkinen-sauna' },
  ],
  info: [
    { label: 'Sijainti', labelKey: 'location', href: '/sijainti' },
    { label: 'Usein kysyttyä', labelKey: 'faq', href: '/usein-kysyttya' },
    { label: 'Galleria', labelKey: 'gallery', href: '/galleria' },
  ],
  contact: {
    email: 'info@hyvantuulensauna.fi',
    phone: '+358 442313546',
    address: 'Kalkkihiekantori, 00980 Helsinki',
  },
  social: {
    instagram: 'https://instagram.com/hyvantuulensauna',
    facebook: 'https://facebook.com/hyvantuulensauna',
  },
};
