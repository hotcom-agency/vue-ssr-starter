<template>
  <header :class='cls.header'>
    <div :class='cls.headerContainer'>
      <div :class='cls.headerLogo'>
        <RouterLink
          :to='{"name": "/"}'
          :class='cls.headerLogoWrapper'
          aria-label='Homepage'
        >
          <span :class='cls.headerLogoIcon'>
            <IconCustomLogo />
          </span>
          <span :class='cls.headerLogoText'>
            <IconCustomLogoText />
          </span>
        </RouterLink>
      </div>
      <div :class='cls.headerMeta'>
        <!-- Scheme color toggler -->
        <div :class='cls.headerMetaGroup'>
          <div :class='[cls.headerMetaItem, cls.headerMetaItemToggler]'>
            <ClientOnly :server-rendered='appStore.theme !== undefined'>
              <AppToggler
                :left-side='!appStore.themeIsDark'
                @on-changed='appStore.themeToggle()'
              >
                <template #icon-left>
                  <IconCarbonSun />
                </template>
                <template #icon-right>
                  <IconCarbonMoon />
                </template>
              </AppToggler>
            </ClientOnly>
          </div>
        </div>
        <!-- Links -->
        <div :class='[cls.headerMetaGroup, cls.headerMetaGroupHideMobile]'>
          <div :class='cls.headerMetaItem'>
            <AppButton
              size='SMALL'
              icon-size='LARGE'
              type='CLEAN'
              href='https://www.figma.com/site/5j5d1aYilIj5JiScTSxoYV/Starter'
              target='_blank'
              aria-label='Figma'
            >
              <template #icon>
                <IconUiFigmaFilled />
              </template>
            </AppButton>
          </div>
          <div :class='cls.headerMetaItem'>
            <AppButton
              size='SMALL'
              icon-size='LARGE'
              type='CLEAN'
              href='https://github.com/hotcom-agency/vue-ssr-starter'
              target='_blank'
              aria-label='Github'
            >
              <template #icon>
                <IconUiGithubFilled />
              </template>
            </AppButton>
          </div>
        </div>
        <!-- Localization -->
        <div :class='cls.headerMetaGroup'>
          <div
            :class='cls.headerMetaItem'
            translate='no'
          >
            <AppDropdown>
              <template #toggler>
                <AppButton
                  size='SMALL'
                  icon-size='LARGE'
                  type='CLEAN'
                >
                  &nbsp;{{ localeCurrent?.locale.toUpperCase() }}
                  <template #icon>
                    <IconUiPlanetInline />
                  </template>
                </AppButton>
              </template>
              <ul :class='cls.headerMetaDropdown'>
                <li
                  v-for='(el, i) in locale.supportedLanguages'
                  :key='i'
                >
                  <a
                    :href='getLocaleHref(el.locale)'
                    :class='[cls.headerMetaDropdownLink, el.locale === localeCurrent?.locale && cls.isActive]'
                  >
                    {{ el.name }}
                  </a>
                </li>
              </ul>
            </AppDropdown>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLocale } from '~/composables'
import { useAppStore } from '~/stores'
import { type TLocale } from '~/utils/locale'

interface IProps { title?: string | number }

defineProps<IProps>()

const appStore = useAppStore()
const route = useRoute()
const locale = useLocale()
const localeCurrent = locale.currentLocale.value
const getLocaleHref = (lang: TLocale['locale']) => {
  const base = lang === locale.defaultLocale ? '' : `/${lang}`
  const cleanPath = route.fullPath.replace(new RegExp(`^/${localeCurrent.locale}`), '') || '/'

  return `${base}${cleanPath}`.replaceAll(/\/+/g, '/')
}
</script>

<style lang="scss" module="cls" src="~/assets/styles/modules/header.module.scss"></style>
