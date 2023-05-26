// Import the surcharge for shitcoins gateway 
import { cloudFee } from '../assets/js/fees';

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      placeSepaOrder: async ({
        amount,
        currency,
        metadata,
      }, {
        buyerLegalName,
        buyerLegalAddress,
        buyerLegalCity,
        buyerLegalZip,
        buyerLegalCountry,
        buyerBic,
        buyerIban
      }) => {

        // Add the cloud fee to the invoice amount
        // There is no fee for self hosted installations
        amount = (Number(amount) + (Number(amount) * (Number(cloudFee) / 100)));

        // Create btcpay invoice with greenfield api
        const { id: invoiceId } = await $fetch(`/api/invoices`, {
          method: 'POST',
          body: {
            amount,
            currency,
            metadata,
            checkout: {
              expirationMinutes: 60 * 24 * 2,
              monitoringMinutes: 60 * 24 * 7,
              redirectAutomatically: false,
              requiresRefundEmail: false
            }
          }
        });

        // Get the amount of the invoice in btc from btcpay
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