<script setup>
import countryToCurrency from 'country-to-currency';
import kebabCase from 'lodash.kebabcase';

// Get props from [service].vue page
const {
  service,
  disabled
} = defineProps({
  service: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
  }
});

const proxy = 'https://corsproxy.io/?';

// Get the buyer leanguage
const { locale } = useI18n();

// Get the service specific settings from md file
const  {
  duration,
  currency,
  price,
  extras
} = await queryContent(`/services/${service}`).locale(locale.value).findOne();

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
  $listen,
  // Function to capitalize strings
  $capitalize
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

// Get the buyer currency based on the IP location
const { data: countryData } = await useFetch('https://api.country.is/');
const buyerCountry = (countryData.value) ? countryData.value.country : null;
const buyerCurrency = countryToCurrency[buyerCountry];

// Define the decimal length based on the currency
const decimal = $getDecimal(currency);

// Get available fiat methods for the buyer currency
const { 
  data: paymentMethodsData, 
  refresh: paymentMethodsRefresh 
} = await useFetch(`${proxy}https://api.peachbitcoin.com/v1/info`, {
  // server: false,
  // immediate: false,
  lazy: true
});
await paymentMethodsRefresh();
const peachPaymentMethods = (paymentMethodsData.value) ? paymentMethodsData.value.paymentMethods : [];
const buyerPaymentMethods = ref(peachPaymentMethods
  .filter(method => method.currencies.includes(buyerCurrency) && !method.anonymous)
  .map(method => {
    return {
      id: method.id,
      name: $capitalize(kebabCase(method.id).replace('-', ' ')).replace('-', '%')
    }
  }));


// Get all the currencies available on peach
const { 
  data: peachAvailableCurrenciesData,
  refresh: peachAvailableCurrenciesRefresh
} = await useFetch(`${proxy}https://api.peachbitcoin.com/v1/market/prices`, {
  lazy: true
});
await peachAvailableCurrenciesRefresh();
const peachAvailableCurrencies = Object.keys(peachAvailableCurrenciesData.value || []).filter(currency => currency !== 'SAT' && currency !== 'USDT').sort()

// Get Yadio exchange rates
const { 
  data: { 
    value: { 
      BTC: yadioRate 
    }
  }, 
  refresh: yadioRateRefesh 
} = await useFetch(`https://api.yadio.io/exrates/${currency}`, {
  lazy: true
});
await yadioRateRefesh();

// Get Peach exchange rate
const { 
  data: peachRateData,
  refresh: peachRateRefresh
} = await useFetch(`${proxy}https://api.peachbitcoin.com/v1/market/price/BTC${currency}`, {
  lazy: true
});
await peachRateRefresh()
const peachRate = (peachRateData.value) ? peachRateData.value.price : null;

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
  buyerGateway: {},
  buyerFiatCurrency: buyerCurrency,
  buyerFiatRate: peachRate,
  buyerFiatDecimal: decimal
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
} = await $getDatepicker(disabled);

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

// Update the listed payment methods if the buyer changes the currency
watch(async () => form.value.buyerFiatCurrency, async () => {

  const { data: paymentMethodsData } = await useFetch(`${proxy}https://api.peachbitcoin.com/v1/info`);
  const peachPaymentMethods = (paymentMethodsData.value) ? paymentMethodsData.value.paymentMethods : [];
  buyerPaymentMethods.value = peachPaymentMethods
  .filter(method => method.currencies.includes(form.value.buyerFiatCurrency) && !method.anonymous)
  .map(method => {
    return {
      id: method.id,
      name: $capitalize(kebabCase(method.id).replace('-', ' ')).split('-')[0]
    }
  });
  const { data: peachRateData } = await useFetch(`${proxy}https://api.peachbitcoin.com/v1/market/price/BTC${form.value.buyerFiatCurrency}`);
  form.value.buyerFiatRate = peachRateData.value.price;
  form.value.buyerFiatDecimal = $getDecimal(form.value.buyerFiatCurrency)
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

// Filter merchant enabled gateways
const {
  gateways,
  premium
} = await queryContent(`/settings`).findOne();

// Set the choosen gateway at the same moment the form is submitted
const setGateway = (gatewayType, gatewayMethod, gatewayCurrency) => {
  form.value.buyerGateway = {
    gatewayType,
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
            :label="$t('buyerDate')"
            :aria-label="$t('buyerDate')"
            :model-value="value"
            @update:modelValue="handleChange"
            @change="handleChange"
            @blur="handleBlur"
            @change-month="onChangeMonth"
            @change-year="onChangeYear"
            :locale="locale.value"
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
            :label="$t('buyerTime')"
            :aria-label="$t('buyerTime')"
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
            :label="$t('buyerExtras')"
            :aria-label="$t('buyerExtras')"
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
            :aria-label="$t('buyerName')"
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
            :aria-label="$t('buyerEmail')"
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
            :aria-label="$t('buyerFingerprint')"
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
            :aria-label="$t('buyerDetails')"
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

      <p class="help">{{ $t('getDiscount', { premium: premium + 2 }) }}</p>

      <OField>
        <OButton
          variant="primary"
          @click.native="setGateway('bitcoin', 'bitcoin', 'BTC')"
          native-type="submit"
          icon-right="sale"
          expanded
        >{{ `${$t('payWith')} bitcoin ${(amount / yadioRate).toFixed(8)} BTC` }}</OButton>
      </OField>

      <p class="help">{{ $t('approximatePrice') }}</p>

      <OField
        grouped 
        group-multiline
      >
        <OButton
          v-if="gateways.fiat && buyerPaymentMethods.length"
          v-for="paymentMethod in buyerPaymentMethods"
          :key="paymentMethod.id"
          variant="primary"
          outlined
          @click="setGateway('fiat', paymentMethod.id, buyerCurrency)"
          native-type="submit"
          expanded
        >{{ `${$t('payWith')} ${paymentMethod.name} ${(amount / yadioRate * form.buyerFiatRate * (((premium + 2)/ 100) + 1)).toFixed(form.buyerFiatDecimal)} ${form.buyerFiatCurrency}` }}</OButton>
        <div v-else>{{ $t('fiatNotAvailable') }}</div>
      </OField>

      <VField
        v-if="peachAvailableCurrencies.length"
        name="changeCurrency"
        :label="$t('changeCurrency')"
        v-slot="{ handleChange, handleBlur, value }"
        v-model="form.buyerFiatCurrency"
      >
        <OField
          :label="$t('changeCurrency')"
          class="change"
        >
          <OSelect
            :label="$t('changeCurrency')"
            :aria-label="$t('changeCurrency')"
            :model-value="value"
            @update:modelValue="handleChange"
            @change="handleChange"
            @blur="handleBlur"
            expanded
          >
            <option
              v-for="currency of peachAvailableCurrencies"
              :key="currency"
              :value="currency"
            >{{ currency }}</option>
          </OSelect>
        </OField>
      </VField>
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
.field.is-grouped > :not(:last-child) {
  margin-right: 0px;
}
.change {
    padding-top: 0.5em;
}
</style>
