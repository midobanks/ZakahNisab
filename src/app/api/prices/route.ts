import { NextRequest, NextResponse } from 'next/server';
import { getPrices } from '@/services/prices';
import { isValidCurrency } from '@/lib/validation';
import type { CurrencyCode } from '@/types/zakah';

export async function GET(request: NextRequest) {
  const currency = (request.nextUrl.searchParams.get('currency') ?? 'NGN').toUpperCase();

  if (!isValidCurrency(currency)) {
    return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 });
  }

  try {
    const prices = await getPrices(currency as CurrencyCode);
    return NextResponse.json(prices, {
      headers: { 'Cache-Control': 'public, max-age=21600, s-maxage=21600' },
    });
  } catch (err) {
    console.error('[PRICES API]', err);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
