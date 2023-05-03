<script setup>
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

  // Fix the surcharge for shitcoins gateway 
  const surcharge = 5;

  // Filter merchant enabled gateways
  const {
    gateways,
  } = await queryContent(`/settings`).findOne();
  const enabledGateways = Object.keys(gateways).filter((i) => gateways[i]);  

  // emit gateway selection
  const { $event } = useNuxtApp(); 

  const setGateway = (gateway) => {
  $event('setGateway', gateway);
}
</script>

<template>
<div>
  <div class="is-hidden-mobile">
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
      {{ `${$t('payWith')} ${gateway} ${(gateway === 'bitcoin') ? amount : amount * (1 + (surcharge / 100))} ${currency}` }}
      </OButton>
    </OField>
    <p class="help">{{ $t('surcharge', {
      surcharge,
      gateways: Object.keys(gateways).filter((g) => gateways[g] && g !== 'bitcoin' ).join(` ${$t('and')} `)
    }) }}</p>
  </div>
  <div class="is-hidden-tablet">
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
      {{ `${$t('payWith')} ${gateway} ${(gateway === 'bitcoin') ? amount : amount * (1 + (surcharge / 100))} ${currency}` }}
      </OButton>
    </OField>
    <p class="help">{{ $t('surcharge', {
      surcharge,
      gateways: Object.keys(gateways).filter((g) => gateways[g] && g !== 'bitcoin' ).join(` ${$t('and')} `)
    }) }}</p>
  </div>
</div>
</template>

<style scoped>
  .is-hidden-mobile {
    max-width: 366px;
  }
</style>