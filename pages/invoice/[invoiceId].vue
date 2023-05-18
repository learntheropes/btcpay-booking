<script setup>
  // Get the invoiceId parameter
  const { params: { invoiceId }} = useRoute();

  // Get the buyer leanguage
  const { locale: { value: locale }} = useI18n();

  // Get the profile name for the breadcrumb
  const {
    title: profile,
  } = await queryContent(`/profile`).locale(locale).findOne();

  // Get invoice from BTCPay Greenfield API
  const invoice = await $fetch(`/api/invoices/${invoiceId}`, {
    method: 'GET'
  });

  const {
    status,
    metadata: {
      buyerLanguage,
      buyerService,
      buyerGateway
    }
  } = invoice;

  // Get the service name for the breadcrumb
  const {
    title: buyerServiceTitle
  } = await queryContent(`/services/${buyerService}`).locale(buyerLanguage).only([ 'title' ]).findOne();

  // Set title page
  const { t } = useI18n();
  useContentHead({ title: `${t('invoice')} ${invoiceId}` });
</script>

<template>
  <NuxtLayout>
    <section class="section is-medium">
      <nav class="breadcrumb">
      <ul>
        <li>
          <NuxtLink to="/">{{ profile }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="'/'+locale+'/'+buyerService">{{ buyerServiceTitle }}</NuxtLink>
        </li>
        <li class="is-active">
          <NuxtLink>{{ `${t('invoice')} ${invoiceId}` }}</NuxtLink>
        </li>
      </ul>
    </nav>
    </section>
    <div class="columns">
      <div class="column">
        <invoiceProfile
          :invoice="invoice"
        />
      </div>
      <div class="column is-narrow">
        <section class="section">
          <invoiceBitcoin
            v-if="buyerGateway === 'bitcoin'"
            :invoiceId="invoiceId"
            :invoice="invoice"
            :status="status"
            class="is-hidden-mobile"
          />
          <invoiceBitcoin
            v-if="buyerGateway === 'bitcoin'"
            :invoiceId="invoiceId"
            :invoice="invoice"
            :status="status"
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
