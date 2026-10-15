import { createContext, useCallback, useMemo, useState } from 'react'

import type { Currency } from '@/i18n/currencies'
import { CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY, isCurrency } from '@/i18n/currencies'
import { setCurrency } from '@/i18n/currency'

export type CurrencyContextValue = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const readStoredCurrency = (): Currency => {
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY)
    return stored != null && isCurrency(stored) ? stored : DEFAULT_CURRENCY
  } catch {
    return DEFAULT_CURRENCY
  }
}

type Props = {
  children: React.ReactNode
}

export const CurrencyProvider = ({ children }: Props) => {
  const [currency, setCurrencyState] = useState<Currency>(readStoredCurrency)

  // Set during render so formatters already use the new currency for this render pass
  setCurrency(currency)

  const handleSetCurrency = useCallback((next: Currency) => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this session
    }
    setCurrencyState(next)
  }, [])

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency: handleSetCurrency }),
    [currency, handleSetCurrency]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
