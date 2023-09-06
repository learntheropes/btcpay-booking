export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      getPeachPaymentInfo: async (
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
        const { data: signatureData } = await useFetch('/api/sign-message', {
          method: 'POST',
          body: {
            message_to_sign,
            purpose,
            coinType,
            accountIndex,
            addressIndex: addressIndex - 1 
          }
        });
        const signature = signatureData.value.signature

        // Register the user with Peach
        const { data: detailsData } = await useFetch(`https://api.peachbitcoin.com/v1/user/register/`, {
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
        const details = detailsData.value;

        // Store the bity payment details in the btcpay invoice metadata
        await useFetch(`/api/invoices/${invoiceId}`, {
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