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
    bookingGatewayPaymentMethod
  }
} = invoice;

// Get needed functions from plugins
const {
  // Function to capitalize strings
  $capitalize,
} = useNuxtApp();

// Format the payment method id to a readable name
const paymentMethod = $capitalize(kebabCase(bookingGatewayPaymentMethod).replace('-', ' ')).replace('-', '%');

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
  NotificationProgrammatic.open(t('invoiceFiatPaymentDetails.copied', { key }));
}
</script>

<template>
  <div>
    <div class="is-4">{{ paymentMethod }}</div>
    <section class="section">
      <div class="ltr-replicate-label">{{ $t('invoiceFiatPaymentDetails.sellerPaymentDetails') }}</div>
      <div class="columns is-mobile is-vcentered">
        <div class="column is-narrow">
          <div
            v-for="[key, value] in Object.entries(sellerPaymentDetails)"
            :key="key"
          >{{ $t(`invoiceFiatPaymentDetails.${key}`) }}:</div>
        </div>
        <div class="column">
          <div
            v-for="[key, value] in Object.entries(sellerPaymentDetails)"
            :key="key"
          >{{ value }}</div>
        </div> 
        <div class="column is-narrow">
          <div
            v-for="[key, value] in Object.entries(sellerPaymentDetails)"
            :key="key"
          >
            <OIcon
              icon="content-copy"
              @click.native="copy($t(`invoiceFiatPaymentDetails.${key}`), value)"
              variant="primary"
            />
          </div>
        </div>          
      </div>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 0px;
}
</style>