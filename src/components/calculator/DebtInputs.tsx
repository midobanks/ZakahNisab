'use client';

import { Input } from '@/components/ui';
import { useCurrency } from '@/context';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';

interface DebtInputsProps {
  debts: string;
  onChange: (field: string, value: string) => void;
}

export function DebtInputs({ debts, onChange }: DebtInputsProps) {
  const { currency } = useCurrency();
  const symbol = SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">What You Owe</h3>
      <p className="text-xs text-gray-500">
        Deductible debts include personal loans, credit card balances, and other liabilities due within the current lunar year.
      </p>
      <Input label="Outstanding Debts & Loans" prefix={symbol} type="number" min="0" step="0.01" value={debts} onChange={(e) => onChange('debts', e.target.value)} />
    </div>
  );
}
