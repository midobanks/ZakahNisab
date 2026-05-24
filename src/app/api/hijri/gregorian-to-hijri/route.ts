import { NextRequest, NextResponse } from 'next/server';
import { gregorianToHijri } from '@/services/hijri';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'INVALID_DATE', message: 'Provide a valid date in YYYY-MM-DD format.' },
      { status: 400 }
    );
  }

  try {
    const result = await gregorianToHijri(date);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[HIJRI GTOH API]', error);
    return NextResponse.json(
      { error: 'CONVERSION_FAILED', message: 'Failed to convert date.' },
      { status: 502 }
    );
  }
}
