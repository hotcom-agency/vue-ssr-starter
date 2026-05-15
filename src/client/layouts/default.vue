<template>
  <div :class='cls.wrapper'>
    <LayoutHeader />
    <Suspense>
      <RouterView
        v-slot='{ Component }'
        :key='`layout-default-${$route.fullPath}`'
      >
        <main :class='cls.main'>
          <PageWrapper>
            <component :is='Component' />
          </PageWrapper>
        </main>
      </RouterView>
      <template #fallback>
        <AppSpinner />
      </template>
    </Suspense>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const PageWrapper = defineAsyncComponent(() => import('~/pages/[...state].vue'))
</script>

<style lang="scss" module="cls" src="~/assets/styles/modules/layout.default.module.scss"></style>
