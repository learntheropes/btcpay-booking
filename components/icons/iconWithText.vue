<script setup>
const {
  icon,
  iconVariant,
  iconSide,
  iconSize,
  text,
  textVariant,
  textClass,
  textTo,
  textTarget
} = defineProps({
  icon: {
    type: String,
    required: true
  },
  iconVariant: {
    type: String,
    default: 'success'
  },
  iconSide: {
    type: String,
    default: 'left'
  },
  iconSize: {
    type: String,
    default: '24'
  },
  text: {
    type: String,
    default: null
  },
  textVariant: {
    type: String,
    default: 'success'
  },
  textClass: {
    type: String,
    default: ''
  },
  textTo: {
    type: String,
    default: null
  },
  textTarget: {
    type: String,
    default: null
  }
})

// Not working in production on DigitalOcean
// const iconPx = `${iconSize}px`

const textFullClass= `column is-narrow ${textClass} has-text-${textVariant}`

</script>

<template>
  <div v-if="textTo" class="columns is-mobile is-gapless">
    <div v-if="iconSide === 'left'" class="column is-narrow">
      <NuxtIcon :class="'ltr-icon-with-text has-text-'+iconVariant" :name="icon" />
    </div>
    <NuxtLink v-if="text" :target="textTarget" :to="textTo" :class="textFullClass">{{ text }}</NuxtLink>
    <div v-if="iconSide === 'right'" class="column is-narrow">
      <NuxtIcon :class="'ltr-icon-with-text has-text-'+iconVariant" :name="icon" />
    </div>
  </div>
  <div v-else class="columns is-mobile is-gapless">
    <div v-if="iconSide === 'left'" class="column is-narrow">
      <NuxtIcon :class="'ltr-icon-with-text has-text-'+iconVariant" :name="icon" />
    </div>
    <div v-if="text" :class="textFullClass">{{ text }}</div>
    <div v-if="iconSide === 'right'" class="column is-narrow">
      <NuxtIcon :class="'ltr-icon-with-text has-text-'+iconVariant" :name="icon" />
    </div>
  </div>
</template>

<style>
/* https://nuxt.com/modules/icons#i-dont-like-the-basic-styles-that-are-assigned-to-the-icons */
/* https://stackoverflow.com/a/69078238/11258206 */
.ltr-icon-with-text svg {
  /* Not working in production on DigitalOcean
  width: v-bind('iconPx');
  height: v-bind('iconPx'); */
  margin-left: 5px;
  margin-right: 5px;
}
.columns.is-mobile.is-gapless:not(:last-child) {
  margin-bottom: 0px;
}
</style>
