import { schedule } from 'node-cron';

let initialized = false;

export function startDailyRefresh() {
  if (initialized) return;
  initialized = true;

  schedule('0 0 * * *', async () => {
    console.log('[SCHEDULER] Starting daily refresh...');

    const results: string[] = [];

    try {
      const { refreshMetalPrices } = await import('@/services/metals');
      await refreshMetalPrices();
      results.push('metal_prices: success');
    } catch (err) {
      results.push(`metal_prices: ${err instanceof Error ? err.message : 'failed'}`);
    }

    try {
      const { refreshExchangeRates } = await import('@/services/exchange-rates');
      await refreshExchangeRates();
      results.push('exchange_rates: success');
    } catch (err) {
      results.push(`exchange_rates: ${err instanceof Error ? err.message : 'failed'}`);
    }

    console.log('[SCHEDULER] Daily refresh complete:', results.join(' | '));
  });

  console.log('[SCHEDULER] Daily refresh scheduled for 12:00 AM');
}
