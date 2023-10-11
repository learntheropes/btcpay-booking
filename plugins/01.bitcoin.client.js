import { networks, initEccLib, payments } from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as BIP32Factory from 'bip32';
// A replacemenet of tiny-secp256k1
// compatible with environments that do not support WebAssembly
import ecc from '@bitcoinerlab/secp256k1';
initEccLib(ecc);
const bip32 = BIP32Factory.default(ecc);
import * as crypto from 'crypto';
import nuxtStorage from 'nuxt-storage';

export default defineNuxtPlugin(nuxtApp => {

  let mnemonic = nuxtStorage.localStorage.getData('bitcoin_mnemonic');

  if (!mnemonic) {

    // Generate a random 12 words mnemonic
    mnemonic = bip39.generateMnemonic();
    nuxtStorage.localStorage.setData('bitcoin_mnemonic', mnemonic, 14, 'd');
  }


  mnemonic = nuxtStorage.localStorage.getData('bitcoin_mnemonic');


  const signMessage = (message) => {

    // Get the seed from the mnemonico
    const seedBuffer =  bip39.mnemonicToSeedSync(mnemonic);

    // Generate the keys and the address for the first p2wpkh address in the wallet
    const derivationPath = `m/48'/0'/0'/0`;

    // Get the bitcoin mainnet network from bitcoinjs
    const network = networks.bitcoin;

    // Get child and publick key
    const root = bip32.fromSeed(seedBuffer, network);
    const child = root.derivePath(derivationPath);
    const publicKey = child.publicKey.toString('hex');

    // Hash the message to sign with sha256 alghoritm
    const sha256Message = crypto.createHash('sha256').update(message).digest('hex');

    // Generate the signature
    const signature = child.sign(Buffer.from(sha256Message, "hex")).toString('hex');

    return {
      publicKey,
      signature,
    };
  }

  // Return the needed value to create the peach account as a client only plugin
  return {
    provide: {
      bitcoin: {
        mnemonic,
        signMessage
      }
    }
  }
})