import { NextResponse } from 'next/server';
import { getTodayHijri } from '@/services/hijri';

export async function GET() {
  try {
    const hijriDate = await getTodayHijri();
    return NextResponse.json(
      {
        day: hijriDate.hijriDay,
        month: hijriDate.hijriMonthName,
        year: hijriDate.hijriYear,
        formatted: hijriDate.hijriDisplay,
      },
      {
        headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
      }
    );
  } catch (err) {
    console.error('[HIJRI DATE API]', err);
    return NextResponse.json({ error: 'Failed to fetch Hijri date' }, { status: 500 });
  }
}
