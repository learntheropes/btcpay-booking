import { networks } from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
const bip32 = BIP32Factory.default(ecc);
import { generateSeedBuffer } from '../../_libraries/bitcoin/seed'
const { mnemonic } = useRuntimeConfig();


const seedBuffer = generateSeedBuffer(mnemonic);

export const generateAccount = ({ network, accountIndex }) => {

  // https://github.com/bitcoin/bips/blob/master/bip-0087.mediawiki#coin-type
  // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  const coinType = (network === networks.bitcoin) ? 0 : 1

  // m / purpose' / coin_type' / account'
  const accountDerivationPath = `m/49'/${coinType}'/${accountIndex}'`

  const root = bip32.fromSeed(seedBuffer, networks[network]);
    
  return {
    accountDerivationPath,
    root
  }
}

