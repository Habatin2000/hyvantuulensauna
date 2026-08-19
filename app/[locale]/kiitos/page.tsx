import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { thankYouPageContent } from '@/content/pages';
import GoogleConversion from '@/components/analytics/GoogleConversion';
import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/content/pages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  // SEO Metadata - ei indeksoitava / not indexable
  return {
    title: isEn ? 'Thank You for Your Booking!' : 'Kiitos varauksestasi!',
    description: isEn
      ? 'We have received your booking request. We will be in touch soon!'
      : 'Vastaanotimme varauskyselysi. Olemme sinuun yhteydessä pian!',
    alternates: {
      canonical: `${SITE_URL}${isEn ? '/en' : ''}/kiitos`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (locale === 'en' ? 'en' : 'fi') as Locale;
  const isEn = safeLocale === 'en';
  const content = thankYouPageContent[safeLocale];

  return (
    <section className="section-padding bg-stone-50 min-h-[60vh] flex items-center">
      <GoogleConversion value={1.0} currency="EUR" />
      <div className="container-padding mx-auto max-w-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {content.title}
          </h1>

          <p className="text-lg text-stone-600 mb-8">
            {content.description}
          </p>

          <div className="bg-white rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-stone-900 mb-4">
              {isEn ? 'Next steps:' : 'Seuraavaksi:'}
            </h2>
            <ul className="space-y-3 text-stone-600">
              {content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#3b82f6] font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-100 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-stone-900 mb-2">
              {content.contact.title}
            </h2>
            <p className="text-stone-600 mb-4">
              {content.contact.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${content.contact.phone.replace(/\s/g, '')}`}
                className="text-[#3b82f6] hover:underline"
              >
                {content.contact.phone}
              </a>
              <span className="text-stone-400">|</span>
              <a
                href={`mailto:${content.contact.email}`}
                className="text-[#3b82f6] hover:underline"
              >
                {content.contact.email}
              </a>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
          >
            {isEn ? 'Return to homepage' : 'Palaa etusivulle'}
          </Link>
        </div>
      </div>
    </section>
  );
}
