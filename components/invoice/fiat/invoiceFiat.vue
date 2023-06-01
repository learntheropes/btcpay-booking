<script setup>
  import { ref } from 'vue';

  // Get invoice props
  const {
    invoice,
  } = defineProps({
    invoice: {
      type: Object,
      required: true
    }
  });

  // Define fiat payment method and set initial value to null
  const method = ref(null);

  // listen to emitted selected fiat payment methods
  const { $listen } = useNuxtApp();

  $listen('setFiatMethod', (selectedMethod) => {
    method.value = selectedMethod;
  });
</script>

<template>
  <invoiceFiatSelector
    v-if="!method"
  />
  <InvoiceFiatSepa
    v-else-if="method === 'SEPA'"
    :invoice="invoice"
  />
</template>