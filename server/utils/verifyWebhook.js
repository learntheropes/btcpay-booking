import { createHmac } from 'crypto';
const { btcpayApikey } = useRuntimeConfig();

// https://docs.btcpayserver.org/Development/GreenFieldExample-NodeJS/#webhook-implementation-with-nodejs-express
// Get the webhook signature and rawbody and verify it.
// Return 403 with message if signature is missing or not matching
export const verifyWebhook = async (event) => {

  const signature = getRequestHeader(event, 'BTCPay-Sig');

  if (!signature) {
    return {
      statusCode: 403,
      body: 'BTCPay-Sig header is missing!'
    }
  };

  const rawBody = await readRawBody(event, 'utf8');

  const expectedSignature = 'sha256=' + createHmac('sha256', btcpayApikey).update(rawBody).digest('hex');

  if (signature !== expectedSignature) {
    setResponseStatus(event, 403);
    return {
      statusCode: 403,
      body: 'Request signatures didn\'t match!'
    };
  };

  return {
    statusCode: 200,
    body: JSON.parse(rawBody)
  };
};
