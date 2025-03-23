<script setup>
import QRCode from 'qrcode';
import findIndex from 'lodash.findindex';
import { NotificationProgrammatic } from "@oruga-ui/oruga-next";

// Get invoice props
const {
  invoice,
  defaultPaymentMethod,
  paymentMethods,
  expiresIn,
  expiresInString,
  initialExpiresIn
} = defineProps({
  invoice: {
    type: Object,
    required: true
  },
  defaultPaymentMethod: {
    type: String
  },
  paymentMethods: {
    type: Array,
    required: true
  },
  expiresIn: {
    type: Number,
    required: true
  },
  expiresInString: {
    type: String,
    required: true
  },
  initialExpiresIn: {
    type: Number,
    required: true
  }
});

// Set the detail as initially visible
const isDetailsOpen = ref(false);

// Remove lnurl because it has no destination
const filteredPaymentMethods = paymentMethods.filter(method => method.paymentMethodId !== "BTC-LNURL");

// Set the payment method. with default get from the store settings or the first one in the array if not found
const selectedPaymentMethodIndex = ref((findIndex(filteredPaymentMethods, { paymentMethodId: defaultPaymentMethod }) === -1) ? 0 : findIndex(filteredPaymentMethods, { paymentMethodId: defaultPaymentMethod }));

const setPaymentMethodIndex = (index) => {
  selectedPaymentMethodIndex.value = index
};

// const selectedPaymentMethod = ref(((findIndex(filteredPaymentMethods, { paymentMethodId: defaultPaymentMethod }) === -1) ? filteredPaymentMethods[0].paymentMethodId : filteredPaymentMethods[selectedPaymentMethodIndex.value].paymentMethodId));
// const setPaymentMethod = (paymentMethodId) => {
//   selectedPaymentMethodIndex.value = paymentMethodId;
// };

// Function to generate the qrcode from a string
const generateQrCode = async (text) => {
  return await QRCode.toDataURL(text);
};

// Set the initial qrcode
const initialQrCode = await generateQrCode(filteredPaymentMethods[selectedPaymentMethodIndex.value].destination);
let qrCode = ref(initialQrCode);

// Watch for changes to pass to the qrcode
watch(async () => selectedPaymentMethodIndex.value, async () => {
  const newQrCode = await generateQrCode(filteredPaymentMethods[selectedPaymentMethodIndex.value].destination);
  qrCode.value = newQrCode;
});

// Get the function for translations
const { t } = useI18n();

// Functions to copy the address/invoice with notification
const copyDestination = () => {
  navigator.clipboard.writeText(filteredPaymentMethods[selectedPaymentMethodIndex.value].destination);
  NotificationProgrammatic.open(t('invoiceBitcoinNew.destinationCopied'));
};

// Render and copy amount based on the payment method selected
const renderAmount = filteredPaymentMethods[selectedPaymentMethodIndex.value].due;

const copyAmount = () => {
  navigator.clipboard.writeText(filteredPaymentMethods[selectedPaymentMethodIndex.value].due);
  NotificationProgrammatic.open(t('invoiceBitcoinNew.amountCopied'));
};

// Get needed functions from plugins
const {
  // function to emit loading event
  $event
} = useNuxtApp();
// set the initial status of the invoiceBitcoin component to false
// After that the invoice has been refreshed by the invoiceBitcoinExpired component
$event('invoiceBitcoinIsLoading', false);

