<template>
  <slot v-if='serverRendered || mounted' />
</template>

<script lang="ts" setup>
interface IProps { serverRendered?: boolean }

const props = defineProps<IProps>()

const mounted = ref(props.serverRendered)

if (!props.serverRendered) {
  onMounted(() => (mounted.value = true))
}
</script>
