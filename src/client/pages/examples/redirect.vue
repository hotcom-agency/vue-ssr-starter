<template>
  <SectionWrapper container>
    Page content
  </SectionWrapper>
</template>

<script setup lang="ts">
import { useContext } from '~/composables'

const context = useContext()

context.redirect({ location: '/', status: 401 })
</script>
