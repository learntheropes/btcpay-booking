import { nodePolyfills } from 'vite-plugin-node-polyfills';

import {
  locales,
  localeCodes,
  defaultLocale,
  routeRules
} from './assets/js/locales'

const isDev = process.env.NODE_ENV !== 'production'
const isDeployed = process.env.DEPLOYMENT_DOMAIN && process.env.DEPLOYMENT_DOMAIN !== 'http://localhost:3000'
const deploymentDomain = (isDeployed) ? `https://${process.env.DEPLOYMENT_DOMAIN}` : 'http://localhost:3000'

export default defineNuxtConfig({

  // debug: (isDeployed) ? false : true,

  // Settings specific for production
  $production: {

    // Static routes and cors
    routeRules,

    // Use umami analytics
    extends: [
      'nuxt-umami'
    ],
  },

  // Head script default tags
  app: {
    head: {
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        {
          id: 'googlebot',
          name: 'googlebot',
          content: 'notranslate'
        },
        {
          id: 'og:type',
          name: 'og:type',
          content: 'website'
        },
        {
          id: 'og:url',
          name: 'og:url',
          content: deploymentDomain
        },
        {
          id: 'og:site_name',
          name: 'og:site_name',
          content: 'btcpay-booking'
        },
        {
          id: 'og:image',
          name: 'og:image',
          content: `${deploymentDomain}/favicon/favicon.png`
        },
        {
          id: 'twitter:card',
          name: 'twitter:card',
          content: 'summary'
        },
        {
          id: 'twitter:image',
          name: 'twitter:image',
          content: `${deploymentDomain}/favicon/favicon.png`
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon/favicon.ico'
        },
      ]
    },
  },

  // Define the private and public env variables
  runtimeConfig: {
    ngrokToken: process.env.NGROK_TOKEN,
    btcpayApikey: process.env.BTCPAY_APIKEY,
    pusherSecret: process.env.PUSHER_SECRET,
    smtpPassword: process.env.SMTP_PASSWORD,
    public: {
      defaultService: process.env.DEFAULT_SERVICE,
      isDev,
      isDeployed,
      deploymentDomain,
      pusherApikey: process.env.PUSHER_APIKEY,
      pusherCluster: process.env.PUSHER_CLUSTER,
      pusherAppId: process.env.PUSHER_APP_ID
    }
  },

  // Import the scss srylesheets
  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/mdi.scss',
    // "@mdi/font/css/materialdesignicons.css"
  ],

  // Skip the folders in the components import
  components: [{
    path: '~/components',
    pathPrefix: false,
    global: true
  }],

  // Import the nuxt modules
  modules: [
    'nuxt-simple-robots',
    'nuxt-simple-sitemap',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/image',
    'nuxt-icons',
    '@nuxtjs/device',
    'nuxt-delay-hydration'
  ],

  // Robots settings
  robots: {
    userAgents: ['*'],
    disallow: ['/cdn-cgi', ...localeCodes.map(code => `/${code}/invoice`)],
    sitemap: `${deploymentDomain}/sitemap_index.xml`
  },

  // Sitemap settings
  sitemap: {
    xsl: false,
    autoI18n: false,
    sitemapName: `sitemap_index.xml`
  },

  // Setting for content module with i18n
  content: {
    locales: localeCodes,
    defaultLocale,
  },

  // settings for i18n module
  i18n: {
    baseUrl: deploymentDomain,
    locales,
    defaultLocale,
    lazy: true,
    langDir: 'lang',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: false,
      // Those 2 settings are silly
      // but to work the redirect set in the index.vue page the are needed
      // actual strategy is that it redirects only on home page
      redirectOnRoot: true,
      alwaysRedirect: true,
    }
  },

  // Define the presets for nuxt image module
  image: {
    screens: {
      avatar: 192,
      preview: 192,
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 192,
          height: 192,
          quality: 70
        }
      },
      preview: {
        modifiers: {
          format: 'webp',
          fit: 'cover',
          width: 192,
          height: 192,
          quality: 70
        }
      }
    }
  },

  // Delay hidration to deastically improve google loghhouse performance score
  delayHydration: {
    mode: 'init',
    exclude: localeCodes.map(code => `/${code}/invoice/**`),
    debug: process.env.NODE_ENV === 'development'
  },

  // Enanble the storage layer on nitro server
  // Filesystem on development
  // Github on production
  nitro: {
    devStorage: {
      lang: {
        driver: 'fs',
        base: './lang'
      },
      content: {
        driver: 'fs',
        base: './content'
      }
    },
    storage: {
      lang: {
        driver: 'github',
        repo: process.env.GITHUB_REPO,
        branch: 'main',
        dir: '/lang',
      },
      content: {
        driver: 'github',
        repo: process.env.GITHUB_REPO,
        branch: 'main',
        dir: '/content',
      }
    }
  },

  vite: {
    // This is needed to inject bulma custom sass variables such as $primary 
    // in the css page and component stylesheets 
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/custom.scss" as *;'
        }
      }
    },
    // Include nodejs module that are purged by vite in the browser by default
    plugins: [
      nodePolyfills({
        include: [
          'buffer', 
          'util', 
          'stream', 
          'crypto'
        ],
        globals: {
          process: false,
        }
      }),
    ]
  },

  appConfig: {

    // id and host provided as env variables on production
    umami: {
      version: 2,
    },
  },
});
