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
      buyerGateway
    }
  } = invoice;
</script>

<template>
  <pre>{{ buyerGateway }}</pre>
</template>