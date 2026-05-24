export type CurrencyCode = 
  | 'USD' | 'NGN' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'SAR'
  | 'AED' | 'GHS' | 'ZAR' | 'PKR' | 'INR' | 'MYR' | 'IDR';

export type NisabType = 'gold' | 'silver';

export interface MetalPrices {
  goldPricePerGram: number;
  silverPricePerGram: number;
  currency: CurrencyCode;
  lastUpdated: string;
  status?: MetalPriceStatus;
  isStale?: boolean;
}

export interface ZakahInputs {
  cash: number;
  investments: number;
  goldGrams: number;
  silverGrams: number;
  businessAssets: number;
  receivables: number;
  otherAssets: number;
  debts: number;
}

export interface ZakahResult {
  goldValue: number;
  silverValue: number;
  totalAssets: number;
  totalDebts: number;
  netWealth: number;
  goldNisabValue: number;
  silverNisabValue: number;
  selectedNisabValue: number;
  isAboveNisab: boolean;
  zakahDue: number;
  nisabType: NisabType;
}

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
}

export type HijriDateProvider = 'aladhan';

export interface HijriDateResponse {
  provider: HijriDateProvider;
  gregorianDate: string;
  hijriDate: string;
  hijriDisplay: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriYear: number;
  weekday?: string;
  adjustment: number;
  isEstimate: boolean;
  lastUpdatedAt?: string;
}

export interface HijriConversionRequest {
  date: string;
  adjustment?: number;
}

export type MetalProvider = 'metalpriceapi' | 'metals-api' | 'manual';

export type MetalPriceStatus = 'live' | 'cached' | 'fallback' | 'manual_override' | 'unavailable';

export interface MetalPriceRecord {
  provider: MetalProvider;
  baseCurrency: string;
  goldPricePerTroyOunce: number;
  silverPricePerTroyOunce: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
  sourceTimestamp?: string;
  fetchedAt: string;
  status: MetalPriceStatus;
}

export interface ExchangeRateResponse {
  baseCurrency: string;
  provider: string;
  lastUpdatedAt: string;
  fetchedAt: string;
  isStale: boolean;
  rates: Record<string, number>;
}
