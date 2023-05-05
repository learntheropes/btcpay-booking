import { defineNuxtPlugin } from '#app';

// Import the surcharge for shitcoins gateway 
import { surcharge } from '../assets/js/mix';

export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      createInvoice: async ({
        buyerTime,
        buyerExtras,
        buyerName,
        buyerEmail,
        buyerFingerprint,
        buyerPGP,
        buyerDetails,
        buyerService,
        buyerGateway
      }) => {

        // Get buyer locale
        const { locale: { value: locale }} = nuxtApp.$i18n;

        // Get the service specific settings from md file
        const  {
          currency,
          price,
        } = await queryContent(`/services/${buyerService}`).locale(locale).findOne();


        // Get merchant email requirement settings
        const {
          fields: {
            email
          }
        } = await queryContent(`/settings`).findOne();


        // Set the expiration and monitoring in minutes for shitcoins based on the gateway selected
        // Leave the btcpay store default for bitcoin
        let expirationMinutes, monitoringMinutes;
        switch(buyerGateway) {
          case 'altcoins':
            expirationMinutes = 60;
            monitoringMinutes = 60 * 24;
            break;
          case 'fiat':
            expirationMinutes = 60 * 24 * 2;
            monitoringMinutes = 60 * 24 * 7;
            break;
          default:
            expirationMinutes = null;
            monitoringMinutes = null;
        }

        const getAmount = () => {

          // Define the decimal length based on the currency
          const decimal = nuxtApp.$getDecimal(currency);

          const time = buyerTime.length * price
          const extras = (buyerTime.length) ? buyerExtras.reduce((sum, extra) => sum + extra.price, 0) : 0
          const moltiplicator = (buyerGateway === 'bitcoin') ? 1 : (1 + (surcharge / 100))
          return ((time + extras) * moltiplicator).toFixed(decimal)
        };

        // workaround to avoid posting a duplicate invoice with 0 value
        if (Number(getAmount()) !== 0) {

          // Create the invoice on btcpay Greenfield api
          // And get the invoiceId page
          const { id: invoiceId } = await $fetch('/api/invoices', {
            method: 'POST',
            // Create the request body for btcpay
            body: {
              currency,
              amount: getAmount(),
              metadata: {
                // The order id is the concatenation of the service slug and the epoch in seconds of the bookings
                orderId: `${buyerService}-${buyerTime.map(t => new Date(t).getTime()).join('-')}`,
                buyerTime,
                // This is added to show properly formatted time on the btcpay invoice dashboar
                buyerBooking: buyerTime.map(t => nuxtApp.$dayjs(t).format('llll')).join('\n'),
                buyerExtras: buyerExtras.map(extra => extra.title).join('\n'),
                buyerName,
                buyerEmail,
                buyerFingerprint,
                buyerPGP,
                buyerDetails,
                buyerLanguage: locale,
                buyerService,
                buyerGateway
              },
              checkout: {
                // Expiration 1 minutes for test purpose only
                // Remove it when done
                expirationMinutes,
                monitoringMinutes,
                redirectAutomatically: false,
                requiresRefundEmail: email === 'required'
              }
            }
          });

          // Create the webhhok for notification about the invoice
          // With the same id of the invoiceId
          // The secret and url are added serverside
          await $fetch('/api/webhooks', {
            method: 'POST',
            body: {
              id: invoiceId,
            }
          });

          // Navigate to the invoice page
          await navigateTo({
            path: `/${locale}/invoice/${invoiceId}`
          });
        };
      }
    }
  }
})