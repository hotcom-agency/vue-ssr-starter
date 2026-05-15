<template>
  <Suspense :key='`state-${$route.fullPath}`'>
    <template v-if='pageStatus === 200 && !isStateSlot'>
      <slot name='default' />
    </template>
    <template v-else>
      <SectionWrapper :class='cls.wrapper'>
        <div :class='cls.wrapperСontent'>
          <h1 :class='cls.wrapperTitle'>
            {{ pageStatus }}
          </h1>
          <p :class='cls.message' />
          <AppButton
            :to='{ name: "/" }'
            type='DEFAULT'
          >
            {{ $t("misc.homepage") }}
          </AppButton>
        </div>
      </SectionWrapper>
    </template>
    <template #fallback>
      <AppSpinner />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { useContext } from '~/composables'
import AppButton from '~/components/global/AppButton.vue'
import { usePageStore } from '../stores'

const slots = useSlots()
const instance = getCurrentInstance()
const appStore = usePageStore()
const router = useRouter()
const context = useContext()

const pageStatus = computed(() => appStore.status)

const isStateSlot = computed(() => {
  const nodes = slots.default?.()

  if (!nodes || !instance) { return false }
  const lastNode = nodes.at(-1)

  return (lastNode?.type as any)?.__name === instance.type.__name
})

onServerPrefetch(() => {
  appStore.setStatus(isStateSlot.value ? 404 : 200)

  if (context.response?.statusCode && context.response.statusCode > 300) {
    appStore.setStatus(context.response.statusCode)
  }
})

onMounted(() => {
  appStore.setStatus(isStateSlot.value ? 404 : 200)
})

if (typeof window !== 'undefined') {
  const unhook = router.afterEach((to, from) => {
    if (to.path !== from.path) { appStore.setStatus(200) }
  })

  onBeforeUnmount(unhook)
}
</script>

<style lang="scss" module="cls" src="~/assets/styles/modules/error.section.module.scss"></style>
