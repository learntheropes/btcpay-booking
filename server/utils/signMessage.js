import { getNetwork } from '../libraries/bitcoin/network'
import { generateSeedBuffer } from '../libraries/bitcoin/seed'
import { generateAccount } from '../libraries/bitcoin/account'
import { generateKeypair } from '../libraries/bitcoin/keypair'
import { sign } from '../libraries/bitcoin/sign'
const { mnemonic } = useRuntimeConfig();

export const signMessage = async body => {

  const { 
    message_to_sign,
    accountIndex,
    addressIndex
  } = body;

  const network = await getNetwork();

  const seedBuffer = generateSeedBuffer(mnemonic);

  const account = generateAccount({
    seedBuffer,
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
