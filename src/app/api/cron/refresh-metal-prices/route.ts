import { NextResponse } from 'next/server';
import { refreshMetalPrices } from '@/services/metals';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    await refreshMetalPrices();
    return NextResponse.json({ success: true, message: 'Metal prices refreshed' });
  } catch (error) {
    console.error('[CRON METAL PRICES]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to refresh metal prices' },
      { status: 500 }
    );
  }
}
