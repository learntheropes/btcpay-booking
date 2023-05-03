import {
  locales,
  localeCodes,
  defaultLocale,
  staticRouteRules
} from './assets/js/locales'

// import startSocketServer from './server/sockets/index.js'

const isDev = process.env.NODE_ENV !== 'production'
const iDeployed = process.env.DEPLOYMENT_DOMAIN
const deploymentDomain = (iDeployed) ? `https://${process.env.DEPLOYMENT_DOMAIN}` : 'http://localhost:3000'

export default defineNuxtConfig({

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

  routeRules: staticRouteRules,

  runtimeConfig: {
    btcpayApikey: process.env.BTCPAY_APIKEY,
    pusherSecret: process.env.PUSHER_SECRET,
    smtpPassword: process.env.SMTP_PASSWORD,
    public: {
      isDev,
      iDeployed,
      // nakedDeplymentDomain: process.env.DEPLOYMENT_DOMAIN,
      deploymentDomain,
      pusherApikey: process.env.PUSHER_APIKEY,
      pusherCluster: process.env.PUSHER_CLUSTER,
      pusherAppId: process.env.PUSHER_APP_ID,
      ngrokUrl: process.env.NGROK_URL,
    }
  },

  pages: true,

  css: [
    '~/assets/scss/main.scss',
    '~/assets/css/mdi.css',
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
    vueI18n: {
      detectBrowserLanguage: {
        useCookie: false,
        redirectOnRoot: true,
        // alwaysRedirect: true
        fallbackLocale: defaultLocale
      }
    }
  },

  image: {
    screens: {
      avatar: 128,
      galleryPreview: 128,
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 128,
          height: 128
        }
      },
      preview: {
        modifiers: {
          format: 'webp',
          fit: 'cover',
          width: 128,
          height: 128
        }
      },
      modal: {
        modifiers: {
          format: 'webp',
          quality: 70
        }
      }
    }
  }
});
