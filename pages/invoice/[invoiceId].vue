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
      <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="/">{{ profile }}</a></li>
        <li><a :href="'/'+locale+'/'+buyerService" aria-current="page">{{ buyerServiceTitle }}</a></li>
        <li class="is-active">{{ `${t('invoice')} ${invoiceId}` }}</li>
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
          />
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>