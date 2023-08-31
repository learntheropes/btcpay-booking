import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/it'

export default defineNuxtPlugin(async nuxtApp => {

  // To use fromNow and toNow functions
  dayjs.extend(relativeTime);

  // To use localized date
  dayjs.extend(localizedFormat);

  // Initial dayjs localization setup
  const { locale } = nuxtApp.$i18n;
  dayjs.locale(locale.value);

  // Update dayjs language on locale switch
  nuxtApp.$i18n.onLanguageSwitched = (_oldLocale, newLocale) => {

    dayjs.locale(newLocale);
  };

  return {
    provide: {
      dayjs,
    }
  };
});


