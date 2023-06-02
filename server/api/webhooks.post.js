import ngrok from 'ngrok';
import { readBody } from 'h3';

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
        addr: 3000, region: pusherCluster
      });

      webhookDomain = ngrokUrl;
    }
  }

  // Define the webhook id based on the enviroment
  const webhookId = (isDeployed) ? 'production' : 'development';

  event.node.req.body = JSON.stringify({
    // Set the webhookId
    id: webhookId,
    // Set the webhook url
    url: `${webhookDomain}/api/socket`,
    // Don't redeliver
    automaticRedelivery: false,
    // Set the webhook secret, same as btcpay api key
    secret: btcpayApikey
  });

  try {
    event.node.req.method = 'GET'
    await greenfieldApi(`/webhooks/${webhookId}`, event);

    if (isDeployed) return

    else {

      event.node.req.method = 'PUT'
      return await greenfieldApi(`/webhooks/${webhookId}`, event);
    }
  } catch (error) {
    
    event.node.req.method = 'POST'
    return await greenfieldApi(`/webhooks`, event);
  }
});
