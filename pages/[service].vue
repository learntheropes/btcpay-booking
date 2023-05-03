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
    gallery,
    duration
  } = await queryContent(`/services/${service}`).locale(locale).findOne();

  // Set title and description page
  useContentHead({ title, description });
</script>

<template>
  <NuxtLayout>
    <section class="section is-medium">
      <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="/">{{ profile }}</a></li>
        <li class="is-active"><a :href="'/'+service" aria-current="page">{{ title }}</a></li>
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
            :extras="extras"
            :duration="duration"
          />
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>