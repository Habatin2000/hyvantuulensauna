import type { Metadata } from 'next';
import VibeHeader from '@/components/vibe/VibeHeader';
import VibeFooter from '@/components/vibe/VibeFooter';
import VibePageContent from '@/components/vibe/VibePageContent';
import { vibeCopy } from '@/components/vibe/content';

export const metadata: Metadata = {
  title: vibeCopy.en.metaTitle,
  description: vibeCopy.en.metaDescription,
  robots: { index: false, follow: false },
};

export default function EnglishVibePreviewPage() {
  return (
    <>
      <a className="vibe-skip-link" href="#main-content">Skip to content</a>
      <VibeHeader locale="en" />
      <VibePageContent locale="en" />
      <VibeFooter locale="en" />
    </>
  );
}
