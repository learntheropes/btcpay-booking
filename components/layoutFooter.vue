<script setup>
  const { locale, locales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();
  const availableLocales = computed(() => (locales.value).filter(i => i.code !== locale.value));
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
