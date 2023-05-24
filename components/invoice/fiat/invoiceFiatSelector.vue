<script setup>
  const methods = [
    'SEPA'
  ];

  const { $event } = useNuxtApp();

  const setFiatMethod = (selectedMethod) => {
    $event('setFiatMethod', selectedMethod);
  };
</script>

<template>
  <OField
    grouped 
    group-multiline
    :label="$t('selectPaymentMethod')"
  >
    <OButton
      v-for="method in methods"
      :key="method"
      tag="button"
      @click.native="setFiatMethod(method)"
      variant="primary"
    >{{ method }}</OButton>
  </OField>
</template>