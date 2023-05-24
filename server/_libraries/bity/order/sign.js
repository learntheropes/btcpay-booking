import { ofetch } from 'ofetch';

export const bitySignOwnership = async ({
  order_uuid,
  signature
}) => {
  await ofetch(`https://exchange.api.bity.com/v2/orders/${order_uuid}/signature`, {
    method: 'POST',
    body: signature, 
    headers: {
      'content-type': 'text/plain'
    }
  })
}