import { networks } from 'bitcoinjs-lib'
const { public: { network }} = useRuntimeConfig();

export const getNetwork = async () => {
  return (network === 'mainnet') ? networks.bitcoin : await networks[network];
}