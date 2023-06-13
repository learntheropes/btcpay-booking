import bitcoinMessage from 'bitcoinjs-message';

export const getSignature = ({ 
  message_to_sign, 
  keypair 
}) => {

  const {
    privateKeyHex,
    publicKeyHex
  } = keypair;

  const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
  const publicKeyBuffer = Buffer.from(publicKeyHex, "hex");
  return bitcoinMessage.sign(message_to_sign , privateKeyBuffer, publicKeyBuffer).toString('base64');
}