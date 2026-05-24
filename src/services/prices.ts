import type { CurrencyCode, MetalPrices, MetalPriceStatus } from '@/types/zakah';
import { MOCK_PRICES } from '@/data/mock-prices';
import { prisma } from '@/lib/prisma';
import { PRICES_CACHE_DURATION_MS } from '@/lib/constants';
import { getLatestRates } from '@/services/exchange-rates';
import { fetchMetalPrices, saveMetalPrices } from '@/services/metals';

const MAX_STALE_HOURS = Number(process.env.METAL_PRICE_MAX_STALE_HOURS) || 24;

async function getUsdPrices(): Promise<{
  goldPerGram: number;
  silverPerGram: number;
  lastUpdated: string;
  status: MetalPriceStatus;
}> {
  // 1. Try MetalPrice DB table (populated by cron when API key is set)
  try {
    const latestRecord = await prisma.metalPrice.findFirst({
      orderBy: { fetchedAt: 'desc' },
    });
    if (latestRecord) {
      const age = Date.now() - latestRecord.fetchedAt.getTime();
      const status: MetalPriceStatus = age > MAX_STALE_HOURS * 60 * 60 * 1000 ? 'cached' : 'live';
      return {
        goldPerGram: latestRecord.goldPricePerGram,
        silverPerGram: latestRecord.silverPricePerGram,
        lastUpdated: latestRecord.fetchedAt.toISOString(),
        status,
      };
    }
  } catch {
    // DB error
  }

  // 2. Try fetching live from MetalpriceAPI / Metals-API
  try {
    const result = await fetchMetalPrices();
    const { goldPricePerGram, silverPricePerGram } = result.prices;

    await saveMetalPrices({
      prices: result.prices,
      provider: result.provider,
      sourceTimestamp: result.sourceTimestamp,
      status: 'live',
    }).catch(() => {});

    return {
      goldPerGram: goldPricePerGram,
      silverPerGram: silverPricePerGram,
      lastUpdated: result.sourceTimestamp,
      status: 'live',
    };
  } catch {
    // live fetch failed
  }

  // 3. Fallback to mock USD
  const usdEntry = MOCK_PRICES['USD']!;
  return {
    goldPerGram: usdEntry.goldPerGram,
    silverPerGram: usdEntry.silverPerGram,
    lastUpdated: new Date().toISOString(),
    status: 'fallback',
  };
}

async function convertUsdToTarget(
  goldPerGram: number,
  silverPerGram: number,
  currency: CurrencyCode
): Promise<{ gold: number; silver: number; lastUpdated: string; isStale: boolean }> {
  if (currency === 'USD') {
    return { gold: goldPerGram, silver: silverPerGram, lastUpdated: new Date().toISOString(), isStale: false };
  }

  try {
    const exchangeRates = await getLatestRates();
    const rate = exchangeRates.rates[currency];
    if (rate) {
      return {
        gold: goldPerGram * rate,
        silver: silverPerGram * rate,
        lastUpdated: exchangeRates.lastUpdatedAt,
        isStale: exchangeRates.isStale,
      };
    }
  } catch {
    // conversion best-effort
  }

  return { gold: goldPerGram, silver: silverPerGram, lastUpdated: new Date().toISOString(), isStale: true };
}

export async function getPrices(currency: CurrencyCode): Promise<MetalPrices> {
  const usdPrices = await getUsdPrices();
  const converted = await convertUsdToTarget(usdPrices.goldPerGram, usdPrices.silverPerGram, currency);
  return {
    goldPricePerGram: converted.gold,
    silverPricePerGram: converted.silver,
    currency,
    lastUpdated: converted.lastUpdated,
    status: usdPrices.status === 'fallback' ? (converted.isStale ? 'fallback' : 'cached') : usdPrices.status,
    isStale: usdPrices.status === 'fallback' && converted.isStale,
  };
}

export async function getAllPrices(): Promise<Record<string, MetalPrices>> {
  const usdPrices = await getUsdPrices();
  const exchangeRates = await getLatestRates();
  const result: Record<string, MetalPrices> = {};

  for (const currency of Object.keys(MOCK_PRICES) as CurrencyCode[]) {
    const rate = exchangeRates.rates[currency];
    if (rate && currency !== 'USD') {
      result[currency] = {
        goldPricePerGram: usdPrices.goldPerGram * rate,
        silverPricePerGram: usdPrices.silverPerGram * rate,
        currency,
        lastUpdated: exchangeRates.lastUpdatedAt,
        status: exchangeRates.isStale ? 'cached' : 'live',
        isStale: exchangeRates.isStale,
      };
    } else {
      result[currency] = {
        goldPricePerGram: usdPrices.goldPerGram,
        silverPricePerGram: usdPrices.silverPerGram,
        currency,
        lastUpdated: usdPrices.lastUpdated,
        status: usdPrices.status as MetalPriceStatus,
        isStale: true,
      };
    }
  }
  return result;
}

export async function getExchangeRates(): Promise<Record<string, number>> {
  try {
    const rates = await getLatestRates();
    return rates.rates;
  } catch {
    const { MOCK_EXCHANGE_RATES } = await import('@/data/mock-prices');
    return MOCK_EXCHANGE_RATES;
  }
}

export async function cachePrices(
  currency: string,
  goldPrice: number,
  silverPrice: number,
  exchangeRate: number
): Promise<void> {
  await prisma.priceCache.upsert({
    where: { currency },
    update: { goldPrice, silverPrice, exchangeRate },
    create: { currency, goldPrice, silverPrice, exchangeRate },
  });
}

export async function getCachedPrices(
  currency: string
): Promise<{ goldPrice: number; silverPrice: number; exchangeRate: number; lastUpdatedAt: Date } | null> {
  const cached = await prisma.priceCache.findUnique({ where: { currency } });
  if (!cached) return null;

  const age = Date.now() - cached.lastUpdatedAt.getTime();
  if (age > PRICES_CACHE_DURATION_MS) return null;

  return {
    goldPrice: cached.goldPrice,
    silverPrice: cached.silverPrice,
    exchangeRate: cached.exchangeRate,
    lastUpdatedAt: cached.lastUpdatedAt,
  };
}
