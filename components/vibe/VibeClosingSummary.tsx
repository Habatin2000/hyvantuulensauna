import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface VibeClosingSummaryProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  links: { href: string; label: string }[];
}

export default function VibeClosingSummary({ eyebrow, title, paragraphs, links }: VibeClosingSummaryProps) {
  return (
    <section className="vibe-closing-summary" aria-labelledby="vibe-closing-summary-title">
      <div className="vibe-closing-summary-inner">
        <div>
          <p className="vibe-eyebrow">{eyebrow}</p>
          <h2 id="vibe-closing-summary-title">{title}</h2>
        </div>
        <div>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <nav className="vibe-closing-summary-links" aria-label={eyebrow}>
            {links.map((link) => (
              <Link key={link.href + link.label} href={link.href}>
                {link.label}<ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
