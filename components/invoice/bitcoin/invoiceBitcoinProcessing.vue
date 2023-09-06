<script setup>
// Get invoiceId prop
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

// Get updated invoice  payment methods from BTCPay Greenfield API
const { data } = await useFetch(`/api/invoices/${invoiceId}/payment-methods`);
const paymentMethods = data.value

// Set the inital values of responsive variables
const isDetailsOpen = ref(true);
const selectedMethodIndex = ref(0);
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-justify-content-center">
        <span>{{ $t('invoiceProcessing') }}</span>
      </div>
    </header>
    <div class="card-content">
      <div class="media is-justify-content-center">
          <figure class="image is-48x48 has-text-centered">
            <NuxtIcon name="clock-outline"  class="ltr-is-48by48-grey" />
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
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].amount).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}</div>
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
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].rate).toFixed(2) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}/{{ invoice.currency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('amountDue') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].due).toFixed(8) }} {{ paymentMethods[selectedMethodIndex].cryptoCode}}</div>
              </div>
            </div>
          </div>
        </OCollapse>
      </div>
      <div>{{ $t('invoiceExpired') }} {{ $dayjs(invoice.expirationTime * 1000).fromNow() }}</div>
    </div>
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
