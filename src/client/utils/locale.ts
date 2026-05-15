import messages from '@intlify/unplugin-vue-i18n/messages'
import { createI18n } from 'vue-i18n'

export interface TLocale {
  locale: 'ru' | 'en'
  id: string
  icu: string
  name: string
  shortName: string
  default: boolean
  host?: string
}

export type TLocales = TLocale[]

export const supportedLanguages: TLocales = [
  {
    locale: 'en',
    id: 'en',
    icu: 'en_GB',
    name: 'English',
    shortName: 'Eng',
    default: true,
    host: undefined // host.local
  },
  {
    locale: 'ru',
    id: 'ru',
    icu: 'ru_RU',
    name: 'Русский',
    shortName: 'Рус',
    default: false,
    host: undefined // ru.host.local
  }
]

export const supportedLocales = supportedLanguages.map((l) => l.locale)

export const defaultLanguage = supportedLanguages.find((l) => l.default)

export const defaultLocale = defaultLanguage?.locale ?? supportedLanguages[0].locale

export const extractLocaleFromPath = (path = ''): TLocale['locale'] => {
  const [_, maybeLocale] = path.split('/')

  return supportedLocales.includes(maybeLocale as TLocale['locale'])
    ? (maybeLocale as TLocale['locale'])
    : defaultLocale
}

export const extractLocaleFromHost = (hostname: string): TLocale['locale'] => (
  supportedLanguages.find((el) => el.host && new URL(el.host).hostname === hostname)?.locale
  ?? defaultLocale
)

export const getLocalePath = (url: string) => {
  const locale = extractLocaleFromPath(url)

  return locale === defaultLocale ? '/' : `/${locale}`
}

const pluralizationRussianRule = (choice: number, length: number) => {
  if (choice === 0) { return 0 }
  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1

  if (!teen && endsWithOne) { return 1 }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) { return 2 }

  return length < 4 ? 2 : 3
}

export const createI18nInstance = (locale: TLocale['locale']) =>
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: defaultLocale,
    pluralRules: { ru: pluralizationRussianRule },
    messages
  })
