import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {

  // Fix the surcharge for shitcoins gateway 
  // Also referenced in components/invoice/invoiceSelector.vue
  const surcharge = 5;

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
        } = await queryContent(`/services/${buyerService}`).locale(locale).findOne()

        // Get merchant email requirement settings
        const {
          fields: {
            email
          }
        } = await queryContent(`/settings`).findOne();


        // Set the expiration and monitoring in minutes for shitcoins based on the gateway selected
        // Leave the btcpay store default for bitcoin
        let expirationMinutes, monitoringMinutes
        switch(buyerGateway) {
          case 'altcoins':
            expirationMinutes = 60
            monitoringMinutes = 60 * 24
            break;
          case 'fiat':
            expirationMinutes = 60 * 24 * 2
            monitoringMinutes = 60 * 24 * 7
            break;
          default:
            expirationMinutes = null
            monitoringMinutes = null
        }

        const getAmount = () => {

          // Define the decimal length based on the currency
          let decimal
          switch(currency) {
            case 'BTC':
              decimal = 8
              break;
            case 'SATS':
              decimal = 0
              break;
            case 'ARS':
              decimal = 0
              break;
            default:
              decimal = 2
          }

          const time = buyerTime.length * price
          const extras = (buyerTime.length) ? buyerExtras.reduce((sum, extra) => sum + extra.price, 0) : 0
          const moltiplicator = (buyerGateway === 'bitcoin') ? 1 : (1 + (surcharge / 100))
          return ((time + extras) * moltiplicator).toFixed(decimal)
        } 
      
        // Create the invoice on btcpay Greenfield api
        // And get the invoiceId page
        const { id: invoiceId } = await $fetch('/api/invoices', {
          method: 'POST',
          // Create the request body for btcpay
          body: {
            currency,
            amount: getAmount(),
            metadata: {
              orderId: `${buyerService}-${buyerTime.map(t => new Date(t).getTime()).join('-')}`,
              buyerTime,
              buyerExtras: buyerExtras.map(extra => extra.title).join(', '),
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
        const webhook = await $fetch('/api/webhooks', {
          method: 'POST',
          body: {
            id: invoiceId,
          }
        });

        // Navigate to the invoice page
        await navigateTo({
          path: `/${locale}/invoice/${invoiceId}`
        });
      }
    }
  }
})