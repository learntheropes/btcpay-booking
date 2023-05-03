<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const availableLocales = computed(() => (locales.value).filter(i => i.code !== locale.value))
</script>

<template>
  <footer class="footer">
    <nav class="level">
      <div class="level-left">
        <!-- Build with love by learntheropes with Nuxt, Oruga and Btcpay -->
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
  </footer>
</template>


