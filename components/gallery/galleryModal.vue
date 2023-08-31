<script setup>
  import { ref } from 'vue';

  const isModalActive = ref(false);
  const modalGallery = ref([]);
  const modalIndex = ref(0);
  const modalImage = ref(null);
  const { $listen } = useNuxtApp();

  $listen('openModal', ({ gallery, index }) => {

    isModalActive.value = true;
    modalGallery.value = gallery;
    modalIndex.value = index;
    modalImage.value = gallery[index];
  });

  const navigatePrevious = () => {

    modalIndex.value = (modalIndex.value - 1 < 0) ? modalGallery.value.length - 1 : modalIndex.value - 1; 
    modalImage.value = modalGallery.value[modalIndex.value];
  };

  const navigateNext = () => {

    modalIndex.value = (modalIndex.value + 1 >  modalGallery.value.length - 1) ? 0:  modalIndex.value + 1;
    modalImage.value = modalGallery.value[modalIndex.value];
  };
</script>

<template>
  <div>
    <OModal v-model:active="isModalActive">
      <div class="ltr-is-center-left is-hidden-mobile">
        <OIcon
          icon="chevron-left"
          size="large"
          variant="info"
          @click.native="navigatePrevious"
        />
      </div>
      <div class="ltr-is-bottom-left is-hidden-tablet">
        <OIcon
          icon="chevron-left"
          size="large"
          variant="info"
          @click.native="navigatePrevious"
        />
      </div>
      <figure class="image ltr-corner-rounded">
        <NuxtImg preset="modal" :src="modalImage" class="ltr-fit" />
      </figure>
      <div class="ltr-is-center-right is-hidden-mobile">
        <OIcon
          icon="chevron-right" 
          size="large" 
          variant="info" 
          @click.native="navigateNext"
        />
      </div>
      <div class="ltr-is-bottom-right is-hidden-tablet">
        <OIcon
          icon="chevron-right" 
          size="large" 
          variant="info" 
          @click.native="navigateNext"
        />
      </div>
    </OModal>
  </div>
</template>

<style>
.ltr-is-48by48-white svg {
  color: white;
  min-width: 32px;
  min-height: 32px;
}
</style>
