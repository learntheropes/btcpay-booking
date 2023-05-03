<script setup>
const {
  gallery
} = defineProps({
  gallery: {
      type: Array,
      default: []
    }
})
</script>

<template>
    <section v-if="gallery && gallery.length" class="section">
      <galleryPreview :gallery="gallery" />
      <galleryModal />
    </section>
</template>