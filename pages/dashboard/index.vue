<script setup>
  import { useLocalePath } from 'vue-i18n-routing'
  const  localePath  = useLocalePath()
  
  // Get the buyer leanguage
  const { locale } = useI18n();

  // Get the profile name for the breadcrumb
  const {
    title: profile,
  } = await queryContent(`/profile`).locale(locale.value).findOne();
</script>

<template>
  <NuxtLayout>
    <section class="section is-medium">
      <nav class="breadcrumb">
        <ul>
        <li>
          <NuxtLink :to="localePath('/')">{{ profile }}</NuxtLink>
        </li>
        </ul>
      </nav>
    </section>
    <div class="has-text-centered">{{ $t('dashboardIndex.underConstruction') }}</div>
  </NuxtLayout>
</template>