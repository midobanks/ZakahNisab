import type { HijriDateResponse } from '@/types/zakah';
import { MOCK_HIJRI_DATE } from '@/data/mock-prices';

const ALADHAN_BASE_URL = 'https://api.aladhan.com/v1';

function toAladhanDateFormat(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

function normalizeHijriDateParts(day: string, month: string | number, year: string): string {
  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(month).padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
}

function getFallbackTodayResponse(): HijriDateResponse {
  const today = new Date().toISOString().slice(0, 10);
  return {
    provider: 'aladhan',
    gregorianDate: today,
    hijriDate: `${MOCK_HIJRI_DATE.year}-12-01`,
    hijriDisplay: MOCK_HIJRI_DATE.formatted,
    hijriDay: MOCK_HIJRI_DATE.day,
    hijriMonth: 12,
    hijriMonthName: MOCK_HIJRI_DATE.month,
    hijriYear: MOCK_HIJRI_DATE.year,
    adjustment: 0,
    isEstimate: true,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export async function getTodayHijri(): Promise<HijriDateResponse> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    return await gregorianToHijri(today);
  } catch {
    console.warn('[HIJRI SERVICE] Aladhan API failed, using fallback');
    return getFallbackTodayResponse();
  }
}

export async function gregorianToHijri(
  isoDate: string,
  adjustment = 0
): Promise<HijriDateResponse> {
  const formattedDate = toAladhanDateFormat(isoDate);
  const url = `${ALADHAN_BASE_URL}/gToH/${formattedDate}${adjustment ? `?adjustment=${adjustment}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Aladhan gToH failed: ${response.status}`);
  }

  const json = await response.json();
  const hijri = json.data.hijri;
  const gregorian = json.data.gregorian;

  return {
    provider: 'aladhan',
    gregorianDate: isoDate,
    hijriDate: normalizeHijriDateParts(hijri.day, hijri.month.number, hijri.year),
    hijriDisplay: `${hijri.month.en} ${Number(hijri.day)}, ${hijri.year} AH`,
    hijriDay: Number(hijri.day),
    hijriMonth: Number(hijri.month.number),
    hijriMonthName: hijri.month.en,
    hijriYear: Number(hijri.year),
    weekday: gregorian.weekday?.en,
    adjustment,
    isEstimate: true,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export async function hijriToGregorian(
  isoDate: string,
  adjustment = 0
): Promise<{ provider: string; hijriDate: string; gregorianDate: string; gregorianDisplay: string; adjustment: number; isEstimate: boolean }> {
  const formattedDate = toAladhanDateFormat(isoDate);
  const url = `${ALADHAN_BASE_URL}/hToG/${formattedDate}${adjustment ? `?adjustment=${adjustment}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Aladhan hToG failed: ${response.status}`);
  }

  const json = await response.json();
  const gregorian = json.data.gregorian;

  const gregMonthName = gregorian.month.en;
  const gregDay = Number(gregorian.day);
  const gregYear = gregorian.year;
  const weekday = gregorian.weekday?.en ?? '';

  return {
    provider: 'aladhan',
    hijriDate: isoDate,
    gregorianDate: normalizeHijriDateParts(gregorian.day, gregorian.month.number, gregorian.year),
    gregorianDisplay: `${weekday ? `${weekday}, ` : ''}${gregMonthName} ${gregDay}, ${gregYear}`,
    adjustment,
    isEstimate: true,
  };
}
