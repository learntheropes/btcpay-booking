<script setup>
import QRCode from 'qrcode'
import find from 'lodash.find'
import { locales } from '~/assets/js/locales.js'

// Get the deployment domain for the qrcode
const {
  public: {
    deploymentDomain
  }
} = useRuntimeConfig()

// Get props
const {
  invoice
} = defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

// Deconstruct props
const {
  id: invoiceId,
  metadata: {
    orderId,
    buyerTime,
    buyerExtras,
    buyerName,
    buyerEmail,
    buyerFingerprint,
    buyerPGP,
    buyerDetails,
    buyerLanguage,
    buyerService,
    buyerGateway
  }
} = invoice

  // Get the service name for the breadcrumb
  const {
    title: buyerServiceTitle
  } = await queryContent(`/services/${buyerService}`).locale(buyerLanguage).only([ 'title' ]).findOne();

// Function to generate the qrcode from a string
const generateQrCode = async (text) => {
  return await QRCode.toDataURL(text);
};

// Generate the qrcode for the invoice URL
const qrCode = await generateQrCode(`${deploymentDomain}/invoice/${invoiceId}`)
</script>

<template>
  <section class="section">
    <div class="columns">
      <div class="column is-narrow">
        <div class="level-item is-justify-content-center">
          <figure class="image is-128x128">
            <img :src="qrCode" height="128" width="128" />
          </figure>
        </div>
      </div>
      <div class="column">
        <h1 class="title is-4 has-text-primary">{{ $t('invoice') }} {{ invoiceId }}</h1>
        <div class="subtitle is-6">{{ $t('booking')}} {{ orderId }}</div>
      </div>
    </div>
  </section>
  <section class="section content">
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerService') }}</div>
      <div>{{ buyerServiceTitle }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerGateway') }}</div>
      <div>{{ buyerGateway }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerDetails') }}</div>
      <div>{{ buyerDetails || $t('notProvided') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerTime') }}</div>
      <div>{{ buyerTime.map(t => new Date(t).toLocaleString(buyerLanguage)).join('\n\n') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerExtras') }}</div>
      <div>{{ (buyerExtras.length) ? buyerExtras.split(', ').join('\n') : $t('notProvided') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerName') }}</div>
      <div>{{ buyerName || $t('notProvided') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerEmail') }}</div>
      <div>{{ buyerEmail || $t('notProvided') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerFingerprint') }}</div>
      <div>{{ buyerFingerprint || $t('notProvided') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerPGP') }}</div>
      <div>{{ buyerPGP || $t('notProvided') }}</div>
    </div>
    <div class=block>
      <div class="has-text-weight-semibold">{{ $t('buyerLanguage') }}</div>
      <div>{{ find(locales, { code: buyerLanguage}).name }}</div>
    </div>
  </section>
</template>

<style scoped>
div {
  white-space: pre-wrap;
}
</style>