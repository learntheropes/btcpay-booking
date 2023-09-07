Booking system for any type of service that requires a calendar, from an online class to a room reservation.  
For bitcoiners, KYC free, self custodial.  
The client can pay in bitcoin, crypto and fiat and the merchant always receives bitcoin.  
Without KYC requiremenets for the merchant and the client. Merchant and buyer personal information are never shared with the counterparty.  
[Demo](https://booking.learntheropes.xyz)

## Status
Under active development.  
- [x] Profile and services settings.
- [x] Btcpay server api integration.
- [x] Bitcoin checkout. On-chain and Lighning Network.
- [/] Fiat integration with Peach Bitcoin api. Under current development.
- [] Crypto integration with SideShift api. Planned.
- [] Merchant control panel. Planned

## Features
- Self custodial solution with btcpay server integration.  
- Supports on-chain and Lighning Network payments. 
- Optionally supports shitcoins (altcoins and fiat) with the merchant always receiving bitcoins.  
- Unlimited services and unlimited extras for each service.  
- Supports any service duration, from 1 minutes to multiple days.  
- Static generate pages without cookies.   
- Multilingual: English, Spanish and Italian out of the box with the easy option to add additional translations. 

## Target
- Bitcoin enthusiasts: you believe in Bitcoin sound money but at the same time you know that Bitcoin is not widely used as you wish. This tool allows you to reach the traditional market without touching shitcoins.  
- High risk businesses: you are involved in legal high risk business such as adult or cannabis consultancy and you can't find a traditional payment gateway supporting your business.  
- Unbanked and sanctioned: you are unbanked, or you live in a country that has not easy access to popular payment processors like Stripe, because your country is unsupported or even sanctioned.  
- Emerging markets: you want to expand your virtual service business to emerging markets like LATAM and Africa and you lack of a reliable payment gateway.

## Payment methods, fees, limit per payment.
- Bitcoin: onchain and lightning network, no fee. No amount limit.  
- Crypto: all the currencies supported by [SideShift](https://sideshift.ai), unclear fee, probably between 0.5% and 1% paid by the buyer. No amount limit.  
- Fiat: All the currencies and local payment methods supported by [Peach Bitcoin](https://peachbitcoin.com) as listed [here](https://api.peachbitcoin.com/v1/info), the fee is set by the merchant and paid by the buyer. realistically, to find a match it should be between 2 and 5%, plus 2% Peach fee. 1000 CHF (or equivalent in other currency) amount limit for each payment.  

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
Commits to the code are appreciated. Please [sign](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) your commit.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%202.svg)](https://www.digitalocean.com/?refcode=1930033771d7&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

Project inspired by [**BitPagos**](https://web.archive.org/web/20141225131358/https://www.bitpagos.com/es/) and [**LNCal**](https://lncal.com/).
