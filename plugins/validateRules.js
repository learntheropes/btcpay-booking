import { defineRule, configure } from "vee-validate";
import { localize  } from '@vee-validate/i18n';
import { required, email } from '@vee-validate/rules';
import { locales } from '../assets/js/locales';

export default defineNuxtPlugin(nuxtApp => {

  // import in parallel all the needed localized messages
  // https://vitejs.dev/guide/features.html#glob-import-as
  const modules = import.meta.glob('../node_modules/@vee-validate/i18n/dist/locale/*.json',  {
    import: 'default',
    as: 'raw',
    eager: true
  });
  
  // build the localization object
  const localizeMessages = locales.reduce((obj, locale) => {

    obj[locale.code] = JSON.parse(modules[`../node_modules/@vee-validate/i18n/dist/locale/${locale.validate}.json`])
    return obj
  }, {});

  // configure localized messages
  configure({
    generateMessage: localize(localizeMessages),
  });

  // Define default rules
  defineRule('required', required);
  defineRule('email', email);
});

