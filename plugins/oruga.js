import { defineNuxtPlugin } from '#app';
import {
  OField,
  ODatepicker,
  OInput,
  OSelect,
  OCheckbox,
  OButton,
  OModal,
  OCollapse,
  ONotification,
  OIcon,
  OLoading,
  Config,
} from '@oruga-ui/oruga-next';
import { bulmaConfig } from '@oruga-ui/theme-bulma';

// When the notification is opened programmatically, it shows on the bottom right
const myConfig = Object.assign(bulmaConfig, {
  notification: {
      ...bulmaConfig.notification,
      position: 'bottom-right'
  }
})

// Import the used oruga components
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('OField', OField);
  nuxtApp.vueApp.component('ODatepicker', ODatepicker);
  nuxtApp.vueApp.component('OInput', OInput);
  nuxtApp.vueApp.component('OSelect', OSelect);
  nuxtApp.vueApp.component('OCheckbox', OCheckbox);
  nuxtApp.vueApp.component('OButton', OButton);
  nuxtApp.vueApp.component('OModal', OModal);
  nuxtApp.vueApp.component('OCollapse', OCollapse);
  nuxtApp.vueApp.component('ONotification', ONotification);
  nuxtApp.vueApp.component('OIcon', OIcon);
  nuxtApp.vueApp.component('OLoading', OLoading);
  nuxtApp.vueApp.use(Config, myConfig);
});

