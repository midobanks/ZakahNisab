# Hijri Calendar API Integration Guide for ZakahNisab

## Purpose

ZakahNisab uses Hijri calendar data to support Islamic date display and future Hawl-based Zakah reminders. Since Zakah becomes due after one full lunar year when eligible wealth remains above Nisab, the app must handle Hijri dates clearly and responsibly.

This file provides implementation context for developers and AI coding agents building the Hijri calendar layer of ZakahNisab.

---

## Recommended MVP API

Use **Aladhan Hijri Calendar API** for the MVP.

### Why Aladhan?

- Free and developer-friendly.
- Supports Gregorian-to-Hijri conversion.
- Supports Hijri-to-Gregorian conversion.
- Supports Islamic calendar data by month.
- Easy to integrate into a web app.
- Good enough for MVP display and reminder planning.

Official API documentation:

```text
https://aladhan.com/islamic-calendar-api
```

---

## Important Islamic Product Note

Hijri dates may differ by country, local moon sighting, or institutional calculation method. ZakahNisab should not present calculated Hijri dates as universally final.

Always include a small disclaimer near Hijri date displays or on the methodology page:

> Hijri dates are calculated estimates and may vary based on local moon sighting or regional Islamic authority.

---

## MVP Use Cases

ZakahNisab needs the Hijri Calendar API for the following MVP and near-MVP use cases:

1. Display today’s Hijri date in the app header.
2. Convert a Gregorian date to Hijri.
3. Convert a Hijri date to Gregorian.
4. Support future Zakah due-date reminders based on one lunar year.
5. Show Islamic date context for Nisab and Zakah calculations.
6. Store user-selected Hawl start and due dates.

---

## Recommended Architecture

Do not call the Hijri calendar API directly from many frontend components. Create a backend wrapper or service layer.

Recommended flow:

```text
Frontend
  ↓
ZakahNisab Backend / API Route
  ↓
Hijri Calendar Provider
  ↓
Normalized Hijri Date Response
  ↓
Frontend UI
```

This allows ZakahNisab to:

- Replace the provider later if needed.
- Cache today’s Hijri date.
- Normalize response formats.
- Add regional calculation options later.
- Handle API failures gracefully.

---

## Environment Variables

Aladhan does not usually require an API key for basic usage. Still, define provider-related variables for future flexibility.

```env
HIJRI_CALENDAR_PROVIDER=aladhan
HIJRI_DEFAULT_ADJUSTMENT=0
HIJRI_DEFAULT_METHOD=calculated
```

Optional future variables:

```env
HIJRI_DEFAULT_COUNTRY=NG
HIJRI_DEFAULT_CITY=Lagos
HIJRI_USE_MOON_SIGHTING=false
```

---

## Core API Endpoints

### 1. Gregorian to Hijri Conversion

Use this when displaying today’s Hijri date or converting a user-selected Gregorian date.

```text
GET https://api.aladhan.com/v1/gToH/{date}
```

Date format:

```text
DD-MM-YYYY
```

Example:

```text
GET https://api.aladhan.com/v1/gToH/18-05-2026
```

Expected response includes:

- Gregorian date
- Hijri date
- Hijri day
- Hijri month
- Hijri year
- Weekday
- Islamic month name

---

### 2. Hijri to Gregorian Conversion

Use this for future reminder workflows where a user selects a Hijri Zakah due date and the app needs the corresponding Gregorian date for email scheduling.

```text
GET https://api.aladhan.com/v1/hToG/{date}
```

Date format:

```text
DD-MM-YYYY
```

Example:

```text
GET https://api.aladhan.com/v1/hToG/01-09-1447
```

---

### 3. Hijri Calendar for a Month

Use this if the product later adds a Hijri date picker or Islamic calendar view.

```text
GET https://api.aladhan.com/v1/hijriCalendar/{year}/{month}
```

Example:

```text
GET https://api.aladhan.com/v1/hijriCalendar/1447/9
```

---

## Internal Backend API Design

Create internal ZakahNisab endpoints so the frontend does not depend directly on Aladhan response structures.

### Endpoint: Get Today’s Hijri Date

```http
GET /api/hijri/today
```

Recommended response:

