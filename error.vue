<template>
  <div class="hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container has-text-centered">
        <p v-if="error.statusCode === 404" class="title">
          {{ $t('pageNotFound') }}
        </p>
        <p v-else-if="error.statusCode === 401" class="title">
          {{ $t('unauthorized') }}
        </p>
        <p v-else class="title">
          {{$t('somethingWentWrong')}}
        </p>
        <DevOnly class="block">
          <div class="content">
            {{ error.message }}<br>
            {{ error.stack }}
          </div>
        </DevOnly>
        <OButton
          tag="router-link"
          :to="localePath({ name: 'index' })"
          variant="primary"
          outlined
        >
          {{ $t('backToTheHomePage') }}
        </OButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
  required: true
})
useContentHead({
  title: props.error.statusCode,
  description: props.error.message
})
</script>
