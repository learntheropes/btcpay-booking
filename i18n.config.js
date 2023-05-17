import {
  defaultLocale,
} from './assets/js/locales'

export default defineI18nConfig(nuxt => ({
  detectBrowserLanguage: {
    useCookie: false,
    redirectOnRoot: true,
    // alwaysRedirect: true
    fallbackLocale: defaultLocale
  }
}));
