<script setup>
import flatten from 'lodash.flatten'
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
  // getDecimal function from currency
  $getDecimal,
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
  buyerGateway: {}
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

// Handle is loading free slots
const isLoadingFreeSlots = ref(false);

$listen('setIsLoadingFreeSlots', (bool) => {
  isLoadingFreeSlots.value = bool;
});

// Reset times selections
const clearTime = () => {
  form.value.buyerTime = [];
};

// Reset extras selections
const clearExtras = () => {
  form.value.buyerExtras  = [];
};

// Define the supported gateways
const supportedGateways = {
  bitcoin: [
    {
      gatewayName: 'bitcoin',
      gatewayMethod: 'bitcoin',
      gatewayCurrency: 'BTC'
    }
  ],
  fiat: [
    {
      gatewayName: 'fiat',
      gatewayMethod: 'SEPA',
      gatewayCurrency: 'EUR'
    },
    {
      gatewayName: 'fiat',
      gatewayMethod: 'SEPA',
      gatewayCurrency: 'CHF'
    },
  ],
  crypto: [
    {
      gatewayName: 'crypto',
      gatewayMethod: 'crypto',
      gatewayCurrency: 'USDT'        
    }
  ],
};

// Filter merchant enabled gateways
const {
  gateways,
} = await queryContent(`/settings`).findOne();

const enabledGateways = flatten(Object.keys(gateways).filter(gateway => gateways[gateway]).map(gateway => supportedGateways[gateway]));

// Define the decimal length based on the currency
const decimal = $getDecimal(currency);

// Set the choosen gateway at the same moment the form is submitted
const setGateway = (gatewayName, gatewayMethod, gatewayCurrency) => {
  form.value.buyerGateway = {
    gatewayName,
    gatewayMethod,
    gatewayCurrency
  };
}

const isLoadingPage = ref(false);

const createInvoice = async () => {
  // Handle page load on form submit
  isLoadingPage.value = true
  // Create the invoice
  await $createInvoice(form.value);
};

</script>

<template>
  <div>
    <OLoading
      :full-page="true"
      v-model:active="isLoadingPage"
      :can-cancel="false"
    >
      <OIcon
        pack="mdi"
        icon="loading"
        size="large"
        spin
      />
    </OLoading>
    <!-- working examples ooruga with vee-validate:
    https://github.com/logaretm/vee-validate/issues/3575
    https://codesandbox.io/s/itp29?file=/src/App.vue -->
    <VForm
      name="booking"
      :validation-schema="validationSchema"
      @submit="createInvoice"
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
          <OLoading
            :full-page="false"
            v-model:active="isLoadingFreeSlots"
            :can-cancel="false"
          >
            <OIcon pack="mdi" icon="loading" size="large" spin class="is-hidden-mobile" />
            <OIcon pack="mdi" icon="loading" size="small" spin class="is-hidden-tablet" />
          </OLoading>
          <OSelect
            :model-value="value"
            @update:modelValue="handleChange"
            @change="handleChange"
            @blur="handleBlur"
            :native-size="freeSlots.length || 3"
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
        <p
          v-if="form.buyerTime.length"
          @click.native="clearTime"
          class="help is-primary"
        >
          <OIcon pack="mdi" icon="close" size="small" />
          {{ $t('clearSelection') }}
        </p>
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
        <p
          v-if="form.buyerExtras.length"
          @click.native="clearExtras"
          class="help is-primary"
        >
          <OIcon pack="mdi" icon="close" size="small" />
          {{ $t('clearSelection') }}
        </p>
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

      <OField
        grouped 
        group-multiline
      >
        <OButton
          v-for="({ gatewayName, gatewayMethod, gatewayCurrency }, index) in enabledGateways"
          :key="index"
          variant="primary"
          :outlined="gatewayName !== 'bitcoin'"
          @click="setGateway(gatewayName, gatewayMethod, gatewayCurrency)"
          native-type="submit"
        >
        {{ `${$t('payWith')} ${gatewayMethod} ${(gatewayMethod === 'bitcoin') ? amount.toFixed(decimal) + ' ' + currency : $t('in') + ' ' + gatewayCurrency }` }}
        </OButton>
      </OField>
      <p class="help">{{ $t('surcharge', {
        gateways: Object.keys(gateways).filter((g) => gateways[g] && g !== 'bitcoin' ).join(` ${$t('and')} `)
      }) }}</p>
    </VForm>
  </div>
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

