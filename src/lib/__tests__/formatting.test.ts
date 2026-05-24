import { describe, it, expect } from 'vitest';
import { formatCurrency, formatGrams, formatPercent, formatNumber } from '@/lib/formatting';

describe('formatCurrency', () => {
  it('formats USD with $ symbol', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('formats NGN with ₦ symbol', () => {
    expect(formatCurrency(500000, 'NGN')).toBe('₦500,000.00');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
  });
});

describe('formatGrams', () => {
  it('formats grams with g suffix', () => {
    expect(formatGrams(87.48)).toBe('87.48g');
  });

  it('formats zero grams', () => {
    expect(formatGrams(0)).toBe('0.00g');
  });
});

describe('formatPercent', () => {
  it('formats 0.025 as 2.5%', () => {
    expect(formatPercent(0.025)).toBe('2.5%');
  });

  it('formats 1 as 100%', () => {
    expect(formatPercent(1)).toBe('100.0%');
  });
});

describe('formatNumber', () => {
  it('formats number with commas and decimals', () => {
    expect(formatNumber(1234567.89)).toBe('1,234,567.89');
  });
});
