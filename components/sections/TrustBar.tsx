interface TrustBadge {
  id: string;
  value: string;
  label: string;
}

interface TrustBarProps {
  badges: TrustBadge[];
}

export default function TrustBar({ badges }: TrustBarProps) {
  return (
    <section className="border-b border-stone-200 bg-white py-8">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {badges.map((badge) => (
            <div key={badge.id} className="text-center">
              <p className="text-3xl font-bold text-[#3b82f6] md:text-4xl">
                {badge.value}
              </p>
              <p className="mt-1 text-sm text-stone-600">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
