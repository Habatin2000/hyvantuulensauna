'use client';

import { useEffect } from 'react';
import { trackFindLocation } from '@/lib/meta';

export default function LocationTracker() {
  useEffect(() => {
    trackFindLocation({ content_name: 'Sijainti' });
  }, []);

  return null;
}
