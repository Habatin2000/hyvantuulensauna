import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, ZoomIn } from 'lucide-react';
import type { Locale } from '@/content/homepage';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface GalleryPreviewProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
  locale?: Locale;
}

export default function GalleryPreview({ images, title, subtitle, locale = 'fi' }: GalleryPreviewProps) {
  return (
    <section className="section-padding bg-[#faf9f7]">
      <div className="container-padding mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              {subtitle && (
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="font-corben text-3xl font-bold text-stone-900 md:text-4xl">
                  {title}
                </h2>
              )}
            </div>
            <Link href="/galleria">
              <Button variant="outline" className="border-stone-300 hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6] transition-all">
                {locale === 'en' ? 'See all photos' : 'Katso kaikki kuvat'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-500 ${
                index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes={
                  index === 0
                    ? '(max-width: 640px) 100vw, 50vw'
                    : '(max-width: 640px) 50vw, 25vw'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-lg transform scale-75 transition-transform duration-300 group-hover:scale-100">
                  <ZoomIn className="h-5 w-5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
