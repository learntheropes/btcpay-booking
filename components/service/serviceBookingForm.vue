<script setup>
import { ref, watch } from 'vue';

// Get props from [service].vue page
const {
  locale,
  service,
} = defineProps({
  locale: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  }
});

// Get the service specific settings from md file
const  {
  duration,
  currency,
  price,
  extras
} = await queryContent(`/services/${service}`).locale(locale).findOne();

// Get needed functions from plugins
const {
  // Ugly functions to disable instead of hide the datepicker navigation
  // On mount
  $disableDatapickerNavigationOnMount,
  // And on update
  $updateDatapickerNavigation,
  // Function to get the Datepicker field settings
  $getDatepicker,
  // Function to restive the daily free spots
  $getFreeSlots,
  // Function the get the invoice from btcpay
  $createInvoice,
  // Function to listen event
  $listen
} = useNuxtApp();

// Dirty hack to show and disable previous icon in datepicker
// if there isn't a previous month available and enable it again
$disableDatapickerNavigationOnMount();
let datepickerCurrentMonth = new Date().getMonth();
const onChangeMonth = (month) => {
  datepickerCurrentMonth = month
  $updateDatapickerNavigation('booking', datepickerCurrentMonth, datepickerCurrentYear)
};
let datepickerCurrentYear = new Date().getFullYear();
const onChangeYear = (year) => {
  datepickerCurrentYear = year
  $updateDatapickerNavigation('booking', datepickerCurrentMonth, datepickerCurrentYear)
};

// Get merchant fields settings
const {
  fields: {
    name,
    email,
    pgp,
    details
  }
} = await queryContent(`/settings`).findOne();

// Define the form reactive properties
const initialForm = {
  buyerDate: '',
  buyerTime: [],
  buyerExtras: [],
  buyerName: '',
  buyerEmail: '',
  buyerFingerprint: '',
  buyerPGP: '',
  buyerDetails: '',
  buyerService: service,
  buyerGateway: null
}
const form = ref(initialForm);

// Define the form validation
const validationSchema = {
  buyerDate: {
    required: true,
  },
  buyerTime: {
    required: true,
    arrayLengthBetween: {
      min: 1,
      max: 3
    }
  },
  buyerName: (name) ? {
    required: name === 'required'
  } : null,
  buyerEmail: (email) ? {
    required: email === 'required',
    email: email === 'required'
  } : null,
  buyerFingerprint: (pgp) ? {
    required: pgp === 'required',
    // This setting goes together with return true in the custom rule if there is no value provided
    // If one is provided, I want to make sure that is correct.
    checkPGPKey: `@buyerEmail`,
  }: null,
  buyerDetails: (details) ? {
    required: details === 'required',
  } : null
};

// Listen for the pgp key emited by the custom validation finction
// This is to avoid calling the server twice, for validation and storing
$listen('setPGP', (pgp) => form.value.buyerPGP = pgp);

// Get the calendar settings object
const {
  showWeekNumber,
  firstDayOfWeek,
  unselectableDaysOfWeek,
  minDate,
  modelValue
} = await $getDatepicker();

// Watch the change on buyer date
// Clear buyer time and update free slots
let freeSlots = ref([])
watch(async () => form.value.buyerDate, async () => {

  form.value.buyerTime = []

  freeSlots.value = await $getFreeSlots({
    form,
    service,
    duration
  })
});

const amount = computed(() => {
  return (form.value.buyerTime.length * price) + form.value.buyerExtras.reduce((sum, extra) => sum + extra.price, 0);
});

// Listen to setGateway emitted changes
$listen('setGateway', async (gateway) => {
  form.value.buyerGateway = gateway
  await $createInvoice(form.value)
});

</script>

