import { getMethod, readBody, getQuery } from 'h3'
import { ofetch } from 'ofetch'
const { btcpayApikey, public: { isDev, deploymentDomain }} = useRuntimeConfig()
import { defaultLocale } from '~/assets/js/locales'

// Wtapper for the greenfield Api fetch 
export const greenfieldApi = async (endpoint, event) => {

  const [{
    btcapay: {
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
    // async onRequest({ request, options }) {
    //   isDev ? console.log('[fetch request]', request, options) : null
    // },
    // async onResponse({ request, response, options }) {
    //   isDev ? console.log('[fetch response]', request, response.status, response.body) : null
    // },
    // async onRequestError({ request, options, error }) {
    //   isDev ?  console.log('[fetch request error]', request, error) : null
    // },
    // async onResponseError({ request, response, options }) {
    //   isDev ? console.log('[fetch response error]', request, response.status, response.body) : null
    // }
  });

  const method = getMethod(event)

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
}
