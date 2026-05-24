import { prisma } from '@/lib/prisma';
import { MOCK_EXCHANGE_RATES } from '@/data/mock-prices';
import type { ExchangeRateResponse } from '@/types/zakah';

const SUPPORTED_CURRENCY_CODES = [
  'USD', 'NGN', 'EUR', 'GBP', 'CAD', 'AUD', 'SAR',
  'AED', 'GHS', 'ZAR', 'PKR', 'INR', 'MYR', 'IDR',
] as const;

const FRANKFURTER_BASE_URL = process.env.FRANKFURTER_BASE_URL || 'https://api.frankfurter.dev/v2';
const BASE_CURRENCY = process.env.EXCHANGE_RATE_BASE_CURRENCY || 'USD';
const CACHE_TTL_HOURS = Number(process.env.EXCHANGE_RATE_CACHE_TTL_HOURS) || 24;

function validateRate(rate: unknown): rate is number {
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
}

export async function fetchLatestRatesFromProvider(): Promise<{
  rates: Record<string, number>;
  providerUpdatedAt: string;
}> {
  const quotes = SUPPORTED_CURRENCY_CODES.filter(c => c !== BASE_CURRENCY).join(',');
  const url = `${FRANKFURTER_BASE_URL}/rates?base=${BASE_CURRENCY}&quotes=${quotes}`;

  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Frankfurter API request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Frankfurter API returned unexpected response format');
  }

  const rates: Record<string, number> = {};
  let latestDate = '';

  for (const item of data) {
    if (item.base === BASE_CURRENCY && validateRate(item.rate)) {
      rates[item.quote] = item.rate;
    }
    if (item.date && (!latestDate || item.date > latestDate)) {
      latestDate = item.date;
    }
  }

  // Self-rate (1 USD = 1 USD)
  rates[BASE_CURRENCY] = 1;

  const critical = ['USD', 'NGN', 'EUR', 'GBP'];
  for (const c of critical) {
    if (rates[c] === undefined) {
      throw new Error(`Critical currency ${c} missing from Frankfurter response`);
    }
  }

  return {
    rates,
    providerUpdatedAt: latestDate || new Date().toISOString().slice(0, 10),
  };
}

export async function saveExchangeRates(params: {
  rates: Record<string, number>;
  provider: string;
  providerUpdatedAt: string;
}): Promise<void> {
  const upsertPromises = Object.entries(params.rates).map(([targetCurrency, rate]) =>
    prisma.exchangeRate.create({
      data: {
        baseCurrency: BASE_CURRENCY,
        targetCurrency,
        rate,
        provider: params.provider,
        providerUpdatedAt: new Date(params.providerUpdatedAt),
        isActive: true,
      },
    })
  );

  await Promise.all(upsertPromises);
}

export async function getLatestRates(): Promise<ExchangeRateResponse> {
  // 1. Try DB cache first
  try {
    const latestRows = await prisma.exchangeRate.findMany({
      where: { baseCurrency: BASE_CURRENCY, isActive: true },
      orderBy: { fetchedAt: 'desc' },
      take: SUPPORTED_CURRENCY_CODES.length,
      distinct: ['targetCurrency'],
    });

    if (latestRows.length > 0) {
      const rates: Record<string, number> = {};
      let latestFetchedAt = '';
      let latestProviderUpdatedAt = '';

      for (const row of latestRows) {
        rates[row.targetCurrency] = row.rate;
        const fetched = row.fetchedAt.toISOString();
        if (!latestFetchedAt || fetched > latestFetchedAt) {
          latestFetchedAt = fetched;
        }
        if (row.providerUpdatedAt) {
          const updated = row.providerUpdatedAt.toISOString();
          if (!latestProviderUpdatedAt || updated > latestProviderUpdatedAt) {
            latestProviderUpdatedAt = updated;
          }
        }
      }

      const isStale = Date.now() - new Date(latestFetchedAt).getTime() > CACHE_TTL_HOURS * 60 * 60 * 1000;

      return {
        baseCurrency: BASE_CURRENCY,
        provider: 'frankfurter',
        lastUpdatedAt: latestProviderUpdatedAt || latestFetchedAt,
        fetchedAt: latestFetchedAt,
        isStale,
        rates,
      };
    }
  } catch {
    // DB error — try live fetch
  }

  // 2. If DB empty/failed, fetch live from Frankfurter directly
  try {
    const { rates, providerUpdatedAt } = await fetchLatestRatesFromProvider();
    return {
      baseCurrency: BASE_CURRENCY,
      provider: 'frankfurter',
      lastUpdatedAt: providerUpdatedAt,
      fetchedAt: new Date().toISOString(),
      isStale: false,
      rates,
    };
  } catch {
    // live fetch failed — fall through to mock
  }

  // 3. Absolute fallback
  return getFallbackRates();
}

function getFallbackRates(): ExchangeRateResponse {
  return {
    baseCurrency: BASE_CURRENCY,
    provider: 'fallback',
    lastUpdatedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    isStale: true,
    rates: { ...MOCK_EXCHANGE_RATES },
  };
}

export async function refreshExchangeRates(): Promise<void> {
  let logRecord: { id: string } | null = null;
  const startedAt = new Date();

  try {
    logRecord = await logRefreshStart('exchange_rates', 'frankfurter', startedAt);

    const { rates, providerUpdatedAt } = await fetchLatestRatesFromProvider();
    await saveExchangeRates({
      rates,
      provider: 'frankfurter',
      providerUpdatedAt,
    });

    await logRefreshComplete(logRecord.id, 'success', 'Exchange rates refreshed successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (logRecord) {
      await logRefreshComplete(logRecord.id, 'failed', message);
    }
    throw error;
  }
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

export function convertCurrency(params: {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rates: Record<string, number>;
  baseCurrency?: string;
}): number {
  const { amount, fromCurrency, toCurrency, rates, baseCurrency = BASE_CURRENCY } = params;

  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    throw new Error(`Missing exchange rate for ${fromCurrency} or ${toCurrency}`);
  }

  const amountInBase = fromCurrency === baseCurrency ? amount : amount / fromRate;
  return amountInBase * toRate;
}
