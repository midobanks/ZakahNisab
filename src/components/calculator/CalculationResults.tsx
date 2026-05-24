'use client';

import { Badge, Card } from '@/components/ui';
import { Disclaimer } from '@/components/shared';
import { formatCurrency } from '@/lib/formatting';
import type { ZakahResult, CurrencyCode } from '@/types/zakah';

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 text-sm ${highlight ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

interface CalculationResultsProps {
  result: ZakahResult;
  currency: CurrencyCode;
}

export function CalculationResults({ result, currency }: CalculationResultsProps) {
  const {
    totalAssets, totalDebts, netWealth,
    goldNisabValue, silverNisabValue, selectedNisabValue,
    isAboveNisab, zakahDue, nisabType,
  } = result;

  return (
    <div className="space-y-4">
      <Card variant={isAboveNisab ? 'highlight' : 'default'}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Your Zakah Result</h3>
          <Badge variant={isAboveNisab ? 'success' : 'info'}>
            {isAboveNisab ? 'Above Nisab' : 'Below Nisab'}
          </Badge>
        </div>

        {isAboveNisab ? (
          <p className="text-xs text-gray-500 mb-3">
            Your net wealth is above the {nisabType} Nisab threshold. If you have held this wealth for one full lunar year (Hawl), your estimated Zakah due is:
          </p>
        ) : (
          <p className="text-xs text-gray-500 mb-3">
            Your net wealth is below the selected Nisab threshold. No Zakah is due at this time.
          </p>
        )}

        <div className={`mb-4 text-center ${isAboveNisab ? '' : 'opacity-50'}`}>
          <p className="text-xs text-gray-500">Zakah Due (2.5%)</p>
          <p className={`text-3xl font-bold ${isAboveNisab ? 'text-emerald-700' : 'text-gray-400'}`}>
            {formatCurrency(zakahDue, currency)}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-0.5">
          <ResultRow label="Total Zakatable Assets" value={formatCurrency(totalAssets, currency)} />
          <ResultRow label="Total Deductible Debts" value={formatCurrency(totalDebts, currency)} />
          <ResultRow label="Net Zakatable Wealth" value={formatCurrency(netWealth, currency)} highlight />
          <div className="border-t border-gray-100 my-1" />
          <ResultRow label={`Gold Nisab (87.48g)`} value={formatCurrency(goldNisabValue, currency)} />
          <ResultRow label={`Silver Nisab (612.36g)`} value={formatCurrency(silverNisabValue, currency)} />
          <ResultRow label={`Selected Threshold`} value={formatCurrency(selectedNisabValue, currency)} highlight />
        </div>
      </Card>

      {isAboveNisab && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-900 mb-1">About Hawl (Lunar Year)</p>
          <p>
            Zakah is due once your wealth has remained above the Nisab threshold for one full lunar (Hijri) year. Keep track of your Hawl start date to ensure you pay at the correct time.
          </p>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
