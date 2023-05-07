## Features
- Self custodial solution with btcpay server integration.  
- Supports on-chain and Lighning Network payments. 
- Optionally supports shitcoins (altcoins and fiat) ith the maechant always receiving bitcoins.  
- Unlimited services and unlimited extras for each service.  
- Supports any service duration, from 1 minutes to multiple days.  
- Static generate pages without cookies.   
- No database to hack. The project is fully git based.  
- Performaces optimezed: it scores green an all Google Lighthouse tests.  
- SEO optimized:  
- Multilingual: English, Spanish and Italian out of the box with the easy option to add additional translations.   

## Setup in 10 steps
1. Clone the repo.  
2. Optionally make the repo private. The bookings are git based. If you keep it public anyone can see your confirmed booking and repo settings.  
3. Set the environment variables:  
4. Edit the repo configuration in `./content/settings.yaml` accordingly to your needs. The file is commented to explain each setting meaning.  
5. Create one file for each service inside `./content` folder and the language subfolder. Optionally, if you want to show the services in a specific order, add the order number at the beginning of the name followed by a dot.  
6. Deploy on Vercel with default `./package.json` settings or adapt them to deploy on any other provider.  
7. Set the enviroment variables as in the `./.env.example` file.  
8. Set a custom color in the first line of `./assets/scss/custom.scss`.  
9. Optionally add or remove languages support:  
10. Star ⭐ this repo and deploy your booking system with ₿tcpay Server!   

