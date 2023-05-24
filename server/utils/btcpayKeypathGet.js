export const btcpayKeypathGet = async () => {

  return await greenfieldApi(`/payment-methods/onchain/BTC/wallet/address`);
};