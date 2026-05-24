# Exchange Rate API Integration Guide for ZakahNisab

## 1. Purpose

ZakahNisab needs a reliable exchange rate API to convert gold and silver Nisab values into the user’s selected currency.

The exchange rate API will support:

- Multi-currency Nisab display
- Zakah calculations in local currencies
- Currency selector functionality
- Daily exchange rate refresh
- Cached fallback values when external APIs fail
- Transparent timestamping of financial data

This document defines how the exchange rate API should be integrated, stored, validated, and consumed across the ZakahNisab app.

---

## 2. Recommended API Provider

### MVP Recommendation

Use **ExchangeRate-API** for the MVP because it is simple to implement, supports many global currencies, and is suitable for daily currency conversion needs.

### Alternative Providers

If the product scales or requires stronger financial reporting, consider:

- Open Exchange Rates
- Fixer
- ExchangeRatesAPI
- CurrencyLayer

### Provider Selection Criteria

The selected provider must support:

- Current exchange rates
- Conversion from a base currency such as USD or EUR
- Major global currencies
- Stable uptime
- Clear API documentation
- Reasonable rate limits
- Historical exchange rates, preferably for post-MVP
- Commercial usage

---

## 3. Why ZakahNisab Needs Exchange Rates

Gold and silver spot prices are often returned in USD. However, users may want to view Nisab and calculate Zakah in currencies such as:

- NGN
- USD
- EUR
- GBP
- CAD
- AUD
- SAR
- AED
- GHS
- ZAR
- PKR
- INR
- MYR
- IDR

Exchange rates allow the app to convert metal-based Nisab values into the user’s selected currency.

Example:

```text
Gold Nisab Value = Gold Price per Gram × 87.48 grams
Silver Nisab Value = Silver Price per Gram × 612.36 grams
Converted Nisab = Nisab Value in Base Currency × Exchange Rate
```

---

## 4. Integration Principle

Do **not** call the exchange rate API directly from the frontend.

Use the backend as the source of truth.

Recommended architecture:

```text
Exchange Rate API
   ↓
Backend Scheduled Job
   ↓
Database Cache
   ↓
ZakahNisab Frontend
```

This prevents:

- API key exposure
- Rate limit abuse
- Inconsistent client-side calculations
- Poor fallback handling
- Untracked data refresh failures

---

## 5. Environment Variables

Add the following environment variables:

```env
EXCHANGE_RATE_API_KEY=your_api_key_here
EXCHANGE_RATE_API_BASE_URL=https://v6.exchangerate-api.com/v6
EXCHANGE_RATE_BASE_CURRENCY=USD
EXCHANGE_RATE_REFRESH_CRON=0 2 * * *
EXCHANGE_RATE_CACHE_TTL_HOURS=24
```

Recommended refresh time:

```text
02:00 UTC daily
```

This is suitable for MVP because Nisab values do not need second-by-second currency precision.

---

## 6. Supported Currencies

For MVP, support the following currencies:

```ts
export const SUPPORTED_CURRENCIES = [
  "NGN",
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "SAR",
  "AED",
  "GHS",
  "ZAR",
  "PKR",
  "INR",
  "MYR",
  "IDR"
] as const;
```

Each supported currency should have:

- ISO currency code
- Display name
- Symbol
- Locale formatting rule
- Decimal precision

Example:

```ts
export const CURRENCY_METADATA = {
  NGN: {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    locale: "en-NG",
    decimalPlaces: 2
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    locale: "en-US",
    decimalPlaces: 2
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    locale: "de-DE",
    decimalPlaces: 2
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    locale: "en-GB",
    decimalPlaces: 2
  }
};
```

---

## 7. API Request Pattern

### Example Request

```http
GET /latest/USD
Host: v6.exchangerate-api.com
Authorization: API_KEY
```

Or depending on provider format:

```http
GET https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD
```

### Expected Response Shape

```json
{
  "result": "success",
  "base_code": "USD",
  "time_last_update_utc": "Mon, 18 May 2026 00:00:01 +0000",
  "time_next_update_utc": "Tue, 19 May 2026 00:00:01 +0000",
  "conversion_rates": {
    "USD": 1,
    "NGN": 1500.25,
    "EUR": 0.92,
    "GBP": 0.79,
    "AED": 3.67,
    "SAR": 3.75
  }
}
```

---

## 8. Database Schema

### Table: exchange_rates

```sql
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate NUMERIC(20, 8) NOT NULL,
  provider TEXT NOT NULL,
  provider_updated_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_active_exchange_rate UNIQUE (base_currency, target_currency, provider_updated_at)
);
```

### Table: api_refresh_logs

```sql
CREATE TABLE api_refresh_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB
);
```

Recommended `service_name` value:

```text
exchange_rates
```

Recommended `status` values:

```text
success
failed
partial_success
skipped
```

---

## 9. Backend Fetch Job

### Job Name

```text
refreshExchangeRates
```

### Frequency

```text
Daily
```

### Responsibilities

The job should:

