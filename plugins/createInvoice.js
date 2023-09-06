export default defineNuxtPlugin(nuxtApp => {

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
        buyerGateway,
        buyerGateway: {
          gatewayType,
          gatewayMethod,
          gatewayCurrency
        },
        buyerFiatCurrency,
        buyerFiatRate,
        buyerFiatDecimal
      }) => {

        // Get buyer locale
        const { locale } = nuxtApp.$i18n;

        // Get the service specific settings from md file
        const  {
          currency,
          price,
        } = await queryContent(`/services/${buyerService}`).locale(locale.value).findOne();


        // Get merchant email requirement settings
        const {
          fields: {
            email
          }
        } = await queryContent(`/settings`).findOne();

        const getAmount = () => {

          const time = buyerTime.length * price;
          const extras = (buyerExtras.length) ? buyerExtras.reduce((sum, extra) => sum + extra.price, 0) : 0;
          return (time + extras).toFixed(buyerFiatDecimal);
        };

        // Workaround to avoid posting a duplicate invoice with 0 value
        // Apparently is not due to server client. Needs better investigation
        if (Number(getAmount()) !== 0) {

          // Set expirationMinutes and monitoringMinutes based on the gateway
          // For bitcoin, leave the btcpay store settings.
          let expirationMinutes, monitoringMinutes
          switch(gatewayType) {
            case 'fiat':
              expirationMinutes = 60 * 24 * 2;
              monitoringMinutes = 60 * 24 * 3;
              break;
            case 'crypto':
              expirationMinutes = 60;
              monitoringMinutes = 60 * 5;
              break;
            default:
              expirationMinutes = null;
              monitoringMinutes = null;  
          }
          
          
          // Create the invoice on btcpay Greenfield api
          // And get the invoiceId page
          const { data } = await useFetch('/api/invoices', {
            method: 'POST',
            // Create the request body for btcpay
            body: {
              currency,
              amount: getAmount(),
              metadata: {
                // The order id is the concatenation of the service slug and the epoch in seconds of the bookings
                orderId: `${buyerService}-${buyerTime.map(t => new Date(t).getTime()).join('-')}`,
                buyerTime,
                // This is added to show properly formatted time on the btcpay invoice dashboard
                buyerBookingTime: buyerTime.map(t => nuxtApp.$dayjs(t).format('llll')).join('\n'),
                buyerExtras,
                // This is added to show extras on the btcpay invoice dashboard
                buyerBookingExtras: buyerExtras.map(extra => extra.title).join('\n'),
                buyerName,
                buyerEmail,
                buyerFingerprint,
                buyerPGP,
                buyerDetails,
                buyerLanguage: locale.value,
                buyerService,
                buyerGateway
              },
              checkout: {
                expirationMinutes,
                monitoringMinutes,
                redirectAutomatically: false,
                requiresRefundEmail: email === 'required'
              }
            }
          });
          const invoiceId = data.value.id

          // Create the webhhok for notification about the invoice
          // The id and url are added serverside depending by the enviroment
          // The secret is also added serverside for security
          await useFetch('/api/webhooks', {
            method: 'POST'
          });

          // Navigate to the invoice page
          await navigateTo({
            path: `/${locale.value}/invoice/${invoiceId}`
          });
        };
      }
    }
  }
});
