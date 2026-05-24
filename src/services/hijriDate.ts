import { MOCK_HIJRI_DATE } from '@/data/mock-prices';

export interface HijriDate {
  day: number;
  month: string;
  year: number;
  formatted: string;
}

export async function getHijriDate(): Promise<HijriDate> {
  return { ...MOCK_HIJRI_DATE };
}
