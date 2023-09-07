<script setup>
  // Get props from index.vue page
  const {
    title,
    description,
    image,
    twitter,
    nostr,
    instagram,
    websites,
    body,
    gallery
  } = defineProps({
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    twitter: {
      type: String,
    },
    nostr: {
      type: String,
    },
    instagram: {
      type: String,
    },
    websites: {
      type: Array,
    },
    body: {
      type: Object,
      default: {}
    },
    gallery: {
      type: Array,
      default: []
    }
  })
</script>

<template>
  <div>
    <section class="section">
      <div class="columns">
        <div v-if="image" class="column is-narrow">
          <div class="level-item is-justify-content-center">
            <figure class="image is-128x128">
              <NuxtImg
                class="is-rounded"
                preset="avatar"
                :src="'/'+image"
                :alt="title"
                height="192"
                width="192"
              />
            </figure>
          </div>
        </div>
        <div class="column">
          <h1 v-if="title" class="title is-4 has-text-primary">{{ title }}</h1>
          <div v-if="description" class="subtitle is-6">{{ description }}</div>
          <div>
            <div class="columns is-multiline">
              <div v-if="twitter" class="column is-narrow">
                <IconWithText
                  icon="twitter"
                  :text="twitter"
                  textVariant="primary"
                  :textTo="'https://twitter.com/'+twitter"
                  textTarget="_blank"
                />
              </div>
              <div v-if="nostr" class="column is-narrow">
                <IconWithText
                  icon="nostr"
                  :text="nostr"
                  textVariant="primary"
                  :textTo="'https://iris.to/'+nostr"
                  textTarget="_blank"
                />
              </div>
              <div v-if="instagram" class="column is-narrow">
                <IconWithText
                  icon="instagram"
                  :text="instagram"
                  textVariant="primary"
                  :textTo="'https://www.instagram.com/'+instagram"
                  textTarget="_blank"
                />
              </div>
              <div v-if="facebook" class="column is-narrow">
                <IconWithText
                  icon="facebook"
                  :text="facebook"
                  textVariant="primary"
                  :textTo="'https://www.facebook.com/'+facebook"
                  textTarget="_blank"
                />
              </div>
              <div v-if="tiktok" class="column is-narrow">
                <IconWithText
                  icon="tiktok"
                  :text="tiktok"
                  textVariant="primary"
                  :textTo="'https://www.tiktok.com/@'+facebook"
                  textTarget="_blank"
                />
              </div>
              <div
                v-if="websites && websites.length"
                v-for="{ title, url }, index in websites" 
                :key="index"
                class="column is-narrow"
              >
                <IconWithText
                  icon="web"
                  :text="title"
                  textVariant="primary"
                  :textTo="url"
                  textTarget="_blank"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section content">
      <ContentRendererMarkdown
        v-if="body"
        :value="{ body }"
      />
    </section>
    <Gallery
      :gallery="gallery"
    />
  </div>
</template>

<style scoped>
.ltr-is-black {
  color: black;
}
</style>