```json
{
  "provider": "aladhan",
  "gregorianDate": "2026-05-18",
  "hijriDate": "1447-12-01",
  "hijriDisplay": "Dhul-Hijjah 1, 1447 AH",
  "hijriDay": 1,
  "hijriMonth": 12,
  "hijriMonthName": "Dhul-Hijjah",
  "hijriYear": 1447,
  "weekday": "Monday",
  "adjustment": 0,
  "isEstimate": true,
  "lastUpdatedAt": "2026-05-18T00:00:00.000Z"
}
```

---

### Endpoint: Convert Gregorian to Hijri

```http
GET /api/hijri/gregorian-to-hijri?date=2026-05-18
```

Recommended response:

```json
{
  "provider": "aladhan",
  "gregorianDate": "2026-05-18",
  "hijriDate": "1447-12-01",
  "hijriDisplay": "Dhul-Hijjah 1, 1447 AH",
  "adjustment": 0,
  "isEstimate": true
}
```

---

### Endpoint: Convert Hijri to Gregorian

```http
GET /api/hijri/hijri-to-gregorian?date=1447-12-01
```

Recommended response:

```json
{
  "provider": "aladhan",
  "hijriDate": "1447-12-01",
  "gregorianDate": "2026-05-18",
  "gregorianDisplay": "Mon, May 18, 2026",
  "adjustment": 0,
  "isEstimate": true
}
```

---

## Date Formatting Rules

Use ISO format internally.

### Internal Storage

Store Gregorian dates as:

```text
YYYY-MM-DD
```

Store Hijri dates as:

```text
YYYY-MM-DD
```

Example:

```text
1447-12-01
```

### UI Display

Display Hijri dates in a user-friendly format:

```text
Dhul-Hijjah 1, 1447 AH
```

Or compact header format:

```text
Dhul-Hijjah 1, 1447 AH
```

Avoid showing only numeric Hijri dates unless space is limited.

---

## Hawl and Zakah Reminder Logic

For ZakahNisab, Hawl means one lunar year. In general product terms:

```text
Zakah due date = Hawl start date + 1 Hijri year
```

Recommended reminder flow:

1. User enters or confirms the date they first reached Nisab.
2. App converts this date to Hijri.
3. App calculates the due date as the same Hijri day and month in the next Hijri year.
4. App converts that Hijri due date back to Gregorian.
5. App schedules reminders before the Gregorian due date.

Example:

```text
Hawl start date: Ramadan 10, 1447 AH
Zakah due date: Ramadan 10, 1448 AH
```

Important: if a Hijri date does not map cleanly due to month length differences, use the closest valid date and explain this internally in logs.

---

## Reminder Scheduling Recommendation

For future reminder emails, store both Hijri and Gregorian dates.

Recommended database fields:

```sql
hawl_start_gregorian_date DATE
hawl_start_hijri_date TEXT
zakat_due_gregorian_date DATE
zakat_due_hijri_date TEXT
hijri_provider TEXT
hijri_adjustment INTEGER DEFAULT 0
hijri_is_estimate BOOLEAN DEFAULT true
```

This makes the system auditable and prevents confusion if the provider’s conversion changes later.

---

## Caching Strategy

Cache today’s Hijri date for 24 hours.

Recommended cache key:

```text
hijri:today:{timezone}:{adjustment}
```

Example:

```text
hijri:today:Africa-Lagos:0
```

For date conversions, cache by date:

```text
hijri:gToH:2026-05-18:0
hijri:hToG:1447-12-01:0
```

---

## Error Handling

If the Hijri API fails:

1. Use the last cached successful Hijri date if available.
2. Show Gregorian date normally.
3. Display a subtle warning only if needed.
4. Log the provider failure.
5. Do not block the Zakah calculator.

Recommended fallback UI copy:

> Hijri date is temporarily unavailable. Zakah calculations still work, but reminder dates may need confirmation.

---

## Frontend Display Requirements

### Header

Show both Hijri and Gregorian dates.

Example:

```text
Dhul-Hijjah 1, 1447 AH • Mon, May 18, 2026
```

### Reminder Card

Use Hijri context when explaining Hawl.

Recommended copy:

> Zakah is due annually after holding wealth above Nisab for one full lunar year. You can set a reminder based on your Hawl date.

### Methodology Page

Add this explanation:

