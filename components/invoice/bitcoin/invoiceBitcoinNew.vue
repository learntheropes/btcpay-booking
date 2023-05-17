<script setup>
import QRCode from 'qrcode';
import find from 'lodash.find';
import findIndex from 'lodash.findindex';

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

// Get and set the initial payment method shown with default to 0
const defaultPaymentMethod = invoice.checkout.defaultPaymentMethod;
const selectedMethodIndex = ref((findIndex(methods, { paymentMethod: defaultPaymentMethod }) === -1) ? 0 : findIndex(methods, { paymentMethod: defaultPaymentMethod }));

// Filter allowed payment methods based on btcpay response
const allowedMethods = paymentMethods.map(el => find(methods, { paymentMethod: el.paymentMethod }));

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
const initialQrCode = await generateQrCode(paymentMethods[selectedMethodIndex.value].destination);
let qrCode = ref(initialQrCode);

// Watch for changes to pass to the qrcode
watch(async () => selectedMethodIndex.value, async () => {
  const newQrCode = await generateQrCode(paymentMethods[selectedMethodIndex.value].destination);
  qrCode.value = newQrCode;
});

// Functions to copy the address/invoice and the amount with notification
import { NotificationProgrammatic } from "@oruga-ui/oruga-next";

const copyDestination = () => {
  navigator.clipboard.writeText(paymentMethods[selectedMethodIndex.value].destination);
  NotificationProgrammatic.open('Address copied');
};

// Copy btc or sat amount based on the payment method selected
const copyAmount = () => {
  navigator.clipboard.writeText((selectedMethodIndex.value === 0) ? paymentMethods[selectedMethodIndex.value].due : paymentMethods[selectedMethodIndex.value].due * 100000000);
  NotificationProgrammatic.open('Amount copied');
};
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
            <div class="column os-narrow has-text-warning">
              <div>{{ $t('totalPrice') }}</div>
              <div>{{ $t('totalFiat') }}</div>
              <div>{{ $t('exchangeRate') }}</div>
              <div>{{ $t('amountDue') }}</div>
              <div v-if="selectedMethodIndex === 0">{{ $t('recommendedFee') }}</div>
            </div>
            <div class="column">
              <div class="has-text-right">{{ (selectedMethodIndex === 0) ? Number.parseFloat(paymentMethods[selectedMethodIndex].amount).toFixed(8) : Number.parseFloat(paymentMethods[selectedMethodIndex].amount * 100000000).toFixed(0) }} {{ ((selectedMethodIndex === 0)) ? paymentMethods[selectedMethodIndex].cryptoCode : 'SATS' }}</div>
              <div class="has-text-right">{{ Number.parseFloat(invoice.amount).toFixed(2) }} {{ invoice.currency }}</div>
              <div class="has-text-right">{{ Number.parseFloat(paymentMethods[selectedMethodIndex].rate).toFixed(2) }} {{ paymentMethods[selectedMethodIndex].cryptoCode }}/{{ invoice.currency }}</div>
              <div class="has-text-right">{{ (selectedMethodIndex === 0) ? Number.parseFloat(paymentMethods[selectedMethodIndex].due).toFixed(8) : Number.parseFloat(paymentMethods[selectedMethodIndex].due * 100000000).toFixed(0) }} {{ ((selectedMethodIndex === 0)) ? paymentMethods[selectedMethodIndex].cryptoCode : 'SATS' }}</div>
              <div v-if="selectedMethodIndex === 0" class="has-text-right">{{ paymentMethods[selectedMethodIndex].networkFee }} sat/byte</div>
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
      <IconWithText
        icon="content-copy"
        iconSide="right"
        iconSize="16"
        :text="$t(allowedMethods[selectedMethodIndex].destination)"
        textClass="has-text-weight-semibold"
        @click.native="copyDestination"
      />
      <div>
        <p class="scrollable">{{ paymentMethods[selectedMethodIndex].destination }}</p>
      </div>
      <IconWithText
        icon="content-copy"
        iconSide="right"
        iconSize="16"
        :text="$t('amount')"
        textClass="has-text-weight-semibold"
        @click.native="copyAmount"
      />
      <div>
        <p class="scrollable">{{ (selectedMethodIndex === 0) ? paymentMethods[selectedMethodIndex].due : paymentMethods[selectedMethodIndex].due * 100000000 }}</p>
      </div>
    </div>
    <footer class="card-footer">
      <NuxtLink :to="paymentMethods[selectedMethodIndex].paymentLink" class="card-footer-item">{{ $t('payInWallet') }}</NuxtLink>
    </footer>
  </div>
</template>
  
<style scoped>
.scrollable {
  width: 350px;
  overflow-x: auto; 
  -ms-overflow-style: none;  /* Hide scrollbar IE and Edge */
  scrollbar-width: none;  /* Hide scrollbar Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollable::-webkit-scrollbar {
  display: none;
}
</style>

<style>
.ltr-is-48by48 svg {
  min-height: 48px;
  min-width: 48px;
}
</style>
