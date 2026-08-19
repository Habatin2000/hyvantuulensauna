import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fi', 'en'],

  // Used when no locale matches
  defaultLocale: 'fi',
  localePrefix: 'as-needed',

  // Disable cookie-based locale detection so URL alone determines the language.
  // This prevents the middleware from redirecting / to /en/ after the user has
  // once visited the English version.
  localeDetection: false,
});
