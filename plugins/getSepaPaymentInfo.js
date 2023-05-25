// Import the surcharge for shitcoins gateway 
import { cloudFee } from '../assets/js/fees';

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      getSepaPaymentInfo: async ({
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
          }
        });

        // /v2/orders/25caa5d7-b914-4732-bf68-96c89a665d52
        const location = order.headers.get('location');
        const order_uuid = location.split('/')[3];

        // Get the message to sign
        const { message_to_sign } =  await $fetch(`https://exchange.api.bity.com${location}`);

        // Sign the message with bitcoin-js-lib
        const { signature } = await $fetch('/api/sign', {
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
            'content-type': 'text/plain'
          }
        });

        // Get the payment details
        return await $fetch(`https://exchange.api.bity.com/v2/orders/${order_uuid}`);
      }
    }
  }
});