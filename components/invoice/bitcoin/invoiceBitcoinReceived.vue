<script setup>
// Get invoice prop
const {
  invoiceId,
  invoice,
} = defineProps({
  invoiceId: {
    type: String,
    required: true
  },
  invoice: {
    type: Object,
    required: true
  }
});

// Get updated  payment methods from BTCPay Greenfield API to get the payments timestamp
const { data } = await useFetch(`/api/invoices/${invoiceId}/payment-methods`);
const paymentMethods = data.value;

const { payments } = paymentMethods;

// Set the detail as initially visible
const isDetailsOpen = ref(true);

const selectedMethodIndex = 0;

// Get needed functions from plugins
const {
  // function to display the ellapsed time since payments
  $dayjs,
  // function to print the receipt
  $printReceipt
} = useNuxtApp();
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-justify-content-center">
        <span>{{ $t('invoicePaid') }}</span>
      </div>
    </header>
    <div class="card-content">
      <div class="media is-justify-content-center">
          <figure class="image is-192x192 has-text-centered">
            <NuxtIcon name="check-circle-outline"  class="ltr-is-192by192-primary" />
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
          <div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('totalPrice') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].amount).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('totalFiat') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(invoice.amount).toFixed(2) }} {{ invoice.currency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('exchangeRate') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].rate).toFixed(2) }} {{ paymentMethods[selectedMethodIndex].cryptoCode }}/{{ invoice.currency }}</div>
              </div>
            </div>
          </div>
        </OCollapse>
      </div>
      <div
        v-for="payment in payments"
        :key="payment.id"
      >{{ parseFloat(payment.value).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode }} {{ $t('invoiceReceived') }} {{ $dayjs(payment.receivedDate * 1000).fromNow() }}</div>
    </div>
    <footer class="card-footer">
      <div
        @click.native="$printReceipt"
        class="card-footer-item"
      >{{ $t('printReceipt') }}</div>
    </footer>
  </div>
</template>

<style scoped>
.level {
  margin-bottom: 0rem
}
</style>
