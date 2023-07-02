<script setup>
const props = defineProps({
  error: Object,
  required: true
});

useContentHead({
  title: props.error.statusCode,
  description: props.error.message
})

const {
  locale: {
    value: locale
  },
  t
} = useI18n();

let translatedErrorMessage
switch(props.error.statusCode) {
  case 401:
    translatedErrorMessage = t('unauthorized')
    break;
  case 403:
    translatedErrorMessage = t('unauthorized')
    break;
  case 404:
    translatedErrorMessage = t('pageNotFound')
    break;
  default:
    translatedErrorMessage = t('somethingWentWrong')
}

const handleError = () => clearError({ redirect: `/${locale}` });
</script>

<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title">{{ translatedErrorMessage }}</p>
        <DevOnly>foo bar</DevOnly>
        <DevOnly>
          <div class="block content">
            <div>{{ error.statusMessage || error.message }}</div>
            <div>{{ error.stack }}</div>
          </div>
        </DevOnly>
        <button @click="handleError" class="button is-primary is-outlined">{{ $t('backToTheHomePage') }}</button>
      </div>
    </div>
  </div>
</template>
