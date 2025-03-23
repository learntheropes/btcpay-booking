<script setup>
// Get invoice props
const {
  invoiceId,
  invoice
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

// Get needed functions from plugins
const {
  $peach
} = useNuxtApp();


onMounted(async () => {
  let peachOfferId = invoice.metadata.buyerGateway.peachOfferId;
  if (!peachOfferId) {
    try {
      await $peach.registerAccount();
    } catch (e) {
      console.error('Error registering the user', e);
    }
    await $peach.updateUser();
    try {
      console.log('btc amount', invoice.metadata.buyerBitcoinPrice);
      peachOfferId = await $peach.postBuyOffer(
      invoice.metadata.buyerGateway.gatewayCurrency,
      invoice.metadata.buyerGateway.gatewayMethod,
      invoice.metadata.buyerBitcoinPrice / invoice.metadata.bitcoinExhangeRate
    )
    } catch (e) {
      console.error('Error publishing offer', e);
    };
    invoice.metadata.buyerGateway.peachOfferId = peachOfferId;
    await $fetch(`/api/invoices/${invoiceId}`, {
      method: 'PUT',
      body: invoice
    })
  }
  const matches = await $peach.getMatches(peachOfferId);
  console.log('matches', matches)
});
</script>

<template>
  <div>
    <invoiceFiatWorning :invoice="invoice" />
    <InvoiceFiatBackup :invoiceId="invoiceId" />
    <invoiceFiatPaymentDetails :invoice="invoice" />
    <!-- <InvoiceFiatChat /> -->
  </div>
</template>

<style lang="scss">
.is-success {
  color: $success !important;
}
.is-buyer-chat-text {
  color: $primary !important;
  text-align: right;
}
// Custom notification with primary border
.has-border-primary {
  background-color: white;
  border-style: solid;
  border-width: 1px;
  border-color: $primary;
  color: black;
}
</style>

<style scoped>
.section {
  padding-left: 0rem;
  padding-right: 0rem;
}
.has-text-7 {
  font-size: 0.75rem;
}
</style>