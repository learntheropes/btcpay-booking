import { readBody } from 'h3';
import ngrok from 'ngrok';

const {
  btcpayApikey,
  public: {
    isDeployed,
    deploymentDomain,
    pusherCluster
  }
} = useRuntimeConfig();

let webhookDomain;

export default defineEventHandler(async (event) => {

  // For local development, create a ngrok tunnel and set is as webhook domain
  // Otherwise use the deplyment domain
  if (!webhookDomain) {
    webhookDomain = deploymentDomain;
    if (!isDeployed) {
      const ngrokUrl = await ngrok.connect({ addr: 3000, region: pusherCluster }) ;// authtoken: process.env.NGROK_TOKEN
      webhookDomain = ngrokUrl;
    }
  };

  const body = await readBody(event);

  body.url = `${webhookDomain}/api/socket`;

  body.automaticRedelivery = false;

  // Set the webhook secret
  body.secret = btcpayApikey;
  event.body = body;

  return await greenfieldApi(`/webhooks`, event);
});

