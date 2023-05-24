import { ofetch } from 'ofetch';

export default bityOrderCancel = async orderId => {

  await ofetch(`https://exchange.api.bity.com/v2/orders/${orderId}/cancel`, {
    method: 'POST'
  });
};