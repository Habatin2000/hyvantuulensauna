import { NavItem } from '@/types';

export const mainNavigation: NavItem[] = [
  {
    label: 'Saunalauttaristeilyt',
    href: '/saunalauttaristeilyt-helsingissa',
    description: 'Kesän paras saunaelämys merellä Helsingissä',
  },
  {
    label: 'Tapahtumat',
    href: '/yksityissauna',
    description: 'Kesän tapahtumat ja saunarituaalit',
  },
  {
    label: 'Toiminnastamme',
    href: '/toiminnastamme',
    description: 'Lue meistä ja toiminnastamme',
  },
  {
    label: 'Julkinen sauna',
    href: '/julkinen-sauna',
    description: 'Tule mukaan avoimille saunavuoroille',
  },
  {
    label: 'Sijainti',
    href: '/sijainti',
    description: 'Saapumisohjeet ja yhteystiedot',
  },
  {
    label: 'Usein kysyttyä',
    href: '/usein-kysyttya',
    description: 'Vastaukset yleisimpiin kysymyksiin',
  },
  {
    label: 'Galleria',
    href: '/galleria',
    description: 'Kuvia saunaelämyksistämme',
  },
];

export const footerNavigation = {
  services: [
    { label: 'Saunalauttaristeilyt', href: '/saunalautat-kesalla' },
    { label: 'Tapahtumat', href: '/yksityissauna' },
    { label: 'Toiminnastamme', href: '/toiminnastamme' },
    { label: 'Julkinen sauna', href: '/julkinen-sauna' },
  ],
  info: [
    { label: 'Sijainti', href: '/sijainti' },
    { label: 'Usein kysyttyä', href: '/usein-kysyttya' },
    { label: 'Galleria', href: '/galleria' },
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
