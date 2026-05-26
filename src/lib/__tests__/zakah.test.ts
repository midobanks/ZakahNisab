import { describe, it, expect } from 'vitest';
import { calculateZakah } from '@/lib/zakah';
import type { ZakahInputs, MetalPrices } from '@/types/zakah';

const mockPrices: MetalPrices = {
  goldPricePerGram: 75.42,
  silverPricePerGram: 0.87,
  currency: 'USD',
  lastUpdated: '2026-05-18T08:00:00.000Z',
};

const silverNisabValue = 595 * 0.87; // ~517.65

function makeInputs(overrides: Partial<ZakahInputs> = {}): ZakahInputs {
  return {
    cash: 0, investments: 0, goldGrams: 0, silverGrams: 0,
    businessAssets: 0, receivables: 0, otherAssets: 0, debts: 0,
    ...overrides,
  };
}

describe('calculateZakah', () => {
  it('returns zero Zakah for empty inputs', () => {
    const result = calculateZakah(makeInputs(), mockPrices, 'silver');
    expect(result.zakahDue).toBe(0);
    expect(result.isAboveNisab).toBe(false);
    expect(result.netWealth).toBe(0);
  });

  it('returns below Nisab when net wealth is below Silver Nisab', () => {
    const result = calculateZakah(makeInputs({ cash: 500 }), mockPrices, 'silver');
    expect(result.isAboveNisab).toBe(false);
    expect(result.zakahDue).toBe(0);
  });

  it('returns Zakah due when net wealth exactly equals Silver Nisab', () => {
    const cash = silverNisabValue;
    const result = calculateZakah(makeInputs({ cash }), mockPrices, 'silver');
    expect(result.isAboveNisab).toBe(true);
    expect(result.zakahDue).toBe(cash * 0.025);
  });

  it('returns Zakah due when net wealth is above Nisab', () => {
    const cash = 10000;
    const result = calculateZakah(makeInputs({ cash }), mockPrices, 'silver');
    expect(result.isAboveNisab).toBe(true);
    expect(result.zakahDue).toBe(10000 * 0.025);
  });

  it('returns zero net wealth when debts exceed assets', () => {
    const result = calculateZakah(makeInputs({ cash: 500, debts: 1000 }), mockPrices, 'silver');
    expect(result.netWealth).toBe(0);
    expect(result.isAboveNisab).toBe(false);
    expect(result.zakahDue).toBe(0);
  });

  it('calculates gold value correctly from grams', () => {
    const result = calculateZakah(makeInputs({ goldGrams: 87.48 }), mockPrices, 'silver');
    expect(result.goldValue).toBeCloseTo(87.48 * 75.42, 2);
  });

  it('calculates silver value correctly from grams', () => {
    const result = calculateZakah(makeInputs({ silverGrams: 595 }), mockPrices, 'silver');
    expect(result.silverValue).toBeCloseTo(595 * 0.87, 2);
  });

  it('toggles isAboveNisab when switching Nisab type', () => {
    const cash = 5000; // Between gold and silver Nisab
    const silverResult = calculateZakah(makeInputs({ cash }), mockPrices, 'silver');
    const goldResult = calculateZakah(makeInputs({ cash }), mockPrices, 'gold');

    expect(silverResult.isAboveNisab).toBe(true);
    expect(goldResult.isAboveNisab).toBe(false);
  });

  it('clamps negative cash to zero', () => {
    const result = calculateZakah(
      makeInputs({ cash: -100 }),
      mockPrices,
      'silver'
    );
    expect(result.totalAssets).toBe(0);
  });

  it('handles large values without overflow', () => {
    const cash = 1_000_000_000;
    const result = calculateZakah(makeInputs({ cash }), mockPrices, 'silver');
    expect(result.isAboveNisab).toBe(true);
    expect(result.zakahDue).toBe(cash * 0.025);
  });

  it('includes all asset types in totalAssets', () => {
    const inputs = makeInputs({
      cash: 1000,
      investments: 2000,
      goldGrams: 10,
      silverGrams: 50,
      businessAssets: 3000,
      receivables: 500,
      otherAssets: 250,
    });
    const result = calculateZakah(inputs, mockPrices, 'silver');
    const expected = 1000 + 2000 + (10 * 75.42) + (50 * 0.87) + 3000 + 500 + 250;
    expect(result.totalAssets).toBeCloseTo(expected, 2);
  });
});
