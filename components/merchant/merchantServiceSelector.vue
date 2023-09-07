<script setup>
// Get the buyer leanguage
const { locale } = useI18n();

const services = await queryContent('/services')
  .locale(locale.value)
  .only([ '_path', 'title', 'disabled' ])
  .find();

services.forEach(service => service.slug = `/${service._path.split('/')[2]}`)
</script>

<template>
  <OField
    name="offers"
    :label="$t('offers')"
  >
    <div class="content">
      <OButton
        v-for="{ slug, title, disabled } in services"
        :key="slug"
        tag="router-link"
        :to="localePath(slug)"
        variant="primary"
        class="block"
        expanded
        :disabled="disabled"
      >{{ title }}</OButton>
    </div>
  </OField>
</template>

