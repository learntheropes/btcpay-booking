import { networks } from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
const bip32 = BIP32Factory.default(ecc);

export const generateAccount = ({ network, seedBuffer, purpose, coinType, accountIndex }) => {

  // m / purpose' / coin_type' / account'
  const accountDerivationPath = `m/${purpose}/${coinType}/${accountIndex}'`

  const root = bip32.fromSeed(seedBuffer, networks[network]);
    
  return {
    accountDerivationPath,
    root
  }
};
