import { locales } from '~/assets/js/locales';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// import { locales } from '~/assets/js/locales'

// Require localized messages
// https://github.com/iamkun/dayjs/issues/2301
locales.map(locale => require(`dayjs/locale/${locale.code}`));

export default defineNuxtPlugin(nuxtApp => {

  // To use fromNow and toNow functions
  dayjs.extend(relativeTime);

  // To use localized date
  dayjs.extend(localizedFormat);

  // Initial dayjs localization setup
  const { locale } = nuxtApp.$i18n;
  // modules[`../node_modules/dayjs/locale/${locale.value}.js`];
  dayjs.locale(locale.value);

  // Update dayjs language on locale switch
  nuxtApp.$i18n.onBeforeLanguageSwitch = (_oldLocale, newLocale, _isInitialSetup, _nuxtApp) => {

    // Switch language.
    dayjs.locale(newLocale);
  };

  return {
    provide: {
      dayjs,
    }
  };
})