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
  // function to display the countdown
  $dayjs,
  // Class to use pusher
  $pusher,
  // Function to listen loading event
  $listen
} = useNuxtApp();

// Get the default payment method of the store
const { data: store } = await useFetch(`/api/store`);
const defaultPaymentMethod = store.value.defaultPaymentMethod;

// Get invoice  payment methods from BTCPay Greenfield API
const { data } = await useFetch(`/api/invoices/${invoiceId}/payment-methods`);
const paymentMethods = data.value

// Receive updated with pusher from Greenfield webooks about the status of the invoice
let status = ref(invoice.status);


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

  // Update the status of the invoice using pusher
  const channel = $pusher.subscribe('bitcoin_invoice_webhook');

  channel.bind(invoiceId, (newStatus) => {

    status.value = newStatus.value;
  });
});

// Stop the countdown on page closure
onBeforeUnmount(() => {
  clearInterval(refreshIntervalId);
});

// Set initial status of the component to not loading the page
const isLoading = ref(false);

// Listen to set that the invoice is refreshing and the component is loading
$listen('invoiceBitcoinIsLoading', (value) => {
  isLoading.value = value;
  });
</script>

<template>
  <div>
    <OLoading
      :full-page="true"
      v-model:active="isLoading"
      :can-cancel="false"
    >
      <OIcon
        pack="mdi"
        icon="loading"
        size="large"
        spin
      />
    </OLoading>
    <InvoiceBitcoinNew
      v-if="status === 'New' || status === 'InvoiceCreated'"
      :invoice="invoice"
      :defaultPaymentMethod="defaultPaymentMethod"
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
  </div>
</template>
