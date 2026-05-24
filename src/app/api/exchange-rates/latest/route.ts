import { NextRequest, NextResponse } from 'next/server';
import { getLatestRates } from '@/services/exchange-rates';
import { isValidCurrency } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const base = (request.nextUrl.searchParams.get('base') ?? 'USD').toUpperCase();
  if (!isValidCurrency(base)) {
    return NextResponse.json({ error: 'Unsupported base currency' }, { status: 400 });
  }

  try {
    const rates = await getLatestRates();
    return NextResponse.json(rates, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    });
  } catch (error) {
    console.error('[EXCHANGE RATES API]', error);
    return NextResponse.json(
      { error: 'EXCHANGE_RATES_UNAVAILABLE', message: 'Exchange rates are temporarily unavailable.' },
      { status: 503 }
    );
  }
}
