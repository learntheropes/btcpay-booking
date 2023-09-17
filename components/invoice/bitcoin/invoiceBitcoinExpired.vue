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
  $dayjs,
  // function to emit loading event
  $event
} = useNuxtApp();

// Create a new invoice for the same service
const refreshInvoice = async (metadata) => {
  // Set the component as loading
  $event('invoiceBitcoinIsLoading', true);
  // Create the invoice
  await $createInvoice(metadata);
  // We don't set the loading as false
  // because this is done by the invoiceBitcoinNew component
}
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-justify-content-center">
        <span>{{ $t('invoiceBitcoinExpired.invoiceExpired') }}</span>
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
                  :text="$t('invoiceBitcoinNew.viewDetails')"
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
                  :text="$t('invoiceBitcoinNew.hideDetails')"
                  textVariant="primary"
                  iconVariant="primary"
                  iconSide="right"
                />  
            </OButton>
            </div>
          </template>
          <div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.totalPrice') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].amount).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.totalFiat') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(invoice.amount).toFixed(2) }} {{ invoice.currency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.exchangeRate') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].rate).toFixed(2) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}/{{ invoice.currency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.amountDue') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].due).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}</div>
              </div>
            </div>
          </div>
        </OCollapse>
      </div>
      <div>{{ $t('invoiceBitcoinExpired.invoiceExpired') }} {{ $dayjs(invoice.expirationTime * 1000).fromNow() }}.</div>
      <div>{{ $t('invoiceBitcoinExpired.invoiceValidity', { minutes: invoice.checkout.expirationMinutes }) }}.</div>
    </div>
    <footer class="card-footer">
      <div
        @click.native=refreshInvoice(invoice.metadata)
        class="card-footer-item"
      >{{ $t('invoiceBitcoinExpired.payWithBitcoin') }}</div>
    </footer>
  </div>
</template>

<style scoped>
.level {
  margin-bottom: 0rem
}
</style>

<style>
.ltr-is-48by48-grey svg {
  min-height: 48px;
  min-width: 48px;
  color: grey;
}
</style>
