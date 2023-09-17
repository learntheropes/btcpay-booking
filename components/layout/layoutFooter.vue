<script setup>
  const { locale, locales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();
  const availableLocales = computed(() => (locales.value).filter(i => i.code !== locale.value));
  // const { $commitBlockHeight } = useNuxtApp();
</script>

<template>
  <footer class="footer">
    <div class="container">
      <nav class="section level">
        <div class="level-left">
          <div class="level-item">
            <IconWithText
              icon="github"
              text="btcpay-booking"
              textVariant="primary"
              textTo="https://github.com/learntheropes/btcpay-booking"
              textTarget="_blank"
            />
          </div>
        </div>
        <!-- <div class="level-center">
          <div class="level-item">{{ $t('layoutFooter.lastBuiltAt') }} {{ $commitBlockHeight }}</div>
        </div> -->
        <div class="level-center">
          <NuxtLink :to="localePath('/dashboard')" class="level-item has-text-centered">{{ $t('layoutFooter.merchantDashboard') }}</NuxtLink>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons">
              <OButton
                v-for="locale in availableLocales"
                :key="locale.code"
                tag="router-link"
                :to="switchLocalePath(locale.code)"
                variant="primary"
                inverted
              >{{ locale.name }}</OButton>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</template>

<style>
.footer {
  padding-left: 0rem;
  padding-right: 0rem;
}
@media screen and (max-width: 768px) {
  .level-center {
    padding-top: 2rem;
    padding-bottom: 1.5rem;
  }
}
</style>
