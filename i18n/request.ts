import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import fi from '@/messages/fi.json';
import en from '@/messages/en.json';

const messagesByLocale = { fi, en } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = hasLocale(routing.locales, requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
