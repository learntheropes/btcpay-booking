<script setup>
import nuxtStorage from 'nuxt-storage';
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

// Get needed functions from plugins
const {
  // Hadle bitcoin operations
  $bitcoin,
  $pgp
} = useNuxtApp();

onMounted(async () => {

  const {
    message,
    publicKey,
    signature,
    peachUniqId
  } = $bitcoin.signMessage(Date.now());

  // Register the peach account
  const proxy = 'https://corsproxy.io/?';

  const registerPeachAccount = async () => {

    const { expiry, accessToken } = await $fetch(`/v1/user/register/`, {
      baseURL: `${proxy}https://api.peachbitcoin.com`,
      method: 'POST',
      body: {
        message: message,
        signature: signature,
        publicKey: publicKey,
        uniqueId: peachUniqId
      }
    });
    nuxtStorage.localStorage.setData('peach_expiry', expiry, 1, 'h');
    nuxtStorage.localStorage.setData('peach_access_token', accessToken, 1, 'h');

    return {
      expiry,
      accessToken
    }
  };

  const authorizePeachAccount = async () => {

    const { expiry, accessToken } = await $fetch(`/v1/user/auth/`, {
      baseURL: `${proxy}https://api.peachbitcoin.com`,
      method: 'POST',
      body: {
        message: message,
        signature: signature,
        publicKey: publicKey
      }
    });
    nuxtStorage.localStorage.setData('peach_expiry', expiry, 1, 'h');
    nuxtStorage.localStorage.setData('peach_access_token', accessToken, 1, 'h');

    return {
      expiry,
      accessToken
    }
  };

  let peachAccessToken = nuxtStorage.localStorage.getData('peach_access_token');
  if (!peachAccessToken ) {
    try {
      const { accessToken } = await registerPeachAccount();
      peachAccessToken = accessToken;
    } catch (_error) {
      const { accessToken } = await authorizePeachAccount();
      peachAccessToken = accessToken;
    }
  }
  console.log('peachAccessToken', peachAccessToken)
  const me = await $fetch(`${proxy}https://api.peachbitcoin.com/v1/user/me`, {
    headers: {
      Authorization: `Bearer ${peachAccessToken}`
    }
  });
  console.log('me', me)
});

</script>

<template>
  <div>
    <invoiceFiatWorning :invoice="invoice" />
    <InvoiceFiatBackup :invoiceId="invoiceId" />
    <invoiceFiatPaymentDetails :invoice="invoice" />
    <!-- <InvoiceFiatChat /> -->
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
.has-text-7 {
  font-size: 0.75rem;
}
</style>