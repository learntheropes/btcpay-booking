<script setup>
// Import the surcharge for shitcoins gateway 
import { surcharge } from '../../assets/js/mix';

  // Get props
  const {
    amount,
    currency
  } = defineProps({
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  });

  // Filter merchant enabled gateways
  const {
    gateways,
  } = await queryContent(`/settings`).findOne();
  const enabledGateways = Object.keys(gateways).filter((i) => gateways[i]);

  const {
    // emit gateway selection function
    $event,
    // getDecimal function from currency
    $getDecimal
  } = useNuxtApp();

  // emit gateway selection
  const setGateway = (gateway) => {
  $event('setGateway', gateway);

    // Define the decimal length based on the currency
    const decimal = $getDecimal(currency);
}
</script>

<template>
<div>
  <OField
    grouped 
    group-multiline
  >
    <OButton
      v-for="gateway in enabledGateways"
      :key="gateway"
      variant="primary"
      :outlined="gateway !== 'bitcoin'"
      @click.native="setGateway(gateway)"
    >
    {{ `${$t('payWith')} ${gateway} ${(gateway === 'bitcoin') ? amount.toFixed(decimal) : (amount * (1 + (surcharge / 100))).toFixed(decimal)} ${currency}` }}
    </OButton>
  </OField>
  <p class="help">{{ $t('surcharge', {
    surcharge,
    gateways: Object.keys(gateways).filter((g) => gateways[g] && g !== 'bitcoin' ).join(` ${$t('and')} `)
  }) }}</p>
</div>
</template>
