<script setup>
  const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "webp",
  "svg",
  "ico",
];

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

  const isLoading = ref(true);

  const onLoad = () => {
    isLoading.value = false;
  };

  const onUnload = () => {
    isLoading.value = true
  }

  const closeModal = () => {

    isModalActive.value = false;
  }

  const navigatePrevious = () => {

    onUnload()
    modalIndex.value = (modalIndex.value - 1 < 0) ? modalGallery.value.length - 1 : modalIndex.value - 1; 
    modalImage.value = modalGallery.value[modalIndex.value];
  };

  const navigateNext = () => {

    onUnload()
    modalIndex.value = (modalIndex.value + 1 >  modalGallery.value.length - 1) ? 0:  modalIndex.value + 1;
    modalImage.value = modalGallery.value[modalIndex.value];
  };
</script>

<template>
  <div>
    <OModal v-model:active="isModalActive" :onCancel="closeModal" :canCancel="['escape', 'x']">
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
      <figure 
        v-if="imageExtensions.includes(modalImage.split('.')[1])"
        class="image ltr-corner-rounded"
      >
        <img
          @load="onLoad" 
          :src="'/' + modalImage" 
          :class="($device.isMobile) ? 'ltr-fit-mobile' : 'ltr-fit-tablet'" 
        />
        <OIcon
          v-if="isLoading"
          pack="mdi"
          icon="loading"
          size="large"
          spin
          class="is-overlay is-fixed-center"
        />
      </figure>
      <div v-else>
        <video
          @canplay="onLoad"
          :controls="!isLoading"
          autoplay
          muted
          playsInline
          :class="($device.isMobile) ? 'ltr-fit-mobile' : 'ltr-fit-tablet'"
        >
          <source
            :src="'/' + modalImage"
          />
        </video>
        <OIcon
          pack="mdi"
          icon="loading"
          size="large"
          spin
          class="is-overlay is-fixed-center"
        />
        </div>
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

<style scoped>
.is-fixed-center {
  min-height: 48px;
  min-width: 48px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-top: -24px;
  margin-left: -24px;
}
</style>

<style>
.mdi-close {
  color: white;
}
.is-fixed-center {
  .mdi-loading {
    color: white;
  }
}
</style>

