# Precious Metals API Guide for ZakahNisab

## Purpose

ZakahNisab needs a reliable precious metals data layer to calculate the daily Nisab threshold for gold and silver.

The app must use precious metals prices to calculate:

- Gold Nisab value: `87.48g × gold price per gram`
- Silver Nisab value: `612.36g × silver price per gram`
- User-entered gold value: `gold grams owned × gold price per gram`
- User-entered silver value: `silver grams owned × silver price per gram`

This file defines the standard implementation context for integrating a Precious Metals API into ZakahNisab.

---

## Recommended Provider for MVP

### Primary Recommendation: MetalpriceAPI

Use **MetalpriceAPI** as the MVP provider if you want one API that can support both precious metals and currency conversion.

Official docs: https://metalpriceapi.com/documentation

MetalpriceAPI provides JSON REST endpoints for live and historical precious metals and forex rates across many currencies.

### Alternative Provider: Metals-API

Use **Metals-API** if you prefer a dedicated metals-rate provider with current, historical, conversion, timeseries, and fluctuation features.

Official docs: https://metals-api.com/documentation

### Benchmark / Governance Reference: LBMA

Use **LBMA** as a methodology reference, not necessarily as the MVP data provider.

LBMA gold and silver benchmarks are globally recognised, but real-time or historical benchmark use may require licensing.

Reference: https://www.lbma.org.uk/prices-and-data/precious-metal-prices

---

## MVP Decision

For the first production version of ZakahNisab:

```text
Primary provider: MetalpriceAPI
Fallback provider: Metals-API or cached database value
Benchmark reference: LBMA, where licensing allows
Refresh frequency: Daily minimum; hourly preferred if plan allows
Frontend access: Not allowed
Backend access: Required
```

Do not call the metals API directly from the frontend. All API calls must happen through backend/server functions or scheduled jobs.

---

## Required Environment Variables

Add these to `.env.local` for local development and to the production environment on Vercel/Supabase/hosting provider.

```bash
# Precious Metals API
METAL_API_PROVIDER=metalpriceapi
METALPRICE_API_KEY=replace_with_real_key
METALS_API_KEY=replace_with_real_key_if_using_fallback

# Base currency for stored canonical metal prices
METAL_PRICE_BASE_CURRENCY=USD

# Refresh settings
METAL_PRICE_REFRESH_CRON=0 */6 * * *
METAL_PRICE_MAX_STALE_HOURS=24

# Nisab constants
GOLD_NISAB_GRAMS=87.48
SILVER_NISAB_GRAMS=612.36
```

Never expose API keys with `NEXT_PUBLIC_` or any client-visible environment variable.

---

## Nisab Constants

Use these constants throughout the app:

```ts
export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;
export const ZAKAH_RATE = 0.025;
```

The app should clearly show that gold and silver Nisab values are estimates based on live precious metals data, exchange rates, purity assumptions, and provider availability.

---

## Required Data Points

The application needs the following metal price values:

| Data Point | Required | Notes |
|---|---:|---|
| Gold price per gram | Yes | Used for gold Nisab and user gold assets |
| Silver price per gram | Yes | Used for silver Nisab and user silver assets |
| Gold price per troy ounce | Optional | Useful because many APIs return XAU per troy ounce |
| Silver price per troy ounce | Optional | Useful because many APIs return XAG per troy ounce |
| Base currency | Yes | Recommended canonical base: USD |
| Timestamp | Yes | Used for freshness and trust |
| Provider name | Yes | Shown internally and optionally on methodology page |
| Source status | Yes | `live`, `cached`, `fallback`, or `manual_override` |

---

## Unit Conversion Rules

Most precious metals markets quote prices per **troy ounce**.

Use this conversion:

```ts
const TROY_OUNCE_IN_GRAMS = 31.1034768;

function pricePerGram(pricePerTroyOunce: number): number {
  return pricePerTroyOunce / TROY_OUNCE_IN_GRAMS;
}
```

### Formula

```text
price_per_gram = price_per_troy_ounce / 31.1034768
```

---

## Nisab Calculation Rules

```ts
const goldNisabValue = goldPricePerGram * 87.48;
const silverNisabValue = silverPricePerGram * 612.36;
```

### Example

```ts
const goldPricePerGram = 75;
const silverPricePerGram = 0.95;

const goldNisab = goldPricePerGram * 87.48;
const silverNisab = silverPricePerGram * 612.36;
```

---

## Recommended Architecture

```text
External Precious Metals API
        ↓
Scheduled backend job / server function
        ↓
Normalize price response
        ↓
Store latest prices in database
        ↓
Calculate gold and silver Nisab values
        ↓
Expose safe internal API to frontend
        ↓
Frontend displays values and timestamp
```

The frontend must never depend directly on third-party API response shapes.

