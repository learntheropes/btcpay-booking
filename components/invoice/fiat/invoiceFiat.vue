<script setup>
import kebabCase from 'lodash.kebabcase';
import nuxtStorage from 'nuxt-storage';

const sellerPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
/i08+cdA6R70ww==
=93+5
-----END PGP PUBLIC KEY BLOCK-----`
  
const sellerEncryptedMessage = `-----BEGIN PGP MESSAGE-----
Version: FlowCrypt Email Encryption 8.4.8
Comment: Seamlessly send and receive encrypted email

wV4Df+Vpaj0zOkYSAQdA4Xxr2WP7Ygl311kxX3qlK0T07kXWPawzHcqwskq1
7Bcwu1VKqpA4+/eHEcQHVCB8duxJgQI1w8fGABBHTBezVGRMgozrmxQdvGEs
3+ZXu8AVwcFMA57HSE6zlWY4AQ//eWh9YhMNT87308jGdIO6tB9CNRrRuqfA
O/YpFBPcwGBG5zU44Ei172sfDYOuDHmyItNeemhZFnF5gsYTzTjryMMhvnXU
m/MrLCj//kO5P03tMv8whTjaaQfA5LNU6xcyQVtMVhQZ6H7smw7VGYDQlnWu
wdAf4Fg4okq7E7JF1sHf5tNLJvLjcs1eP66lBU0EnpReNDY74MDOk2y7thAn
kLDRNTh8tZ7Us/z503yz2j78FN/DOJ0WsEXcoriXkvRxQJbSwOZFlW/YX2Zh
poyb4xlmPAMU0OcurPghOc5GBtW+4u/4FLq1y2hwnITFuwFZ1cXaObptIn+n
V3qzPvPFR1Xs18Jli9WGLCZhFr6gWC35llhrsjz8hfSQWvFPL4lr9y3JlALF
4NKcvhh3+nonUwBZX1NPiU8iAFvMWHJSikLN/ISxaOLvyQqFxuJlXgci7l6A
oyZ4Mh9bCvPwnErzMYAJcbCeFFE2FFM/dfUgg/t8ECHWPCBDwtcOFdbKfapQ
p6sxADN4qpOZUzSYMcoU18Cu45KRsrfd+2zaUilQjA1YoLHPWhCP6RXWmBVT
OOPxfCDKuz+LtuzOJag8AtThMqVhz0STiWZkKgbAJrti/qSZZ0OiirubfQ8x
CZs4iyXgcytY/mje1iDQMeDVKUnCMkF7UJSYF9sVk/D5YYpxsfLSwb0B1Dyp
coy8TDPNjVE3LOllFcyy4zORNLYHrIrRAoB5CL6MgShV/XkZ/hcf8vlAsxa/
+IziYe/VCN+2DKUnxry3HcgBE+vQsXuZRd3ufZITrkeq+S0Iyaju2kyXo6/z
W7Q1xYZ5Ay3ChEemdkApiH3YH//2r4UQ1uIgofV4FK1sTawQlvR1Y8iQ6oNR
7+J9xP38vB7Pm9iFycNIUYv8nzhFbTTtyexmczXE0Ie+h3eqTsbkBAiK++6H
81I+8IRkwSZKOvQ6uez2vzyQwZEx2iUBHoIfQRkuEN8vg6j08yg9sK5DfDeK
13YzI1olZkbEBgKvggxeTMUhiMID9A3QrcSx1ZTGHZDGYzpGGk55ASJYuoQC
LWzYKzbkJIP38ofJTGGRhezYE/uFoMEdkW7t0leQtmri39a7ef5Dex+Dvs+e
vh0fUfWO3DinUGJIWH5eLlGOLV648qYhl8jbh6IodwJCGQudzINZrNCueGKb
W7SyBcOxnC7mwMS0RRp2wttHtfGX4kqDuk4gAMquW9wsRfpmqpB/7RgOlfpW
VqS9vpGUj8VVa6QpnwVtMFQPCzx852wKavI9gxernWMB6VDldY1oO7hxU8Br
P3tima90w1EFrWjnGAdivAFAA52HzSrk+vu2gV61v16x++EgtwZkmW5IYcsx
ZcvXkfHZ/DjK8WO3TGAny0oNCIVZL1vu7JNHqTkNEXYuNF0g1jEHzzAsMls2
XN0cKid0GAJEGnB1KHOG9FDUiksspdB0aUIhiLHR3tcHfd8wvOq3w/CvuYoJ
U7UW5JcD/j+UQVhU1rNyWTDr3HXd0M0SPltd5X6y6BEWcPX8TCyQ/Eir20Pl
vSNL
=kR6o
-----END PGP MESSAGE-----`

const sellerSignature = `-----BEGIN PGP SIGNATURE-----
Version: FlowCrypt Email Encryption 8.4.8
Comment: Seamlessly send and receive encrypted email

