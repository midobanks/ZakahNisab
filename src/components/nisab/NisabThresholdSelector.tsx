'use client';

import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NisabThresholdSelectorProps {
  value: 'gold' | 'silver';
  onChange: (value: 'gold' | 'silver') => void;
}

export function NisabThresholdSelector({ value, onChange }: NisabThresholdSelectorProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📏</span>
          <h3 className="text-sm font-semibold text-gray-900">Nisab Threshold</h3>
        </div>

        <div className="flex gap-2 rounded-lg border border-gray-300 p-1" role="radiogroup" aria-label="Nisab threshold type">
          <button
            role="radio"
            aria-checked={value === 'silver'}
            onClick={() => onChange('silver')}
            className={cn(
              'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
              value === 'silver'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900'
            )}
          >
            Silver Nisab
          </button>
          <button
            role="radio"
            aria-checked={value === 'gold'}
            onClick={() => onChange('gold')}
            className={cn(
              'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
              value === 'gold'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900'
            )}
          >
            Gold Nisab
          </button>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700 leading-relaxed">
          {value === 'silver'
            ? (
              <>
                <p className="font-medium mb-1">Silver Nisab (595g silver) — the lower threshold</p>
                <p>The Silver Nisab is typically lower than the Gold Nisab. It is recommended for people whose wealth is largely in cash, savings, trade goods, or business assets, as it ensures Zakah becomes due sooner and benefits those in need.</p>
              </>
            )
            : (
              <>
                <p className="font-medium mb-1">Gold Nisab (87.48g gold) — the higher threshold</p>
                <p>Some scholars follow this for determining Zakah obligation. It results in a higher threshold, meaning fewer people are obligated, but it is a valid opinion within certain schools of thought.</p>
              </>
            )}
        </div>
      </div>
    </Card>
  );
}
