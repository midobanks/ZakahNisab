'use client';

import { Card, Input } from '@/components/ui';
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
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📉</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">What You Owe (Debts)</h3>
            <p className="text-xs text-gray-500">These are deducted from your total assets</p>
          </div>
        </div>

        <Input label="Outstanding Debts & Loans" prefix={symbol} type="number" min="0" step="0.01" value={debts} onChange={(e) => onChange('debts', e.target.value)} />

        <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 leading-relaxed">
          Deductible debts include personal loans, credit card balances, and other liabilities due within the current lunar year. Long-term obligations like mortgages may differ by scholarly opinion.
        </div>
      </div>
    </Card>
  );
}
