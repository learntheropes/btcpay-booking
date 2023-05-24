import { ofetch } from 'ofetch';

export const bityOrderCreate = async ({ 
  amount,
  currency,
  bic,
  iban,
  address,
  city,
  country,
  name,
  zip,
  crypto_address
}) => {

  const body = {
    input: {
      amount: amount.toFixed(2).toString(),
      currency,
      bic_swift: bic,
      iban,
      owner: {
        address,
        city,
        country,
        name,
        zip
      },
      type: "bank_account"
    },
    output: {
      currency: "BTC",
      type: "crypto_address",
      crypto_address
    }
  };

  const order = await ofetch('https://exchange.api.bity.com/v2/orders', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // /v2/orders/25caa5d7-b914-4732-bf68-96c89a665d52
  const location = order.headers.location;
  const order_uuid = location.split('/')[2];

  const { message_to_sign } =  await ofetch(`https://exchange.api.bity.com/${location}`);

  return {
    order_uuid,
    message_to_sign
  };
};