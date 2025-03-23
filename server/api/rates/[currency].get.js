export default defineEventHandler(async (event) => {

  const currency = event.context.params.currency;
  const rates =  await greenfieldApi(`/rates?currencyPair=BTC_${currency}`, event);
  return rates[0];
});
