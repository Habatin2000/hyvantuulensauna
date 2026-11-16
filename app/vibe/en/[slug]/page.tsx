import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VibeHeader from '@/components/vibe/VibeHeader';
import VibeFooter from '@/components/vibe/VibeFooter';
import VibeInnerPage from '@/components/vibe/VibeInnerPage';
import { getVibePage, vibeSlugs, type VibeSlug } from '@/components/vibe/pages';

export function generateStaticParams() {
  return vibeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!vibeSlugs.includes(slug as VibeSlug)) return {};
  const data = getVibePage(slug as VibeSlug, 'en');
  return {
    title: data.title,
    description: data.description,
    robots: { index: false, follow: false },
  };
}

export default async function EnglishVibeServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!vibeSlugs.includes(slug as VibeSlug)) notFound();
  const data = getVibePage(slug as VibeSlug, 'en');

  return (
    <>
      <a className="vibe-skip-link" href="#main-content">Skip to content</a>
      <VibeHeader locale="en" />
      <VibeInnerPage data={data} locale="en" slug={slug as VibeSlug} />
      <VibeFooter locale="en" />
    </>
  );
}
