import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
// import { locales } from '~/assets/js/locales'

// Import in the classic way
// waiting that this is answered
// https://github.com/iamkun/dayjs/issues/2301
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/it'

// locales.map(locale => import(`dayjs/locale/${locale.code}`) )


export default defineNuxtPlugin(nuxtApp => {

  // import in parallel all the needed localized dates
  // https://vitejs.dev/guide/features.html#glob-import-as
  // const modules = import.meta.glob('../node_modules/dayjs/locale/*.js',  {
  //   eager: true
  // });

  // To use fromNow and toNow functions
  dayjs.extend(relativeTime);

  // Initial dayjs localization setup
  const { locale } = nuxtApp.$i18n;
  // modules[`../node_modules/dayjs/locale/${locale.value}.js`];
  dayjs.locale(locale.value);

  // Update dayjs language on locale switch
  nuxtApp.$i18n.onBeforeLanguageSwitch = (_oldLocale, newLocale, _isInitialSetup, _nuxtApp) => {

    // Require the localization file and switch language.
    // modules[`../node_modules/dayjs/locale/${newLocale}.js`];
    dayjs.locale(newLocale);
  };

  return {
    provide: {
      dayjs,
    }
  };
})