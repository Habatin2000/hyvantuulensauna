import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Clock, Check } from 'lucide-react';
import { Boat } from '@/types';

interface BoatComparisonCardsProps {
  boats: Boat[];
  title?: string;
  subtitle?: string;
}

export default function BoatComparisonCards({ 
  boats, 
  title, 
  subtitle 
}: BoatComparisonCardsProps) {
  return (
    <section className="section-padding bg-white">
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

        <div className="grid gap-6 md:grid-cols-2">
          {boats.map((boat) => (
            <Card key={boat.id} className="overflow-hidden border-stone-200">
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={boat.images[0]}
                  alt={boat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">{boat.name}</h3>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Specs */}
                <div className="mb-4 flex gap-6 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#3b82f6]" />
                    <span>{boat.capacity.min}-{boat.capacity.max} hlö</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#3b82f6]" />
                    <span>alk. {boat.pricing.basePrice}€/tunti</span>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-6 text-stone-600 leading-relaxed">
                  {boat.description}
                </p>

                {/* Features */}
                <div className="mb-6 space-y-2">
                  {boat.features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-stone-700">
                      <Check className="h-4 w-4 text-[#3b82f6]" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Ideal for */}
                <div className="mb-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
                    Erinomainen valinta
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {boat.idealFor.map((ideal) => (
                      <span
                        key={ideal}
                        className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
                      >
                        {ideal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                  Varaa {boat.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
