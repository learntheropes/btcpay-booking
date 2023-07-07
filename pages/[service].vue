<script setup>
  // Get the service parameter
  const { params: { service }} = useRoute();

  // Get the buyer leanguage
  const { locale: { value: locale }} = useI18n();

  // Get the profile name for the breadcrumb
  const {
    title: profile,
  } = await queryContent(`/profile`).locale(locale).findOne();

  // Get the service specific settings from md file
  const  {
    title,
    description,
    image,
    extras,
    body,
    gallery
  } = await queryContent(`/services/${service}`).locale(locale).findOne();

  // Handle the loading page after submitting the form
  const isLoading = ref(false);

  const {
    // Function to listen event
    $listen
  } = useNuxtApp();

  $listen('setGateway', (_gateway) => {
    isLoading.value = true;
   });

  const { 
    public: {
      deploymentDomain
    }
  } = useRuntimeConfig()

  // Set title description and meta tags.
  useContentHead({
    title, 
    description, 
    head: {
      meta: [
        {
          id: 'og:title',
          name: 'og:title',
          content: title
        },
        {
          id: 'og:description',
          name: 'og:description',
          content: description
        },
        {
          id: 'og:image',
          name: 'og:image',
          content: `${deploymentDomain}/${image}`
        },  
        {
          id: 'og:image',
          name: 'og:image',
          content: `${deploymentDomain}/${image}`
        }, 
      ]        
    }
  });
</script>

<template>
  <NuxtLayout>
    <OLoading
      :full-page="true"
      v-model:active="isLoading"
      :can-cancel="false"
    >
      <OIcon
        pack="mdi"
        icon="loading"
        size="large"
        spin
      />
    </OLoading>
    <section class="section is-medium">
      <nav class="breadcrumb">
      <ul>
        <li>
          <NuxtLink to="/">{{ profile }}</NuxtLink>
        </li>
        <li class="is-active">
          <NuxtLink :to="'/'+service">{{ title }}</NuxtLink>
        </li>
      </ul>
    </nav>
    </section>
    <div class="columns">
      <div class="column">
        <ServiceProfile
          :title="title"
          :description="description"
          :image="image"
          :extras="extras"
          :body="body"
          :gallery="gallery"
        />
      </div>
      <div class="column is-narrow">
        <section class="section">
          <ServiceBookingForm
            :locale="locale"
            :service="service"
            class="is-hidden-mobile"
          />
          <ServiceBookingForm
            :locale="locale"
            :service="service"
            class="is-hidden-tablet"
          />
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
  .is-hidden-mobile {
    min-width: 366px;
    max-width: 366px;
  }
</style>
