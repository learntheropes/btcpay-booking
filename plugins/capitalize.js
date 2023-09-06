export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      capitalize: (string) => {
        return string.split(' ').map((word) => word[0].toUpperCase() + word.substring(1)).join(' ');
      }
    }
  }
});