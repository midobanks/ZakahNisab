'use client';

import { CalculatorSection } from '@/components/calculator';
import { useCurrency } from '@/context';

export default function CalculatorPage() {
  const { currency, currencyChanged, clearCurrencyWarning } = useCurrency();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {currencyChanged && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center justify-between">
          <p>Currency changed to <strong>{currency}</strong>. Please confirm your entered values are in the selected currency.</p>
          <button onClick={clearCurrencyWarning} className="ml-4 text-amber-600 hover:text-amber-800 font-medium" aria-label="Dismiss warning">
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Zakah Calculator</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your assets and liabilities below. Results update instantly.
        </p>
      </div>

      <CalculatorSection />
    </div>
  );
}
