
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

    console.log('endpont', endpoint)
  
    return await ofetch(endpoint, {
      baseURL: 'https://api.peachbitcoin.com/',
      method,
      headers,
      query,
      body,
    })

  } catch(error) {
    console.log('peach middleware error', error)
  }

});