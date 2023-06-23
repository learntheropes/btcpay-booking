Booking system for any type of service that requires a calendar, from an online class to a room reservation.  
For bitcoiners, KYC free, self custodial.  
The client can pay in bitcoin, crypto and fiat and the merchant always receives bitcoin.  
Without KYC requiremenets for the merchant and the client. Merchant personal information are never shared, not even to receive fiat payments like SEPA  
[Demo](booking.learntheropes.xyz)

## Status
Under active development,

## Features
- Self custodial solution with btcpay server integration.  
- Supports on-chain and Lighning Network payments. 
- Optionally supports shitcoins (altcoins and fiat) with the merchant always receiving bitcoins.  
- Unlimited services and unlimited extras for each service.  
- Supports any service duration, from 1 minutes to multiple days.  
- Static generate pages without cookies.   
- Multilingual: English, Spanish and Italian out of the box with the easy option to add additional translations.   

## Setup
1. Clone the repo.  
2. Edit the repo configuration in `./content/settings.yaml` accordingly to your needs. The file is commented to explain each setting meaning. 
3. Create a `profile.md` file inside each `./content` folder and the language subfolder. This is optional. If you want to skip the profile and offer just one service, you can set the `DEFAULT_SERVICE` env variable to the service file name.
4. Create one file for each service inside each `./content` folder and the language subfolder. Optionally, if you want to show the services in a specific order, add the order number at the beginning of the name followed by a dot.  
5. Deploy on Digital Ocean or Vercel with default `./package.json` settings or adapt them to deploy on any other provider.  
6. Set the enviroment variables as in the `./.env.example` file.  
7. Set a custom color in the first line of `./assets/scss/custom.scss`.  
8. Optionally add or remove languages support by adding, removing translations in `./lang` folder and settings in `./assets/js/locale.js` `locales` json object. 
9. Deploy your booking system with Btcpay Server!  

## BTCPay instance
If you don't have a btcpay instance, feel free to [email](mailto:giovanni@learntheropes.xyz) me optionally with [PGP](https://keys.openpgp.org/vks/v1/by-fingerprint/5BA78A510CDA44132BDC51FA58C798100FF8A743) and I will create an account/store on my btcpay server for you.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%202.svg)](https://www.digitalocean.com/?refcode=1930033771d7&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

Inspired by **BitPagos** and **LNCal**
