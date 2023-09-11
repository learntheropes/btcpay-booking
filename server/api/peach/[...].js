
import { ofetch } from 'ofetch';
import { readBody, getQuery, getRequestHeaders } from 'h3';

export default eventHandler(async event => {

  const params = event.context.params;
  const endpoint = params._

  let query, body;
  if (method === 'GET') {

    query = getQuery(event);
  } else {

    body = await readBody(event);
  };

  await ofetch(endpoint, {
    baseURL: 'https://api.peachbitcoin.com/',
    method: event.method,
    headers: getRequestHeaders(event),
    query,
    body
  })
  return params;
});