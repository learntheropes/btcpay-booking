import { ofetch } from 'ofetch';

export const bityOrderEstimate = async ({
  amount,
  currency,
}) => {

  const body = {
    input: {
      amount: amount.toFixed(2).toString(),
      currency
    },
    output: {
      currency: "BTC"
    }
  };

  return await ofetch('https://exchange.api.bity.com/v2/orders/estimate', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};