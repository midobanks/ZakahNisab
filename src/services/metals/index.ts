import MetalpriceAPI from 'metalpriceapi-ts';
import { prisma } from '@/lib/prisma';
import { MOCK_PRICES, MOCK_LAST_UPDATED } from '@/data/mock-prices';
import { getLatestRates } from '@/services/exchange-rates';
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS } from '@/lib/constants';
import type { CurrencyCode, MetalPriceStatus } from '@/types/zakah';

const TROY_OUNCE_IN_GRAMS = 31.1034768;

interface NormalizedMetalPrices {
  goldPricePerTroyOunce: number;
  silverPricePerTroyOunce: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
}

export function normalizeMetalPrices(params: {
  goldRate: number;
  silverRate: number;
  ratesAreInverse: boolean;
}): NormalizedMetalPrices {
  const goldPricePerTroyOunce = params.ratesAreInverse
    ? 1 / params.goldRate
    : params.goldRate;

  const silverPricePerTroyOunce = params.ratesAreInverse
    ? 1 / params.silverRate
    : params.silverRate;

  if (!Number.isFinite(goldPricePerTroyOunce) || !Number.isFinite(silverPricePerTroyOunce)) {
    throw new Error('Invalid metal price response.');
  }

  if (goldPricePerTroyOunce <= 0 || silverPricePerTroyOunce <= 0) {
    throw new Error('Metal prices must be greater than zero.');
  }

  if (goldPricePerTroyOunce <= silverPricePerTroyOunce) {
    throw new Error('Gold price must be greater than silver price.');
  }

  return {
    goldPricePerTroyOunce,
    silverPricePerTroyOunce,
    goldPricePerGram: goldPricePerTroyOunce / TROY_OUNCE_IN_GRAMS,
    silverPricePerGram: silverPricePerTroyOunce / TROY_OUNCE_IN_GRAMS,
  };
}

export function calculateNisabValues(params: {
  goldPricePerGram: number;
  silverPricePerGram: number;
}) {
  return {
    gold: {
      grams: GOLD_NISAB_GRAMS,
      value: params.goldPricePerGram * GOLD_NISAB_GRAMS,
    },
    silver: {
      grams: SILVER_NISAB_GRAMS,
      value: params.silverPricePerGram * SILVER_NISAB_GRAMS,
    },
  };
}

async function fetchFromMetalpriceAPI(): Promise<NormalizedMetalPrices> {
  const apiKey = process.env.METALPRICE_API_KEY;
  if (!apiKey) {
    throw new Error('METALPRICE_API_KEY is not configured');
  }

  const api = new MetalpriceAPI(apiKey);
  const res = await api.fetchLive('USD', ['XAU', 'XAG'], 'gram');

  if (!res.data.success) {
    throw new Error('MetalpriceAPI request failed');
  }

  const rates = res.data.rates;
  if (!rates?.XAU || !rates?.XAG) {
    throw new Error('MetalpriceAPI response missing metal rates');
  }

  return normalizeMetalPrices({ goldRate: rates.XAU, silverRate: rates.XAG, ratesAreInverse: true });
}

async function fetchFromMetalsAPI(): Promise<NormalizedMetalPrices> {
  const apiKey = process.env.METALS_API_KEY;
  if (!apiKey) {
    throw new Error('METALS_API_KEY is not configured');
  }

  const url = new URL('https://metals-api.com/api/latest');
  url.searchParams.set('access_key', apiKey);
  url.searchParams.set('base', 'USD');
  url.searchParams.set('symbols', 'XAU,XAG');

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Metals-API request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(`Metals-API returned error: ${data.error?.message ?? 'unknown'}`);
  }

  if (!data.rates?.XAU || !data.rates?.XAG) {
    throw new Error('Metals-API response missing metal rates');
  }

  const goldRate = data.rates.XAU;
  const silverRate = data.rates.XAG;

  return normalizeMetalPrices({ goldRate, silverRate, ratesAreInverse: true });
}

