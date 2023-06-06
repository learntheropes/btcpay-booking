import { readBody } from 'h3';
import { getNetwork } from '../libraries/bitcoin/network'
import { generateSeedBuffer } from '../libraries/bitcoin/seed'
import { generateAccount } from '../libraries/bitcoin/account'
import { generateKeypair } from '../libraries/bitcoin/keypair'
import { getSignature } from '../libraries/bitcoin/sign'
const { mnemonic } = useRuntimeConfig();

export default defineEventHandler(async event => {
  
  const { 
    message_to_sign,
    purpose,
    coinType,
    accountIndex,
    addressIndex
  } = await readBody(event);

  const network = await getNetwork();

  const seedBuffer = generateSeedBuffer(mnemonic);

  const account = generateAccount({
    network,
    seedBuffer,
    purpose,
    coinType,
    accountIndex
  });
  
  const keypair = generateKeypair({
    network,
    account,
    addressIndex
  });

  const signature = getSignature({
    message_to_sign,
    keypair
  });

  return {
    message_to_sign,
    signature,
    address: keypair.address
  };
});
