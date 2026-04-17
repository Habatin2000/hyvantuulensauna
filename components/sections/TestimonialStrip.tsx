import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialStripProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
}

export default function TestimonialStrip({ testimonials, title, subtitle }: TestimonialStripProps) {
  return (
    <section className="section-padding bg-[#3b82f6]">
      <div className="container-padding mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-amber-300">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-sm md:p-8"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-white/20" />
              
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-stone-100 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-medium">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  {(testimonial.role || testimonial.context) && (
                    <p className="text-sm text-stone-300">
                      {testimonial.role && `${testimonial.role}, `}
                      {testimonial.context}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
