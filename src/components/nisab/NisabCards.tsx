'use client';

import { NisabCard } from './NisabCard';
import { LiveDataBadge } from '@/components/layout';
import type { MetalPrices } from '@/types/zakah';

interface NisabCardsProps {
  prices: MetalPrices | null;
  loading: boolean;
}

export function NisabCards({ prices, loading }: NisabCardsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
        Unable to load current prices. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <LiveDataBadge lastUpdated={prices.lastUpdated} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NisabCard type="gold" prices={prices} />
        <NisabCard type="silver" prices={prices} />
      </div>
    </div>
  );
}
