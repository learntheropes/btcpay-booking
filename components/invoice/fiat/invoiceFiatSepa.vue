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

  $listen('sepaIsLoading', (bool) => {
    isLoading.value = bool;
  });

  $listen('emitOrderDetails', details => {
    console.log('orderDetails', details)
    orderDetails.value = details;
  })
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