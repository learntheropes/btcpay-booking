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
          content: '/favicon/favicon.png'
        },
        {
          id: 'twitter:card',
          name: 'twitter:card',
          content: 'summary'
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

  runtimeConfig: {
    mnemonic: process.env.MNEMONIC,
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
      pusherAppId: process.env.PUSHER_APP_ID,
      network: process.env.NETWORK
    }
  },

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
    '@nuxt/devtools',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/image',
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
    detectBrowserLanguage: {
      useCookie: false,
      // Those 2 settings are silly
      // but to work the redirect set in the index.vue page the are needed
      // actual strategy is that it redirects only on home page
      redirectOnRoot: true,
      alwaysRedirect: true,
    }
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
