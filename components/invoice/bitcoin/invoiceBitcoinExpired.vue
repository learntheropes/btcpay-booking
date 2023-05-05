<script setup>
// Get invoiceId prop
const {
  invoice,
  paymentMethods,
} = defineProps({
  invoice: {
    type: Object,
    required: true
  },
  paymentMethods: {
    type: Array,
    required: true
  }
});

// Set the inital values of responsive variables
const isDetailsOpen = ref(true);
const selectedMethodIndex = ref(0);

// Swith from on chain to lightning and vice versa
const setMethodIndex = (index) => {
  selectedMethodIndex.value = index
};

// Get needed functions from plugins
const {
  // Function the get the invoice from btcpay
  $createInvoice,
  // function to display the ellapsed time since expiration
  $dayjs
} = useNuxtApp();
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-justify-content-center">
        <span>{{ $t('invoiceExpired') }}</span>
      </div>
    </header>
    <div class="card-content">
      <div class="media is-justify-content-center">
          <figure class="image is-48x48 has-text-centered">
            <NuxtIcon name="close-circle-outline"  class="ltr-is-48by48-grey" />
          </figure>
      </div>
      <div class="block">
        <OCollapse
          position="bottom"
          v-model:open="isDetailsOpen"
        >
          <template #trigger>
            <div class="has-text-centered">
              <OButton
                v-if="isDetailsOpen === false"
                variant="primary"
                inverted
              >
                <IconWithText
                  icon="chevron-down"
                  :text="$t('viewDetails')"
                  textVariant="primary"
                  iconVariant="primary"
                  iconSide="right"
                />
              </OButton>
              <OButton
                v-else
                variant="primary"
                inverted
              >
                <IconWithText
                  icon="chevron-up"
                  :text="$t('hideDetails')"
                  textVariant="primary"
                  iconVariant="primary"
                  iconSide="right"
                />  
            </OButton>
            </div>
          </template>
          <div class="columns is-mobile">
            <div class="column is-narrow has-text-warning">
              <div>{{ $t('totalPrice') }}</div>
              <div>{{ $t('totalFiat') }}</div>
              <div>{{ $t('exchangeRate') }}</div>
              <div>{{ $t('amountDue') }}</div>
            </div>
            <div class="column">
              <div class="has-text-right">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].amount).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}</div>
              <div class="has-text-right">{{ Number.parseFloat(invoice.amount).toFixed(2) }} {{ invoice.currency }}</div>
              <div class="has-text-right">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].rate).toFixed(2) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}/{{ invoice.currency }}</div>
              <div class="has-text-right">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].due).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}</div>
            </div>
          </div>
        </OCollapse>
      </div>
      <div>{{ $t('invoiceExpired') }} {{ $dayjs(invoice.expirationTime * 1000).fromNow() }}.</div>
      <div>{{ $t('invoiceValidity', { minutes: invoice.checkout.expirationMinutes }) }}.</div>
    </div>
    <footer class="card-footer">
      <NuxtLink
        @click.native="$createInvoice(invoice.metadata)"
        class="card-footer-item"
      >{{ $t('payWithBitcoin') }}</NuxtLink>
    </footer>
  </div>
</template>

<style>
.ltr-is-48by48-grey svg {
  min-height: 48px;
  min-width: 48px;
  color: grey;
}
</style>
