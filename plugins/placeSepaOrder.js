export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      placeSepaOrder: async (
        {
          id: invoiceId
        },
        {
          buyerLegalName,
          buyerLegalAddress,
          buyerLegalCity,
          buyerLegalZip,
          buyerLegalCountry,
          buyerBic,
          buyerIban
        }
      ) => {

        console.log('invoiceId', invoiceId)

        // Get the amount of the invoice in btc from btcpay and the destination bitcoin address
        const [{
          amount: btcAmount,
          destination: crypto_address
        }] = await $fetch(`/api/invoices/${invoiceId}/payment-methods`);

        // Get next available account and address indexes
        const { keyPath } = await $fetch('/api/address');
        const [ accountIndex, addressIndex ] = keyPath.split('/');

        // Release the just fetched next available address
        await await $fetch('/api/address', {
          method: 'DELETE'
        });

        // Place the order
        const order = await $fetch.raw('https://exchange.api.bity.com/v2/orders', {
          method: 'POST',
          body : {
            input: {
              currency: 'CHF',
              bic_swift: buyerBic,
              iban: buyerIban,
              owner: {
                name: buyerLegalName,
                address: buyerLegalAddress,
                city: buyerLegalCity,
                country: buyerLegalCountry,
                zip: buyerLegalZip
              },
              type: "bank_account"
            },
            output: {
              amount: btcAmount.toString(),
              currency: "BTC",
              type: "crypto_address",
              crypto_address
            }
          },
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        // Get the order_uuid from the place order response hader
        const order_uuid = order.headers.get('location').split('/')[3];

        return {
          order_uuid,
          crypto_address,
          accountIndex,
          addressIndex
        }
      }
    }
  }
});