import { Form, Field } from 'vee-validate';
import { setLocale } from '@vee-validate/i18n';

export default defineNuxtPlugin(nuxtApp => {

  // Add the needed components to Nuxt
  nuxtApp.vueApp.component("VForm", Form);
  nuxtApp.vueApp.component("VField", Field);
  // nuxtApp.vueApp.component("VErrorMessage", ErrorMessage);

  // Initial vee-validate localization setup
  const { locale } = nuxtApp.$i18n;
  setLocale(locale.value);

  // Update error messages language on locale switch
  nuxtApp.$i18n.onBeforeLanguageSwitch = (_oldLocale, newLocale, _isInitialSetup, _nuxtApp) => {
    setLocale(newLocale);
  };
});

