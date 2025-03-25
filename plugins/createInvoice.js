
export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      createInvoice: async ({
        bookingTime,
        bookingExtras,
        bookingName,
        bookingEmail,
        bookingFingerprint,
        bookingPGP,
        bookingDescription,
        bookingService,
        bookingGatewayType,
        bookingGatewayPaymentMethod,
        bookingFiatCurrency,
        bookingFiatRate,
        bookingFiatDecimal,
        bitcoinExhangeRate,
        bookingBitcoinAmount,
        bookingFiatAmount
      }) => {

        // Get buyer locale
        const { locale } = nuxtApp.$i18n;

        // Get merchant email requirement settings
        const {
          fields: {
            email
          }
        } = await queryContent(`/settings`).findOne();

        const { duration } = await queryContent(`/services/${bookingService}`).findOne();

        // Set expirationMinutes and monitoringMinutes based on the gateway
        // For bitcoin, leave the btcpay store settings.
        let expirationMinutes, monitoringMinutes
        switch(bookingGatewayType) {
          case 'fiat':
            expirationMinutes = 60 * 24 * 2;
            monitoringMinutes = 60 * 24 * 3;
            break;
          // case 'crypto':
          //   expirationMinutes = 60;
          //   monitoringMinutes = 60 * 5;
          //   break;
          default:
            expirationMinutes = null;
            monitoringMinutes = null;  
        };

        // Create the invoice on btcpay Greenfield api
        // And get the invoiceId page
        const { data } = await useFetch('/api/invoices', {
          method: 'POST',
          // Create the request body for btcpay
          body: {
            currency: bookingFiatCurrency,
            amount: bookingFiatAmount,
            metadata: {
              orderId: `${bookingService}-${new Date(bookingTime[0]).getTime()}`,
              bookingEpochs: bookingTime.map(t => new Date(t).getTime()).join('-'),
              bookingTimeStart: nuxtApp.$dayjs(new Date(bookingTime[0]).getTime()).utc().format('YYYY-MM-DD HH:mm') + ' UTC',
              bookingTimeEnd:  nuxtApp.$dayjs(new Date(bookingTime[bookingTime.length - 1]).getTime()).utc().add(duration, 'minute').format('YYYY-MM-DD HH:mm') + ' UTC',
              bookingExtras: bookingExtras.map(extra => extra.title).join('\n'),
              bookingName,
              bookingEmail,
              bookingFingerprint,
              bookingPGP,
              bookingDescription,
              bookingLanguage: locale.value,
              bookingService,
              bookingGatewayType,
              bookingGatewayPaymentMethod,
              bookingFiatCurrency: bookingFiatCurrency,
              bookingFiatAmount: bookingFiatAmount,
              bookingBitcoinAmount: bookingBitcoinAmount,
              bookingFiatRate,
              bookingFiatDecimal,
              bitcoinExhangeRate,
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
      }
    }
  }
});
