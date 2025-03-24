import { useNitroApp } from '#nitro'

export const getGoogleCalendarsEvent = async event => {
  const nitroApp = useNitroApp();
  const calendar = nitroApp.calendar;

  const { 
    googlePesonalCalendarIds,
    googleBookingCalendarId
   } = useRuntimeConfig();

  // Get all the involved calendar in one array
  const calendars = googlePesonalCalendarIds 
    ? [...googlePesonalCalendarIds.split(','), googleBookingCalendarId]
    : [googleBookingCalendarId];

  // Parse query string: e.g., /api/google/events?date=2025-03-25
  const url = getRequestURL(event);
  // A simple way to get the "date" param:
  const dayString = url.href.split('?')[1].replace('date=', '');

  // Define time range: we use the day before and the day after the given date
  // so that we include all events for that day
  const timeMin = new Date(dayString);
  timeMin.setDate(timeMin.getDate() - 1);
  const timeMax = new Date(dayString);
  timeMax.setDate(timeMax.getDate() + 1);

  const allEvents = [];

  // Loop through each calendar and fetch events
  for (const calendarId of calendars) {
    try {
      const res = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,    // Expand recurring events
        orderBy: 'startTime',   // Sort by start time
      });
      if (res.data.items) {
        allEvents.push(...res.data.items);
      }
    } catch (err) {
      console.error(`Error fetching events for calendar "${calendarId}":`, err);
    }
  }

  // Sort all events by their start time
  allEvents.sort((a, b) => {
    const startA = new Date(a.start?.dateTime || a.start?.date).getTime();
    const startB = new Date(b.start?.dateTime || b.start?.date).getTime();
    return startA - startB;
  });

  // Map over the events and convert start and end times to UTC
  const cleanedEvents = allEvents.map(ev => {
    const startStr = ev.start.dateTime || ev.start.date;
    const endStr = ev.end.dateTime || ev.end.date;
    // Convert to a Date and then to an ISO string in UTC
    const startUTC = new Date(startStr).toISOString();
    const endUTC = new Date(endStr).toISOString();

    return { start: startUTC, end: endUTC, service: ev.summary };
  });

  return cleanedEvents;
}
