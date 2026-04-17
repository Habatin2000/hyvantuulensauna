'use client';

import { useState, useCallback, useEffect } from 'react';

// Types
interface TicketType {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

interface ServiceInfo {
  service: {
    id: string;
    name: string;
    type: string;
    color?: string;
  };
  tickets: TicketType[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  spotsAvailable: number;
  resourceId: string;
}

interface Availability {
  date: string;
  slots: TimeSlot[];
  timeZone: string;
}

// Hook: Get service info and ticket types
export function useServiceInfo() {
  const [info, setInfo] = useState<ServiceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('/api/bookla/service-info');
        if (!res.ok) throw new Error('Failed to fetch service info');
        const data = await res.json();
        setInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return { info, isLoading, error };
}

// Hook: Get available time slots for a date
export function useAvailability() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookla/availability?date=${date}`);
      if (!res.ok) throw new Error('Failed to fetch availability');
      const data = await res.json();
      setAvailability(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { availability, isLoading, error, fetchAvailability };
}

// Hook: Create booking
export function useBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(async (params: {
    startTime: string;
    tickets: { ticketID: string; quantity: number }[];
    client: { firstName: string; lastName: string; email: string; phone?: string };
    subscriptionCode?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookla/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Booking failed');
      }
      
      return { 
        success: data.success, 
        requiresPayment: data.requiresPayment,
        membershipApplied: data.membershipApplied,
        paymentURL: data.paymentURL,
        bookingId: data.bookingId,
        confirmationCode: data.confirmationCode,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, createBooking };
}
