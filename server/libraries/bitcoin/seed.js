import bip39 from  'bip39';

export const generateSeedBuffer = (mnemonic) => {
  return bip39.mnemonicToSeedSync(mnemonic);
}