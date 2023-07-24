import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

export default defineNuxtPlugin(async nuxtApp => {  

  dayjs.extend(relativeTime);
  dayjs.extend(localizedFormat);

  const { locale } = nuxtApp.$i18n;
  import(`../node_modules/dayjs/${locale.code}.js`); 
  dayjs.locale(locale.value); 

  nuxtApp.$i18n.onLanguageSwitched = (_oldLocale, newLocale) => {

    import(`../node_modules/dayjs/${newLocale}.js`); 
    dayjs.locale(newLocale);
  };

  return {
    provide: {
      dayjs,
    }
  };
});


