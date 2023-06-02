import { getMethod, readBody, getQuery } from 'h3';
import { ofetch } from 'ofetch';
import { defaultLocale } from '~/assets/js/locales';
const {
  btcpayApikey,
  public: {
    isDev,
    deploymentDomain
  }
} = useRuntimeConfig();

// Wrapper for the greenfield Api fetch 
export const greenfieldApi = async (endpoint, event) => {

  const [{
    btcpay: {
      storeid,
      host
    }
  }] = await ofetch(`${deploymentDomain}/api/_content/query?_params=` + JSON.stringify({
    where: [{
      _partial: false,
      _locale: defaultLocale,
      _path: '/settings',
      _dir: ''
    }]
  }));

  const apiFetch = ofetch.create({
    baseURL: `${host}/api/v1/stores/${storeid}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${btcpayApikey}`
    },
    redirect: 'follow',
    async onRequestError({ request, error }) {
      isDev ?  console.log('[fetch request error]', request, error) : null
    },
    async onResponseError({ request, response }) {
      isDev ? console.log('[fetch response error]', request, response.status, response.body) : null
    }
  });

  const method = getMethod(event);

  let query, body;
  if (method === 'GET') {

    query = getQuery(event);
  } else {

    body = await readBody(event);
  };

  return await apiFetch(endpoint, {
    method,
    query,
    body
  });
};
