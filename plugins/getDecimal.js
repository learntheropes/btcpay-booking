import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {

  // Define the decimal place for each country.
  // Needs more currencies added.
  return {
    provide: {
      getDecimal: (currency) => {
        switch(currency) {
          case 'BTC':
            return 8;
          case 'SATS':
            return 0;
          case 'ARS':
            return 0;
          default:
            return 2;
        }
      }
    }
  }
});