const { data } = await useFetch(`https://mempool.space/api/v1/fees/recommended`);
const suggestedFee = data.value.fastestFee
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-justify-content-center">
        <span>{{ $t('invoiceBitcoinNew.invoiceNew') }}</span>
      </div>
    </header>
    <div class="card-content">
      <div class="block has-text-centered">
        {{ expiresInString }}
        <progress class="progress is-primary is-small" :value="expiresIn" :max="initialExpiresIn">{{expiresIn/initialExpiresIn*100 }}%</progress>
      </div>
      <div class="block">
        <OCollapse
          position="bottom"
          v-model:open="isDetailsOpen"
        >
          <template #trigger>
            <div
              class="has-text-centered"
            >
              <OButton
                v-if="isDetailsOpen === false"
                variant="primary"
                inverted
              >
                <IconWithText
                  icon="chevron-down"
                  :text="$t('invoiceBitcoinNew.viewDetails')"
                  textVariant="primary"
                  iconVariant="primary"
                  iconSide="right"
                />
              </OButton>
              <OButton
                v-else
                variant="primary"
                inverted
              >
                <IconWithText
                  icon="chevron-up"
                  :text="$t('invoiceBitcoinNew.hideDetails')"
                  textVariant="primary"
                  iconVariant="primary"
                  iconSide="right"
                />  
              </OButton>
            </div>
          </template>
          <div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.totalPrice') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ filteredPaymentMethods[selectedPaymentMethodIndex].amount }} {{ filteredPaymentMethods[selectedPaymentMethodIndex].currency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.totalFiat') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ parseFloat(invoice.metadata.buyerFiatPrice).toFixed(invoice.metadata.bookingFiatDecimal) }} {{ invoice.metadata.bookingFiatCurrency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.exchangeRate') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(filteredPaymentMethods[selectedPaymentMethodIndex].rate).toFixed(2) }} {{ filteredPaymentMethods[selectedPaymentMethodIndex].currency }}/{{ invoice.metadata.bookingFiatCurrency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.amountDue') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ Number.parseFloat(filteredPaymentMethods[selectedPaymentMethodIndex].due).toFixed(8) }} {{ filteredPaymentMethods[selectedPaymentMethodIndex].currency }}</div>
              </div>
            </div>
            <div v-if="selectedPaymentMethodIndex === 0" class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('invoiceBitcoinNew.recommendedFee') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ suggestedFee }} sat/vB</div>
              </div>
            </div>
          </div>
        </OCollapse>
      </div>
      <div class="block has-text-centered">
        <div class="field">
          <label class="label">{{ $t('invoiceBitcoinNew.payWith') }}</label>
          <div class="control">
            <div class="buttons is-centered">
              <OButton
                v-for="method,index in filteredPaymentMethods"
                :key="index"
                variant="primary"
                :outlined="selectedPaymentMethodIndex !== index"
                @click.native="setPaymentMethodIndex(index)"
              >{{ $t(`invoiceBitcoinNew.${method.paymentMethodId}`) }}</OButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-image">
      <div class="columns is-centered is-mobile">
        <div class="column">
          <figure class="image is-366by366">
            <img :src="qrCode" height="366" width="366" />
          </figure>
          <div class="is-overlay ltr-is-center-center">
            <figure class="image is-48by48 ltr-is-48by48">
              <NuxtIcon :name="filteredPaymentMethods[selectedPaymentMethodIndex].paymentMethodId" class="ltr-is-48by48" filled />
            </figure>
          </div>
        </div>
      </div>
    </div>
    <div class="card-content">
      <OField :label="$t(`invoiceBitcoinNew.destination`)">
        <OInput
          v-model="filteredPaymentMethods[selectedPaymentMethodIndex].destination"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copyDestination"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('invoiceBitcoinNew.amount')">
        <OInput
          v-model="filteredPaymentMethods[selectedPaymentMethodIndex].due"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copyAmount"
          size="small"
          readonly
        />
      </OField>
    </div>
    <footer class="card-footer">
      <NuxtLink :to="filteredPaymentMethods[selectedPaymentMethodIndex].paymentLink" class="card-footer-item">{{ $t('invoiceBitcoinNew.payInWallet') }}</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.level {
  margin-bottom: 0rem
}
</style>

<style>
.ltr-is-48by48 svg {
  min-height: 48px;
  min-width: 48px;
}
</style>
