export default defineEventHandler(async (event) => {

  const [[{ accountKeyPath }], { keyPath }] = await Promise.all([
    greenfieldApi(`payment-methods/OnChain`, event),
    greenfieldApi(`/payment-methods/onchain/BTC/wallet/address`, event)
  ]);

  const [ _fingerprint, purpose, coinType ] = accountKeyPath.split('/');
  const [ accountIndex, addressIndex ] = keyPath.split('/');

  return {
    purpose,
    coinType,
    accountIndex,
    addressIndex
  }
});