---

## Backend API Contract

Create an internal endpoint for the frontend:

```http
GET /api/metals/latest?currency=NGN
```

### Response Shape

```json
{
  "success": true,
  "currency": "NGN",
  "baseCurrency": "USD",
  "source": "metalpriceapi",
  "status": "live",
  "updatedAt": "2026-05-24T08:00:00.000Z",
  "prices": {
    "gold": {
      "symbol": "XAU",
      "pricePerGram": 185000.25,
      "pricePerTroyOunce": 5754250.55
    },
    "silver": {
      "symbol": "XAG",
      "pricePerGram": 2100.75,
      "pricePerTroyOunce": 65341.44
    }
  },
  "nisab": {
    "gold": {
      "grams": 87.48,
      "value": 16183521.87
    },
    "silver": {
      "grams": 612.36,
      "value": 1286483.27
    }
  },
  "disclaimer": "Nisab values are estimates based on precious metals prices and exchange rates. Local market values may vary."
}
```

### Error Response

```json
{
  "success": false,
  "status": "unavailable",
  "message": "Unable to fetch current precious metals prices. Please try again later."
}
```

---

## Database Schema

### Table: `metal_prices`

```sql
create table if not exists metal_prices (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  base_currency text not null default 'USD',
  gold_price_per_troy_ounce numeric not null,
  silver_price_per_troy_ounce numeric not null,
  gold_price_per_gram numeric not null,
  silver_price_per_gram numeric not null,
  source_timestamp timestamptz,
  fetched_at timestamptz not null default now(),
  status text not null default 'live',
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_metal_prices_fetched_at
on metal_prices (fetched_at desc);

create index if not exists idx_metal_prices_provider
on metal_prices (provider);
```

### Table: `nisab_values`

```sql
create table if not exists nisab_values (
  id uuid primary key default gen_random_uuid(),
  metal_price_id uuid references metal_prices(id),
  currency text not null,
  gold_nisab_grams numeric not null default 87.48,
  silver_nisab_grams numeric not null default 612.36,
  gold_nisab_value numeric not null,
  silver_nisab_value numeric not null,
  exchange_rate numeric,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_nisab_values_currency_calculated_at
on nisab_values (currency, calculated_at desc);
```

### Table: `api_refresh_logs`

```sql
create table if not exists api_refresh_logs (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  provider text not null,
  status text not null,
  message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  raw_error jsonb
);
```

---

## TypeScript Types

```ts
export type MetalProvider = 'metalpriceapi' | 'metals-api' | 'manual';
export type MetalPriceStatus = 'live' | 'cached' | 'fallback' | 'manual_override' | 'unavailable';

export interface MetalPriceRecord {
  provider: MetalProvider;
  baseCurrency: string;
  goldPricePerTroyOunce: number;
  silverPricePerTroyOunce: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
  sourceTimestamp?: string;
  fetchedAt: string;
  status: MetalPriceStatus;
}

export interface NisabValues {
  currency: string;
  goldNisabGrams: number;
  silverNisabGrams: number;
  goldNisabValue: number;
  silverNisabValue: number;
  calculatedAt: string;
}
```

---

## Fetching Latest Prices

### MetalpriceAPI Example

> Confirm exact endpoint parameters in the official docs before production deployment.

```ts
const endpoint = new URL('https://api.metalpriceapi.com/v1/latest');
endpoint.searchParams.set('api_key', process.env.METALPRICE_API_KEY!);
endpoint.searchParams.set('base', 'USD');
endpoint.searchParams.set('currencies', 'XAU,XAG');

const response = await fetch(endpoint.toString(), {
  headers: { Accept: 'application/json' },
  next: { revalidate: 3600 }
});

if (!response.ok) {
  throw new Error(`MetalpriceAPI request failed: ${response.status}`);
}

const data = await response.json();
```

### Metals-API Example

> Confirm exact endpoint parameters in the official docs before production deployment.

```ts
const endpoint = new URL('https://metals-api.com/api/latest');
endpoint.searchParams.set('access_key', process.env.METALS_API_KEY!);
endpoint.searchParams.set('base', 'USD');
endpoint.searchParams.set('symbols', 'XAU,XAG');

const response = await fetch(endpoint.toString(), {
  headers: { Accept: 'application/json' },
  next: { revalidate: 3600 }
});

if (!response.ok) {
  throw new Error(`Metals-API request failed: ${response.status}`);
}

const data = await response.json();
```

---

## Important Provider Response Warning

Some metals APIs return rates as the inverse relationship, for example:

```text
1 USD = x XAU
```

instead of:

```text
1 XAU = x USD
```

If the API returns `USD → XAU`, convert it like this:

```ts
const goldPricePerTroyOunceUsd = 1 / data.rates.XAU;
const silverPricePerTroyOunceUsd = 1 / data.rates.XAG;
```

