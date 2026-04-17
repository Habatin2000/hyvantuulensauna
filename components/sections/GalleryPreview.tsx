import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface GalleryPreviewProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

export default function GalleryPreview({ images, title, subtitle }: GalleryPreviewProps) {
  return (
    <section className="section-padding bg-stone-50">
      <div className="container-padding mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
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
            <Link href="/galleria">
              <Button variant="outline" className="border-stone-300">
                Katso kaikki kuvat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative aspect-square overflow-hidden rounded-xl ${
                index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={
                  index === 0
                    ? '(max-width: 640px) 100vw, 50vw'
                    : '(max-width: 640px) 50vw, 25vw'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
