export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      getSepaPaymentInfo: async (
        {
          id: invoiceId,
          metadata
        },
        {
          buyerLegalName,
          buyerIban
        }, {
          order_uuid,
          crypto_address,
          purpose,
          coinType,
          accountIndex,
          addressIndex
        }
      ) => {
        // Create the message to sign
        const message_to_sign = `Peach Registration ${new Date()}`
        // Sign the message with bitcoin-js-lib
        const { signature } = await $fetch('/api/sign-message', {
          method: 'POST',
          body: {
            message_to_sign,
            purpose,
            coinType,
            accountIndex,
            addressIndex: addressIndex - 1 
          }
        });

        // Register the user with Peach
        const details = await $fetch(`https://api.peachbitcoin.com/v1/user/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            message: message_to_sign,
            publicKey: '',
            signature
          }
        });

        // Store the bity payment details in the btcpay invoice metadata
        await $fetch(`/api/invoices/${invoiceId}`, {
          method: 'PUT',
          body: {
            metadata: {
              ...metadata,
              buyerSepa: details
            }
          }
        });

        return details;
      }
    }
  }
})