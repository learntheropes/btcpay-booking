## Features
- Self custodial solution with btcpay server integration.  
- Supports on-chain and Lighning Network payments.
- Unlimited services and unlimited extras for each service.
- Supports any service duration, from 1 minutes to multiple days.
- Static generate pages without cookies.   
- No database do hack. The project is fully git based.  
- Performaces optimezed: it scores 100 an all  Google Lighthouse tests.  
- SEO optimized: 
- Multilingual: English, Spanish and Italian out of the box with the easy option to add additional translations.   

## Complete setup in 10 steps
1. Clone the repo.  
2. Optionally make the repo private. The bookings are git based. If you keep it public anyone can see your confirmed booking and repo settings.
3. Set the environment variables:
  1. BTCPAY_APIKEY
  2. SMTP_PASSWORD
  3. DEPLOYMENT_DOMAIN (set this only on production, e.g. on Vercel, not locally)
4. Edit the repo configuration in `./content/settings.yaml` accordingly to your needs. The file is commented to explain each setting meaning.
5. Create one file for each service inside `./content` folder and the language subfolder. Optionally, if you want to show the services in a specific order, add the order number at the beginning of the name followed by a dot. 
6. Deploy on Vercel with default `./package.json` settings or adapt them to deploy on any other provider.
7. Set the enviroment variables as in the `./.env.example` file.
8. Set a custom color in the first line of `./assets/scss/custom.scss`
9. Optionally add or remove languages support:  
  1. In the file `./assets/js/locales`. Only the first variable needs to be updated.
  2. In the folder `./lang` there are the transaltions. Just copy one of the file, rename it with the code of the language and transalte it. 
10. Star ⭐ this repo and deploy your booking system with ₿tcpay Server! 

## Git based and Github Token setup
For semplicity, this repo does not uses a database.   
Settings and bookings are git based.   
It works locally in development mode and on Github on production.  
For this reason you need to set a Github Personal access token. 
Follow the instructions to generate a restricted token with the required permissions only granted to this repo. 
