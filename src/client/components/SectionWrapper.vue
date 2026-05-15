<template>
  <section :class='[cls.section, container && cls.sectionContainer, offsetClass]'>
    <slot />
  </section>
</template>

<script lang="ts" setup>
interface IProps {
  offset?: 'DEFAULT' | 'SMALL' | 'NONE'
  container?: boolean
}

const props = withDefaults(defineProps<IProps>(), { offset: 'DEFAULT' })

const style = useCssModule('cls')

const offsetClass = computed(() => ({
  DEFAULT: undefined,
  SMALL: style.sectionOffsetSmall,
  NONE: style.sectionOffsetNone
}[props.offset]))
</script>

<style lang="scss" module="cls" src="~/assets/styles/modules/section.module.scss"></style>
