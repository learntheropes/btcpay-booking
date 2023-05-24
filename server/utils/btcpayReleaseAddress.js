export const btcpayReleaseAddress = async () => {

  return await greenfieldApi(`/payment-methods/onchain/BTC/wallet/address`, {
    method: 'DELETE'
  });
};