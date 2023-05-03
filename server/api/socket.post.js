// import { pusherTrigger } from "../utils/pusherTrigger";

export default defineEventHandler(async (event) => {

  // Verify the Greenfield api webhook and return in unauthorized
  let { statusCode, body } = await verifyWebhook(event);

  if (statusCode !== 200) {
    setResponseStatus(event, statusCode);
    return body;
  }

  // Get the required properties from the webhook body
  const { invoiceId, type } = body;

  // Pusher trigger the invoice status to the client
  await pusherTrigger('webhook', invoiceId, {
    value: type
  });
  
  // Return ok to the Greenfield
  return 'ok';
})

