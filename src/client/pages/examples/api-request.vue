<template>
  <SectionWrapper container>
    <div :class='cls.content'>
      <div v-html='page?.content' />
    </div>
  </SectionWrapper>
</template>

<script setup lang="ts">
import { Page } from '~/models/page'
import { usePageStore } from '~/stores'

const pageStore = usePageStore()

const page = await pageStore.fetchPage({ slug: 'test-page', model: Page })

if (!page) { pageStore.setStatus(404) }

useHead({
  title: page?.title,
  meta: [{ name: 'description', content: page?.seo_description }]
})
</script>

<style lang="scss" module='cls'>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--hc-spacing-element-sm);
  font-size: var(--hc-font-heading-h6);
  line-height: var(--hc-line-height-relaxed)
}
</style>
