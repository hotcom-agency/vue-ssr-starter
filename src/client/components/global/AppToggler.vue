<template>
  <div
    :class='[cls.toggler, disabled && cls.isDisabler]'
    @click='leftSide = !leftSide'
  >
    <span
      :class='[
        cls.togglerIcon,
        leftSide ? cls.isLeftSide : cls.isRightSide
      ]'
    >
      <template v-if='leftSide'>
        <slot
          v-if='!!$slots["icon-left"]'
          name='icon-left'
        />
        <IconCarbonRadioButton v-else />
      </template>

      <template v-else>
        <slot
          v-if='!!$slots["icon-right"]'
          name='icon-right'
        />
        <IconCarbonRadioButtonChecked v-else />
      </template>
    </span>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  leftSide?: boolean
  disabled?: boolean
}

const props = withDefaults(
  defineProps<IProps>(),
  { leftSide: true }
)

const leftSide = ref(props.leftSide)

const emit = defineEmits(['on-changed'])

watch(computed(() => leftSide.value), (value) => {
  emit('on-changed', value)
})
</script>

<style module="cls" src="~/assets/styles/modules/app.toggler.module.scss"></style>
