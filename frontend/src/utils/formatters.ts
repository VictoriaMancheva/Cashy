import { getLocale } from '@/i18n/locale'

// All formatters follow the language chosen in the language switcher

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(amount)

export const formatCurrencyShort = (amount: number): string =>
  new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)

export const formatMoney = (amount: number, currency: string): string =>
  new Intl.NumberFormat(getLocale(), { style: 'currency', currency: currency.toUpperCase() }).format(amount)

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(getLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

// month is 1-based (1 = January)
export const formatMonth = (month: number, style: 'long' | 'short' = 'long'): string => {
  const name = new Date(2000, month - 1, 1).toLocaleDateString(getLocale(), { month: style })
  return name.charAt(0).toLocaleUpperCase(getLocale()) + name.slice(1)
}

export const CURRENT_YEAR = new Date().getFullYear()

export const SELECT_NONE = '__none__'
