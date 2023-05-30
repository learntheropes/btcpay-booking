<script setup>
import QRCode from 'qrcode';
import find from 'lodash.find';
import findIndex from 'lodash.findindex';
import { NotificationProgrammatic } from "@oruga-ui/oruga-next";
import { computed } from '@vue/reactivity';
import { $fetch } from 'ofetch';

// Get invoice props
const {
  invoice,
  paymentMethods,
  expiresIn,
  expiresInString,
  initialExpiresIn
} = defineProps({
  invoice: {
    type: Object,
    required: true
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

// Add missing info for on chain and lighning network
const methods = [
  {
    paymentMethod: 'BTC',
    name: 'bitcoin',
    destination: 'address'
  },
  {
    paymentMethod: 'BTC-LightningNetwork',
    name: 'lightning',
    destination: 'invoice'
  }
];

const paymentMethodsCleaned = paymentMethods.filter(el => find(methods, { paymentMethod: el.paymentMethod }));

// Get and set the initial payment method shown with default to 0
const defaultPaymentMethod = invoice.checkout.defaultPaymentMethod;
const selectedMethodIndex = ref((findIndex(methods, { paymentMethod: defaultPaymentMethod }) === -1) ? 0 : findIndex(methods, { paymentMethod: defaultPaymentMethod }));

// Filter allowed payment methods based on btcpay response
const allowedMethods = paymentMethodsCleaned.map(el => find(methods, { paymentMethod: el.paymentMethod }));

// Set the detail as initially visible
const isDetailsOpen = ref(true);

// Swith from on chain to lightning and vice versa
const setMethodIndex = (index) => {
  selectedMethodIndex.value = index
};

// Function to generate the qrcode from a string
const generateQrCode = async (text) => {
  return await QRCode.toDataURL(text);
};

// Set the initial qrcode
const initialQrCode = await generateQrCode(paymentMethodsCleaned[selectedMethodIndex.value].destination);
let qrCode = ref(initialQrCode);

// Watch for changes to pass to the qrcode
watch(async () => selectedMethodIndex.value, async () => {
  const newQrCode = await generateQrCode(paymentMethodsCleaned[selectedMethodIndex.value].destination);
  qrCode.value = newQrCode;
});

// Get the function for translations
const { t } = useI18n();

// Functions to copy the address/invoice with notification
const copyDestination = () => {
  navigator.clipboard.writeText(paymentMethodsCleaned[selectedMethodIndex.value].destination);
  NotificationProgrammatic.open(t('destinationCopied'));
};

// Render and copy btc or sat amount based on the payment method selected
const renderAmount = computed(() => (selectedMethodIndex.value === 0) ? paymentMethodsCleaned[selectedMethodIndex.value].due : parseInt(Number(paymentMethodsCleaned[selectedMethodIndex.value].due) * 100000000));

const copyAmount = () => {
  navigator.clipboard.writeText((selectedMethodIndex.value === 0) ? paymentMethodsCleaned[selectedMethodIndex.value].due : parseInt(Number(paymentMethodsCleaned[selectedMethodIndex.value].due) * 100000000));
  NotificationProgrammatic.open(t('amountCopied'));
};

// Get needed functions from plugins
const {
  // function to emit loading event
  $event
} = useNuxtApp();
// set the initial status of the invoiceBitcoin component to false
// After that the invoice has been refreshed by the invoiceBitcoinExpired component
$event('invoiceBitcoinIsLoading', false);

const { fastestFee: suggestedFee } = await $fetch('https://mempool.space/api/v1/fees/recommended')
</script>

<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-justify-content-center">
        <span>{{ $t('invoiceNew') }}</span>
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
                  :text="$t('viewDetails')"
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
                  :text="$t('hideDetails')"
                  textVariant="primary"
                  iconVariant="primary"
                  iconSide="right"
                />  
              </OButton>
            </div>
          </template>
          <div class="columns is-mobile">
            <div class="column is-narrow has-text-warning">
              <div>{{ $t('totalPrice') }}</div>
              <div>{{ $t('totalFiat') }}</div>
              <div>{{ $t('exchangeRate') }}</div>
              <div>{{ $t('amountDue') }}</div>
              <div v-if="selectedMethodIndex === 0">{{ $t('recommendedFee') }}</div>
            </div>
            <div class="column">
              <div class="has-text-right">{{ (selectedMethodIndex === 0) ? Number.parseFloat(paymentMethodsCleaned[selectedMethodIndex].amount).toFixed(8) : Number.parseFloat(paymentMethodsCleaned[selectedMethodIndex].amount * 100000000).toFixed(0) }} {{ ((selectedMethodIndex === 0)) ? paymentMethodsCleaned[selectedMethodIndex].cryptoCode : 'SATS' }}</div>
              <div class="has-text-right">{{ Number.parseFloat(invoice.amount).toFixed(2) }} {{ invoice.currency }}</div>
              <div class="has-text-right">{{ Number.parseFloat(paymentMethodsCleaned[selectedMethodIndex].rate).toFixed(2) }} {{ paymentMethodsCleaned[selectedMethodIndex].cryptoCode }}/{{ invoice.currency }}</div>
              <div class="has-text-right">{{ (selectedMethodIndex === 0) ? Number.parseFloat(paymentMethodsCleaned[selectedMethodIndex].due).toFixed(8) : Number.parseFloat(paymentMethodsCleaned[selectedMethodIndex].due * 100000000).toFixed(0) }} {{ ((selectedMethodIndex === 0)) ? paymentMethodsCleaned[selectedMethodIndex].cryptoCode : 'SATS' }}</div>
              <div v-if="selectedMethodIndex === 0" class="has-text-right">{{ suggestedFee }} sat/vB</div>
            </div>
          </div>
        </OCollapse>
      </div>
      <div class="block has-text-centered">
        <div class="field">
          <label class="label">{{ $t('payWith') }}</label>
          <div class="control">
            <div class="buttons is-centered">
              <OButton
                v-for="method,index in allowedMethods"
                :key="method.name"
                variant="primary"
                :outlined="selectedMethodIndex !== index"
                @click.native="setMethodIndex(index)"
              >{{ $t(method.name) }}</OButton>
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
              <NuxtIcon :name="allowedMethods[selectedMethodIndex].name" class="ltr-is-48by48" filled />
            </figure>
          </div>
        </div>
      </div>
    </div>
    <div class="card-content">
      <OField :label="$t(allowedMethods[selectedMethodIndex].destination)">
        <OInput
          v-model="paymentMethodsCleaned[selectedMethodIndex].destination"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copyDestination"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('amount')">
        <OInput
          v-model="renderAmount"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copyAmount"
          size="small"
          readonly
        />
      </OField>
    </div>
    <footer class="card-footer">
      <NuxtLink :to="paymentMethodsCleaned[selectedMethodIndex].paymentLink" class="card-footer-item">{{ $t('payInWallet') }}</NuxtLink>
    </footer>
  </div>
</template>

<style>
.ltr-is-48by48 svg {
  min-height: 48px;
  min-width: 48px;
}
</style>
