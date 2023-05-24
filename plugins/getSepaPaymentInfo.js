// Import the surcharge for shitcoins gateway 
import { surcharge } from '../assets/js/mix';

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      getSepaPaymentInfo: async ({
        currency,
        amount
      }, {
        buyerLegalName,
        buyerLegalAddress,
        buyerLegalCity,
        buyerLegalZip,
        buyerBic,
        buyerIban
      }) => {
        console.log('currency', currency)
        console.log('buyerIban', buyerIban)
      }
    }
  }
});