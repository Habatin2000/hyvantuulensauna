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
  columns?: 2 | 3 | 4;
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
  };

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

        <div className={`grid gap-8 ${gridCols[columns]}`}>
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Flame;
            return (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3b82f6]/10 text-[#3b82f6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-stone-600 leading-relaxed">
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
