import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import type { Language } from '@/i18n/languages'
import { DEFAULT_LANGUAGE, getLanguageLocale, isLanguage, LANGUAGE_STORAGE_KEY } from '@/i18n/languages'
import { setLocale } from '@/i18n/locale'
import type { TranslationKey, TranslationParams } from '@/i18n/translate'
import { translate, translateMessage } from '@/i18n/translate'

export type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, params?: TranslationParams) => string
  translateMessage: (message: string) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

const readStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return stored != null && isLanguage(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

type Props = {
  children: React.ReactNode
}

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)

  // Set during render so formatters already use the new locale for this render pass
  setLocale(getLanguageLocale(language))

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this session
    }
    setLanguageState(next)
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, params) => translate(language, key, params),
      translateMessage: (message) => translateMessage(language, message),
    }),
    [language, setLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
