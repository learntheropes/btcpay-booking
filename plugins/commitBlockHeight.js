export default defineNuxtPlugin(async nuxtApp => {

  let commitBlockHeight;
  nuxtApp.hook('ready', async () => {
    console.log('Fetch block height')
    const [{ height }] = await $fetch('https://mempool.space/api/v1/blocks');
    commitBlockHeight = height;
  });

  return {
    provide: {
      commitBlockHeight
    }
  }
});
