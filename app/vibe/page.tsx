import type { Metadata } from 'next';
import VibeHeader from '@/components/vibe/VibeHeader';
import VibeFooter from '@/components/vibe/VibeFooter';
import VibePageContent from '@/components/vibe/VibePageContent';
import { vibeCopy } from '@/components/vibe/content';

export const metadata: Metadata = {
  title: vibeCopy.fi.metaTitle,
  description: vibeCopy.fi.metaDescription,
  robots: { index: false, follow: false },
};

export default function VibePreviewPage() {
  return (
    <>
      <a className="vibe-skip-link" href="#main-content">Siirry sisältöön</a>
      <VibeHeader locale="fi" />
      <VibePageContent locale="fi" />
      <VibeFooter locale="fi" />
    </>
  );
}
