import type { ZakahInputs, MetalPrices, NisabType, ZakahResult } from '@/types/zakah';
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, ZAKAH_RATE } from './constants';

function clamp(value: number): number {
  return Math.max(value, 0);
}

export function calculateZakah(
  inputs: ZakahInputs,
  prices: MetalPrices,
  nisabType: NisabType
): ZakahResult {
  const cash = clamp(inputs.cash);
  const investments = clamp(inputs.investments);
  const goldGrams = clamp(inputs.goldGrams);
  const silverGrams = clamp(inputs.silverGrams);
  const businessAssets = clamp(inputs.businessAssets);
  const receivables = clamp(inputs.receivables);
  const otherAssets = clamp(inputs.otherAssets);
  const debts = clamp(inputs.debts);

  const goldValue = goldGrams * prices.goldPricePerGram;
  const silverValue = silverGrams * prices.silverPricePerGram;

  const totalAssets = cash + investments + goldValue + silverValue + businessAssets + receivables + otherAssets;
  const totalDebts = debts;
  const netWealth = Math.max(totalAssets - totalDebts, 0);

  const goldNisabValue = GOLD_NISAB_GRAMS * prices.goldPricePerGram;
  const silverNisabValue = SILVER_NISAB_GRAMS * prices.silverPricePerGram;

  const selectedNisabValue = nisabType === 'gold' ? goldNisabValue : silverNisabValue;

  const isAboveNisab = netWealth >= selectedNisabValue;
  const zakahDue = isAboveNisab ? netWealth * ZAKAH_RATE : 0;

  return {
    goldValue,
    silverValue,
    totalAssets,
    totalDebts,
    netWealth,
    goldNisabValue,
    silverNisabValue,
    selectedNisabValue,
    isAboveNisab,
    zakahDue,
    nisabType,
  };
}
