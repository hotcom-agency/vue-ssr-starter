<template>
  <component
    :is='actualComponent'
    v-bind='dynamicAttributes'
    :class='wrapperClasses'
  >
    <AppSpinner
      v-if='inProcess'
      :class='style.buttonSpinner'
    />
    <span :class='style.buttonContent'>
      <span
        v-if='$slots.icon'
        :class='style.buttonIcon'
        data-icon
      >
        <span :class='style.buttonIconWrapper'>
          <slot name='icon' />
        </span>
      </span>

      <span
        v-if='$slots.default'
        :class='style.buttonText'
        data-value
      >
        <span :class='style.buttonTextWrapper'>
          <slot />
        </span>
      </span>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { type RouteLocationNormalized } from 'vue-router'
import { isExternalLink } from '~/utils/helpers'
import AppSpinner from '~/components/global/AppSpinner.vue'

interface IProps {
  to?: RouteLocationNormalized | object | string
  href?: string
  target?: '_blank'
  type?: 'DEFAULT' | 'PRIMARY' | 'CONTRAST' | 'CLEAN'
  size?: 'DEFAULT' | 'SMALL'
  iconSize?: 'DEFAULT' | 'LARGE'
  disabled?: boolean
  inProcess?: boolean | Promise<any>
  title?: string
  ariaLabel?: string
  notExternal?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'DEFAULT',
  size: 'DEFAULT',
  iconSize: 'DEFAULT'
})

const style = useCssModule('cls')

const isExternal = computed(() => {
  if (props.notExternal) { return false }
  const link = props.href ?? (typeof props.to === 'string' ? props.to : '')

  return link ? isExternalLink(link) : false
})

const actualComponent = computed(() => {
  if (props.to && !isExternal.value) {
    return resolveComponent('RouterLink')
  }

  return (props.href || (props.to && isExternal.value)) ? 'a' : 'button'
})

const dynamicAttributes = computed(() => {
  const isDisabled = !!(props.disabled || props.inProcess)
  const isLink = props.to ?? props.href
  const href = props.href ?? props.to

  return {
    ...(props.to && !isExternal.value ? { to: props.to } : {}),
    ...(isLink ? {} : { type: 'button' }),
    ...(isLink && (isExternal.value || props.href)
      ? {
        href: href,
        target: isExternal.value ? '_blank' : props.target,
        rel: isExternal.value ? 'noopener nofollow' : undefined
      }
      : {}),
    'disabled': isDisabled ? true : undefined,
    'aria-disabled': isDisabled,
    'aria-label': props.ariaLabel,
    'title': props.title ?? props.ariaLabel
  }
})

const wrapperClasses = computed(() => [
  style.button,
  props.inProcess && style.inProcess,
  style[`buttonType${props.type.charAt(0) + props.type.slice(1).toLowerCase()}`],
  props.size === 'SMALL' && style.buttonSizeSmall,
  props.iconSize === 'LARGE' && style.buttonIconSizeLarge
])
</script>

<style module="cls" src="~/assets/styles/modules/app.button.module.scss"></style>
