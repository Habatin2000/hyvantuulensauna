import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { thankYouPageContent } from '@/content/pages';
import { getLocalizedPageUrl, normalizePageLocale } from '../schema';

const localizedContent = {
  fi: thankYouPageContent.fi,
  en: thankYouPageContent.en,
  es: {
    title: '¡Gracias por tu reserva!',
    description: 'Hemos recibido tu solicitud de reserva. Confirmaremos tu reserva por correo electrónico en un plazo de 24 horas.',
    nextSteps: [
      'Revisa tu correo electrónico (incluida la carpeta de spam) para encontrar la confirmación de la reserva',
      'Llega al menos 5 minutos antes de la hora reservada',
    ],
    contact: {
      title: '¿Tienes preguntas?',
      description: 'Ponte en contacto con nosotros; estaremos encantados de ayudarte.',
      phone: '+358 44 231 3546',
      email: 'info@hyvantuulensauna.fi',
    },
  },
  fr: {
    title: 'Merci pour votre réservation !',
    description: 'Nous avons bien reçu votre demande de réservation. Nous confirmerons votre réservation par e-mail dans les 24 heures.',
    nextSteps: [
      'Consultez votre boîte mail (y compris les courriers indésirables) pour trouver la confirmation de réservation',
      'Arrivez au moins 5 minutes avant l’horaire réservé',
    ],
    contact: {
      title: 'Des questions ?',
      description: 'Contactez-nous, nous serons ravis de vous aider.',
      phone: '+358 44 231 3546',
      email: 'info@hyvantuulensauna.fi',
    },
  },
  de: {
    title: 'Vielen Dank für Ihre Buchung!',
    description: 'Wir haben Ihre Buchungsanfrage erhalten. Wir bestätigen Ihre Buchung innerhalb von 24 Stunden per E-Mail.',
    nextSteps: [
      'Prüfen Sie Ihr E-Mail-Postfach (einschließlich des Spam-Ordners) auf die Buchungsbestätigung',
      'Kommen Sie mindestens 5 Minuten vor dem gebuchten Termin an',
    ],
    contact: {
      title: 'Haben Sie Fragen?',
      description: 'Kontaktieren Sie uns, wir helfen Ihnen gerne weiter.',
      phone: '+358 44 231 3546',
      email: 'info@hyvantuulensauna.fi',
    },
  },
};

const nextStepsLabels = {
  fi: 'Seuraavaksi:',
  en: 'Next steps:',
  es: 'Próximos pasos:',
  fr: 'Prochaines étapes :',
  de: 'Nächste Schritte:',
};

const returnHomeLabels = {
  fi: 'Palaa etusivulle',
  en: 'Return to homepage',
  es: 'Volver a la página de inicio',
  fr: 'Retour à l’accueil',
  de: 'Zurück zur Startseite',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = normalizePageLocale(locale);
  const content = localizedContent[safeLocale];

  // SEO Metadata - ei indeksoitava / not indexable
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: getLocalizedPageUrl('/kiitos', safeLocale),
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
  const safeLocale = normalizePageLocale(locale);
  const content = localizedContent[safeLocale];

  return (
    <main id="main-content" className="section-padding bg-stone-50 min-h-[60vh] flex items-center">
      {/* Conversions are fired by the booking flows themselves
          (lib/analytics.ts trackAdsPurchase) with the real value — no
          hardcoded thank-you-page conversion here, to avoid duplicates. */}
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
              {nextStepsLabels[safeLocale]}
            </h2>
            <ul className="space-y-3 text-stone-600">
              {content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lake font-bold">{index + 1}.</span>
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
                className="text-lake hover:underline"
              >
                {content.contact.phone}
              </a>
              <span className="text-stone-400">|</span>
              <a
                href={`mailto:${content.contact.email}`}
                className="text-lake hover:underline"
              >
                {content.contact.email}
              </a>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-lake px-6 py-3 font-medium text-white hover:bg-lake-deep"
          >
            {returnHomeLabels[safeLocale]}
          </Link>
        </div>
      </div>
    </main>
  );
}
