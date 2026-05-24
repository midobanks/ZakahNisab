'use client';

import { cn } from '@/lib/utils';

interface NisabThresholdSelectorProps {
  value: 'gold' | 'silver';
  onChange: (value: 'gold' | 'silver') => void;
}

export function NisabThresholdSelector({ value, onChange }: NisabThresholdSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Nisab Threshold
      </label>
      <div className="flex gap-2 rounded-lg border border-gray-300 p-1" role="radiogroup" aria-label="Nisab threshold type">
        <button
          role="radio"
          aria-checked={value === 'silver'}
          onClick={() => onChange('silver')}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
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
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            value === 'gold'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:text-gray-900'
          )}
        >
          Gold Nisab
        </button>
      </div>
      <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
        {value === 'silver'
          ? 'Silver Nisab (612.36g silver) — the lower threshold. Many scholars recommend this as it is more cautious and ensures Zakah is given sooner.'
          : 'Gold Nisab (87.48g gold) — the higher threshold. Some scholars follow this for determining Zakah obligation.'}
      </div>
    </div>
  );
}
