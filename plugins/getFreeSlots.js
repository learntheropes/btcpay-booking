import { defineNuxtPlugin } from '#app';
import find from 'lodash.find'
import { defaultLocale } from '~/assets/js/locales'

export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {

      getFreeSlots: async ({ form, service, duration }) => {

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

        // Get existing _bookings from content json file
        // With direct fetch api because there is a bug with queryContent
        // That always add .sort({ $numeric: true }) even if not asked.
        // await queryContent(`/bookings`).locale('en').findOne()
        const [{ all: bookings }] = await $fetch(`/api/_content/query?_params=` + JSON.stringify({
          where: [{
            _partial: true,
            _locale: defaultLocale,
            _path: '/_bookings',
            _dir: ''
          }]
        }))

        // Functiion to get the free slots in case of parallel concurrency
        const getFreeParallelSlots = (bookings, slot) => {
          return !find(bookings,  booking => {
            return booking.service === service &&
            ((slot.from >= booking.from && slot.from < booking.to) ||
            (slot.to > booking.from && slot.to <= booking.to))
          })
        }

        // Functiion to get the free slots in case of (default) serial concurrency
        const getFreeSerialSlot = (bookings, slot) => {
          return !find(bookings,  booking => {
            return ((slot.from >= booking.from && slot.from < booking.to) ||
            (slot.to > booking.from && slot.to <= booking.to))
          })
        }

        // Filter out the already booked slots
        const getFreeSlots = (availableSlots) => {

          // Return the not booked slots
          // Serial concurrency is default
          if (concurrency === 'parallel') return availableSlots.filter(getFreeParallelSlots(bookings, slot.value))
          else return availableSlots.filter(slot => getFreeSerialSlot(bookings, slot.value))
        }

        const localBuyerDate = getLocalBuyerDate();
        const availableSlots = getAvailableSlots(localBuyerDate);
        const freeSlots = getFreeSlots(availableSlots)

        return freeSlots;
      }
    }
  }
})