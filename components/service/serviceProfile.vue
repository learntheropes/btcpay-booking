<script setup>
  // Get props from [service].vue page
  const {
    title,
    description,
    image,
    extras,
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
    extras: {
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
          <div v-if="extras" class="columns is-multiline">
            <div v-for="{ title } in extras" :key="title" class="column is-narrow" >
              <IconWithText
                icon="plus"
                iconSide="left"
                :text="title"
                :textTo="'#'+title.replaceAll(' ', '-').toLowerCase()"
                textVariant="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="(body && Object.keys(body)) || (extras && extras.length)" class="section content">
      <ContentRendererMarkdown
        v-if="body && Object.keys(body)"
        :value="{ body }"
        class="block"
      />
      <div
        v-if="extras && extras.length"
        v-for="{ title, description } in extras"
        :key="title"
        class="block"
      >
        <div
          :id="title.replaceAll(' ', '-').toLowerCase()"
          v-if="description"
          class="block"
        >
          <span class="has-text-weight-bold">{{ title }}</span>
          <span class="is-italic">&nbsp;[Extra]</span>
        </div>
        <span>{{ description }}</span>
      </div>
    </section>
    <Gallery
      :gallery="gallery"
    />
  </div>
</template>
