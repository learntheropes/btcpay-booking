const { btcpayApikey, public: { isDev, ngrokUrl } } = useRuntimeConfig()
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  // For local development, create a ngrok tunnel and set is as webhook domain
  if (isDev) {
    body.url = body.url.replace('http://localhost:3000', ngrokUrl)
  }

  // Set the webhook secret
  body.secret = btcpayApikey;
  event.body = body

  return await greenfieldApi(`/webhooks`, event);
});

