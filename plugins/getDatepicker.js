import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      getDatepicker: async (disabled = false) => {

        // Min date to now
        const minDate = new Date();

        // Initial set of modelValue to avoid errors
        const modelValue = [];

        // Hide week number
        const showWeekNumber = false;

        // Start the week on Monday
        const firstDayOfWeek = 1;

        // Get the avilable days of the week from the merchant settings
        const { availability } = await queryContent(`/settings`).findOne()

        // Disable unavailable days of the week
        const unselectableDaysOfWeek = (!disabled) ? availability.reduce((arr, day, index) => {
          
          if (!day) arr.push(index);
          return arr;
        }, []) : [0,1,2,3,4,5,6];
      
        // Return the calendar settings object
        return {
          showWeekNumber,
          firstDayOfWeek,
          unselectableDaysOfWeek,
          minDate,
          modelValue
        }
      }
    }
  }
});
