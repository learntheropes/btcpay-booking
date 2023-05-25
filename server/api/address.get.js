export default defineEventHandler(async (event) => {
  
  return await greenfieldApi(`/payment-methods/onchain/BTC/wallet/address`, event);
});
