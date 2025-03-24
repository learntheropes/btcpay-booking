import { ofetch } from 'ofetch';
import yaml from 'yaml'

export default defineEventHandler(async (event) => {

  // Verify the Greenfield api webhook and return if unauthorized
  let { statusCode, body } = await verifyWebhook(event);

  if (statusCode !== 200) {
    setResponseStatus(event, statusCode);
    return body;
  }

  // Temporarily disable the webhook verification
  // const body = await readBody(event);
  // REMOVE

  const { btcpayApikey } = useRuntimeConfig();

  // Get the required properties from the webhook body
  const { id: invoiceId, status: invoiceStatus, paymentTotals } = body;

  // Get the btcpay store settings from the yaml content file
  const settingsYaml = await useStorage('content').getItem(`settings.yaml`);
  const { btcpay: { storeid, host }} = yaml.parse(settingsYaml.toString());

  // Get the invoice details from the btcpay Greenfield api
  if (invoiceStatus === 'paid') {
    const { metadata, metadata: { bookingGatewayType }} = await ofetch(`${host}/api/v1/stores/${storeid}/invoices/${invoiceId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${btcpayApikey}`
      }
    });
  }


  if (bookingGatewayType === 'crypto' && invoiceStatus === 'paid') {

    // Get the payment method of the invoice from the webhook body
    const paymentMethod = Object.keys(paymentTotals).filter(key => key !== 'BTC-LNURL').join(', ');

    // Update the invoice metadata with the payment method if itś paid in crypto
    await ofetch(`${host}/api/v1/stores/${storeid}/invoices/${invoiceId}`, {
      method: 'PUT',
      body: {
        metadata: {
          ... metadata,
          bookingGatewayPaymentMethod: paymentMethod
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${btcpayApikey}`
      }
    });
  };

  if (invoiceStatus === 'paid') {
    await addGoogleCalendarEvent({
      start: new Date(metadata.startDate).toISOString(),
      end: new Date(metadata.endDate).toISOString(),
      summary: metadata.bookingService,
      description: `${metadata.bookingName}\n${metadata.bookingEmail}\n${metadata.bookingPGP}\n${metadata.buyerBookingExtras}\n${bookingDescription}`,
      // location: metadata.location,
      attendees: [
        { email: metadata.bookingEmail },
      ],
      sendInviteEmail: false,
    });
  }

  // Pusher trigger the invoice status to the client
  await pusherTrigger('bitcoin_invoice_webhook', invoiceId, {
    value: invoiceStatus
  });
  
  // Return ok to the Greenfield api
  return 'ok';
});
