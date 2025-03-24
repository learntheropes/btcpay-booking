import { useNitroApp } from '#nitro'

export const addGoogleCalendarEvent = async (event) => {

  const nitroApp = useNitroApp();
  const calendar = nitroApp.calendar;

  const { googleBookingCalendarId } = useRuntimeConfig();

  const { start, end, summary, description, location, attendees } = event;

  const calendarEvent = {
    start: {
      dateTime: start,
      timeZone: 'UTC',
    },
    end: {
      dateTime: end,
      timeZone: 'UTC',
    },
    summary,
    description,
    location,
    attendees,
  };

  try {
    const response = await calendar.events.insert({
      calendarId: googleBookingCalendarId,
      requestBody: calendarEvent,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
}
