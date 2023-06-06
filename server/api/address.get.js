export default defineEventHandler(async (event) => {

  const [{ accountKeyPath }] = await greenfieldApi(`payment-methods/OnChain`, event);
  const [ _fingerprint, purpose, coinType ] = accountKeyPath.split('/')

  const { keyPath } = await greenfieldApi(`/payment-methods/onchain/BTC/wallet/address`, event);
  const [ accountIndex, addressIndex ] = keyPath.split('/');

  return {
    purpose,
    coinType,
    accountIndex,
    addressIndex
  }
});
