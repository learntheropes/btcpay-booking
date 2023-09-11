<script setup>
import kebabCase from 'lodash.kebabcase';
import { NotificationProgrammatic } from "@oruga-ui/oruga-next";

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

// Mock decripted buyer details 
const sellerPaymentDetails = {
  beneficiary: 'Foo Bar',
  reference: 'foo bar baz'
}

// Get the function for translations
const { t } = useI18n();

// Functions to copy the payment details
const copy = (key, value) => {
  navigator.clipboard.writeText(value);
  NotificationProgrammatic.open(t('copied', { key }));
}
</script>

<template>
  <div>
    <div class="is-4">{{ paymentMethod }}</div>
    <section class="section">
      <OField
        v-for="[key, value], index in Object.entries(sellerPaymentDetails)"
        :label="(index === 0 ) ? $t('sellerPaymentDetails') : null"
        :key="key"
      >
        <OButton
          variant="warning"
          disabled
        >{{ $t(key) }}</OButton>
        <OInput 
          :model-value="value"
          disabled
          expanded
          iconPack="mdi"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy($t(key), value)"
        />
      </OField>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 0px;
}
</style>