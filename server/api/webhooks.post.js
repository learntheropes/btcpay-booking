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

export default defineEventHandler(async (event) => {

  // For local development, create a ngrok tunnel and set is as webhook domain
  // Otherwise use the deplyment domain
    let webhookDomain;

    if (isDeployed) {

      webhookDomain = deploymentDomain
    }
    else {

      const apiUrl = ngrok.getUrl();

      if (apiUrl) {

        const api = ngrok.getApi();
        const tunnels = await api.listTunnels();

        webhookDomain = tunnels.tunnels[0].public_url;
      }
      else {
        const ngrokUrl = await ngrok.connect({
          addr: 3000, region: pusherCluster
        });

        webhookDomain = ngrokUrl;
      }
    }

  const body = await readBody(event);

  body.url = `${webhookDomain}/api/socket`;

  body.automaticRedelivery = false;

  // Set the webhook secret
  body.secret = btcpayApikey;
  event.body = body;

  return await greenfieldApi(`/webhooks`, event);
});

