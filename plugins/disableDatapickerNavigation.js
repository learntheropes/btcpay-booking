import { defineNuxtPlugin } from '#app';
import { onMounted } from 'vue';

// Ugly workaound waiting that this is approved
// https://github.com/oruga-ui/oruga/issues/516
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {

      // Disable the previous icon on mount.
      disableDatapickerNavigationOnMount: () => {
        onMounted(() => {
          const selector = "form > div:nth-child(1) > div > div > div > div > header > div > a.pagination-previous";
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            const span = element.firstChild;
            element.setAttribute('disabled', true);
            span.className = 'icon is-unselectable is-unclickable';
          })
        })
      },

      // disable/enable the icon on navitation.
      updateDatapickerNavigation: (formName, calendarMonth, calendarYaer) => {
        const selector = `form[name="${formName}"] > div:nth-child(1) > div > div > div > div > header > div > a.pagination-previous`;
        const element = document.querySelector(selector);
        const span = element.firstChild;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        if (`${calendarMonth}-${calendarYaer}` === `${currentMonth}-${currentYear}`) {
          element.setAttribute('disabled', true);
          span.className = 'icon is-unselectable is-unclickable';
        }
        else {
          element.removeAttribute('disabled');
          span.className = 'icon';
        };        
      }
    }
  }
});

