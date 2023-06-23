Booking system for any type of service that requires a calendar, from an online class to a room reservation.  
For bitcoiners, KYC free, self custodial.  
The client can pay in bitcoin, crypto and fiat and the merchant always receives bitcoin.  
Without KYC requiremenets for the merchant and the client. Merchant personal information are never shared, not even to receive fiat payments like SEPA or Pix.  
[Demo](booking.learntheropes.xyz)

## Status
Under active development.

## Features
- Self custodial solution with btcpay server integration.  
- Supports on-chain and Lighning Network payments. 
- Optionally supports shitcoins (altcoins and fiat) with the merchant always receiving bitcoins.  
- Unlimited services and unlimited extras for each service.  
- Supports any service duration, from 1 minutes to multiple days.  
- Static generate pages without cookies.   
- Multilingual: English, Spanish and Italian out of the box with the easy option to add additional translations.   

## Payment methods, fees and development status
- Bitcoin: onchain and lightning network, no fee. Fully implemented.  
- Crypto: all the currencies supported by [SideShift](https://sideshift.ai/eth/btc), unclear fee, probably between 0.5% and 1% paid by the buyer. Not implemented yet but planned.  
- Fiat: I will support only fiat methods not requiring KYC and with the merchant personal info not visible to buyers (proxy services):   
  - SEPA (EU) in EUR and CHF, fee about 1.5% paid by the buyer. Implemented.  
  - PIX (Brazil) in BRL. Fee unknown yet, paid by the buyer. Planned with proxy under development.  
  - Credit/debit cards (worldwide). Evaluating available services. Uncertain implementation.

## Setup
1. Clone the repo.  
2. Edit the repo configuration in `./content/settings.yaml` accordingly to your needs. The file is commented to explain each setting meaning. 
3. Create a `profile.md` file inside each `./content` folder and the language subfolder. Check [this](https://github.com/learntheropes/btcpay-booking/blob/main/content/en/profile.md?plain=1) file comments for available settings.
This is optional. If you want to skip the profile and offer just one service, you can set the `DEFAULT_SERVICE` env variable to the service file name.
4. Create one file for each service inside each `./content` folder and the language subfolder. Check [this](https://github.com/learntheropes/btcpay-booking/blob/main/content/en/services/1.paraguay-residency.md?plain=1) file comments for available settings.
Optionally, if you want to show the services in a specific order, add the order number at the beginning of the name followed by a dot, eg `1.my-service.md` 
5. Set the enviroment variables as in the `./.env.example` file.  
6. Optionally set a custom color in the [first line](https://github.com/learntheropes/btcpay-booking/blob/de5be9f24fe72c59a8f10557451a8af0afbdd601/assets/scss/custom.scss#L1) of `./assets/scss/custom.scss`.  
7. Optionally add or remove languages support by adding/removing translations in `./lang` folder and settings in `./assets/js/locale.js` `locales` [json object](https://github.com/learntheropes/btcpay-booking/blob/de5be9f24fe72c59a8f10557451a8af0afbdd601/assets/js/locales.js#L3C5-L26C3). 
8. Deploy (Digital Ocean app platform is supported out of the box, Vercel is supported with a few settings change that I will document soon, Self hosting is supported if you know how to build and deploy a Nuxt application).  

## BTCPay instance
If you don't have a btcpay instance, feel free to [email](mailto:giovanni@learntheropes.xyz) me optionally with [PGP](https://keys.openpgp.org/vks/v1/by-fingerprint/5BA78A510CDA44132BDC51FA58C798100FF8A743) and I will invite you to create an account/store on my btcpay server.

## Contribution
The most valuable contributions at the moment are:
  - Open an issue to suggest available services for fiat payment methods: I need external services providing API and not requiring KYC. The service should be able to receive a local payment method in any country and send the purchased bitcoins to an onchain address or LN invoice provided by us programmatically. The more remote countries we cover, the better it is.
  - Feedbacks and bugs report: what would you like to see implemeneted. Feel free to open an issue.  

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%202.svg)](https://www.digitalocean.com/?refcode=1930033771d7&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

Project inspired by [**BitPagos**](https://web.archive.org/web/20141225131358/https://www.bitpagos.com/es/) and [**LNCal**](https://lncal.com/).
