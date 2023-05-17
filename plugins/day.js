// import { locales } from '~/assets/js/locales';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Workaround to import localized messages
// https://github.com/iamkun/dayjs/issues/2301
// https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility
// locales.map(locale => import(`../node_modules/dayjs/locale/${locale.code}.js`));
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/it'
import 'dayjs/locale/de'
import 'dayjs/locale/pt'
import 'dayjs/locale/fr'
import 'dayjs/locale/ru'

export default defineNuxtPlugin(nuxtApp => {

  // To use fromNow and toNow functions
  dayjs.extend(relativeTime);

  // To use localized date
  dayjs.extend(localizedFormat);

  // Initial dayjs localization setup
  const { locale } = nuxtApp.$i18n;
  dayjs.locale(locale.value);

  // Update dayjs language on locale switch
  nuxtApp.$i18n.onLanguageSwitched = (_oldLocale, newLocale) => {
    // Switch language.
    dayjs.locale(newLocale);
  };

  return {
    provide: {
      dayjs,
    }
  };
});
