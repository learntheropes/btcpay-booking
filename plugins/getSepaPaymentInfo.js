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
          accountIndex,
          addressIndex
        }
      ) => {
        // Create the message to sign
        const message_to_sign = `This message is part of the process of placing an exchange order on bity.com. To proceed, Bity is required to verify that you own the destination crypto address. By signing this message with your wallet, you are confirming 1) that you are the sole owner of the crypto address below and 2) that you will be sending your own funds to Bity. If you did not initiate this process yourself, do not sign this message.

Your order id: ${order_uuid}
Your full name: ${buyerLegalName}
Your IBAN: ${buyerIban}
Your crypto address: ${crypto_address}
Your crypto address type: BTC
`
        // Sign the message with bitcoin-js-lib
        const { signature } = await $fetch('/api/sign-message', {
          method: 'POST',
          body: {
            message_to_sign,
            accountIndex,
            addressIndex: addressIndex - 1 
          }
        });

        // Confir ownership on bity by providing the signed meesage signature
        await $fetch(`https://exchange.api.bity.com/v2/orders/${order_uuid}/signature`, {
          method: 'POST',
          body: signature, 
          headers: {
            'content-type': 'text/plain',
          },
          credentials: 'include'
        });

        // Get the payment details
        const details = await $fetch(`https://exchange.api.bity.com/v2/orders/${order_uuid}`, {
          credentials: 'include'
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