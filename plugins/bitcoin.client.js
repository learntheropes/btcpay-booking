import { networks, initEccLib, payments } from 'bitcoinjs-lib'
import * as bip39 from 'bip39';
import * as BIP32Factory from 'bip32';
// A replacemenet of tiny-secp256k1
// compatible with environments that do not support WebAssembly
import ecc from '@bitcoinerlab/secp256k1';
initEccLib(ecc);
const bip32 = BIP32Factory.default(ecc);
import bitcoinMessage from 'bitcoinjs-message';
import * as crypto from 'crypto';

export default defineNuxtPlugin(nuxtApp => {

  // Get the bitcoin mainnet network from bitcoinjs
  const network = networks.bitcoin;

  // Generate a random 12 words mnemonic
  const mnemonic = bip39.generateMnemonic();

  // Get the seed from the mnemonico
  const seedBuffer =  bip39.mnemonicToSeedSync(mnemonic);

  // Generate the keys and the address for the first p2wpkh address in the wallet
  const derivationPath = `m/48'/0'/0'/0`;

  const root = bip32.fromSeed(seedBuffer, network);

  const child = root.derivePath(derivationPath);

  // The private key
  const privateKeyHex = child.privateKey.toString('hex');

  // The publick key
  const publicKeyHex = child.publicKey.toString('hex');

  // The address
  const { address } = payments.p2sh({
    redeem: payments.p2wpkh({ 
      pubkey: child.publicKey, 
      network, 
    }), 
    network, 
  });

  // Convert the private key from hex string to buffer
  // to be used in the message sign function
  const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");

  // Generate the message to sign
  const timeStamp = Date.now();
  const message = `Peach Registration ${timeStamp}`;

  // Hash the message to sign with sha256 alghoritm
  const sha256Message = crypto.createHash('sha256').update(message).digest('hex');

  // Generate the signature
  const signature =  bitcoinMessage.sign(sha256Message , privateKeyBuffer).toString('base64');

  // Generate the unique id to be associate with the account on Peach
  const randomId = Math.floor(100000 + Math.random() * 900000);
  const uniqueId = `${timeStamp}${randomId}`;

  console.log('mnemonic', mnemonic)
  console.log('derivationPath', derivationPath)
  console.log('privateKey', privateKeyHex)
  console.log('publicKey', publicKeyHex)
  console.log('address', address)
  console.log('message', message)
  console.log('sha256Message', sha256Message)
  console.log('signature', signature)

  // Return the needed value to create the peach account as a client only plugin
  return {
    provide: {
      bitcoin: {
        uniqueId,
        message,
        signature,
        publicKeyHex,
      }
    }
  }
})