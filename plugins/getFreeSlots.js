import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      getAvailableSlots: async ({ form, service, duration }) => {

        const selectedDate = form.value.bookingDate.toISOString().split('T')[0];

        // get some settings
        const {
          availability,
          concurrency
        } = await queryContent(`/settings`).findOne();

          // Get busy slots from Google Calendar
          const { data: getBusySlots } = await useFetch(`/api/google/events?date=${selectedDate}`);
          const busySlots = getBusySlots.value;


        // 1. Parse the selectedDate as a UTC date.
        // Append "T00:00:00.000Z" to ensure we are working in UTC.
        const day = new Date(selectedDate + "T00:00:00.000Z");
        const dayOfWeek = day.getUTCDay(); // Sunday = 0, Monday = 1, etc.
      
        // 2. Get the availability for that day.
        const dayAvailability = availability[dayOfWeek];
        if (!dayAvailability) {
          // If no availability is set for that day, return an empty array.
          return [];
        }
      
        // 3. Build the start and end Date objects for the availability window.
        // These hours are given in UTC.
        const pad = num => String(num).padStart(2, '0');
        const startTime = new Date(selectedDate + "T" + pad(dayAvailability.from) + ":00:00.000Z");
        const endTime = new Date(selectedDate + "T" + pad(dayAvailability.to) + ":00:00.000Z");
      
        // 4. Create candidate slots by stepping in increments equal to the duration.
        const candidateSlots = [];
        for (
          let slotTime = startTime.getTime();
          slotTime + duration * 60000 <= endTime.getTime();
          slotTime += duration * 60000
        ) {
          candidateSlots.push({
            start: new Date(slotTime),
            end: new Date(slotTime + duration * 60000)
          });
        }
      
        // 5. Filter out slots that overlap with busy slots.
        // For "parallel" concurrency, only consider busy slots whose service matches the given one.
        const filteredSlots = candidateSlots.filter(slot => {
          return !busySlots.some(busy => {
            // Only consider busy slots on the same date.
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            const busyDate = busyStart.toISOString().split('T')[0];
            if (busyDate !== selectedDate) return false;
            // For parallel concurrency, ignore busy slots whose service does not match.
            if (concurrency === "parallel" && busy.service !== service) return false;
            // Overlap if busy slot starts before the candidate slot ends and ends after the candidate slot starts.
            return busyStart < slot.end && busyEnd > slot.start;
          });
        });
      
        // 6. Format the slots in the required output.
        // "value" is the slot's start time in UTC as an ISO string.
        // "display" times are formatted using the user's local time zone.
        const formatHHmm = date => {
          return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        };
      
        const result = filteredSlots.map(slot => ({
          display: {
            from: formatHHmm(slot.start),
            to: formatHHmm(slot.end)
          },
          value: slot.start.toISOString()
        }));

        console.log('result', result);
      
        return result;
      }
      
    }
  }
});
