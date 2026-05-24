'use client';

import { useState, useEffect } from 'react';
import type { MetalPrices, CurrencyCode } from '@/types/zakah';

export function usePrices(currency: CurrencyCode) {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/prices?currency=${currency}`);
        if (!res.ok) throw new Error('Failed to fetch prices');
        const data = await res.json();
        if (!cancelled) setPrices(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load prices');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrices();
    return () => { cancelled = true; };
  }, [currency]);

  return { prices, loading, error };
}
