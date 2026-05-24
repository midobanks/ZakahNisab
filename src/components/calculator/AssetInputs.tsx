'use client';

import { Input } from '@/components/ui';
import { useCurrency } from '@/context';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';

interface AssetInputsProps {
  cash: string;
  investments: string;
  goldGrams: string;
  silverGrams: string;
  businessAssets: string;
  receivables: string;
  otherAssets: string;
  onChange: (field: string, value: string) => void;
}

export function AssetInputs({
  cash, investments, goldGrams, silverGrams, businessAssets, receivables, otherAssets, onChange,
}: AssetInputsProps) {
  const { currency } = useCurrency();
  const symbol = SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">What You Own</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Cash & Bank Accounts" prefix={symbol} type="number" min="0" step="0.01" value={cash} onChange={(e) => onChange('cash', e.target.value)} />
        <Input label="Investments & Shares" prefix={symbol} type="number" min="0" step="0.01" value={investments} onChange={(e) => onChange('investments', e.target.value)} />
        <Input label="Gold (grams)" prefix="g" type="number" min="0" value={goldGrams} onChange={(e) => onChange('goldGrams', e.target.value)} />
        <Input label="Silver (grams)" prefix="g" type="number" min="0" value={silverGrams} onChange={(e) => onChange('silverGrams', e.target.value)} />
        <Input label="Business Assets & Inventory" prefix={symbol} type="number" min="0" step="0.01" value={businessAssets} onChange={(e) => onChange('businessAssets', e.target.value)} />
        <Input label="Receivables (money owed to you)" prefix={symbol} type="number" min="0" step="0.01" value={receivables} onChange={(e) => onChange('receivables', e.target.value)} />
        <div className="sm:col-span-2">
          <Input label="Other Zakatable Assets" prefix={symbol} type="number" min="0" step="0.01" value={otherAssets} onChange={(e) => onChange('otherAssets', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
