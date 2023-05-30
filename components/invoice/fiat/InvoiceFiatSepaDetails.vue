<script setup>
import QRCode from 'qrcode';
import { NotificationProgrammatic } from "@oruga-ui/oruga-next";

// Get order details props
const {
  orderDetails,
} = defineProps({
  orderDetails: {
    type: Object,
    required: true
  }
});

const {
  input: {
    amount,
    currency
  },
  payment_details: {
    iban,
    recipient_name,
    recipient_postal_address,
    reference,
    swift_bic
  },
  timestamp_created
} = orderDetails;

const {
  $dayjs
} = useNuxtApp();

const timestampExpires = $dayjs(timestamp_created).add(1, 'hour');

// Set the detail as initially visible
const isDetailsOpen = ref(true);

// Set the qrcode
let qrCode = await QRCode.toDataURL(JSON.stringify({
  amount,
  currency,
  iban,
  bic: swift_bic,
  reference,
  recipient: recipient_name,
  address: recipient_postal_address
}));

// Get the function for translations
const { t } = useI18n();

// Function to copy the details values
const copy = (value) => {
  navigator.clipboard.writeText(value);
  NotificationProgrammatic.open(t('copied'));
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
          <div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('amount') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ amount }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('currency') }}</div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ currency }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('iban') }}</div>
              </div>
              <div class="level-right">
                <div class="level-item">{{ iban }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('bic') }}</div>
              </div>
              <div class="level-right">
                <div class="level-item">{{ swift_bic }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('reference') }}</div>
              </div>
              <div class="level-right">
                <div class="level-item">{{ reference }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('recipient') }}</div>
              </div>
              <div class="level-right">
                <div class="level-item">{{ recipient_name }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning">{{ $t('recipientAddress') }}</div>
              </div>
              <div class="level-right">
                <div class="level-item">{{ recipient_postal_address[0] }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning"></div>
              </div>
              <div class="level-right">
                <div class="level-item">{{ recipient_postal_address[1] }}</div>
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-warning"></div>
              </div>
              <div class="level-rigth">
                <div class="level-item">{{ recipient_postal_address[2] }}</div>
              </div>
            </div>
          </div>
        </OCollapse>
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
              <NuxtIcon name="sepa" class="ltr-is-48by48" filled />
            </figure>
          </div>
        </div>
      </div>
    </div>
    <div class="card-content">
      <OField :label="$t('amount')">
        <OInput
          v-model="amount"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(amount)"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('currency')">
        <OInput
          v-model="amount"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(currency)"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('iban')">
        <OInput
          v-model="iban"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(iban)"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('bic')">
        <OInput
          v-model="swift_bic"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(swift_bic)"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('reference')">
        <OInput
          v-model="reference"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(reference)"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('recipient')">
        <OInput
          v-model="recipient_name"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(recipient_name)"
          size="small"
          readonly
        />
      </OField>
      <OField :label="$t('recipientAddress')">
        <OInput
          v-model="recipient_postal_address[0]"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(recipient_postal_address[0])"
          size="small"
          readonly
          expanded
        />
      </OField>
      <OField>
        <OInput
          v-model="recipient_postal_address[1]"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(recipient_postal_address[1])"
          size="small"
          readonly
        />
      </OField>
      <OField>
        <OInput
          v-model="recipient_postal_address[2]"
          icon-right="content-copy"
          icon-right-clickable
          @icon-right-click="copy(recipient_postal_address[2])"
          size="small"
          readonly
        />
      </OField>
    </div>
  </div>
</template>

<style scoped>
.level {
  margin-bottom: 0rem
}
</style>