wsFzBAEBCAAnBYJk+sAiCZBYx5gQD/inQxYhBFunilEM2kQTK9xR+ljHmBAP
+KdDAADXThAAj08Uz76BLcRUP/CRO5ef61cZJjS61eU/Ei6/pgcoeOpjHcc/
RS2g4H+gH54ZPf2hjdlTaZU/oJ9GB5XPmg2hChFs+YIc78fem9MGgxSznYGJ
m7cAt5+JcmxuIHEjzNb4I5jIYWGus+PWwwGge9zNIOROPZ3gSj2Wamgq/05P
MAdVwJtxGaU8KVeKN51Uy+SF6igwEjQvXoCRE8WQOsdifNgtZ3ABAeABG27T
P2zhU/N1sQnyTYmpJ8hW/+Rmmk1dmj3ccmJGacds44/MzXwTcSxRrsLituNv
wQmbAxlkiHPqBJX6AmMwZOWw4LrHYqSJqMsuynjKHAlzcSscWcfiVLZjWJMy
uz5y07o1rb0SgZQowlbxwbXj+WVg5nL380DCMFrgNBiD5I9qKT8jLX3p00n2
ou6JTxmq3/pzxgwRpbW8gySDv3UUOcauAx+g40GixXExcDSacPLyxhj7T64/
qNrBwNc7oUP5gjh8jistRMlEYtAv1vr9pT4eWier18IS5Q2INn7lHUZAOzBx
y/B7Ac6/gHyv6wnpLwUj6NPtB5soeY6tJKEf4Yj1ZJMAucQfALlUpLMqFTwB
anSWLK76M6jAk2VNQUqmbAAqwUXNZ8M/FxHm68J7AzPrf81s98j6lVhB+8Ao
ZyxT7PqvMDFeG1QhDnF5KE8Vaos3CzOKRJ4=
=UFxS
-----END PGP SIGNATURE-----`
  
const sellerPaymentDetails = {
  beneficiary: 'Foo Bar',
  reference: 'foo bar baz'
}

const buyerId = '0213583209ada26c16e5c3157d86809f8fd46e602936a4e3d51cd988a42ebe19f3'

// Get invoice props
const {
  invoice
} = defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

const {
  metadata: {
    buyerGateway: {
      gatewayMethod
    },
    // sellerPaymentDetails,
    // chatMessages
  }
} = invoice;

// Get needed functions from plugins
const {
  // Function to capitalize strings
  $capitalize,
  // Function to format time
  $dayjs,
  // Handle pgp keys
  $signMessage,
  $encryptMessage,
  $decryptMessage
} = useNuxtApp();

// Format the payment method id to a readable name
const paymentMethod = $capitalize(kebabCase(gatewayMethod).replace('-', ' ')).replace('-', '%');

const initialForm = {
  newMessage: ''
}

const form = ref(initialForm);

const validationSchema = {
  newMessage: {
    required: true
  }
}

const chatMessages = ref([])
onMounted(async () => {
  const buyerPublicKey = nuxtStorage.localStorage.getData('pgp_public_key');
  const apiRespone = [
    {
      "date": "2023-09-07T14:41:41.605Z",
      "from": "26dc...5de2",
      "message": sellerEncryptedMessage,
      "readBy": ["26dc...5de2"],
      "roomid": "123-456",
      "signature": sellerSignature
    },
  ]

  const chat = []
  for (const message of apiRespone ) {
    if (message.from === buyerId) {
      chat.push({
        from: 'buyer',
        text: await $decryptMessage(message.message, message.signature, buyerPublicKey),
        date: message.date
      })
    } else {
      chat.push({
        from: 'seller',
        text: await $decryptMessage(message.message, message.signature, sellerPublicKey),
        date: message.date
      })
    }
  }
  chatMessages.value = chat
});

const postChatMessage = async () => {
  const message = await $encryptMessage(form.value.newMessage, sellerPublicKey);
  const signature = await $signMessage(form.value.newMessage);
  console.log({ message, signature })
  return({ message, signature })
}

</script>

<template>
  <div>
    <ONotification
      v-if="!sellerPaymentDetails"
      rootClass="has-border-primary"
      contentClass="ltr-has-new-line is-success"
      closable
    >{{ $t('bitcoinPurchaseWarning', { paymentMethod }) }}</ONotification>
    <div v-else>
      <div class="is-4">{{ paymentMethod }}</div>
      <OField
        v-for="[key, value], index in Object.entries(sellerPaymentDetails)"
        :label="(index === 0 ) ? $t('sellerPaymentDetails') : null"
        :key="key"
      >
        <OButton
          variant="warning"
          disabled
        >{{ $t(key) }}</OButton>
        <OInput 
          :model-value="value"
          disabled
          expanded
        />
      </OField>
    </div>
    <!-- <pre class="section">{{ invoice }}</pre> -->
    <div v-if="chatMessages" class="section">
      <div class="replicate-label">Chat</div>
      <div 
        class="block"
        v-for="{ date, text, from } in chatMessages"
        :key="date"
      >
        <div class="block columns is-mobile">
          <div v-if="from === 'buyer'" class="column is-one-quarter is-7 is-italic has-text-right has-text-primary">{{ $dayjs(date).fromNow() }}</div>
          <div :class="(from === 'buyer') ? 'column is-three-quarters has-text-primary' : 'column is-three-quarters'">{{ text }}</div>
          <div v-if="from !== 'buyer'" class="column is-one-quarter is-7 is-italic">{{ $dayjs(date).fromNow() }}</div>
        </div>
      </div>
      <VForm
        v-if="sellerPaymentDetails"
        name="chat"
        :validation-schema="validationSchema"
        @submit="postChatMessage"
      >
        <VField
          name="newMessage"
          :label="$t('newChatMessage')"
          v-slot="{ handleChange, handleBlur, value, errors }"
          v-model="form.newMessage"
        >
          <OField
            :label="$t('newChatMessage')"
            :variant="errors[0] ? 'danger' : null"
            :message="errors[0] ? errors[0] : ''"
          >
            <OInput
              type="textarea"
              :model-value="value"
              @update:modelValue="handleChange"
              @change="handleChange"
              @blur="handleBlur"
              expanded
              :maxlength="100"
              :hasCounter="true"
            />
          </OField>
        </VField>
        <OField>
          <OButton
            variant="primary"
            native-type="submit"
            expanded
          >{{ $t('postChatMessage') }}</OButton>
        </OField>
      </VForm>
    </div>
  </div>
</template>

<style lang="scss">
.is-success {
  color: $success !important;
}
.is-buyer-chat-text {
  color: $primary !important;
  text-align: right;
}
// Custom notification with primary border
.has-border-primary {
  background-color: white;
  border-style: solid;
  border-width: 1px;
  border-color: $primary;
  color: black;
}
</style>

<style scoped>
.section {
  padding-left: 0rem;
  padding-right: 0rem;
}
.replicate-label {
  color: hsl(0, 0%, 21%);
  display: block;
  font-size: 1rem;
  font-weight: 700;
}
</style>