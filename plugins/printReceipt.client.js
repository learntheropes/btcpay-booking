import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      printReceipt: () => {
        window.print()
      }
    }
  };
});