<template>
  <div :class='cls.wrapper'>
    <LayoutHeader />
    <RouterView
      v-slot='{ Component }'
      :key='`layout-example-${$route.fullPath}`'
    >
      <Suspense>
        <main :class='cls.main'>
          <PageWrapper>
            <component :is='Component' />
          </PageWrapper>
          <SectionWrapper container>
            <span>layout: example</span>
          </SectionWrapper>
        </main>
        <template #fallback>
          <AppSpinner />
        </template>
      </Suspense>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
const PageWrapper = defineAsyncComponent(() => import('~/pages/[...state].vue'))
</script>

<style lang="scss" module="cls" src="~/assets/styles/modules/layout.example.module.scss"></style>
