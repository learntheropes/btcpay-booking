
import { ofetch } from 'ofetch';
import { readBody, getQuery, getRequestHeaders } from 'h3';

export default eventHandler(async event => {

  try {

    const params = event.context.params;
    const endpoint = params._

    const method = event.method
  
    const query = getQuery(event);

    let body;
    if (method !== 'GET') {

      body = await readBody(event);
    };

    const headers = getRequestHeaders(event)
  
    return await ofetch(endpoint, {
      baseURL: 'https://api.peachbitcoin.com/',
      method,
      headers,
      query,
      body,
      ignoreResponseError: true,
      async onRequestError({ request, options, error }) {
        console.log("[fetch request error]", request, error);
      },
      async onResponseError({ request, response, options }) {
        console.log("[fetch response error]", request, response.status, response.body);
      },
    })
  } catch(error) {

    console.log('peach middleware error', error);
  }

});