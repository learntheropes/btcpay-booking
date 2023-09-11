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
  // Hadle bitcoin operations
  $bitcoin,
  $pgp
} = useNuxtApp();

onMounted(async () => {

  const {
    public: {
      isDeployed,
    }
  } = useRuntimeConfig();


  const {
    message,
    signature,
    peachUniqId
  } = $bitcoin.signMessage(Date.now());

  // Register the peach account
  const proxy = (isDeployed) ? '' : 'https://corsproxy.io/?';
  // const account = await $fetch(`${proxy}https://api.peachbitcoin.com/v1/user/register/`, {
  //   method: 'POST',
  //   body: {
  //     message: message,
  //     signature: signature,
  //     publicKey: $bitcoin.publicKey,
  //     uniqueId: peachUniqId
  //   },
  //   async onRequestError({ request, options, error }) {
  //     console.log("[fetch request error]", request, error);
  //   },
  //   async onResponseError({ request, response, options }) {
  //     console.log("[fetch response error]", request, response.status, response.body);
  //   },
  // });
});

</script>

<template>
  <div>
    <invoiceFiatWorning :invoice="invoice" />
    <InvoiceFiatBackup :invoiceId="invoiceId" />
    <invoiceFiatPaymentDetails :invoice="invoice" />
    <InvoiceFiatChat />
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