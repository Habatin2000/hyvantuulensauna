'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const locales = [
  { code: 'fi', label: 'FI', ariaLabel: 'Suomeksi' },
  { code: 'en', label: 'EN', ariaLabel: 'In English' },
] as const;

export default function LanguageSwitcher() {
  // Locale-aware pathname without the current locale prefix
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div
      className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5"
      role="group"
      aria-label="Kielivalitsin / Language selector"
    >
      {locales.map((loc) => {
        const isActive = locale === loc.code;
        return (
          <Link
            key={loc.code}
            href={pathname}
            locale={loc.code}
            hrefLang={loc.code}
            aria-label={loc.ariaLabel}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
              isActive
                ? 'bg-white text-[#3b82f6] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {loc.label}
          </Link>
        );
      })}
    </div>
  );
}
