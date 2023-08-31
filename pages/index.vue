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

  const { 
    public: {
      deploymentDomain
    }
  } = useRuntimeConfig();

  // Set head og: meta tags.
  useHead({
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
        id: 'twitter:image',
        name: 'twitter:image',
        content: `${deploymentDomain}/${image}`
      }, 
    ]
  })

  // Set head title description tags.
  useContentHead({
    title, 
    description
  });

  // redirect to locale only on the homepage
  // because i18n settings do not work
  const { fullPath } = useRoute();
  if (fullPath === '/') navigateTo(`/${locale}`);
</script>

<template>
  <NuxtLayout>
    <section class="section is-medium">
      <nav class="breadcrumb">
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
