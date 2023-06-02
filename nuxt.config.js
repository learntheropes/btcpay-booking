import {
  locales,
  localeCodes,
  defaultLocale,
  routeRules
} from './assets/js/locales'

const isDev = process.env.NODE_ENV !== 'production'
const isDeployed = (process.env.DEPLOYMENT_DOMAIN) ? true : false
const deploymentDomain = (isDeployed) ? `https://${process.env.DEPLOYMENT_DOMAIN}` : 'http://localhost:3000'

export default defineNuxtConfig({

  // Settings specific for production
  $production: {

    // Static routes and cors
    routeRules,

    // Use umami analytics
    extends: [
      'nuxt-umami'
    ],
  },

  app: {
    head: {
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        }
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

  runtimeConfig: {
    mnemonic: process.env.MNEMONIC,
    btcpayApikey: process.env.BTCPAY_APIKEY,
    pusherSecret: process.env.PUSHER_SECRET,
    smtpPassword: process.env.SMTP_PASSWORD,
    public: {
      isDev,
      isDeployed,
      deploymentDomain,
      pusherApikey: process.env.PUSHER_APIKEY,
      pusherCluster: process.env.PUSHER_CLUSTER,
      pusherAppId: process.env.PUSHER_APP_ID,
      network: process.env.NETWORK
    }
  },

  pages: true,

  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/mdi.scss',
    // "@mdi/font/css/materialdesignicons.css"
  ],

  components: [{
    path: '~/components',
    pathPrefix: false,
    global: true
  }],

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/image-edge',
    'nuxt-icons'
  ],

  content: {
    locales: localeCodes,
    defaultLocale,
  },

  i18n: {
    baseUrl: deploymentDomain,
    locales,
    defaultLocale,
    lazy: true,
    langDir: 'lang',
    strategy: 'prefix',
    vueI18n: './i18n.config.js'
  },

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
      },
      modal: {
        modifiers: {
          format: 'webp',
          quality: 70
        }
      }
    }
  },

  appConfig: {

    // id and host provided as env variables on production
    umami: {
      version: 2,
    },
  },
});
