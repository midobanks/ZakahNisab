'use client';

import { Card } from '@/components/ui';
import { formatCurrency, formatGrams } from '@/lib/formatting';
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS } from '@/lib/constants';
import type { MetalPrices } from '@/types/zakah';
import { useCurrency } from '@/context';

interface NisabCardProps {
  type: 'gold' | 'silver';
  prices: MetalPrices;
}

export function NisabCard({ type, prices }: NisabCardProps) {
  const { currency } = useCurrency();
  const grams = type === 'gold' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS;
  const pricePerGram = type === 'gold' ? prices.goldPricePerGram : prices.silverPricePerGram;
  const nisabValue = grams * pricePerGram;

  return (
    <Card variant="highlight" className="text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl">{type === 'gold' ? '🥇' : '🥈'}</span>
        <h3 className="text-sm font-semibold text-gray-900">
          {type === 'gold' ? 'Gold Nisab' : 'Silver Nisab'}
        </h3>
        <p className="text-2xl font-bold text-emerald-700">
          {formatCurrency(nisabValue, currency)}
        </p>
        <p className="text-xs text-gray-500">
          {formatGrams(grams)} × {formatCurrency(pricePerGram, currency)}/g
        </p>
      </div>
    </Card>
  );
}
