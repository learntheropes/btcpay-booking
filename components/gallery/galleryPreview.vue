<script setup>
const {
  gallery
} = defineProps({
  gallery: {
    type: Array,
    default: []
  }
})

const { $event } = useNuxtApp()

const openModal = (gallery, index) => {
  $event('openModal', { gallery, index })
}
</script>

<template>
<div>
  <div class="columns is-centered is-mobile is-multiline is-hidden-tablet">
    <div
      v-if="gallery.length"
      v-for="image, index in gallery"
      :key="image"
      class="column is-narrow"
      @click.native="openModal(gallery, index)"
    >
      <figure
        class="image is-128x128 ltr-corner-rounded"
      >
        <NuxtImg
          preset="preview"
          :src="'/'+image"
          :alt="image"
          height="128"
          width="128"
        />
      </figure>  
    </div>
  </div>
  <div class="columns is-multiline is-hidden-mobile">
    <div
      v-if="gallery.length"
      v-for="image, index in gallery"
      :key="image"
      class="column is-narrow"
      @click.native="openModal(gallery, index)"
    >
      <figure
        class="image is-128x128 ltr-corner-rounded"
      >
        <NuxtImg
          preset="preview"
          :src="'/'+image"
          :alt="image"
        />
      </figure>  
    </div>
  </div>
</div>
</template>
