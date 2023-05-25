import { ofetch } from 'ofetch';

export const yadioExchangeRates = async () => {

  const { BTC } = await ofetch('https://api.yadio.io/exrates/btc');
  return BTC;
};