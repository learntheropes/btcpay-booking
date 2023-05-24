import { readBody } from 'h3'
import { getNetwork } from '../_libraries/bitcoin/network'
import { generateAccount } from '../_libraries/bitcoin/account'
import { generateKeypair } from '../_libraries/bitcoin/keypair'
import { sign } from '../_libraries/bitcoin/sign'

export const signMessage = async event => {

  const { 
    message_to_sign,
    accountIndex,
    addressIndex
  } = await readBody(event);

  const network = await getNetwork();
    
  const account = generateAccount({
    network,
    accountIndex
  });
  
  const keypair = generateKeypair({
    network,
    account,
    addressIndex
  });

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
