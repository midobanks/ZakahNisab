import { NextResponse } from 'next/server';
import { refreshExchangeRates } from '@/services/exchange-rates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    await refreshExchangeRates();
    return NextResponse.json({ success: true, message: 'Exchange rates refreshed' });
  } catch (error) {
    console.error('[CRON EXCHANGE RATES]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to refresh exchange rates' },
      { status: 500 }
    );
  }
}
