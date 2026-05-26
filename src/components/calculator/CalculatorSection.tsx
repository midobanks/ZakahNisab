'use client';

import { useState, useCallback } from 'react';
import { AssetInputs } from './AssetInputs';
import { DebtInputs } from './DebtInputs';
import { CalculationResults } from './CalculationResults';
import { NisabThresholdSelector } from '@/components/nisab';
import { ReminderCapture } from '@/components/reminder';
import { useCurrency } from '@/context';
import { usePrices } from '@/hooks/usePrices';
import { useZakahCalculation } from '@/hooks/useZakahCalculation';
import type { NisabType, ZakahInputs } from '@/types/zakah';

export function CalculatorSection() {
  const { currency } = useCurrency();
  const { prices } = usePrices(currency);
  const [nisabType, setNisabType] = useState<NisabType>('silver');

  const [inputs, setInputs] = useState<ZakahInputs>({
    cash: 0, investments: 0, goldGrams: 0, silverGrams: 0,
    businessAssets: 0, receivables: 0, otherAssets: 0, debts: 0,
  });

  const [rawValues, setRawValues] = useState({
    cash: '', investments: '', goldGrams: '', silverGrams: '',
    businessAssets: '', receivables: '', otherAssets: '', debts: '',
  });

  const handleChange = useCallback((field: string, value: string) => {
    setRawValues((prev) => ({ ...prev, [field]: value }));
    const num = parseFloat(value);
    setInputs((prev) => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
  }, []);

  const result = useZakahCalculation(inputs, prices, nisabType);

  return (
    <div className="space-y-6">
      <NisabThresholdSelector value={nisabType} onChange={setNisabType} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AssetInputs
          cash={rawValues.cash}
          investments={rawValues.investments}
          goldGrams={rawValues.goldGrams}
          silverGrams={rawValues.silverGrams}
          businessAssets={rawValues.businessAssets}
          receivables={rawValues.receivables}
          otherAssets={rawValues.otherAssets}
          onChange={handleChange}
        />
        <div className="space-y-6">
          <DebtInputs debts={rawValues.debts} onChange={handleChange} />
          {result && (
            <>
              <CalculationResults result={result} currency={currency} />
              {result.isAboveNisab && result.zakahDue > 0 && (
                <ReminderCapture />
              )}
            </>
          )}
          {!prices && (
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500">
              Loading prices...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
