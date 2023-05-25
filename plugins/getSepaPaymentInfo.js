// Import the surcharge for shitcoins gateway 
import { surcharge } from '../assets/js/mix';

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      getSepaPaymentInfo: async ({
        amount,
        currency,
        metadata,
        chechout,
      }, {
        buyerLegalName,
        buyerLegalAddress,
        buyerLegalCity,
        buyerLegalZip,
        buyerLegalCountry,
        buyerBic,
        buyerIban
      }) => {

        return await $fetch('/api/sepa', {
          method: 'POST',
          body: {
            amount,
            currency,
            metadata,
            chechout,
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