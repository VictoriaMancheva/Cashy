export const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
] as const

export type Currency = (typeof CURRENCIES)[number]['code']

export const DEFAULT_CURRENCY: Currency = 'EUR'

export const CURRENCY_STORAGE_KEY = 'currency'

export const isCurrency = (value: string): value is Currency =>
  CURRENCIES.some((c) => c.code === value)
