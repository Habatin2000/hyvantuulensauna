'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { VibeFaqItem } from './pages';

export default function VibeFaq({ items }: { items: VibeFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="vibe-faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `vibe-faq-answer-${index}`;
        return (
          <div className="vibe-faq-item" key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                {isOpen ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              </button>
            </h3>
            <div id={answerId} className={`vibe-faq-answer ${isOpen ? 'is-open' : ''}`} hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
