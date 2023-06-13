import bitcoinMessage from 'bitcoinjs-message';

export const getSignature = ({ 
  message_to_sign, 
  keypair 
}) => {

  const privateKeyBuffer = Buffer.from(keypair.privateKeyHex, "hex");
  const publicKeyBuffer = Buffer.from(keypair.publicKeyHex, "hex");
  return bitcoinMessage.sign(message_to_sign , privateKeyBuffer, publicKeyBuffer).toString('base64');
}