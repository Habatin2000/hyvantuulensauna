import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { thankYouPageContent } from '@/content/pages';

// SEO Metadata - ei indeksoitava
export const metadata: Metadata = {
  title: 'Kiitos Varauksestasi | Hyvän Tuulen Sauna',
  description: 'Vastaanotimme varauskyselysi. Olemme sinuun yhteydessä pian!',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <section className="section-padding bg-stone-50 min-h-[60vh] flex items-center">
      <div className="container-padding mx-auto max-w-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {thankYouPageContent.title}
          </h1>
          
          <p className="text-lg text-stone-600 mb-8">
            {thankYouPageContent.description}
          </p>

          <div className="bg-white rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-stone-900 mb-4">Seuraavaksi:</h2>
            <ul className="space-y-3 text-stone-600">
              {thankYouPageContent.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#3b82f6] font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-100 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-stone-900 mb-2">
              {thankYouPageContent.contact.title}
            </h2>
            <p className="text-stone-600 mb-4">
              {thankYouPageContent.contact.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={`tel:${thankYouPageContent.contact.phone}`}
                className="text-[#3b82f6] hover:underline"
              >
                {thankYouPageContent.contact.phone}
              </a>
              <span className="text-stone-400">|</span>
              <a 
                href={`mailto:${thankYouPageContent.contact.email}`}
                className="text-[#3b82f6] hover:underline"
              >
                {thankYouPageContent.contact.email}
              </a>
            </div>
          </div>

          <a 
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 font-medium text-white hover:bg-[#2563eb]"
          >
            Palaa etusivulle
          </a>
        </div>
      </div>
    </section>
  );
}
