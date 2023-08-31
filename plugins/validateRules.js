import { defineRule, configure } from "vee-validate";
import { localize  } from '@vee-validate/i18n';
import { required, email } from '@vee-validate/rules';

import en from '@vee-validate/i18n/dist/locale/en.json';
import es from '@vee-validate/i18n/dist/locale/es.json';
import it from '@vee-validate/i18n/dist/locale/it.json'

export default defineNuxtPlugin(nuxtApp => {

  // configure localized messages
  configure({
    generateMessage: localize({
      en,
      es,
      it
    }),
  });

  // Define default rules
  defineRule('required', required);
  defineRule('email', email);
});

