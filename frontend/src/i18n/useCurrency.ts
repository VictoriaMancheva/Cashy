import { useContext } from 'react'

import type { CurrencyContextValue } from '@/i18n/CurrencyContext'
import { CurrencyContext } from '@/i18n/CurrencyContext'

export const useCurrency = (): CurrencyContextValue => {
  const context = useContext(CurrencyContext)
  if (context == null) throw new Error('useCurrency must be used inside CurrencyProvider')
  return context
}
