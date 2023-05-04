<script setup>
// Get invoiceId prop
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
  // function to display the countdown
  $dayjs,
  // Class to use pusher
  $pusher
} = useNuxtApp();


// Get invoice  payment methods from BTCPay Greenfield API
const paymentMethods = await $fetch(`/api/invoices/${invoiceId}/payment-methods`, {
  method: 'GET'
});

// Receive updated with pusher from Greenfield webooks about the status of the invoice
let status = ref(invoice.status);

// Update the status of the invoice using pusher
const channel = $pusher.subscribe('webhook');

channel.bind(invoiceId, (newStatus) => {

  status.value = newStatus.value;
});

// Set the reactive expiration values
const initialExpiresIn = (parseInt(invoice.expirationTime - new Date().getTime() / 1000) > 0) ? invoice.checkout.expirationMinutes * 60 : 0;
const expiresIn = ref(initialExpiresIn);
const initialExpiresInString = $dayjs(initialExpiresIn * 1000).format('mm[m]:ss[s]');
const expiresInString = ref(initialExpiresInString);
const initialIsNew =  (parseInt(invoice.expirationTime * 1000) > parseInt(new Date().getTime()));
const isNew = ref(initialIsNew);

// Update the timer of the invoice expiration time evey second and stop when it reaches 0 or when the page is closed
let refreshIntervalId;
onMounted(()=> {
  const checkConfirmations = () => {
    expiresIn.value = parseInt(invoice.expirationTime - new Date().getTime() / 1000);
    expiresInString.value = $dayjs(expiresIn.value * 1000).format('mm[m]:ss[s]');
    isNew.value = (parseInt(invoice.expirationTime * 1000) > parseInt(new Date().getTime()));
    if (!isNew.value) clearInterval(refreshIntervalId);
  }
  refreshIntervalId = setInterval(checkConfirmations, 1000);
});

onBeforeUnmount(() => {
  clearInterval(refreshIntervalId);
});
</script>

<template>
  <InvoiceBitcoinNew
    v-if="status === 'New' || status === 'InvoiceCreated'"
    :invoice="invoice"
    :paymentMethods="paymentMethods"
    :expiresIn="expiresIn"
    :expiresInString="expiresInString"
    :initialExpiresIn="initialExpiresIn"
  />
  <InvoiceBitcoinExpired
    v-else-if="status === 'Expired' || status === 'InvoiceExpired'"
    :invoice="invoice"
    :paymentMethods="paymentMethods"
  />
  <InvoiceBitcoinProcessing
    v-else-if="status == 'Processing' || status === 'InvoiceProcessing'"
    :invoiceId="invoiceId"
    :invoice="invoice"
  />
  <InvoiceBitcoinReceived
    v-else-if="status === 'Settled' || status === 'InvoiceReceivedPayment'"
    :invoiceId="invoiceId"
    :invoice="invoice"
  />
  <div v-else>Something went wrong</div>
</template>