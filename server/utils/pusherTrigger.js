import Pusher from 'pusher';

export const pusherTrigger = async (channel, event, data) => {

  const {
    pusherSecret,
    public: {
      pusherApikey,
      pusherCluster,
      pusherAppId
    }
  } = useRuntimeConfig();

  const pusher = new Pusher({
    appId: pusherAppId,
    key: pusherApikey,
    secret: pusherSecret,
    cluster: pusherCluster,
    forceTLS: true
  });

  return await pusher.trigger(channel, event, data);
};