> ZakahNisab uses calculated Hijri calendar data to estimate Islamic dates. Since Hijri dates can vary by moon sighting and local authority, users should confirm important Zakah due dates with trusted local guidance where necessary.

---

## TypeScript Types

```ts
export type HijriDateProvider = 'aladhan';

export interface HijriDateResponse {
  provider: HijriDateProvider;
  gregorianDate: string; // YYYY-MM-DD
  hijriDate: string; // YYYY-MM-DD
  hijriDisplay: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriYear: number;
  weekday?: string;
  adjustment: number;
  isEstimate: boolean;
  lastUpdatedAt?: string;
}

export interface HijriConversionRequest {
  date: string;
  adjustment?: number;
}
```

---

## Example TypeScript Service

```ts
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

export async function getHijriFromGregorian(isoDate: string) {
  const formattedDate = toAladhanDateFormat(isoDate);
  const response = await fetch(`${ALADHAN_BASE_URL}/gToH/${formattedDate}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Hijri date');
  }

  const json = await response.json();
  const hijri = json.data.hijri;
  const gregorian = json.data.gregorian;

  return {
    provider: 'aladhan',
    gregorianDate: isoDate,
    hijriDate: normalizeHijriDateParts(
      hijri.day,
      hijri.month.number,
      hijri.year
    ),
    hijriDisplay: `${hijri.month.en} ${Number(hijri.day)}, ${hijri.year} AH`,
    hijriDay: Number(hijri.day),
    hijriMonth: Number(hijri.month.number),
    hijriMonthName: hijri.month.en,
    hijriYear: Number(hijri.year),
    weekday: gregorian.weekday?.en,
    adjustment: 0,
    isEstimate: true,
    lastUpdatedAt: new Date().toISOString(),
  };
}
```

---

## Example Next.js API Route

```ts
import { NextResponse } from 'next/server';
import { getHijriFromGregorian } from '@/lib/hijri';

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const hijriDate = await getHijriFromGregorian(today);

    return NextResponse.json(hijriDate, {
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'HIJRI_DATE_UNAVAILABLE',
        message: 'Hijri date is temporarily unavailable.',
      },
      { status: 503 }
    );
  }
}
```

---

## Testing Requirements

### Unit Tests

Test the following:

- Gregorian date formatting for Aladhan.
- Hijri date normalization.
- Empty or invalid date handling.
- API failure handling.
- Display string generation.

### Integration Tests

Test:

- `/api/hijri/today` returns a normalized response.
- `/api/hijri/gregorian-to-hijri` works for valid dates.
- `/api/hijri/hijri-to-gregorian` works for valid dates.
- Failed provider response returns a controlled error.

### UI Tests

Test:

- Header displays Hijri and Gregorian dates.
- Layout does not break on mobile.
- Fallback message appears if Hijri API fails.

---

## Acceptance Criteria

The Hijri Calendar API integration is complete when:

1. The app displays today’s Hijri date in the header.
2. The app displays today’s Gregorian date beside it.
3. The frontend receives normalized Hijri data from an internal API route.
4. The app does not break if the Hijri provider fails.
5. Hijri dates are clearly marked as calculated estimates.
6. Future Hawl reminder logic can convert between Gregorian and Hijri dates.
7. Date values are stored in consistent ISO formats.
8. The methodology page explains Hijri date limitations.

---

## Future Enhancements

Consider adding:

1. Regional Hijri date preferences.
2. Local moon-sighting provider support.
3. Manual Hijri date adjustment by user.
4. Scholar or institution-specific calendar settings.
5. Ramadan and Dhul-Hijjah special reminders.
6. Hijri date picker for Hawl start date.
7. Mosque or charity embed calendar mode.

---

## Agent Instructions

When implementing Hijri calendar functionality for ZakahNisab:

1. Use an internal service wrapper rather than calling Aladhan directly from UI components.
2. Normalize all provider responses before sending them to the frontend.
3. Store Gregorian and Hijri dates separately for reminder workflows.
4. Keep the calculator independent of Hijri API availability.
5. Add a disclaimer that Hijri dates may vary by local moon sighting.
6. Avoid making religious claims beyond calculated date support.
7. Keep the implementation provider-agnostic so the API can be replaced later.
