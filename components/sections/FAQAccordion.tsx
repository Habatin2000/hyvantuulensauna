import { FAQItem } from '@/types';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/content/homepage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
  locale?: Locale;
}

export default function FAQAccordion({ 
  items, 
  title, 
  subtitle,
  showAllLink,
  locale = 'fi'
}: FAQAccordionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-padding mx-auto max-w-3xl">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <Accordion className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-b border-stone-200">
              <AccordionTrigger className="py-5 text-left text-base font-medium text-stone-900 hover:text-[#3b82f6] hover:no-underline md:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-stone-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {showAllLink && (
          <div className="mt-8 text-center">
            <Link 
              href="/usein-kysyttya" 
              className="text-sm font-medium text-[#3b82f6] hover:underline"
            >
              {locale === 'en'
                ? 'See all frequently asked questions →'
                : 'Katso kaikki usein kysytyt kysymykset →'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
