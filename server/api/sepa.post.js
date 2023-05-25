import { bityOrderCreate } from '../_libraries/bity/order/create'
import { bitySignOwnership } from '../_libraries/bity/order/sign'
import { bityOrderGet } from '../_libraries/bity/order/get'

export default defineEventHandler(async event => {

  // Get the needed properties from the request body
  const {
    accountIndex,
    addressIndex,
    crypto_address,
    amount,
    buyerLegalName,
    buyerLegalAddress,
    buyerLegalCity,
    buyerLegalZip,
    buyerLegalCountry,
    buyerBic,
    buyerIban
  } = await readBody(event);

  // Create the order on Bity
  const {
    order_uuid,
    message_to_sign
  } = await bityOrderCreate({
    amount,
    name: buyerLegalName,
    address: buyerLegalAddress,
    city: buyerLegalCity,
    zip: buyerLegalZip,
    country: buyerLegalCountry,
    bic: buyerBic,
    iban: buyerIban,
    crypto_address     
  });

  // Sign the message provided by bity
  const { signature, address } = await signMessage({
    message_to_sign,
    accountIndex,
    addressIndex: addressIndex - 1
  });

  console.log('address from bitcoinjs-lib', address)
  console.log('is the same', crypto_address === address)

  // Send the signed message to bity
  await bitySignOwnership({
    order_uuid,
    signature
  });

  // Get the order details for the buyer from bity
  return await bityOrderGet({ order_uuid });
});