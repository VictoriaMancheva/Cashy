export const LANGUAGES = [
  { code: 'bg', label: 'Български', locale: 'bg-BG' },
  { code: 'en', label: 'English', locale: 'en-US' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LANGUAGE: Language = 'bg'

export const LANGUAGE_STORAGE_KEY = 'language'

export const isLanguage = (value: string): value is Language =>
  LANGUAGES.some((language) => language.code === value)

export const getLanguageLocale = (language: Language): string =>
  LANGUAGES.find((l) => l.code === language)?.locale ?? LANGUAGES[0].locale
