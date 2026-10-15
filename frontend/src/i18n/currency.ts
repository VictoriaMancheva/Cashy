import { DEFAULT_CURRENCY } from '@/i18n/currencies'

// Read by plain formatter functions which cannot use React context
let currentCurrency: string = DEFAULT_CURRENCY

export const getCurrency = (): string => currentCurrency

export const setCurrency = (currency: string): void => {
  currentCurrency = currency
}
