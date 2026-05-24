import { NextResponse } from 'next/server';
import { getTodayHijri } from '@/services/hijri';

export async function GET() {
  try {
    const hijriDate = await getTodayHijri();
    return NextResponse.json(hijriDate, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    });
  } catch (error) {
    console.error('[HIJRI TODAY API]', error);
    return NextResponse.json(
      { error: 'HIJRI_DATE_UNAVAILABLE', message: 'Hijri date is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