Always verify this with the provider documentation and a sanity check.

### Sanity Check

Gold per troy ounce should usually be much higher than silver per troy ounce.

```ts
if (goldPricePerTroyOunce <= silverPricePerTroyOunce) {
  throw new Error('Invalid metal prices: gold price should be greater than silver price.');
}
```

---

## Normalization Function

```ts
const TROY_OUNCE_IN_GRAMS = 31.1034768;

interface NormalizedMetalPrices {
  goldPricePerTroyOunce: number;
  silverPricePerTroyOunce: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
}

export function normalizeMetalPrices(params: {
  goldRate: number;
  silverRate: number;
  ratesAreInverse: boolean;
}): NormalizedMetalPrices {
  const goldPricePerTroyOunce = params.ratesAreInverse
    ? 1 / params.goldRate
    : params.goldRate;

  const silverPricePerTroyOunce = params.ratesAreInverse
    ? 1 / params.silverRate
    : params.silverRate;

  if (!Number.isFinite(goldPricePerTroyOunce) || !Number.isFinite(silverPricePerTroyOunce)) {
    throw new Error('Invalid metal price response.');
  }

  if (goldPricePerTroyOunce <= 0 || silverPricePerTroyOunce <= 0) {
    throw new Error('Metal prices must be greater than zero.');
  }

  if (goldPricePerTroyOunce <= silverPricePerTroyOunce) {
    throw new Error('Gold price must be greater than silver price.');
  }

  return {
    goldPricePerTroyOunce,
    silverPricePerTroyOunce,
    goldPricePerGram: goldPricePerTroyOunce / TROY_OUNCE_IN_GRAMS,
    silverPricePerGram: silverPricePerTroyOunce / TROY_OUNCE_IN_GRAMS
  };
}
```

---

## Calculating Nisab Values

```ts
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

export function calculateNisabValues(params: {
  goldPricePerGram: number;
  silverPricePerGram: number;
}) {
  return {
    gold: {
      grams: GOLD_NISAB_GRAMS,
      value: params.goldPricePerGram * GOLD_NISAB_GRAMS
    },
    silver: {
      grams: SILVER_NISAB_GRAMS,
      value: params.silverPricePerGram * SILVER_NISAB_GRAMS
    }
  };
}
```

---

## Currency Conversion Strategy

Recommended standard:

1. Store canonical metal prices in USD.
2. Store exchange rates separately using the Exchange Rate API.
3. Convert the metal price and Nisab value to the user-selected currency internally.
4. Return only the selected-currency result to the frontend.

```ts
function convertCurrency(amountInUsd: number, usdToTargetRate: number): number {
  return amountInUsd * usdToTargetRate;
}
```

Example:

```ts
const goldPricePerGramNgn = convertCurrency(goldPricePerGramUsd, usdToNgnRate);
const silverPricePerGramNgn = convertCurrency(silverPricePerGramUsd, usdToNgnRate);
```

---

## Refresh Policy

### MVP

```text
Refresh metal prices every 6 hours.
Use cached value if latest refresh fails.
Show stale data warning if value is older than 24 hours.
Block calculation only if no valid cached value exists.
```

### Suggested Cron

```bash
0 */6 * * *
```

This means every 6 hours.

---

## Fallback Behaviour

| Scenario | Expected Behaviour |
|---|---|
| API succeeds | Store latest value and mark `live` |
| API fails but cache exists | Return cached value and mark `cached` |
| API fails and fallback provider succeeds | Store fallback value and mark `fallback` |
| All APIs fail and cache is under 24h old | Return cache with warning |
| All APIs fail and cache is older than 24h | Return cache with stronger stale warning |
| No data exists | Show unavailable state and disable calculator result |

---

## User-Facing Freshness Copy

### Live

```text
Live data · Updated today
```

### Cached

```text
Using latest available data · Last updated [date/time]
```

### Stale

```text
Precious metals data may be outdated. Last updated [date/time]. Please verify before making final Zakah decisions.
```

---

## Methodology Copy for Product

Use this on the Methodology page:

```text
ZakahNisab calculates Nisab using the widely referenced measures of 87.48 grams of gold and 612.36 grams of silver. We multiply these weights by the latest available gold and silver prices from our precious metals data provider, then convert the values into your selected currency using current exchange rates.

These values are estimates. Local gold and silver market prices may vary due to purity, dealer spread, taxes, exchange rate movement, and regional pricing. For complex circumstances, consult a qualified scholar.
```

---

## Islamic Disclaimer

```text
ZakahNisab provides educational calculations based on commonly accepted Zakah principles. It does not issue fatwas and does not replace guidance from a qualified scholar. Individual circumstances may differ, especially for business assets, investments, debts, pensions, inheritance, and mixed assets.
```

