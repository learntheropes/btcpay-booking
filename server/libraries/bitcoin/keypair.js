import { initEccLib, payments } from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
initEccLib(ecc);

export const generateKeypair = ({ network, account, addressIndex }) => {

  const { accountDerivationPath, root } = account

  // m / purpose' / coin_type' / account' / change / address_index
  const addressDerivationPath = `${accountDerivationPath}/0/${addressIndex}`;
  const child = root.derivePath(addressDerivationPath);

  const privateKeyHex = child.privateKey.toString('hex');
  const publicKeyHex = child.publicKey.toString('hex');

  const { address } = payments.p2sh({ 
    redeem: payments.p2wpkh({ 
      pubkey: child.publicKey, 
      network, 
    }), 
    network, 
  });

  return {
    privateKeyHex,
    publicKeyHex,
    address
  }
};
