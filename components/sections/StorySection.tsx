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
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
            Tutustu meihin
          </p>
          <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
            {title}
          </h2>
          
          {/* Quote with decorative elements */}
          <div className="mt-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-[#3b82f6]/20 font-serif">
              &ldquo;
            </div>
            <blockquote className="relative text-xl md:text-2xl text-stone-700 font-medium leading-relaxed italic">
              {quote}
            </blockquote>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-6xl text-[#3b82f6]/20 font-serif rotate-180">
              &rdquo;
            </div>
          </div>
          
          {/* Story paragraphs */}
          <div className="mt-12 space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-lg text-stone-600 leading-relaxed ${
                  index === paragraphs.length - 1 ? 'font-semibold text-stone-800 text-xl' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image with two people */}
          {image && (
            <div className="mt-12">
              <div className="relative mx-auto max-w-2xl aspect-[3/2] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
              <p className="mt-4 text-sm text-stone-500 italic">
                {image.alt}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
