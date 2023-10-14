import { networks, initEccLib, payments } from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as BIP32Factory from 'bip32';
// A replacemenet of tiny-secp256k1
// compatible with environments that do not support WebAssembly
import ecc from '@bitcoinerlab/secp256k1';
initEccLib(ecc);
const bip32 = BIP32Factory.default(ecc);
import bitcoinMessage from 'bitcoinjs-message';
import * as crypto from 'crypto';
import nuxtStorage from 'nuxt-storage';

let mnemonic = nuxtStorage.localStorage.getData('bitcoin_mnemonic');

if (!mnemonic) {

  // Generate a random 12 words mnemonic
  mnemonic = bip39.generateMnemonic();
  nuxtStorage.localStorage.setData('bitcoin_mnemonic', mnemonic, 14, 'd');
}

export default defineNuxtPlugin(nuxtApp => {

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
      signature
    };
  };

  const signAddress = (peachId) => {

    // Get the seed from the mnemonico
    const seedBuffer =  bip39.mnemonicToSeedSync(mnemonic);

    // Generate the keys and the address for the first p2wpkh address in the wallet
    const derivationPath = `m/48'/0'/0'/0`;

    // Get the bitcoin mainnet network from bitcoinjs
    const network = networks.bitcoin;

    // Get child and publick key
    const root = bip32.fromSeed(seedBuffer, network);
    const child = root.derivePath(derivationPath);

    // Get the bitcoin address
    const { address } = payments.p2sh({
      redeem: payments.p2wpkh({ 
        pubkey: child.publicKey, 
        network, 
      }), 
      network, 
    });

    // Create the message to sign
    const message =  `I confirm that only I, peach${peachId}, control the address ${address}`

    // Get the private key as buffer
    // to be used in the message sign function
    const privateKeyHex = child.privateKey.toString('hex');
    const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");

    // Generate the signature
    const signature =  bitcoinMessage.sign(message , privateKeyBuffer, true).toString('base64');

    return {
      address,
      signature
    }
  }

  // Return the needed value to create the peach account as a client only plugin
  return {
    provide: {
      bitcoin: {
        signMessage,
        signAddress
      }
    }
  }
})