export async function fetchMetalPrices(): Promise<{
  prices: NormalizedMetalPrices;
  provider: string;
  sourceTimestamp: string;
}> {
  const errors: string[] = [];

  // Try primary provider
  if (process.env.METALPRICE_API_KEY) {
    try {
      const prices = await fetchFromMetalpriceAPI();
      return {
        prices,
        provider: 'metalpriceapi',
        sourceTimestamp: new Date().toISOString(),
      };
    } catch (err) {
      errors.push(`metalpriceapi: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  }

  // Try fallback provider
  if (process.env.METALS_API_KEY) {
    try {
      const prices = await fetchFromMetalsAPI();
      return {
        prices,
        provider: 'metals-api',
        sourceTimestamp: new Date().toISOString(),
      };
    } catch (err) {
      errors.push(`metals-api: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  }

  throw new Error(`All metal price providers failed: ${errors.join('; ')}`);
}

export async function saveMetalPrices(params: {
  prices: NormalizedMetalPrices;
  provider: string;
  sourceTimestamp: string;
  status: MetalPriceStatus;
}): Promise<void> {
  await prisma.metalPrice.create({
    data: {
      provider: params.provider,
      baseCurrency: 'USD',
      goldPricePerTroyOunce: params.prices.goldPricePerTroyOunce,
      silverPricePerTroyOunce: params.prices.silverPricePerTroyOunce,
      goldPricePerGram: params.prices.goldPricePerGram,
      silverPricePerGram: params.prices.silverPricePerGram,
      sourceTimestamp: new Date(params.sourceTimestamp),
      status: params.status,
    },
  });
}

export async function refreshMetalPrices(): Promise<void> {
  let logRecord: { id: string } | null = null;
  const startedAt = new Date();

  try {
    logRecord = await logRefreshStart('metal_prices', 'metalpriceapi', startedAt);

    const result = await fetchMetalPrices();
    await saveMetalPrices({
      prices: result.prices,
      provider: result.provider,
      sourceTimestamp: result.sourceTimestamp,
      status: 'live',
    });

    await logRefreshComplete(logRecord.id, 'success', 'Metal prices refreshed successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (logRecord) {
      await logRefreshComplete(logRecord.id, 'failed', message);
    }
    throw error;
  }
}

const MAX_STALE_HOURS = Number(process.env.METAL_PRICE_MAX_STALE_HOURS) || 24;

export async function getLatestMetalPrices(
  currency: CurrencyCode = 'USD'
): Promise<{
  success: boolean;
  currency: CurrencyCode;
  baseCurrency: string;
  source: string;
  status: MetalPriceStatus;
  updatedAt: string;
  prices: {
    gold: { symbol: string; pricePerGram: number; pricePerTroyOunce: number };
    silver: { symbol: string; pricePerGram: number; pricePerTroyOunce: number };
  };
  nisab: {
    gold: { grams: number; value: number };
    silver: { grams: number; value: number };
  };
  disclaimer: string;
}> {
  let goldPricePerGram: number;
  let silverPricePerGram: number;
  let goldPerTroyOz: number;
  let silverPerTroyOz: number;
  let source: string;
  let status: MetalPriceStatus;
  let updatedAt: string;

  // 1. Try MetalPrice DB table (populated by cron when API key is set)
  try {
    const latestRecord = await prisma.metalPrice.findFirst({
      orderBy: { fetchedAt: 'desc' },
    });
    if (latestRecord) {
      const age = Date.now() - latestRecord.fetchedAt.getTime();
      const isStale = age > MAX_STALE_HOURS * 60 * 60 * 1000;
      goldPricePerGram = latestRecord.goldPricePerGram;
      silverPricePerGram = latestRecord.silverPricePerGram;
      goldPerTroyOz = latestRecord.goldPricePerTroyOunce;
      silverPerTroyOz = latestRecord.silverPricePerTroyOunce;
      source = latestRecord.provider;
      status = isStale ? 'cached' : 'live';
      updatedAt = latestRecord.fetchedAt.toISOString();
    } else {
      throw new Error('No MetalPrice record found');
    }
  } catch {
    // 2. Fallback to mock USD prices + live exchange rates
    const usdEntry = MOCK_PRICES['USD']!;
    goldPricePerGram = usdEntry.goldPerGram;
    silverPricePerGram = usdEntry.silverPerGram;
    goldPerTroyOz = usdEntry.goldPerGram * TROY_OUNCE_IN_GRAMS;
    silverPerTroyOz = usdEntry.silverPerGram * TROY_OUNCE_IN_GRAMS;
    source = 'mock';
    status = 'fallback';
    updatedAt = MOCK_LAST_UPDATED;
  }

  // Convert to target currency via live exchange rates
  if (currency !== 'USD') {
    try {
      const exchangeRates = await getLatestRates();
      const rate = exchangeRates.rates[currency];
      if (rate) {
        goldPricePerGram = goldPricePerGram * rate;
        silverPricePerGram = silverPricePerGram * rate;
        goldPerTroyOz = goldPerTroyOz * rate;
        silverPerTroyOz = silverPerTroyOz * rate;
        source = exchangeRates.isStale ? source : 'frankfurter';
        status = source === 'frankfurter' ? (exchangeRates.isStale ? 'cached' : 'live') : status;
        updatedAt = exchangeRates.lastUpdatedAt;
      }
    } catch {
      // exchange rate conversion best-effort
    }
  }

  const nisab = calculateNisabValues({ goldPricePerGram, silverPricePerGram });

  return {
    success: true,
    currency,
    baseCurrency: 'USD',
    source,
    status,
    updatedAt,
    prices: {
      gold: { symbol: 'XAU', pricePerGram: goldPricePerGram, pricePerTroyOunce: goldPerTroyOz },
      silver: { symbol: 'XAG', pricePerGram: silverPricePerGram, pricePerTroyOunce: silverPerTroyOz },
    },
    nisab,
    disclaimer: 'Nisab values are estimates based on precious metals prices and exchange rates. Local market values may vary.',
  };
}

async function logRefreshStart(
  service: string,
  provider: string,
  startedAt: Date
): Promise<{ id: string }> {
  const record = await prisma.apiRefreshLog.create({
    data: { service, provider, status: 'started', startedAt },
  });
  return { id: record.id };
}

async function logRefreshComplete(id: string, status: string, message: string): Promise<void> {
  try {
    await prisma.apiRefreshLog.update({
      where: { id },
      data: { status, message, completedAt: new Date() },
    });
  } catch {
    // logging failure should not break the refresh
  }
}
