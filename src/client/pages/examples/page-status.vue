<template>
  <SectionWrapper container>
    Page content
  </SectionWrapper>
</template>

<script setup lang="ts">
import { usePageStore } from '~/stores'

const pageStore = usePageStore()

pageStore.setStatus(403)
</script>
