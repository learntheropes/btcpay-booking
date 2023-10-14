import ngrok from 'ngrok';
import find from 'lodash.find';
import { ofetch } from 'ofetch';

const {
  btcpayApikey,
  public: {
    isDeployed,
    deploymentDomain
  }
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {

  // For local development, create a ngrok tunnel and set is as webhook domain
  // Otherwise use the deployment domain
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
        addr: 3000, 
        region: 'eu'
      });

      webhookDomain = ngrokUrl;
    }
  }

  event.node.req.body = JSON.stringify({
    // Set the webhook url
    url: `${webhookDomain}/api/socket`,
    // Don't redeliver
    automaticRedelivery: false,
    // Set the webhook secret, same as btcpay api key
    secret: btcpayApikey
  });

  // Get all the existing webhooks and find the one matching the enviroment
  event.node.req.method = 'GET';
  // const existingsWebhooks = await greenfieldApi(`/webhooks`, event);
  const existingsWebhooks = await ofetch(`${deploymentDomain}/api/webhooks`)
  const partialUrl = (isDeployed) ? deploymentDomain : 'ngrok-free.app';
  const exists = find(existingsWebhooks, wh => wh.url.includes(partialUrl));
  // If it exists and we are in production, just return
  if (exists && isDeployed) return 'ok'

  // If it exists and we are in development, update it with the active ngrok url
  else if (exists && !isDeployed) {

    event.node.req.method = 'PUT'
    return await greenfieldApi(`/webhooks/${exists.id}`, event);
  }

  // If it doesn´t exist (exists is undefined) create it both for dev and prod.
  else {

    event.node.req.method = 'POST'
    return await greenfieldApi(`/webhooks`, event);
  };
});
