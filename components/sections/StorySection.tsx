import Image from 'next/image';

interface StorySectionProps {
  title: string;
  quote: string;
  paragraphs: string[];
  image?: {
    src: string;
    alt: string;
  };
}

export default function StorySection({ title, quote, paragraphs, image }: StorySectionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-padding mx-auto max-w-4xl">
        <div className="text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
            Tutustu meihin
          </p>
          <h2 className="font-corben text-2xl font-bold text-stone-900 md:text-3xl">
            {title}
          </h2>
          
          {/* Quote with decorative elements */}
          <div className="mt-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-5xl text-[#3b82f6]/20 font-serif">
              &ldquo;
            </div>
            <blockquote className="relative text-lg md:text-xl text-stone-700 font-medium leading-relaxed italic">
              {quote}
            </blockquote>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-5xl text-[#3b82f6]/20 font-serif rotate-180">
              &rdquo;
            </div>
          </div>
          
          {/* Story paragraphs */}
          <div className="mt-10 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-base text-stone-600 leading-relaxed ${
                  index === paragraphs.length - 1 ? 'font-semibold text-stone-800 text-lg' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image with two people */}
          {image && (
            <div className="mt-10">
              <div className="relative mx-auto max-w-2xl aspect-[3/2] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
              <p className="mt-3 text-xs text-stone-500 italic">
                {image.alt}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
