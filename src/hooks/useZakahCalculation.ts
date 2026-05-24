'use client';

import { useMemo } from 'react';
import type { ZakahInputs, MetalPrices, NisabType, ZakahResult } from '@/types/zakah';
import { calculateZakah } from '@/lib/zakah';

export function useZakahCalculation(
  inputs: ZakahInputs,
  prices: MetalPrices | null,
  nisabType: NisabType
): ZakahResult | null {
  return useMemo(() => {
    if (!prices) return null;
    return calculateZakah(inputs, prices, nisabType);
  }, [inputs, prices, nisabType]);
}
