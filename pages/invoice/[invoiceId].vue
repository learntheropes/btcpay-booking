<script setup>
  // Get the invoiceId page parameter
  const {
    params: {
      invoiceId
    }
  } = useRoute();

  // Get the buyer language
  const {
    locale: {
      value: locale
    }
  } = useI18n();

  // Get the profile name for the breadcrumb
  const {
    title: profile,
  } = await queryContent(`/profile`).locale(locale).findOne();

  // Get invoice from BTCPay Greenfield API
  const invoice = await $fetch(`/api/invoices/${invoiceId}`);

  const {
    status,
    metadata: {
      buyerLanguage,
      buyerService,
      buyerGateway: {
        gatewayName
      }
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
        <section v-if="gatewayName === 'bitcoin'" class="section">
          <invoiceBitcoin
            :invoiceId="invoiceId"
            :invoice="invoice"
            :status="status"
            class="is-hidden-mobile"
          />
          <invoiceBitcoin
            :invoiceId="invoiceId"
            :invoice="invoice"
            :status="status"
            class="is-hidden-tablet"
          />
        </section>
        <section v-else-if="gatewayName === 'fiat'" class="section">
          <invoiceFiat
            :invoice="invoice"
            :status="status"
            class="is-hidden-mobile"
          />
          <invoiceFiat
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
