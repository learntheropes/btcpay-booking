import { defineRule, configure } from "vee-validate";
import { localize  } from '@vee-validate/i18n';
import { required, email } from '@vee-validate/rules';
import { locales } from '../assets/js/locales';

export default defineNuxtPlugin(nuxtApp => {

  const localizeMessages = locales.reduce((obj, locale) => {

    switch(locale.code) {
      case 'ms':
        locale.code = 'ms_MY'
        break;
      case 'nb':
        locale.code = 'nb_NO'
        break;
      case 'nb':
        locale.code = 'nb_NO'
        break;
      case 'br':
        locale.code = 'pt_BR'
        break;
      case 'pt':
        locale.code = 'pt_PT'
        break;
      case 'sr':
        locale.code = 'sr_Latin'
        break;
      case 'cn':
        locale.code = 'zh_CN'
        break;
      case 'tw':
        locale.code = 'zh_TW'
        break;
    }
    const module = import(`../node_modules/@vee-validate/i18n/dist/locale/${locale.code}.json`)

    obj[locale.code] = module;
    return obj;
  }, {});

  // configure localized messages
  configure({
    generateMessage: localize(localizeMessages),
  });

  // Define default rules
  defineRule('required', required);
  defineRule('email', email);
});

