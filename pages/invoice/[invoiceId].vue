<script setup>
  // Get the invoiceId page parameter
  const {
    params: {
      invoiceId
    }
  } = useRoute();

  // Get the buyer language
  const { locale } = useI18n();

  // Get the profile name for the breadcrumb
  const {
    title: profile,
  } = await queryContent(`/profile`).locale(locale.value).findOne();

  // Get invoice from BTCPay Greenfield API
  const { data } = await useFetch(`/api/invoices/${invoiceId}`);
  const invoice = data.value;

  const {
    status,
    metadata: {
      buyerLanguage,
      buyerService,
      buyerGateway: {
        gatewayType
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
          <NuxtLink :to="localePath('/')">{{ profile }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath(`/${buyerService}`)">{{ buyerServiceTitle }}</NuxtLink>
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
        <section v-if="gatewayType === 'bitcoin'" class="section">
          <invoiceBitcoin
            :invoiceId="invoiceId"
            :invoice="invoice"
            :status="status"
            :class="($device.isMobile) ? null : 'side'"
          />

        </section>
        <section v-else-if="gatewayType === 'fiat'" class="section">
          <invoiceFiat
            :invoice="invoice"
            :status="status"
            :class="($device.isMobile) ? null : 'side'"
          />
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  .side {
    width: 366px;
  }
}
</style>
