// Import the surcharge for shitcoins gateway 
import {
  cloudFee,
} from '../assets/js/fees';

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
        console.log('invoiceId', invoiceId)

        // Get the amount of the invoice in btc from btcpay
        const [{ amount: btcAmount }] = await $fetch(`/api/invoices/${invoiceId}/payment-methods`)

        const { keyPath, address: crypto_address } = await $fetch('/api/address');
        
        // Release the just fetched next available address
        await await $fetch('/api/address', {
          method: 'DELETE'
        });
        console.log('keyPath', keyPath)
        console.log('crypto_address', crypto_address)
        const [ accountIndex, addressIndex ] = keyPath.split('/');
        console.log('accountIndex', accountIndex)
        console.log('addressIndex', addressIndex)
        return await $fetch('/api/sepa', {
          method: 'POST',
          body: {
            accountIndex,
            addressIndex,
            crypto_address,
            amount: Number(btcAmount),
            buyerLegalName,
            buyerLegalAddress,
            buyerLegalCity,
            buyerLegalZip,
            buyerLegalCountry,
            buyerBic,
            buyerIban: buyerIban.replaceAll(' ', '').toUpperCase()
          }
        })
      }
    }
  }
});