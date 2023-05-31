import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {

  const {
    public: {
      isDeployed,
      pusherApikey,
      pusherCluster
    }
  } = useRuntimeConfig();
  
  const pusher = new Pusher(pusherApikey, {
    cluster: pusherCluster,
    useTLS: (isDeployed) ? true: false,
  });

  return {
    provide: {
      pusher: pusher
    }
  };
});
