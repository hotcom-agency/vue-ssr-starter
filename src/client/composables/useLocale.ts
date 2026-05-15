import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { defaultLocale, supportedLanguages } from '~/utils/locale'

export const useLocale = () => {
  const i18n = useI18n()

  const currentLocale = computed(() => supportedLanguages.find((el) => el.locale === i18n.locale.value)
    ?? supportedLanguages[0])

  return {
    currentLocale,
    defaultLocale,
    supportedLanguages
  }
}
