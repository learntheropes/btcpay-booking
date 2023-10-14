import nuxtStorage from 'nuxt-storage';
import * as crypto from 'crypto';

export default defineNuxtPlugin(nuxtApp => {

  const peachProxy = 'https://peach-cors-proxy.vercel.app';

  // Register peach account
  const registerAccount = async () => {

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
      baseURL: peachProxy,
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
  const authorizeAccount = async () => {

    const message = `Peach Registration ${Date.now()}`

    // Sign message with bitcoinjs-lib
    const {
      publicKey,
      signature,
    } = nuxtApp.$bitcoin.signMessage(message);

    // Fetch peach auth endpoint
    const { expiry, accessToken } = await $fetch(`/v1/user/auth/`, {
      baseURL: peachProxy,
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
        const { accessToken } = await registerAccount();
        peachAccessToken = accessToken;
        await updateUser();
      } catch (_error) {
        const { accessToken } = await authorizeAccount();
        peachAccessToken = accessToken;
      }
    };
    return peachAccessToken;
  };

  const getMe = async () => {

    const accessToken = await getAccessToken();

    return await $fetch(`/v1/user/me`, {
      baseURL: peachProxy,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const updateUser = async () => {

    const accessToken = await getAccessToken();

    const { armoredPgpPublicKey } = await nuxtApp.$pgp.getPgpKeys();

    const message = 'foo bar';

    return await $fetch(`/v1/user`, {
      baseURL: peachProxy,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        pgpPublicKey: armoredPgpPublicKey,
        message: message,
        pgpSignature: await nuxtApp.$pgp.signMessage(message),
        signature: nuxtApp.$bitcoin.signMessage(armoredPgpPublicKey).signature,
        referralCode: 'PR41CA',
        feeRate: 'hourFee'
      }
    });
  }

  const postBuyOffer = async (currency, method, amount) => {

    const accessToken = await getAccessToken();

    // Get the release address and the signed message
    const { id: userId } = await getMe();
    const peachId = userId.substring(0, 8);
    const { 
      address: releaseAddress, 
      signature: messageSignature 
    } = nuxtApp.$bitcoin.signAddress(peachId);

    // Get merchant premium settings
    const {
      premium
    } = await queryContent(`/settings`).findOne();

    // Get the meansOfPayment
    const meansOfPayment = {};
    meansOfPayment[currency] = [method];

    // Fake the payment data
    const data = nuxtStorage.localStorage.getData('peach_uniqe_id');
    const paymentData = {};
    paymentData[method] = {};
    paymentData[method].hashes = [crypto.createHash('sha256').update(data).digest('hex')];

    const sats = parseInt(parseFloat(amount)*100000000);

    const { id: offerId } = await $fetch(`/v1/offer`, {
      baseURL: peachProxy,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        type: 'bid',
        amount: [sats, sats],
        maxPremium: premium,
        meansOfPayment,
        paymentData,
        releaseAddress,
        messageSignature
      }
    });
    nuxtStorage.localStorage.setData('peach_offer_id', offerId, 14, 'd');
    return offerId
  }

  const getMatches = async () => {

    const accessToken = await getAccessToken();

    const offerId = nuxtStorage.localStorage.getData('peach_offer_id');

    return await $fetch(`/v1/offer/${offerId}/matches`, {
      baseURL: peachProxy,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    })
  }


  return {
    provide: {
      peach: {
        registerAccount,
        authorizeAccount,
        getAccessToken,
        getMe,
        updateUser,
        postBuyOffer,
        getMatches
      }
    }
  }
})