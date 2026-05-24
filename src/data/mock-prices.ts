export interface MockPriceEntry {
  goldPerGram: number;
  silverPerGram: number;
}

// NGN values match these targets exactly:
//   Gold Nisab (87.48g × 198,653.2189071788 NGN/g) = NGN 17,378,183.59
//   Silver Nisab (612.36g × 3,326.59680580051 NGN/g) = NGN 2,037,074.82
// USD base derived as NGN ÷ 1306 (mock exchange rate).
// Other currencies computed as USD × mock exchange rate (rounded to 2 d.p.).
export const MOCK_PRICES: Record<string, MockPriceEntry> = {
  USD: { goldPerGram: 152.108131, silverPerGram: 2.547242 },
  NGN: { goldPerGram: 198653.2189071788, silverPerGram: 3326.59680580051 },
  EUR: { goldPerGram: 141.46, silverPerGram: 2.37 },
  GBP: { goldPerGram: 120.17, silverPerGram: 2.01 },
  CAD: { goldPerGram: 208.39, silverPerGram: 3.49 },
  AUD: { goldPerGram: 228.16, silverPerGram: 3.82 },
  SAR: { goldPerGram: 570.41, silverPerGram: 9.55 },
  AED: { goldPerGram: 558.24, silverPerGram: 9.35 },
  GHS: { goldPerGram: 2369.84, silverPerGram: 39.69 },
  ZAR: { goldPerGram: 2783.58, silverPerGram: 46.61 },
  PKR: { goldPerGram: 42316.47, silverPerGram: 708.63 },
  INR: { goldPerGram: 12670.60, silverPerGram: 212.18 },
  MYR: { goldPerGram: 673.84, silverPerGram: 11.28 },
  IDR: { goldPerGram: 2436771.76, silverPerGram: 40806.14 },
};

export const MOCK_EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1306,
  EUR: 0.93,
  GBP: 0.79,
  CAD: 1.37,
  AUD: 1.50,
  SAR: 3.75,
  AED: 3.67,
  GHS: 15.58,
  ZAR: 18.30,
  PKR: 278.20,
  INR: 83.30,
  MYR: 4.43,
  IDR: 16020,
};

export const MOCK_HIJRI_DATE = {
  day: 10,
  month: 'Muharram',
  year: 1448,
  formatted: '10 Muharram 1448 AH',
};

export const MOCK_LAST_UPDATED = '2026-05-18T08:00:00.000Z';
