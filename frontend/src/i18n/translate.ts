import type { Language } from '@/i18n/languages'
import { bg } from '@/i18n/translations/bg'
import type { Translations } from '@/i18n/translations/en'
import { en } from '@/i18n/translations/en'

const TRANSLATIONS: Record<Language, Translations> = { bg, en }

// 'auth.signIn' | 'dashboard.title' | ... — every valid dotted path into the dictionary
type DottedPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${DottedPaths<T[K]>}`
}[keyof T & string]

export type TranslationKey = DottedPaths<Translations>

export type TranslationParams = Record<string, string | number>

const lookup = (language: Language, key: string): string | undefined => {
  let node: unknown = TRANSLATIONS[language]
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : undefined
}

const interpolate = (text: string, params?: TranslationParams): string =>
  params == null
    ? text
    : text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))

export const translate = (language: Language, key: TranslationKey, params?: TranslationParams): string =>
  interpolate(lookup(language, key) ?? key, params)

// For strings that may or may not be a key, e.g. Zod messages; plain text is returned unchanged
export const translateMessage = (language: Language, message: string): string =>
  lookup(language, message) ?? message

// Lets Zod schemas reference a translation key with compile-time checking
export const i18nKey = (key: TranslationKey): string => key
