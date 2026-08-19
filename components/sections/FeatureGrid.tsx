import { 
  Flame, 
  MapPin, 
  Waves, 
  Utensils,
  Users,
  Clock,
  Thermometer,
  LifeBuoy,
  Ship,
  type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  'map-pin': MapPin,
  waves: Waves,
  utensils: Utensils,
  users: Users,
  clock: Clock,
  thermometer: Thermometer,
  'life-buoy': LifeBuoy,
  ship: Ship,
};

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5;
}

export default function FeatureGrid({ 
  features, 
  title, 
  subtitle,
  columns = 4 
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-padding mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
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

        <div className={`grid gap-6 ${gridCols[columns]}`}>
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Flame;
            return (
              <div
                key={feature.id}
                className="flex flex-col items-center rounded-2xl bg-[#faf9f7] p-6 text-center md:items-start md:text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/10 text-[#3b82f6]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
