import { getNetwork } from '../_libraries/bitcoin/network'
import { generateAccount } from '../_libraries/bitcoin/account'
import { generateKeypair } from '../_libraries/bitcoin/keypair'
import { sign } from '../_libraries/bitcoin/sign'

export const signMessage = async body => {

  const { 
    message_to_sign,
    accountIndex,
    addressIndex
  } = body;

  console.log('message_to_sign', message_to_sign)
  console.log('accountIndex', accountIndex)
  console.log('addressIndex', addressIndex)

  const network = await getNetwork();
  console.log('network', network)
  const account = generateAccount({
    network,
    accountIndex
  });
  console.log('account', account)
  
  const keypair = generateKeypair({
    network,
    account,
    addressIndex
  });
  console.log('keypair', keypair)

  const signature = sign({
    message_to_sign,
    keypair
  });

  return {
    message_to_sign,
    signature,
    address: keypair.address
  };
};
