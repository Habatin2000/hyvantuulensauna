import { FAQItem } from '@/types';
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
}

export default function FAQAccordion({ 
  items, 
  title, 
  subtitle,
  showAllLink 
}: FAQAccordionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-padding mx-auto max-w-3xl">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
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
            <a 
              href="/usein-kysyttya" 
              className="text-sm font-medium text-[#3b82f6] hover:underline"
            >
              Katso kaikki usein kysytyt kysymykset →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
