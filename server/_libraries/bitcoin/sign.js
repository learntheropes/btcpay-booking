import bitcoinMessage from 'bitcoinjs-message';

export const sign = ({ message, keypair }) => {
  const privateKeyBuffer = Buffer.from(keypair.privateKeyHex, "hex");
  const publicKeyBuffer = Buffer.from(keypair.publicKeyHex, "hex");
  return bitcoinMessage.sign(message , privateKeyBuffer, publicKeyBuffer).toString('base64');
}