<template>
  <div
    ref='dropdownRef'
    :class='[cls.dropdown, dropdownClasses]'
  >
    <div
      :class='cls.dropdownToggler'
      @click='toggle'
    >
      <slot
        v-if='$slots.toggler'
        name='toggler'
        :state='{ isActive }'
      />
      <span v-else>Toggler</span>
    </div>

    <ClientOnly>
      <div
        v-if='isActive'
        ref='contentRef'
        :class='[cls.dropdownContent, contentSizeClasses]'
      >
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  positionY?: 'TOP' | 'BOTTOM' | 'CENTER'
  positionX?: 'LEFT' | 'RIGHT' | 'CENTER'
  size?: 'DEFAULT' | 'LARGE' | 'WIDE'
  closeOnClickOutside?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  positionY: 'TOP',
  positionX: 'LEFT',
  size: 'DEFAULT',
  closeOnClickOutside: true
})

const emit = defineEmits<{
  'on-show': [v: boolean]
  'on-hide': [v: boolean]
}>()

const style = useCssModule('cls')
const dropdownRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const isActive = ref(false)
const isShown = ref(false)
const positionClasses = ref<string[]>([])
const updatePosition = () => {
  const parent = dropdownRef.value
  const content = contentRef.value

  if (!parent || !content) { return }

  const classes: string[] = []
  const parentRect = parent.getBoundingClientRect()
  const { clientWidth: contentW, clientHeight: contentH } = content
  const { innerWidth: windowW, innerHeight: windowH } = window

  const hasSpace = {
    top: parentRect.top > contentH,
    bottom: windowH - parentRect.bottom > contentH,
    left: parentRect.right > contentW,
    right: windowW - parentRect.left > contentW,
    center: (windowW - (parentRect.left + parentRect.width / 2)) > contentW / 2
      && (parentRect.left + parentRect.width / 2) > contentW / 2
  }

  if (props.positionY !== 'BOTTOM' && !hasSpace.bottom && hasSpace.top) {
    classes.push(style.dropdownYReverse)
  }
  if (props.positionX === 'LEFT') {
    if (hasSpace.right) { classes.push(style.dropdownXLeft) }
    else if (hasSpace.left) { classes.push(style.dropdownXRight) }
    else { classes.push(style.dropdownXCenter) }
  }
  else if (props.positionX === 'RIGHT') {
    if (hasSpace.left) { classes.push(style.dropdownXRight) }
    else if (hasSpace.right) { classes.push(style.dropdownXLeft) }
    else { classes.push(style.dropdownXCenter) }
  }
  else {
    if (hasSpace.center) { classes.push(style.dropdownXCenter) }
    else if (hasSpace.right) { classes.push(style.dropdownXLeft) }
    else { classes.push(style.dropdownXRight) }
  }

  positionClasses.value = classes
}
const handleOutsideClick = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close()
  }
}

let controller: AbortController | null = null

const toggleEvents = (show: boolean) => {
  if (!props.closeOnClickOutside || typeof window === 'undefined') { return }

  controller?.abort()

  if (!show) { return }

  controller = new AbortController()
  window.addEventListener('click', handleOutsideClick, { signal: controller.signal })
  window.addEventListener('touchstart', handleOutsideClick, { signal: controller.signal })
  window.addEventListener('resize', updatePosition, { signal: controller.signal, passive: true })
}

const open = () => {
  isActive.value = true
  emit('on-show', true)
}

const close = () => {
  isActive.value = false
  isShown.value = false
  toggleEvents(false)
  emit('on-hide', true)
}

const toggle = () => {
  if (isActive.value) { close() }
  else { open() }
}

const dropdownClasses = computed(() => [
  isShown.value && style.isShown,
  isActive.value && [style.isActive, ...positionClasses.value]
])

const contentSizeClasses = computed(() => {
  const map = {
    LARGE: style.sizeLarge,
    WIDE: style.sizeWide
  }

  return props.size === 'DEFAULT' ? '' : map[props.size]
})

watch(isActive, async (val) => {
  if (val) {
    await nextTick()
    requestAnimationFrame(() => {
      updatePosition()
      toggleEvents(true)
      isShown.value = true
    })
  }
})

onBeforeUnmount(() => controller?.abort())

defineExpose({ open, close, toggle })
</script>

<style module="cls" src="~/assets/styles/modules/app.dropdown.module.scss"></style>
