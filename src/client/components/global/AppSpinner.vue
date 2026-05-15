<template>
  <div :class='cls.wrapper'>
    <span
      v-for='i in 3'
      :key='i'
      :class='cls.dot'
    />
  </div>
</template>

<style module="cls" src="~/assets/styles/modules/app.spinner.module.scss"></style>
