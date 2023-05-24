export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      // Get the browser local time offset from UTC time
      getUTCOffset: () => -new Date().getTimezoneOffset() / 60, // +2 for Italy

      // Function to format epoch to easy readable string
      getFormattedTime: (epoch) => {

        const hours = new Date(epoch).toISOString().slice(11, 13).padStart(2, '0');
        const minutes = new Date(epoch).toISOString().slice(14, 16).padStart(2, '0');
        return `${hours}:${minutes}`;
      },

      // Function to get the slots range in the provided interval
      getSlotRange: (start, stop, step) => {

        return Array.from(
          { length: (stop - start) / step + 1 },
          (value, index) => start + index * step
        )
      }
    }
  }
});
