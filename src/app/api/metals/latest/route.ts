import { NextRequest, NextResponse } from 'next/server';
import { getLatestMetalPrices } from '@/services/metals';
import { isValidCurrency } from '@/lib/validation';
import type { CurrencyCode } from '@/types/zakah';

export async function GET(request: NextRequest) {
  const currency = (request.nextUrl.searchParams.get('currency') ?? 'USD').toUpperCase();

  if (!isValidCurrency(currency)) {
    return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 });
  }

  try {
    const result = await getLatestMetalPrices(currency as CurrencyCode);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=600, s-maxage=600' },
    });
  } catch (error) {
    console.error('[METALS API]', error);
    return NextResponse.json(
      { success: false, status: 'unavailable', message: 'Unable to fetch precious metals data.' },
      { status: 503 }
    );
  }
}
