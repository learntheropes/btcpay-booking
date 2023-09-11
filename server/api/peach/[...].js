
import { ofetch } from 'ofetch';
import { readBody, getQuery, getRequestHeaders } from 'h3';

export default eventHandler(async event => {

  try {

    const params = event.context.params;
    const endpoint = params._
  
    let query, body;
    if (event.method === 'GET') {
  
      query = getQuery(event);
    } else {
  
      body = await readBody(event);
    };

    console.log('endpont', endpoint)
  
    await ofetch(endpoint, {
      baseURL: 'https://api.peachbitcoin.com/',
      method: event.method,
      headers: getRequestHeaders(event),
      query,
      body,
      rejectUnauthorized: false
    })
    return params;

  } catch(error) {
    console.log('peach middleware error', error)
  }

});