import { networks, initEccLib, payments } from 'bitcoinjs-lib'
import * as bip39 from 'bip39';
import * as BIP32Factory from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
initEccLib(ecc);
const bip32 = BIP32Factory.default(ecc);
import bitcoinMessage from 'bitcoinjs-message';
import { createHash } from 'crypto';


export default defineNuxtPlugin(nuxtApp => {

  const network = networks.bitcoin;

  const mnemonic = bip39.generateMnemonic();

  const seedBuffer =  bip39.mnemonicToSeedSync(mnemonic);

  const derivationPath = `m/48'/0'/0'/0`;

  const root = bip32.fromSeed(seedBuffer, network);

  const child = root.derivePath(derivationPath);

  const privateKeyHex = child.privateKey.toString('hex');

  const publicKeyHex = child.publicKey.toString('hex');

  const { address } = payments.p2sh({ 
    redeem: payments.p2wpkh({ 
      pubkey: child.publicKey, 
      network, 
    }), 
    network, 
  });

  const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");

  const timeStamp = Date.now();

  const message = `Peach Registration ${timeStamp}`;

  const sha256Message = createHash('sha256').update(message).digest('hex');

  const signature =  bitcoinMessage.sign(sha256Message , privateKeyBuffer).toString('base64');

  console.log('mnemonic', mnemonic)
  console.log('derivationPath', derivationPath)
  console.log('privateKey', privateKeyHex)
  console.log('publicKey', publicKeyHex)
  console.log('address', address)
  console.log('message', message)
  console.log('sha256Message', sha256Message)
  console.log('signature', signature)

  return {
    provide: {
      bitcoin: {
        message,
        signature,
        publicKeyHex,
      }
    }
  }
})