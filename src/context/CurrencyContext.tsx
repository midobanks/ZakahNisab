'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CurrencyCode } from '@/types/zakah';
import { DEFAULT_CURRENCY, CURRENCY_STORAGE_KEY } from '@/lib/constants';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyChanged: boolean;
  clearCurrencyWarning: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

function getInitialCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored && ['USD','NGN','EUR','GBP','CAD','AUD','SAR','AED','GHS','ZAR','PKR','INR','MYR','IDR'].includes(stored)) {
    return stored as CurrencyCode;
  }
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getInitialCurrency);
  const [currencyChanged, setCurrencyChanged] = useState(false);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    setCurrencyChanged(true);
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  }, []);

  const clearCurrencyWarning = useCallback(() => {
    setCurrencyChanged(false);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyChanged, clearCurrencyWarning }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
