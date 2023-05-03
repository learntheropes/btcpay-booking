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
      <IconWithText
        icon="github"
        text="btcpay-booking"
        textVariant="primary"
        textTo="https://github.com/learntheropes/ancap-booking"
        textTarget="_blank"
      />
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
          />
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>