---

## Product Requirements Checklist

- [ ] Fetch gold price from backend only
- [ ] Fetch silver price from backend only
- [ ] Convert troy ounce prices to gram prices
- [ ] Calculate gold Nisab using 87.48g
- [ ] Calculate silver Nisab using 612.36g
- [ ] Store API response in database
- [ ] Store normalized price values
- [ ] Store provider name and timestamp
- [ ] Add stale-data handling
- [ ] Add fallback cache behaviour
- [ ] Display last updated timestamp in UI
- [ ] Add methodology explanation
- [ ] Add Islamic disclaimer
- [ ] Add monitoring/logging for failed refreshes
- [ ] Never expose API keys to frontend

---

## Engineering Acceptance Criteria

The Precious Metals API integration is complete when:

1. A scheduled backend job fetches gold and silver prices successfully.
2. Prices are normalized into price per troy ounce and price per gram.
3. Gold and silver Nisab values are calculated correctly.
4. Prices and Nisab values are stored in the database.
5. Frontend receives values only from an internal API route.
6. API keys are not visible in the frontend bundle.
7. The UI shows the selected currency, Nisab value, and last updated timestamp.
8. Cached fallback values are used when the provider fails.
9. Stale data warnings appear when required.
10. The Methodology page explains the calculation clearly.

---

## Testing Scenarios

### Unit Tests

```text
pricePerGram() converts troy ounce value correctly
calculateNisabValues() calculates gold Nisab correctly
calculateNisabValues() calculates silver Nisab correctly
normalizeMetalPrices() handles inverse rates correctly
normalizeMetalPrices() rejects zero or negative prices
normalizeMetalPrices() rejects impossible gold/silver relationship
```

### Integration Tests

```text
/api/metals/latest returns gold and silver prices
/api/metals/latest returns selected currency values
/api/metals/latest falls back to cached data when provider fails
scheduled job writes to metal_prices table
scheduled job writes refresh logs
```

### UI Tests

```text
User sees gold Nisab card
User sees silver Nisab card
User sees updated timestamp
User sees cached warning if data is stale
User can calculate Zakah using gold and silver values
```

---

## Example Internal API Route: Next.js

```ts
// app/api/metals/latest/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') || 'USD';

  try {
    // 1. Read latest normalized USD metal prices from DB
    // 2. Read latest USD-to-target exchange rate from DB
    // 3. Convert prices into selected currency
    // 4. Calculate Nisab values
    // 5. Return safe response to frontend

    return NextResponse.json({
      success: true,
      currency,
      status: 'live',
      updatedAt: new Date().toISOString(),
      prices: {
        gold: {
          symbol: 'XAU',
          pricePerGram: 0,
          pricePerTroyOunce: 0
        },
        silver: {
          symbol: 'XAG',
          pricePerGram: 0,
          pricePerTroyOunce: 0
        }
      },
      nisab: {
        gold: {
          grams: 87.48,
          value: 0
        },
        silver: {
          grams: 612.36,
          value: 0
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'unavailable',
        message: 'Unable to fetch precious metals data.'
      },
      { status: 503 }
    );
  }
}
```

---

## Recommended Implementation Order

1. Create database tables.
2. Add environment variables.
3. Build provider fetch function.
4. Normalize API response.
5. Save metal prices to database.
6. Build `/api/metals/latest` internal route.
7. Connect frontend Nisab cards.
8. Connect calculator gold/silver gram conversion.
9. Add fallback and stale-data logic.
10. Add monitoring and logs.
11. Add methodology page content.

---

## Notes for Antigravity Agent

When implementing this feature:

- Keep API provider logic isolated in `lib/services/metals/`.
- Do not couple UI components to third-party provider response formats.
- Use typed interfaces for normalized metal prices.
- Store raw API responses for debugging, but never expose raw responses to users.
- Treat cached data as acceptable only when clearly labelled.
- Use `Decimal` or safe numeric handling for financial calculations where possible.
- Write tests for all calculation functions.
- Keep Islamic constants centralized and documented.

Suggested file structure:

```text
lib/
  constants/
    zakah.ts
  services/
    metals/
      index.ts
      metalpriceapi.ts
      metalsApi.ts
      normalize.ts
      calculateNisab.ts
  db/
    metalPrices.ts
app/
  api/
    metals/
      latest/
        route.ts
    cron/
      refresh-metal-prices/
        route.ts
components/
  nisab/
    NisabCards.tsx
    MetalPriceStatus.tsx
```

---

## Final Standard

ZakahNisab must treat precious metals prices as a trusted financial data dependency.

The product should always show:

```text
Nisab value + selected currency + timestamp + data status + methodology access
```

Accuracy, transparency, and graceful fallback are mandatory for user trust.
