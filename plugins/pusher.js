import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {

  const { public: { pusherApikey, pusherCluster }} = useRuntimeConfig();
  
  const pusher = new Pusher(pusherApikey, {
    cluster: pusherCluster,
    useTLS: false,
  });

  return {
    provide: {
      pusher: pusher
    }
  };
})