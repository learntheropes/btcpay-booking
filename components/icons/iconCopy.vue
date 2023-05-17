<script setup>
const {
  iconVariant,
  text
} = defineProps({
  iconVariant: {
    type: String,
    default: 'success'
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
<p class="columns is-mobile is-gapless">
  <p class="has-text-weight-semibold column is-narrow has-text-success">{{ text }}</p>
  <p class="column is-narrow">
    <NuxtIcon :class="'ltr-icon-copy has-text-'+iconVariant" name="content-copy" />
  </p>
</p>
</template>

<style>
.ltr-icon-copy svg {
  width: 16px;
  height: 16px;
  margin-left: 5px;
}
.columns.is-mobile.is-gapless:not(:last-child) {
  margin-bottom: 0px;
}
</style>
