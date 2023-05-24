import { ofetch } from 'ofetch';

export const bityOrderGet = async ({ order_uuid }) => {

  const { payment_details } =  await ofetch(`https://exchange.api.bity.com/v2/orders/${order_uuid}`);

  return payment_details;
};