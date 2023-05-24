<script setup>
  // Get invoice props
  const {
    invoiceId,
    invoice
  } = defineProps({
    invoiceId: {
      type: String,
      required: true
    },
    invoice: {
      type: Object,
      required: true
    }
  });
  // Define the form reactive properties and the initial empty fields
  const initialForm = {
    buyerLegalName: '',
    buyerLegalAddress: '',
    buyerLegalCity: '',
    buyerLegalZip: '',
    buyerBic: '',
    buyerIban: ''
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
      required: true
    },
    buyerIban: {
      required: true
    }
  };

  // Get the needed plugins
  const {
    $getCountriesList,
    $getSepaPaymentInfo
  } = useNuxtApp();

  const getSepaPaymentInfo = async values => {
    await $getSepaPaymentInfo(invoice, values)
  }

  // Get the transalted list of countries for the form select field
  const countries = $getCountriesList();
</script>

<template>
  <VForm
    name="sepa"
    :validation-schema="validationSchema"
    @submit.prevent="getSepaPaymentInfo"
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
      >{{ $t('pay') }}</OButton>
    </OField>
  </VForm>
</template>