1. Fetch latest exchange rates from the selected provider.
2. Validate the response.
3. Filter only supported currencies.
4. Store rates in the database.
5. Mark previous rates inactive if necessary.
6. Log success or failure.
7. Preserve previous rates if the provider fails.

### Pseudocode

```ts
async function refreshExchangeRates() {
  const provider = "ExchangeRate-API";
  const baseCurrency = process.env.EXCHANGE_RATE_BASE_CURRENCY || "USD";

  await createRefreshLog({
    serviceName: "exchange_rates",
    provider,
    status: "started"
  });

  try {
    const response = await fetchExchangeRatesFromProvider(baseCurrency);

    validateExchangeRateResponse(response);

    const rates = SUPPORTED_CURRENCIES.map((currency) => ({
      baseCurrency,
      targetCurrency: currency,
      rate: response.conversion_rates[currency],
      provider,
      providerUpdatedAt: response.time_last_update_utc,
      fetchedAt: new Date()
    })).filter((rate) => Boolean(rate.rate));

    await saveExchangeRates(rates);

    await updateRefreshLog({
      serviceName: "exchange_rates",
      provider,
      status: "success",
      message: "Exchange rates refreshed successfully"
    });
  } catch (error) {
    await updateRefreshLog({
      serviceName: "exchange_rates",
      provider,
      status: "failed",
      message: error.message
    });

    throw error;
  }
}
```

---

## 10. Validation Rules

Before saving rates, validate that:

- Response status is successful.
- Base currency matches expected base currency.
- Conversion rates object exists.
- All required MVP currencies are present or missing currencies are logged.
- Each rate is greater than zero.
- Each rate is numeric.
- Provider timestamp exists.
- Rates are not older than the accepted freshness threshold.

Example validation:

```ts
function validateExchangeRate(rate: unknown): boolean {
  return typeof rate === "number" && Number.isFinite(rate) && rate > 0;
}
```

If one currency is missing, do not fail the entire refresh unless it is critical.

Critical MVP currencies:

```text
USD, NGN, EUR, GBP
```

---

## 11. Frontend Consumption

The frontend should consume exchange rates from the backend, not the external provider.

### Internal API Endpoint

```http
GET /api/exchange-rates/latest
```

### Optional Query Parameter

```http
GET /api/exchange-rates/latest?base=USD
```

### Response Shape

```json
{
  "baseCurrency": "USD",
  "provider": "ExchangeRate-API",
  "lastUpdatedAt": "2026-05-18T00:00:01.000Z",
  "fetchedAt": "2026-05-18T02:00:05.000Z",
  "isStale": false,
  "rates": {
    "USD": 1,
    "NGN": 1500.25,
    "EUR": 0.92,
    "GBP": 0.79,
    "AED": 3.67,
    "SAR": 3.75
  }
}
```

---

## 12. Currency Conversion Utility

Create a shared utility function.

```ts
export function convertCurrency({
  amount,
  fromCurrency,
  toCurrency,
  rates,
  baseCurrency = "USD"
}: {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rates: Record<string, number>;
  baseCurrency?: string;
}) {
  if (!Number.isFinite(amount)) return 0;
  if (amount <= 0) return 0;
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    throw new Error(`Missing exchange rate for ${fromCurrency} or ${toCurrency}`);
  }

  const amountInBase = fromCurrency === baseCurrency
    ? amount
    : amount / fromRate;

  return amountInBase * toRate;
}
```

---

## 13. Nisab Conversion Logic

Assume metal prices are stored in USD.

```ts
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

function calculateNisabValues({
  goldPricePerGramUsd,
  silverPricePerGramUsd,
  selectedCurrency,
  exchangeRates
}: {
  goldPricePerGramUsd: number;
  silverPricePerGramUsd: number;
  selectedCurrency: string;
  exchangeRates: Record<string, number>;
}) {
  const goldNisabUsd = goldPricePerGramUsd * GOLD_NISAB_GRAMS;
  const silverNisabUsd = silverPricePerGramUsd * SILVER_NISAB_GRAMS;

  return {
    goldNisab: convertCurrency({
      amount: goldNisabUsd,
      fromCurrency: "USD",
      toCurrency: selectedCurrency,
      rates: exchangeRates
    }),
    silverNisab: convertCurrency({
      amount: silverNisabUsd,
      fromCurrency: "USD",
      toCurrency: selectedCurrency,
      rates: exchangeRates
    })
  };
}
```

---

## 14. Formatting Currency Values

Use `Intl.NumberFormat`.

```ts
export function formatCurrency(amount: number, currency: string, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
```

For NGN:

```ts
formatCurrency(2049883.78, "NGN", "en-NG");
```

Expected display:

```text
₦2,049,883.78
```

---

## 15. Stale Data Handling

Exchange rates should be considered stale if:

```text
Current time - fetched_at > 24 hours
```

For MVP, allow a grace period of 48 hours before blocking or warning strongly.

### UI States

| State | Condition | UI Message |
|---|---|---|
| Fresh | Updated within 24 hours | Live Data · Updated Today |
| Stale | Older than 24 hours | Using latest available exchange rates |
| Very stale | Older than 48 hours | Exchange rates may be outdated |
| Failed | No rates available | Currency conversion temporarily unavailable |

