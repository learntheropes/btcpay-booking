import nuxtStorage from 'nuxt-storage';

export default defineNuxtPlugin(nuxtApp => {

  const proxy = 'https://corsproxy.io/?';

  // Register peach account
  const registerPeachAccount = async () => {

    const message = `Peach Registration ${Date.now()}`

    // Sign message with bitcoinjs-lib
    const {
      publicKey,
      signature,
    } = nuxtApp.$bitcoin.signMessage(message);

    // Generate the unique id to be associate with the account on Peach
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const peachUniqId = `${Date.now()}${randomId}`;
    nuxtStorage.localStorage.setData('peach_uniqe_id', peachUniqId, 14, 'd');

    // Fetch peach register endpoint
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

  // Authorize peach account
  const authorizePeachAccount = async () => {

    const message = `Peach Registration ${Date.now()}`

    // Sign message with bitcoinjs-lib
    const {
      publicKey,
      signature,
    } = nuxtApp.$bitcoin.signMessage(message);

    // Fetch peach auth endpoint
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

  const getAccessToken = async () => {

    // Get the peach access token
    let peachAccessToken = nuxtStorage.localStorage.getData('peach_access_token');
    if (!peachAccessToken ) {
      try {
        const { accessToken } = await registerPeachAccount();
        peachAccessToken = accessToken;
      } catch (_error) {
        const { accessToken } = await authorizePeachAccount();
        peachAccessToken = accessToken;
      }
    };
    return peachAccessToken;
  };

  const getMe = async () => {

    const accessToken = await getAccessToken();

    return await $fetch(`/v1/user/me`, {
      baseURL: `${proxy}https://api.peachbitcoin.com`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  return {
    provide: {
      peach: {
        registerPeachAccount,
        authorizePeachAccount,
        getAccessToken,
        getMe
      }
    }
  }
})