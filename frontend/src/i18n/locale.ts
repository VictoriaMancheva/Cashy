import { DEFAULT_LANGUAGE, getLanguageLocale } from '@/i18n/languages'

// Read by the plain formatter functions (dates, money, month names), which cannot use React context
let currentLocale = getLanguageLocale(DEFAULT_LANGUAGE)

export const getLocale = (): string => currentLocale

export const setLocale = (locale: string): void => {
  currentLocale = locale
}