### Recommended UI Copy

```text
Exchange rates are based on the latest available provider data. Values may vary slightly from local market rates.
```

If stale:

```text
We are using the most recent cached exchange rates because live rates are temporarily unavailable.
```

---

## 16. Error Handling

### External API Failure

If the external provider fails:

- Do not break the calculator.
- Use latest cached rates.
- Show stale data warning if necessary.
- Log the failed refresh.
- Retry on next schedule.

### Missing Currency Rate

If a selected currency is unavailable:

- Disable that currency in the dropdown.
- Show a helpful message.
- Fallback to USD only if user has not already selected a currency.

Recommended message:

```text
This currency is temporarily unavailable. Please choose another currency or try again later.
```

---

## 17. Security Requirements

- Never expose API keys in frontend code.
- Store provider keys in environment variables.
- Restrict API route access where appropriate.
- Rate-limit internal API endpoints.
- Validate all provider responses before saving.
- Log provider errors without exposing secrets.
- Use HTTPS only.

---

## 18. Testing Requirements

### Unit Tests

Test:

- Currency conversion
- Missing rates
- Invalid rates
- Same-currency conversion
- Zero and negative values
- Large values
- Currency formatting
- Stale data detection

Example test cases:

```ts
expect(convertCurrency({
  amount: 100,
  fromCurrency: "USD",
  toCurrency: "NGN",
  rates: { USD: 1, NGN: 1500 }
})).toBe(150000);
```

```ts
expect(convertCurrency({
  amount: 100,
  fromCurrency: "NGN",
  toCurrency: "USD",
  rates: { USD: 1, NGN: 1500 }
})).toBeCloseTo(0.0666, 4);
```

### Integration Tests

Test:

- Backend fetch job saves rates successfully.
- Failed provider response does not delete previous rates.
- Latest rates endpoint returns cached rates.
- Frontend updates displayed Nisab when currency changes.

### End-to-End Tests

Test:

1. User opens homepage.
2. User selects NGN.
3. App displays NGN Nisab values.
4. User switches to EUR.
5. App updates all Nisab and calculator values.
6. User enters assets.
7. Zakah result uses selected currency.

---

## 19. Analytics Events

Track the following events:

```text
currency_dropdown_opened
currency_changed
exchange_rate_data_loaded
exchange_rate_data_stale
exchange_rate_fetch_failed
nisab_currency_conversion_completed
```

Example payload:

```json
{
  "event": "currency_changed",
  "fromCurrency": "USD",
  "toCurrency": "NGN",
  "source": "header_dropdown",
  "timestamp": "2026-05-18T10:00:00.000Z"
}
```

---

## 20. Acceptance Criteria

The exchange rate integration is complete when:

- Exchange rates are fetched from the selected provider.
- Rates are stored in the database.
- The app supports all MVP currencies.
- Frontend does not call the external provider directly.
- Currency selector updates Nisab values globally.
- Calculator results use the selected currency.
- Exchange rate timestamp is visible or accessible.
- Failed API calls fall back to cached rates.
- Stale data warning is shown when needed.
- API keys are not exposed to the frontend.
- Core conversion logic is covered by tests.

---

## 21. Implementation Checklist

### Backend

- [ ] Create exchange rate provider account.
- [ ] Add API key to environment variables.
- [ ] Create `exchange_rates` table.
- [ ] Create `api_refresh_logs` table.
- [ ] Build exchange rate fetch service.
- [ ] Build response validation utility.
- [ ] Build scheduled refresh job.
- [ ] Store only supported currencies.
- [ ] Add cached fallback handling.
- [ ] Add error logging.

### Frontend

- [ ] Create currency metadata file.
- [ ] Build currency selector.
- [ ] Persist selected currency locally.
- [ ] Fetch latest rates from backend.
- [ ] Convert Nisab values to selected currency.
- [ ] Update calculator result based on selected currency.
- [ ] Show freshness or stale data message.
- [ ] Format all currency values consistently.

### QA

- [ ] Test all supported currencies.
- [ ] Test provider failure scenario.
- [ ] Test stale data display.
- [ ] Test invalid currency handling.
- [ ] Test mobile currency selector.
- [ ] Test calculation accuracy across currencies.

---

## 22. Product Notes for ZakahNisab

Currency conversion is only one part of Nisab accuracy. ZakahNisab should always communicate that final values are estimates because:

- Metal prices vary by provider.
- Exchange rates vary by provider.
- Local market gold and silver prices may differ.
- Currency volatility may affect displayed values.
- Islamic legal opinions may differ on practical application.

Recommended disclaimer:

```text
Nisab values are estimates based on precious metal prices and exchange rates from third-party providers. Local market prices may vary. For complex Zakah cases, consult a qualified scholar.
```

---

## 23. Future Enhancements

Post-MVP improvements:

- Historical exchange rates.
- User-selected provider preference.
- Regional default currency by country.
- Admin override for exchange rates.
- Multi-provider comparison.
- Exchange rate audit trail.
- Currency volatility warning.
- Exportable Zakah calculation summary.
