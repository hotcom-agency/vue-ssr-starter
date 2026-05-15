<template>
  <Suspense>
    <ExampleLayout v-if='route.meta.layout === "example"' />
    <DefaultLayout v-else />
  </Suspense>
</template>

<script setup lang="ts">
import { useContext, useLocale } from '~/composables'
import DefaultLayout from '~/layouts/default.vue'
import ExampleLayout from '~/layouts/example.vue'
import { useAppStore } from '~/stores'

const route = useRoute()

const appStore = useAppStore()
const context = useContext()
const { currentLocale } = useLocale()
const { t } = useI18n()
const canonicalLink = computed(() => `${context.url.protocol}//${context.url.hostname}${context.url.port ? ':' + context.url.port : ''}${route.path}`)

useHead({
  htmlAttrs: {
    'lang': currentLocale.value.locale,
    'data-color-scheme': computed(() => appStore.theme ?? 'auto')
  },
  title: t('project.name'),
  meta: [{ name: 'description', content: t('project.description') }],
  link: [{ href: canonicalLink.value, rel: 'canonical' }]
})
</script>
