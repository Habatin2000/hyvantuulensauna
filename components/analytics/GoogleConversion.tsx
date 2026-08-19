'use client';

import { useEffect } from 'react';

interface GoogleConversionProps {
  value?: number;
  currency?: string;
  transactionId?: string;
}

export default function GoogleConversion({
  value,
  currency = 'EUR',
  transactionId,
}: GoogleConversionProps) {
  useEffect(() => {
    // window.gtag is declared globally in lib/analytics.ts
    if (typeof window !== 'undefined' && window.gtag) {
      const gtag = window.gtag;
      const eventData: Record<string, string | number> = {
        send_to: 'AW-17838327897',
      };
      if (value !== undefined) eventData.value = value;
      if (currency) eventData.currency = currency;
      if (transactionId) eventData.transaction_id = transactionId;

      gtag('event', 'conversion', eventData);

      // Send the same conversion to the Google Tag container
      gtag('event', 'conversion', {
        send_to: 'GT-PBNGTFCX',
        ...(value !== undefined && { value }),
        ...(currency && { currency }),
        ...(transactionId && { transaction_id: transactionId }),
      });
    }
  }, [value, currency, transactionId]);

  return null;
}
