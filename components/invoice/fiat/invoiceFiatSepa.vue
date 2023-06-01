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

  // Get the needed plugins
  const {
    // Function to listen emitted events
    $listen
  } = useNuxtApp();

  // Place the order and get the payment info
  let isLoading = ref(false)
  let orderDetails = ref(null);

  // Get the payment details from the btcpay invoice metadata
  const { metadata: { buyerSepa }} = invoice

  // If they exists, pass them to the sepa details component
  // Else, show the form to the buyer
  if (buyerSepa) orderDetails.value = buyerSepa;

  // Listen the emitted function execution to show the page as loading
  $listen('sepaIsLoading', (bool) => {
    isLoading.value = bool;
  });

  // Listen the emitted order details
  $listen('emitOrderDetails', details => {
    orderDetails.value = details;
  });
</script>

<template>
  <div>
    <InvoiceFiatSepaForm v-if="!orderDetails"
      :invoiceId="invoiceId"
      :invoice="invoice"
    />
    <InvoiceFiatSepaDetails v-else
      :orderDetails="orderDetails"
    />
    <div v-if="isLoading">
      <OLoading
        :full-page="false"
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
    </div>
  </div>
</template>