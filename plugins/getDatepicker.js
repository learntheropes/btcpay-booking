import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      getDatepicker: async () => {

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
        const unselectableDaysOfWeek = availability.reduce((arr, day, index) => {
          
          if (!day) arr.push(index);
          return arr;
        }, []);
      
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