<template>
  <!-- working examples oforuga with vee-validate:
  https://github.com/logaretm/vee-validate/issues/3575
  https://codesandbox.io/s/itp29?file=/src/App.vue -->
  <VForm
    name="booking"
    :validation-schema="validationSchema"
    @submit="$createInvoice(form)"
  >
    <VField
      name="buyerDate"
      :label="$t('buyerDate')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerDate"
    >
      <OField
      :label="$t('buyerDate')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <ODatepicker
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
          @change-month="onChangeMonth"
          @change-year="onChangeYear"
          :locale="locale"
          :showWeekNumber="showWeekNumber"
          :firstDayOfWeek="firstDayOfWeek"
          :unselectableDaysOfWeek="unselectableDaysOfWeek"
          :minDate="minDate"
          :modelValue="modelValue"
          inline
        />
      </OField>
    </VField>

    <VField
      name="buyerTime"
      :label="$t('buyerTime')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerTime"
    >
      <OField
        :label="$t('buyerTime')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OSelect
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
          :native-size="freeSlots.length || 1"
          multiple
          expanded
        >
          <option
            v-if="!form.buyerDate"
            disabled
          >
            {{ $t('selectDateFirst') }}
          </option>
          <option
            v-for="freeSlot of freeSlots"
            :key="freeSlot.value"
            :value="freeSlot.value"
          >{{ $t('from') }} {{ freeSlot.display.from }} {{ $t('to') }} {{ freeSlot.display.to }}</option>
        </OSelect>
      </OField>
    </VField>

    <VField
      v-if="extras && extras.length"
      name="buyerExtras"
      :label="$t('buyerExtras')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerExtras"
    >
      <OField
        :label="$t('buyerExtras')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OSelect
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
          :native-size="extras.length"
          multiple
          expanded
        >
          <option
            v-for="extra of extras"
            :key="extra.title"
            :value="extra"
          >{{ extra.title }}</option>
        </OSelect>
      </OField>
    </VField>

    <VField
      name="buyerName"
      :label="$t('buyerName')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerName"
    >
      <OField
        v-if="name"
        :label="$t('buyerName')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerName')"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <VField
      name="buyerEmail"
      :label="$t('buyerEmail')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerEmail"
    >
      <OField
        v-if="email"
        :label="$t('buyerEmail')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerEmail')"
          type="email"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
        />
      </OField>
    </VField>

    <!-- 5BA78A510CDA44132BDC51FA58C798100FF8A743 -->
    <VField
      name="buyerFingerprint"
      :label="$t('buyerFingerprint')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerFingerprint"
    >
      <OField
        v-if="pgp"
        :label="$t('buyerFingerprint')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : $t('fingerprintOnServer')"
      >
        <!-- https://github.com/logaretm/vee-validate/issues/3575#issuecomment-1516900983 -->
        <OInput
          :label="$t('buyerFingerprint')"
          :model-value="value"
          @change="handleChange"
          @blur="handleBlur"
          expanded
        />
      </OField>
    </VField>

    <VField
      name="buyerDetails"
      :label="$t('buyerDetails')"
      v-slot="{ handleChange, handleBlur, value, errors }"
      v-model="form.buyerDetails"
    >
      <OField
        v-if="details"
        :label="$t('buyerDetails')"
        :variant="errors[0] ? 'danger' : null"
        :message="errors[0] ? errors[0] : ''"
      >
        <OInput
          :label="$t('buyerDetails')"
          type="textarea"
          :model-value="value"
          @update:modelValue="handleChange"
          @change="handleChange"
          @blur="handleBlur"
          expanded
          :maxlength="250"
          :hasCounter="true"
        />
      </OField>
    </VField>

    <OField>
      <InvoiceSelector
        :amount="amount"
        :currency="currency"
      />
    </OField>
  </VForm>
</template>

<style>
/* Make the pagination bottons visible also when disabled
and keep their initial size */
.pagination-previous {
  display: block !important;
  flex-grow: initial;
 }
.pagination-next {
  display: block !important;
  flex-grow: initial;
}
/* Remove the scrolbar on multiselect if not needed */
select {
  overflow-y: auto;
}
/* Make the fields message multiline to avoid form to expand */
.help {
  white-space: pre-wrap;
}
</style>
