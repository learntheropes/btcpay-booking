<script setup>
  // Get invoice props
  const {
    invoice,
  } = defineProps({
    invoice: {
      type: Object,
      required: true
    }
  });

  // Get fiat gateway method
  const {
    metadata: {
      buyerGateway: {
        gatewayMethod
      }
    }
  } = invoice;
</script>

<template>
  <InvoiceFiatSepa
    v-if="gatewayMethod === 'SEPA'"
    :invoice="invoice"
  />
</template>