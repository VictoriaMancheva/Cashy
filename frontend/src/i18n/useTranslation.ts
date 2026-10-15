import { useContext } from 'react'

import type { LanguageContextValue } from '@/i18n/LanguageContext'
import { LanguageContext } from '@/i18n/LanguageContext'

export const useTranslation = (): LanguageContextValue => {
  const context = useContext(LanguageContext)
  if (context == null) throw new Error('useTranslation must be used inside LanguageProvider')
  return context
}
