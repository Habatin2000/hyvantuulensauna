import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  badge?: string;
}

interface ServiceCardsProps {
  cards: ServiceCard[];
  title?: string;
  subtitle?: string;
}

export default function ServiceCards({ cards, title, subtitle }: ServiceCardsProps) {
  return (
    <section className="section-padding bg-stone-50">
      <div className="container-padding mx-auto max-w-7xl">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {card.badge && (
                  <Badge className="absolute left-4 top-4 bg-amber-500 text-white hover:bg-amber-600">
                    {card.badge}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-stone-900">
                  {card.title}
                </h3>
                <p className="mt-2 flex-1 text-stone-600 leading-relaxed">
                  {card.description}
                </p>
                <Link href={card.href} className="mt-6">
                  <Button 
                    className="w-full bg-[#3b82f6] text-white hover:bg-[#2563eb] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group/btn"
                  >
                    {card.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
