<template>
  <div :class='[cls.card, sizeClass]'>
    <div
      v-if='icon || !!$slots.icon'
      :class='cls.cardIcon'
    >
      <div :class='cls.cardIconSlot'>
        <template v-if='icon'>
          {{ icon }}
        </template>
        <template v-else>
          <slot name='icon' />
        </template>
      </div>
    </div>
    <div :class='cls.cardContent'>
      <div :class='cls.cardTitle'>
        {{ title }}
      </div>
      <div :class='cls.cardDescription'>
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  size?: 'DEFAULT' | 'MEDIUM' | 'SMALL'
  title: string
  description: string
  icon: string
}

const props = withDefaults(defineProps<IProps>(), { size: 'DEFAULT' })

const style = useCssModule('cls')

const sizeClass = computed(() => ({
  DEFAULT: undefined,
  MEDIUM: style.sectionOffsetSmall,
  SMALL: style.sectionOffsetNone
}[props.size]))
</script>

<style lang="scss" module="cls" src="~/assets/styles/modules/card.feature.module.scss"></style>
