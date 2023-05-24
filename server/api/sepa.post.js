import { bityOrderCreate } from '../_libraries/bity/order/create'
import { bitySignOwnership } from '../_libraries/bity/order/sign'
import { bityOrderGet } from '../_libraries/bity/order/get'

export default defineEventHandler(async event => {

  // Get the needed properties from the request body
  const { 
    amount,
    currency,
    name,
    address,
    city,
    zip,
    country,
    bic,
    iban,
    metadata,
    chechout
  } = await readBody(event);

  // Create btcpay invoice with greenfield api
  await greenfieldApi(`/invoices`, {
    method: 'POST',
    body: {
      amount,
      currency,
      metadata,
      chechout
    }
  });

  // Get the account and address indexes of the next available address
  const { keyPath, address: crypto_address } = await btcpayKeypathGet();
  const [ accountIndex, addressIndex ] = keyPath.split('/');

  // Release the just fetched next available address
  await btcpayReleaseAddress();

  // Create the order on Bity
  const {
    order_uuid,
    message_to_sign
  } = await bityOrderCreate({
    amount,
    currency,
    name,
    address,
    city,
    zip,
    country,
    bic,
    iban,
    crypto_address     
  });

  // Sign the message provided by bity
  const { signature } = await signMessage({
    message_to_sign,
    accountIndex,
    addressIndex: addressIndex - 1
  });

  // Send the signed message to bity
  await bitySignOwnership({
    order_uuid,
    signature
  });

  // Get the order details for the buyer from bity
  return await bityOrderGet({ order_uuid });
});