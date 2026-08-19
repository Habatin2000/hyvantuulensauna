'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Star, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  calendar: <Calendar className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  'map-pin': <MapPin className="h-6 w-6" />,
};

interface TrustBadge {
  id: string;
  value: string;
  label: string;
  icon?: string;
}

interface TrustBarProps {
  badges: TrustBadge[];
}

function AnimatedNumber({ value, isVisible }: { value: string; isVisible: boolean }) {
  const numericPart = value.replace(/[^0-9.]/g, '');
  const suffix = value.replace(/[0-9.]/g, '');
  const target = parseFloat(numericPart);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isVisible || isNaN(target)) return;

    const duration = 1500;
    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target * 10) / 10;

      if (Number.isInteger(target)) {
        setDisplay(String(Math.round(current)));
      } else {
        setDisplay(current.toFixed(1));
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, target]);

  if (isNaN(target)) {
    return <span>{value}</span>;
  }

  return <span>{display}{suffix}</span>;
}

export default function TrustBar({ badges }: TrustBarProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-b border-stone-200 bg-white py-8 md:py-10">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {badges.map((badge, index) => (
            <div
              key={badge.id}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3b82f6]/10 text-[#3b82f6]">
                {badge.icon && iconMap[badge.icon] ? iconMap[badge.icon] : null}
              </div>
              <p className="text-3xl font-bold text-stone-900 md:text-4xl">
                <AnimatedNumber value={badge.value} isVisible={isVisible} />
              </p>
              <p className="mt-1 text-sm text-stone-500">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
