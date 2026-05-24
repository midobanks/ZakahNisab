'use client';

import { Select } from '@/components/ui';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';
import { useCurrency } from '@/context';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  const options = SUPPORTED_CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.flag} ${c.code} (${c.symbol})`,
  }));

  return (
    <Select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as typeof currency)}
      options={options}
      aria-label="Select currency"
      className="w-28 text-xs"
    />
  );
}
