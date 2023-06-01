<script setup>
  // Get invoice props
  const {
    invoice
  } = defineProps({
    invoice: {
      type: Object,
      required: true
    }
  });

  // Define the form reactive properties and the initial empty fields
  const initialForm = {
    buyerLegalName: 'Satoshi Nakamoto',
    buyerLegalAddress: 'Foo Bar 17',
    buyerLegalCity: 'Lugano',
    buyerLegalZip: '00100',
    buyerLegalCountry: 'CH',
    buyerBic: 'XXXXCHXXXXX',
    buyerIban: 'NL83INGB2786219639'
  }
  const form = ref(initialForm);

  // Define the form validation
  const validationSchema = {
    buyerLegalName: {
      required: true,
    },
    buyerLegalAddress: {
      required: true
    },
    buyerLegalCity: {
      required: true
    },
    buyerLegalZip: {
      required: true
    },
    buyerLegalCountry: {
      required: true
    },
    buyerBic: {
      required: true,
      validateBic: true
    },
    buyerIban: {
      required: true,
      validateIban: true
    }
  };

  // Get the needed plugins
  const {
    // Function to get the translated list of countries for the select field
    $getCountriesList,
    // Function to emit changes
    $event,
    // Function to place the order on bity
    $placeSepaOrder,
    // Function to sign the bity message and get the order payment info
    $getSepaPaymentInfo
  } = useNuxtApp();

  // Get the transalted list of countries for the form select field
  const countries = $getCountriesList();


  // Place the order and emit the payment info
  const emitOrderDetails = async values => {
    $event('sepaIsLoading', true);
    const order = await $placeSepaOrder(invoice, values);
    const orderDetails = await $getSepaPaymentInfo(invoice, values, order);
    $event('emitOrderDetails', orderDetails);
    $event('sepaIsLoading', false);
  }
</script>

<template>
  <VForm
    name="sepa"
    :validation-schema="validationSchema"
    @submit="emitOrderDetails"
  >
    <VField
      name="buyerLegalName"
      :label="$t('buyerLegalName')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerLegalName"
    >
      <OField
        :label="$t('buyerLegalName')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerLegalName')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <VField
      name="buyerLegalAddress"
      :label="$t('buyerLegalAddress')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerLegalAddress"
    >
      <OField
        :label="$t('buyerLegalAddress')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerLegalAddress')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <VField
      name="buyerLegalCity"
      :label="$t('buyerLegalCity')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerLegalCity"
    >
      <OField
        :label="$t('buyerLegalCity')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerLegalCity')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <VField
      name="buyerLegalZip"
      :label="$t('buyerLegalZip')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerLegalZip"
    >
      <OField
        :label="$t('buyerLegalZip')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerLegalZip')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <VField
      name="buyerLegalCountry"
      :label="$t('buyerLegalCountry')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerLegalCountry"
    >
      <OField
      :label="$t('buyerLegalCountry')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OSelect
          :label="$t('buyerLegalCountry')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
          expanded
        >
          <option
            v-for="country in countries"
            :value="country.code"
          >{{ country.name }}</option>
        </OSelect>
      </OField>
    </VField>

    <VField
      name="buyerBic"
      :label="$t('buyerBic')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerBic"
    >
      <OField
        :label="$t('buyerBic')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerBic')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <VField
      name="buyerIban"
      :label="$t('buyerIban')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerIban"
    >
      <OField
        :label="$t('buyerIban')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerIban')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <OField>
      <OButton
        native-type="submit"
      >{{ $t('getPaymentDetails') }}</OButton>
    </OField>
  </VForm>
</template>