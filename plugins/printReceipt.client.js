export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      printReceipt: () => {
        window.print();
      }
    }
  };
});
