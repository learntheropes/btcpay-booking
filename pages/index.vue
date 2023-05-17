<script setup>
  // Get the buyer leanguage
  const { locale: { value: locale }} = useI18n();
  
  // Get language specific profile settings
  const {
    title,
    description,
    image,
    twitter,
    nostr,
    instagram,
    websites,
    body
  } = await queryContent(`/profile`).locale(locale).findOne();

  // Set title and description page
  useContentHead({ title, description });
</script>

<template>
  <NuxtLayout>
    <section class="section is-medium">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>&nbsp;</li>
        </ul>
      </nav>
    </section>
    <div class="columns">
      <div class="column">
        <MerchantProfile
          :title="title"
          :description="description"
          :image="image"
          :twitter="twitter"
          :nostr="nostr"
          :instagram="instagram"
          :websites="websites"
          :body="body"
        />
      </div>
      <div class="column is-narrow">
        <section class="section">
          <MerchantServiceSelector
            :locale="locale"
            class="is-hidden-mobile"
          />
          <MerchantServiceSelector
            :locale="locale"
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
