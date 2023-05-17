<script setup>
const {
  locale
} = defineProps({
  locale: {
    type: String,
    required: true
  }
})

const services = await queryContent('/services').locale(locale).only([ '_path', 'title' ]).find(); // 
services.forEach(service => service.slug = `/${service._path.split('/')[2]}`)
</script>

<template>
  <OField
    name="offers"
    :label="$t('offers')"
  >
    <div class="content">
      <OButton
        v-for="{ slug, title } in services"
        :key="slug"
        tag="router-link"
        :to="localePath(slug)"
        variant="primary"
        class="block"
        expanded
      >{{ title }}</OButton>
    </div>
  </OField>
</template>

