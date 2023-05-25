import { ofetch } from 'ofetch';

export const bityOrderCreate = async ({ 
  amount,
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
      currency: 'CHF',
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
      amount: amount.toFixed(8).toString(),
      currency: "BTC",
      type: "crypto_address",
      crypto_address
    }
  };
  console.log('crypto_address', crypto_address)
  const resp = await ofetch.raw('https://exchange.api.bity.com/v2/orders', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // /v2/orders/25caa5d7-b914-4732-bf68-96c89a665d52
  const location = resp.headers.get('location');
  const order_uuid = location.split('/')[3];

  const { message_to_sign } =  await ofetch(`https://exchange.api.bity.com${location}`);

  return {
    order_uuid,
    message_to_sign
  };
};