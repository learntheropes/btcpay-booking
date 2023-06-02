## Under active development
Booking system for any type of service that requires a calendar, from an online class to a room reservation.  
For bitcoiners, KYC free, self custodial.  
The client can pay in bitcoin, crypto and fiat and the merchant always receives bitcoin.  
Without KYC requiremenets for the merchant and the client.  

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
3. Create one file for each service inside `./content` folder and the language subfolder. Optionally, if you want to show the services in a specific order, add the order number at the beginning of the name followed by a dot.  
4. Deploy on Digital Ocean or Vercel with default `./package.json` settings or adapt them to deploy on any other provider.  
5. Set the enviroment variables as in the `./.env.example` file.  
6. Set a custom color in the first line of `./assets/scss/custom.scss`.  
7. Optionally add or remove languages support by adding, removing translations in `./lang` folder and settings in `./assets/js/locale.js` `locales` json object. 
8. Star ⭐ this repo and deploy your booking system with Btcpay Server!  

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%202.svg)](https://www.digitalocean.com/?refcode=1930033771d7&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)
