<template>
  <SectionWrapper>
    <div :class='cls.sectionHeader'>
      <div :class='cls.sectionHeaderContent'>
        <div :class='cls.sectionHeaderTitle'>
          <h1
            data-title-primary
          >
            {{ $t('project.name') }}
          </h1>
          <p data-heading-1>
            {{ t('page_home.title') }}
          </p>
        </div>
        <div :class='cls.sectionHeaderLinks'>
          <AppButton
            type='PRIMARY'
            href='https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fstarter.hotcom.agency'
            target='_blank'
          >
            PageSpeed Insights
          </AppButton>
          <AppButton
            type='CLEAN'
            href='https://github.com/hotcom-agency/vue-ssr-starter'
            target='_blank'
          >
            {{ t('page_home.view_code') }}
            <template #icon>
              <IconUiGithubFilled />
            </template>
          </AppButton>
        </div>
      </div>
      <div :class='cls.sectionHeaderLogo'>
        <IconCustomLogo />
      </div>
    </div>
  </SectionWrapper>
  <SectionWrapper>
    <div :class='cls.sectionFeatures'>
      <div
        v-for='(item, i) in features'
        :key='i'
        :class='cls.sectionFeaturesItem'
      >
        <CardFeature
          :title='item.title'
          :description='item.description'
          :icon='item.icon'
        />
      </div>
    </div>
  </SectionWrapper>
  <SectionWrapper>
    <div :class='cls.sectionFigma'>
      <a
        :class='cls.sectionFigmaWrapper'
        href='https://www.figma.com/site/5j5d1aYilIj5JiScTSxoYV/Starter'
        target='_blank'
      >
        <div :class='cls.sectionFigmaGrid' />
        <div :class='cls.sectionFigmaHeader'>
          <div :class='cls.sectionFigmaIcon'>
            <IconUiFigmaColored />
          </div>
          <div
            data-heading-6
            :class='cls.sectionFigmaTitle'
          >
            {{ t('page_home.figma_title') }}
          </div>
        </div>
        <AppButton
          type='CONTRAST'
        >
          Figma Sites
          <template #icon>
            <IconUiFigmaFilled />
          </template>
        </AppButton>
      </a>
    </div>
  </SectionWrapper>
</template>

<script setup lang="ts">
import LocaleEn from '~/locales/pages/home/en.json'
import LocaleRu from '~/locales/pages/home/ru.json'

type TFeature = {
  title: string
  description: string
  icon: string
}

const { t } = useI18n({ messages: { en: LocaleEn, ru: LocaleRu } })

const features: TFeature[] = [
  { icon: '🎯', title: t('page_home.feature.seo.title'), description: t('page_home.feature.seo.description') },
  { icon: '🌍', title: t('page_home.feature.i18n.title'), description: t('page_home.feature.i18n.description') },
  { icon: '📦', title: t('page_home.feature.store.title'), description: t('page_home.feature.store.description') },
  { icon: '🗂', title: t('page_home.feature.router.title'), description: t('page_home.feature.router.description') },
  { icon: '📥', title: t('page_home.feature.import.title'), description: t('page_home.feature.import.description') },
  { icon: '📲', title: t('page_home.feature.pwa.title'), description: t('page_home.feature.pwa.description') },
  { icon: '📑', title: t('page_home.feature.class.title'), description: t('page_home.feature.class.description') },
  { icon: '🦾', title: t('page_home.feature.ts.title'), description: t('page_home.feature.ts.description') },
  { icon: '🚀', title: t('page_home.feature.vite.title'), description: t('page_home.feature.vite.description') }
]
</script>

<style lang="scss" module="cls"  src="~/assets/styles/modules/page.home.module.scss"></style>
