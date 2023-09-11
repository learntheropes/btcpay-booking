<script setup>
import kebabCase from 'lodash.kebabcase';

// Get invoice props
const {
  invoice
} = defineProps({
  invoice: {
    type: Object,
    required: true
  }
});
// Get the needed info from the invoice prop
const {
  metadata: {
    buyerGateway: {
      gatewayMethod
    },
  }
} = invoice;

// Get needed functions from plugins
const {
  // Function to capitalize strings
  $capitalize,
} = useNuxtApp();

// Format the payment method id to a readable name
const paymentMethod = $capitalize(kebabCase(gatewayMethod).replace('-', ' ')).replace('-', '%');
</script>

<template>
  <ONotification
    rootClass="has-border-primary"
    contentClass="ltr-has-new-line is-success"
    closable
  >{{ $t('bitcoinPurchaseWarning', { paymentMethod }) }}</ONotification>
</template>