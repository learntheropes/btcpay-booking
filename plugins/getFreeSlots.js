import { defineNuxtPlugin } from '#app';
import find from 'lodash.find'
import flatten from 'lodash.flatten'

export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {

      getFreeSlots: async ({ form, service, duration }) => {

        // Set the component as loading
        nuxtApp.$event('setIsLoadingFreeSlots', true);

        // Get availability and concurrency from general settings from yaml file
        const {
          availability,
          concurrency
        } = await queryContent(`/settings`).findOne()

        const getFormattedLocalSlot = (step) => {
        
          const utcOffsetHours = nuxtApp.$getUTCOffset();

          const fromLocalTime = new Date().setTime(new Date(step).getTime() + (utcOffsetHours * 60 * 60 * 1000));
          const toLocalTime = new Date().setTime(new Date(step).getTime() + (duration * 60 * 1000) + (utcOffsetHours * 60 * 60 * 1000));

          return {
            from: nuxtApp.$getFormattedTime(fromLocalTime),
            to: nuxtApp.$getFormattedTime(toLocalTime)
          }
        };

        // Get the selected date in buyer local time
        const getLocalBuyerDate = () => {

          const utcOffsetHours = nuxtApp.$getUTCOffset();

          if (form.value.buyerDate instanceof Date) {

            const epoch = new Date().setTime(form.value.buyerDate.getTime() + (utcOffsetHours * 60 * 60 * 1000));
            return new Date(epoch);
          }
          return null;
        };
        
        // Main function to get the slots given the choosen day
        const getAvailableSlots = (localBuyerDate) => {

          if (localBuyerDate instanceof Date) {
            
            const dayOfWeek = localBuyerDate.getDay();
            const { from, to } = availability[dayOfWeek];
            const start = new Date(localBuyerDate).setUTCHours(from);
            const end = new Date(localBuyerDate).setUTCHours(to);

            const epochSteps = nuxtApp.$getSlotRange(start, end, duration * 60 * 1000);

            return epochSteps.map(step => {
              return {
                display: getFormattedLocalSlot(step),
                value: new Date(step).toISOString()
              }
            });
          }
          return [];
        };

        // Get the paid invoice to extract the busy slots.
        const { data} = await useFetch('/api/invoices');
        const invoices = data.value;

        // Filter the invoice that have been paid
        const paidInvoices = invoices.filter(({ status }) => status === 'Settled');

        // Extract the service name and the start time of the booking
        const busySlots = flatten(paidInvoices.map(({ metadata: { buyerService, buyerTime }}) => buyerTime.map(time => {
          return {
            from: new Date(parseInt(time * 1000)).toISOString(),
            to: new Date(parseInt(time * 1000 + parseInt(duration * 60 * 1000))).toISOString(),
            service: buyerService
          }
        })));

        // Functiion to get the free slots in case of parallel concurrency
        const getFreeParallelSlots = (busySlots, slot) => {

          return !find(busySlots,  busySlot => {

            return busySlot.service === service && (slot >= busySlot.from && slot < busySlot.to);
          });
        };

        // Functiion to get the free slots in case of (default) serial concurrency
        const getFreeSerialSlot = (busySlots, slot) => {

          return !find(busySlots,  busySlot => {

            return ((slot >= busySlot.from && slot < busySlot.to));
          });
        };

        // Filter out the already booked slots
        // Serial concurrency is default
        const getFreeSlots = (availableSlots) => {

          if (concurrency === 'parallel') return availableSlots.filter(getFreeParallelSlots(busySlots, slot.value))
          else return availableSlots.filter(slot => getFreeSerialSlot(busySlots, slot.value))
        }

        const localBuyerDate = getLocalBuyerDate();
        const availableSlots = getAvailableSlots(localBuyerDate);
        const freeSlots = getFreeSlots(availableSlots);

        // Set the component as lnot oading
        nuxtApp.$event('setIsLoadingFreeSlots', false);

        return freeSlots;
      }
    }
  }
});
